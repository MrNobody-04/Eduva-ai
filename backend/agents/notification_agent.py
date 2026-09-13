import datetime
from typing import Dict, List, Any
from engine.event_bus import EventBus, EduvaEvent
from engine.knowledge_graph import KnowledgeGraph
from engine.impact_analyzer import ImpactAnalyzer

class NotificationItem:
    def __init__(self, id: str, student_id: str, title: str, message: str, category: str, urgency: str = "MEDIUM"):
        self.id = id
        self.student_id = student_id
        self.title = title
        self.message = message
        self.category = category  # DEADLINE, SCHOLARSHIP, SAFETY, SYSTEM, ADMISSION
        self.urgency = urgency  # LOW, MEDIUM, HIGH, CRITICAL
        self.timestamp = datetime.datetime.now().isoformat()
        self.is_read = False

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "title": self.title,
            "message": self.message,
            "category": self.category,
            "urgency": self.urgency,
            "timestamp": self.timestamp,
            "is_read": self.is_read
        }

class NotificationAgent:
    def __init__(self, event_bus: EventBus, kg: KnowledgeGraph, impact_analyzer: ImpactAnalyzer):
        self.name = "NotificationAgent"
        self.event_bus = event_bus
        self.kg = kg
        self.impact_analyzer = impact_analyzer
        self.notifications: List[NotificationItem] = [
            NotificationItem(
                id="notif_seed_1",
                student_id="std_sujan_01",
                title="IOE Entrance Registration Closing Soon",
                message="TU IOE Entrance registration closes on Sept 28. Complete your document upload.",
                category="DEADLINE",
                urgency="HIGH"
            ),
            NotificationItem(
                id="notif_seed_2",
                student_id="std_sujan_01",
                title="Matched Scholarship: MOEST Merit Grant",
                message="Your 3.85 GPA qualifies you for the MOEST 100% Tuition Waiver quota.",
                category="SCHOLARSHIP",
                urgency="MEDIUM"
            )
        ]

        # Subscribe to event bus
        self.event_bus.subscribe("ADMISSION_DEADLINE_CHANGED", self.handle_deadline_change)
        self.event_bus.subscribe("SCHOLARSHIP_FOUND", self.handle_scholarship_found)

    async def handle_deadline_change(self, event: EduvaEvent):
        prog_id = event.data.get("program_id")
        if not prog_id:
            return

        impact = self.impact_analyzer.analyze_program_change(prog_id, event.data)
        for std_id in impact.get("affected_students_ids", []):
            notif = NotificationItem(
                id=f"notif_{int(datetime.datetime.now().timestamp()*1000)}",
                student_id=std_id,
                title=f"URGENT: {impact['program_name']} Deadline Revised",
                message=f"Official notice from {impact['university_name']} updated the deadline to {event.data.get('new_deadline')}.",
                category="DEADLINE",
                urgency="CRITICAL"
            )
            self.notifications.insert(0, notif)

    async def handle_scholarship_found(self, event: EduvaEvent):
        sch_name = event.data.get("scholarship_name")
        for std in self.kg.students.values():
            notif = NotificationItem(
                id=f"notif_{int(datetime.datetime.now().timestamp()*1000)}",
                student_id=std.id,
                title=f"New Matched Scholarship: {sch_name}",
                message=f"AI discovered an active scholarship matching your academic profile.",
                category="SCHOLARSHIP",
                urgency="MEDIUM"
            )
            self.notifications.insert(0, notif)

    def get_student_notifications(self, student_id: str) -> List[Dict[str, Any]]:
        return [n.to_dict() for n in self.notifications if n.student_id == student_id]

    def get_status(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "state": "RUNNING",
            "total_notifications_sent": len(self.notifications)
        }
