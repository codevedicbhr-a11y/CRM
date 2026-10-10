const SHEET_NAME = "CRM_Leads";
const HEADERS = ["id","name","company","phone","email","service","source","status","followup","value","owner","notes","createdAt","updatedAt"];

/**
 * Setup:
 * 1. Create a new Google Sheet.
 * 2. Extensions > Apps Script, replace the editor contents with this file.
 * 3. Run setupSheet() once and approve permissions.
 * 4. Deploy > New deployment > Web app.
 *    Execute as: Me | Who has access: Anyone
 * 5. Copy the Web app URL ending in /exec into index.html's API_URL.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  return "Sheet ready: " + SHEET_NAME;
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const action = payload.action;
    const sh = getSheet_();
    let result;
    if (action === "list") result = { success: true, records: readRecords_(sh) };
    else if (action === "create") result = createRecord_(sh, payload.record || {});
    else if (action === "update") result = updateRecord_(sh, payload.record || {});
    else if (action === "delete") result = deleteRecord_(sh, payload.id);
    else result = { success: false, error: "Unknown action" };
    return json_(result);
  } catch (err) {
    return json_({ success: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return json_({ success: true, message: "Code Vedic CRM API is running. Use the CRM page to manage records." });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { setupSheet(); sh = ss.getSheetByName(SHEET_NAME); }
  return sh;
}
function readRecords_(sh) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  const values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return values.filter(row => row[0] !== "").map(row => {
    const obj = {};
    HEADERS.forEach((h, i) => obj[h] = row[i] instanceof Date ? Utilities.formatDate(row[i], Session.getScriptTimeZone(), "yyyy-MM-dd") : row[i]);
    obj.value = Number(obj.value) || 0;
    return obj;
  });
}
function createRecord_(sh, record) {
  const now = new Date();
  record.id = Utilities.getUuid();
  record.createdAt = now;
  record.updatedAt = now;
  sh.appendRow(HEADERS.map(h => record[h] === undefined ? "" : record[h]));
  return { success: true, record: record };
}
function updateRecord_(sh, record) {
  if (!record.id) throw new Error("Record ID is required for update");
  const row = findRow_(sh, record.id);
  if (row < 2) throw new Error("Record not found");
  const old = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  const oldObj = {}; HEADERS.forEach((h, i) => oldObj[h] = old[i]);
  record.createdAt = oldObj.createdAt;
  record.updatedAt = new Date();
  sh.getRange(row, 1, 1, HEADERS.length).setValues([HEADERS.map(h => record[h] === undefined ? oldObj[h] : record[h])]);
  return { success: true, record: record };
}
function deleteRecord_(sh, id) {
  if (!id) throw new Error("Record ID is required for delete");
  const row = findRow_(sh, id);
  if (row < 2) throw new Error("Record not found");
  sh.deleteRow(row);
  return { success: true };
}
function findRow_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, 1, last - 1, 1).getDisplayValues().flat();
  const index = ids.findIndex(x => x === String(id));
  return index < 0 ? -1 : index + 2;
}
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}