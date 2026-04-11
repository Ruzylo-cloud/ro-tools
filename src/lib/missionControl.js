/**
 * Mission Control dev-key passthrough.
 * Minimal helper that forwards authenticated internal API key requests to the
 * Mission Control service. All RT proxy routes under /api/mc/* should use this.
 *
 * ENV:
 *   MC_API_URL      — MC base URL (default: prod Cloud Run)
 *   MC_DEV_API_KEY  — Internal API key shared with MC (sent as X-API-Key + X-Dev-Key)
 */

const MC_DEFAULT = 'https://mission-control-1049928336088.us-central1.run.app';

export function getMcBaseUrl() {
  return (process.env.MC_API_URL || MC_DEFAULT).replace(/\/+$/, '');
}

export function getMcDevKey() {
  return (process.env.MC_DEV_API_KEY || '').trim() || null;
}

/**
 * mcFetch(path, opts) — low-level fetch wrapper.
 * Returns { ok, status, data, error }
 * - path: starts with `/api/...`
 * - opts: { method, body, query, timeoutMs, headers }
 */
export async function mcFetch(path, opts = {}) {
  const base = getMcBaseUrl();
  const key = getMcDevKey();
  if (!key) {
    return { ok: false, status: 0, data: null, error: 'MC_DEV_API_KEY not configured' };
  }

  let url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  if (opts.query && typeof opts.query === 'object') {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null || v === '') continue;
      qs.set(k, String(v));
    }
    const s = qs.toString();
    if (s) url += (url.includes('?') ? '&' : '?') + s;
  }

  const headers = {
    'X-API-Key': key,
    'X-Dev-Key': key,
    Accept: 'application/json',
    ...(opts.headers || {}),
  };

  const init = {
    method: opts.method || 'GET',
    headers,
    signal: AbortSignal.timeout(opts.timeoutMs || 10000),
  };

  if (opts.body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
  }

  try {
    const res = await fetch(url, init);
    let data = null;
    const text = await res.text();
    if (text) {
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
    }
    if (!res.ok) {
      return { ok: false, status: res.status, data, error: data?.error || `MC ${res.status}` };
    }
    return { ok: true, status: res.status, data, error: null };
  } catch (err) {
    return { ok: false, status: 0, data: null, error: String(err?.message || err) };
  }
}
