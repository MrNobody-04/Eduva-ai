import datetime
from typing import Dict, List, Any
from engine.event_bus import EventBus, EduvaEvent
from engine.knowledge_graph import KnowledgeGraph, SourceEntity, KnowledgeGapEntity

class ResearchAgent:
    def __init__(self, event_bus: EventBus, kg: KnowledgeGraph):
        self.name = "ResearchAgent"
        self.event_bus = event_bus
        self.kg = kg
        self.research_queue: List[Dict[str, Any]] = [
            {"id": "rq_1", "task": "Verify IOE Computer Engineering 2026 seat quota updates", "priority": "HIGH", "status": "IN_PROGRESS"},
            {"id": "rq_2", "task": "Scan MOEST portal for new foreign government scholarships", "priority": "MEDIUM", "status": "QUEUED"},
            {"id": "rq_3", "task": "Resolve knowledge gap for Pokhara University hostel fees", "priority": "LOW", "status": "QUEUED"},
            {"id": "rq_4", "task": "Corroborate KUCAT computer-based test shift schedule", "priority": "HIGH", "status": "QUEUED"}
        ]

    async def run_discovery_cycle(self):
        # Scan for open knowledge gaps and add to research queue
        for gap in self.kg.knowledge_gaps.values():
            if gap.status == "OPEN":
                task_exists = any(item.get("task_id") == gap.id for item in self.research_queue)
                if not task_exists:
                    self.research_queue.append({
                        "id": f"rq_{gap.id}",
                        "task_id": gap.id,
                        "task": f"Investigate missing field '{gap.missing_field}' on {gap.entity_type} {gap.entity_id}",
                        "priority": gap.priority,
                        "status": "QUEUED"
                    })

        # Emit research heartbeat event
        await self.event_bus.publish(EduvaEvent(
            event_type="RESEARCH_CYCLE_COMPLETED",
            agent_source=self.name,
            data={
                "queue_length": len(self.research_queue),
                "active_tasks": [t["task"] for t in self.research_queue if t["status"] == "IN_PROGRESS"]
            },
            confidence=0.99
        ))

    def add_research_task(self, title: str, priority: str = "MEDIUM"):
        self.research_queue.insert(0, {
            "id": f"rq_{int(datetime.datetime.now().timestamp()*1000)}",
            "task": title,
            "priority": priority,
            "status": "QUEUED"
        })

    def get_status(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "state": "RUNNING",
            "queue_depth": len(self.research_queue),
            "tasks": self.research_queue[:8]
        }
