import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { resolveMessagingRole } from '@/lib/messaging';

export const dynamic = 'force-dynamic';

/**
 * GET /api/messaging/audit?channelId=xxx&actor=xxx&action=xxx&from=iso&to=iso&limit=100&offset=0
 * Admin-only audit log query. Zero expiration — all records kept forever.
 */
export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { limited } = rateLimit('msg-audit', 60000, 20, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  // Only DM+ can view audit logs
  const profiles = await loadJsonFileAsync('profiles.json');
  const profile = profiles[session.id] || {};
  const role = resolveMessagingRole(profile);
  if (!['dm', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  const actor = searchParams.get('actor');
  const action = searchParams.get('action');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const auditData = await loadJsonFileAsync('messaging-audit.json');
  let log = auditData.log || [];

  if (channelId) log = log.filter(e => e.channelId === channelId);
  if (actor) log = log.filter(e => e.actor === actor);
  if (action) log = log.filter(e => e.action === action);
  if (from) {
    const fromTime = new Date(from).getTime();
    log = log.filter(e => new Date(e.timestamp).getTime() >= fromTime);
  }
  if (to) {
    const toTime = new Date(to).getTime();
    log = log.filter(e => new Date(e.timestamp).getTime() <= toTime);
  }

  // Newest first
  log.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const total = log.length;
  log = log.slice(offset, offset + limit);

  return NextResponse.json({ log, total, limit, offset });
}
