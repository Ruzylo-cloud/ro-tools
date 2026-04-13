import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile } from '@/lib/data';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { rateLimit } from '@/lib/rate-limit';
import { normalizePrefs, setPrefsForUserId, DEFAULT_PREFS } from '@/lib/notification-prefs';

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile/notification-prefs
 * Returns the current user's notificationPrefs, normalized.
 */
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadJsonFile('profiles.json');
  const profile = profiles[session.id];
  const prefs = profile ? normalizePrefs(profile.notificationPrefs) : { ...DEFAULT_PREFS };
  return NextResponse.json({ prefs });
}

/**
 * PUT /api/profile/notification-prefs
 * Body: { email?: boolean, notifications?: boolean, sms?: boolean }
 * Only the current session's own prefs can be updated. No cross-user writes.
 */
export async function PUT(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('notif-prefs', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const prefs = await setPrefsForUserId(session.id, body || {});
    return NextResponse.json({ success: true, prefs });
  } catch (e) {
    console.error('[notification-prefs] update failed:', e);
    return NextResponse.json({ error: 'Failed to update prefs' }, { status: 500 });
  }
}
