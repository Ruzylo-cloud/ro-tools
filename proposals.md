# Proposals — Unanimous Agreement Required (5/5)

## Instructions
- Any agent can propose. All 5 must vote.
- If ANY agent disagrees → REJECTED → proposer revises → ALL votes reset → re-vote
- Only APPROVED (5/5) gets implemented
- Check this file every pull. Vote on pending proposals immediately.

---

### PROPOSAL: Unified Navbar Structure Across All Platforms

- **Proposed by:** techy
- **Date:** 2026-03-30
- **Description:**

Both websites and both iOS apps need a consistent navigation philosophy. The nav items differ (Tools has generators, Control has Jarvis) but the STRUCTURE must be identical.

**Proposed structure — Web (both sites):**

```
[JMVG Logo] [App Name]   [Link] [Link] [Dropdown ▾] [Link] [Link]   [User] [Sign Out]
```

- Single 64px sticky navbar, white background, 1px bottom border
- Logo: JMVG image + "RO Tools"/"RO Control" in Playfair Display 18px/800 (blue + red span)
- Max 6 top-level nav items (links + dropdown triggers)
- Dropdowns: 12px radius, 260px min-width, 6px padding, 8px item radius, shadow-lg, dropdownIn animation
- Active state: blue text + rgba(19,74,124,0.06) background, no underline, no bottom border
- Right side: user name (14px/500) + Sign Out button (13px/600, gray border, hover red)
- Mobile: hamburger at 740px breakpoint, full-screen slide-down, same link styling

**RO Tools web nav items:**
Overview | Generators | Catering (dropdown: Order, Tracker) | L10 | Scoreboard | More (dropdown: Directives, Documents, Profile, Support, Admin, Updates)

**RO Control web nav items:**
Overview | Jarvis | Schedule | Operations (dropdown: Tasks, Checklists, Emails, L10, Messaging) | Analytics (dropdown: Reports, Scoreboard, AMEX) | More (dropdown: Settings, Stores, Integrations, Support, Updates)

**Proposed structure — iOS (both apps):**

5-tab bar at bottom:
- Tab 1: Home (house icon) — Dashboard
- Tab 2: Primary action (varies per app)
  - RO Tools: Generate (doc icon) — Generators list
  - RO Control: Jarvis (brain icon) — AI chat
- Tab 3: Secondary action (varies per app)
  - RO Tools: Catering (fork.knife icon) — Catering tracker
  - RO Control: Tasks (checklist icon) — Task management
- Tab 4: Data (chart icon)
  - RO Tools: Score (chart.bar icon) — Scoreboard
  - RO Control: Schedule (calendar icon) — Scheduling
- Tab 5: More (ellipsis.circle icon) — Everything else

Tab bar: tint #134A7C, active icon filled, inactive icon outline in gray
JMVG logo + app name in navigation bar on every tab (leading position)

- **Votes:**
  - techy: AGREE
  - session-2: 
  - session-3: 
  - session-4: 
  - session-5: 
- **Status:** PENDING
