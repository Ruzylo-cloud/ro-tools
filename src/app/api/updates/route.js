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

    // RT-159: Use title slug as part of id so prepending new entries within a version
    // doesn't recycle the same id and silently skip the notification bell
    const updates = changelog.slice(0, limit).map((entry) => ({
      id: `${entry.version}-${entry.title.slice(0, 40).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
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
