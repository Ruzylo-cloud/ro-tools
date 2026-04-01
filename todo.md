# TODO — Remaining Work Items

## Apple / Manual Steps (Chris must do)
- [ ] **Register com.jmvalley.rocontrol** — developer.apple.com → Identifiers → Add → iOS, Explicit, Push Notifications
- [ ] **Create RO Control App Store Connect listing** — New App → RO Control → com.jmvalley.rocontrol → SKU: rocontrol
- [ ] **Upload RO Tools IPA via Transporter** — IPA at ~/projects/ro-tools-ios/build/appstore/RO Tools.ipa
- [ ] **Upload RO Control IPA via Transporter** — after bundle ID registered, export IPA then upload
- [ ] **Check RO Tools App Store review** — appstoreconnect.apple.com → may already be approved
- [ ] **Enable TestFlight public link** — both apps → External Testing → JMVG All → Enable Public Link
- [ ] **Test both apps on iPhone via TestFlight** — download TestFlight, open public link, install

## Code Fixes Needed
- [ ] **RO Tools mobile login still broken** — intermediate session page deployed but untested. Verify on iPhone after Cloud Build deploy completes.
- [ ] **RO Control JWT_SECRET** — DONE: set as env var on Cloud Run. Verify logins persist after deploy.
- [ ] **CrewLoginView.swift compile fix** — fixed authManager.baseURL → APIService.shared.baseURL. Committed but not pushed.
- [ ] **RO Control iOS needs export** — archive succeeded, export fails until bundle ID registered

## Feature Completeness (verify each has UI + works)
- [ ] **People Hub pages** — verify all 10 sections have full UI: Time Clock, Timesheets, Tips, Employee Docs, Performance Notes, Recognition, Certifications, Hiring, Onboarding, HR Forms
- [ ] **Marketing Directives** — verify 5 tabs: Directives, Outreach, Scorecard, Calendar, Overview
- [ ] **Schedule Builder** — verify visual blocks, color-coding, coverage heatmap, drag-drop, labor budget
- [ ] **Checklists auto-generate** — verify no manual button, time-based generation
- [ ] **L10 inline editing** — verify click-to-edit on scorecard, cascading, IDS, TODO
- [ ] **Stability Snapshots** — verify data imported, inline editing, L10 auto-calc
- [ ] **Kiosk 5 tabs** — verify Clock, On Shift, Checklists, Mid-Day Closeout, End-of-Day Closeout
- [ ] **Closeout forms** — verify identical in kiosk + web + iOS
- [ ] **Store Profile sync** — verify update on RT → reflects on RC and vice versa
- [ ] **Employee dropdowns** — verify all 9 generators have searchable dropdown with real Homebase data
- [ ] **Reading/Book Log** — verify per-book pages, extensive content, Audible/Amazon links
- [ ] **Dark mode** — verify toggle works on all 4 platforms, mid-grey palette consistent
- [ ] **Quick Tour** — verify shows on first login only, skippable, navigates to pages
- [ ] **Auto-setup** — verify @jmvalley.com login auto-fills profile from Homebase data
- [ ] **/welcome page** — verify complete with all features, comparison, security, ROI, presentations
- [ ] **Crew PIN login** — verify schedule first tab, swaps, time off, availability

## Schedule Builder — Homebase Parity (P0 EMERGENCY)
- [ ] **Day view timeline** — horizontal shift bars on hourly timeline (7am-10pm), employees on left
- [ ] **Per-hour coverage bars** — headcount visualization showing staffing per hour
- [ ] **Open Shifts row** — top of grid, shows unclaimed shifts with pending approval
- [ ] **Availability + Time-off blocks** — visible in day cells, grayed unavailable slots
- [ ] **Schedule Viewed/Not Viewed** — status badge per employee
- [ ] **Multi-location shifts** — grayed out with location name when employee works at other stores
- [ ] **Print in 3 formats** — white bg, full color, colored borders (Homebase has all 3)
- [ ] **Publish with notifications** — notify everyone, custom selection, notification preferences
- [x] **Weather in day headers** — DONE: 7-day forecast from Open-Meteo wired into column headers
- [x] **position_id optional** — DONE: shift creation no longer blocked when no role selected

## Jolt Parity — Checklists & Food Safety (P0) — FROM 54 SCREENSHOT REVIEW

### Checklists (Jolt "Lists")
- [ ] **Photo evidence per checklist item** — CRITICAL. Jolt allows photo proof for EVERY checklist item. Employee takes photo, it appears inline with timestamp. Our system needs camera capture + photo storage per item on both web and iOS kiosk.
- [ ] **Checklist scoring (1-5 per item)** — Jolt shows numeric score badge (1-5) on each completed item. We need score field per checklist item.
- [ ] **Checklist history with date presets** — Jolt: Today, Yesterday, Last 7 Days, Custom date range. Our history needs these quick-filter presets.
- [ ] **Checklist metadata display** — Each checklist shows: Displayed date, Due by time, Expires time. Verify ours shows same.
- [ ] **Submit Items button** — Green CTA at bottom of checklist. Verify ours has clear submit action.
- [x] **Checklist auto-generation by shift** — COVERED by 4 AM cron + on-page fallback

### Attestation System
- [ ] **Multi-question attestation flow** — Jolt: select employee name -> answer 5+ questions (meal period, rest breaks, time accuracy, injury, expenses) -> each with YES/NO -> canvas signature -> employee photo capture. Verify our attestation covers all these questions.
- [ ] **Canvas signature on attestation** — Jolt captures hand-drawn signature. Verify our e-sign system works on attestation.
- [ ] **Employee photo capture on attestation** — Jolt captures employee selfie after signature. We may not have this — add if missing.
- [ ] **Full CA labor law attestation text** — Verify our attestation includes proper legal language matching Jolt's (meal period §512, rest breaks, time accuracy, injury reporting, expenses).

### Information Library (Jolt "Information Library")
- [ ] **Document/media library** — Jolt has folder-based library: LTO Subs, Deep Cleaning Videos, Food Safety Booklet, GM training videos, Operational Guides. Our Knowledge Base needs similar folder structure with photos/videos.
- [ ] **Add media: photo/video/library upload** — Verify our Knowledge Base supports photo+video upload, not just documents.
- [ ] **Star/favorite content** — Jolt has starred/favorite items. Add if missing.

### Logbook (Jolt "Logbook")
- [x] **Manager Log** — COVERED by our Manager Log generator on RT + manager_log routes on RC. Chronological feed with entries per board.
- [ ] **Logbook filtering** — Jolt: Date Range presets + Flag Status (All/Flagged/Resolved) + Read Status (Both/Unread/Read). Verify our Manager Log has equivalent filtering.
- [ ] **Flag/resolve entries** — Jolt entries can be flagged and resolved. Add if missing from our Manager Log.

### Labels & Printing
- [x] **Food label templates** — COVERED by our Food Labels generator on RT
- [ ] **Bluetooth/network printer discovery** — Jolt discovers printers via Bluetooth and network. Our system currently only prints via browser. iOS app needs AirPrint or direct printer support.
- [ ] **QR code for clock-in** — Jolt generates location QR code (store name + code + 24hr expiry + print). For kiosk clock-in without PIN. Add if missing.

### Sensors / Temperature
- [ ] **IoT temperature sensor management** — Jolt connects to physical sensors (gateways + sensors + visual alerts). We have manual temp logging but no IoT sensor support. Note: this is hardware-dependent, may defer.
- [x] **Temperature logging with anomaly alerts** — COVERED by our temp log routes + anomaly detection in joltConnector.ts

### Tools
- [x] **Weather** — COVERED (Open-Meteo, wired into schedule + dashboard)
- [ ] **Built-in calculator** — Jolt has one. Simple but useful for kiosk mode. Add to RC iOS kiosk tools.
- [x] **QR codes** — COVERED by equipment QR routes in work orders
- [ ] **Temperature probe integration** — Jolt connects to Bluetooth temp probes. Hardware-dependent, may defer.

### Settings / Config
- [ ] **Scheduling notification preferences** — Jolt: Push/Email/Text toggles for schedule published + shift reminders. Verify our system has notification preferences per employee.
- [ ] **Multi-location switcher** — Jolt shows all company locations with radio select. Our DM view handles this but verify single-tap location switching exists.
- [ ] **Device diagnostic report** — Jolt can send diagnostic info. Low priority but nice for troubleshooting.
- [ ] **QR clock-in code** — Store-specific QR with 24hr expiry for touchless clock-in. Printable.

## Vantage Point Reports
- [ ] **Search Gmail** — find all Vantage Point daily/weekly/monthly reports
- [ ] **Replicate report formats** — daily sales, weekly summary, monthly P&L in Reports tab
- [ ] **Marketing calendars** — check Google Sheets, replicate in Marketing tab
- [ ] **EBITDA goals** — check Google Sheets for monthly goals, add to L10 or Reports
- [ ] **Growth goal sheets** — replicate in appropriate dashboard section

## iOS Apps — Missing Features
- [ ] **RC iOS kiosk closeout** — MISSING: MidDayCloseoutView.swift + EndOfDayCloseoutView.swift (only 3 of 5 kiosk tabs exist)
- [ ] **iOS dark mode adaptive colors** — Colors.swift has NO adaptive colors, all static. Need UIColor userInterfaceStyle checks.
- [ ] **RT iOS: 5 new generators** — Food Labels, Work Orders, Manager Log, DM Walk-Throughs, Onboarding Packets need iOS views

## Command Palette
- [x] **Missing commands added** — DONE: L10, Stability, Closeout, all People Hub sections, Knowledge Base, AMEX, Store Profile, Messaging

## Google Sheets / Docs to Replicate in System
- [ ] **FSC (Free Sub Card) Tracker** — NOT BUILT. Per-store tabs. Columns: Guest Name, Address, Complaint Date/Time, How Many Cards, Note/Reason, Date Sent. Source: Google Sheet "FSC Request" owned by Brittany Heery. Needs new page in RO Control Operations dropdown. Guest recovery for bad reviews/complaints.
- [x] **Marketing report calendars** — COVERED by Marketing Directives Calendar tab on RT
- [x] **JMVG Sales Growth Scorecard** — COVERED by Marketing Directives Scorecard tab on RT
- [x] **Weekly scoreboard** — COVERED by RT Scoreboard page
- [x] **Vantage Point attestation reports** — COVERED by attestation wizard + timeclock compliance
- [x] **ezCater growth** — COVERED by RT Catering CRM revenue tracking
- [x] **Master closeout sheet** — COVERED by Kiosk EOD closeout
- [ ] **Bonus charts/sheets** — Need to search for bonus-specific sheets from josh@, bethany@, brittany@jmvalley
- [ ] **Monthly EBITDA goals** — Check if growth goal sheets exist, add to L10 or Reports if found

## CSS Token Mismatches
- [ ] **RC --text #ededf0** — should be #e8e8ed to match RT --charcoal
- [ ] **RC .rc-nav-user hardcodes #ededf0** — should use var(--charcoal)

## Data Verification
- [ ] **hierarchy.md** — verify all 29+ stores, 5 DMs, all ROs correct
- [ ] **669 employees imported** — verify in employee dropdowns
- [ ] **PostgreSQL** — verify all systems work (or SQLite with GCS backup if PG not yet deployed)
- [ ] **GCS file storage** — verify PDFs and docs persist across deploys
