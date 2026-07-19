/**
 * RSVP → Google Sheet (Apps Script Web App)
 * ------------------------------------------------------------------
 * Setup:
 *  1. Open your Sheet → Erweiterungen → Apps Script, paste this code.
 *  2. Bereitstellen → Neue Bereitstellung → Typ: Web-App
 *       • Ausführen als: Ich
 *       • Zugriff: Jeder (anonym)   ← wichtig, sonst wird die Anfrage blockiert
 *  3. Copy the Web-App URL (ends with /exec) → paste into WEB_APP_URL in js/main.js.
 *
 * The website POSTs a JSON body with these keys:
 *   { attendance: "Ja"|"Nein", name, guests, dietary, songRequest, message }
 *
 * NOTE: If your sheet already has the OLD header row (Vorname/Nachname/…),
 * clear the sheet once so these fresh headers get written on the next submit.
 */
// Neutralize spreadsheet formula/CSV injection: a value that begins with
// = + - @ (or a tab / carriage return) is prefixed with an apostrophe so
// Google Sheets stores it as plain text instead of evaluating it as a formula.
// Returns "-" for empty values (matches the previous `|| "-"` behaviour).
function safeCell(v) {
  var s = (v == null ? "" : String(v));
  if (s === "") return "-";
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Create the header row if the sheet is still empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Status (Confirmed/Declined)",
        "Number of guests",
        "Dietary / Vegetarian",
        "Song request",
        "Message to the couple"
      ]);
    }

    // Append the row
    sheet.appendRow([
      new Date().toLocaleString("en-GB"),
      safeCell(data.name),
      data.attendance === "Ja" ? "Confirmed" : "Declined",
      safeCell(data.guests),
      safeCell(data.dietary),
      safeCell(data.songRequest),
      safeCell(data.message)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
