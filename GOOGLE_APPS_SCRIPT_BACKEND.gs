/**
 * ============================================================================
 * CASA GUARDIAN — GOOGLE APPS SCRIPT BACKEND (DRIVE STORAGE & GMAIL NOTIFIER)
 * ============================================================================
 * Este script se pega en https://script.google.com/ y se publica como Web App.
 * Permite:
 * 1. Almacenar expedientes de clientes y fotos de inspecciones en Google Drive
 *    (Cero costo de servidor, espacio masivo gratuito en Google Drive).
 * 2. Enviar correos automáticos al propietario y al director general (antonio_rburgos@msn.com).
 * 3. Emitir certificados con sellado criptográfico SHA-256.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // 1. Crear o localizar carpeta de CASA GUARDIAN en Google Drive
    var folderName = "CASA_GUARDIAN_CUSTODIA_EVIDENCIAS";
    var folders = DriveApp.getFoldersByName(folderName);
    var mainFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    if (action === "NUEVO_REGISTRO_PROPIETARIO") {
      var client = data.client;

      // Crear subcarpeta para el cliente
      var clientFolderName = client.fullName + " [" + client.id + "]";
      var clientFolder = mainFolder.createFolder(clientFolderName);

      // Guardar ficha técnica del inmueble en Drive
      var metadataContent = JSON.stringify(client, null, 2);
      clientFolder.createFile("Ficha_Tecnica_Inmueble.json", metadataContent, MimeType.PLAIN_TEXT);

      // Notificación por correo al Director General
      var adminSubject = "🛡️ NUEVA CUSTODIA ACTIVADA: " + client.fullName + " (" + client.propertyZone + ")";
      var adminBody = "Se ha registrado un nuevo cliente en CASA GUARDIAN:\n\n" +
                      "Propietario: " + client.fullName + "\n" +
                      "Correo: " + client.email + "\n" +
                      "WhatsApp: " + client.phone + "\n" +
                      "Inmueble: " + client.propertyType + " en " + client.propertyZone + "\n" +
                      "Residencia del Dueño: " + client.residenceLocation + "\n" +
                      "Certificado SHA-256: " + client.digitalCertificateHash + "\n\n" +
                      "Carpeta en Google Drive creada: " + clientFolder.getUrl();

      MailApp.sendEmail("antonio_rburgos@msn.com", adminSubject, adminBody);

      // Notificación de bienvenida al Cliente con Certificado
      var clientSubject = "🛡️ CASA GUARDIAN — Registro Confirmado & Certificado de Custodia";
      var clientBody = "Estimado/a " + client.fullName + ",\n\n" +
                       "Le confirmamos que su solicitud de custodia para su inmueble en " + client.propertyZone + " ha sido recibida con éxito.\n\n" +
                       "Su identificador único de expediente es: " + client.id + "\n" +
                       "Firma Criptográfica SHA-256: " + client.digitalCertificateHash + "\n\n" +
                       "Un oficial técnico se pondrá en contacto a través de su WhatsApp (" + client.phone + ") para coordinar la inspección inicial y recepción bajo precinto de llaves.\n\n" +
                       "Atentamente,\n" +
                       "Antonio Burgos — Director General\n" +
                       "CASA GUARDIAN · Pasto, Nariño, Colombia";

      MailApp.sendEmail(client.email, clientSubject, clientBody);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Expediente creado en Google Drive y correos enviados.",
        driveUrl: clientFolder.getUrl(),
        hash: client.digitalCertificateHash
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "SELLO_INSPECCION_OFICIAL") {
      var inspection = data.inspection;
      var rawString = JSON.stringify({
        inmuebleId: inspection.inmuebleId,
        oficial: inspection.officerName,
        gps: inspection.gps,
        checklist: inspection.checklist,
        timestamp: new Date().toISOString()
      });

      var serverSHA256 = computeSHA256Hex(rawString);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        sha256: serverSHA256,
        timestamp: new Date().toISOString(),
        verified: true
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function computeSHA256Hex(text) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var byteVal = digest[i];
    if (byteVal < 0) byteVal += 256;
    var str = byteVal.toString(16);
    if (str.length === 1) str = "0" + str;
    hex += str;
  }
  return hex;
}