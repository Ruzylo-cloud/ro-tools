import { NextResponse } from 'next/server';
import { getExtendedAuthUrl } from '@/lib/google-auth';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/upgrade?returnTo=/dashboard/generators/catering-order
 *
 * Redirects the user through Google OAuth to grant extended scopes
 * (Drive, Sheets, Docs, Gmail). After granting, they're sent back
 * to the returnTo URL with their session updated.
 */
export async function GET(request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  // Validate returnTo is a relative path (prevent open redirect)
  const safePath = returnTo.startsWith('/') ? returnTo : '/dashboard';

  const url = getExtendedAuthUrl(safePath);
  return NextResponse.redirect(url);
}
