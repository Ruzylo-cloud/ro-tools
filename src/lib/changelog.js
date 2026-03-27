/**
 * RO Tools Changelog
 *
 * Add new entries at the TOP of the array when shipping features.
 * This file is the single source of truth for the Updates page.
 *
 * Categories: new_feature | improvement | bug_fix | announcement
 */

export const changelog = [
  // ── v2.2.0 — March 26, 2026 ──────────────────────────────────────
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Admin Activity Logs',
    description: 'New Activity Logs tab in the Admin Panel. Search by name, email, or document. Filter by generator type and action (download, Drive save, email). Paginated table with color-coded action badges.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: '3 New Training Packets',
    description: 'Added Slicer Training (4-week certification), Opener Training (opening shift certification), and Shift Lead Training (leadership & closing certification). All 7 training packets now available under Documents.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Coaching Form & Injury Report Generators',
    description: 'Two new document generators: Coaching Form for documenting employee coaching sessions, and Injury Report for workplace incident documentation. Both produce branded PDFs with auto-filled store info.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Activity Logging System',
    description: 'All document generation actions (download, Drive save, email) are now logged with user info, generator type, form data, and timestamps. Powers the new admin Activity Logs tab.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'improvement',
    title: 'Training Packet Uniformity Overhaul',
    description: 'Enterprise-level standardization across all 7 training packets. Identical employee info blocks, centered logo, consistent fonts (6.5pt body, 8pt headers, 9pt values), uniform sign-off sections, and standardized checkbox sizing.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'improvement',
    title: 'Catering Order Enhancements',
    description: 'Added bread selection (White, Wheat, Rosemary) per sub in catering orders. Cookie and Brownie platter lines now always visible in the order form and PDF, even when quantity is zero.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'improvement',
    title: 'Navigation & Profile Cleanup',
    description: 'Moved Generation History link from the main navbar into the Store Profile page for a cleaner navigation bar.',
  },
  {
    version: 'v2.2.0',
    date: '2026-03-26',
    category: 'bug_fix',
    title: 'Document Template Content Cutoff Fix',
    description: 'Fixed training packets and other documents where content was cut off at the bottom or overlapped by the footer. Separated content area from flex spacer and added proper footer margin spacing.',
  },

  // ── v2.1.0 — March 26, 2026 ──────────────────────────────────────
  {
    version: 'v2.1.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Save to Google Drive',
    description: 'All generators now include a "Save to Google Drive" button with a folder picker. Browse your Drive, create new folders, and save generated PDFs directly into any location — like an employee file.',
  },
  {
    version: 'v2.1.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Training Documents Generator',
    description: 'New Documents page with 4 branded templates: Level 1 (Day 1 Orientation), Level 2 (Cold Side Cert), Level 3 (Hot Side Cert), and New Hire Checklist. All share a uniform JMVG document template with red bars, blue headers, and logo.',
  },
  {
    version: 'v2.1.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Privacy Policy & Terms of Service',
    description: 'Added public /privacy and /terms pages required for Google OAuth verification. Covers data handling, Drive access, and user rights.',
  },
  {
    version: 'v2.1.0',
    date: '2026-03-26',
    category: 'improvement',
    title: 'JMVG Logo Branding Overhaul',
    description: 'Replaced all instances of the old NFL x JM logo with the official JMVG transparent-background logo. Updated navbar, landing page, footer, favicon, flyer preview, catering order, and all generator preview components.',
  },
  {
    version: 'v2.1.0',
    date: '2026-03-26',
    category: 'improvement',
    title: 'Uniform Document Branding',
    description: 'All generated PDFs now feature consistent JMVG branding: top red accent bar, centered logo, store info line, blue title banner, and footer. Applied to all 4 generator preview components (Written Warning, Evaluation, Timesheet Correction, Attestation Correction).',
  },
  {
    version: 'v2.1.0',
    date: '2026-03-26',
    category: 'new_feature',
    title: 'Custom Domain: ro-tools.app',
    description: 'Connected ro-tools.app domain via Cloudflare DNS pointing to Cloud Run. SSL certificate provisioned. OAuth redirect URIs updated for the new domain.',
  },

  // ── v2.0.0 — March 25, 2026 ──────────────────────────────────────
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
    category: 'new_feature',
    title: 'Service Account Integration',
    description: 'Google Drive, Sheets, and Docs accessible via service account. Drive scanner endpoint for file discovery and document content reading.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Enterprise Security Audit',
    description: 'HMAC-SHA256 signed session cookies, rate limiting on all API routes, input sanitization, API timeouts, audit logging, role escalation prevention, and CSRF protection.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: '10-Breakpoint Responsive System',
    description: 'Full responsive redesign from 1024px down to 360px across every page and component. Mobile hamburger menu with slide-out navigation. Fluid scaling with no overflow on any device.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Toast Notifications',
    description: 'New toast notification system replaces all browser alert() dialogs. Non-intrusive, auto-dismissing success/error/info toasts.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'CSS Variables & Theming',
    description: 'Replaced all hardcoded color hex values with CSS custom properties for consistent brand theming across the entire app.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Error Boundaries',
    description: 'Added ErrorBoundary component wrapping all dashboard pages. Individual page crashes no longer break the entire app.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'Navigation Restructure',
    description: 'Reorganized navigation to 6 main tabs with dropdown menus for Generators. Support moved to icon in top-right corner. All generators accessible from navbar dropdown.',
  },
  {
    version: 'v2.0.0',
    date: '2026-03-25',
    category: 'improvement',
    title: 'GitHub Actions CI/CD',
    description: 'Added GitHub Actions deploy workflow as an alternative to Cloud Build. Automated build and deploy to Cloud Run on push to main.',
  },

  // ── v1.1.0 — March 25, 2026 ──────────────────────────────────────
  {
    version: 'v1.1.0',
    date: '2026-03-25',
    category: 'new_feature',
    title: 'Updates & Changelog Page',
    description: 'Added a changelog page so operators can see what\'s new. Timeline view of all development updates with version tags and categories.',
  },

  // ── v1.0.0 — March 24, 2026 ──────────────────────────────────────
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Google Drive, Sheets & Docs Integration',
    description: 'Connected Google Drive, Sheets, and Docs APIs for reading shared files and future automated document generation.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Cloud Build Auto-Deploy',
    description: 'Configured Cloud Build to auto-deploy to Cloud Run on every push to main. Zero-touch deployment pipeline.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Native Google OAuth',
    description: 'Secure login restricted to @jmvalley.com accounts. Replaced initial Firebase auth with native Google OAuth 2.0 via googleapis. Domain-restricted for franchise security.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Catering Flyer Generator',
    description: 'Generate print-ready catering flyers with store info, full 16-item catering menu, and pricing. Download as letter-size PDF.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Store Profile Management',
    description: 'Operators can set and edit their store details — address, phone, operator name, assistant info. Profile data auto-fills into all generated documents.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Role-Based Onboarding',
    description: 'First-time login setup flow. Choose your role (Operator, District Manager, Administrator) and enter store info. DM and Admin roles require super admin approval.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Admin Panel',
    description: 'User management and role approval dashboard for super admins. View all users, approve or deny role requests, manage access.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'new_feature',
    title: 'Support Page',
    description: 'Bug report and feature request forms. Submissions stored server-side and visible to the submitting user for tracking.',
  },
  {
    version: 'v1.0.0',
    date: '2026-03-24',
    category: 'announcement',
    title: 'RO Tools Launched',
    description: 'Initial deployment to Google Cloud Run. Full Next.js 14 app with dashboard, navigation framework, and JM Valley Group branding. Built from the ground up for franchise operators.',
  },
];
