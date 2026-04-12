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
- [ ] **Mobile responsive** — verify all pages work on phone (375px) and tablet (768px). No horizontal overflow.

## Performance
- [ ] **Bundle size** — check if any JS modules are unusually large. Inline script should be under 500KB.
- [ ] **Image optimization** — verify JMVG logo is properly sized (not serving 500px image at 36px display).
- [ ] **API response times** — verify no endpoint takes more than 2 seconds. Check for N+1 queries.
- [ ] **SQLite/PostgreSQL indexes** — verify indexes exist on frequently queried columns (store_id, employee_id, date).

## Security
- [ ] **JWT_SECRET persistence** — DONE for MC. Verify RO Tools session secret is also persistent (not regenerated per deploy).
- [ ] **Rate limiting** — verify all auth endpoints have rate limiting.
- [ ] **Input validation** — verify all form inputs are validated server-side, not just client-side.
- [ ] **CORS** — verify only ro-tools.app and ro-control.app are allowed origins.

## Documentation
- [x] **FEATURES.md** — Updated by techy: added FSC Tracker, Payroll Workbench, Stability Snapshot, Tier Assessment, Reading Library sections.
- [ ] **hierarchy.md** — verify accurate after all Homebase imports.
- [ ] **errors.md** — verify zero OPEN items.
- [ ] **matchingstyle.md** — verify zero unchecked items.
