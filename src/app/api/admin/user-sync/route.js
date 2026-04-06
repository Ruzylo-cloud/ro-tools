import { NextResponse } from 'next/server';
import { loadJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';

export const dynamic = 'force-dynamic';

const DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

// Role mapping: RT → RC
const ROLE_MAP = {
  administrator: 'owner',
  district_manager: 'director',
  operator: 'restaurant_operator',
};

/** GET /api/admin/user-sync?email=... — RC queries RT for a user's canonical profile */
export async function GET(request) {
  const key = request.headers.get('x-dev-key');
  if (!key || key !== DEV_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const profiles = loadJsonFile('profiles.json');
  // Find profile by email
  let profile = null;
  let userId = null;
  for (const [id, p] of Object.entries(profiles)) {
    if (p.email?.toLowerCase() === email) {
      profile = p;
      userId = id;
      break;
    }
  }

  if (!profile) {
    return NextResponse.json({ found: false });
  }

  const superAdmin = isSuperAdmin(email);
  const defaultAdmin = isDefaultAdmin(email);
  const effectiveRole = (superAdmin || defaultAdmin) ? 'administrator' : profile.role;
  const rcRole = ROLE_MAP[effectiveRole] || 'staff';

  // Build stores array from profile
  const stores = (profile.stores || []).map(s => ({
    storeNumber: s.storeName,
    name: s.city ? `${s.city}, ${s.state}` : `Store ${s.storeName}`,
    city: s.city,
    state: s.state,
    street: s.street,
    phone: s.phone,
  }));

  // Fallback: if no stores array but storeName exists at top level
  if (stores.length === 0 && profile.storeName) {
    stores.push({
      storeNumber: profile.storeName,
      name: profile.city ? `${profile.city}, ${profile.state}` : `Store ${profile.storeName}`,
      city: profile.city,
      state: profile.state,
      street: profile.street,
      phone: profile.phone,
    });
  }

  return NextResponse.json({
    found: true,
    profile: {
      email: profile.email,
      displayName: profile.displayName || profile.userName || email.split('@')[0],
      rtRole: effectiveRole,
      rcRole,
      stores,
      roleApproved: superAdmin || defaultAdmin || profile.roleApproved === true,
      isSuperAdmin: superAdmin,
      isAdmin: superAdmin || defaultAdmin || (effectiveRole === 'administrator' && profile.roleApproved),
    },
  });
}
