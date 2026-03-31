import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';
import { DEMO_TICKETS, isDemo } from '@/lib/demo-data';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const TICKETS_FILE = path.join(DATA_DIR, 'support-tickets.json');

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});
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

  // Sanitize inputs
  const type = body.type === 'bug' ? 'bug' : 'feature';
  const title = String(body.title).slice(0, 200);
  const description = String(body.description).slice(0, 2000);

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

  tickets.push(ticket);
  const tmpPath = TICKETS_FILE + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(tickets, null, 2));
  await fs.rename(tmpPath, TICKETS_FILE);

  return NextResponse.json({ success: true, ticket });
}
