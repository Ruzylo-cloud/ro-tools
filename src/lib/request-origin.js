import { NextResponse } from 'next/server';

const SAFE_FETCH_SITES = new Set(['same-origin', 'same-site', 'none']);

function getExpectedOrigin(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return null;

  const proto = request.headers.get('x-forwarded-proto')
    || (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');

  return `${proto}://${host}`;
}

function getSourceOrigin(request) {
  const raw = request.headers.get('origin') || request.headers.get('referer');
  if (!raw) return null;

  try {
    return new URL(raw).origin;
  } catch {
    return false;
  }
}

/**
 * Low-risk CSRF hardening for cookie-backed mutations.
 * Reject explicit cross-site browser requests while still allowing
 * same-origin server-side fetches that do not send Origin/Referer.
 */
export function enforceSameOriginMutation(request) {
  const method = request.method?.toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return null;

  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && !SAFE_FETCH_SITES.has(fetchSite)) {
    return NextResponse.json({ error: 'Cross-site requests are not allowed' }, { status: 403 });
  }

  const expectedOrigin = getExpectedOrigin(request);
  if (!expectedOrigin) return null;

  const sourceOrigin = getSourceOrigin(request);
  if (sourceOrigin === null) return null;
  if (sourceOrigin === false) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  if (sourceOrigin !== expectedOrigin) {
    return NextResponse.json({ error: 'Cross-site requests are not allowed' }, { status: 403 });
  }

  return null;
}
