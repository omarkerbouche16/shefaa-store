# 08 - Tracking, Analytics, Pixels, and CAPI

## Goals

Track paid social traffic accurately while keeping the site fast.

Platforms:

- Meta Pixel + Meta Conversions API.
- TikTok Pixel + TikTok Events API.
- Snapchat Pixel + Snapchat Conversions API.

Core events:

- `PageView`
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Purchase`
- Optional: `Lead` for checkout form submit if `Purchase` happens later.

## Speed Rules

- Defer browser pixels.
- Load pixels after hydration using `requestIdleCallback`, `setTimeout`, or Next script strategy that does not block rendering.
- Do not block add-to-cart or checkout UX on pixel success.
- If ad blockers block browser events, backend CAPI still sends server events.

## Event IDs and Deduplication

Generate a UUID `event_id` on the frontend for important events:

- `add_to_cart_event_id`
- `initiate_checkout_event_id`
- `purchase_event_id`

For deduplication:

- Browser and server events must share the same `event_name`.
- Browser and server events must share the same `event_id`.
- Send `event_id` to the backend with the order.
- Store event IDs in the order.

Meta specifically recommends sending redundant browser + server events and using identical `event_name` plus `event_id` for deduplication.

## User Data Normalization

Frontend:

- Validate phone but do not hash for CAPI.
- Send normalized phone to backend only over HTTPS.

Backend:

- Normalize.
- Hash with SHA256 lowercase hex.
- Send hashed PII to server-side APIs.

Algerian phone formats:

- Local: `05XXXXXXXX`, `06XXXXXXXX`, `07XXXXXXXX`.
- E.164: `+2135XXXXXXXX`, `+2136XXXXXXXX`, `+2137XXXXXXXX`.
- Numeric for hashing/platforms that remove plus: `2135XXXXXXXX`.

Meta:

- Phone matching parameter is `ph`.
- Hashing required.
- Remove symbols, letters, and leading zeros.
- Include country code.
- Example Algeria format before hashing: `213XXXXXXXXX`.
- Also send `client_ip_address` and `client_user_agent` when available.

TikTok:

- Send hashed phone where supported as lowercase SHA256.
- Phone should include country code.
- For display/normalization use E.164 with `+`, but hash a normalized platform-compatible value in backend.
- Include `event_id` for dedup where supported.

Snap:

- Phone parameter is commonly `ph`.
- Normalize before hashing:
  - include country code
  - remove `+`
  - remove non-numeric characters
  - remove leading local zero
- Example Algeria format before hashing: `213XXXXXXXXX`.
- SHA256 lowercase hex.

## Browser Events

PageView:

- Fire once after page load.

ViewContent:

- Fire on product page.
- Include product ID, name, category, value, currency.

AddToCart:

- Fire when selected offer is added.
- Include value, currency, contents, content IDs.

InitiateCheckout:

- Fire when checkout modal opens or checkout CTA clicked.
- Include current cart value and event ID.

Purchase:

- Fire only after backend confirms order success.
- Use the same `purchase_event_id` submitted to backend.

## Server Events

Send after order creation:

- Meta `Purchase`.
- TikTok purchase/complete payment equivalent.
- Snap purchase event.

Payload essentials:

- `event_name`
- `event_time`
- `event_id`
- `action_source`: website where required.
- `event_source_url`
- `user_data`:
  - hashed phone
  - client IP
  - user agent
  - fbp/fbc if available for Meta
  - ttclid/ttp if available for TikTok
  - sc_click_id if available for Snap
- `custom_data`:
  - currency `DZD`
  - value
  - content IDs
  - contents
  - order ID

## Click IDs and Cookies

Capture and persist:

- UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- Meta: `fbclid`, `_fbp`, `_fbc`.
- TikTok: `ttclid`, `_ttp`.
- Snap: `ScCid`, `sc_click_id` if present.

Store in local storage and submit with order.

## Backend Tracking Services

Create separate services:

- `tracking_meta.py`
- `tracking_tiktok.py`
- `tracking_snap.py`

Each service:

- Builds payload.
- Sends event.
- Stores response in `events` table.
- Handles test codes in development.
- Does not throw order-breaking errors if the platform is down.

## Privacy and Compliance

Footer must include:

- Privacy policy placeholder.
- Tracking/cookies note.
- Natural product disclaimer.

Do not expose:

- Access tokens.
- CAPI tokens.
- Sheet webhook secret.

## Test Plan

Before launch:

- Check browser pixel helper tools for PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
- Check Meta test events with `META_TEST_EVENT_CODE`.
- Check server logs for CAPI success.
- Confirm `event_id` matches between browser Purchase and server Purchase.
- Submit a COD test order and verify it appears in:
  - Postgres.
  - Google Sheet.
  - Platform event manager test tools.
