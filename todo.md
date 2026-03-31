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

## Data Verification
- [ ] **hierarchy.md** — verify all 29+ stores, 5 DMs, all ROs correct
- [ ] **669 employees imported** — verify in employee dropdowns
- [ ] **PostgreSQL** — verify all systems work (or SQLite with GCS backup if PG not yet deployed)
- [ ] **GCS file storage** — verify PDFs and docs persist across deploys
