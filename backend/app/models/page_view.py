from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class PageView(Base):
    __tablename__ = "page_views"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    session_id: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    page_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    product_slug: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    ip_address: Mapped[str | None] = mapped_column(String(60), nullable=True)
    country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    is_vpn: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_valid_algeria: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    utm_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    referrer: Mapped[str | None] = mapped_column(Text, nullable=True)
