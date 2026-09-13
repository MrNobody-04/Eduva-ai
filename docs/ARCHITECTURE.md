# EDUVA AI System Architecture

## Architectural Overview

EDUVA AI is built on a decoupled, reactive, event-driven architecture designed to process, verify, and deliver authoritative educational intelligence at scale.

```mermaid
graph TD
    User([Student / User]) <--> Frontend[Vite + React SPA]
    Frontend <--> |REST / WebSocket| Gateway[FastAPI Backend Gateway]
    
    subgraph Core Engines
        Gateway --> LKS[Living Knowledge System]
        Gateway --> Copilot[Context-Aware Copilot Agent]
        Gateway --> Elig[Eligibility Engine]
        Gateway --> Comp[Comparison Matrix Engine]
        Gateway --> Sec[Security Gate & RBAC]
    end

    subgraph Autonomous Research Pipeline
        LKS --> DiscoveryAgent[Autonomous Discovery Agent]
        DiscoveryAgent --> SourceScraper[Authoritative Source Connector]
        DiscoveryAgent --> Verifier[Verification & Extraction Engine]
        Verifier --> ConfCalc[Confidence & Hierarchy Evaluator]
        ConfCalc --> KG[(Knowledge Graph & Search Index)]
    end

    subgraph Data Stores
        KG <--> SQLite[(Normalized SQLite DB)]
        LKS <--> AuditLog[(Versioned Change Log)]
    end
```

### Source Hierarchy
- **Level 1 — Authoritative**: Government of Nepal, Ministry of Education (MOEST), University Central Examination Boards, Medical Education Commission (MEC), Nepal Engineering Council (NEC).
- **Level 2 — Trusted**: Recognized institutional journals, campus gazettes, accredited colleges.
- **Level 3 — Discovery Only**: General directories, community feeds. Used strictly to discover potential entities, never to verify critical claims.\n