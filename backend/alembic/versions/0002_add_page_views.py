"""add page_views table

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-18 00:00:00.000000
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "page_views",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("session_id", sa.String(100), nullable=True),
        sa.Column("page_url", sa.Text(), nullable=True),
        sa.Column("product_slug", sa.String(100), nullable=True),
        sa.Column("ip_address", sa.String(60), nullable=True),
        sa.Column("country", sa.String(10), nullable=True),
        sa.Column("is_vpn", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("is_valid_algeria", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("utm_json", sa.JSON(), nullable=True),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_page_views_session_id", "page_views", ["session_id"])
    op.create_index("ix_page_views_product_slug", "page_views", ["product_slug"])
    op.create_index("ix_page_views_is_valid_algeria", "page_views", ["is_valid_algeria"])
    op.create_index("ix_page_views_created_at", "page_views", ["created_at"])

    # Add index on orders.created_at for admin dashboard queries
    op.create_index("ix_orders_created_at", "orders", ["created_at"])
    op.create_index("ix_orders_status", "orders", ["status"])


def downgrade() -> None:
    op.drop_index("ix_orders_status", table_name="orders")
    op.drop_index("ix_orders_created_at", table_name="orders")
    op.drop_index("ix_page_views_created_at", table_name="page_views")
    op.drop_index("ix_page_views_is_valid_algeria", table_name="page_views")
    op.drop_index("ix_page_views_product_slug", table_name="page_views")
    op.drop_index("ix_page_views_session_id", table_name="page_views")
    op.drop_table("page_views")
