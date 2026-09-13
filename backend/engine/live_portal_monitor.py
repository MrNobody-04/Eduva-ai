"""
EDUVA AI Live Portal Monitor & Autonomous Scraping Worker
Periodically checks official Nepal education notice boards (TU, KU, IOE, MEC, MOEST),
computes content checksums, detects new admission/entrance notices, and triggers
autonomous knowledge graph updates without human intervention.
"""

import asyncio
import datetime
import hashlib
from typing import Dict, List, Any
import httpx
from engine.event_bus import global_event_bus, EduvaEvent

OFFICIAL_PORTALS_TO_MONITOR = [
    {
        "id": "portal_ioe_entrance",
        "name": "TU IOE Entrance Examination Board",
        "url": "https://entrance.ioe.edu.np",
        "category": "ENGINEERING_ENTRANCE",
        "authorityLevel": "LEVEL_1_AUTHORITATIVE",
        "poll_interval_seconds": 3600
    },
    {
        "id": "portal_ku_admissions",
        "name": "Kathmandu University Admissions",
        "url": "https://ku.edu.np",
        "category": "UNIVERSITY_ADMISSION",
        "authorityLevel": "LEVEL_1_AUTHORITATIVE",
        "poll_interval_seconds": 3600
    },
    {
        "id": "portal_mec_nepal",
        "name": "Medical Education Commission (MEC) Nepal",
        "url": "https://mec.gov.np",
        "category": "MEDICAL_ENTRANCE",
        "authorityLevel": "LEVEL_1_AUTHORITATIVE",
        "poll_interval_seconds": 3600
    },
    {
        "id": "portal_tu_central",
        "name": "Tribhuvan University Central Notice Board",
        "url": "https://tribhuvan-university.edu.np",
        "category": "CENTRAL_NOTICE",
        "authorityLevel": "LEVEL_1_AUTHORITATIVE",
        "poll_interval_seconds": 7200
    }
]

class LivePortalMonitor:
    def __init__(self):
        self.portals = OFFICIAL_PORTALS_TO_MONITOR
        self.portal_checksums: Dict[str, str] = {}
        self.last_checked: Dict[str, str] = {}
        self.detected_live_notices: List[Dict[str, Any]] = []
        self.is_monitoring = False

    async def check_portal(self, portal: Dict[str, Any], client: httpx.AsyncClient) -> Optional[Dict[str, Any]]:
        pid = portal["id"]
        pname = portal["name"]
        url = portal["url"]
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        try:
            # Attempt live HTTP GET with polite timeout and standard browser headers
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) EDUVA-AI-Autonomous-Observer/2.0"
            }
            resp = await client.get(url, headers=headers, timeout=8.0, follow_redirects=True)
            self.last_checked[pid] = now_str

            if resp.status_code == 200:
                html_bytes = resp.content
                content_hash = hashlib.sha256(html_bytes[:10000]).hexdigest()
                
                prev_hash = self.portal_checksums.get(pid)
                if prev_hash and prev_hash != content_hash:
                    # Content change detected!
                    notice_record = {
                        "id": f"live_notice_{len(self.detected_live_notices) + 1}",
                        "portal_id": pid,
                        "portal_name": pname,
                        "url": url,
                        "detected_at": now_str,
                        "change_type": "PORTAL_CONTENT_MUTATION",
                        "status": "AUTONOMOUSLY_CAPTURED"
                    }
                    self.detected_live_notices.insert(0, notice_record)
                    self.portal_checksums[pid] = content_hash
                    
                    # Publish autonomous event
                    await global_event_bus.publish(EduvaEvent(
                        event_type="LIVE_NOTICE_DETECTED",
                        agent_source="LivePortalMonitor",
                        confidence=0.98,
                        data=notice_record
                    ))
                    print(f"[AUTONOMOUS MONITOR] Live change observed on {pname} ({url})")
                    return notice_record
                else:
                    self.portal_checksums[pid] = content_hash
                    return None
            else:
                print(f"[AUTONOMOUS MONITOR] {pname} returned HTTP {resp.status_code}")
                return None

        except Exception as e:
            # Network timeout or portal temporary outage; mark politely without failing
            self.last_checked[pid] = f"{now_str} (Connection Timeout / Fallback)"
            return None

    async def run_single_monitoring_pass(self) -> List[Dict[str, Any]]:
        changes_found = []
        async with httpx.AsyncClient() as client:
            for portal in self.portals:
                result = await self.check_portal(portal, client)
                if result:
                    changes_found.append(result)
                await asyncio.sleep(1.0)
        return changes_found

    async def start_background_monitoring_loop(self):
        self.is_monitoring = True
        print("[AUTONOMOUS MONITOR] Live Portal Monitoring Worker Started.")
        while self.is_monitoring:
            try:
                await self.run_single_monitoring_pass()
            except Exception as e:
                print(f"[AUTONOMOUS MONITOR ERROR] {e}")
            # Wait 60 seconds between passes in dev, or configure in production
            await asyncio.sleep(60.0)

    def get_monitor_status(self) -> Dict[str, Any]:
        return {
            "is_monitoring": self.is_monitoring,
            "monitored_portals_count": len(self.portals),
            "portals": [
                {
                    "id": p["id"],
                    "name": p["name"],
                    "url": p["url"],
                    "last_checked": self.last_checked.get(p["id"], "Pending Initial Check"),
                    "status": "ONLINE_MONITORED" if p["id"] in self.portal_checksums else "CONNECTING"
                } for p in self.portals
            ],
            "detected_live_notices_count": len(self.detected_live_notices),
            "recent_live_notices": self.detected_live_notices[:5]
        }

global_live_portal_monitor = LivePortalMonitor()
