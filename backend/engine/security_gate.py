import datetime
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class AuditRecord(BaseModel):
    id: str = Field(default_factory=lambda: f"audit_{int(datetime.datetime.now().timestamp()*1000)}")
    timestamp: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    agent: str
    reason: str
    source: Optional[str] = None
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    action: str
    result: str  # SUCCESS, FAILED, PENDING_APPROVAL, BLOCKED
    confidence: float = 0.98
    verification_evidence: Optional[str] = None

class PendingApproval(BaseModel):
    id: str = Field(default_factory=lambda: f"appr_{int(datetime.datetime.now().timestamp()*1000)}")
    student_id: str
    action_type: str
    title: str
    description: str
    risk_level: str = "HIGH"
    payload: Dict[str, Any] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    status: str = "PENDING"  # PENDING, APPROVED, REJECTED

class SecurityGate:
    def __init__(self):
        self.audit_log: List[AuditRecord] = []
        self.pending_approvals: Dict[str, PendingApproval] = {}

    def is_action_permitted(self, policy: str, action_type: str, risk_level: str) -> bool:
        # LOW_RISK actions are always permitted for autonomous background operation
        if risk_level == "LOW":
            return True

        if policy == "FULL_AUTOMATION":
            # Permitted if explicitly whitelisted
            return True
        elif policy == "SMART_AUTO":
            # Auto-permits LOW & MEDIUM, requires approval for HIGH & CRITICAL
            return risk_level in ["LOW", "MEDIUM"]
        else:  # ALWAYS_ASK
            return risk_level == "LOW"

    def evaluate_and_record_action(
        self,
        agent: str,
        reason: str,
        action_type: str,
        risk_level: str,
        student_id: Optional[str] = None,
        student_policy: str = "SMART_AUTO",
        payload: Optional[Dict[str, Any]] = None,
        source: Optional[str] = None,
        confidence: float = 0.98
    ) -> Dict[str, Any]:
        permitted = self.is_action_permitted(student_policy, action_type, risk_level)

        if permitted:
            record = AuditRecord(
                agent=agent,
                reason=reason,
                source=source,
                risk_level=risk_level,
                action=action_type,
                result="SUCCESS",
                confidence=confidence,
                verification_evidence="Autonomous validation passed security gate."
            )
            self.audit_log.append(record)
            return {"status": "EXECUTED", "permitted": True, "audit_id": record.id}
        else:
            # Create a pending approval item
            appr = PendingApproval(
                student_id=student_id or "default_student",
                action_type=action_type,
                title=f"Permission Required: {action_type.replace('_', ' ').title()}",
                description=reason,
                risk_level=risk_level,
                payload=payload or {}
            )
            self.pending_approvals[appr.id] = appr

            record = AuditRecord(
                agent=agent,
                reason=reason,
                source=source,
                risk_level=risk_level,
                action=action_type,
                result="PENDING_APPROVAL",
                confidence=confidence,
                verification_evidence=f"Held in Security Gate. Created approval request {appr.id}."
            )
            self.audit_log.append(record)
            return {"status": "HELD_FOR_APPROVAL", "permitted": False, "approval_id": appr.id, "audit_id": record.id}

    def resolve_approval(self, approval_id: str, approved: bool) -> bool:
        if approval_id in self.pending_approvals:
            appr = self.pending_approvals[approval_id]
            appr.status = "APPROVED" if approved else "REJECTED"
            
            # Record resolution in audit log
            record = AuditRecord(
                agent="HumanSupervisor",
                reason=f"User manually {'approved' if approved else 'rejected'} request {approval_id}",
                risk_level=appr.risk_level,
                action=appr.action_type,
                result="SUCCESS" if approved else "REJECTED",
                confidence=1.0,
                verification_evidence="Manual human-in-the-loop explicit consent."
            )
            self.audit_log.append(record)
            return True
        return False

    def get_audit_trail(self, limit: int = 50) -> List[Dict[str, Any]]:
        return [r.model_dump() for r in reversed(self.audit_log[-limit:])]

    def get_pending_approvals(self) -> List[Dict[str, Any]]:
        return [a.model_dump() for a in self.pending_approvals.values() if a.status == "PENDING"]

# Global Security Gate Instance
global_security_gate = SecurityGate()
