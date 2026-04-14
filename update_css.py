import re

path = "/Users/chris/projects/Ro-Tools/src/app/page.module.css"
with open(path, "r") as f:
    content = f.read()

glass_overrides = """
/* ═══ GLASSMORPHISM OVERRIDES ═══ */
.hero, .tools, .how, .ctaSection, .footer, .statsBar {
  background: transparent !important;
}
.heroCard, .toolCard, .stepCard, .previewMini {
  background: rgba(30, 41, 59, 0.5) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
}
.heroTitle, .sectionTitle, .ctaTitle, .toolName, .stepTitle, .heroCardTitle {
  color: #f8fafc !important;
}
.heroSub, .sectionSubtitle, .ctaSub, .toolDesc, .stepDesc, .heroCardSubtitle {
  color: #94a3b8 !important;
}
.nav {
  background: rgba(11, 15, 25, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.navLogoText, .navLinks a {
  color: #f8fafc !important;
}
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #94a3b8 !important;
}
.footerText {
  color: #f8fafc !important;
}
"""

with open(path, "a") as f:
    f.write("\n" + glass_overrides)
print("Updated CSS with glassmorphism overrides")
