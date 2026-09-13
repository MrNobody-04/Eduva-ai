"""
EDUVA AI - Dual-Key Google Gemini Intelligence Service
Features:
- Dual-Key Automatic Failover & Load Balancing (Key 1 <-> Key 2)
- Rate Limit (429) & Quota Exhaustion Auto-Recovery
- Integration with Nepal Education Knowledge Graph context
"""

import os
import logging
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

logger = logging.getLogger('eduva.gemini')

class GeminiService:
    def __init__(self):
        self.keys = []
        k1 = os.getenv('GEMINI_API_KEY_1') or os.getenv('GEMINI_API_KEY')
        k2 = os.getenv('GEMINI_API_KEY_2')
        if k1:
            self.keys.append(k1.strip())
        if k2 and k2.strip() not in self.keys:
            self.keys.append(k2.strip())
            
        self.active_key_idx = 0
        self.model_name = 'gemini-2.5-flash'
        self._init_current_key()

    def _init_current_key(self):
        if self.keys:
            key = self.keys[self.active_key_idx]
            genai.configure(api_key=key)

    def rotate_key(self):
        if len(self.keys) > 1:
            self.active_key_idx = (self.active_key_idx + 1) % len(self.keys)
            self._init_current_key()
            logger.info(f'Rotated to Gemini API Key #{self.active_key_idx + 1}')
            return True
        return False

    def generate_chat_response(
        self,
        user_query: str,
        context_summary: str = '',
        system_instruction: Optional[str] = None
    ) -> Dict[str, Any]:
        if not self.keys:
            return {
                'success': False,
                'error': 'No Gemini API keys configured',
                'text': ''
            }

        default_sys = (
            'You are EDUVA AI, the authoritative higher education AI guide for Nepal. '
            'You assist students with Nepal universities (TU, KU, PokU, PU, etc.), entrance exams '
            '(IOE, CEE, KUCAT, CMAT), scholarships, and courses (+2 to Bachelor/Masters). '
            'Be clear, concise, highly encouraging, and accurate. Support English, Devanagari Nepali, '
            'and Romanized Nepali naturally.'
        )
        sys_prompt = system_instruction or default_sys
        full_prompt = f'CONTEXT FROM NEPAL EDUCATION KNOWLEDGE GRAPH:\n{context_summary}\n\nSTUDENT QUERY:\n{user_query}' if context_summary else user_query

        attempts = len(self.keys)
        last_error = None

        for attempt in range(attempts):
            try:
                model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=sys_prompt
                )
                response = model.generate_content(full_prompt)
                return {
                    'success': True,
                    'text': response.text,
                    'key_used': f'KEY_{self.active_key_idx + 1}',
                    'model': self.model_name
                }
            except Exception as e:
                last_error = str(e)
                logger.warning(f'Gemini call with Key #{self.active_key_idx + 1} failed: {e}. Attempting key rotation.')
                self.rotate_key()

        return {
            'success': False,
            'error': last_error,
            'text': ''
        }

    def get_status(self) -> Dict[str, Any]:
        return {
            'available': len(self.keys) > 0,
            'keys_count': len(self.keys),
            'active_key_index': self.active_key_idx + 1,
            'model': self.model_name,
            'failover_ready': len(self.keys) >= 2,
            'provider': 'Google Gemini 2.5 Flash'
        }

global_gemini_service = GeminiService()
