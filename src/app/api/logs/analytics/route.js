import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync, loadJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { DEMO_LOGS, isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

// RT-128: Usage analytics endpoint
function checkAdmin(session) {
  if (isSuperAdmin(session.email) || isDefaultAdmin(session.email)) return true;
  const profiles = loadJsonFile('profiles.json');
  const profile = profiles[session.id];
  return profile?.role === 'administrator' && profile?.roleApproved === true;
}

const GENERATOR_LABELS = {
  'written-warning': 'Written Warning',
  'evaluation': 'Evaluation',
  'coaching-form': 'Coaching Form',
  'resignation': 'Resignation',
  'termination': 'Termination',
  'injury-report': 'Injury Report',
  'catering-order': 'Catering Order',
  'attestation-correction': 'Attestation Correction',
  'timesheet-correction': 'Timesheet Correction',
  'meal-break-waiver': 'Meal Break Waiver',
  'flyer': 'Catering Flyer',
  'food-labels': 'Food Labels',
  'dm-walkthroughs': 'DM Walk-Through',
  'manager-log': 'Manager Log',
  'work-orders': 'Work Orders',
  'onboarding-packets': 'Onboarding Packet',
  'new-hire-checklist': 'New Hire Checklist',
  'training-level1': 'Training L1',
  'training-level2': 'Training L2',
  'training-level3': 'Training L3',
  'training-slicer': 'Slicer Training', // RT-145: missing 4 training types
  'training-opener': 'Opener Training',
  'training-shiftlead': 'Shift Lead Training',
  'training-orientation': 'Orientation Packet',
};

export async function GET() {
  try {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (!checkAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const raw = isDemo(session) ? DEMO_LOGS : (await loadJsonFileAsync('activity-logs.json') || []);
  const logs = Array.isArray(raw) ? raw : [];

  const now = Date.now();
  const msDay = 86400000;
  const msWeek = 7 * msDay;
  const ms30 = 30 * msDay;

  let today = 0, thisWeek = 0, thisMonth = 0;
  const typeCounts = {};
  const userSet30 = new Set();
  const userSet7 = new Set();
  const dailyCounts = {};

  for (const log of logs) {
    const ts = log.timestamp ? new Date(log.timestamp).getTime() : 0;
    const age = now - ts;
    if (age < msDay) today++;
    if (age < msWeek) { thisWeek++; userSet7.add(log.userId); }
    if (age < ms30) { thisMonth++; userSet30.add(log.userId); }

    const type = log.generatorType || 'unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;

    // Daily breakdown for last 7 days
    if (age < msWeek) {
      const day = new Date(ts).toLocaleDateString('en-US', { weekday: 'short' });
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }
  }

  const topGenerators = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, label: GENERATOR_LABELS[type] || type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return NextResponse.json({
    total: logs.length,
    today,
    thisWeek,
    thisMonth,
    activeUsers7: userSet7.size,
    activeUsers30: userSet30.size,
    topGenerators,
    dailyCounts,
  });
  } catch (err) {
    console.error('[logs/analytics] GET error:', err);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
