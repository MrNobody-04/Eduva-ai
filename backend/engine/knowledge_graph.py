import datetime
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class SourceEntity(BaseModel):
    id: str
    name: str
    url: str
    domain_type: str = "OFFICIAL"  # OFFICIAL, GOVT, INSTITUTIONAL, BLOG, UNKNOWN
    reliability_score: float = 0.95
    trust_tier: str = "VERY_HIGH"  # VERY_HIGH, HIGH, MEDIUM, LOW
    status: str = "MONITORED"  # DISCOVERED, EVALUATING, TRUSTED, MONITORED, FAILED
    last_verified: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    change_count: int = 0

class ProgramEntity(BaseModel):
    id: str
    university_id: str
    name: str
    degree: str
    faculty: str
    tuition: float
    currency: str = "NPR"
    duration_years: float = 4.0
    eligibility: str
    entrance_exam_id: Optional[str] = None
    application_deadline: str
    application_open: str
    is_active: bool = True
    last_updated: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    source_id: Optional[str] = None

class UniversityEntity(BaseModel):
    id: str
    name: str
    country: str = "Nepal"
    city: str
    official_website: str
    ranking: Optional[int] = None
    established: Optional[int] = None
    programs: List[str] = Field(default_factory=list)
    reliability_score: float = 0.98
    status: str = "ACTIVE"
    last_updated: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

class EntranceExamEntity(BaseModel):
    id: str
    name: str
    conducting_body: str
    registration_open: str
    registration_close: str
    exam_date: str
    fee: float = 2000.0
    currency: str = "NPR"
    syllabus_url: Optional[str] = None
    is_active: bool = True
    last_updated: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

class ScholarshipEntity(BaseModel):
    id: str
    name: str
    provider: str
    amount_description: str
    coverage_type: str = "FULL_TUITION"  # FULL_TUITION, PARTIAL, STIPEND
    criteria: str
    deadline: str
    target_fields: List[str] = Field(default_factory=list)
    application_url: str
    is_active: bool = True
    last_updated: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

class StudentEntity(BaseModel):
    id: str
    name: str
    email: str
    city: str = "Kathmandu"
    target_degree: str = "Undergraduate"
    target_fields: List[str] = Field(default_factory=list)
    academic_score: str = "3.8 GPA"
    interested_programs: List[str] = Field(default_factory=list)
    active_applications: List[str] = Field(default_factory=list)
    execution_policy: str = "SMART_AUTO"  # ALWAYS_ASK, SMART_AUTO, FULL_AUTOMATION
    notifications_enabled: bool = True

class ApplicationEntity(BaseModel):
    id: str
    student_id: str
    program_id: str
    university_id: str
    status: str = "IN_PROGRESS"  # DRAFT, IN_PROGRESS, READY_FOR_SUBMISSION, SUBMITTED, OFFER_RECEIVED
    required_documents: List[str] = Field(default_factory=list)
    submitted_documents: List[str] = Field(default_factory=list)
    deadline: str
    urgency_level: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    last_updated: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

class KnowledgeGapEntity(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    missing_field: str
    priority: str = "MEDIUM"  # HIGH, MEDIUM, LOW
    discovered_at: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    status: str = "OPEN"  # OPEN, INVESTIGATING, RESOLVED, UNKNOWN

class KnowledgeGraph:
    def __init__(self):
        self.sources: Dict[str, SourceEntity] = {}
        self.universities: Dict[str, UniversityEntity] = {}
        self.programs: Dict[str, ProgramEntity] = {}
        self.exams: Dict[str, EntranceExamEntity] = {}
        self.scholarships: Dict[str, ScholarshipEntity] = {}
        self.students: Dict[str, StudentEntity] = {}
        self.applications: Dict[str, ApplicationEntity] = {}
        self.knowledge_gaps: Dict[str, KnowledgeGapEntity] = {}
        self.change_history: List[Dict[str, Any]] = []

    def get_summary(self) -> Dict[str, Any]:
        return {
            "total_universities": len(self.universities),
            "total_programs": len(self.programs),
            "total_entrance_exams": len(self.exams),
            "total_scholarships": len(self.scholarships),
            "total_students": len(self.students),
            "active_applications": len([a for a in self.applications.values() if a.status != "SUBMITTED"]),
            "monitored_sources": len(self.sources),
            "open_knowledge_gaps": len([g for g in self.knowledge_gaps.values() if g.status == "OPEN"]),
            "recent_changes_count": len(self.change_history)
        }

    def record_change(self, change_type: str, entity_type: str, entity_id: str, old_value: Any, new_value: Any, reason: str, confidence: float = 0.98):
        record = {
            "timestamp": datetime.datetime.now().isoformat(),
            "change_type": change_type,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "old_value": old_value,
            "new_value": new_value,
            "reason": reason,
            "confidence": confidence
        }
        self.change_history.append(record)
        if len(self.change_history) > 100:
            self.change_history.pop(0)

# Global Knowledge Graph Instance
global_kg = KnowledgeGraph()
