var SHEET_NAME = "Orders";

var COLUMNS = [
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
    var payload = JSON.parse(e.postData.contents || "{}");
    var sheet = getOrCreateSheet_();

    var row = COLUMNS.map(function(col) {
      var val = payload[col];
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);

    var headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
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
