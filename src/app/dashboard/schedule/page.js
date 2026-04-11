'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toISODate(d) {
  const z = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return z.toISOString().split('T')[0];
}

// Start-of-week = Sunday (matches JM conventions)
function startOfWeek(d) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d, n) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function fmtWeekLabel(weekStart) {
  const end = addDays(weekStart, 6);
  const a = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const b = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${a} – ${b}`;
}

function fmtTime(t) {
  if (!t) return '';
  // accept "HH:MM" or "HH:MM:SS"
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h)) return t;
  const period = h >= 12 ? 'p' : 'a';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m || 0).padStart(2, '0')}${period}`;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shifts, setShifts] = useState([]);

  const weekStartStr = toISODate(weekStart);
  const todayStr = toISODate(new Date());

  const loadWeek = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/mc/schedule?week_start=${weekStartStr}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setShifts(Array.isArray(data.shifts) ? data.shifts : []);
    } catch (err) {
      setShifts([]);
      setError(err.message || 'Failed to load schedule');
    }
    setLoading(false);
  }, [weekStartStr]);

  useEffect(() => { if (user) loadWeek(); }, [user, loadWeek]);

  // Group shifts by employee then by date
  const { employees, byKey } = useMemo(() => {
    const empMap = new Map();
    const keyed = new Map();
    for (const s of shifts) {
      const id = s.employee_id;
      if (!empMap.has(id)) empMap.set(id, { id, name: s.employee_name || `Employee ${id}` });
      const k = `${id}|${s.date}`;
      if (!keyed.has(k)) keyed.set(k, []);
      keyed.get(k).push(s);
    }
    return {
      employees: Array.from(empMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      byKey: keyed,
    };
  }, [shifts]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      return { date: toISODate(d), dow: d.getDay(), monthDay: d.getDate(), obj: d };
    });
  }, [weekStart]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Weekly Schedule</h1>
          <p className={styles.subtitle}>Read-only view of the published schedule from Mission Control.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.navBtn} onClick={() => setWeekStart(addDays(weekStart, -7))}>&larr; Prev</button>
        <div className={styles.weekLabel}>{fmtWeekLabel(weekStart)}</div>
        <button className={styles.navBtn} onClick={() => setWeekStart(addDays(weekStart, 7))}>Next &rarr;</button>
        <button className={styles.todayBtn} onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
      </div>

      {error && <div className={styles.errorBox}>Error: {error}</div>}

      {loading ? (
        <div className={styles.empty}>Loading schedule…</div>
      ) : employees.length === 0 ? (
        <div className={styles.empty}>
          No published shifts found for this week.
          {error ? '' : ' Publish the schedule in Mission Control to see it here.'}
        </div>
      ) : (
        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            <div className={styles.gridHeader}>Employee</div>
            {days.map(d => (
              <div
                key={d.date}
                className={`${styles.gridHeader} ${styles.gridDayHeader} ${d.date === todayStr ? styles.gridDayHeaderToday : ''}`}
              >
                <span className={styles.gridDayName}>{DAY_NAMES[d.dow]}</span>
                <span className={styles.gridDayDate}>{d.monthDay}</span>
              </div>
            ))}
            {employees.map(emp => (
              <div key={emp.id} style={{ display: 'contents' }}>
                <div className={styles.employeeCell}>{emp.name}</div>
                {days.map(d => {
                  const list = byKey.get(`${emp.id}|${d.date}`) || [];
                  return (
                    <div key={d.date} className={styles.dayCell}>
                      {list.map(s => {
                        const color = s.position_color || '#134A7C';
                        return (
                          <div
                            key={s.id}
                            className={styles.shiftBlock}
                            style={{ background: color }}
                            title={`${s.position_name || ''} ${fmtTime(s.start_time)}–${fmtTime(s.end_time)}`}
                          >
                            <div className={styles.shiftBlockTime}>{fmtTime(s.start_time)}–{fmtTime(s.end_time)}</div>
                            {s.position_name && <div className={styles.shiftBlockPos}>{s.position_name}</div>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
