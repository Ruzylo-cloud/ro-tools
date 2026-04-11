import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { updateJsonFile, loadJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin, needsApproval } from '@/lib/roles';
import { rateLimit } from '@/lib/rate-limit';
import { isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

const VALID_ROLES = new Set(['operator', 'district_manager', 'administrator']);

export async function POST(request) {
  const { limited } = rateLimit('profile-setup', 60000, 20, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  if (isDemo(session)) {
    return NextResponse.json({ success: true, demo: true });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const role = typeof body.role === 'string' ? body.role : null;
  if (!role || !VALID_ROLES.has(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  let storeNumbers = [];
  if (Array.isArray(body.storeNumbers)) {
    storeNumbers = body.storeNumbers
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter((s) => s.length > 0 && s.length <= 20);
  } else if (typeof body.storeNumber === 'string' && body.storeNumber.trim()) {
    const n = body.storeNumber.trim();
    if (n.length > 20) {
      return NextResponse.json({ error: 'storeNumber must be 20 characters or fewer' }, { status: 400 });
    }
    storeNumbers = [n];
  }

  if (role === 'administrator') {
    storeNumbers = [];
  } else if (role === 'operator') {
    if (storeNumbers.length === 0) {
      return NextResponse.json({ error: 'Store number is required for operators.' }, { status: 400 });
    }
    storeNumbers = storeNumbers.slice(0, 1);
  } else if (role === 'district_manager') {
    if (storeNumbers.length === 0) {
      return NextResponse.json({ error: 'At least one store is required for district managers.' }, { status: 400 });
    }
  }

  let roleApproved = false;
  let rolePending = false;
  let autoAdminGranted = false;

  if (role === 'operator') {
    roleApproved = true;
  } else if (isSuperAdmin(session.email) || isDefaultAdmin(session.email)) {
    roleApproved = true;
    if (role === 'administrator' && isDefaultAdmin(session.email)) {
      autoAdminGranted = true;
    }
  } else if (needsApproval(role)) {
    const current = loadJsonFile('profiles.json')[session.id];
    if (current?.roleApproved && current?.role === role) {
      roleApproved = true;
    } else {
      rolePending = true;
    }
  }

  const stores = storeNumbers.map((n) => ({ storeNumber: n }));
  const firstStore = stores[0] || {};

  await updateJsonFile('profiles.json', (profiles) => {
    profiles[session.id] = {
      ...profiles[session.id],
      setupComplete: true,
      role,
      roleApproved,
      rolePending,
      ...(autoAdminGranted ? { autoAdminGranted: true } : {}),
      stores,
      ...firstStore,
      email: session.email,
      userId: session.id,
      userName: session.name,
    };
    return profiles;
  });

  return NextResponse.json({
    success: true,
    role,
    roleApproved,
    rolePending,
    stores,
  });
}
