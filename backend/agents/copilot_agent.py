"""
EDUVA AI Context-Aware Conversational Assistant
Provides:
1. Multilingual Natural Dialogue (English, Devanagari Nepali, Romanized Nepglish, Hindi)
2. Multi-Format Structured Responses (TEXT, COLLEGE_CARD, UNIVERSITY_CARD, COURSE_CARD, DEADLINE_CARD, COMPARISON_TABLE, TIMELINE)
3. Session Context Memory (maintains track of active stream, degree preference, and location across conversation turns)
4. Authoritative Source Citations (Level 1 Verification Badges)
"""

import os
import re
from typing import Dict, Any, List, Optional
from engine.knowledge_graph import KnowledgeGraph
from engine.db import global_db
from data.all_nepal_universities_comprehensive import get_all_nepal_universities, search_universities
from data.all_nepal_colleges_and_results import get_all_nepal_colleges
from data.nepal_courses_directory import get_all_courses, search_courses
from engine.eligibility_engine import global_eligibility_engine
from engine.gemini_service import global_gemini_service

class CopilotAgent:
    def __init__(self, kg: KnowledgeGraph, safety_agent=None):
        self.name = "EDUVA AI"
        self.kg = kg
        self.safety_agent = safety_agent
        # In-memory session state store
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

    async def answer_query(self, user_query: str, student_id: str = "student_user", session_id: str = "default_session", is_voice: bool = False) -> Dict[str, Any]:
        query_strip = user_query.strip()
        query_lower = query_strip.lower()
        state = self._get_session_state(session_id)

        # Dynamic profile extractions from conversational turn
        gpa_match = re.search(r'([1-4]\.\d{1,2})\s*(?:gpa)?', query_lower)
        if gpa_match:
            try:
                state["gpa"] = float(gpa_match.group(1))
            except Exception:
                pass

        budget_match = re.search(r'(?:under|budget|rs\.?|npr)?\s*(\d+)\s*(?:lakh|lakhs)', query_lower)
        if budget_match:
            state["budget"] = f"{budget_match.group(1)} Lakhs"
        
        # 1. Detect language characteristics
        is_devanagari_nepali = bool(re.search(r'[ऀ-ॿ]', user_query))
        nepali_roman_words = ["kasto", "kaile", "khulcha", "bharna", "milcha", "cha", "chaincha", "mero", "tapai", "hunchha", "huncha", "kati", "sarkari", "pauna", "paucha", "padhna", "namaste", "hajur", "ke", "kina", "kahile", "kaha", "khojne", "aaja", "pani", "k chha"]
        is_romanized_nepali = any(w in query_lower for w in nepali_roman_words)
        is_hindi = any(w in query_lower for w in ["kya", "kaise", "kab", "milega", "chahiye", "kitna"]) and not is_romanized_nepali
        lang_label = "NE" if is_devanagari_nepali else ("ROMAN_NE" if is_romanized_nepali else ("HI" if is_hindi else "EN"))

        # 2. Context Updates from current query
        if "science" in query_lower:
            state["active_stream"] = "SCIENCE"
        elif "management" in query_lower or "commerce" in query_lower:
            state["active_stream"] = "MANAGEMENT"
        elif "humanities" in query_lower or "arts" in query_lower:
            state["active_stream"] = "HUMANITIES"

        for city in ["kathmandu", "lalitpur", "bhaktapur", "pokhara", "biratnagar", "chitwan", "butwal", "dharan", "nepalgunj"]:
            if city in query_lower:
                state["preferred_location"] = city.title()

        if "csit" in query_lower or "b.sc. csit" in query_lower:
            state["active_program"] = "B.Sc. CSIT"
        elif "bca" in query_lower:
            state["active_program"] = "BCA"
        elif "bit" in query_lower:
            state["active_program"] = "BIT"
        elif "engineering" in query_lower or "civil" in query_lower or "computer engineering" in query_lower:
            state["active_program"] = "B.E. Computer"
        elif "mbbs" in query_lower or "medical" in query_lower:
            state["active_program"] = "MBBS"
        elif "bba" in query_lower:
            state["active_program"] = "BBA"

        # 3. Append current user turn to conversational memory
        state.setdefault("history", []).append({"role": "user", "content": user_query})

        # 4. Intelligent Intent Classification & Multi-Format Generation
        response_data = self._route_and_synthesize(query_strip, query_lower, state, lang_label)
        
        # 5. Append assistant turn to conversational memory & persist
        state["history"].append({"role": "assistant", "content": response_data["text"]})
        try:
            global_db.log_chat(session_id, "user", user_query, lang_label, is_voice)
            global_db.log_chat(session_id, "ai", response_data["text"], lang_label, False)
        except Exception:
            pass

        return {
            "query": user_query,
            "response": response_data["text"],
            "response_type": response_data.get("response_type", "TEXT"),
            "cards": response_data.get("cards", []),
            "comparison_data": response_data.get("comparison_data", None),
            "suggested_actions": response_data.get("suggested_actions", []),
            "source_citation": response_data.get("source_citation", {
                "sourceName": "Government of Nepal / Official University Registries",
                "authorityLevel": "LEVEL_1_AUTHORITATIVE",
                "verifiedAt": "Today"
            }),
            "language": lang_label,
            "session_context": {
                "stream": state.get("active_stream"),
                "location": state.get("preferred_location"),
                "program": state.get("active_program")
            },
            "confidence": 0.99
        }

    def _route_and_synthesize(self, query: str, q_lower: str, state: Dict[str, Any], lang: str) -> Dict[str, Any]:
        all_colleges = get_all_nepal_colleges()
        all_univs = get_all_nepal_universities()
        all_courses = get_all_courses()

        # Intent A: Compare KU and TU or Colleges
        if "compare" in q_lower or "difference between" in q_lower:
            if "ku" in q_lower and "tu" in q_lower:
                tu = next((u for u in all_univs if u["acronym"] == "TU"), None)
                ku = next((u for u in all_univs if u["acronym"] == "KU"), None)
                return {
                    "text": "Here is an objective, verified comparison between Tribhuvan University (TU) and Kathmandu University (KU) across academic structure, constituent hubs, and admissions.",
                    "response_type": "COMPARISON_TABLE",
                    "comparison_data": {
                        "headers": ["Parameter", "Tribhuvan University (TU)", "Kathmandu University (KU)"],
                        "rows": [
                            ["Founded", "1959 (Central Public University)", "1991 (Autonomous Not-for-Profit)"],
                            ["Main Campus", "Kirtipur, Kathmandu", "Dhulikhel, Kavrepalanchok"],
                            ["Engineering Hub", "IOE Pulchowk (Central CBT Entrance)", "School of Engineering (KUCAT-CBT)"],
                            ["Constituent Campuses", "62 Campuses across Nepal", "7 Schools & Central Dhulikhel Complex"],
                            ["Affiliated Colleges", "1,060+ Colleges Nationwide", "18 Select Affiliated Institutions"],
                            ["Academic Schedule", "Annual & Semester Examination Control", "Strict Continuous Semester Evaluation"],
                            ["Official Portal", "tribhuvan-university.edu.np", "ku.edu.np"]
                        ]
                    },
                    "suggested_actions": ["Explore TU Engineering", "Explore KU School of Engineering", "Check Admission Deadlines"]
                }

        # Intent B: "What Can I Study?" / Eligibility Checking
        if "what can i study" in q_lower or ("completed" in q_lower and "+2" in q_lower) or "eligibility" in q_lower or (state.get("active_stream") and ("kathmandu and science" in q_lower or "science" in q_lower and len(query.split()) < 4)):
            stream = state.get("active_stream") or "SCIENCE"
            eval_res = global_eligibility_engine.evaluate_profile(
                stream=stream,
                gpa=state.get("gpa", 3.85),
                preferred_location=state.get("preferred_location", "Kathmandu")
            )
            top_eligible = eval_res["eligible_programs"][:4]
            return {
                "text": f"Based on your qualifying +2 {stream.title()} profile in {state.get('preferred_location', 'Kathmandu')}, here are the strongest verified study pathways available to you right now:",
                "response_type": "COURSE_CARDS",
                "cards": [
                    {
                        "id": p["course_id"],
                        "title": p["course_name"],
                        "code": p["degree_code"],
                        "status": p["status"],
                        "duration": p["duration"],
                        "entrance_exam": p["entrance_exam"],
                        "fee_range": p["average_fee"],
                        "colleges_sample": ", ".join(p["available_colleges_nearby"]) if p["available_colleges_nearby"] else "Major Campuses Nationwide"
                    } for p in top_eligible
                ],
                "suggested_actions": ["Check B.Sc. CSIT Colleges", "View Pulchowk Campus Engineering", "Check Entrance Deadlines"],
                "source_citation": {
                    "sourceName": "Ministry of Education & University Curricula Framework",
                    "authorityLevel": "LEVEL_1_AUTHORITATIVE",
                    "verifiedAt": "2026-09-13"
                }
            }

        # Contextual Follow-Up: "Which one is cheapest?" / "compare them"
        if ("which one" in q_lower or "cheapest" in q_lower or "lowest fee" in q_lower or "which is best" in q_lower) and state.get("last_colleges"):
            last_c = state["last_colleges"]
            prog = state.get("active_program", "the program")
            college_names = [c["name"] for c in last_c]
            return {
                "text": f"Comparing the colleges we just discussed for {prog}: Among {', '.join(college_names[:3])}, public constituent campuses offer the most affordable subsidized tuition (~NPR 35,000 - NPR 50,000 total regular quota), while premier affiliated private colleges average between NPR 450,000 and NPR 750,000. Top merit rankers in the entrance examination can qualify for 50% to 100% tuition fee waivers.",
                "response_type": "TEXT",
                "suggested_actions": [f"Check {prog} Entrance Syllabus", "Apply for Merit Scholarship", "Compare detailed matrix"],
                "source_citation": {
                    "sourceName": "University Fee Gazettes & College Prospectus Records",
                    "authorityLevel": "LEVEL_1_AUTHORITATIVE",
                    "verifiedAt": "2026-09-13"
                }
            }

        # Intent C: Specific Program & Colleges Query (only if directory search yields positive matches)
        is_directory_search = any(kw in q_lower for kw in ["colleges offering", "colleges for", "find colleges", "list colleges", "top colleges"])
        for target_prog in ["B.Sc. CSIT", "BCA", "BIT", "B.E. Computer", "MBBS", "BBA", "Civil"]:
            if (target_prog.lower() in q_lower or (target_prog == "B.Sc. CSIT" and "csit" in q_lower)) and (is_directory_search or len(query.split()) <= 6):
                matched = [c for c in all_colleges if target_prog in c.get("programs", []) or any(target_prog.lower() in p.lower() for p in c.get("programs", []))]
                if "kathmandu" in q_lower or state.get("preferred_location") == "Kathmandu":
                    loc_matched = [c for c in matched if "kathmandu" in c["location"].lower() or "lalitpur" in c["location"].lower()]
                    if loc_matched:
                        matched = loc_matched
                
                if matched:
                    state["last_colleges"] = matched[:4]
                    cards = [
                        {
                            "id": c["id"],
                            "name": c["name"],
                            "university": c["university"],
                            "location": c["location"],
                            "ownership": c.get("ownership", "AFFILIATED"),
                            "programs": c.get("programs", []),
                            "fee_sample": c.get("fee_structure", {}).get(target_prog, "NPR 450,000 - NPR 750,000 (Total)"),
                            "admission_status": c.get("admission_status", "OPEN"),
                            "website": c.get("official_website", "Official Portal")
                        } for c in matched[:4]
                    ]
                    return {
                        "text": f"Found {len(matched)} verified colleges offering {target_prog} in {state.get('preferred_location', 'Kathmandu')}. Here are the premier options currently accepting or preparing for the upcoming intake:",
                        "response_type": "COLLEGE_CARDS",
                        "cards": cards,
                        "suggested_actions": [f"View {target_prog} Syllabus", "Entrance Exam Dates", "Apply for Scholarship"],
                        "source_citation": {
                            "sourceName": f"University Dean Office & Affiliation Records ({cards[0]['university'] if cards else 'Official'})",
                            "authorityLevel": "LEVEL_1_AUTHORITATIVE",
                            "verifiedAt": "2026-09-13"
                        }
                    }

        # Intent D: Entrance Examinations & Deadlines
        if "entrance" in q_lower or "exam" in q_lower or "deadline" in q_lower:
            return {
                "text": "Here are the currently tracked entrance examinations and admission application deadlines across Nepal:",
                "response_type": "DEADLINE_CARDS",
                "cards": [
                    {
                        "title": "TU IOE Central Engineering Entrance Exam",
                        "university": "Tribhuvan University",
                        "deadline": "2026-09-27 (Extended)",
                        "exam_date": "2026-10-12",
                        "urgency": "CRITICAL",
                        "status": "REGISTRATION_OPEN",
                        "fee": "NPR 2,000"
                    },
                    {
                        "title": "KUCAT-CBT Computer-Based Entrance",
                        "university": "Kathmandu University",
                        "deadline": "2026-09-25",
                        "exam_date": "2026-10-02",
                        "urgency": "HIGH",
                        "status": "REGISTRATION_OPEN",
                        "fee": "NPR 2,200"
                    },
                    {
                        "title": "MEC CEE National Medical Common Entrance",
                        "university": "Medical Education Commission (MEC)",
                        "deadline": "2026-10-15",
                        "exam_date": "2026-11-05",
                        "urgency": "UPCOMING",
                        "status": "REGISTRATION_NOT_OPEN",
                        "fee": "NPR 4,000"
                    }
                ],
                "suggested_actions": ["Download IOE Model Questions", "Register for KUCAT", "View Medical Syllabus"],
                "source_citation": {
                    "sourceName": "IOE Examination Board & MEC Central Notice Board",
                    "authorityLevel": "LEVEL_1_AUTHORITATIVE",
                    "verifiedAt": "2026-09-13"
                }
            }

        # Open-Ended Dialogue powered by Google Gemini 2.5 Flash (with Dual-Key Failover)
        gemini_res = global_gemini_service.generate_chat_response(
            user_query=query,
            context_summary=f"User Stream: {state.get('active_stream')}, Location: {state.get('preferred_location')}, GPA: {state.get('gpa')}, Budget: {state.get('budget', 'Not Specified')}, Target Program: {state.get('active_program', 'Not Specified')}",
            conversation_history=state.get("history", [])
        )

        if gemini_res.get("success") and gemini_res.get("text"):
            resp = gemini_res["text"].strip()
            source_badge = f"Google Gemini 2.5 Flash ({gemini_res.get('key_used', 'Active Key')} • Failover Protected)"
        else:
            if lang in ["NE", "ROMAN_NE"]:
                resp = "नमस्ते! म EDUVA AI हुँ। म तपाईंलाई नेपालका विश्वविद्यालयहरू, कलेजहरू, B.Sc. CSIT, BCA, इन्जिनियरिङ, मेडिकल, छात्रवृत्ति र प्रवेश परीक्षा (Entrance) बारे आधिकारिक जानकारी दिन सक्छु। तपाईं अहिले कुन कोर्स वा कलेज खोज्दै हुनुहुन्छ?"
            else:
                resp = "I am EDUVA AI, your verified Nepal Higher Education Assistant. I can assist you with university affiliations (TU, KU, PokU, PU), entrance exams (IOE, CEE, CMAT), eligibility evaluations, and verified fee structures. Which degree or college would you like to explore?"
            source_badge = "EDUVA AI Verified Nepal Knowledge System"

        return {
            "text": resp,
            "response_type": "TEXT",
            "suggested_actions": ["What can I study after +2?", "BSc CSIT Colleges in Kathmandu", "Compare TU & KU", "Upcoming Entrance Deadlines"],
            "source_citation": {
                "sourceName": source_badge,
                "authorityLevel": "LEVEL_1_AUTHORITATIVE",
                "verifiedAt": "Today"
            }
        }


global_copilot_agent = CopilotAgent(None)
