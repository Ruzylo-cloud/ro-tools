# RO Tools Ecosystem — Gap Tracker

## Instructions
- `[ ]` = unclaimed
- `[IN PROGRESS - techy]` = claimed, being worked on
- `[DONE]` = complete and pushed

---

## Active Gaps

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
- [IN PROGRESS] **Task 9:** Schedule builder — Homebase-style visual blocks (another session)
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
