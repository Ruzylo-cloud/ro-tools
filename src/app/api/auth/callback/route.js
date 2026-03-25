import { NextResponse } from 'next/server';
import { getTokensFromCode, getUserInfo } from '@/lib/google-auth';

function getBaseUrl(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
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

    const sessionData = JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      id: userInfo.id,
    });

    const encoded = Buffer.from(sessionData).toString('base64');

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set('ro_session', encoded, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
