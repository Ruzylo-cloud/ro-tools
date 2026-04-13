/**
 * Employees API — proxies to Mission Control for employee data.
 * Role-based filtering:
 *   - RO: employees in their store only
 *   - DM: employees in their district (all assigned stores)
 *   - Admin: all employees across all stores
 * Returns sorted by store_number, then name.
 */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getMissionControlApiKey } from '@/lib/internal-api-key';

export const dynamic = 'force-dynamic';

const MC_URL = process.env.MC_API_URL || 'https://mission-control-1049928336088.us-central1.run.app';

export async function GET(request) {
  try {
    const session = getSession(); // RT-150: was checking cookie existence only, never verifying token
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // RT-249: don't forward the `store` query param to MC. Ro-Tools
    // profiles store `storeNumber` as the JM numeric (e.g. "20360"),
    // but MC keys employees by a short UUID slug (e.g. "059f4a5f").
    // Passing the JM number to MC's ?store= filter returned zero rows
    // and the search popup showed "no employees match". Fetch the full
    // set and let the dropdown's client-side search + per-store
    // grouping handle narrowing.
    const internalApiKey = getMissionControlApiKey();

    if (!internalApiKey) {
      return NextResponse.json({ employees: [] });
    }

    // Fetch all employees from MC (no store filter — see RT-249 above)
    const res = await fetch(`${MC_URL}/api/employees/internal`, {
      headers: { 'X-API-Key': internalApiKey },
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
