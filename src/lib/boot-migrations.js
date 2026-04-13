/**
 * Server-boot migrations.
 *
 * Ran exactly once per process. Safe to import from anywhere — subsequent
 * imports become no-ops because the promise is cached module-side.
 */

import { forceDisableAllProfiles } from '@/lib/notification-prefs';

let bootPromise = null;

async function runMigrationsOnce() {
  try {
    const result = await forceDisableAllProfiles();
    if (!result.alreadyRan) {
      console.log(`[boot-migrations] Force-disabled notifications on ${result.count} profiles.`);
    }
  } catch (e) {
    console.error('[boot-migrations] forceDisableAllProfiles failed:', e);
  }
}

export function ensureBootMigrations() {
  if (!bootPromise) {
    bootPromise = runMigrationsOnce();
  }
  return bootPromise;
}
