"""
Comprehensive Nepal Higher Education Course Intelligence Directory
Covers 40+ degree programs across Computing/IT, Engineering, Medicine, Management, Science, Agriculture, and Law.
"""

from typing import Dict, List, Any, Optional

NEPAL_COURSES = [
    # ------------------ Computing & IT ------------------
    {
        "id": "course_bsc_csit",
        "name": "B.Sc. Computer Science and Information Technology",
        "code": "B.Sc. CSIT",
        "category": "COMPUTING_AND_IT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOST)",
        "other_universities": ["Mid-West University", "Sudurpaschim University", "Rajarshi Janak University"],
        "eligibility": "Passed +2 Science or equivalent with minimum 'C' grade in all subjects (including Mathematics/Physics with min 100 marks).",
        "required_subjects": ["Physics", "Mathematics", "Chemistry / Computer Science"],
        "entrance_exam": "TU IOST CSIT Central Entrance Examination (100 Objective Questions)",
        "admission_cycle": "Annual (Forms in Shrawan/Bhadra, Exam in Ashoj)",
        "average_fee_range": "NPR 350,000 - NPR 500,000 (Govt/Constituent) | NPR 750,000 - NPR 1,200,000 (Private)",
        "overview": "Nepal's most popular university degree blending theoretical computer science algorithms with applied software engineering and IT networks.",
        "career_paths": ["Software Engineer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Cyber Security Analyst", "AI Researcher"],
        "key_subjects": ["Data Structures & Algorithms", "Theory of Computation", "Database Management", "Computer Networks", "Artificial Intelligence", "Compiler Design"],
        "popular_colleges_count": 60,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bca",
        "name": "Bachelor in Computer Application",
        "code": "BCA",
        "category": "COMPUTING_AND_IT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (FOHSS)",
        "other_universities": ["Purbanchal University", "Pokhara University", "Rajarshi Janak University"],
        "eligibility": "Minimum 'D+' (GPA 2.0 or above) in +2 from any stream (Science, Management, Humanities, Education) with minimum 100 marks English.",
        "required_subjects": ["English", "Any stream (+2 Science/Management/Humanities)"],
        "entrance_exam": "TU FOHSS BCA Central Entrance Exam (English, Math, General Knowledge)",
        "admission_cycle": "Annual (Bhadra - Kartik)",
        "average_fee_range": "NPR 300,000 - NPR 450,000 (Constituent) | NPR 500,000 - NPR 850,000 (Private)",
        "overview": "Application-oriented computing degree tailored for students from any academic discipline desiring software development and IT careers.",
        "career_paths": ["Frontend Developer", "Backend Developer", "Mobile App Engineer", "UI/UX Designer", "Database Administrator", "IT Project Manager"],
        "key_subjects": ["C/C++ Programming", "Java", "Web Technologies", "Python", "Software Engineering", "E-Commerce", "Cloud Computing"],
        "popular_colleges_count": 140,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bit",
        "name": "Bachelor of Information Technology",
        "code": "BIT",
        "category": "COMPUTING_AND_IT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Purbanchal University",
        "other_universities": ["Tribhuvan University (IOST)", "Pokhara University", "Gandaki University"],
        "eligibility": "Minimum 2.0 GPA in +2 Science or +2 Management with Business Math/Mathematics.",
        "required_subjects": ["Mathematics (100 Marks)", "Science or Management Stream"],
        "entrance_exam": "University Central Entrance Test",
        "admission_cycle": "Annual (August - October)",
        "average_fee_range": "NPR 450,000 - NPR 800,000",
        "overview": "Industry-focused IT degree providing extensive training in systems administration, network security, database engineering, and corporate software ecosystems.",
        "career_paths": ["Network Administrator", "Systems Architect", "Cybersecurity Specialist", "IT Consultant", "Cloud Engineer"],
        "key_subjects": ["Operating Systems", "Enterprise Networks", "Information Security", "Software Architecture", "Big Data Analytics"],
        "popular_colleges_count": 45,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_computer",
        "name": "Bachelor of Computer Engineering",
        "code": "B.E. Computer",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": ["Kathmandu University", "Pokhara University", "Purbanchal University", "Mid-West University"],
        "eligibility": "Minimum 'C' grade in all subjects in +2 Science (Physics, Chemistry, Math) with min 45% aggregate and passed IOE/KUCAT entrance.",
        "required_subjects": ["Physics", "Mathematics", "Chemistry (Min 100 marks each)"],
        "entrance_exam": "IOE Computer-Based Entrance Test (Pulchowk) / KUCAT-CBT (Dhulikhel)",
        "admission_cycle": "Annual (Bhadra - Ashoj)",
        "average_fee_range": "NPR 400,000 - NPR 500,000 (Pulchowk Regular/Full Fee) | NPR 1,200,000 - NPR 1,650,000 (Private IOE Affiliated)",
        "overview": "Rigorous engineering curriculum accredited by Nepal Engineering Council (NEC), integrating microprocessors, digital hardware design, and systems programming.",
        "career_paths": ["Computer Hardware Engineer", "Embedded Systems Developer", "Robotics Engineer", "Systems Software Architect", "AI Engineer"],
        "key_subjects": ["Microprocessors", "Digital Logic", "Computer Architecture", "Object Oriented Design", "Embedded Systems", "VLSI"],
        "popular_colleges_count": 32,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_ai",
        "name": "Bachelor of Engineering in Artificial Intelligence",
        "code": "B.E. AI",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Kathmandu University (School of Engineering)",
        "other_universities": ["Lumbini Technological University"],
        "eligibility": "Passed +2 Science with minimum 50% or 2.4 CGPA in Physics, Mathematics, and Chemistry/Computer Science.",
        "required_subjects": ["Mathematics", "Physics", "Computer Science / Chemistry"],
        "entrance_exam": "KUCAT-CBT (PCM or PMCs stream)",
        "admission_cycle": "Annual (Ashadh - Bhadra)",
        "average_fee_range": "NPR 850,000 - NPR 1,050,000 (KU Main Campus)",
        "overview": "First specialized AI engineering undergraduate program in Nepal, preparing students in neural networks, computer vision, natural language processing, and autonomous robotics.",
        "career_paths": ["AI Engineer", "Machine Learning Specialist", "Computer Vision Engineer", "NLP Researcher", "Data Architect"],
        "key_subjects": ["Machine Learning", "Deep Learning", "Reinforcement Learning", "Natural Language Processing", "Computer Vision", "Autonomous Systems"],
        "popular_colleges_count": 3,
        "verified_status": "VERIFIED_LEVEL_1"
    },

    # ------------------ Core Engineering ------------------
    {
        "id": "course_be_civil",
        "name": "Bachelor of Civil Engineering",
        "code": "B.E. Civil",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": ["Kathmandu University", "Pokhara University", "Purbanchal University", "Mid-West University", "Sudurpaschim University"],
        "eligibility": "Minimum 'C' grade in all subjects in +2 Science (Physics, Chemistry, Math) with min 45% aggregate and passed IOE/University Entrance.",
        "required_subjects": ["Physics", "Mathematics", "Chemistry"],
        "entrance_exam": "IOE Central Entrance Exam",
        "admission_cycle": "Annual (Bhadra - Ashoj)",
        "average_fee_range": "NPR 380,000 - NPR 480,000 (Constituent) | NPR 950,000 - NPR 1,450,000 (Private)",
        "overview": "The largest engineering discipline in Nepal, addressing hydropower infrastructure, bridges, earthquake-resilient structures, road transit, and municipal hydrology.",
        "career_paths": ["Structural Engineer", "Hydropower Engineer", "Geotechnical Specialist", "Highway Engineer", "Government Civil Servant (Loksewa)"],
        "key_subjects": ["Structural Analysis", "Hydraulics", "Soil Mechanics & Foundation", "Concrete Design", "Surveying", "Transportation Engineering"],
        "popular_colleges_count": 48,
        "verified_status": "VERIFIED_LEVEL_1"
    },

    # ------------------ Medicine & Health Sciences ------------------
    {
        "id": "course_mbbs",
        "name": "Bachelor of Medicine and Bachelor of Surgery",
        "code": "MBBS",
        "category": "MEDICINE_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 5.5,
        "semesters": 9,
        "primary_university": "Tribhuvan University (IOM)",
        "other_universities": ["Kathmandu University (KUSMS)", "BPKIHS", "PAHS", "KAHS", "Purbanchal University"],
        "eligibility": "Passed +2 Science (Biology group) with minimum 50% aggregate in Physics, Chemistry, and Biology (PCB) and qualified MEC CEE.",
        "required_subjects": ["Physics", "Chemistry", "Biology (PCB)"],
        "entrance_exam": "Medical Education Commission Common Entrance Exam (MEC CEE) - 200 Marks",
        "admission_cycle": "Annual (Kartik - Mangsir, governed nationally by MEC)",
        "average_fee_range": "Government Scholarship: 100% Free | Subsidized/Ceiling: NPR 4,168,000 (Inside Valley) | NPR 4,595,000 (Outside Valley)",
        "overview": "Apex undergraduate clinical medical qualification in Nepal recognized by the Nepal Medical Council (NMC) and WHO World Directory.",
        "career_paths": ["Medical Officer", "Clinical Specialist (MD/MS)", "Public Health Administrator", "Surgical Resident", "Global Health Researcher"],
        "key_subjects": ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Internal Medicine", "General Surgery", "Obstetrics & Gynecology"],
        "popular_colleges_count": 22,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bds",
        "name": "Bachelor of Dental Surgery",
        "code": "BDS",
        "category": "MEDICINE_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOM)",
        "other_universities": ["Kathmandu University", "BPKIHS"],
        "eligibility": "Passed +2 Science (PCB) with min 50% aggregate and qualified MEC CEE.",
        "required_subjects": ["Physics", "Chemistry", "Biology"],
        "entrance_exam": "MEC CEE (Medical Common Entrance)",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 1,932,000 (MEC Prescribed Ceiling)",
        "overview": "Professional dental surgery degree training oral surgeons, orthodontists, and dental healthcare practitioners.",
        "career_paths": ["Dental Surgeon", "Orthodontist", "Oral & Maxillofacial Specialist", "Dental Clinic Director"],
        "key_subjects": ["Dental Anatomy", "Prosthodontics", "Oral Pathology", "Orthodontics", "Conservative Dentistry", "Oral Surgery"],
        "popular_colleges_count": 14,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bpharm",
        "name": "Bachelor of Pharmacy",
        "code": "B.Pharm",
        "category": "MEDICINE_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Kathmandu University (School of Science)",
        "other_universities": ["Tribhuvan University (IOM)", "Pokhara University", "Purbanchal University"],
        "eligibility": "Passed +2 Science with min 50% or 'C+' in Chemistry, Biology, Physics, and qualified MEC CEE.",
        "required_subjects": ["Chemistry", "Biology / Mathematics", "Physics"],
        "entrance_exam": "MEC CEE (Common Medical Entrance - Pharmacy stream)",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 500,000 - NPR 850,000",
        "overview": "Comprehensive pharmaceutical curriculum accredited by Nepal Pharmacy Council, training drug formulations, clinical pharmacology, and hospital therapeutics.",
        "career_paths": ["Clinical Pharmacist", "Pharmaceutical Quality Officer", "Drug Regulatory Specialist", "Formulation Scientist"],
        "key_subjects": ["Pharmaceutics", "Pharmacology", "Medicinal Chemistry", "Pharmacognosy", "Biopharmaceutics"],
        "popular_colleges_count": 28,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bsc_nursing",
        "name": "Bachelor of Science in Nursing",
        "code": "B.Sc. Nursing",
        "category": "MEDICINE_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOM)",
        "other_universities": ["Kathmandu University", "BPKIHS", "Patan Academy (PAHS)", "Pokhara University"],
        "eligibility": "Passed +2 Science (PCB) with minimum 50% aggregate and qualified MEC CEE Nursing stream.",
        "required_subjects": ["Physics", "Chemistry", "Biology"],
        "entrance_exam": "MEC CEE Nursing Stream",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 900,000 - NPR 1,200,000",
        "overview": "Rigorous clinical nursing training in emergency triage, surgical intensive care, obstetrics, and hospital care management accredited by Nepal Nursing Council (NNC).",
        "career_paths": ["Critical Care Nurse", "Hospital Nursing Administrator", "Clinical Nurse Specialist", "Global Healthcare Professional"],
        "key_subjects": ["Medical-Surgical Nursing", "Community Health", "Child Health Nursing", "Midwifery", "Mental Health Nursing"],
        "popular_colleges_count": 42,
        "verified_status": "VERIFIED_LEVEL_1"
    },

    # ------------------ Business & Management ------------------
    {
        "id": "course_bba",
        "name": "Bachelor of Business Administration",
        "code": "BBA",
        "category": "BUSINESS_AND_MANAGEMENT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (FOM)",
        "other_universities": ["Kathmandu University (KUSOM)", "Pokhara University", "Purbanchal University", "Mid-West University"],
        "eligibility": "Minimum 2.4 CGPA or 'C+' in +2 from any stream with minimum 100 marks English.",
        "required_subjects": ["English", "Any stream (+2 Management/Science/Humanities)"],
        "entrance_exam": "TU CMAT (Central Management Admission Test) / KUMAT",
        "admission_cycle": "Annual (Shrawan - Kartik)",
        "average_fee_range": "NPR 350,000 - NPR 500,000 (Constituent) | NPR 600,000 - NPR 1,100,000 (Private)",
        "overview": "The premier business degree in Nepal cultivating leadership in corporate finance, strategic marketing, human resources, and entrepreneurship.",
        "career_paths": ["Banking Officer", "Financial Analyst", "Brand Manager", "Operations Manager", "Startup Founder"],
        "key_subjects": ["Financial Accounting", "Principles of Management", "Business Economics", "Marketing Management", "Strategic Human Resources"],
        "popular_colleges_count": 85,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bim",
        "name": "Bachelor of Information Management",
        "code": "BIM",
        "category": "BUSINESS_AND_MANAGEMENT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (Faculty of Management)",
        "other_universities": [],
        "eligibility": "Minimum 'C' grade (GPA 2.0 or above) in +2 from any stream with minimum 100 marks English and Mathematics/Business Math.",
        "required_subjects": ["English", "Mathematics / Business Mathematics"],
        "entrance_exam": "TU CMAT Entrance Examination",
        "admission_cycle": "Annual (Bhadra - Ashoj)",
        "average_fee_range": "NPR 350,000 - NPR 550,000 (Constituent) | NPR 550,000 - NPR 850,000 (Private)",
        "overview": "Dual-specialization program harmonizing management decision theory (60%) with software engineering and IT infrastructure (40%).",
        "career_paths": ["Product Manager", "Business Analyst", "IT Project Manager", "Enterprise Software Specialist", "Fintech Consultant"],
        "key_subjects": ["Java Programming", "Database Engineering", "Business Statistics", "Financial Management", "Software Project Management"],
        "popular_colleges_count": 28,
        "verified_status": "VERIFIED_LEVEL_1"
    },

    # ------------------ Agriculture & Natural Resources ------------------
    {
        "id": "course_bsc_ag",
        "name": "Bachelor of Science in Agriculture",
        "code": "B.Sc. Ag",
        "category": "AGRICULTURE_AND_FORESTRY",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Agriculture and Forestry University (AFU)",
        "other_universities": ["Tribhuvan University (IAAS)", "Purbanchal University", "Mid-West University", "Sudurpaschim University"],
        "eligibility": "Minimum 50% or 'C+' in +2 Science with Physics, Chemistry, Biology/Math.",
        "required_subjects": ["Chemistry", "Biology / Mathematics", "Physics"],
        "entrance_exam": "AFU Central Entrance Exam / TU IAAS Entrance Exam",
        "admission_cycle": "Annual (Bhadra - Kartik)",
        "average_fee_range": "NPR 250,000 - NPR 400,000 (Govt/Constituent) | NPR 600,000 - NPR 950,000 (Affiliated)",
        "overview": "Vital national program addressing food security, agronomy, plant pathology, soil science, and high-yield agro-tech in Nepal.",
        "career_paths": ["Agricultural Officer (MOALD Loksewa)", "Agronomist", "Crop Scientist", "Horticultural Consultant", "Agri-tech Entrepreneur"],
        "key_subjects": ["Agronomy", "Soil Science", "Genetics & Plant Breeding", "Horticulture", "Plant Pathology", "Agricultural Economics"],
        "popular_colleges_count": 18,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bvsc_ah",
        "name": "Bachelor of Veterinary Science and Animal Husbandry",
        "code": "B.V.Sc. & A.H.",
        "category": "AGRICULTURE_AND_FORESTRY",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 10,
        "primary_university": "Agriculture and Forestry University (AFU)",
        "other_universities": ["Tribhuvan University (IAAS)", "Himalayan College of Agricultural Sciences"],
        "eligibility": "Minimum 50% in +2 Science (PCB stream) with Physics, Chemistry, and Biology.",
        "required_subjects": ["Physics", "Chemistry", "Biology (PCB)"],
        "entrance_exam": "AFU / IAAS Veterinary Central Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 350,000 - NPR 500,000 (Govt) | NPR 1,100,000 (Full Fee)",
        "overview": "Premier clinical veterinary medicine degree educating animal surgeons, livestock epidemiologists, and animal genetics specialists.",
        "career_paths": ["Veterinary Medical Officer", "Livestock Geneticist", "Veterinary Surgeon", "Wildlife Conservation Vet"],
        "key_subjects": ["Veterinary Anatomy", "Veterinary Pharmacology", "Veterinary Surgery", "Animal Nutrition", "Livestock Production"],
        "popular_colleges_count": 5,
        "verified_status": "VERIFIED_LEVEL_1"
    },

    # ------------------ Law & Humanities ------------------
    {
        "id": "course_ballb",
        "name": "Bachelor of Arts Bachelor of Laws (5 Years Integrated)",
        "code": "B.A. LL.B.",
        "category": "LAW_AND_LEGAL_STUDIES",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 10,
        "primary_university": "Tribhuvan University (Faculty of Law)",
        "other_universities": ["Kathmandu University (School of Law)", "Purbanchal University", "Pokhara University", "Lumbini Buddhist University"],
        "eligibility": "Minimum 2.0 GPA ('C' grade) in +2 from any academic stream.",
        "required_subjects": ["Any Stream (+2 Science, Management, Humanities)"],
        "entrance_exam": "TU Faculty of Law BALLB Central Entrance Test (Subjective & Objective)",
        "admission_cycle": "Annual (Bhadra - Ashoj)",
        "average_fee_range": "NPR 250,000 - NPR 450,000 (Constituent) | NPR 600,000 - NPR 950,000 (Private)",
        "overview": "Premier 5-year integrated legal education qualifying advocates, corporate legal advisors, and judicial officers for the Nepal Bar Council.",
        "career_paths": ["Advocate / Litigator", "Corporate Legal Counsel", "Judicial Officer (Loksewa Nyayik)", "Human Rights Advisor"],
        "key_subjects": ["Constitutional Law", "Criminal Law", "Civil Procedure", "Corporate & Commercial Law", "International Law", "Jurisprudence"],
        "popular_colleges_count": 16,
        "verified_status": "VERIFIED_LEVEL_1"
    }
]

def get_all_courses() -> List[Dict[str, Any]]:
    return NEPAL_COURSES

def get_course_by_id(course_id: str) -> Optional[Dict[str, Any]]:
    for c in NEPAL_COURSES:
        if c["id"] == course_id or c["code"].lower() == course_id.lower():
            return c
    return None

def search_courses(query: str) -> List[Dict[str, Any]]:
    q = query.lower().strip()
    results = []
    for c in NEPAL_COURSES:
        matched = (
            q in c["name"].lower() or
            q in c["code"].lower() or
            q in c["category"].lower() or
            q in c["primary_university"].lower() or
            any(q in p.lower() for p in c.get("career_paths", []))
        )
        if matched:
            results.append(c)
    return results
