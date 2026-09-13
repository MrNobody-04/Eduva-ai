import datetime
from typing import Dict, List, Any
from engine.db import global_db

class NewsAgent:
    def __init__(self):
        self.name = "NewsAgent"
        self._seed_initial_posts()

    def _seed_initial_posts(self):
        # Initial authentic-style posts including Routine of Nepal Banda and Official Student Boards
        initial_posts = [
            {
                "id": "ronb_ioe_notice_01",
                "source_name": "Routine of Nepal Banda",
                "source_handle": "@routineofnepalbanda",
                "title": "🚨 TU IOE Entrance Exam Form Open!",
                "content": "Tribhuvan University, Institute of Engineering (IOE) Entrance Examination 2026 application form is now officially open! Deadline for form submission is September 28. Exam will be held from October 8. Spread the word to all +2 Science graduates! #IOE #EngineeringEntrance #Nepal",
                "category": "ENTRANCE_EXAM",
                "is_breaking": True,
                "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60"
            },
            {
                "id": "ronb_rain_weather_02",
                "source_name": "Routine of Nepal Banda",
                "source_handle": "@routineofnepalbanda",
                "title": "🌧️ Heavy Rainfall Alert in Kathmandu & Pokhara Valley",
                "content": "Department of Hydrology and Meteorology has forecasted moderate to heavy rainfall across Bagmati and Gandaki provinces today evening. Students travelling for evening coaching and campus classes are advised to carry raincoats/umbrellas and drive cautiously.",
                "category": "WEATHER_ALERT",
                "is_breaking": False,
                "image_url": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&auto=format&fit=crop&q=60"
            },
            {
                "id": "moest_scholarship_03",
                "source_name": "Ministry of Education (MOEST)",
                "source_handle": "@moest_nepal",
                "title": "🎓 National Engineering Quota & Merit Scholarship Announced",
                "content": "Government of Nepal announces 100% full tuition scholarships + monthly living stipends for top 100 entrance rank holders in IOE Pulchowk, Thapathali, WRC, and ERC campuses. Application portal opens Oct 1.",
                "category": "SCHOLARSHIP",
                "is_breaking": False,
                "image_url": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
            },
            {
                "id": "ku_ai_notice_04",
                "source_name": "Kathmandu University Updates",
                "source_handle": "@ku_updates",
                "title": "🤖 Kathmandu University launches B.Tech in Artificial Intelligence",
                "content": "KU School of Engineering has officially opened intake for the 4-year B.Tech in AI & Data Engineering program at Dhulikhel campus. KUCAT computer-based tests scheduled for Sept 25.",
                "category": "NEW_PROGRAM",
                "is_breaking": False,
                "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60"
            }
        ]

        for p in initial_posts:
            global_db.insert_news(
                id=p["id"],
                source_name=p["source_name"],
                source_handle=p["source_handle"],
                title=p["title"],
                content=p["content"],
                category=p["category"],
                is_breaking=p["is_breaking"],
                image_url=p["image_url"]
            )

    def get_feed(self, limit: int = 30) -> List[Dict[str, Any]]:
        return global_db.get_news_feed(limit)

    def like_post(self, post_id: str):
        global_db.like_news(post_id)

    def publish_breaking_post(self, title: str, content: str, source: str = "Routine of Nepal Banda", category: str = "BREAKING"):
        post_id = f"post_{int(datetime.datetime.now().timestamp()*1000)}"
        global_db.insert_news(
            id=post_id,
            source_name=source,
            source_handle="@routineofnepalbanda" if "Routine" in source else "@eduva_news",
            title=title,
            content=content,
            category=category,
            is_breaking=True
        )
        return post_id

# Global News Agent
global_news_agent = NewsAgent()
