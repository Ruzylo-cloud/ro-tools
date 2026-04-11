import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { isDemo } from '@/lib/demo-data';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

const PIPELINE_STATUSES = ['lead', 'quoted', 'confirmed', 'prepped', 'delivered', 'paid'];

async function getStoreNumber(session) {
  const profiles = await loadJsonFileAsync('profiles.json');
  const profile = profiles[session.id];
  const num = profile?.storeNumber || null;
  if (num && !/^\w{1,20}$/.test(num)) return null;
  return num;
}

function sanitizeItems(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, 50).map(it => ({
    name: String(it?.name || '').trim().slice(0, 200),
    qty: Math.max(0, Math.min(10000, parseFloat(it?.qty) || 0)),
    unitPrice: Math.max(0, Math.min(100000, parseFloat(it?.unitPrice) || 0)),
  })).filter(it => it.name || it.qty || it.unitPrice);
}

/**
 * GET /api/catering/orders/[id] — fetch a single catering order.
 */
export async function GET(_request, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = params;
  if (isDemo(session)) return NextResponse.json({ error: 'Demo mode' }, { status: 404 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const data = await loadJsonFileAsync(`catering-${storeNumber}.json`);
  const orders = Array.isArray(data.orders) ? data.orders : [];
  const clients = Array.isArray(data.clients) ? data.clients : [];
  const order = orders.find(o => o.id === id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const client = clients.find(c => c.id === order.clientId) || null;
  return NextResponse.json({ order, client });
}

/**
 * PATCH /api/catering/orders/[id] — update fields on an existing order.
 * Most commonly used for advancing pipeline status.
 */
export async function PATCH(request, { params }) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('catering-orders', 60000, 60, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (isDemo(session)) return NextResponse.json({ success: true, demo: true });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const { id } = params;
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  let updated = null;
  await updateJsonFile(`catering-${storeNumber}.json`, (data) => {
    if (!data.orders) data.orders = [];
    const idx = data.orders.findIndex(o => o.id === id);
    if (idx === -1) return data;
    const o = { ...data.orders[idx] };

    if (body.status !== undefined && PIPELINE_STATUSES.includes(body.status)) o.status = body.status;
    if (body.customerName !== undefined) o.customerName = String(body.customerName || '').trim().slice(0, 200);
    if (body.customerPhone !== undefined) o.customerPhone = String(body.customerPhone || '').trim().slice(0, 30);
    if (body.customerEmail !== undefined) o.customerEmail = String(body.customerEmail || '').trim().slice(0, 200);
    if (body.deliveryAddress !== undefined) o.deliveryAddress = String(body.deliveryAddress || '').trim().slice(0, 500);
    if (body.deliveryDate !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(body.deliveryDate)) o.deliveryDate = body.deliveryDate;
    if (body.deliveryTime !== undefined) o.deliveryTime = String(body.deliveryTime || '').trim().slice(0, 20);
    if (body.notes !== undefined) o.notes = String(body.notes || '').trim().slice(0, 2000);
    if (body.depositPaid !== undefined) o.depositPaid = body.depositPaid === true;
    if (body.tax !== undefined) o.tax = Math.max(0, Math.min(100, parseFloat(body.tax) || 0));
    if (body.headCount !== undefined) o.headCount = Math.max(0, parseInt(body.headCount) || 0);

    if (body.items !== undefined) {
      o.items = sanitizeItems(body.items);
      if (o.items.length) {
        o.subtotal = o.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
        o.itemCount = o.items.reduce((s, it) => s + it.qty, 0);
      }
    }

    if (body.totalAmount !== undefined) {
      const t = parseFloat(body.totalAmount);
      if (!isNaN(t) && t >= 0 && t <= 1000000) o.totalAmount = t;
    } else if (body.items !== undefined && o.items?.length) {
      // Recompute total if items changed and no explicit total was passed.
      const taxMultiplier = 1 + (o.tax || 0) / 100;
      o.totalAmount = Math.round(o.subtotal * taxMultiplier * 100) / 100;
    }

    o.updatedAt = new Date().toISOString();
    data.orders[idx] = o;
    updated = o;
    return data;
  });

  if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ success: true, order: updated });
}

/**
 * DELETE /api/catering/orders/[id] — remove a catering order.
 */
export async function DELETE(request, { params }) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('catering-orders', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  if (isDemo(session)) return NextResponse.json({ success: true, demo: true });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store configured' }, { status: 400 });

  const { id } = params;
  let found = false;
  await updateJsonFile(`catering-${storeNumber}.json`, (data) => {
    if (!data.orders) data.orders = [];
    const idx = data.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      data.orders.splice(idx, 1);
      found = true;
    }
    return data;
  });

  if (!found) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
