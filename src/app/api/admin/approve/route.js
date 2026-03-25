import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile, updateJsonFile } from '@/lib/data';
import { isSuperAdmin } from '@/lib/roles';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadJsonFile('profiles.json');
  const myProfile = profiles[session.id];
  const isAdmin = isSuperAdmin(session.email) || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, action } = await request.json();
  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }

  if (!profiles[userId]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await updateJsonFile('profiles.json', (current) => {
    if (!current[userId]) return current;

    if (action === 'approve') {
      current[userId].roleApproved = true;
      current[userId].rolePending = false;
    } else if (action === 'deny') {
      current[userId].role = 'operator';
      current[userId].roleApproved = true;
      current[userId].rolePending = false;
    }

    return current;
  });

  return NextResponse.json({ success: true });
}
