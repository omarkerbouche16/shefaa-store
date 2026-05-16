from __future__ import annotations

from pydantic import BaseModel


class TrackingEventRequest(BaseModel):
    orderId: str
    platform: str
    eventName: str
    eventId: str
    payload: dict = {}


class TrackingEventResponse(BaseModel):
    success: bool
    message: str
