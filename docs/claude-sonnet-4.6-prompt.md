# Claude Sonnet 4.6 Implementation Prompt

Copy this prompt into Claude Sonnet 4.6 after pushing/opening this repo.

```text
You are Claude Sonnet 4.6 acting as a world-class senior full-stack engineer, CRO expert, UI/UX designer, and DTC e-commerce growth engineer.

Build shefaa.shop from the docs in this repository.

Brand:
- Arabic name: الشفاء
- English name: shefaa
- Domain: https://shefaa.shop
- Backend: https://api.shefaa.shop
- Market: Algeria, Arabic RTL, COD-first
- Positioning: premium desert wellness brand inspired by Algerian desert herbs, traditional medicine, natural ingredients, honey, oils, shea butter, argan oil, sesame, and wellness supplements.

Read these files first and follow them as the source of truth:
- docs/README.md
- docs/01-brand-context.md
- docs/02-brand-identity.md
- docs/03-ux-cro-strategy.md
- docs/04-site-map-and-page-specs.md
- docs/05-product-copy-and-offers.md
- docs/06-frontend-architecture.md
- docs/07-backend-architecture.md
- docs/08-tracking-analytics-pixels.md
- docs/09-deployment-env-and-docker.md
- docs/10-ai-coder-rules.md
- docs/seed-products.csv
- docs/sheet-order-columns.csv
- docs/google-apps-script-webhook.md

Deliver exactly:
- frontend/ built with Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Hook Form, Zod, and optional Radix primitives.
- backend/ built with Python FastAPI, SQLAlchemy async, Alembic, PostgreSQL, Pydantic v2, and httpx.
- Dockerfile for frontend.
- Dockerfile for backend.
- docker-compose files if useful for local development.
- .env.example for frontend and backend.
- Backend migrations that run on startup.
- Google Sheet webhook integration from backend.
- Pixel and CAPI scaffolding for Meta, TikTok, and Snapchat with deduplication.

Critical behavior:
- Do not build a generic store. It must feel like a premium branded desert wellness store.
- Arabic RTL first.
- COD checkout must require only name and Algerian mobile phone number.
- Validate Algerian mobile numbers only: 05/06/07 plus 8 digits, while accepting +213/213/00213 variants and normalizing them.
- Main offers for each product:
  - 1 piece: 1999 DA
  - 2 pieces: 2790 DA
  - 3 pieces: 3490 DA
- CTA on product page adds selected offer to cart and opens the cart drawer.
- Cart drawer must show relevant cross-sells.
- Cart CTA opens checkout popup.
- Checkout popup shows order summary, social proof, scarcity, and only two fields: name and phone.
- After valid checkout input, show a 10-15 second one-click upsell for one relevant product at 999 DA.
- Only discount products in this upsell step.
- Thank-you page confirms the order and tells the customer the team will call.
- Save order to Postgres and send it to the Google Sheet webhook.
- Never trust frontend prices; backend recalculates totals from server config.
- Include UTM/click ID capture.
- Defer web pixels for speed.
- Send server-side CAPI events with SHA256-hashed normalized phone data.
- Deduplicate browser and server events with the same event_name and event_id.
- Never commit real secrets. Use env examples only.

Design:
- Use the palette and typography from docs/02-brand-identity.md.
- Header logo should use a circular mark with الشفاء inside, plus text logo الشفاء and shefaa.
- Premium warm desert visual style.
- Use sample placeholder images now. I will replace images later.
- Desktop sections should alternate image/text layouts where appropriate.
- Mobile must be excellent and fast.

Pages:
- Home
- Products collection
- Product detail pages
- About
- Contact
- Thank-you
- Basic privacy/terms/shipping placeholders if needed for footer trust

Before finishing:
- Run lint/type checks/tests available in the project.
- Verify frontend builds.
- Verify backend imports/startup path and migrations.
- Summarize how to deploy on EasyPanel and what env variables I need to add.
```
