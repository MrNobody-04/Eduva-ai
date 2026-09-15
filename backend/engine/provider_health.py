"""
EDUVA AI — Dedicated 5-Provider Health Check & Diagnostics Engine
Testing strictly the five configured runtime providers:
1. Gemini
2. Cerebras
3. Groq
4. OpenRouter
5. Ollama

Features:
- Lightweight, non-destructive pings (never exhausts quotas or stress-tests providers)
- Non-blocking concurrent execution (asyncio.gather with failure isolation)
- Strict status classification: CONNECTED, AUTH_FAILED, MODEL_UNAVAILABLE,
  PAYMENT_REQUIRED, RATE_LIMITED, NETWORK_ERROR, NOT_CONFIGURED, TIMEOUT, PROVIDER_ERROR
- SSRF protection: Ollama host is strictly bound to server configuration
- Secret isolation: NEVER returns or logs API keys or sensitive authorization headers
- Cached diagnostics with TTL to prevent frontend polling from spamming APIs
"""

import os
import time
import asyncio
import datetime
import logging
from typing import Dict, Any, Optional, List
from urllib.parse import urlparse
import httpx
from dotenv import load_dotenv

from engine.gemini_service import global_gemini_service

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

logger = logging.getLogger("eduva.provider_health")

ALLOWED_PROVIDERS = ("gemini", "cerebras", "groq", "openrouter", "ollama")


class ProviderHealthService:
    def __init__(self, cache_ttl_seconds: float = 60.0):
        self.cache_ttl = cache_ttl_seconds
        self._last_checked: float = 0.0
        self._cached_results: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    def _sanitize_error_message(self, msg: str) -> str:
        """Removes potential secrets or keys from error messages."""
        if not msg:
            return ""
        keys = [
            os.getenv("GROQ_API_KEY", ""),
            os.getenv("CEREBRAS_API_KEY", ""),
            os.getenv("OPENROUTER_API_KEY", ""),
            os.getenv("GEMINI_API_KEY", ""),
            os.getenv("GEMINI_API_KEY_1", ""),
            os.getenv("GEMINI_API_KEY_2", "")
        ]
        sanitized = msg
        for k in keys:
            if k and len(k) > 6:
                sanitized = sanitized.replace(k, "[REDACTED_KEY]")
        return sanitized[:200]

    # -------------------------------------------------------------
    # 1. GEMINI HEALTH CHECK (via modern google-genai SDK)
    # -------------------------------------------------------------
    async def check_gemini(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        try:
            # Run in thread pool since SDK client is synchronous
            res = await asyncio.to_thread(global_gemini_service.check_health)
            return {
                "provider": "gemini",
                "status": res["status"],
                "model": res["model"],
                "latency_ms": res["latency_ms"],
                "checked_at": checked_at,
                "error_category": res["error_category"],
                "message": self._sanitize_error_message(res["message"]),
                "key_used": res.get("key_used")
            }
        except Exception as e:
            return {
                "provider": "gemini",
                "status": "PROVIDER_ERROR",
                "model": global_gemini_service.model_name,
                "latency_ms": 0.0,
                "checked_at": checked_at,
                "error_category": "PROVIDER_ERROR",
                "message": self._sanitize_error_message(str(e))
            }

    # -------------------------------------------------------------
    # 2. CEREBRAS HEALTH CHECK
    # -------------------------------------------------------------
    async def check_cerebras(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        api_key = os.getenv("CEREBRAS_API_KEY", "").strip()
        configured_model = os.getenv("CEREBRAS_MODEL", "").strip()

        if not api_key:
            return {
                "provider": "cerebras",
                "status": "NOT_CONFIGURED",
                "model": configured_model or "none",
                "latency_ms": 0.0,
                "checked_at": checked_at,
                "error_category": "NOT_CONFIGURED",
                "message": "CEREBRAS_API_KEY is not configured in environment"
            }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        t0 = time.time()
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                # 1. Model discovery via official Cerebras API
                r_models = await client.get("https://api.cerebras.ai/v1/models", headers=headers)
                
                if r_models.status_code in (401, 403):
                    return {
                        "provider": "cerebras",
                        "status": "AUTH_FAILED",
                        "model": configured_model or "unknown",
                        "latency_ms": round((time.time() - t0) * 1000.0, 1),
                        "checked_at": checked_at,
                        "error_category": "AUTH_FAILED",
                        "message": "Authentication failed: Invalid Cerebras API key"
                    }

                available_models = []
                if r_models.status_code == 200:
                    try:
                        m_data = r_models.json().get("data", [])
                        available_models = [m.get("id") for m in m_data if m.get("id")]
                    except Exception:
                        pass

                models_to_try = [configured_model] if configured_model else (available_models or ["llama3.1-8b", "llama-3.3-70b", "qwen-3.8-27b"])
                last_chat_res = None
                model_used = models_to_try[0]

                for mid in models_to_try:
                    model_used = mid
                    r_chat = await client.post(
                        "https://api.cerebras.ai/v1/chat/completions",
                        headers=headers,
                        json={
                            "model": mid,
                            "messages": [{"role": "user", "content": "Ping"}],
                            "max_tokens": 2,
                            "temperature": 0.0
                        }
                    )
                    last_chat_res = r_chat
                    if r_chat.status_code in (200, 402, 401, 403, 429):
                        break

                latency_ms = round((time.time() - t0) * 1000.0, 1)

                if last_chat_res and last_chat_res.status_code == 200:
                    return {
                        "provider": "cerebras",
                        "status": "CONNECTED",
                        "model": model_used,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": None,
                        "message": "Cerebras connected and inference responding"
                    }
                elif last_chat_res and last_chat_res.status_code == 402:
                    return {
                        "provider": "cerebras",
                        "status": "PAYMENT_REQUIRED",
                        "model": model_used,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "PAYMENT_REQUIRED",
                        "message": "Payment required: Cerebras account has zero active credits or requires billing activation"
                    }
                elif last_chat_res and last_chat_res.status_code == 404:
                    return {
                        "provider": "cerebras",
                        "status": "MODEL_UNAVAILABLE",
                        "model": model_used,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "MODEL_UNAVAILABLE",
                        "message": f"Configured model '{model_used}' is not accessible on this account tier"
                    }
                elif last_chat_res and last_chat_res.status_code == 429:
                    return {
                        "provider": "cerebras",
                        "status": "RATE_LIMITED",
                        "model": model_used,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "RATE_LIMITED",
                        "message": "Cerebras rate limit exceeded"
                    }
                else:
                    code = last_chat_res.status_code if last_chat_res else 500
                    return {
                        "provider": "cerebras",
                        "status": "PROVIDER_ERROR",
                        "model": model_used,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "PROVIDER_ERROR",
                        "message": f"Cerebras returned HTTP {code}"
                    }

        except httpx.TimeoutException:
            return {
                "provider": "cerebras",
                "status": "TIMEOUT",
                "model": configured_model or "llama3.1-8b",
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "TIMEOUT",
                "message": "Connection to Cerebras API timed out"
            }
        except httpx.RequestError as e:
            return {
                "provider": "cerebras",
                "status": "NETWORK_ERROR",
                "model": configured_model or "llama3.1-8b",
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "NETWORK_ERROR",
                "message": f"Network connectivity error to Cerebras: {self._sanitize_error_message(str(e))}"
            }

    # -------------------------------------------------------------
    # 3. GROQ HEALTH CHECK
    # -------------------------------------------------------------
    async def check_groq(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        configured_model = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b").strip()

        if not api_key:
            return {
                "provider": "groq",
                "status": "NOT_CONFIGURED",
                "model": configured_model,
                "latency_ms": 0.0,
                "checked_at": checked_at,
                "error_category": "NOT_CONFIGURED",
                "message": "GROQ_API_KEY is not configured in environment"
            }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        t0 = time.time()
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                r_chat = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": configured_model,
                        "messages": [{"role": "user", "content": "Ping"}],
                        "max_tokens": 2,
                        "temperature": 0.0
                    }
                )
                latency_ms = round((time.time() - t0) * 1000.0, 1)

                if r_chat.status_code == 200:
                    return {
                        "provider": "groq",
                        "status": "CONNECTED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": None,
                        "message": "Groq connected and responding"
                    }
                elif r_chat.status_code in (401, 403):
                    return {
                        "provider": "groq",
                        "status": "AUTH_FAILED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "AUTH_FAILED",
                        "message": "Authentication failed: Invalid Groq API key"
                    }
                elif r_chat.status_code == 404:
                    return {
                        "provider": "groq",
                        "status": "MODEL_UNAVAILABLE",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "MODEL_UNAVAILABLE",
                        "message": f"Configured Groq model '{configured_model}' not found"
                    }
                elif r_chat.status_code == 429:
                    return {
                        "provider": "groq",
                        "status": "RATE_LIMITED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "RATE_LIMITED",
                        "message": "Groq rate limit exceeded"
                    }
                else:
                    return {
                        "provider": "groq",
                        "status": "PROVIDER_ERROR",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "PROVIDER_ERROR",
                        "message": f"Groq returned HTTP {r_chat.status_code}"
                    }

        except httpx.TimeoutException:
            return {
                "provider": "groq",
                "status": "TIMEOUT",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "TIMEOUT",
                "message": "Connection to Groq API timed out"
            }
        except httpx.RequestError as e:
            return {
                "provider": "groq",
                "status": "NETWORK_ERROR",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "NETWORK_ERROR",
                "message": f"Network connectivity error to Groq: {self._sanitize_error_message(str(e))}"
            }

    # -------------------------------------------------------------
    # 4. OPENROUTER HEALTH CHECK
    # -------------------------------------------------------------
    async def check_openrouter(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
        configured_model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct").strip()

        if not api_key:
            return {
                "provider": "openrouter",
                "status": "NOT_CONFIGURED",
                "model": configured_model,
                "latency_ms": 0.0,
                "checked_at": checked_at,
                "error_category": "NOT_CONFIGURED",
                "message": "OPENROUTER_API_KEY is not configured in environment"
            }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://eduva.ai",
            "X-Title": "Eduva AI Higher Education Intelligence"
        }

        t0 = time.time()
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r_chat = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": configured_model,
                        "messages": [{"role": "user", "content": "Ping"}],
                        "max_tokens": 2,
                        "temperature": 0.0
                    }
                )
                latency_ms = round((time.time() - t0) * 1000.0, 1)

                if r_chat.status_code == 200:
                    return {
                        "provider": "openrouter",
                        "status": "CONNECTED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": None,
                        "message": "OpenRouter connected and responding"
                    }
                elif r_chat.status_code in (401, 403):
                    return {
                        "provider": "openrouter",
                        "status": "AUTH_FAILED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "AUTH_FAILED",
                        "message": "Authentication failed: Invalid OpenRouter API key"
                    }
                elif r_chat.status_code == 404:
                    return {
                        "provider": "openrouter",
                        "status": "MODEL_UNAVAILABLE",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "MODEL_UNAVAILABLE",
                        "message": f"Configured OpenRouter model '{configured_model}' is unavailable"
                    }
                elif r_chat.status_code == 429:
                    return {
                        "provider": "openrouter",
                        "status": "RATE_LIMITED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "RATE_LIMITED",
                        "message": "OpenRouter rate limit / credit limit reached"
                    }
                else:
                    return {
                        "provider": "openrouter",
                        "status": "PROVIDER_ERROR",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "PROVIDER_ERROR",
                        "message": f"OpenRouter returned HTTP {r_chat.status_code}"
                    }

        except httpx.TimeoutException:
            return {
                "provider": "openrouter",
                "status": "TIMEOUT",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "TIMEOUT",
                "message": "Connection to OpenRouter API timed out"
            }
        except httpx.RequestError as e:
            return {
                "provider": "openrouter",
                "status": "NETWORK_ERROR",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "NETWORK_ERROR",
                "message": f"Network connectivity error to OpenRouter: {self._sanitize_error_message(str(e))}"
            }

    # -------------------------------------------------------------
    # 5. OLLAMA HEALTH CHECK (Strict SSRF Protection)
    # -------------------------------------------------------------
    async def check_ollama(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        raw_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").strip()
        configured_model = os.getenv("OLLAMA_MODEL", "llama3").strip()

        # SSRF Security Validation: Ensure URL parsed from server configuration has http/https protocol
        parsed = urlparse(raw_base_url)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            return {
                "provider": "ollama",
                "status": "NOT_CONFIGURED",
                "model": configured_model,
                "latency_ms": 0.0,
                "checked_at": checked_at,
                "error_category": "NOT_CONFIGURED",
                "message": "Invalid OLLAMA_BASE_URL scheme or host in server configuration"
            }

        base_url = f"{parsed.scheme}://{parsed.netloc}".rstrip("/")

        t0 = time.time()
        try:
            # Short 3.0s timeout to never hang on local/remote offline daemon
            async with httpx.AsyncClient(timeout=3.0) as client:
                r_tags = await client.get(f"{base_url}/api/tags")
                latency_ms = round((time.time() - t0) * 1000.0, 1)

                if r_tags.status_code != 200:
                    return {
                        "provider": "ollama",
                        "status": "PROVIDER_ERROR",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "PROVIDER_ERROR",
                        "message": f"Ollama server returned HTTP {r_tags.status_code}"
                    }

                # Server is reachable! Check if configured model is pulled
                installed_models = []
                try:
                    models_json = r_tags.json().get("models", [])
                    installed_models = [m.get("name", "") for m in models_json]
                except Exception:
                    pass

                model_found = any(
                    configured_model in m or m.startswith(configured_model)
                    for m in installed_models
                )

                if not model_found:
                    return {
                        "provider": "ollama",
                        "status": "MODEL_UNAVAILABLE",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "MODEL_UNAVAILABLE",
                        "message": f"Ollama server is reachable, but model '{configured_model}' is not pulled (Available: {', '.join(installed_models[:3]) or 'none'})"
                    }

                return {
                    "provider": "ollama",
                    "status": "CONNECTED",
                    "model": configured_model,
                    "latency_ms": latency_ms,
                    "checked_at": checked_at,
                    "error_category": None,
                    "message": "Ollama server connected and model available"
                }

        except (httpx.ConnectError, httpx.ConnectTimeout):
            return {
                "provider": "ollama",
                "status": "NETWORK_ERROR",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "NETWORK_ERROR",
                "message": f"Ollama server unreachable at {base_url} (offline or daemon not running)"
            }
        except httpx.TimeoutException:
            return {
                "provider": "ollama",
                "status": "TIMEOUT",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "TIMEOUT",
                "message": "Connection to Ollama server timed out"
            }
        except Exception as e:
            return {
                "provider": "ollama",
                "status": "PROVIDER_ERROR",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "PROVIDER_ERROR",
                "message": f"Ollama health error: {self._sanitize_error_message(str(e))}"
            }

    # -------------------------------------------------------------
    # 6. RUN CONCURRENT 5-PROVIDER DIAGNOSTICS
    # -------------------------------------------------------------
    async def run_diagnostics(self, force: bool = False) -> Dict[str, Dict[str, Any]]:
        """
        Executes lightweight, concurrent health checks across all five providers.
        Thread-safe and cached via TTL to prevent excessive quota consumption.
        """
        async with self._lock:
            now = time.time()
            if not force and self._cached_results and (now - self._last_checked) < self.cache_ttl:
                return self._cached_results

            # Launch all 5 provider checks concurrently
            results = await asyncio.gather(
                self.check_gemini(),
                self.check_cerebras(),
                self.check_groq(),
                self.check_openrouter(),
                self.check_ollama(),
                return_exceptions=True
            )

            diag: Dict[str, Dict[str, Any]] = {}
            for p, res in zip(ALLOWED_PROVIDERS, results):
                if isinstance(res, Exception):
                    diag[p] = {
                        "provider": p,
                        "status": "PROVIDER_ERROR",
                        "model": "unknown",
                        "latency_ms": 0.0,
                        "checked_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        "error_category": "PROVIDER_ERROR",
                        "message": self._sanitize_error_message(str(res))
                    }
                else:
                    diag[p] = res

            self._cached_results = diag
            self._last_checked = now
            return diag

    def get_cached_diagnostics(self) -> Dict[str, Dict[str, Any]]:
        """Returns the most recent diagnostics from in-memory cache without hitting APIs."""
        if self._cached_results:
            return self._cached_results
        # If never checked, return fallback not-checked state
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return {
            p: {
                "provider": p,
                "status": "NOT_CHECKED",
                "model": "unknown",
                "latency_ms": 0.0,
                "checked_at": now_iso,
                "error_category": None,
                "message": "Health check has not yet been executed"
            }
            for p in ALLOWED_PROVIDERS
        }


global_provider_health = ProviderHealthService()
