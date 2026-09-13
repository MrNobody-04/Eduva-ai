from typing import Dict, List, Any

# Nepal Real-Time Climate Hazards, Global Warming Impact Telemetry & Sustainable Actions
CLIMATE_DISASTER_DATA = {
    "summary": {
        "active_hazard_alerts": 3,
        "avg_nepal_temp_anomaly": "+1.2°C above historical baseline",
        "glacier_retreat_rate": "38 meters/year in Everest & Annapurna basins",
        "overall_risk_level": "MODERATE_ELEVATED"
    },
    "realtime_hazards": [
        {
            "id": "glof_tsho_rolpa",
            "hazard_type": "Glacial Lake Outburst Flood (GLOF) Watch",
            "location": "Tsho Rolpa Glacial Lake, Dolakha (Rolwaling Valley)",
            "severity": "HIGH",
            "water_level": "Elevated (3.2m above seasonal average)",
            "impact_area": "Tamakoshi River Basin & downstream villages",
            "cause": "Rapid Himalayan glacier melt triggered by rising global temperatures.",
            "advisory": "Early warning sirens active. Riverbank settlements advised to monitor live siren stations.",
            "status": "WATCH_ACTIVE"
        },
        {
            "id": "landslide_mugling",
            "hazard_type": "Monsoon Landslide & Rockfall Threat",
            "location": "Narayanghat-Mugling Highway (Sections 18km - 24km)",
            "severity": "CRITICAL",
            "rainfall_24h": "94.5 mm",
            "impact_area": "Major arterial transit route connecting Kathmandu & Pokhara to Terai",
            "cause": "Excess rainfall saturating slope stability exacerbated by erratic precipitation cycles.",
            "advisory": "One-way traffic operated with clearance excavators on standby. Avoid nighttime travel.",
            "status": "WARNING_OPERATIONAL"
        },
        {
            "id": "air_pollution_ktm",
            "hazard_type": "Urban Air Quality Index & Smog Inversion",
            "location": "Kathmandu Valley (Ratnapark, Pulchowk, Bhaktapur)",
            "severity": "MODERATE",
            "aqi_pm25": "148 AQI (Unhealthy for Sensitive Groups)",
            "impact_area": "Valley basin trapping particulate matter and vehicular emissions",
            "cause": "Thermal inversion layer preventing dispersion of fossil fuel and brick kiln emissions.",
            "advisory": "Students with asthma or allergies advised to wear N95 masks during morning college transit.",
            "status": "MONITORED"
        },
        {
            "id": "koshi_flood_basin",
            "hazard_type": "River Basin Discharge Anomaly",
            "location": "Sapta Koshi River (Chatara Gauge Station)",
            "severity": "ELEVATED",
            "water_discharge": "185,000 cusecs (Watch Threshold: 200,000)",
            "impact_area": "Sunsari, Saptari, and Bihar border plains",
            "cause": "Heavy precipitation in eastern Himalayan catchments.",
            "advisory": "Koshi Barrage gates opened to safe configuration. Flood wardens stationed.",
            "status": "STABLE_WATCH"
        }
    ],
    "global_warming_impacts": [
        {
            "title": "Himalayan Glacier Depletion",
            "description": "Nepal's glaciers have lost over 25% of their ice volume over the last 30 years, threatening long-term drinking water and hydropower security.",
            "trend": "+0.06°C per decade in mountain elevations"
        },
        {
            "title": "Erratic Monsoon Precipitation",
            "description": "Shifts from steady monsoon rains to intense, concentrated cloudbursts triggering rapid flash floods and slope failures.",
            "trend": "40% increase in short-duration extreme rainfall events"
        },
        {
            "title": "Agricultural Crop Blight & Unseasonal Frost",
            "description": "Rising temperatures shift pest zones upward into mountain valleys, impacting rice and apple yields in Mustang and Jumla.",
            "trend": "Mustang apple orchards migrating 300m higher in elevation"
        }
    ],
    "student_lifestyle_actions": [
        {
            "action": "Electric & Public Campus Commute",
            "impact": "Reduces personal transport emissions by ~75% compared to petrol motorbikes.",
            "tip": "Utilize electric Sajha buses or carpool with campus peers."
        },
        {
            "action": "Single-Use Plastic Ban on Campus",
            "impact": "Cuts non-biodegradable landfill waste clogging valley drainage channels.",
            "tip": "Carry refillable steel water bottles and reusable lunch containers."
        },
        {
            "action": "Tree Plantation & Watershed Protection",
            "impact": "Deep root vegetation stabilizes slopes and prevents roadside mudslides.",
            "tip": "Join community youth afforestation drives in surrounding community forests."
        },
        {
            "action": "Energy Efficiency & Rooftop Solar",
            "impact": "Decreases peak fossil grid load during winter peak hours.",
            "tip": "Power down laboratory electronics and advocate for campus solar rooftop panels."
        }
    ]
}

def get_climate_disaster_data():
    return CLIMATE_DISASTER_DATA
