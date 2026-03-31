import { NextResponse } from 'next/server';
import { getTokensFromCode, getUserInfo } from '@/lib/google-auth';
import { createSessionToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

function getBaseUrl(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const baseUrl = getBaseUrl(request);

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }

  try {
    const tokens = await getTokensFromCode(code);
    const userInfo = await getUserInfo(tokens.access_token);

    // Verify domain
    if (!userInfo.email?.endsWith('@jmvalley.com')) {
      return NextResponse.redirect(`${baseUrl}/?error=domain_restricted`);
    }

    // Check if extended scopes were granted (scope upgrade flow)
    const grantedScope = tokens.scope || '';
    const hasExtendedScopes = grantedScope.includes('drive') || grantedScope.includes('spreadsheets');

    const sessionData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      id: userInfo.id,
      hasExtendedScopes,
    };

    // Sign the session token (HMAC-SHA256)
    const signed = createSessionToken(sessionData);

    // Mobile app: redirect to rotools:// URL scheme with session token
    if (state === 'mobile') {
      const mobileCallback = `rotools://auth/callback?session=${encodeURIComponent(signed)}`;
      return NextResponse.redirect(mobileCallback);
    }

    // Redirect to intermediate page that sets cookie on our domain
    // This works around Mobile Safari ITP blocking cookies on cross-site redirects
    const returnTo = state && state.startsWith('/') ? state : '/dashboard';
    const authLandingUrl = `${baseUrl}/api/auth/session?token=${encodeURIComponent(signed)}&next=${encodeURIComponent(returnTo)}`;
    return NextResponse.redirect(authLandingUrl);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
