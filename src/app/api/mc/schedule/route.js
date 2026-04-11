/**
 * Proxy: mission-control published weekly schedule.
 * GET /api/mc/schedule?week_start=YYYY-MM-DD
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';

export const dynamic = 'force-dynamic';

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ro_session');
  if (!session) return null;
  return verifySessionToken(session.value);
}

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get('week_start');
    if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return NextResponse.json({ error: 'week_start (YYYY-MM-DD) required' }, { status: 400 });
    }

    const data = await mcFetch(`/api/scheduling/published?week_start=${encodeURIComponent(weekStart)}`);
    return NextResponse.json(data);
  } catch (err) {
    const status = err?.status && err.status >= 400 && err.status < 600 ? (err.status >= 500 ? 502 : err.status) : 500;
    console.error('[mc/schedule] error:', err);
    return NextResponse.json({ error: 'Failed to fetch schedule', detail: String(err?.message || err) }, { status });
  }
}
