import asyncio
import datetime
from typing import Dict, Any, List
from engine.event_bus import EventBus, EduvaEvent
from engine.knowledge_graph import KnowledgeGraph
from engine.security_gate import SecurityGate
from engine.learning_engine import LearningEngine
from .research_agent import ResearchAgent
from .verification_agent import VerificationAgent
from .admission_agent import AdmissionAgent
from .scholarship_agent import ScholarshipAgent
from .safety_agent import SafetyAgent
from .notification_agent import NotificationAgent
from .copilot_agent import CopilotAgent

class OrchestratorAgent:
    def __init__(
        self,
        event_bus: EventBus,
        kg: KnowledgeGraph,
        security_gate: SecurityGate,
        learning_engine: LearningEngine,
        research_agent: ResearchAgent,
        verification_agent: VerificationAgent,
        admission_agent: AdmissionAgent,
        scholarship_agent: ScholarshipAgent,
        safety_agent: SafetyAgent,
        notification_agent: NotificationAgent,
        copilot_agent: CopilotAgent
    ):
        self.name = "Orchestrator"
        self.event_bus = event_bus
        self.kg = kg
        self.security_gate = security_gate
        self.learning_engine = learning_engine
        self.research_agent = research_agent
        self.verification_agent = verification_agent
        self.admission_agent = admission_agent
        self.scholarship_agent = scholarship_agent
        self.safety_agent = safety_agent
        self.notification_agent = notification_agent
        self.copilot_agent = copilot_agent

        self.is_running = False
        self.current_step = "PARALLEL_ACTIVE"
        self.cycle_count = 0

        # Real telemetry tracking per agent loop
        now_iso = datetime.datetime.now().isoformat()
        self.agent_telemetry: Dict[str, Dict[str, Any]] = {
            "ResearchAgent": {"interval_sec": 300, "last_run": now_iso, "next_run": None, "status": "STANDBY", "errors": 0},
            "VerificationAgent": {"interval_sec": 120, "last_run": now_iso, "next_run": None, "status": "STANDBY", "errors": 0},
            "AdmissionAgent": {"interval_sec": 900, "last_run": now_iso, "next_run": None, "status": "STANDBY", "errors": 0},
            "ScholarshipAgent": {"interval_sec": 900, "last_run": now_iso, "next_run": None, "status": "STANDBY", "errors": 0},
            "SafetyAgent": {"interval_sec": 600, "last_run": now_iso, "next_run": None, "status": "STANDBY", "errors": 0},
            "NotificationAgent": {"interval_sec": 30, "last_run": now_iso, "next_run": None, "status": "STANDBY", "errors": 0}
        }

    async def _research_loop(self):
        interval = self.agent_telemetry["ResearchAgent"]["interval_sec"]
        while self.is_running:
            try:
                self.agent_telemetry["ResearchAgent"]["status"] = "RUNNING"
                now = datetime.datetime.now()
                self.agent_telemetry["ResearchAgent"]["last_run"] = now.isoformat()
                self.agent_telemetry["ResearchAgent"]["next_run"] = (now + datetime.timedelta(seconds=interval)).isoformat()
                
                await self.research_agent.run_discovery_cycle()
                self.cycle_count += 1
                self.agent_telemetry["ResearchAgent"]["status"] = "HEALTHY"
            except Exception as e:
                print(f"[ERROR in ResearchAgent Loop]: {e}")
                self.agent_telemetry["ResearchAgent"]["errors"] += 1
                self.agent_telemetry["ResearchAgent"]["status"] = f"ERROR: {str(e)[:40]}"
            await asyncio.sleep(interval)

    async def _verification_loop(self):
        interval = self.agent_telemetry["VerificationAgent"]["interval_sec"]
        while self.is_running:
            try:
                self.agent_telemetry["VerificationAgent"]["status"] = "RUNNING"
                now = datetime.datetime.now()
                self.agent_telemetry["VerificationAgent"]["last_run"] = now.isoformat()
                self.agent_telemetry["VerificationAgent"]["next_run"] = (now + datetime.timedelta(seconds=interval)).isoformat()
                
                await self.verification_agent.process_pending_queue()
                self.agent_telemetry["VerificationAgent"]["status"] = "HEALTHY"
            except Exception as e:
                print(f"[ERROR in VerificationAgent Loop]: {e}")
                self.agent_telemetry["VerificationAgent"]["errors"] += 1
                self.agent_telemetry["VerificationAgent"]["status"] = f"ERROR: {str(e)[:40]}"
            await asyncio.sleep(interval)

    async def _admission_scholarship_loop(self):
        interval = self.agent_telemetry["AdmissionAgent"]["interval_sec"]
        while self.is_running:
            try:
                now = datetime.datetime.now()
                next_time = (now + datetime.timedelta(seconds=interval)).isoformat()
                self.agent_telemetry["AdmissionAgent"]["last_run"] = now.isoformat()
                self.agent_telemetry["AdmissionAgent"]["next_run"] = next_time
                self.agent_telemetry["ScholarshipAgent"]["last_run"] = now.isoformat()
                self.agent_telemetry["ScholarshipAgent"]["next_run"] = next_time

                # Autonomous scan for program & scholarship status transitions
                self.agent_telemetry["AdmissionAgent"]["status"] = "SCANNING"
                self.agent_telemetry["ScholarshipAgent"]["status"] = "SCANNING"
                
                # Check for approaching deadlines in knowledge graph
                for prog in self.kg.programs.values():
                    deadline = getattr(prog, "application_deadline", None)
                    if deadline:
                        try:
                            d_date = datetime.date.fromisoformat(deadline)
                            if 0 <= (d_date - datetime.date.today()).days <= 7:
                                await self.event_bus.publish(EduvaEvent(
                                    event_type="DEADLINE_APPROACHING",
                                    agent_source="AdmissionAgent",
                                    confidence=0.99,
                                    data={"program_id": prog.id, "program_name": prog.name, "deadline": deadline}
                                ))
                        except Exception:
                            pass

                self.agent_telemetry["AdmissionAgent"]["status"] = "HEALTHY"
                self.agent_telemetry["ScholarshipAgent"]["status"] = "HEALTHY"
            except Exception as e:
                print(f"[ERROR in Admission/Scholarship Loop]: {e}")
                self.agent_telemetry["AdmissionAgent"]["errors"] += 1
            await asyncio.sleep(interval)

    async def _safety_loop(self):
        interval = self.agent_telemetry["SafetyAgent"]["interval_sec"]
        while self.is_running:
            try:
                self.agent_telemetry["SafetyAgent"]["status"] = "FETCHING"
                now = datetime.datetime.now()
                self.agent_telemetry["SafetyAgent"]["last_run"] = now.isoformat()
                self.agent_telemetry["SafetyAgent"]["next_run"] = (now + datetime.timedelta(seconds=interval)).isoformat()
                
                await self.safety_agent.fetch_city_telemetry("Kathmandu")
                self.agent_telemetry["SafetyAgent"]["status"] = "HEALTHY"
            except Exception as e:
                print(f"[ERROR in SafetyAgent Loop]: {e}")
                self.agent_telemetry["SafetyAgent"]["errors"] += 1
                self.agent_telemetry["SafetyAgent"]["status"] = f"ERROR: {str(e)[:40]}"
            await asyncio.sleep(interval)

    async def _notification_loop(self):
        interval = self.agent_telemetry["NotificationAgent"]["interval_sec"]
        while self.is_running:
            try:
                self.agent_telemetry["NotificationAgent"]["status"] = "DRAINING"
                now = datetime.datetime.now()
                self.agent_telemetry["NotificationAgent"]["last_run"] = now.isoformat()
                self.agent_telemetry["NotificationAgent"]["next_run"] = (now + datetime.timedelta(seconds=interval)).isoformat()
                
                await self.notification_agent.drain_queued_alerts()
                self.agent_telemetry["NotificationAgent"]["status"] = "HEALTHY"
            except Exception as e:
                print(f"[ERROR in NotificationAgent Loop]: {e}")
                self.agent_telemetry["NotificationAgent"]["errors"] += 1
                self.agent_telemetry["NotificationAgent"]["status"] = f"ERROR: {str(e)[:40]}"
            await asyncio.sleep(interval)

    async def start_autonomous_loop(self):
        self.is_running = True
        print("[ORCHESTRATOR] 24/7 Autonomous Intelligence: Launching 5 independent concurrent agent loops...")
        
        # Launch independent async loops concurrently via asyncio.gather
        await asyncio.gather(
            self._research_loop(),
            self._verification_loop(),
            self._admission_scholarship_loop(),
            self._safety_loop(),
            self._notification_loop(),
            return_exceptions=True
        )

    def get_system_telemetry(self) -> Dict[str, Any]:
        return {
            "current_loop_step": self.current_step,
            "cycle_count": self.cycle_count,
            "is_running": self.is_running,
            "agent_schedules": self.agent_telemetry,
            "agents_status": {
                "ResearchAgent": self.research_agent.get_status(),
                "VerificationAgent": self.verification_agent.get_status(),
                "AdmissionAgent": self.admission_agent.get_status(),
                "ScholarshipAgent": self.scholarship_agent.get_status(),
                "SafetyAgent": self.safety_agent.get_status(),
                "NotificationAgent": self.notification_agent.get_status()
            },
            "knowledge_summary": self.kg.get_summary(),
            "pending_approvals_count": len(self.security_gate.get_pending_approvals()),
            "audit_trail_count": len(self.security_gate.audit_log)
        }
