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
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
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

            conn.commit()

    # --- News Feed Operations ---
    def insert_news(self, id: str, source_name: str, source_handle: str, title: str, content: str, category: str, is_breaking: bool = False, image_url: str = ""):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT OR REPLACE INTO news_feed (id, source_name, source_handle, title, content, category, is_breaking, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id, source_name, source_handle, title, content, category, 1 if is_breaking else 0, image_url))
            conn.commit()

    def get_news_feed(self, limit: int = 30) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM news_feed ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def like_news(self, news_id: str):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE news_feed SET likes_count = likes_count + 1 WHERE id = ?", (news_id,))
            conn.commit()

    # --- Chat History Operations ---
    def log_chat(self, session_id: str, sender: str, message: str, lang: str = "auto", is_voice: bool = False):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO chat_messages (session_id, sender, message, language_detected, audio_transcript)
            VALUES (?, ?, ?, ?, ?)
            """, (session_id, sender, message, lang, 1 if is_voice else 0))
            conn.commit()

    def get_chat_history(self, session_id: str = "default_session", limit: int = 40) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC LIMIT ?", (session_id, limit))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

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
                    "entrance_scorecards": scorecards_count
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

# Global DB Instance
global_db = LivingDatabase()

