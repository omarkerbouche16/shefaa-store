from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    customer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    phone_local: Mapped[str | None] = mapped_column(String(20), nullable=True)
    phone_e164: Mapped[str | None] = mapped_column(String(20), nullable=True)
    phone_capi_numeric: Mapped[str | None] = mapped_column(String(20), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="new", nullable=False)
    subtotal_da: Mapped[int | None] = mapped_column(Integer, nullable=True)
    shipping_da: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_da: Mapped[int | None] = mapped_column(Integer, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="DZD", nullable=False)
    items_json: Mapped[dict | list | None] = mapped_column(JSON, nullable=True)
    upsell_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    utm_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    landing_page: Mapped[str | None] = mapped_column(Text, nullable=True)
    referrer: Mapped[str | None] = mapped_column(Text, nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(60), nullable=True)
    event_ids_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    sheet_synced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    tracking_synced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    raw_payload_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
