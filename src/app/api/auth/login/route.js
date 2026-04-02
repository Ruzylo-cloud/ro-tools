import { NextResponse } from 'next/server';
import { getAuthUrl, getMobileAuthUrl } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mobile = searchParams.get('mobile') === 'true';
  const remember = searchParams.get('remember') === '1'; // RT-251

  const url = mobile ? getMobileAuthUrl() : getAuthUrl(remember);
  return NextResponse.redirect(url);
}
