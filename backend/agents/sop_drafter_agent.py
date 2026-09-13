import datetime
from typing import Dict, Any

class SopDrafterAgent:
    def __init__(self):
        self.name = "SopDrafterAgent"

    def generate_document(self, doc_type: str, student_name: str, gpa: str, target_college: str, target_program: str, career_goals: str, financial_need: str = "") -> Dict[str, Any]:
        today_str = datetime.date.today().strftime("%B %d, %Y")
        
        if doc_type == "SOP":
            content = f"""STATEMENT OF PURPOSE (SOP)

Applicant Name: {student_name}
Target Program: {target_program}
Target Institution: {target_college}
Date: {today_str}
Academic Score (+2 / Equivalent): {gpa}

Dear Admissions Committee,

I am writing to formally express my keen interest in pursuing the {target_program} program at {target_college}. Having consistently demonstrated academic dedication with a {gpa} standing, I have developed a deep fascination with foundational scientific and technological principles.

My primary motivation stems from {career_goals}. {target_college} stands out as the premier destination for my aspirations due to its distinguished faculty, rigorous research curriculum, and state-of-the-art laboratory infrastructure.

Throughout my previous studies, I have cultivated strong analytical problem-solving skills, quantitative reasoning, and collaborative leadership. I am confident that the challenging environment at {target_college} will enable me to contribute meaningfully to the campus community while developing into an industry-ready professional capable of solving pressing national and global challenges.

Thank you for considering my application. I look forward to the privilege of joining {target_college}.

Sincerely,
{student_name}
Contact: sujan.sharma@eduva.ai | Kathmandu, Nepal
"""
        elif doc_type == "SCHOLARSHIP_LETTER":
            content = f"""FORMAL APPLICATION FOR MERIT & NEED-BASED SCHOLARSHIP

To,
The Scholarship & Financial Aid Committee,
{target_college} / Ministry of Education (MOEST),
Nepal

Date: {today_str}
Subject: Application for Full / Partial Tuition Scholarship for {target_program}

Respected Committee Members,

I, {student_name}, am an applicant for the {target_program} at {target_college}. I am writing this application to respectfully request financial consideration for a merit-cum-need scholarship for the upcoming academic cycle.

I have achieved a {gpa} in my qualifying examinations. Despite my strong academic commitment, my family faces economic constraints: {financial_need or 'meeting full tuition expenses presents a significant hurdle'}. 

Receiving this scholarship would alleviate financial distress and allow me to dedicate my full focus toward academic excellence, research projects, and community leadership at {target_college}.

I have enclosed all verified academic transcripts, character certificates, and income verification credentials for your kind evaluation.

Sincerely yours,
{student_name}
Candidate ID / Roll No: IOE-2026-1042
"""
        else:  # ADMISSION_APPLICATION
            content = f"""OFFICIAL ADMISSION APPLICATION

To,
The Dean / Campus Chief,
{target_college},
Nepal

Date: {today_str}
Subject: Formal Application for Enrollment in {target_program} (Academic Year 2026/27)

Respected Sir/Madam,

I have the honor to apply for enrollment in the {target_program} at {target_college}. I have successfully qualified the requisite Central Entrance Examination with rank standing and hold a {gpa} in my +2 Science studies.

I have thoroughly reviewed the course prospectus, laboratory requirements, and institutional code of conduct, and I pledge to uphold the highest standards of academic integrity and diligence.

All requisite certified documents—including citizenship certificate, transcripts, entrance scorecard, and character certificate—are attached herewith for formal registration.

Yours faithfully,
{student_name}
"""

        return {
            "doc_type": doc_type,
            "title": f"{doc_type.replace('_', ' ').title()} for {target_college}",
            "generated_text": content.strip(),
            "created_at": today_str,
            "verification_status": "AI_CERTIFIED_ACADEMIC_FORMAT"
        }

global_sop_drafter = SopDrafterAgent()
