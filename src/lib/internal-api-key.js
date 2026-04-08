import crypto from 'crypto';

let devSessionSigningKey = null;

function timingSafeMatch(candidate, expected) {
  if (!candidate || !expected) return false;
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}

export function getMissionControlApiKey() {
  const key = process.env.MC_DEV_API_KEY?.trim();
  return key || null;
}

export function hasValidMissionControlApiKey(providedKey) {
  if (typeof providedKey !== 'string') return false;
  const expected = getMissionControlApiKey();
  return timingSafeMatch(providedKey.trim(), expected);
}

export function getRoToolsAdminApiKey() {
  const key = process.env.ROTOOLS_ADMIN_API_KEY?.trim();
  return key || null;
}

export function hasValidRoToolsAdminApiKey(providedKey) {
  if (typeof providedKey !== 'string') return false;
  const expected = getRoToolsAdminApiKey();
  return timingSafeMatch(providedKey.trim(), expected);
}

export function getSessionSigningKey() {
  const configured = process.env.GOOGLE_CLIENT_SECRET?.trim() || process.env.SESSION_SIGNING_KEY?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('GOOGLE_CLIENT_SECRET or SESSION_SIGNING_KEY must be set in production');
  }

  if (!devSessionSigningKey) {
    devSessionSigningKey = crypto.randomBytes(32).toString('hex');
  }
  return devSessionSigningKey;
}
