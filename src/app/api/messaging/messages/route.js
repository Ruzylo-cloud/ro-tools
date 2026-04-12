import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/messaging/messages?channelId=xxx&before=timestamp&limit=50
 * Returns messages for a channel, newest first.
 */
export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  if (!channelId) return NextResponse.json({ error: 'channelId required' }, { status: 400 });

  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
  const before = searchParams.get('before') || null;

  const msgData = await loadJsonFileAsync('messaging.json');
  let messages = (msgData.messages || [])
    .filter(m => m.channelId === channelId && !m.deleted);

  if (before) {
    const beforeTime = new Date(before).getTime();
    messages = messages.filter(m => new Date(m.createdAt).getTime() < beforeTime);
  }

  messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  messages = messages.slice(0, limit);

  // Mark as read
  await updateJsonFile('messaging.json', (data) => {
    if (!data.readState) data.readState = {};
    if (!data.readState[session.email]) data.readState[session.email] = {};
    data.readState[session.email][channelId] = Date.now();
    return data;
  });

  // Audit: read receipt
  await appendAudit({
    action: 'channel_read',
    channelId,
    actor: session.email,
    details: { messageCount: messages.length },
  });

  return NextResponse.json({ messages: messages.reverse(), hasMore: messages.length === limit });
}

/**
 * POST /api/messaging/messages — Send, edit, delete, or react to a message.
 * Body for send: { action: 'send', channelId, content }
 * Body for edit: { action: 'edit', messageId, content }
 * Body for delete: { action: 'delete', messageId }
 * Body for react: { action: 'react', messageId, emoji }
 */
export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('msg-send', 60000, 60, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const action = body.action;

  if (action === 'send') {
    return handleSend(session, body);
  } else if (action === 'edit') {
    return handleEdit(session, body);
  } else if (action === 'delete') {
    return handleDelete(session, body);
  } else if (action === 'react') {
    return handleReact(session, body);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

async function handleSend(session, body) {
  const channelId = body.channelId;
  const content = String(body.content || '').trim().slice(0, 5000);
  if (!channelId || !content) {
    return NextResponse.json({ error: 'channelId and content required' }, { status: 400 });
  }

  const message = {
    id: crypto.randomUUID(),
    channelId,
    sender: session.email,
    senderName: session.name || session.email.split('@')[0],
    senderPhoto: session.picture || '',
    content,
    createdAt: new Date().toISOString(),
    editedAt: null,
    deleted: false,
    reactions: {},
  };

  await updateJsonFile('messaging.json', (data) => {
    if (!data.messages) data.messages = [];
    data.messages.push(message);
    return data;
  });

  await appendAudit({
    action: 'message_sent',
    channelId,
    messageId: message.id,
    actor: session.email,
    details: { contentLength: content.length, contentPreview: content.slice(0, 100) },
  });

  // Create notification for channel members
  await createMessageNotification(session, channelId, content);

  return NextResponse.json({ message }, { status: 201 });
}

async function handleEdit(session, body) {
  const messageId = body.messageId;
  const newContent = String(body.content || '').trim().slice(0, 5000);
  if (!messageId || !newContent) {
    return NextResponse.json({ error: 'messageId and content required' }, { status: 400 });
  }

  let originalContent = '';
  let found = false;

  await updateJsonFile('messaging.json', (data) => {
    const msg = (data.messages || []).find(m => m.id === messageId);
    if (!msg) return data;
    if (msg.sender !== session.email) return data;
    originalContent = msg.content;
    msg.content = newContent;
    msg.editedAt = new Date().toISOString();
    if (!msg.editHistory) msg.editHistory = [];
    msg.editHistory.push({ content: originalContent, editedAt: msg.editedAt, editedBy: session.email });
    found = true;
    return data;
  });

  if (!found) return NextResponse.json({ error: 'Message not found or not yours' }, { status: 404 });

  await appendAudit({
    action: 'message_edited',
    messageId,
    actor: session.email,
    details: { originalContent, newContent, originalLength: originalContent.length, newLength: newContent.length },
  });

  return NextResponse.json({ success: true });
}

async function handleDelete(session, body) {
  const messageId = body.messageId;
  if (!messageId) return NextResponse.json({ error: 'messageId required' }, { status: 400 });

  let deletedContent = '';
  let found = false;

  await updateJsonFile('messaging.json', (data) => {
    const msg = (data.messages || []).find(m => m.id === messageId);
    if (!msg) return data;
    if (msg.sender !== session.email) return data;
    deletedContent = msg.content;
    msg.deleted = true;
    msg.deletedAt = new Date().toISOString();
    msg.deletedBy = session.email;
    // Keep the message record for audit — just mark deleted
    found = true;
    return data;
  });

  if (!found) return NextResponse.json({ error: 'Message not found or not yours' }, { status: 404 });

  await appendAudit({
    action: 'message_deleted',
    messageId,
    actor: session.email,
    details: { deletedContent, contentLength: deletedContent.length },
  });

  return NextResponse.json({ success: true });
}

async function handleReact(session, body) {
  const messageId = body.messageId;
  const emoji = String(body.emoji || '').slice(0, 4);
  if (!messageId || !emoji) return NextResponse.json({ error: 'messageId and emoji required' }, { status: 400 });

  await updateJsonFile('messaging.json', (data) => {
    const msg = (data.messages || []).find(m => m.id === messageId);
    if (!msg) return data;
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
    const idx = msg.reactions[emoji].indexOf(session.email);
    if (idx >= 0) {
      msg.reactions[emoji].splice(idx, 1); // toggle off
    } else {
      msg.reactions[emoji].push(session.email);
    }
    return data;
  });

  await appendAudit({
    action: 'message_reaction',
    messageId,
    actor: session.email,
    details: { emoji },
  });

  return NextResponse.json({ success: true });
}

async function createMessageNotification(session, channelId, content) {
  try {
    // Store notification in local messaging data for unread tracking
    // The existing notification system proxies to MC — this adds local tracking
    await updateJsonFile('messaging-notifications.json', (data) => {
      if (!data.pending) data.pending = [];
      data.pending.push({
        id: crypto.randomUUID(),
        channelId,
        sender: session.email,
        senderName: session.name || session.email.split('@')[0],
        preview: content.slice(0, 100),
        createdAt: new Date().toISOString(),
      });
      // Keep last 500
      if (data.pending.length > 500) data.pending = data.pending.slice(-500);
      return data;
    });
  } catch { /* non-fatal */ }
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
