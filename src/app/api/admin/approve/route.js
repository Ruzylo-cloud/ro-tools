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
    return JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadProfiles();
  const myProfile = profiles[session.id];
  const isAdmin = isSuperAdmin(session.email) || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, action } = await request.json(); // action: 'approve' | 'deny'
  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }

  if (!profiles[userId]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (action === 'approve') {
    profiles[userId].roleApproved = true;
    profiles[userId].rolePending = false;
  } else if (action === 'deny') {
    // Downgrade to operator
    profiles[userId].role = 'operator';
    profiles[userId].roleApproved = true;
    profiles[userId].rolePending = false;
  }

  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));

  return NextResponse.json({ success: true });
}
