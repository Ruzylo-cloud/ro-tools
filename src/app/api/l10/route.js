import { NextResponse } from 'next/server';
import { getSessionData } from '@/lib/session';
import { loadJsonFile } from '@/lib/data';
import { isSuperAdmin, isDefaultAdmin } from '@/lib/roles';
import { enforceSameOriginMutation } from '@/lib/request-origin';
import { rateLimit } from '@/lib/rate-limit';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.DATA_DIR || '/data';
const L10_DIR = path.join(DATA_DIR, 'l10');

function ensureDir() {
  try {
    if (!fs.existsSync(L10_DIR)) fs.mkdirSync(L10_DIR, { recursive: true });
  } catch (e) {
    console.debug('[l10] ensureDir failed, falling back to local dir in dev:', e);
  }
}

function getFilePath(email, week) {
  const safe = email.replace(/[^a-zA-Z0-9]/g, '_');
  return path.join(L10_DIR, `${safe}_week${week}.json`);
}

function getAllForWeek(week) {
  ensureDir();
  try {
    const files = fs.readdirSync(L10_DIR).filter(f => f.includes(`_week${week}.json`));
    return files.map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(L10_DIR, f), 'utf8'));
      return data;
    });
  } catch (err) {
    console.error('[l10] getAllForWeek error:', err);
    return [];
  }
}

// GET /api/l10?week=13 — get current user's L10 for a week
// GET /api/l10?week=13&all=true — get all ROs' L10s for a week (DM/Admin only)
export async function GET(request) {
  const session = getSessionData(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const week = searchParams.get('week');
  const all = searchParams.get('all') === 'true';

  if (!week || !/^\d+$/.test(week)) {
    return NextResponse.json({ error: 'week must be a positive integer' }, { status: 400 });
  }

  ensureDir();

  if (all) {
    // RT-282: DM/Admin only — verify role
    const profiles = loadJsonFile('profiles.json');
    const profile = profiles[session.id];
    const isElevated = isSuperAdmin(session.email) || isDefaultAdmin(session.email)
      || (profile?.role === 'administrator' && profile?.roleApproved === true)
      || (profile?.role === 'district_manager' && profile?.roleApproved === true);
    if (!isElevated) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const scorecards = getAllForWeek(week);
    return NextResponse.json({ week: parseInt(week), scorecards });
  }

  // Return current user's scorecard
  const filePath = getFilePath(session.email, week);
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return NextResponse.json(data);
    }
    return NextResponse.json({ week: parseInt(week), values: {}, employees: [], grade: 0 });
  } catch (err) {
    console.error('[l10] GET read error:', err);
    return NextResponse.json({ week: parseInt(week), values: {}, employees: [], grade: 0 });
  }
}

// POST /api/l10 — save L10 scorecard
export async function POST(request) {
  const originError = enforceSameOriginMutation(request);
  if (originError) return originError;

  const { limited } = rateLimit('l10', 60000, 30, request);
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const session = getSessionData(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }); }

  const { week, values, employees, grade, timeFinished } = body;

  if (!week || !/^\d+$/.test(String(week))) {
    return NextResponse.json({ error: 'week must be a positive integer' }, { status: 400 });
  }

  if (values && typeof values === 'object') {
    const serialized = JSON.stringify(values);
    if (serialized.length > 100000) {
      return NextResponse.json({ error: 'values payload too large' }, { status: 400 });
    }
  }

  ensureDir();

  const data = {
    week,
    email: session.email,
    name: session.name,
    values: values || {},
    employees: employees || [],
    grade: grade || 0,
    timeFinished: timeFinished || null,
    savedAt: new Date().toISOString(),
  };

  const filePath = getFilePath(session.email, week);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('L10 save error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
