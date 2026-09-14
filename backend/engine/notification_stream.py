"""
EDUVA AI — Real-time Push Notification Broadcaster
Streams live alerts and emergency notices over WebSockets (/ws/notifications)
to all connected students immediately upon verification.
"""

from typing import List, Dict, Any
from fastapi import WebSocket

class NotificationBroadcaster:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

global_notification_broadcaster = NotificationBroadcaster()
