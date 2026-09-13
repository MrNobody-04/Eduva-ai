from engine.knowledge_graph import (
    KnowledgeGraph, SourceEntity, UniversityEntity, ProgramEntity,
    EntranceExamEntity, ScholarshipEntity, StudentEntity, ApplicationEntity, KnowledgeGapEntity
)

def populate_initial_knowledge(kg: KnowledgeGraph):
    # 1. Authoritative Sources
    sources = [
        SourceEntity(
            id="src_ioe_portal",
            name="Tribhuvan University IOE Entrance Board",
            url="https://entrance.ioe.edu.np",
            domain_type="OFFICIAL",
            reliability_score=0.99,
            trust_tier="VERY_HIGH",
            status="MONITORED",
            change_count=4
        ),
        SourceEntity(
            id="src_ku_admissions",
            name="Kathmandu University Admissions Division",
            url="https://ku.edu.np/admission",
            domain_type="OFFICIAL",
            reliability_score=0.98,
            trust_tier="VERY_HIGH",
            status="MONITORED",
            change_count=2
        ),
        SourceEntity(
            id="src_moest_gov",
            name="Ministry of Education, Science and Technology (Nepal)",
            url="https://moest.gov.np",
            domain_type="GOVT",
            reliability_score=0.99,
            trust_tier="VERY_HIGH",
            status="MONITORED",
            change_count=6
        ),
        SourceEntity(
            id="src_erasmus_plus",
            name="European Commission Erasmus+ Education Portal",
            url="https://erasmus-plus.ec.europa.eu",
            domain_type="GOVT",
            reliability_score=0.99,
            trust_tier="VERY_HIGH",
            status="MONITORED",
            change_count=3
        ),
        SourceEntity(
            id="src_pu_portal",
            name="Pokhara University Faculty of Science & Tech",
            url="https://pu.edu.np",
            domain_type="OFFICIAL",
            reliability_score=0.96,
            trust_tier="VERY_HIGH",
            status="MONITORED",
            change_count=1
        ),
        SourceEntity(
            id="src_fulbright_usef",
            name="USEF Nepal Fulbright Commission",
            url="https://usefnepal.org",
            domain_type="OFFICIAL",
            reliability_score=0.98,
            trust_tier="VERY_HIGH",
            status="MONITORED",
            change_count=2
        )
    ]
    for s in sources:
        kg.sources[s.id] = s

    # 2. Universities
    universities = [
        UniversityEntity(
            id="univ_tu_ioe",
            name="Tribhuvan University - Institute of Engineering (IOE)",
            country="Nepal",
            city="Lalitpur / Kathmandu",
            official_website="https://ioe.edu.np",
            ranking=1,
            established=1930,
            programs=["prog_ioe_be_comp", "prog_ioe_be_civil", "prog_ioe_be_elec"],
            reliability_score=0.99
        ),
        UniversityEntity(
            id="univ_ku",
            name="Kathmandu University (KU)",
            country="Nepal",
            city="Dhulikhel, Kavre",
            official_website="https://ku.edu.np",
            ranking=2,
            established=1991,
            programs=["prog_ku_bsc_cs", "prog_ku_be_ai", "prog_ku_bba"],
            reliability_score=0.98
        ),
        UniversityEntity(
            id="univ_pu",
            name="Pokhara University",
            country="Nepal",
            city="Pokhara, Kaski",
            official_website="https://pu.edu.np",
            ranking=3,
            established=1997,
            programs=["prog_pu_be_it", "prog_pu_bba"],
            reliability_score=0.95
        ),
        UniversityEntity(
            id="univ_tum_germany",
            name="Technical University of Munich (TUM)",
            country="Germany",
            city="Munich",
            official_website="https://tum.de",
            ranking=28,
            established=1868,
            programs=["prog_tum_msc_informatics"],
            reliability_score=0.99
        )
    ]
    for u in universities:
        kg.universities[u.id] = u

    # 3. Programs
    programs = [
        ProgramEntity(
            id="prog_ioe_be_comp",
            university_id="univ_tu_ioe",
            name="B.E. in Computer Engineering",
            degree="Bachelor of Engineering",
            faculty="Department of Electronics and Computer Engineering",
            tuition=450000.0,
            currency="NPR",
            duration_years=4.0,
            eligibility="Minimum 45% in +2 Science (Physics, Chemistry, Maths) or C Grade in all subjects",
            entrance_exam_id="exam_ioe_entrance_2026",
            application_deadline="2026-10-15",
            application_open="2026-09-01",
            source_id="src_ioe_portal"
        ),
        ProgramEntity(
            id="prog_ioe_be_civil",
            university_id="univ_tu_ioe",
            name="B.E. in Civil Engineering",
            degree="Bachelor of Engineering",
            faculty="Department of Civil Engineering",
            tuition=420000.0,
            currency="NPR",
            duration_years=4.0,
            eligibility="+2 Science with Mathematics & Physics minimum C grade",
            entrance_exam_id="exam_ioe_entrance_2026",
            application_deadline="2026-10-15",
            application_open="2026-09-01",
            source_id="src_ioe_portal"
        ),
        ProgramEntity(
            id="prog_ku_be_ai",
            university_id="univ_ku",
            name="B.Tech in Artificial Intelligence",
            degree="Bachelor of Technology",
            faculty="School of Engineering",
            tuition=820000.0,
            currency="NPR",
            duration_years=4.0,
            eligibility="Minimum 2.0 GPA in +2 Science with PCM / KUUMAT or KUCAT qualified",
            entrance_exam_id="exam_kucat_2026",
            application_deadline="2026-09-30",
            application_open="2026-08-15",
            source_id="src_ku_admissions"
        ),
        ProgramEntity(
            id="prog_tum_msc_informatics",
            university_id="univ_tum_germany",
            name="M.Sc. in Informatics & Data Science",
            degree="Master of Science",
            faculty="TUM Department of Informatics",
            tuition=0.0,  # Tuition free
            currency="EUR",
            duration_years=2.0,
            eligibility="Bachelor's degree in Computer Science/IT + GRE/GATE & English C1 proficiency",
            application_deadline="2026-11-30",
            application_open="2026-09-01",
            source_id="src_erasmus_plus"
        )
    ]
    for p in programs:
        kg.programs[p.id] = p

    # 4. Entrance Exams
    exams = [
        EntranceExamEntity(
            id="exam_ioe_entrance_2026",
            name="IOE Engineering Entrance Examination 2026",
            conducting_body="Tribhuvan University IOE Entrance Board, Pulchowk",
            registration_open="2026-09-01",
            registration_close="2026-09-28",
            exam_date="2026-10-08",
            fee=2000.0,
            currency="NPR",
            syllabus_url="https://entrance.ioe.edu.np/syllabus"
        ),
        EntranceExamEntity(
            id="exam_kucat_2026",
            name="KUCAT (Kathmandu University Computer-Based Test)",
            conducting_body="Kathmandu University Admissions Office",
            registration_open="2026-08-15",
            registration_close="2026-09-20",
            exam_date="2026-09-25",
            fee=2500.0,
            currency="NPR",
            syllabus_url="https://ku.edu.np/kucat"
        )
    ]
    for e in exams:
        kg.exams[e.id] = e

    # 5. Scholarships
    scholarships = [
        ScholarshipEntity(
            id="sch_moest_merit",
            name="Nepal MOEST National Engineering Quota & Merit Scholarship",
            provider="Ministry of Education, Science and Technology",
            amount_description="100% Free Tuition + Government Monthly Stipend",
            coverage_type="FULL_TUITION",
            criteria="Top 100 Rank in IOE Entrance Examination + Nepali Citizenship",
            deadline="2026-10-25",
            target_fields=["Computer Engineering", "Civil Engineering", "Electrical Engineering"],
            application_url="https://moest.gov.np/scholarships"
        ),
        ScholarshipEntity(
            id="sch_erasmus_mundus",
            name="Erasmus Mundus Joint Master Degree (EMJMD) Fellowship",
            provider="European Commission",
            amount_description="€1,400 monthly living allowance + Full Travel & Tuition coverage",
            coverage_type="FULL_TUITION",
            criteria="Graduated Bachelor degree with top 10% academic standing + Research Statement",
            deadline="2026-12-15",
            target_fields=["Informatics", "Data Science", "Artificial Intelligence"],
            application_url="https://erasmus-plus.ec.europa.eu"
        ),
        ScholarshipEntity(
            id="sch_ku_founders",
            name="KU Founders Merit & Need-Based Fellowship",
            provider="Kathmandu University Board of Trustees",
            amount_description="50% to 100% Tuition Fee Waiver",
            coverage_type="PARTIAL",
            criteria="KUCAT score >= 85th percentile + demonstrated academic excellence",
            deadline="2026-10-05",
            target_fields=["B.Tech AI", "Computer Science"],
            application_url="https://ku.edu.np/scholarships"
        )
    ]
    for s in scholarships:
        kg.scholarships[s.id] = s

    # 6. Students
    student = StudentEntity(
        id="std_sujan_01",
        name="Sujan Sharma",
        email="sujan.sharma@eduva.ai",
        city="Kathmandu",
        target_degree="Undergraduate",
        target_fields=["Computer Engineering", "Artificial Intelligence"],
        academic_score="3.85 GPA (+2 Science)",
        interested_programs=["prog_ioe_be_comp", "prog_ku_be_ai", "prog_tum_msc_informatics"],
        active_applications=["app_sujan_ioe", "app_sujan_ku"],
        execution_policy="SMART_AUTO"
    )
    kg.students[student.id] = student

    # 7. Applications
    applications = [
        ApplicationEntity(
            id="app_sujan_ioe",
            student_id="std_sujan_01",
            program_id="prog_ioe_be_comp",
            university_id="univ_tu_ioe",
            status="IN_PROGRESS",
            required_documents=["+2 Character Certificate", "Transcript", "Citizenship Card", "Passport Size Photo"],
            submitted_documents=["+2 Character Certificate", "Citizenship Card"],
            deadline="2026-10-15",
            urgency_level="HIGH"
        ),
        ApplicationEntity(
            id="app_sujan_ku",
            student_id="std_sujan_01",
            program_id="prog_ku_be_ai",
            university_id="univ_ku",
            status="IN_PROGRESS",
            required_documents=["+2 Marksheet", "Migration Certificate", "Citizenship", "KUCAT Scorecard"],
            submitted_documents=["+2 Marksheet", "Citizenship"],
            deadline="2026-09-30",
            urgency_level="HIGH"
        )
    ]
    for a in applications:
        kg.applications[a.id] = a

    # 8. Knowledge Gaps (Demonstrates gap detection)
    kg.knowledge_gaps["gap_pu_hostel"] = KnowledgeGapEntity(
        id="gap_pu_hostel",
        entity_type="PROGRAM",
        entity_id="prog_pu_be_it",
        missing_field="hostel_and_mess_fees",
        priority="MEDIUM",
        status="OPEN"
    )
