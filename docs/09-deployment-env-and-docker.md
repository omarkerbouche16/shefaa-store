# 09 - Deployment, Env, and Docker

## Target Deployment

Platform:

- EasyPanel.

Services:

- `frontend` at `https://shefaa.shop`.
- `backend` at `https://api.shefaa.shop`.
- Existing PostgreSQL database service.

Database:

- DB name: `shefaa_webset`.
- Store full connection URL in backend EasyPanel env as `DATABASE_URL`.
- Never commit the real database URL or password.

## Repository Structure

Final repo should contain:

```text
frontend/
backend/
docs/
README.md
.gitignore
```

## Frontend Docker

Requirements:

- Build Next.js app.
- Expose `3000`.
- Use production env variables from EasyPanel.

Example behavior:

```text
npm ci
npm run build
npm run start
```

## Backend Docker

Requirements:

- Install Python deps.
- Run Alembic migrations on startup.
- Expose `8000`.

Example startup:

```text
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Environment Variables

Frontend:

```env
NEXT_PUBLIC_SITE_URL=https://shefaa.shop
NEXT_PUBLIC_API_BASE_URL=https://api.shefaa.shop
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Backend:

```env
ENVIRONMENT=production
PROJECT_NAME=Shefaa API
BACKEND_CORS_ORIGINS=https://shefaa.shop
DATABASE_URL=
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

## Google Sheet

Use:

- `sheet-order-columns.csv` as sheet header template.
- `google-apps-script-webhook.md` for Apps Script code.

Security:

- Apps Script must check `x-shefaa-secret`.
- Backend must send the same secret.

## GitHub Readiness

Add `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
node_modules
.next
dist
__pycache__
.pytest_cache
.venv
*.pyc
```

Do not commit:

- Real env files.
- Database URL.
- Access tokens.
- Pixel access tokens.
- Google webhook secret.

## Launch Checklist

Before production ads:

- Frontend loads quickly on mobile 4G.
- All product pages are responsive.
- Cart drawer and checkout modal work on mobile.
- Algerian phone validation works.
- Test order reaches backend.
- Test order reaches Google Sheet.
- Browser pixels fire.
- CAPI events fire.
- Purchase dedup works.
- Thank-you page displays order summary.
- Privacy/disclaimer pages exist, even if simple.
- All medical claims reviewed and softened.
