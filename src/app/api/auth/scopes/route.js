import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/scopes — Check if user has extended scopes.
 * Makes a lightweight call to test Drive access.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // If session has a scope marker from the upgrade flow, return it
  const hasExtended = session.hasExtendedScopes === true;
  return NextResponse.json({ hasExtendedScopes: hasExtended });
}
