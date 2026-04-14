'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { changelog } from '@/lib/changelog';
import styles from './page.module.css';

// RT-032: Quick action definitions
const QUICK_ACTIONS = [
  { href: '/dashboard/generators/written-warning', icon: '📝', label: 'Written Warning' },
  { href: '/dashboard/generators/evaluation', icon: '⭐', label: 'Evaluation' },
  { href: '/dashboard/generators/catering-order', icon: '📦', label: 'Catering Order' },
  { href: '/dashboard/support', icon: '🛟', label: 'Support' },
  { href: '/dashboard/generators/injury-report', icon: '🚑', label: 'Injury Report' },
  { href: '/dashboard/generators/coaching-form', icon: '💬', label: 'Coaching Form' },
  { href: '/dashboard/flyer', icon: '📋', label: 'Catering Flyer' },
  { href: '/dashboard/generators', icon: '⚙️', label: 'All Tools' },
];

const DOC_TYPE_ICONS = {
  'written-warning': '📝',
  'evaluation': '⭐',
  'coaching-form': '💬',
  'resignation': '📤',
  'termination': '🛑',
  'injury-report': '🚑',
  'timesheet-correction': '⏰',
  'attestation-correction': '📋',
  'meal-break-waiver': '🍽️',
  'catering-order': '📦',
  'flyer': '🖨️',
  'food-labels': '🏷️',
  'work-orders': '🔧',
  'manager-log': '📓',
  'dm-walkthroughs': '🔍',
  'onboarding-packets': '📋',
  'new-hire-checklist': '📋',
  'training-level1': '📚',
  'training-level2': '📚',
  'training-level3': '📚',
  'training-slicer': '📚',
  'training-opener': '📚',
  'training-shiftlead': '📚',
  'training-orientation': '📚',
};

// Maps generator types to their actual page paths (types not under /generators/)
const DOC_TYPE_PATHS = {
  'flyer': '/dashboard/flyer',
  'new-hire-checklist': '/dashboard/documents',
  'training-level1': '/dashboard/documents',
  'training-level2': '/dashboard/documents',
  'training-level3': '/dashboard/documents',
  'training-slicer': '/dashboard/documents',
  'training-opener': '/dashboard/documents',
  'training-shiftlead': '/dashboard/documents',
  'training-orientation': '/dashboard/documents',
};

function formatRelativeTime(ts) {
  if (!ts) return '';
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}

const recentUpdates = changelog.slice(0, 3);

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  // RT-033: Recently generated documents
  const [recentDocs, setRecentDocs] = useState(null); // null = loading
  const [recentError, setRecentError] = useState(false);
  // RT-053: Quick stats
  const [stats, setStats] = useState({ generated: 0, pendingApprovals: 0 });
  // RT-071: Last login
  const [lastLogin, setLastLogin] = useState(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => {
        setProfile(data.profile);
        if (data.profile?.autoAdminGranted === true && !data.profile?.autoAdminNotified) {
          setShowAdminModal(true);
        }
        if (data.profile?.lastLoginAt) setLastLogin(data.profile.lastLoginAt);
      })
      .catch((e) => { console.error('[dashboard] Profile load failed:', e); });

    // Notifications opt-in banner — show once on first login if never opted in, never dismissed
    try {
      const dismissed = typeof window !== 'undefined' && window.localStorage.getItem('notifOptInDismissed');
      if (!dismissed) {
        fetch('/api/profile/notification-prefs')
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.prefs && !data.prefs.optedInAt) setShowNotifBanner(true);
          })
          .catch((e) => { console.debug('[dashboard] notif-prefs banner check failed (non-fatal):', e); });
      }
    } catch (e) { console.debug('[dashboard] notif-banner localStorage failed (non-fatal):', e); }
  }, []);

  const dismissNotifBanner = () => {
    try { window.localStorage.setItem('notifOptInDismissed', '1'); }
    catch (e) { console.debug('[dashboard] notif dismiss save failed (non-fatal):', e); }
    setShowNotifBanner(false);
  };

  // RT-053/063: Load stats + pending approvals
  useEffect(() => {
    Promise.allSettled([
      fetch('/api/logs?limit=1').then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
      fetch('/api/admin/users').then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
    ]).then(([auditRes, adminRes]) => {
      const generated = auditRes.status === 'fulfilled' ? (auditRes.value?.total || 0) : 0;
      const pendingApprovals = adminRes.status === 'fulfilled'
        ? (Array.isArray(adminRes.value?.users) ? adminRes.value.users.filter(u => u.rolePending).length : 0) // RT-145: was u.status === 'pending', should be u.rolePending
        : 0;
      setStats({ generated, pendingApprovals });
    });
  }, []);

  // RT-033: Load recent activity
  const loadRecentDocs = () => {
    fetch('/api/logs?limit=5')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => {
        setRecentDocs(Array.isArray(data.logs) ? data.logs.slice(0, 5) : []);
      })
      .catch((e) => {
        console.error('[dashboard] recent docs load failed:', e);
        setRecentError(true);
        setRecentDocs([]);
      });
  };
  useEffect(() => { loadRecentDocs(); }, []);

  // RT-074: ⌘K keyboard shortcut to jump to generators search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/dashboard/generators');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  const dismissAdminModal = async () => {
    setShowAdminModal(false);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoAdminNotified: true }),
      });
    } catch(e) { console.debug('[dashboard] Admin notification ack failed:', e); }
  };

  const firstName = profile?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || '';

  // RT-051: Time-of-day greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // RT-052: Current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={styles.container} id="main-content">
      {/* Auto-Admin Granted Modal */}
      {showAdminModal && (
        <div className={styles.modalBackdrop} onClick={dismissAdminModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Notifications opt-in banner (first login, dismissible) */}
      {showNotifBanner && (
        <div style={{
          background: 'linear-gradient(90deg, var(--jm-blue), #1a5c96)',
          color: '#fff', borderRadius: 12, padding: '14px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Notifications are off by default</div>
            <div style={{ fontSize: 13, opacity: 0.95 }}>
              You won&apos;t receive any emails, in-app notifications, or texts until you opt in.
              Manage your preferences from the Store Profile page.
            </div>
          </div>
          <Link href="/dashboard/profile" onClick={dismissNotifBanner} style={{
            background: '#fff', color: 'var(--jm-blue)', fontWeight: 700, fontSize: 13,
            padding: '8px 14px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
          }}>Manage</Link>
          <button onClick={dismissNotifBanner} aria-label="Dismiss" style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff',
            width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, padding: 0, flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'block', margin: 'auto', flexShrink: 0 }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle} suppressHydrationWarning>{getGreeting()}{firstName ? `, ${firstName}` : ''}</h1>
        <p className={styles.heroDate} suppressHydrationWarning>{currentDate}</p>
        {/* RT-071: Last login */}
        {lastLogin && (
          <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginBottom: '8px' }}>
            Last login: {formatRelativeTime(lastLogin)}
          </p>
        )}
        <p className={styles.heroSubtitle}>
          RO Tools is the operational backbone for JM Valley Group franchise managers.
          Everything you need to run your store — branded, automated, and always up to date.
        </p>
        <Link href="/dashboard/generators" className={styles.heroCta}>
          Open Generators &rarr;
        </Link>
      </div>

      {/* RT-053: Quick stats row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="stat-card" style={{ flex: '1', minWidth: '120px' }}>
          <div className="stat-value">{stats.generated || '—'}</div>
          <div className="stat-label">Docs Generated</div>
        </div>
        <div className="stat-card" style={{ flex: '1', minWidth: '120px' }}>
          <div className="stat-value">30+</div>
          <div className="stat-label">Stores</div>
        </div>
        <div className="stat-card" style={{ flex: '1', minWidth: '120px' }}>
          <div className="stat-value">15</div>
          <div className="stat-label">Generators</div>
        </div>
        {/* RT-063: Pending approvals for admins */}
        {stats.pendingApprovals > 0 && (
          <Link href="/dashboard/admin" style={{ textDecoration: 'none', flex: '1', minWidth: '120px' }}>
            <div className="stat-card danger">
              <div className="stat-value" style={{ color: '#dc2626' }}>{stats.pendingApprovals}</div>
              <div className="stat-label">Pending Approvals</div>
            </div>
          </Link>
        )}
      </div>

      {/* RT-032: Quick Actions */}
      <div className={styles.quickActions}>
        {QUICK_ACTIONS.map(a => (
          <Link key={a.href} href={a.href} className={styles.quickAction}>
            <span className={styles.quickActionIcon}>{a.icon}</span>
            <span className={styles.quickActionLabel}>{a.label}</span>
          </Link>
        ))}
      </div>

      {/* RT-033: Recently Generated + RT-041: Loading Skeleton */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2 className={styles.recentTitle}>Recently Generated</h2>
          <Link href="/dashboard/history" className={styles.recentViewAll} aria-label="View all recently generated documents">View All &rarr;</Link>
        </div>
        <div className={styles.recentList}>
          {recentDocs === null ? (
            // RT-041: Loading skeleton
            [0,1,2].map(i => (
              <div key={i} className={styles.skeletonItem}>
                <div className={`${styles.skeletonBox} ${styles.skeletonIcon}`} />
                <div className={styles.skeletonText}>
                  <div className={`${styles.skeletonBox} ${styles.skeletonLine}`} style={{ width: '60%' }} />
                  <div className={`${styles.skeletonBox} ${styles.skeletonLine}`} />
                </div>
              </div>
            ))
          ) : recentDocs.length === 0 ? (
            <div className={styles.recentEmpty}>
              No documents generated yet. <Link href="/dashboard/generators" style={{ color: 'var(--jm-blue)', fontWeight: 600 }}>Open Generators &rarr;</Link>
            </div>
          ) : (
            recentDocs.map((doc, i) => {
              const type = doc.generatorType || doc.type || 'document';
              const icon = DOC_TYPE_ICONS[type] || '📄';
              const name = doc.formData?.employeeName || doc.filename || type.replace(/-/g, ' ');
              return (
                <div key={i} className={styles.recentItem}>
                  <div className={styles.recentItemIcon}>{icon}</div>
                  <div className={styles.recentItemInfo}>
                    <div className={styles.recentItemName}>{name}</div>
                    <div className={styles.recentItemMeta}>{type.replace(/-/g, ' ')} &middot; {formatRelativeTime(doc.timestamp || doc.createdAt)}</div>
                  </div>
                  <Link href={DOC_TYPE_PATHS[type] || `/dashboard/generators/${type}`} className={styles.recentItemAction}>Open &rarr;</Link>
                </div>
              );
            })
          )}
        </div>
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className={styles.pillarTitle}>15 Document Generators</h3>
          <p className={styles.pillarDesc}>
            Written warnings, evaluations, coaching forms, injury reports, resignations, terminations, meal break waivers,
            timesheet and attestation corrections, catering orders, flyers, food labels, work orders, manager logs, DM walk-throughs, and onboarding packets — all as branded PDFs with auto-save drafts, e-sign, and Google Drive.
          </p>
        </div>
        <div className={styles.pillar}>
          <div className={styles.pillarIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3 className={styles.pillarTitle}>Full Audit Trail</h3>
          <p className={styles.pillarDesc}>
            Every document generated is logged with the user, timestamp, action taken, and all form data.
            Injury reports auto-email HR. E-signatures send signing links directly to employees. View your history or search all activity in admin.
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
              <h3 className={styles.stepTitle}>Choose a Generator</h3>
              <p className={styles.stepDesc}>Pick the document type you need from the Generators hub.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <h3 className={styles.stepTitle}>Fill in the Details</h3>
              <p className={styles.stepDesc}>Enter employee info, dates, and specifics. Your store info is pre-filled.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <h3 className={styles.stepTitle}>Preview &amp; Download</h3>
              <p className={styles.stepDesc}>See a live preview, download as PDF, save to Google Drive, or send for e-signature — all in one click.</p>
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
            { name: 'Employee Coaching', desc: 'Verbal coaching & counseling docs' },
            { name: 'Employee Resignation', desc: 'Exit documentation & final pay' },
            { name: 'Employee Termination', desc: 'Termination with prior discipline' },
            { name: 'Injury Report', desc: 'OSHA-compliant injury forms' },
            { name: 'Work Orders', desc: 'Maintenance & equipment tracking' },
            { name: 'Manager Log', desc: 'Daily log: General, Injuries, Maintenance, Cleaning' },
            { name: 'DM Walk-Through', desc: 'Store inspection with 14 scored categories' },
            { name: 'Onboarding Packet', desc: 'New hire document checklist & e-signatures' },
            { name: 'Food Labels', desc: 'Printable prep labels with allergens & expiry' },
            { name: 'Timesheet Correction', desc: 'Clock in/out adjustments' },
            { name: 'Attestation Correction', desc: 'Meal & rest break forms' },
            { name: 'Meal Break Waiver', desc: 'CA Labor Code §512 compliance' },
            { name: 'Training Documents', desc: 'Level 1–3, Slicer, Opener, Shift Lead & New Hire' },
            { name: 'Scoreboard', desc: 'Weekly leaderboards across all 30+ stores' },
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <div>
          <h3 className={styles.complianceTitle}>California & Federal Compliance</h3>
          <p className={styles.complianceText}>
            All HR forms meet California labor law and federal compliance standards:
            Cal/OSHA injury reporting (&sect;6409.1) with auto-email to HR, meal break waivers per Labor Code &sect;512,
            attestation corrections per &sect;226.7, progressive discipline documentation, termination forms with &sect;201-202 final pay compliance,
            and digital e-signatures with timestamped audit trails. Every action is tracked for accountability.
          </p>
        </div>
      </div>

      {/* Why RO Tools */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Why RO Tools?</h2>
        <p className={styles.sectionText} style={{ marginBottom: '16px' }}>
          Before RO Tools, every store had its own way of doing things. One store&apos;s written warning looked different
          from another&apos;s. Catering clients were tracked on paper or not at all. Training packets varied store to store.
          Injury reports sat in a folder until someone remembered to email HR.
        </p>
        <p className={styles.sectionText} style={{ marginBottom: '16px' }}>
          RO Tools eliminates all of that. A written warning from Store #20381 is identical to one from Store #20388 &mdash;
          same format, same legal language, same compliance protections, same audit trail. When an injury happens, HR gets
          notified instantly. When a catering follow-up is due, the system reminds you. When a new hire starts training,
          their multi-page packet is generated with their name and dates pre-filled in seconds.
        </p>
        <p className={styles.sectionText}>
          This isn&apos;t a generic template library. Every feature was built because a real JMVG operator ran into a real
          problem. The 54-page training program was rebuilt line-for-line from the Director&apos;s original source documents.
          The meal break waiver cites the exact California Labor Code sections. The scoreboard tracks the same 4 targets
          leadership reviews every week. It&apos;s built for how JMVG actually operates.
        </p>
      </div>

      {/* By the Numbers */}
      <div className={styles.pillars}>
        <div className={styles.pillar} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--jm-blue)', fontFamily: "'Playfair Display', serif" }}>85%</div>
          <p className={styles.pillarDesc}>faster than manual Word templates</p>
        </div>
        <div className={styles.pillar} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--jm-red)', fontFamily: "'Playfair Display', serif" }}>30+</div>
          <p className={styles.pillarDesc}>stores across JM Valley Group</p>
        </div>
        <div className={styles.pillar} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--jm-blue)', fontFamily: "'Playfair Display', serif" }}>54</div>
          <p className={styles.pillarDesc}>pages of training content rebuilt from Director&apos;s originals</p>
        </div>
        <div className={styles.pillar} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--jm-red)', fontFamily: "'Playfair Display', serif" }}>$0</div>
          <p className={styles.pillarDesc}>monthly cost — runs on Google Cloud at no charge at current scale</p>
        </div>
      </div>

      {/* Built With */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Built for Operators, by Operators</h2>
        <p className={styles.sectionText}>
          RO Tools was built from the ground up to solve the daily friction franchise managers face:
          inconsistent paperwork, manual data entry, chasing signatures, and time wasted on formatting instead of running the store.
          15 generators, digital signatures, auto-email to HR, e-sign for employees, live scoreboard, catering CRM — every feature exists because a real operator needed it.
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
          <span className={styles.techBadge}>E-Signatures</span>
          <span className={styles.techBadge}>CA Labor Compliance</span>
          <span className={styles.techBadge}>Docker</span>
          <span className={styles.techBadge}>CI/CD Pipeline</span>
          <span className={styles.techBadge}>HMAC-SHA256 Security</span>
          <span className={styles.techBadge}>Auto-Scaling</span>
        </div>
      </div>

      {/* RT-072 to RT-090: Profile completion indicator + keyboard shortcut hint + store summary */}
      {profile && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
          {/* RT-077: Profile completion */}
          {(() => {
            const fields = ['storeName', 'storeNumber', 'city', 'phone', 'managerName'];
            const filled = fields.filter(f => profile[f]).length;
            const pct = Math.round(filled / fields.length * 100);
            const complete = pct === 100;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>Profile Completion</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: complete ? '#16a34a' : 'var(--jm-blue)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: complete ? '#16a34a' : 'var(--jm-blue)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                  {!complete && (
                    <Link href="/dashboard/profile" style={{ fontSize: 12, color: 'var(--jm-blue)', fontWeight: 600, marginTop: 4, display: 'inline-block' }}>
                      Complete your profile →
                    </Link>
                  )}
                </div>
                {/* RT-072: Store summary chip */}
                {profile.storeName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(19,74,124,0.05)', borderRadius: 8, border: '1px solid rgba(19,74,124,0.1)' }}>
                    <span style={{ fontSize: 18 }}>🏪</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--jm-blue)' }}>{profile.storeName === profile.storeNumber ? `#${profile.storeNumber}` : `${profile.storeName}${profile.storeNumber ? ` #${profile.storeNumber}` : ''}`}</div>
                      {profile.city && <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{profile.city}</div>}
                    </div>
                  </div>
                )}
                {/* RT-074: Keyboard shortcut hint */}
                <div style={{ fontSize: 11, color: 'var(--gray-500)', padding: '6px 10px', background: 'var(--gray-50)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <kbd style={{ fontFamily: 'monospace', fontSize: 11 }}>⌘K</kbd> to search
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <div className={styles.updatesSection}>
          <div className={styles.updatesHeader}>
            <h2 className={styles.updatesTitle}>Recent Updates</h2>
            <Link href="/dashboard/updates" className={styles.updatesViewAll} aria-label="View all recent updates">View All &rarr;</Link>
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
