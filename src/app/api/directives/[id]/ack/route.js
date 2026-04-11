/**
 * Directive Acknowledgement — POST /api/directives/:id/ack
 * Records that the current user acknowledged a directive.
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

export async function POST(request, { params }) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (!process.env.MC_DEV_API_KEY) {
      return NextResponse.json({ error: 'Mission Control API key not configured' }, { status: 503 });
    }

    const { id } = params;
    const safeId = encodeURIComponent(String(id || ''));
    if (!safeId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const payload = {
      userEmail: session.email || null,
      userName: session.name || session.email || 'unknown',
      acknowledgedAt: new Date().toISOString(),
    };

    const res = await fetch(`${MC_URL}/api/directives/${safeId}/ack`, {
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
      return NextResponse.json({ error: 'Failed to record acknowledgement' }, { status: res.status >= 500 ? 502 : res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[directives/:id/ack] POST error:', err);
    return NextResponse.json({ error: 'Failed to record ack', detail: String(err) }, { status: 500 });
  }
}
