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
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'new_feature',
    title: '5 New Document Generators',
    description: 'Written Warning, Performance Evaluation, Catering Order Form, Timesheet Correction, and Attestation Correction. All generators produce uniform, branded PDFs with auto-filled store info.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'new_feature',
    title: 'Directives Page',
    description: 'New standalone Directives page with the 2026 Marketing Calendar showing quarterly focus areas and monthly campaigns.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Enterprise Security Audit',
    description: 'Signed session cookies (HMAC-SHA256), rate limiting, input sanitization, API timeouts, audit logging, role escalation prevention, and CSRF protection.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Full Responsive Redesign',
    description: '10-breakpoint responsive system (1024px to 360px) across all pages. Hamburger menu on mobile. Fluid scaling with no overflow on any device.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Toast Notifications & UI Polish',
    description: 'Toast notification system replaces all alert() dialogs. CSS variables for consistent theming. Error boundaries prevent full-page crashes. Ticket pagination.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'new_feature',
    title: 'Service Account Integration',
    description: 'Google Drive, Sheets, and Docs accessible via service account. Drive scanner for file management. Foundation for automated document generation.',
  },
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
