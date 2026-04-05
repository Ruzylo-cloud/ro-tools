import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

/**
 * GET /api/notifications — proxy to RC notification count for the current user.
 * Uses the user's Google email to look up their store in RC's employee table.
 */
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const res = await fetch(
      `${MC_URL}/api/notifications/external-count?email=${encodeURIComponent(session.email)}`,
      {
        headers: { 'X-Dev-Key': DEV_KEY },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return NextResponse.json({ count: 0 });
    const data = await res.json();
    return NextResponse.json({ count: data.count || 0 });
  } catch {
    // RC unreachable — fail silently, don't break RT
    return NextResponse.json({ count: 0 });
  }
}
