'use client';

import { changelog } from '@/lib/changelog';
import styles from './page.module.css';

const CATEGORY_LABELS = {
  new_feature: 'New Feature',
  improvement: 'Improvement',
  bug_fix: 'Bug Fix',
  announcement: 'Announcement',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function UpdatesPage() {
  // Group entries by version
  const grouped = [];
  const seen = new Set();
  for (const entry of changelog) {
    if (!seen.has(entry.version)) {
      seen.add(entry.version);
      grouped.push({ version: entry.version, date: entry.date, entries: [] });
    }
    grouped.find(g => g.version === entry.version).entries.push(entry);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Updates & Changelog</h1>
        <p className={styles.subtitle}>Everything that&apos;s been shipped, fixed, and improved.</p>
      </div>

      <div className={styles.timeline}>
        {grouped.map((group) => (
          <div key={group.version} className={styles.versionGroup}>
            <div className={styles.versionHeader}>
              <span className={styles.versionTag}>{group.version}</span>
              <span className={styles.versionDate}>{formatDate(group.date)}</span>
            </div>
            <div className={styles.entries}>
              {group.entries.map((entry, i) => (
                <div key={`${entry.category}-${entry.title}`} className={styles.entry}>
                  <div className={`${styles.dot} ${styles['dot_' + entry.category]}`} />
                  <div className={styles.entryContent}>
                    <div className={styles.entryHeader}>
                      <span className={`${styles.badge} ${styles['badge_' + entry.category]}`}>
                        {CATEGORY_LABELS[entry.category]}
                      </span>
                      <span className={styles.entryTitle}>{entry.title}</span>
                    </div>
                    <p className={styles.entryDesc}>{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
