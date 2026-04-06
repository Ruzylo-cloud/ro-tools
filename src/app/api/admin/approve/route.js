import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { logAdminAction } from '@/lib/audit';
import { rateLimit } from '@/lib/rate-limit';
import { isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

const RC_API_URL = process.env.RC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const RC_DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

async function pushRoleToRC(email, role, roleApproved) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    await fetch(`${RC_API_URL}/api/profile/sync/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': RC_DEV_KEY },
      body: JSON.stringify({ email, role, roleApproved }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
  } catch { /* non-fatal — RC will pick up on next SSO login */ }
}

export async function POST(request) {
  // Rate limit: 20 approvals per minute per IP
  const { limited } = rateLimit('admin-approve', 60000, 20, request);
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (isDemo(session)) {
    return NextResponse.json({ success: true, demo: true });
  }

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

  // Push role change to RC (non-blocking)
  const resultRole = action === 'deny' ? 'operator' : targetUser.role;
  if (targetUser.email) {
    pushRoleToRC(targetUser.email, resultRole, action === 'approve');
  }

  return NextResponse.json({ success: true });
}
