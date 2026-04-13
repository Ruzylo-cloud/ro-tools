# TODO — Active Work

Big parity backlogs (Homebase, Jolt, Schedule Builder, Payroll, Vantage Point,
MC/RC cross-project verifications, data verifications) live in **ROADMAP.md**.
This file tracks only currently active + imminent work.

---

## Apple / Manual Steps (Chris — iOS session tonight)
- [ ] **Register com.jmvalley.rocontrol** — developer.apple.com → Identifiers → Add → iOS, Explicit, Push Notifications
- [ ] **Create RO Control App Store Connect listing** — New App → RO Control → com.jmvalley.rocontrol → SKU: rocontrol
- [ ] **Upload RO Tools IPA via Transporter** — IPA at ~/projects/ro-tools-ios/build/appstore/RO Tools.ipa
- [ ] **Upload RO Control IPA via Transporter** — after bundle ID registered, export IPA then upload
- [ ] **Check RO Tools App Store review** — appstoreconnect.apple.com → may already be approved
- [ ] **Enable TestFlight public link** — both apps → External Testing → JMVG All → Enable Public Link
- [ ] **Test both apps on iPhone via TestFlight** — download TestFlight, open public link, install
- [ ] **RO Control iOS needs export** — archive succeeded, export fails until bundle ID registered

---

## Active Code Fixes
- [ ] **RO Tools mobile login still broken** — intermediate session page deployed but untested. Verify on iPhone after Cloud Build deploy completes.

---

## Recently Verified / Completed (audit sweep)
- [x] **RO Control JWT_SECRET** — set as env var on Cloud Run
- [x] **CrewLoginView.swift compile fix** — file refactored to shared input components (ca2d70b), pushed
- [x] **iOS dark mode adaptive colors** — both Colors.swift files use `_adaptive()` helper with light/dark variants (02b3742 + 4286d37)
- [x] **Quick Tour first-login flow** — QuickTour.js checks server `profile.tourCompleted` + localStorage, Skip + Next, router navigation
- [x] **Marketing Directives** — /dashboard/directives has 6 tabs (overview, directives, outreach, scorecard, calendar, history)
- [x] **Reading / Book Log** — /dashboard/reading 2074 lines, 137 book refs, Audible + Amazon links, per-book content
- [x] **Store Profile RT → MC sync** — POST /api/profile/sync wired with 5s timeout, best-effort non-blocking
- [x] **/welcome page** — Tools & Analytics + Store Operations sections added
- [x] **Page titles** — PAGE_TITLES covers all static /dashboard routes; dynamic-route fallbacks for catering-tracker/order/* and packing-slip (78f2c1d)
- [x] **CSS token mismatches** — rc-nav-user hardcodes replaced with var(--charcoal)
- [x] **Command palette** — L10, Stability, Closeout, People Hub sections, Knowledge Base, AMEX, Store Profile, Messaging added
- [x] **FSC Tracker** — built at /dashboard/fsc-tracker + /api/fsc (d77e14f)
- [x] **Marketing report calendars / Sales Growth Scorecard / Weekly scoreboard / VP attestation / ezCater growth / Master closeout** — all covered

---

## Session Notes
- See `ROADMAP.md` for deferred backlogs (Homebase, Jolt, Schedule Builder, Payroll, VP, MC/RC cross-project items, data verifications).
- iOS builds and TestFlight work deferred to evening session.
- Machine is 4-core 8GB — avoid local `npm run build`; Cloud Build handles deploys on push.
