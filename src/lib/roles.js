// Hardcoded super admins — always have full admin access, no approval needed
export const SUPER_ADMINS = [
  'chrisr@jmvalley.com',
  'chris@jmvalley.com',
  'bethany@jmvalley.com',
  'daniel@jmvalley.com',
  'brittany@jmvalley.com',
  'david@jmvalley.com',
  'cody@jmvalley.com',
];

export function isSuperAdmin(email) {
  return SUPER_ADMINS.includes(email?.toLowerCase());
}

// Default admins — auto-approved as administrator on first login (subset of SUPER_ADMINS for legacy compat)
export const DEFAULT_ADMINS = [
  'chris@jmvalley.com',
  'david@jmvalley.com',
  'bethany@jmvalley.com',
  'daniel@jmvalley.com',
  'brittany@jmvalley.com',
  'cody@jmvalley.com',
];

export function isDefaultAdmin(email) {
  return DEFAULT_ADMINS.includes(email?.toLowerCase());
}

// Roles that require approval
export const APPROVAL_REQUIRED = ['administrator', 'district_manager'];

export function needsApproval(role) {
  return APPROVAL_REQUIRED.includes(role);
}
