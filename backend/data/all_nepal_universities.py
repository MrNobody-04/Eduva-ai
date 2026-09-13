from typing import Dict, List, Any

ALL_NEPAL_UNIVERSITIES = [
    {
        "id": "univ_tu",
        "name": "Tribhuvan University (TU)",
        "nepali_name": "त्रिभुवन विश्वविद्यालय",
        "established": 1959,
        "location": "Kirtipur / Central Office Kathmandu",
        "rating": 4.8,
        "logo_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
        "campuses": ["Pulchowk Campus (IOE)", "Thapathali Campus", "WRC Pokhara", "ERC Dharan", "Central Campus Kirtipur"],
        "faculties": ["Institute of Engineering (IOE)", "Institute of Medicine (IOM)", "Faculty of Management (FOM)", "Institute of Science & Tech (IOST)"],
        "programs_offered": [
            {"name": "B.E. Computer Engineering", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 380,000", "seats": 432, "faculty": "IOE"},
            {"name": "B.E. Civil Engineering", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 350,000", "seats": 576, "faculty": "IOE"},
            {"name": "MBBS (Medicine)", "degree": "Bachelor", "duration": "5.5 Years", "tuition": "NPR 4,200,000", "seats": 100, "faculty": "IOM"},
            {"name": "B.Sc. CSIT", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 320,000", "seats": 1200, "faculty": "IOST"},
            {"name": "BBA / BBM", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 280,000", "seats": 2400, "faculty": "FOM"}
        ],
        "entrance_exam": {
            "name": "IOE Entrance Exam / CEE / CMAT 2026",
            "form_deadline": "September 28, 2026",
            "exam_date": "October 08, 2026",
            "status": "REGISTRATION_OPEN",
            "fee": "NPR 2,000"
        },
        "scholarships": [
            {"name": "TU Regular Full Merit Scholarship", "coverage": "100% Free Tuition + NPR 3,000/mo", "quota": "Top 10% Rankers"},
            {"name": "MOEST Government Quota Waiver", "coverage": "Full Tuition Waiver", "quota": "Inclusive Categories & Top Rank"}
        ],
        "recent_results": [
            {"exam": "IOE B.E. Computer 2025/26", "publish_date": "2026-08-20", "top_score": "138/140", "status": "PUBLISHED", "link": "https://entrance.ioe.edu.np/result"},
            {"exam": "IOM MBBS Entrance 2025/26", "publish_date": "2026-08-15", "top_score": "194/200", "status": "PUBLISHED", "link": "https://mec.gov.np/results"}
        ]
    },
    {
        "id": "univ_ku",
        "name": "Kathmandu University (KU)",
        "nepali_name": "काठमाडौँ विश्वविद्यालय",
        "established": 1991,
        "location": "Dhulikhel, Kavrepalanchok",
        "rating": 4.9,
        "logo_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80",
        "campuses": ["Main Campus Dhulikhel", "KU School of Arts Hattiban", "KU School of Management Balkumari"],
        "faculties": ["School of Engineering", "School of Science", "School of Management", "School of Medical Sciences"],
        "programs_offered": [
            {"name": "B.Tech in Artificial Intelligence", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 820,000", "seats": 60, "faculty": "Engineering"},
            {"name": "B.E. Computer Engineering", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 780,000", "seats": 120, "faculty": "Engineering"},
            {"name": "B.Sc. Computational Mathematics", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 520,000", "seats": 30, "faculty": "Science"},
            {"name": "B.Pharm (Pharmacy)", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 650,000", "seats": 60, "faculty": "Science"}
        ],
        "entrance_exam": {
            "name": "KUCAT (Computer-Based Test) 2026",
            "form_deadline": "September 20, 2026",
            "exam_date": "September 25, 2026",
            "status": "REGISTRATION_CLOSING_SOON",
            "fee": "NPR 2,500"
        },
        "scholarships": [
            {"name": "KU Founders Merit Fellowship", "coverage": "50% to 100% Fee Waiver", "quota": "Top 5% KUCAT Scorers"},
            {"name": "Juddha Bahadur Shrestha Grant", "coverage": "Full Tuition + Living", "quota": "Deserving Need-Based"}
        ],
        "recent_results": [
            {"exam": "KUCAT Engineering Phase 1", "publish_date": "2026-09-01", "top_score": "188/200", "status": "PUBLISHED", "link": "https://ku.edu.np/results"}
        ]
    },
    {
        "id": "univ_pu",
        "name": "Pokhara University (PU)",
        "nepali_name": "पोखरा विश्वविद्यालय",
        "established": 1997,
        "location": "Lekhnath, Pokhara, Kaski",
        "rating": 4.6,
        "logo_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&auto=format&fit=crop&q=80",
        "campuses": ["Central Campus Lekhnath", "School of Health and Allied Sciences", "Affiliated Engineering Colleges across Nepal"],
        "faculties": ["Faculty of Science and Technology", "Faculty of Management Studies", "Faculty of Health Sciences"],
        "programs_offered": [
            {"name": "B.E. Information Technology (IT)", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 420,000", "seats": 96, "faculty": "Science & Tech"},
            {"name": "B.E. Software Engineering", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 450,000", "seats": 96, "faculty": "Science & Tech"},
            {"name": "B.Sc. Nursing", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 750,000", "seats": 40, "faculty": "Health Sciences"},
            {"name": "BBA / BBA-BI", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 320,000", "seats": 480, "faculty": "Management"}
        ],
        "entrance_exam": {
            "name": "PU Central Entrance Examination 2026",
            "form_deadline": "October 05, 2026",
            "exam_date": "October 14, 2026",
            "status": "REGISTRATION_OPEN",
            "fee": "NPR 1,500"
        },
        "scholarships": [
            {"name": "PU Open Quota Scholarship (Full Free)", "coverage": "100% Tuition & Exam Fee Free", "quota": "10% of Total Seats in All Colleges"},
            {"name": "Gandaki Province CM Fellowship", "coverage": "NPR 100,000/yr", "quota": "Gandaki Domicile"}
        ],
        "recent_results": [
            {"exam": "PU Open Scholarship Entrance 2025/26", "publish_date": "2026-08-28", "top_score": "94/100", "status": "PUBLISHED", "link": "https://pu.edu.np/results"}
        ]
    },
    {
        "id": "univ_purbanchal",
        "name": "Purbanchal University (PU-East)",
        "nepali_name": "पूर्वाञ्चल विश्वविद्यालय",
        "established": 1993,
        "location": "Biratnagar / Gothgaun, Morang",
        "rating": 4.4,
        "logo_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
        "campuses": ["Purbanchal University School of Engineering Gothgaun", "College of Medical & Allied Sciences"],
        "faculties": ["Faculty of Science and Technology", "Faculty of Medical Sciences", "Faculty of Arts"],
        "programs_offered": [
            {"name": "B.E. Computer Engineering", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 390,000", "seats": 96, "faculty": "Engineering"},
            {"name": "B.E. Civil Engineering", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 360,000", "seats": 144, "faculty": "Engineering"},
            {"name": "B.Pharmacy", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 580,000", "seats": 50, "faculty": "Medical"}
        ],
        "entrance_exam": {
            "name": "Purbanchal University Entrance 2026",
            "form_deadline": "October 12, 2026",
            "exam_date": "October 20, 2026",
            "status": "REGISTRATION_OPEN",
            "fee": "NPR 1,500"
        },
        "scholarships": [
            {"name": "Purbanchal Central Quota Scholarship", "coverage": "100% Tuition Waiver", "quota": "10% of Total Enrolled Seats"}
        ],
        "recent_results": [
            {"exam": "Purbanchal Engineering Entrance 2025", "publish_date": "2026-08-10", "top_score": "89/100", "status": "PUBLISHED", "link": "https://puexam.edu.np"}
        ]
    },
    {
        "id": "univ_afu",
        "name": "Agriculture and Forestry University (AFU)",
        "nepali_name": "कृषि तथा वन विज्ञान विश्वविद्यालय",
        "established": 2010,
        "location": "Rampur, Chitwan",
        "rating": 4.7,
        "logo_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80",
        "campuses": ["Central Campus Rampur Chitwan", "Faculty of Forestry Hetauda"],
        "faculties": ["Faculty of Agriculture", "Faculty of Forestry", "Faculty of Veterinary Science"],
        "programs_offered": [
            {"name": "B.Sc. Agriculture (Hons)", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 280,000", "seats": 160, "faculty": "Agriculture"},
            {"name": "B.V.Sc. & A.H. (Veterinary)", "degree": "Bachelor", "duration": "5 Years", "tuition": "NPR 450,000", "seats": 50, "faculty": "Veterinary"},
            {"name": "B.Sc. Forestry", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 260,000", "seats": 80, "faculty": "Forestry"}
        ],
        "entrance_exam": {
            "name": "AFU All Nepal Agriculture Entrance 2026",
            "form_deadline": "October 18, 2026",
            "exam_date": "October 28, 2026",
            "status": "REGISTRATION_OPEN",
            "fee": "NPR 2,000"
        },
        "scholarships": [
            {"name": "AFU All Nepal Merit Scholarship", "coverage": "100% Free Tuition + Free Hostel", "quota": "Top 20 Rankers"}
        ],
        "recent_results": [
            {"exam": "AFU B.Sc. Ag Entrance 2025/26", "publish_date": "2026-07-25", "top_score": "91/100", "status": "PUBLISHED", "link": "https://afu.edu.np/results"}
        ]
    },
    {
        "id": "univ_gandaki",
        "name": "Gandaki University (GU)",
        "nepali_name": "गण्डकी विश्वविद्यालय",
        "established": 2019,
        "location": "Mustang Chowk / Pokhara",
        "rating": 4.5,
        "logo_url": "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=600&auto=format&fit=crop&q=80",
        "campuses": ["Pokhara Innovation Campus"],
        "faculties": ["Faculty of Science and Information Technology", "Faculty of Management"],
        "programs_offered": [
            {"name": "B.Tech in Artificial Intelligence (AI)", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 380,000", "seats": 48, "faculty": "IT"},
            {"name": "Bachelor of Information Technology (BIT)", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 320,000", "seats": 48, "faculty": "IT"},
            {"name": "B.Pharmacy", "degree": "Bachelor", "duration": "4 Years", "tuition": "NPR 490,000", "seats": 40, "faculty": "Health"}
        ],
        "entrance_exam": {
            "name": "Gandaki University Entrance 2026",
            "form_deadline": "September 30, 2026",
            "exam_date": "October 07, 2026",
            "status": "REGISTRATION_OPEN",
            "fee": "NPR 1,500"
        },
        "scholarships": [
            {"name": "Gandaki Innovation Merit Quota", "coverage": "100% Full Tuition Waiver", "quota": "Top 15 Rankers"}
        ],
        "recent_results": [
            {"exam": "GU B.Tech AI Entrance 2025", "publish_date": "2026-08-05", "top_score": "88/100", "status": "PUBLISHED", "link": "https://gandakiuniversity.edu.np"}
        ]
    }
]

def get_all_nepal_universities():
    return ALL_NEPAL_UNIVERSITIES
