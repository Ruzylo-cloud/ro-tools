'use client';

import { useState, useEffect } from 'react';
import { changelog } from '@/lib/changelog';
import styles from './page.module.css';

const CATEGORY_LABELS = {
  new_feature: 'New Feature',
  improvement: 'Improvement',
  bug_fix: 'Bug Fix',
  announcement: 'Announcement',
};

const LAST_SEEN_KEY = 'rt-last-update';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function UpdatesPage() {
  const [tab, setTab] = useState('changelog');
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [commitsError, setCommitsError] = useState(null);

  // Mark updates as read
  useEffect(() => {
    fetch('/api/updates?limit=1')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(d => {
        const latest = d.updates?.[0]?.id || '';
        if (latest) localStorage.setItem(LAST_SEEN_KEY, latest);
      })
      .catch(() => {});
  }, []);

  // Fetch commits when tab switches to "commits"
  useEffect(() => {
    if (tab !== 'commits' || commits.length > 0) return;
    setCommitsLoading(true);
    fetch('/api/updates/commits?per_page=100')
      .then(r => r.json())
      .then(d => {
        setCommits(d.commits || []);
        if (d.error) setCommitsError(d.error);
      })
      .catch(() => setCommitsError('Failed to load commits'))
      .finally(() => setCommitsLoading(false));
  }, [tab, commits.length]);

  // Group changelog entries by version
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

  // Group commits by date
  const commitsByDate = [];
  const seenDates = new Set();
  for (const c of commits) {
    const dateKey = c.date ? c.date.split('T')[0] : 'unknown';
    if (!seenDates.has(dateKey)) {
      seenDates.add(dateKey);
      commitsByDate.push({ date: dateKey, commits: [] });
    }
    commitsByDate.find(g => g.date === dateKey).commits.push(c);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className={styles.title}>Updates & Changelog</h1>
          <p className={styles.subtitle}>Everything that&apos;s been shipped, fixed, and improved.</p>
        </div>
        <a href="/dashboard/updates/publish" style={{ background: 'var(--jm-blue)', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Company News Feed &rarr;</a>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
        {['changelog', 'commits'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? 'var(--jm-blue)' : 'var(--gray-500)',
              cursor: 'pointer',
              borderBottom: tab === t ? '2px solid var(--jm-blue)' : '2px solid transparent',
              marginBottom: -2,
              transition: 'all 0.15s',
            }}
          >
            {t === 'changelog' ? 'Releases' : 'Git Activity'}
          </button>
        ))}
      </div>

      {/* Changelog tab */}
      {tab === 'changelog' && (
        <div className={styles.timeline}>
          {grouped.map((group) => (
            <div key={group.version} className={styles.versionGroup}>
              <div className={styles.versionHeader}>
                <span className={styles.versionTag}>{group.version}</span>
                <span className={styles.versionDate}>{formatDate(group.date)}</span>
              </div>
              <div className={styles.entries}>
                {group.entries.map((entry) => (
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
      )}

      {/* Commits tab */}
      {tab === 'commits' && (
        <div className={styles.timeline}>
          {commitsLoading && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>Loading commits from GitHub...</div>
          )}
          {commitsError && (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--jm-red)', fontSize: 13 }}>{commitsError}</div>
          )}
          {!commitsLoading && commitsByDate.map((group) => (
            <div key={group.date} className={styles.versionGroup}>
              <div className={styles.versionHeader}>
                <span className={styles.versionTag}>{formatDate(group.date)}</span>
                <span className={styles.versionDate}>{group.commits.length} commit{group.commits.length !== 1 ? 's' : ''}</span>
              </div>
              <div className={styles.entries}>
                {group.commits.map((c) => (
                  <div key={c.sha} className={styles.entry}>
                    <div className={`${styles.dot} ${styles['dot_' + c.category]}`} />
                    <div className={styles.entryContent}>
                      <div className={styles.entryHeader}>
                        <span className={`${styles.badge} ${styles['badge_' + c.category]}`}>
                          {CATEGORY_LABELS[c.category] || 'Update'}
                        </span>
                        <span className={styles.entryTitle}>{c.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                        <span style={{ fontFamily: 'monospace', background: 'var(--gray-50)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>{c.sha}</span>
                        <span>{formatDateTime(c.date)}</span>
                        {c.author && <span>{c.author}</span>}
                      </div>
                      {c.description && <p className={styles.entryDesc}>{c.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!commitsLoading && commits.length === 0 && !commitsError && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>No commits found.</div>
          )}
        </div>
      )}
    </div>
  );
}
