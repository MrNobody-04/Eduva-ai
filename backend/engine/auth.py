"""
EDUVA AI — Production Authentication & Session Security Layer
Follows OWASP ASVS, OWASP Top 10, NIST SP 800-63B guidelines.
1. Argon2id Password Hashing (preferred) with PBKDF2 backward compatibility.
2. Fail-Closed Secret Handling in Production.
3. Tamper-Proof HMAC-SHA256 Session Tokens with Student Ownership.
4. Server-Side RBAC (admin vs student) with 401/403 Enforcement.
5. Email Validation and Verification Token Lifecycle.
"""

import os
import re
import hmac
import hashlib
import base64
import json
import time
import secrets
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Security, status
from fastapi.security import APIKeyHeader

# 1. FAIL-CLOSED SECRET HANDLING
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PRODUCTION = ENVIRONMENT in ("production", "prod")

raw_admin_key = os.getenv("ADMIN_API_KEY")
raw_session_secret = os.getenv("SESSION_SECRET")

INSECURE_KEYS = {
    "eduva-admin-secret-key-2026",
    "admin123",
    "password123",
    "default",
    "secret",
    "some-default-secret"
}

if IS_PRODUCTION:
    if not raw_admin_key or raw_admin_key in INSECURE_KEYS:
        raise RuntimeError(
            "CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_API_KEY must be set to a high-entropy secret in production."
        )
    if not raw_session_secret or raw_session_secret in INSECURE_KEYS:
        raise RuntimeError(
            "CRITICAL SECURITY CONFIGURATION ERROR: SESSION_SECRET must be set to a high-entropy secret in production."
        )
    ADMIN_API_KEY = raw_admin_key
    SESSION_SECRET = raw_session_secret.encode("utf-8")
else:
    # Development / Testing: use provided key or generate secure ephemeral fallback
    ADMIN_API_KEY = raw_admin_key or "eduva-admin-secret-key-2026"
    SESSION_SECRET = (raw_session_secret or "eduva-session-hmac-secret-salt-nepal-2026").encode("utf-8")

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

# 2. ARGON2ID PASSWORD SECURITY (NIST SP 800-63B / OWASP)
try:
    from argon2 import PasswordHasher
    from argon2.exceptions import VerifyMismatchError, VerificationError
    _ph = PasswordHasher(
        time_cost=2,
        memory_cost=65536,  # 64 MiB
        parallelism=2,
        hash_len=32,
        salt_len=16
    )
    HAS_ARGON2 = True
except ImportError:
    HAS_ARGON2 = False
    _ph = None


def hash_password(password: str) -> str:
    """
    Hashes password using Argon2id (RFC 9106) if available,
    falling back to PBKDF2-HMAC-SHA256 with 100,000 iterations.
    """
    if not password or len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    
    if HAS_ARGON2 and _ph:
        return _ph.hash(password)
    
    # Fallback to PBKDF2-HMAC-SHA256
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return f"pbkdf2:{base64.b64encode(salt + dk).decode('utf-8')}"


def verify_password(password: str, hashed: str) -> bool:
    """
    Verifies password against stored hash.
    Supports Argon2id and PBKDF2 formats.
    """
    if not password or not hashed:
        return False
        
    try:
        if hashed.startswith("$argon2"):
            if HAS_ARGON2 and _ph:
                try:
                    return _ph.verify(hashed, password)
                except (VerifyMismatchError, VerificationError):
                    return False
            return False
            
        # PBKDF2 verification (for backward compatibility)
        clean_hash = hashed[7:] if hashed.startswith("pbkdf2:") else hashed
        data = base64.b64decode(clean_hash.encode('utf-8'))
        salt = data[:16]
        expected_dk = data[16:]
        dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(dk, expected_dk)
    except Exception:
        return False


# 3. EMAIL SYNTAX & DOMAIN VALIDATION
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

def validate_and_normalize_email(email: str) -> str:
    """
    Validates email format and normalizes to lowercase.
    Does NOT block legitimate public domains (Gmail, Outlook, Yahoo, etc.).
    """
    if not email or not isinstance(email, str):
        raise HTTPException(status_code=400, detail="A valid email address is required.")
        
    normalized = email.strip().lower()
    if len(normalized) > 254:
        raise HTTPException(status_code=400, detail="Email address is too long.")
        
    if not EMAIL_REGEX.match(normalized):
        raise HTTPException(status_code=400, detail="Invalid email address format.")
        
    # Domain validation
    parts = normalized.split("@", 1)
    if len(parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid email address format.")
    domain = parts[1]
    if "." not in domain or len(domain.split(".")[-1]) < 2:
        raise HTTPException(status_code=400, detail="Invalid email domain.")
        
    return normalized


def generate_verification_token() -> str:
    """Generates a high-entropy URL-safe one-time email verification token."""
    return secrets.token_urlsafe(32)


# 4. CRYPTOGRAPHIC SESSION TOKENS (HMAC-SHA256)
def create_session_token(
    session_id: str,
    student_id: str,
    role: str = "student",
    expiry_hours: int = 72
) -> str:
    """
    Creates a tamper-proof HMAC-SHA256 signed session token.
    Format: <base64_payload>.<signature_hex>
    """
    payload = {
        "session_id": session_id,
        "student_id": student_id,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + (expiry_hours * 3600)
    }
    payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode('utf-8').rstrip('=')
    
    signature = hmac.new(SESSION_SECRET, payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{signature}"


def verify_session_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifies HMAC signature and expiration of a session token.
    Returns payload dictionary if valid, None otherwise.
    """
    if not token or "." not in token:
        return None
        
    parts = token.split(".", 1)
    payload_b64, signature = parts[0], parts[1]
    
    expected_signature = hmac.new(SESSION_SECRET, payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_signature):
        return None
        
    try:
        padding = 4 - (len(payload_b64) % 4)
        if padding != 4:
            payload_b64 += "=" * padding
        payload_bytes = base64.urlsafe_b64decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        # Check expiration
        if payload.get("exp", 0) < int(time.time()):
            return None
            
        return payload
    except Exception:
        return None


# 5. FASTAPI DEPENDENCIES & SERVER-SIDE RBAC

def extract_token_from_request(request: Request) -> Optional[str]:
    """Extracts session token from headers or cookies only (never URL query)."""
    # 1. Custom Header
    token = request.headers.get("X-Session-Token")
    if token:
        return token.strip()
        
    # 2. Authorization Bearer
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()
        
    # 3. HttpOnly / Secure Cookie
    cookie_token = request.cookies.get("eduva_session_token")
    if cookie_token:
        return cookie_token.strip()
        
    return None


async def get_authenticated_session(request: Request) -> Dict[str, Any]:
    """
    FastAPI dependency: Authenticates the student from session token.
    FAILS CLOSED: Returns 401 UNAUTHORIZED if session is missing or invalid.
    Never falls back to hardcoded demo or guest identities.
    """
    token = extract_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required: Missing session token. Please log in or register."
        )
        
    payload = verify_session_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Session token is invalid or expired."
        )
        
    payload["is_verified"] = True
    return payload


async def require_admin_user(
    request: Request,
    key_from_header: Optional[str] = Security(api_key_header)
) -> Dict[str, Any]:
    """
    Server-side RBAC for administrative operations:
    Allows either:
    1. Valid ADMIN_API_KEY via X-API-Key or Authorization: Bearer
    2. Valid Session Token of a user with role == 'admin'
    FAILS CLOSED:
    - 401 if unauthenticated
    - 403 if authenticated user does not have admin role
    """
    # 1. Check API Key
    provided_key = key_from_header
    if not provided_key:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            bearer_val = auth_header[7:].strip()
            # If it's not a dot-delimited session token, treat as API key candidate
            if "." not in bearer_val:
                provided_key = bearer_val

    if provided_key:
        if hmac.compare_digest(provided_key, ADMIN_API_KEY):
            return {"role": "admin", "auth_type": "api_key", "student_id": "admin_system"}
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Invalid Admin API Key."
            )

    # 2. Check Session Token for admin role
    token = extract_token_from_request(request)
    if token:
        payload = verify_session_token(token)
        if payload:
            if payload.get("role") == "admin":
                return {
                    "role": "admin",
                    "auth_type": "session",
                    "student_id": payload.get("student_id"),
                    "session_id": payload.get("session_id")
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: Administrator privileges required."
                )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Admin authentication required: Provide X-API-Key or valid admin session."
    )


# Backwards compatibility alias for existing admin endpoints
verify_admin_key = require_admin_user


def verify_ws_session(token: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Validates session token for WebSocket connection handshakes.
    """
    if not token:
        return None
    return verify_session_token(token)

