import datetime
from typing import Dict, List, Any
from .knowledge_graph import KnowledgeGraph

class ImpactAnalyzer:
    def __init__(self, kg: KnowledgeGraph):
        self.kg = kg

    def analyze_program_change(self, program_id: str, change_event: Dict[str, Any]) -> Dict[str, Any]:
        program = self.kg.programs.get(program_id)
        if not program:
            return {"affected_students": 0, "affected_applications": 0, "tasks_created": 0}

        university = self.kg.universities.get(program.university_id)
        univ_name = university.name if university else "University"

        affected_students = []
        affected_applications = []
        generated_tasks = []

        # 1. Find interested students
        for student in self.kg.students.values():
            is_interested = (
                program_id in student.interested_programs or 
                program.name.lower() in [f.lower() for f in student.target_fields] or
                any(p in student.interested_programs for p in university.programs if university)
            )

            if is_interested:
                affected_students.append(student.id)

        # 2. Find active applications
        for app in self.kg.applications.values():
            if app.program_id == program_id and app.status != "SUBMITTED":
                affected_applications.append(app.id)
                # Recalculate Urgency
                try:
                    deadline_date = datetime.date.fromisoformat(program.application_deadline)
                    today = datetime.date.today()
                    days_left = (deadline_date - today).days
                    if days_left <= 3:
                        app.urgency_level = "CRITICAL"
                    elif days_left <= 7:
                        app.urgency_level = "HIGH"
                    else:
                        app.urgency_level = "MEDIUM"
                except Exception:
                    app.urgency_level = "HIGH"

                # Check missing documents
                missing = [doc for doc in app.required_documents if doc not in app.submitted_documents]
                if missing:
                    generated_tasks.append({
                        "task_id": f"task_doc_{app.id}_{int(datetime.datetime.now().timestamp())}",
                        "student_id": app.student_id,
                        "title": f"Upload missing documents for {program.name} ({univ_name})",
                        "description": f"Deadline updated to {program.application_deadline}. Missing: {', '.join(missing)}",
                        "urgency": app.urgency_level,
                        "status": "PENDING"
                    })

        return {
            "program_name": program.name,
            "university_name": univ_name,
            "affected_students_count": len(affected_students),
            "affected_students_ids": affected_students,
            "affected_applications_count": len(affected_applications),
            "affected_applications_ids": affected_applications,
            "generated_tasks": generated_tasks,
            "impact_summary": f"Detected change in {program.name}. {len(affected_students)} students and {len(affected_applications)} active applications analyzed."
        }
