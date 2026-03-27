import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/demo — Creates a demo session with pre-seeded data.
 * No Google account needed. 2-hour expiry. Read-only access.
 */
export async function GET(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${proto}://${host}`;

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
