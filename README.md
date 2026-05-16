# شفاء — shefaa.shop

Premium Arabic DTC wellness store for Algeria. COD-first, RTL, desert wellness brand.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand |
| Backend | Python 3.12, FastAPI, SQLAlchemy async, Alembic, PostgreSQL |
| Deployment | EasyPanel (Docker) |

## Local Development

### Requirements
- Node.js 20+
- Python 3.12+
- PostgreSQL (or Docker)

### With Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs

### Frontend only

```bash
cd frontend
cp .env.example .env.local
# fill in NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm install
npm run dev
```

### Backend only

```bash
cd backend
cp .env.example .env
# fill in DATABASE_URL
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
frontend/          Next.js App Router
  app/             Pages (RTL, Arabic)
  components/      Brand, product, cart, checkout, sections, tracking
  config/          Products, offers, brand config
  lib/             phone.ts, money.ts, utm.ts, api.ts, tracking.ts
  store/           Zustand: cart-store, checkout-store
  types/           TypeScript types

backend/           FastAPI
  app/
    core/          Settings, security, logging
    db/            SQLAlchemy session + base
    models/        orders, tracking_events
    schemas/       Pydantic v2 request/response
    api/routes/    health, orders, tracking
    services/      orders, phone, hashing, sheet_webhook,
                   tracking_meta, tracking_tiktok, tracking_snap
  alembic/         DB migrations
```

## Conversion Flow

1. Product page → select offer (1/2/3 pieces)
2. Add to cart → cart drawer opens with cross-sells
3. "أكمل الطلب" → checkout modal (name + phone only)
4. Submit → 12-second upsell (999 DA product)
5. Accept/skip → POST `/api/orders` → backend validates + saves
6. Redirect to `/thank-you`

## Environment Variables

### Frontend (`frontend/.env.example`)

```env
NEXT_PUBLIC_SITE_URL=https://shefaa.shop
NEXT_PUBLIC_API_BASE_URL=https://api.shefaa.shop
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Backend (`backend/.env.example`)

```env
ENVIRONMENT=production
PROJECT_NAME=Shefaa API
BACKEND_CORS_ORIGINS=["https://shefaa.shop"]
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

## EasyPanel Deployment

### Services to create

| Service | Type | Domain |
|---|---|---|
| `shefaa-postgres` | PostgreSQL | internal only |
| `shefaa-backend` | App (Docker) | api.shefaa.shop |
| `shefaa-frontend` | App (Docker) | shefaa.shop |

### Steps

1. **Create PostgreSQL service** named `shefaa-postgres`, database `shefaa_webset`.
2. **Create backend service** from this repo `/backend` directory.
   - Set `DATABASE_URL` to the internal Postgres URL from EasyPanel
     (format: `postgresql+asyncpg://USER:PASS@shefaa-postgres:5432/shefaa_webset`)
   - Set all other env vars from the table below.
   - Domain: `api.shefaa.shop`
3. **Create frontend service** from `/frontend` directory.
   - Set `NEXT_PUBLIC_API_BASE_URL=https://api.shefaa.shop`
   - Domain: `shefaa.shop`

### Backend env vars to set in EasyPanel

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://USER:PASS@INTERNAL_HOST:5432/shefaa_webset` |
| `BACKEND_CORS_ORIGINS` | `["https://shefaa.shop"]` |
| `GOOGLE_SHEET_WEBHOOK_URL` | Your Apps Script web app URL |
| `GOOGLE_SHEET_WEBHOOK_SECRET` | Any strong random string |
| `META_PIXEL_ID` | From Meta Events Manager |
| `META_ACCESS_TOKEN` | Meta CAPI system user token |
| `META_TEST_EVENT_CODE` | Only for testing, remove in prod |
| `TIKTOK_PIXEL_CODE` | From TikTok Ads Manager |
| `TIKTOK_ACCESS_TOKEN` | TikTok Events API token |
| `SNAP_PIXEL_ID` | From Snap Ads Manager |
| `SNAP_ACCESS_TOKEN` | Snap Conversions API token |

### Frontend env vars to set in EasyPanel

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://shefaa.shop` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.shefaa.shop` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Same as backend `META_PIXEL_ID` |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Same as backend `TIKTOK_PIXEL_CODE` |
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | Same as backend `SNAP_PIXEL_ID` |

## Google Sheet Webhook Setup

1. Create a Google Sheet with an "Orders" tab.
2. Open **Extensions → Apps Script**, paste the code from `docs/google-apps-script-webhook.md`.
3. Set Script Property `SHEFAA_WEBHOOK_SECRET` to the same value as `GOOGLE_SHEET_WEBHOOK_SECRET`.
4. Deploy as **Web App** (Execute as: Me, Access: Anyone).
5. Copy the web app URL → `GOOGLE_SHEET_WEBHOOK_URL` in EasyPanel.

## Phone Validation

Algerian mobile numbers only: `05/06/07` + 8 digits.

Accepts all variants:
- `0612345678`
- `+213612345678`
- `213612345678`
- `00213612345678`

Error shown to user: `اكتب رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07.`

## Tracking & CAPI

- Browser pixels deferred with `afterInteractive` strategy
- Event IDs generated client-side (UUID) and shared with backend for deduplication
- Backend hashes phone with SHA256 before sending to Meta/TikTok/Snap
- Tracking failures never block order creation

## Launch Checklist

- [ ] Add real product images (replace placeholder gradients)
- [ ] Fill Meta/TikTok/Snap pixel IDs and access tokens
- [ ] Set up Google Sheet and Apps Script webhook
- [ ] Test full checkout flow end-to-end
- [ ] Verify pixel events in platform test tools
- [ ] Confirm order appears in Postgres and Google Sheet
- [ ] Review all Arabic copy for medical claims (must use يدعم/يساعد على)
- [ ] Enable SSL on both domains in EasyPanel
