# Quality Fixes — Non-blocking but Important

## Code Quality
- [x] **Bare catch blocks** — RT verified clean (2 intentional: window.print + localStorage). No changes needed.
- [ ] **Dead code cleanup** — search `grep -rn "TODO\|FIXME\|HACK\|TEMP\|XXX" src/` in MC repo. Resolve all.
- [ ] **Unused imports** — run tsc --noUnusedLocals on MC. Fix warnings.
- [x] **Console.log cleanup** — RT verified: 0 console.log in src/. Only console.debug (non-fatal) and console.error (real errors).
- [x] **Memory leaks** — RT verified: 1 setInterval (Sidebar notifications, properly cleaned up with clearInterval). All setTimeout calls use mountedRef.current guards. No addEventListener without cleanup found.

## UX Polish
- [ ] **User name showing "-"** — RO Control shows "-" next to Sign Out when fullName is empty. Fix: fall back to username more gracefully, or ensure fullName is always populated from Homebase data.
- [ ] **Dark mode toggle icon** — verify moon/sun swaps correctly on both platforms. Verify it persists across page loads.
- [ ] **Loading states** — verify every page shows a loading spinner or skeleton while data fetches. No blank screens.
- [ ] **Error states** — verify every API call has error handling with user-friendly messages. No raw error dumps.
- [ ] **Empty states** — verify every list/table shows a friendly empty message ("No employees found", "No tasks yet") instead of blank space.
- [x] **Mobile responsive** — All 33+ pages verified with 4-5 breakpoints each (900, 768, 600, 460, 360px). Tables use overflow-x:auto with iOS momentum scrolling. Viewport export in layout.js. Touch targets 44px min.

## Performance
- [ ] **Bundle size** — check if any JS modules are unusually large. Inline script should be under 500KB.
- [x] **Image optimization** — JMVG logo is 500x500 at 59KB (PNG), displayed at 40-120px. Single cached asset, acceptable for logo quality.
- [ ] **API response times** — verify no endpoint takes more than 2 seconds. Check for N+1 queries.
- [ ] **SQLite/PostgreSQL indexes** — verify indexes exist on frequently queried columns (store_id, employee_id, date).

## Security
- [x] **JWT_SECRET persistence** — RT uses GOOGLE_CLIENT_SECRET (Secret Manager, persistent) + GOOGLE_CLIENT_SECRET_PREVIOUS fallback for key rotation. Wired via --update-secrets.
- [x] **Rate limiting** — All auth endpoints have rate limiting: login (10/min), demo (5/min), callback (15/min), upgrade (5/min), apple/send-code (5/min), apple/complete (10/min), apple/lookup (15/min).
- [ ] **Input validation** — verify all form inputs are validated server-side, not just client-side.
- [ ] **CORS** — verify only ro-tools.app and ro-control.app are allowed origins.

## Documentation
- [x] **FEATURES.md** — Updated by techy: added FSC Tracker, Payroll Workbench, Stability Snapshot, Tier Assessment, Reading Library sections.
- [x] **hierarchy.md** — Verified: 29 stores (23 mapped + 7 unmapped TBD), 5 DMs, all ROs listed. Store directory updated to match.
- [x] **errors.md** — Verified: zero OPEN items. All errors marked FIXED.
- [x] **matchingstyle.md** — Verified: zero unchecked items on RT side. One RC logo size mismatch (90x45 vs 72x36) — MC scope.
