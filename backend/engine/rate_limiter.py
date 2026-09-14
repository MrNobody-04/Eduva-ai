"""
EDUVA AI Rate Limiting Service
Protects expensive LLM (Gemini 2.5 Flash), document generation, and WebSocket connections
from cost-drain, brute-force attacks, and abusive request flooding.
"""

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException, status
import time
from typing import Dict

# Global SlowAPI Limiter keyed by client IP
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

# In-memory connection tracker for WebSocket IP throttling
ws_ip_connections: Dict[str, list] = {}

def check_ws_rate_limit(client_ip: str, max_connects_per_minute: int = 15) -> bool:
    """
    Checks if a client IP has exceeded WebSocket connection attempts per minute.
    """
    now = time.time()
    cutoff = now - 60.0
    
    # Prune old timestamps
    timestamps = ws_ip_connections.get(client_ip, [])
    timestamps = [t for t in timestamps if t > cutoff]
    
    if len(timestamps) >= max_connects_per_minute:
        ws_ip_connections[client_ip] = timestamps
        return False
        
    timestamps.append(now)
    ws_ip_connections[client_ip] = timestamps
    return True
