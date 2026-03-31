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

> **Note:** The only remaining gaps are #1 (RO Control iOS build), #5 (TestFlight review), #6 (App Store review), and #8 (real device testing) — all waiting on Apple/Xcode, no code changes needed.

---

## Completed
- [DONE] **2. L10 API backend** — POST/GET /api/l10 with server-side JSON persistence on GCS volume. DM view via ?all=true parameter. Page updated to use API with localStorage fallback.
- [DONE] **10. RO Control iOS auth** — MC uses JWT username/password not OAuth. AuthManager updated with login(username, password). LoginView has text fields. Matches backend.
