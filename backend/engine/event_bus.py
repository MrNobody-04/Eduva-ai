import asyncio
import datetime
from typing import Callable, Dict, List, Any, Optional
from pydantic import BaseModel, Field

class EduvaEvent(BaseModel):
    id: str = Field(default_factory=lambda: f"evt_{int(datetime.datetime.now().timestamp()*1000)}")
    event_type: str
    timestamp: str = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())
    agent_source: str
    data: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = 1.0
    verification_status: str = "VERIFIED" # VERIFIED, REQUIRES_VERIFICATION, REJECTED
    source_id: Optional[str] = None
    affected_entities: List[str] = Field(default_factory=list)

class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[EduvaEvent], Any]]] = {}
        self._global_subscribers: List[Callable[[EduvaEvent], Any]] = []
        self._event_history: List[EduvaEvent] = []
        self._max_history = 200

    def subscribe(self, event_type: str, handler: Callable[[EduvaEvent], Any]):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)

    def subscribe_all(self, handler: Callable[[EduvaEvent], Any]):
        self._global_subscribers.append(handler)

    async def publish(self, event: EduvaEvent):
        # Store in event history
        self._event_history.append(event)
        if len(self._event_history) > self._max_history:
            self._event_history.pop(0)

        # Notify specific subscribers
        handlers = self._subscribers.get(event.event_type, [])
        tasks = []
        for handler in handlers:
            if asyncio.iscoroutinefunction(handler):
                tasks.append(handler(event))
            else:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Error in sync event handler for {event.event_type}: {e}")

        # Notify global subscribers
        for handler in self._global_subscribers:
            if asyncio.iscoroutinefunction(handler):
                tasks.append(handler(event))
            else:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Error in global event handler: {e}")

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    def get_recent_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        return [e.model_dump() for e in self._event_history[-limit:]]

# Global Singleton instance
global_event_bus = EventBus()
