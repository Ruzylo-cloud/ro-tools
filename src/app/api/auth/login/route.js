import { NextResponse } from 'next/server';
import { getAuthUrl, getMobileAuthUrl } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mobile = searchParams.get('mobile') === 'true';

  const url = mobile ? getMobileAuthUrl() : getAuthUrl();
  return NextResponse.redirect(url);
}
