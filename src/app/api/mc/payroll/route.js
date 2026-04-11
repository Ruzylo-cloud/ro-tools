/**
 * GET /api/mc/payroll?store_id=&start=&end= — proxy to Mission Control payroll.
 *
 * MC does not currently expose a single-call range endpoint, so we list periods
 * and (optionally) fetch a specific period by id. The client can also pass
 * ?period_id= directly.
 *
 * Response shape (merged):
 *   { periods: [...], period, entries, breakdown, notes, source: 'mc'|'local'|'empty' }
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';
import { loadJsonFileAsync } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('store_id') || '';
  const periodId = searchParams.get('period_id') || '';

  // 1. Fetch periods list
  const periodsRes = await mcFetch('/api/payroll/periods', {
    query: { store_id: storeId },
  });

  // 2. If periodId provided, fetch that period details
  let periodDetail = null;
  if (periodId) {
    const detailRes = await mcFetch(`/api/payroll/period/${encodeURIComponent(periodId)}`);
    if (detailRes.ok) periodDetail = detailRes.data;
  }

  // 3. Load local P&L breakdown + OCC notes (keyed by store_id + period)
  const key = `${storeId || 'all'}_${periodId || 'current'}`;
  const local = await loadJsonFileAsync('payroll_breakdown.json');
  const localForKey = local[key] || {};

  return NextResponse.json({
    source: periodsRes.ok ? 'mc' : 'empty',
    mcError: periodsRes.ok ? null : periodsRes.error,
    periods: periodsRes.data?.periods || [],
    period: periodDetail?.period || null,
    entries: periodDetail?.entries || [],
    breakdown: localForKey.breakdown || null,
    notes: localForKey.notes || '',
    cashTipsOverride: localForKey.cashTipsOverride ?? null,
    watchlist: localForKey.watchlist || [],
  });
}
