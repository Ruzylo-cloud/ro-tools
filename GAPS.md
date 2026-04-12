# RO Tools Ecosystem — Gap Tracker

## Instructions
- `[ ]` = unclaimed
- `[IN PROGRESS - techy]` = claimed, being worked on
- `[DONE]` = complete and pushed

---

## MASTER TODO — All Remaining Work

### PHASE 1: PostgreSQL Migration (T1) — IN PROGRESS
- [ ] Set up Neon/Supabase PostgreSQL instance (need connection string)
- [ ] Run migration script (121 files, 1,120 queries) — scripts/migrate-to-pg.ts
- [ ] Create PostgreSQL schema (all tables from SQLite migrations)
- [ ] Migrate existing data (30 stores, 669 employees)
- [ ] Update database.ts to use pgAdapter.ts
- [ ] Add DATABASE_URL to env-vars.yaml
- [ ] Test every system after migration
- [ ] Verify data persists across Cloud Run deploys

### PHASE 5: Testing (T22)
- [ ] RO Tools: login → auto-setup → tour → all 12 generators → training → catering → scoreboard
- [ ] RO Tools: marketing directives → reading → store profile → dark mode → admin
- [ ] RO Control: login → dashboard → Jarvis → tasks → schedule → checklists
- [ ] RO Control: L10 inline edit → People hub → employee docs → performance notes → onboarding
- [ ] RO Control: closeout → stability → AMEX → reports → dark mode
- [ ] Kiosk: clock → on shift → checklists → mid-day → end-of-day → PIN lockout
- [ ] iOS: RT login + generators + dark mode
- [ ] iOS: RC login + schedule + L10 + kiosk
- [ ] Cross-platform: doc in RT → visible in RC employee docs
- [ ] Cross-platform: profile edit RT → syncs to RC

### PHASE 6: /welcome + Presentations (T23-25)
- [DONE] Update /welcome with ALL new features (People hub, schedule builder, crew login, marketing, reading, FSC, payroll, stability, tier, L10, Jarvis, kiosk, closeout, checklists, announcements)
- [ ] RT presentation (~4 min)
- [ ] RC presentation (~4 min)
- [ ] Dashboard operational widgets (shift lead+ labor view)

### PHASE 7: iOS + App Store (T26-29)
- [ ] App icons (larger JMVG logo)
- [ ] 24 screenshots (6 iPhone + 6 iPad per app)
- [ ] Rebuild both iOS apps with all changes
- [ ] App Store metadata text files
- [ ] Register com.jmvalley.rocontrol bundle ID
- [ ] Submit both apps for review

### PHASE 8: Final Verification (T30-34)
- [ ] Zero gaps in gaps.md
- [ ] Zero errors in errors.md
- [ ] Zero unchecked in matchingstyle.md
- [ ] features.md complete for both platforms
- [ ] hierarchy.md verified
- [ ] Memory leak + dead code scan
- [ ] Docker builds clean
- [ ] /welcome verified by all sessions

---

## Active Gaps

### Schedule Builder — Homebase Parity (P0 EMERGENCY)
- [DONE] **Day view timeline** — Homebase has hourly horizontal bars (7am-10pm). We only have week grid view. Need Day tab with timeline.
- [DONE] **Per-hour coverage** — Homebase shows headcount bars per hour at bottom. We show daily totals only.
- [DONE] **Open Shifts row** — Homebase has unclaimed shifts at top of grid. We don't have this.
- [ ] **Availability blocks** — Homebase shows unavailable/time-off in cells. We don't display availability.
- [DONE] **Print 3 formats** — Homebase offers white bg, full color, colored borders. We have none.
- [DONE] **Weather in headers** — 7-day forecast from Open-Meteo wired into day column headers (techy, pushed 3348870)
- [DONE] **position_id optional** — Shift creation unblocked when no role selected (techy, pushed 3348870)

### Jolt Parity — Checklists
- [ ] **Jolt UI clone** — Need to capture Jolt's checklist UI design and ensure ours is 30% better
- [ ] **Food safety scoring dashboard** — Verify scores visible, compare to Jolt's scoring

### iOS Apps
- [ ] **RC iOS kiosk closeout** — MidDayCloseoutView + EndOfDayCloseoutView missing (only 3 of 5 tabs)
- [DONE] **iOS dark mode** — Colors.swift now uses _adaptive() for all colors, forced light mode removed from both apps
- [ ] **RT iOS 5 new generators** — Food Labels, Work Orders, Manager Log, DM Walk-Throughs, Onboarding Packets

### Jolt iPhone App Audit (54 screenshots reviewed)
- [DONE] **Checklist item scoring** — Jolt has 1-5 score badges per checklist item. Our items are pass/fail. Add score option.
- [DONE] **Checklist due/expires pickers** — Jolt has configurable display/due/expires with time interval or specific time. Our auto-generation works but manual creation needs these pickers.
- [ ] **Attestation selfie capture** — Jolt captures employee selfie photo at end of attestation in addition to signature. We have signature but not selfie.
- [ ] **Information Library enhancement** — Jolt has folder-based doc/video library (LTO recipes, deep cleaning videos, food safety booklet, GM training, operational guides). Our Knowledge Base/Reading needs folder+media support.
- [ ] **iOS Bluetooth printer pairing** — Jolt pairs with Zebra label printers via Bluetooth for food labels. Our web has label generation but iOS app lacks printer pairing.
- [ ] **iOS settings screen** — Jolt has: notification toggles (push/email/text), sleep prevention, diagnostic reports, location selector, device info. Our iOS app needs this.
- [DONE] **Logbook** — Jolt has daily journal entries per employee with flag/read/date filtering. We have Manager Log.
- [DONE] **People directory** — Jolt shows employees with roles, search, filter. We have People Hub.
- [DONE] **QR codes** — Jolt has QR code printing for equipment. We have this in Food Labels + Equipment.

### Homebase iPhone App Audit (108 screenshots reviewed)
- [DONE] **Employee earnings view** — Homebase shows employees their pay ($1,076 for pay period). Employees can see earnings details. We need employee self-service earnings view.
- [DONE] **Shift feedback rating** — After each shift, employees rate 1-5 stars "How was your last shift?". Quick morale pulse. Add to clock-out flow.
- [DONE] **Birthday tracking** — Homebase shows birthdays inline in schedule with "Message" button. Add birthday field to employee records + schedule display.
- [ ] **Cover request invitations** — Homebase lets employees request cover, invites 5 eligible employees, tracks reply status (No reply/Claimed). Our trade board needs invitation tracking.
- [ ] **Time clock selfie photos** — Homebase captures selfie at EVERY clock event (in, break start, break end, out). Full photo audit trail on time cards. Our kiosk has camera but may not capture at every event.
- [ ] **Resume/experience export** — Employee profile shows experience history (role, shift count, dates), certifications, education with "Export to PDF". Add to employee profile.
- [ ] **Per-category notification toggles** — Homebase has granular: trade/cover, time off, open shifts, shift start (with lead time), clock events, break reminders, task overdue. Our iOS app needs notification settings screen.
- [DONE] **Daily labor cost bar chart** — Dashboard shows daily labor cost as green bar chart (Fri $690, Sat $615, etc). Add to RC dashboard.
- [DONE] **Shift notes visible on clock-in** — When creating a shift, notes are shown to employee when they clock in. Add to our shift creation + kiosk clock-in.
- [ ] **Group chat reactions + read receipts** — Homebase messaging has photo sharing, thumbs/heart reactions, read receipts (11/36), pins, edited indicator. Our messaging needs these.
- [DONE] **Recognition/Shout outs** — Categories: Great Attitude, Above & Beyond with received/given tabs. We have Recognition in People Hub.
- [DONE] **Employee directory with invite status** — We have People Hub.
- [DONE] **Schedule day view with role colors** — We have Day timeline + Week grid.
- [DONE] **Employee profile with DOB/phone/emergency** — We have employee records in People Hub.

### iPad Kiosk Audit (25 screenshots — Homebase + Jolt + Closeout Sheet)
- [DONE] **PIN per checklist item** — Jolt requires employee PIN before completing each checklist item for accountability tracking. Our kiosk checklists should require PIN to know WHO completed each item.
- [ ] **Schedule view in kiosk** — Homebase kiosk shows Week View (color-coded shift blocks per employee) and Day View (table with employee/hours/role/status). Add schedule tab or integrate into On Shift view.
- [DONE] **Camera photo flow in kiosk checklists** — Jolt kiosk has "Take Photo" button per checklist item, opens iPad camera, Retake/Use Photo flow. Photos attached to completed items. Our kiosk checklists need camera integration.
- [DONE] **Checklist 3-dot action menu** — Jolt has per-item menu: Take photo, Create logbook entry, Clear response. Adds flexibility beyond just checkmark completion.
- [DONE] **Closeout: Lunch SL + Dinner SL sections** — The real closeout spreadsheet has separate Lunch Shift Lead and Dinner Shift Lead sections with different register counts, safe amounts, and variance calculations per shift. Our Mid-Day/EOD split partially covers this but needs shift lead name entry and per-shift register/safe tracking.
- [DONE] **Closeout: Bacon/Bread tossed tracking** — Spreadsheet tracks Bacon Tossed and bread waste (White/Wheat/Rosemary/Minis) daily. Our Mid-Day closeout has waste field but needs specific bacon+bread fields.
- [DONE] **Closeout: Cash vs Variance calculation** — Register cash compared to expected, with variance highlighted in color (green/yellow/red). Add auto-calculation of over/short with color coding.

### Payroll Sheet Integration (Chris directive)
- [DONE] **Payroll processing sheet** — Accounting company uses payroll sheet. Need to understand: bank deposits (default $200 register base), tips entry flow (register tips → added to deposit → bank deposit = base + tips), CC tips + cash tips = total tips. Build as own section in RC with per-pay-period switching, click-to-edit, auto-fill from Flexepos.
- [ ] **Flexepos integration** — Connect to fms.flexepos.com for store sales reports (detail store report). Pull sales data to auto-fill payroll and closeout sheets once admin logs in.
- [DONE] **Tips reconciliation** — Register tips entered at closeout → added to deposit amount (default $200 base). If tips = $39 on $290 deposit, new bank deposit = $329. Compare to actual bank deposit. Track CC tips separately. Total tips = cash + CC for payroll.

### Jolt Reports (from assistant's Chrome deep-dive)
- [DONE] **Completion rate donut chart** — Jolt shows: 93.87% completion, 88.05% on-time, 5.82% late, 6.13% missed. Need donut chart in RC Reports showing these 4 metrics.
- [DONE] **Per-store completion comparison** — Jolt shows: Santa Barbara 95.75%, Buellton 92.68%. Need multi-store checklist completion comparison table.
- [DONE] **Weekly completion trend line** — Chart showing completion % over weeks. Add to RC Reports.
- [DONE] **Save custom reports** — Jolt has "SAVE AS NEW REPORT" for custom filter combos. Add to RC Reports.

### Payroll Sheet (from assistant's analysis)
- [DONE] **Payroll section in RC** — Replicate spreadsheet: Per pay period (biweekly), columns: Name, Hourly Wage, Regular Hours, OT Hours, Tipped Hours, Tips (by role: Manager/SL/Crew), Meal Periods, Rest Breaks, Sick Hours. Sections: Manager ($27-32/hr), AGM ($22/hr), Shift Lead ($20.75/hr), Crew ($20/hr), Trainees (NO TIPS). CC Tips + Cash Tips = Total Tips, Remaining Crew Tips distribution by tipped hours. Click-to-edit cells, switch by pay period, auto-fill from Flexepos.
- [DONE] **Employee profile with DOB/phone/emergency** — We have employee records in People Hub.
- [N/A] **IoT Sensors** — Jolt has gateway+sensor hardware integration. This requires physical hardware — not a software gap.
- [N/A] **Calculator/Temp Probe tools** — Nice-to-have utilities, not core features.

### Vantage Point & Sheets Integration
- [DONE] **VP Weekly Attestation Report** — Already covered by attestation wizard + timeclock compliance
- [DONE] **MASTER Sales Growth Scorecard** — Covered by RT Marketing Directives (Outreach + Scorecard tabs)
- [DONE] **2026 Marketing Calendar** — Covered by RT Marketing Directives Calendar tab
- [DONE] **Monthly Marketing Sheet** — Covered by RT Marketing Directives
- [DONE] **Master closeout** — Covered by RC Daily Closeout (Mid-Day + EOD)
- [DONE] **Store closeout reports (20381 March etc)** — Covered by RC Closeout system
- [DONE] **FSC Request tracker** — Guest recovery for complaints. Per-store: guest name, address, complaint date, card count, reason, date sent. Currently in Google Sheets — needs feature in RC Operations

### RO Tools Web
- [DONE - techy] **3. L10 in RO Control** — DM view showing all ROs' scorecards side by side
  - DM all-stores comparison view built as a tab in Mission Control dashboard with scorecard comparison table, per-store summary cards, to-dos, and IDS panels.
- [DONE] **4. L10 in iOS apps** — add L10 form to both RO Tools and RO Control iOS views
  - Handoff: The L10 page.js has the full CATEGORIES array with all 30 metrics, goals, and evaluate functions. Port this to a SwiftUI view that posts to /api/l10. Add an "L10" tab item to MainTabView in both ro-tools-ios and ro-control-ios.
- [ ] **6. App Store review for RO Tools** — waiting on Apple (24-48 hrs)
  - Handoff: Nothing to do. Check appstoreconnect.apple.com for approval email. Once approved, click "Release this version" to go live. Then enable public TestFlight link.
- [ ] **8. Real device testing** — iPhone USB trust not established
  - Handoff: Use TestFlight instead of USB. Download TestFlight on iPhone, open the public link from App Store Connect → TestFlight → External Testing → JMVG All group.

### iOS Apps
- [ ] **1. RO Control iOS build + publish** — needs Xcode build, archive, App Store listing
  - Handoff: Project at ~/projects/ro-control-ios. Same process as RO Tools: register com.jmvalley.rocontrol bundle ID on developer.apple.com, create App Store Connect listing, run `xcodegen generate`, `xcodebuild archive`, export, Transporter upload. Needs reboot first (8GB RAM maxed).
- [DONE] **7. Font bundling in iOS apps** — Re-added all 13 font names to UIAppFonts in both apps' Info.plist. Simplified xcodegen project.yml to use plain resources path instead of copyFiles. Needs rebuild to verify fonts appear in .app bundle.
- [ ] **5. RO Tools iOS TestFlight** — check external testing review status
  - Handoff: Go to App Store Connect → RO Tools → TestFlight → External Testing → JMVG All group. If approved, enable public link. Share URL with team.

### Mission Control / RO Control Web
- [DONE - manager] **9. Mission Control kiosk** — all 125 tasks checked (118 DONE, rest N/A removed)

> Remaining Apple/Xcode gaps: #1, #5, #6, #8 — no code changes needed, just manual App Store steps.

---

## Launch Prompt Tasks (34 total)

### Phase 1: Database + Data
- [IN PROGRESS] **Task 1:** PostgreSQL migration — abstraction layer + pg driver installed. Full migration pending.
- [DONE] **Task 2:** hierarchy.md complete — 29 stores, 669 employees, 5 DMs
- [DONE] **Task 3:** Auto-provision on first login — email/name matching to Homebase employee data
- [DONE] **Task 4:** Employee dropdown in all 9 RT generators + dual-save

### Phase 2: Reorganization
- [DONE] **Task 5:** L10 removed from RT web + iOS. RC only.
- [DONE] **Task 6:** RC nav: Overview | Dashboard | Operations | L10 | People | Tools | Store Profile | Admin

### Phase 3: Features
- [DONE] **Task 7:** People Hub nav + page stubs (Time Clock, Timesheets, Tips, Employee Docs, Performance Notes, Recognition, Certs, Hiring, Onboarding)
- [DONE] **Task 8:** Kiosk closeout — Mid-Day + End-of-Day forms, PIN auth
- [DONE] **Task 9:** Schedule builder — Homebase-style Week grid + Day timeline + Coverage chart + Add/Edit/Delete modals
- [DONE] **Task 10:** Marketing Directives API routes on RT (proxy to MC)
- [DONE] **Task 11:** L10 inline editing — scorecard, cascading, IDS, TODO
- [DONE] **Task 12:** Reading / Book Log — 15 books, 100+ excerpts, discussion Qs
- [DONE] **Task 13:** Checklists auto-generate (4 AM cron + on-page-load fallback)
- [DONE] **Task 14:** Stability inline editing
- [DONE] **Task 15:** Store Profile Sync API (RT → MC, MC → RT)
- [ ] **Task 16:** Crew PIN login for RC iOS (needs iOS work)
- [DONE] **Task 17:** Feature page stubs wired into nav + loaders

### Phase 4: Quality
- [DONE] **Task 18:** Dark mode — mid-grey on RT + RC web
- [DONE] **Task 19:** Keyboard shortcuts removed
- [DONE] **Task 20:** 879 bare catch {} fixed
- [DONE] **Task 21:** Style verified — all tokens match RT gold standard

### Phase 5-8: Testing + Launch
- [ ] **Task 22-34:** Testing, /welcome rebuild, presentations, icons, screenshots, iOS builds, metadata, final audit

---

## Completed (original gaps)
- [DONE] **2. L10 API backend**
- [DONE] **10. RO Control iOS auth**
