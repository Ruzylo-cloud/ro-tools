'use client';

import { useEffect } from 'react';
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
  // RT-129: Mark updates as read when this page is visited
  useEffect(() => {
    fetch('/api/updates?limit=1')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(d => {
        const latest = d.updates?.[0]?.id || '';
        if (latest) localStorage.setItem('rt-last-update', latest);
      })
      .catch(e => { console.debug('[updates] Failed to mark latest update:', e); });
  }, []);
  // Group entries by version, then sort groups by date (newest first)
  const grouped = [];
  const seen = new Set();
  for (const entry of changelog) {
    if (!seen.has(entry.version)) {
      seen.add(entry.version);
      grouped.push({ version: entry.version, date: entry.date, entries: [] });
    }
    grouped.find(g => g.version === entry.version).entries.push(entry);
  }
  grouped.sort((a, b) => b.date.localeCompare(a.date) || b.version.localeCompare(a.version));

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className={styles.title}>Updates & Changelog</h1>
          <p className={styles.subtitle}>Everything that&apos;s been shipped, fixed, and improved.</p>
        </div>
        <a href="/dashboard/updates/publish" style={{ background: '#134A7C', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Company News Feed →</a>
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
