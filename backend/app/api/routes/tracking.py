from __future__ import annotations

import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.event import TrackingEvent
from app.schemas.tracking import TrackingEventRequest, TrackingEventResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tracking", tags=["tracking"])


@router.post("/events", response_model=TrackingEventResponse)
async def post_tracking_event(
    payload: TrackingEventRequest,
    db: AsyncSession = Depends(get_db),
) -> TrackingEventResponse:
    """Store a browser-originated tracking event in the database."""
    try:
        order_uuid = uuid.UUID(payload.orderId)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"message": "معرّف الطلب غير صالح", "field": "orderId"},
        )

    event = TrackingEvent(
        order_id=order_uuid,
        platform=payload.platform,
        event_name=payload.eventName,
        event_id=payload.eventId,
        payload_json=payload.payload,
        success=True,
    )
    db.add(event)
    await db.flush()
    logger.info("Tracking event stored: platform=%s order=%s", payload.platform, payload.orderId)
    return TrackingEventResponse(success=True, message="تم حفظ الحدث بنجاح")
