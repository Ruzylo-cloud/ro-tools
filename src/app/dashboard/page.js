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

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data.profile))
      .catch(() => {});
  }, []);

  const firstName = profile?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || '';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back{firstName ? `, ${firstName}` : ''}</h1>
        <p className={styles.subtitle}>Pick a tool to get started.</p>
      </div>
      <div className={styles.grid}>
        <Link href="/dashboard/flyer" className={`${styles.card} ${styles.live}`}>
          <div className={styles.cardStatus}>Live Now</div>
          <div className={styles.cardIcon}>&#x1F4CB;</div>
          <h3 className={styles.cardTitle}>Catering Flyer</h3>
          <p className={styles.cardDesc}>Print-ready catering flyers with store info, menu, and pricing.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
        <Link href="/dashboard/generators/written-warning" className={`${styles.card} ${styles.live}`}>
          <div className={styles.cardStatus}>Live Now</div>
          <div className={styles.cardIcon}>&#x1F4DD;</div>
          <h3 className={styles.cardTitle}>Written Warning</h3>
          <p className={styles.cardDesc}>Corrective action forms with uniform branding. Auto-fills store info.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
        <Link href="/dashboard/generators/evaluation" className={`${styles.card} ${styles.live}`}>
          <div className={styles.cardStatus}>Live Now</div>
          <div className={styles.cardIcon}>&#x2B50;</div>
          <h3 className={styles.cardTitle}>Performance Evaluation</h3>
          <p className={styles.cardDesc}>Employee evaluations with scoring rubric. Download as branded PDF.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
        <Link href="/dashboard/generators/catering-order" className={`${styles.card} ${styles.live}`}>
          <div className={styles.cardStatus}>Live Now</div>
          <div className={styles.cardIcon}>&#x1F4E6;</div>
          <h3 className={styles.cardTitle}>Catering Order Form</h3>
          <p className={styles.cardDesc}>Customer-facing order forms with menu, pricing, and delivery details.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
        <Link href="/dashboard/generators/timesheet-correction" className={`${styles.card} ${styles.live}`}>
          <div className={styles.cardStatus}>Live Now</div>
          <div className={styles.cardIcon}>&#x23F0;</div>
          <h3 className={styles.cardTitle}>Timesheet Correction</h3>
          <p className={styles.cardDesc}>Clock in/out correction forms for payroll adjustments.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
        <Link href="/dashboard/generators/attestation-correction" className={`${styles.card} ${styles.live}`}>
          <div className={styles.cardStatus}>Live Now</div>
          <div className={styles.cardIcon}>&#x1F4CB;</div>
          <h3 className={styles.cardTitle}>Attestation Correction</h3>
          <p className={styles.cardDesc}>Meal period and rest break attestation correction forms.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
      </div>
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
