# Google Apps Script Webhook

Use this script in the Google Sheet that receives COD orders.

## Setup

1. Create a Google Sheet.
2. Add the columns from `sheet-order-columns.csv` to the first row.
3. Open Extensions > Apps Script.
4. Paste the script below.
5. Set Script Property:
   - `SHEFAA_WEBHOOK_SECRET`
6. Deploy as Web App:
   - Execute as: Me.
   - Who has access: Anyone.
7. Add the deployment URL to backend env:
   - `GOOGLE_SHEET_WEBHOOK_URL`
8. Add the same secret to backend env:
   - `GOOGLE_SHEET_WEBHOOK_SECRET`

## Apps Script Code

```javascript
const SHEET_NAME = "Orders";

function doPost(e) {
  try {
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("SHEFAA_WEBHOOK_SECRET");
    const receivedSecret = (e && e.parameter && e.parameter.secret) || getHeaderSecret_(e);

    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return json_({ ok: false, error: "unauthorized" }, 401);
    }

    const payload = JSON.parse(e.postData.contents || "{}");
    const sheet = getOrCreateSheet_();
    const headers = getHeaders_(sheet);
    const row = headers.map((header) => stringifyValue_(payload[header]));

    sheet.appendRow(row);

    return json_({ ok: true, order_id: payload.order_id || "" }, 200);
  } catch (error) {
    return json_({ ok: false, error: String(error) }, 500);
  }
}

function getHeaderSecret_(e) {
  // Apps Script does not reliably expose custom headers for all deployments.
  // Backend should send both x-shefaa-secret and ?secret=... as fallback.
  if (!e || !e.headers) return "";
  return e.headers["x-shefaa-secret"] || e.headers["X-Shefaa-Secret"] || "";
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "order_id",
      "created_at",
      "status",
      "customer_name",
      "phone_local",
      "phone_e164",
      "phone_capi_numeric",
      "items",
      "main_products",
      "offer_pieces",
      "subtotal_da",
      "shipping_da",
      "total_da",
      "upsell_accepted",
      "upsell_product",
      "upsell_price_da",
      "currency",
      "landing_page",
      "referrer",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "ttclid",
      "snap_click_id",
      "meta_event_id",
      "tiktok_event_id",
      "snap_event_id",
      "user_agent",
      "ip_address",
      "notes"
    ]);
  }

  return sheet;
}

function getHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function stringifyValue_(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function json_(data, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...data, statusCode }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Backend Sending Notes

Because Apps Script custom header access can be inconsistent, send the secret both ways:

- Header: `x-shefaa-secret`
- Query param: `?secret=<GOOGLE_SHEET_WEBHOOK_SECRET>`

Send only after the order is saved in Postgres.
