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

    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }); }

    // Allowlist fields — never forward arbitrary client data to MC
    function cap(val) { return typeof val === 'string' ? val.slice(0, 2000) : val; }
    const safeBody = {
      business_name:  cap(body.business_name),
      contact_name:   cap(body.contact_name),
      contact_phone:  cap(body.contact_phone),
      contact_email:  cap(body.contact_email),
      visit_date:     cap(body.visit_date),
      notes:          cap(body.notes),
      store_number:   cap(body.store_number),
      status:         cap(body.status),
      follow_up_date: cap(body.follow_up_date),
      author:         session.email || session.name,
    };
    // Remove undefined keys so MC doesn't receive noise
    Object.keys(safeBody).forEach(k => safeBody[k] === undefined && delete safeBody[k]);

    const res = await fetch(`${MC_URL}/api/directives/outreach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(safeBody),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error('[directives/outreach] MC POST responded with', res.status);
      return NextResponse.json({ error: 'Failed to save outreach' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives/outreach] Failed to save outreach:', err);
    return NextResponse.json({ error: 'Failed', detail: String(err) }, { status: 500 });
  }
}
