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

SNAP_CONVERSIONS_URL = "https://tr.snapchat.com/v2/conversion"


async def send_snap_purchase(order: Order, db: AsyncSession) -> None:
    """Send Snap Conversions API PURCHASE event. Never raises."""
    if not settings.SNAP_PIXEL_ID or not settings.SNAP_ACCESS_TOKEN:
        logger.debug("Snap Conversions API not configured, skipping.")
        return

    event_ids = order.event_ids_json or {}
    utm = order.utm_json or {}

    purchase_event_id = event_ids.get("snap") or str(uuid.uuid4())
    ts_ms = int(order.created_at.timestamp() * 1000) if order.created_at else int(time.time() * 1000)

    body = {
        "pixel_id": settings.SNAP_PIXEL_ID,
        "event_type": "PURCHASE",
        "event_conversion_type": "WEB",
        "event_tag": purchase_event_id,
        "timestamp": ts_ms,
        "hashed_phone": sha256_hex(order.phone_capi_numeric or ""),
        "currency_code": "DZD",
        "price": order.total_da or 0,
        "client_dedup_id": purchase_event_id,
        "snap_click_id": utm.get("sc_click_id", "") or "",
    }

    success = False
    response_json: dict | None = None

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                SNAP_CONVERSIONS_URL,
                headers={
                    "Authorization": f"Bearer {settings.SNAP_ACCESS_TOKEN}",
                    "Content-Type": "application/json",
                },
                json=body,
            )
            response_json = resp.json()
            success = resp.status_code < 400
            if not success:
                logger.warning("Snap CAPI error %s for order %s: %s", resp.status_code, order.id, resp.text[:300])
            else:
                logger.info("Snap CAPI PURCHASE sent for order %s", order.id)
    except Exception as exc:
        logger.error("Snap CAPI exception for order %s: %s", order.id, exc)

    tracking_event = TrackingEvent(
        order_id=order.id,
        platform="snap",
        event_name="PURCHASE",
        event_id=purchase_event_id,
        payload_json=body,
        response_json=response_json,
        success=success,
    )
    db.add(tracking_event)
    try:
        await db.flush()
    except Exception as exc:
        logger.error("Failed to save Snap tracking event for order %s: %s", order.id, exc)
