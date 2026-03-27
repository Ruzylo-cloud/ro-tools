// Hardcoded super admins — always have full admin access
export const SUPER_ADMINS = [
  'chrisr@jmvalley.com',
];

export function isSuperAdmin(email) {
  return SUPER_ADMINS.includes(email?.toLowerCase());
}

// Default admins — auto-approved as administrator on first login
export const DEFAULT_ADMINS = [
  'david@jmvalley.com',
  'bethany@jmvalley.com',
  'brittany@jmvalley.com',
];

export function isDefaultAdmin(email) {
  return DEFAULT_ADMINS.includes(email?.toLowerCase());
}

// Roles that require approval
export const APPROVAL_REQUIRED = ['administrator', 'district_manager'];

export function needsApproval(role) {
  return APPROVAL_REQUIRED.includes(role);
}
