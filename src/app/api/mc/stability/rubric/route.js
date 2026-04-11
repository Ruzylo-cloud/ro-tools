/**
 * GET /api/mc/stability/rubric — fetch the 15-category tier rubric.
 * Always returns a usable rubric: if MC is unreachable, returns the hard-coded
 * 15-category canonical list with empty placeholder descriptions.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { mcFetch } from '@/lib/missionControl';

export const dynamic = 'force-dynamic';

const CANONICAL_CATEGORIES = [
  { category_key: 'reliability',     category_name: 'Reliability' },
  { category_key: 'urgency',         category_name: 'Urgency' },
  { category_key: 'sprinkling',      category_name: 'Sprinkling' },
  { category_key: 'hot_subs',        category_name: 'Hot Subs' },
  { category_key: 'wrapping',        category_name: 'Reg / Wrap' },
  { category_key: 'slicing',         category_name: 'Slicing' },
  { category_key: 'lms_completion',  category_name: 'LMS' },
  { category_key: 'coaching',        category_name: 'Coach / Example' },
  { category_key: 'growth',          category_name: 'Growth' },
  { category_key: 'cleanliness',     category_name: 'Cleanliness' },
  { category_key: 'food_handling',   category_name: 'Food Handling' },
  { category_key: 'communication',   category_name: 'Communication' },
  { category_key: 'decision_making', category_name: 'Decision Making' },
  { category_key: 'core_values',     category_name: 'Core Values' },
  { category_key: 'team_player',     category_name: 'Team Player' },
];

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const mc = await mcFetch('/api/stability/rubric');
  let rubric = mc.ok && Array.isArray(mc.data?.rubric) && mc.data.rubric.length > 0
    ? mc.data.rubric
    : [];

  // Ensure all 15 canonical categories are present + ordered
  const byKey = new Map(rubric.map(r => [r.category_key, r]));
  const merged = CANONICAL_CATEGORIES.map((c, i) => ({
    ...c,
    display_order: i + 1,
    tier_a_description: byKey.get(c.category_key)?.tier_a_description || '',
    tier_b_description: byKey.get(c.category_key)?.tier_b_description || '',
    tier_c_description: byKey.get(c.category_key)?.tier_c_description || '',
    tier_d_description: byKey.get(c.category_key)?.tier_d_description || '',
  }));

  return NextResponse.json({
    rubric: merged,
    source: mc.ok ? 'mc' : 'fallback',
    mcError: mc.ok ? null : mc.error,
  });
}
