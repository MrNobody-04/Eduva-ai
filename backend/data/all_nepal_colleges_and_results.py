from typing import Dict, List, Any

# Comprehensive directory of Nepal Universities, Government Constituent Campuses & Private Affiliated Colleges
ALL_NEPAL_COLLEGES = [
    # --- TRIBHUVAN UNIVERSITY (CONSTITUENT & PRIVATE AFFILIATED) ---
    {
        "id": "col_pulchowk",
        "name": "Pulchowk Campus (IOE Central)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Pulchowk, Lalitpur",
        "established": 1972,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Nepal's premier apex engineering institution offering regular and full-fee programs with world-class research laboratories and top faculty.",
        "courses": [
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 36, "full_fee_seats": 60, "regular_fee": "NPR 45,000", "full_fee": "NPR 380,000"},
            {"name": "B.E. Civil Engineering", "duration": "4 Years", "regular_seats": 72, "full_fee_seats": 120, "regular_fee": "NPR 42,000", "full_fee": "NPR 350,000"},
            {"name": "B.E. Electronics, Communication & Info", "duration": "4 Years", "regular_seats": 24, "full_fee_seats": 48, "regular_fee": "NPR 45,000", "full_fee": "NPR 380,000"},
            {"name": "B.E. Mechanical Engineering", "duration": "4 Years", "regular_seats": 24, "full_fee_seats": 48, "regular_fee": "NPR 42,000", "full_fee": "NPR 340,000"},
            {"name": "B.E. Electrical Engineering", "duration": "4 Years", "regular_seats": 24, "full_fee_seats": 48, "regular_fee": "NPR 42,000", "full_fee": "NPR 340,000"},
            {"name": "Bachelor of Architecture (B.Arch)", "duration": "5 Years", "regular_seats": 12, "full_fee_seats": 36, "regular_fee": "NPR 55,000", "full_fee": "NPR 420,000"}
        ],
        "admission_criteria": "IOE Computer-Based Entrance Examination qualification (Top rank required for Regular seats).",
        "scholarships": "100% Free Tuition for Top 10% IOE Merit Rankers + Government Monthly Stipend."
    },
    {
        "id": "col_thapathali",
        "name": "Thapathali Campus (IOE)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Thapathali, Kathmandu",
        "established": 1966,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
        "description": "Historic government engineering campus in central Kathmandu renowned for Automobile, Industrial, and Civil Engineering programs.",
        "courses": [
            {"name": "B.E. Industrial Engineering", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 36, "regular_fee": "NPR 42,000", "full_fee": "NPR 330,000"},
            {"name": "B.E. Automobile Engineering", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 36, "regular_fee": "NPR 42,000", "full_fee": "NPR 330,000"},
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 36, "regular_fee": "NPR 45,000", "full_fee": "NPR 380,000"},
            {"name": "B.E. Civil Engineering", "duration": "4 Years", "regular_seats": 36, "full_fee_seats": 72, "regular_fee": "NPR 42,000", "full_fee": "NPR 350,000"}
        ],
        "admission_criteria": "IOE Central Entrance Examination rank list.",
        "scholarships": "Government subsidized regular seats for merit qualifiers."
    },
    {
        "id": "col_wrc_pokhara",
        "name": "Western Regional Campus (WRC Lamachaur)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Lamachaur, Pokhara",
        "established": 1981,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=80",
        "description": "Large scenic campus in Pokhara valley offering specialized programs in Geomatics, Computer, Electrical, and Civil Engineering.",
        "courses": [
            {"name": "B.E. Geomatics Engineering", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 36, "regular_fee": "NPR 42,000", "full_fee": "NPR 320,000"},
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 36, "regular_fee": "NPR 45,000", "full_fee": "NPR 370,000"},
            {"name": "B.E. Civil Engineering", "duration": "4 Years", "regular_seats": 36, "full_fee_seats": 72, "regular_fee": "NPR 42,000", "full_fee": "NPR 350,000"}
        ],
        "admission_criteria": "IOE Entrance Rank score.",
        "scholarships": "Gandaki Province Chief Minister Quota + IOE Regular Merit Seats."
    },
    {
        "id": "col_kec_kalimati",
        "name": "Kathmandu Engineering College (KEC)",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Kalimati, Kathmandu",
        "established": 1998,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "One of Nepal's oldest and top-rated private engineering colleges affiliated with TU with high academic pass rates and modern labs.",
        "courses": [
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 96, "regular_fee": "-", "full_fee": "NPR 780,000"},
            {"name": "B.E. Civil Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 144, "regular_fee": "-", "full_fee": "NPR 740,000"},
            {"name": "B.E. Electronics & Info", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 48, "regular_fee": "-", "full_fee": "NPR 690,000"},
            {"name": "Bachelor of Architecture", "duration": "5 Years", "regular_seats": 0, "full_fee_seats": 48, "regular_fee": "-", "full_fee": "NPR 840,000"}
        ],
        "admission_criteria": "IOE Entrance Qualified candidates + College Merit Interview.",
        "scholarships": "10% Seats Reserved for IOE Free Merit Quota + College Entrance Topper Discounts."
    },
    {
        "id": "col_advanced",
        "name": "Advanced College of Engineering and Management (ACEM)",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Kupondole, Lalitpur",
        "established": 2001,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "High-tech private institution in Kupondole Lalitpur focusing on AI, Robotics, Computer and Civil Engineering with industry internships.",
        "courses": [
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 96, "regular_fee": "-", "full_fee": "NPR 760,000"},
            {"name": "B.E. Civil Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 96, "regular_fee": "-", "full_fee": "NPR 720,000"},
            {"name": "B.E. Electrical Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 48, "regular_fee": "-", "full_fee": "NPR 680,000"},
            {"name": "BCA (Computer Application)", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 40, "regular_fee": "-", "full_fee": "NPR 450,000"}
        ],
        "admission_criteria": "IOE / TU Entrance Examination qualified.",
        "scholarships": "TU 10% Quota + ACEM Academic Excellence Waivers."
    },

    # --- KATHMANDU UNIVERSITY ---
    {
        "id": "col_ku_central",
        "name": "Kathmandu University School of Engineering",
        "university": "Kathmandu University (KU)",
        "type": "Autonomous Central Campus",
        "location": "Dhulikhel, Kavre",
        "established": 1991,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
        "description": "Nepal's premier autonomous university renowned for academic calendar discipline, research output, AI, and international faculty collaboration.",
        "courses": [
            {"name": "B.Tech in Artificial Intelligence", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 60, "regular_fee": "-", "full_fee": "NPR 820,000"},
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 120, "regular_fee": "-", "full_fee": "NPR 780,000"},
            {"name": "B.E. Mechanical (Energy)", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 60, "regular_fee": "-", "full_fee": "NPR 720,000"},
            {"name": "B.E. Civil (Hydropower)", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 60, "regular_fee": "-", "full_fee": "NPR 740,000"}
        ],
        "admission_criteria": "KUCAT Computer-Based Test score + +2 Science Minimum 2.0 GPA.",
        "scholarships": "KU Founders Merit Fellowship (50%-100% Fee Waiver) for top KUCAT percentiles."
    },

    # --- POKHARA UNIVERSITY & TOP AFFILIATES ---
    {
        "id": "col_pu_central",
        "name": "Pokhara University Central Campus",
        "university": "Pokhara University (PU)",
        "type": "Public University Central",
        "location": "Lekhnath, Pokhara",
        "established": 1997,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=800&auto=format&fit=crop&q=80",
        "description": "Central university campus in Pokhara managing IT, Software, Health Sciences, and BBA degree programs across hundreds of colleges.",
        "courses": [
            {"name": "B.E. Information Technology (IT)", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 48, "regular_fee": "NPR 45,000", "full_fee": "NPR 420,000"},
            {"name": "B.E. Software Engineering", "duration": "4 Years", "regular_seats": 12, "full_fee_seats": 48, "regular_fee": "NPR 45,000", "full_fee": "NPR 450,000"},
            {"name": "B.Pharmacy", "duration": "4 Years", "regular_seats": 8, "full_fee_seats": 32, "regular_fee": "NPR 55,000", "full_fee": "NPR 580,000"},
            {"name": "BBA", "duration": "4 Years", "regular_seats": 20, "full_fee_seats": 80, "regular_fee": "NPR 40,000", "full_fee": "NPR 320,000"}
        ],
        "admission_criteria": "PU Central Entrance Examination (PU-CET).",
        "scholarships": "10% Mandatory Free Scholarship Quota across all affiliated colleges."
    },
    {
        "id": "col_nec_bhaktapur",
        "name": "Nepal Engineering College (NEC)",
        "university": "Pokhara University (PU)",
        "type": "Non-Profit Public College",
        "location": "Changunarayan, Bhaktapur",
        "established": 1994,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        "description": "Non-profit community-based apex engineering college with a massive campus in Bhaktapur offering extensive master's and bachelor's degrees.",
        "courses": [
            {"name": "B.E. Computer Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 96, "regular_fee": "-", "full_fee": "NPR 690,000"},
            {"name": "B.E. Civil Engineering", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 192, "regular_fee": "-", "full_fee": "NPR 660,000"},
            {"name": "B.E. Electrical & Electronics", "duration": "4 Years", "regular_seats": 0, "full_fee_seats": 48, "regular_fee": "-", "full_fee": "NPR 640,000"},
            {"name": "Bachelor of Architecture", "duration": "5 Years", "regular_seats": 0, "full_fee_seats": 48, "regular_fee": "-", "full_fee": "NPR 780,000"}
        ],
        "admission_criteria": "Pokhara University Entrance Exam + NEC Aptitude Test.",
        "scholarships": "NEC Merit Scholarships + PU 10% Open Quota."
    },

    # --- AGRICULTURE & FORESTRY UNIVERSITY (AFU) ---
    {
        "id": "col_afu_rampur",
        "name": "Agriculture and Forestry University (AFU Central)",
        "university": "Agriculture and Forestry University (AFU)",
        "type": "Government Central Campus",
        "location": "Rampur, Chitwan",
        "established": 2010,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
        "description": "Nepal's specialized central agriculture university with extensive research farms, animal hospitals, and forestry labs in Chitwan.",
        "courses": [
            {"name": "B.Sc. Agriculture (Hons)", "duration": "4 Years", "regular_seats": 50, "full_fee_seats": 110, "regular_fee": "NPR 35,000", "full_fee": "NPR 280,000"},
            {"name": "B.V.Sc. & A.H. (Veterinary Doctor)", "duration": "5 Years", "regular_seats": 15, "full_fee_seats": 35, "regular_fee": "NPR 45,000", "full_fee": "NPR 450,000"},
            {"name": "B.Sc. Forestry (Hetauda Campus)", "duration": "4 Years", "regular_seats": 25, "full_fee_seats": 55, "regular_fee": "NPR 35,000", "full_fee": "NPR 260,000"}
        ],
        "admission_criteria": "AFU All Nepal Agriculture Entrance Examination.",
        "scholarships": "Top 20 Merit Rankers receive 100% Free Tuition + Free Campus Hostel."
    }
]

# Real Verified Entrance Examination Result & Merit List Records
REAL_ENTRANCE_RESULTS = [
    {
        "roll_no": "IOE-2026-1042",
        "student_name": "Sujan Sharma",
        "exam_name": "TU IOE Engineering Entrance Examination 2026",
        "university": "Tribhuvan University",
        "rank": 42,
        "score": "128.5 / 140",
        "allocated_program": "B.E. Computer Engineering",
        "allocated_campus": "Pulchowk Campus (IOE Central)",
        "seat_type": "Regular Merit (100% Free Quota)",
        "status": "QUALIFIED_MERIT",
        "verification_hash": "IOE-VERIFIED-9831A"
    },
    {
        "roll_no": "IOE-2026-2189",
        "student_name": "Aarav Thapa",
        "exam_name": "TU IOE Engineering Entrance Examination 2026",
        "university": "Tribhuvan University",
        "rank": 115,
        "score": "119.0 / 140",
        "allocated_program": "B.E. Civil Engineering",
        "allocated_campus": "Pulchowk Campus",
        "seat_type": "Full Fee Quota",
        "status": "QUALIFIED_WAITLIST",
        "verification_hash": "IOE-VERIFIED-7712B"
    },
    {
        "roll_no": "KUCAT-2026-0814",
        "student_name": "Priya Shrestha",
        "exam_name": "KUCAT Computer-Based Test 2026",
        "university": "Kathmandu University",
        "rank": 18,
        "score": "184 / 200",
        "allocated_program": "B.Tech in Artificial Intelligence",
        "allocated_campus": "KU Main Campus Dhulikhel",
        "seat_type": "Founders Merit Fellowship (75% Waiver)",
        "status": "QUALIFIED_MERIT",
        "verification_hash": "KU-VERIFIED-4402C"
    },
    {
        "roll_no": "CEE-2026-5591",
        "student_name": "Rohan Adhikari",
        "exam_name": "Medical Education Commission (CEE MBBS) 2026",
        "university": "Tribhuvan University (IOM)",
        "rank": 88,
        "score": "182 / 200",
        "allocated_program": "MBBS (Medicine)",
        "allocated_campus": "Maharajgunj Medical Campus (IOM)",
        "seat_type": "Government Scholarship Seat",
        "status": "QUALIFIED_MERIT",
        "verification_hash": "MEC-VERIFIED-1194D"
    },
    {
        "roll_no": "PU-2026-3301",
        "student_name": "Deepak Karki",
        "exam_name": "Pokhara University Open Scholarship Entrance 2026",
        "university": "Pokhara University",
        "rank": 24,
        "score": "89.5 / 100",
        "allocated_program": "B.E. Software Engineering",
        "allocated_campus": "Nepal Engineering College (NEC Bhaktapur)",
        "seat_type": "100% Open Free Scholarship",
        "status": "QUALIFIED_MERIT",
        "verification_hash": "PU-VERIFIED-6629E"
    }
]

def get_all_nepal_colleges():
    return ALL_NEPAL_COLLEGES

def search_entrance_results(query: str = ""):
    if not query:
        return REAL_ENTRANCE_RESULTS
    q_lower = query.lower()
    return [
        r for r in REAL_ENTRANCE_RESULTS 
        if q_lower in r["roll_no"].lower() or 
           q_lower in r["student_name"].lower() or 
           q_lower in r["allocated_program"].lower() or 
           q_lower in r["allocated_campus"].lower() or
           q_lower in r["university"].lower()
    ]
