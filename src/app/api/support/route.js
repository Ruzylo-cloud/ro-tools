import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const TICKETS_FILE = path.join(DATA_DIR, 'support-tickets.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TICKETS_FILE)) fs.writeFileSync(TICKETS_FILE, '[]');
}

function loadTickets() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(TICKETS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const tickets = loadTickets();
  const mine = tickets.filter(t => t.userId === session.id);
  return NextResponse.json({ tickets: mine });
}

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  if (!body.type || !body.title || !body.description) {
    return NextResponse.json({ error: 'Type, title, and description required' }, { status: 400 });
  }

  // Sanitize inputs
  const type = body.type === 'bug' ? 'bug' : 'feature';
  const title = String(body.title).slice(0, 200);
  const description = String(body.description).slice(0, 2000);

  ensureFile();
  const tickets = loadTickets();

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
  fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2));

  return NextResponse.json({ success: true, ticket });
}
