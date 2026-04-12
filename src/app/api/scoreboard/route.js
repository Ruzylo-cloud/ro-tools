import { NextResponse } from 'next/server';
import { getSessionData } from '@/lib/session';
import { loadJsonFileAsync } from '@/lib/data';
import { ALL_WEEKS, calculateTargets } from '@/lib/scoreboard-data';

export const dynamic = 'force-dynamic';

/**
 * GET /api/scoreboard?week=15
 * Returns merged scoreboard: static data for weeks 1-14, server entries for 15+.
 * Server entries override static data for same store+week (allows corrections).
 *
 * GET /api/scoreboard?weeks=true
 * Returns list of all available weeks (static + server).
 */
export async function GET(request) {
  const session = getSessionData(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);

  // Return available weeks list
  if (searchParams.get('weeks') === 'true') {
    const serverData = await loadJsonFileAsync('scoreboard-entries.json');
    const serverEntries = serverData.entries || [];
    const serverWeeks = [...new Set(serverEntries.map(e => e.weekNum))];
    const staticWeeks = Object.keys(ALL_WEEKS).map(Number);
    const allWeekNums = [...new Set([...staticWeeks, ...serverWeeks])].sort((a, b) => b - a);

    const WEEK_1_START = new Date('2025-12-29T00:00:00');
    const weeks = allWeekNums.map(num => {
      if (ALL_WEEKS[num]) return { weekNum: num, dateRange: ALL_WEEKS[num].dateRange };
      const start = new Date(WEEK_1_START);
      start.setDate(start.getDate() + (num - 1) * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { weekNum: num, dateRange: `${fmt(start)} - ${fmt(end)}` };
    });

    return NextResponse.json({ weeks });
  }

  // Return merged data for a specific week
  const weekNum = parseInt(searchParams.get('week') || '0', 10);
  if (!weekNum || weekNum < 1) return NextResponse.json({ error: 'week required' }, { status: 400 });

  // Start with static data
  const staticWeek = ALL_WEEKS[weekNum];
  let rows = staticWeek ? staticWeek.data.map(row => ({ ...row, ...calculateTargets(row), source: 'static' })) : [];

  // Merge server entries (override static for same store, add new stores)
  const serverData = await loadJsonFileAsync('scoreboard-entries.json');
  const serverEntries = (serverData.entries || []).filter(e => e.weekNum === weekNum);

  for (const entry of serverEntries) {
    const idx = rows.findIndex(r => r.storeId === entry.storeId);
    const merged = { ...entry, ...calculateTargets(entry), source: 'server' };
    if (idx >= 0) {
      rows[idx] = merged; // Server overrides static
    } else {
      rows.push(merged);
    }
  }

  rows.sort((a, b) => b.netSales - a.netSales);

  const dateRange = staticWeek?.dateRange || (() => {
    const WEEK_1_START = new Date('2025-12-29T00:00:00');
    const start = new Date(WEEK_1_START);
    start.setDate(start.getDate() + (weekNum - 1) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} - ${fmt(end)}`;
  })();

  return NextResponse.json({ weekNum, dateRange, rows });
}
