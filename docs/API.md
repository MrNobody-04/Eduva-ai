# EDUVA AI REST & WebSocket API Specification

## Endpoints

### 1. Universities & Colleges
- `GET /api/universities`: Returns all 26+ verified universities.
- `GET /api/universities/{univ_id}`: Returns university detail with faculties and constituent campuses.
- `GET /api/colleges`: Returns all constituent and affiliated colleges.

### 2. Courses & Eligibility
- `GET /api/courses`: Returns catalog of 40+ degree programs.
- `GET /api/courses/{course_id}`: Returns specific degree prerequisites, duration, and career paths.
- `POST /api/eligibility/evaluate`: Evaluates student stream, GPA, and location to return matching degrees.

### 3. Living Search & Comparison
- `GET /api/search?q={query}`: Universal search with on-demand autonomous discovery.
- `POST /api/comparison`: Side-by-side comparison matrix for universities or colleges.

### 4. Living AI Telemetry
- `GET /api/living-system/telemetry`: Telemetry of monitored Level 1 portals and versioned changes.
- `POST /api/living-system/simulate-discovery`: Simulates discovering an uncataloged college.
- `POST /api/living-system/simulate-deadline-change`: Simulates deadline extension detection.

### 5. Copilot & Academic Drafter
- `POST /api/copilot/chat`: Context-aware multilingual AI conversation endpoint.
- `POST /api/draft-document`: Automated SOP, admission application, and scholarship letter generator.\n