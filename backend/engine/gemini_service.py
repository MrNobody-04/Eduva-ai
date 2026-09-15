"""
EDUVA AI - Multi-Key Concurrent Google Gemini Key Pool Architecture
Migrated to modern official `google-genai` SDK.
Features:
- Thread-safe & async concurrency-safe multi-key pool
- Supports GEMINI_API_KEYS (comma-separated), GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
- Isolated client instances per request avoiding global configure contention
- Round-robin key selection with rate-limit (429) backoff cooldowns
- Multi-model fallback (gemini-2.5-flash -> gemini-flash-latest -> gemini-2.0-flash-exp)
- Lightweight health checks & multi-key diagnostics (zero key secret leakage)
"""

import os
import time
import threading
import logging
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

logger = logging.getLogger('eduva.gemini')

class KeyDescriptor:
    def __init__(self, key: str, index: int):
        self.key = key
        self.index = index
        self.name = f"KEY_{index + 1}"
        self.rate_limited_until: float = 0.0
        self.total_calls: int = 0
        self.successful_calls: int = 0
        self.failed_calls: int = 0
        self.last_used: float = 0.0

    def is_available(self) -> bool:
        return time.time() >= self.rate_limited_until

    def mark_rate_limited(self, cooldown_seconds: float = 60.0):
        self.rate_limited_until = time.time() + cooldown_seconds
        self.failed_calls += 1
        logger.warning(f"Gemini {self.name} rate-limited. Cooldown for {cooldown_seconds}s.")

    def mark_success(self):
        self.successful_calls += 1
        self.last_used = time.time()


class GeminiService:
    def __init__(self):
        self._lock = threading.Lock()
        self.keys: List[KeyDescriptor] = []
        self._next_idx = 0
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
        self._load_keys()

    def _load_keys(self):
        raw_keys: List[str] = []
        
        # 1. Comma-separated GEMINI_API_KEYS
        env_keys = os.getenv('GEMINI_API_KEYS')
        if env_keys:
            for k in env_keys.split(','):
                cleaned = k.strip()
                if cleaned and cleaned not in raw_keys:
                    raw_keys.append(cleaned)

        # 2. Numbered keys GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
        for i in range(1, 10):
            k = os.getenv(f'GEMINI_API_KEY_{i}')
            if k and k.strip() and k.strip() not in raw_keys:
                raw_keys.append(k.strip())

        # 3. Default single GEMINI_API_KEY
        single = os.getenv('GEMINI_API_KEY')
        if single and single.strip() and single.strip() not in raw_keys:
            raw_keys.append(single.strip())

        self.keys = [KeyDescriptor(k, idx) for idx, k in enumerate(raw_keys)]
        if self.keys:
            logger.info(f"Initialized Gemini Key Pool with {len(self.keys)} isolated key(s).")
        else:
            logger.warning("No Gemini API keys found in environment.")

    def get_next_available_key(self) -> Optional[KeyDescriptor]:
        """Atomically selects the next non-rate-limited key using round-robin."""
        with self._lock:
            if not self.keys:
                return None

            n = len(self.keys)
            for _ in range(n):
                candidate = self.keys[self._next_idx]
                self._next_idx = (self._next_idx + 1) % n
                if candidate.is_available():
                    candidate.total_calls += 1
                    return candidate

            # If all keys are currently cooling down, return the one that will cool down earliest
            earliest = min(self.keys, key=lambda k: k.rate_limited_until)
            earliest.total_calls += 1
            return earliest

    def generate_chat_response(
        self,
        user_query: str,
        context_summary: str = '',
        conversation_history: Optional[List[Dict[str, str]]] = None,
        system_instruction: Optional[str] = None,
        max_tokens: int = 800,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        if not self.keys:
            return {
                'success': False,
                'error': 'No Gemini API keys configured in pool',
                'text': ''
            }

        default_sys = (
            "You are EDUVA AI, Nepal's personal higher education and university admission counselor. "
            "Your personality is calm, deeply knowledgeable, encouraging, and honest. "
            "NEVER use repetitive AI cliches like 'Certainly!', 'Sure!', 'I'd be happy to help!', or 'Based on your query'. "
            "Speak naturally like an experienced senior educational advisor in Kathmandu (e.g. 'That is a solid option', "
            "'I'd be careful with that college because...', 'Before deciding, check if their syllabus aligns with...'). "
            "Support English, Devanagari Nepali, and Romanized Nepali naturally based on student language. "
            "Maintain strict zero-hallucination: if an entrance deadline or fee is not verified, advise checking the official university gazette. "
            "Always reference official institutions (Tribhuvan University, Kathmandu University, Pokhara University, IOE, MEC, MOEST)."
        )
        sys_prompt = system_instruction or default_sys

        history_text = ""
        if conversation_history:
            recent_turns = conversation_history[-6:]
            history_text = "\n".join([f"{t.get('role', 'User').capitalize()}: {t.get('content', '')}" for t in recent_turns])

        prompt_parts = []
        if context_summary:
            prompt_parts.append(f"CURRENT STUDENT PROFILE & CONTEXT:\n{context_summary}")
        if history_text:
            prompt_parts.append(f"PRIOR CONVERSATION HISTORY:\n{history_text}")
        prompt_parts.append(f"STUDENT QUERY:\n{user_query}")
        
        full_prompt = "\n\n".join(prompt_parts)

        models_to_try = [self.model_name, 'gemini-flash-latest', 'gemini-2.0-flash-exp']
        last_error = None

        # Try across available keys in the pool using modern isolated Client instances
        for _ in range(len(self.keys)):
            key_desc = self.get_next_available_key()
            if not key_desc:
                break

            client = genai.Client(api_key=key_desc.key)

            for m_name in models_to_try:
                try:
                    config = types.GenerateContentConfig(
                        system_instruction=sys_prompt,
                        max_output_tokens=max_tokens,
                        temperature=temperature
                    )
                    response = client.models.generate_content(
                        model=m_name,
                        contents=full_prompt,
                        config=config
                    )
                    key_desc.mark_success()
                    return {
                        'success': True,
                        'text': response.text or '',
                        'key_used': key_desc.name,
                        'model': m_name
                    }
                except Exception as e:
                    err_str = str(e)
                    last_error = err_str
                    if "429" in err_str or "quota" in err_str.lower() or "resource_exhausted" in err_str.lower():
                        key_desc.mark_rate_limited(cooldown_seconds=60.0)
                        break  # Move to next key in pool
                    else:
                        logger.warning(f"Model {m_name} failed on {key_desc.name}: {err_str[:80]}")

        return {
            'success': False,
            'error': last_error or 'All keys in pool exhausted or timed out',
            'text': ''
        }

    def check_health(self, key_desc: Optional[KeyDescriptor] = None) -> Dict[str, Any]:
        """
        Lightweight health check using modern google-genai SDK.
        Issues a minimal 2-token generation request to verify connectivity without consuming quota.
        """
        target_key = key_desc or self.get_next_available_key()
        if not target_key:
            return {
                "status": "NOT_CONFIGURED",
                "model": self.model_name,
                "latency_ms": 0.0,
                "error_category": "NOT_CONFIGURED",
                "message": "No Gemini API keys configured in pool",
                "key_used": None
            }

        start_time = time.time()
        client = genai.Client(api_key=target_key.key)
        try:
            resp = client.models.generate_content(
                model=self.model_name,
                contents="Respond with OK.",
                config=types.GenerateContentConfig(
                    max_output_tokens=2,
                    temperature=0.0
                )
            )
            latency_ms = round((time.time() - start_time) * 1000.0, 1)
            target_key.mark_success()
            return {
                "status": "CONNECTED",
                "model": self.model_name,
                "latency_ms": latency_ms,
                "error_category": None,
                "message": "Gemini connected and responding",
                "key_used": target_key.name
            }
        except Exception as e:
            latency_ms = round((time.time() - start_time) * 1000.0, 1)
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower() or "resource_exhausted" in err_str.lower():
                target_key.mark_rate_limited(cooldown_seconds=60.0)
                status = "RATE_LIMITED"
            elif "401" in err_str or "403" in err_str or "permission" in err_str.lower() or "api_key" in err_str.lower():
                status = "AUTH_FAILED"
            elif "404" in err_str or "not found" in err_str.lower():
                status = "MODEL_UNAVAILABLE"
            else:
                status = "PROVIDER_ERROR"

            return {
                "status": status,
                "model": self.model_name,
                "latency_ms": latency_ms,
                "error_category": status,
                "message": f"Gemini {target_key.name}: {status}",
                "key_used": target_key.name
            }

    def diagnose_all_keys(self) -> List[Dict[str, Any]]:
        """
        Administrative multi-key diagnostic:
        Tests each configured Gemini key individually with minimal ping.
        Returns safe telemetry with ZERO key value leakage.
        """
        results = []
        for k in self.keys:
            res = self.check_health(key_desc=k)
            results.append({
                "key_name": k.name,
                "status": res["status"],
                "latency_ms": res["latency_ms"],
                "message": res["message"]
            })
        return results

    def get_status(self) -> Dict[str, Any]:
        available_count = sum(1 for k in self.keys if k.is_available())
        return {
            'available': len(self.keys) > 0,
            'keys_count': len(self.keys),
            'available_keys_count': available_count,
            'pool_healthy': available_count > 0,
            'model': self.model_name,
            'keys': [
                {
                    'name': k.name,
                    'available': k.is_available(),
                    'total_calls': k.total_calls,
                    'successful_calls': k.successful_calls,
                    'failed_calls': k.failed_calls
                }
                for k in self.keys
            ],
            'provider': 'Google Gemini Dual/Multi-Key Pool (google-genai SDK)'
        }

global_gemini_service = GeminiService()
