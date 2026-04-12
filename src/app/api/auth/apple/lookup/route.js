import { NextResponse } from 'next/server';
import { findAppleLink, touchAppleLink } from '@/lib/apple-verifications';
import { createSessionToken } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/apple/lookup
 * Body: { appleUserId }
 * Returns { linked: false } if the Apple ID has never been linked,
 * or { linked: true, session: <signedToken>, email, name } if a
 * previous link exists — in which case the client is immediately signed in.
 */
export async function POST(request) {
  const { limited } = rateLimit('apple-lookup', 60000, 15, request);
  if (limited) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const appleUserId = String(body?.appleUserId || body?.apple_user_id || '').trim();
  if (!appleUserId) {
    return NextResponse.json({ error: 'appleUserId is required' }, { status: 400 });
  }

  const link = findAppleLink(appleUserId);
  if (!link) {
    return NextResponse.json({ linked: false });
  }

  const sessionData = {
    accessToken: null,
    refreshToken: null,
    email: link.jmvalleyEmail,
    name: link.fullName || link.jmvalleyEmail.split('@')[0],
    picture: null,
    id: `apple:${appleUserId}`,
    appleUserId,
    appleEmail: link.appleEmail || null,
    hasExtendedScopes: false,
    authProvider: 'apple',
  };

  const signed = createSessionToken(sessionData);
  await touchAppleLink(appleUserId);

  return NextResponse.json({
    linked: true,
    session: signed,
    email: link.jmvalleyEmail,
    name: link.fullName || null,
  });
}
