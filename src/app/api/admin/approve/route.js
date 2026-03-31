import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { logAdminAction } from '@/lib/audit';
import { rateLimit } from '@/lib/rate-limit';
import { isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  // Rate limit: 20 approvals per minute per IP
  const { limited } = rateLimit('admin-approve', 60000, 20, request);
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const sessionCheck = getSession();
  if (isDemo(sessionCheck)) {
    return NextResponse.json({ success: true, demo: true });
  }

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const profiles = loadJsonFile('profiles.json');
  const myProfile = profiles[session.id];
  const isAdmin = isSuperAdmin(session.email) || isDefaultAdmin(session.email) || (myProfile?.role === 'administrator' && myProfile?.roleApproved === true);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { userId, action } = body;
  if (!userId || !action || !['approve', 'deny'].includes(action)) {
    return NextResponse.json({ error: 'userId and action (approve|deny) required' }, { status: 400 });
  }

  if (!profiles[userId]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const targetUser = profiles[userId];

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

  // Audit log
  logAdminAction({
    actor: session.email,
    action: action === 'approve' ? 'role_approved' : 'role_denied',
    target: targetUser.email || userId,
    details: {
      requestedRole: targetUser.role,
      resultRole: action === 'deny' ? 'operator' : targetUser.role,
    },
  });

  return NextResponse.json({ success: true });
}
