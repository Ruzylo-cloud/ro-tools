# DEEP DIVE AUDIT — Final Quality Pass Before Launch

> **Goal:** After this session, the ONLY remaining work is: (1) human visual review, (2) iOS app builds, (3) App Store uploads.
> **Method:** 5 agents working in parallel with unanimous consensus (5/5) via comm bus port 3001.
> **Standard:** Enterprise quality. $100M franchise. Every pixel, every page, every file.

---

## AGENT ASSIGNMENTS

| Agent | Domain | Primary Repo | Vote On |
|-------|--------|-------------|---------|
| **Techy** | RO Tools web + iOS | Ro-Tools, ro-tools-ios | All RT pages, RT dark mode, RT generators |
| **Tool** | RO Tools web + iOS (second pair of eyes) | Ro-Tools, ro-tools-ios | All RT pages, cross-platform sync |
| **Manager** | RO Control web + Mission Control | mission-control | All RC pages, RC dark mode, RC nav |
| **Jarvis** | RO Control web + iOS | mission-control, ro-control-ios | All RC pages, kiosk, L10 |
| **Assistant** | Cross-platform verification | Both repos | Symmetry, branding, consistency |

---

## MANDATORY PROTOCOL

### Before ANY work:
1. `git pull origin main` on ALL repos you touch
2. Read ALL .md files in your assigned repo root (CLAUDE.md, GAPS.md, todo.md, quality.md, errors.md, matchingstyle.md, FEATURES.md, proposals.md, hierarchy.md)
3. Read ALL session .md files (claude/*.md, memory files)
4. Register on comm bus: `curl -sf -X POST http://127.0.0.1:3001/events -H "Content-Type: application/json" -d '{"type":"SESSION_START","from_session":"<YOUR_NAME>","payload":{"role":"<role>","status":"reading-all-files"}}'`

### Consensus Protocol (STRICT):
1. Agent completes a task → publishes `TASK_COMPLETE` event with findings
2. All 4 other agents must vote `AGREE` or `DISAGREE` via comm bus events
3. If ANY agent disagrees → `TASK_REJECTED` → proposer fixes → ALL votes reset → re-vote
4. Only 5/5 `AGREE` marks the task as DONE
5. No agent moves to the next task until the current one has 5/5

### Event format:
```json
{"type":"AUDIT_VOTE","from_session":"<name>","payload":{"task":"<task-id>","vote":"AGREE|DISAGREE","reason":"...","details":"..."}}
```

### After EVERY fix:
1. `npm run build` (RT) or `npx tsc --noEmit` (MC) — must pass
2. `git add` → `git commit` → `git push origin main` — immediately
3. Open Chrome and visually verify the fix on the live site

---

## PHASE 1: READ EVERYTHING (All 5 agents, parallel)

Every agent reads ALL of these files before starting ANY audit work:

### RO Tools (Ro-Tools/)
- CLAUDE.md, GAPS.md, todo.md, quality.md, errors.md
- matchingstyle.md, FEATURES.md, proposals.md, hierarchy.md
- PRESENTATION.md, memory.md
- Every file in src/app/ (all pages, all APIs)
- Every file in src/components/ (all components)
- Every file in src/lib/ (all utilities)
- globals.css (all CSS variables, dark mode)
- package.json (dependencies)

### Mission Control (mission-control/)
- CLAUDE.md, PLAN.md, gaps.md, todo.md, TODOS.md, features.md
- claude/RULES.md, claude/PLAN.md, claude/context.md
- claude/todo-*.md (all session todos)
- claude/changelog.md, claude/SESSION_STARTUP_PROMPT.md
- SESSION-PROMPTS.md
- src/ui/dashCss.ts (ALL CSS)
- src/ui/dashBody.ts (ALL HTML)
- src/ui/dashJs.ts + src/ui/js/*.ts (ALL client JS)
- src/ui/kioskBody.ts, src/ui/kioskJs.ts, src/ui/kioskCss.ts
- src/routes/*.ts (ALL API routes)
- src/services/*.ts (ALL services)

### iOS Apps
- ro-tools-ios/ — project.yml, all Swift files
- ro-control-ios/ — project.yml, all Swift files
- Both: Colors.swift, Fonts.swift, ViewStyles.swift (must be IDENTICAL)

### Publish when done:
```json
{"type":"PHASE_COMPLETE","from_session":"<name>","payload":{"phase":"1-read","findings":"<summary of what you found>"}}
```

---

## PHASE 2: VISUAL AUDIT — Every Page, Both Sites (Chrome required)

### RO Tools (ro-tools.app) — Pages to verify:
1. Landing page (/) — light + dark
2. Dashboard (/dashboard) — light + dark
3. Setup (/dashboard/setup) — light + dark
4. Generators listing (/dashboard/generators) — light + dark
5. Each of 17 generators — light + dark (34 checks)
6. Training documents (/dashboard/documents) — light + dark
7. Catering tracker (/dashboard/catering-tracker) — light + dark
8. Scoreboard (/dashboard/scoreboard) — light + dark
9. Directives (/dashboard/directives) — light + dark
10. Reading (/dashboard/reading) — light + dark
11. Store Profile (/dashboard/profile) — light + dark
12. Support (/dashboard/support) — light + dark
13. Admin (/dashboard/admin) — light + dark
14. Updates (/dashboard/updates) — light + dark
15. History (/dashboard/history) — light + dark
16. Demo (/demo) — light + dark
17. Presentation (/presentation) — light + dark
18. Mobile responsive (375px width) — all pages

### RO Control (ro-control.app) — Pages to verify:
1. Login page — light + dark
2. Dashboard/Overview — light + dark
3. Operations dropdown pages (Tasks, Schedule, Checklists, Messaging, Closeout, Stability, Expenses) — light + dark
4. L10 dropdown pages (Scorecard, Cascading, IDS) — light + dark
5. People dropdown pages (Time Clock, Timesheets, Tips, Employee Docs, Performance, Recognition, Certs, Hiring, Onboarding, HR Forms) — light + dark
6. Tools dropdown pages (Jarvis, Reports, Knowledge Base, Automations) — light + dark
7. Store Profile — light + dark
8. Admin panel — light + dark
9. Kiosk (/kiosk) — light + dark (if applicable)
10. Welcome (/welcome) — light + dark
11. Mobile responsive (375px width) — all pages

### For EACH page, verify:
- [ ] Colors match RT gold standard (--jm-blue #134A7C, --jm-red #EE3227, etc.)
- [ ] Typography: DM Sans body, Playfair Display headings
- [ ] Card radius: 14px
- [ ] Card padding: 28px 22px
- [ ] Navbar: 64px height, white bg, sticky
- [ ] Dropdowns: 12px radius, 260px min-width, 6px padding
- [ ] Buttons: correct colors, padding, radius
- [ ] Focus states: 2px solid #134A7C, offset 2px
- [ ] Red scrollbar, red overscroll
- [ ] No horizontal overflow on mobile
- [ ] Loading states (spinners, not blank)
- [ ] Error states (friendly messages, not raw errors)
- [ ] Empty states (helpful text, not blank space)
- [ ] Dark mode: mid-grey palette (#1e1e24 bg, #2a2a36 cards)
- [ ] Dark mode: brand colors adjusted for contrast
- [ ] Dark mode: no white text on white bg, no black text on dark bg
- [ ] No console errors
- [ ] No broken images or 404s

### Publish findings per page:
```json
{"type":"PAGE_AUDIT","from_session":"<name>","payload":{"site":"rt|rc","page":"/path","mode":"light|dark","status":"PASS|FAIL","issues":["issue1","issue2"]}}
```

---

## PHASE 3: CODE AUDIT — Every File

### Code quality checks:
- [ ] No bare catch blocks (search: `catch {` or `catch(e) {}` with empty body)
- [ ] No console.log in production (keep only structured logging)
- [ ] No TODO/FIXME/HACK/TEMP/XXX comments left
- [ ] No unused imports
- [ ] No hardcoded credentials
- [ ] All API routes have error handling
- [ ] All forms have input validation
- [ ] All async calls have error handling
- [ ] No memory leaks (setInterval without clear, addEventListener without remove)
- [ ] All images properly sized
- [ ] Bundle sizes reasonable

### CSS symmetry checks:
- [ ] All CSS variables in globals.css match dashCss.ts tokens
- [ ] All component styles use variables, not hardcoded colors
- [ ] Dark mode variables complete in both repos
- [ ] Scrollbar styling identical
- [ ] Overscroll styling identical
- [ ] Modal styling identical
- [ ] Input focus styling identical

### iOS code checks:
- [ ] Colors.swift identical in both apps
- [ ] Fonts.swift identical in both apps
- [ ] ViewStyles.swift identical in both apps
- [ ] All views compile without warnings
- [ ] Tab bar structure matches approved proposal v2

---

## PHASE 4: FUNCTIONAL VERIFICATION

### Authentication:
- [ ] RT: Google OAuth login works on desktop Chrome
- [ ] RT: Google OAuth login works on mobile Safari (ITP fix)
- [ ] RT: Session persists across page refreshes
- [ ] RT: Logout clears session completely
- [ ] RC: JWT login works
- [ ] RC: Google SSO login works
- [ ] RC: Session survives Cloud Run cold starts (JWT_SECRET persistent)
- [ ] RC: Auto-setup matches Homebase employee data

### Generators (all 17 on RT):
- [ ] Each generator form loads with store info pre-filled
- [ ] Each generator has EmployeeSelect dropdown with real data
- [ ] Each PDF downloads correctly (letter size, branded)
- [ ] Each PDF has JMVG logo, red bar, blue dividers, confidential footer
- [ ] Each generator logs activity
- [ ] Dual-save to employee file works (for employee-related generators)

### Data:
- [ ] 669 employees visible in dropdowns
- [ ] 29 stores in hierarchy
- [ ] Scoreboard data loads (12 weeks)
- [ ] L10 metrics (30) with correct goals
- [ ] Store profiles sync between RT and RC

### Cross-platform:
- [ ] Document generated on RT → visible in RC Employee Docs
- [ ] Profile edited on RT → reflected on RC
- [ ] Same employee data on both platforms

---

## PHASE 5: FIX ALL REMAINING ITEMS

After Phases 1-4, all issues are cataloged. Fix in priority order:
1. **Blocking bugs** (anything that prevents core functionality)
2. **Visual mismatches** (anything that breaks symmetry)
3. **Dark mode gaps** (incomplete dark mode styling)
4. **Empty states** (blank pages or sections)
5. **Quality items** (from quality.md)
6. **Todo items** (from todo.md)
7. **Gap items** (from GAPS.md)

Each fix: build → commit → push → verify on live site → vote.

---

## PHASE 6: FINAL SIGN-OFF

All 5 agents must vote AGREE on the final state:

```json
{"type":"FINAL_SIGNOFF","from_session":"<name>","payload":{"vote":"AGREE","rt_web":"PASS","rc_web":"PASS","rt_ios":"READY_FOR_BUILD","rc_ios":"READY_FOR_BUILD","dark_mode":"PASS","symmetry":"PASS","confidence":"100%"}}
```

Only when all 5 sign off is the audit complete.

---

## SUCCESS CRITERIA

After this audit, the following must be true:
- [ ] Zero items in errors.md marked OPEN
- [ ] Zero unchecked items in matchingstyle.md
- [ ] Zero items in quality.md unchecked
- [ ] Zero items in todo.md unchecked (except Apple manual steps)
- [ ] All active gaps in GAPS.md resolved (except Apple manual steps)
- [ ] FEATURES.md complete and accurate for both platforms
- [ ] Both websites load with zero console errors
- [ ] Both websites render correctly on mobile (375px)
- [ ] Dark mode works on both websites (pixel-perfect mid-grey palette)
- [ ] Both iOS apps compile without errors
- [ ] Both iOS apps have identical styling (Colors, Fonts, ViewStyles)
- [ ] All 17 generators work and produce correct PDFs
- [ ] Login works on both platforms (desktop + mobile)
- [ ] All data loads correctly (employees, stores, scoreboard, L10)
