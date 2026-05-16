# 02 - Brand Identity

## Design Direction

Premium Desert Wellness Brand.

The site should feel:

- Warm, natural, trustworthy, elevated.
- Inspired by desert sand, herbs, honey, clay, argan oil, and traditional apothecary shelves.
- Modern enough for 2026 DTC conversion, but rooted enough to feel Algerian and local.

Avoid:

- Generic Shopify template look.
- Neon health colors.
- Medical clinic coldness.
- Too many stock images of foreign wellness models.

## Logo Direction

Header concept:

- A circular brand mark using the primary brand color.
- Inside the circle: `الشفاء`.
- Next to the circle: text logo.
- Main text: `الشفاء`.
- Small English text below or beside it: `shefaa`.

Logo should work on white, sand, and dark green backgrounds.

Use CSS text logo first. Replace with SVG later when a final mark is ready.

## Color Palette

Primary:

- Desert Olive: `#3F4A2F`
- Deep Date Brown: `#3A2418`
- Warm Sand: `#E8D5B5`
- Honey Gold: `#C88A2D`

Secondary:

- Palm Green: `#6F7E45`
- Clay Terracotta: `#A75F3B`
- Cream: `#FFF8EC`
- Charcoal Ink: `#1F1A16`

Functional:

- Success Green: `#227A4A`
- Warning Amber: `#B86B16`
- Error Red: `#B42318`
- Border Sand: `#D8C4A3`

Usage:

- Backgrounds: Cream and Warm Sand.
- Primary buttons: Desert Olive or Deep Date Brown.
- Offer highlights: Honey Gold.
- Premium accents: thin gold borders, subtle shadows, soft gradients.

## Typography

Use Arabic-first fonts.

Recommended stack:

- Arabic headings: `Noto Kufi Arabic` or `IBM Plex Sans Arabic`.
- Arabic body: `IBM Plex Sans Arabic` or `Noto Sans Arabic`.
- English small labels: `Inter`.

Implementation:

- Load with `next/font/google`.
- Use `dir="rtl"` globally for Arabic pages.
- Keep numbers readable. Use `DA` or `دج` consistently.

Typography scale:

- Hero H1 desktop: 56-72px, bold, tight line height.
- Hero H1 mobile: 34-42px.
- Section H2: 32-44px.
- Body: 16-18px.
- Product price: 24-32px bold.
- Trust microcopy: 13-14px.

## Visual Style

Imagery:

- Desert dunes, herbs in hand, honey texture, argan/shea closeups, glass jars, linen, clay bowls.
- Use sample placeholders now, but create components that can swap image URLs later.
- Product pages need 3-4 images: hero packshot, ingredient closeup, usage/lifestyle, proof/packaging.

Sample image strategy:

- Use local placeholder components with gradients and labels.
- Store images in `frontend/public/images/placeholders/`.
- Use Next Image for all real images.

UI:

- Rounded cards: 20-28px.
- Buttons: pill or soft rounded, bold.
- Shadows: soft and warm, never harsh.
- Dividers: subtle sand borders.
- Motion: elegant fade/slide, not flashy.

## Component Feel

Header:

- Sticky, blurred cream background after scroll.
- RTL menu: الرئيسية، المنتجات، عروض الباقات، قصتنا، تواصل معنا.
- Cart button visible and premium.

Cards:

- Product image, benefit headline, star rating, short proof line, offer price, scarcity line, CTA.
- Example scarcity: `باقي كمية محدودة من دفعة اليوم`.

Footer:

- Brand story, menus, contact, COD/delivery notes, disclaimer, social links.

Badges:

- `دفع عند الاستلام`
- `تأكيد الطلب بالهاتف`
- `مكونات طبيعية`
- `تغليف نظيف`
- `توصيل داخل الجزائر`

## Accessibility

- Color contrast must pass WCAG AA.
- Buttons need clear labels.
- Inputs need error states in Arabic.
- Motion must respect `prefers-reduced-motion`.
- Product CTAs must be reachable with keyboard.
