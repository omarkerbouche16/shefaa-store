# 07 - Backend Architecture

## Stack

Use:

- Python 3.12+.
- FastAPI.
- SQLAlchemy 2.x async.
- Alembic migrations.
- PostgreSQL.
- Pydantic v2 settings.
- httpx for outbound webhooks and CAPI calls.
- uvicorn/gunicorn for serving.

Database name: `shefaa_webset`.

Do not hardcode the database URL or password. Use environment variables.

## Folder Structure

Create:

```text
backend/
  app/
    main.py
    core/
      config.py
      security.py
      logging.py
    db/
      base.py
      session.py
      migrations.py
    models/
      order.py
      event.py
    schemas/
      order.py
      tracking.py
    api/
      routes/
        health.py
        orders.py
        tracking.py
    services/
      orders.py
      sheet_webhook.py
      tracking_meta.py
      tracking_tiktok.py
      tracking_snap.py
      phone.py
      hashing.py
  alembic/
  alembic.ini
  Dockerfile
  docker-compose.yml
  requirements.txt
  .env.example
```

## API Endpoints

Health:

- `GET /health`
- returns `{ "status": "ok" }`

Create order:

- `POST /api/orders`
- Validates customer name and Algerian phone.
- Creates order in Postgres.
- Sends order to Google Sheet webhook.
- Sends server-side conversion events if configured.
- Returns order ID and thank-you payload.

Optional tracking endpoint:

- `POST /api/tracking/events`
- Use only if browser needs to send non-order server events.

## Order Schema

Orders table:

- `id` UUID primary key.
- `created_at`.
- `customer_name`.
- `phone_local`.
- `phone_e164`.
- `phone_capi_numeric`.
- `status`: `new`, `confirmed`, `cancelled`, `delivered`, `returned`.
- `subtotal_da`.
- `shipping_da`.
- `total_da`.
- `currency`: `DZD`.
- `items_json`.
- `upsell_json`.
- `utm_json`.
- `landing_page`.
- `referrer`.
- `user_agent`.
- `ip_address`.
- `event_ids_json`.
- `sheet_synced_at`.
- `tracking_synced_at`.
- `raw_payload_json`.

Events table:

- `id` UUID primary key.
- `order_id`.
- `platform`: `meta`, `tiktok`, `snap`.
- `event_name`.
- `event_id`.
- `payload_json`.
- `response_json`.
- `success`.
- `created_at`.

## Validation

Backend must revalidate:

- Customer name: 2-80 characters.
- Phone: Algerian mobile only.
- Items: existing product IDs only.
- Offer price must match server-side product config.
- Upsell price must be exactly `999 دج` when accepted.
- Currency is always `DZD`.

Never trust frontend prices.

## Order Flow

1. Frontend validates checkout.
2. Frontend shows upsell.
3. Frontend submits final order to backend.
4. Backend normalizes phone.
5. Backend calculates totals from server product config.
6. Backend saves order.
7. Backend sends Google Sheet webhook.
8. Backend sends CAPI events with hashed customer data.
9. Backend returns success.
10. Frontend redirects to `/thank-you`.

If sheet or tracking fails:

- Do not fail the order if the database save succeeded.
- Store failure response in events/logs.
- Return order success with a warning only in server logs.

## Google Sheet Webhook

Backend env:

```env
GOOGLE_SHEET_WEBHOOK_URL=
GOOGLE_SHEET_WEBHOOK_SECRET=
```

Send:

- `x-shefaa-secret` header.
- JSON body matching `sheet-order-columns.csv`.

## Backend Env Example

Create `backend/.env.example`:

```env
ENVIRONMENT=production
PROJECT_NAME=Shefaa API
BACKEND_CORS_ORIGINS=https://shefaa.shop

DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/shefaa_webset

GOOGLE_SHEET_WEBHOOK_URL=
GOOGLE_SHEET_WEBHOOK_SECRET=

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=

SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=

SUPABASE_JWT_SECRET=
```

Production note:

- Put the real EasyPanel internal Postgres URL into `DATABASE_URL`.
- Convert `postgres://` to an SQLAlchemy async URL if needed: `postgresql+asyncpg://`.
- Keep credentials only in EasyPanel, never in GitHub.

## Migrations on Start

On backend container start:

1. Run `alembic upgrade head`.
2. Start the API server.

Use an entrypoint script:

```sh
#!/bin/sh
set -e
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## CORS

Allow only:

- `https://shefaa.shop`
- local dev URLs.

Do not use wildcard CORS in production.

## Docker

Backend Dockerfile:

- Install Python dependencies.
- Copy app.
- Run migrations on startup.
- Expose port `8000`.

EasyPanel:

- Frontend service domain: `shefaa.shop`.
- Backend service domain: `api.shefaa.shop`.
- Backend connects to existing Postgres service by internal hostname.
