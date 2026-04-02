import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Intermediate session-setting page.
 *
 * Mobile Safari blocks cookies set during cross-site redirect responses
 * (Google OAuth → our callback). This endpoint receives the signed token
 * as a query param, sets it as a first-party cookie (because this request
 * originates from our own domain), then redirects to the dashboard.
 *
 * Flow: Google → /api/auth/callback → /api/auth/session?token=X → /dashboard
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const next = searchParams.get('next') || '/dashboard';

  if (!token) {
    return NextResponse.redirect(new URL('/?error=no_token', request.url));
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${proto}://${host}`;

  const response = NextResponse.redirect(`${baseUrl}${next}`);
  // RT-251: Remember me — 30-day cookie vs default 7-day
  const remember = searchParams.get('remember') === '1';

  // Set cookie — this is a same-origin request now, so Safari will accept it
  response.cookies.set('ro_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
  });

  return response;
}
