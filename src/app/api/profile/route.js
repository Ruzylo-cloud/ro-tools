import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { isSuperAdmin, needsApproval } from '@/lib/roles';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PROFILES_FILE)) fs.writeFileSync(PROFILES_FILE, '{}');
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

function loadProfiles() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveProfiles(profiles) {
  ensureDataDir();
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadProfiles();
  const profile = profiles[session.id] || null;

  // Inject computed admin status
  const isAdmin = isSuperAdmin(session.email) || (profile?.role === 'administrator' && profile?.roleApproved === true);

  return NextResponse.json({
    profile,
    isAdmin,
    isSuperAdmin: isSuperAdmin(session.email),
  });
}

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const profiles = loadProfiles();

  // If setting up for first time with a role that needs approval
  if (body.role && needsApproval(body.role)) {
    // Super admins are auto-approved
    if (isSuperAdmin(session.email)) {
      body.roleApproved = true;
    } else if (!profiles[session.id]?.roleApproved) {
      // New user requesting elevated role — mark as pending
      body.roleApproved = false;
      body.rolePending = true;
    }
  } else if (body.role === 'operator') {
    // Operators don't need approval
    body.roleApproved = true;
    body.rolePending = false;
  }

  profiles[session.id] = { ...profiles[session.id], ...body, email: session.email, userId: session.id, userName: session.name };
  saveProfiles(profiles);

  return NextResponse.json({ success: true });
}
