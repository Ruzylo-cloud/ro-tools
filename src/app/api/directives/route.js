/**
 * Directives API — proxies to Mission Control for marketing directives data.
 * GET: fetch directives (current month or specified)
 * POST: create outreach entry (RO logs a visit)
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ro_session');
  if (!session) return null;
  return verifySessionToken(session.value);
}

export async function GET(request) {
  try {
    const session = getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || '';
    const url = `${MC_URL}/api/directives${month ? '?month=' + encodeURIComponent(month) : ''}`;

    const res = await fetch(url, {
      headers: { 'x-api-key': DEV_KEY },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch directives', detail: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const res = await fetch(`${MC_URL}/api/directives/outreach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': DEV_KEY,
      },
      body: JSON.stringify({ ...body, author: session.email || session.name }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save outreach', detail: String(err) }, { status: 500 });
  }
}
