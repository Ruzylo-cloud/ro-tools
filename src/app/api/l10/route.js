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
// GET /api/l10?history=true — get all weeks for current user (history view)
export async function GET(request) {
  const session = getSessionData(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const week = searchParams.get('week');
  const all = searchParams.get('all') === 'true';
  const history = searchParams.get('history') === 'true';

  ensureDir();

  // History mode — return all weeks for current user
  if (history) {
    const safe = session.email.replace(/[^a-zA-Z0-9]/g, '_');
    try {
      const files = fs.readdirSync(L10_DIR).filter(f => f.startsWith(safe + '_week'));
      const weeks = files.map(f => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(L10_DIR, f), 'utf8'));
          return { week: data.week, grade: data.grade || 0, savedAt: data.savedAt, status: data.status || 'submitted' };
        } catch { return null; }
      }).filter(Boolean).sort((a, b) => b.week - a.week);
      return NextResponse.json({ history: weeks });
    } catch {
      return NextResponse.json({ history: [] });
    }
  }

  if (!week || !/^\d+$/.test(week)) {
    return NextResponse.json({ error: 'week must be a positive integer' }, { status: 400 });
  }

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
    // RT-237: Merge in ROs who haven't submitted yet so the review dropdown
    // is never empty — DMs need to pick a store even before anyone saves.
    const submittedEmails = new Set(scorecards.map(s => s.email).filter(Boolean));
    const rosList = [];
    const seen = new Set();
    for (const p of Object.values(profiles)) {
      const email = (p?.email || '').toLowerCase();
      if (!email || seen.has(email) || submittedEmails.has(email)) continue;
      // Only include operators / district managers — skip pure admins with no store
      if (p.role && p.role !== 'operator' && p.role !== 'district_manager') continue;
      seen.add(email);
      rosList.push({
        email: p.email,
        name: p.displayName || p.userName || p.operatorName || p.email,
        storeNumber: p.storeNumber || '',
        grade: 0,
        status: 'not_submitted',
        values: {},
        rocks: [],
        ids: [],
        todos: [],
        timeFinished: '',
      });
    }
    return NextResponse.json({ week: parseInt(week), scorecards: [...scorecards, ...rosList] });
  }

  // Return current user's scorecard
  const filePath = getFilePath(session.email, week);
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return NextResponse.json(data);
    }
    return NextResponse.json({ week: parseInt(week), values: {}, employees: [], grade: 0, rocks: [], ids: [], todos: [] });
  } catch (err) {
    console.error('[l10] GET read error:', err);
    return NextResponse.json({ week: parseInt(week), values: {}, employees: [], grade: 0, rocks: [], ids: [], todos: [] });
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

  const { week, values, employees, grade, timeFinished, rocks, ids, todos } = body;

  if (!week || !/^\d+$/.test(String(week))) {
    return NextResponse.json({ error: 'week must be a positive integer' }, { status: 400 });
  }

  if (values && typeof values === 'object') {
    const serialized = JSON.stringify(values);
    if (serialized.length > 100000) {
      return NextResponse.json({ error: 'values payload too large' }, { status: 400 });
    }
  }

  if (grade !== undefined && (typeof grade !== 'number' || grade < 0 || grade > 100)) {
    return NextResponse.json({ error: 'grade must be a number between 0 and 100' }, { status: 400 });
  }
  if (employees !== undefined && !Array.isArray(employees)) {
    return NextResponse.json({ error: 'employees must be an array' }, { status: 400 });
  }
  if (employees !== undefined && Array.isArray(employees) && employees.length > 500) {
    return NextResponse.json({ error: 'employees array too large' }, { status: 400 });
  }
  if (timeFinished !== undefined && timeFinished !== null && typeof timeFinished !== 'string') {
    return NextResponse.json({ error: 'timeFinished must be a string' }, { status: 400 });
  }
  if (timeFinished && typeof timeFinished === 'string' && timeFinished.length > 100) {
    return NextResponse.json({ error: 'timeFinished too long' }, { status: 400 });
  }

  // Validate rocks/ids/todos (L10 EOS sections)
  const validateList = (label, arr, maxItems, maxLen) => {
    if (arr === undefined || arr === null) return null;
    if (!Array.isArray(arr)) return `${label} must be an array`;
    if (arr.length > maxItems) return `${label} too large (max ${maxItems})`;
    for (const item of arr) {
      if (typeof item !== 'object' || item === null) return `${label} items must be objects`;
      if (JSON.stringify(item).length > maxLen) return `${label} item too large`;
    }
    return null;
  };
  for (const [label, arr, maxItems, maxLen] of [
    ['rocks', rocks, 20, 2000],
    ['ids', ids, 100, 2000],
    ['todos', todos, 200, 1000],
  ]) {
    const err = validateList(label, arr, maxItems, maxLen);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  ensureDir();

  // DM review action (approve/reject/comment)
  if (body.action === 'review') {
    const profiles = loadJsonFile('profiles.json');
    const profile = profiles[session.id];
    const isElevated = isSuperAdmin(session.email) || isDefaultAdmin(session.email)
      || (profile?.role === 'administrator' && profile?.roleApproved === true)
      || (profile?.role === 'district_manager' && profile?.roleApproved === true);
    if (!isElevated) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetEmail = body.targetEmail;
    const status = body.status; // 'approved' | 'needs_revision' | 'comment'
    const comment = String(body.comment || '').trim().slice(0, 1000);

    if (!targetEmail || !['approved', 'needs_revision', 'comment'].includes(status)) {
      return NextResponse.json({ error: 'targetEmail and valid status required' }, { status: 400 });
    }

    const targetPath = getFilePath(targetEmail, week);
    try {
      if (!fs.existsSync(targetPath)) {
        return NextResponse.json({ error: 'Scorecard not found' }, { status: 404 });
      }
      const card = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      card.status = status;
      card.reviewedBy = session.email;
      card.reviewedAt = new Date().toISOString();
      if (!card.reviewHistory) card.reviewHistory = [];
      card.reviewHistory.push({
        status,
        comment,
        reviewedBy: session.email,
        reviewedAt: new Date().toISOString(),
      });
      if (comment) card.lastComment = comment;
      fs.writeFileSync(targetPath, JSON.stringify(card, null, 2));
      return NextResponse.json({ success: true, status });
    } catch (err) {
      console.error('[l10] review error:', err);
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
  }

  const data = {
    week,
    email: session.email,
    name: session.name,
    values: values || {},
    employees: employees || [],
    grade: grade || 0,
    timeFinished: timeFinished || null,
    rocks: Array.isArray(rocks) ? rocks : [],
    ids: Array.isArray(ids) ? ids : [],
    todos: Array.isArray(todos) ? todos : [],
    status: 'submitted',
    savedAt: new Date().toISOString(),
  };

  const filePath = getFilePath(session.email, week);
  try {
    // Preserve existing review data
    let existing = {};
    try {
      if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch { /* fresh file */ }

    // Cascading: carry forward unfinished rocks/ids/todos from prior save as
    // a baseline if the client didn't send them this save (partial updates).
    const merged = {
      ...data,
      rocks: rocks !== undefined ? data.rocks : (existing.rocks || []),
      ids: ids !== undefined ? data.ids : (existing.ids || []),
      todos: todos !== undefined ? data.todos : (existing.todos || []),
      status: existing.status === 'approved' ? 'approved' : 'submitted',
      reviewedBy: existing.reviewedBy || null,
      reviewedAt: existing.reviewedAt || null,
      reviewHistory: existing.reviewHistory || [],
      lastComment: existing.lastComment || null,
    };

    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    return NextResponse.json({ success: true, data: merged });
  } catch (err) {
    console.error('L10 save error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
