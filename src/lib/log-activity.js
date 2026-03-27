'use client';

/**
 * Log a document generation event to the audit trail.
 * Fire-and-forget — does not block the UI.
 */
export async function logActivity({ generatorType, action, formData, filename }) {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatorType, action, formData, filename }),
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}
