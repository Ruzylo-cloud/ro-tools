/**
 * Directives API — proxies to Mission Control for marketing directives data.
 * GET: fetch directives (current month or specified)
 * POST: create outreach entry (RO logs a visit)
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
    const session = await getSession(); // RT-144: was missing await — session check always passed
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const apiKey = getMissionControlApiKey();
    if (!apiKey) return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || '';
    const url = `${MC_URL}/api/directives${month ? '?month=' + encodeURIComponent(month) : ''}`;

    const res = await fetch(url, {
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error('[directives] MC responded with', res.status);
      return NextResponse.json({ error: 'Failed to fetch directives' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives] Failed to fetch directives:', err);
    return NextResponse.json({ error: 'Failed to fetch directives', detail: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const session = await getSession(); // RT-144: was missing await
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const apiKey = getMissionControlApiKey();
    if (!apiKey) return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { directiveId, comment, response } = body;
    const forwardBody = { author: session.email || session.name };
    if (directiveId !== undefined) forwardBody.directiveId = directiveId;
    if (comment !== undefined && typeof comment === 'string') forwardBody.comment = comment.slice(0, 2000);
    if (response !== undefined && typeof response === 'string') forwardBody.response = response.slice(0, 2000);

    const res = await fetch(`${MC_URL}/api/directives/outreach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(forwardBody),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error('[directives] MC POST responded with', res.status);
      return NextResponse.json({ error: 'Failed to save outreach' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives] Failed to save outreach:', err);
    return NextResponse.json({ error: 'Failed to save outreach', detail: String(err) }, { status: 500 });
  }
}
