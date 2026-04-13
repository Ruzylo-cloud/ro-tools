/**
 * GET /api/directives/static — returns the shared DIRECTIVES array
 * flattened into the simple {id,title,content,category,publishedAt}
 * shape consumed by the ro-tools-ios DirectivesView. Keeps the web
 * dashboard and the iOS app showing the exact same directives.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { DIRECTIVES, flattenDirective } from '@/lib/directives-static';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const directives = DIRECTIVES.map(flattenDirective);
  return NextResponse.json({ directives });
}
