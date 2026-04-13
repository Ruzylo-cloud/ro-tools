/**
 * Next.js instrumentation hook — runs once at server start on the Node runtime.
 *
 * Used here to execute the 2026-04-13 notification force-disable migration
 * before any request can trigger an outbound email. The migration is
 * idempotent (guarded by a flag file on the data volume) so subsequent boots
 * are no-ops.
 *
 * Requires `experimental.instrumentationHook: true` in next.config.mjs
 * for Next.js 14. On Next.js 15+ it runs automatically.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  try {
    const mod = await import('./src/lib/notification-prefs.js');
    const result = await mod.forceDisableAllProfiles();
    if (!result.alreadyRan) {
      console.log(`[instrumentation] Force-disabled notification prefs on ${result.count} profiles`);
    }
  } catch (e) {
    console.error('[instrumentation] Notification force-disable failed:', e);
  }
}
