import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';

/**
 * Notifications proxy for RO Tools.
 * Uses the user's Google email to operate on the shared RO Control notifications.
 */
export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const apiKey = getMissionControlApiKey();
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'count';
  if (!apiKey) return NextResponse.json(mode === 'list' ? [] : { count: 0 });

  try {
    const endpoint = mode === 'list'
      ? '/api/notifications/external'
      : '/api/notifications/external-count';
    const res = await fetch(
      `${MC_URL}${endpoint}?email=${encodeURIComponent(session.email)}`,
      {
        headers: { 'X-API-Key': apiKey },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return NextResponse.json(mode === 'list' ? [] : { count: 0 });
    const data = await res.json();
    return NextResponse.json(mode === 'list' ? data : { count: data.count || 0 });
  } catch {
    // RC unreachable — fail silently, don't break RT
    return NextResponse.json(mode === 'list' ? [] : { count: 0 });
  }
}

export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const apiKey = getMissionControlApiKey();
  if (!apiKey) return NextResponse.json({ error: 'Notification bridge unavailable' }, { status: 503 });

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const action = body?.action;
    let endpoint = '';

    if (action === 'read' && Number.isInteger(body?.id)) {
      endpoint = `/api/notifications/external/${body.id}/read`;
    } else if (action === 'read-all') {
      endpoint = '/api/notifications/external/read-all';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const res = await fetch(
      `${MC_URL}${endpoint}?email=${encodeURIComponent(session.email)}`,
      {
        method: 'POST',
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Request failed' }));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (e) {
    console.error('[notifications] Notification request failed:', e);
    return NextResponse.json({ error: 'Notification request failed' }, { status: 500 });
  }
}
