from __future__ import annotations

import json
import logging
from datetime import datetime, timezone

import httpx

from app.core.config import settings
from app.models.order import Order

logger = logging.getLogger(__name__)


def _fmt_dt(dt: datetime | None) -> str:
    if dt is None:
        return ""
    return dt.isoformat()


async def send_sheet_webhook(order: Order) -> None:
    """Fire the Google Sheet webhook. Never raises; logs errors only."""
    url = settings.GOOGLE_SHEET_WEBHOOK_URL
    secret = settings.GOOGLE_SHEET_WEBHOOK_SECRET
    if not url:
        logger.debug("GOOGLE_SHEET_WEBHOOK_URL not configured, skipping.")
        return

    items_json = order.items_json or []
    utm = order.utm_json or {}
    event_ids = order.event_ids_json or {}
    upsell = order.upsell_json or {}

    main_products = ", ".join(
        item.get("name", "") for item in items_json if isinstance(item, dict)
    )
    offer_pieces = ""
    if items_json and isinstance(items_json, list) and items_json:
        first = items_json[0]
        if isinstance(first, dict):
            offer = first.get("offer", {})
            offer_pieces = str(offer.get("pieces", "")) if isinstance(offer, dict) else ""

    upsell_accepted = upsell.get("accepted", False) if upsell else False
    upsell_product = upsell.get("productId", "") if upsell_accepted else ""
    upsell_price = upsell.get("priceDa", "") if upsell_accepted else ""

    payload = {
        "order_id": str(order.id),
        "created_at": _fmt_dt(order.created_at),
        "status": order.status,
        "customer_name": order.customer_name,
        "phone_local": order.phone_local or "",
        "phone_e164": order.phone_e164 or "",
        "phone_capi_numeric": order.phone_capi_numeric or "",
        "items": json.dumps(items_json, ensure_ascii=False),
        "main_products": main_products,
        "offer_pieces": offer_pieces,
        "subtotal_da": order.subtotal_da or 0,
        "shipping_da": order.shipping_da,
        "total_da": order.total_da or 0,
        "upsell_accepted": upsell_accepted,
        "upsell_product": upsell_product,
        "upsell_price_da": upsell_price,
        "currency": order.currency,
        "landing_page": order.landing_page or "",
        "referrer": order.referrer or "",
        "utm_source": utm.get("utm_source", "") or "",
        "utm_medium": utm.get("utm_medium", "") or "",
        "utm_campaign": utm.get("utm_campaign", "") or "",
        "utm_content": utm.get("utm_content", "") or "",
        "utm_term": utm.get("utm_term", "") or "",
        "fbclid": utm.get("fbclid", "") or "",
        "ttclid": utm.get("ttclid", "") or "",
        "snap_click_id": utm.get("sc_click_id", "") or "",
        "meta_event_id": event_ids.get("meta", "") or "",
        "tiktok_event_id": event_ids.get("tiktok", "") or "",
        "snap_event_id": event_ids.get("snap", "") or "",
        "user_agent": order.user_agent or "",
        "ip_address": order.ip_address or "",
        "notes": "",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                url,
                params={"secret": secret},
                headers={"x-shefaa-secret": secret, "Content-Type": "application/json"},
                json=payload,
            )
            if resp.status_code >= 400:
                logger.warning(
                    "Sheet webhook returned %s for order %s: %s",
                    resp.status_code, order.id, resp.text[:200],
                )
            else:
                logger.info("Sheet webhook OK for order %s", order.id)
    except Exception as exc:
        logger.error("Sheet webhook failed for order %s: %s", order.id, exc)
