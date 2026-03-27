import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFile, loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin, needsApproval } from '@/lib/roles';
import { rateLimit } from '@/lib/rate-limit';
import { DEMO_PROFILE, isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Demo mode: return pre-seeded profile
  if (isDemo(session)) {
    return NextResponse.json({ profile: DEMO_PROFILE, isAdmin: true, isSuperAdmin: false });
  }

  const profiles = loadJsonFile('profiles.json');
  const profile = profiles[session.id] || null;

  const isAdmin = isSuperAdmin(session.email) || isDefaultAdmin(session.email) || (profile?.role === 'administrator' && profile?.roleApproved === true);

  return NextResponse.json({
    profile,
    isAdmin,
    isSuperAdmin: isSuperAdmin(session.email),
  });
}

export async function POST(request) {
  // Rate limit: 30 profile saves per minute per IP
  const { limited } = rateLimit('profile', 60000, 30, request);
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Demo mode: read-only
  if (isDemo(session)) {
    return NextResponse.json({ success: true, demo: true });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // SECURITY: Never trust roleApproved/rolePending from client
  delete body.roleApproved;
  delete body.rolePending;

  // Determine approval status server-side only
  if (body.role && needsApproval(body.role)) {
    if (isSuperAdmin(session.email) || isDefaultAdmin(session.email)) {
      body.roleApproved = true;
      body.rolePending = false;
      if (isDefaultAdmin(session.email)) {
        body.autoAdminGranted = true;
      }
    } else {
      const current = loadJsonFile('profiles.json')[session.id];
      if (current?.roleApproved && current?.role === body.role) {
        // Already approved for this role — keep it
        body.roleApproved = true;
        body.rolePending = false;
      } else {
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
