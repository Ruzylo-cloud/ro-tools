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
- [ ] RT web landing vs RC web login — visual comparison needed
- [ ] RT iOS login vs RC iOS login — visual comparison needed

### Dashboard/Home
- [ ] RT web dashboard vs RC web dashboard — pillar cards, hero, stats
- [ ] RT iOS dashboard vs RC iOS dashboard

### Feature Pages
- [ ] Generators (RT web)
- [ ] Catering (RT web)
- [ ] Scoreboard (RT web)
- [ ] L10 (RT web vs RC web) — verify identical metric list
- [ ] Directives (RT web)
- [ ] Training Documents (RT web)
- [ ] Admin (RT web)
- [ ] Profile/Settings
- [ ] Support

### iOS Screens
- [ ] All tab views consistent between apps
- [ ] Card styling matches website
- [ ] Button styling matches website
