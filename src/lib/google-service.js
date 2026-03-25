import { google } from 'googleapis';

// Service account client — used for server-side Drive/Sheets/Docs access
// without requiring a user OAuth session. NEVER modifies source files.
let _auth = null;

function getServiceAuth() {
  if (_auth) return _auth;

  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!keyJson) {
    console.error('[ServiceAccount] GOOGLE_SERVICE_ACCOUNT env var not set');
    return null;
  }

  let key;
  try {
    key = JSON.parse(keyJson);
  } catch (err) {
    console.error('[ServiceAccount] Failed to parse key JSON:', err.message);
    return null;
  }

  _auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/documents.readonly',
    ],
  });

  return _auth;
}

export function getServiceDrive() {
  const auth = getServiceAuth();
  if (!auth) return null;
  return google.drive({ version: 'v3', auth });
}

export function getServiceSheets() {
  const auth = getServiceAuth();
  if (!auth) return null;
  return google.sheets({ version: 'v4', auth });
}

export function getServiceDocs() {
  const auth = getServiceAuth();
  if (!auth) return null;
  return google.docs({ version: 'v1', auth });
}
