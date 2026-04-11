/**
 * POST /api/mc/payroll/breakdown — saves per-period P&L breakdown,
 * OCC notes, cash-tip override, and watchlist locally. MC does not yet
 * have a breakdown endpoint, so this persists on the Ro-Tools side.
 *
 * Body: { store_id, period_id, breakdown?, notes?, cashTipsOverride?, watchlist? }
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { updateJsonFile } from '@/lib/data';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('payroll-breakdown', 60000, 60, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const { store_id, period_id, breakdown, notes, cashTipsOverride, watchlist } = body || {};
  const key = `${store_id || 'all'}_${period_id || 'current'}`;

  // Basic validation
  if (notes != null && typeof notes === 'string' && notes.length > 10000) {
    return NextResponse.json({ error: 'notes too long' }, { status: 400 });
  }
  if (breakdown != null && typeof breakdown !== 'object') {
    return NextResponse.json({ error: 'breakdown must be an object' }, { status: 400 });
  }
  if (watchlist != null && !Array.isArray(watchlist)) {
    return NextResponse.json({ error: 'watchlist must be array' }, { status: 400 });
  }
  if (watchlist && watchlist.length > 200) {
    return NextResponse.json({ error: 'watchlist too large' }, { status: 400 });
  }

  const updated = await updateJsonFile('payroll_breakdown.json', (data) => {
    const prev = data[key] || {};
    data[key] = {
      ...prev,
      ...(breakdown !== undefined ? { breakdown } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(cashTipsOverride !== undefined ? { cashTipsOverride } : {}),
      ...(watchlist !== undefined ? { watchlist } : {}),
      updatedAt: new Date().toISOString(),
      updatedBy: session.email,
    };
    return data;
  });

  return NextResponse.json({ ok: true, data: updated[key] });
}
