# RO Tools — Project Rules

## TOP RULES
1. **RO Tools is its own separate project.** NOT part of mission-control or any other repo. You may reference other repos for patterns when needed.
2. **Auto-Push to Main — Always.** Every completed piece of work = immediate `git add` → `git commit` → `git push origin main`. No batching. No "I'll push later." Main must always reflect the latest working state. Build must pass before push.

## Identity
- **Agent Name:** Techy
- **Memory:** Session context persists in Claude Code memory system. Read memory on every session start.

## Project Overview
RO Tools is a web app for Jersey Mike's franchise operators (JM Valley). Operators log in with their @jmvalley.com Google account and access branded tools that auto-generate professional materials using their store-specific info.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Auth:** Google OAuth 2.0 (native, via googleapis) — restricted to @jmvalley.com
- **Data:** Server-side JSON files on GCS-mounted volume (`/data`)
- **Secrets:** Google Secret Manager (ro-tools-client-id, ro-tools-client-secret, ro-tools-redirect-uri)
- **PDF:** html2canvas + jsPDF (client-side)
- **Hosting:** Google Cloud Run (containerized, auto-deploy on push to main via Cloud Build)
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
3. First login forces setup: role selection (Operator, District Manager, Administrator) + store info
4. DM and Administrator roles require admin approval. `chrisr@jmvalley.com` is hardcoded super admin.
5. PDF generation is client-side only — no server rendering
6. The flyer must be exactly letter size (612x792pt)
7. Data persists on GCS bucket `pcsbot-490004-ro-tools-data` mounted at `/data`
8. Never store secrets in code — use Secret Manager or env vars

## File Structure
```
src/
├── app/
│   ├── layout.js              # Root layout, AuthProvider, fonts
│   ├── page.js                # Landing page (public)
│   ├── globals.css
│   ├── api/
│   │   ├── auth/              # Google OAuth login/callback/logout/me
│   │   ├── profile/           # Store profile CRUD
│   │   ├── support/           # Bug reports + feature requests
│   │   └── admin/             # User management + role approvals
│   └── dashboard/
│       ├── layout.js          # Auth guard + setup check + Navbar
│       ├── page.js            # Dashboard home
│       ├── setup/page.js      # First-time onboarding (role + store info)
│       ├── profile/page.js    # Store profile editing
│       ├── flyer/page.js      # Catering flyer generator
│       ├── support/page.js    # Bug reports + feature requests
│       └── admin/page.js      # Admin panel (role approvals, user mgmt)
├── components/
│   ├── AuthProvider.js        # Google OAuth context (client-only)
│   ├── Navbar.js              # Dashboard nav with dropdowns
│   └── FlyerPreview.js        # Flyer HTML for preview + PDF capture
└── lib/
    ├── google-auth.js         # Google OAuth2 client setup
    └── roles.js               # Super admin list + role approval logic
```

## Nav Structure
Dashboard | Generators (dropdown) | Catering (dropdown) | Directives (dropdown) | Store Profile | Support | Admin (admin only)

## Development Rules
1. **Auto-push all completed work immediately** — git add, commit, push to main
2. Build must pass (`npm run build`) before committing
3. Keep CSS in `.module.css` files (CSS Modules pattern)
4. Use `'use client'` directive for all interactive components
5. API routes that need runtime env vars must use `export const dynamic = 'force-dynamic'`
6. Redirect URLs in API routes must use `x-forwarded-host` header (Cloud Run internal URL differs from public)
7. Never use Firebase — use native Google APIs

## Deployment
- **Auto-deploy:** Push to main triggers Cloud Build → builds Docker → deploys to Cloud Run
- **Manual deploy:** `gcloud builds submit --tag gcr.io/pcsbot-490004/ro-tools && gcloud run deploy ro-tools --image gcr.io/pcsbot-490004/ro-tools:latest ...`
- **Cloud Run URL:** https://ro-tools-1049928336088.us-central1.run.app
- **GCP Project:** pcsbot-490004
- **Region:** us-central1

## What NOT to Do
- Don't batch commits — push every completed change immediately
- Don't hardcode credentials — use Secret Manager
- Don't use Firebase — everything is native Google OAuth + server-side storage
- Don't modify the flyer menu items or pricing without explicit approval
- Don't remove the @jmvalley.com domain restriction
- Don't store data on the container filesystem without GCS mount — it won't survive deploys
