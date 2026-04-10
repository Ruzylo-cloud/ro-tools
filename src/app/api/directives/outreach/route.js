/**
 * Outreach Tracker API — proxies to Mission Control.
 * GET: fetch outreach entries for the current user's store
 * POST: log a new outreach visit
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ro_session');
  if (!session) return null;
  return verifySessionToken(session.value);
}

export async function GET(request) {
  try {
    const session = await getSession(); // RT-144: async getSession requires await
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const apiKey = getMissionControlApiKey();
    if (!apiKey) return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || '';
    const res = await fetch(`${MC_URL}/api/directives/outreach${month ? '?month=' + encodeURIComponent(month) : ''}`, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error('[directives/outreach] MC responded with', res.status);
      return NextResponse.json({ error: 'Failed to fetch outreach' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives/outreach] Failed to fetch outreach:', err);
    return NextResponse.json({ error: 'Failed', detail: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const session = await getSession(); // RT-144: async getSession requires await
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const apiKey = getMissionControlApiKey();
    if (!apiKey) return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });

    const body = await request.json();
    const res = await fetch(`${MC_URL}/api/directives/outreach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ ...body, author: session.email || session.name }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives/outreach] Failed to save outreach:', err);
    return NextResponse.json({ error: 'Failed', detail: String(err) }, { status: 500 });
  }
}
