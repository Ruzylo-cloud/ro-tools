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
          <h3 className={styles.cardTitle}>Catering Flyer Generator</h3>
          <p className={styles.cardDesc}>Generate print-ready catering flyers with your store info, menu, and pricing. Download as PDF.</p>
          <div className={styles.cardAction}>Open Tool &rarr;</div>
        </Link>
        <div className={`${styles.card} ${styles.coming}`}>
          <div className={styles.cardStatus}>Coming Soon</div>
          <div className={styles.cardIcon}>&#x1F4E3;</div>
          <h3 className={styles.cardTitle}>Marketing Materials</h3>
          <p className={styles.cardDesc}>Door hangers, leave-behinds, fundraiser sheets, and social media graphics.</p>
        </div>
        <div className={`${styles.card} ${styles.coming}`}>
          <div className={styles.cardStatus}>Coming Soon</div>
          <div className={styles.cardIcon}>&#x1F4CA;</div>
          <h3 className={styles.cardTitle}>Catering Tracker</h3>
          <p className={styles.cardDesc}>Track prospects, follow-ups, and orders.</p>
        </div>
      </div>
      {recentUpdates.length > 0 && (
        <div className={styles.updatesSection}>
          <div className={styles.updatesHeader}>
            <h2 className={styles.updatesTitle}>Recent Updates</h2>
            <Link href="/dashboard/updates" className={styles.updatesViewAll}>View All &rarr;</Link>
          </div>
          {recentUpdates.map((u, i) => (
            <div key={i} className={styles.updateRow}>
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
