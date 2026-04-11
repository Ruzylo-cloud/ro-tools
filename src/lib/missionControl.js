/**
 * Mission Control passthrough helper.
 * Used by Ro-Tools server-side API routes to proxy requests to mission-control
 * using the shared X-API-Key auth. Never import this from client components.
 *
 * Env:
 *   MC_API_URL        — mission-control base URL
 *   MC_DEV_API_KEY    — shared dev API key (scoped to a single store in MC)
 */
import { getMissionControlApiKey } from '@/lib/internal-api-key';

const DEFAULT_BASE = 'https://mission-control-1049928336088.us-central1.run.app';

export function getMissionControlBaseUrl() {
  return (process.env.MC_API_URL || DEFAULT_BASE).replace(/\/$/, '');
}

/**
 * Fetch a JSON endpoint from mission-control.
 * @param {string} path  Path starting with "/" (e.g. "/api/checklists/instances?date=2026-04-10")
 * @param {RequestInit} [opts]
 * @returns {Promise<any>} parsed JSON
 * @throws Error when the MC response is not ok
 */
export async function mcFetch(path, opts = {}) {
  const apiKey = getMissionControlApiKey();
  if (!apiKey) {
    const err = new Error('Mission Control API key not configured');
    err.code = 'MC_NO_KEY';
    throw err;
  }
  const url = `${getMissionControlBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      'x-api-key': apiKey,
      ...(opts.headers || {}),
    },
    cache: 'no-store',
    signal: opts.signal || AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`mission-control ${res.status} ${path}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res.json();
}
