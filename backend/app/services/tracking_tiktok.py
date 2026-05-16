from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.event import TrackingEvent
from app.models.order import Order
from app.services.hashing import sha256_hex

logger = logging.getLogger(__name__)

TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


async def send_tiktok_purchase(order: Order, db: AsyncSession) -> None:
    """Send TikTok Events API PlaceAnOrder event. Never raises."""
    if not settings.TIKTOK_PIXEL_CODE or not settings.TIKTOK_ACCESS_TOKEN:
        logger.debug("TikTok Events API not configured, skipping.")
        return

    event_ids = order.event_ids_json or {}
    utm = order.utm_json or {}
    items_json = order.items_json or []

    purchase_event_id = event_ids.get("tiktok") or str(uuid.uuid4())
    ts = order.created_at.isoformat() if order.created_at else datetime.now(timezone.utc).isoformat()

    first_product_id = ""
    if items_json and isinstance(items_json, list):
        first = items_json[0]
        if isinstance(first, dict):
            first_product_id = first.get("productId", "")

    body = {
        "pixel_code": settings.TIKTOK_PIXEL_CODE,
        "event": "PlaceAnOrder",
        "event_id": purchase_event_id,
        "timestamp": ts,
        "context": {
            "user": {
                "phone_number": sha256_hex(order.phone_e164 or ""),
            },
            "ip": order.ip_address or "",
            "user_agent": order.user_agent or "",
            "ttclid": utm.get("ttclid", "") or "",
        },
        "properties": {
            "currency": "DZD",
            "value": order.total_da or 0,
            "content_id": first_product_id,
            "content_type": "product",
        },
    }

    success = False
    response_json: dict | None = None

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                TIKTOK_EVENTS_URL,
                headers={
                    "Access-Token": settings.TIKTOK_ACCESS_TOKEN,
                    "Content-Type": "application/json",
                },
                json=body,
            )
            response_json = resp.json()
            success = resp.status_code < 400
            if not success:
                logger.warning("TikTok CAPI error %s for order %s: %s", resp.status_code, order.id, resp.text[:300])
            else:
                logger.info("TikTok CAPI PlaceAnOrder sent for order %s", order.id)
    except Exception as exc:
        logger.error("TikTok CAPI exception for order %s: %s", order.id, exc)

    tracking_event = TrackingEvent(
        order_id=order.id,
        platform="tiktok",
        event_name="PlaceAnOrder",
        event_id=purchase_event_id,
        payload_json=body,
        response_json=response_json,
        success=success,
    )
    db.add(tracking_event)
    try:
        await db.flush()
    except Exception as exc:
        logger.error("Failed to save TikTok tracking event for order %s: %s", order.id, exc)
