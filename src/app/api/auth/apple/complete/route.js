import { NextResponse } from 'next/server';
import { verifyCode, saveAppleLink } from '@/lib/apple-verifications';
import { createSessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/apple/complete
 * Body: { appleUserId, appleEmail, fullName, jmvalleyEmail, verificationCode, mobile? }
 * Verifies the code, persists the Apple→email link, and returns a signed
 * session token. Mobile clients get the token in the JSON body; web
 * clients get it set as an httpOnly cookie.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const appleUserId = String(body?.appleUserId || body?.apple_user_id || '').trim();
  const jmvalleyEmail = String(body?.jmvalleyEmail || body?.jmvalley_email || '')
    .trim()
    .toLowerCase();
  const verificationCode = String(body?.verificationCode || body?.verification_code || '').trim();
  const appleEmail = body?.appleEmail || body?.apple_email || null;
  const fullName = body?.fullName || body?.full_name || null;
  const mobile = Boolean(body?.mobile);

  if (!appleUserId || !jmvalleyEmail || !verificationCode) {
    return NextResponse.json(
      { error: 'appleUserId, jmvalleyEmail, and verificationCode are required' },
      { status: 400 }
    );
  }

  if (!jmvalleyEmail.endsWith('@jmvalley.com')) {
    return NextResponse.json(
      { error: 'Use your @jmvalley.com email address.' },
      { status: 400 }
    );
  }

  const result = await verifyCode({ appleUserId, jmvalleyEmail, code: verificationCode });
  if (!result.ok) {
    if (result.error === 'invalid_code') {
      return NextResponse.json(
        { error: 'Invalid code. Try again.', attemptsRemaining: result.attemptsRemaining },
        { status: 400 }
      );
    }
    if (result.error === 'too_many_attempts') {
      return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 });
    }
    return NextResponse.json(
      { error: 'Code expired. Request a new one.' },
      { status: 410 }
    );
  }

  await saveAppleLink({ appleUserId, jmvalleyEmail, appleEmail, fullName });

  const sessionData = {
    accessToken: null,
    refreshToken: null,
    email: jmvalleyEmail,
    name: fullName || jmvalleyEmail.split('@')[0],
    picture: null,
    id: `apple:${appleUserId}`,
    appleUserId,
    appleEmail: appleEmail || null,
    hasExtendedScopes: false,
    authProvider: 'apple',
  };

  const signed = createSessionToken(sessionData);

  if (mobile) {
    return NextResponse.json({
      ok: true,
      session: signed,
      email: jmvalleyEmail,
      name: fullName || null,
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('ro_session', signed, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
