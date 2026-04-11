/**
 * GET  /api/mc/stability — list full stability snapshot (proxied from MC).
 * POST /api/mc/stability — bulk upsert (proxies to /api/stability/bulk).
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const res = await mcFetch('/api/stability');
  if (!res.ok) {
    return NextResponse.json({
      snapshot: [],
      roleSlots: ['RO', 'ARO', 'SL_1', 'SL_2', 'SL_CREW'],
      roleLabels: { RO: 'RO', ARO: 'ARO', SL_1: 'SL (1)', SL_2: 'SL (2)', SL_CREW: 'SL/Crew' },
      source: 'empty',
      mcError: res.error,
    });
  }
  return NextResponse.json({ ...res.data, source: 'mc' });
}

export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const res = await mcFetch('/api/stability/bulk', { method: 'POST', body });
  return NextResponse.json(res.data || { error: res.error }, { status: res.ok ? 200 : (res.status || 502) });
}
