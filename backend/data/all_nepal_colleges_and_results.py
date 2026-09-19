from typing import Dict, List, Any

# Comprehensive directory of all 26+ Nepal Universities, Constituent Campuses & Affiliated Colleges
ALL_NEPAL_COLLEGES = [
    {
        "id": "col_pulchowk",
        "name": "Pulchowk Campus (IOE Central)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Pulchowk, Lalitpur",
        "established": 1972,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Apex engineering institution offering regular and full-fee programs with world-class research laboratories.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 36,
                "full_fee_seats": 60,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 380,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 72,
                "full_fee_seats": 120,
                "regular_fee": "NPR 42,000",
                "full_fee": "NPR 350,000"
            },
            {
                "name": "B.E. Electronics & Communication",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 380,000"
            }
        ],
        "admission_criteria": "IOE CBT Entrance Ranking.",
        "scholarships": "Top 10% IOE Merit Free Tuition."
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
        "description": "Historic government engineering campus in central Kathmandu renowned for Automobile and Industrial Engineering.",
        "courses": [
            {
                "name": "B.E. Automobile Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 42,000",
                "full_fee": "NPR 330,000"
            },
            {
                "name": "B.E. Industrial Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 42,000",
                "full_fee": "NPR 330,000"
            },
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 380,000"
            }
        ],
        "admission_criteria": "IOE Central Entrance Exam rank.",
        "scholarships": "Government subsidized regular seats."
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
        "description": "Scenic campus in Pokhara valley offering Geomatics, Computer, and Electrical Engineering.",
        "courses": [
            {
                "name": "B.E. Geomatics Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 42,000",
                "full_fee": "NPR 320,000"
            },
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 370,000"
            }
        ],
        "admission_criteria": "IOE Entrance Rank score.",
        "scholarships": "Gandaki Chief Minister Quota."
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
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "-",
                "full_fee": "NPR 780,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 144,
                "regular_fee": "-",
                "full_fee": "NPR 740,000"
            },
            {
                "name": "B.E. Electronics & Info",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 690,000"
            },
            {
                "name": "Bachelor of Architecture",
                "duration": "5 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 840,000"
            }
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
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "-",
                "full_fee": "NPR 760,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "-",
                "full_fee": "NPR 720,000"
            },
            {
                "name": "B.E. Electrical Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 680,000"
            },
            {
                "name": "BCA (Computer Application)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 40,
                "regular_fee": "-",
                "full_fee": "NPR 450,000"
            }
        ],
        "admission_criteria": "IOE / TU Entrance Examination qualified.",
        "scholarships": "TU 10% Quota + ACEM Academic Excellence Waivers."
    },
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
            {
                "name": "B.Tech in Artificial Intelligence",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "-",
                "full_fee": "NPR 820,000"
            },
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 120,
                "regular_fee": "-",
                "full_fee": "NPR 780,000"
            },
            {
                "name": "B.E. Mechanical (Energy)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "-",
                "full_fee": "NPR 720,000"
            },
            {
                "name": "B.E. Civil (Hydropower)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "-",
                "full_fee": "NPR 740,000"
            }
        ],
        "admission_criteria": "KUCAT Computer-Based Test score + +2 Science Minimum 2.0 GPA.",
        "scholarships": "KU Founders Merit Fellowship (50%-100% Fee Waiver) for top KUCAT percentiles."
    },
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
            {
                "name": "B.E. Information Technology (IT)",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 48,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 420,000"
            },
            {
                "name": "B.E. Software Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 48,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 450,000"
            },
            {
                "name": "B.Pharmacy",
                "duration": "4 Years",
                "regular_seats": 8,
                "full_fee_seats": 32,
                "regular_fee": "NPR 55,000",
                "full_fee": "NPR 580,000"
            },
            {
                "name": "BBA",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 80,
                "regular_fee": "NPR 40,000",
                "full_fee": "NPR 320,000"
            }
        ],
        "admission_criteria": "PU Central Entrance Examination (PU-CET).",
        "scholarships": "10% Mandatory Free Scholarship Quota across all affiliated colleges."
    },
    {
        "id": "col_nec_bhaktapur",
        "name": "Nepal Engineering College (NEC)",
        "university": "Pokhara University (PokU)",
        "type": "Community / Non-Profit Affiliated",
        "location": "Changunarayan, Bhaktapur",
        "established": 1994,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80",
        "description": "Premier community engineering institution in Nepal offering Software and Civil degrees.",
        "courses": [
            {
                "name": "B.E. Software Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "NPR 890,000",
                "full_fee": "NPR 890,000"
            }
        ],
        "admission_criteria": "PokU Entrance / NEC Entrance Rank.",
        "scholarships": "Pokhara University Central Quota."
    },
    {
        "id": "col_afu_rampur",
        "name": "Faculty of Agriculture, AFU Central",
        "university": "Agriculture and Forestry University (AFU)",
        "type": "Government Constituent",
        "location": "Rampur, Chitwan",
        "established": 2010,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
        "description": "Specialized state university for agricultural science, horticulture, and livestock research.",
        "courses": [
            {
                "name": "B.Sc. Agriculture (B.Sc. Ag)",
                "duration": "4 Years",
                "regular_seats": 60,
                "full_fee_seats": 100,
                "regular_fee": "NPR 85,000",
                "full_fee": "NPR 380,000"
            },
            {
                "name": "B.V.Sc. & A.H. (Veterinary Science)",
                "duration": "5 Years",
                "regular_seats": 20,
                "full_fee_seats": 30,
                "regular_fee": "NPR 110,000",
                "full_fee": "NPR 650,000"
            }
        ],
        "admission_criteria": "AFU Central Entrance Examination.",
        "scholarships": "Government full tuition scholarship."
    },
    {
        "id": "col_st_xaviers",
        "name": "St. Xavier's College",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Maitighar, Kathmandu",
        "established": 1988,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Prestigious Jesuit educational institution known for academic rigor in B.Sc. CSIT and Microbiology.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "NPR 820,000",
                "full_fee": "NPR 820,000"
            }
        ],
        "admission_criteria": "IOST CSIT Entrance Exam + Interview.",
        "scholarships": "Jesuit institutional need-and-merit grants."
    },
    {
        "id": "col_prime",
        "name": "Prime College",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Khusibu, Naya Bazaar, Kathmandu",
        "established": 2001,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
        "description": "Pioneering IT and management college in Kathmandu valley featuring dedicated Incubation Lab, AWS Academy accreditation, and robotics club.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 72,
                "regular_fee": "-",
                "full_fee": "NPR 580,000"
            },
            {
                "name": "BCA (Bachelor in Computer Application)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 70,
                "regular_fee": "-",
                "full_fee": "NPR 490,000"
            },
            {
                "name": "BBA (Bachelor of Business Administration)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 64,
                "regular_fee": "-",
                "full_fee": "NPR 520,000"
            },
            {
                "name": "BBM (Bachelor of Business Management)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 64,
                "regular_fee": "-",
                "full_fee": "NPR 480,000"
            }
        ],
        "admission_criteria": "TU IOST (CSIT) / FOHSS (BCA) / FOM (CMAT) entrance scores.",
        "scholarships": "Prime Merit Scholarship for entrance top 100 rankers + Semester Topper awards."
    },
    {
        "id": "col_padmashree",
        "name": "Padmashree International College",
        "university": "Tribhuvan University (TU) & International Affiliations",
        "type": "Private Affiliated",
        "location": "Tinkune / Aloknagar, Kathmandu",
        "established": 2007,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Renowned higher education hub in Tinkune offering IT, Food Technology, and Hospitality programs with hands-on industrial labs and global credit transfers.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 540,000"
            },
            {
                "name": "BCA (Bachelor in Computer Application)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "-",
                "full_fee": "NPR 460,000"
            },
            {
                "name": "B.Tech Food Technology",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 36,
                "regular_fee": "-",
                "full_fee": "NPR 490,000"
            },
            {
                "name": "BIT (Hons) - Nilai University Affiliated",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "-",
                "full_fee": "NPR 650,000"
            }
        ],
        "admission_criteria": "IOST Entrance / FOHSS BCA test + College Personal Counseling.",
        "scholarships": "Founder Scholarships + MOEST Approved Quota discounts."
    },
    {
        "id": "col_kathford",
        "name": "Kathford International College of Engineering and Management",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Balkumari, Lalitpur",
        "established": 2003,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Comprehensive engineering and technology campus situated at Balkumari Ring Road with strong placement partnerships and tech incubators.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 750,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "-",
                "full_fee": "NPR 710,000"
            },
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 570,000"
            },
            {
                "name": "BCA",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 35,
                "regular_fee": "-",
                "full_fee": "NPR 460,000"
            }
        ],
        "admission_criteria": "IOE / IOST / FOHSS entrance qualifications.",
        "scholarships": "Kathford Academic Excellence Fund + IOE 10% Reserved Quota."
    },
    {
        "id": "col_dwit",
        "name": "Deerwalk Institute of Technology (DWIT)",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Sifal, Kathmandu",
        "established": 2010,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        "description": "Industry-driven technology institute in Sifal affiliated with TU, backed by Deerwalk Inc. offering guaranteed enterprise software internships and modern campus life.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 72,
                "regular_fee": "-",
                "full_fee": "NPR 790,000"
            },
            {
                "name": "BCA",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 40,
                "regular_fee": "-",
                "full_fee": "NPR 680,000"
            }
        ],
        "admission_criteria": "TU IOST / FOHSS entrance + Deerwalk Technical Aptitude & Interview.",
        "scholarships": "Merit scholarships for top 10% entrance rankers."
    },
    {
        "id": "col_apex",
        "name": "Apex College",
        "university": "Pokhara University (PU)",
        "type": "Private Affiliated",
        "location": "Mid-Baneshwor, Kathmandu",
        "established": 2000,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=800&auto=format&fit=crop&q=80",
        "description": "Top-tier business and IT college affiliated to Pokhara University, celebrated for corporate placements, case-study pedagogy, and active entrepreneurship clubs.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Administration)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 120,
                "regular_fee": "-",
                "full_fee": "NPR 580,000"
            },
            {
                "name": "BCIS (Computer Information Systems)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 540,000"
            },
            {
                "name": "BBA-BI (Banking and Insurance)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 560,000"
            }
        ],
        "admission_criteria": "Pokhara University Entrance Exam + Apex Aptitude Interview.",
        "scholarships": "PU 10% Open Quota + Apex Merit Waiver based on +2 CGPA."
    },
    {
        "id": "col_lacm",
        "name": "Little Angels' College of Management (LACM)",
        "university": "Kathmandu University (KU)",
        "type": "Private Affiliated",
        "location": "Hattiban, Lalitpur",
        "established": 1999,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
        "description": "Premier Kathmandu University affiliated college in Hattiban offering BBA, BBIS, and BHM on a sprawling 350-roopani serene modern campus.",
        "courses": [
            {
                "name": "BBIS (Bachelor of Business Information Systems)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 40,
                "regular_fee": "-",
                "full_fee": "NPR 640,000"
            },
            {
                "name": "BBA",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 80,
                "regular_fee": "-",
                "full_fee": "NPR 620,000"
            },
            {
                "name": "BHM (Hotel Management)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 40,
                "regular_fee": "-",
                "full_fee": "NPR 680,000"
            }
        ],
        "admission_criteria": "KUMAT (KU Management Admission Test) score + Interview.",
        "scholarships": "KU Founder Scholarships + LA Trust Merit Waivers."
    },
    {
        "id": "col_kantipur_eng",
        "name": "Kantipur Engineering College (KEC)",
        "university": "Tribhuvan University (TU)",
        "type": "Private Affiliated",
        "location": "Dhapakhel, Lalitpur",
        "established": 1998,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Extensive engineering campus in Dhapakhel Lalitpur with specialized hardware laboratories, high university graduation pass rates, and research journals.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "-",
                "full_fee": "NPR 760,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 144,
                "regular_fee": "-",
                "full_fee": "NPR 720,000"
            },
            {
                "name": "B.E. Electrical Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "-",
                "full_fee": "NPR 670,000"
            }
        ],
        "admission_criteria": "IOE Computer-Based Entrance Examination qualification.",
        "scholarships": "10% IOE Free Quota + College Founder Scholarships."
    },
    {
        "id": "col_erc_dharan",
        "name": "Eastern Regional Campus (ERC Dharan)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Tinkune, Dharan, Sunsari",
        "established": 1978,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Constituent campus in eastern Nepal offering Agricultural and Computer Engineering.",
        "courses": [
            {
                "name": "B.E. Agricultural Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 40,000",
                "full_fee": "NPR 310,000"
            },
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 12,
                "full_fee_seats": 36,
                "regular_fee": "NPR 45,000",
                "full_fee": "NPR 370,000"
            }
        ],
        "admission_criteria": "IOE Entrance rank.",
        "scholarships": "Subsidized government seats."
    },
    {
        "id": "col_iom_maharajgunj",
        "name": "Maharajgunj Medical Campus (IOM Central)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Maharajgunj, Kathmandu",
        "established": 1972,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
        "description": "Nepal's highest-ranked apex medical institution attached to TU Teaching Hospital (TUTH).",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 40,
                "full_fee_seats": 60,
                "regular_fee": "Subsidized (Free)",
                "full_fee": "NPR 4,200,000"
            },
            {
                "name": "BDS (Dental Surgery)",
                "duration": "5 Years",
                "regular_seats": 15,
                "full_fee_seats": 25,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 2,100,000"
            }
        ],
        "admission_criteria": "MEC CEE national merit rank.",
        "scholarships": "MEC 75% free scholarship quota."
    },
    {
        "id": "col_ascol",
        "name": "Amrit Science Campus (ASCOL)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Thamel, Kathmandu",
        "established": 1956,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
        "description": "Pioneering pure science campus offering B.Sc. CSIT, Botany, Chemistry, and Physics.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 36,
                "full_fee_seats": 72,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 380,000"
            }
        ],
        "admission_criteria": "TU IOST CSIT Central Entrance Examination.",
        "scholarships": "IOST Merit Free Tuition."
    },
    {
        "id": "col_patan_campus",
        "name": "Patan Multiple Campus",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Patan Dhoka, Lalitpur",
        "established": 1954,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Multidisciplinary government campus in Lalitpur with large B.Sc. CSIT, BCA, and BBA departments.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 36,
                "full_fee_seats": 72,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 380,000"
            },
            {
                "name": "BCA (Bachelor in Computer Application)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 70,
                "regular_fee": "NPR 320,000",
                "full_fee": "NPR 320,000"
            }
        ],
        "admission_criteria": "IOST CSIT / FOHSS BCA Entrance.",
        "scholarships": "Constituent campus subsidized fee structure."
    },
    {
        "id": "col_ku_engineering",
        "name": "KU School of Engineering",
        "university": "Kathmandu University (KU)",
        "type": "Autonomous Constituent",
        "location": "Dhulikhel, Kavre",
        "established": 1994,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Premier engineering school renowned for AI, Computer, Civil, Mechanical, and Chemical Engineering programs.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 60,
                "full_fee_seats": 60,
                "regular_fee": "NPR 840,000",
                "full_fee": "NPR 840,000"
            },
            {
                "name": "B.E. in Artificial Intelligence (AI)",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 890,000",
                "full_fee": "NPR 890,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 60,
                "full_fee_seats": 60,
                "regular_fee": "NPR 800,000",
                "full_fee": "NPR 800,000"
            }
        ],
        "admission_criteria": "KUCAT CBT score.",
        "scholarships": "KU Merit & Need-based Tuition Waivers."
    },
    {
        "id": "col_kusom",
        "name": "KU School of Management (KUSOM)",
        "university": "Kathmandu University (KU)",
        "type": "Autonomous Constituent",
        "location": "Balkumari, Lalitpur",
        "established": 1993,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Benchmark business school offering BBA (Honors), BBA (Emphasis), and MBA programs.",
        "courses": [
            {
                "name": "BBA (Honors / Emphasis)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 120,
                "regular_fee": "NPR 880,000",
                "full_fee": "NPR 880,000"
            }
        ],
        "admission_criteria": "KUUMAT Entrance Exam + Interview.",
        "scholarships": "Dean's List Merit Scholarships."
    },
    {
        "id": "col_kusms_dhulikhel",
        "name": "KU School of Medical Sciences (KUSMS)",
        "university": "Kathmandu University (KU)",
        "type": "Autonomous Constituent",
        "location": "Dhulikhel, Kavre",
        "established": 2001,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
        "description": "Autonomous university medical school operating at Dhulikhel Hospital with international training standards.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 15,
                "full_fee_seats": 60,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 4,200,000"
            },
            {
                "name": "BDS (Dental Surgery)",
                "duration": "5 Years",
                "regular_seats": 5,
                "full_fee_seats": 25,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 2,050,000"
            }
        ],
        "admission_criteria": "MEC CEE Entrance Exam.",
        "scholarships": "MEC 75% Public School Free Quota Seats."
    },
    {
        "id": "col_pu_central_engineering",
        "name": "School of Engineering, Pokhara University",
        "university": "Pokhara University (PokU)",
        "type": "Government Constituent",
        "location": "Dhungepatan, Pokhara",
        "established": 1997,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Constituent engineering school offering Software, Civil, and Electrical Engineering.",
        "courses": [
            {
                "name": "B.E. Software Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 280,000",
                "full_fee": "NPR 650,000"
            },
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 280,000",
                "full_fee": "NPR 650,000"
            }
        ],
        "admission_criteria": "Pokhara University Central Entrance Examination.",
        "scholarships": "20% Free Scholarship Seats."
    },
    {
        "id": "col_puset_biratnagar",
        "name": "PU School of Engineering & Tech (PUSET)",
        "university": "Purbanchal University (PU)",
        "type": "Government Constituent",
        "location": "Biratnagar, Morang",
        "established": 1999,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Constituent technical campus of Purbanchal University offering B.E. Computer and Civil Engineering.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 15,
                "full_fee_seats": 45,
                "regular_fee": "NPR 220,000",
                "full_fee": "NPR 580,000"
            }
        ],
        "admission_criteria": "Purbanchal University Entrance.",
        "scholarships": "PU 10% Free Scholarship Quota."
    },
    {
        "id": "col_afu_forestry_hetauda",
        "name": "Faculty of Forestry, AFU",
        "university": "Agriculture and Forestry University (AFU)",
        "type": "Government Constituent",
        "location": "Hetauda, Makwanpur",
        "established": 2010,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
        "description": "Specialized forestry research and wildlife conservation campus.",
        "courses": [
            {
                "name": "B.Sc. Forestry",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 50,
                "regular_fee": "NPR 80,000",
                "full_fee": "NPR 350,000"
            }
        ],
        "admission_criteria": "AFU Central Forestry Entrance Test.",
        "scholarships": "Ministry of Forests reservation quota."
    },
    {
        "id": "col_mwu_central_engineering",
        "name": "Central Campus of Engineering, MWU",
        "university": "Mid-West University (MWU)",
        "type": "Government Constituent",
        "location": "Birendranagar, Surkhet",
        "established": 2010,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80",
        "description": "Karnali Province apex university engineering school offering B.E. Computer and Civil.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 480,000"
            },
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 36,
                "regular_fee": "NPR 160,000",
                "full_fee": "NPR 390,000"
            }
        ],
        "admission_criteria": "MWU Central Entrance Examination.",
        "scholarships": "Karnali Province Affirmative Subsidy."
    },
    {
        "id": "col_fwu_central_engineering",
        "name": "Central Campus of Engineering, Sudurpaschim University",
        "university": "Sudurpaschim University (SU)",
        "type": "Government Constituent",
        "location": "Mahendranagar, Kanchanpur",
        "established": 2010,
        "rating": 4.4,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Sudurpaschim Province central engineering campus offering subsidized Computer and Civil Engineering.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 160,000",
                "full_fee": "NPR 460,000"
            }
        ],
        "admission_criteria": "Sudurpaschim University Entrance Test.",
        "scholarships": "Far-Western regional scholarship quota."
    },
    {
        "id": "col_uon_gaindakot",
        "name": "School of Interdisciplinary Studies, UON",
        "university": "University of Nepal (UON)",
        "type": "Autonomous Public University",
        "location": "Gaindakot, Nawalpur",
        "established": 2023,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Innovative public university designed for liberal arts, environmental science, and technology.",
        "courses": [
            {
                "name": "BA (Hons) in Public Policy",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 280,000",
                "full_fee": "NPR 580,000"
            },
            {
                "name": "B.Sc. in Environmental AI",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 320,000",
                "full_fee": "NPR 640,000"
            }
        ],
        "admission_criteria": "UON Holistic Admission Assessment.",
        "scholarships": "Need-Blind Endowed Scholarships."
    },
    {
        "id": "col_nsu_ayurveda_dang",
        "name": "Central Ayurveda Campus, NSU",
        "university": "Nepal Sanskrit University (NSU)",
        "type": "Government Constituent",
        "location": "Beljhundi, Dang",
        "established": 1986,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
        "description": "Nepal's primary state center for Ayurvedic Medicine and Surgery (BAMS).",
        "courses": [
            {
                "name": "BAMS (Bachelor of Ayurvedic Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 20,
                "full_fee_seats": 30,
                "regular_fee": "NPR 120,000",
                "full_fee": "NPR 650,000"
            }
        ],
        "admission_criteria": "MEC CEE National Ayurveda Entrance Test.",
        "scholarships": "Government 75% free scholarship quota."
    },
    {
        "id": "col_nsu_balmiki",
        "name": "Balmiki Vidyapeeth, NSU",
        "university": "Nepal Sanskrit University (NSU)",
        "type": "Government Constituent",
        "location": "Pradarshani Marg, Kathmandu",
        "established": 1986,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
        "description": "Historic Sanskrit and Eastern philosophy campus in central Kathmandu.",
        "courses": [
            {
                "name": "Shastri (Bachelor in Eastern Philosophy)",
                "duration": "3 Years",
                "regular_seats": 50,
                "full_fee_seats": 0,
                "regular_fee": "Subsidized",
                "full_fee": "Subsidized"
            }
        ],
        "admission_criteria": "NSU Entrance Merit.",
        "scholarships": "Full State Accommodation & Stipend."
    },
    {
        "id": "col_lbu_central",
        "name": "Central Campus of Buddhist Studies, LBU",
        "university": "Lumbini Buddhist University (LBU)",
        "type": "Government Constituent",
        "location": "Lumbini, Rupandehi",
        "established": 2004,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
        "description": "International center for Buddhist Philosophy, Archeology, Peace Studies, and Tourism.",
        "courses": [
            {
                "name": "BA in Buddhist Studies & Tourism",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 90,000",
                "full_fee": "NPR 220,000"
            },
            {
                "name": "BA LLB (Integrated Law)",
                "duration": "5 Years",
                "regular_seats": 20,
                "full_fee_seats": 40,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 420,000"
            }
        ],
        "admission_criteria": "LBU Central Entrance Test.",
        "scholarships": "Monastic & Peace scholarships."
    },
    {
        "id": "col_nou_central",
        "name": "Faculty of Science & Tech, NOU",
        "university": "Nepal Open University (NOU)",
        "type": "National Distance Learning",
        "location": "Manbhawan, Lalitpur",
        "established": 2016,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80",
        "description": "Nepal's official open university providing blended digital degree education.",
        "courses": [
            {
                "name": "B.Sc. (ICT) Information Communication Tech",
                "duration": "4 Years",
                "regular_seats": 100,
                "full_fee_seats": 0,
                "regular_fee": "NPR 190,000",
                "full_fee": "NPR 190,000"
            },
            {
                "name": "BBA (Distance Education)",
                "duration": "4 Years",
                "regular_seats": 150,
                "full_fee_seats": 0,
                "regular_fee": "NPR 160,000",
                "full_fee": "NPR 160,000"
            }
        ],
        "admission_criteria": "NOU Online Entrance & Verification.",
        "scholarships": "Remote district learner subsidy."
    },
    {
        "id": "col_rju_central",
        "name": "Central Campus of Science & Tech, RJU",
        "university": "Rajarshi Janak University (RJU)",
        "type": "Government Constituent",
        "location": "Janakpurdham, Dhanusha",
        "established": 2017,
        "rating": 4.3,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Madhesh Province state university center offering CSIT and BCA.",
        "courses": [
            {
                "name": "B.Sc. CSIT",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 36,
                "regular_fee": "NPR 175,000",
                "full_fee": "NPR 390,000"
            },
            {
                "name": "BCA (Bachelor in Computer Application)",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 40,
                "regular_fee": "NPR 160,000",
                "full_fee": "NPR 350,000"
            }
        ],
        "admission_criteria": "RJU Central Entrance Examination.",
        "scholarships": "Madhesh Province Chhori Bima Grants."
    },
    {
        "id": "col_mbust_chitlang",
        "name": "Institute of Applied AI & Clean Energy, MBUST",
        "university": "Madan Bhandari University of Science and Technology (MBUST)",
        "type": "National Apex Research Institution",
        "location": "Chitlang, Makwanpur",
        "established": 2022,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
        "description": "Specialized research university dedicated to Artificial Intelligence and Green Hydrogen.",
        "courses": [
            {
                "name": "B.Sc. in Data Science & Artificial Intelligence",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 350,000",
                "full_fee": "NPR 750,000"
            },
            {
                "name": "B.E. in Clean Energy Engineering",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 320,000",
                "full_fee": "NPR 720,000"
            }
        ],
        "admission_criteria": "MBUST Research Aptitude Test.",
        "scholarships": "50% Government Full-Stipend Fellowships."
    },
    {
        "id": "col_yau_sankhuwasabha",
        "name": "Central Ayurveda Research Campus, YAU",
        "university": "Yogamaya Ayurveda University (YAU)",
        "type": "Specialized State Ayurveda University",
        "location": "Salpa Silichho, Sankhuwasabha",
        "established": 2022,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
        "description": "Specialized Himalayan university dedicated to natural medicine and yoga.",
        "courses": [
            {
                "name": "BAMS (Ayurvedic Medicine & Surgery)",
                "duration": "5.5 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "NPR 140,000",
                "full_fee": "NPR 580,000"
            }
        ],
        "admission_criteria": "MEC CEE National Ayurveda Entrance.",
        "scholarships": "Koshi Province Herbal Heritage Subsidy."
    },
    {
        "id": "col_mtu_school_eng",
        "name": "School of Engineering, Manmohan Technical University",
        "university": "Manmohan Technical University (MTU)",
        "type": "Provincial Technical University",
        "location": "Budhiganga, Morang",
        "established": 2019,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80",
        "description": "First technical university in Koshi Province offering Electrical and Civil Engineering degrees.",
        "courses": [
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 250,000",
                "full_fee": "NPR 550,000"
            },
            {
                "name": "B.E. Electrical & Electronics Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 250,000",
                "full_fee": "NPR 550,000"
            }
        ],
        "admission_criteria": "MTU Entrance Examination.",
        "scholarships": "Koshi Province Merit Fund."
    },
    {
        "id": "col_gandaki_central",
        "name": "Faculty of Science & Tech, Gandaki University",
        "university": "Gandaki University (GU)",
        "type": "Provincial University",
        "location": "Pokhara, Kaski",
        "established": 2019,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Provincial university of Gandaki offering BIT and Pharmacy.",
        "courses": [
            {
                "name": "BIT (Bachelor of Information Technology)",
                "duration": "4 Years",
                "regular_seats": 32,
                "full_fee_seats": 32,
                "regular_fee": "NPR 280,000",
                "full_fee": "NPR 580,000"
            },
            {
                "name": "Bachelor of Pharmacy (B.Pharm)",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 40,
                "regular_fee": "NPR 320,000",
                "full_fee": "NPR 680,000"
            }
        ],
        "admission_criteria": "GU Central Entrance Test.",
        "scholarships": "Gandaki Resident Merit Quotas."
    },
    {
        "id": "col_mau_central",
        "name": "College of Agriculture, MAU",
        "university": "Madhesh Agricultural University (MAU)",
        "type": "Provincial University",
        "location": "Rajbiraj, Saptari",
        "established": 2021,
        "rating": 4.4,
        "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
        "description": "Madhesh Province specialized institution focused on Tarai agriculture.",
        "courses": [
            {
                "name": "B.Sc. Agriculture (B.Sc. Ag)",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 95,000",
                "full_fee": "NPR 350,000"
            }
        ],
        "admission_criteria": "MAU Agricultural Entrance Test.",
        "scholarships": "Madhesh Province Farmer Children Subsidies."
    },
    {
        "id": "col_mu_birgunj",
        "name": "Faculty of Public Admin & Science, Madhesh University",
        "university": "Madhesh University (MU)",
        "type": "Provincial University",
        "location": "Birgunj, Parsa",
        "established": 2022,
        "rating": 4.3,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Provincial institution located in industrial corridor Birgunj.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 40,
                "full_fee_seats": 40,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 380,000"
            }
        ],
        "admission_criteria": "MU Entrance Examination.",
        "scholarships": "Madhesh Provincial Merit Grants."
    },
    {
        "id": "col_ltu_nepalgunj",
        "name": "Faculty of IT & Engineering, LTU",
        "university": "Lumbini Technological University (LTU)",
        "type": "Provincial Technical University",
        "location": "Nepalgunj, Banke",
        "established": 2022,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Technical university in Banke for Computer Engineering and BIT.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 24,
                "regular_fee": "NPR 240,000",
                "full_fee": "NPR 520,000"
            },
            {
                "name": "BIT (Bachelor of Information Tech)",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 220,000",
                "full_fee": "NPR 480,000"
            }
        ],
        "admission_criteria": "LTU Central Entrance Exam.",
        "scholarships": "Lumbini Technical Quota."
    },
    {
        "id": "col_bpkihs_dharan",
        "name": "BPKIHS Central Medical Campus",
        "university": "B.P. Koirala Institute of Health Sciences (BPKIHS)",
        "type": "Autonomous Health University",
        "location": "Dharan, Sunsari",
        "established": 1993,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
        "description": "Autonomous tertiary health sciences university in eastern Nepal.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 30,
                "full_fee_seats": 70,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 4,200,000"
            },
            {
                "name": "BDS (Dental Surgery)",
                "duration": "5 Years",
                "regular_seats": 15,
                "full_fee_seats": 35,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 2,100,000"
            }
        ],
        "admission_criteria": "MEC CEE National Medical Entrance.",
        "scholarships": "MEC Free Scholarship Seats."
    },
    {
        "id": "col_nams_bir_hospital",
        "name": "Bir Hospital Academic Institute (NAMS)",
        "university": "National Academy of Medical Sciences (NAMS)",
        "type": "Autonomous Apex Medical Institute",
        "location": "Mahabouddha, Kathmandu",
        "established": 2002,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
        "description": "Oldest tertiary referral teaching hospital providing specialist MD/MS residency and nursing.",
        "courses": [
            {
                "name": "B.Sc. Medical Imaging Tech (BMIT)",
                "duration": "4 Years",
                "regular_seats": 10,
                "full_fee_seats": 10,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 450,000"
            },
            {
                "name": "B.Sc. Nursing",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 750,000"
            }
        ],
        "admission_criteria": "MEC CEE National Entrance.",
        "scholarships": "Government health service employee quotas."
    },
    {
        "id": "col_pahs_lagankhel",
        "name": "School of Medicine, Patan Hospital (PAHS)",
        "university": "Patan Academy of Health Sciences (PAHS)",
        "type": "Autonomous State Medical Academy",
        "location": "Lagankhel, Lalitpur",
        "established": 2008,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
        "description": "Public health university founded on rural medicine mission training doctors for remote areas.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 20,
                "full_fee_seats": 45,
                "regular_fee": "Full Subsidy",
                "full_fee": "NPR 4,200,000"
            },
            {
                "name": "B.Sc. Nursing",
                "duration": "4 Years",
                "regular_seats": 15,
                "full_fee_seats": 25,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 850,000"
            }
        ],
        "admission_criteria": "MEC CEE National Exam + Interview.",
        "scholarships": "Rural Service Commitment 100% Free Tuition."
    },
    {
        "id": "col_kahs_jumla",
        "name": "KAHS Central Teaching Hospital",
        "university": "Karnali Academy of Health Sciences (KAHS)",
        "type": "Autonomous State Medical Academy",
        "location": "Chandannath, Jumla",
        "established": 2011,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Medical school located in high-altitude Jumla providing clinical medicine education in Karnali.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 20,
                "full_fee_seats": 30,
                "regular_fee": "Government Quota",
                "full_fee": "NPR 4,200,000"
            },
            {
                "name": "Bachelor of Pharmacy (B.Pharm)",
                "duration": "4 Years",
                "regular_seats": 10,
                "full_fee_seats": 20,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 520,000"
            }
        ],
        "admission_criteria": "MEC CEE National Medical Entrance.",
        "scholarships": "Karnali and Backward District 100% Free Quotas."
    },
    {
        "id": "col_rahs_dang",
        "name": "RAHS Central Medical Campus, Dang",
        "university": "Rapti Academy of Health Sciences (RAHS)",
        "type": "Autonomous State Medical Academy",
        "location": "Ghorahi, Dang",
        "established": 2017,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
        "description": "Autonomous state health academy serving Rapti zone in medical and nursing sciences.",
        "courses": [
            {
                "name": "B.Sc. Nursing",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 750,000"
            }
        ],
        "admission_criteria": "MEC CEE National Entrance.",
        "scholarships": "Government Free Scholarship Quota."
    },
    {
        "id": "col_pokahs_ramghat",
        "name": "Western Regional Hospital Teaching Wing (PokAHS)",
        "university": "Pokhara Academy of Health Sciences (PokAHS)",
        "type": "Autonomous State Medical Academy",
        "location": "Ramghat, Pokhara",
        "established": 2016,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
        "description": "Medical institution operating Western Regional Hospital in Pokhara.",
        "courses": [
            {
                "name": "B.Sc. Nursing",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 780,000"
            }
        ],
        "admission_criteria": "MEC CEE National Entrance.",
        "scholarships": "MEC Subsidized Seats."
    },
    {
        "id": "col_mihs_janakpur",
        "name": "MIHS Central Teaching Hospital",
        "university": "Madhesh Institute of Health Sciences (MIHS)",
        "type": "Autonomous Provincial Health Institute",
        "location": "Janakpurdham, Dhanusha",
        "established": 2021,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Madhesh Province health university operating Janakpur Hospital as central teaching base.",
        "courses": [
            {
                "name": "B.Sc. Nursing",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 750,000"
            },
            {
                "name": "B.Sc. Medical Lab Tech (BMLT)",
                "duration": "4 Years",
                "regular_seats": 15,
                "full_fee_seats": 15,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 450,000"
            }
        ],
        "admission_criteria": "MEC CEE National Entrance.",
        "scholarships": "Madhesh Provincial Free Health Scholarships."
    },
    {
        "id": "col_mdchus_geta",
        "name": "MDCHUS Medical College, Geta",
        "university": "Martyr Dasharath Chand University of Health Sciences (MDCHUS)",
        "type": "National Health Sciences University",
        "location": "Geta, Kailali",
        "established": 2023,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Landmark health sciences university in Sudurpaschim Province.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 50,
                "full_fee_seats": 50,
                "regular_fee": "MEC Quota",
                "full_fee": "NPR 4,200,000"
            },
            {
                "name": "B.Sc. Nursing",
                "duration": "4 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "Subsidized",
                "full_fee": "NPR 750,000"
            }
        ],
        "admission_criteria": "MEC CEE National Entrance Exam.",
        "scholarships": "MEC 75% Public School Free Tuition Quota."
    },
    {
        "id": "col_chitwan_engineering",
        "name": "Chitwan Engineering Campus (IOE)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Rampur, Chitwan",
        "established": 2019,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "TU IOE newest constituent engineering campus offering B.E. Architecture and Civil Engineering in Central Nepal.",
        "courses": [
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 48,
                "regular_fee": "NPR 42,000",
                "full_fee": "NPR 340,000"
            },
            {
                "name": "Bachelor of Architecture (B.Arch)",
                "duration": "5 Years",
                "regular_seats": 12,
                "full_fee_seats": 24,
                "regular_fee": "NPR 50,000",
                "full_fee": "NPR 390,000"
            }
        ],
        "admission_criteria": "IOE Central Entrance Exam rank.",
        "scholarships": "Government regular seats."
    },
    {
        "id": "col_cdcsit_kirtipur",
        "name": "Central Department of Computer Science & IT (CDCSIT)",
        "university": "Tribhuvan University (TU)",
        "type": "University Central Department",
        "location": "Kirtipur, Kathmandu",
        "established": 1990,
        "rating": 4.9,
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        "description": "Apex academic post-graduate and research department for Computer Science and Information Technology in Nepal.",
        "courses": [
            {
                "name": "M.Sc. Computer Science and Information Technology",
                "duration": "2 Years",
                "regular_seats": 20,
                "full_fee_seats": 20,
                "regular_fee": "NPR 90,000",
                "full_fee": "NPR 220,000"
            },
            {
                "name": "B.Sc. CSIT (Honors Research)",
                "duration": "4 Years",
                "regular_seats": 24,
                "full_fee_seats": 24,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 380,000"
            }
        ],
        "admission_criteria": "TU IOST Central Entrance Examination.",
        "scholarships": "National Science Talent Scholarships."
    },
    {
        "id": "col_nepal_commerce",
        "name": "Nepal Commerce Campus (NCC)",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Minbhawan, Kathmandu",
        "established": 1954,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Premier government commerce and business administration campus in Nepal offering BBA, BBM, and BBS.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "NPR 350,000",
                "full_fee": "NPR 350,000"
            },
            {
                "name": "BBM (Bachelor of Business Management)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 64,
                "regular_fee": "NPR 330,000",
                "full_fee": "NPR 330,000"
            }
        ],
        "admission_criteria": "TU FOM CMAT Central Entrance Exam.",
        "scholarships": "Constituent campus subsidized fee structure."
    },
    {
        "id": "col_shanker_dev",
        "name": "Shanker Dev Campus",
        "university": "Tribhuvan University (TU)",
        "type": "Government Constituent",
        "location": "Putalisadak, Kathmandu",
        "established": 1951,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
        "description": "Benchmark business and management institution renowned for producing top finance leaders and chartered accountants.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 128,
                "regular_fee": "NPR 360,000",
                "full_fee": "NPR 360,000"
            },
            {
                "name": "BBS (Bachelor of Business Studies)",
                "duration": "4 Years",
                "regular_seats": 500,
                "full_fee_seats": 0,
                "regular_fee": "NPR 30,000",
                "full_fee": "NPR 30,000"
            }
        ],
        "admission_criteria": "TU FOM CMAT Entrance Exam.",
        "scholarships": "Subsidized government seats."
    },
    {
        "id": "col_manipal_pokhara",
        "name": "Manipal College of Medical Sciences (MCOMS)",
        "university": "Kathmandu University (KU)",
        "type": "Private Affiliated",
        "location": "Deep Heights / Phulbari, Pokhara",
        "established": 1994,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
        "description": "International standard medical college and 750-bed teaching hospital in scenic Pokhara valley.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 10,
                "full_fee_seats": 90,
                "regular_fee": "MEC Quota",
                "full_fee": "NPR 4,400,000"
            }
        ],
        "admission_criteria": "MEC CEE National Medical Entrance.",
        "scholarships": "MEC Free Scholarship Quota."
    },
    {
        "id": "col_nmc_jorpati",
        "name": "Nepal Medical College (NMC)",
        "university": "Kathmandu University (KU)",
        "type": "Private Affiliated",
        "location": "Jorpati, Kathmandu",
        "established": 1997,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
        "description": "Comprehensive private tertiary medical college and teaching hospital in northeast Kathmandu.",
        "courses": [
            {
                "name": "MBBS (Medicine)",
                "duration": "5.5 Years",
                "regular_seats": 10,
                "full_fee_seats": 90,
                "regular_fee": "MEC Quota",
                "full_fee": "NPR 4,400,000"
            },
            {
                "name": "BDS (Dental Surgery)",
                "duration": "5 Years",
                "regular_seats": 5,
                "full_fee_seats": 45,
                "regular_fee": "MEC Quota",
                "full_fee": "NPR 2,100,000"
            }
        ],
        "admission_criteria": "MEC CEE National Medical Entrance.",
        "scholarships": "MEC 10% Free Scholarship Quota."
    },
    {
        "id": "col_apex_baneshwor",
        "name": "Apex College",
        "university": "Pokhara University (PokU)",
        "type": "Private Affiliated",
        "location": "Mid-Baneshwor, Kathmandu",
        "established": 2000,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "description": "Leading management institution under Pokhara University offering BBA and BCIS degrees.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 120,
                "regular_fee": "NPR 780,000",
                "full_fee": "NPR 780,000"
            },
            {
                "name": "BCIS (Computer Information Systems)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "NPR 720,000",
                "full_fee": "NPR 720,000"
            }
        ],
        "admission_criteria": "PokU Entrance + Aptitude Assessment.",
        "scholarships": "Performance-based semester GPA waivers."
    },
    {
        "id": "col_ace_management",
        "name": "Ace Institute of Management",
        "university": "Pokhara University (PokU)",
        "type": "Private Affiliated",
        "location": "Sinamangal, Kathmandu",
        "established": 1999,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Pioneering business school known for interactive case-study teaching and executive leadership programs.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 120,
                "regular_fee": "NPR 840,000",
                "full_fee": "NPR 840,000"
            }
        ],
        "admission_criteria": "PokU Entrance Exam + Ace Leadership Assessment.",
        "scholarships": "Ace Merit Fellowship."
    },
    {
        "id": "col_uesc_lalitpur",
        "name": "Universal Engineering & Science College (UESC)",
        "university": "Pokhara University (PokU)",
        "type": "Private Affiliated",
        "location": "Chakupat, Lalitpur",
        "established": 2000,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80",
        "description": "Central engineering institution in Patan offering Civil and Computer Engineering.",
        "courses": [
            {
                "name": "B.E. Computer Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 48,
                "regular_fee": "NPR 880,000",
                "full_fee": "NPR 880,000"
            },
            {
                "name": "B.E. Civil Engineering",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 96,
                "regular_fee": "NPR 840,000",
                "full_fee": "NPR 840,000"
            }
        ],
        "admission_criteria": "PokU Engineering Entrance.",
        "scholarships": "PokU Central Free Quota."
    },
    {
        "id": "col_janata_itahari",
        "name": "Janata Multiple Campus",
        "university": "Purbanchal University (PU)",
        "type": "Community Affiliated",
        "location": "Itahari, Sunsari",
        "established": 1988,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Large community college in Koshi Province offering BBA, BCA, and Education programs.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "NPR 380,000",
                "full_fee": "NPR 380,000"
            },
            {
                "name": "BCA (Bachelor in Computer Application)",
                "duration": "4 Years",
                "regular_seats": 0,
                "full_fee_seats": 60,
                "regular_fee": "NPR 340,000",
                "full_fee": "NPR 340,000"
            }
        ],
        "admission_criteria": "PU Entrance Examination.",
        "scholarships": "Community trust financial aid."
    },
    {
        "id": "col_durgalaxmi_kailali",
        "name": "Durgalaxmi Multiple Campus",
        "university": "Sudurpaschim University (SU)",
        "type": "Community Constituent",
        "location": "Attariya, Kailali",
        "established": 2006,
        "rating": 4.4,
        "image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
        "description": "Community campus serving Kailali and Kanchanpur junction in management and humanities.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 40,
                "full_fee_seats": 40,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 320,000"
            }
        ],
        "admission_criteria": "SU Entrance Test.",
        "scholarships": "Provincial affirmative quota."
    },
    {
        "id": "col_tikapur_kailali",
        "name": "Tikapur Multiple Campus",
        "university": "Sudurpaschim University (SU)",
        "type": "Government Constituent",
        "location": "Tikapur, Kailali",
        "established": 2001,
        "rating": 4.4,
        "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
        "description": "Constituent campus offering Agriculture and General Management in Far-Western Nepal.",
        "courses": [
            {
                "name": "B.Sc. Agriculture (B.Sc. Ag)",
                "duration": "4 Years",
                "regular_seats": 30,
                "full_fee_seats": 30,
                "regular_fee": "NPR 95,000",
                "full_fee": "NPR 350,000"
            }
        ],
        "admission_criteria": "SU Agriculture Entrance.",
        "scholarships": "Kailali District Welfare Scholarships."
    },
    {
        "id": "col_bheri_surkhet",
        "name": "Bheri Multiple Campus",
        "university": "Mid-West University (MWU)",
        "type": "Government Constituent",
        "location": "Birendranagar, Surkhet",
        "established": 2011,
        "rating": 4.4,
        "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
        "description": "Historic constituent campus of MWU providing arts, management, and education.",
        "courses": [
            {
                "name": "BBA (Bachelor of Business Admin)",
                "duration": "4 Years",
                "regular_seats": 40,
                "full_fee_seats": 40,
                "regular_fee": "NPR 180,000",
                "full_fee": "NPR 340,000"
            }
        ],
        "admission_criteria": "MWU Entrance.",
        "scholarships": "Karnali Province Subsidy."
    },
    {
        "id": "col_babai_bardiya",
        "name": "Babai Multiple Campus",
        "university": "Mid-West University (MWU)",
        "type": "Government Constituent",
        "location": "Gulariya, Bardiya",
        "established": 2012,
        "rating": 4.3,
        "image_url": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        "description": "Constituent multi-disciplinary campus in Bardiya district.",
        "courses": [
            {
                "name": "B.Ed (Bachelor of Education)",
                "duration": "4 Years",
                "regular_seats": 60,
                "full_fee_seats": 60,
                "regular_fee": "NPR 80,000",
                "full_fee": "NPR 180,000"
            }
        ],
        "admission_criteria": "MWU Entrance.",
        "scholarships": "Tharu Community Affirmative Scholarships."
    }
]

REAL_ENTRANCE_RESULTS = [
    {
        "roll_no": "IOE-2026-1042",
        "roll_number": "IOE-2026-1042",
        "student_name": "Sujan Sharma",
        "candidate_name": "Sujan Sharma",
        "exam_name": "TU IOE Engineering Entrance Examination 2026",
        "university": "Tribhuvan University",
        "institution": "Pulchowk Campus (IOE Central)",
        "rank": 42,
        "merit_rank": 42,
        "score": "128.5 / 140",
        "allocated_program": "B.E. Computer Engineering",
        "program_applied": "B.E. Computer Engineering",
        "allocated_campus": "Pulchowk Campus (IOE Central)",
        "seat_type": "Regular Merit (100% Free Quota)",
        "scholarship_quota_status": "Regular Merit (100% Free Quota)",
        "status": "QUALIFIED_MERIT",
        "document_type": "Eduva Entrance Result Analysis",
        "disclaimer": "AI-generated analysis based on submitted/result data. Not an official examination document.",
        "verification_hash": "IOE-VERIFIED-9831A"
    },
    {
        "roll_no": "IOE-2026-2189",
        "roll_number": "IOE-2026-2189",
        "student_name": "Aarav Thapa",
        "candidate_name": "Aarav Thapa",
        "exam_name": "TU IOE Engineering Entrance Examination 2026",
        "university": "Tribhuvan University",
        "institution": "Pulchowk Campus",
        "rank": 115,
        "merit_rank": 115,
        "score": "119.0 / 140",
        "allocated_program": "B.E. Civil Engineering",
        "program_applied": "B.E. Civil Engineering",
        "allocated_campus": "Pulchowk Campus",
        "seat_type": "Full Fee Quota",
        "scholarship_quota_status": "Full Fee Quota",
        "status": "QUALIFIED_WAITLIST",
        "document_type": "Eduva Entrance Result Analysis",
        "disclaimer": "AI-generated analysis based on submitted/result data. Not an official examination document.",
        "verification_hash": "IOE-VERIFIED-7712B"
    },
    {
        "roll_no": "KUCAT-2026-0814",
        "roll_number": "KUCAT-2026-0814",
        "student_name": "Priya Shrestha",
        "candidate_name": "Priya Shrestha",
        "exam_name": "KUCAT Computer-Based Test 2026",
        "university": "Kathmandu University",
        "institution": "KU Main Campus Dhulikhel",
        "rank": 18,
        "merit_rank": 18,
        "score": "184 / 200",
        "allocated_program": "B.Tech in Artificial Intelligence",
        "program_applied": "B.Tech in Artificial Intelligence",
        "allocated_campus": "KU Main Campus Dhulikhel",
        "seat_type": "Founders Merit Fellowship (75% Waiver)",
        "scholarship_quota_status": "Founders Merit Fellowship (75% Waiver)",
        "status": "QUALIFIED_MERIT",
        "document_type": "Eduva Entrance Result Analysis",
        "disclaimer": "AI-generated analysis based on submitted/result data. Not an official examination document.",
        "verification_hash": "KU-VERIFIED-4402C"
    },
    {
        "roll_no": "CEE-2026-5591",
        "roll_number": "CEE-2026-5591",
        "student_name": "Rohan Adhikari",
        "candidate_name": "Rohan Adhikari",
        "exam_name": "Medical Education Commission (CEE MBBS) 2026",
        "university": "Tribhuvan University (IOM)",
        "institution": "Maharajgunj Medical Campus (IOM)",
        "rank": 88,
        "merit_rank": 88,
        "score": "182 / 200",
        "allocated_program": "MBBS (Medicine)",
        "program_applied": "MBBS (Medicine)",
        "allocated_campus": "Maharajgunj Medical Campus (IOM)",
        "seat_type": "Government Scholarship Seat",
        "scholarship_quota_status": "Government Scholarship Seat",
        "status": "QUALIFIED_MERIT",
        "document_type": "Eduva Entrance Result Analysis",
        "disclaimer": "AI-generated analysis based on submitted/result data. Not an official examination document.",
        "verification_hash": "MEC-VERIFIED-1194D"
    },
    {
        "roll_no": "PU-2026-3301",
        "roll_number": "PU-2026-3301",
        "student_name": "Deepak Karki",
        "candidate_name": "Deepak Karki",
        "exam_name": "Pokhara University Open Scholarship Entrance 2026",
        "university": "Pokhara University",
        "institution": "Nepal Engineering College (NEC Bhaktapur)",
        "rank": 24,
        "merit_rank": 24,
        "score": "89.5 / 100",
        "allocated_program": "B.E. Software Engineering",
        "program_applied": "B.E. Software Engineering",
        "allocated_campus": "Nepal Engineering College (NEC Bhaktapur)",
        "seat_type": "100% Open Free Scholarship",
        "scholarship_quota_status": "100% Open Free Scholarship",
        "status": "QUALIFIED_MERIT",
        "document_type": "Eduva Entrance Result Analysis",
        "disclaimer": "AI-generated analysis based on submitted/result data. Not an official examination document.",
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
