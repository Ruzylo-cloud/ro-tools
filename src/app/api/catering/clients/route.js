import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

async function getStoreNumber(session) {
  const profiles = await loadJsonFileAsync('profiles.json');
  const profile = profiles[session.id];
  const num = profile?.storeNumber || null;
  if (num && !/^\w{1,20}$/.test(num)) return null;
  return num;
}

function safeNotableDates(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(d => d && typeof d === 'object').slice(0, 20).map(d => ({
    label: String(d.label || '').slice(0, 200),
    date: String(d.date || '').slice(0, 20),
  }));
}

/**
 * GET /api/catering/clients — List catering clients for the user's store.
 * Query params: search, sort (name|revenue|lastOrder|orders), order (asc|desc)
 */
export async function GET(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const data = await loadJsonFileAsync(`catering-${storeNumber}.json`);
  const clients = Array.isArray(data.clients) ? data.clients : [];
  const orders = Array.isArray(data.orders) ? data.orders : [];

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const sort = searchParams.get('sort') || 'lastOrder';
  const sortOrder = searchParams.get('order') || 'desc';

  // Enrich clients with computed stats
  let enriched = clients.map(c => {
    const clientOrders = orders.filter(o => o.clientId === c.id);
    const totalRevenue = clientOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const orderCount = clientOrders.length;
    const sortedOrders = [...clientOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    const lastOrder = sortedOrders[0] || null;
    return {
      ...c,
      totalRevenue,
      orderCount,
      lastOrderDate: lastOrder?.orderDate || null,
      lastOrderAmount: lastOrder?.totalAmount || null,
    };
  });

  // Search
  if (search) {
    enriched = enriched.filter(c => {
      const fields = [c.clientName, c.companyName, c.phone, c.email].filter(Boolean);
      return fields.some(f => f.toLowerCase().includes(search));
    });
  }

  // Sort
  enriched.sort((a, b) => {
    let cmp = 0;
    if (sort === 'name') cmp = (a.clientName || '').localeCompare(b.clientName || '');
    else if (sort === 'revenue') cmp = (a.totalRevenue || 0) - (b.totalRevenue || 0);
    else if (sort === 'orders') cmp = (a.orderCount || 0) - (b.orderCount || 0);
    else cmp = new Date(a.lastOrderDate || 0) - new Date(b.lastOrderDate || 0);
    return sortOrder === 'desc' ? -cmp : cmp;
  });

  return NextResponse.json({ clients: enriched, storeNumber });
}

/**
 * POST /api/catering/clients — Create a new catering client.
 * Body: { clientName, companyName?, phone?, email?, address?, notes?, notableDates?, reorderFrequency? }
 */
export async function POST(request) {
  const { limited } = rateLimit('catering-clients', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.clientName || typeof body.clientName !== 'string' || !body.clientName.trim()) {
    return NextResponse.json({ error: 'clientName is required' }, { status: 400 });
  }

  const client = {
    id: crypto.randomUUID(),
    clientName: String(body.clientName).trim().slice(0, 200),
    companyName: body.companyName ? String(body.companyName).trim().slice(0, 200) : '',
    phone: body.phone ? String(body.phone).trim().slice(0, 30) : '',
    email: body.email ? String(body.email).trim().slice(0, 200) : '',
    address: body.address ? String(body.address).trim().slice(0, 500) : '',
    notes: body.notes ? String(body.notes).trim().slice(0, 2000) : '',
    notableDates: safeNotableDates(body.notableDates),
    reorderFrequency: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'one-time', ''].includes(body.reorderFrequency) ? body.reorderFrequency : '',
    createdBy: session.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await updateJsonFile(`catering-${storeNumber}.json`, (data) => {
    if (!data.clients) data.clients = [];
    if (!data.orders) data.orders = [];
    data.clients.push(client);
    return data;
  });

  return NextResponse.json({ success: true, client }, { status: 201 });
}
