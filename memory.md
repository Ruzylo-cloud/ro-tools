# RO Tools — Session Memory

## Last Updated
2026-03-25

## Current Status
**Phase:** Service Account Integrated — Pending Drive Scan + Generator Expansion

## What's Been Done
- [x] Next.js 14 App Router project with `src/` directory
- [x] Native Google OAuth 2.0 (via googleapis) — restricted to @jmvalley.com
- [x] Role-based onboarding: Operator, District Manager, Administrator
- [x] DM/Admin roles require approval; chrisr@jmvalley.com is super admin
- [x] Multi-store support for DM/Admin roles
- [x] Admin panel for approving role requests + user management
- [x] Support page (bug reports + feature requests)
- [x] Catering flyer generator with PDF download + real JerseyMikesCatering.jpg
- [x] Google Drive, Sheets, Docs API integration (/api/google/drive|sheets|docs)
- [x] Service account integration (`ro-tools@pcsbot-490004.iam.gserviceaccount.com`)
  - Read-only scopes (drive.readonly, spreadsheets.readonly, documents.readonly)
  - Key stored in Secret Manager as `ro-tools-service-account`
  - Drive scan endpoint: `/api/admin/drive-scan`
- [x] Data persists via GCS bucket `pcsbot-490004-ro-tools-data` mounted at /data
- [x] Secrets in Google Secret Manager
- [x] Deployed to Cloud Run: https://ro-tools-1049928336088.us-central1.run.app
- [x] Cloud Build trigger connected — push to main auto-deploys
- [x] Navigation restructured: 6 tabs + admin gear icon
- [x] Updates/changelog system with timeline UI
- [x] Shared session and data utilities (race condition fixes)
- [x] Input validation on support tickets
- [x] `documents.md` created (pending scan to populate)

## What's Next / TODO
- [ ] **Drive scan** — Chris needs to hit `/api/admin/drive-scan?q=` while logged in to get file list
- [ ] Extract JM Valley logo from Level 1-3 Training Packet
- [ ] Replace navbar logo + favicon with JM Valley logo
- [ ] Populate documents.md with categorized file list
- [ ] Build generators for all identified templates (matching catering flyer style)
- [ ] Build Catering Tracker page (connected to Sheets)
- [ ] "Save to Drive" feature — folder picker + one-click
- [ ] Directives section (TBD)

## Key Decisions
1. **Native Google OAuth** — no Firebase
2. **Service account = read-only** — never modifies shared originals
3. **Fonts via CDN** — build env has no internet for Google Fonts download
4. **CSS Modules** — scoped styles per page/component
5. **Client-side PDF** — html2canvas + jsPDF, no server rendering
6. **GCS mount at /data** — JSON persistence that survives deploys
7. **6-tab nav** — Dashboard, Generators, Catering, Directives, Store Profile, Support
8. **Admin = gear icon** — top-right, only visible to admins
9. **RO Tools vs Mission Control** — RO Tools = generators/links/tools; MC = live store ops (Jolt, Homebase, numbers)

## Top Rules
1. RO Tools is standalone — not part of mission-control or money-printer
2. Auto-push all completed work to main immediately — no feature branches, no open PRs
3. Never edit shared Drive/Sheets/Docs originals — always make copies
4. Never use Firebase — native Google APIs only
5. Build must pass before pushing

## People
- **Chris (Ruzylo-cloud / chrisr@jmvalley.com):** Project owner, JM Valley franchise operator, super admin
- **Tool:** This session agent (RO Tools)

## Quick Reference
- Repo: github.com/Ruzylo-cloud/ro-tools
- Branch: `main` (auto-push all work here)
- Build: `npm run build`
- Dev: `npm run dev`
- Deploy: Push to main → Cloud Build auto-deploys
- Cloud Run: https://ro-tools-1049928336088.us-central1.run.app
- GCP Project: pcsbot-490004
- Service Account: ro-tools@pcsbot-490004.iam.gserviceaccount.com
