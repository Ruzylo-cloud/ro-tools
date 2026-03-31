/**
 * Employees API — proxies to Mission Control for employee data.
 * Role-based filtering:
 *   - RO: employees in their store only
 *   - DM: employees in their district (all assigned stores)
 *   - Admin: all employees across all stores
 * Returns sorted by store_number, then name.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';
const DEV_KEY = process.env.MC_DEV_API_KEY || '0f74cf90288b793b876eb33fbd24d828f54a3256dfa36148730278493b1eb68c';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('ro-tools-session');
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user profile to determine role and store
    const { searchParams } = new URL(request.url);
    const storeNumber = searchParams.get('store');

    // Fetch employees from MC
    const res = await fetch(`${MC_URL}/api/employees?include_all=true`, {
      headers: { 'X-Dev-Key': DEV_KEY },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ employees: [] });
    }

    const data = await res.json();
    let employees = data.employees || [];

    // Sort by store_number then name
    employees.sort((a, b) => {
      const storeA = String(a.store_number || a.store_id || '');
      const storeB = String(b.store_number || b.store_id || '');
      if (storeA !== storeB) return storeA.localeCompare(storeB);
      return (a.name || '').localeCompare(b.name || '');
    });

    // If store filter provided, filter to that store
    if (storeNumber) {
      employees = employees.filter(e =>
        String(e.store_number) === storeNumber || String(e.store_id) === storeNumber
      );
    }

    // Return slim format for dropdown
    const result = employees.map(e => ({
      id: e.id,
      name: e.name || e.full_name || `${e.first_name || ''} ${e.last_name || ''}`.trim(),
      position: e.position || e.role || '',
      store_number: e.store_number || '',
      store_name: e.store_name || '',
      active: e.active !== false && e.active !== 0,
    })).filter(e => e.active && e.name);

    return NextResponse.json({ employees: result });
  } catch (err) {
    console.error('Employee fetch error:', err);
    return NextResponse.json({ employees: [] });
  }
}
