/**
 * Enterprise Messaging System — shared constants and helpers.
 * Role-based auto-channels, permission tiers, channel definitions.
 */

import { STORE_DIRECTORY, DM_ASSIGNMENTS } from '@/lib/store-directory';

// Role hierarchy (lowest to highest)
export const ROLE_LEVELS = {
  crew: 0,
  shift_lead: 1,
  opener: 1,
  aro: 2,
  ro: 3,
  dm: 4,
  admin: 5,
};

// Permission tiers
export const PERM = { FULL: 'full', REACT: 'react', READ: 'read' };

/**
 * Generate the set of auto-channels a user should see based on role, store, and DM.
 * Returns array of { id, name, icon, permission, scope } objects.
 */
export function getAutoChannels(role, storeId, dmName) {
  const level = ROLE_LEVELS[role] ?? 0;
  const channels = [];

  // --- Crew level (0+) ---
  if (storeId) {
    channels.push({ id: `store-${storeId}-allteam`, name: `${storeName(storeId)} All-Team`, icon: 'store', permission: PERM.FULL, scope: 'store' });
  }
  if (dmName) {
    channels.push({ id: `district-${slugDM(dmName)}-allteam`, name: `${dmName}'s District All-Team`, icon: 'district', permission: PERM.FULL, scope: 'district' });
  }
  channels.push({ id: 'company-allteam', name: 'Company All-Team', icon: 'company', permission: level >= 3 ? PERM.FULL : PERM.REACT, scope: 'company' });

  // --- Shift Lead level (1+) ---
  if (level >= 1) {
    if (storeId) {
      channels.push({ id: `store-${storeId}-leadership`, name: `${storeName(storeId)} Leadership`, icon: 'leadership', permission: PERM.FULL, scope: 'store' });
    }
    channels.push({ id: 'allteam-leadership', name: 'All-Team Leadership', icon: 'leadership', permission: level >= 3 ? PERM.FULL : PERM.REACT, scope: 'company' });
    if (dmName) {
      channels.push({ id: `district-${slugDM(dmName)}-leadership`, name: `${dmName}'s District Leadership`, icon: 'district', permission: PERM.FULL, scope: 'district' });
    }
  }

  // --- RO level (3+) ---
  if (level >= 3) {
    if (dmName) {
      channels.push({ id: `district-${slugDM(dmName)}-ro`, name: `${dmName}'s District RO`, icon: 'ro', permission: PERM.FULL, scope: 'district' });
    }
    channels.push({ id: 'all-ro', name: 'All RO Chat', icon: 'star', permission: PERM.FULL, scope: 'company' });
  }

  // --- DM level (4+) ---
  if (level >= 4) {
    channels.push({ id: 'dm-leadership', name: 'DM Leadership', icon: 'dm', permission: PERM.FULL, scope: 'company' });
    channels.push({ id: 'marketing', name: 'Marketing', icon: 'megaphone', permission: PERM.FULL, scope: 'company' });
    channels.push({ id: 'hr', name: 'HR', icon: 'shield', permission: PERM.FULL, scope: 'company' });
  }

  // --- Admin level (5) ---
  if (level >= 5) {
    channels.push({ id: 'admin-owner', name: 'Admin / Owner', icon: 'lock', permission: PERM.FULL, scope: 'company' });
  }

  return channels;
}

/**
 * Determine user's messaging role from their profile.
 */
export function resolveMessagingRole(profile) {
  if (!profile) return 'crew';
  const r = (profile.role || '').toLowerCase();
  if (r === 'administrator' || r === 'admin') return 'admin';
  if (r === 'district manager' || r === 'dm' || r === 'district_manager') return 'dm';
  if (r === 'operator' || r === 'ro') return 'ro';
  if (r === 'aro' || r === 'assistant_ro') return 'aro';
  if (r === 'shift lead' || r === 'shift_lead' || r === 'opener') return 'shift_lead';
  return 'crew';
}

/**
 * Get the DM name for a given store ID.
 */
export function getDMForStore(storeId) {
  const store = STORE_DIRECTORY.find(s => s.id === storeId);
  return store?.dm || null;
}

function storeName(storeId) {
  const s = STORE_DIRECTORY.find(st => st.id === storeId);
  return s && s.name !== storeId ? s.name : `#${storeId}`;
}

function slugDM(name) {
  return (name || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}
