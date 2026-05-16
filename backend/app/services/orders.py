from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import PRODUCT_PRICES, UPSELL_PRICE, VALID_PRODUCT_IDS
from app.models.order import Order
from app.schemas.order import CreateOrderRequest, OrderResponse
from app.services.ip_fraud_check import check_ip_fraud
from app.services.phone import parse_phone
from app.services.sheet_webhook import send_sheet_webhook
from app.services.tracking_meta import send_meta_purchase
from app.services.tracking_snap import send_snap_purchase
from app.services.tracking_tiktok import send_tiktok_purchase

logger = logging.getLogger(__name__)


def _get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    if request.client:
        return request.client.host
    return ""


async def create_order(
    payload: CreateOrderRequest,
    db: AsyncSession,
    request: Request,
) -> OrderResponse:
    # 1. Validate & normalize phone
    try:
        phone_local, phone_e164, phone_capi_numeric = parse_phone(payload.phoneLocal)
    except ValueError as exc:
        raise ValueError(str(exc)) from exc

    # 2. IP fraud check — only allow KSA, block VPN/proxy
    ip_address = _get_client_ip(request)
    ip_result = await check_ip_fraud(ip_address, phone=payload.phoneLocal)
    if not ip_result.allowed:
        raise ValueError(ip_result.reason)

    # 3. Validate items and recalculate subtotal server-side
    server_subtotal = 0
    for item in payload.items:
        if item.productId not in VALID_PRODUCT_IDS:
            raise ValueError(f"المنتج '{item.productId}' غير موجود")
        pieces = item.offer.pieces
        if pieces not in PRODUCT_PRICES[item.productId]:
            raise ValueError(
                f"كمية '{pieces}' غير صالحة للمنتج '{item.productId}'"
            )
        server_price = PRODUCT_PRICES[item.productId][pieces]
        server_subtotal += server_price * item.quantity

    # 4. Validate upsell
    upsell_amount = 0
    if payload.upsell and payload.upsell.accepted:
        if payload.upsell.priceDa != UPSELL_PRICE:
            raise ValueError(
                f"سعر المنتج الإضافي غير صحيح. السعر المتوقع: {UPSELL_PRICE} دج"
            )
        upsell_amount = UPSELL_PRICE

    # 5. Calculate total
    shipping = 0
    total = server_subtotal + upsell_amount + shipping

    # 6. Capture client info
    user_agent = request.headers.get("user-agent", "")

    # 7. Persist order
    order = Order(
        customer_name=payload.customerName,
        phone_local=phone_local,
        phone_e164=phone_e164,
        phone_capi_numeric=phone_capi_numeric,
        status="new",
        subtotal_da=server_subtotal,
        shipping_da=shipping,
        total_da=total,
        currency="DZD",
        items_json=[item.model_dump() for item in payload.items],
        upsell_json=payload.upsell.model_dump() if payload.upsell else None,
        utm_json=payload.utm or {},
        landing_page=payload.landingPage or None,
        referrer=request.headers.get("referer") or None,
        user_agent=user_agent or None,
        ip_address=ip_address or None,
        event_ids_json=payload.eventIds or {},
        raw_payload_json=payload.model_dump(),
    )
    db.add(order)
    await db.flush()
    await db.refresh(order)

    order_id_str = str(order.id)
    logger.info("Order created: %s | total=%s DZD", order_id_str, total)

    # 8. Non-blocking post-order tasks
    async def _fire_webhooks() -> None:
        results = await asyncio.gather(
            send_sheet_webhook(order),
            send_meta_purchase(order, db),
            send_tiktok_purchase(order, db),
            send_snap_purchase(order, db),
            return_exceptions=True,
        )
        for r in results:
            if isinstance(r, Exception):
                logger.error("Post-order task failed: %s", r)

    asyncio.create_task(_fire_webhooks())

    return OrderResponse(
        orderId=order_id_str,
        status=order.status,
        totalDa=total,
        message="تم استلام طلبيتك بنجاح! سنتصل بك قريباً لتأكيد الطلب.",
    )
