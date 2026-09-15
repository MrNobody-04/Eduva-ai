"""
EDUVA AI — Live 5-Provider Diagnostics CLI Command
Executes real, lightweight, concurrent runtime diagnostic checks across all five configured AI providers:
1. Gemini
2. Cerebras
3. Groq
4. OpenRouter
5. Ollama

Security:
- Never displays API keys or sensitive authorization headers
- Safe for production execution and terminal output
"""

import sys
import os
import asyncio
import datetime

# Ensure UTF-8 output encoding on Windows if supported
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from engine.provider_health import global_provider_health

async def main():
    print("=" * 80)
    print("EDUVA AI: 5-PROVIDER RUNTIME DIAGNOSTICS")
    print("=" * 80)
    print("Executing lightweight, concurrent health checks across all 5 providers...")
    
    t0 = datetime.datetime.now(datetime.timezone.utc)
    results = await global_provider_health.run_diagnostics(force=True)
    
    print("\n" + "-" * 80)
    print(f"{'Provider':<14} {'Status':<20} {'Model':<24} {'Latency':<10}")
    print("-" * 80)
    
    status_tags = {
        "CONNECTED": "[CONNECTED]",
        "RATE_LIMITED": "[RATE_LIMITED]",
        "PAYMENT_REQUIRED": "[PAYMENT_REQUIRED]",
        "MODEL_UNAVAILABLE": "[MODEL_UNAVAILABLE]",
        "AUTH_FAILED": "[AUTH_FAILED]",
        "NOT_CONFIGURED": "[NOT_CONFIGURED]",
        "NETWORK_ERROR": "[NETWORK_ERROR]",
        "TIMEOUT": "[TIMEOUT]",
        "PROVIDER_ERROR": "[PROVIDER_ERROR]"
    }
    
    for p, d in results.items():
        tag = status_tags.get(d["status"], f"[{d['status']}]")
        model_str = (d.get("model") or "none")[:22]
        latency_str = f"{d.get('latency_ms', 0):.1f}ms"
        print(f"{p.capitalize():<14} {tag:<20} {model_str:<24} {latency_str:<10}")
        if d.get("message") and d["status"] != "CONNECTED":
            print(f"   -> Detail: {d['message']}")
            
    print("-" * 80)
    connected_count = sum(1 for d in results.values() if d["status"] == "CONNECTED")
    print(f"Summary: {connected_count}/5 Providers CONNECTED & Ready for Inference")
    print(f"Checked at: {t0.isoformat()}")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(main())
