/**
 * Wrap a promise with a timeout.
 * @param {Promise} promise - The promise to wrap
 * @param {number} ms - Timeout in milliseconds (default: 30000)
 * @param {string} label - Label for error message
 * @returns {Promise}
 */
export function withTimeout(promise, ms = 30000, label = 'API call') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}
