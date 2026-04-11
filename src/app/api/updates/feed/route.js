/**
 * Updates Feed API — company news feed publish/list.
 * Proxies to Mission Control GET/POST /api/updates.
 *
 * Separate from the existing /api/updates route which serves the navbar bell
 * (backed by the local changelog.js). This subroute is the real MC-backed
 * company news timeline used by the /dashboard/updates publishing UI.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ro_session');
  if (!session) return null;
  return verifySessionToken(session.value);
}

function mcHeaders(extra = {}) {
  const key = process.env.MC_DEV_API_KEY?.trim() || '';
  return { 'X-Dev-Key': key, 'x-api-key': key, ...extra };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (!process.env.MC_DEV_API_KEY) {
      return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });
    }

    const res = await fetch(`${MC_URL}/api/updates`, {
      headers: mcHeaders(),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (res.status === 404) {
      return NextResponse.json({ error: 'not-implemented', updates: [] }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch updates' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[updates/feed] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch updates', detail: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (!process.env.MC_DEV_API_KEY) {
      return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });
    }

    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

    const payload = {
      title: String(body.title || '').slice(0, 200),
      bodyMarkdown: String(body.bodyMarkdown || '').slice(0, 20000),
      imageUrl: body.imageUrl ? String(body.imageUrl).slice(0, 500) : null,
      author: session.email || session.name || 'unknown',
      authorName: body.author || session.name || session.email || 'unknown',
      date: body.date || new Date().toISOString(),
      pinned: Boolean(body.pinned),
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(`${MC_URL}/api/updates`, {
      method: 'POST',
      headers: mcHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (res.status === 404) {
      return NextResponse.json({ error: 'not-implemented', echo: payload }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to create update' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[updates/feed] POST error:', err);
    return NextResponse.json({ error: 'Failed to create update', detail: String(err) }, { status: 500 });
  }
}
