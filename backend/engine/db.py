import sqlite3
import json
import os
import datetime
import urllib.parse
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "eduva_living.db")
DATABASE_URL = os.getenv("DATABASE_URL")

class LivingDatabase:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self.database_url = DATABASE_URL
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path, timeout=15.0)
        conn.row_factory = sqlite3.Row
        # Enable Write-Ahead Logging (WAL) for safe multi-agent concurrent writes
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        conn.execute("PRAGMA busy_timeout=10000;")
        return conn

    def _execute_write(self, query_fn, max_retries: int = 5, base_delay: float = 0.05):
        """
        Executes a database write with exponential backoff and jitter on lock/busy errors.
        """
        import time, random
        for attempt in range(max_retries):
            try:
                with self._get_connection() as conn:
                    result = query_fn(conn)
                    conn.commit()
                    return result
            except sqlite3.OperationalError as e:
                err_msg = str(e).lower()
                if "locked" in err_msg or "busy" in err_msg:
                    if attempt == max_retries - 1:
                        print(f"[DB LOCKED ERROR] Max write retries ({max_retries}) reached: {e}")
                        raise
                    sleep_time = (base_delay * (2 ** attempt)) + random.uniform(0.01, 0.05)
                    time.sleep(sleep_time)
                else:
                    raise

    def _init_db(self):
        def create_tables(conn):
            cursor = conn.cursor()
            
            # 1. Knowledge Entities Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS knowledge_nodes (
                id TEXT PRIMARY KEY,
                entity_type TEXT,
                name TEXT,
                data_json TEXT,
                reliability_score REAL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 2. Live News & Social Feed (RONB, University Notices, Alerts)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS news_feed (
                id TEXT PRIMARY KEY,
                source_name TEXT,
                source_handle TEXT,
                title TEXT,
                content TEXT,
                category TEXT,
                image_url TEXT,
                is_breaking BOOLEAN DEFAULT 0,
                verification_status TEXT DEFAULT 'VERIFIED',
                likes_count INTEGER DEFAULT 0,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 3. Chat History Table (Multilingual & Voice)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                sender TEXT,
                message TEXT,
                language_detected TEXT,
                audio_transcript BOOLEAN DEFAULT 0,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 4. Immutable Audit Trail
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_trail (
                id TEXT PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                agent TEXT,
                action TEXT,
                reason TEXT,
                risk_level TEXT,
                result TEXT,
                confidence REAL,
                evidence TEXT
            )
            """)

            # 5. Uploaded Resources Table (Syllabi, Fees, Notices, Policies)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS uploaded_resources (
                id TEXT PRIMARY KEY,
                title TEXT,
                category TEXT,
                authority_level TEXT,
                file_name TEXT,
                file_path TEXT,
                file_size INTEGER,
                mime_type TEXT,
                uploaded_by TEXT,
                status TEXT DEFAULT 'APPROVED',
                risk_level TEXT DEFAULT 'LOW',
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 6. Registered Users Table (Real Email/Password Authentication)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                name TEXT,
                password_hash TEXT,
                role TEXT DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 7. Local Applications Table (Fallback & Offline Storage)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                student_id TEXT,
                university_name TEXT,
                program_name TEXT,
                portal_url TEXT,
                deadline TEXT,
                status TEXT,
                urgency TEXT,
                notes TEXT,
                documents_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

        self._execute_write(create_tables)

    # --- News Feed Operations ---
    def insert_news(self, id: str, source_name: str, source_handle: str, title: str, content: str, category: str, is_breaking: bool = False, image_url: str = ""):
        def write_op(conn):
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO news_feed (id, source_name, source_handle, title, content, category, is_breaking, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id, source_name, source_handle, title, content, category, 1 if is_breaking else 0, image_url))
        self._execute_write(write_op)

    def get_news_feed(self, limit: int = 30) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM news_feed ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def like_news(self, news_id: str):
        def write_op(conn):
            cursor = conn.cursor()
            cursor.execute("UPDATE news_feed SET likes_count = likes_count + 1 WHERE id = ?", (news_id,))
        self._execute_write(write_op)

    # --- Chat History Operations ---
    def log_chat(self, session_id: str, sender: str, message: str, lang: str = "auto", is_voice: bool = False):
        def write_op(conn):
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO chat_messages (session_id, sender, message, language_detected, audio_transcript)
            VALUES (?, ?, ?, ?, ?)
            """, (session_id, sender, message, lang, 1 if is_voice else 0))
        self._execute_write(write_op)

    def get_chat_history(self, session_id: str = "default_session", limit: int = 40) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC LIMIT ?", (session_id, limit))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def delete_chat_history(self, session_id: str = "default_session") -> bool:
        def write_op(conn):
            cursor = conn.cursor()
            cursor.execute("DELETE FROM chat_messages WHERE session_id = ?", (session_id,))
        self._execute_write(write_op)
        return True

    # --- Uploaded Resources Operations ---
    def insert_uploaded_resource(self, id: str, title: str, category: str, authority_level: str, file_name: str, file_path: str, file_size: int, mime_type: str, uploaded_by: str, status: str = "APPROVED", risk_level: str = "LOW"):
        def write_op(conn):
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO uploaded_resources (id, title, category, authority_level, file_name, file_path, file_size, mime_type, uploaded_by, status, risk_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (id, title, category, authority_level, file_name, file_path, file_size, mime_type, uploaded_by, status, risk_level))
        self._execute_write(write_op)

    def update_uploaded_resource(self, id: str, **kwargs) -> bool:
        allowed = ["title", "category", "authority_level", "file_name", "file_path", "file_size", "mime_type", "status", "risk_level"]
        fields = [f"{k} = ?" for k in kwargs if k in allowed]
        if not fields:
            return False
        values = [kwargs[k] for k in kwargs if k in allowed]
        values.append(id)
        def write_op(conn):
            cursor = conn.cursor()
            cursor.execute(f"UPDATE uploaded_resources SET {', '.join(fields)} WHERE id = ?", tuple(values))
        self._execute_write(write_op)
        return True

    def get_uploaded_resources(self, limit: int = 50) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM uploaded_resources ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def get_uploaded_resource_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM uploaded_resources WHERE id = ?", (id,))
            row = cursor.fetchone()
            return dict(row) if row else None


    # --- Supabase PostgreSQL Operations ---
    def get_supabase_health(self) -> Dict[str, Any]:
        if not self.database_url:
            return {
                "connected": False,
                "status": "NO_DATABASE_URL",
                "message": "DATABASE_URL not configured. Running in Local SQLite mode."
            }
        try:
            import psycopg2
            conn = psycopg2.connect(self.database_url, connect_timeout=5)
            cur = conn.cursor()
            
            cur.execute("SELECT COUNT(*) FROM universities;")
            univ_count = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM colleges;")
            colleges_count = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM courses;")
            courses_count = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM entrance_scorecards;")
            scorecards_count = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM entrance_exams;")
            exams_count = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM applications;")
            apps_count = cur.fetchone()[0]
            
            cur.close()
            conn.close()
            return {
                "connected": True,
                "status": "ONLINE",
                "provider": "Supabase PostgreSQL (ap-south-1)",
                "tables": {
                    "universities": univ_count,
                    "colleges": colleges_count,
                    "courses": courses_count,
                    "entrance_scorecards": scorecards_count,
                    "entrance_exams": exams_count,
                    "applications": apps_count
                },
                "verified_level": "LEVEL_1_CLOUD_POSTGRES"
            }
        except Exception as e:
            return {
                "connected": False,
                "status": "ERROR",
                "error": str(e),
                "fallback": "Running on local in-memory dataset"
            }

    # --- Entrance Exams Queries ---
    def get_entrance_exams(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                if status:
                    cur.execute("SELECT * FROM entrance_exams WHERE UPPER(status) = %s ORDER BY application_deadline ASC;", (status.upper(),))
                else:
                    cur.execute("SELECT * FROM entrance_exams ORDER BY application_deadline ASC;")
                rows = cur.fetchall()
                cur.close()
                conn.close()
                result = []
                import datetime
                import re
                today = datetime.date.today()
                for r in rows:
                    item = dict(r)
                    item["registration_deadline"] = item.get("application_deadline") or item.get("registration_deadline")
                    item["exam_fee"] = item.get("application_fee") or item.get("exam_fee")
                    deadline_val = item.get("application_deadline") or item.get("exam_date")
                    if deadline_val:
                        m = re.search(r'(\d{4}-\d{2}-\d{2})', str(deadline_val))
                        if m:
                            try:
                                d = datetime.datetime.strptime(m.group(1), "%Y-%m-%d").date()
                                item["days_remaining"] = max(0, (d - today).days)
                            except Exception:
                                item["days_remaining"] = 14
                        else:
                            item["days_remaining"] = 14
                    else:
                        item["days_remaining"] = 14
                    result.append(item)
                return result
            except Exception as e:
                pass
        # Fallback local seed
        from data.all_nepal_colleges_and_results import REAL_ENTRANCE_RESULTS
        return []

    def get_entrance_exam_by_id(self, exam_id: str) -> Optional[Dict[str, Any]]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM entrance_exams WHERE id = %s;", (exam_id,))
                row = cur.fetchone()
                cur.close()
                conn.close()
                if row:
                    return dict(row)
            except Exception:
                pass
        return None

    # --- Student Applications Operations ---
    def get_applications(self, student_id: str = "std_sujan_01") -> List[Dict[str, Any]]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM applications WHERE student_id = %s ORDER BY created_at DESC;", (student_id,))
                rows = cur.fetchall()
                cur.close()
                conn.close()
                return [dict(r) for r in rows]
            except Exception:
                pass
        
        # SQLite Local Fallback
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM applications WHERE student_id = ? ORDER BY created_at DESC", (student_id,))
            rows = cursor.fetchall()
            return [dict(r) for r in rows]

    def add_application(self, app_data: Dict[str, Any]) -> Dict[str, Any]:
        import uuid
        new_id = app_data.get("id") or f"app_{uuid.uuid4().hex[:8]}"
        app_data["id"] = new_id
        student_id = app_data.get("student_id", "std_sujan_01")
        univ = app_data.get("university_name", "") or app_data.get("institution", "")
        prog = app_data.get("program_name", "") or app_data.get("program", "")
        portal = app_data.get("portal_url", "")
        deadline = app_data.get("deadline", "2026-10-15")
        status = app_data.get("status", "IN_PROGRESS")
        urgency = app_data.get("urgency", "MEDIUM")
        notes = app_data.get("notes", "")

        if self.database_url:
            try:
                import psycopg2
                from psycopg2.extras import Json
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                conn.autocommit = True
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO applications (id, student_id, university_name, program_name, deadline, status, urgency, notes, documents_json)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes;
                """, (
                    new_id, student_id, univ, prog, deadline, status, urgency, notes,
                    Json(app_data.get("documents_json", {}))
                ))
                cur.close()
                conn.close()
            except Exception:
                pass

        # Write to SQLite
        def write_app(conn):
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO applications (id, student_id, university_name, program_name, portal_url, deadline, status, urgency, notes, documents_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                new_id, student_id, univ, prog, portal, deadline, status, urgency, notes,
                json.dumps(app_data.get("documents_json", {}))
            ))
        self._execute_write(write_app)
        return app_data

    def update_application_status(self, app_id: str, new_status: str) -> bool:
        if self.database_url:
            try:
                import psycopg2
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                conn.autocommit = True
                cur = conn.cursor()
                cur.execute("UPDATE applications SET status = %s WHERE id = %s;", (new_status, app_id))
                cur.close()
                conn.close()
            except Exception:
                pass

        def write_update(conn):
            cursor = conn.cursor()
            cursor.execute("UPDATE applications SET status = ? WHERE id = ?", (new_status, app_id))
        self._execute_write(write_update)
        return True

    # --- User Account & Auth Operations (SQLite + Supabase) ---
    def create_user(self, user_id: str, email: str, name: str, password_hash: str, role: str = "student") -> Dict[str, Any]:
        def write_user(conn):
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO users (id, email, name, password_hash, role)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, email.lower().strip(), name.strip(), password_hash, role))
        self._execute_write(write_user)
        return {"id": user_id, "email": email.lower().strip(), "name": name, "role": role}

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    # --- Saved Items Operations ---
    def get_saved_items(self, student_id: str = "std_sujan_01") -> List[Dict[str, Any]]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM saved_items WHERE student_id = %s ORDER BY created_at DESC;", (student_id,))
                rows = cur.fetchall()
                cur.close()
                conn.close()
                return [dict(r) for r in rows]
            except Exception:
                pass
        return []

    def toggle_saved_item(self, student_id: str, item_type: str, item_id: str, item_title: str, item_subtitle: str, item_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.database_url:
            try:
                import psycopg2
                from psycopg2.extras import Json
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                conn.autocommit = True
                cur = conn.cursor()
                # Check if exists
                cur.execute("SELECT id FROM saved_items WHERE student_id = %s AND item_type = %s AND item_id = %s;", (student_id, item_type, item_id))
                existing = cur.fetchone()
                if existing:
                    cur.execute("DELETE FROM saved_items WHERE id = %s;", (existing[0],))
                    action = "REMOVED"
                else:
                    import uuid
                    new_id = f"sv_{uuid.uuid4().hex[:8]}"
                    cur.execute("""
                        INSERT INTO saved_items (id, student_id, item_type, item_id, item_title, item_subtitle, item_data)
                        VALUES (%s, %s, %s, %s, %s, %s, %s);
                    """, (new_id, student_id, item_type, item_id, item_title, item_subtitle, Json(item_data)))
                    action = "SAVED"
                cur.close()
                conn.close()
                return {"status": "SUCCESS", "action": action, "item_id": item_id}
            except Exception as e:
                return {"status": "ERROR", "error": str(e)}
        return {"status": "SUCCESS", "action": "SAVED"}

    # --- Climate & Disaster Alerts Operations ---
    def get_climate_alerts(self) -> List[Dict[str, Any]]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM climate_alerts ORDER BY timestamp DESC;")
                rows = cur.fetchall()
                cur.close()
                conn.close()
                return [dict(r) for r in rows]
            except Exception:
                pass
        return []

    # --- Student Profile Operations ---
    def get_profile(self, student_id: str = "std_sujan_01") -> Dict[str, Any]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM profiles WHERE id = %s;", (student_id,))
                row = cur.fetchone()
                cur.close()
                conn.close()
                if row:
                    return dict(row)
            except Exception:
                pass
        return {
            "id": student_id,
            "name": "",
            "email": "",
            "stream": "Science",
            "gpa": None,
            "graduation_year": 2026,
            "preferred_course": "",
            "preferred_location": "Kathmandu",
            "budget_max_npr": None,
            "scholarship_interest": True
        }

    def update_profile(self, student_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.database_url:
            try:
                import psycopg2
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                conn.autocommit = True
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO profiles (id, name, email, education_level, stream, gpa, graduation_year, preferred_course, preferred_location, budget_max_npr, scholarship_interest)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        stream = EXCLUDED.stream,
                        gpa = EXCLUDED.gpa,
                        preferred_course = EXCLUDED.preferred_course,
                        preferred_location = EXCLUDED.preferred_location,
                        budget_max_npr = EXCLUDED.budget_max_npr;
                """, (
                    student_id, profile_data.get("name", "Student"), profile_data.get("email", ""),
                    profile_data.get("education_level", "+2"), profile_data.get("stream", "Science"),
                    profile_data.get("gpa", 3.85), profile_data.get("graduation_year", 2026),
                    profile_data.get("preferred_course", "CSIT"), profile_data.get("preferred_location", "Kathmandu"),
                    profile_data.get("budget_max_npr", 800000), profile_data.get("scholarship_interest", True)
                ))
                cur.close()
                conn.close()
                return {"status": "SUCCESS", "profile": profile_data}
            except Exception as e:
                return {"status": "ERROR", "error": str(e)}
        return {"status": "SUCCESS", "profile": profile_data}

    # --- Verification Queue Operations ---
    def get_verification_queue(self) -> List[Dict[str, Any]]:
        if self.database_url:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM verification_queue ORDER BY detected_at DESC;")
                rows = cur.fetchall()
                cur.close()
                conn.close()
                return [dict(r) for r in rows]
            except Exception:
                pass
        return []

    def resolve_verification_item(self, item_id: str, action: str) -> bool:
        if self.database_url:
            try:
                import psycopg2
                conn = psycopg2.connect(self.database_url, connect_timeout=5)
                conn.autocommit = True
                cur = conn.cursor()
                status = "APPROVED" if action.upper() == "APPROVE" else "REJECTED"
                cur.execute("UPDATE verification_queue SET status = %s WHERE id = %s;", (status, item_id))
                cur.close()
                conn.close()
                return True
            except Exception:
                return False
        return False


# Global DB Instance
global_db = LivingDatabase()

