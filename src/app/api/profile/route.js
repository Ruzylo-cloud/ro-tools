import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';
import { loadJsonFile, loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin, needsApproval } from '@/lib/roles';
import { rateLimit } from '@/lib/rate-limit';
import { DEMO_PROFILE, isDemo } from '@/lib/demo-data';
import { enforceSameOriginMutation } from '@/lib/request-origin';

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

  // For super/default admins, ensure the response reflects admin role even if stored profile says otherwise
  const effectiveProfile = profile && isAdmin && profile.role !== 'administrator'
    ? { ...profile, role: 'administrator', roleApproved: true, rolePending: false }
    : profile;

  // RT-267: Short client-side cache (30s private)
  return NextResponse.json({
    profile: effectiveProfile,
    isAdmin,
    isSuperAdmin: isSuperAdmin(session.email),
  }, { headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' } });
}

export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

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

  // Input length guards
  if (body.storeName && typeof body.storeName === 'string' && body.storeName.length > 200) {
    return NextResponse.json({ error: 'storeName must be 200 characters or fewer' }, { status: 400 });
  }
  if (body.storeNumber && typeof body.storeNumber === 'string' && body.storeNumber.length > 20) {
    return NextResponse.json({ error: 'storeNumber must be 20 characters or fewer' }, { status: 400 });
  }
  if (body.phone && typeof body.phone === 'string' && body.phone.length > 30) {
    return NextResponse.json({ error: 'phone must be 30 characters or fewer' }, { status: 400 });
  }

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

  // Sync profile to RO Control (Mission Control)
  const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
  const apiKey = getMissionControlApiKey();
  try {
    if (apiKey) {
      await fetch(`${MC_URL}/api/profile/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
        body: JSON.stringify({
          email: session.email,
          name: body.storeName,
          store_number: body.storeNumber,
          address: body.storeAddress,
          phone: body.storePhone,
          manager_name: body.operatorName,
          source: 'ro-tools',
        }),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch(e) {
    // Sync is best-effort — don't block the user
  }

  return NextResponse.json({ success: true });
}
