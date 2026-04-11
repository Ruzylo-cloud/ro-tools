/**
 * PUT /api/mc/payroll/entries?entry_id= — proxy single-cell update to MC.
 * Body: { field, value }
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entry_id');
  if (!entryId) return NextResponse.json({ error: 'entry_id required' }, { status: 400 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const res = await mcFetch(`/api/payroll/entries/${encodeURIComponent(entryId)}`, {
    method: 'PUT',
    body,
  });
  return NextResponse.json(res.data || { error: res.error }, { status: res.ok ? 200 : (res.status || 502) });
}
