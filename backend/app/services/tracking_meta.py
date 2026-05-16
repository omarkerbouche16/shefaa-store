from __future__ import annotations

import logging
import time
import uuid
from datetime import datetime, timezone

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.event import TrackingEvent
from app.models.order import Order
from app.services.hashing import sha256_hex

logger = logging.getLogger(__name__)

META_EVENTS_URL = "https://graph.facebook.com/v21.0/{pixel_id}/events"


async def send_meta_purchase(order: Order, db: AsyncSession) -> None:
    """Send Meta CAPI Purchase event. Never raises."""
    if not settings.META_PIXEL_ID or not settings.META_ACCESS_TOKEN:
        logger.debug("Meta CAPI not configured, skipping.")
        return

    event_ids = order.event_ids_json or {}
    utm = order.utm_json or {}
    items_json = order.items_json or []

    purchase_event_id = event_ids.get("meta") or str(uuid.uuid4())
    event_time = int(order.created_at.timestamp()) if order.created_at else int(time.time())

    content_ids = [
        item.get("productId", "")
        for item in items_json
        if isinstance(item, dict)
    ]
    contents = [
        {
            "id": item.get("productId", ""),
            "quantity": item.get("offer", {}).get("pieces", 1) if isinstance(item.get("offer"), dict) else 1,
        }
        for item in items_json
        if isinstance(item, dict)
    ]

    user_data: dict = {
        "ph": [sha256_hex(order.phone_capi_numeric or "")],
        "client_ip_address": order.ip_address or "",
        "client_user_agent": order.user_agent or "",
    }
    fbc = utm.get("fbc")
    fbp = utm.get("fbp")
    if fbc:
        user_data["fbc"] = fbc
    if fbp:
        user_data["fbp"] = fbp

    event_payload: dict = {
        "event_name": "Purchase",
        "event_time": event_time,
        "event_id": purchase_event_id,
        "action_source": "website",
        "event_source_url": order.landing_page or "",
        "user_data": user_data,
        "custom_data": {
            "currency": "DZD",
            "value": order.total_da or 0,
            "content_ids": content_ids,
            "contents": contents,
            "order_id": str(order.id),
        },
    }

    body: dict = {"data": [event_payload]}
    if settings.META_TEST_EVENT_CODE:
        body["test_event_code"] = settings.META_TEST_EVENT_CODE

    url = META_EVENTS_URL.format(pixel_id=settings.META_PIXEL_ID)
    success = False
    response_json: dict | None = None

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                url,
                params={"access_token": settings.META_ACCESS_TOKEN},
                json=body,
            )
            response_json = resp.json()
            success = resp.status_code < 400
            if not success:
                logger.warning("Meta CAPI error %s for order %s: %s", resp.status_code, order.id, resp.text[:300])
            else:
                logger.info("Meta CAPI Purchase sent for order %s", order.id)
    except Exception as exc:
        logger.error("Meta CAPI exception for order %s: %s", order.id, exc)

    tracking_event = TrackingEvent(
        order_id=order.id,
        platform="meta",
        event_name="Purchase",
        event_id=purchase_event_id,
        payload_json=body,
        response_json=response_json,
        success=success,
    )
    db.add(tracking_event)
    try:
        await db.flush()
    except Exception as exc:
        logger.error("Failed to save Meta tracking event for order %s: %s", order.id, exc)
