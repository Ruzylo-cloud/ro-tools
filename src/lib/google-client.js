import { google } from 'googleapis';
import { getSession } from '@/lib/session';

/**
 * Get an authenticated Google client using the user's OAuth tokens from session.
 * Used for user-scoped operations (their own Drive, Sheets, Docs).
 */
export async function getAuthenticatedClient() {
  const data = await getSession();
  if (!data?.accessToken) return null;

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    access_token: data.accessToken,
    refresh_token: data.refreshToken,
  });

  return { client, user: data };
}

export function getDrive(client) {
  return google.drive({ version: 'v3', auth: client });
}

export function getSheets(client) {
  return google.sheets({ version: 'v4', auth: client });
}

export function getDocs(client) {
  return google.docs({ version: 'v1', auth: client });
}

export function getGmail(client) {
  return google.gmail({ version: 'v1', auth: client });
}
