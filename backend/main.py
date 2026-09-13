import asyncio
import json
from contextlib import asynccontextmanager
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.event_bus import global_event_bus, EduvaEvent
from engine.knowledge_graph import global_kg
from engine.impact_analyzer import ImpactAnalyzer
from engine.security_gate import global_security_gate
from engine.learning_engine import global_learning_engine
from engine.db import global_db
from engine.regional_intelligence import get_regional_recommendations
from data.all_nepal_universities_comprehensive import get_all_nepal_universities, get_university_by_id
from data.all_nepal_colleges_and_results import get_all_nepal_colleges, search_entrance_results
from data.nepal_courses_directory import get_all_courses, get_course_by_id, search_courses
from data.climate_disaster_data import get_climate_disaster_data
from data.seed_data import populate_initial_knowledge

from engine.living_knowledge_system import global_living_system
from engine.eligibility_engine import global_eligibility_engine
from engine.comparison_engine import global_comparison_engine
from engine.gemini_service import global_gemini_service


from agents.research_agent import ResearchAgent
from agents.verification_agent import VerificationAgent
from agents.admission_agent import AdmissionAgent
from agents.scholarship_agent import ScholarshipAgent
from agents.safety_agent import SafetyAgent
from agents.notification_agent import NotificationAgent
from agents.copilot_agent import CopilotAgent
from agents.orchestrator import OrchestratorAgent
from agents.news_agent import global_news_agent
from agents.email_guardian_agent import global_email_guardian
from agents.sop_drafter_agent import global_sop_drafter

# 1. Initialize System Components
populate_initial_knowledge(global_kg)
impact_analyzer = ImpactAnalyzer(global_kg)

research_agent = ResearchAgent(global_event_bus, global_kg)
verification_agent = VerificationAgent(global_event_bus, global_kg)
admission_agent = AdmissionAgent(global_event_bus, global_kg, verification_agent)
scholarship_agent = ScholarshipAgent(global_event_bus, global_kg)
safety_agent = SafetyAgent(global_event_bus)
notification_agent = NotificationAgent(global_event_bus, global_kg, impact_analyzer)
copilot_agent = CopilotAgent(global_kg, safety_agent)

orchestrator = OrchestratorAgent(
    global_event_bus,
    global_kg,
    global_security_gate,
    global_learning_engine,
    research_agent,
    verification_agent,
    admission_agent,
    scholarship_agent,
    safety_agent,
    notification_agent,
    copilot_agent
)

from engine.live_portal_monitor import global_live_portal_monitor

@asynccontextmanager
async def lifespan(app: FastAPI):
    loop_task = asyncio.create_task(orchestrator.start_autonomous_loop())
    monitor_task = asyncio.create_task(global_live_portal_monitor.start_background_monitoring_loop())
    yield
    orchestrator.is_running = False
    global_live_portal_monitor.is_monitoring = False
    loop_task.cancel()
    monitor_task.cancel()

app = FastAPI(title="EDUVA AI - Autonomous Education & University Intelligence", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Endpoints
@app.get("/api/status")
async def get_system_status():
    telemetry = orchestrator.get_system_telemetry()
    telemetry["database"] = global_db.get_supabase_health()
    return telemetry

@app.get("/api/database/status")
async def get_database_status():
    return global_db.get_supabase_health()

@app.get("/api/gemini/status")
async def get_gemini_status():
    return global_gemini_service.get_status()



@app.get("/api/daily-briefing")
async def get_daily_briefing(student_id: str = "std_sujan_01", city: Optional[str] = "Kathmandu"):
    student = global_kg.students.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    target_city = city or student.city or "Kathmandu"
    weather = await safety_agent.fetch_city_telemetry(target_city)
    regional_info = get_regional_recommendations(target_city)
    matched_scholarships = scholarship_agent.match_scholarships_for_student(student_id)
    notifications = notification_agent.get_student_notifications(student_id)
    news = global_news_agent.get_feed(8)
    
    tasks = []
    for app_id in student.active_applications:
        app_obj = global_kg.applications.get(app_id)
        if app_obj and app_obj.status != "SUBMITTED":
            prog = global_kg.programs.get(app_obj.program_id)
            univ = global_kg.universities.get(app_obj.university_id)
            missing = [d for d in app_obj.required_documents if d not in app_obj.submitted_documents]
            tasks.append({
                "application_id": app_id,
                "program_name": prog.name if prog else "Program",
                "university_name": univ.name if univ else "University",
                "deadline": app_obj.deadline,
                "urgency": app_obj.urgency_level,
                "missing_documents": missing
            })

    return {
        "student": student.model_dump(),
        "greeting": f"Good Morning, {student.name.split()[0]}",
        "date": "Sunday, September 13, 2026",
        "location": target_city,
        "province": regional_info.get("province", "Bagmati Province"),
        "weather": weather,
        "regional_intelligence": regional_info,
        "urgent_tasks": tasks,
        "matched_scholarships": matched_scholarships[:3],
        "recent_notifications": notifications[:5],
        "news_feed": news,
        "active_loop_status": orchestrator.current_step
    }

@app.get("/api/colleges")
async def get_colleges():
    return get_all_nepal_colleges()

@app.get("/api/nepal-universities")
@app.get("/api/universities")
async def get_all_universities():
    return get_all_nepal_universities()

@app.get("/api/universities/{univ_id}")
async def get_single_university(univ_id: str):
    u = get_university_by_id(univ_id)
    if not u:
        raise HTTPException(status_code=404, detail="University not found")
    return u

@app.get("/api/courses")
async def get_all_courses_list():
    return get_all_courses()

@app.get("/api/courses/{course_id}")
async def get_single_course(course_id: str):
    c = get_course_by_id(course_id)
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    return c

@app.get("/api/search")
async def universal_search(q: str = Query(..., min_length=1)):
    return global_living_system.universal_search(q)

class EligibilityProfileRequest(BaseModel):
    stream: str = "SCIENCE"
    gpa: float = 3.85
    subjects: Optional[List[str]] = None
    preferred_location: Optional[str] = "Kathmandu"
    budget_max_npr: Optional[int] = 1500000

@app.post("/api/eligibility/evaluate")
async def evaluate_study_eligibility(req: EligibilityProfileRequest):
    return global_eligibility_engine.evaluate_profile(
        stream=req.stream,
        gpa=req.gpa,
        subjects=req.subjects or [],
        preferred_location=req.preferred_location or "Kathmandu",
        budget_max_npr=req.budget_max_npr or 1500000
    )

class ComparisonRequest(BaseModel):
    comparison_type: str = "UNIVERSITIES"
    entity_ids: List[str]

@app.post("/api/comparison")
async def compare_education_entities(req: ComparisonRequest):
    if req.comparison_type.upper() == "UNIVERSITIES":
        return global_comparison_engine.compare_universities(req.entity_ids)
    else:
        return global_comparison_engine.compare_colleges(req.entity_ids)

@app.get("/api/living-system/telemetry")
async def get_living_system_telemetry():
    return global_living_system.get_system_telemetry()

class DiscoverySimRequest(BaseModel):
    query: str = "ABC College BCA Kathmandu"

@app.post("/api/living-system/simulate-discovery")
async def simulate_autonomous_discovery(req: DiscoverySimRequest):
    return global_living_system.trigger_autonomous_discovery(req.query)

class DeadlineChangeSimRequest(BaseModel):
    entity_id: str = "prog_ioe_be_comp"
    new_deadline: str = "2026-09-27"

@app.post("/api/living-system/simulate-deadline-change")
async def simulate_deadline_semantic_change(req: DeadlineChangeSimRequest):
    return global_living_system.process_semantic_change(
        entity_id=req.entity_id,
        change_type="DEADLINE_EXTENSION",
        new_val=req.new_deadline,
        source_info={
            "sourceId": "src_ioe_notice_board",
            "sourceName": "TU IOE Central Examination Controller",
            "sourceUrl": "https://entrance.ioe.edu.np/notices/ext-2026",
            "authorityLevel": "LEVEL_1_AUTHORITATIVE",
            "reliabilityScore": 1.0
        }
    )

@app.get("/api/portal-monitor/status")
async def get_portal_monitor_status():
    return global_live_portal_monitor.get_monitor_status()

@app.get("/api/entrance-results")
async def get_entrance_results(query: Optional[str] = ""):
    return search_entrance_results(query or "")

@app.get("/api/news")
async def get_news_feed(limit: int = 30):
    return global_news_agent.get_feed(limit)

@app.post("/api/news/{news_id}/like")
async def like_news(news_id: str):
    global_news_agent.like_post(news_id)
    return {"status": "SUCCESS"}

@app.get("/api/notifications")
async def get_notifications(student_id: str = "std_sujan_01"):
    return notification_agent.get_student_notifications(student_id)

@app.get("/api/climate-disaster")
async def get_climate_disaster():
    return get_climate_disaster_data()

@app.get("/api/email-guardian/inbox")
async def get_guardian_inbox():
    return global_email_guardian.get_inbox()

@app.delete("/api/email-guardian/delete/{mail_id}")
async def delete_spam_mail(mail_id: str):
    global_email_guardian.delete_spam(mail_id)
    return {"status": "SUCCESS"}

class ScanMailRequest(BaseModel):
    sender: str
    subject: str
    body: str

@app.post("/api/email-guardian/scan")
async def scan_incoming_email(req: ScanMailRequest):
    return global_email_guardian.scan_custom_email(req.sender, req.subject, req.body)

class SopDraftRequest(BaseModel):
    doc_type: str = "SOP"
    student_name: str = "Sujan Sharma"
    gpa: str = "3.85 GPA (+2 Science)"
    target_college: str = "Pulchowk Campus (IOE TU)"
    target_program: str = "B.E. Computer Engineering"
    career_goals: str = "developing scalable AI and resilient computational systems for Nepal"
    financial_need: Optional[str] = ""

@app.post("/api/draft-document")
async def draft_academic_document(req: SopDraftRequest):
    return global_sop_drafter.generate_document(
        doc_type=req.doc_type,
        student_name=req.student_name,
        gpa=req.gpa,
        target_college=req.target_college,
        target_program=req.target_program,
        career_goals=req.career_goals,
        financial_need=req.financial_need or ""
    )

@app.get("/api/audit-trail")
async def get_audit_trail():
    return global_security_gate.get_audit_trail(40)

@app.get("/api/pending-approvals")
async def get_pending_approvals():
    return global_security_gate.get_pending_approvals()

class ApprovalResolveRequest(BaseModel):
    approval_id: str
    approved: bool

@app.post("/api/approvals/resolve")
async def resolve_approval(req: ApprovalResolveRequest):
    success = global_security_gate.resolve_approval(req.approval_id, req.approved)
    return {"success": success}

class SimulateEventRequest(BaseModel):
    event_type: str
    new_value: Optional[str] = None

@app.post("/api/simulate-event")
async def simulate_real_world_event(req: SimulateEventRequest):
    if req.event_type == "IOE_DEADLINE_EXTENDED":
        new_date = req.new_value or "2026-10-25"
        res = await admission_agent.process_observed_program_notice(
            program_id="prog_ioe_be_comp",
            new_data={"application_deadline": new_date},
            source_id="src_ioe_portal"
        )
        global_news_agent.publish_breaking_post(
            title="🚨 BREAKING: IOE Extends Engineering Entrance Deadline!",
            content=f"Tribhuvan University IOE has officially extended the application deadline until {new_date}. All candidates are advised to complete form submission.",
            source="Routine of Nepal Banda",
            category="ENTRANCE_EXAM"
        )
        return {"status": "SUCCESS", "event_triggered": "IOE_DEADLINE_EXTENDED", "result": res}

    elif req.event_type == "NEW_SCHOLARSHIP_FOUND":
        sch_name = "Kathmandu Metropolitan STEM Leadership Fellowship 2026"
        await global_event_bus.publish(EduvaEvent(
            event_type="SCHOLARSHIP_FOUND",
            agent_source="ScholarshipAgent",
            confidence=0.99,
            data={"scholarship_name": sch_name}
        ))
        global_news_agent.publish_breaking_post(
            title="🎓 NEW SCHOLARSHIP: Kathmandu STEM Leadership Grant Announced!",
            content="100% full sponsorship announced for outstanding engineering & AI students.",
            source="Routine of Nepal Banda",
            category="SCHOLARSHIP"
        )
        return {"status": "SUCCESS", "event_triggered": "NEW_SCHOLARSHIP_FOUND"}

    elif req.event_type == "HIGH_RISK_ACTION_SUBMIT":
        eval_res = global_security_gate.evaluate_and_record_action(
            agent="ApplicationAgent",
            reason="Submit official application to IOE Pulchowk portal.",
            action_type="SUBMIT_COLLEGE_APPLICATION",
            risk_level="HIGH",
            student_id="std_sujan_01",
            student_policy="SMART_AUTO",
            payload={"program_id": "prog_ioe_be_comp", "fee_npr": 2000}
        )
        return {"status": "SUCCESS", "security_evaluation": eval_res}

    return {"status": "UNKNOWN_EVENT"}

class ChatRequest(BaseModel):
    query: str
    student_id: Optional[str] = "std_sujan_01"
    session_id: Optional[str] = "default_session"
    is_voice: Optional[bool] = False

@app.post("/api/copilot/chat")
async def copilot_chat(req: ChatRequest):
    return await copilot_agent.answer_query(
        user_query=req.query,
        student_id=req.student_id or "std_sujan_01",
        session_id=req.session_id or "default_session",
        is_voice=req.is_voice or False
    )

@app.get("/api/chat/history")
async def get_chat_history(session_id: str = "default_session"):
    return global_db.get_chat_history(session_id)

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            telemetry = orchestrator.get_system_telemetry()
            await websocket.send_json(telemetry)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
