"""
EDUVA AI — Autonomous Agent Health Registry & Fault-Tolerant Circuit Breaker
Tracks 24/7 autonomous lifecycle, telemetry, execution history, and provides
isolated circuit breakers with exponential backoff for resilient agent loops.
"""

import datetime
import json
import random
import time
from typing import Dict, List, Any, Optional
from engine.db import global_db

class CircuitBreakerState:
    CLOSED = "HEALTHY"        # Normal execution
    HALF_OPEN = "HALF_OPEN"    # Probe execution after backoff
    OPEN = "CIRCUIT_OPEN"      # Failing, backoff active


class AgentHealthRegistry:
    def __init__(self, db=global_db):
        self.db = db
        # In-memory registry cache
        self.agents: Dict[str, Dict[str, Any]] = {}
        self._init_default_agents()
        self.load_snapshot_from_db()

    def _init_default_agents(self):
        default_agents = [
            ("ResearchAgent", "Autonomous Research & Discovery Agent", 300),
            ("VerificationAgent", "Multi-Source Corroboration & Verification Agent", 120),
            ("AdmissionAgent", "Program & Deadline Tracking Agent", 900),
            ("ScholarshipAgent", "Scholarship Auditing & Matching Agent", 900),
            ("SafetyAgent", "Climate, Disaster & Urban Safety Agent", 600),
            ("NotificationAgent", "Real-Time Push & Alert Draining Agent", 30),
            ("NewsAgent", "Education Notice & Breaking Social News Agent", 300),
            ("LivePortalMonitor", "Official University Portal Checksum Monitor", 60),
            ("PipelineRunner", "Autonomous Information Pipeline Orchestrator", 60)
        ]
        now_iso = datetime.datetime.now().isoformat()
        for aid, aname, interval in default_agents:
            if aid not in self.agents:
                self.agents[aid] = {
                    "agent_id": aid,
                    "agent_name": aname,
                    "interval_sec": interval,
                    "status": "STANDBY",
                    "circuit_state": CircuitBreakerState.CLOSED,
                    "last_started_at": now_iso,
                    "last_heartbeat_at": now_iso,
                    "last_success_at": None,
                    "last_failure_at": None,
                    "current_task": "Initialized, waiting for cycle trigger",
                    "tasks_completed": 0,
                    "tasks_failed": 0,
                    "consecutive_failures": 0,
                    "last_error": None,
                    "last_verified_update": None,
                    "next_run_at": (datetime.datetime.now() + datetime.timedelta(seconds=interval)).isoformat(),
                    "circuit_opened_at": None,
                    "failure_threshold": 3,
                    "base_backoff_sec": 5.0,
                    "max_backoff_sec": 300.0,
                    "source_history": []
                }

    def register_agent(self, agent_id: str, agent_name: str, interval_sec: int = 300, failure_threshold: int = 3):
        now_iso = datetime.datetime.now().isoformat()
        if agent_id not in self.agents:
            self.agents[agent_id] = {
                "agent_id": agent_id,
                "agent_name": agent_name,
                "interval_sec": interval_sec,
                "status": "STANDBY",
                "circuit_state": CircuitBreakerState.CLOSED,
                "last_started_at": now_iso,
                "last_heartbeat_at": now_iso,
                "last_success_at": None,
                "last_failure_at": None,
                "current_task": "Idle",
                "tasks_completed": 0,
                "tasks_failed": 0,
                "consecutive_failures": 0,
                "last_error": None,
                "last_verified_update": None,
                "next_run_at": (datetime.datetime.now() + datetime.timedelta(seconds=interval_sec)).isoformat(),
                "circuit_opened_at": None,
                "failure_threshold": failure_threshold,
                "base_backoff_sec": 5.0,
                "max_backoff_sec": 300.0,
                "source_history": []
            }
        self.persist_agent_to_db(agent_id)

    def can_execute(self, agent_id: str) -> bool:
        """
        Circuit breaker gate check.
        Returns True if agent is allowed to execute.
        If CIRCUIT_OPEN, checks if exponential backoff delay has expired.
        If expired, transitions to HALF_OPEN to allow a single probe execution.
        """
        agent = self.agents.get(agent_id)
        if not agent:
            return True

        if agent["circuit_state"] == CircuitBreakerState.OPEN:
            opened_at = agent.get("circuit_opened_at")
            if not opened_at:
                agent["circuit_state"] = CircuitBreakerState.HALF_OPEN
                agent["status"] = "HALF_OPEN"
                return True

            # Calculate backoff with jitter
            failures = max(1, agent["consecutive_failures"])
            delay = min(
                agent["base_backoff_sec"] * (2 ** (failures - 1)),
                agent["max_backoff_sec"]
            )
            elapsed = time.time() - opened_at
            if elapsed >= delay:
                # Transition to HALF_OPEN for probe trial
                agent["circuit_state"] = CircuitBreakerState.HALF_OPEN
                agent["status"] = "HALF_OPEN"
                self.record_execution_event(agent_id, "CIRCUIT_HALF_OPEN", {
                    "reason": f"Backoff period of {delay:.1f}s expired. Testing recovery with probe task.",
                    "elapsed_sec": elapsed
                })
                return True
            else:
                # Circuit remains OPEN; backoff still active
                return False

        return True

    def record_heartbeat(self, agent_id: str, task: Optional[str] = None, status: str = "RUNNING"):
        now_iso = datetime.datetime.now().isoformat()
        if agent_id not in self.agents:
            self.register_agent(agent_id, agent_id)

        agent = self.agents[agent_id]
        agent["last_heartbeat_at"] = now_iso
        if task:
            agent["current_task"] = task
        if agent["circuit_state"] != CircuitBreakerState.OPEN:
            agent["status"] = status

        # Lightweight DB update on heartbeat
        self.persist_agent_to_db(agent_id)

    def record_success(
        self,
        agent_id: str,
        task: Optional[str] = None,
        verified_update: Optional[str] = None,
        source_name: Optional[str] = None
    ):
        now_iso = datetime.datetime.now().isoformat()
        if agent_id not in self.agents:
            self.register_agent(agent_id, agent_id)

        agent = self.agents[agent_id]
        agent["last_success_at"] = now_iso
        agent["last_heartbeat_at"] = now_iso
        agent["tasks_completed"] += 1
        agent["consecutive_failures"] = 0
        agent["circuit_state"] = CircuitBreakerState.CLOSED
        agent["status"] = "HEALTHY"
        agent["circuit_opened_at"] = None

        if task:
            agent["current_task"] = f"Completed: {task}"
        if verified_update:
            agent["last_verified_update"] = verified_update
        if source_name:
            history = agent.get("source_history", [])
            history.insert(0, {"source": source_name, "timestamp": now_iso, "status": "VERIFIED"})
            agent["source_history"] = history[:10]

        # Schedule next run
        interval = agent.get("interval_sec", 300)
        agent["next_run_at"] = (datetime.datetime.now() + datetime.timedelta(seconds=interval)).isoformat()

        self.persist_agent_to_db(agent_id)
        self.record_execution_event(agent_id, "TASK_SUCCESS", {
            "task": task or agent.get("current_task"),
            "verified_update": verified_update,
            "tasks_completed": agent["tasks_completed"]
        })

    def record_failure(self, agent_id: str, task: Optional[str] = None, error_msg: str = ""):
        now_iso = datetime.datetime.now().isoformat()
        if agent_id not in self.agents:
            self.register_agent(agent_id, agent_id)

        agent = self.agents[agent_id]
        agent["last_failure_at"] = now_iso
        agent["last_heartbeat_at"] = now_iso
        agent["tasks_failed"] += 1
        agent["consecutive_failures"] += 1
        agent["last_error"] = str(error_msg)[:300]
        if task:
            agent["current_task"] = f"Failed on: {task}"

        # Check circuit trip condition
        if agent["consecutive_failures"] >= agent["failure_threshold"]:
            agent["circuit_state"] = CircuitBreakerState.OPEN
            agent["status"] = "CIRCUIT_OPEN"
            agent["circuit_opened_at"] = time.time()
            failures = agent["consecutive_failures"]
            backoff_sec = min(agent["base_backoff_sec"] * (2 ** (failures - 1)), agent["max_backoff_sec"])
            agent["next_run_at"] = (datetime.datetime.now() + datetime.timedelta(seconds=backoff_sec)).isoformat()
            
            self.record_execution_event(agent_id, "CIRCUIT_TRIPPED", {
                "consecutive_failures": failures,
                "error": agent["last_error"],
                "backoff_seconds": backoff_sec
            })
        else:
            agent["status"] = "DEGRADED"

        self.persist_agent_to_db(agent_id)
        self.record_execution_event(agent_id, "TASK_FAILURE", {
            "task": task or agent.get("current_task"),
            "error": agent["last_error"],
            "consecutive_failures": agent["consecutive_failures"]
        })

    def get_agent_telemetry(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Returns the in-memory and persisted telemetry record for an agent."""
        return self.agents.get(agent_id)

    def persist_agent_to_db(self, agent_id: str):
        agent = self.agents.get(agent_id)
        if not agent:
            return

        def write_metric(conn):
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO agent_health_metrics (
                    agent_id, agent_name, status, last_started_at, last_heartbeat_at,
                    last_success_at, last_failure_at, current_task, tasks_completed,
                    tasks_failed, consecutive_failures, last_error, last_verified_update,
                    next_run_at, source_history_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                agent["agent_id"],
                agent["agent_name"],
                agent["status"],
                agent.get("last_started_at"),
                agent.get("last_heartbeat_at"),
                agent.get("last_success_at"),
                agent.get("last_failure_at"),
                agent.get("current_task"),
                agent.get("tasks_completed", 0),
                agent.get("tasks_failed", 0),
                agent.get("consecutive_failures", 0),
                agent.get("last_error"),
                agent.get("last_verified_update"),
                agent.get("next_run_at"),
                json.dumps(agent.get("source_history", []))
            ))
        try:
            self.db._execute_write(write_metric)
        except Exception as e:
            # Avoid crashing in-flight agent loop on telemetry persistence error
            pass

    def record_execution_event(self, agent_id: str, event_type: str, details: Dict[str, Any]):
        def write_event(conn):
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO agent_execution_history (agent_id, event_type, details_json)
                VALUES (?, ?, ?)
            """, (agent_id, event_type, json.dumps(details)))
        try:
            self.db._execute_write(write_event)
        except Exception:
            pass

    def load_snapshot_from_db(self):
        try:
            with self.db._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM agent_health_metrics")
                rows = cursor.fetchall()
                for row in rows:
                    d = dict(row)
                    aid = d["agent_id"]
                    if aid in self.agents:
                        # Restore persistent counters
                        self.agents[aid]["tasks_completed"] = d.get("tasks_completed", 0)
                        self.agents[aid]["tasks_failed"] = d.get("tasks_failed", 0)
                        self.agents[aid]["last_success_at"] = d.get("last_success_at")
                        self.agents[aid]["last_verified_update"] = d.get("last_verified_update")
                        try:
                            self.agents[aid]["source_history"] = json.loads(d.get("source_history_json") or "[]")
                        except Exception:
                            pass
        except Exception:
            pass

    def get_all_telemetry(self) -> List[Dict[str, Any]]:
        telemetry = []
        for aid, data in self.agents.items():
            telemetry.append({
                "agent_id": data["agent_id"],
                "agent_name": data["agent_name"],
                "status": data["status"],
                "circuit_state": data.get("circuit_state", CircuitBreakerState.CLOSED),
                "last_started_at": data.get("last_started_at"),
                "last_heartbeat_at": data.get("last_heartbeat_at"),
                "last_success_at": data.get("last_success_at"),
                "last_failure_at": data.get("last_failure_at"),
                "current_task": data.get("current_task"),
                "tasks_completed": data.get("tasks_completed", 0),
                "tasks_failed": data.get("tasks_failed", 0),
                "consecutive_failures": data.get("consecutive_failures", 0),
                "last_error": data.get("last_error"),
                "last_verified_update": data.get("last_verified_update"),
                "next_run_at": data.get("next_run_at"),
                "source_history": data.get("source_history", [])
            })
        return telemetry

    def get_agent_health(self, agent_id: str) -> Optional[Dict[str, Any]]:
        return self.agents.get(agent_id)

    def get_execution_history(self, agent_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        with self.db._get_connection() as conn:
            cursor = conn.cursor()
            if agent_id:
                cursor.execute("""
                    SELECT * FROM agent_execution_history 
                    WHERE agent_id = ? 
                    ORDER BY id DESC LIMIT ?
                """, (agent_id, limit))
            else:
                cursor.execute("""
                    SELECT * FROM agent_execution_history 
                    ORDER BY id DESC LIMIT ?
                """, (limit,))
            rows = cursor.fetchall()
            history = []
            for r in rows:
                d = dict(r)
                if isinstance(d.get("details_json"), str):
                    try:
                        d["details"] = json.loads(d["details_json"])
                    except Exception:
                        d["details"] = d["details_json"]
                history.append(d)
            return history


# Global Singleton Registry
global_agent_registry = AgentHealthRegistry()
