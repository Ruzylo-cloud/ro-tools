'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const SLIDE_DURATION = 8000; // 8 seconds per slide

const SLIDES = [
  // TITLE
  {
    type: 'title',
    title: 'RO Tools',
    subtitle: 'The Operational Platform for JM Valley Group',
    meta: 'v3.0 — April 2026 — 30 Stores',
    bg: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 50%, #0d3a5c 100%)',
    color: '#fff',
  },
  // ALREADY RUNNING
  {
    type: 'text',
    label: 'ALREADY LIVE',
    title: 'Running on JMVG\'s Google Cloud infrastructure',
    bullets: [
      'Deployed under the JM Valley Group Google Cloud project — your infrastructure, your data',
      'Authentication restricted to @jmvalley.com accounts — only JMVG employees can access',
      'Data stored in Google Cloud Storage under your organization\'s security policies',
      'Custom domains (ro-tools.app, ro-control.app) pointing to your Cloud Run services',
      'Every employee who has a @jmvalley.com Google account can sign in today — nothing to install, nothing to configure',
      'Google manages the SSL certificates, auto-scaling, and uptime — enterprise reliability at no infrastructure overhead',
    ],
    bg: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 100%)',
    color: '#fff',
    accent: '#EE3227',
  },
  // PROBLEM
  {
    type: 'text',
    label: 'THE PROBLEM',
    title: 'Inconsistent paperwork across 30 stores',
    bullets: [
      'Every store uses different Word templates for the same forms',
      'Manual data entry — wrong store numbers, addresses, phone numbers',
      'No audit trail — HR can\'t verify what was generated or when',
      'Catering clients tracked on paper or not at all',
      'No centralized marketing directives or performance tracking',
    ],
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#EE3227',
  },
  // SOLUTION
  {
    type: 'text',
    label: 'THE SOLUTION',
    title: 'One platform. Every tool. Every store.',
    bullets: [
      '15 document generators + 8 training packets — PDF in seconds, not minutes',
      'Digital manager signatures + e-sign links sent to employees',
      'Auto-email to HR on injury reports — instant compliance',
      'Store info auto-fills everywhere — enter it once, use everywhere',
      'Catering CRM — track clients, orders, revenue, and follow-ups',
      'Live scoreboard — 12 weeks of performance data, store comparison, export',
    ],
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#134A7C',
  },
  // BY THE NUMBERS
  {
    type: 'stats',
    label: 'BY THE NUMBERS',
    stats: [
      { value: '15', label: 'Document Generators' },
      { value: '30', label: 'JMVG Stores' },
      { value: '8', label: 'Training Packet Templates' },
      { value: '$0', label: 'Monthly Cost' },
      { value: '85%', label: 'Faster Than Manual' },
      { value: '100%', label: 'California Compliant' },
    ],
    bg: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 100%)',
    color: '#fff',
  },
  // GENERATORS OVERVIEW
  {
    type: 'grid',
    label: 'DOCUMENT GENERATORS',
    title: '15 Professional PDF Generators',
    items: [
      { icon: '📝', name: 'Catering Order', desc: 'Auto-calculated pricing' },
      { icon: '⚠️', name: 'Written Warning', desc: 'Progressive discipline' },
      { icon: '⭐', name: 'Performance Eval', desc: '10-category scoring' },
      { icon: '🤝', name: 'Coaching Form', desc: 'Verbal coaching docs' },
      { icon: '🏥', name: 'Injury Report', desc: 'OSHA compliant + HR email' },
      { icon: '📤', name: 'Resignation Form', desc: 'Exit docs + final pay' },
      { icon: '🛑', name: 'Termination Form', desc: 'CA final pay compliant' },
      { icon: '🍽️', name: 'Meal Break Waiver', desc: 'CA Labor Code §512' },
      { icon: '⏰', name: 'Timesheet Correction', desc: 'Clock in/out fixes' },
      { icon: '📄', name: 'Attestation Correction', desc: 'Meal/rest break forms' },
      { icon: '🏷️', name: 'Food Labels', desc: 'Prep/expiry date labels' },
      { icon: '🔧', name: 'Work Orders', desc: 'Equipment maintenance' },
      { icon: '📓', name: 'Manager Log', desc: 'Daily shift notes' },
      { icon: '🏆', name: 'DM Walk-Through', desc: '14-category scoring + grade' },
      { icon: '📦', name: 'Onboarding Packet', desc: 'New hire doc checklist' },
    ],
    bg: '#fff',
    color: '#1a1a2e',
  },
  // WRITTEN WARNING DEEP DIVE
  {
    type: 'feature',
    label: 'HR COMPLIANCE',
    title: 'Written Warning Generator',
    description: 'Every written warning across all 30 stores follows the exact same format. Same legal language, same structure, same compliance. HR can search and verify any warning instantly.',
    bullets: [
      '5 levels: Verbal → Written → Final → Suspension → Termination',
      'Violation categories with structured improvement plans',
      'At-will employment acknowledgment built in',
      'Auto-generated manager digital signature (timestamped)',
      'E-sign link sent to employee for their signature',
      'Full audit trail — searchable by admin',
    ],
    stat: { value: '85%', label: 'faster than Word templates' },
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#EE3227',
  },
  // CATERING ORDER
  {
    type: 'feature',
    label: 'REVENUE GROWTH',
    title: 'Catering Order Form',
    description: 'Dynamic box management with 16-sub menu selection, auto-calculated pricing, discount tiers, and automatic client tracking. Every order auto-saves to the Catering Tracker.',
    bullets: [
      '$89.95/box with chips, drinks, cookie & brownie platters',
      'Real-time subtotal, discount, and total calculation',
      'Auto-saves client to CRM for follow-up',
      'One-click reorder from past orders',
      'Customer-facing Jersey Mike\'s branding',
    ],
    stat: { value: '80%', label: 'faster order creation' },
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#134A7C',
  },
  // CATERING TRACKER
  {
    type: 'feature',
    label: 'CATERING CRM',
    title: 'Catering Tracker',
    description: 'Full client relationship management for catering. Track every client, every order, every dollar. Follow-up schedules ensure no client falls through the cracks.',
    bullets: [
      'Auto-logs clients from generated catering orders',
      'Revenue tracking with Top 3 leaderboard',
      'Follow-up status: On Track / Due Soon / Overdue',
      'Upcoming Events widget (notable dates in next 30 days)',
      'One-click reorder loads exact past order into form',
    ],
    stat: { value: '#1', label: 'growth opportunity for JMVG' },
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#16a34a',
  },
  // SCOREBOARD
  {
    type: 'feature',
    label: 'PERFORMANCE',
    title: 'JMVG Scoreboard',
    description: '12 weeks of real performance data across all 30 stores. Grand Slams, Trifectas, and growth rankings drive healthy competition. New week added automatically.',
    bullets: [
      '4 targets: Labor, COGs Variance, COGs Actual, PY Growth',
      'Color-coded: Royal Blue (Grand Slam) → Orange (1 target)',
      'Leaderboards: Grand Slams, Trifectas, Avg Growth %',
      'Week-by-week breakdown with full metrics',
      'Store names displayed throughout (not just IDs)',
    ],
    stat: { value: '12', label: 'weeks of live data' },
    bg: 'linear-gradient(135deg, #134A7C 0%, #0d3a5c 100%)',
    color: '#fff',
    accent: '#EE3227',
  },
  // OPERATIONS TOOLS
  {
    type: 'grid',
    label: 'BEYOND DOCUMENTS',
    title: 'Operations & Analytics Tools',
    items: [
      { icon: '💵', name: 'Payroll Workbench', desc: 'Tips, hours, pay periods' },
      { icon: '🧱', name: 'Stability Snapshot', desc: 'Staffing grid per store' },
      { icon: '🎯', name: 'Tier Assessment', desc: 'ABC employee scoring' },
      { icon: '🎫', name: 'FSC Tracker', desc: 'Guest recovery tracking' },
      { icon: '📅', name: 'Marketing Directives', desc: 'Campaigns & calendar' },
      { icon: '📚', name: 'Reading Library', desc: '15 leadership books' },
      { icon: '📈', name: 'L10 Scorecard', desc: '30 weekly metrics' },
      { icon: '✍️', name: 'E-Signatures', desc: 'Digital signing workflow' },
    ],
    bg: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 100%)',
    color: '#fff',
  },
  // COMPLIANCE
  {
    type: 'text',
    label: 'COMPLIANCE & SECURITY',
    title: 'Enterprise-grade from day one',
    bullets: [
      'Google OAuth 2.0 — restricted to @jmvalley.com accounts only',
      'HMAC-SHA256 signed session cookies with timing-safe comparison',
      'Digital e-signatures with timestamped audit trail and IP logging',
      'Auto-email injury reports to HR via Gmail API',
      'California Labor Code §512 meal waivers, §226.7 attestations, §201-202 final pay',
      'Cal/OSHA §6409.1 injury reporting with instant HR notification',
      'Role-based access, rate limiting, input sanitization, path traversal guards',
    ],
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#134A7C',
  },
  // TIME SAVINGS
  {
    type: 'comparison',
    label: 'ROI',
    title: 'Time savings per document',
    rows: [
      { task: 'Written Warning', before: '15-20 min', after: '2 min', savings: '85%' },
      { task: 'Catering Flyer', before: '30+ min', after: '30 sec', savings: '98%' },
      { task: 'Performance Eval', before: '20 min', after: '3 min', savings: '85%' },
      { task: 'Injury Report', before: '15 min + email', after: '3 min', savings: '80%' },
      { task: 'Resignation/Term', before: '20 min', after: '2 min', savings: '90%' },
      { task: 'Training Pack', before: '45 min', after: '5 min', savings: '89%' },
    ],
    bg: '#fff',
    color: '#1a1a2e',
  },
  // ARCHITECTURE
  {
    type: 'tech',
    label: 'INFRASTRUCTURE',
    title: 'Built to scale',
    items: [
      { label: 'Framework', value: 'Next.js 14 (App Router)' },
      { label: 'Hosting', value: 'Google Cloud Run (auto-scaling)' },
      { label: 'Auth', value: 'Google OAuth 2.0' },
      { label: 'PDF Engine', value: 'Client-side (html2canvas + jsPDF)' },
      { label: 'Data', value: 'GCS-mounted persistent storage' },
      { label: 'CI/CD', value: 'GitHub → Cloud Build → Cloud Run' },
      { label: 'Email', value: 'Gmail API (auto-send to HR)' },
      { label: 'E-Sign', value: 'Canvas signature pad, timestamped' },
      { label: 'Security', value: 'HMAC-SHA256, rate limiting, audit logs' },
      { label: 'Cost', value: '$0/month at current scale' },
    ],
    bg: '#f8fafc',
    color: '#1a1a2e',
  },
  // iOS APPS
  {
    type: 'twoapp',
    label: 'NOW ON TESTFLIGHT',
    title: 'Two Native iOS Apps',
    apps: [
      {
        name: 'RO Tools',
        icon: '📱',
        color: '#134A7C',
        desc: 'The full management platform on your phone',
        bullets: [
          'All 15 generators + 8 training packets',
          'Catering CRM with push reminders',
          'Live JMVG scoreboard',
          'On-device PDF rendering + offline support',
          '@jmvalley.com login, Face ID quick access',
        ],
      },
      {
        name: 'RO Control',
        icon: '🖥',
        color: '#EE3227',
        desc: 'Kiosk + manager operations for iPads',
        bullets: [
          'Employee timeclock (PIN-based check-in)',
          'Mid-day + end-of-day closeout workflows',
          'Schedule viewer for crew',
          'Break attestation with digital signature',
          'Persistent kiosk mode with lock screen',
        ],
      },
    ],
    stat: { value: '2', label: 'iOS apps on TestFlight' },
    bg: '#fff',
    color: '#1a1a2e',
  },
  // ROADMAP
  {
    type: 'text',
    label: 'WHAT\'S NEXT',
    title: 'Future Roadmap',
    bullets: [
      'Employee Handbook Generator — standardized onboarding docs',
      'Crew Tools — self-service portal for non-manager employees',
      'Live Scoreboard API — auto-import weekly data from Google Sheets',
      'Native Schedule Builder rollout — replaces Homebase across 30+ stores',
      'Multi-Language Support — Spanish forms for bilingual staff',
      'Mission Control — full store OS for DMs, Directors, and ownership group',
    ],
    bg: '#fff',
    color: '#1a1a2e',
    accent: '#134A7C',
  },
  // CLOSING
  {
    type: 'title',
    title: 'RO Tools',
    subtitle: 'Already running on JMVG Google Cloud. Every tool. Every store. Every device.',
    meta: 'ro-tools.app | ro-control.app | TestFlight',
    bg: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 50%, #0d3a5c 100%)',
    color: '#fff',
  },
];

function SlideContent({ slide, visible }) {
  const animClass = visible ? 'slideVisible' : 'slideHidden';

  if (slide.type === 'title') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px' }}>
        <div style={{ marginBottom: 24 }}>
          <Image src="/jmvg-logo.png" alt="JMVG" width={120} height={60} style={{ borderRadius: 8 }} />
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 900, fontFamily: "'Playfair Display', serif", letterSpacing: -2, marginBottom: 16, lineHeight: 1 }}>{slide.title}</h1>
        <p style={{ fontSize: 24, fontWeight: 400, opacity: 0.85, maxWidth: 600, lineHeight: 1.5, marginBottom: 16 }}>{slide.subtitle}</p>
        <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.5 }}>{slide.meta}</p>
      </div>
    );
  }

  if (slide.type === 'stats') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6, marginBottom: 48 }}>{slide.label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, maxWidth: 900, width: '100%' }}>
          {slide.stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'text') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 100px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: slide.accent, marginBottom: 16 }}>{slide.label}</div>
        <h2 style={{ fontSize: 44, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, marginBottom: 32, lineHeight: 1.1, maxWidth: 700 }}>{slide.title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>
          {slide.bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 18, lineHeight: 1.5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: slide.accent, flexShrink: 0, marginTop: 8 }}></div>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'grid') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#EE3227', marginBottom: 16 }}>{slide.label}</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, marginBottom: 40, color: '#134A7C' }}>{slide.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, maxWidth: 1100 }}>
          {slide.items.map((item, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#134A7C', marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'feature') {
    const isLight = slide.color !== '#fff';
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', justifyContent: 'center', padding: '60px 100px', gap: 60 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: isLight ? slide.accent : 'rgba(255,255,255,0.5)', marginBottom: 16 }}>{slide.label}</div>
          <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, marginBottom: 16, lineHeight: 1.1 }}>{slide.title}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.8, marginBottom: 24, maxWidth: 500 }}>{slide.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {slide.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isLight ? slide.accent : 'rgba(255,255,255,0.4)', flexShrink: 0, marginTop: 6 }}></div>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ background: isLight ? '#f0f4f8' : 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 36px', textAlign: 'center', minWidth: 200 }}>
            <div style={{ fontSize: 64, fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1, color: isLight ? slide.accent : '#fff' }}>{slide.stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>{slide.stat.label}</div>
          </div>
        </div>
      </div>
    );
  }

  if (slide.type === 'comparison') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 100px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#EE3227', marginBottom: 16 }}>{slide.label}</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, marginBottom: 40, color: '#134A7C' }}>{slide.title}</h2>
        <table style={{ width: '100%', maxWidth: 800, borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #134A7C' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, color: '#134A7C' }}>Task</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, color: '#EE3227' }}>Before</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, color: '#16a34a' }}>After</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 700, color: '#134A7C' }}>Savings</th>
            </tr>
          </thead>
          <tbody>
            {slide.rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{r.task}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#EE3227' }}>{r.before}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{r.after}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontWeight: 700, fontSize: 14 }}>{r.savings}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'twoapp') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#EE3227', marginBottom: 16 }}>{slide.label}</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, marginBottom: 40, color: '#134A7C' }}>{slide.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1000 }}>
          {slide.apps.map((app, i) => (
            <div key={i} style={{ background: '#f8fafc', border: `2px solid ${app.color}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{app.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: app.color }}>{app.name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{app.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {app.bullets.map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 13 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: app.color, flexShrink: 0, marginTop: 6 }}></div>
                    <span style={{ color: '#374151' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#134A7C', borderRadius: 12, padding: '12px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: '#fff', lineHeight: 1 }}>{slide.stat.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{slide.stat.label}</div>
          </div>
          <div style={{ fontSize: 14, color: '#6b7280', maxWidth: 400 }}>Both apps built in SwiftUI with on-device PDF, offline support, push notifications, and @jmvalley.com Google OAuth. Available on TestFlight now.</div>
        </div>
      </div>
    );
  }

  if (slide.type === 'tech') {
    return (
      <div className={`slide ${animClass}`} style={{ background: slide.bg, color: slide.color, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 100px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#134A7C', marginBottom: 16 }}>{slide.label}</div>
        <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: -1, marginBottom: 40, color: '#134A7C' }}>{slide.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 800 }}>
          {slide.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#134A7C', minWidth: 90 }}>{item.label}</span>
              <span style={{ fontSize: 13, color: '#374151' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const goToSlide = useCallback((idx) => {
    if (idx < 0 || idx >= SLIDES.length || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setTransitioning(false);
    }, 400);
  }, [transitioning]);

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      setAutoPlay(false);
    }
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Auto-advance
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(nextSlide, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [currentSlide, autoPlay, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setAutoPlay(false); nextSlide(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setAutoPlay(false); prevSlide(); }
      if (e.key === 'p') setAutoPlay(p => !p);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextSlide, prevSlide]);

  return (
    <>
      <style jsx global>{`
        body { margin: 0; overflow: hidden; }
        .slide {
          position: absolute; inset: 0;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .slideVisible { opacity: 1; transform: translateX(0); }
        .slideHidden { opacity: 0; transform: translateX(40px); }
      `}</style>

      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", background: '#000' }}>
        {/* Current Slide */}
        <SlideContent slide={SLIDES[currentSlide]} visible={!transitioning} />

        {/* Progress Bar */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)', zIndex: 100 }}>
          <div style={{
            height: '100%', background: '#EE3227',
            width: `${((currentSlide + 1) / SLIDES.length) * 100}%`,
            transition: 'width 0.5s ease',
          }}></div>
        </div>

        {/* Slide Counter */}
        <div style={{
          position: 'fixed', bottom: 20, right: 24, zIndex: 100,
          fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
          background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: 20,
          backdropFilter: 'blur(8px)',
        }}>
          {currentSlide + 1} / {SLIDES.length}
          {autoPlay && <span style={{ marginLeft: 8, opacity: 0.6 }}>AUTO</span>}
        </div>

        {/* Navigation dots */}
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6, zIndex: 100,
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAutoPlay(false); goToSlide(i); }}
              style={{
                width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4,
                background: i === currentSlide ? '#EE3227' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0,
              }}
            ></button>
          ))}
        </div>

        {/* Click areas for prev/next */}
        <div
          onClick={() => { setAutoPlay(false); prevSlide(); }}
          style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '15%', cursor: 'pointer', zIndex: 50 }}
        ></div>
        <div
          onClick={() => { setAutoPlay(false); nextSlide(); }}
          style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '15%', cursor: 'pointer', zIndex: 50 }}
        ></div>
      </div>
    </>
  );
}
