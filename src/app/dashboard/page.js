'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}</h1>
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
    </div>
  );
}
