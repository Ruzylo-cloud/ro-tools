import crypto from 'crypto';
import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'apple-verifications.json');
const LINK_PATH = path.join(DATA_DIR, 'apple-identity-links.json');

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

function ensureDir() {
  if (!fsSync.existsSync(DATA_DIR)) fsSync.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(p, fallback) {
  try {
    if (!fsSync.existsSync(p)) return fallback;
    return JSON.parse(fsSync.readFileSync(p, 'utf-8'));
  } catch {
    return fallback;
  }
}

async function writeJson(p, data) {
  ensureDir();
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8');
}

function hashCode(code) {
  return crypto.createHash('sha256').update(String(code)).digest('hex');
}

export function generateCode() {
  return String(Math.floor(100000 + crypto.randomInt(0, 900000)));
}

export async function storePendingCode({ appleUserId, jmvalleyEmail, code }) {
  const all = readJson(STORE_PATH, []);
  const now = Date.now();
  const filtered = all.filter(r =>
    r.appleUserId !== appleUserId &&
    !(r.jmvalleyEmail === jmvalleyEmail && !r.consumedAt) &&
    r.expiresAt > now
  );
  filtered.push({
    appleUserId,
    jmvalleyEmail: jmvalleyEmail.toLowerCase(),
    codeHash: hashCode(code),
    attempts: 0,
    createdAt: now,
    expiresAt: now + CODE_TTL_MS,
    consumedAt: null,
  });
  await writeJson(STORE_PATH, filtered);
}

export async function verifyCode({ appleUserId, jmvalleyEmail, code }) {
  const all = readJson(STORE_PATH, []);
  const now = Date.now();
  const targetEmail = jmvalleyEmail.toLowerCase();
  const row = all.find(r =>
    r.appleUserId === appleUserId &&
    r.jmvalleyEmail === targetEmail &&
    !r.consumedAt &&
    r.expiresAt > now
  );
  if (!row) return { ok: false, error: 'code_expired_or_missing' };
  if (row.attempts >= MAX_CODE_ATTEMPTS) return { ok: false, error: 'too_many_attempts' };

  row.attempts += 1;
  if (row.codeHash !== hashCode(code)) {
    await writeJson(STORE_PATH, all);
    return { ok: false, error: 'invalid_code', attemptsRemaining: MAX_CODE_ATTEMPTS - row.attempts };
  }

  row.consumedAt = now;
  await writeJson(STORE_PATH, all);
  return { ok: true };
}

export function findAppleLink(appleUserId) {
  const all = readJson(LINK_PATH, []);
  return all.find(r => r.appleUserId === appleUserId) || null;
}

export function findLinkByEmail(jmvalleyEmail) {
  const all = readJson(LINK_PATH, []);
  const target = jmvalleyEmail.toLowerCase();
  return all.find(r => r.jmvalleyEmail === target) || null;
}

export async function saveAppleLink({ appleUserId, jmvalleyEmail, appleEmail, fullName }) {
  const all = readJson(LINK_PATH, []);
  const target = jmvalleyEmail.toLowerCase();
  const filtered = all.filter(r => r.appleUserId !== appleUserId && r.jmvalleyEmail !== target);
  const now = Date.now();
  filtered.push({
    appleUserId,
    jmvalleyEmail: target,
    appleEmail: appleEmail || null,
    fullName: fullName || null,
    createdAt: now,
    lastUsedAt: now,
  });
  await writeJson(LINK_PATH, filtered);
}

export async function touchAppleLink(appleUserId) {
  const all = readJson(LINK_PATH, []);
  const row = all.find(r => r.appleUserId === appleUserId);
  if (row) {
    row.lastUsedAt = Date.now();
    await writeJson(LINK_PATH, all);
  }
}
