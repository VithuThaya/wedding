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
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Spaltenüberschriften erstellen, falls die Tabelle noch leer ist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Zeitstempel",
        "Name",
        "Status (Zusage/Absage)",
        "Anzahl Gäste",
        "Unverträglichkeiten / Allergien",
        "Musikwunsch",
        "Nachricht an das Brautpaar"
      ]);
    }

    // Zeile anhängen
    sheet.appendRow([
      new Date().toLocaleString("de-DE"),
      data.name || "-",
      data.attendance === "Ja" ? "Zusage" : "Absage",
      data.guests || "-",
      data.dietary || "-",
      data.songRequest || "-",
      data.message || "-"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
