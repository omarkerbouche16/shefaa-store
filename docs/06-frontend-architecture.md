# 06 - Frontend Architecture

## Stack

Use:

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Framer Motion.
- Zustand for cart/checkout state.
- TanStack Query for API mutations/queries if needed.
- React Hook Form + Zod for checkout validation.
- Next Image.
- `next/font` for Arabic fonts.

Optional:

- Radix UI primitives for accessible dialogs, drawers, tabs, and accordions.
- Embla Carousel for product image galleries.

Do not use a heavy UI kit that makes the store look generic.

## Folder Structure

Create:

```text
frontend/
  app/
    layout.tsx
    page.tsx
    products/
      page.tsx
      [slug]/
        page.tsx
    about/page.tsx
    contact/page.tsx
    thank-you/page.tsx
  components/
    brand/
    cart/
    checkout/
    common/
    product/
    sections/
    tracking/
  config/
    brand.ts
    products.ts
    offers.ts
  lib/
    api.ts
    money.ts
    phone.ts
    tracking.ts
    utm.ts
  store/
    cart-store.ts
    checkout-store.ts
  types/
    commerce.ts
    tracking.ts
  public/
    images/
      placeholders/
  Dockerfile
  docker-compose.yml
  .env.example
```

## Core Components

Brand:

- `Logo`
- `Header`
- `Footer`
- `TrustBadges`

Product:

- `ProductCard`
- `OfferSelector`
- `ProductGallery`
- `IngredientCard`
- `ReviewCard`
- `ProductFAQ`
- `StickyProductCTA`

Cart:

- `CartDrawer`
- `CartLineItem`
- `CartCrossSell`
- `CartSummary`

Checkout:

- `CheckoutModal`
- `PhoneInput`
- `OrderSummary`
- `UpsellModal`
- `ThankYouSummary`

Tracking:

- `PixelProvider`
- `DeferredPixelScripts`

Sections:

- `HeroSection`
- `StorySection`
- `BenefitsGrid`
- `FeaturedProducts`
- `Testimonials`
- `FAQSection`
- `FinalCTA`

## State Model

Cart item:

```ts
type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  offer: {
    pieces: 1 | 2 | 3;
    priceDa: number;
    label: string;
  };
  quantity: number;
  source: "product_page" | "collection" | "cart_cross_sell" | "upsell";
};
```

Order payload:

```ts
type CreateOrderPayload = {
  customerName: string;
  phoneLocal: string;
  phoneE164: string;
  items: CartItem[];
  subtotalDa: number;
  upsell?: {
    productId: string;
    priceDa: 999;
    accepted: boolean;
  };
  utm: Record<string, string | null>;
  landingPage: string;
  eventIds: {
    initiateCheckout?: string;
    purchase: string;
  };
};
```

## Phone Validation

Create `lib/phone.ts`:

- Strip spaces, dashes, parentheses.
- Accept local: `05XXXXXXXX`, `06XXXXXXXX`, `07XXXXXXXX`.
- Accept international user input: `+2135XXXXXXXX`, `2135XXXXXXXX`, `002135XXXXXXXX`.
- Normalize local to `0XXXXXXXXX`.
- Normalize E.164 to `+213XXXXXXXXX`.
- Normalize CAPI numeric phone to `213XXXXXXXXX`.

Show Arabic error:

`اكتب رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07.`

## Performance Requirements

- Use server components by default.
- Use client components only for cart, checkout, interactive product selectors, tracking, and motion.
- Defer pixel scripts until after hydration or first idle period.
- Use dynamic imports for heavy modals if needed.
- Use `next/image` with responsive sizes.
- Set image placeholders and dimensions to avoid layout shift.
- Keep initial JS small.
- Avoid large animation libraries beyond Framer Motion.
- Respect `prefers-reduced-motion`.

## SEO Basics

- Arabic metadata for each route.
- Product pages need title, description, Open Graph image, canonical URL.
- JSON-LD:
  - Organization.
  - Product.
  - BreadcrumbList.
  - FAQPage where relevant.
- Sitemap and robots.
- Domain: `https://shefaa.shop`.

## Frontend Env Example

Create `frontend/.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://shefaa.shop
NEXT_PUBLIC_API_BASE_URL=https://api.shefaa.shop

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Authentication requirement:

- User requested Supabase login/signup.
- Implement Supabase auth only for customer account pages if included.
- Do not block COD checkout behind login. Guest checkout must stay primary.

## Docker

Use a production Dockerfile:

- Install dependencies.
- Build Next.js.
- Start with `next start`.
- Expose port `3000`.

Use environment variables from EasyPanel.
