# ROADMAP — Deferred Backlog

Large parity + feature backlogs moved out of `todo.md` so active work stays legible.
Each section is a multi-week initiative; pull items back into `todo.md` when active.

---

## Homebase App Parity — FROM 108 SCREENSHOT REVIEW

### Schedule
- [ ] **Overtime badge** — Yellow "Overtime" badge on shifts where employee exceeds scheduled time. Show on both web + iOS.
- [ ] **Seeking cover badge** — Teal "Seeking cover" badge on shifts posted for coverage. Show in schedule grid.
- [ ] **Birthday events in schedule** — Show employee birthdays as events in the day header with "Message" CTA button.
- [ ] **L10 Review as schedule event** — L10 meetings show as events in the schedule (seen in Buellton screenshots).
- [ ] **Request cover from shift** — 3-dot menu on shift card: "Request cover" + "Trade shift". Opens flow to invite coworkers.
- [ ] **Delete unpublished/all shifts** — Context menu: "Delete unpublished shifts this week" and "Delete all shifts this week".

### Timesheets (Critical — Homebase is very detailed)
- [ ] **Photo & GPS validation on time cards** — CRITICAL GAP. Homebase captures 4 selfie photos per shift: clock-in, break-start, break-end, clock-out. Shows face photos with timestamps. We have none of this. Need camera capture on clock events in kiosk + iOS.
- [ ] **Break penalty hours** — Homebase shows "Break Penalty: 0.00 hour(s)" field. CA compliance for missed/late breaks.
- [ ] **Edit history audit trail** — Homebase shows full timeline: "Clock in: 10:27am on iPad Time Clock, Photo upload: 10:27am, Break started: 3:02pm..." etc. Complete audit log per time card.
- [ ] **Manager notes on time cards** — Expandable "Manager notes (0)" section per time card. Add note capability.
- [ ] **Issues filter on daily review** — Filter by: No show, Auto clock out, Missing clock out, Unscheduled shift, Missed paid/unpaid break, Clock in/out time added. We need these issue types flagged.
- [ ] **Pay period selector tabs** — Week / Pay Period / Month tabs for date range selection. Clean UI.

### Messaging
- [ ] **Team messaging with channels** — Homebase: Entire Team, Opening Crew, Celebration, All Managers, individual DMs. Full chat with photo sharing + emoji reactions. We have basic messaging — need channel-based group chat.
- [ ] **Announcements tab** — Separate from messages. Posts with attachments sent to specific teams/locations. Pin capability.
- [ ] **Pinned messages** — View pinned messages in conversations.
- [ ] **All Attachments & Links browser** — Filter by file type and location.

### Employee Profile
- [ ] **Employee earnings view** — Bar chart: Scheduled vs Actual per day. BEST day highlighted. Per-shift earnings breakdown.
- [ ] **Employee stats dashboard** — Last 30 days: On-time rate %, Average shift rating, Hours/week, Shifts worked, Missed clock-outs, Missed breaks, No-shows.
- [ ] **Shout outs / Recognition with categories** — Received + Given tabs. Categories: Great Attitude, Above & Beyond, Heavy Lifter, Team Player.
- [ ] **Achievement badges** — Hexagonal badge icons with counts. Gamification for milestones.
- [ ] **Resume section in profile** — Experience, Certifications, Education, Export to PDF.
- [ ] **Store PIN displayed in More tab** — Large prominent PIN number for each location.

### Team Management
- [ ] **Employee invite status tracking** — "Signed in", "Invited X days ago", "Needs Invite" status per employee.
- [ ] **Quick contact actions** — Call + Message + Shout out icon buttons on employee list cards.
- [ ] **Tax classification on add employee** — W-2, 1099 Individual, 1099 Business. Determines onboarding packet type.
- [ ] **Onboarding invite options** — New Hire Packet / App invite / Nothing. Three choices when adding employee.
- [ ] **Terminate team member button** — Red "Terminate team member" CTA with "Termination details" link.
- [ ] **Add from contacts** — Import employee from device contacts.

### Settings & Config
- [ ] **Calendar sync** — Sync 2 months of shifts to device calendar (iOS Calendar integration).
- [ ] **Geofence for mobile clock-in** — Map view with store location pin. GPS radius enforcement.
- [ ] **Granular notification preferences** — 9 notification types each with Email/Push/Text toggles.
- [ ] **MFA toggle** — Multi-factor authentication enable/disable in security settings.

---

## Schedule Builder — Homebase Parity (P0)
- [ ] **Day view timeline** — horizontal shift bars on hourly timeline (7am-10pm), employees on left
- [ ] **Per-hour coverage bars** — headcount visualization showing staffing per hour
- [ ] **Open Shifts row** — top of grid, shows unclaimed shifts with pending approval
- [ ] **Availability + Time-off blocks** — visible in day cells, grayed unavailable slots
- [ ] **Schedule Viewed/Not Viewed** — status badge per employee
- [ ] **Multi-location shifts** — grayed out with location name when employee works at other stores
- [ ] **Print in 3 formats** — white bg, full color, colored borders
- [ ] **Publish with notifications** — notify everyone, custom selection, notification preferences
- [x] **Weather in day headers** — DONE
- [x] **position_id optional** — DONE

---

## Jolt Parity — Checklists & Food Safety

### Checklists (Jolt "Lists")
- [ ] **Photo evidence per checklist item** — CRITICAL. Camera capture + photo storage per item on web and iOS kiosk.
- [ ] **Checklist scoring (1-5 per item)** — Numeric score badge per completed item.
- [ ] **Checklist history with date presets** — Today, Yesterday, Last 7 Days, Custom range.
- [ ] **Checklist metadata display** — Displayed date, Due by time, Expires time.
- [ ] **Submit Items button** — Green CTA at bottom of checklist.
- [x] **Checklist auto-generation by shift** — COVERED

### Attestation System
- [ ] **Multi-question attestation flow** — meal period, rest breaks, time accuracy, injury, expenses → YES/NO → canvas signature → photo.
- [ ] **Canvas signature on attestation** — hand-drawn signature.
- [ ] **Employee photo capture on attestation** — selfie after signature.
- [ ] **Full CA labor law attestation text** — meal period §512, rest breaks, time accuracy, injury reporting, expenses.

### Information Library
- [ ] **Document/media library** — Folder-based library: LTO Subs, Deep Cleaning Videos, Food Safety Booklet, GM training videos, Operational Guides.
- [ ] **Add media: photo/video/library upload** — Knowledge Base photo+video upload.
- [ ] **Star/favorite content** — Starred items.

### Logbook
- [x] **Manager Log** — COVERED
- [ ] **Logbook filtering** — Date Range + Flag Status + Read Status filters.
- [ ] **Flag/resolve entries** — Flag + resolve capability.

### Labels & Printing
- [x] **Food label templates** — COVERED
- [ ] **Bluetooth/network printer discovery** — iOS app AirPrint or direct printer.
- [ ] **QR code for clock-in** — Location QR with 24hr expiry.

### Sensors / Temperature
- [ ] **IoT temperature sensor management** — Hardware-dependent, may defer indefinitely.
- [x] **Temperature logging with anomaly alerts** — COVERED

### Tools
- [x] **Weather** — COVERED
- [ ] **Built-in calculator** — Add to RC iOS kiosk tools.
- [x] **QR codes** — COVERED
- [ ] **Temperature probe integration** — Hardware-dependent.

### Settings / Config
- [ ] **Scheduling notification preferences** — Push/Email/Text toggles.
- [ ] **Multi-location switcher** — Single-tap location switching.
- [ ] **Device diagnostic report** — Low priority.
- [ ] **QR clock-in code** — Store-specific QR with 24hr expiry.

---

## Kiosk iPad Parity

### Homebase Kiosk Features
- [ ] **Color-coded weekly schedule in kiosk** — Full weekly grid with color-coded shift blocks.
- [ ] **Week View + Day View toggle**
- [ ] **Hours Scheduled counter** — Top-right "201.75 HOURS SCHEDULED" visibility.
- [ ] **Employee avatar on clock-in** — Personalized greeting with employee photo.
- [ ] **Camera on clock-in** — Employee photo during clock events.

### Jolt Kiosk Features
- [ ] **Per-item PIN auth** — CRITICAL. PIN entry to mark EACH checklist item complete.
- [ ] **3-dot menu per checklist item** — Take photo, Create logbook entry, Clear response.
- [ ] **Checklist search** — Search bar across all available lists.
- [ ] **Rich sidebar nav in kiosk** — Full sidebar vs our 5 tabs.
- [ ] **Shared device setup** — Personal/Shared device choice.
- [ ] **Cloud sync progress** — Setup progress bar.

### Closeout Sheet Improvements
- [ ] **Combined mid-day + EOD on one view** — Color-coded cells (green/yellow/red).
- [ ] **Borrowed + FSC columns in daily report**
- [ ] **Color-coded performance cells** — Green/Yellow/Red for labor %, variance.
- [ ] **Register variance tracking** — Day Count ($200 default), Night Crew, Variance auto-calc.

---

## Payroll & Reports

### Jolt Reports
- [ ] **Item Completion Report** — Completion Rate donut chart, Group by Location table with Complete/On-Time/Late/Missed percentages.
- [ ] **Full Jolt report types to match** — Calendar, Daily Temperature, Grid View, Item Completion, List Completion, List Flags, List Time, Probe, Score.

### Homebase Reports
- [ ] **Reports Overview dashboard** — Scheduled vs Actual Hours, Hours by Role pie, Yesterday Hours vs Sales overlay, On-Time Rate donut.
- [ ] **Report sections to match** — Scheduled vs Actual Hours, Clock-Ins, On-Time Arrival, Shift Feedback, Hourly Labor Costs, Labor By Role, Labor Cost Summary, Sales Summary, Departments, Certificates.
- [ ] **On-time percentage with settable ranges** — Configurable on-time thresholds.

### Payroll System (NEW)
- [ ] **Payroll sheet replication** — Per-store tabs with pay period columns. Employee rows, hours worked, tips (cash + CC), deposits, calculations. Click-to-edit.
- [ ] **Closeout → Payroll flow** — Bank deposit from register + tips. Compare entered deposits to actual. CC tips from FlexePOS + cash tips from register.
- [ ] **FlexePOS integration** — Auto-pull sales, tip, transaction data from fms.flexepos.com. Auto-fill payroll sheet.
- [ ] **Payroll belongs on RO Control** — Operations dropdown. Manager/admin functionality, not RO Tools.

---

## Vantage Point Reports
- [ ] **Search Gmail** — find all Vantage Point daily/weekly/monthly reports
- [ ] **Replicate report formats** — daily sales, weekly summary, monthly P&L in Reports tab
- [ ] **Marketing calendars** — check Google Sheets, replicate in Marketing tab
- [ ] **EBITDA goals** — check Google Sheets for monthly goals, add to L10 or Reports
- [ ] **Growth goal sheets** — replicate in appropriate dashboard section

---

## Cross-Project MC / RC Feature Verifications
(Owned by Mission Control repo — tracked here because RT todo.md was the shared tracker)

- [ ] **People Hub pages** — verify 10 sections have full UI: Time Clock, Timesheets, Tips, Employee Docs, Performance Notes, Recognition, Certifications, Hiring, Onboarding, HR Forms
- [ ] **Schedule Builder** — verify visual blocks, color-coding, coverage heatmap, drag-drop, labor budget
- [ ] **Checklists auto-generate** — verify no manual button, time-based generation
- [ ] **L10 inline editing** — verify click-to-edit on scorecard, cascading, IDS, TODO
- [ ] **Stability Snapshots** — verify data imported, inline editing, L10 auto-calc
- [ ] **Kiosk 5 tabs** — verify Clock, On Shift, Checklists, Mid-Day Closeout, End-of-Day Closeout
- [ ] **Closeout forms** — verify identical in kiosk + web + iOS
- [ ] **Employee dropdowns** — verify all 9 generators have searchable dropdown with real Homebase data
- [ ] **Dark mode** — verify toggle works on all 4 platforms, mid-grey palette consistent
- [ ] **Auto-setup** — verify @jmvalley.com login auto-fills profile from Homebase data (RT setup currently uses static hierarchy — upgrade to Homebase pull)
- [ ] **Crew PIN login** — verify schedule first tab, swaps, time off, availability
- [ ] **MC → RT profile sync (reverse direction)** — RT→MC is wired, verify MC→RT push

---

## iOS Apps — Missing Features
- [ ] **RC iOS kiosk closeout** — MISSING: MidDayCloseoutView.swift + EndOfDayCloseoutView.swift (3 of 5 kiosk tabs exist)
- [x] **iOS dark mode adaptive colors** — DONE
- [ ] **RT iOS: 5 new generators** — Food Labels, Work Orders, Manager Log, DM Walk-Throughs, Onboarding Packets need iOS views

---

## Data Verification (needs DB/live data access)
- [ ] **hierarchy.md** — verify all 29+ stores, 5 DMs, all ROs correct
- [ ] **669 employees imported** — verify in employee dropdowns
- [ ] **PostgreSQL** — verify all systems work (or SQLite with GCS backup if PG not yet deployed)
- [ ] **GCS file storage** — verify PDFs and docs persist across deploys

---

## Google Sheets / Docs — Still To Pull
- [ ] **Bonus charts/sheets** — Search for bonus-specific sheets from josh@, bethany@, brittany@jmvalley
- [ ] **Monthly EBITDA goals** — Check if growth goal sheets exist, add to L10 or Reports if found
