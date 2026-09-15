"""
EDUVA AI — Dedicated 4-Provider Health Check & Diagnostics Engine
Testing strictly the four configured runtime providers:
1. Gemini (Deep Logic & Long Context)
2. Groq (Ultra-low latency inference & Classification)
3. OpenRouter (Model diversity & Fallback)
4. Cloudflare Workers AI (Verification & Fast Edge Inference)

Features:
- Lightweight, non-destructive pings (never exhausts quotas or stress-tests providers)
- Non-blocking concurrent execution (asyncio.gather with failure isolation)
- Strict status classification: CONNECTED, AUTH_FAILED, MODEL_UNAVAILABLE,
  PAYMENT_REQUIRED, RATE_LIMITED, NETWORK_ERROR, NOT_CONFIGURED, TIMEOUT, PROVIDER_ERROR
- Secret isolation: NEVER returns or logs API keys or sensitive authorization tokens
- Cached diagnostics with TTL to prevent frontend polling from spamming APIs
"""

import os
import time
import asyncio
import datetime
import logging
from typing import Dict, Any, Optional, List
import httpx
from dotenv import load_dotenv

from engine.gemini_service import global_gemini_service

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

logger = logging.getLogger("eduva.provider_health")

ALLOWED_PROVIDERS = ("gemini", "groq", "openrouter", "cloudflare")


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
            os.getenv("OPENROUTER_API_KEY", ""),
            os.getenv("GEMINI_API_KEY", ""),
            os.getenv("GEMINI_API_KEY_1", ""),
            os.getenv("GEMINI_API_KEY_2", ""),
            os.getenv("CLOUDFLARE_API_TOKEN", ""),
            os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
        ]
        sanitized = msg
        for k in keys:
            if k and len(k) > 6:
                sanitized = sanitized.replace(k, "[REDACTED_SECRET]")
        return sanitized[:200]

    # -------------------------------------------------------------
    # 1. GEMINI HEALTH CHECK (via modern google-genai SDK)
    # -------------------------------------------------------------
    async def check_gemini(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        try:
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
    # 2. GROQ HEALTH CHECK
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
                        "message": "Groq connected and inference responding"
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
                        "message": f"Configured Groq model '{configured_model}' is unavailable"
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
    # 3. OPENROUTER HEALTH CHECK
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
            "X-Title": "Eduva AI"
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
    # 4. CLOUDFLARE WORKERS AI HEALTH CHECK
    # -------------------------------------------------------------
    async def check_cloudflare(self) -> Dict[str, Any]:
        checked_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
        api_token = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
        configured_model = os.getenv("CLOUDFLARE_MODEL", "@cf/meta/llama-3.1-8b-instruct").strip()

        if not account_id or not api_token:
            return {
                "provider": "cloudflare",
                "status": "NOT_CONFIGURED",
                "model": configured_model,
                "latency_ms": 0.0,
                "checked_at": checked_at,
                "error_category": "NOT_CONFIGURED",
                "message": "CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN is not configured"
            }

        url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{configured_model}"
        headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }

        t0 = time.time()
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r_chat = await client.post(
                    url,
                    headers=headers,
                    json={
                        "messages": [{"role": "user", "content": "Ping"}],
                        "max_tokens": 2
                    }
                )
                latency_ms = round((time.time() - t0) * 1000.0, 1)

                if r_chat.status_code == 200:
                    return {
                        "provider": "cloudflare",
                        "status": "CONNECTED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": None,
                        "message": "Cloudflare Workers AI connected and responding"
                    }
                elif r_chat.status_code in (401, 403):
                    return {
                        "provider": "cloudflare",
                        "status": "AUTH_FAILED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "AUTH_FAILED",
                        "message": "Authentication failed: Invalid Cloudflare API token or Account ID"
                    }
                elif r_chat.status_code == 404:
                    return {
                        "provider": "cloudflare",
                        "status": "MODEL_UNAVAILABLE",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "MODEL_UNAVAILABLE",
                        "message": f"Configured Cloudflare model '{configured_model}' is not found"
                    }
                elif r_chat.status_code == 429:
                    return {
                        "provider": "cloudflare",
                        "status": "RATE_LIMITED",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "RATE_LIMITED",
                        "message": "Cloudflare Workers AI rate limit reached"
                    }
                else:
                    return {
                        "provider": "cloudflare",
                        "status": "PROVIDER_ERROR",
                        "model": configured_model,
                        "latency_ms": latency_ms,
                        "checked_at": checked_at,
                        "error_category": "PROVIDER_ERROR",
                        "message": f"Cloudflare returned HTTP {r_chat.status_code}"
                    }

        except httpx.TimeoutException:
            return {
                "provider": "cloudflare",
                "status": "TIMEOUT",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "TIMEOUT",
                "message": "Connection to Cloudflare Workers AI timed out"
            }
        except httpx.RequestError as e:
            return {
                "provider": "cloudflare",
                "status": "NETWORK_ERROR",
                "model": configured_model,
                "latency_ms": round((time.time() - t0) * 1000.0, 1),
                "checked_at": checked_at,
                "error_category": "NETWORK_ERROR",
                "message": f"Network connectivity error to Cloudflare: {self._sanitize_error_message(str(e))}"
            }

    # -------------------------------------------------------------
    # 5. RUN CONCURRENT 4-PROVIDER DIAGNOSTICS
    # -------------------------------------------------------------
    async def run_diagnostics(self, force: bool = False) -> Dict[str, Dict[str, Any]]:
        """
        Executes lightweight, concurrent health checks across all four providers.
        Thread-safe and cached via TTL to prevent excessive quota consumption.
        """
        async with self._lock:
            now = time.time()
            if not force and self._cached_results and (now - self._last_checked) < self.cache_ttl:
                return self._cached_results

            results = await asyncio.gather(
                self.check_gemini(),
                self.check_groq(),
                self.check_openrouter(),
                self.check_cloudflare(),
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
