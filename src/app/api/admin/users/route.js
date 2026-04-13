import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { DEMO_USERS, isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Demo mode: return sample users
  if (isDemo(session)) {
    return NextResponse.json({ users: DEMO_USERS });
  }

  const profiles = loadJsonFile('profiles.json');
  const myProfile = profiles[session.id];
  const isAdmin = isSuperAdmin(session.email) || isDefaultAdmin(session.email) || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // RT-235: Dedupe profiles by email. Over time the same user can accumulate
  // multiple profile rows (different Google sub IDs, name changes, legacy keys).
  // Prefer the most-recently-logged-in, most-complete, highest-role record.
  const ROLE_RANK = { administrator: 3, district_manager: 2, operator: 1, '': 0 };
  const byEmail = new Map();
  for (const [id, profile] of Object.entries(profiles)) {
    const email = (profile?.email || '').toLowerCase();
    if (!email) continue;
    const row = {
      id,
      email: profile.email,
      displayName: profile.displayName || profile.userName,
      role: profile.role,
      roleApproved: profile.roleApproved,
      rolePending: profile.rolePending,
      setupComplete: profile.setupComplete,
      stores: profile.stores?.length || 0,
      storeNumber: profile.storeNumber || '',
      lastLoginAt: profile.lastLoginAt || null,
    };
    const existing = byEmail.get(email);
    if (!existing) { byEmail.set(email, row); continue; }
    const score = (r) => (ROLE_RANK[r.role] || 0) * 1e13 + (r.setupComplete ? 1e12 : 0) + (Date.parse(r.lastLoginAt || 0) || 0);
    if (score(row) > score(existing)) byEmail.set(email, row);
  }
  const users = Array.from(byEmail.values());

  return NextResponse.json({ users });
}
