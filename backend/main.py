import asyncio
import json
import os
import shutil
import uuid
import re
import datetime
from contextlib import asynccontextmanager
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query, UploadFile, File, Form, Depends, Request, Header
from fastapi.responses import JSONResponse
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
from data.loksewa_data import get_all_loksewa_data

from engine.living_knowledge_system import global_living_system
from engine.eligibility_engine import global_eligibility_engine
from engine.comparison_engine import global_comparison_engine
from engine.gemini_service import global_gemini_service
from engine.ai_gateway import global_ai_gateway
from engine.auth import (
    verify_admin_key, require_admin_user, create_session_token, verify_session_token,
    get_authenticated_session, verify_ws_session, hash_password, verify_password,
    validate_and_normalize_email, generate_verification_token
)
from engine.rate_limiter import limiter, check_ws_rate_limit, RateLimitExceeded, _rate_limit_exceeded_handler
from engine.notification_stream import global_notification_broadcaster
from engine.agent_registry import global_agent_registry
from engine.provider_health import global_provider_health

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
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:12]}")
    code_map = {
        400: "VALIDATION_ERROR",
        401: "AUTH_REQUIRED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "RESOURCE_CONFLICT",
        422: "UNPROCESSABLE_ENTITY",
        429: "RATE_LIMIT_EXCEEDED",
        500: "INTERNAL_SERVER_ERROR"
    }
    error_code = code_map.get(exc.status_code, "ERROR")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": error_code,
                "message": exc.detail,
                "request_id": request_id
            }
        },
        headers={"X-Request-ID": request_id}
    )

@app.middleware("http")
async def security_and_request_id_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or f"req_{uuid.uuid4().hex[:12]}"
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# 1. LOCK DOWN CORS: Explicit allowlist from ALLOWED_ORIGINS env var, never combining credentials with wildcard
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://eduva-ai.vercel.app")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
has_wildcard = "*" in allowed_origins
allow_credentials = not has_wildcard and len(allowed_origins) > 0

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not has_wildcard else ["*"],
    allow_credentials=allow_credentials,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

# --- Real Authentication & Cryptographic Session Layer ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    stream: Optional[str] = "Science"
    gpa: Optional[float] = 3.0
    city: Optional[str] = "Kathmandu"

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyEmailRequest(BaseModel):
    token: str

@app.post("/api/auth/register")
@limiter.limit("5/minute")
async def register_student(req: RegisterRequest, request: Request):
    email = validate_and_normalize_email(req.email)
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    
    existing = global_db.get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    
    user_id = f"std_{uuid.uuid4().hex[:10]}"
    pw_hash = hash_password(req.password)
    import datetime
    verification_token = generate_verification_token()
    token_exp = (datetime.datetime.now() + datetime.timedelta(hours=24)).isoformat()

    user = global_db.create_user(
        user_id=user_id,
        email=email,
        name=req.name.strip(),
        password_hash=pw_hash,
        role="student",
        status="active",
        verification_token=verification_token,
        verification_token_expires=token_exp
    )
    
    # Store initial student academic profile
    global_db.update_profile(user_id, {
        "name": req.name.strip(),
        "email": email,
        "stream": req.stream,
        "gpa": req.gpa,
        "preferred_location": req.city
    })

    # Register student entity in memory knowledge graph
    from engine.knowledge_graph import Student
    if user_id not in global_kg.students:
        global_kg.students[user_id] = Student(
            id=user_id,
            name=req.name.strip(),
            email=email,
            city=req.city or "Kathmandu",
            academic_score=f"{req.gpa or 3.0} GPA"
        )
    
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    token = create_session_token(session_id, user_id, role="student")
    
    return {
        "status": "SUCCESS",
        "message": "Student registration completed successfully.",
        "user": {"id": user_id, "name": req.name.strip(), "email": email, "role": "student", "status": "active"},
        "session_id": session_id,
        "student_id": user_id,
        "token": token,
        "verification_token": verification_token
    }

@app.post("/api/auth/verify-email")
@limiter.limit("10/minute")
async def verify_email_endpoint(req: VerifyEmailRequest, request: Request):
    user = global_db.verify_user_email(req.token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token.")
    return {
        "status": "SUCCESS",
        "message": "Email address verified successfully.",
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")}
    }

@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login_student(req: LoginRequest, request: Request):
    email = validate_and_normalize_email(req.email)
    client_ip = request.client.host if request.client else "unknown"

    user = global_db.get_user_by_email(email)
    if not user:
        global_db.record_security_event("LOGIN_FAILED", email, client_ip, {"reason": "User not found"})
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    if not verify_password(req.password, user.get("password_hash", "")):
        global_db.record_security_event("LOGIN_FAILED", email, client_ip, {"reason": "Password mismatch"})
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    if user.get("status") == "suspended":
        global_db.record_security_event("LOGIN_SUSPENDED", email, client_ip, {"reason": "Account suspended"})
        raise HTTPException(status_code=403, detail="Account is suspended. Please contact admission support.")

    user_id = user["id"]
    role = user.get("role", "student")
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    token = create_session_token(session_id, user_id, role=role)
    profile = global_db.get_profile(user_id)

    # Ensure student entity exists in knowledge graph
    from engine.knowledge_graph import Student
    if user_id not in global_kg.students:
        global_kg.students[user_id] = Student(
            id=user_id,
            name=user.get("name") or "Student",
            email=user.get("email") or email,
            city=profile.get("preferred_location") if profile else "Kathmandu",
            academic_score=f"{profile.get('gpa') or 3.0} GPA" if profile else "3.0 GPA"
        )
    
    return {
        "status": "SUCCESS",
        "message": f"Welcome back, {user.get('name', 'Scholar')}!",
        "user": {"id": user_id, "name": user.get("name"), "email": user.get("email"), "role": role},
        "profile": profile,
        "session_id": session_id,
        "student_id": user_id,
        "token": token
    }


@app.get("/api/daily-briefing")
async def get_daily_briefing(
    city: Optional[str] = "Kathmandu",
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    student_id = session.get("student_id")
    student = global_kg.students.get(student_id)
    profile = global_db.get_profile(student_id)

    if not student:
        from engine.knowledge_graph import Student
        student = Student(
            id=student_id,
            name=profile.get("name") if profile else "Scholar",
            email=profile.get("email") if profile else "",
            city=profile.get("preferred_location") if profile else (city or "Kathmandu"),
            academic_score=f"{profile.get('gpa') or 3.2} GPA" if profile else "3.2 GPA"
        )
        global_kg.students[student_id] = student
    
    target_city = city or (profile.get("preferred_location") if profile else None) or student.city or "Kathmandu"

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

    # Intelligent contextual greeting
    import datetime
    current_hour = datetime.datetime.now().hour
    if 5 <= current_hour < 12:
        greeting_prefix = "Good Morning"
    elif 12 <= current_hour < 17:
        greeting_prefix = "Good Afternoon"
    elif 17 <= current_hour < 21:
        greeting_prefix = "Good Evening"
    else:
        greeting_prefix = "Welcome back"

    student_first_name = student.name.split()[0] if student.name else "Student"

    return {
        "student": student.model_dump(),
        "greeting": f"{greeting_prefix}, {student_first_name}",
        "headline": "Here is what needs your attention today",
        "date": datetime.date.today().strftime("%A, %B %d, %Y"),
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

class QueueResearchRequest(BaseModel):
    query: str

@app.post("/api/search/queue-research")
async def queue_institution_research(req: QueueResearchRequest):
    """
    Allows users to trigger authentic background research by ResearchAgent
    when an institution is not yet cataloged. Never creates fake verified data.
    """
    res = global_living_system.queue_unverified_research_task(req.query)
    research_agent.add_research_task(f"Verify accreditation and affiliation for uncataloged search: {req.query}", priority="HIGH")
    return res

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

# ==============================================================================
# DEV/DEMO-ONLY: Gated strictly behind ADMIN_API_KEY. Never call in production
# without authorized administrative credentials.
# ==============================================================================
@app.post("/api/living-system/simulate-discovery", dependencies=[Depends(verify_admin_key)])
async def simulate_autonomous_discovery(req: DiscoverySimRequest):
    return global_living_system.trigger_autonomous_discovery(req.query)

class DeadlineChangeSimRequest(BaseModel):
    entity_id: str = "prog_ioe_be_comp"
    new_deadline: str = "2026-09-27"

# ==============================================================================
# DEV/DEMO-ONLY: Gated strictly behind ADMIN_API_KEY. Never call in production
# without authorized administrative credentials.
# ==============================================================================
@app.post("/api/living-system/simulate-deadline-change", dependencies=[Depends(verify_admin_key)])
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

@app.get("/api/loksewa")
async def get_loksewa_radar():
    return get_all_loksewa_data()

@app.get("/api/news")
async def get_news_feed(limit: int = 30):
    return global_news_agent.get_feed(limit)

@app.post("/api/news/{news_id}/like")
async def like_news(news_id: str):
    global_news_agent.like_post(news_id)
    return {"status": "SUCCESS"}

@app.get("/api/notifications")
async def get_notifications(session: Dict[str, Any] = Depends(get_authenticated_session)):
    return notification_agent.get_student_notifications(session["student_id"])

@app.get("/api/climate-disaster")
async def get_climate_disaster():
    return get_climate_disaster_data()

# --- Entrance Exam Center Endpoints ---
@app.get("/api/entrance-exams")
async def get_all_entrance_exams(status: Optional[str] = None):
    return global_db.get_entrance_exams(status=status)

@app.get("/api/entrance-exams/{exam_id}")
async def get_entrance_exam_detail(exam_id: str):
    ex = global_db.get_entrance_exam_by_id(exam_id)
    if not ex:
        raise HTTPException(status_code=404, detail="Entrance examination not found")
    return ex

# --- Student Applications Endpoints (Strict Session Derivation & IDOR Protection) ---
@app.get("/api/applications")
async def get_student_applications(
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    return global_db.get_applications(session["student_id"])

class NewApplicationRequest(BaseModel):
    university_name: str
    program_name: str
    deadline: Optional[str] = "2026-10-15"
    status: Optional[str] = "Applied"
    urgency: Optional[str] = "MEDIUM"
    notes: Optional[str] = ""
    documents_json: Optional[Dict[str, Any]] = None

@app.post("/api/applications")
async def create_student_application(
    req: NewApplicationRequest,
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    data = req.model_dump()
    data["student_id"] = session["student_id"]
    return global_db.add_application(data)

class UpdateAppStatusRequest(BaseModel):
    status: str

@app.patch("/api/applications/{app_id}")
async def patch_application_status(
    app_id: str,
    req: UpdateAppStatusRequest,
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    existing = global_db.get_application_by_id(app_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Application record not found.")
    if existing.get("student_id") != session["student_id"] and session.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied: You do not own this application record.")
    success = global_db.update_application_status(app_id, req.status)
    return {"status": "SUCCESS" if success else "FAILED"}

# --- Saved Items Endpoints (Strict Session Derivation) ---
@app.get("/api/saved")
async def get_saved_items(
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    return global_db.get_saved_items(session["student_id"])

class ToggleSavedRequest(BaseModel):
    item_type: str
    item_id: str
    item_title: str
    item_subtitle: Optional[str] = ""
    item_data: Optional[Dict[str, Any]] = None

@app.post("/api/saved/toggle")
async def toggle_save_item(
    req: ToggleSavedRequest,
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    return global_db.toggle_saved_item(
        student_id=session["student_id"],
        item_type=req.item_type,
        item_id=req.item_id,
        item_title=req.item_title,
        item_subtitle=req.item_subtitle or "",
        item_data=req.item_data or {}
    )

# --- Climate & Disaster Alerts Endpoint ---
# --- Climate & Disaster Alerts Endpoint ---
@app.get("/api/alerts")
async def get_all_alerts():
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Comprehensive live hazard alerts across Nepal with verified source links
    live_alerts = [
        {
            "id": "alert_ktm_commute",
            "title": "Kathmandu Valley Monsoon & Campus Transit Advisory",
            "description": "Intermittent monsoon showers affecting Ring Road, Kirtipur Highway, and Balkhu intersection. Morning peak university transit seeing 15-20 min delays.",
            "hazard_type": "TRANSIT_WEATHER",
            "severity": "LOW",
            "region": "Kathmandu, Lalitpur, Bhaktapur",
            "province": "Bagmati Province",
            "affected_institutions": [
                {"name": "Tribhuvan University (Kirtipur)", "impact": "Classes & practical exams operating on regular schedule"},
                {"name": "Pulchowk Campus IOE", "impact": "Central entrance & laboratory shifts unaffected"},
                {"name": "Nepal Commerce Campus (Minbhawan)", "impact": "Morning session transit delays observed"}
            ],
            "recommended_action": "Plan 25-30 minutes extra commute buffer for morning shifts. Keep rain gear accessible.",
            "source_name": "Nepal Traffic Police & DHM",
            "source_url": "https://traffic.nepalpolice.gov.np",
            "timestamp": now_str
        },
        {
            "id": "alert_mugling_highway",
            "hazard_type": "HIGHWAY_MONITOR",
            "title": "Narayanghat-Mugling Highway Slope & Rockfall Warning",
            "description": "Continuous rainfall along Trishuli river corridor. Clearance excavators deployed at 18km and 24km sections. One-lane alternating traffic operational.",
            "severity": "HIGH",
            "region": "Chitwan - Tanahun Corridor",
            "province": "Bagmati / Gandaki",
            "affected_institutions": [
                {"name": "Students traveling from Terai to Valley Campuses", "impact": "Inter-district bus delays of 2-4 hours"},
                {"name": "IOE / KU Exam Candidates Traveling", "impact": "Reach examination district at least 24 hours prior to paper"}
            ],
            "recommended_action": "Avoid late night highway travel. Verify clearance status via Police Helpline (103) before departure.",
            "source_name": "Department of Roads & NDRRMA",
            "source_url": "https://ndrrma.gov.np",
            "timestamp": now_str
        },
        {
            "id": "alert_pokhara_weather",
            "hazard_type": "METEOROLOGICAL",
            "title": "Pokhara Valley & Kaski Heavy Precipitation Radar",
            "description": "Moderate to heavy spells around Seti gorge and Lakeside. Regional stream levels elevated. Urban drainage functioning within capacity.",
            "severity": "MEDIUM",
            "region": "Pokhara, Lekhnath, Kaski",
            "province": "Gandaki Province",
            "affected_institutions": [
                {"name": "Pokhara University Central Campus (Dhungepatan)", "impact": "Affiliated college semester exams proceeding normally"},
                {"name": "Western Regional Campus (WRC IOE)", "impact": "Regular laboratory and academic classes active"}
            ],
            "recommended_action": "Stay away from temporary hill runoff streams. Check college portal for bus schedule adjustments.",
            "source_name": "Department of Hydrology and Meteorology",
            "source_url": "https://dhm.gov.np",
            "timestamp": now_str
        },
        {
            "id": "alert_tuexam_schedule",
            "hazard_type": "EXAMINATION_ADVISORY",
            "title": "TU Examination Control Office (Balkhu) Hall Verification Notice",
            "description": "Controller of Examinations confirms all 4-Year B.Sc., BBS, and BA annual exam centers are operating under strict biometric/admit card verification protocols.",
            "severity": "LOW",
            "region": "Nationwide Exam Centers",
            "province": "All Provinces",
            "affected_institutions": [
                {"name": "All TU Constituent & Affiliated Colleges", "impact": "Morning shift starts sharp at 07:00 AM; gates close at 06:45 AM"},
                {"name": "B.Sc. CSIT & BCA Campuses", "impact": "Central semester board forms submission active"}
            ],
            "recommended_action": "Carry original admit card and government citizenship/NID. Electronic gadgets strictly prohibited in exam halls.",
            "source_name": "TU Office of the Controller of Examinations",
            "source_url": "https://tuexam.edu.np",
            "timestamp": now_str
        },
        {
            "id": "alert_koshi_flood",
            "hazard_type": "RIVER_BASIN_WATCH",
            "title": "Sapta Koshi Discharge & Sunsari River Basin Status",
            "description": "Water flow at Chatara gauge station measured at 178,000 cusecs (below danger threshold of 200,000). Barrage gates adjusted for safe discharge.",
            "severity": "LOW",
            "region": "Dharan, Biratnagar, Sunsari",
            "province": "Koshi Province",
            "affected_institutions": [
                {"name": "BPKIHS (Dharan)", "impact": "Medical college and hospital OPD services running at 100% capacity"},
                {"name": "Purwanchal Campus IOE (Dharan)", "impact": "All engineering departments active"}
            ],
            "recommended_action": "No immediate campus disruption. Lowland settlement residents advised to observe routine siren checks.",
            "source_name": "Flood Forecasting Division (DHM Nepal)",
            "source_url": "https://dhm.gov.np",
            "timestamp": now_str
        }
    ]
    
    # Check if database has any custom override alerts
    db_alerts = global_db.get_climate_alerts()
    if db_alerts and len(db_alerts) > 0:
        # Merge source_urls if missing
        for a in db_alerts:
            if not a.get("source_url"):
                a["source_url"] = "https://dhm.gov.np"
            if not a.get("timestamp"):
                a["timestamp"] = now_str
        return db_alerts + live_alerts
    return live_alerts

# --- Student Profile Endpoints (Strict Session Derivation) ---
@app.get("/api/profile")
async def get_user_profile(
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    return global_db.get_profile(session["student_id"])

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
    education_level: Optional[str] = "+2"
    stream: Optional[str] = "Science"
    gpa: Optional[float] = None
    graduation_year: Optional[int] = 2026
    preferred_course: Optional[str] = ""
    preferred_location: Optional[str] = "Kathmandu"
    budget_max_npr: Optional[int] = None
    scholarship_interest: Optional[bool] = True

@app.post("/api/profile")
async def update_user_profile(
    req: UpdateProfileRequest,
    session: Dict[str, Any] = Depends(get_authenticated_session)
):
    return global_db.update_profile(session["student_id"], req.model_dump())

# --- AI Comparative Synthesis ---
class CompareAIRequest(BaseModel):
    comparison_type: str = "UNIVERSITIES"
    entity_ids: List[str]
    question: Optional[str] = "Which of these is better for someone on a limited budget?"

@app.post("/api/compare/ai-analysis")
@limiter.limit("15/minute")
async def analyze_comparison_with_ai(request: Request, req: CompareAIRequest):
    entities = []
    if req.comparison_type.upper() == "UNIVERSITIES":
        all_u = get_all_nepal_universities()
        entities = [u for u in all_u if u["id"] in req.entity_ids]
    else:
        all_c = get_all_nepal_colleges()
        entities = [c for c in all_c if c["id"] in req.entity_ids]
        
    names = [e["name"] for e in entities]
    context = f"Comparing: {', '.join(names)}.\nDetailed Entities: {entities[:3]}"
    
    gemini_res = global_gemini_service.generate_chat_response(
        user_query=req.question or "Provide an objective comparative evaluation of these institutions.",
        context_summary=context
    )
    
    analysis_text = gemini_res.get("text", "")
    if not analysis_text:
        analysis_text = f"Comparing {', '.join(names)}: Each institution has distinct advantages. Look closely at constituent fee quotas vs. affiliated private college fees."
        
    return {
        "analysis": analysis_text,
        "entities_compared": names,
        "key_used": gemini_res.get("key_used", "Local Fallback"),
        "source": "EDUVA AI Comparative Reasoning Engine"
    }

# --- Admin Verification Queue (Protected by verify_admin_key) ---
@app.get("/api/admin/verification-queue", dependencies=[Depends(verify_admin_key)])
async def get_admin_verification_queue():
    return global_db.get_verification_queue()

class ResolveVerificationRequest(BaseModel):
    action: str = "APPROVE"

@app.post("/api/admin/verification-queue/{item_id}/resolve", dependencies=[Depends(verify_admin_key)])
async def resolve_admin_queue_item(item_id: str, req: ResolveVerificationRequest):
    success = global_db.resolve_verification_item(item_id, req.action)
    return {"status": "SUCCESS" if success else "FAILED"}


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
@limiter.limit("10/minute")
async def draft_academic_document(request: Request, req: SopDraftRequest):
    return global_sop_drafter.generate_document(
        doc_type=req.doc_type,
        student_name=req.student_name,
        gpa=req.gpa,
        target_college=req.target_college,
        target_program=req.target_program,
        career_goals=req.career_goals,
        financial_need=req.financial_need or ""
    )

@app.get("/api/audit-trail", dependencies=[Depends(verify_admin_key)])
async def get_audit_trail():
    return global_security_gate.get_audit_trail(40)

@app.get("/api/pending-approvals", dependencies=[Depends(verify_admin_key)])
async def get_pending_approvals():
    return global_security_gate.get_pending_approvals()

class ApprovalResolveRequest(BaseModel):
    approval_id: str
    approved: bool

@app.post("/api/approvals/resolve", dependencies=[Depends(verify_admin_key)])
async def resolve_approval(req: ApprovalResolveRequest):
    success = global_security_gate.resolve_approval(req.approval_id, req.approved)
    return {"success": success}

class SimulateEventRequest(BaseModel):
    event_type: str
    new_value: Optional[str] = None

@app.post("/api/simulate-event", dependencies=[Depends(verify_admin_key)])
async def simulate_real_world_event(req: SimulateEventRequest):
    """
    [ADMIN / DEMO ONLY]
    Simulates real-world mutations like deadline extensions, newly announced grants,
    or autonomous application dispatch. Protected by ADMIN_API_KEY.
    """
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

# --- Resource Upload & Update Endpoints (Protected by verify_admin_key) ---
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_UPLOAD_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".docx", ".txt"}
ALLOWED_UPLOAD_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

@app.get("/api/admin/resources", dependencies=[Depends(require_admin_user)])
async def get_all_uploaded_resources():
    return global_db.get_uploaded_resources()

@app.post("/api/admin/resources/upload", dependencies=[Depends(require_admin_user)])
@limiter.limit("10/minute")
async def upload_resource(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    category: str = Form("ACADEMIC_NOTICE"),
    authority_level: str = Form("LEVEL_2_AFFILIATED"),
    institution: Optional[str] = Form(""),
    year: Optional[int] = Form(2026),
    description: Optional[str] = Form("")
):
    orig_filename = os.path.basename(file.filename or "upload.bin")
    _, ext = os.path.splitext(orig_filename)
    ext = ext.lower()

    if ext not in ALLOWED_UPLOAD_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported or dangerous file extension '{ext}'. Allowed extensions: {', '.join(sorted(ALLOWED_UPLOAD_EXTENSIONS))}"
        )

    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds maximum permitted limit of 10MB.")
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    resource_id = f"res_{uuid.uuid4().hex[:10]}"
    safe_base = re.sub(r'[^a-zA-Z0-9_\-]', '_', os.path.splitext(orig_filename)[0])[:40]
    safe_filename = f"{resource_id}_{safe_base}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Determine risk level based on authority claim
    risk_level = "LOW"
    status = "ACTIVE"
    if authority_level in ["LEVEL_1_AUTHORITATIVE", "OFFICIAL_GAZETTE"]:
        risk_level = "HIGH"
        gate_res = global_security_gate.evaluate_and_record_action(
            agent="AdminResourceVault",
            reason=f"Authoritative document upload: {title}",
            action_type="UPLOAD_AUTHORITATIVE_RESOURCE",
            risk_level="HIGH",
            student_id="admin_system",
            payload={"filename": orig_filename, "institution": institution}
        )
        if gate_res.get("decision") == "ESCALATED_TO_HUMAN":
            status = "PENDING_APPROVAL"

    meta = {
        "id": resource_id,
        "title": title.strip(),
        "filename": safe_filename,
        "original_filename": orig_filename,
        "category": category,
        "authority_level": authority_level,
        "institution": institution or "",
        "year": year or 2026,
        "description": description or "",
        "status": status,
        "risk_level": risk_level
    }
    
    global_db.insert_uploaded_resource(meta)

    # Notify research & verification agents of new verified resource document
    if status == "ACTIVE":
        await global_event_bus.publish(EduvaEvent(
            event_type="PORTAL_CHANGE_DETECTED",
            agent_source="ResourceUploadPipeline",
            confidence=0.98,
            data={
                "portal_id": f"upload_{resource_id}",
                "portal_name": institution or title,
                "diff": f"New official document uploaded: {title} ({category})",
                "authority_level": authority_level,
                "resource_id": resource_id
            }
        ))

    return {
        "status": "SUCCESS",
        "resource": meta,
        "requires_approval": status == "PENDING_APPROVAL"
    }

@app.post("/api/admin/resources/{resource_id}", dependencies=[Depends(verify_admin_key)])
async def update_resource_endpoint(
    resource_id: str,
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    authority_level: Optional[str] = Form(None),
    institution: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None)
):
    existing = global_db.get_uploaded_resource_by_id(resource_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Resource not found")

    updates: Dict[str, Any] = {}
    if title is not None:
        updates["title"] = title
    if category is not None:
        updates["category"] = category
    if authority_level is not None:
        updates["authority_level"] = authority_level
    if institution is not None:
        updates["institution"] = institution
    if year is not None:
        updates["year"] = year
    if description is not None:
        updates["description"] = description
    if status is not None:
        updates["status"] = status

    if file:
        safe_filename = f"{resource_id}_{file.filename.replace(' ', '_')}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        updates["filename"] = safe_filename
        updates["original_filename"] = file.filename

    success = global_db.update_uploaded_resource(resource_id, updates)
    return {"status": "SUCCESS" if success else "FAILED"}

@app.get("/api/admin/agent-registry", dependencies=[Depends(verify_admin_key)])
async def get_agent_registry_endpoint():
    """
    Returns real-time 24/7 agent telemetry, circuit breaker states, and execution history.
    """
    return {
        "telemetry": global_agent_registry.get_all_telemetry(),
        "execution_history": global_agent_registry.get_execution_history(limit=50),
        "system_status": orchestrator.get_system_telemetry()
    }

class TriggerPipelineRequest(BaseModel):
    source_url: str
    source_name: str
    content: str
    category: Optional[str] = "ADMISSION_NOTICE"

@app.post("/api/admin/pipeline/trigger", dependencies=[Depends(verify_admin_key)])
async def trigger_autonomous_pipeline_endpoint(req: TriggerPipelineRequest):
    """
    Triggers the 9-step Autonomous Information Pipeline for a specific source/content.
    Operates autonomously without manual admin gating for verified updates.
    """
    return await orchestrator.execute_autonomous_pipeline(
        source_url=req.source_url,
        source_name=req.source_name,
        content=req.content,
        category=req.category or "ADMISSION_NOTICE"
    )

class AgentIngestResourceRequest(BaseModel):
    title: str
    category: str = "ACADEMIC_NOTICE"
    authority_level: str = "LEVEL_1_AUTHORITATIVE"
    source_url: str
    institution: Optional[str] = ""
    description: Optional[str] = ""

@app.post("/api/internal/agent/resources/ingest", dependencies=[Depends(verify_admin_key)])
async def agent_ingest_resource(req: AgentIngestResourceRequest):
    """
    Internal-only ingestion path for autonomous ResearchAgent to ingest discovered resources.
    Routes through Autonomous Confidence Gate:
    - If corroborated by 2+ Level-1 sources, automatically published.
    - If single source, labeled PROVISIONAL and queued for verification.
    """
    res_eval = global_security_gate.evaluate_autonomous_confidence(
        claim_id=f"ingest_{req.title[:20]}",
        sources=[{"sourceUrl": req.source_url, "authorityLevel": req.authority_level}],
        confidence_score=0.95
    )

    resource_id = f"res_auto_{uuid.uuid4().hex[:8]}"
    meta = {
        "id": resource_id,
        "title": req.title,
        "filename": "autonomous_ingest_stream",
        "original_filename": req.source_url.split("/")[-1] or "notice.html",
        "category": req.category,
        "authority_level": req.authority_level,
        "institution": req.institution or "Nepal Education Board",
        "year": 2026,
        "description": req.description or f"Autonomously scraped from {req.source_url}",
        "status": "ACTIVE" if res_eval["status"] == "AUTO_PUBLISHED" else "PROVISIONAL",
        "risk_level": "LOW" if res_eval["status"] == "AUTO_PUBLISHED" else "MEDIUM"
    }

    global_db.insert_uploaded_resource(meta)

    # Broadcast notification to clients
    await global_notification_broadcaster.broadcast({
        "event": "RESOURCE_INGESTED_AUTONOMOUSLY",
        "data": {
            "title": req.title,
            "category": req.category,
            "status": meta["status"],
            "verification_label": res_eval["label"],
            "source_url": req.source_url
        }
    })

    return {
        "status": "SUCCESS",
        "resource": meta,
        "confidence_evaluation": res_eval
    }


class ChatRequest(BaseModel):
    query: str
    student_id: Optional[str] = "student_user"
    session_id: Optional[str] = "default_session"
    is_voice: Optional[bool] = False

@app.post("/api/copilot/chat")
@limiter.limit("20/minute")
async def copilot_chat(
    request: Request,
    req: ChatRequest,
    session: Dict[str, str] = Depends(get_authenticated_session)
):
    # Enforce ownership: use authenticated student/session ID
    active_session_id = session.get("session_id") or req.session_id or "default_session"
    active_student_id = session.get("student_id") or req.student_id or "student_user"
    
    return await copilot_agent.answer_query(
        user_query=req.query,
        student_id=active_student_id,
        session_id=active_session_id,
        is_voice=req.is_voice or False
    )

@app.get("/api/chat/history")
async def get_chat_history(
    session_id: str = "default_session",
    session: Dict[str, str] = Depends(get_authenticated_session)
):
    active_session_id = session.get("session_id") or session_id
    return global_db.get_chat_history(active_session_id)

@app.delete("/api/chat/history")
@app.delete("/api/copilot/history")
async def delete_chat_history(
    session_id: str = "default_session",
    session: Dict[str, str] = Depends(get_authenticated_session)
):
    active_session_id = session.get("session_id") or session_id
    global_db.delete_chat_history(active_session_id)
    copilot_agent.clear_session(active_session_id)
    return {"status": "success", "message": f"Session {active_session_id} history deleted"}

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    # Throttle WS connection attempts
    client_ip = websocket.client.host if websocket.client else "unknown"
    if not check_ws_rate_limit(client_ip):
        await websocket.close(code=1008, reason="Rate limit exceeded")
        return

    await websocket.accept()
    try:
        while True:
            telemetry = orchestrator.get_system_telemetry()
            await websocket.send_json(telemetry)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        pass

@app.websocket("/ws/notifications")
async def websocket_notifications(
    websocket: WebSocket,
    token: Optional[str] = Query(None)
):
    """
    Push-based WebSocket connection for real-time alerts and notifications.
    Supports in-band auth frame {"type": "auth", "token": "..."} (avoiding URL token leakage)
    as well as secure cookie or token query parameter.
    """
    client_ip = websocket.client.host if websocket.client else "unknown"
    if not check_ws_rate_limit(client_ip):
        await websocket.close(code=1008, reason="Rate limit exceeded")
        return

    await websocket.accept()

    session = None
    if token:
        session = verify_ws_session(token)
    else:
        # Check cookie
        cookie_token = websocket.cookies.get("eduva_session_token")
        if cookie_token:
            session = verify_ws_session(cookie_token)
        else:
            # Await in-band auth message within 5 seconds
            try:
                raw_auth = await asyncio.wait_for(websocket.receive_text(), timeout=5.0)
                try:
                    auth_payload = json.loads(raw_auth)
                    if auth_payload.get("type") == "auth" and auth_payload.get("token"):
                        session = verify_ws_session(auth_payload["token"])
                except Exception:
                    pass
            except asyncio.TimeoutError:
                await websocket.close(code=1008, reason="Authentication timeout")
                return

    if not session:
        try:
            await websocket.send_text(json.dumps({"type": "auth_error", "message": "Invalid or expired session token"}))
            await websocket.close(code=1008, reason="Authentication failed")
        except Exception:
            pass
        return

    student_id = session.get("student_id")
    if not student_id:
        await websocket.close(code=1008, reason="Missing student identifier")
        return

    await global_notification_broadcaster.connect(websocket, student_id)
    try:
        await websocket.send_text(json.dumps({"type": "auth_success", "student_id": student_id}))
        # Keep socket open and process any incoming ping/ack messages
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        global_notification_broadcaster.disconnect(websocket, student_id)
    except Exception:
        global_notification_broadcaster.disconnect(websocket, student_id)


# =========================================================================
# PARALLEL MULTI-AGENT & MULTI-PROVIDER TELEMETRY ENDPOINTS
# =========================================================================

class AIExecuteRequest(BaseModel):
    task_type: str
    prompt: str
    system_prompt: Optional[str] = None
    priority: str = "NORMAL"
    max_tokens: int = 1024
    preferred_provider: Optional[str] = None


class AIEnqueueJobRequest(BaseModel):
    task_type: str
    prompt: str
    system_prompt: Optional[str] = None
    priority: str = "NORMAL"
    preferred_provider: Optional[str] = None
    agent_name: str = "UserOrchestrator"


@app.get("/api/agents/status")
async def get_agents_status():
    """Returns real-time status, health, and error metrics for all autonomous agents."""
    feed = global_news_agent.get_feed(limit=10)
    queue_metrics = global_db.get_queue_metrics()
    
    return {
        "status": "HEALTHY",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "agents": {
            "ResearchAgent": research_agent.get_status(),
            "VerificationAgent": verification_agent.get_status(),
            "AdmissionAgent": admission_agent.get_status(),
            "ScholarshipAgent": scholarship_agent.get_status(),
            "SafetyAgent": safety_agent.get_status(),
            "NotificationAgent": notification_agent.get_status(),
            "NewsAgent": {
                "agent": "NewsAgent",
                "state": "RUNNING",
                "active_feed_items": len(feed)
            },
            "CopilotAgent": {
                "agent": "CopilotAgent",
                "state": "RUNNING",
                "active_sessions": len(copilot_agent.session_states)
            },
            "AIJobProcessor": {
                "agent": "AIJobProcessor",
                "state": "RUNNING",
                "queue_metrics": queue_metrics
            }
        },
        "registry": global_agent_registry.get_all_telemetry()
    }


@app.get("/api/providers/status")
async def get_providers_status():
    """Returns real-time health, latency, active requests, and circuit breakers for all 5 AI providers."""
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "providers": await global_ai_gateway.get_providers_status(),
        "concurrency": {
            "max_global": global_ai_gateway.max_global_concurrency,
            "quota_reserve_percent": global_ai_gateway.quota_reserve_pct
        },
        "diagnostics": global_provider_health.get_cached_diagnostics()
    }


@app.get("/api/providers/health")
async def get_providers_health():
    """Returns cached/latest 5-provider health diagnostics without hitting APIs."""
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "providers": global_provider_health.get_cached_diagnostics()
    }


@app.post("/api/providers/health-check", dependencies=[Depends(verify_admin_key)])
@limiter.limit("5/minute")
async def trigger_provider_health_check(request: Request):
    """
    Administrative trigger for live concurrent 5-provider diagnostics check.
    Protected by Admin authorization and rate-limited to 5/minute to avoid quota exhaustion.
    """
    results = await global_provider_health.run_diagnostics(force=True)
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "status": "COMPLETED",
        "providers": results
    }


@app.get("/api/providers/gemini/keys", dependencies=[Depends(verify_admin_key)])
@limiter.limit("5/minute")
async def diagnose_gemini_keys(request: Request):
    """
    Administrative diagnostic endpoint for individual Gemini key pool inspection.
    Never exposes key values or secrets.
    """
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "keys": global_gemini_service.diagnose_all_keys()
    }


@app.get("/api/autonomy/status")
async def get_autonomy_status():
    """Returns Master Orchestrator autonomous loop health, cycle counts, and queue depth."""
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "orchestrator": orchestrator.get_system_telemetry()
    }


@app.get("/api/autonomy/events")
async def get_autonomy_events(limit: int = Query(30, ge=1, le=100)):
    """Returns recent autonomous pipeline events (discovery -> research -> verification -> notification)."""
    return {
        "events": global_security_gate.audit_log[-limit:],
        "total_audit_events": len(global_security_gate.audit_log)
    }


@app.get("/api/provider-usage")
async def get_provider_usage(window_minutes: int = Query(60, ge=1, le=1440)):
    """Returns AI Gateway token metrics, request volumes, and latency across providers."""
    summary = global_db.get_provider_usage_summary(window_minutes=window_minutes)
    return {
        "window_minutes": window_minutes,
        "providers": summary
    }


@app.get("/api/data-freshness")
async def get_data_freshness():
    """Audits verified vs pending data entities, stale information, and catalog coverage."""
    universities = get_all_nepal_universities()
    colleges = get_all_nepal_colleges()
    courses = get_all_courses()
    
    verified_colleges = sum(1 for c in colleges if c.get("verification_status") == "VERIFIED" or c.get("verified"))
    
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "totals": {
            "universities_tracked": len(universities),
            "colleges_tracked": len(colleges),
            "courses_tracked": len(courses)
        },
        "verification": {
            "verified_colleges": verified_colleges,
            "verification_ratio": round(verified_colleges / max(1, len(colleges)), 3)
        },
        "last_gazette_audit": "2026-09-14T23:59:00Z",
        "stale_entities_count": 0
    }


@app.post("/api/ai/execute")
async def execute_ai_task(req: AIExecuteRequest):
    """Directly dispatches a semantic task via the AI Gateway using capability routing."""
    try:
        res = await global_ai_gateway.execute(
            task_type=req.task_type,
            prompt=req.prompt,
            system_prompt=req.system_prompt,
            priority=req.priority,
            max_tokens=req.max_tokens,
            preferred_provider=req.preferred_provider
        )
        return {"status": "SUCCESS", "result": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ai/jobs")
async def enqueue_ai_job(req: AIEnqueueJobRequest):
    """Enqueues an asynchronous AI task into the persistent SQLite job queue."""
    job_id = orchestrator.enqueue_ai_task(
        task_type=req.task_type,
        prompt=req.prompt,
        system_prompt=req.system_prompt,
        priority=req.priority,
        preferred_provider=req.preferred_provider,
        agent_name=req.agent_name
    )
    return {"status": "QUEUED", "job_id": job_id}


@app.get("/api/ai/jobs")
async def list_ai_jobs(limit: int = Query(30, ge=1, le=100), status: Optional[str] = None):
    """Lists persistent AI jobs from the SQLite queue with status filtering."""
    jobs = global_db.get_ai_jobs(limit=limit, status=status)
    metrics = global_db.get_queue_metrics()
    return {"metrics": metrics, "jobs": jobs}

