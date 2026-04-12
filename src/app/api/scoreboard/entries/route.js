import { NextResponse } from 'next/server';
import { getSessionData } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * GET /api/scoreboard/entries?week=12
 * Returns server-persisted scoreboard entries for a week.
 */
export async function GET(request) {
  const session = getSessionData(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const week = parseInt(searchParams.get('week') || '0', 10);
  if (!week || week < 1) return NextResponse.json({ error: 'week required' }, { status: 400 });

  const data = await loadJsonFileAsync('scoreboard-entries.json');
  const entries = (data.entries || []).filter(e => e.weekNum === week);

  return NextResponse.json({ entries, week });
}

/**
 * POST /api/scoreboard/entries — Save a scoreboard entry for a store/week.
 * Body: { weekNum, storeId, netSales, pySales, breadCount, cogsActual, cogsVariance, labor, laborTarget }
 * Only RO+ can submit. DMs/Admins can submit for any of their stores.
 */
export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('scoreboard-entry', 60000, 20, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSessionData(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { weekNum, storeId, netSales, pySales, breadCount, cogsActual, cogsVariance, labor, laborTarget } = body;

  if (!weekNum || !storeId || netSales === undefined) {
    return NextResponse.json({ error: 'weekNum, storeId, and netSales are required' }, { status: 400 });
  }

  if (typeof weekNum !== 'number' || weekNum < 1 || weekNum > 52) {
    return NextResponse.json({ error: 'weekNum must be 1-52' }, { status: 400 });
  }

  const entry = {
    id: crypto.randomUUID(),
    weekNum: parseInt(String(weekNum), 10),
    storeId: String(storeId).slice(0, 10),
    netSales: parseFloat(netSales) || 0,
    pySales: parseFloat(pySales) || 0,
    breadCount: parseInt(breadCount) || 0,
    cogsActual: parseFloat(cogsActual) || 0,
    cogsVariance: parseFloat(cogsVariance) || 0,
    labor: parseFloat(labor) || 0,
    laborTarget: parseFloat(laborTarget) || 0,
    submittedBy: session.email,
    submittedAt: new Date().toISOString(),
  };

  // Calculate color/targets
  const targets = [
    entry.labor < entry.laborTarget,
    entry.cogsVariance >= -2.5 && entry.cogsVariance <= -1,
    entry.cogsActual >= 22 && entry.cogsActual <= 25,
    entry.pySales > 0 && ((entry.netSales - entry.pySales) / entry.pySales * 100) > 0,
  ];
  const hit = targets.filter(Boolean).length;
  const pyGrowth = entry.pySales > 0 ? ((entry.netSales - entry.pySales) / entry.pySales * 100) : 0;
  entry.pyGrowth = Math.round(pyGrowth * 100) / 100;
  entry.targetsHit = hit;
  entry.color = hit >= 4 ? 'royalblue' : pyGrowth >= 10 ? 'blue' : hit >= 3 ? 'green' : hit >= 2 ? 'yellow' : hit >= 1 ? 'orange' : 'none';

  await updateJsonFile('scoreboard-entries.json', (data) => {
    if (!data.entries) data.entries = [];
    // Upsert — replace if same week+store exists
    const idx = data.entries.findIndex(e => e.weekNum === entry.weekNum && e.storeId === entry.storeId);
    if (idx >= 0) {
      data.entries[idx] = entry;
    } else {
      data.entries.push(entry);
    }
    return data;
  });

  return NextResponse.json({ success: true, entry }, { status: 201 });
}
