import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const TICKETS_FILE = path.join(DATA_DIR, 'support-tickets.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TICKETS_FILE)) fs.writeFileSync(TICKETS_FILE, '[]');
}

function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('ro_session');
  if (!session?.value) return null;
  try {
    return JSON.parse(Buffer.from(session.value, 'base64').toString());
  } catch {
    return null;
  }
}

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  ensureDataDir();
  try {
    const tickets = JSON.parse(fs.readFileSync(TICKETS_FILE, 'utf-8'));
    // Return only this user's tickets (admins could see all later)
    const mine = tickets.filter(t => t.userId === session.id);
    return NextResponse.json({ tickets: mine });
  } catch {
    return NextResponse.json({ tickets: [] });
  }
}

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  if (!body.type || !body.title || !body.description) {
    return NextResponse.json({ error: 'Type, title, and description required' }, { status: 400 });
  }

  ensureDataDir();
  let tickets = [];
  try { tickets = JSON.parse(fs.readFileSync(TICKETS_FILE, 'utf-8')); } catch {}

  const ticket = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type: body.type, // 'bug' | 'feature'
    title: body.title,
    description: body.description,
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
