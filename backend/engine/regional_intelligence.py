import datetime
from typing import Dict, List, Any

# Dynamic regional campuses, exam test centers, and provincial scholarships across Nepal
REGIONAL_KNOWLEDGE = {
    "Kathmandu": {
        "province": "Bagmati Province",
        "regional_colleges": [
            {"name": "TU IOE Pulchowk Campus (Lalitpur/KTM)", "type": "Constituent Central Campus", "programs": ["B.E. Computer", "Civil", "Electrical", "Mechanical"], "seats": 432, "tuition": "NPR 380,000"},
            {"name": "TU Thapathali Campus", "type": "Constituent Campus", "programs": ["B.E. Industrial", "Civil", "Electronics"], "seats": 288, "tuition": "NPR 350,000"},
            {"name": "Kathmandu University (Dhulikhel/KTM Valley)", "type": "Autonomous University", "programs": ["B.Tech AI", "B.E. Computer", "Data Science"], "seats": 320, "tuition": "NPR 820,000"}
        ],
        "local_exam_centers": [
            {"center_name": "IOE ICTC Center, Pulchowk", "capacity": "800 candidates/shift", "status": "CONFIRMED_ONLINE"},
            {"center_name": "KU CBT Lab, Dhulikhel", "capacity": "450 candidates/shift", "status": "ACTIVE"}
        ],
        "local_scholarships": [
            {"name": "Kathmandu Metropolitan STEM Leadership Fund", "coverage": "100% Tuition Waiver", "quota": "35 Seats", "deadline": "2026-10-10"},
            {"name": "Bagmati Province Higher Technical Merit Grant", "coverage": "NPR 150,000/year", "quota": "50 Seats", "deadline": "2026-10-25"}
        ],
        "commute_radar": "Ring Road & Pulchowk transit moving normally. Evening rain caution in Koteshwor & Kalanki."
    },
    "Pokhara": {
        "province": "Gandaki Province",
        "regional_colleges": [
            {"name": "TU IOE Western Regional Campus (WRC Lamachaur)", "type": "Constituent Campus", "programs": ["B.E. Computer", "Geomatics", "Civil", "Automobile"], "seats": 360, "tuition": "NPR 350,000"},
            {"name": "Pokhara University Central Campus (Lekhnath)", "type": "Public University", "programs": ["B.E. IT", "Software Engineering", "BBA"], "seats": 240, "tuition": "NPR 420,000"},
            {"name": "Gandaki University", "type": "Provincial University", "programs": ["B.Tech AI & IT", "B.Pharma"], "seats": 120, "tuition": "NPR 380,000"}
        ],
        "local_exam_centers": [
            {"center_name": "WRC Lamachaur CBT Lab, Pokhara", "capacity": "400 candidates/shift", "status": "CONFIRMED_ONLINE"},
            {"center_name": "Pokhara University Exam Controller, Lekhnath", "capacity": "300 candidates/shift", "status": "ACTIVE"}
        ],
        "local_scholarships": [
            {"name": "Gandaki Province Chief Minister Scholarship Quota", "coverage": "Full Tuition + Hostel", "quota": "40 Seats", "deadline": "2026-10-18"},
            {"name": "Pokhara Valley Engineering Fellowship", "coverage": "75% Fee Waiver", "quota": "20 Seats", "deadline": "2026-10-30"}
        ],
        "commute_radar": "Prithvi Chowk & Lamachaur route clear. Light drizzles near lakeside."
    },
    "Biratnagar": {
        "province": "Koshi Province",
        "regional_colleges": [
            {"name": "TU IOE Eastern Regional Campus (ERC Dharan/Biratnagar)", "type": "Constituent Campus", "programs": ["B.E. Computer", "Agriculture Eng", "Civil"], "seats": 320, "tuition": "NPR 340,000"},
            {"name": "Purbanchal University School of Engineering", "type": "Public University", "programs": ["B.E. Computer", "Civil", "Biomedical"], "seats": 200, "tuition": "NPR 390,000"}
        ],
        "local_exam_centers": [
            {"center_name": "ERC Dharan Digital Test Center", "capacity": "350 candidates/shift", "status": "ACTIVE"},
            {"center_name": "Purbanchal University Exam Hall, Biratnagar", "capacity": "500 candidates/shift", "status": "ACTIVE"}
        ],
        "local_scholarships": [
            {"name": "Koshi Province Technical Youth Fellowship", "coverage": "100% Tuition Waiver", "quota": "45 Seats", "deadline": "2026-10-15"},
            {"name": "Biratnagar Industrial Merit Award", "coverage": "NPR 120,000/year", "quota": "25 Seats", "deadline": "2026-11-01"}
        ],
        "commute_radar": "Highway traffic smooth. High humidity, clear transit paths across Koshi corridor."
    },
    "Chitwan": {
        "province": "Bagmati Province",
        "regional_colleges": [
            {"name": "Agriculture and Forestry University (AFU Rampur)", "type": "Central University", "programs": ["B.Sc. Agriculture", "B.Sc. Forestry", "Biotech"], "seats": 250, "tuition": "NPR 280,000"},
            {"name": "Chitwan College of Engineering & Tech (Bharatpur)", "type": "Affiliated Campus", "programs": ["B.E. Computer", "Civil"], "seats": 140, "tuition": "NPR 490,000"}
        ],
        "local_exam_centers": [
            {"center_name": "AFU Rampur Examination Hall", "capacity": "450 candidates/shift", "status": "ACTIVE"},
            {"center_name": "Bharatpur CBT Center", "capacity": "250 candidates/shift", "status": "ACTIVE"}
        ],
        "local_scholarships": [
            {"name": "Bharatpur Metropolitan Higher Education Grant", "coverage": "50% to 100% Tuition", "quota": "30 Seats", "deadline": "2026-10-20"}
        ],
        "commute_radar": "Narayanghat-Mugling highway section monitored. Clear weather in Bharatpur."
    },
    "Butwal": {
        "province": "Lumbini Province",
        "regional_colleges": [
            {"name": "Lumbini ICT Campus / Butwal Multiple Campus", "type": "Public Constituent", "programs": ["B.Sc. CSIT", "BCA", "BBM"], "seats": 180, "tuition": "NPR 310,000"},
            {"name": "Lumbini Engineering College (Tilottama)", "type": "Affiliated Campus", "programs": ["B.E. Computer", "Civil", "Electrical"], "seats": 192, "tuition": "NPR 460,000"}
        ],
        "local_exam_centers": [
            {"center_name": "Butwal Multiple Campus CBT Center", "capacity": "300 candidates/shift", "status": "ACTIVE"}
        ],
        "local_scholarships": [
            {"name": "Lumbini Province Chief Minister Talent Quota", "coverage": "Full Free Tuition", "quota": "35 Seats", "deadline": "2026-10-22"}
        ],
        "commute_radar": "Siddhababa road monitored. Dry pleasant conditions in Butwal & Tilottama."
    }
}

def get_regional_recommendations(city: str) -> Dict[str, Any]:
    matched_city = "Kathmandu"
    for c in REGIONAL_KNOWLEDGE:
        if c.lower() in city.lower():
            matched_city = c
            break
    return {"city": matched_city, **REGIONAL_KNOWLEDGE[matched_city]}
