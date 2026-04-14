import re

path = "/Users/chris/projects/Ro-Tools/src/app/welcome/page.js"
with open(path, "r") as f:
    content = f.read()

# Remove emojis globally from icon definitions
content = re.sub(r"icon:\s*'[^']+',\s*", "", content)
content = re.sub(r"icon:\s*\"[^\"]+\",\s*", "", content)

# Change background to dark
content = content.replace("background: '#f8fafc'", "background: '#0b0f19'")
content = content.replace("color: '#1a1a2e'", "color: '#f8fafc'")
content = content.replace("background: '#fff'", "background: 'rgba(30, 41, 59, 0.5)'")
content = content.replace("background: '#fff'", "background: 'rgba(30, 41, 59, 0.5)'") # just in case
content = content.replace("background: '#fefce8'", "background: 'rgba(255,255,255,0.05)'")
content = content.replace("background: 'linear-gradient(135deg, #c0392b, #e74c3c)'", "background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)'")
content = content.replace("background: 'linear-gradient(135deg, #6c3483, #8e44ad)'", "background: 'rgba(108,52,131,0.1)', border: '1px solid rgba(108,52,131,0.2)'")

# Add ambient glows
glass_styles = """
<div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }}></div>
<div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(238, 50, 39, 0.1) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }}></div>
"""

content = content.replace("return (\n    <div", "return (\n    <div style={{ position: 'relative' }}>\n" + glass_styles + "\n    <div")

# Inject Interactive Demo box
demo_box = """
            <a href="/demo" style={{
              background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '14px 32px',
              borderRadius: 10, fontWeight: 700, fontSize: 16, border: '1px solid rgba(59, 130, 246, 0.3)',
              textDecoration: 'none', display: 'inline-block',
            }}>
              Interactive Demo
            </a>
"""

content = content.replace("""Open Live App
            </a>
          </div>""", """Open Live App
            </a>\n""" + demo_box + "\n          </div>")

# General glassmorphism styling
content = content.replace("border: '1px solid #e8ecf0'", "border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'")
content = content.replace("borderBottom: '1px solid #e8ecf0'", "borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)'")

with open(path, "w") as f:
    f.write(content)
print("Updated Ro-Tools welcome page.js")
