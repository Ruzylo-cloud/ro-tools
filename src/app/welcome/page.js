'use client';

const BLUE = '#134A7C';
const RED = '#EE3227';
const NAVY = '#0d2d4a';

const LINKS = [
  { icon: '🎬', label: 'Live Presentation', desc: 'Interactive slideshow for meetings', url: '/presentation', color: BLUE },
  { icon: '🖥️', label: 'Live App (RO Tools)', desc: 'ro-tools.app — all 15 generators + scoreboard + catering', url: 'https://ro-tools.app', color: '#1a5a94', external: true },
  { icon: '📱', label: 'iOS App — RO Tools', desc: 'TestFlight — generators, catering CRM, scoreboard on iPhone', url: 'https://testflight.apple.com/join/rotools', color: '#555', external: true },
  { icon: '📱', label: 'iOS App — RO Control', desc: 'TestFlight — store kiosk, timeclock, closeout, schedule', url: 'https://testflight.apple.com/join/rocontrol', color: '#555', external: true },
  { icon: '🏪', label: 'Store Kiosk Demo', desc: 'Crew timeclock, checklist, closeout — tablet mode', url: '/demo', color: '#2d7a4a', external: false },
  { icon: '🔐', label: 'Security Findings', desc: 'Why to replace Vantage Point, Homebase, Jolt, Drive & Docs', url: '/security', color: '#c0392b' },
  { icon: '⚖️', label: 'Liability Protection', desc: 'How the platform protects JMVG from human-error liability', url: '/liability', color: '#6c3483' },
];

const GENERATORS = [
  { icon: '⚠️', name: 'Written Warning', tag: 'HR' },
  { icon: '⭐', name: 'Performance Eval', tag: 'HR' },
  { icon: '🤝', name: 'Coaching Form', tag: 'HR' },
  { icon: '🏥', name: 'Injury Report', tag: 'OSHA' },
  { icon: '📤', name: 'Resignation', tag: 'HR' },
  { icon: '🛑', name: 'Termination', tag: 'CA Law' },
  { icon: '🍽️', name: 'Meal Break Waiver', tag: 'CA §512' },
  { icon: '⏰', name: 'Timesheet Correction', tag: 'Payroll' },
  { icon: '📄', name: 'Attestation Correction', tag: 'CA §226.7' },
  { icon: '📦', name: 'Onboarding Packet', tag: 'New Hire' },
  { icon: '🏆', name: 'DM Walk-Through', tag: 'Inspection' },
  { icon: '📝', name: 'Catering Order', tag: 'Revenue' },
  { icon: '🏷️', name: 'Food Labels', tag: 'Food Safety' },
  { icon: '🔧', name: 'Work Orders', tag: 'Maintenance' },
  { icon: '📓', name: 'Manager Log', tag: 'Daily Ops' },
];

const PLATFORMS = [
  {
    icon: '🌐',
    name: 'RO Tools Web',
    url: 'ro-tools.app',
    desc: 'Manager platform — 15 generators, catering CRM, scoreboard, directives, L10 scorecard, e-signatures, training library.',
    color: BLUE,
  },
  {
    icon: '📱',
    name: 'RO Tools iOS',
    url: 'TestFlight',
    desc: 'Mobile companion — generate docs on-the-go, catering tracking, offline sync, push notifications.',
    color: '#1a5a94',
  },
  {
    icon: '🏪',
    name: 'RO Control iOS',
    url: 'TestFlight',
    desc: 'Store kiosk app — crew PIN timeclock, break attestations, digital signatures, mid-day & EOD closeouts, schedule viewer.',
    color: '#2d7a4a',
  },
  {
    icon: '🖥️',
    name: 'Mission Control',
    url: 'Internal',
    desc: 'Full store OS — tasks, scheduling, employee management, analytics, AI assistant (Jarvis), announcements, email.',
    color: '#6c3483',
  },
];

const STATS = [
  { value: '15', label: 'Document Generators' },
  { value: '4', label: 'Platforms Built' },
  { value: '30', label: 'JMVG Stores Covered' },
  { value: '$0', label: 'Monthly Licensing Cost' },
  { value: '100%', label: 'JMVG Infrastructure' },
  { value: '85%', label: 'Faster Than Manual' },
];

export default function WelcomePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8fafc', color: '#1a1a2e', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 60%, #1a5a94 100%)`,
        padding: '80px 40px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(238,50,39,0.2)',
            border: '1px solid rgba(238,50,39,0.5)',
            borderRadius: 100,
            padding: '6px 22px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: '#ff8070',
            marginBottom: 28,
          }}>
            Live Across 30 JMVG Stores · April 2026
          </div>

          <h1 style={{
            fontSize: 'clamp(52px, 8vw, 96px)',
            fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            lineHeight: 1,
            margin: '0 0 20px',
            letterSpacing: -2,
          }}>
            RO <span style={{ color: '#ff6b5b' }}>Tools</span>
          </h1>

          <p style={{
            fontSize: 'clamp(17px, 2.2vw, 22px)',
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 700,
            margin: '0 auto 44px',
            lineHeight: 1.55,
          }}>
            The complete operational platform built for JM Valley Group — standardizing every document, workflow, compliance form, and store operation across all 30 locations.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/presentation" style={{
              background: RED, color: '#fff', padding: '14px 32px',
              borderRadius: 10, fontWeight: 700, fontSize: 16,
              textDecoration: 'none', display: 'inline-block',
            }}>
              View Presentation →
            </a>
            <a href="https://ro-tools.app/dashboard" style={{
              background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '14px 32px',
              borderRadius: 10, fontWeight: 700, fontSize: 16, border: '1px solid rgba(255,255,255,0.25)',
              textDecoration: 'none', display: 'inline-block',
            }}>
              Open Live App
            </a>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e8ecf0',
        padding: '28px 40px',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 24,
          textAlign: 'center',
        }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, color: BLUE, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#666', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px 80px' }}>

        {/* QUICK LINKS */}
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 20 }}>
          Quick Access
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 64 }}>
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.url}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 22px',
                background: '#fff', borderRadius: 14, textDecoration: 'none', color: 'inherit',
                border: '1px solid #e8ecf0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: link.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {link.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: link.color, marginBottom: 3 }}>{link.label}</div>
                <div style={{ fontSize: 13, color: '#777', lineHeight: 1.4 }}>{link.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* PLATFORMS */}
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 20 }}>
          Four Platforms
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 64 }}>
          {PLATFORMS.map(p => (
            <div key={p.name} style={{
              padding: '24px',
              background: '#fff',
              borderRadius: 14,
              border: `1px solid ${p.color}30`,
              borderTop: `4px solid ${p.color}`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: p.color, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#aaa', marginBottom: 10 }}>{p.url}</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.55 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* DOCUMENT GENERATORS */}
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 20 }}>
          15 Document Generators
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 10,
          marginBottom: 64,
        }}>
          {GENERATORS.map(g => (
            <div key={g.name} style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              border: '1px solid #e8ecf0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.2 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginTop: 2 }}>{g.tag}</div>
              </div>
            </div>
          ))}
        </div>

        {/* COMPLIANCE + SECURITY CALLOUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 64,
        }}>
          <a href="/liability" style={{
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #6c3483, #8e44ad)',
            borderRadius: 16, padding: '32px',
            color: '#fff',
          }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>⚖️</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Liability Protection</div>
            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, marginBottom: 16 }}>
              Full audit trails, tamper-evident logging, digital signatures, and automated compliance — protecting JMVG from costly human-error liability claims.
            </div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Read the liability brief →</div>
          </a>

          <a href="/security" style={{
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
            borderRadius: 16, padding: '32px',
            color: '#fff',
          }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🔐</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Security Findings</div>
            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, marginBottom: 16 }}>
              Why Vantage Point, Homebase, Jolt, Google Drive, and Google Docs create unacceptable data risk, vendor lock-in, and compliance gaps for JMVG.
            </div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Read security report →</div>
          </a>
        </div>

        {/* INFRASTRUCTURE */}
        <div style={{
          background: NAVY,
          borderRadius: 16,
          padding: '40px',
          color: '#fff',
          marginBottom: 64,
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>100% JMVG Infrastructure</h3>
          <p style={{ opacity: 0.8, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
            Every component runs under the JM Valley Group Google Cloud organization — no vendor contracts, no SaaS subscriptions, no data leaving your control.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              ['🔒', 'Auth via Google OAuth', '@jmvalley.com only'],
              ['☁️', 'Google Cloud Run', 'Auto-scaling, 99.9% uptime'],
              ['📦', 'Google Cloud Storage', 'All data in JMVG org'],
              ['🔑', 'Secret Manager', 'Zero plaintext credentials'],
              ['📊', 'Structured logging', '7-day retention, JSONL'],
              ['🛡️', 'JWT + PBKDF2', '100k iterations, SHA-512'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: '#666' }}>JM Valley Group · RO Tools v3.0 · April 2026</div>
          <div>Built by Christopher Ruzylo · All rights reserved · Proprietary — not for external distribution</div>
        </div>

      </div>
    </div>
  );
}
