# 04 - Site Map and Page Specs

## Routes

Frontend routes:

- `/` home page
- `/products` collection page
- `/products/[slug]` product page
- `/about` about page
- `/contact` contact page
- `/thank-you` thank-you page
- Optional later: `/privacy`, `/terms`, `/shipping`

API routes live on the backend at `https://api.shefaa.shop`.

## Global Layout

Use RTL layout by default.

Global elements:

- Sticky header.
- Cart drawer.
- Checkout modal.
- Upsell modal.
- Footer.
- Pixel event provider.
- Toast/notification provider.

Header:

- Logo area: circular `الشفاء` mark plus text logo `الشفاء` and `shefaa`.
- Menu: الرئيسية، المنتجات، قصتنا، تواصل معنا.
- Cart button.
- Mobile menu.

Footer:

- Brand story.
- Navigation.
- Product categories.
- Contact links.
- COD/delivery badges.
- Social links.
- Disclaimer.
- Privacy/terms placeholders.

## Home Page

Goal: position Shefaa as a premium trusted desert wellness brand and route users into best-selling products.

Sections:

1. Hero
   - Right: Arabic headline, emotional subheadline, CTA.
   - Left: premium desert/product visual placeholder.
   - Include trust badges and star rating.
   - CTA: `تسوق عروض الشفاء`.

2. Trust Strip
   - دفع عند الاستلام
   - تأكيد الطلب بالهاتف
   - مكونات طبيعية
   - توصيل داخل الجزائر

3. Brand Story
   - Desert heritage, traditional medicine, natural purity.
   - Alternating layout with image and text.

4. Problem/Solution
   - Hair, skin, energy, memory, daily wellness.
   - Speak to emotional pain without illegal medical claims.

5. Featured Products
   - Biotin gummies.
   - Marine collagen drink.
   - Honey with nuts.
   - Argan oil.
   - Shea butter.
   - Desert herbs.

6. Ingredient Authority
   - Short cards for ashwagandha, khuzama, arak, argan, honey, sesame.
   - Explain traditional use plus modern nutritional role.

7. Offer Banner
   - `خذي أكثر ووفر أكثر`
   - Show 1/2/3 piece ladder.

8. Testimonials
   - Algerian names and wilayas.
   - UGC placeholders.

9. FAQ
   - COD, delivery, usage, safety.

10. Final CTA
   - Product bundle grid or direct CTA to collection.

## Collection Page

Goal: help users choose quickly.

Sections:

- Page hero: `منتجات طبيعية مختارة من الشفاء`.
- Category filters:
  - الشعر
  - البشرة
  - الطاقة والتركيز
  - العسل والأغذية الطبيعية
  - الزيوت والزبدة
  - أعشاب الصحراء
- Product grid.
- Trust banner after every 6 products.
- FAQ and delivery reassurance.

Product cards must include benefit headline, rating, scarcity, price ladder hint, CTA.

## Product Page

Goal: sell one product deeply and increase AOV.

Hero:

- Product image.
- H1 in Arabic.
- Benefit subheading.
- Rating and review count.
- Offer selector.
- CTA: `أضف العرض للسلة`.
- Trust line.

Sections:

- Why this product.
- Benefits.
- Ingredients.
- How to use.
- What customers say.
- Before/after or UGC placeholders if real assets are available later.
- Safety and who should ask a doctor.
- FAQ.
- Related products.

Sticky behavior:

- Mobile sticky CTA at bottom.
- Desktop sticky mini summary can appear after scrolling past hero.

## About Page

Goal: build brand trust.

Sections:

- Brand origin: desert inspiration and traditional Algerian wellness.
- Mission: natural daily wellness, honest explanations, COD trust.
- Quality process:
  - supplier verification
  - hygienic packaging
  - batch checks
  - clear usage instructions
- Founder/brand note placeholder.
- Values:
  - النقاء
  - الثقة
  - البساطة
  - احترام التقاليد
- CTA to products.

## Contact Page

Goal: reduce anxiety and support COD shoppers.

Sections:

- Contact form placeholder.
- WhatsApp/phone/social placeholders.
- Delivery and order confirmation explanation.
- FAQ.

Fields:

- Name.
- Phone.
- Message.

## Thank You Page

Goal: reassure, reduce cancellations, and prepare for confirmation call.

Sections:

- Success message.
- Order summary.
- `خلي هاتفك قريب، فريقنا يتصل بك لتأكيد الطلب`.
- Payment reminder: COD.
- Delivery note.
- Support contact.

Track `Purchase` only when final order is accepted by backend. Track `Lead` or `CompleteRegistration` only if needed, but primary purchase event should be deduplicated with backend CAPI.
