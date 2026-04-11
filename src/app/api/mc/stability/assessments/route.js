/**
 * POST /api/mc/stability/assessments — submit a full tier assessment.
 * GET  /api/mc/stability/assessments?employee_id= — fetch history for one employee.
 *
 * Also persists a local copy of submissions under `tier_assessments.json`
 * so the demo always has working history even if MC is unreachable.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';
import { updateJsonFile, loadJsonFileAsync } from '@/lib/data';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employee_id');
  if (!employeeId) return NextResponse.json({ error: 'employee_id required' }, { status: 400 });

  // Try MC first
  const mc = await mcFetch(`/api/stability/assessments/${encodeURIComponent(employeeId)}`);
  const localAll = await loadJsonFileAsync('tier_assessments.json');
  const localList = (localAll[String(employeeId)] || []).slice().reverse();

  const merged = mc.ok
    ? [...(mc.data?.assessments || []), ...localList]
    : localList;

  return NextResponse.json({
    assessments: merged,
    source: mc.ok ? 'mc+local' : 'local',
    mcError: mc.ok ? null : mc.error,
  });
}

export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('tier-assess', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  const { employee_id, overall_tier, category_scores, assessor_notes, employee_name } = body || {};
  if (!employee_id) return NextResponse.json({ error: 'employee_id required' }, { status: 400 });
  if (!['A', 'B', 'C', 'D'].includes(String(overall_tier || '').toUpperCase())) {
    return NextResponse.json({ error: 'overall_tier must be A/B/C/D' }, { status: 400 });
  }

  // Proxy to MC (best-effort)
  const mc = await mcFetch('/api/stability/assessments', {
    method: 'POST',
    body: {
      employee_id: Number(employee_id),
      overall_tier: String(overall_tier).toUpperCase(),
      category_scores: category_scores || [],
      assessor_notes: assessor_notes || '',
    },
  });

  // Always write local copy (covers demo even if MC auth fails)
  const entry = {
    id: `local_${Date.now()}`,
    employee_id,
    employee_name: employee_name || '',
    overall_tier: String(overall_tier).toUpperCase(),
    tier: String(overall_tier).toUpperCase(),
    category_scores: category_scores || [],
    assessor_notes: assessor_notes || '',
    assessed_by: session.email,
    assessed_at: new Date().toISOString(),
    source: mc.ok ? 'mc+local' : 'local',
  };

  await updateJsonFile('tier_assessments.json', (data) => {
    const k = String(employee_id);
    if (!Array.isArray(data[k])) data[k] = [];
    data[k].push(entry);
    return data;
  });

  return NextResponse.json({
    ok: true,
    mcOk: mc.ok,
    mcError: mc.ok ? null : mc.error,
    assessment: entry,
  });
}
