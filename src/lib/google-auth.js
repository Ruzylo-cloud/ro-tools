import { google } from 'googleapis';

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

const BASIC_SCOPES = [
  'openid',
  'email',
  'profile',
];

const EXTENDED_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/gmail.send',
];

export function getAuthUrl(remember = false) {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: BASIC_SCOPES,
    hd: 'jmvalley.com',
    state: remember ? '/dashboard|remember' : undefined,
  });
}

/**
 * Generate an auth URL that requests extended scopes (Drive, Sheets, Docs, Gmail).
 * Uses include_granted_scopes so the user keeps their basic login scopes.
 * The `state` param carries a return URL so we can redirect back after granting.
 */
export function getExtendedAuthUrl(returnTo) {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [...BASIC_SCOPES, ...EXTENDED_SCOPES],
    include_granted_scopes: true,
    hd: 'jmvalley.com',
    state: returnTo || '/dashboard',
  });
}

/**
 * Generate an auth URL for the iOS app.
 * State param carries 'mobile' flag so callback knows to redirect to rotools:// URL scheme.
 */
export function getMobileAuthUrl() {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: BASIC_SCOPES,
    hd: 'jmvalley.com',
    state: 'mobile',
  });
}

export async function getTokensFromCode(code) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getUserInfo(accessToken) {
  const client = getOAuth2Client();
  client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({ version: 'v2', auth: client });
  const { data } = await oauth2.userinfo.get();
  return data;
}
