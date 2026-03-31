# RO Tools Ecosystem — Complete Feature List

## Document Generators (12)
- **Written Warning** — Progressive discipline with 5 levels, violation categories, improvement plans, at-will acknowledgment
- **Performance Evaluation** — 10-category scoring system with comments and overall rating
- **Coaching Form** — Verbal coaching and counseling documentation
- **Injury Report** — OSHA-compliant with auto-email to HR via Gmail API (Cal/OSHA §6409.1)
- **Employee Resignation** — Exit documentation with resignation type, notice period, equipment return, final pay
- **Employee Termination** — CA Labor Code §201-202 compliant, prior discipline history, COBRA notes
- **Meal Break Waiver** — California Labor Code §512, IWC Order No. 5-2001, first/second/on-duty waivers
- **Timesheet Correction** — Clock in/out adjustment documentation
- **Attestation Correction** — Meal and rest break documentation per §226.7
- **Catering Order Form** — Dynamic box management, 16-sub menu, auto-calculated pricing, discount tiers
- **Catering Flyer** — Print-ready with store info, full menu, pricing, Jersey Mike's branding
- **Training Documents** — 8 multi-page templates (see Training section)

## Training Packets (8 templates, 54 pages)
- **Orientation** — Day 1: policies, procedures, daily operations, guest service, core values, LMS videos (5 pages)
- **Level 1** — Days 2-9: Sprinkle/Wrap certification, cold sub quiz, benchmarks, GM debrief (8 pages)
- **Level 2** — Days 10-18: Register/Wrap certification, phone orders, lobby checks (9 pages)
- **Level 3** — Days 18-28: Hot Subs certification, menu quiz, C-BOPS, advanced hot subbing (6 pages)
- **Slicer** — 4-week program: back line slice, front line slice, quarterbacking, certification (8 pages)
- **Shift Lead** — Evaluation tables, character traits, proficiency checks, 5 training days, DM interview (10 pages)
- **Opener** — 6 shifts: 7am-10am timeline, bread/bacon/tomatoes, quality checks, slicer safety (8 pages)
- **New Hire Checklist** — Manager onboarding documentation

## PDF Generation
- Client-side rendering via html2canvas + jsPDF
- Multi-page PDF support (data-pdf-page + addPage)
- JMVG branded headers (90px logo) on first page, mini headers on subsequent
- Page numbers on every page
- Red confidentiality footer on every page
- Solid write-on lines (not dashed/dotted)
- Checkbox boxes for proficiency tables and initials

## Digital Signatures
- Auto-generated manager signatures (Dancing Script cursive, timestamped)
- E-signature system with signing requests
- Public /sign/[token] page with canvas signature pad
- Email to employee with signing link
- Timestamped audit trail with IP logging

## Catering CRM
- Client list with search
- Revenue tracking per client with Top 3 leaderboard
- Follow-up status: On Track / Due Soon / Overdue
- Upcoming Events widget (notable dates in next 30 days)
- One-click reorder from past orders
- Auto-logs clients from generated catering orders
- Next Expected Order date tracking

## Scoreboard
- 12 weeks of performance data across 29+ stores
- 4 targets: Labor, COGs Variance, COGs Actual, PY Growth
- Color-coded tiers: Royal Blue (Grand Slam/4 targets), Blue (Double Digit Growth), Green (Trifecta/3), Yellow (2), Orange (1)
- Leaderboards: Grand Slams, Trifectas, Highest Avg Growth %
- Week-by-week breakdown with full metrics
- Store names displayed throughout

## L10 Weekly Scorecard
- 30 metrics across 5 categories (Sales, People, Operations, Reporting, Profitability)
- Auto-color coding: green when goal met, red when missed
- Grade bar: auto-calculated percentage of green cells out of 30
- Week selector with date ranges (52 weeks)
- Employee evaluation section with EVAL + ATTESTATION checkboxes
- Time Finished tracking
- API backend with server-side persistence (GET/POST /api/l10)
- DM view: all ROs' scorecards for a week (?all=true)

## Marketing Directives
- Monthly marketing directive display
- ALL RO Meeting recap with action items
- Key dates and 2026 marketing calendar
- Quarterly focus areas

## Store Management
- Store profile with auto-fill into all documents
- 29+ stores mapped with names, RO assignments, DM districts
- DM auto-population on first login
- Role-based access: Operator, District Manager, Administrator
- Admin approval for DM/Admin roles
- Super admin: chrisr@jmvalley.com

## Authentication & Security
- Google OAuth 2.0 restricted to @jmvalley.com
- HMAC-SHA256 signed session cookies with timing-safe comparison
- Role-based access control
- Rate limiting on all API routes
- Input sanitization and path traversal guards
- CSRF protection
- Full audit logging (every document generated logged with user, timestamp, form data)
- Activity logs searchable by admin

## Platform Features
- Save to Google Drive with folder picker
- Auto-email injury reports to HR via Gmail API
- Demo mode at /demo (read-only, 2-hour sessions, sample data)
- Self-playing presentation at /presentation (14+ slides, auto-advance)
- Changelog/Updates page grouped by version
- Support page (bug reports + feature requests)
- Red/white branded scrollbar
- Red overscroll effect (#EE3227)
- Active tab highlighting in navbar
- theme-color meta tag

## iOS App — RO Tools
- Native SwiftUI (iOS 16+, Swift 5.9)
- All 12 document generators with on-device PDF rendering (UIGraphicsPDFRenderer)
- 8 training packet templates
- Catering CRM with follow-up push notifications
- Live scoreboard
- Google OAuth via ASWebAuthenticationSession
- Offline support with JSON file persistence + background sync engine
- Push notifications (APNs) for catering, injuries, directives
- Keychain token storage
- NWPathMonitor network detection with offline banner
- JMVG logo in navbar on every screen
- Blue gradient login matching website
- App Store listing (unlisted) submitted for review
- TestFlight Build 4 delivered

## iOS App — RO Control
- Native SwiftUI — one app, two modes:
  - **Manager mode**: Full dashboard (Jarvis AI, tasks, schedule, checklists, analytics)
  - **Kiosk mode**: Persistent store-locked iPad (PIN pad, clock in/out, checklists)
- Kiosk mode stored in Keychain — survives restarts, sign-outs, iOS updates
- 4-digit PIN pad with clock in/out/break start/break end
- Who's On Shift real-time display
- Kiosk checklists with progress bars
- Jarvis AI chat interface
- Task management with filters and priority colors
- Schedule view with calendar
- Analytics with metric cards and targets
- Exit kiosk requires manager PIN (small gear icon, bottom right)
- Offline clock entry queue
- Same styling as RO Tools (identical Colors, Fonts, ViewStyles)

## RO Control Web (Mission Control)
- Express + TypeScript + SQLite SPA
- Single 64px navbar matching RO Tools
- DM Sans + Playfair Display fonts
- Red scrollbar + overscroll matching RO Tools
- Dropdown menus: 12px radius, 260px width, 8px item radius
- Red pillar accent bars on dashboard cards
- Red CTA button (.btn-red)
- Focus-visible ring (2px blue)
- Card radius 14px, padding 28px 22px
- iPad Kiosk PWA at /kiosk (clock in/out + checklists)
- Kiosk CSS aligned to RO Tools tokens
- Dark mode support
- Jarvis AI integration (Claude CLI)
- 40+ store support
- PBKDF2 PIN hashing + failed attempt lockout

## Infrastructure
- Google Cloud Run (auto-scaling, containerized)
- Cloud Build CI/CD (GitHub → Cloud Build → Cloud Run)
- GCS-mounted persistent storage (/data volume)
- Google Secret Manager for credentials
- Docker containerized
- Custom domain: ro-tools.app
- $0/month at current scale
