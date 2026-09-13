# Security Policy & Defense Standards

## Security Architecture

1. **Input Sanitization & Injection Prevention**:
   - Strict Pydantic models validate all incoming payload boundaries.
   - External web contents are treated purely as **UNTRUSTED DATA**, strictly isolated from system prompts to prevent indirect prompt injection.

2. **Access Control & RBAC**:
   - Permission-based email inbox access requiring explicit student consent.
   - Cryptographic signature tokens for entrance merit scorecard downloads.

3. **Secret Isolation**:
   - Zero exposure of API keys, database connection strings, or internal tokens to client bundles.
   - Strict CORS configuration limiting allowed origin vectors.\n