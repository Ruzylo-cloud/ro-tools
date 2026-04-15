'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const TOOLS = [
  {
    name: 'Document Generators',
    desc: '15 professional generators — catering orders, written warnings, evaluations, coaching forms, injury reports, resignations, terminations, meal break waivers, timesheet and attestation corrections, work orders, manager logs, DM walk-throughs, onboarding packets, and food labels. All auto-filled and downloadable as PDF.',
    highlight: true,
    stat: '15 Forms',
  },
  {
    name: 'Catering Flyer Builder',
    desc: 'Print-ready catering flyers with your store address, phone, manager names, full menu, and pricing. Branded and professional — just download and distribute.',
    stat: 'PDF Ready',
  },
  {
    name: 'Catering Tracker',
    desc: 'Full CRM for catering clients. Track orders, revenue, follow-up schedules, notable dates, and reorder frequency. Auto-logs clients from generated orders.',
    stat: 'Live CRM',
  },
  {
    name: 'Marketing Directives',
    desc: 'Monthly marketing directives, ALL RO meeting action items, JMVG scorecard tracking, and the full 2026 campaign calendar. Always current.',
    stat: 'Updated Weekly',
  },
  {
    name: 'Training Documents',
    desc: 'Level 1-3 training packets, Slicer, Opener, Shift Lead, Orientation, and New Hire Checklist. All JMVG-branded and ready to print or save to Google Drive. Includes knowledge-check quizzes.',
    stat: '8 Templates',
  },
  {
    name: 'Weekly Scoreboard',
    desc: 'Live leaderboards across all 30+ stores. Track sales growth, labor targets, COGs, and see where your store ranks — updated weekly.',
    stat: '12 Weeks',
  },
];

export default function LandingPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  // RT-242/246: OAuth error display
  const [authError, setAuthError] = useState(null);
  // RT-251: Remember me
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      // RT-244: Redirect to preserved destination after login
      const dest = sessionStorage.getItem('rt-post-login');
      if (dest) { sessionStorage.removeItem('rt-post-login'); router.push(dest); return; }
      router.push('/dashboard');
    }
    // RT-242/246: Show OAuth error if redirected from failed auth
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err === 'domain_restricted') setAuthError('Only @jmvalley.com accounts can access RO Tools. Please sign in with your work email.');
    else if (err === 'auth_failed') setAuthError('Sign-in failed. Please try again or contact your admin.');
    else if (err === 'session_expired') setAuthError('Your session expired. Please sign in again to continue.'); // RT-245
    else if (err) setAuthError(`Authentication error: ${err}`);
    // Always start at the top on page load (prevent hash anchor scroll)
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, [user, router]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const nav = document.getElementById('mainNav');
          if (nav) nav.classList.toggle(styles.scrolled, window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(styles.hidden);
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(`.${styles.toolCard}, .${styles.step}, .${styles.statItem}`).forEach(el => {
      el.classList.add(styles.hidden);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      
<div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)', zIndex: -1 }}></div>
<div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(238, 50, 39, 0.1) 0%, transparent 60%)', zIndex: -1 }}></div>

      {/* NAV */}
      <nav id="mainNav" className={styles.nav}>
        <a href="#" className={styles.navLogo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jmvg-logo.png" alt="JM Valley Group" width={84} height={42} style={{ borderRadius: '4px', objectFit: 'contain' }} />
          <div className={styles.navLogoText}>RO <span>Tools</span></div>
        </a>
        <div className={styles.navLinks}>
          <a href="#tools">Tools</a>
          <a href="#how">How It Works</a>
          <a href="#cta" className={styles.navCta} onClick={(e) => { e.preventDefault(); login(); }}>Sign In with Google</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeDot}></div>
              <span className={styles.heroBadgeText}>Built by operators, for operators</span>
            </div>
            <h1 className={styles.heroTitle}>
              Your store&apos;s<br />command center.<br /><span>One login.</span>
            </h1>
            <p className={styles.heroSub}>
              The v3.0.0 ecosystem: Generators, trackers, directives, and documents — featuring 5 synced themes, ambient design, and automated compliance. Built for Jersey Mike's Valley operators. Sign in with your @jmvalley.com account and everything auto-fills.
            </p>
            {/* RT-242/246: Auth error display */}
            {authError && (
              <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', fontSize: '13px', color: '#b91c1c', fontWeight: 500 }}>
                {authError}
              </div>
            )}
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={() => login(rememberMe)}>
                <GoogleIcon /> Sign In with Google
              </button>
              <a href="/demo" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '16px 36px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.3s'
              }}>Interactive Demo</a>

              {/* RT-243/TEC-007: Apple Sign-In is iOS-only (RT17/RC10). Web access
                  requires an @jmvalley.com Google Workspace account, so a web
                  Apple button would be inherently non-functional. Removed the
                  disabled "coming soon" shell per final-polish brief §3f. */}
            </div>
            {/* RT-251: Remember me checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, fontSize: 12, color: '#6b7280', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width: 14, height: 14, accentColor: '#134A7C' }} />
              Stay signed in for 30 days
            </label>
            {/* RT-252: Workspace SSO hint */}
            <div style={{ marginTop: 8, fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: '#16a34a' }}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Requires a <strong style={{ color: '#134A7C' }}>@jmvalley.com</strong> Google Workspace account
            </div>
            {/* RT-258: Login feature badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
              {['15 Generators', 'Scoreboard', 'E-Sign', 'Auto-fill'].map(f => (
                <span key={f} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: 'rgba(19,74,124,0.08)', color: '#134A7C', borderRadius: 20, border: '1px solid rgba(19,74,124,0.15)' }}>{f}</span>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroCardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <div className={styles.heroCardTitle}>RO Tools Suite</div>
                  <div className={styles.heroCardSubtitle}>Everything auto-fills with your store info</div>
                </div>
              </div>
              <div className={styles.heroCardPreview}>
                <div className={styles.previewRow}>
                  <div className={styles.previewMini}>
                    <div className={`${styles.previewMiniBar} ${styles.red}`}></div>
                    <div className={styles.previewMiniLines}><div></div><div></div><div></div></div>
                    <div className={styles.previewMiniLabel}>Catering Order</div>
                  </div>
                  <div className={styles.previewMini}>
                    <div className={`${styles.previewMiniBar} ${styles.blue}`}></div>
                    <div className={styles.previewMiniLines}><div></div><div></div><div></div></div>
                    <div className={styles.previewMiniLabel}>Warning Form</div>
                  </div>
                  <div className={styles.previewMini}>
                    <div className={`${styles.previewMiniBar} ${styles.red}`}></div>
                    <div className={styles.previewMiniLines}><div></div><div></div><div></div></div>
                    <div className={styles.previewMiniLabel}>Evaluation</div>
                  </div>
                </div>
                <div className={styles.previewRow}>
                  <div className={styles.previewMini}>
                    <div className={`${styles.previewMiniBar} ${styles.blue}`}></div>
                    <div className={styles.previewMiniLines}><div></div><div></div><div></div></div>
                    <div className={styles.previewMiniLabel}>Coaching</div>
                  </div>
                  <div className={styles.previewMini}>
                    <div className={`${styles.previewMiniBar} ${styles.red}`}></div>
                    <div className={styles.previewMiniLines}><div></div><div></div><div></div></div>
                    <div className={styles.previewMiniLabel}>Injury Report</div>
                  </div>
                  <div className={styles.previewMini}>
                    <div className={`${styles.previewMiniBar} ${styles.blue}`}></div>
                    <div className={styles.previewMiniLines}><div></div><div></div><div></div></div>
                    <div className={styles.previewMiniLabel}>Flyer</div>
                  </div>
                </div>
              </div>
              <div className={`${styles.heroFloatBadge} ${styles.float1}`}>PDF Ready</div>
              <div className={`${styles.heroFloatBadge} ${styles.float2}`}>30+ Stores</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className={styles.statsBar}>
        <div className={styles.statsInner}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>15</div>
            <div className={styles.statLabel}>Document Generators</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>30+</div>
            <div className={styles.statLabel}>JMVG Stores</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1</div>
            <div className={styles.statLabel}>Click to PDF</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Design Skills Needed</div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className={styles.tools} id="tools">
        <div className={`${styles.sectionLabel} ${styles.labelRed}`}>THE FULL SUITE</div>
        <h2 className={`${styles.sectionTitle} ${styles.titleBlue}`}>Operator Toolkit</h2>
        <p className={styles.sectionSubtitle}>Everything you need to run your store — professional documents, catering management, marketing directives, and cloud storage. All live. All free.</p>
        <div className={styles.toolsGrid}>
          {TOOLS.map((tool, i) => (
            <div key={i} className={`${styles.toolCard} ${tool.highlight ? styles.featured : ''} ${tool.coming ? styles.coming : ''}`}>
              <div className={styles.toolStat}>{tool.stat}</div>
              <div className={styles.toolIcon}>{tool.icon}</div>
              <div className={styles.toolName}>{tool.name}</div>
              <div className={styles.toolDesc}>{tool.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how} id="how">
        <div className={`${styles.sectionLabel} ${styles.labelBlue}`}>SIMPLE AS A SUB</div>
        <h2 className={`${styles.sectionTitle} ${styles.titleRed}`}>How It Works</h2>
        <p className={styles.sectionSubtitle}>Three steps. That&apos;s it.</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepTitle}>Sign In</div>
            <div className={styles.stepDesc}>Use your @jmvalley.com Google account. One click, you&apos;re in. No new passwords to remember.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepTitle}>Set Up Your Store</div>
            <div className={styles.stepDesc}>Enter your store address, phone, and manager names once. Every tool will auto-fill with your details from then on.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepTitle}>Generate &amp; Download</div>
            <div className={styles.stepDesc}>Pick a tool, fill in what&apos;s needed, preview it live, and download a print-ready PDF or save to Google Drive.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} id="cta">
        <h2 className={styles.ctaTitle}>Ready to make your life easier?</h2>
        <p className={styles.ctaSub}>Sign in with your company Google account and start generating.</p>
        <button className={styles.btnPrimary} onClick={login}>
          <GoogleIcon /> Sign In with Google
        </button>
        <p style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>@jmvalley.com accounts only</p>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jmvg-logo.png" alt="JM Valley Group" width={56} height={28} style={{ borderRadius: '3px', objectFit: 'contain' }} />
          <div className={styles.footerText}>RO <span>Tools</span></div>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerLinks}>
            <a href="/privacy">Privacy Policy</a>
            <span className={styles.footerDivider}>|</span>
            <a href="/terms">Terms of Service</a>
          </div>
          <div>&copy; 2026 RO Tools. Built for Jersey Mike&apos;s Valley operators.</div>
        </div>
      </footer>
    </>
  );
}
