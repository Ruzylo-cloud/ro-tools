import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { getAutoChannels, resolveMessagingRole, getDMForStore } from '@/lib/messaging';

export const dynamic = 'force-dynamic';

/**
 * GET /api/messaging/channels — Returns auto-channels + user-created groups/DMs.
 */
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = await loadJsonFileAsync('profiles.json');
  const profile = profiles[session.id] || {};
  const role = resolveMessagingRole(profile);
  const storeId = profile.storeNumber || null;
  const dmName = storeId ? getDMForStore(storeId) : null;

  // Auto channels based on role
  const autoChannels = getAutoChannels(role, storeId, dmName);

  // User-created groups and DMs
  const msgData = await loadJsonFileAsync('messaging.json');
  const userChannels = (msgData.channels || []).filter(ch => {
    if (ch.type !== 'group' && ch.type !== 'dm') return false;
    return (ch.members || []).includes(session.email);
  });

  // Unread counts
  const messages = msgData.messages || [];
  const readState = (msgData.readState || {})[session.email] || {};
  const channelIds = [...autoChannels.map(c => c.id), ...userChannels.map(c => c.id)];
  const unreadCounts = {};
  for (const chId of channelIds) {
    const lastRead = readState[chId] || 0;
    const chMessages = messages.filter(m => m.channelId === chId && !m.deleted && new Date(m.createdAt).getTime() > lastRead);
    unreadCounts[chId] = chMessages.length;
  }

  return NextResponse.json({
    autoChannels,
    userChannels,
    unreadCounts,
    role,
  });
}

/**
 * POST /api/messaging/channels — Create a group or DM.
 * Body: { type: 'group'|'dm', name?, members: [email, ...] }
 */
export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('msg-channel-create', 60000, 10, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const type = body.type;
  if (type !== 'group' && type !== 'dm') {
    return NextResponse.json({ error: 'type must be group or dm' }, { status: 400 });
  }

  const members = Array.isArray(body.members) ? body.members.map(m => String(m).trim().toLowerCase()).filter(Boolean).slice(0, 50) : [];
  if (!members.includes(session.email)) members.push(session.email);
  if (type === 'dm' && members.length !== 2) {
    return NextResponse.json({ error: 'DM requires exactly 2 members' }, { status: 400 });
  }

  const channel = {
    id: crypto.randomUUID(),
    type,
    name: type === 'group' ? String(body.name || 'Group Chat').trim().slice(0, 100) : '',
    members,
    createdBy: session.email,
    createdAt: new Date().toISOString(),
  };

  await updateJsonFile('messaging.json', (data) => {
    if (!data.channels) data.channels = [];
    // For DMs, check if one already exists between these two
    if (type === 'dm') {
      const existing = data.channels.find(ch =>
        ch.type === 'dm' && ch.members.length === 2 &&
        ch.members.includes(members[0]) && ch.members.includes(members[1])
      );
      if (existing) {
        channel.id = existing.id; // Return existing
        return data;
      }
    }
    data.channels.push(channel);
    return data;
  });

  // Audit
  await appendAudit({
    action: 'channel_created',
    channelId: channel.id,
    actor: session.email,
    details: { type, name: channel.name, members },
  });

  return NextResponse.json({ channel }, { status: 201 });
}

async function appendAudit(entry) {
  await updateJsonFile('messaging-audit.json', (data) => {
    if (!data.log) data.log = [];
    data.log.push({
      id: crypto.randomUUID(),
      ...entry,
      timestamp: new Date().toISOString(),
    });
    return data;
  });
}
