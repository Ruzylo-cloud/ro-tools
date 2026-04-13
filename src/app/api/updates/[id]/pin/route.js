/**
 * Updates Pin — PUT /api/updates/:id/pin
 * Toggle pinned status on a company news update.
 * RT-240: Moved off Mission Control to local /data/updates.json storage.
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

export async function PUT(request, { params }) {
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

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    let body;
    try { body = await request.json(); } catch { body = {}; }
    const pinned = Boolean(body.pinned);

    let updated = null;
    await updateJsonFile(UPDATES_FILE, (data) => {
      const list = Array.isArray(data) ? data : (Array.isArray(data?.updates) ? data.updates : []);
      const next = list.map(u => {
        if (u.id === id) { updated = { ...u, pinned }; return updated; }
        return u;
      });
      return { updates: next };
    });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[updates/:id/pin] PUT error:', err);
    return NextResponse.json({ error: 'Failed to pin update', detail: String(err) }, { status: 500 });
  }
}
