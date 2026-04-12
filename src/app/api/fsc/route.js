import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { rateLimit } from '@/lib/rate-limit';
import { enforceSameOriginMutation } from '@/lib/request-origin';

export const dynamic = 'force-dynamic';

async function getStoreNumber(session) {
  const profiles = await loadJsonFileAsync('profiles.json');
  const profile = profiles[session.id];
  const num = profile?.storeNumber || null;
  if (num && !/^\w{1,20}$/.test(num)) return null;
  return num;
}

/**
 * GET /api/fsc — List FSC (Free Sub Card) requests for the user's store.
 * Query params: status (all|pending|sent), search
 */
export async function GET(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store assigned' }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || 'all';
  const search = searchParams.get('search')?.toLowerCase();

  const allData = await loadJsonFileAsync('fsc-requests.json');
  let requests = allData[storeNumber] || [];

  // Filter by status
  if (statusFilter === 'pending') {
    requests = requests.filter(r => !r.dateSent);
  } else if (statusFilter === 'sent') {
    requests = requests.filter(r => !!r.dateSent);
  }

  // Search
  if (search) {
    requests = requests.filter(r => {
      const fields = [r.guestName, r.address, r.reason, r.notes].filter(Boolean);
      return fields.some(f => f.toLowerCase().includes(search));
    });
  }

  // Sort by complaint date descending
  requests.sort((a, b) => new Date(b.complaintDate || 0) - new Date(a.complaintDate || 0));

  return NextResponse.json({ requests, storeNumber });
}

/**
 * POST /api/fsc — Create a new FSC request.
 */
export async function POST(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const originCheck = enforceSameOriginMutation(request);
  if (originCheck) return originCheck;
  const { limited } = rateLimit('fsc-create', 60000, 20, request);
  if (limited) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store assigned' }, { status: 400 });

  const body = await request.json();
  const { guestName, address, complaintDate, cardCount, reason, notes } = body;

  if (!guestName?.trim()) {
    return NextResponse.json({ error: 'Guest name is required' }, { status: 400 });
  }

  const entry = {
    id: crypto.randomUUID(),
    guestName: String(guestName).trim().slice(0, 200),
    address: String(address || '').trim().slice(0, 500),
    complaintDate: String(complaintDate || new Date().toISOString().split('T')[0]).slice(0, 20),
    cardCount: Math.max(1, Math.min(parseInt(cardCount) || 1, 50)),
    reason: String(reason || '').trim().slice(0, 1000),
    notes: String(notes || '').trim().slice(0, 1000),
    dateSent: null,
    createdBy: session.email,
    createdAt: new Date().toISOString(),
  };

  await updateJsonFile('fsc-requests.json', (data) => {
    if (!data[storeNumber]) data[storeNumber] = [];
    data[storeNumber].push(entry);
    return data;
  });

  return NextResponse.json({ ok: true, request: entry });
}

/**
 * PUT /api/fsc — Update an FSC request (mark sent, edit fields).
 */
export async function PUT(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const originCheck = enforceSameOriginMutation(request);
  if (originCheck) return originCheck;
  const { limited } = rateLimit('fsc-update', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store assigned' }, { status: 400 });

  const body = await request.json();
  const { id, guestName, address, complaintDate, cardCount, reason, notes, dateSent } = body;

  if (!id) return NextResponse.json({ error: 'Request ID required' }, { status: 400 });

  let updated = null;
  await updateJsonFile('fsc-requests.json', (data) => {
    const requests = data[storeNumber] || [];
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return data;

    const entry = requests[idx];
    if (guestName !== undefined) entry.guestName = String(guestName).trim().slice(0, 200);
    if (address !== undefined) entry.address = String(address).trim().slice(0, 500);
    if (complaintDate !== undefined) entry.complaintDate = String(complaintDate).slice(0, 20);
    if (cardCount !== undefined) entry.cardCount = Math.max(1, Math.min(parseInt(cardCount) || 1, 50));
    if (reason !== undefined) entry.reason = String(reason).trim().slice(0, 1000);
    if (notes !== undefined) entry.notes = String(notes).trim().slice(0, 1000);
    if (dateSent !== undefined) entry.dateSent = dateSent ? String(dateSent).slice(0, 20) : null;
    entry.updatedBy = session.email;
    entry.updatedAt = new Date().toISOString();

    requests[idx] = entry;
    data[storeNumber] = requests;
    updated = entry;
    return data;
  });

  if (!updated) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  return NextResponse.json({ ok: true, request: updated });
}

/**
 * DELETE /api/fsc — Delete an FSC request.
 */
export async function DELETE(request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const originCheck = enforceSameOriginMutation(request);
  if (originCheck) return originCheck;

  const storeNumber = await getStoreNumber(session);
  if (!storeNumber) return NextResponse.json({ error: 'No store assigned' }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Request ID required' }, { status: 400 });

  let found = false;
  await updateJsonFile('fsc-requests.json', (data) => {
    const requests = data[storeNumber] || [];
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return data;
    found = true;
    requests.splice(idx, 1);
    data[storeNumber] = requests;
    return data;
  });

  if (!found) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
