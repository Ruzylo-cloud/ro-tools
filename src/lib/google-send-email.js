import { google } from 'googleapis';

/**
 * Server-to-server email sender using GOOGLE_SERVICE_ACCOUNT with
 * Domain-Wide Delegation, impersonating a @jmvalley.com admin mailbox.
 * Used for auth flows that must send mail BEFORE the user has signed in
 * (so there is no user OAuth token available).
 *
 * Setup requirements (one-time, in Google Workspace Admin Console):
 *   Security → API Controls → Domain-wide Delegation → Add:
 *     Client ID: <service account clientId>
 *     Scopes: https://www.googleapis.com/auth/gmail.send
 */
export async function sendServiceEmail({ to, subject, text, html }) {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!keyJson) {
    console.error('[sendServiceEmail] GOOGLE_SERVICE_ACCOUNT env var not set');
    return { ok: false, error: 'service_account_missing' };
  }

  let key;
  try {
    key = JSON.parse(keyJson);
  } catch (err) {
    console.error('[sendServiceEmail] Failed to parse key JSON:', err.message);
    return { ok: false, error: 'service_account_invalid' };
  }

  const impersonate = process.env.GMAIL_SEND_AS || 'chrisr@jmvalley.com';

  const jwt = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    subject: impersonate,
  });

  try {
    await jwt.authorize();
    const gmail = google.gmail({ version: 'v1', auth: jwt });

    const boundary = '__ROTOOLS_BOUNDARY__';
    const parts = [];
    parts.push(`From: RO Tools <${impersonate}>`);
    parts.push(`To: ${to}`);
    parts.push(`Subject: ${String(subject).replace(/[\r\n]/g, ' ').slice(0, 500)}`);
    parts.push('MIME-Version: 1.0');
    if (html) {
      parts.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      parts.push('');
      parts.push(`--${boundary}`);
      parts.push('Content-Type: text/plain; charset=utf-8');
      parts.push('');
      parts.push(text || html.replace(/<[^>]+>/g, ''));
      parts.push(`--${boundary}`);
      parts.push('Content-Type: text/html; charset=utf-8');
      parts.push('');
      parts.push(html);
      parts.push(`--${boundary}--`);
    } else {
      parts.push('Content-Type: text/plain; charset=utf-8');
      parts.push('');
      parts.push(text || '');
    }

    const raw = Buffer.from(parts.join('\r\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
    return { ok: true };
  } catch (err) {
    console.error('[sendServiceEmail] Send failed:', err?.message || err);
    return { ok: false, error: String(err?.message || err) };
  }
}
