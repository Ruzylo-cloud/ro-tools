import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';
import { DEMO_TICKETS, isDemo } from '@/lib/demo-data';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const TICKETS_FILE = path.join(DATA_DIR, 'support-tickets.json');

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true }).catch((e) => { console.debug('[support] mkdir failed (non-fatal):', e); });
  try {
    await fs.access(TICKETS_FILE);
  } catch {
    await fs.writeFile(TICKETS_FILE, '[]');
  }
}

async function loadTickets() {
  await ensureFile();
  try {
    const content = await fs.readFile(TICKETS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  if (isDemo(session)) {
    return NextResponse.json({ tickets: DEMO_TICKETS });
  }

  const tickets = await loadTickets();
  const mine = tickets.filter(t => t.userId === session.id);
  return NextResponse.json({ tickets: mine });
}

export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  // Rate limit: 10 tickets per minute per IP
  const { limited } = rateLimit('support', 60000, 10, request);
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  if (isDemo(session)) {
    return NextResponse.json({ success: true, demo: true });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.type || !body.title || !body.description) {
    return NextResponse.json({ error: 'Type, title, and description required' }, { status: 400 });
  }

  // Validate input lengths
  const type = body.type === 'bug' ? 'bug' : 'feature';
  if (String(body.title).length > 200) return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 });
  if (String(body.description).length > 2000) return NextResponse.json({ error: 'Description must be 2000 characters or less' }, { status: 400 });
  const title = String(body.title);
  const description = String(body.description);

  const tickets = await loadTickets();

  const ticket = {
    id: crypto.randomUUID(),
    type,
    title,
    description,
    status: 'open',
    userId: session.id,
    userName: session.name,
    userEmail: session.email,
    createdAt: new Date().toISOString(),
  };

  // RT-155: Store priority and category for feature requests
  if (type === 'feature') {
    const VALID_PRIORITIES = ['nice-to-have', 'medium', 'high', 'critical'];
    if (body.priority && VALID_PRIORITIES.includes(body.priority)) ticket.priority = body.priority;
    if (body.category) {
      if (String(body.category).length > 100) return NextResponse.json({ error: 'Category must be 100 characters or less' }, { status: 400 });
      ticket.category = String(body.category);
    }
  }

  tickets.push(ticket);
  const tmpPath = TICKETS_FILE + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(tickets, null, 2));
  await fs.rename(tmpPath, TICKETS_FILE);

  return NextResponse.json({ success: true, ticket });
}
