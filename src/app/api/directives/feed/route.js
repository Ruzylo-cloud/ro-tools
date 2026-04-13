/**
 * Directives Feed API — publish/list announcement directives.
 * Proxies to Mission Control CRUD endpoints.
 *
 * GET  /api/directives/feed         → list directives (MC GET /api/directives)
 * POST /api/directives/feed         → create directive (MC POST /api/directives)
 *
 * NOTE: Uses inline MC fetch helper (DO NOT import src/lib/missionControl.js — under active edit).
 * Sends both X-Dev-Key and x-api-key for compatibility with the MC side's header convention.
 *
 * MC directives CRUD (src/routes/directives.ts) is shipped, so the 404
 * branch below is a defensive fallback for transient outages — not a
 * permanent "not yet implemented" gap as earlier drafts assumed.
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
  return {
    'X-Dev-Key': key,
    'x-api-key': key,
    ...extra,
  };
}

async function mcFetch(path, init = {}) {
  return fetch(`${MC_URL}${path}`, {
    ...init,
    headers: mcHeaders(init.headers || {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (!process.env.MC_DEV_API_KEY) {
      return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });
    }

    const res = await mcFetch('/api/directives');
    if (res.status === 404) {
      return NextResponse.json({ error: 'not-implemented', directives: [] }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch directives' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives/feed] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch directives', detail: String(err) }, { status: 500 });
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
      priority: ['high', 'medium', 'low'].includes(body.priority) ? body.priority : 'medium',
      audience: Array.isArray(body.audience) ? body.audience.slice(0, 10) : ['all'],
      effectiveDate: body.effectiveDate || null,
      expiryDate: body.expiryDate || null,
      requiresAck: Boolean(body.requiresAck),
      author: session.email || session.name || 'unknown',
      authorName: session.name || session.email || 'unknown',
      createdAt: new Date().toISOString(),
    };

    const res = await mcFetch('/api/directives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 404) {
      return NextResponse.json({ error: 'not-implemented', echo: payload }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to create directive' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives/feed] POST error:', err);
    return NextResponse.json({ error: 'Failed to create directive', detail: String(err) }, { status: 500 });
  }
}
