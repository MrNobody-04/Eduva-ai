from typing import Dict, List, Any

# Permission-Based AI Email Inbox Guardian & Spam Defense
SIMULATED_STUDENT_INBOX = [
    {
        "id": "mail_01",
        "sender": "admissions@ioe.edu.np",
        "sender_name": "TU IOE Entrance Examination Board",
        "subject": "Official Confirmation: B.E. Computer Engineering Document Verification",
        "preview": "Dear Sujan, Your uploaded citizenship card and +2 transcript have been successfully verified for Pulchowk Campus admission...",
        "received_at": "Today, 10:45 AM",
        "category": "OFFICIAL_ADMISSION",
        "is_spam": False,
        "urgency": "HIGH",
        "suggested_action": "Download Verification Token & Proceed to Physical Enrollment"
    },
    {
        "id": "mail_02",
        "sender": "unrecognized-agent@scholarship-lottery-nepal.xyz",
        "sender_name": "Direct Foreign Scholarship Board",
        "subject": "URGENT: You Won $50,000 UK University Grant - Send $200 Processing Fee",
        "preview": "Congratulations! You have been selected randomly for 100% scholarship. Deposit NPR 25,000 within 24 hours to secure seat...",
        "received_at": "Today, 08:30 AM",
        "category": "SCAM_SPAM",
        "is_spam": True,
        "urgency": "CRITICAL_FRAUD",
        "spam_reason": "Advance-fee fraud attempt. Unverified domain (.xyz). Not affiliated with any official university board.",
        "suggested_action": "Quarantined by EDUVA AI Security Gate"
    },
    {
        "id": "mail_03",
        "sender": "kucat.admissions@ku.edu.np",
        "sender_name": "Kathmandu University Admissions Office",
        "subject": "KUCAT 2026 Computer-Based Test Center & Admit Card Available",
        "preview": "Your computer-based test is scheduled at Dhulikhel Main Campus Lab 4 on Sept 25 at 11:00 AM. Please bring printed admit card...",
        "received_at": "Yesterday, 04:15 PM",
        "category": "EXAM_ADMIT_CARD",
        "is_spam": False,
        "urgency": "HIGH",
        "suggested_action": "Print Admit Card & Review Exam Rules"
    },
    {
        "id": "mail_04",
        "sender": "scholarships.moest@gov.np",
        "sender_name": "Ministry of Education (MOEST)",
        "subject": "National Merit Engineering Quota Verification Notification",
        "preview": "Notice to IOE Entrance Rank Holders: Online document upload portal for MOEST 100% tuition waiver seats opens Oct 1...",
        "received_at": "Sept 11, 02:00 PM",
        "category": "SCHOLARSHIP_AWARD",
        "is_spam": False,
        "urgency": "MEDIUM",
        "suggested_action": "Set Calendar Reminder for Oct 1 Portal Opening"
    }
]

class EmailGuardianAgent:
    def __init__(self):
        self.name = "EmailGuardianAgent"
        self.inbox = SIMULATED_STUDENT_INBOX

    def get_inbox(self) -> List[Dict[str, Any]]:
        return self.inbox

    def delete_spam(self, email_id: str) -> bool:
        self.inbox = [m for m in self.inbox if m["id"] != email_id]
        return True

    def scan_custom_email(self, sender: str, subject: str, body: str) -> Dict[str, Any]:
        body_lower = body.lower()
        sender_lower = sender.lower()
        
        is_spam = False
        reasons = []

        if any(w in body_lower for w in ["won", "lottery", "deposit", "send $", "gift card", "crypto", "western union"]):
            is_spam = True
            reasons.append("Suspicious financial solicitations detected.")
        if any(d in sender_lower for d in [".xyz", ".top", ".click", "free-grant"]):
            is_spam = True
            reasons.append("High-risk unverified domain.")

        category = "SCAM_SPAM" if is_spam else "GENERAL_OFFICIAL"
        if "admission" in body_lower or "offer" in body_lower:
            category = "OFFICIAL_ADMISSION"

        return {
            "is_spam": is_spam,
            "category": category,
            "risk_score": 0.95 if is_spam else 0.05,
            "reasons": reasons,
            "safety_verdict": "BLOCKED_SPAM" if is_spam else "SAFE_VERIFIED"
        }

global_email_guardian = EmailGuardianAgent()
