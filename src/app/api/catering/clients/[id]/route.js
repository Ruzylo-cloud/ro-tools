import { NextResponse } from 'next/server';
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
 * GET /api/catering/clients/[id] — Get a single client with full order history.
 */
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const { id } = params;
  const data = await loadJsonFileAsync(`catering-${storeNumber}.json`);
  const clients = Array.isArray(data.clients) ? data.clients : [];
  const orders = Array.isArray(data.orders) ? data.orders : [];

  const client = clients.find(c => c.id === id);
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const clientOrders = orders
    .filter(o => o.clientId === id)
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const totalRevenue = clientOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return NextResponse.json({ client, orders: clientOrders, totalRevenue });
}

/**
 * PATCH /api/catering/clients/[id] — Update client details.
 */
export async function PATCH(request, { params }) {
  const { limited } = rateLimit('catering-clients', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const { id } = params;
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const allowedFields = ['clientName', 'companyName', 'phone', 'email', 'address', 'notes', 'notableDates', 'reorderFrequency'];

  let updated = null;
  await updateJsonFile(`catering-${storeNumber}.json`, (data) => {
    if (!data.clients) data.clients = [];
    const idx = data.clients.findIndex(c => c.id === id);
    if (idx === -1) return data;

    const client = { ...data.clients[idx] };
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        if (key === 'clientName') {
          const val = String(body[key] || '').trim().slice(0, 200);
          if (!val) continue; // Don't allow empty client name
          client[key] = val;
        } else if (key === 'notableDates') {
          client.notableDates = safeNotableDates(body[key]);
        } else if (key === 'reorderFrequency') {
          if (['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'one-time', ''].includes(body[key])) {
            client[key] = body[key];
          }
        } else {
          client[key] = String(body[key] || '').trim().slice(0, key === 'notes' ? 2000 : key === 'address' ? 500 : 200);
        }
      }
    }
    client.updatedAt = new Date().toISOString();
    data.clients[idx] = client;
    updated = client;
    return data;
  });

  if (!updated) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  return NextResponse.json({ success: true, client: updated });
}

/**
 * DELETE /api/catering/clients/[id] — Delete a client and their orders.
 */
export async function DELETE(request, { params }) {
  const { limited } = rateLimit('catering-clients', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const { id } = params;
  let found = false;

  await updateJsonFile(`catering-${storeNumber}.json`, (data) => {
    if (!data.clients) data.clients = [];
    if (!data.orders) data.orders = [];
    const idx = data.clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.clients.splice(idx, 1);
      data.orders = data.orders.filter(o => o.clientId !== id);
      found = true;
    }
    return data;
  });

  if (!found) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
