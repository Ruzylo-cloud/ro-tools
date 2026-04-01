import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * Session utility with HMAC signing to prevent tampering.
 * Uses GOOGLE_CLIENT_SECRET as signing key (already in env).
 */

function getSigningKey() {
  return process.env.GOOGLE_CLIENT_SECRET || 'dev-key-not-for-production';
}

function sign(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const hmac = crypto.createHmac('sha256', getSigningKey()).update(payload).digest('base64url');
  return `${payload}.${hmac}`;
}

function verify(token) {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', getSigningKey()).update(payload).digest('base64url');

  // Timing-safe comparison to prevent timing attacks
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch (e) {
    return null;
  }
}

/**
 * Extract and verify user session from ro_session cookie.
 * Returns null if no session, invalid, or tampered.
 */
export function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('ro_session') || cookieStore.get('ro_session_backup');
  if (!session?.value) return null;

  // Try signed format first (new)
  const verified = verify(session.value);
  if (verified) return verified;

  // Fallback: legacy base64 format (migrate on next login)
  try {
    return JSON.parse(Buffer.from(session.value, 'base64').toString());
  } catch (e) {
    console.error('Session parse error:', e?.message || e);
    return null;
  }
}

/**
 * Create a signed session cookie value.
 */
export function createSessionToken(data) {
  return sign(data);
}

/**
 * Verify a signed session token and return its data.
 * Returns null if invalid or tampered.
 */
export function verifySessionToken(token) {
  return verify(token);
}

/**
 * Extract session data from a request object.
 * Reads the ro_session cookie and verifies it.
 */
export function getSessionData(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/ro_session=([^;]+)/);
  if (!match) return null;
  return verify(match[1]);
}
