# EDUVA AI Intelligence & Agent Architecture

## Multi-Agent Collaboration Network

EDUVA AI utilizes specialized autonomous agents coordinating over an in-memory asynchronous EventBus:

1. **AutonomousEducationDiscoveryAgent**:
   - Activated when a query yields zero verified local matches (e.g., `"ABC College BCA Kathmandu"`).
   - Identifies candidate sources, validates university affiliation decrees, extracts course catalogs, and computes verification confidence.

2. **VerificationAgent**:
   - Validates semantic claims against Level 1 authoritative sources.
   - Enforces conflict resolution: if Source A says June 10 and Source B says June 12, prioritizes authoritative gazettes or marks `REQUIRES_VERIFICATION`.

3. **SemanticChangeDetector**:
   - Analyzes official notices for operational changes (deadline extensions, fee revisions, intake quota alterations).
   - Records previous value, new value, detected timestamp, and affected student cohorts.

4. **CopilotConversationalAgent**:
   - Maintains conversational session memory.
   - Formulates multi-format structured payloads (Cards, Tables, Timelines, Badges).\n