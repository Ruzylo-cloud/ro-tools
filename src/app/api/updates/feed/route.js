/**
 * Updates Feed API — company news feed publish/list.
 *
 * RT-240: Stores updates in /data/updates.json on the mounted GCS volume.
 * Previously proxied to Mission Control, but MC never shipped the /api/updates
 * CRUD endpoints, so the UI was permanently stuck in localStorage fallback.
 * Keeping the state server-side makes the feed shared across users and survives
 * browser resets, which is what "Company News Feed" was always supposed to be.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

const UPDATES_FILE = 'updates.json';

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ro_session');
  if (!session) return null;
  return verifySessionToken(session.value);
}

function newId() {
  return `upd_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function loadUpdates() {
  const data = await loadJsonFileAsync(UPDATES_FILE);
  // File shape: { updates: [...] } — tolerate legacy plain-array dumps.
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.updates) ? data.updates : [];
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const updates = await loadUpdates();
    return NextResponse.json({ updates });
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

    // Only admins publish to the company feed.
    const profiles = await loadJsonFileAsync('profiles.json');
    const myProfile = profiles[session.id];
    const isAdmin = isSuperAdmin(session.email) || isDefaultAdmin(session.email)
      || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

    const entry = {
      id: newId(),
      title: String(body.title || '').slice(0, 200),
      bodyMarkdown: String(body.bodyMarkdown || '').slice(0, 20000),
      imageUrl: body.imageUrl ? String(body.imageUrl).slice(0, 500) : null,
      author: session.email || session.name || 'unknown',
      authorName: body.author || session.name || session.email || 'unknown',
      date: body.date || new Date().toISOString(),
      pinned: Boolean(body.pinned),
      createdAt: new Date().toISOString(),
    };

    await updateJsonFile(UPDATES_FILE, (data) => {
      const list = Array.isArray(data) ? data : (Array.isArray(data?.updates) ? data.updates : []);
      return { updates: [entry, ...list].slice(0, 500) };
    });

    return NextResponse.json(entry);
  } catch (err) {
    console.error('[updates/feed] POST error:', err);
    return NextResponse.json({ error: 'Failed to create update', detail: String(err) }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const originError = enforceSameOriginMutation(request);
    if (originError) return originError;

    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const profiles = await loadJsonFileAsync('profiles.json');
    const myProfile = profiles[session.id];
    const isAdmin = isSuperAdmin(session.email) || isDefaultAdmin(session.email)
      || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await updateJsonFile(UPDATES_FILE, (data) => {
      const list = Array.isArray(data) ? data : (Array.isArray(data?.updates) ? data.updates : []);
      return { updates: list.filter(u => u.id !== id) };
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[updates/feed] DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete update', detail: String(err) }, { status: 500 });
  }
}
