# 03 - UX and CRO Strategy

## Conversion Goal

Convert paid social traffic into high-AOV COD orders with strong confirmation probability.

Primary conversion:

1. Visitor lands from TikTok/Snapchat/Facebook.
2. Visitor chooses a product offer: 1, 2, or 3 pieces.
3. CTA adds the selected offer to cart and opens the slide-in cart.
4. Cart shows order summary, trust, scarcity, and relevant cross-sells.
5. Checkout popup collects only name and Algerian phone number.
6. Valid submission triggers a 10-15 second one-click upsell at `999 دج`.
7. Final order is sent to backend, Google Sheet webhook, database, and tracking APIs.
8. Thank-you page confirms that the team will call.

## Offer Ladder

Every main product uses:

- 1 piece: `1999 دج`
- 2 pieces: `2790 دج`
- 3 pieces: `3490 دج`

Default recommended option:

- 2 pieces for moderate trust.
- 3 pieces for beauty/supplement products where usage over time matters.

Badge examples:

- 1 piece: `للتجربة`
- 2 pieces: `الأكثر طلبا`
- 3 pieces: `أفضل قيمة`

Use per-piece anchoring:

- 1 piece: `1999 دج للقطعة`
- 2 pieces: `1395 دج للقطعة`
- 3 pieces: `1163 دج للقطعة`

Never discount the main offer elsewhere. The only discounted product appears in the post-submit upsell at `999 دج`.

## Page CRO Principles

Above the fold:

- Clear emotional promise.
- Product/brand visual.
- COD badge.
- Review stars.
- One primary CTA.
- Offer/benefit hint.

Trust before price:

- Start with story and natural purity.
- Show ingredients and usage.
- Then present offer cards.

Benefit-led copy:

- Do not sell "biotin gummies"; sell stronger hair confidence.
- Do not sell "marine collagen drink"; sell smoother-looking skin and daily beauty ritual.

Proof stack:

- Reviews with wilaya.
- Ingredient explanation.
- Packaging/quality badges.
- COD and confirmation process.
- FAQ for safety and delivery.

## Product Card Pattern

Each product card must include:

- Product image.
- Benefit headline in Arabic.
- Subheading with ingredient/product type.
- Star rating, e.g. `★★★★★ 4.8/5 من زبائن الشفاء`.
- Scarcity line.
- Price starts from `1999 دج`.
- CTA: `اختار العرض`.

Example:

> علكات البيوتين لشعر أقوى ومظهر أكثف  
> تركيبة يومية بنكهة لذيذة لدعم صحة الشعر  
> ★★★★★ 4.8/5 | دفع عند الاستلام  
> كمية محدودة من دفعة اليوم  
> ابتداء من 1999 دج  
> اختار العرض

## Product Page Structure

1. Hero with product image left and copy right on desktop, stacked on mobile.
2. Offer selector directly in hero.
3. Trust strip: COD, phone confirmation, natural ingredients, Algeria delivery.
4. Pain/emotion section.
5. Benefits grid.
6. Ingredients section with explanations.
7. How to use.
8. Alternating image/story sections.
9. Reviews and UGC placeholders.
10. FAQ.
11. Sticky mobile CTA and sticky desktop offer summary.
12. Related products and cross-sells.

CTA behavior:

- CTA adds selected offer to cart.
- Immediately opens cart drawer.
- Cart drawer includes relevant cross-sells.

## Cart Drawer

Cart must be slide-in, premium, and fast.

Elements:

- Product offer summary.
- Quantity/bundle details.
- Cross-sell cards with one-click add.
- Free delivery/bonus threshold if used later.
- Trust microcopy: `الدفع عند الاستلام بعد تأكيد الطلب`.
- CTA: `أكمل الطلب الآن`.

Cart cross-sell examples:

- Hair product cart: argan oil or collagen upsell.
- Collagen cart: shea butter or argan oil.
- Honey cart: sesame seeds or desert herb tea.
- Energy supplement cart: honey with nuts.

## Checkout Popup

Fields:

- Full name.
- Algerian phone number only.

Phone validation:

- Accept Algerian mobile numbers: `05`, `06`, `07` followed by 8 digits.
- Normalize to local display: `0XXXXXXXXX`.
- Normalize for server tracking: `+213XXXXXXXXX` and `213XXXXXXXXX` depending on platform requirements.
- Reject spaces-only, foreign, short, and landline numbers.

Checkout UI:

- Order summary visible.
- Scarcity/trust line.
- Social proof line.
- CTA: `أكد طلبي الآن`.
- Microcopy: `سنتصل بك لتأكيد الطلب قبل الإرسال`.

## Post-Submit Upsell

After a valid checkout submit:

- Show a 10-15 second upsell screen before final thank you.
- Offer one relevant add-on at `999 دج`.
- One-click buttons:
  - `أضفها لطلبي بـ 999 دج`
  - `لا شكرا، أكمل طلبي`

Rules:

- Only use discount here.
- Keep it relevant.
- If user accepts, update order total before sending final confirmation.
- If user skips, send original order.

## Thank You Page

Must include:

- `تم استلام طلبك بنجاح`
- Order summary.
- Phone confirmation reminder.
- Expected next step: `فريق الشفاء سيتصل بك لتأكيد الطلب`.
- Trust note: `الدفع يكون عند الاستلام`.
- Recommended content or products, but no aggressive selling.

## Delivery and Confirmation Quality

Add backend fields for confirmation team:

- Customer name.
- Phone normalized local and international.
- Wilaya if later added.
- Product and offer.
- Upsell accepted.
- Source/UTM.
- Event IDs.
- User agent/IP.
- Notes.

Frontend should capture UTM parameters and persist in local storage for the order.
