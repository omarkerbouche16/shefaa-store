from __future__ import annotations

import logging
import math
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import constant_time_compare, create_admin_token, get_current_admin
from app.db.session import get_db
from app.models.order import Order
from app.models.page_view import PageView
from app.schemas.admin import (
    AdminLoginRequest,
    AdminOrderDetail,
    AdminOrderItem,
    AdminTokenResponse,
    DailyPoint,
    DashboardMetrics,
    OrdersListResponse,
    ProductStat,
    StatusStat,
    TrafficStats,
    UpdateOrderStatusRequest,
    UtmStat,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])

VALID_STATUSES = {"new", "confirmed", "cancelled", "delivered", "returned"}

# ── Helpers ───────────────────────────────────────────────────────────────────


def _friendly_id(order: Order) -> str:
    return "SHEFA" + str(order.id).replace("-", "")[:8].upper()


def _parse_date_range(
    from_date: str | None,
    to_date: str | None,
) -> tuple[datetime, datetime]:
    tz = timezone.utc
    if from_date:
        start = datetime.fromisoformat(from_date).replace(tzinfo=tz)
    else:
        start = datetime.now(tz) - timedelta(days=29)
    start = start.replace(hour=0, minute=0, second=0, microsecond=0)

    if to_date:
        end = datetime.fromisoformat(to_date).replace(tzinfo=tz)
    else:
        end = datetime.now(tz)
    end = end.replace(hour=23, minute=59, second=59, microsecond=999999)
    return start, end


# ── Auth ──────────────────────────────────────────────────────────────────────


@router.post("/auth/login", response_model=AdminTokenResponse)
async def admin_login(body: AdminLoginRequest) -> AdminTokenResponse:
    if not settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin credentials not configured",
        )
    username_ok = constant_time_compare(body.username, settings.ADMIN_USERNAME)
    password_ok = constant_time_compare(body.password, settings.ADMIN_PASSWORD)
    if not (username_ok and password_ok):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = create_admin_token({"sub": body.username, "role": "admin"})
    logger.info("Admin login: %s", body.username)
    return AdminTokenResponse(access_token=token)


# ── Dashboard Metrics ─────────────────────────────────────────────────────────


@router.get("/metrics", response_model=DashboardMetrics)
async def get_metrics(
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
) -> DashboardMetrics:
    start, end = _parse_date_range(from_date, to_date)

    # ── Orders in range ───────────────────────────────────────────────────
    orders_result = await db.execute(
        select(Order).where(Order.created_at >= start, Order.created_at <= end)
    )
    orders: list[Order] = list(orders_result.scalars().all())

    total_orders = len(orders)
    total_revenue = sum(o.total_da or 0 for o in orders)
    avg_order_value = (total_revenue // total_orders) if total_orders else 0

    # ── Status breakdown ──────────────────────────────────────────────────
    status_counts: dict[str, int] = defaultdict(int)
    for o in orders:
        status_counts[o.status] += 1
    orders_by_status = [StatusStat(status=s, count=c) for s, c in status_counts.items()]

    # ── Page views in range ───────────────────────────────────────────────
    pv_result = await db.execute(
        select(PageView).where(
            PageView.created_at >= start,
            PageView.created_at <= end,
            PageView.is_valid_algeria == True,  # noqa: E712
        )
    )
    page_views: list[PageView] = list(pv_result.scalars().all())
    total_page_views = len(page_views)
    unique_sessions = len({pv.session_id for pv in page_views if pv.session_id})
    conversion_rate = round((total_orders / unique_sessions * 100), 2) if unique_sessions else 0.0

    # ── Daily series ──────────────────────────────────────────────────────
    daily_orders: dict[str, dict[str, int]] = defaultdict(lambda: {"orders": 0, "revenue": 0, "page_views": 0})

    for o in orders:
        day = o.created_at.strftime("%Y-%m-%d")
        daily_orders[day]["orders"] += 1
        daily_orders[day]["revenue"] += o.total_da or 0

    for pv in page_views:
        day = pv.created_at.strftime("%Y-%m-%d")
        daily_orders[day]["page_views"] += 1

    # Fill every day in the range even if no data
    days_in_range: list[str] = []
    cursor = start.date()
    while cursor <= end.date():
        days_in_range.append(cursor.strftime("%Y-%m-%d"))
        cursor += timedelta(days=1)

    daily_series = [
        DailyPoint(
            date=d,
            orders=daily_orders[d]["orders"],
            revenue=daily_orders[d]["revenue"],
            page_views=daily_orders[d]["page_views"],
        )
        for d in days_in_range
    ]

    # ── Top products ──────────────────────────────────────────────────────
    product_stats: dict[str, dict[str, Any]] = defaultdict(lambda: {"count": 0, "revenue": 0, "name": ""})
    for o in orders:
        items: list[dict] = o.items_json or []  # type: ignore[assignment]
        for item in items:
            if not isinstance(item, dict):
                continue
            pid = item.get("productId", "unknown")
            qty = item.get("quantity", 1)
            offer = item.get("offer", {}) if isinstance(item.get("offer"), dict) else {}
            price = offer.get("priceDa", 0)
            product_stats[pid]["count"] += qty
            product_stats[pid]["revenue"] += price * qty
            if not product_stats[pid]["name"]:
                product_stats[pid]["name"] = item.get("name", pid)

    top_products = sorted(
        [
            ProductStat(product_id=pid, name=v["name"], count=v["count"], revenue=v["revenue"])
            for pid, v in product_stats.items()
        ],
        key=lambda x: x.revenue,
        reverse=True,
    )[:10]

    # ── UTM sources ───────────────────────────────────────────────────────
    utm_counts: dict[str, int] = defaultdict(int)
    for o in orders:
        utm: dict = o.utm_json or {}
        source = utm.get("utm_source") or "direct"
        utm_counts[source] += 1

    utm_sources = sorted(
        [UtmStat(source=s, count=c) for s, c in utm_counts.items()],
        key=lambda x: x.count,
        reverse=True,
    )

    return DashboardMetrics(
        total_orders=total_orders,
        total_revenue=total_revenue,
        avg_order_value=avg_order_value,
        total_page_views=total_page_views,
        unique_sessions=unique_sessions,
        conversion_rate=conversion_rate,
        orders_by_status=orders_by_status,
        daily_series=daily_series,
        top_products=top_products,
        utm_sources=utm_sources,
    )


# ── Orders List ───────────────────────────────────────────────────────────────


@router.get("/orders", response_model=OrdersListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    order_status: str | None = Query(None, alias="status"),
    search: str | None = Query(None),
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
) -> OrdersListResponse:
    start, end = _parse_date_range(from_date, to_date)

    query = select(Order).where(Order.created_at >= start, Order.created_at <= end)

    if order_status:
        query = query.where(Order.status == order_status)

    if search:
        term = f"%{search}%"
        query = query.where(
            Order.customer_name.ilike(term) | Order.phone_local.ilike(term)
        )

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    query = query.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    orders = list(result.scalars().all())

    items = [
        AdminOrderItem(
            order_id=str(o.id),
            friendly_id=_friendly_id(o),
            created_at=o.created_at,
            customer_name=o.customer_name,
            phone_local=o.phone_local,
            status=o.status,
            total_da=o.total_da,
            subtotal_da=o.subtotal_da,
            items_count=len(o.items_json) if isinstance(o.items_json, list) else 0,
            utm_source=(o.utm_json or {}).get("utm_source") if o.utm_json else None,
            ip_address=o.ip_address,
        )
        for o in orders
    ]

    return OrdersListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=math.ceil(total / limit) if total else 1,
    )


# ── Order Detail ──────────────────────────────────────────────────────────────


@router.get("/orders/{order_id}", response_model=AdminOrderDetail)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
) -> AdminOrderDetail:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return AdminOrderDetail(
        order_id=str(order.id),
        friendly_id=_friendly_id(order),
        created_at=order.created_at,
        customer_name=order.customer_name,
        phone_local=order.phone_local,
        phone_e164=order.phone_e164,
        status=order.status,
        subtotal_da=order.subtotal_da,
        shipping_da=order.shipping_da,
        total_da=order.total_da,
        currency=order.currency,
        items_json=order.items_json if isinstance(order.items_json, list) else [],
        upsell_json=order.upsell_json,
        utm_json=order.utm_json,
        landing_page=order.landing_page,
        referrer=order.referrer,
        user_agent=order.user_agent,
        ip_address=order.ip_address,
        sheet_synced_at=order.sheet_synced_at,
        tracking_synced_at=order.tracking_synced_at,
        event_ids_json=order.event_ids_json,
    )


# ── Update Order Status ───────────────────────────────────────────────────────


@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    body: UpdateOrderStatusRequest,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
) -> dict:
    if body.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid status. Valid values: {', '.join(VALID_STATUSES)}",
        )
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = body.status
    await db.flush()
    logger.info("Admin updated order %s → %s", order_id, body.status)
    return {"order_id": order_id, "status": body.status}


# ── Traffic / Page Views ──────────────────────────────────────────────────────


@router.get("/traffic", response_model=TrafficStats)
async def get_traffic(
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
) -> TrafficStats:
    start, end = _parse_date_range(from_date, to_date)

    result = await db.execute(
        select(PageView).where(
            PageView.created_at >= start,
            PageView.created_at <= end,
        )
    )
    all_views: list[PageView] = list(result.scalars().all())

    total_pv = len(all_views)
    valid_pv = [pv for pv in all_views if pv.is_valid_algeria]
    vpn_blocked = len([pv for pv in all_views if pv.is_vpn])
    unique_sessions = len({pv.session_id for pv in valid_pv if pv.session_id})

    daily: dict[str, dict[str, int]] = defaultdict(lambda: {"orders": 0, "revenue": 0, "page_views": 0})
    for pv in valid_pv:
        day = pv.created_at.strftime("%Y-%m-%d")
        daily[day]["page_views"] += 1

    days_in_range: list[str] = []
    cursor = start.date()
    while cursor <= end.date():
        days_in_range.append(cursor.strftime("%Y-%m-%d"))
        cursor += timedelta(days=1)

    daily_series = [
        DailyPoint(date=d, orders=0, revenue=0, page_views=daily[d]["page_views"])
        for d in days_in_range
    ]

    return TrafficStats(
        total_page_views=total_pv,
        unique_sessions=unique_sessions,
        valid_algeria=len(valid_pv),
        vpn_blocked=vpn_blocked,
        daily_series=daily_series,
    )
