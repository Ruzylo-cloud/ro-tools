import { NextResponse } from 'next/server';
import { getAuthUrl, getMobileAuthUrl } from '@/lib/google-auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { limited } = rateLimit('auth-login', 60000, 10, request);
  if (limited) return NextResponse.json({ error: 'Too many login attempts' }, { status: 429 });
  const { searchParams } = new URL(request.url);
  const mobile = searchParams.get('mobile') === 'true';
  const remember = searchParams.get('remember') === '1'; // RT-251

  const url = mobile ? getMobileAuthUrl() : getAuthUrl(remember);
  return NextResponse.redirect(url);
}
