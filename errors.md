# Error Tracker — All Projects

## Instructions
- Log every error, bug, warning you find
- Fix OPEN errors in your area before starting new work
- Never delete errors — mark FIXED with details
- Goal: ZERO open errors

---

## Open Errors

### [WARNING] iOS font files not bundled in simulator build
- **Found by:** techy
- **Date:** 2026-03-28
- **Location:** ro-tools-ios, ro-control-ios — ROTools/Resources/Fonts/
- **Description:** 13 .ttf font files exist in Resources/Fonts/ and are listed in UIAppFonts in Info.plist, but the simulator build doesn't include them in the .app bundle. App falls back to system fonts. xcodegen project.yml was updated to use plain resources path but needs rebuild to verify.
- **Status:** FIXING
- **Fix details:** UIAppFonts re-added to Info.plist in both apps. project.yml simplified. Needs Xcode rebuild to confirm fonts appear in bundle.

### [WARNING] RO Control iOS not yet built or archived
- **Found by:** techy
- **Date:** 2026-03-30
- **Location:** ~/projects/ro-control-ios
- **Description:** Project scaffolded (26 files) but never compiled with Xcode. No .xcodeproj generated yet (needs xcodegen). No archive, no IPA, no App Store listing. Blocked on RAM — needs reboot.
- **Status:** OPEN

### [WARNING] Mission Control kiosk — ~50 unclaimed tasks
- **Found by:** techy
- **Date:** 2026-03-30
- **Location:** Mission Control PLAN-IPAD-KIOSK.md
- **Description:** Phases 2-7 have ~50 unclaimed tasks including PIN pad UI, employee management, checklists, offline/PWA, integrations, security. Other agents are working on some but many remain.
- **Status:** FIXED
- **Fixed by:** manager + jarvis + session-main + assistant
- **Fix details:** All 125 kiosk tasks completed (118 DONE, 7 N/A removed — native systems replaced Homebase/Jolt integrations)

---

## Fixed Errors

### [BUG] @MainActor singleton deadlock on iOS app launch
- **Found by:** techy
- **Date:** 2026-03-28
- **Location:** ro-tools-ios ROToolsApp.swift
- **Description:** Using @StateObject with static let shared singletons on @MainActor classes caused a deadlock. App showed black screen on launch.
- **Status:** FIXED
- **Fixed by:** techy
- **Fix details:** Replaced singletons with AppState container class. All managers created in AppState.init() without static shared pattern.

### [BUG] Xcode project format too new for Xcode 15
- **Found by:** techy
- **Date:** 2026-03-28
- **Location:** ro-tools-ios ROTools.xcodeproj
- **Description:** xcodegen 2.45.3 generated objectVersion 77 which Xcode 15.4 couldn't read.
- **Status:** FIXED
- **Fixed by:** techy
- **Fix details:** sed objectVersion 77 → 56. Later upgraded to Xcode 16 which resolved permanently.

### [BUG] App Store upload rejected — missing UILaunchScreen + iPad orientations
- **Found by:** techy
- **Date:** 2026-03-28
- **Location:** ro-tools-ios Info.plist
- **Description:** Transporter rejected IPA: missing UILaunchScreen key and UISupportedInterfaceOrientations for iPad multitasking.
- **Status:** FIXED
- **Fixed by:** techy
- **Fix details:** Added UILaunchScreen dict and full UISupportedInterfaceOrientations array to Info.plist.

### [BUG] Mission Control dropdowns using wrong border-radius
- **Found by:** techy
- **Date:** 2026-03-28
- **Location:** Mission Control dashCss.ts
- **Description:** Dropdowns had border-radius 0 0 8px 8px (bottom only) and min-width 160px. Should be 12px full round, 260px width.
- **Status:** FIXED
- **Fixed by:** techy
- **Fix details:** Updated to border-radius 12px, min-width 260px, padding 6px, item radius 8px, dropdownIn animation.

### [BUG] RO Control iOS tried Google OAuth but MC uses JWT
- **Found by:** techy
- **Date:** 2026-03-30
- **Location:** ro-control-ios AuthManager.swift, LoginView.swift
- **Description:** AuthManager had signInWithGoogle() using ASWebAuthenticationSession but Mission Control backend uses username/password JWT auth, not Google OAuth.
- **Status:** FIXED
- **Fixed by:** techy
- **Fix details:** Replaced with login(username, password) that POSTs to /api/auth/login. LoginView updated with text fields instead of Google SSO button.

### [BUG] Training packet write-on lines using underscore characters
- **Found by:** chris (user)
- **Date:** 2026-03-27
- **Location:** All training packet components in src/components/documents/
- **Description:** Write-on fields used ______ text characters instead of solid HTML lines. Should be borderBottom spans.
- **Status:** FIXED
- **Fixed by:** techy + agents
- **Fix details:** All underscore patterns replaced with borderBottom: 1px solid #2D2D2D spans across all 7 packets + Orientation.
