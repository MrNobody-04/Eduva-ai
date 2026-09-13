"""
EDUVA AI "What Can I Study?" & Eligibility Evaluation Engine
Calculates degree pathway suitability, eligibility status, and personalized recommendations
based on student stream, GPA, key subjects, budget, and location preferences.
"""

from typing import Dict, List, Any
from data.nepal_courses_directory import NEPAL_COURSES
from data.all_nepal_colleges_and_results import ALL_NEPAL_COLLEGES

class EligibilityEngine:
    def __init__(self):
        self.courses = NEPAL_COURSES
        self.colleges = ALL_NEPAL_COLLEGES

    def evaluate_profile(self, stream: str, gpa: float, subjects: List[str] = None, preferred_location: str = "Kathmandu", budget_max_npr: int = 1500000) -> Dict[str, Any]:
        stream_clean = stream.strip().upper()
        subjects_set = set([s.strip().lower() for s in (subjects or [])])
        
        eligible_programs = []
        potentially_eligible = []
        not_eligible = []

        for c in self.courses:
            cid = c["id"]
            cname = c["name"]
            req_stream = c["category"]
            
            is_eligible = False
            status = "NOT_ELIGIBLE"
            reasons = []

            # 1. Science Stream Rules
            if "SCIENCE" in stream_clean:
                if cid in ["course_bsc_csit", "course_be_computer", "course_be_civil", "course_be_ai"]:
                    if gpa >= 2.4:
                        status = "ELIGIBLE"
                        reasons.append(f"+2 Science GPA {gpa:.2f} satisfies minimum requirement (2.4 GPA / 'C' grade).")
                    else:
                        status = "POTENTIALLY_ELIGIBLE"
                        reasons.append("GPA is close to the threshold; check specific entrance quota guidelines.")
                elif cid in ["course_mbbs", "course_bds", "course_bsc_nursing", "course_bpharm"]:
                    if "biology" in subjects_set or len(subjects_set) == 0:
                        if gpa >= 2.4:
                            status = "ELIGIBLE"
                            reasons.append("Biology stream qualifies for Medical Education Commission (MEC) CEE entrance.")
                        else:
                            status = "POTENTIALLY_ELIGIBLE"
                            reasons.append("Requires minimum 50% / 2.4 GPA in PCB group for MEC CEE registration.")
                    else:
                        status = "NOT_ELIGIBLE"
                        reasons.append("Requires Biology as a major qualifying subject in +2.")
                elif cid in ["course_bsc_ag", "course_bvsc_ah"]:
                    status = "ELIGIBLE" if gpa >= 2.4 else "POTENTIALLY_ELIGIBLE"
                    reasons.append("Science background satisfies AFU / IAAS basic prerequisite.")
                elif cid in ["course_bca", "course_bit", "course_bba", "course_bim", "course_ballb"]:
                    status = "ELIGIBLE"
                    reasons.append("+2 Science students are universally eligible for Management, IT, and Law degrees.")

            # 2. Management Stream Rules
            elif "MANAGEMENT" in stream_clean or "COMMERCE" in stream_clean:
                if cid in ["course_bba", "course_bim", "course_bca", "course_ballb"]:
                    if gpa >= 2.0:
                        status = "ELIGIBLE"
                        reasons.append(f"+2 Management GPA {gpa:.2f} qualifies for CMAT / BCA / Law entrance tests.")
                    else:
                        status = "POTENTIALLY_ELIGIBLE"
                        reasons.append("Requires minimum 2.0 GPA ('C' grade) for university registration.")
                elif cid == "course_bit":
                    if "math" in subjects_set or "business mathematics" in subjects_set or len(subjects_set) == 0:
                        status = "ELIGIBLE"
                        reasons.append("Management with Business Mathematics meets BIT admission prerequisites.")
                    else:
                        status = "POTENTIALLY_ELIGIBLE"
                        reasons.append("Purbanchal/Pokhara University requires Business Math or Mathematics.")
                else:
                    status = "NOT_ELIGIBLE"
                    reasons.append("Engineering and Medical degrees strictly require +2 Science with Physics, Chemistry, Math/Biology.")

            # 3. Humanities / Education / Law Stream Rules
            else:
                if cid in ["course_bca", "course_ballb", "course_bba"]:
                    if gpa >= 2.0:
                        status = "ELIGIBLE"
                        reasons.append(f"+2 stream with GPA {gpa:.2f} meets universal admission criteria.")
                    else:
                        status = "POTENTIALLY_ELIGIBLE"
                        reasons.append("Requires minimum 2.0 GPA across all subjects.")
                else:
                    status = "NOT_ELIGIBLE"
                    reasons.append("Technical STEM and Clinical health sciences require +2 Science.")

            # Matching Colleges offering this course in preferred location
            matching_colleges = [
                col["name"] for col in self.colleges 
                if (c["code"] in col.get("programs", []) or any(p in col.get("programs", []) for p in [c["name"], c["code"]]))
                and (preferred_location.lower() in col.get("location", "").lower() or not preferred_location)
            ]

            eval_item = {
                "course_id": cid,
                "course_name": cname,
                "degree_code": c["code"],
                "category": c["category"],
                "status": status,
                "reasons": reasons,
                "entrance_exam": c["entrance_exam"],
                "duration": f"{c['duration_years']} Years ({c['semesters']} Semesters)",
                "average_fee": c["average_fee_range"],
                "available_colleges_nearby": matching_colleges[:4],
                "verified_source": c["verified_status"]
            }

            if status == "ELIGIBLE":
                eligible_programs.append(eval_item)
            elif status == "POTENTIALLY_ELIGIBLE":
                potentially_eligible.append(eval_item)
            else:
                not_eligible.append(eval_item)

        return {
            "student_profile": {
                "stream": stream,
                "gpa": gpa,
                "subjects": list(subjects_set),
                "preferred_location": preferred_location,
                "budget_max_npr": budget_max_npr
            },
            "summary": {
                "eligible_count": len(eligible_programs),
                "potential_count": len(potentially_eligible),
                "headline": f"You completed {stream}. Here are the strongest verified study paths currently available to you."
            },
            "eligible_programs": eligible_programs,
            "potentially_eligible": potentially_eligible,
            "not_eligible": not_eligible
        }

global_eligibility_engine = EligibilityEngine()
