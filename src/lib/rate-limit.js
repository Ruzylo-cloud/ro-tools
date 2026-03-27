/**
 * Simple in-memory rate limiter for API routes.
 * No external dependencies. Resets on container restart (acceptable for Cloud Run).
 */

const stores = new Map();

function getStore(name) {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name);
}

/**
 * Rate limit by IP address.
 * @param {string} name - Rate limit group name
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Max requests per window
 * @param {Request} request - Next.js request object
 * @returns {{ limited: boolean, remaining: number }}
 */
export function rateLimit(name, windowMs, maxRequests, request) {
  const store = getStore(name);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const now = Date.now();
  const key = ip;
  const record = store.get(key);

  // Clean expired entries periodically
  if (store.size > 1000) {
    for (const [k, v] of store) {
      if (now - v.start > windowMs) store.delete(k);
    }
  }

  if (!record || now - record.start > windowMs) {
    store.set(key, { start: now, count: 1 });
    return { limited: false, remaining: maxRequests - 1 };
  }

  record.count++;
  if (record.count > maxRequests) {
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: maxRequests - record.count };
}
