import { loadJsonFile } from '@/lib/data';
import { isDefaultAdmin, isSuperAdmin } from '@/lib/roles';

export function getStoredProfile(session) {
  if (!session?.id) return null;
  const profiles = loadJsonFile('profiles.json');
  return profiles[session.id] || null;
}

export function hasApprovedRole(session, allowedRoles) {
  if (!session?.email) return false;
  if (isSuperAdmin(session.email) || isDefaultAdmin(session.email)) return true;

  const profile = getStoredProfile(session);
  return profile?.roleApproved === true && allowedRoles.includes(profile.role);
}

export function isApprovedAdmin(session) {
  return hasApprovedRole(session, ['administrator']);
}

export function isApprovedAdminOrDistrictManager(session) {
  return hasApprovedRole(session, ['administrator', 'district_manager']);
}
