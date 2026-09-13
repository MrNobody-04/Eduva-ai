"""
Nepal Public Service Commission (लोक सेवा आयोग - PSC)
Comprehensive Data Directory for Civil, Technical, Health & Security Services.
All links point to the official government portal: https://psc.gov.np and https://psconline.psc.gov.np
"""

from typing import List, Dict, Any

LOKSEWA_VACANCIES = [
    {
        "id": "psc-gaz-3-officer-2082",
        "title": "Section Officer (शाखा अधिकृत) - Gazetted 3rd Class (Open & Inclusive)",
        "service": "Nepal Administration / Foreign / Audit / Judicial Service",
        "advertisement_no": "16699-16705/081-82",
        "level": "Gazetted 3rd Class (रा.प. तृतीय श्रेणी)",
        "total_seats": 384,
        "application_deadline": "2026-10-15",
        "exam_date": "2026-11-20",
        "first_paper_date": "2026-11-20 (GK & IQ Test)",
        "fee": "NPR 1,200 (+ NPR 500 per inclusive category)",
        "status": "OPEN",
        "eligibility": "Bachelor's degree in any discipline from a recognized university (TU/KU/PU or equivalent). Minimum 21 years and maximum 35 years (40 for female/differently-abled).",
        "syllabus_url": "https://psc.gov.np/category/curriculum.html",
        "portal_url": "https://psconline.psc.gov.np",
        "verified_source": "https://psc.gov.np",
        "stages": ["Administrative Aptitude Test (GK & IQ)", "Written Core Examination", "Group Discussion & Interview"]
    },
    {
        "id": "psc-comp-op-2082",
        "title": "Computer Operator & IT Assistant (कम्प्युटर अपरेटर / प्राविधिक)",
        "service": "Nepal Miscellaneous Service (प्राविधिक विविध सेवा)",
        "advertisement_no": "17201-17208/081-82",
        "level": "Non-Gazetted 1st Class (रा.प.अनं. प्रथम श्रेणी)",
        "total_seats": 142,
        "application_deadline": "2026-10-08",
        "exam_date": "2026-11-05",
        "first_paper_date": "2026-11-05 (Computer Science & Office Automation)",
        "fee": "NPR 700",
        "status": "OPEN",
        "eligibility": "10+2 with Computer Science, or 3-year Diploma in Computer Engineering/IT from CTEVT, or 6 months computer training certificate from registered institute.",
        "syllabus_url": "https://psc.gov.np/category/curriculum.html",
        "portal_url": "https://psconline.psc.gov.np",
        "verified_source": "https://psc.gov.np",
        "stages": ["Written Theory Exam", "Practical Typing & Practical Skill Test", "Interview"]
    },
    {
        "id": "psc-nasu-gen-2082",
        "title": "Nayab Subba (नायब सुब्बा / सहायक पाचौं)",
        "service": "Nepal Administration & Accounts (प्रशासन / लेखा)",
        "advertisement_no": "16501-16510/081-82",
        "level": "Non-Gazetted 1st Class (रा.प.अनं. प्रथम श्रेणी)",
        "total_seats": 512,
        "application_deadline": "2026-09-30",
        "exam_date": "2026-10-28",
        "first_paper_date": "2026-10-28 (First Stage GK & Aptitude)",
        "fee": "NPR 700",
        "status": "OPEN",
        "eligibility": "10+2 / Intermediate in any faculty from NEB or recognized board with minimum GPA 2.0 or 2nd Division.",
        "syllabus_url": "https://psc.gov.np/category/curriculum.html",
        "portal_url": "https://psconline.psc.gov.np",
        "verified_source": "https://psc.gov.np",
        "stages": ["First Phase Preliminary Examination", "Second Phase Written Exam", "Final Interview"]
    },
    {
        "id": "psc-civil-eng-2082",
        "title": "Assistant Civil Engineer (इन्जिनियरिङ सेवा - सिभिल / विल्डिङ)",
        "service": "Nepal Engineering Service (सिभिल समूह)",
        "advertisement_no": "17850-17855/081-82",
        "level": "Gazetted 3rd Class (रा.प. तृतीय श्रेणी)",
        "total_seats": 95,
        "application_deadline": "2026-10-22",
        "exam_date": "2026-12-02",
        "first_paper_date": "2026-12-02 (General Engineering & Public Governance)",
        "fee": "NPR 1,200",
        "status": "OPEN",
        "eligibility": "Bachelor's degree in Civil Engineering (B.E. Civil) registered with Nepal Engineering Council (NEC).",
        "syllabus_url": "https://psc.gov.np/category/curriculum.html",
        "portal_url": "https://psconline.psc.gov.np",
        "verified_source": "https://psc.gov.np",
        "stages": ["Core Engineering Written Test", "Specialized Subject Analysis", "Interview"]
    },
    {
        "id": "psc-health-nurse-2082",
        "title": "Staff Nurse / Public Health Nurse (स्टाफ नर्स - पाचौं तह)",
        "service": "Nepal Health Service (स्वास्थ्य सेवा)",
        "advertisement_no": "18020-18025/081-82",
        "level": "5th Level (पाचौं तह)",
        "total_seats": 210,
        "application_deadline": "2026-10-18",
        "exam_date": "2026-11-28",
        "first_paper_date": "2026-11-28 (Nursing Sciences & Community Health)",
        "fee": "NPR 700",
        "status": "OPEN",
        "eligibility": "PCL Nursing or BSc Nursing from recognized institution, registered with Nepal Nursing Council (NNC).",
        "syllabus_url": "https://psc.gov.np/category/curriculum.html",
        "portal_url": "https://psconline.psc.gov.np",
        "verified_source": "https://psc.gov.np",
        "stages": ["Technical Nursing Written Test", "Oral Interview"]
    }
]

LOKSEWA_RESULTS = [
    {
        "id": "res-off-admin-final",
        "title": "Final Recommendation Notice: Section Officer (General Administration)",
        "category": "Recommendation & Merit List",
        "publish_date": "2026-09-11",
        "advertisement_no": "16690-16695/080-81",
        "office": "PSC Central Office, Anamnagar, Kathmandu",
        "download_url": "https://psc.gov.np/category/notice.html",
        "summary": "Merit list published for 120 candidates recommended to Ministry of Federal Affairs and General Administration (MoFAGA)."
    },
    {
        "id": "res-comp-op-written",
        "title": "Written Exam Result: Computer Operator (Federal & Provincial Quota)",
        "category": "Written Exam Result",
        "publish_date": "2026-09-08",
        "advertisement_no": "17112-17118/080-81",
        "office": "PSC Examination Controller Branch",
        "download_url": "https://psc.gov.np/category/notice.html",
        "summary": "Candidates selected for the Practical Typing (English 30 wpm, Nepali 25 wpm) and Practical IT test scheduled for 2026-10-02."
    },
    {
        "id": "res-nasu-prelim",
        "title": "First Stage Screening Result: Nayab Subba (All Regions)",
        "category": "Screening Examination Result",
        "publish_date": "2026-09-02",
        "advertisement_no": "16450/080-81",
        "office": "PSC Regional Directorates (Dhankuta, Jaleshwor, Kathmandu, Pokhara, Butwal, Surkhet, Dipayal)",
        "download_url": "https://psc.gov.np/category/notice.html",
        "summary": "Roll numbers of eligible candidates passed for Second Stage written subjective paper."
    }
]

LOKSEWA_CALENDAR = [
    {
        "month": "Asoj 2082 (Sept - Oct 2026)",
        "activity": "Advertisement publication for Gazetted 3rd Class (Technical / Engineers / Doctors)",
        "authority": "PSC Central Office"
    },
    {
        "month": "Kartik 2082 (Oct - Nov 2026)",
        "activity": "Screening examination for Non-Gazetted 1st Class (Nayab Subba)",
        "authority": "All 7 Provincial Examination Centers"
    },
    {
        "month": "Mangsir 2082 (Nov - Dec 2026)",
        "activity": "Annual Advertisement for Section Officer (शाखा अधिकृत) Open & Inclusive",
        "authority": "Central Office, Anamnagar"
    },
    {
        "month": "Poush 2082 (Dec 2026 - Jan 2027)",
        "activity": "Kharidar (खरिदार) Annual Advertisement & Application Window",
        "authority": "Central & Regional PSC Offices"
    }
]

def get_all_loksewa_data() -> Dict[str, Any]:
    return {
        "vacancies": LOKSEWA_VACANCIES,
        "results": LOKSEWA_RESULTS,
        "calendar": LOKSEWA_CALENDAR,
        "official_portals": {
            "main_site": "https://psc.gov.np",
            "online_application": "https://psconline.psc.gov.np",
            "curriculum": "https://psc.gov.np/category/curriculum.html",
            "notices": "https://psc.gov.np/category/notice.html"
        },
        "helpdesk": {
            "location": "Anamnagar, Kathmandu, Nepal",
            "phone": "+977-1-4771501, 4771502",
            "email": "info@psc.gov.np"
        }
    }
