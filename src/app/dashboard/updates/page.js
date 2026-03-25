'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const CATEGORY_LABELS = {
  new_feature: 'New Feature',
  improvement: 'Improvement',
  bug_fix: 'Bug Fix',
  announcement: 'Announcement',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function UpdatesPage() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('new_feature');
  const [version, setVersion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/updates').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
    ]).then(([updatesData, profileData]) => {
      setUpdates(updatesData.updates || []);
      setIsAdmin(profileData.isAdmin || false);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, version: version.trim() || null }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdates(prev => [...prev, data.update]);
        setTitle('');
        setDescription('');
        setCategory('new_feature');
        setVersion('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch {}

    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this update?')) return;
    try {
      const res = await fetch(`/api/updates?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUpdates(prev => prev.filter(u => u.id !== id));
      }
    } catch {}
  };

  const sorted = [...updates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '48px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Updates & Changelog</h1>
        <p className={styles.subtitle}>Stay up to date with the latest improvements, features, and fixes.</p>
      </div>

      {/* Admin Post Form */}
      {isAdmin && (
        <div className={styles.postForm}>
          <div className={styles.postFormTitle}>Post an Update</div>
          {showSuccess && <div className={styles.success}>Update posted successfully!</div>}
          <div className={styles.formRow}>
            <div>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="new_feature">New Feature</option>
                <option value="improvement">Improvement</option>
                <option value="bug_fix">Bug Fix</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Version (optional)</label>
              <input className={styles.input} value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g. v1.2.0" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Catering Flyer Generator is live" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what changed or what's new..." />
          </div>
          <button
            className={styles.postBtn}
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
          >
            {submitting ? 'Posting...' : 'Post Update'}
          </button>
        </div>
      )}

      {/* Timeline */}
      {sorted.length === 0 ? (
        <div className={styles.empty}>No updates yet. Check back soon!</div>
      ) : (
        <div className={styles.timeline}>
          {sorted.map(update => (
            <div key={update.id} className={styles.updateItem}>
              <div className={`${styles.dot} ${styles['dot' + update.category.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join('')]}`} />
              <div className={styles.updateCard}>
                <div className={styles.updateHeader}>
                  <span className={`${styles.categoryBadge} ${styles['cat' + update.category.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join('')]}`}>
                    {CATEGORY_LABELS[update.category]}
                  </span>
                  {update.version && <span className={styles.versionBadge}>{update.version}</span>}
                  <span className={styles.updateTitle}>{update.title}</span>
                </div>
                <div className={styles.updateDesc}>{update.description}</div>
                <div className={styles.updateMeta}>
                  <span>{formatDate(update.createdAt)}</span>
                  <span>by {update.authorName}</span>
                  {isAdmin && (
                    <button className={styles.deleteBtn} onClick={() => handleDelete(update.id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
