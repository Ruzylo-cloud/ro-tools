# RO Tools — Session Memory

## Last Updated
2026-03-25

## Current Status
**Phase:** Initial Build Complete — Awaiting Firebase Config

## What's Been Done
- [x] Initialized Next.js 14 project with App Router and `src/` directory
- [x] Extracted JM x NFL logo from landing page HTML base64 → `public/nfl-x-jm-revised.jpeg`
- [x] Created placeholder for `public/JerseyMikesCatering.jpg` (real image needed from Chris)
- [x] Set up Firebase config (`src/lib/firebase.js`) with Google OAuth + domain restriction
- [x] Built AuthProvider with client-only Firebase initialization (dynamic imports to avoid SSR)
- [x] Converted landing page HTML → Next.js page component with CSS Modules
- [x] Built dashboard layout with auth guard + Navbar
- [x] Built dashboard home page with tool cards
- [x] Built store profile page (Firestore read/write)
- [x] Built catering flyer generator with:
  - Left sidebar form (pre-filled from profile, editable)
  - Right side live preview (pixel-perfect flyer layout)
  - PDF download via html2canvas + jsPDF
  - Full 16-item menu with correct descriptions (cheese first)
- [x] Created Dockerfile for Cloud Run deployment
- [x] Created .dockerignore, .gitignore, .env.local.example
- [x] Created CLAUDE.md project rules
- [x] Build passes successfully (`npm run build` ✓)

## What's Next / Blockers
- [ ] **BLOCKER:** Need real `JerseyMikesCatering.jpg` image from Chris (currently placeholder)
- [ ] **BLOCKER:** Need Firebase project config keys to test auth flow
  - Chris needs to: Create Firebase project → Enable Google Auth → Create Firestore DB → Get web app config
  - Then add keys to `.env.local` (see `.env.local.example`)
- [ ] Test full auth flow with @jmvalley.com restriction
- [ ] Test PDF generation quality and letter-size accuracy
- [ ] Deploy to Cloud Run
- [ ] Map custom domain (rotools.com)
- [ ] Future: Marketing Materials tool
- [ ] Future: Catering Tracker tool

## Key Decisions Made
1. **Fonts via CDN, not next/font:** Build environment has no internet access for Google Fonts download during `next build`. Using `<link>` tag in layout.js instead.
2. **Dynamic Firebase imports:** All Firebase imports use `await import()` inside `useEffect` to prevent SSR/build failures when no API key is present.
3. **CSS Modules:** Each page/component has its own `.module.css` file for scoped styles.
4. **Placeholder API key:** Firebase lib uses undefined env vars gracefully — build succeeds, auth only works at runtime with real keys.

## People
- **Chris (Ruzylo-cloud):** Project owner, Jersey Mike's franchise operator
- **Tool:** This session agent (RO Tools)
- **Teechy:** Partner session agent

## Quick Reference
- Branch: `claude/build-deploy-app-X1y92`
- Build: `npm run build`
- Dev: `npm run dev`
- Deploy: See CLAUDE.md
