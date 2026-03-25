import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { isSuperAdmin } from '@/lib/roles';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const UPDATES_FILE = path.join(DATA_DIR, 'updates.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPDATES_FILE)) fs.writeFileSync(UPDATES_FILE, '[]');
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

function isAdmin(session) {
  if (isSuperAdmin(session.email)) return true;
  try {
    if (!fs.existsSync(PROFILES_FILE)) return false;
    const profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'));
    const profile = profiles[session.id];
    return profile?.role === 'administrator' && profile?.roleApproved === true;
  } catch {
    return false;
  }
}

// GET — all authenticated users can read updates
export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  ensureDataDir();
  try {
    const updates = JSON.parse(fs.readFileSync(UPDATES_FILE, 'utf-8'));
    return NextResponse.json({ updates });
  } catch {
    return NextResponse.json({ updates: [] });
  }
}

// POST — only admins can create updates
export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  if (!body.title || !body.description || !body.category) {
    return NextResponse.json({ error: 'Title, description, and category required' }, { status: 400 });
  }

  const validCategories = ['new_feature', 'improvement', 'bug_fix', 'announcement'];
  if (!validCategories.includes(body.category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  ensureDataDir();
  let updates = [];
  try { updates = JSON.parse(fs.readFileSync(UPDATES_FILE, 'utf-8')); } catch {}

  const update = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: body.title,
    description: body.description,
    category: body.category,
    version: body.version || null,
    authorName: session.name,
    authorEmail: session.email,
    createdAt: new Date().toISOString(),
  };

  updates.push(update);
  fs.writeFileSync(UPDATES_FILE, JSON.stringify(updates, null, 2));

  return NextResponse.json({ success: true, update });
}

// DELETE — only admins can delete updates
export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Update ID required' }, { status: 400 });

  ensureDataDir();
  let updates = [];
  try { updates = JSON.parse(fs.readFileSync(UPDATES_FILE, 'utf-8')); } catch {}

  const filtered = updates.filter(u => u.id !== id);
  if (filtered.length === updates.length) {
    return NextResponse.json({ error: 'Update not found' }, { status: 404 });
  }

  fs.writeFileSync(UPDATES_FILE, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}
