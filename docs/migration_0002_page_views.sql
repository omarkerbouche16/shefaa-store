-- Migration 0002: Add page_views table + performance indexes
-- Run this in your Supabase/PostgreSQL database if you are NOT using Alembic.
-- If you use `alembic upgrade head`, skip this file.

BEGIN;

CREATE TABLE IF NOT EXISTS page_views (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_id  VARCHAR(100),
    page_url    TEXT,
    product_slug VARCHAR(100),
    ip_address  VARCHAR(60),
    country     VARCHAR(10),
    is_vpn      BOOLEAN NOT NULL DEFAULT false,
    is_valid_algeria BOOLEAN NOT NULL DEFAULT false,
    user_agent  TEXT,
    utm_json    JSONB,
    referrer    TEXT
);

CREATE INDEX IF NOT EXISTS ix_page_views_session_id       ON page_views (session_id);
CREATE INDEX IF NOT EXISTS ix_page_views_product_slug     ON page_views (product_slug);
CREATE INDEX IF NOT EXISTS ix_page_views_is_valid_algeria ON page_views (is_valid_algeria);
CREATE INDEX IF NOT EXISTS ix_page_views_created_at       ON page_views (created_at);

-- Performance indexes for admin dashboard queries on orders table
CREATE INDEX IF NOT EXISTS ix_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS ix_orders_status     ON orders (status);

-- Update alembic version table so alembic stays in sync
-- (only if you ran migration 0001 via alembic)
INSERT INTO alembic_version (version_num) VALUES ('0002')
ON CONFLICT (version_num) DO NOTHING;

COMMIT;
