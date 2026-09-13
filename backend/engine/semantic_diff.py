import re
from typing import Dict, Any, Optional

class SemanticChangeDetector:
    @staticmethod
    def detect_change(entity_type: str, current_data: Dict[str, Any], new_observed_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        changes = []

        if entity_type == "PROGRAM" or entity_type == "ADMISSION":
            # Check Deadline
            old_deadline = current_data.get("application_deadline")
            new_deadline = new_observed_data.get("application_deadline")
            if old_deadline and new_deadline and old_deadline != new_deadline:
                change_type = "DEADLINE_EXTENSION" if new_deadline > old_deadline else "DEADLINE_ADVANCED"
                changes.append({
                    "field": "application_deadline",
                    "change_type": change_type,
                    "old_value": old_deadline,
                    "new_value": new_deadline,
                    "severity": "CRITICAL" if change_type == "DEADLINE_ADVANCED" else "HIGH",
                    "reason": f"Official notice updated application deadline from {old_deadline} to {new_deadline}."
                })

            # Check Tuition
            old_tuition = current_data.get("tuition")
            new_tuition = new_observed_data.get("tuition")
            if old_tuition is not None and new_tuition is not None and old_tuition != new_tuition:
                changes.append({
                    "field": "tuition",
                    "change_type": "TUITION_CHANGE",
                    "old_value": old_tuition,
                    "new_value": new_tuition,
                    "severity": "MEDIUM",
                    "reason": f"Program tuition updated from {old_tuition} to {new_tuition}."
                })

        elif entity_type == "ENTRANCE_EXAM":
            old_exam_date = current_data.get("exam_date")
            new_exam_date = new_observed_data.get("exam_date")
            if old_exam_date and new_exam_date and old_exam_date != new_exam_date:
                changes.append({
                    "field": "exam_date",
                    "change_type": "EXAM_DATE_SHIFT",
                    "old_value": old_exam_date,
                    "new_value": new_exam_date,
                    "severity": "CRITICAL",
                    "reason": f"Official examination committee revised exam date to {new_exam_date}."
                })

            old_reg_close = current_data.get("registration_close")
            new_reg_close = new_observed_data.get("registration_close")
            if old_reg_close and new_reg_close and old_reg_close != new_reg_close:
                changes.append({
                    "field": "registration_close",
                    "change_type": "EXAM_REGISTRATION_DEADLINE_CHANGED",
                    "old_value": old_reg_close,
                    "new_value": new_reg_close,
                    "severity": "HIGH",
                    "reason": f"Exam registration closing date changed to {new_reg_close}."
                })

        if not changes:
            return None

        return {
            "entity_type": entity_type,
            "entity_id": current_data.get("id"),
            "changes": changes,
            "confidence": 0.98,
            "semantic_summary": "; ".join([c["reason"] for c in changes])
        }
