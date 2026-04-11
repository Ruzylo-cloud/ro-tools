/**
 * PUT /api/mc/stability/cell — update a single cell (proxies to MC /api/stability/cell).
 * Body: { store_number, role_slot, employee_name, status, notes, tier }
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('stability-cell', 60000, 120, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const res = await mcFetch('/api/stability/cell', { method: 'PUT', body });
  return NextResponse.json(res.data || { error: res.error }, { status: res.ok ? 200 : (res.status || 502) });
}
