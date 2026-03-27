import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadJsonFile('profiles.json');
  const myProfile = profiles[session.id];
  const isAdmin = isSuperAdmin(session.email) || isDefaultAdmin(session.email) || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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
