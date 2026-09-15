"""
EDUVA AI - Intelligent Central AI Gateway
=========================================
Centralized multi-provider AI gateway with:
1. Capability-based dynamic provider routing across 5 providers:
   - Gemini (Deep research, long-context reasoning, multi-document analysis)
   - Cerebras (Verification, fact-checking, contradiction detection)
   - Groq (Realtime chat, classification, ultra-low-latency generation)
   - OpenRouter (Model diversity, secondary reasoning, experimental subtasks)
   - Ollama (Local private inference, batch processing, fallback)
2. Global and per-provider concurrency semaphores.
3. Sliding-window RPM/TPM tracking with 20% quota reserve for user-interactive/critical tasks.
4. Independent circuit breakers with half-open canary recovery.
5. Content deduplication via SHA-256 hash comparison.
6. Persistent usage logging to SQLite (provider_usage_log).
"""

import os
import time
import json
import hashlib
import asyncio
import logging
from typing import Dict, Any, Optional, List
import httpx
from dotenv import load_dotenv

from engine.db import global_db
from engine.gemini_service import GeminiService

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
logger = logging.getLogger("eduva.ai_gateway")


class CircuitBreaker:
    def __init__(self, name: str, failure_threshold: int = 3, recovery_timeout: float = 30.0):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.last_error = None

    def can_attempt(self) -> bool:
        if self.state == "CLOSED":
            return True
        now = time.time()
        if self.state == "OPEN":
            if now - self.last_failure_time >= self.recovery_timeout:
                self.state = "HALF_OPEN"
                logger.info(f"CircuitBreaker [{self.name}] entering HALF_OPEN recovery test.")
                return True
            return False
        # HALF_OPEN allows a single canary request
        return True

    def record_success(self):
        if self.state != "CLOSED":
            logger.info(f"CircuitBreaker [{self.name}] recovered to CLOSED state.")
        self.state = "CLOSED"
        self.failure_count = 0
        self.last_error = None

    def record_failure(self, error_msg: str, status_code: Optional[int] = None):
        self.failure_count += 1
        self.last_failure_time = time.time()
        self.last_error = error_msg
        
        # Immediate trip for quota exhaustion or hard payment required
        if status_code in (402, 429) or self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            logger.warning(
                f"CircuitBreaker [{self.name}] TRIPPED to OPEN state. Reason: {error_msg} (status: {status_code})"
            )


class SlidingRateTracker:
    def __init__(self, window_seconds: float = 60.0):
        self.window_seconds = window_seconds
        self.requests: List[float] = []
        self.tokens: List[tuple[float, int]] = []
        self._lock = asyncio.Lock()

    async def record(self, token_count: int = 0):
        now = time.time()
        async with self._lock:
            self.requests.append(now)
            self.tokens.append((now, token_count))
            self._prune(now)

    def _prune(self, now: float):
        cutoff = now - self.window_seconds
        self.requests = [t for t in self.requests if t > cutoff]
        self.tokens = [item for item in self.tokens if item[0] > cutoff]

    async def get_metrics(self) -> tuple[int, int]:
        now = time.time()
        async with self._lock:
            self._prune(now)
            rpm = len(self.requests)
            tpm = sum(item[1] for item in self.tokens)
            return rpm, tpm


class AIGateway:
    def __init__(self):
        # Concurrency Configuration
        self.max_global_concurrency = int(os.getenv("AI_MAX_GLOBAL_CONCURRENCY", "20"))
        self.quota_reserve_pct = int(os.getenv("AI_QUOTA_RESERVE_PERCENT", "20"))
        
        self.global_semaphore = asyncio.Semaphore(self.max_global_concurrency)
        
        self.semaphores = {
            "gemini": asyncio.Semaphore(int(os.getenv("GEMINI_MAX_CONCURRENCY", "5"))),
            "cerebras": asyncio.Semaphore(int(os.getenv("CEREBRAS_MAX_CONCURRENCY", "5"))),
            "groq": asyncio.Semaphore(int(os.getenv("GROQ_MAX_CONCURRENCY", "10"))),
            "openrouter": asyncio.Semaphore(int(os.getenv("OPENROUTER_MAX_CONCURRENCY", "3"))),
            "ollama": asyncio.Semaphore(int(os.getenv("OLLAMA_MAX_CONCURRENCY", "2"))),
        }

        # Concurrency Limits Reference
        self.concurrency_limits = {
            "gemini": int(os.getenv("GEMINI_MAX_CONCURRENCY", "5")),
            "cerebras": int(os.getenv("CEREBRAS_MAX_CONCURRENCY", "5")),
            "groq": int(os.getenv("GROQ_MAX_CONCURRENCY", "10")),
            "openrouter": int(os.getenv("OPENROUTER_MAX_CONCURRENCY", "3")),
            "ollama": int(os.getenv("OLLAMA_MAX_CONCURRENCY", "2")),
        }

        # Estimated RPM Limits for Quota Protection
        self.rpm_limits = {
            "gemini": 60,
            "cerebras": 60,
            "groq": 100,
            "openrouter": 30,
            "ollama": 20,
        }

        # Circuit Breakers
        self.circuit_breakers = {
            "gemini": CircuitBreaker("gemini"),
            "cerebras": CircuitBreaker("cerebras", failure_threshold=2, recovery_timeout=60.0),
            "groq": CircuitBreaker("groq"),
            "openrouter": CircuitBreaker("openrouter"),
            "ollama": CircuitBreaker("ollama", failure_threshold=2, recovery_timeout=45.0),
        }

        # Rate Trackers
        self.rate_trackers = {p: SlidingRateTracker() for p in self.semaphores}

        # API Keys & Endpoints
        self.groq_api_key = os.getenv("GROQ_API_KEY", "")
        self.cerebras_api_key = os.getenv("CEREBRAS_API_KEY", "")
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

        # Underlying Gemini Service
        self.gemini_service = GeminiService()

        # Preferred Models per Provider (dynamically configurable with verified fallbacks)
        cerebras_env_model = os.getenv("CEREBRAS_MODEL", "").strip()
        cerebras_candidates = [cerebras_env_model] if cerebras_env_model else []
        for m in ["llama3.1-8b", "llama-3.3-70b", "qwen-3.8-27b", "gpt-oss-120b"]:
            if m not in cerebras_candidates:
                cerebras_candidates.append(m)

        self.provider_models = {
            "groq": [os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b"), "groq/compound-mini", "openai/gpt-oss-120b"],
            "cerebras": cerebras_candidates,
            "openrouter": [os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct"), "google/gemini-2.0-flash-exp:free"],
            "gemini": [os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), "gemini-flash-latest"],
            "ollama": [os.getenv("OLLAMA_MODEL", "llama3"), "mistral"]
        }

        # Capability Routing Matrix
        self.capability_matrix = {
            # Real-time and low latency tasks
            "REALTIME_CHAT": ["groq", "gemini", "openrouter"],
            "INTENT_CLASSIFICATION": ["groq", "cerebras", "gemini"],
            "QUERY_CLASSIFICATION": ["groq", "cerebras", "gemini"],
            "NEWS_CLASSIFICATION": ["groq", "cerebras", "gemini"],
            "SAFETY_CLASSIFICATION": ["groq", "cerebras", "gemini"],
            "NOTIFICATION_GENERATION": ["groq", "gemini", "cerebras"],
            "SHORT_SUMMARY": ["groq", "gemini", "cerebras"],
            "FAST_EXTRACTION": ["groq", "cerebras", "gemini"],
            
            # Fast verification & precision fact-checking
            "VERIFICATION": ["cerebras", "gemini", "openrouter", "groq"],
            "SECOND_OPINION": ["cerebras", "openrouter", "gemini"],
            "FACT_EXTRACTION": ["cerebras", "groq", "gemini"],
            "CONTRADICTION_DETECTION": ["cerebras", "gemini", "groq"],
            "DOCUMENT_SUMMARY": ["cerebras", "gemini", "groq"],
            "STRUCTURED_EXTRACTION": ["cerebras", "gemini", "groq"],
            "RESEARCH_SUBTASK": ["cerebras", "openrouter", "gemini"],
            
            # Deep reasoning and long-context analysis
            "DEEP_RESEARCH": ["gemini", "openrouter", "cerebras"],
            "UNIVERSITY_RESEARCH": ["gemini", "openrouter", "cerebras"],
            "ADMISSION_ANALYSIS": ["gemini", "cerebras", "groq"],
            "SCHOLARSHIP_ANALYSIS": ["gemini", "cerebras", "groq"],
            "DOCUMENT_ANALYSIS": ["gemini", "cerebras", "groq"],
            "LONG_CONTEXT": ["gemini", "openrouter", "cerebras"],
            "COMPLEX_REASONING": ["gemini", "cerebras", "groq"],
            "SOP_ANALYSIS": ["gemini", "cerebras", "groq"],
            "COURSE_ANALYSIS": ["gemini", "cerebras", "groq"],
            "ELIGIBILITY_ANALYSIS": ["gemini", "cerebras", "groq"],
            
            # Diversity and experimental
            "MODEL_DIVERSITY": ["openrouter", "gemini", "cerebras"],
            "EXPERIMENTAL_RESEARCH": ["openrouter", "gemini", "cerebras"],
            "LOCAL_PROCESSING": ["ollama", "groq", "gemini"],
        }

        # Default fallback chain
        self.default_chain = ["groq", "gemini", "openrouter", "cerebras", "ollama"]

        # Track active requests for live telemetry
        self.active_requests = {p: 0 for p in self.semaphores}

    def _hash_payload(self, text: str, source_uri: Optional[str] = None) -> str:
        s = f"{source_uri or ''}:{text.strip()}"
        return hashlib.sha256(s.encode("utf-8")).hexdigest()

    async def _check_cache(self, hash_key: str) -> Optional[Dict[str, Any]]:
        cached = global_db.get_content_cache(hash_key)
        if cached and cached.get("cached_result"):
            return cached["cached_result"]
        return None

    def select_candidate_providers(
        self,
        task_type: str,
        preferred_provider: Optional[str] = None,
        priority: str = "NORMAL"
    ) -> List[str]:
        """
        Determines the ordered list of candidate providers respecting circuit breakers
        and quota reserves.
        """
        candidates = []
        if preferred_provider and preferred_provider in self.semaphores:
            candidates.append(preferred_provider)

        matrix_providers = self.capability_matrix.get(task_type.upper(), self.default_chain)
        for p in matrix_providers:
            if p not in candidates:
                candidates.append(p)

        # Append remaining known providers
        for p in self.default_chain:
            if p not in candidates:
                candidates.append(p)

        # Filter candidates based on circuit breaker & quota headroom
        healthy_candidates = []
        for p in candidates:
            cb = self.circuit_breakers[p]
            if not cb.can_attempt():
                continue

            # If Ollama has no local server running, skip quickly unless explicitly requested
            if p == "ollama" and preferred_provider != "ollama":
                continue

            healthy_candidates.append(p)

        return healthy_candidates if healthy_candidates else candidates

    async def _call_gemini(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        t0 = time.time()
        
        def _invoke():
            return self.gemini_service.generate_chat_response(
                user_query=prompt,
                system_instruction=system_prompt,
                max_tokens=max_tokens,
                temperature=temperature
            )

        resp = await asyncio.to_thread(_invoke)
        latency = (time.time() - t0) * 1000.0

        if not resp.get("success"):
            raise RuntimeError(resp.get("error", "Gemini call failed"))

        text = resp.get("text", "")
        # Estimate token usage
        prompt_tokens = len(prompt.split()) * 2
        comp_tokens = len(text.split()) * 2

        return {
            "content": text,
            "provider": "gemini",
            "model": self.gemini_service.model_name,
            "tokens_prompt": prompt_tokens,
            "tokens_completion": comp_tokens,
            "latency_ms": latency
        }

    async def _call_openai_compatible(
        self,
        provider: str,
        url: str,
        api_key: str,
        models: List[str],
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
        extra_headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        if extra_headers:
            headers.update(extra_headers)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        last_err = None
        for model in models:
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature
            }
            t0 = time.time()
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(url, headers=headers, json=payload)
                    latency = (time.time() - t0) * 1000.0
                    
                    if resp.status_code == 200:
                        data = resp.json()
                        choices = data.get("choices", [])
                        if choices:
                            content = choices[0].get("message", {}).get("content", "")
                            usage = data.get("usage", {})
                            return {
                                "content": content,
                                "provider": provider,
                                "model": model,
                                "tokens_prompt": usage.get("prompt_tokens", len(prompt.split()) * 2),
                                "tokens_completion": usage.get("completion_tokens", len(content.split()) * 2),
                                "latency_ms": latency
                            }
                    # If error response
                    err_msg = f"{resp.status_code} {resp.text}"
                    last_err = (err_msg, resp.status_code)
                    if resp.status_code in (402, 404, 429):
                        # Break model loop if quota or model unavailable
                        continue
            except Exception as e:
                last_err = (str(e), None)
                continue

        error_desc = last_err[0] if last_err else "All models failed"
        status_code = last_err[1] if last_err else None
        err = RuntimeError(f"[{provider}] API error: {error_desc}")
        err.status_code = status_code
        raise err

    async def _call_ollama(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        url = f"{self.ollama_base_url}/api/chat"
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        t0 = time.time()
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    url,
                    json={
                        "model": "llama3",
                        "messages": messages,
                        "stream": False,
                        "options": {"temperature": temperature, "num_predict": max_tokens}
                    }
                )
                latency = (time.time() - t0) * 1000.0
                if resp.status_code == 200:
                    data = resp.json()
                    content = data.get("message", {}).get("content", "")
                    return {
                        "content": content,
                        "provider": "ollama",
                        "model": "llama3",
                        "tokens_prompt": data.get("prompt_eval_count", 0),
                        "tokens_completion": data.get("eval_count", 0),
                        "latency_ms": latency
                    }
                raise RuntimeError(f"Ollama returned {resp.status_code}: {resp.text}")
        except Exception as e:
            err = RuntimeError(f"[ollama] Offline or unreachable: {e}")
            err.status_code = 503
            raise err

    async def _execute_provider(
        self,
        provider: str,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        if provider == "gemini":
            return await self._call_gemini(prompt, system_prompt, max_tokens, temperature)
        elif provider == "groq":
            return await self._call_openai_compatible(
                provider="groq",
                url="https://api.groq.com/openai/v1/chat/completions",
                api_key=self.groq_api_key,
                models=self.provider_models["groq"],
                prompt=prompt,
                system_prompt=system_prompt,
                max_tokens=max_tokens,
                temperature=temperature
            )
        elif provider == "cerebras":
            return await self._call_openai_compatible(
                provider="cerebras",
                url="https://api.cerebras.ai/v1/chat/completions",
                api_key=self.cerebras_api_key,
                models=self.provider_models["cerebras"],
                prompt=prompt,
                system_prompt=system_prompt,
                max_tokens=max_tokens,
                temperature=temperature
            )
        elif provider == "openrouter":
            return await self._call_openai_compatible(
                provider="openrouter",
                url="https://openrouter.ai/api/v1/chat/completions",
                api_key=self.openrouter_api_key,
                models=self.provider_models["openrouter"],
                prompt=prompt,
                system_prompt=system_prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                extra_headers={"HTTP-Referer": "https://eduva.ai", "X-Title": "Eduva AI"}
            )
        elif provider == "ollama":
            return await self._call_ollama(prompt, system_prompt, max_tokens, temperature)
        else:
            raise ValueError(f"Unknown provider: {provider}")

    def evaluate_quota_tier(self, provider: str, current_rpm: int) -> str:
        """
        Evaluates the quota policy tier based on current sliding RPM against provider limits:
        0–70%:   NORMAL (all admitted)
        70–80%:  CAUTIOUS (all admitted, monitored)
        80–90%:  BACKGROUND_THROTTLING (background & experimental shed)
        90–95%:  HIGH_CRITICAL_ONLY (only high, user_interactive, critical)
        > 95%:   EMERGENCY_PROTECTION (only critical admitted)
        """
        limit = self.rpm_limits.get(provider, 60)
        ratio = current_rpm / max(1, limit)
        if ratio < 0.70:
            return "NORMAL"
        elif ratio < 0.80:
            return "CAUTIOUS"
        elif ratio < 0.90:
            return "BACKGROUND_THROTTLING"
        elif ratio <= 0.95:
            return "HIGH_CRITICAL_ONLY"
        else:
            return "EMERGENCY_PROTECTION"

    async def _check_quota_admission(self, provider: str, priority: str) -> bool:
        rpm, _ = await self.rate_trackers[provider].get_metrics()
        tier = self.evaluate_quota_tier(provider, rpm)
        prio = priority.upper()
        
        if tier == "EMERGENCY_PROTECTION":
            return prio == "CRITICAL"
        elif tier == "HIGH_CRITICAL_ONLY":
            return prio in ("CRITICAL", "USER_INTERACTIVE")
        elif tier == "BACKGROUND_THROTTLING":
            return prio not in ("BACKGROUND", "EXPERIMENTAL")
        return True

    async def execute(
        self,
        task_type: str,
        prompt: str,
        system_prompt: Optional[str] = None,
        priority: str = "NORMAL",
        max_tokens: int = 1024,
        temperature: float = 0.3,
        preferred_provider: Optional[str] = None,
        source_uri: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Main entrypoint for all agents. Never blocks sequentially.
        Enforces deduplication, priority queue rules, circuit breakers, and automatic failovers.
        """
        # 1. Deduplication Cache Check
        hash_key = self._hash_payload(prompt, source_uri)
        cached_result = await self._check_cache(hash_key)
        if cached_result:
            return {
                **cached_result,
                "cached": True,
                "latency_ms": 0.0
            }

        candidates = self.select_candidate_providers(task_type, preferred_provider, priority)
        last_error = None

        # Concurrency & Execution Loop across Candidates
        async with self.global_semaphore:
            for provider in candidates:
                cb = self.circuit_breakers[provider]
                if not cb.can_attempt():
                    continue

                # Quota Headroom & Tier Admission Check
                if not await self._check_quota_admission(provider, priority):
                    logger.warning(
                        f"Provider [{provider}] quota tier restricted for priority {priority}. Checking alternate provider."
                    )
                    continue

                # Acquire per-provider semaphore with non-blocking try or bounded wait
                try:
                    async with self.semaphores[provider]:
                        self.active_requests[provider] += 1
                        try:
                            res = await self._execute_provider(
                                provider, prompt, system_prompt, max_tokens, temperature
                            )
                            # Record Success
                            cb.record_success()
                            await self.rate_trackers[provider].record(
                                res.get("tokens_prompt", 0) + res.get("tokens_completion", 0)
                            )
                            
                            # Log Telemetry
                            global_db.log_provider_usage(
                                provider=provider,
                                model=res.get("model", "unknown"),
                                task_type=task_type,
                                tokens_prompt=res.get("tokens_prompt", 0),
                                tokens_completion=res.get("tokens_completion", 0),
                                latency_ms=res.get("latency_ms", 0.0),
                                status="SUCCESS"
                            )

                            # Populate Deduplication Cache
                            if source_uri or len(prompt) >= 10:
                                global_db.set_content_cache(
                                    hash_key=hash_key,
                                    source_uri=source_uri or "prompt",
                                    last_sha256=hash_key,
                                    cached_result=res
                                )

                            res["cached"] = False
                            return res

                        except Exception as e:
                            status_code = getattr(e, "status_code", None)
                            cb.record_failure(str(e), status_code=status_code)
                            global_db.log_provider_usage(
                                provider=provider,
                                model="error",
                                task_type=task_type,
                                tokens_prompt=0,
                                tokens_completion=0,
                                latency_ms=0.0,
                                status=f"FAIL: {str(e)[:100]}"
                            )
                            last_error = e
                            logger.warning(f"Provider [{provider}] failed: {e}. Attempting failover...")
                        finally:
                            self.active_requests[provider] = max(0, self.active_requests[provider] - 1)

                except Exception as ex:
                    last_error = ex
                    continue

        # If all candidates fail, raise clean error
        raise RuntimeError(
            f"AI Gateway failed across all candidate providers {candidates}. Last error: {last_error}"
        )

    async def get_providers_status(self) -> Dict[str, Any]:
        """
        Returns real-time health, quota, and circuit status for all 5 providers.
        """
        summary = {}
        for p in self.semaphores:
            rpm, tpm = await self.rate_trackers[p].get_metrics()
            cb = self.circuit_breakers[p]
            
            # Determine provider status label
            if cb.state == "OPEN":
                status = "CIRCUIT_OPEN"
            elif cb.state == "HALF_OPEN":
                status = "RECOVERING"
            elif p == "ollama" and cb.failure_count > 0:
                status = "OFFLINE"
            else:
                status = "HEALTHY"

            summary[p] = {
                "status": status,
                "circuit_state": cb.state,
                "quota_tier": self.evaluate_quota_tier(p, rpm),
                "current_rpm": rpm,
                "current_tpm": tpm,
                "rpm_limit": self.rpm_limits.get(p, 60),
                "active_requests": self.active_requests.get(p, 0),
                "concurrency_limit": self.concurrency_limits.get(p, 5),
                "consecutive_failures": cb.failure_count,
                "last_error": cb.last_error
            }
        return summary


# Global Singleton AI Gateway Instance
global_ai_gateway = AIGateway()
