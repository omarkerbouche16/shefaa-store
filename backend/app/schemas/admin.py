from __future__ import annotations

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel


# ── Auth ─────────────────────────────────────────────────────────────────────

class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Metrics ──────────────────────────────────────────────────────────────────

class DailyPoint(BaseModel):
    date: str
    orders: int
    revenue: int
    page_views: int


class ProductStat(BaseModel):
    product_id: str
    name: str
    count: int
    revenue: int


class UtmStat(BaseModel):
    source: str
    count: int


class StatusStat(BaseModel):
    status: str
    count: int


class DashboardMetrics(BaseModel):
    total_orders: int
    total_revenue: int
    avg_order_value: int
    total_page_views: int
    unique_sessions: int
    conversion_rate: float
    orders_by_status: list[StatusStat]
    daily_series: list[DailyPoint]
    top_products: list[ProductStat]
    utm_sources: list[UtmStat]


# ── Orders ───────────────────────────────────────────────────────────────────

class AdminOrderItem(BaseModel):
    order_id: str
    friendly_id: str
    created_at: datetime
    customer_name: str
    phone_local: str | None
    status: str
    total_da: int | None
    subtotal_da: int | None
    items_count: int
    utm_source: str | None
    ip_address: str | None


class AdminOrderDetail(BaseModel):
    order_id: str
    friendly_id: str
    created_at: datetime
    customer_name: str
    phone_local: str | None
    phone_e164: str | None
    status: str
    subtotal_da: int | None
    shipping_da: int
    total_da: int | None
    currency: str
    items_json: list[Any] | None
    upsell_json: dict | None
    utm_json: dict | None
    landing_page: str | None
    referrer: str | None
    user_agent: str | None
    ip_address: str | None
    sheet_synced_at: datetime | None
    tracking_synced_at: datetime | None
    event_ids_json: dict | None


class OrdersListResponse(BaseModel):
    items: list[AdminOrderItem]
    total: int
    page: int
    limit: int
    pages: int


class UpdateOrderStatusRequest(BaseModel):
    status: str


# ── Page Views / Traffic ──────────────────────────────────────────────────────

class PageViewRequest(BaseModel):
    session_id: str | None = None
    page_url: str | None = None
    product_slug: str | None = None
    utm: dict[str, str | None] = {}
    referrer: str | None = None


class PageViewResponse(BaseModel):
    recorded: bool


class TrafficStats(BaseModel):
    total_page_views: int
    unique_sessions: int
    valid_algeria: int
    vpn_blocked: int
    daily_series: list[DailyPoint]
