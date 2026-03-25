import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, needsApproval } from '@/lib/roles';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadJsonFile('profiles.json');
  const profile = profiles[session.id] || null;

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

  // Determine approval status for the role
  if (body.role && needsApproval(body.role)) {
    if (isSuperAdmin(session.email)) {
      body.roleApproved = true;
    } else {
      // Check if already approved (don't downgrade)
      const current = loadJsonFile('profiles.json')[session.id];
      if (!current?.roleApproved) {
        body.roleApproved = false;
        body.rolePending = true;
      }
    }
  } else if (body.role === 'operator') {
    body.roleApproved = true;
    body.rolePending = false;
  }

  await updateJsonFile('profiles.json', (profiles) => {
    profiles[session.id] = {
      ...profiles[session.id],
      ...body,
      email: session.email,
      userId: session.id,
      userName: session.name,
    };
    return profiles;
  });

  return NextResponse.json({ success: true });
}
