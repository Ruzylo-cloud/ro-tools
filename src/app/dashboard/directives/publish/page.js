'use client';

/**
 * Directives Publishing UI
 * --------------------------------
 * Server-backed (Mission Control) publishing, browsing, and acknowledgement UI
 * for leadership directives. Falls back to localStorage if the MC endpoints are
 * not yet implemented on the server side (see commit SERVER-TODO flag).
 *
 * Scope: /dashboard/directives/publish — sibling to the existing directives page.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './publish.module.css';

const AUDIENCES = [
  { key: 'all', label: 'All' },
  { key: 'dms', label: 'DMs' },
  { key: 'ros', label: 'ROs' },
  { key: 'managers', label: 'Managers' },
  { key: 'shift_leads', label: 'Shift Leads' },
  { key: 'crew', label: 'Crew' },
];

const PRIORITIES = [
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

const LS_KEY = 'ro-tools:directives:fallback-v1';

// Minimal safe markdown → HTML (escape + **bold**, *italic*, `code`, newline → <br>).
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
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return String(d); }
}

function loadFallback() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveFallback(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { console.debug('[directives] fallback save failed', e); }
}

export default function DirectivesPublishPage() {
  const [me, setMe] = useState(null);
  const [directives, setDirectives] = useState([]);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [expandedId, setExpandedId] = useState(null);

  const [draft, setDraft] = useState({
    title: '',
    bodyMarkdown: '',
    priority: 'medium',
    audience: ['all'],
    effectiveDate: '',
    expiryDate: '',
    requiresAck: false,
  });

  // Load current user (for author display + manager gate on ack list).
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => setMe(d?.user || null)).catch(() => {});
  }, []);

  const isManager = useMemo(() => {
    if (!me) return false;
    const role = (me.role || '').toLowerCase();
    return ['administrator', 'district_manager', 'ro', 'operator', 'manager'].some(r => role.includes(r))
      || Boolean(me.isAdmin)
      || Boolean(me.isSuperAdmin);
  }, [me]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/directives/feed', { cache: 'no-store' });
      if (res.status === 404) {
        console.warn('[directives] MC feed endpoint not implemented — using localStorage fallback');
        setFallbackMode(true);
        setDirectives(loadFallback());
      } else if (res.ok) {
        const data = await res.json();
        setDirectives(Array.isArray(data) ? data : (data.directives || []));
        setFallbackMode(false);
      } else {
        console.warn('[directives] feed fetch failed', res.status);
        setFallbackMode(true);
        setDirectives(loadFallback());
      }
    } catch (e) {
      console.warn('[directives] feed fetch error, using fallback', e);
      setFallbackMode(true);
      setDirectives(loadFallback());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleAudience = (key) => {
    setDraft(d => {
      const has = d.audience.includes(key);
      if (key === 'all') return { ...d, audience: ['all'] };
      const cleaned = d.audience.filter(a => a !== 'all');
      return { ...d, audience: has ? cleaned.filter(a => a !== key) : [...cleaned, key] };
    });
  };

  const submitDraft = async () => {
    if (!draft.title.trim() || !draft.bodyMarkdown.trim()) return;
    const payload = {
      ...draft,
      audience: draft.audience.length ? draft.audience : ['all'],
    };

    try {
      const res = await fetch('/api/directives/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 404) {
        console.warn('[directives] POST not implemented — saving to localStorage fallback');
        const list = loadFallback();
        const localItem = {
          id: `local-${Date.now()}`,
          ...payload,
          status: 'active',
          createdAt: new Date().toISOString(),
          author: me?.email || 'local',
          authorName: me?.name || me?.email || 'local',
          acks: [],
        };
        const next = [localItem, ...list];
        saveFallback(next);
        setDirectives(next);
        setFallbackMode(true);
      } else if (res.ok) {
        await refresh();
      } else {
        alert('Failed to publish directive (' + res.status + ')');
        return;
      }
      setShowForm(false);
      setDraft({ title: '', bodyMarkdown: '', priority: 'medium', audience: ['all'], effectiveDate: '', expiryDate: '', requiresAck: false });
    } catch (e) {
      console.error('[directives] publish error', e);
      alert('Failed to publish: ' + e.message);
    }
  };

  const archive = async (d) => {
    if (!confirm('Archive this directive?')) return;
    if (fallbackMode || String(d.id).startsWith('local-')) {
      const next = directives.map(x => x.id === d.id ? { ...x, status: 'archived' } : x);
      setDirectives(next); saveFallback(next); return;
    }
    try {
      const res = await fetch(`/api/directives/${encodeURIComponent(d.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      if (res.status === 404) {
        console.warn('[directives] PUT not implemented — archiving locally');
        const next = directives.map(x => x.id === d.id ? { ...x, status: 'archived' } : x);
        setDirectives(next); saveFallback(next); setFallbackMode(true);
      } else if (res.ok) {
        await refresh();
      } else {
        alert('Archive failed (' + res.status + ')');
      }
    } catch (e) { console.error(e); alert('Archive error: ' + e.message); }
  };

  const acknowledge = async (d) => {
    if (fallbackMode || String(d.id).startsWith('local-')) {
      const next = directives.map(x => x.id === d.id
        ? { ...x, acks: [...(x.acks || []), { userEmail: me?.email, userName: me?.name, acknowledgedAt: new Date().toISOString() }] }
        : x);
      setDirectives(next); saveFallback(next); return;
    }
    try {
      const res = await fetch(`/api/directives/${encodeURIComponent(d.id)}/ack`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (res.status === 404) {
        console.warn('[directives] ack not implemented — recording locally');
        const next = directives.map(x => x.id === d.id
          ? { ...x, acks: [...(x.acks || []), { userEmail: me?.email, userName: me?.name, acknowledgedAt: new Date().toISOString() }] }
          : x);
        setDirectives(next); saveFallback(next); setFallbackMode(true);
      } else if (res.ok) {
        await refresh();
      } else { alert('Ack failed (' + res.status + ')'); }
    } catch (e) { console.error(e); alert('Ack error: ' + e.message); }
  };

  const filtered = useMemo(() => {
    return directives.filter(d => {
      if (filterStatus !== 'all' && (d.status || 'active') !== filterStatus) return false;
      if (filterPriority !== 'all' && d.priority !== filterPriority) return false;
      if (filterAudience !== 'all' && !(d.audience || []).includes(filterAudience) && !(d.audience || []).includes('all')) return false;
      return true;
    });
  }, [directives, filterPriority, filterAudience, filterStatus]);

  const ackedByMe = (d) => (d.acks || []).some(a => a.userEmail === me?.email);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Publish Directives</h1>
          <p className={styles.subtitle}>Leadership announcements with priority, audience targeting, and acknowledgement tracking.</p>
        </div>
        <button className={styles.publishBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Directive'}
        </button>
      </div>

      {fallbackMode && (
        <div className={styles.banner}>
          Running in local fallback mode — Mission Control directives CRUD endpoints returned 404. Data is kept in your browser only.
        </div>
      )}

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formRow}>
            <label>Title</label>
            <input type="text" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="E.g. Q2 Safety Compliance Checklist" maxLength={200} />
          </div>
          <div className={styles.formRow}>
            <label>Body (markdown)</label>
            <textarea rows={6} value={draft.bodyMarkdown} onChange={e => setDraft(d => ({ ...d, bodyMarkdown: e.target.value }))} placeholder="**Important:** use markdown. *italics*, `code`, new lines supported." />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formRow}>
              <label>Priority</label>
              <select value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}>
                {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div className={styles.formRow}>
              <label>Effective date</label>
              <input type="date" value={draft.effectiveDate} onChange={e => setDraft(d => ({ ...d, effectiveDate: e.target.value }))} />
            </div>
            <div className={styles.formRow}>
              <label>Expiry date</label>
              <input type="date" value={draft.expiryDate} onChange={e => setDraft(d => ({ ...d, expiryDate: e.target.value }))} />
            </div>
          </div>
          <div className={styles.formRow}>
            <label>Target audience</label>
            <div className={styles.chipRow}>
              {AUDIENCES.map(a => (
                <button
                  key={a.key}
                  type="button"
                  className={`${styles.chip} ${draft.audience.includes(a.key) ? styles.chipActive : ''}`}
                  onClick={() => toggleAudience(a.key)}
                >{a.label}</button>
              ))}
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={draft.requiresAck} onChange={e => setDraft(d => ({ ...d, requiresAck: e.target.checked }))} />
              <span>Requires acknowledgement</span>
            </label>
          </div>
          <div className={styles.formActions}>
            <button className={styles.publishBtn} onClick={submitDraft} disabled={!draft.title.trim() || !draft.bodyMarkdown.trim()}>Publish</button>
          </div>
        </div>
      )}

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status</span>
          {['active', 'archived', 'all'].map(s => (
            <button key={s} className={`${styles.filterChip} ${filterStatus === s ? styles.filterChipActive : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Priority</span>
          {['all', ...PRIORITIES.map(p => p.key)].map(p => (
            <button key={p} className={`${styles.filterChip} ${filterPriority === p ? styles.filterChipActive : ''}`} onClick={() => setFilterPriority(p)}>{p}</button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Audience</span>
          {['all', ...AUDIENCES.map(a => a.key)].map(a => (
            <button key={a} className={`${styles.filterChip} ${filterAudience === a ? styles.filterChipActive : ''}`} onClick={() => setFilterAudience(a)}>{a}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No directives match the current filters.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(d => {
            const open = expandedId === d.id;
            const pr = (d.priority || 'medium').toLowerCase();
            return (
              <div key={d.id} className={`${styles.item} ${styles['priority_' + pr]}`}>
                <button className={styles.itemHeader} onClick={() => setExpandedId(open ? null : d.id)}>
                  <div className={styles.itemHeaderLeft}>
                    <span className={`${styles.priorityBadge} ${styles['badge_' + pr]}`}>{pr}</span>
                    <div>
                      <div className={styles.itemTitle}>{d.title}</div>
                      <div className={styles.itemMeta}>
                        {d.authorName || d.author || 'unknown'} · {fmtDate(d.createdAt || d.effectiveDate)}
                        {d.requiresAck && <span className={styles.ackTag}> · ack required</span>}
                        {(d.status || 'active') === 'archived' && <span className={styles.archivedTag}> · archived</span>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemHeaderRight}>
                    {(d.audience || []).map(a => (
                      <span key={a} className={styles.audienceTag}>{AUDIENCES.find(x => x.key === a)?.label || a}</span>
                    ))}
                    <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▾</span>
                  </div>
                </button>

                {open && (
                  <div className={styles.itemBody}>
                    <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: renderMarkdown(d.bodyMarkdown) }} />
                    <div className={styles.datesRow}>
                      {d.effectiveDate && <span>Effective: <strong>{fmtDate(d.effectiveDate)}</strong></span>}
                      {d.expiryDate && <span>Expires: <strong>{fmtDate(d.expiryDate)}</strong></span>}
                    </div>

                    <div className={styles.itemActions}>
                      {d.requiresAck && !ackedByMe(d) && (d.status || 'active') === 'active' && (
                        <button className={styles.ackBtn} onClick={() => acknowledge(d)}>Acknowledge</button>
                      )}
                      {d.requiresAck && ackedByMe(d) && (
                        <span className={styles.ackedBadge}>✓ You acknowledged</span>
                      )}
                      {(d.status || 'active') === 'active' && (
                        <button className={styles.archiveBtn} onClick={() => archive(d)}>Archive</button>
                      )}
                    </div>

                    {d.requiresAck && isManager && (d.acks || []).length > 0 && (
                      <div className={styles.ackList}>
                        <div className={styles.ackListTitle}>Acknowledged by ({d.acks.length})</div>
                        <ul>
                          {d.acks.map((a, i) => (
                            <li key={i}>{a.userName || a.userEmail} <span className={styles.ackTime}>{fmtDate(a.acknowledgedAt)}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {d.requiresAck && isManager && (d.acks || []).length === 0 && (
                      <div className={styles.ackList}>
                        <div className={styles.ackListTitle}>No acknowledgements yet</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
