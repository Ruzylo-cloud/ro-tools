import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import { loadJsonFile, loadJsonFileAsync, updateJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { rateLimit } from '@/lib/rate-limit';
import { DEMO_LOGS, isDemo } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

const LOGS_FILE = 'activity-logs.json';

const VALID_ACTIONS = ['download', 'drive-save', 'email-send'];

/**
 * Check if user is admin: super admin or approved administrator role.
 */
function checkAdmin(session) {
  if (isSuperAdmin(session.email) || isDefaultAdmin(session.email)) return true;
  const profiles = loadJsonFile('profiles.json');
  const profile = profiles[session.id];
  return profile?.role === 'administrator' && profile?.roleApproved === true;
}

/**
 * GET /api/logs — Retrieve activity logs.
 * Admins see all logs (with optional filters). Non-admins see only their own.
 *
 * Query params:
 *   type     — filter by generatorType
 *   userId   — filter by userId (admin only)
 *   from     — ISO date string, inclusive lower bound
 *   to       — ISO date string, inclusive upper bound
 *   search   — text search across formData values
 *   limit    — pagination limit (default 50, max 200)
 *   offset   — pagination offset (default 0)
 */
export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (isDemo(session)) {
    return NextResponse.json({ logs: DEMO_LOGS, total: DEMO_LOGS.length });
  }

  const isAdmin = checkAdmin(session);
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const userId = searchParams.get('userId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const search = searchParams.get('search')?.toLowerCase();
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit')) || 50, 1), 200);
  const offset = Math.max(parseInt(searchParams.get('offset')) || 0, 0);

  const data = await loadJsonFileAsync(LOGS_FILE);
  let logs = Array.isArray(data) ? data : [];

  // Non-admins only see their own logs
  if (!isAdmin) {
    logs = logs.filter(l => l.userId === session.id);
  }

  // Apply filters
  if (type) {
    logs = logs.filter(l => l.generatorType === type);
  }
  if (userId && isAdmin) {
    logs = logs.filter(l => l.userId === userId);
  }
  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate)) {
      logs = logs.filter(l => new Date(l.timestamp) >= fromDate);
    }
  }
  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate)) {
      logs = logs.filter(l => new Date(l.timestamp) <= toDate);
    }
  }
  if (search) {
    logs = logs.filter(l => {
      // Search across formData values, generatorType, action, userName, filename
      const searchable = [
        l.generatorType,
        l.action,
        l.userName,
        l.userEmail,
        l.filename,
        ...Object.values(l.formData || {}),
      ]
        .filter(Boolean)
        .map(v => String(v).toLowerCase());
      return searchable.some(v => v.includes(search));
    });
  }

  // Sort newest first
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const total = logs.length;
  const paginated = logs.slice(offset, offset + limit);

  return NextResponse.json({
    logs: paginated,
    total,
    limit,
    offset,
  });
}

/**
 * POST /api/logs — Log a document generation event.
 *
 * Body:
 *   generatorType (string, required) — e.g. 'written-warning', 'coaching-form'
 *   formData      (object, required) — all form fields
 *   action        (string, required) — 'download' | 'drive-save' | 'email-send'
 *   filename      (string, optional) — generated filename
 */
export async function POST(request) {
  // Rate limit: 30 log entries per minute per IP
  const { limited } = rateLimit('activity-logs', 60000, 30, request);
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate required fields
  if (!body.generatorType || typeof body.generatorType !== 'string') {
    return NextResponse.json({ error: 'generatorType is required and must be a string' }, { status: 400 });
  }
  if (!body.formData || typeof body.formData !== 'object' || Array.isArray(body.formData)) {
    return NextResponse.json({ error: 'formData is required and must be an object' }, { status: 400 });
  }
  if (!body.action || !VALID_ACTIONS.includes(body.action)) {
    return NextResponse.json(
      { error: `action is required and must be one of: ${VALID_ACTIONS.join(', ')}` },
      { status: 400 }
    );
  }

  // Sanitize inputs
  const generatorType = String(body.generatorType).slice(0, 100);
  const action = body.action;
  const filename = body.filename ? String(body.filename).slice(0, 500) : null;

  // Deep-clone and sanitize formData (limit total size)
  let formData;
  try {
    const serialized = JSON.stringify(body.formData);
    if (serialized.length > 50000) {
      return NextResponse.json({ error: 'formData exceeds maximum size' }, { status: 400 });
    }
    formData = JSON.parse(serialized);
  } catch {
    return NextResponse.json({ error: 'formData must be valid JSON' }, { status: 400 });
  }

  const logEntry = {
    id: crypto.randomUUID(),
    generatorType,
    action,
    formData,
    filename,
    userId: session.id,
    userName: session.name,
    userEmail: session.email,
    timestamp: new Date().toISOString(),
  };

  await updateJsonFile(LOGS_FILE, (data) => {
    const logs = Array.isArray(data) ? data : [];
    logs.push(logEntry);
    return logs;
  });

  return NextResponse.json({ success: true, log: logEntry });
}
