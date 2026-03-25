import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { isSuperAdmin } from '@/lib/roles';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

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
  try {
    if (!fs.existsSync(PROFILES_FILE)) return {};
    return JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Check if user is admin
  const profiles = loadProfiles();
  const myProfile = profiles[session.id];
  const isAdmin = isSuperAdmin(session.email) || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Return all users
  const users = Object.entries(profiles).map(([id, profile]) => ({
    id,
    email: profile.email,
    displayName: profile.displayName || profile.userName,
    role: profile.role,
    roleApproved: profile.roleApproved,
    rolePending: profile.rolePending,
    setupComplete: profile.setupComplete,
    stores: profile.stores?.length || 0,
  }));

  return NextResponse.json({ users });
}
