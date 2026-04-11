/**
 * Proxy: mission-control daily + weekly completion reports.
 *   GET /api/mc/reports?type=stats                    — 7-day weekly rollup
 *   GET /api/mc/reports?type=daily&date=YYYY-MM-DD    — one day's instances (for daily-completion tab)
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
    const type = searchParams.get('type') || 'stats';

    if (type === 'stats') {
      const data = await mcFetch(`/api/checklists/completion-stats`);
      return NextResponse.json(data);
    }
    if (type === 'daily') {
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: 'date (YYYY-MM-DD) invalid' }, { status: 400 });
      }
      const data = await mcFetch(`/api/checklists/instances?date=${encodeURIComponent(date)}`);
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: 'unknown type' }, { status: 400 });
  } catch (err) {
    const status = err?.status && err.status >= 400 && err.status < 600 ? (err.status >= 500 ? 502 : err.status) : 500;
    console.error('[mc/reports] error:', err);
    return NextResponse.json({ error: 'Failed to fetch reports', detail: String(err?.message || err) }, { status });
  }
}
