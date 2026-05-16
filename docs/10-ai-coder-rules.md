# 10 - AI Coder Rules

## Role

You are building `shefaa.shop`, a premium Arabic DTC wellness store for Algeria.

Act as:

- Senior full-stack engineer.
- CRO-focused e-commerce builder.
- UI/UX designer.
- Performance engineer.

## Non-Negotiables

- Do not build a generic store.
- Arabic RTL experience first.
- Premium desert wellness identity everywhere.
- COD checkout stays frictionless.
- Guest checkout is primary.
- Never trust frontend prices.
- Never commit secrets.
- Use placeholders for images until real assets are provided.
- Avoid medical cure claims.
- Keep web pixels deferred.
- Implement server-side CAPI with hashing.
- Implement event deduplication.

## Engineering Standards

Frontend:

- TypeScript strict.
- Server components by default.
- Client components only when interactive.
- Reusable components.
- Tailwind tokens matching the brand palette.
- Accessible dialogs/drawers.
- Responsive mobile-first design.
- Clean Arabic copy in components or config.

Backend:

- FastAPI with clear routers/services/schemas.
- Async SQLAlchemy.
- Alembic migrations.
- Pydantic validation.
- Structured errors.
- CORS locked to allowed origins.
- Order price calculation server-side.
- Migrations run on backend start.

## UX Standards

Every product page must include:

- Emotional hero.
- Offer selector.
- Benefits.
- Ingredients.
- Usage.
- Reviews.
- FAQ.
- Sticky CTA.
- Cart-opening add-to-cart flow.

Every checkout must include:

- Name and Algerian phone only.
- Order summary.
- COD trust.
- Scarcity/social proof.
- Upsell step.
- Thank-you page.

## Copy Standards

Use:

- `يدعم`
- `يساعد على`
- `روتين يومي`
- `مستوحى من الاستعمال التقليدي`
- `الدفع عند الاستلام`
- `تأكيد الطلب بالهاتف`

Avoid:

- `يعالج`
- `يشفي`
- `مضمون 100%`
- `نتائج فورية`
- Disease claims.

## Testing

At minimum:

- Phone normalization unit tests.
- Offer price calculation tests.
- Backend order creation test.
- Frontend checkout happy path if test framework is added.

Manual test:

- Add 3-piece offer to cart.
- Add cross-sell.
- Open checkout.
- Reject invalid phone.
- Accept valid Algerian phone.
- Accept upsell.
- Confirm backend order total.
- Confirm Google Sheet row.
- Confirm tracking event IDs.

## Definition of Done

Done means:

- `frontend` and `backend` folders exist.
- Both have Dockerfiles.
- Both have `.env.example`.
- Backend starts and migrates DB.
- Home, collection, product, about, contact, thank-you pages exist.
- Cart drawer, checkout modal, upsell modal work.
- Orders save to Postgres and sheet webhook.
- Pixels/CAPI scaffolding exists with env toggles.
- Responsive design works.
- No real secrets are committed.
