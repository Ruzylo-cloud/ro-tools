/**
 * Proxy: mission-control checklist instances for a day, and individual instance detail.
 *   GET /api/mc/checklists?date=YYYY-MM-DD              — list all instances for the day
 *   GET /api/mc/checklists?instance_id=123              — fetch one instance with items
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
    const instanceId = searchParams.get('instance_id');
    if (instanceId) {
      if (!/^\d+$/.test(instanceId)) return NextResponse.json({ error: 'invalid instance_id' }, { status: 400 });
      const data = await mcFetch(`/api/checklists/instances/${instanceId}`);
      return NextResponse.json(data);
    }

    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'date (YYYY-MM-DD) invalid' }, { status: 400 });
    }

    const data = await mcFetch(`/api/checklists/instances?date=${encodeURIComponent(date)}`);
    return NextResponse.json(data);
  } catch (err) {
    const status = err?.status && err.status >= 400 && err.status < 600 ? (err.status >= 500 ? 502 : err.status) : 500;
    console.error('[mc/checklists] error:', err);
    return NextResponse.json({ error: 'Failed to fetch checklists', detail: String(err?.message || err) }, { status });
  }
}
