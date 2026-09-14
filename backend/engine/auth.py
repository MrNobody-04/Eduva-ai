"""
EDUVA AI — Production Authentication & Session Security Layer
1. Admin API Key Validation: Protects /api/admin/* and simulation endpoints.
2. Cryptographic Student Session Tokens (HMAC-SHA256): Ensures students can only access their own data.
"""

import os
import hmac
import hashlib
import base64
import json
import time
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Security, status
from fastapi.security import APIKeyHeader

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "eduva-admin-secret-key-2026")
SESSION_SECRET = os.getenv("SESSION_SECRET", "eduva-session-hmac-secret-salt-nepal-2026").encode("utf-8")

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_admin_key(request: Request, key_from_header: Optional[str] = Security(api_key_header)) -> str:
    """
    Validates X-API-Key header or Authorization: Bearer against ADMIN_API_KEY.
    """
    provided_key = key_from_header
    if not provided_key:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            provided_key = auth_header[7:].strip()
            
    if not provided_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication required: Missing X-API-Key or Authorization header."
        )
        
    # Constant-time comparison to prevent timing attacks
    if not hmac.compare_digest(provided_key, ADMIN_API_KEY):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Invalid Admin API Key."
        )
        
    return provided_key


def hash_password(password: str) -> str:
    """Hashes password with PBKDF2-HMAC-SHA256 and salt."""
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(salt + dk).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verifies password against stored PBKDF2 hash."""
    try:
        data = base64.b64decode(hashed.encode('utf-8'))
        salt = data[:16]
        expected_dk = data[16:]
        dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(dk, expected_dk)
    except Exception:
        return False

def create_session_token(session_id: str, student_id: str, role: str = "student", expiry_hours: int = 72) -> str:
    """
    Creates a tamper-proof HMAC-SHA256 signed session token.
    Format: <base64_payload>.<signature_hex>
    """
    payload = {
        "session_id": session_id,
        "student_id": student_id,
        "role": role,
        "exp": int(time.time()) + (expiry_hours * 3600)
    }
    payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode('utf-8').rstrip('=')
    
    signature = hmac.new(SESSION_SECRET, payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{signature}"


def verify_session_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifies the HMAC signature and expiration of a session token.
    Returns the payload dictionary if valid, None otherwise.
    """
    if not token or "." not in token:
        return None
        
    parts = token.split(".", 1)
    payload_b64, signature = parts[0], parts[1]
    
    expected_signature = hmac.new(SESSION_SECRET, payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_signature):
        return None
        
    try:
        # Pad base64 string if necessary
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


async def get_authenticated_session(request: Request) -> Dict[str, Any]:
    """
    FastAPI dependency that extracts and validates the caller's session token.
    Reads from:
    1. X-Session-Token header
    2. Authorization: Bearer <token>
    3. Query parameter ?token=
    4. Cookie eduva_session_token
    """
    token = request.headers.get("X-Session-Token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:].strip()
    if not token:
        token = request.query_params.get("token")
    if not token:
        token = request.cookies.get("eduva_session_token")
        
    if not token:
        # In local dev or first visit without a token, issue a virtual temporary session
        # but mark as unverified
        return {"session_id": "unverified_session", "student_id": "student_user", "is_verified": False}
        
    payload = verify_session_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Invalid or expired student session token."
        )
        
    payload["is_verified"] = True
    return payload


def verify_ws_session(token: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Validates session token for WebSocket connection handshakes.
    """
    if not token:
        return None
    return verify_session_token(token)
