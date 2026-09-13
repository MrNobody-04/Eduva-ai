from typing import Dict, Any, Optional
from engine.event_bus import EventBus, EduvaEvent
from engine.knowledge_graph import KnowledgeGraph
from engine.semantic_diff import SemanticChangeDetector
from .verification_agent import VerificationAgent

class AdmissionAgent:
    def __init__(self, event_bus: EventBus, kg: KnowledgeGraph, verification_agent: VerificationAgent):
        self.name = "AdmissionAgent"
        self.event_bus = event_bus
        self.kg = kg
        self.verifier = verification_agent

    async def process_observed_program_notice(self, program_id: str, new_data: Dict[str, Any], source_id: str):
        program = self.kg.programs.get(program_id)
        if not program:
            return None

        # 1. Semantic Change Detection
        diff = SemanticChangeDetector.detect_change("PROGRAM", program.model_dump(), new_data)
        if not diff:
            return None  # No meaningful change detected

        # 2. Verification
        verification = self.verifier.verify_candidate_update(source_id, diff)
        if verification["status"] == "REJECTED":
            return {"status": "REJECTED", "reason": "Low source trust"}

        # 3. Update Knowledge Graph
        for change in diff["changes"]:
            field = change["field"]
            old_val = change["old_value"]
            new_val = change["new_value"]
            
            # Apply to program entity
            setattr(program, field, new_val)
            self.kg.record_change(
                change_type=change["change_type"],
                entity_type="PROGRAM",
                entity_id=program_id,
                old_value=old_val,
                new_value=new_val,
                reason=change["reason"],
                confidence=verification["confidence"]
            )

        # 4. Publish Event to Event Bus
        event = EduvaEvent(
            event_type="ADMISSION_DEADLINE_CHANGED" if any(c["field"] == "application_deadline" for c in diff["changes"]) else "PROGRAM_UPDATED",
            agent_source=self.name,
            source_id=source_id,
            confidence=verification["confidence"],
            verification_status=verification["status"],
            affected_entities=[program_id],
            data={
                "program_id": program_id,
                "program_name": program.name,
                "changes": diff["changes"],
                "summary": diff["semantic_summary"],
                "new_deadline": getattr(program, "application_deadline", None)
            }
        )
        await self.event_bus.publish(event)
        return {"status": "PROCESSED", "diff": diff, "event_id": event.id}

    def get_status(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "state": "RUNNING",
            "monitored_programs_count": len(self.kg.programs),
            "active_admission_cycles": 4
        }
