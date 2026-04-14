import re

path = "/Users/chris/projects/Ro-Tools/src/app/page.js"
with open(path, "r") as f:
    content = f.read()

# Remove emojis from TOOLS
content = re.sub(r"icon:\s*'[^']+',\s*", "", content)

# Modify styling for glassmorphism
# We will inject some global styles and ambient glows directly into the page.
# The page uses page.module.css. We can append glassmorphism classes or inject a style tag.

glass_styles = """
<div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)', zIndex: -1 }}></div>
<div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(238, 50, 39, 0.1) 0%, transparent 60%)', zIndex: -1 }}></div>
"""

content = content.replace("return (\n    <>", "return (\n    <>\n      " + glass_styles)

# Add "Interactive Demo" button next to "Sign In with Google"
interactive_demo_btn = """
              <a href="/demo" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '16px 36px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.3s'
              }}>Interactive Demo</a>
"""

content = content.replace("""<button className={styles.btnPrimary} onClick={() => login(rememberMe)}>
                <GoogleIcon /> Sign In with Google
              </button>""", """<button className={styles.btnPrimary} onClick={() => login(rememberMe)}>
                <GoogleIcon /> Sign In with Google
              </button>""" + interactive_demo_btn)

# Remove the feature badges containing emojis
content = re.sub(r"\{?\['[^']+','[^']+','[^']+','[^']+'\]\.map\(f => \(\s*<span[^>]+>\{f\}</span>\s*\)\)\}?", "", content)

# Change background to dark theme for glassmorphism to look good, or update CSS. 
# But page.module.css controls most of it. We'll update page.module.css separately.

with open(path, "w") as f:
    f.write(content)
print("Updated Ro-Tools page.js")
