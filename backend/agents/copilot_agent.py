"""
EDUVA AI Context-Aware Conversational Assistant
Provides:
1. Multilingual Natural Dialogue (English, Devanagari Nepali, Romanized Nepglish)
2. Multi-Format Structured Responses (TEXT, COLLEGE_CARDS, COURSE_CARDS, DEADLINE_CARDS, COMPARISON_TABLE)
3. Session Context Memory (maintains track of active stream, degree preference, and location across conversation turns)
4. Authoritative Source Citations (Level 1 Verification Badges)
"""

from typing import Dict, Any, Optional
from engine.knowledge_graph import KnowledgeGraph


class CopilotAgent:
    def __init__(self, kg: Optional[KnowledgeGraph] = None, safety_agent=None):
        self.name = "EDUVA AI"
        self.kg = kg
        self.safety_agent = safety_agent
        self.session_states: Dict[str, Dict[str, Any]] = {}

    def _get_session_state(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self.session_states:
            self.session_states[session_id] = {
                "active_stream": None,
                "preferred_location": "Kathmandu",
                "active_program": None,
                "last_topic": None,
                "gpa": None,
                "budget": None,
                "history": []
            }
        return self.session_states[session_id]

    def clear_session(self, session_id: str):
        if session_id in self.session_states:
            del self.session_states[session_id]
        from engine.chat_service import global_chat_service
        if session_id in global_chat_service.active_contexts:
            del global_chat_service.active_contexts[session_id]

    async def answer_query(
        self,
        user_query: str,
        student_id: str = "student_user",
        session_id: str = "default_session",
        is_voice: bool = False
    ) -> Dict[str, Any]:
        from engine.chat_service import global_chat_service
        return await global_chat_service.process_chat(
            query=user_query,
            student_id=student_id,
            session_id=session_id,
            is_voice=is_voice
        )


global_copilot_agent = CopilotAgent(None)
copilot_agent = global_copilot_agent
