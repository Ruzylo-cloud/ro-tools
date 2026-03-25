import { google } from 'googleapis';
import { cookies } from 'next/headers';

// Get an authenticated Google client using the user's OAuth tokens from session
export function getAuthenticatedClient() {
  const cookieStore = cookies();
  const session = cookieStore.get('ro_session');
  if (!session?.value) return null;

  let data;
  try {
    data = JSON.parse(Buffer.from(session.value, 'base64').toString());
  } catch {
    return null;
  }

  if (!data.accessToken) return null;

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
