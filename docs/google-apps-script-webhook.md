# Google Apps Script Webhook

Receives COD orders from the Shefaa backend and appends them to a Google Sheet.

## Sheet Column Structure

| Column | Example |
|---|---|
| date | 01/05/2026 |
| order id | SHEFA1A2B3C4D |
| country | Algeria |
| name | فاطمة بن علي |
| phone | 0696799755 |
| product | علكات البيوتين/زيت الأرغان |
| sku | SHF-BTN-001/SHF-ARG-005 |
| quantity | 3/2 |
| status | *(left empty — fill manually)* |
| totalprice | 6280 |

## Setup Instructions

1. Create a new Google Sheet.
2. In the first row add these exact headers (row 1):
   ```
   date | order id | country | name | phone | product | sku | quantity | status | totalprice
   ```
3. Open **Extensions → Apps Script**.
4. Delete any existing code, paste the script below.
5. Click **Save** (floppy disk icon).
6. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy** and copy the Web App URL.
8. Add the URL to your backend environment variable:
   ```
   GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```

---

## Apps Script Code

```javascript
const SHEET_NAME = "Orders";

// Column order must match the sheet header exactly
const COLUMNS = [
  "date",
  "order id",
  "country",
  "name",
  "phone",
  "product",
  "sku",
  "quantity",
  "status",
  "totalprice"
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const sheet = getOrCreateSheet_();

    const row = COLUMNS.map(function(col) {
      const val = payload[col];
      if (val === null || val === undefined) return "";
      return String(val);
    });

    sheet.appendRow(row);

    return json_({ ok: true, order_id: payload["order id"] || "" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Write header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);

    // Style the header row
    const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
    headerRange.setBackground("#3F4A2F");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Backend Environment Variable

Add only this one variable (no secret needed):

```env
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Product SKUs Reference

| Product | ID | SKU |
|---|---|---|
| علكات البيوتين | biotin-gummies | SHF-BTN-001 |
| كولاجين بحري | marine-collagen | SHF-MCL-002 |
| عسل بالمكسرات | honey-nuts | SHF-HNY-003 |
| زبدة الشيا | shea-butter | SHF-SHB-004 |
| زيت الأرغان | argan-oil | SHF-ARG-005 |
| جلجلان طبيعي | sesame-seeds | SHF-SES-006 |
| أعشاب الصحراء | desert-herbs | SHF-HRB-007 |
| أشواغاندا | ashwagandha | SHF-ASH-008 |
