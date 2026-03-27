# RO Tools — Enterprise Presentation Package
### v2.3.0 | March 26, 2026 | Built for JM Valley Group

---

## HOW TO VIEW THE APP

| Method | Who It's For | How |
|--------|-------------|-----|
| **Demo Mode** | Anyone (no account needed) | Visit `ro-tools.app/demo` — creates a 2-hour read-only session with sample data |
| **Live Login** | @jmvalley.com users | Visit `ro-tools.app` → Sign In with Google → auto-fills your store info |
| **Video Walkthrough** | Leave-behind / training | 5-minute scripted walkthrough (script below) |

---

## PLATFORM OVERVIEW

RO Tools is a centralized web application built exclusively for JM Valley Group franchise operations. It replaces manual Word templates, inconsistent paperwork, and fragmented workflows with a single platform where every document is generated with uniform branding, auto-filled store data, and full audit logging.

**By the numbers:**
- **9** document generators (PDF download in seconds)
- **29+** stores across Southern California
- **11** weeks of live scoreboard data
- **5** district manager districts auto-configured
- **0** cost per month (runs on existing Google Cloud infrastructure)

---

## FEATURE BREAKDOWN (22 SECTIONS)

### 1. LANDING PAGE & BRANDING

**What it does:** Professional public-facing page that communicates the platform's value and provides secure Google OAuth login restricted to @jmvalley.com accounts.

**Features:**
- Animated hero section with 6 mini-document previews
- Stats bar: 7 Generators, 29+ Stores, 1 Click to PDF, 0 Design Skills
- 6 tool cards showcasing the full suite
- 3-step "How It Works" section
- Google OAuth with domain restriction (@jmvalley.com only)
- Demo mode access at `/demo` for non-account holders

**Technical:** Next.js 14 App Router with IntersectionObserver scroll animations, Google OAuth 2.0 with `hd: 'jmvalley.com'` domain lock, HMAC-SHA256 signed session cookies.

**Business Value:** First impressions matter. When HR or a new operator lands on ro-tools.app, they see a polished, enterprise-grade platform — not a hobby project. The domain restriction ensures only authorized JMVG personnel can access live data. Demo mode lets leadership evaluate the platform without needing credentials.

**Demo Talking Point:** *"This is what every operator sees when they first visit. One click with their @jmvalley.com account and they're in — no new passwords, no IT tickets."*

---

### 2. ONBOARDING & ROLE SYSTEM

**What it does:** Three-role system (Operator, District Manager, Administrator) with approval workflows, multi-store support, and predictive store search.

**Features:**
- 3 roles: Operator (single store), District Manager (multi-store), Administrator (all access)
- DMs get their stores auto-populated on first login (pulled from store directory)
- ROs get their store auto-populated by email match
- Predictive store number search — type "20" and see matching stores with names
- Admin/DM roles require approval (prevents unauthorized escalation)
- Auto-admin for designated emails (david@, bethany@, brittany@, chrisr@)

**Technical:** Role stored in server-side JSON with `roleApproved` flag. Client-submitted `roleApproved` is stripped server-side to prevent escalation. `DM_ASSIGNMENTS` maps each DM's email to their store IDs. `searchStores()` provides fuzzy matching on ID and name.

**Business Value:** Scales from 5 stores to 500. District Managers see only their stores. Operators see only theirs. Administrators see everything. The approval workflow prevents unauthorized access while auto-admin keeps designated leadership frictionless. Predictive search eliminates data entry errors during onboarding.

**Demo Talking Point:** *"When Jacob Elliott logs in for the first time, his 6 stores are already there — names, numbers, RO assignments. He just fills in phone numbers and he's done."*

---

### 3. DASHBOARD HOME

**What it does:** Central hub showing platform overview, available tools, compliance information, and recent updates.

**Features:**
- Personalized welcome with user's first name
- 4 operational pillars: Document Generation, Store-Aware, Secure & Private, Full Audit Trail
- 12 available tools listed with descriptions
- California & Federal compliance section (Cal/OSHA, Labor Code)
- Recent Updates widget (latest 3 changelog entries)
- Auto-admin notification modal for newly-qualified administrators

**Technical:** Pulls profile via `/api/profile`, renders latest 3 entries from `changelog.js`. Admin modal dismissed via POST to profile endpoint.

**Business Value:** Every operator immediately understands what's available and how compliance is built in. The compliance section is particularly important for HR — it demonstrates that every form meets California labor law requirements out of the box.

**Demo Talking Point:** *"This is command central. Every tool is one click away. Notice the compliance section at the bottom — every form we generate meets California labor law and Cal/OSHA standards."*

---

### 4. CATERING FLYER GENERATOR

**What it does:** Generates print-ready catering flyers with the official Jersey Mike's logo, full 16-item menu, $89.95 pricing, and store-specific contact information.

**Features:**
- Official Jersey Mike's Subs logo (customer-facing branding)
- Full 16-item sub menu with descriptions
- $89.95 per box pricing with box details
- Store address, phone, operator and assistant contact cards
- Live preview updates as you edit
- PDF download in letter size (612x792pt)

**Technical:** `FlyerPreview` component renders HTML that `html2canvas` captures at 2x resolution, then `jsPDF` converts to PDF. Store data auto-fills from profile.

**Business Value:** Previously, creating a catering flyer meant opening a Word template, manually updating store info, fixing formatting issues, and hoping the branding was right. Now it's generated in seconds with guaranteed consistency across all 29+ stores. Every flyer looks professional and on-brand.

**Demo Talking Point:** *"Click 'Download PDF' — that's a print-ready flyer with our store info, the full menu, and our contact details. Takes about 3 seconds."*

---

### 5. WRITTEN WARNING / CORRECTIVE ACTION

**What it does:** Generates legally-compliant progressive discipline documentation with violation categories, improvement plans, and dual signature lines.

**Features:**
- 5 warning levels: Verbal Warning, Written Warning, Final Written Warning, Suspension, Termination
- Violation category dropdown (attendance, conduct, performance, policy, safety, insubordination)
- Previous warnings documentation
- Expected improvement and consequences sections
- Employee comments section
- Dual signature lines (employee + supervisor)
- At-will employment acknowledgment
- Internal JMVG branding with confidential footer

**Technical:** `WrittenWarningPreview` renders letter-size document with structured sections. Auto-fills store name, number, and supervisor from profile.

**Business Value:** Progressive discipline documentation is the #1 area where franchise operations get sued. Inconsistent paperwork, missing signatures, or vague language creates liability. This generator ensures every written warning follows the same format, includes all legally-required elements, and creates an audit trail. HR can verify that every store is documenting discipline the same way.

**Demo Talking Point:** *"Every written warning across all 29 stores looks exactly the same. Same format, same language, same legal protections. That's standardization HR can rely on."*

---

### 6. PERFORMANCE EVALUATION

**What it does:** Structured employee reviews with 10-category 1-5 scoring, visual indicators, and development planning.

**Features:**
- 10 rating categories: Attendance, Quality of Work, Speed of Service, Customer Service, Teamwork, Communication, Initiative, Policy Adherence, Cleanliness, Overall Performance
- 1-5 scoring with color-coded visual bars
- Auto-calculated overall average
- Strengths, Areas for Improvement, Goals sections
- Dual signature lines
- Evaluation period field (e.g., "Q1 2026")

**Technical:** `EvaluationPreview` renders rating grid with dynamic score indicators. Ratings stored as object with category keys.

**Business Value:** Standardized evaluations eliminate subjective bias and create consistent performance benchmarks across all stores. When a DM reviews evaluations from their 6 stores, every one follows the same 10-category framework. This enables meaningful cross-store comparison and identifies top performers for promotion.

**Demo Talking Point:** *"Same 10 categories, same 1-5 scale, every store. When we want to identify who's ready for a shift lead promotion, we can compare scores apples-to-apples across the entire group."*

---

### 7. CATERING ORDER FORM

**What it does:** Customer-facing order form with dynamic box management, full 16-sub menu selection, extras, discount tiers, and auto-calculated pricing.

**Features:**
- Dynamic box management (add/remove boxes, 1-4 sub varieties per box, 12 subs per box)
- Full menu dropdown with bread selection (White/Wheat) and Mike's Way toggle
- Extras: chips ($2.55/person), drinks ($3.45/person), cookie platter ($17.99), brownie platter ($19.99)
- Discount tiers: 0%, 5%, 10%, 15% with one-click buttons
- Real-time subtotal, discount, and total calculation
- Auto-saves to Catering Tracker (creates/matches client automatically)
- Reorder capability from past orders via sessionStorage
- Customer-facing Jersey Mike's branding

**Technical:** Complex state management with nested box/sub arrays. `CateringOrderPreview` renders customer-facing PDF. Auto-save POSTs to `/api/catering/orders` with client name matching (normalized whitespace comparison). `formSnapshot` stored for exact reorder capability.

**Business Value:** Catering is the highest-margin revenue channel for Jersey Mike's. This form eliminates order errors, ensures accurate pricing, and automatically builds a client database for follow-up. The reorder feature means repeat business is one click away.

**Demo Talking Point:** *"Add two boxes, pick the subs, apply a 10% discount — the total updates live. When I download this, it also auto-saves the client to our Catering Tracker for follow-up."*

---

### 8. COACHING FORM

**What it does:** Documents verbal coaching sessions as the first step in progressive discipline, before written warnings.

**Features:**
- 6 coaching types: Attendance, Performance, Behavior, Policy Violation, Safety, Other
- Structured sections: Concern, Expectations, Action Items, Follow-up Date
- Pre-filled consequences clause (escalation to written warning)
- Employee comments section
- Dual signatures

**Technical:** `CoachingFormPreview` with radio-button coaching type selection. Auto-fills coach name and store from profile.

**Business Value:** Most managers skip verbal coaching documentation because there's no easy template. This creates a paper trail before formal discipline begins, which is critical for legal protection and employee development.

**Demo Talking Point:** *"Before you write someone up, you coach them first. This documents that conversation — date, what was discussed, what's expected, and when you'll follow up."*

---

### 9. INJURY REPORT

**What it does:** OSHA-compliant workplace injury documentation with direct HR email submission.

**Features:**
- Incident details: date, time, location (8 location options)
- Injury classification: 8 types (cut, burn, slip/fall, strain, repetitive, struck by, equipment, other)
- Body part affected
- Witness information
- First aid and medical treatment tracking
- Employee work status (left work, return date)
- Supervisor response and preventive measures
- **Direct email to HR** (bethany@jmvalley.com) with formatted HTML report
- Cal/OSHA §6409.1 compliance notice

**Technical:** `InjuryReportPreview` renders OSHA-compliant form. POST to `/api/email` sends formatted HTML via Gmail API to HR. Email restricted to @jmvalley.com recipients only.

**Business Value:** Workplace injuries must be documented immediately and reported to HR. This form ensures every incident follows the same reporting format, includes all OSHA-required fields, and gets to HR in real-time via email — not days later via interoffice mail.

**Demo Talking Point:** *"An employee gets hurt — the manager fills this out, clicks 'Submit to HR,' and Bethany has the full report in her inbox within seconds. That's compliance you can count on."*

---

### 10. TIMESHEET CORRECTION

**What it does:** Documents clock in/out corrections with original vs. corrected times, reason, and dual signatures.

**Features:**
- Original shift times (clock in/out, break out/in)
- Corrected shift times (same fields)
- Reason for correction textarea
- California Labor Code §226 acknowledgment
- Dual signatures

**Technical:** `TimesheetCorrectionPreview` with side-by-side time comparison layout.

**Business Value:** Payroll accuracy directly impacts labor cost — the single largest controllable expense. Documenting every timesheet change with the reason and both signatures protects against wage disputes and ensures audit compliance.

**Demo Talking Point:** *"Every timesheet correction is documented: what it was, what it should be, why, and both signatures. Payroll disputes end here."*

---

### 11. ATTESTATION CORRECTION

**What it does:** Meal and rest break attestation corrections compliant with California labor law.

**Features:**
- Attestation type: Meal Period, Rest Break, or Both
- Shift details (date, start/end times)
- Original vs. corrected attestation
- Reason for correction
- CA Labor Code §512, §226.7 compliance notice
- Dual signatures

**Technical:** `AttestationCorrectionPreview` with California-specific legal language.

**Business Value:** California meal and rest break violations are the most common source of labor lawsuits in the restaurant industry. Proper attestation documentation is the first line of defense. This generator ensures every correction follows the legally-required format.

**Demo Talking Point:** *"California meal break violations cost franchises thousands. This form documents corrections with the exact legal language required by Labor Code §512."*

---

### 12. TRAINING DOCUMENTS

**What it does:** Generates 7 structured training packets and checklists for employee development and onboarding.

**Features:**
- Level 1 Training (Sprinkle/Wrap Station)
- Level 2 Training (Register/Wrap)
- Level 3 Training (Hot Subs)
- Slicer Training (4-Week Certification Program)
- Opener Training (Opening Shift Certification)
- Shift Lead Training (Leadership & Closing)
- New Hire Checklist (Manager Onboarding)
- All JMVG-branded with employee name and start date
- Save to Google Drive integration

**Technical:** Template selection UI with `COMPONENT_MAP` routing to 7 different preview components. Dynamic filename generation.

**Business Value:** Training consistency is the foundation of service consistency. When every store follows the same Level 1-3 progression, the same slicer certification program, and the same shift lead training, customers get the same experience at every location.

**Demo Talking Point:** *"Seven training templates — from day-one onboarding through shift lead certification. Every store, same program, same standards."*

---

### 13. CATERING TRACKER (CRM)

**What it does:** Full client relationship management for catering — tracks clients, orders, revenue, follow-up schedules, and notable dates.

**Features:**
- Client management: add, edit, delete with contact info, company, notes
- Order tracking: manual logging + auto-save from catering order generator
- Revenue tracking: per-client and total, with top 3 leaderboard
- Follow-up system: reorder frequency (weekly/biweekly/monthly/quarterly/yearly/one-time)
- Status indicators: On Track (green), Due Soon (yellow), Overdue (red)
- Upcoming Events widget: notable dates in next 30 days with annual recurrence
- Next Expected Order date calculation
- Generate Order button: pre-fills catering form with client info
- Reorder button: re-loads exact past order into form (clears dates for new delivery)
- Store-scoped data: each store sees only their clients
- Sortable, searchable table

**Technical:** Store-scoped JSON files (`catering-{storeNumber}.json`). Path traversal guard on store number. Atomic read-modify-write with file locking. Client name matching uses whitespace-normalized comparison. `formSnapshot` stored on auto-generated orders enables exact reorder.

**Business Value:** Catering is the #1 growth opportunity identified by JMVG leadership. This tracker turns one-time orders into repeat business. The follow-up system ensures no client falls through the cracks. The reorder feature makes it effortless for clients to order again. Revenue tracking shows exactly which clients are most valuable.

**Demo Talking Point:** *"Every catering order we generate automatically creates a client record here. We track revenue, set follow-up schedules, and when it's time to reorder — one click reloads their exact order into the form."*

---

### 14. JMVG SCOREBOARD

**What it does:** Weekly performance leaderboards across all 29+ stores with 11 weeks of real data, color-coded target tracking, and competitive rankings.

**Features:**
- **Leaderboards Tab:**
  - Grand Slams: stores hitting all 4 targets in a week
  - Trifectas: stores hitting 3+ targets
  - Highest Average Growth %: year-over-year sales growth
- **Weekly Scoreboard Tab:**
  - Week selector (Weeks 1-11, Dec 29 - Mar 15)
  - Full data table: Net Sales, Bread Count, PY Growth, COGs, Variance, Labor, Target
  - Color-coded rows: Royal Blue (4 targets), Blue (double-digit growth), Green (3 targets), Yellow (2), Orange (1)
- **4 Targets:** Labor under target, COGs Variance -1% to -2.5%, COGs Actual 22-25%, PY Growth positive
- Store names displayed everywhere (not just IDs)

**Technical:** `scoreboard-data.js` contains all 11 weeks of data with `calculateTargets()` function. `getLeaderboards()` aggregates across all weeks. `getStoreName()` maps IDs to verified names.

**Business Value:** Healthy competition drives results. When operators can see where they rank against 28 other stores, they push harder. The Grand Slam and Trifecta leaderboards create aspirational targets. DMs use the weekly view to identify which stores need coaching. Leadership uses growth trends for strategic planning.

**Demo Talking Point:** *"Eleven weeks of real data, 29 stores. Grand Slams mean you hit all four targets — labor, COGs, variance, and growth. Click any week to see the full breakdown."*

---

### 15. MARKETING DIRECTIVES

**What it does:** Centralized marketing directives with monthly outreach assignments, ALL RO Meeting action items, and the 2026 campaign calendar.

**Features:**
- **April 2026 Monthly Directive:** Grassroots marketing to medical offices
  - Outreach tracker table (Place, Contact, Position, Phone, What was handed out, Order placed?)
  - JMVG Scorecard structure (upselling $, marketing $, store-specific $, growth target)
  - 2026 Upselling Focus Items (Cali Club, Extra Bacon)
- **ALL RO Meeting Recap (March 18, 2026):**
  - 6 action items with priority levels (high/medium)
  - Key announcements (29 stores, 11 new team members)
  - Development updates (Buellton, NorCal, SD/Riverside, Oxnard, Lompoc)
  - Key dates with past-date dimming
- **2026 Marketing Calendar:** Q1-Q4 monthly focus areas

**Technical:** Hardcoded directive data with multiple section renderers (highlight, table, scorecard, actions, dates, list, months). Accordion expand/collapse. `isPast()` helper dims past dates.

**Business Value:** Marketing consistency across 29+ stores requires centralized directives. When every operator has the same monthly focus (April = medical offices), the same outreach tracker, and the same scorecard structure, marketing efforts compound instead of fragmenting.

**Demo Talking Point:** *"Every operator opens this and knows exactly what to do this month: hit medical offices, hand out FSC & Menus, track who you visited. Same directive, every store."*

---

### 16. STORE DIRECTORY & AUTO-SETUP

**What it does:** Maps all 29+ JMVG stores to names, RO assignments, DM districts, and auto-populates stores during onboarding.

**Features:**
- 29 stores mapped: ID → name, RO name, DM assignment, address
- 5 DM districts: Jacob (6 stores), Narek (5), Josh (5), Josiah (3), Ryan (3)
- Auto-setup: DMs get their stores pre-filled, ROs get their store pre-filled
- Predictive search: type a number or name, see matching suggestions
- Store names displayed throughout scoreboard, tracker, and setup

**Technical:** `STORE_DIRECTORY` array with `DM_ASSIGNMENTS` and `DM_EMAILS` maps. `searchStores()` filters by ID or name. `getStoresForDM()` and `getStoreForRO()` enable auto-setup.

**Business Value:** Eliminates 15 minutes of data entry during onboarding. Prevents store number typos. Ensures DM-to-store assignments are always current. When a new store opens, add one line to the directory and every feature updates.

**Demo Talking Point:** *"Type '203' in the store number field — you'll see Santa Barbara, Goleta, and every other store starting with 203. Pick one and the name auto-fills."*

---

### 17. STORE PROFILE

**What it does:** Enter store information once and it auto-fills into every generator, flyer, and document across the platform.

**Features:**
- Store info: name, address, phone, operator name/phone, assistant name/title/phone
- District Manager name
- Multi-store support for DMs and Admins (add/remove stores)
- Connected Services management (Google Drive, Gmail status)
- Scope upgrade flow for Drive/Gmail access
- Changes propagate to all generators immediately

**Technical:** Profile stored in `profiles.json` by user ID. First store synced to top-level fields for backward compatibility. Connected Services checks `hasExtendedScopes` session flag.

**Business Value:** "Enter it once, use it everywhere" eliminates the most common source of errors in franchise paperwork — wrong store address, wrong phone number, wrong manager name. When Sarah transfers from Santa Barbara to Goleta, she updates her profile once and every document reflects the change.

**Demo Talking Point:** *"You set up your store info one time. Every generator, every flyer, every form auto-fills with your details from that point forward."*

---

### 18. ADMIN PANEL

**What it does:** Centralized management for user role approvals and enterprise-wide activity auditing.

**Features:**
- **Users Tab:**
  - Pending approvals queue (approve/deny DM and Admin requests)
  - All users list with role badges and store counts
  - Color-coded roles: Administrator (blue), District Manager (purple), Operator (gray)
- **Activity Logs Tab:**
  - Search by name, email, or document content
  - Filter by document type (16 types) and action (download, Drive save, email)
  - Paginated results with timestamp, user, type, action badge
  - Full audit trail across all stores and users

**Technical:** Admin check: super admin list + default admin list + approved administrator role. `logAdminAction()` records approval/denial events. Activity logs stored in `activity-logs.json` with full form data snapshots.

**Business Value:** HR needs visibility into what documents are being generated, by whom, and when. The activity log provides instant answers: "Show me every written warning generated in the last 30 days." The role approval system ensures only authorized personnel get elevated access.

**Demo Talking Point:** *"HR can search 'written warning' and see every one generated across all stores, who created it, and when. That's enterprise-grade accountability."*

---

### 19. SUPPORT SYSTEM

**What it does:** In-app bug reporting and feature request submission with ticket tracking.

**Features:**
- Bug Report submission (title + description)
- Feature Request submission (title + description)
- Ticket history with type badges and timestamps
- Paginated ticket list (10 per page)
- Toast notifications on submission

**Technical:** Tickets stored in `support-tickets.json`. Rate limited to 10 per minute. Input sanitized (title max 200 chars, description max 2000).

**Business Value:** Direct feedback loop from operators to development. No email threads, no Slack messages lost in noise. Every request is tracked and visible.

**Demo Talking Point:** *"Operators submit feature requests right here. That's how this platform keeps getting better — real operators telling us what they need."*

---

### 20. SAVE TO GOOGLE DRIVE

**What it does:** Save any generated PDF directly to Google Drive with folder browsing, creation, and organization.

**Features:**
- Browse My Drive, Shared Drives, and Shared with Me
- Create new folders from within the app
- Breadcrumb navigation
- Incremental scope upgrade (prompted only when feature is used)
- Success link opens file in Drive

**Technical:** `SaveToDrive` component checks `/api/auth/scopes` for Drive access. If not granted, shows upgrade prompt that redirects through `/api/auth/upgrade` with `returnTo` for seamless flow. Uploads via `/api/drive/upload` with base64 PDF.

**Business Value:** Documents live where your team already works — Google Drive. No downloading to desktop, no emailing PDFs around. Generate, save to the right folder, done.

**Demo Talking Point:** *"Generate the form, click 'Save to Google Drive,' pick the folder, done. It's in Drive ready to share."*

---

### 21. SECURITY & INFRASTRUCTURE

**What it does:** Enterprise-grade security across every layer of the application.

**Features:**
- **Authentication:** Google OAuth 2.0 with @jmvalley.com domain restriction
- **Session Security:** HMAC-SHA256 signed cookies with timing-safe comparison, httpOnly, secure, strict SameSite
- **Rate Limiting:** Per-endpoint IP-based limits (5-30 req/min depending on sensitivity)
- **Input Sanitization:** All user inputs length-limited and type-validated
- **Role Escalation Prevention:** Client-submitted `roleApproved` stripped server-side
- **Audit Logging:** Every document generation, Drive save, and email tracked with full form data
- **Admin Action Logging:** Role approvals/denials recorded with actor identity
- **Path Traversal Guard:** Store numbers validated with `/^\w{1,20}$/` regex
- **Atomic File Operations:** Temp file + rename pattern prevents data corruption
- **File-Level Locking:** Async locks prevent concurrent write conflicts
- **API Timeouts:** 30-second limits on external API calls
- **Incremental OAuth:** Sensitive scopes (Drive, Gmail) requested only when needed

**Technical:** Session signed with `GOOGLE_CLIENT_SECRET` via HMAC-SHA256. Rate limiter uses in-memory Map with automatic cleanup. Data persists on GCS-mounted volume at `/data`. Secrets managed via Google Secret Manager.

**Business Value:** Security isn't a feature — it's a requirement. JMVG handles employee PII (names, positions, disciplinary records, injury reports). Every layer of this application is built with that sensitivity in mind. The audit trail means HR can verify exactly who accessed what, when.

**Demo Talking Point:** *"Every document is logged. Every login is verified. Every cookie is cryptographically signed. This isn't a prototype — it's production security."*

---

### 22. RESPONSIVE DESIGN & DEPLOYMENT

**What it does:** Works on every device from desktop to phone, deployed on auto-scaling infrastructure.

**Features:**
- 10 breakpoints from 1024px to 360px
- Mobile hamburger menu at 740px
- 44px minimum touch targets
- Fluid typography scaling
- Auto-deploy on git push via Cloud Build
- Docker containerized on Google Cloud Run
- Auto-scaling (0 to N instances based on traffic)
- GCS bucket for persistent data storage

**Technical:** CSS Modules with media queries at 70px intervals. Cloud Build triggers on main branch push, builds Docker image, deploys to Cloud Run. Data persists on GCS bucket `pcsbot-490004-ro-tools-data` mounted at `/data`.

**Business Value:** Operators use this on their phones during catering runs, on tablets during shifts, and on desktops in the back office. It works everywhere. The auto-scaling infrastructure means it handles 1 user or 100 without manual intervention, and costs nothing when idle.

**Demo Talking Point:** *"Pull this up on your phone right now — same app, same features, same quality. It scales from one operator to every store in the group."*

---

## VIDEO WALKTHROUGH SCRIPT (5 Minutes)

### Opening (0:00 - 0:20)
*"This is RO Tools — the operational platform we built for JM Valley Group. Every document you need to run your store, generated in seconds, branded to your location, with full audit logging. Let me show you how it works."*

### Stop 1: Landing Page (0:20 - 0:50)
Click: Show ro-tools.app landing page
*"This is what operators see. Professional, clean, shows everything available at a glance. Sign in with your @jmvalley.com Google account — one click, you're in."*
Click: Sign in → Dashboard loads

### Stop 2: Dashboard Home (0:50 - 1:20)
*"Welcome screen, personalized. Twelve tools available, all live. Notice the compliance section — every form meets California labor law standards. Recent updates show what's new."*

### Stop 3: Written Warning Generator (1:20 - 2:00)
Click: Generators → Written Warning
*"Let's generate a written warning. Employee name, violation category from the dropdown, description of the issue. Store info is already filled in. Watch the preview update live on the right."*
Click: Download PDF
*"Three seconds — print-ready PDF. Same format across all 29 stores."*

### Stop 4: Catering Order Form (2:00 - 2:40)
Click: Catering → Catering Order
*"Catering order — add a box, pick the subs, bread choice, Mike's Way. Add chips and drinks, apply a 10% discount. Total calculates automatically. When I download this, it auto-saves the client to our Catering Tracker."*
Click: Download PDF

### Stop 5: Catering Tracker (2:40 - 3:10)
Click: Catering → Catering Tracker
*"Here's the tracker — every catering client, their order history, total revenue, follow-up status. Green means on track, red means overdue. The Reorder button reloads their exact last order. Top 3 clients are highlighted."*

### Stop 6: Scoreboard (3:10 - 3:40)
Click: Scoreboard
*"Eleven weeks of real performance data. Grand Slams — stores that hit all four targets. Trifectas — three out of four. Click any week to see the full breakdown. Color-coded: Royal Blue is the goal."*

### Stop 7: Marketing Directives (3:40 - 4:00)
Click: Directives
*"April directive: grassroots marketing to medical offices. Outreach tracker, scorecard, upselling focus items. Below that, the ALL RO Meeting action items and the full 2026 marketing calendar."*

### Stop 8: Admin Panel (4:00 - 4:20)
Click: Admin (gear icon)
*"Admin panel — pending role approvals, all users with role badges. Activity Logs tab: search any document generated across all stores. Full audit trail."*

### Stop 9: Training Documents (4:20 - 4:40)
Click: Generators → Documents
*"Seven training templates — Level 1 through Shift Lead certification, plus new hire checklists. Pick a template, enter the employee name, download. Consistent training across every store."*

### Closing (4:40 - 5:00)
*"That's RO Tools. Nine generators, catering CRM, live scoreboard, marketing directives, full admin panel. Zero cost, auto-scaling, enterprise security. Every store, one platform."*

---

## TECHNICAL SPECIFICATIONS

| Spec | Detail |
|------|--------|
| **Framework** | Next.js 14 (App Router) |
| **Runtime** | Node.js 20 (Alpine) |
| **Hosting** | Google Cloud Run (us-central1) |
| **Auth** | Google OAuth 2.0, @jmvalley.com domain lock |
| **Session** | HMAC-SHA256 signed cookies, 7-day expiry |
| **PDF Engine** | html2canvas + jsPDF (client-side) |
| **Data Storage** | Server-side JSON on GCS-mounted volume |
| **Secrets** | Google Secret Manager |
| **CI/CD** | GitHub Actions → Cloud Build → Cloud Run |
| **Container** | Multi-stage Docker (builder + runner) |
| **Fonts** | DM Sans, Playfair Display, Poppins (Google Fonts) |
| **CSS** | CSS Modules with 22 CSS custom properties |
| **Security** | Rate limiting, input sanitization, CSRF, audit logging, role escalation prevention |
| **Cost** | $0/month at current scale (Cloud Run free tier) |
| **URL** | https://ro-tools.app |
| **GCP Project** | pcsbot-490004 |

---

## ROI & BUSINESS IMPACT

### Time Savings
| Task | Before RO Tools | After RO Tools | Savings |
|------|----------------|----------------|---------|
| Written Warning | 15-20 min (Word template) | 2 min (fill form + download) | **85% faster** |
| Catering Flyer | 30+ min (design from scratch) | 30 sec (auto-filled) | **98% faster** |
| Performance Eval | 20 min (paper form) | 3 min (click ratings + download) | **85% faster** |
| Catering Order | 10 min (manual calculations) | 2 min (auto-calculated) | **80% faster** |
| Injury Report | 15 min + email to HR | 3 min (auto-emails HR) | **80% faster** |
| Timesheet Correction | 10 min (paper) | 1 min (fill + download) | **90% faster** |
| New Hire Onboarding Pack | 45 min (assemble docs) | 5 min (generate all) | **89% faster** |

### Standardization
- **29+ stores, 1 format:** Every document looks identical regardless of which store generates it
- **Zero formatting errors:** Templates enforce structure — no missing fields, no wrong logos
- **Compliance built-in:** California labor law language embedded in every relevant form

### Compliance & Risk Reduction
- **Audit trail:** Every document generation logged with user, timestamp, and full form data
- **Progressive discipline:** Coaching → Written Warning → Final → Termination documented consistently
- **Injury reporting:** OSHA-compliant forms with instant HR notification
- **Meal/rest break:** California §512 attestation corrections properly documented
- **Role-based access:** Only authorized users access admin functions

### Scalability
- **Current:** 29+ stores, 5 DMs, handles all document needs
- **Growth-ready:** Architecture supports 100+ stores with zero code changes
- **Cost:** $0/month on Cloud Run free tier; scales to thousands of requests automatically
- **Onboarding:** New store operational in under 5 minutes (predictive search + auto-fill)

---

## FUTURE ROADMAP

| Feature | Business Justification | Complexity |
|---------|----------------------|------------|
| **Employee Handbook Generator** | Standardized onboarding documentation | Medium |
| **Crew Tools Section** | Self-service for non-manager employees | Medium |
| **Live Scoreboard API** | Auto-import weekly data instead of manual entry | Medium |
| **Custom Domain Mapping** | White-label for sub-brands | Low |
| **Homebase Integration** | Pull schedules/shifts directly | High |
| **Multi-Language Support** | Spanish forms for bilingual staff | Medium |
| **Email Templates** | Branded email campaigns from the platform | Medium |
| **Mobile App (PWA)** | Installable app for phones/tablets | Low |

---

*Built by Chris Ruzylo | Powered by RO Tools v2.3.0 | March 2026*
