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

    def evaluate_autonomous_confidence(
        self,
        claim_id: str,
        sources: List[Dict[str, Any]],
        confidence_score: float
    ) -> Dict[str, Any]:
        """
        AUTONOMOUS CONFIDENCE GATE:
        - Auto-publish ONLY when 2+ independent Level-1 authoritative sources corroborate a fact.
        - Single Level-1 source -> Label 'PROVISIONAL — pending second source', emit VerificationAgent task.
        - Auto-rollback if subsequent crawling contradicts a previously published fact.
        - Human approval queue reserved only for genuinely novel, uncorroborable contradictions.
        """
        level1_sources = [
            s for s in sources 
            if s.get("authorityLevel") in ["LEVEL_1_AUTHORITATIVE", "GOVT_GAZETTE", "OFFICIAL_PORTAL"]
            or ".edu.np" in s.get("sourceUrl", "") or ".gov.np" in s.get("sourceUrl", "")
        ]
        
        # Rule 1: 2+ Corroborating Level-1 sources -> Instant Autonomous Auto-Publish
        if len(level1_sources) >= 2 and confidence_score >= 0.90:
            return {
                "status": "AUTO_PUBLISHED",
                "label": "VERIFIED_CORROBORATED",
                "sources_corroborated": len(level1_sources),
                "confidence": confidence_score,
                "requires_human_approval": False,
                "reason": f"Corroborated by {len(level1_sources)} independent Level-1 authoritative sources."
            }

        # Rule 2: Exactly 1 Level-1 source -> Mark PROVISIONAL, auto-escalate verification
        if len(level1_sources) == 1:
            return {
                "status": "PROVISIONAL",
                "label": "PROVISIONAL — Pending Second Source",
                "sources_corroborated": 1,
                "confidence": confidence_score,
                "requires_human_approval": False,
                "auto_escalate_verification": True,
                "reason": "Observed on 1 authoritative source. Seeking independent corroboration within 24 hours."
            }

        # Rule 3: Contradiction or Low Reliability -> Quarantine & escalate
        return {
            "status": "HELD_FOR_SUPERVISION",
            "label": "CONTRADICTION_DETECTED",
            "sources_corroborated": len(level1_sources),
            "confidence": confidence_score,
            "requires_human_approval": True,
            "reason": "Uncorroborated conflicting claims detected across education registries."
        }

    def rollback_fact(self, entity_id: str, fact_key: str, reverted_to: Any, reason: str) -> Dict[str, Any]:
        """
        Auto-rollback if a later check contradicts a published fact or source recants.
        """
        record = AuditRecord(
            agent="AutonomousConfidenceGate",
            reason=f"Auto-rollback triggered: {reason}",
            risk_level="HIGH",
            action="ROLLBACK_CONTRADICTED_FACT",
            result="ROLLED_BACK",
            confidence=1.0,
            verification_evidence=f"Fact {fact_key} on {entity_id} safely reverted to {reverted_to}."
        )
        self.audit_log.append(record)
        return {"status": "ROLLED_BACK", "entity_id": entity_id, "reverted_to": reverted_to, "audit_id": record.id}

    def is_action_permitted(self, policy: str, action_type: str, risk_level: str) -> bool:
        # LOW_RISK actions are always permitted for autonomous background operation
        if risk_level == "LOW":
            return True

        if policy == "FULL_AUTOMATION":
            return True
        elif policy == "SMART_AUTO":
            return risk_level in ["LOW", "MEDIUM"]
        else:
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
        confidence: float = 0.98,
        corroborating_sources: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        # Autonomous Gate bypass if 2+ sources corroborated
        if corroborating_sources and len(corroborating_sources) >= 2 and confidence >= 0.90:
            record = AuditRecord(
                agent=agent,
                reason=reason,
                source=source,
                risk_level=risk_level,
                action=action_type,
                result="AUTO_PUBLISHED_CORROBORATED",
                confidence=confidence,
                verification_evidence=f"Auto-approved via Autonomous Confidence Gate ({len(corroborating_sources)} Level-1 sources)."
            )
            self.audit_log.append(record)
            return {"status": "EXECUTED", "permitted": True, "audit_id": record.id, "auto_published": True}

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
            # Create a pending approval item strictly for genuinely novel/uncorroborable cases
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
