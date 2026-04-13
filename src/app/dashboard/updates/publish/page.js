'use client';

/**
 * Company Updates (News Feed) Publishing UI
 * ------------------------------------------
 * Server-backed (Mission Control) publishing + timeline browsing for
 * company-wide news. Supports pinning and a "new since last visit" badge
 * (localStorage-backed last-seen timestamp). Falls back to localStorage as a
 * defensive degraded mode if the MC endpoints return 404/5xx (e.g., during a
 * transient outage) — not a permanent "not yet implemented" gap.
 *
 * Scope: /dashboard/updates/publish — sibling to the existing changelog page.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/Toast';
import styles from './publish.module.css';

const LS_KEY = 'ro-tools:updates:fallback-v1';
const LAST_SEEN_KEY = 'ro-tools:updates:last-seen-ts';

function renderMarkdown(src) {
  if (!src) return '';
  const esc = String(src)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return esc
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return String(d); }
}
function fmtRelative(d) {
  if (!d) return '';
  try {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return fmtDate(d);
  } catch { return ''; }
}

function loadFallback() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveFallback(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { console.debug('[updates] fallback save failed', e); }
}

export default function UpdatesPublishPage() {
  const { showToast } = useToast();
  const [me, setMe] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [lastSeen, setLastSeen] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const [draft, setDraft] = useState({
    title: '',
    bodyMarkdown: '',
    imageUrl: '',
    author: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      setMe(d?.user || null);
      setDraft(prev => ({ ...prev, author: prev.author || d?.user?.name || d?.user?.email || '' }));
    }).catch((e) => { console.debug('[updates/publish] me load failed (non-fatal):', e); });
  }, []);

  // Read last-seen before data loads, then update it after load.
  useEffect(() => {
    try {
      const ts = parseInt(localStorage.getItem(LAST_SEEN_KEY) || '0', 10);
      setLastSeen(Number.isFinite(ts) ? ts : 0);
    } catch (e) { console.debug('[updates/publish] last-seen read failed (non-fatal):', e); setLastSeen(0); }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/updates/feed', { cache: 'no-store' });
      if (res.status === 404) {
        console.warn('[updates] MC feed returned 404 (likely transient) — degrading to localStorage');
        setFallbackMode(true);
        setUpdates(loadFallback());
      } else if (res.ok) {
        const data = await res.json();
        setUpdates(Array.isArray(data) ? data : (data.updates || []));
        setFallbackMode(false);
      } else {
        console.warn('[updates] feed fetch failed', res.status);
        setFallbackMode(true);
        setUpdates(loadFallback());
      }
    } catch (e) {
      console.warn('[updates] fetch error — using fallback', e);
      setFallbackMode(true);
      setUpdates(loadFallback());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Mark as seen once the list renders.
  useEffect(() => {
    if (loading || updates.length === 0) return;
    const now = Date.now();
    try { localStorage.setItem(LAST_SEEN_KEY, String(now)); }
    catch (e) { console.debug('[updates/publish] last-seen save failed (non-fatal):', e); }
    // Do NOT overwrite lastSeen state yet — keep badge visible for this session.
  }, [loading, updates]);

  const submitDraft = async () => {
    if (!draft.title.trim() || !draft.bodyMarkdown.trim()) return;
    const payload = {
      title: draft.title,
      bodyMarkdown: draft.bodyMarkdown,
      imageUrl: draft.imageUrl || null,
      author: draft.author || me?.name || me?.email || 'unknown',
      date: draft.date || new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/updates/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 404) {
        console.warn('[updates] POST returned 404 (likely transient) — degrading to localStorage');
        const item = {
          id: `local-${Date.now()}`,
          ...payload,
          pinned: false,
          createdAt: new Date().toISOString(),
        };
        const next = [item, ...loadFallback()];
        saveFallback(next);
        setUpdates(next);
        setFallbackMode(true);
      } else if (res.ok) {
        await refresh();
      } else {
        showToast('Failed to publish update (' + res.status + ')', 'error');
        return;
      }
      setShowForm(false);
      setDraft({
        title: '',
        bodyMarkdown: '',
        imageUrl: '',
        author: me?.name || me?.email || '',
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (e) {
      console.error('[updates] publish error', e);
      showToast('Publish error: ' + e.message, 'error');
    }
  };

  const togglePin = async (u) => {
    const next = !u.pinned;
    if (fallbackMode || String(u.id).startsWith('local-')) {
      const list = updates.map(x => x.id === u.id ? { ...x, pinned: next } : x);
      setUpdates(list); saveFallback(list); return;
    }
    try {
      const res = await fetch(`/api/updates/${encodeURIComponent(u.id)}/pin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: next }),
      });
      if (res.status === 404) {
        console.warn('[updates] pin returned 404 (likely transient) — toggling locally');
        const list = updates.map(x => x.id === u.id ? { ...x, pinned: next } : x);
        setUpdates(list); saveFallback(list); setFallbackMode(true);
      } else if (res.ok) {
        await refresh();
      } else { showToast('Pin failed (' + res.status + ')', 'error'); }
    } catch (e) { console.error(e); showToast('Pin error: ' + e.message, 'error'); }
  };

  const sorted = useMemo(() => {
    const copy = [...updates];
    copy.sort((a, b) => {
      if (Boolean(b.pinned) - Boolean(a.pinned)) return Boolean(b.pinned) - Boolean(a.pinned);
      const ad = new Date(a.date || a.createdAt || 0).getTime();
      const bd = new Date(b.date || b.createdAt || 0).getTime();
      return bd - ad;
    });
    return copy;
  }, [updates]);

  const isNew = (u) => {
    const ts = new Date(u.createdAt || u.date || 0).getTime();
    return ts > lastSeen;
  };
  const newCount = sorted.filter(isNew).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Company News Feed</h1>
          <p className={styles.subtitle}>Timeline of company-wide announcements. Pin important updates to the top.</p>
        </div>
        <div className={styles.headerActions}>
          {newCount > 0 && <span className={styles.newBadge}>{newCount} new since last visit</span>}
          <button className={styles.publishBtn} onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ New Update'}
          </button>
        </div>
      </div>

      {fallbackMode && (
        <div className={styles.banner}>
          Running in local fallback mode — Mission Control updates CRUD endpoints returned 404. Data is kept in your browser only.
        </div>
      )}

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formRow}>
            <label>Title</label>
            <input type="text" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="E.g. Welcome new stores to JMVG" maxLength={200} />
          </div>
          <div className={styles.formRow}>
            <label>Body (markdown)</label>
            <textarea rows={6} value={draft.bodyMarkdown} onChange={e => setDraft(d => ({ ...d, bodyMarkdown: e.target.value }))} placeholder="**Great news:** supports **bold**, *italic*, `code`, new lines." />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formRow}>
              <label>Image URL (optional)</label>
              <input type="url" value={draft.imageUrl} onChange={e => setDraft(d => ({ ...d, imageUrl: e.target.value }))} placeholder="https://…" />
            </div>
            <div className={styles.formRow}>
              <label>Author</label>
              <input type="text" value={draft.author} onChange={e => setDraft(d => ({ ...d, author: e.target.value }))} placeholder="Your name" />
            </div>
            <div className={styles.formRow}>
              <label>Date</label>
              <input type="date" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.publishBtn} onClick={submitDraft} disabled={!draft.title.trim() || !draft.bodyMarkdown.trim()}>Publish</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : sorted.length === 0 ? (
        <div className={styles.empty}>No updates yet. Be the first to publish.</div>
      ) : (
        <div className={styles.timeline}>
          {sorted.map(u => {
            const open = expandedId === u.id;
            const fresh = isNew(u);
            return (
              <div key={u.id} className={`${styles.card} ${u.pinned ? styles.pinned : ''} ${fresh ? styles.fresh : ''}`}>
                {u.pinned && <div className={styles.pinLabel}>📌 Pinned</div>}
                {fresh && <div className={styles.newDot} title="New since last visit" />}
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{u.title}</div>
                  <div className={styles.cardMeta}>
                    {u.authorName || u.author || 'unknown'} · {fmtDate(u.date || u.createdAt)}
                    <span className={styles.relative}> · {fmtRelative(u.createdAt || u.date)}</span>
                  </div>
                </div>
                {u.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.imageUrl} alt="" className={styles.cardImage} onError={e => { e.currentTarget.style.display = 'none'; }} />
                )}
                <div className={styles.cardBody}>
                  {open ? (
                    <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: renderMarkdown(u.bodyMarkdown) }} />
                  ) : (
                    <div className={styles.markdownPreview} dangerouslySetInnerHTML={{ __html: renderMarkdown((u.bodyMarkdown || '').slice(0, 280)) }} />
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.linkBtn} onClick={() => setExpandedId(open ? null : u.id)}>
                    {open ? 'Show less' : 'Read more'}
                  </button>
                  <button className={styles.linkBtn} onClick={() => togglePin(u)}>
                    {u.pinned ? 'Unpin' : 'Pin to top'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
