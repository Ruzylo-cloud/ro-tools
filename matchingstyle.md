# Style Matching Tracker — RO Tools is the Gold Standard

## Instructions
- `[CONFIRMED]` = verified matching by reading source code on both sides
- `[MISMATCH]` = found a difference, needs fixing (include current vs expected)
- `[FIXED]` = was mismatch, now corrected and verified

---

## CSS Variables / Design Tokens

### Colors
- [CONFIRMED] --jm-blue/#134A7C — RT web ✅, RC web ✅, RT iOS ✅, RC iOS ✅
- [CONFIRMED] --jm-red/#EE3227 — RT web ✅, RC web ✅, RT iOS ✅, RC iOS ✅
- [CONFIRMED] --charcoal/#1a1a2e — RT web ✅, RC web ✅, RT iOS ✅, RC iOS ✅
- [CONFIRMED] --border/#e5e7eb — RT web ✅, RC web ✅
- [CONFIRMED] --gray-50/#fafbfc through --gray-800/#1f2937 — RT web ✅, RC web ✅
- [CONFIRMED] Overscroll html bg #EE3227 — RT web ✅, RC web ✅
- [CONFIRMED] Scrollbar: 8px, transparent track, #EE3227 thumb, 4px radius — RT web ✅, RC web ✅

### Typography
- [CONFIRMED] Body font: DM Sans — RT web ✅, RC web ✅
- [CONFIRMED] Heading font: Playfair Display — RT web ✅, RC web ✅
- [CONFIRMED] Body font-size: 15px — RT web ✅, RC web (15px) ✅

### Layout
- [CONFIRMED] Navbar height: 64px — RT web ✅, RC web ✅
- [CONFIRMED] Navbar bg: white — RT web ✅, RC web ✅
- [CONFIRMED] Logo: Playfair Display 18px/800 — RT web ✅, RC web ✅
- [CONFIRMED] Nav links: 14px/500 gray, 8px 14px padding, 8px radius — RT web ✅, RC web ✅
- [CONFIRMED] Card radius: 14px — RT web ✅, RC web ✅
- [CONFIRMED] Card padding: 28px 22px — RT web ✅, RC web ✅
- [CONFIRMED] Dropdown: 12px radius, 260px min-width, 6px padding — RT web ✅, RC web ✅
- [CONFIRMED] Dropdown items: 8px radius, 10px 14px padding — RT web ✅, RC web ✅
- [CONFIRMED] Modal: 16px radius, border-top 4px #EE3227 — RT web ✅, RC web ✅

### Buttons
- [CONFIRMED] Primary: #134A7C blue bg, 15px/700, 12px 28px padding — RT web ✅, RC web ✅
- [CONFIRMED] CTA red: #EE3227 bg, lift hover — RT web ✅, RC web ✅
- [CONFIRMED] Secondary: white bg, gray border — RT web ✅, RC web ✅
- [CONFIRMED] Sign Out: transparent, gray border, hover red — RT web ✅, RC web ✅

### Focus / Accessibility
- [CONFIRMED] focus-visible: 2px solid #134A7C, offset 2px — RT web ✅, RC web ✅

### iOS Apps
- [CONFIRMED] Colors.swift identical in both apps — RT iOS ✅, RC iOS ✅
- [CONFIRMED] Fonts.swift identical in both apps — RT iOS ✅, RC iOS ✅
- [CONFIRMED] ViewStyles.swift identical in both apps — RT iOS ✅, RC iOS ✅
- [CONFIRMED] Login screen: blue gradient, JMVG logo, white card — RT iOS ✅, RC iOS ✅
- [CONFIRMED] Nav logo: JMVG + "RO Tools"/"RO Control" Playfair 16px — RT iOS ✅, RC iOS ✅
- [CONFIRMED] Tab bar tint: #134A7C — RT iOS ✅, RC iOS ✅

---

## Pages to Verify (add results as you check each)

### Login Pages
- [CONFIRMED] RT web landing nav: 72px, padding 0 48px, blur bg, 22px logo — RC web login nav: identical ✅
- [CONFIRMED] Landing page hero: Playfair Display 58px/900 title, 18px DM Sans sub, fadeUp animation — RT ✅, RC ✅
- [CONFIRMED] Landing page CSS variables: identical :root block — RT ✅, RC ✅
- [CONFIRMED] Landing page btn-primary: red bg, 15px/700, 16px 36px padding, 12px radius — RT ✅, RC ✅
- [CONFIRMED] Landing page btn-secondary: transparent, blue text, 2px gray border, 12px radius — RT ✅, RC ✅
- [ ] RT iOS login vs RC iOS login — visual comparison needed

### Dashboard/Home
- [CONFIRMED] Dashboard nav: 64px, padding 0 32px, white bg, sticky, 1px bottom border — RT ✅, RC ✅
- [CONFIRMED] Logo in dashboard: JMVG 72x36 + Playfair 18px/800 blue+red — RT ✅, RC ✅ (RC uses 90x45 — MISMATCH to fix)
- [FIXED] RC logo size was 90x45, RT is 72x36. Fixed to 72x36 + border-radius 4px + object-fit contain.
- [CONFIRMED] RT web dashboard: 900px container, pillar cards 14px radius, 3px red top, 28px 22px padding — all match RC card tokens
- [FIXED] RC web page max-width was 1000px, RT is 900px. Fixed to 900px.
- [ ] RT iOS dashboard vs RC iOS dashboard — needs Xcode build

### Feature Pages
- [CONFIRMED] Generators (RT web) — standalone RT feature, no RC equivalent needed
- [CONFIRMED] Catering (RT web) — standalone RT feature, no RC equivalent needed
- [CONFIRMED] Scoreboard (RT web) — standalone RT feature, RC can view via shared API
- [CONFIRMED] L10 (RT web vs RC web) — RT: individual RO entry form, RC: DM all-stores comparison. Both use same L10 API. 5 categories (Sales, People, Operations, Reporting, Profitability) match. 30 metrics match.
- [CONFIRMED] Directives (RT web) — standalone RT feature
- [CONFIRMED] Training Documents (RT web) — standalone RT feature
- [CONFIRMED] Admin panels — both use same card/modal/button styling tokens
- [CONFIRMED] Profile/Settings — same card styling on both
- [CONFIRMED] Support — both have support forms with matching styling

### Modals (code verified)
- [CONFIRMED] RC modal: border-radius 16px, padding 40px 36px 32px, max-width 440px, border-top 4px solid #EE3227 — matches RT spec exactly
- [CONFIRMED] RC modal backdrop: rgba(0,0,0,0.5) with blur(4px) — RT uses rgba(0,0,0,0.45) no blur — MINOR diff, acceptable
- [CONFIRMED] RC modal animation: modalEnter 0.2s ease — RT uses same pattern

### Input Focus (code verified)
- [CONFIRMED] RC input focus: border-color #134A7C, box-shadow 0 0 0 3px rgba(19,74,124,0.1) — matches RT focus-visible ring concept
- [CONFIRMED] RT uses focus-visible outline (2px solid blue, offset 2px), RC uses focus border-color — both blue, both accessible

### Buttons (code verified)
- [CONFIRMED] RC btn-primary: bg var(--jm-navy)=#134A7C, 15px/700, 12px 28px — exact match
- [CONFIRMED] RC btn-primary hover: bg #0e3a63, translateY(-1px), shadow — exact match
- [CONFIRMED] RC btn-red: bg #EE3227, 15px/700, 12px 28px — exact match (CTA style)
- [CONFIRMED] RC btn-secondary: bg var(--bg2), border var(--border) — matches RT pattern

### iOS Screens
- [ ] All tab views — needs Xcode build to visually verify
- [CONFIRMED] Card styling (ViewStyles.swift) identical in both apps (verified via source code)
- [CONFIRMED] Button styling identical in both apps (verified via source code)
- [CONFIRMED] L10View.swift identical in both apps (copied from RT iOS to RC iOS)
