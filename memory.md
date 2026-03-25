# RO Tools — Session Memory

## Last Updated
2026-03-25

## Current Status
**Phase:** Core App Deployed — Cloud Build Trigger + Feature Expansion Next

## What's Been Done
- [x] Next.js 14 App Router project with `src/` directory
- [x] Replaced Firebase with native Google OAuth 2.0 (via googleapis)
- [x] Auth restricted to @jmvalley.com domain
- [x] Role-based onboarding: Restaurant Operator, District Manager, Administrator
- [x] DM/Admin roles require admin approval; chrisr@jmvalley.com is super admin
- [x] Multi-store support for DM/Admin roles
- [x] Full nav: Dashboard, Generators (Catering Flyer), Catering, Directives, Store Profile, Support, Admin
- [x] Admin panel for approving role requests + user management
- [x] Support page (bug reports + feature requests)
- [x] Catering flyer generator with PDF download + real JerseyMikesCatering.jpg
- [x] Google Drive, Sheets, Docs API integration (/api/google/drive|sheets|docs)
- [x] Data persists via GCS bucket `pcsbot-490004-ro-tools-data` mounted at /data
- [x] Secrets in Google Secret Manager (not in code)
- [x] Deployed to Cloud Run: https://ro-tools-1049928336088.us-central1.run.app
- [x] Cloud Build config (`cloudbuild.yaml`) created
- [x] Dockerfile + .dockerignore set up

## What's Next / TODO
- [ ] **Connect Cloud Build trigger** — repo → push to main → auto-deploy
- [ ] Scan Chris's Google Drive for master templates, marketing docs, sheets
- [ ] "Save to Drive" feature — folder picker + one-click "Open in Sheets/Docs"
- [ ] Catering Tracker page (connected to Sheets)
- [ ] Updates/changelog section in UI
- [ ] Directives section (TBD)

## Key Decisions
1. **Native Google OAuth** — no Firebase, using googleapis directly
2. **Fonts via CDN** — build env has no internet for Google Fonts download during `next build`
3. **CSS Modules** — scoped styles per page/component
4. **Client-side PDF** — html2canvas + jsPDF, no server rendering
5. **GCS mount at /data** — server-side JSON persistence that survives deploys

## People
- **Chris (Ruzylo-cloud / chrisr@jmvalley.com):** Project owner, Jersey Mike's franchise operator, super admin
- **Techy:** This session agent (RO Tools)

## Quick Reference
- Repo: github.com/Ruzylo-cloud/ro-tools
- Branch: `main` (auto-push all work here)
- Build: `npm run build`
- Dev: `npm run dev`
- Deploy: See CLAUDE.md
- Cloud Run: https://ro-tools-1049928336088.us-central1.run.app
- GCP Project: pcsbot-490004
