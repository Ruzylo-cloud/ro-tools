# RO Tools — Session Memory

## Last Updated
2026-03-25

## Current Status
**Phase:** v2.0.0 — Generators Built, Launch Ready

## What's Been Done
- [x] Next.js 14 App Router with full auth, role system, multi-store support
- [x] Native Google OAuth 2.0 restricted to @jmvalley.com
- [x] Service account integration (ro-tools@pcsbot-490004.iam.gserviceaccount.com)
- [x] 6 PDF Generators (all uniform branded, letter-size, auto-fill from profile):
  1. Catering Flyer (customer-facing, JM corporate logo)
  2. Written Warning / Corrective Action (internal, JM Valley header)
  3. Performance Evaluation with 10-category scoring (internal)
  4. Catering Order Form with menu/pricing (customer-facing)
  5. Timesheet Correction Form (internal)
  6. Attestation Correction Form (internal)
- [x] Directives page with Marketing Calendar 2026 (Q1-Q4)
- [x] Admin panel (role approvals, user management)
- [x] Support page (bug reports + feature requests) with pagination
- [x] Updates/changelog page (v1.0.0 through v2.0.0)
- [x] Toast notification system (replaces all alert() calls)
- [x] Error boundary (catches crashes, shows recovery UI)
- [x] Enterprise security audit — all critical/high/medium/low items fixed:
  - Signed session cookies (HMAC-SHA256)
  - Rate limiting on profile/support/admin
  - API timeouts (30s) on all Google API calls
  - Audit logging for admin actions
  - Input sanitization, query injection prevention
  - Role escalation prevention (server-side only)
  - CSRF protection (sameSite strict)
  - Async file I/O with atomic writes
- [x] 10-breakpoint responsive system (1024→360px, 70px steps)
- [x] CSS variables across all modules (no hardcoded colors)
- [x] Global focus-visible states + disabled button styles
- [x] Hamburger menu on mobile (activates at 740px)
- [x] GitHub Actions deploy workflow
- [x] Drive scan endpoint with file listing + content reading
- [x] Documents catalog (documents.md) with categorized 75 Master files
- [x] Data persists via GCS bucket mounted at /data
- [x] Secrets in Google Secret Manager

## What's Next
- [ ] Extract JM Valley logo from Level 1-3 Training Packet
- [ ] Replace navbar logo + favicon with JM Valley logo
- [ ] Full Drive scan (all files, not just Master) once WebFetch works
- [ ] Read actual document content to refine generator fields
- [ ] Catering Tracker page (connected to Sheets)
- [ ] "Save to Drive" feature
- [ ] Connect Cloud Build trigger (or verify GitHub Actions works)

## Key Architecture
- **Nav:** Dashboard | Generators (6-item dropdown) | Catering | Directives | Store Profile
- **Top-right icons:** Support (?) | Admin (gear, admin-only) | User | Sign Out
- **Generators pattern:** sidebar form + live preview + PDF download
- **Internal docs:** JM Valley header + "CONFIDENTIAL" footer
- **Customer-facing docs:** JM corporate logo (nfl-x-jm-revised.jpeg)

## People
- **Chris (Ruzylo-cloud / chrisr@jmvalley.com):** Project owner, super admin
- **Tool:** This session agent

## Quick Reference
- Repo: github.com/Ruzylo-cloud/ro-tools
- Build: `npm run build`
- Cloud Run: https://ro-tools-1049928336088.us-central1.run.app
- GCP Project: pcsbot-490004
- Service Account: ro-tools@pcsbot-490004.iam.gserviceaccount.com
- Drive Scan API Key: 02629e14ed2ddcdedaec36e0d113c0420ed7fe717b2d81c28ff899816b737a7e
