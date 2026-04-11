'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function pct(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function progressColor(p, overdue, status) {
  if (overdue && status !== 'completed') return '#EE3227';
  if (status === 'completed' || p >= 100) return '#16a34a';
  if (p >= 60) return '#d97706';
  return '#134A7C';
}

function fmtShort(dt) {
  if (!dt) return '';
  try {
    return new Date(dt.includes('T') ? dt : dt.replace(' ', 'T')).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch { return dt; }
}

export default function ChecklistsPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null); // instance_id
  const [detail, setDetail] = useState(null);     // { instance, items }
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/mc/checklists?date=${date}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setInstances(Array.isArray(data.instances) ? data.instances : []);
    } catch (err) {
      setInstances([]);
      setError(err.message || 'Failed to load checklists');
    }
    setLoading(false);
  }, [date]);

  useEffect(() => { if (user) load(); }, [user, load]);

  const loadDetail = async (id) => {
    setDetailLoading(true); setDetail(null);
    try {
      const res = await fetch(`/api/mc/checklists?instance_id=${id}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail({ instance: null, items: [] });
    }
    setDetailLoading(false);
  };

  const handleExpand = (inst) => {
    if (expanded === inst.id) {
      setExpanded(null); setDetail(null); return;
    }
    setExpanded(inst.id);
    loadDetail(inst.id);
  };

  const stats = useMemo(() => {
    const total = instances.length;
    const completed = instances.filter(i => i.status === 'completed').length;
    const overdue = instances.filter(i => i.is_overdue === 1 && i.status !== 'completed').length;
    const inProgress = instances.filter(i => i.status === 'in_progress').length;
    return { total, completed, overdue, inProgress };
  }, [instances]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily Checklists</h1>
          <p className={styles.subtitle}>Live view of checklist progress from Mission Control. Click a card to expand items.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button className={styles.navBtn} onClick={() => setDate(todayStr())}>Today</button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.completed}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.inProgress}</div>
          <div className={styles.statLabel}>In Progress</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${stats.overdue > 0 ? styles.statAlert : ''}`}>{stats.overdue}</div>
          <div className={styles.statLabel}>Overdue</div>
        </div>
      </div>

      {error && <div className={styles.errorBox}>Error: {error}</div>}

      {loading ? (
        <div className={styles.empty}>Loading checklists…</div>
      ) : instances.length === 0 ? (
        <div className={styles.empty}>No checklists found for {date}.</div>
      ) : (
        <div className={styles.cards}>
          {instances.map(inst => {
            const p = pct(inst.completed_items, inst.total_items);
            const overdue = inst.is_overdue === 1 && inst.status !== 'completed';
            const bg = progressColor(p, overdue, inst.status);
            const isExpanded = expanded === inst.id;
            return (
              <div
                key={inst.id}
                className={`${styles.card} ${isExpanded ? styles.cardActive : ''}`}
                onClick={() => handleExpand(inst)}
              >
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardName}>{inst.template_name || `Checklist #${inst.id}`}</div>
                    {inst.template_type && <div className={styles.cardType}>{inst.template_type}</div>}
                  </div>
                </div>

                <div className={styles.progressWrap}>
                  <div className={styles.progressText}>
                    <span>{inst.completed_items || 0} / {inst.total_items || 0} items</span>
                    <span>{p}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${p}%`, background: bg }} />
                  </div>
                </div>

                <div className={styles.badges}>
                  {inst.status === 'completed' && <span className={`${styles.badge} ${styles.badgeCompleted}`}>Completed</span>}
                  {inst.status === 'in_progress' && <span className={`${styles.badge} ${styles.badgeInProgress}`}>In Progress</span>}
                  {inst.status === 'draft' && <span className={`${styles.badge} ${styles.badgeDraft}`}>Draft</span>}
                  {overdue && <span className={`${styles.badge} ${styles.badgeOverdue}`}>Overdue</span>}
                  {inst.assigned_to_name && <span className={`${styles.badge} ${styles.badgeAssignee}`}>{inst.assigned_to_name}</span>}
                </div>

                {isExpanded && (
                  <div className={styles.detail} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.detailTitle}>Items</div>
                    {detailLoading ? (
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Loading…</div>
                    ) : !detail || !detail.items || detail.items.length === 0 ? (
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>No items returned.</div>
                    ) : (
                      detail.items.map(it => {
                        const done = it.status === 'completed';
                        return (
                          <div key={it.id} className={styles.itemRow}>
                            <span className={`${styles.itemCheck} ${done ? styles.itemCheckDone : styles.itemCheckPending}`}>{done ? '✓' : ''}</span>
                            <div className={styles.itemText}>
                              {it.item_name}
                              <div className={styles.itemMeta}>
                                {done && it.completed_at ? `Done ${fmtShort(it.completed_at)}` : 'Pending'}
                                {it.temperature != null ? ` · ${it.temperature}°${it.temp_status ? ` (${it.temp_status})` : ''}` : ''}
                                {it.photo_data ? ' · photo' : ''}
                                {it.notes ? ` · ${String(it.notes).slice(0, 80)}` : ''}
                              </div>
                            </div>
                          </div>
                        );
                      })
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
