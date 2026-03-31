# RO Tools Ecosystem — Gap Tracker

## Instructions
- `[ ]` = unclaimed
- `[IN PROGRESS - techy]` = claimed, being worked on
- `[DONE]` = complete and pushed

---

## Active Gaps

### RO Tools Web
- [ ] **3. L10 in RO Control** — DM view showing all ROs' scorecards side by side
  - Handoff: RO Tools API has `GET /api/l10?week=13&all=true` for DM view. Need to build a tab in Mission Control dashboard that calls this endpoint and renders a table of all ROs with their grades, color-coded metrics. Each RO row expandable to show full scorecard.
- [ ] **4. L10 in iOS apps** — add L10 form to both RO Tools and RO Control iOS views
  - Handoff: The L10 page.js has the full CATEGORIES array with all 30 metrics, goals, and evaluate functions. Port this to a SwiftUI view that posts to /api/l10. Add an "L10" tab item to MainTabView in both ro-tools-ios and ro-control-ios.
- [ ] **6. App Store review for RO Tools** — waiting on Apple (24-48 hrs)
  - Handoff: Nothing to do. Check appstoreconnect.apple.com for approval email. Once approved, click "Release this version" to go live. Then enable public TestFlight link.
- [ ] **8. Real device testing** — iPhone USB trust not established
  - Handoff: Use TestFlight instead of USB. Download TestFlight on iPhone, open the public link from App Store Connect → TestFlight → External Testing → JMVG All group.

### iOS Apps
- [ ] **1. RO Control iOS build + publish** — needs Xcode build, archive, App Store listing
  - Handoff: Project at ~/projects/ro-control-ios. Same process as RO Tools: register com.jmvalley.rocontrol bundle ID on developer.apple.com, create App Store Connect listing, run `xcodegen generate`, `xcodebuild archive`, export, Transporter upload. Needs reboot first (8GB RAM maxed).
- [ ] **7. Font bundling in iOS apps** — .ttf files exist but not loading
  - Handoff: Fonts are in ROTools/Resources/Fonts/ (13 files). The xcodegen project.yml excludes **/*.ttf from sources but includes Fonts dir as resources. The issue is UIAppFonts in Info.plist was emptied to fix a crash. Need to: (1) re-add font names to UIAppFonts array, (2) verify fonts are in the built .app bundle, (3) test that .custom() font calls resolve.
- [ ] **5. RO Tools iOS TestFlight** — check external testing review status
  - Handoff: Go to App Store Connect → RO Tools → TestFlight → External Testing → JMVG All group. If approved, enable public link. Share URL with team.

### Mission Control / RO Control Web
- [ ] **9. Mission Control kiosk** — 70+ task plan, ~50 unclaimed tasks
  - Handoff: PLAN-IPAD-KIOSK.md in Mission Control repo has full task list. Phase 1 (routes, HTML, CSS, JS) mostly done by session-main. Phase 2 (clock system, DB, APIs) done by jarvis. Remaining: Phase 2 PIN pad UI, employee management, Phase 3 checklists, Phase 4 kiosk chrome, Phase 5 offline/PWA, Phase 6 integrations, Phase 7 security. CSS is aligned to RO Tools.

---

## Completed
- [DONE] **2. L10 API backend** — POST/GET /api/l10 with server-side JSON persistence on GCS volume. DM view via ?all=true parameter. Page updated to use API with localStorage fallback.
- [DONE] **10. RO Control iOS auth** — MC uses JWT username/password not OAuth. AuthManager updated with login(username, password). LoginView has text fields. Matches backend.
