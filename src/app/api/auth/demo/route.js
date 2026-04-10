import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/demo — Creates a demo session with pre-seeded data.
 * No Google account needed. 2-hour expiry. Read-only access.
 * Pass ?mobile=1 to redirect to rotools://auth/callback?session=<token>
 * for the iOS app's App Store review flow.
 */
export async function GET(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${proto}://${host}`;
  const url = new URL(request.url);
  const isMobile = url.searchParams.get('mobile') === '1' || url.searchParams.get('mobile') === 'true';

  const sessionData = {
    accessToken: 'demo-token',
    refreshToken: null,
    email: 'demo@ro-tools.app',
    name: 'Demo User',
    picture: null,
    id: 'demo-user',
    isDemo: true,
    hasExtendedScopes: false,
  };

  const signed = createSessionToken(sessionData);

  if (isMobile) {
    const mobileCallback = `rotools://auth/callback?session=${encodeURIComponent(signed)}`;
    return NextResponse.redirect(mobileCallback);
  }

  const response = NextResponse.redirect(`${baseUrl}/dashboard`);
  response.cookies.set('ro_session', signed, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return response;
}
