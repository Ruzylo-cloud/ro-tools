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
- [ ] **iPhone smoke test: mobile login** — open ro-tools.app in Safari, sign in with Google, verify redirect lands on /dashboard with ro_session cookie set (intermediate session page flow)

---

## Active Code Fixes

### Notifications opt-in UI (follow-up to 2026-04-13 force-disable)
Server-side enforcement landed this session — every profile's
`notificationPrefs` is force-reset to `{email:false, notifications:false, sms:false, optedInAt:null}`
on first server boot (see `instrumentation.js` → `forceDisableAllProfiles`), and `/api/email`
now blocks any recipient whose profile hasn't explicitly opted in. The
user-facing UI is still TODO:

- [ ] **Profile settings toggle** — add a "Notifications" section to
  `/dashboard/profile` with three switches (Email / In-App / SMS) bound
  to `GET/PUT /api/profile/notification-prefs`. Default all off, show
  "You are not currently receiving any notifications" when `optedInAt` is null.
- [ ] **First-login prompt** — optional lightweight banner/modal on the
  dashboard the first time a user lands after the force-reset, explaining
  the opt-in model and linking to the Profile settings page. Dismissible;
  never shown again once dismissed or once any channel is enabled.

---

## Session Notes
- See `ROADMAP.md` for deferred backlogs (Homebase, Jolt, Schedule Builder, Payroll, VP, MC/RC cross-project items, data verifications).
- iOS builds and TestFlight work deferred to evening session.
- Machine is 4-core 8GB — avoid local `npm run build`; Cloud Build handles deploys on push.
