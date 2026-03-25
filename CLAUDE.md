# RO Tools — Project Rules

## TOP RULE
**RO Tools is its own separate project.** It is NOT part of mission-control, money-printer, or any other repo. However, you may reference other repos in the ruzylo-cloud org for patterns, architecture decisions, or implementation examples when needed.

## Identity
- **Agent Name:** Tool
- **Role:** Session agent for RO Tools
- **Partner:** Works alongside session agent "teechy"
- **Memory:** All session context is stored in `memory.md` — read it first on every session start

## Project Overview
RO Tools is a web app for Jersey Mike's franchise operators (JM Valley). Operators log in with their @jmvalley.com Google account and access branded tools that auto-generate professional materials using their store-specific info.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Auth:** Firebase Auth with Google OAuth, restricted to @jmvalley.com
- **Database:** Firebase Firestore
- **PDF:** html2canvas + jsPDF (client-side)
- **Hosting:** Google Cloud Run (containerized)
- **Fonts:** Poppins (flyer), DM Sans + Playfair Display (app UI)

## Brand Colors
- JM Blue: `#134A7C`
- JM Red: `#EE3227`
- White: `#FFFFFF`
- Charcoal: `#2D2D2D`
- Light gray: `#F0F4F8`

## Architecture Rules
1. All `/dashboard/*` routes require auth — redirect to `/` if not logged in
2. Landing page (`/`) is public — redirect to `/dashboard` if logged in
3. Firebase is client-only — use dynamic imports (`await import()`) to avoid SSR issues
4. Store profile data lives in Firestore at `stores/{uid}`
5. PDF generation is client-side only — no server rendering
6. The flyer must be exactly letter size (612x792pt)

## File Structure
```
src/
├── app/
│   ├── layout.js           # Root layout, AuthProvider, fonts
│   ├── page.js             # Landing page (public)
│   ├── globals.css
│   └── dashboard/
│       ├── layout.js       # Auth guard + Navbar
│       ├── page.js         # Dashboard home
│       ├── profile/page.js # Store profile form
│       └── flyer/page.js   # Catering flyer generator
├── components/
│   ├── AuthProvider.js     # Firebase auth context (client-only)
│   ├── Navbar.js           # Dashboard navigation
│   └── FlyerPreview.js     # Flyer HTML for preview + PDF capture
└── lib/
    └── firebase.js         # Firebase init + Google provider
```

## Development Rules
1. Always read `memory.md` at session start
2. Update `memory.md` before session end with what was done and what's next
3. Keep CSS in `.module.css` files (CSS Modules pattern)
4. Use `'use client'` directive for all interactive components
5. Never import Firebase at the top level of server components
6. Test builds with `npm run build` before committing
7. Commit to branch `claude/build-deploy-app-X1y92` unless told otherwise

## Deployment
- Build: `gcloud builds submit --tag gcr.io/PROJECT_ID/ro-tools`
- Deploy: `gcloud run deploy ro-tools --image gcr.io/PROJECT_ID/ro-tools --platform managed --region us-central1 --allow-unauthenticated`
- Firebase env vars must be set as Cloud Run environment variables

## What NOT to Do
- Don't push to `main`/`master` without explicit permission
- Don't hardcode Firebase credentials — always use env vars
- Don't add server-side API routes — everything is client-side Firebase
- Don't modify the flyer menu items or pricing without explicit approval
- Don't remove the @jmvalley.com domain restriction
