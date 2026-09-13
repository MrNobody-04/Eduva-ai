import httpx
from typing import Dict, Any, Optional
from engine.event_bus import EventBus, EduvaEvent

# Comprehensive coordinates for Nepal cities & major student hubs
CITY_COORDINATES = {
    "Kathmandu": {"lat": 27.7172, "lon": 85.3240, "province": "Bagmati"},
    "Lalitpur": {"lat": 27.6644, "lon": 85.3188, "province": "Bagmati"},
    "Bhaktapur": {"lat": 27.6710, "lon": 85.4298, "province": "Bagmati"},
    "Pokhara": {"lat": 28.2096, "lon": 83.9856, "province": "Gandaki"},
    "Biratnagar": {"lat": 26.4525, "lon": 87.2718, "province": "Koshi"},
    "Chitwan": {"lat": 27.5291, "lon": 84.3542, "province": "Bagmati"},
    "Butwal": {"lat": 27.7006, "lon": 83.4484, "province": "Lumbini"},
    "Dharan": {"lat": 26.8124, "lon": 87.2834, "province": "Koshi"},
    "Nepalgunj": {"lat": 28.0500, "lon": 81.6167, "province": "Lumbini"},
    "Dhangadhi": {"lat": 28.6852, "lon": 80.6078, "province": "Sudurpashchim"},
    "Janakpur": {"lat": 26.7288, "lon": 85.9244, "province": "Madhesh"}
}

class SafetyAgent:
    def __init__(self, event_bus: EventBus):
        self.name = "SafetyAgent"
        self.event_bus = event_bus
        self.cached_telemetry: Dict[str, Any] = {}

    async def fetch_city_telemetry(self, city: str = "Kathmandu") -> Dict[str, Any]:
        matched_city = "Kathmandu"
        for c in CITY_COORDINATES:
            if c.lower() in city.lower():
                matched_city = c
                break
                
        coords = CITY_COORDINATES[matched_city]
        url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto"
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    temp = current.get("temperature_2m", 24.5)
                    precip = current.get("precipitation", 0.0)
                    wind = current.get("wind_speed_10m", 6.2)
                    
                    if precip > 20.0:
                        risk_level = "HIGH"
                        advisory = f"Heavy Rain in {matched_city}: Transport & coaching delays likely."
                    elif precip > 3.0:
                        risk_level = "MODERATE"
                        advisory = f"Light rain in {matched_city}. Keep umbrella for campus commute."
                    else:
                        risk_level = "OPTIMAL"
                        advisory = f"Clear pleasant weather in {matched_city} for campus classes."

                    telemetry = {
                        "city": matched_city,
                        "province": coords["province"],
                        "temperature": temp,
                        "precipitation_mm": precip,
                        "wind_speed_kmh": wind,
                        "risk_level": risk_level,
                        "advisory": advisory,
                        "status": "ONLINE_LIVE"
                    }
                    self.cached_telemetry[matched_city] = telemetry
                    return telemetry
        except Exception as e:
            print(f"Weather live fetch notice: {e}")

        # Fallback
        fallback = {
            "city": matched_city,
            "province": coords["province"],
            "temperature": 23.5,
            "precipitation_mm": 0.8,
            "wind_speed_kmh": 5.2,
            "risk_level": "OPTIMAL",
            "advisory": f"Normal academic conditions in {matched_city}.",
            "status": "ONLINE_FALLBACK"
        }
        self.cached_telemetry[matched_city] = fallback
        return fallback

    def get_status(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "state": "RUNNING",
            "monitored_cities": list(CITY_COORDINATES.keys()),
            "last_telemetry": self.cached_telemetry.get("Kathmandu", {})
        }
