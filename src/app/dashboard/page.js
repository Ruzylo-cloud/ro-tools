'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { changelog } from '@/lib/changelog';
import styles from './page.module.css';

const recentUpdates = changelog.slice(0, 3);

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile);
        if (data.profile?.autoAdminGranted === true && !data.profile?.autoAdminNotified) {
          setShowAdminModal(true);
        }
      })
      .catch(() => {});
  }, []);

  const dismissAdminModal = async () => {
    setShowAdminModal(false);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoAdminNotified: true }),
      });
    } catch {}
  };

  const firstName = profile?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || '';

  return (
    <div className={styles.container}>
      {/* Auto-Admin Granted Modal */}
      {showAdminModal && (
        <div className={styles.modalBackdrop} onClick={dismissAdminModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Administrator Access Granted</h2>
            <p className={styles.modalText}>
              Your administrator privileges have been automatically activated based on your verified @jmvalley.com email address. You have full access to all tools and admin features.
            </p>
            <button className={styles.modalBtn} onClick={dismissAdminModal}>Got it</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome back{firstName ? `, ${firstName}` : ''}</h1>
        <p className={styles.heroSubtitle}>
          RO Tools is the operational backbone for JM Valley Group franchise managers.
          Everything you need to run your store — branded, automated, and always up to date.
        </p>
        <Link href="/dashboard/generators" className={styles.heroCta}>
          Open Generators &rarr;
        </Link>
      </div>

      {/* What is RO Tools */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>What is RO Tools?</h2>
        <p className={styles.sectionText}>
          RO Tools is a centralized platform built exclusively for JM Valley Group operators. Instead of juggling
          Word templates, manual PDFs, and inconsistent paperwork across stores, every document you need is generated
          here — with your store info pre-filled, uniform branding applied, and the ability to download or save
          directly to Google Drive.
        </p>
      </div>

      {/* Pillars */}
      <div className={styles.pillars}>
        <div className={styles.pillar}>
          <div className={styles.pillarIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className={styles.pillarTitle}>Document Generation</h3>
          <p className={styles.pillarDesc}>
            Written warnings, performance evaluations, timesheet corrections, attestation forms, catering orders,
            and training packets — all generated as professional, branded PDFs in seconds.
          </p>
        </div>
        <div className={styles.pillar}>
          <div className={styles.pillarIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h3 className={styles.pillarTitle}>Store-Aware</h3>
          <p className={styles.pillarDesc}>
            Your store number, name, and location are automatically pulled into every document.
            Set it once in your Store Profile and never type it again.
          </p>
        </div>
        <div className={styles.pillar}>
          <div className={styles.pillarIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className={styles.pillarTitle}>Secure & Private</h3>
          <p className={styles.pillarDesc}>
            Restricted to @jmvalley.com accounts. All data stays within Google Cloud infrastructure.
            No third-party services, no external storage — your data is yours.
          </p>
        </div>
        <div className={styles.pillar}>
          <div className={styles.pillarIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3 className={styles.pillarTitle}>Full Audit Trail</h3>
          <p className={styles.pillarDesc}>
            Every document generated is logged with the user, timestamp, action taken, and all form data.
            View your personal history or search across all activity in the admin panel.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div>
              <h4 className={styles.stepTitle}>Choose a Generator</h4>
              <p className={styles.stepDesc}>Pick the document type you need from the Generators hub.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <h4 className={styles.stepTitle}>Fill in the Details</h4>
              <p className={styles.stepDesc}>Enter employee info, dates, and specifics. Your store info is pre-filled.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <h4 className={styles.stepTitle}>Preview & Download</h4>
              <p className={styles.stepDesc}>See a live preview, then download as PDF or save directly to Google Drive.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Tools */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Available Tools</h2>
        <div className={styles.toolList}>
          {[
            { name: 'Catering Flyer', desc: 'Print-ready flyers with menu & pricing' },
            { name: 'Catering Order', desc: 'Customer-facing order forms' },
            { name: 'Catering Tracker', desc: 'Client CRM with follow-ups & reordering' },
            { name: 'Written Warning', desc: 'Corrective action documentation' },
            { name: 'Performance Eval', desc: 'Employee reviews with scoring' },
            { name: 'Timesheet Correction', desc: 'Clock in/out adjustments' },
            { name: 'Attestation Correction', desc: 'Meal & rest break forms' },
            { name: 'Injury Report', desc: 'OSHA-compliant injury forms' },
            { name: 'Employee Coaching', desc: 'Verbal coaching & counseling docs' },
            { name: 'Training Documents', desc: 'Level 1–3, Slicer, Opener, Shift Lead & New Hire' },
            { name: 'Scoreboard', desc: 'Weekly leaderboards across all 29+ stores' },
            { name: 'Marketing Directives', desc: 'Monthly directives, meeting recaps & calendar' },
          ].map(t => (
            <div key={t.name} className={styles.toolItem}>
              <span className={styles.toolName}>{t.name}</span>
              <span className={styles.toolDesc}>{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className={styles.complianceCard}>
        <div className={styles.complianceIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <div>
          <h3 className={styles.complianceTitle}>California & Federal Compliance</h3>
          <p className={styles.complianceText}>
            All HR forms and documents are designed to meet California labor law and federal compliance standards
            including Cal/OSHA reporting requirements, meal and rest break attestation per CA Labor Code,
            progressive discipline documentation, and workplace injury reporting under &sect;6409.1. Every action is
            tracked in our audit system for accountability and record-keeping.
          </p>
        </div>
      </div>

      {/* Built With */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Built for Operators, by Operators</h2>
        <p className={styles.sectionText}>
          RO Tools was built from the ground up to solve the daily friction franchise managers face:
          inconsistent paperwork, manual data entry, and time wasted on formatting instead of running the store.
          Every feature exists because a real operator needed it.
        </p>
        <div className={styles.techRow}>
          <span className={styles.techBadge}>Next.js</span>
          <span className={styles.techBadge}>Google Cloud Run</span>
          <span className={styles.techBadge}>Google OAuth</span>
          <span className={styles.techBadge}>Google Drive API</span>
          <span className={styles.techBadge}>Gmail API</span>
          <span className={styles.techBadge}>Client-Side PDF</span>
          <span className={styles.techBadge}>Audit Logging</span>
          <span className={styles.techBadge}>Role-Based Access</span>
        </div>
      </div>

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <div className={styles.updatesSection}>
          <div className={styles.updatesHeader}>
            <h2 className={styles.updatesTitle}>Recent Updates</h2>
            <Link href="/dashboard/updates" className={styles.updatesViewAll}>View All &rarr;</Link>
          </div>
          {recentUpdates.map((u) => (
            <div key={`${u.version}-${u.title}`} className={styles.updateRow}>
              <span className={`${styles.updateBadge} ${styles['badge_' + u.category]}`}>
                {u.category === 'new_feature' ? 'New' : u.category === 'improvement' ? 'Update' : u.category === 'bug_fix' ? 'Fix' : 'Info'}
              </span>
              <span className={styles.updateText}>{u.title}</span>
              <span className={styles.updateDate}>{u.version}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
