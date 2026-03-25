/**
 * RO Tools Changelog
 *
 * Add new entries at the TOP of the array when shipping features.
 * This file is the single source of truth for the Updates page.
 *
 * Categories: new_feature | improvement | bug_fix | announcement
 */

export const changelog = [
  {
    version: 'v1.1.0',
    date: '2026-03-25',
    category: 'new_feature',
    title: 'Updates & Changelog Page',
    description: 'Added a changelog page so operators can see what\'s new. Shows a timeline of all development updates with version tags and categories.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Google Drive, Sheets & Docs Integration',
    description: 'Connected Google Drive, Sheets, and Docs APIs. Foundation for Save to Drive and auto-generating documents from templates.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Admin Panel',
    description: 'Built admin panel for managing users and approving role requests. Super admin access for chrisr@jmvalley.com.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Support Page',
    description: 'Bug report and feature request forms. All submissions are stored and visible to the submitting user.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Catering Flyer Generator',
    description: 'Generate print-ready catering flyers with your store info, full 16-item menu, and pricing. Download as letter-size PDF.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Role-Based Onboarding',
    description: 'First-time login setup flow. Choose your role (Operator, District Manager, Administrator) and enter store info. DM and Admin roles require approval.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Native Google OAuth',
    description: 'Secure login restricted to @jmvalley.com accounts. Replaced Firebase with native Google OAuth 2.0 via googleapis.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'announcement',
    title: 'RO Tools Launched',
    description: 'Initial deployment to Google Cloud Run. Core app with dashboard, store profiles, and navigation framework.',
  },
];
