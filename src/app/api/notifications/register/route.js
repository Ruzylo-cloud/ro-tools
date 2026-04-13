/**
 * APNs device-token registration proxy for the RT iOS app.
 *
 * RT iOS authenticates against ro-tools.app (Google OAuth → server
 * session cookie), not against Mission Control directly, so it can't
 * call MC's JWT-gated /api/push/devices. This route mirrors the
 * /api/notifications proxy pattern: forward the iOS POST to MC's
 * /api/push/devices/external endpoint with the internal API key +
 * the user's email derived from the server session.
 *
 * Lockdown scope: per src/lib/notification-prefs.js (clarification
 * 2026-04-13), iOS push is EXCLUDED from the per-user opt-in gate
 * because installing the app already requires a deliberate
 * TestFlight / App Store invite. This route therefore does NOT
 * consult notification-prefs and registration is always allowed
 * once the user is authenticated.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const RT_BUNDLE_ID = 'com.jmvalley.rotools';
const HEX_TOKEN = /^[0-9a-fA-F]{32,200}$/;

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const apiKey = getMissionControlApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: 'Push registration bridge unavailable' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const token = typeof body?.token === 'string' ? body.token : '';
  if (!HEX_TOKEN.test(token)) {
    return NextResponse.json({ error: 'Missing or malformed token' }, { status: 400 });
  }

  const payload = {
    email: session.email,
    token,
    bundle_id: typeof body?.bundle_id === 'string' ? body.bundle_id : RT_BUNDLE_ID,
    environment: body?.environment === 'production' ? 'production' : 'sandbox',
    app_version: typeof body?.app_version === 'string' ? body.app_version : undefined,
    device_model: typeof body?.device_model === 'string' ? body.device_model : undefined,
    os_version: typeof body?.os_version === 'string' ? body.os_version : undefined,
  };

  try {
    const res = await fetch(`${MC_URL}/api/push/devices/external`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn('[notifications/register] MC rejected device token:', res.status, data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json({ ok: true, ...data });
  } catch (e) {
    console.error('[notifications/register] MC fetch failed:', e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: 'Push registration unavailable' }, { status: 502 });
  }
}

export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const apiKey = getMissionControlApiKey();
  if (!apiKey) return NextResponse.json({ error: 'Push registration bridge unavailable' }, { status: 503 });

  const url = new URL(request.url);
  let token = url.searchParams.get('token') || '';
  if (!token) {
    try {
      const body = await request.json();
      token = typeof body?.token === 'string' ? body.token : '';
    } catch {
      // no body — fall through
    }
  }
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  try {
    const target = `${MC_URL}/api/push/devices/external?token=${encodeURIComponent(token)}&email=${encodeURIComponent(session.email)}`;
    const res = await fetch(target, {
      method: 'DELETE',
      headers: { 'X-API-Key': apiKey },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json({ ok: true, ...data });
  } catch (e) {
    console.error('[notifications/register] DELETE failed:', e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: 'Push unregister unavailable' }, { status: 502 });
  }
}
