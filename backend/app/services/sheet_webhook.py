from __future__ import annotations

import logging
from datetime import datetime, timezone

import httpx

from app.core.config import PRODUCT_SKUS, settings
from app.models.order import Order

logger = logging.getLogger(__name__)


def _fmt_date(dt: datetime | None) -> str:
    """Format date as DD/MM/YYYY for the sheet."""
    if dt is None:
        dt = datetime.now(timezone.utc)
    return dt.strftime("%d/%m/%Y")


def _friendly_order_id(order: Order) -> str:
    """Generate a human-readable order ID: SHEFA + first 8 chars of UUID uppercase."""
    return "SHEFA" + str(order.id).replace("-", "")[:8].upper()


async def send_sheet_webhook(order: Order) -> None:
    """Fire the Google Sheet webhook. Never raises; logs errors only."""
    url = settings.GOOGLE_SHEET_WEBHOOK_URL
    if not url:
        logger.debug("GOOGLE_SHEET_WEBHOOK_URL not configured, skipping.")
        return

    items_json: list[dict] = order.items_json or []  # type: ignore[assignment]

    # ── Build slash-separated product / sku / quantity lists ──────────────
    products: list[str] = []
    skus: list[str] = []
    quantities: list[str] = []

    for item in items_json:
        if not isinstance(item, dict):
            continue
        product_id = item.get("productId", "")
        name       = item.get("name", product_id)
        offer      = item.get("offer", {}) if isinstance(item.get("offer"), dict) else {}
        pieces     = offer.get("pieces", 1)
        qty        = item.get("quantity", 1)
        sku        = PRODUCT_SKUS.get(product_id, product_id)

        products.append(name)
        skus.append(sku)
        # Each cart line has `quantity` units, each unit = `pieces` pieces.
        # The sheet wants "how many pieces ordered per line".
        quantities.append(str(pieces * qty))

    product_col  = "/".join(products)
    sku_col      = "/".join(skus)
    quantity_col = "/".join(quantities)

    # ── Build the 10-column payload matching the sheet header ─────────────
    # Sheet columns: date | order id | country | name | phone | product | sku | quantity | status | totalprice
    payload = {
        "date":       _fmt_date(order.created_at),
        "order id":   _friendly_order_id(order),
        "country":    "Algeria",
        "name":       order.customer_name or "",
        "phone":      order.phone_local or "",
        "product":    product_col,
        "sku":        sku_col,
        "quantity":   quantity_col,
        "status":     "",
        "totalprice": str(order.total_da or 0),
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                url,
                headers={"Content-Type": "application/json"},
                json=payload,
            )
            if resp.status_code >= 400:
                logger.warning(
                    "Sheet webhook returned %s for order %s: %s",
                    resp.status_code, order.id, resp.text[:200],
                )
            else:
                logger.info(
                    "Sheet webhook OK for order %s → %s",
                    order.id, _friendly_order_id(order),
                )
    except Exception as exc:
        logger.error("Sheet webhook failed for order %s: %s", order.id, exc)
