# RO Tools — Complete Feature List

> Only features that belong to RO Tools (ro-tools.app). Mission Control / RO Control features are tracked separately.

---

## Document Generation

### Generators (15)
- **Written Warning** — 5-level progressive discipline, violation categories, improvement plans, at-will acknowledgment
- **Performance Evaluation** — 10-category scoring with comments and overall rating
- **Coaching Form** — Verbal coaching and counseling documentation
- **Injury Report** — OSHA-compliant, auto-email to HR via Gmail API (Cal/OSHA §6409.1)
- **Employee Resignation** — Exit docs with resignation type, notice period, equipment return, final pay
- **Employee Termination** — CA Labor Code §201-202 compliant, prior discipline history, COBRA notes
- **Meal Break Waiver** — California Labor Code §512, IWC Order No. 5-2001, first/second/on-duty waivers
- **Timesheet Correction** — Clock in/out adjustment documentation
- **Attestation Correction** — Meal and rest break documentation per §226.7
- **Catering Order Form** — Dynamic box management, 16-sub menu, auto-calculated pricing, discount tiers
- **Catering Flyer** — Print-ready with store info, full menu, pricing, Jersey Mike's branding
- **Food Labels** — FSMC-compliant food safety labels with prep/expiry dates, customizable categories
- **Work Orders** — Equipment repair/maintenance requests with priority levels and tracking
- **Manager Log** — Daily manager notes with timestamped entries and shift details
- **DM Walk-Throughs** — District Manager visit reports with store assessment and action items
- **Onboarding Packet** — New hire documentation with progress tracking and e-signatures
- **Training Documents** — 8 multi-page templates (see Training section)

### PDF Engine
- Client-side rendering via html2canvas + jsPDF
- Multi-page PDF support (data-pdf-page + addPage)
- JMVG branded headers (90px logo on first page, mini headers on subsequent)
- Page numbers on every page
- Red confidentiality footer on every page
- Solid write-on lines for form fields
- Checkbox boxes for proficiency tables and initials

### Digital Signatures
- Auto-generated manager signatures (Dancing Script cursive, timestamped)
- E-signature system with signing requests via email
- Public /sign/[token] page with canvas signature pad
- Timestamped audit trail with IP logging

---

## Training

### Training Packets (8 templates, 54 pages total)
- **Orientation** — Day 1: policies, procedures, daily operations, guest service, core values, LMS videos (5 pages)
- **Level 1** — Days 2-9: Sprinkle/Wrap certification, cold sub quiz, benchmarks, GM debrief (8 pages)
- **Level 2** — Days 10-18: Register/Wrap certification, phone orders, lobby checks (9 pages)
- **Level 3** — Days 18-28: Hot Subs certification, menu quiz, C-BOPS, advanced hot subbing (6 pages)
- **Slicer** — 4-week program: back/front line slice, quarterbacking, certification (8 pages)
- **Shift Lead** — Evaluation tables, character traits, proficiency checks, 5 training days, DM interview (10 pages)
- **Opener** — 6 shifts: 7am-10am timeline, bread/bacon/tomatoes, quality checks, slicer safety (8 pages)
- **New Hire Checklist** — Manager onboarding documentation

---

## Catering

### Catering CRM
- Client list with search
- Revenue tracking per client with Top 3 leaderboard
- Follow-up status: On Track / Due Soon / Overdue
- Upcoming Events widget (notable dates in next 30 days)
- One-click reorder from past orders
- Auto-logs clients from generated catering orders
- Next Expected Order date tracking

---

## Scoreboard

### Weekly Scoreboard
- 12 weeks of performance data across 29+ stores
- 4 targets: Labor, COGs Variance, COGs Actual, PY Growth
- Color-coded tiers: Royal Blue (Grand Slam/4), Blue (Double Digit), Green (Trifecta/3), Yellow (2), Orange (1)
- Leaderboards: Grand Slams, Trifectas, Highest Avg Growth %
- Week-by-week breakdown with full metrics
- Store names displayed throughout

---

## L10 Weekly Scorecard

### L10 Manager Form
- 30 metrics across 5 categories (Sales, People, Operations, Reporting, Profitability)
- Auto-color coding: green when goal met, red when missed
- Grade bar: auto-calculated percentage of green cells out of 30
- Week selector with date ranges (52 weeks)
- Employee evaluation section with EVAL + ATTESTATION checkboxes
- Time Finished tracking
- API backend (POST/GET /api/l10) with server-side persistence
- DM view: all ROs' scorecards for a week (?all=true)

---

## Marketing & Directives

### Directives Page
- Monthly marketing directive display
- ALL RO Meeting recap with action items
- Key dates and 2026 marketing calendar
- Quarterly focus areas

---

## Operations Tools

### FSC Tracker (Free Sub Card)
- Per-store guest recovery tracking
- Complaint logging: guest name, address, date, card count, reason
- Pending/Sent status tracking with mark-sent workflow
- Search and filter by status
- Demo mode with sample data

### Payroll Workbench
- Biweekly pay period management
- Employee hours, tips, and wages tracking
- Cash + CC tips reconciliation
- Click-to-edit cells (Sheets-like)
- Per-store, per-period data persistence

### Stability Snapshot
- Role-based staffing grid per store
- Vacancy tracking and staffing health indicators
- Inline editing for slot assignments
- Multi-store view for DMs

### Tier Assessment (ABC Scoring)
- Weighted rubric-based employee evaluation
- Category scoring across performance dimensions
- Tier classification (A/B/C) with tie-break logic
- Live rubric loaded from server config

### Reading Library
- 15 leadership books with curated excerpts
- Discussion questions per book
- Audible and Amazon purchase links
- Per-book detail pages with extensive content

---

## Store Management

### Store Profiles
- Store profile with auto-fill into all documents
- 29+ stores mapped with names, RO assignments, DM districts
- DM auto-population on first login
- Role-based access: Operator, District Manager, Administrator
- Admin approval for DM/Admin roles

### Admin Panel
- User management and role approvals
- Activity logs searchable by generator type, action, user
- Full audit trail (every document generation logged)

---

## Authentication & Security

- Google OAuth 2.0 restricted to @jmvalley.com
- HMAC-SHA256 signed session cookies
- Role-based access control
- Rate limiting on all API routes
- Input sanitization and path traversal guards
- Digital e-signatures with timestamped audit trail

---

## Platform & UX

### Web App
- Red/white branded scrollbar
- Red overscroll effect (#EE3227)
- Active tab highlighting in navbar
- theme-color meta tag (#EE3227)
- Red accent CTA buttons, step numbers, pillar card borders
- "Why RO Tools" philosophy section with By the Numbers stats
- Save to Google Drive with folder picker
- Auto-email injury reports to HR
- Demo mode at /demo (read-only, sample data, 2-hour sessions)
- Self-playing presentation at /presentation (15 slides)
- Changelog/Updates page grouped by version
- Support page (bug reports + feature requests)

### iOS App (RO Tools)
- Native SwiftUI (iOS 16+)
- All 12 generators with on-device PDF (UIGraphicsPDFRenderer)
- 8 training packet templates
- Catering CRM with push notification reminders
- Live scoreboard
- Google OAuth via ASWebAuthenticationSession
- Offline support with JSON file persistence + background sync
- Push notifications (APNs)
- Keychain token storage
- JMVG logo in navbar on every screen
- Blue gradient login matching website
- App Store listing (unlisted) submitted
- TestFlight Build 4 delivered

---

## Marketing Directives

- Monthly directive system with 5 tabs: Directives, Outreach Tracker, Scorecard, Calendar, Overview
- Admin creates monthly directives (title, goals, action items, upsell focus)
- Outreach Tracker: ROs log business visits (name, contact, materials, order Y/N, follow-up)
- Scorecard: end-of-month revenue tracking ($upsell, $marketing, $store idea, growth %)
- Calendar: key dates tied to action items
- Role-based: RO sees store, DM sees all 9 stores, Admin sees everything

---

## Reading / Book Log

- Dedicated Reading tab in navbar
- Per-book pages with: author bio, importance, extensive excerpts, chapter summaries
- Discussion questions for team meetings
- Application sections (how to apply in-store)
- Audible + Amazon purchase links on every page

---

## Employee System

- EmployeeSelect component: searchable dropdown grouped by store
- Auto-fills position and store info on employee selection
- Dual-save: PDF generated + metadata saved to employee file
- All 9 employee-related generators have dropdown
- Powered by Homebase import (669 employees, 29+ stores)
- Employee Docs viewable cross-platform in RO Control

---

## Dark Mode

- System-wide dark mode toggle in navbar (moon/sun icon)
- Mid-grey palette (#1e1e24 bg, #2a2a36 cards)
- Brand colors brightened for contrast (#4a90d0 blue, same red)
- Consistent across all pages including generators, training, catering
- Persists via localStorage

---

## Quick Tour

- Interactive onboarding for first-time users
- 8 steps walking through key features
- Navigates to each page as it highlights
- Skippable, one-time (localStorage + server flag)
- Playfair Display title, blue buttons, red progress bar

---

## Auto-Setup

- First login with @jmvalley.com auto-matches Homebase employee data
- Auto-fills: name, store number, store name, address, phone, RO, DM
- Auto-assigns role based on hierarchy (RO, DM, Admin)
- Skips setup wizard entirely — straight to Quick Tour
- Store Profile syncs with RO Control

---

## Infrastructure

- Google Cloud Run (auto-scaling, containerized)
- Cloud Build CI/CD (GitHub → Cloud Build → Cloud Run)
- GCS-mounted persistent storage (/data volume)
- Google Secret Manager for credentials
- Custom domain: ro-tools.app
- $0/month at current scale
