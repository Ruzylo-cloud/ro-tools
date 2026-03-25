'use client';

import { useEffect } from 'react';
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

export default function LandingPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle(styles.scrolled, window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp 0.6s ease-out both';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(`.${styles.toolCard}, .${styles.step}`).forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAV */}
      <nav id="mainNav" className={styles.nav}>
        <a href="#" className={styles.navLogo}>
          <Image src="/nfl-x-jm-revised.jpeg" alt="RO Tools" width={84} height={42} style={{ borderRadius: '4px' }} />
          <div className={styles.navLogoText}>RO <span>Tools</span></div>
        </a>
        <div className={styles.navLinks}>
          <a href="#tools">Tools</a>
          <a href="#how">How It Works</a>
          <a href="#cta" className={styles.navCta} onClick={(e) => { e.preventDefault(); login(); }}>Sign In</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeDot}></div>
              <span className={styles.heroBadgeText}>Now Live — Catering Flyer Generator</span>
            </div>
            <h1 className={styles.heroTitle}>
              Every tool you need.<br /><span>One login.</span>
            </h1>
            <p className={styles.heroSub}>
              Generate catering flyers, marketing materials, and branded assets in seconds. Just sign in with your @jmvalley.com account and your store info does the rest.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={login}>
                <GoogleIcon /> Sign In with Google
              </button>
              <a href="#tools" className={styles.btnSecondary}>See What&apos;s Inside</a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroCardIcon}>&#x1F4C4;</div>
                <div>
                  <div className={styles.heroCardTitle}>Catering Flyer Generator</div>
                  <div className={styles.heroCardSubtitle}>Auto-fills with your store info</div>
                </div>
              </div>
              <div className={styles.heroCardPreview}>
                <div className={`${styles.previewLine} ${styles.red}`}></div>
                <div className={styles.previewBlock}>OFFICE CATERING</div>
                <div className={`${styles.previewLine} ${styles.gray}`}></div>
                <div className={`${styles.previewLine} ${styles.red}`} style={{ width: '40%', margin: '0 auto 8px' }}></div>
                <div className={`${styles.previewLine} ${styles.gray} ${styles.short}`} style={{ margin: '0 auto 8px' }}></div>
                <div className={styles.previewCols}>
                  <div>
                    <div className={styles.previewColLine}></div>
                    <div className={styles.previewColLine} style={{ width: '80%' }}></div>
                    <div className={styles.previewColLine} style={{ width: '60%' }}></div>
                    <div className={styles.previewColLine} style={{ width: '90%' }}></div>
                  </div>
                  <div>
                    <div className={styles.previewColLine}></div>
                    <div className={styles.previewColLine} style={{ width: '70%' }}></div>
                    <div className={styles.previewColLine} style={{ width: '85%' }}></div>
                    <div className={styles.previewColLine} style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
              <div className={`${styles.heroFloatBadge} ${styles.float1}`}>&#x2728; PDF Ready</div>
              <div className={`${styles.heroFloatBadge} ${styles.float2}`}>&#x1F680; One Click</div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className={styles.tools} id="tools">
        <div className={`${styles.sectionLabel} ${styles.labelRed}`}>WHAT&apos;S INSIDE</div>
        <h2 className={`${styles.sectionTitle} ${styles.titleBlue}`}>The Operator Toolkit</h2>
        <p className={styles.sectionSubtitle}>Everything you need to market your store — auto-filled, branded, and ready to print.</p>
        <div className={styles.toolsGrid}>
          <div className={`${styles.toolCard} ${styles.live}`}>
            <div className={styles.toolStatus}>Live Now</div>
            <div className={styles.toolIcon}>&#x1F4CB;</div>
            <div className={styles.toolName}>Catering Flyer Generator</div>
            <div className={styles.toolDesc}>Beautiful, print-ready catering flyers with your store info, menu, pricing, and contact details. Download as PDF instantly.</div>
          </div>
          <div className={`${styles.toolCard} ${styles.coming}`}>
            <div className={styles.toolStatus}>Coming Soon</div>
            <div className={styles.toolIcon}>&#x1F4E3;</div>
            <div className={styles.toolName}>Marketing Materials</div>
            <div className={styles.toolDesc}>Door hangers, leave-behinds, fundraiser sheets, and social media graphics. Branded and ready to print.</div>
          </div>
          <div className={`${styles.toolCard} ${styles.coming}`}>
            <div className={styles.toolStatus}>Coming Soon</div>
            <div className={styles.toolIcon}>&#x1F4CA;</div>
            <div className={styles.toolName}>Catering Tracker</div>
            <div className={styles.toolDesc}>Track prospects, follow-ups, and orders. See which office buildings are converting and which need another visit.</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how} id="how">
        <div className={`${styles.sectionLabel} ${styles.labelBlue}`}>SIMPLE AS A SUB</div>
        <h2 className={`${styles.sectionTitle} ${styles.titleRed}`}>How It Works</h2>
        <p className={styles.sectionSubtitle}>Three steps. That&apos;s it. No training manuals, no IT tickets.</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepTitle}>Sign In</div>
            <div className={styles.stepDesc}>Use your @jmvalley.com Google account. One click, you&apos;re in. No new passwords to remember.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepTitle}>Set Up Your Store</div>
            <div className={styles.stepDesc}>Enter your address, names, and phone numbers once. Every tool will auto-fill with your details.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepTitle}>Generate &amp; Download</div>
            <div className={styles.stepDesc}>Pick a tool, review the preview, and download a print-ready PDF. It&apos;s that fast.</div>
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
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <Image src="/nfl-x-jm-revised.jpeg" alt="RO Tools" width={56} height={28} style={{ borderRadius: '3px' }} />
          <div className={styles.footerText}>RO <span>Tools</span></div>
        </div>
        <div className={styles.footerRight}>&copy; 2026 RO Tools. Built for Jersey Mike&apos;s Valley operators.</div>
      </footer>
    </>
  );
}
