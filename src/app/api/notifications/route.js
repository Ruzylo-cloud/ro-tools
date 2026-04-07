import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

/**
 * Notifications proxy for RO Tools.
 * Uses the user's Google email to operate on the shared RO Control notifications.
 */
export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'count';

  try {
    const endpoint = mode === 'list'
      ? '/api/notifications/external'
      : '/api/notifications/external-count';
    const res = await fetch(
      `${MC_URL}${endpoint}?email=${encodeURIComponent(session.email)}`,
      {
        headers: { 'X-Dev-Key': DEV_KEY },
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
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await request.json().catch(() => ({}));
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
        headers: { 'X-Dev-Key': DEV_KEY, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Request failed' }));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Notification request failed' }, { status: 500 });
  }
}
