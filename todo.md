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
- _(none — see ROADMAP.md for deferred items)_

---

## Session Notes
- See `ROADMAP.md` for deferred backlogs (Homebase, Jolt, Schedule Builder, Payroll, VP, MC/RC cross-project items, data verifications).
- iOS builds and TestFlight work deferred to evening session.
- Machine is 4-core 8GB — avoid local `npm run build`; Cloud Build handles deploys on push.
