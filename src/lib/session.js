import { cookies } from 'next/headers';

/**
 * Extract user session from ro_session cookie.
 * Shared across all API routes that need auth.
 */
export function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('ro_session');
  if (!session?.value) return null;
  try {
    return JSON.parse(Buffer.from(session.value, 'base64').toString());
  } catch {
    return null;
  }
}
