'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function fmtTime(dt) {
  if (!dt) return '—';
  try {
    return new Date(dt.includes('T') ? dt : dt.replace(' ', 'T')).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch { return dt; }
}

function fmtDateShort(d) {
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('daily'); // daily | weekly | employee
  const [date, setDate] = useState(todayStr());
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [dRes, wRes] = await Promise.all([
        fetch(`/api/mc/reports?type=daily&date=${date}`),
        fetch(`/api/mc/reports?type=stats`),
      ]);
      if (!dRes.ok) {
        const body = await dRes.json().catch(() => ({}));
        throw new Error(body?.error || `Daily HTTP ${dRes.status}`);
      }
      if (!wRes.ok) {
        const body = await wRes.json().catch(() => ({}));
        throw new Error(body?.error || `Weekly HTTP ${wRes.status}`);
      }
      setDaily(await dRes.json());
      setWeekly(await wRes.json());
    } catch (err) {
      setDaily({ instances: [] });
      setWeekly({ total: 0, onTime: 0, late: 0, missed: 0, weekPct: 0, days: [] });
      setError(err.message || 'Failed to load reports');
    }
    setLoading(false);
  }, [date]);

  useEffect(() => { if (user) load(); }, [user, load]);

  const dailyStats = useMemo(() => {
    const instances = daily?.instances || [];
    const total = instances.length;
    const completed = instances.filter(i => i.status === 'completed').length;
    const late = instances.reduce((s, i) => s + (i.late_items || 0), 0);
    const avgScore = total > 0
      ? Math.round(instances.reduce((s, i) => s + (i.score || 0), 0) / total)
      : 0;
    return { total, completed, late, avgScore, completedPct: total > 0 ? Math.round((completed / total) * 100) : 0, instances };
  }, [daily]);

  // Aggregate per-employee from today's instances (assigned_to_name field)
  const employeeRows = useMemo(() => {
    const map = new Map();
    for (const inst of daily?.instances || []) {
      const name = inst.assigned_to_name || 'Unassigned';
      if (!map.has(name)) map.set(name, { name, completed: 0, inProgress: 0, total: 0, items: 0, itemsDone: 0, lastAt: null });
      const row = map.get(name);
      row.total++;
      row.items += inst.total_items || 0;
      row.itemsDone += inst.completed_items || 0;
      if (inst.status === 'completed') row.completed++;
      else if (inst.status === 'in_progress') row.inProgress++;
      if (inst.completed_at && (!row.lastAt || inst.completed_at > row.lastAt)) row.lastAt = inst.completed_at;
    }
    return Array.from(map.values()).sort((a, b) => b.completed - a.completed);
  }, [daily]);

  const days = weekly?.days || [];
  const maxDayTotal = Math.max(1, ...days.map(d => d.total || 0));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Completion Reports</h1>
          <p className={styles.subtitle}>Daily, weekly and per-employee checklist completion.</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'daily' ? styles.tabActive : ''}`} onClick={() => setTab('daily')}>Daily</button>
        <button className={`${styles.tab} ${tab === 'weekly' ? styles.tabActive : ''}`} onClick={() => setTab('weekly')}>Weekly Rollup</button>
        <button className={`${styles.tab} ${tab === 'employee' ? styles.tabActive : ''}`} onClick={() => setTab('employee')}>Per-Employee</button>
      </div>

      {(tab === 'daily' || tab === 'employee') && (
        <div className={styles.controls}>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      )}

      {error && <div className={styles.errorBox}>Error: {error}</div>}

      {loading && <div className={styles.section}><div className={styles.empty}>Loading…</div></div>}

      {!loading && tab === 'daily' && (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{dailyStats.total}</div>
              <div className={styles.statLabel}>Total Checklists</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statValue} ${styles.statGood}`}>{dailyStats.completedPct}%</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statValue} ${dailyStats.late > 0 ? styles.statAlert : ''}`}>{dailyStats.late}</div>
              <div className={styles.statLabel}>Late Items</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{dailyStats.avgScore}</div>
              <div className={styles.statLabel}>Avg Score</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Per-Checklist Breakdown — {date}</div>
            {dailyStats.instances.length === 0 ? (
              <div className={styles.empty}>No checklists for this date.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Checklist</th>
                    <th>Assigned</th>
                    <th className={styles.tRight}>Items</th>
                    <th className={styles.tRight}>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.instances.map(i => (
                    <tr key={i.id}>
                      <td><strong>{i.template_name || `#${i.id}`}</strong></td>
                      <td>{i.assigned_to_name || '—'}</td>
                      <td className={styles.tRight}>{i.completed_items || 0} / {i.total_items || 0}</td>
                      <td className={styles.tRight}>{i.score ?? 0}</td>
                      <td>
                        {i.status === 'completed'
                          ? <span className={styles.pillDone}>Complete</span>
                          : i.status === 'in_progress'
                            ? <span className={styles.pillPending}>In Progress</span>
                            : <span className={styles.pillMissed}>{i.status || 'Missed'}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {!loading && tab === 'weekly' && (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{weekly?.total ?? 0}</div>
              <div className={styles.statLabel}>Total (7d)</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statValue} ${styles.statGood}`}>{weekly?.onTime ?? 0}</div>
              <div className={styles.statLabel}>On Time</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statValue} ${(weekly?.late ?? 0) > 0 ? styles.statAlert : ''}`}>{weekly?.late ?? 0}</div>
              <div className={styles.statLabel}>Late</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statValue} ${(weekly?.missed ?? 0) > 0 ? styles.statAlert : ''}`}>{weekly?.missed ?? 0}</div>
              <div className={styles.statLabel}>Missed</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>7-Day Completion</div>
            {days.length === 0 ? (
              <div className={styles.empty}>No data returned.</div>
            ) : (
              <div className={styles.chartWrap}>
                <svg className={styles.chart} viewBox={`0 0 ${days.length * 80 + 40} 220`} preserveAspectRatio="none" role="img" aria-label="Weekly completion bar chart">
                  {/* gridlines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <line key={i} x1="40" x2={days.length * 80 + 30} y1={180 - p * 140} y2={180 - p * 140} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* y axis labels */}
                  {[0, 25, 50, 75, 100].map((v, i) => (
                    <text key={i} x="34" y={184 - (v / 100) * 140} textAnchor="end" fontSize="10" fill="#9ca3af">{v}%</text>
                  ))}
                  {days.map((d, i) => {
                    const h = ((d.pct || 0) / 100) * 140;
                    const x = 50 + i * 80;
                    const color = d.pct >= 90 ? '#16a34a' : d.pct >= 70 ? '#d97706' : d.pct > 0 ? '#dc2626' : '#cbd5e1';
                    return (
                      <g key={d.date}>
                        <rect x={x} y={180 - h} width="46" height={h} rx="4" fill={color} />
                        <text x={x + 23} y={178 - h - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{d.pct || 0}%</text>
                        <text x={x + 23} y="198" textAnchor="middle" fontSize="10" fill="#64748b">{fmtDateShort(d.date)}</text>
                        <text x={x + 23} y="212" textAnchor="middle" fontSize="9" fill="#94a3b8">{d.completed}/{d.total}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-500)' }}>
              Overall week completion: <strong style={{ color: 'var(--jm-blue)' }}>{weekly?.weekPct ?? 0}%</strong>
            </div>
          </div>
        </>
      )}

      {!loading && tab === 'employee' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Per-Employee — {date}</div>
          {employeeRows.length === 0 ? (
            <div className={styles.empty}>No employee activity for this date.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th className={styles.tRight}>Checklists</th>
                  <th className={styles.tRight}>Items Done</th>
                  <th className={styles.tRight}>Completed</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {employeeRows.map(r => (
                  <tr key={r.name}>
                    <td><strong>{r.name}</strong></td>
                    <td className={styles.tRight}>{r.total}</td>
                    <td className={styles.tRight}>{r.itemsDone} / {r.items}</td>
                    <td className={styles.tRight}>{r.completed}</td>
                    <td>{fmtTime(r.lastAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
