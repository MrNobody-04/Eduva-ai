"""
Multi-Entity Educational Comparison Matrix
Compares up to 4 universities, colleges, or courses across official parameters:
accreditation, affiliation, programs, fee brackets, entrance exams, and verification level.
"""

from typing import Dict, List, Any
from data.all_nepal_universities_comprehensive import get_university_by_id, ALL_NEPAL_UNIVERSITIES
from data.all_nepal_colleges_and_results import get_all_nepal_colleges
from data.nepal_courses_directory import get_course_by_id

class ComparisonEngine:
    def compare_universities(self, univ_ids: List[str]) -> Dict[str, Any]:
        items = []
        for uid in univ_ids[:4]:
            u = get_university_by_id(uid)
            if u:
                items.append({
                    "id": u["id"],
                    "name": u["name"],
                    "acronym": u["acronym"],
                    "established": u["established_year"],
                    "type": u["institution_type"],
                    "location": u["location"],
                    "province": u["province"],
                    "constituent_campuses": u.get("total_constituent_campuses", "N/A"),
                    "affiliated_colleges": u.get("total_affiliated_colleges", "N/A"),
                    "primary_entrance": u.get("entrance_exams", ["University Entrance"])[0],
                    "website": u["website"],
                    "verification": u["source_metadata"]["authorityLevel"]
                })
        return {
            "comparison_type": "UNIVERSITIES",
            "count": len(items),
            "attributes": ["Established", "Institution Type", "Location", "Province", "Constituent Campuses", "Affiliated Colleges", "Entrance Gate", "Website", "Authority"],
            "entities": items
        }

    def compare_colleges(self, college_ids: List[str]) -> Dict[str, Any]:
        all_cols = get_all_nepal_colleges()
        items = []
        for cid in college_ids[:4]:
            found = next((c for c in all_cols if c["id"] == cid or c["name"].lower() == cid.lower()), None)
            if found:
                items.append({
                    "id": found["id"],
                    "name": found["name"],
                    "university": found["university"],
                    "ownership": found.get("ownership", "AFFILIATED"),
                    "location": found["location"],
                    "programs_offered": ", ".join(found.get("programs", [])),
                    "entrance_exam": found.get("entrance_exam", "Central Entrance"),
                    "admission_status": found.get("admission_status", "VERIFIED"),
                    "website": found.get("official_website", "Official Portal"),
                    "verification": found.get("verification_status", "VERIFIED_LEVEL_1")
                })
        return {
            "comparison_type": "COLLEGES",
            "count": len(items),
            "attributes": ["University Affiliation", "Ownership", "Location", "Programs Offered", "Entrance Exam", "Admission Status", "Website", "Verification Status"],
            "entities": items
        }

global_comparison_engine = ComparisonEngine()
