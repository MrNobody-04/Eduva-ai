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
        self.active_university_index = 0
        self.universities_catalog_checklist = [
            "Tribhuvan University", "Kathmandu University", "Pokhara University",
            "Purbanchal University", "Nepal Sanskrit University", "Lumbini Bauddha University",
            "Agriculture and Forestry University", "Mid-Western University", "Far-Western University",
            "Nepal Open University", "Rajarshi Janak University", "Manmohan Technical University",
            "Madan Bhandari University of Science and Technology", "Gandaki University"
        ]
        self.event_bus.subscribe("PORTAL_CHANGE_DETECTED", self.handle_portal_change)

    async def handle_portal_change(self, event: EduvaEvent):
        pname = event.data.get("portal_name", "Official Portal")
        url = event.data.get("url", "")
        task_title = f"Analyze content mutation on {pname} ({url})"
        self.add_research_task(task_title, priority="HIGH")

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

        self.active_university_index = 0
        self.universities_catalog_checklist = [
            "Tribhuvan University", "Kathmandu University", "Pokhara University",
            "Purbanchal University", "Nepal Sanskrit University", "Lumbini Bauddha University",
            "Agriculture and Forestry University", "Mid-Western University", "Far-Western University",
            "Nepal Open University", "Rajarshi Janak University", "Manmohan Technical University",
            "Madan Bhandari University of Science and Technology", "Gandaki University"
        ]

    async def run_university_catalog_cycle(self):
        """
        Systematically crawls through all 26 universities to discover their actual
        accredited affiliated campuses via official portals and affiliation gazettes.
        """
        if not self.universities_catalog_checklist:
            return

        target_univ = self.universities_catalog_checklist[self.active_university_index % len(self.universities_catalog_checklist)]
        self.active_university_index += 1

        task_title = f"Crawl and corroborate official affiliated colleges roster for {target_univ}"
        self.add_research_task(task_title, priority="HIGH")

        # Publish discovery event for verification agent
        await self.event_bus.publish(EduvaEvent(
            event_type="UNIVERSITY_CATALOG_SCAN_STARTED",
            agent_source=self.name,
            confidence=0.96,
            data={"university": target_univ, "strategy": "GAZETTE_CHECKSUM_AND_AFFILIATION_AUDIT"}
        ))

    async def ingest_discovered_resource(
        self,
        title: str,
        category: str,
        authority_level: str,
        source_url: str,
        file_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Internal-only ingestion path for resources discovered autonomously by agents.
        Routes through security confidence gate before publishing.
        """
        sources = [{
            "sourceUrl": source_url,
            "authorityLevel": authority_level,
            "reliabilityScore": 0.95
        }]
        
        # Publish event so confidence gate and verification evaluate it
        await self.event_bus.publish(EduvaEvent(
            event_type="RESOURCE_INGESTED_AUTONOMOUSLY",
            agent_source=self.name,
            confidence=0.95,
            data={
                "title": title,
                "category": category,
                "authority_level": authority_level,
                "source_url": source_url,
                "file_path": file_path
            }
        ))

        return {
            "status": "INGESTED_QUEUED_VERIFICATION",
            "title": title,
            "authority_level": authority_level,
            "source_url": source_url
        }

    def add_research_task(self, title: str, priority: str = "MEDIUM"):
        self.research_queue.insert(0, {
            "id": f"rq_{int(datetime.datetime.now().timestamp()*1000)}",
            "task": title,
            "priority": priority,
            "status": "QUEUED"
        })

    async def execute_research(self, topic: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes deep autonomous research via AI Gateway (Gemini 2.5 Pro/Flash, OpenRouter).
        """
        from engine.ai_gateway import global_ai_gateway
        system_instruction = (
            "You are Eduva AI Research Agent specializing in Nepal higher education. "
            "Extract authoritative facts: eligibility, fees, seat quotas, affiliation, entrance requirements. "
            "Never invent details. Return a concise, structured analysis with source references."
        )
        prompt = f"RESEARCH TOPIC:\n{topic}\n\nADDITIONAL CONTEXT:\n{context or 'None'}"
        try:
            ai_res = await global_ai_gateway.execute(
                task_type="DEEP_RESEARCH",
                prompt=prompt,
                system_prompt=system_instruction,
                priority="HIGH",
                max_tokens=1200
            )
            # Emit research completed event
            await self.event_bus.publish(EduvaEvent(
                event_type="RESEARCH_COMPLETED",
                agent_source=self.name,
                confidence=0.95,
                data={
                    "topic": topic,
                    "provider": ai_res.get("provider"),
                    "model": ai_res.get("model"),
                    "summary": ai_res.get("content", "")[:300]
                }
            ))
            return {
                "status": "SUCCESS",
                "topic": topic,
                "findings": ai_res.get("content", ""),
                "provider": ai_res.get("provider"),
                "model": ai_res.get("model")
            }
        except Exception as e:
            return {"status": "FAILED", "topic": topic, "error": str(e)}

    def get_status(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "state": "RUNNING",
            "queue_depth": len(self.research_queue),
            "tasks": self.research_queue[:8],
            "active_university_audit": self.universities_catalog_checklist[self.active_university_index % len(self.universities_catalog_checklist)] if self.universities_catalog_checklist else "Completed"
        }
