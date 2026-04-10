'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  { icon: '📚', name: 'Training Packets', tag: '8 Templates' },
  { icon: '🏆', name: 'DM Walk-Through', tag: 'Inspection' },
  { icon: '📝', name: 'Catering Order', tag: 'Revenue' },
  { icon: '📋', name: 'Catering Flyer', tag: 'Marketing' },
  { icon: '🏷️', name: 'Food Labels', tag: 'Food Safety' },
  { icon: '🔧', name: 'Work Orders', tag: 'Maintenance' },
  { icon: '📓', name: 'Manager Log', tag: 'Daily Ops' },
];

const STATS = [
  { value: '17', label: 'Document Generators' },
  { value: '30', label: 'JMVG Stores' },
  { value: '$0', label: 'Monthly Cost' },
  { value: '85%', label: 'Faster Than Manual' },
];

export default function WelcomePage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#1a1a2e', minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 60%, #0d3a5c 100%)',
        padding: '80px 40px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 24 }}>
            <Image src="/jmvg-logo.png" alt="JM Valley Group" width={100} height={50} style={{ borderRadius: 8 }} />
          </div>

          <div style={{
            display: 'inline-block',
            background: 'rgba(238,50,39,0.15)',
            border: '1px solid rgba(238,50,39,0.4)',
            borderRadius: 100,
            padding: '6px 20px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#ff6b5b',
            marginBottom: 24,
          }}>
            Now live across 30 JMVG stores
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            lineHeight: 1,
            marginBottom: 24,
            letterSpacing: -2,
          }}>
            RO Tools
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 680,
            margin: '0 auto 40px',
            lineHeight: 1.5,
            fontWeight: 400,
          }}>
            The operational platform built specifically for JM Valley Group — standardizing every document, form, and workflow across all 30 stores.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/presentation" style={{
              background: '#EE3227',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 20px rgba(238,50,39,0.4)',
            }}>
              ▶ Watch 2-Min Overview
            </a>
            <a href="/demo" style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}>
              🖥 Try the Demo
            </a>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        padding: '40px 40px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: '#134A7C', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT IT DOES */}
      <div style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#EE3227', marginBottom: 12 }}>WHAT IT DOES</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, color: '#134A7C' }}>
            Every tool. Every store. In seconds.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {GENERATORS.map((g, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? '#134A7C' : '#f8fafc',
                border: `1px solid ${hovered === i ? '#134A7C' : '#e5e7eb'}`,
                borderRadius: 14,
                padding: '18px 16px',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{g.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: hovered === i ? '#fff' : '#134A7C', marginBottom: 4 }}>{g.name}</div>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: hovered === i ? 'rgba(255,255,255,0.6)' : '#EE3227',
              }}>{g.tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KEY FEATURES */}
      <div style={{ background: '#f8fafc', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#EE3227', marginBottom: 12 }}>KEY FEATURES</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, color: '#134A7C' }}>
              Built for how your stores actually run
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '✍️',
                title: 'Digital E-Signatures',
                desc: 'Manager signatures auto-generate with a timestamp. Employees receive a signing link by email and sign on their phone. Signed documents save automatically.',
              },
              {
                icon: '📬',
                title: 'Auto-Email to HR',
                desc: 'Injury reports send directly to HR the moment they\'re submitted via Gmail API. No delays, no lost paperwork, and Cal/OSHA §6409.1 compliance built in.',
              },
              {
                icon: '📊',
                title: 'Live JMVG Scoreboard',
                desc: '12 weeks of real performance data across all 30+ stores. Grand Slams, Trifectas, and growth rankings. Color-coded by performance tier.',
              },
              {
                icon: '🏷️',
                title: 'Catering CRM',
                desc: 'Every catering order auto-creates a client record. Track revenue, set follow-up reminders, and reorder past orders in one click. No more paper tracking.',
              },
              {
                icon: '🔒',
                title: 'Google OAuth — JMVG Only',
                desc: 'Sign in with any @jmvalley.com Google account. No passwords to manage, no separate accounts. Your existing Google identity gets you in.',
              },
              {
                icon: '📱',
                title: 'iOS App (TestFlight)',
                desc: 'Native iPhone and iPad app with all 17 generators, catering CRM, scoreboard, and full offline support. Available now on TestFlight.',
              },
            ].map((f, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                padding: '28px 24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#134A7C', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMPLIANCE */}
      <div style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#EE3227', marginBottom: 12 }}>COMPLIANCE</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, color: '#134A7C' }}>
            California labor law, built in
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { law: 'CA Labor Code §512', desc: 'Meal break waivers auto-populate correct waiver language' },
            { law: 'CA Labor Code §226.7', desc: 'Attestation corrections reference premium pay obligations' },
            { law: 'CA Labor Code §201–202', desc: 'Termination forms include final pay timing requirements' },
            { law: 'Cal/OSHA §6409.1', desc: 'Injury reports auto-email HR with required incident details' },
          ].map((c, i) => (
            <div key={i} style={{
              background: '#f0f4f8',
              borderRadius: 12,
              padding: '20px 20px',
              borderLeft: '4px solid #134A7C',
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#134A7C', marginBottom: 6, fontFamily: 'monospace' }}>{c.law}</div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #134A7C 0%, #0d3a5c 100%)',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: 16, letterSpacing: -1 }}>
            See it for yourself
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 48, lineHeight: 1.6 }}>
            Three options depending on how much time you have. No setup, no account required for the demo.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 700, margin: '0 auto' }}>
            <a href="/presentation" style={{
              background: '#EE3227',
              color: '#fff',
              padding: '28px 20px',
              borderRadius: 16,
              textDecoration: 'none',
              display: 'block',
              boxShadow: '0 8px 32px rgba(238,50,39,0.3)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>▶</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>2-Min Presentation</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Auto-playing overview. Just watch.</div>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>ro-tools.app/presentation →</div>
            </a>

            <a href="/demo" style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '28px 20px',
              borderRadius: 16,
              textDecoration: 'none',
              display: 'block',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🖥</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Interactive Demo</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Click around with real sample data.</div>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>ro-tools.app/demo →</div>
            </a>

            <a href="/" style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '28px 20px',
              borderRadius: 16,
              textDecoration: 'none',
              display: 'block',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Live Platform</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Sign in with your @jmvalley.com account.</div>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>ro-tools.app →</div>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '32px 40px', textAlign: 'center', borderTop: '1px solid #e5e7eb', background: '#f8fafc' }}>
        <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
          RO Tools · Built for JM Valley Group · Deployed on Google Cloud · Zero monthly cost
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#9ca3af' }}>
          ro-tools.app &nbsp;·&nbsp; ro-control.app
        </div>
      </div>
    </div>
  );
}
