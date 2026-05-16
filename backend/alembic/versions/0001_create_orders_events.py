"""create orders and tracking_events tables

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("customer_name", sa.String(200), nullable=False),
        sa.Column("phone_local", sa.String(20), nullable=True),
        sa.Column("phone_e164", sa.String(20), nullable=True),
        sa.Column("phone_capi_numeric", sa.String(20), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="new"),
        sa.Column("subtotal_da", sa.Integer(), nullable=True),
        sa.Column("shipping_da", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("total_da", sa.Integer(), nullable=True),
        sa.Column("currency", sa.String(10), nullable=False, server_default="DZD"),
        sa.Column("items_json", sa.JSON(), nullable=True),
        sa.Column("upsell_json", sa.JSON(), nullable=True),
        sa.Column("utm_json", sa.JSON(), nullable=True),
        sa.Column("landing_page", sa.Text(), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("ip_address", sa.String(60), nullable=True),
        sa.Column("event_ids_json", sa.JSON(), nullable=True),
        sa.Column("sheet_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("tracking_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("raw_payload_json", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "tracking_events",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("order_id", sa.Uuid(), nullable=False),
        sa.Column("platform", sa.String(20), nullable=False),
        sa.Column("event_name", sa.String(100), nullable=False),
        sa.Column("event_id", sa.String(100), nullable=False),
        sa.Column("payload_json", sa.JSON(), nullable=True),
        sa.Column("response_json", sa.JSON(), nullable=True),
        sa.Column("success", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(
            ["order_id"], ["orders.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tracking_events_order_id", "tracking_events", ["order_id"])


def downgrade() -> None:
    op.drop_index("ix_tracking_events_order_id", table_name="tracking_events")
    op.drop_table("tracking_events")
    op.drop_table("orders")
