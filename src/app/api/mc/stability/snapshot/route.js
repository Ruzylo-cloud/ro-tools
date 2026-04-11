/**
 * GET /api/mc/stability/snapshot[?store_id=] — canonical leadership stability
 * grid, proxied from Mission Control's /api/tools/stability-snapshot. Returns
 * the seven canonical role slots per store with gap detection + full-store
 * flag so the DM dashboard can spot understaffed leadership instantly.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('store_id');
  const path = storeId
    ? `/api/tools/stability-snapshot?store_id=${encodeURIComponent(storeId)}`
    : '/api/tools/stability-snapshot';

  const res = await mcFetch(path);
  if (!res.ok) {
    return NextResponse.json({
      snapshots: [],
      roleKeys: [],
      roleLabels: {},
      summary: { totalStores: 0, fullStores: 0, totalSlots: 0, filledSlots: 0, openSlots: 0, fillRatePct: 0 },
      mcError: res.error,
    });
  }
  return NextResponse.json({ ...res.data, source: 'mc' });
}
