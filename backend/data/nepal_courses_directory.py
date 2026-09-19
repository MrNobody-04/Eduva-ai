from typing import Dict, List, Any, Optional

# Comprehensive directory of Nepal Higher Education Degree Programs
NEPAL_COURSES = [
    {
        "id": "course_bsc_csit",
        "name": "B.Sc. Computer Science and Information Technology",
        "code": "B.Sc. CSIT",
        "category": "COMPUTING_AND_IT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOST)",
        "other_universities": [
            "Mid-West University",
            "Sudurpaschim University",
            "Rajarshi Janak University"
        ],
        "eligibility": "Passed +2 Science with min 'C' in Physics and Mathematics.",
        "required_subjects": [
            "Physics",
            "Mathematics",
            "Chemistry / CS"
        ],
        "entrance_exam": "TU IOST CSIT Entrance",
        "admission_cycle": "Annual (Bhadra - Ashoj)",
        "average_fee_range": "NPR 350,000 - NPR 500,000 (Govt) | NPR 750,000 - NPR 1,200,000 (Private)",
        "overview": "Blending theoretical computer science with software engineering and IT networks.",
        "career_paths": [
            "Software Engineer",
            "Full Stack Developer",
            "Data Scientist",
            "AI Researcher"
        ],
        "popular_colleges_count": 60,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_comp",
        "name": "B.E. Computer Engineering",
        "code": "B.E. Computer",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": [
            "Kathmandu University",
            "Pokhara University",
            "Purbanchal University",
            "Mid-West University",
            "Sudurpaschim University"
        ],
        "eligibility": "Minimum 45% or 'C' grade in +2 Science (Physics, Chemistry, Maths).",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Mathematics"
        ],
        "entrance_exam": "IOE / KUCAT / PokU Central Entrance",
        "admission_cycle": "Annual (Shrawan - Kartik)",
        "average_fee_range": "NPR 380,000 (IOE Constituent) | NPR 840,000 - NPR 1,250,000 (Private)",
        "overview": "Rigorous hardware and software engineering curriculum regulated by Nepal Engineering Council (NEC).",
        "career_paths": [
            "Computer Architect",
            "Firmware Engineer",
            "Systems Architect",
            "Cloud Engineer"
        ],
        "popular_colleges_count": 48,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_civil",
        "name": "B.E. Civil Engineering",
        "code": "B.E. Civil",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": [
            "Kathmandu University",
            "Pokhara University",
            "Purbanchal University",
            "MWU",
            "SU",
            "MTU"
        ],
        "eligibility": "Minimum 45% or 'C' in +2 Science.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Mathematics"
        ],
        "entrance_exam": "IOE Central Entrance Exam",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 350,000 (IOE) | NPR 750,000 - NPR 1,150,000 (Private)",
        "overview": "Nation-building engineering discipline covering Structural, Geotechnical, Water Resources, and Transportation.",
        "career_paths": [
            "Structural Engineer",
            "Hydropower Specialist",
            "Project Manager",
            "Government Civil Officer"
        ],
        "popular_colleges_count": 55,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_ai",
        "name": "B.E. in Artificial Intelligence",
        "code": "B.E. AI",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Kathmandu University (KU)",
        "other_universities": [
            "Madan Bhandari University of Science & Tech"
        ],
        "eligibility": "Minimum 50% in +2 Science with PCM.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "KUCAT Computer-Based Test",
        "admission_cycle": "Annual (Bhadra)",
        "average_fee_range": "NPR 890,000 (KU Main Campus)",
        "overview": "First specialized Artificial Intelligence engineering degree in Nepal covering Deep Learning, NLP, and Robotics.",
        "career_paths": [
            "AI Engineer",
            "MLOps Architect",
            "Robotics Specialist",
            "Data Scientist"
        ],
        "popular_colleges_count": 4,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_software",
        "name": "B.E. Software Engineering",
        "code": "B.E. Software",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Pokhara University",
        "other_universities": [
            "Nepal Engineering College",
            "Gandaki University"
        ],
        "eligibility": "Minimum 45% or 'C' in +2 Science.",
        "required_subjects": [
            "Mathematics",
            "Physics"
        ],
        "entrance_exam": "PokU Central Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 650,000 - NPR 890,000",
        "overview": "Focused curriculum on software architecture, Agile methodologies, cloud computing, and automated QA.",
        "career_paths": [
            "Software Architect",
            "Lead Developer",
            "QA Automation Engineer",
            "Product Manager"
        ],
        "popular_colleges_count": 12,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_mbbs",
        "name": "Bachelor of Medicine and Bachelor of Surgery",
        "code": "MBBS",
        "category": "MEDICAL_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 5.5,
        "semesters": 10,
        "primary_university": "Medical Education Commission (MEC)",
        "other_universities": [
            "Tribhuvan University (IOM)",
            "Kathmandu University (KUSMS)",
            "BPKIHS",
            "PAHS",
            "KAHS",
            "MDCHUS"
        ],
        "eligibility": "Minimum 50% in +2 Science (PCB stream) or 2.4 GPA.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology"
        ],
        "entrance_exam": "MEC CEE National Medical Entrance Exam",
        "admission_cycle": "Annual (Magh - Falgun)",
        "average_fee_range": "Subsidized (Free Quota) | NPR 4,200,000 - NPR 4,600,000 (Full Fee Govt Capped)",
        "overview": "Apex clinical medicine degree with 4.5 years didactic instruction + 1 year compulsory rotating internship.",
        "career_paths": [
            "Medical Officer",
            "General Physician",
            "Surgeon (Post MD/MS)",
            "Public Health Administrator"
        ],
        "popular_colleges_count": 22,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bds",
        "name": "Bachelor of Dental Surgery",
        "code": "BDS",
        "category": "MEDICAL_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 9,
        "primary_university": "Medical Education Commission (MEC)",
        "other_universities": [
            "Tribhuvan University (IOM)",
            "Kathmandu University",
            "BPKIHS"
        ],
        "eligibility": "Minimum 50% in +2 Science with Biology.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology"
        ],
        "entrance_exam": "MEC CEE Dental Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "Subsidized (Free Quota) | NPR 2,050,000 (MEC Capped)",
        "overview": "Specialized dental and maxillo-facial medical science degree.",
        "career_paths": [
            "Dental Surgeon",
            "Orthodontist (Post MDS)",
            "Oral Health Specialist"
        ],
        "popular_colleges_count": 14,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bsc_nursing",
        "name": "B.Sc. Nursing",
        "code": "B.Sc. Nursing",
        "category": "MEDICAL_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Medical Education Commission (MEC)",
        "other_universities": [
            "TU (IOM)",
            "KU",
            "BPKIHS",
            "PAHS",
            "KAHS",
            "NAMS",
            "PokAHS",
            "RAHS",
            "MIHS",
            "MDCHUS"
        ],
        "eligibility": "Minimum 50% in +2 Science with Biology.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology"
        ],
        "entrance_exam": "MEC CEE Nursing Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 750,000 - NPR 950,000",
        "overview": "Professional nursing qualification preparing critical care nurses and clinical supervisors.",
        "career_paths": [
            "Registered Nurse",
            "ICU Specialist Nurse",
            "Nursing Officer",
            "Clinical Instructor"
        ],
        "popular_colleges_count": 45,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bpharm",
        "name": "Bachelor of Pharmacy",
        "code": "B.Pharm",
        "category": "MEDICAL_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOM)",
        "other_universities": [
            "Kathmandu University",
            "Pokhara University",
            "Purbanchal University",
            "Gandaki University",
            "KAHS"
        ],
        "eligibility": "Minimum 50% in +2 Science with Biology or Maths.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology / Maths"
        ],
        "entrance_exam": "MEC CEE Pharmacy Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 520,000 - NPR 750,000",
        "overview": "Pharmaceutical sciences degree qualifying professionals for industrial manufacturing and hospital clinical pharmacy.",
        "career_paths": [
            "Pharmacist",
            "Quality Control Officer",
            "Regulatory Affairs Specialist",
            "Clinical Pharmacist"
        ],
        "popular_colleges_count": 28,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bsc_ag",
        "name": "B.Sc. Agriculture",
        "code": "B.Sc. Ag",
        "category": "AGRICULTURE_AND_FORESTRY",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Agriculture and Forestry University (AFU)",
        "other_universities": [
            "Tribhuvan University (IAAS)",
            "Madhesh Agricultural University",
            "Purbanchal University"
        ],
        "eligibility": "Minimum 50% in +2 Science with Biology/Maths.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology / Maths"
        ],
        "entrance_exam": "AFU / IAAS Central Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 85,000 - NPR 380,000",
        "overview": "Agricultural science degree covering agronomy, horticulture, plant pathology, and agribusiness economics.",
        "career_paths": [
            "Agriculture Officer (Loksewa)",
            "Agronomist",
            "Seed Technology Specialist",
            "Farm Manager"
        ],
        "popular_colleges_count": 18,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bvsc",
        "name": "B.V.Sc. & A.H. (Veterinary Science)",
        "code": "B.V.Sc. & A.H.",
        "category": "AGRICULTURE_AND_FORESTRY",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 10,
        "primary_university": "Agriculture and Forestry University (AFU)",
        "other_universities": [
            "Tribhuvan University (IAAS)"
        ],
        "eligibility": "Minimum 50% in +2 Science (PCB stream).",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology"
        ],
        "entrance_exam": "AFU / IAAS Veterinary Central Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 110,000 (Govt Subsidized) | NPR 650,000 (Full Fee)",
        "overview": "Premier clinical veterinary medicine degree educating animal surgeons and livestock epidemiologists.",
        "career_paths": [
            "Veterinary Medical Officer",
            "Animal Surgeon",
            "Wildlife Conservation Vet"
        ],
        "popular_colleges_count": 5,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bsc_forestry",
        "name": "B.Sc. Forestry",
        "code": "B.Sc. Forestry",
        "category": "AGRICULTURE_AND_FORESTRY",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOF)",
        "other_universities": [
            "Agriculture and Forestry University (AFU)"
        ],
        "eligibility": "Minimum 50% in +2 Science.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology / Maths"
        ],
        "entrance_exam": "IOF / AFU Forestry Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 80,000 - NPR 350,000",
        "overview": "Conservation science degree covering silviculture, watershed management, and biodiversity protection.",
        "career_paths": [
            "Forest Officer (Ranger/DFO)",
            "Wildlife Biologist",
            "GIS Environmental Analyst"
        ],
        "popular_colleges_count": 6,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bams",
        "name": "Bachelor of Ayurvedic Medicine and Surgery",
        "code": "BAMS",
        "category": "MEDICAL_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 5.5,
        "semesters": 10,
        "primary_university": "Nepal Sanskrit University (NSU)",
        "other_universities": [
            "Tribhuvan University (IOM)",
            "Yogamaya Ayurveda University"
        ],
        "eligibility": "Minimum 50% in +2 Science (PCB).",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology"
        ],
        "entrance_exam": "MEC CEE National Ayurveda Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 120,000 - NPR 650,000",
        "overview": "Traditional Vedic medicine system combined with modern anatomy, clinical surgery, and herbal pharmacology.",
        "career_paths": [
            "Ayurvedic Medical Officer",
            "Herbal Pharmacologist",
            "Wellness Consultant"
        ],
        "popular_colleges_count": 6,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_ballb",
        "name": "B.A. LL.B. (5 Years Integrated)",
        "code": "B.A. LL.B.",
        "category": "LAW_AND_LEGAL_STUDIES",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 10,
        "primary_university": "Tribhuvan University (Faculty of Law)",
        "other_universities": [
            "Kathmandu University (School of Law)",
            "Purbanchal University",
            "Pokhara University",
            "Lumbini Buddhist University",
            "Madhesh University"
        ],
        "eligibility": "Minimum 2.0 GPA ('C' grade) in +2 from any stream.",
        "required_subjects": [
            "Any Stream (+2 Science, Management, Humanities)"
        ],
        "entrance_exam": "TU Faculty of Law BALLB Central Entrance Test",
        "admission_cycle": "Annual (Bhadra - Ashoj)",
        "average_fee_range": "NPR 250,000 - NPR 450,000 (Constituent) | NPR 600,000 - NPR 950,000 (Private)",
        "overview": "Premier 5-year legal education qualifying advocates and judicial officers for the Nepal Bar Council.",
        "career_paths": [
            "Advocate / Litigator",
            "Corporate Legal Counsel",
            "Judicial Officer (Loksewa Nyayik)"
        ],
        "popular_colleges_count": 16,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bba",
        "name": "Bachelor of Business Administration",
        "code": "BBA",
        "category": "MANAGEMENT_AND_BUSINESS",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (FOM)",
        "other_universities": [
            "Kathmandu University (KUSOM)",
            "Pokhara University",
            "Purbanchal University",
            "Mid-West University",
            "Madhesh University"
        ],
        "eligibility": "Minimum 1.8 GPA / 'D+' in +2 from any stream.",
        "required_subjects": [
            "English",
            "Any stream"
        ],
        "entrance_exam": "FOM CMAT / KUUMAT Entrance Examination",
        "admission_cycle": "Annual (Shrawan - Bhadra)",
        "average_fee_range": "NPR 350,000 - NPR 500,000 (Constituent) | NPR 650,000 - NPR 950,000 (Private)",
        "overview": "Professional management program specializing in Finance, Marketing, HR, and Entrepreneurship.",
        "career_paths": [
            "Banking Officer",
            "Financial Analyst",
            "Marketing Strategist",
            "Business Entrepreneur"
        ],
        "popular_colleges_count": 85,
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
        "other_universities": [
            "Gandaki University",
            "Lumbini Technological University",
            "TU (IOST)"
        ],
        "eligibility": "Minimum 'C' in +2 Science or Management with Mathematics.",
        "required_subjects": [
            "Mathematics"
        ],
        "entrance_exam": "University Central Entrance Test",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 350,000 - NPR 680,000",
        "overview": "Applied software design, cloud networking, database administration, and cybersecurity.",
        "career_paths": [
            "Network Engineer",
            "Cyber Security Analyst",
            "Database Administrator"
        ],
        "popular_colleges_count": 35,
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
        "other_universities": [
            "Purbanchal University",
            "Pokhara University",
            "Rajarshi Janak University"
        ],
        "eligibility": "Minimum 'D+' (GPA 2.0 or above) in +2 from any stream.",
        "required_subjects": [
            "English"
        ],
        "entrance_exam": "TU FOHSS BCA Central Entrance Exam",
        "admission_cycle": "Annual (Bhadra - Kartik)",
        "average_fee_range": "NPR 300,000 - NPR 450,000 (Constituent) | NPR 500,000 - NPR 850,000 (Private)",
        "overview": "Application-oriented computing degree open to Science, Management, and Humanities graduates.",
        "career_paths": [
            "Web Developer",
            "Mobile App Engineer",
            "UI/UX Designer"
        ],
        "popular_colleges_count": 140,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_barch",
        "name": "Bachelor of Architecture",
        "code": "B.Arch",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 5,
        "semesters": 10,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": [
            "Kathmandu University",
            "Pokhara University",
            "Purbanchal University"
        ],
        "eligibility": "Minimum 45% in +2 Science with Physics & Maths + Architecture Aptitude.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "IOE Central Architecture Entrance & Drawing Aptitude",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 420,000 (IOE Constituent) | NPR 950,000 - NPR 1,350,000 (Private)",
        "overview": "Five-year professional architectural design, urban planning, and sustainable construction curriculum.",
        "career_paths": [
            "Architectural Designer",
            "Urban Planner",
            "Interior Architect"
        ],
        "popular_colleges_count": 15,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bmlt",
        "name": "B.Sc. Medical Laboratory Technology",
        "code": "BMLT",
        "category": "MEDICAL_AND_HEALTH",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOM)",
        "other_universities": [
            "BPKIHS",
            "PAHS",
            "Pokhara University",
            "MIHS",
            "RAHS"
        ],
        "eligibility": "Minimum 50% in +2 Science with Biology.",
        "required_subjects": [
            "Physics",
            "Chemistry",
            "Biology"
        ],
        "entrance_exam": "MEC CEE Allied Health Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 450,000 - NPR 750,000",
        "overview": "Diagnostics and laboratory medicine degree covering hematology, biochemistry, and molecular diagnostics.",
        "career_paths": [
            "Medical Technologist",
            "Clinical Lab Director",
            "Pathology Lab Supervisor"
        ],
        "popular_colleges_count": 16,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_data_science",
        "name": "B.Sc. in Data Science & Artificial Intelligence",
        "code": "B.Sc. Data Science",
        "category": "COMPUTING_AND_IT",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Madan Bhandari University of Science & Tech",
        "other_universities": [
            "Kathmandu University",
            "Gandaki University"
        ],
        "eligibility": "Minimum 50% in +2 Science with Mathematics.",
        "required_subjects": [
            "Mathematics",
            "Physics"
        ],
        "entrance_exam": "MBUST Research Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 350,000 - NPR 750,000",
        "overview": "Cutting-edge curriculum in big data engineering, neural networks, predictive analytics, and AI ethics.",
        "career_paths": [
            "Data Scientist",
            "Machine Learning Engineer",
            "Business Intelligence Specialist"
        ],
        "popular_colleges_count": 5,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_mechanical",
        "name": "B.E. Mechanical Engineering",
        "code": "B.E. Mechanical",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": [
            "Kathmandu University",
            "Pokhara University"
        ],
        "eligibility": "Minimum 45% in +2 Science with PCM.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "IOE Central Entrance Exam",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 340,000 (IOE Constituent) | NPR 850,000 (Private)",
        "overview": "Design and manufacture of thermal power plants, robotics, automobile engines, and aerospace structures.",
        "career_paths": [
            "Mechanical Design Engineer",
            "Hydropower Maintenance Engineer",
            "Robotics Specialist"
        ],
        "popular_colleges_count": 12,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_electrical",
        "name": "B.E. Electrical Engineering",
        "code": "B.E. Electrical",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE)",
        "other_universities": [
            "Kathmandu University",
            "Pokhara University",
            "Manmohan Technical University"
        ],
        "eligibility": "Minimum 45% in +2 Science with PCM.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "IOE Central Entrance Exam",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 340,000 (IOE) | NPR 840,000 (Private)",
        "overview": "Power generation, transmission grids, renewable energy, and electrical machinery.",
        "career_paths": [
            "Power Grid Engineer (NEA)",
            "Substation Engineer",
            "Renewable Energy Specialist"
        ],
        "popular_colleges_count": 16,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_automobile",
        "name": "B.E. Automobile Engineering",
        "code": "B.E. Automobile",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE Thapathali)",
        "other_universities": [
            "Purbanchal University"
        ],
        "eligibility": "Minimum 45% in +2 Science with PCM.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "IOE Central Entrance Exam",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 330,000 (Thapathali Campus)",
        "overview": "Vehicle dynamics, electric vehicle (EV) battery powertrains, aerodynamics, and chassis design.",
        "career_paths": [
            "EV Powertrain Engineer",
            "Automotive Design Specialist",
            "Fleet Technical Director"
        ],
        "popular_colleges_count": 3,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_geomatics",
        "name": "B.E. Geomatics Engineering",
        "code": "B.E. Geomatics",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (WRC Lamachaur)",
        "other_universities": [
            "Kathmandu University"
        ],
        "eligibility": "Minimum 45% in +2 Science with PCM.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "IOE / KUCAT Central Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 320,000 (WRC Pokhara)",
        "overview": "Surveying, satellite remote sensing, photogrammetry, GIS mapping, and cadastral boundary measurement.",
        "career_paths": [
            "Survey Officer (Napi Bibhag)",
            "GIS Spatial Analyst",
            "Remote Sensing Scientist"
        ],
        "popular_colleges_count": 4,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_be_industrial",
        "name": "B.E. Industrial Engineering",
        "code": "B.E. Industrial",
        "category": "ENGINEERING",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (IOE Thapathali)",
        "other_universities": [],
        "eligibility": "Minimum 45% in +2 Science.",
        "required_subjects": [
            "Physics",
            "Mathematics"
        ],
        "entrance_exam": "IOE Central Entrance Exam",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 330,000 (Thapathali Campus)",
        "overview": "Operations research, supply chain optimization, manufacturing systems, and quality ergonomics.",
        "career_paths": [
            "Supply Chain Manager",
            "Operations Director",
            "Quality Assurance Lead"
        ],
        "popular_colleges_count": 2,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bbm",
        "name": "Bachelor of Business Management",
        "code": "BBM",
        "category": "MANAGEMENT_AND_BUSINESS",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 8,
        "primary_university": "Tribhuvan University (FOM)",
        "other_universities": [
            "Pokhara University"
        ],
        "eligibility": "Minimum 1.8 GPA / 'D+' in +2 from any stream.",
        "required_subjects": [
            "English"
        ],
        "entrance_exam": "FOM CMAT Entrance",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 330,000 (Constituent) | NPR 550,000 (Private)",
        "overview": "Contemporary business leadership curriculum focusing on practical organizational management.",
        "career_paths": [
            "Corporate Business Manager",
            "HR Generalist",
            "Retail Operations Lead"
        ],
        "popular_colleges_count": 45,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bbs",
        "name": "Bachelor of Business Studies",
        "code": "BBS",
        "category": "MANAGEMENT_AND_BUSINESS",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 4,
        "primary_university": "Tribhuvan University (FOM)",
        "other_universities": [
            "Purbanchal University",
            "Mid-West University"
        ],
        "eligibility": "Minimum 'D+' in +2 from any stream.",
        "required_subjects": [
            "Any Stream"
        ],
        "entrance_exam": "College Level Merit Admission",
        "admission_cycle": "Annual (Kartik)",
        "average_fee_range": "NPR 30,000 - NPR 60,000 (Affordable Public Standard)",
        "overview": "Nepal's most widely attended annual-system degree providing foundational accounting and economics.",
        "career_paths": [
            "Accountant",
            "Tax Consultant",
            "Banking Assistant",
            "Commercial Officer"
        ],
        "popular_colleges_count": 450,
        "verified_status": "VERIFIED_LEVEL_1"
    },
    {
        "id": "course_bed",
        "name": "Bachelor of Education",
        "code": "B.Ed",
        "category": "HUMANITIES_AND_EDUCATION",
        "level": "BACHELOR",
        "duration_years": 4,
        "semesters": 4,
        "primary_university": "Tribhuvan University (Faculty of Education)",
        "other_universities": [
            "Nepal Open University",
            "Mid-West University",
            "Sudurpaschim University"
        ],
        "eligibility": "Minimum 'D+' in +2 from any stream.",
        "required_subjects": [
            "Any Stream"
        ],
        "entrance_exam": "University Enrollment Merit",
        "admission_cycle": "Annual",
        "average_fee_range": "NPR 25,000 - NPR 50,000",
        "overview": "Professional teacher qualification degree preparing secondary school educators and curriculum specialists.",
        "career_paths": [
            "Secondary School Teacher (Shikshak Sewa Aayog)",
            "School Principal",
            "Curriculum Officer"
        ],
        "popular_colleges_count": 300,
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
