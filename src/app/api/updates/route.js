import { NextResponse } from 'next/server';
import { changelog } from '@/lib/changelog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/updates?limit=N
 * Returns changelog entries as "updates" for the Navbar notification bell.
 * Each entry gets a stable id from version+index.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    const updates = changelog.slice(0, limit).map((entry, i) => ({
      id: `${entry.version}-${i}`,
      version: entry.version,
      date: entry.date,
      category: entry.category,
      title: entry.title,
    }));

    return NextResponse.json({ updates });
  } catch {
    return NextResponse.json({ updates: [] });
  }
}
