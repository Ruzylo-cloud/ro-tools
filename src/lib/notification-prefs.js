/**
 * Notification preference helpers.
 *
 * Policy (per user directive 2026-04-13):
 *   1. All server-driven channels — email, in-app notifications, SMS — default
 *      to **disabled** for every account regardless of role.
 *   2. A channel is ONLY enabled if the user themselves opts in after logging in
 *      for the first time. Any account that was created/imported without the
 *      user ever signing in must not receive anything.
 *   3. Any pre-existing enabled state must be force-reset to disabled at least
 *      once (see `forceDisableAllProfiles` + the boot-time migration below).
 *
 * Clarification (2026-04-13, same day):
 *   The threat model this lockdown protects against is **outbound-to-strangers**:
 *   the platform announcing itself to people who were imported from Homebase /
 *   payroll / a roster but were never told the platform exists. An email or SMS
 *   to such a person leaks the existence of RO Tools / RO Control / Mission
 *   Control to someone who shouldn't yet know — that's the failure we are
 *   preventing.
 *
 *   **iOS push notifications (RC iOS + RT iOS) are explicitly EXCLUDED from
 *   this lockdown.** A push notification can only land on a device that has
 *   the app installed, and the only way to install either app is to have been
 *   deliberately given the TestFlight or App Store invite. By definition,
 *   anyone who can receive an iOS push has already been told about the
 *   platform — the leak vector does not exist on that channel. iOS push opt-in
 *   defaults and enrollment (`requestAuthorization` /
 *   `registerForRemoteNotifications`) are therefore allowed and tracked
 *   separately by the iOS apps, not gated by the email/SMS opt-in flag here.
 *
 *   Channel matrix:
 *     - server → email           : LOCKED (this module gates it)
 *     - server → SMS             : LOCKED (this module gates it)
 *     - server → web in-app feed : LOCKED (this module gates it)
 *     - APNs push → RC iOS / RT iOS : EXCLUDED — **default ON** after
 *       install once the user taps Allow on the iOS notification
 *       permission prompt. RC iOS / RT iOS call
 *       `UNUserNotificationCenter.requestAuthorization` +
 *       `UIApplication.registerForRemoteNotifications()` on first launch;
 *       if the user grants permission, all push categories are enabled
 *       by default with no additional in-app opt-in required. The leak
 *       vector this lockdown protects against does not apply: receiving
 *       a push presupposes the user deliberately installed the app from
 *       a TestFlight / App Store invite they were given.
 *
 * Schema on each profile:
 *   notificationPrefs: {
 *     email: boolean,          // RT-driven emails (signing, manager notifications, etc.)
 *     notifications: boolean,  // in-app notification feed from MC
 *     sms: boolean,            // reserved; RT has no active SMS channel today
 *     optedInAt: ISO string | null, // set once the user explicitly enables any channel
 *   }
 *
 * Defaults:
 *   - Missing or partial `notificationPrefs` is treated as all-disabled.
 *   - `optedInAt === null` means the user has never touched their prefs and
 *     therefore should receive nothing.
 */

import fsSync from 'fs';
import path from 'path';
import { loadJsonFile, updateJsonFile } from '@/lib/data';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const RESET_FLAG_FILE = path.join(DATA_DIR, '.notifications-force-disabled-2026-04-13');

const DEFAULT_PREFS = Object.freeze({
  email: false,
  notifications: false,
  sms: false,
  optedInAt: null,
});

/**
 * Normalize a profile's notificationPrefs into a fully-populated object
 * where anything missing or non-boolean becomes `false`.
 */
export function normalizePrefs(prefs) {
  if (!prefs || typeof prefs !== 'object') return { ...DEFAULT_PREFS };
  return {
    email: prefs.email === true,
    notifications: prefs.notifications === true,
    sms: prefs.sms === true,
    optedInAt: typeof prefs.optedInAt === 'string' ? prefs.optedInAt : null,
  };
}

/**
 * Check whether a given recipient email is allowed to receive the named
 * channel. Returns false when:
 *   - No profile exists for this email (user never signed in)
 *   - The profile exists but `optedInAt` is null (never touched prefs)
 *   - The specific channel flag is not `true`
 *
 * @param {string} recipientEmail
 * @param {'email'|'notifications'|'sms'} channel
 * @returns {boolean}
 */
export function isChannelEnabledFor(recipientEmail, channel) {
  if (!recipientEmail || typeof recipientEmail !== 'string') return false;
  if (!['email', 'notifications', 'sms'].includes(channel)) return false;

  const profiles = loadJsonFile('profiles.json');
  const normEmail = recipientEmail.toLowerCase();
  // Profiles are keyed by Google user id, so we have to scan by email.
  const profile = Object.values(profiles).find(
    p => typeof p?.email === 'string' && p.email.toLowerCase() === normEmail
  );
  if (!profile) return false;

  const prefs = normalizePrefs(profile.notificationPrefs);
  if (!prefs.optedInAt) return false; // never opted in → blocked
  return prefs[channel] === true;
}

/**
 * Update the current user's own notification preferences.
 * Setting any channel to true for the first time also stamps optedInAt.
 */
export async function setPrefsForUserId(userId, partial) {
  if (!userId) throw new Error('userId required');
  const clean = {};
  if (typeof partial?.email === 'boolean') clean.email = partial.email;
  if (typeof partial?.notifications === 'boolean') clean.notifications = partial.notifications;
  if (typeof partial?.sms === 'boolean') clean.sms = partial.sms;

  let resultPrefs = { ...DEFAULT_PREFS };
  await updateJsonFile('profiles.json', (profiles) => {
    const existing = profiles[userId];
    if (!existing) return profiles;
    const merged = { ...normalizePrefs(existing.notificationPrefs), ...clean };
    const anyEnabled = merged.email || merged.notifications || merged.sms;
    if (anyEnabled && !merged.optedInAt) {
      merged.optedInAt = new Date().toISOString();
    }
    profiles[userId] = { ...existing, notificationPrefs: merged };
    resultPrefs = merged;
    return profiles;
  });
  return resultPrefs;
}

/**
 * Force-reset every profile's notificationPrefs to the all-disabled default.
 * Idempotent via a flag file on the data volume. Intended to run once at
 * server boot per the 2026-04-13 directive.
 */
export async function forceDisableAllProfiles() {
  try {
    if (fsSync.existsSync(RESET_FLAG_FILE)) return { alreadyRan: true, count: 0 };
  } catch {
    // continue
  }

  let count = 0;
  await updateJsonFile('profiles.json', (profiles) => {
    for (const key of Object.keys(profiles)) {
      const p = profiles[key];
      if (p && typeof p === 'object') {
        p.notificationPrefs = { ...DEFAULT_PREFS };
        count += 1;
      }
    }
    return profiles;
  });

  try {
    fsSync.mkdirSync(path.dirname(RESET_FLAG_FILE), { recursive: true });
    fsSync.writeFileSync(
      RESET_FLAG_FILE,
      `Force-disabled notifications for ${count} profiles at ${new Date().toISOString()}\n`
    );
  } catch (e) {
    console.error('[notification-prefs] Failed to write reset flag:', e);
  }

  return { alreadyRan: false, count };
}

export { DEFAULT_PREFS };
