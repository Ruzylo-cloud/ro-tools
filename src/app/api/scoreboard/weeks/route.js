import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { hasValidMissionControlApiKey } from '@/lib/internal-api-key';
import { ALL_WEEKS, calculateTargets } from '@/lib/scoreboard-data';
import { getStoreName } from '@/lib/store-directory';

export const dynamic = 'force-dynamic';

/**
 * GET /api/scoreboard/weeks
 * Returns all scoreboard weeks in iOS-compatible format.
 * Accepts session auth OR internal API key (X-API-Key header) for cross-service access.
 */
export async function GET(request) {
  const session = getSession();
  const apiKey = request.headers.get('x-api-key') || request.headers.get('x-dev-key');
  if (!session && !hasValidMissionControlApiKey(apiKey)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const tierMap = {
      royalblue: 'grand_slam',
      blue: 'blue',
      green: 'trifecta',
      yellow: 'yellow',
      orange: 'orange',
      none: 'none',
    };

    const weeks = Object.entries(ALL_WEEKS)
      .sort(([a], [b]) => parseInt(b, 10) - parseInt(a, 10))
      .map(([num, week]) => {
        const weekNumber = parseInt(num, 10);
        return {
          id: `week-${weekNumber}`,
          weekNumber,
          weekLabel: week.dateRange || `Week ${weekNumber}`,
          stores: week.data.map(row => {
            const result = calculateTargets(row);
            return {
              storeNumber: row.storeId,
              storeName: getStoreName(row.storeId) || null,
              weekNumber,
              labor: row.labor ?? null,
              cogsVariance: row.cogsVariance ?? null,
              cogsActual: row.cogsActual ?? null,
              pyGrowth: row.pyGrowth ?? null,
              targetsHit: result.targetsHit,
              tier: tierMap[result.color] || 'none',
            };
          }),
        };
      });

    return NextResponse.json(weeks);
  } catch (err) {
    console.error('[scoreboard] Failed to load scoreboard data:', err);
    return NextResponse.json({ error: 'Failed to load scoreboard data' }, { status: 500 });
  }
}
