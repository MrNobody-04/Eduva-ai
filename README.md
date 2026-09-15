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

---

## 5-Provider Parallel Multi-Agent Architecture

Eduva AI implements a non-blocking, parallel multi-agent architecture orchestrated through a centralized **AI Gateway** operating across exactly five configured providers:

```text
                                EDUVA MASTER ORCHESTRATOR
                                            │
           ┌────────────────────────┬───────┴────────┬────────────────────────┐
           ▼                        ▼                ▼                        ▼
     ResearchAgent          VerificationAgent   CopilotAgent          SafetyAgent /
   (Autonomous Scan)       (Contradiction Check)  (Realtime Chat)     News / Notification
           │                        │                │                        │
           └────────────────────────┴───────┬────────┴────────────────────────┘
                                            ▼
                             CENTRAL INTELLIGENT AI GATEWAY
                        (Routing, Concurrency, Quotas, Circuits)
                                            │
         ┌───────────────────┬──────────────┼──────────────┬───────────────────┐
         ▼                   ▼              ▼              ▼                   ▼
       Groq               Cerebras        Gemini       OpenRouter           Ollama
    (Realtime /         (Ultra-Fast    (google-genai     (Model             (Local /
    Classification)     Fact Check)      Deep Logic)    Diversity)          Private)
```

### The 5 Configured Providers
1. **Google Gemini**: Deep multi-step reasoning, admissions criteria parsing, and syllabus analysis via the official `google-genai` SDK. Supports a multi-key pool (`GEMINI_API_KEYS`, `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`) with round-robin rotation, 60s cooldown on 429 rate limits, and failure isolation.
2. **Cerebras Cloud**: Ultra-fast fact-checking, entity cross-referencing, and verification subtasks. Includes dynamic model discovery and strict status classification (`CONNECTED`, `PAYMENT_REQUIRED`, `MODEL_UNAVAILABLE`, `RATE_LIMITED`).
3. **Groq**: Sub-second conversational responses for the student copilot, intent classification, and safety scanning via high-throughput Llama/Qwen models.
4. **OpenRouter**: Frontier model diversity and secondary consensus opinions, ensuring zero vendor lock-in.
5. **Ollama**: Local and on-premise private inference daemon with strict server-side URL validation and SSRF protection.

### Intelligent Reliability Features
* **Dynamic Capability Routing**: Each agent task (`REALTIME_CHAT`, `DEEP_RESEARCH`, `VERIFICATION`, `SOP_ANALYSIS`, `SAFETY_CLASSIFICATION`) maps to a ranked provider fallback chain.
* **Per-Provider Circuit Breakers**: Independent failure counters automatically trip failing or rate-limited providers to `OPEN`, entering `HALF_OPEN` canary probes before recovering back to `CLOSED`.
* **5 Quota Protection Tiers**: Tracks sliding-window RPM against provider limits. Progressively sheds non-essential tasks (`NORMAL` → `CAUTIOUS` → `BACKGROUND_THROTTLING` → `HIGH_CRITICAL_ONLY` → `EMERGENCY_PROTECTION`), reserving capacity for student interactive chats and critical alerts.
* **Content Deduplication Cache**: Computes SHA-256 digests over inputs and queries, instantly serving cached responses (0.0ms latency, 0 tokens consumed) on repeated scans.
* **Persistent SQLite Job Queue & Crash Recovery**: High-priority tasks persist in `ai_jobs`. If the server reboots, `reconcile_abandoned_jobs()` automatically restores interrupted `RUNNING` tasks back to `QUEUED`.
* **Lightweight Concurrent Diagnostics**: Built-in diagnostics (`python backend/run_provider_diagnostics.py` and `GET /api/providers/health`) run safe, minimal-token health checks concurrently across all 5 providers without exhausting free-tier quotas or leaking credentials.

> *Eduva dynamically routes workloads across configured providers, protects quota headroom, applies adaptive throttling, and automatically fails over when a provider becomes unavailable.*

Visit: `http://127.0.0.1:5173` (Frontend) | `http://127.0.0.1:8000/docs` (FastAPI Swagger UI)

---
Crafted with ❤️ for Nepal by **SujanGC**\n