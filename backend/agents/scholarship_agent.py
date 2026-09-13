from typing import Dict, List, Any
from engine.event_bus import EventBus, EduvaEvent
from engine.knowledge_graph import KnowledgeGraph

class ScholarshipAgent:
    def __init__(self, event_bus: EventBus, kg: KnowledgeGraph):
        self.name = "ScholarshipAgent"
        self.event_bus = event_bus
        self.kg = kg

    def match_scholarships_for_student(self, student_id: str) -> List[Dict[str, Any]]:
        student = self.kg.students.get(student_id)
        if not student:
            return []

        matched = []
        for sch in self.kg.scholarships.values():
            if not sch.is_active:
                continue
            
            # Match field of study
            field_match = any(
                any(target.lower() in field.lower() or field.lower() in target.lower() for target in sch.target_fields)
                for field in student.target_fields
            )

            if field_match or not sch.target_fields:
                matched.append({
                    "scholarship": sch.model_dump(),
                    "match_score": 0.95 if field_match else 0.80,
                    "relevance_reason": f"Matches student interest in {', '.join(student.target_fields)}"
                })

        return sorted(matched, key=lambda x: x["match_score"], reverse=True)

    def get_status(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "state": "RUNNING",
            "active_scholarships_tracked": len(self.kg.scholarships)
        }
