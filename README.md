# EDUVA AI — Nepal Higher Education Intelligence & Autonomous Student Assistant
> **Production Public Launch Release** • Verified Nepal Education Knowledge System • Level 1 Authoritative Hierarchy

EDUVA AI is an autonomous higher education discovery, verification, and admission assistance platform built specifically for Nepal. It bridges the critical information gap across Nepal's 26+ national, provincial, technical, and medical health universities, 1,400+ constituent and affiliated colleges, and 40+ degree programs.

---

## Key Capabilities

1. **Living Education Knowledge System**:
   - Dynamic discovery pipeline that researches, verifies, and indexes uncataloged institutions and programs on demand.
   - Strict source verification hierarchy (Level 1 Authoritative, Level 2 Trusted, Level 3 Discovery).
   - Zero-fabrication guarantee: unverified claims are explicitly designated `REQUIRES VERIFICATION`.

2. **Nepal University & College Directory**:
   - Comprehensive records for all 26+ universities (TU, KU, PokU, PU, MWU, SU, UON, AFU, NSU, LBU, NOU, RJU, MBUST, YAU, MTU, GU, MAU, MU, LTU, BPKIHS, NAMS, PAHS, KAHS, RAHS, PokAHS, MIHS, MDCHUS).
   - Relational entity hierarchy: University → Faculty → Program → College → Campus → Entrance Exam.

3. **Academic Degree Intelligence & "What Can I Study?"**:
   - Evaluates student academic profiles (+2 Science, Management, Humanities, Education) and GPA against official prerequisites.
   - Generates verified eligibility statuses (`ELIGIBLE`, `POTENTIALLY_ELIGIBLE`, `NOT_ELIGIBLE`) with clear justifications.

4. **Multi-Entity Comparison Matrix**:
   - Side-by-side comparison of up to 4 universities or colleges across affiliations, constituent campuses, entrance gates, and fee structures.

5. **Official Entrance Registry & PDF Scorecards**:
   - Searchable entrance examination merit ranks across IOE Engineering, CEE Medical, KUCAT KU, CMAT Management, and CSIT.
   - Direct 1-click printable and downloadable PDF merit scorecards with digital verification credentials.

6. **Context-Aware Multilingual Conversational AI**:
   - Natural dialogue understanding in English, Devanagari Nepali, and Romanized Nepglish.
   - Session context memory: preserves dialogue state across turns without asking students to repeat themselves.
   - Multi-format responses: Text, Course Cards, College Cards, Deadline Cards, Comparison Tables, and Level 1 Source Badges.

7. **Autonomous AI Control Center & Admin Intelligence**:
   - Real-time telemetry monitoring Level 1 official portals, versioned semantic change history (e.g. deadline extensions), and knowledge gaps.

---

## Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://127.0.0.1:5173` (Frontend) | `http://127.0.0.1:8000/docs` (FastAPI Swagger UI)

---
Crafted with ❤️ for Nepal by **SujanGC**\n