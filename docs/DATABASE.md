# Database Schema & Relational Models

## Normalized Relational Hierarchy

```
University (1) ──< Constituent Campuses (M)
    │
    ├──< Faculties (M) ──< Programs / Degrees (M)
    │                          │
    └──< Affiliated Colleges (M) ──< CollegePrograms (M)
                                       │
                                       ├──< Admissions (1)
                                       └──< EntranceExams (1)
```

### Core Tables
- `universities`: id, name, acronym, category, institution_type, established_year, location, province, chancellor, vice_chancellor, website.
- `colleges`: id, name, university_id, ownership, location, district, province, admission_status, fee_structure, verification_status.
- `courses`: id, name, code, category, duration_years, semesters, primary_university, eligibility, entrance_exam, fee_range.
- `entrance_scorecards`: roll_number, candidate_name, program_applied, merit_rank, score, institution, quota_status.
- `versioned_changes`: id, entity_type, entity_id, change_type, previous_value, new_value, detected_at, verified_at, confidence.\n