'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

/**
 * L10 Weekly Scorecard — 30 metrics across 5 categories.
 * ROs fill this out every Monday; DM reviews it in L10 meeting.
 * DMs/Admins can switch between stores to review all scorecards.
 * Data persists via /api/l10 (JSON on GCS volume).
 */

// ── Week helpers ───────────────────────────────────────────
// Week 1 starts 2025-12-29 (Mon). Each week is 7 days.
const WEEK_1_START = new Date('2025-12-29T00:00:00');

function getWeekDates(weekNum) {
  const start = new Date(WEEK_1_START);
  start.setDate(start.getDate() + (weekNum - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

function getCurrentWeek() {
  const now = new Date();
  const diff = now - WEEK_1_START;
  return Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

// ── Metric definitions ─────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Sales',
    metrics: [
      { key: 'weeklySales', label: 'Weekly Sales', goal: 'Varies', type: 'currency', evaluate: () => null },
      { key: 'projectedSales', label: 'Projected Sales', goal: 'Varies', type: 'currency', evaluate: () => null },
      { key: 'actualVsScheduled', label: 'Actual vs. Scheduled Hours', goal: '0 or negative', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) <= 0 : null },
      { key: 'refundValue', label: 'Refund Value', goal: '$0', type: 'currency', evaluate: (v) => v !== '' ? parseFloat(v) === 0 : null },
    ],
  },
  {
    name: 'People',
    metrics: [
      { key: 'certifiedRO', label: 'Certified RO (Phase 1, 2, 3, S.Safe)', goal: '1', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) >= 1 : null },
      { key: 'certifiedARO', label: 'Certified ARO (Phase 1, Phase 3)', goal: '1', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) >= 1 : null },
      { key: 'shiftLeads', label: 'Shift Leads in Addition to RO & ARO (Phase 1)', goal: '3+', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) >= 3 : null },
      { key: 'stabilityShifts', label: 'Shifts +/- from Stability Snapshot Sheet', goal: '10+', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) >= 10 : null },
      { key: 'roHours', label: 'RO Hours Clocked In', goal: '35+', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) >= 35 : null },
      { key: 'roOnTime', label: 'RO On Time Percentage', goal: '100%', type: 'percent', evaluate: (v) => v !== '' ? parseFloat(v) >= 100 : null },
      { key: 'stabilityUpdated', label: 'Stability Snapshot Updated', goal: 'Y', type: 'yn', evaluate: (v) => v === 'Y' ? true : v === 'N' ? false : null },
      { key: 'timesheetEdits', label: 'Timesheet Edits', goal: '3 or less', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) <= 3 : null },
      { key: 'correctionForms', label: 'All Timesheets Edited w/ Correction Forms', goal: 'Y', type: 'yn', evaluate: (v) => v === 'Y' ? true : v === 'N' ? false : null },
      { key: 'callOutSheet', label: 'Call Out Sheet Updated', goal: 'Y', type: 'yn', evaluate: (v) => v === 'Y' ? true : v === 'N' ? false : null },
      { key: 'correctiveActions', label: 'Corrective Actions Signed w/ DM & Loaded to Drive', goal: 'Y or N/A', type: 'yna', evaluate: (v) => v === 'Y' || v === 'NA' ? true : v === 'N' ? false : null },
    ],
  },
  {
    name: 'Operations',
    metrics: [
      { key: 'missedAttestations', label: 'Missed Attestations', goal: '0', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) === 0 : null },
      { key: 'attestationForms', label: 'Attestation Correction Forms Completed', goal: 'Y or N/A', type: 'yna', evaluate: (v) => v === 'Y' || v === 'NA' ? true : v === 'N' ? false : null },
      { key: 'noAnswers', label: '"No" Answers to Attestation Questions', goal: '0', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) === 0 : null },
    ],
  },
  {
    name: 'Reporting',
    metrics: [
      { key: 'deepClean', label: 'Last Deep Clean Evaluation', goal: '90%+', type: 'percent', evaluate: (v) => v !== '' ? parseFloat(v) >= 90 : null },
      { key: 'mysteryShopper', label: 'Last Mystery Shopper Score', goal: '90%+', type: 'percent', evaluate: (v) => v !== '' ? parseFloat(v) >= 90 : null },
      { key: 'steritech', label: 'Steritech Score', goal: 'Varies', type: 'number', evaluate: () => null },
      { key: 'throughputGoal', label: 'Throughput Goal Reached', goal: 'Y', type: 'yn', evaluate: (v) => v === 'Y' ? true : v === 'N' ? false : null },
      { key: 'foodWaste', label: 'Total Food Waste Goal Reached on KGB', goal: 'Y', type: 'yn', evaluate: (v) => v === 'Y' ? true : v === 'N' ? false : null },
    ],
  },
  {
    name: 'Profitability',
    metrics: [
      { key: 'bph', label: 'BPH (Bread Per Hour)', goal: '4.1+', type: 'number', evaluate: (v) => v !== '' ? parseFloat(v) >= 4.1 : null },
      { key: 'laborPct', label: 'Labor %', goal: 'Tier 3 or under', type: 'percent', evaluate: (v) => v !== '' ? parseFloat(v) <= 30 : null },
      { key: 'avtVariance', label: 'AvT Variance', goal: '-1% to -2%', type: 'percent', evaluate: (v) => { if (v === '') return null; const n = parseFloat(v); return n >= -2 && n <= -1; } },
      { key: 'cogs', label: 'COGS', goal: '22%–25%', type: 'percent', evaluate: (v) => { if (v === '') return null; const n = parseFloat(v); return n >= 22 && n <= 25; } },
      { key: 'salesVsLY', label: 'Sales Higher Than Last Year', goal: 'Above 0%', type: 'percent', evaluate: (v) => v !== '' ? parseFloat(v) > 0 : null },
      { key: 'ebitda', label: 'EBITDA', goal: '10%+', type: 'percent', evaluate: (v) => v !== '' ? parseFloat(v) >= 10 : null },
    ],
  },
];

const ALL_METRICS = CATEGORIES.flatMap(c => c.metrics);

export default function L10Page() {
  const { user } = useAuth();
  const [week, setWeek] = useState(getCurrentWeek());
  const [values, setValues] = useState({});
  const [timeFinished, setTimeFinished] = useState('');
  const [rocks, setRocks] = useState([]); // { id, title, owner, status: 'on-track'|'off-track'|'done' }
  const [ids, setIds] = useState([]);     // { id, issue, discussion, solution, resolved }
  const [todos, setTodos] = useState([]); // { id, text, owner, done, createdAt }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState(null);

  // DM/Admin review mode
  const [reviewMode, setReviewMode] = useState(false);
  const [allScorecards, setAllScorecards] = useState([]);
  const [selectedRO, setSelectedRO] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState(null); // status of viewed scorecard

  // History
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Check if user is DM/Admin
  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      const role = d.profile?.role || '';
      if (['administrator', 'district_manager'].includes(role) && d.profile?.roleApproved) {
        setUserRole(role);
      }
    }).catch((e) => { console.debug('[l10] role check failed (non-fatal):', e); });
  }, []);

  // Load all scorecards for DM review
  const loadAll = useCallback(async (w) => {
    try {
      const res = await fetch(`/api/l10?week=${w}&all=true`);
      if (!res.ok) return;
      const data = await res.json();
      setAllScorecards(data.scorecards || []);
    } catch { setAllScorecards([]); }
  }, []);

  const load = useCallback(async (w) => {
    setLoading(true);
    setSaved(false);
    setDirty(false);
    setError(null);
    try {
      const res = await fetch(`/api/l10?week=${w}`);
      if (!res.ok) throw new Error('Failed to load scorecard');
      const data = await res.json();
      setValues(data.values || {});
      setTimeFinished(data.timeFinished || '');
      setRocks(Array.isArray(data.rocks) ? data.rocks : []);
      setIds(Array.isArray(data.ids) ? data.ids : []);
      setTodos(Array.isArray(data.todos) ? data.todos : []);
    } catch (err) {
      setValues({});
      setTimeFinished('');
      setRocks([]);
      setIds([]);
      setTodos([]);
      setError('Could not load scorecard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reviewMode && selectedRO) {
      const card = allScorecards.find(c => c.email === selectedRO);
      if (card) {
        setValues(card.values || {});
        setTimeFinished(card.timeFinished || '');
        setRocks(Array.isArray(card.rocks) ? card.rocks : []);
        setIds(Array.isArray(card.ids) ? card.ids : []);
        setTodos(Array.isArray(card.todos) ? card.todos : []);
      } else {
        setValues({});
        setTimeFinished('');
        setRocks([]);
        setIds([]);
        setTodos([]);
      }
      setDirty(false);
    } else if (!reviewMode) {
      load(week);
    }
  }, [week, reviewMode, selectedRO, allScorecards, load]);

  useEffect(() => {
    if (reviewMode) loadAll(week);
  }, [week, reviewMode, loadAll]);

  // Load history
  useEffect(() => {
    if (showHistory) {
      fetch('/api/l10?history=true').then(r => r.json()).then(d => setHistory(d.history || [])).catch((e) => { console.debug('[l10] history load failed (non-fatal):', e); });
    }
  }, [showHistory]);

  // Track review status of selected scorecard
  useEffect(() => {
    if (reviewMode && selectedRO) {
      const card = allScorecards.find(c => c.email === selectedRO);
      setReviewStatus(card?.status || 'submitted');
    }
  }, [reviewMode, selectedRO, allScorecards]);

  // DM review action
  const submitReview = async (status) => {
    if (!selectedRO) return;
    try {
      const res = await fetch('/api/l10', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'review', week, targetEmail: selectedRO, status, comment: reviewComment }),
      });
      if (res.ok) {
        setReviewComment('');
        await loadAll(week);
      }
    } catch { setError('Review failed'); }
  };

  const setValue = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setDirty(true);
    setSaved(false);
  };

  // Grade calculation
  const { grade, greenCount, redCount, totalGraded } = useMemo(() => {
    let green = 0, red = 0, total = 0;
    for (const m of ALL_METRICS) {
      const result = m.evaluate(values[m.key] ?? '');
      if (result === null) continue;
      total++;
      if (result) green++; else red++;
    }
    const pct = total > 0 ? Math.round((green / total) * 100) : 0;
    return { grade: pct, greenCount: green, redCount: red, totalGraded: total };
  }, [values]);

  const gradeColor = grade >= 80 ? '#16a34a' : grade >= 60 ? '#f59e0b' : '#dc2626';

  const save = async () => {
    if (reviewMode) return; // Can't save in review mode
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/l10', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week, values, grade, timeFinished: timeFinished || null, rocks, ids, todos }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Save failed');
      }
      setSaved(true);
      setDirty(false);
    } catch (err) {
      setError(err.message || 'Failed to save scorecard. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── EOS list helpers (rocks / IDS / todos) ───────────────
  const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const addRock = () => { setRocks(r => [...r, { id: uid(), title: '', owner: '', status: 'on-track' }]); setDirty(true); setSaved(false); };
  const updateRock = (id, patch) => { setRocks(r => r.map(x => x.id === id ? { ...x, ...patch } : x)); setDirty(true); setSaved(false); };
  const removeRock = (id) => { setRocks(r => r.filter(x => x.id !== id)); setDirty(true); setSaved(false); };

  const addIds = () => { setIds(list => [...list, { id: uid(), issue: '', discussion: '', solution: '', resolved: false }]); setDirty(true); setSaved(false); };
  const updateIds = (id, patch) => { setIds(list => list.map(x => x.id === id ? { ...x, ...patch } : x)); setDirty(true); setSaved(false); };
  const removeIds = (id) => { setIds(list => list.filter(x => x.id !== id)); setDirty(true); setSaved(false); };

  // Auto-calc: pull stability snapshot for the current user's store and
  // prefill the two L10 metrics that are derived from it.
  const [autoCalcMsg, setAutoCalcMsg] = useState('');
  const pullFromStability = async () => {
    setAutoCalcMsg('Pulling from Stability Snapshot…');
    try {
      const [snapRes, profRes] = await Promise.all([
        fetch('/api/mc/stability/snapshot'),
        fetch('/api/profile'),
      ]);
      const snap = await snapRes.json().catch(() => ({}));
      const prof = await profRes.json().catch(() => ({}));
      const myStore = String(prof.profile?.storeNumber || '').trim();
      const snapshots = Array.isArray(snap.snapshots) ? snap.snapshots : [];
      let mine = null;
      if (myStore) mine = snapshots.find(s => String(s.storeNumber) === myStore);
      // Metric: stabilityShifts = filled count minus open count (above baseline)
      // Metric: stabilityUpdated = Y if we got a real snapshot back for this store
      let next = { ...values };
      if (mine) {
        next.stabilityShifts = String(mine.filledCount || 0);
        next.stabilityUpdated = 'Y';
        setAutoCalcMsg(`Filled from store ${myStore}: ${mine.filledCount}/${mine.totalSlots} slots filled.`);
      } else {
        // Portfolio fallback: use summary
        if (snap.summary) {
          next.stabilityShifts = String(snap.summary.filledSlots || 0);
          next.stabilityUpdated = 'Y';
          setAutoCalcMsg(`Portfolio roll-up: ${snap.summary.filledSlots}/${snap.summary.totalSlots} slots filled.`);
        } else {
          setAutoCalcMsg('No stability data available from Mission Control.');
        }
      }
      setValues(next);
      setDirty(true);
      setSaved(false);
    } catch (e) {
      setAutoCalcMsg('Could not pull from Stability Snapshot.');
    }
  };

  const addTodo = () => { setTodos(t => [...t, { id: uid(), text: '', owner: '', done: false, createdAt: new Date().toISOString() }]); setDirty(true); setSaved(false); };
  const updateTodo = (id, patch) => { setTodos(t => t.map(x => x.id === id ? { ...x, ...patch } : x)); setDirty(true); setSaved(false); };
  const removeTodo = (id) => { setTodos(t => t.filter(x => x.id !== id)); setDirty(true); setSaved(false); };

  const changeWeek = (delta) => {
    const next = week + delta;
    if (next >= 1 && next <= 52) setWeek(next);
  };

  let metricCounter = 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className={styles.title}>L10 Weekly Scorecard</h1>
            <p className={styles.subtitle}>
              {reviewMode
                ? 'Reviewing RO scorecards. Select a store to review.'
                : 'Fill out your weekly metrics every Monday. Green = goal met, Red = missed.'}
            </p>
          </div>
          {userRole && (
            <button
              onClick={() => { setReviewMode(!reviewMode); setSelectedRO(''); }}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: reviewMode ? '2px solid var(--jm-blue)' : '1px solid var(--border)',
                background: reviewMode ? 'rgba(19,74,124,0.08)' : '#fff',
                color: reviewMode ? 'var(--jm-blue)' : 'var(--gray-500)',
              }}
            >
              {reviewMode ? 'Back to My Scorecard' : 'Review All Stores'}
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>x</button>
        </div>
      )}

      {/* DM Store Selector */}
      {reviewMode && (
        <div style={{ padding: '14px 16px', background: 'rgba(19,74,124,0.04)', border: '1px solid rgba(19,74,124,0.15)', borderRadius: 10, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--jm-blue)' }}>Reviewing:</label>
          <select
            value={selectedRO}
            onChange={e => setSelectedRO(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', minWidth: 220 }}
          >
            <option value="">Select an RO...</option>
            {allScorecards.map(c => (
              <option key={c.email} value={c.email}>{c.name || c.email} — Grade: {c.grade || 0}%</option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
            {allScorecards.length} scorecard{allScorecards.length !== 1 ? 's' : ''} submitted for Week {week}
          </span>
        </div>
      )}

      {/* Week selector */}
      <div className={styles.weekBar}>
        <button className={styles.weekBtn} onClick={() => changeWeek(-1)} disabled={week <= 1}>&#8249;</button>
        <div>
          <span className={styles.weekLabel}>Week {week}</span>
          <span className={styles.weekDates}> ({getWeekDates(week)})</span>
        </div>
        <button className={styles.weekBtn} onClick={() => changeWeek(1)} disabled={week >= 52}>&#8250;</button>
        {!reviewMode && (
          <button
            className={styles.saveBtn}
            onClick={save}
            disabled={saving || !dirty}
          >
            {saving ? 'Saving...' : 'Save Scorecard'}
          </button>
        )}
        {saved && <span className={styles.savedMsg}>Saved</span>}
        {!reviewMode && (
          <button
            onClick={pullFromStability}
            title="Auto-fill stability-related metrics from Mission Control"
            style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--jm-blue)', background: 'rgba(19,74,124,0.06)', color: 'var(--jm-blue)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Pull from Stability
          </button>
        )}
      </div>
      {autoCalcMsg && (
        <div style={{ marginBottom: 12, padding: '8px 14px', background: 'rgba(19,74,124,0.06)', border: '1px solid rgba(19,74,124,0.18)', borderRadius: 8, fontSize: 12, color: 'var(--jm-blue)', fontWeight: 600 }}>
          {autoCalcMsg}
        </div>
      )}

      {/* Grade card */}
      <div className={styles.gradeCard}>
        <div className={styles.gradeCircle} style={{ background: gradeColor }}>
          {loading ? '–' : `${grade}%`}
        </div>
        <div className={styles.gradeInfo}>
          <div className={styles.gradeTitle}>Overall Grade</div>
          <div className={styles.gradeBar}>
            <div className={styles.gradeFill} style={{ width: `${grade}%`, background: gradeColor }} />
          </div>
          <div className={styles.gradeMeta}>
            <span className={styles.gradeStat}><span className={styles.greenDot} /> {greenCount} met</span>
            <span className={styles.gradeStat}><span className={styles.redDot} /> {redCount} missed</span>
            <span className={styles.gradeStat}>{totalGraded} / {ALL_METRICS.length} graded</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>Loading...</div>
      ) : (
        <>
          {CATEGORIES.map(cat => {
            const catGreen = cat.metrics.filter(m => m.evaluate(values[m.key] ?? '') === true).length;
            const catTotal = cat.metrics.filter(m => m.evaluate(values[m.key] ?? '') !== null).length;
            return (
              <div key={cat.name} className={styles.category}>
                <div className={styles.catHeader}>
                  <span className={styles.catTitle}>{cat.name}</span>
                  <span
                    className={styles.catBadge}
                    style={{
                      background: catTotal > 0 && catGreen === catTotal
                        ? 'rgba(22,163,74,0.12)' : catTotal > 0
                          ? 'rgba(220,38,38,0.08)' : 'var(--gray-100)',
                      color: catTotal > 0 && catGreen === catTotal
                        ? '#16a34a' : catTotal > 0
                          ? '#dc2626' : 'var(--gray-400)',
                    }}
                  >
                    {catGreen}/{catTotal}
                  </span>
                </div>
                <div className={styles.catBody}>
                  {cat.metrics.map(m => {
                    metricCounter++;
                    const val = values[m.key] ?? '';
                    const result = m.evaluate(val);
                    const statusClass = result === true ? styles.metricGreen
                      : result === false ? styles.metricRed
                        : styles.metricNeutral;
                    const statusIcon = result === true ? '✓' : result === false ? '✗' : '–';

                    return (
                      <div key={m.key} className={styles.metricRow}>
                        <span className={styles.metricNum}>{metricCounter}</span>
                        <span className={styles.metricLabel}>{m.label}</span>
                        <span className={styles.metricGoal}>Goal: {m.goal}</span>

                        {m.type === 'yn' && (
                          <select
                            className={styles.metricSelect}
                            value={val}
                            onChange={e => setValue(m.key, e.target.value)}
                          >
                            <option value="">—</option>
                            <option value="Y">Yes</option>
                            <option value="N">No</option>
                          </select>
                        )}

                        {m.type === 'yna' && (
                          <select
                            className={styles.metricSelect}
                            value={val}
                            onChange={e => setValue(m.key, e.target.value)}
                          >
                            <option value="">—</option>
                            <option value="Y">Yes</option>
                            <option value="N">No</option>
                            <option value="NA">N/A</option>
                          </select>
                        )}

                        {(m.type === 'number' || m.type === 'currency' || m.type === 'percent') && (
                          <input
                            className={styles.metricInput}
                            type="number"
                            step="any"
                            placeholder={m.type === 'currency' ? '$0' : m.type === 'percent' ? '0%' : '0'}
                            value={val}
                            onChange={e => setValue(m.key, e.target.value)}
                          />
                        )}

                        <div className={`${styles.metricStatus} ${statusClass}`}>{statusIcon}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Time finished */}
          <div className={styles.category}>
            <div className={styles.timeRow}>
              <span className={styles.timeLabel}>Time Finished</span>
              <input
                className={styles.metricInput}
                type="time"
                value={timeFinished}
                onChange={e => { setTimeFinished(e.target.value); setDirty(true); setSaved(false); }}
                disabled={reviewMode}
              />
              <span className={styles.metricGoal}>Goal: 11:00 AM</span>
            </div>
          </div>

          {/* ── Rocks (quarterly priorities) ── */}
          <div className={styles.category}>
            <div className={styles.catHeader}>
              <span className={styles.catTitle}>Rocks</span>
              <span className={styles.catBadge}>{rocks.filter(r => r.status === 'done').length}/{rocks.length}</span>
            </div>
            <div className={styles.catBody} style={{ padding: 12 }}>
              {rocks.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '8px 0' }}>No rocks yet. Add a quarterly priority.</div>
              )}
              {rocks.map(rock => (
                <div key={rock.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', flexWrap: 'wrap' }}>
                  <input
                    placeholder="Rock / priority"
                    value={rock.title}
                    onChange={e => updateRock(rock.id, { title: e.target.value })}
                    disabled={reviewMode}
                    style={{ flex: '2 1 220px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                  />
                  <input
                    placeholder="Owner"
                    value={rock.owner}
                    onChange={e => updateRock(rock.id, { owner: e.target.value })}
                    disabled={reviewMode}
                    style={{ flex: '1 1 120px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                  />
                  <select
                    value={rock.status}
                    onChange={e => updateRock(rock.id, { status: e.target.value })}
                    disabled={reviewMode}
                    style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit' }}
                  >
                    <option value="on-track">On Track</option>
                    <option value="off-track">Off Track</option>
                    <option value="done">Done</option>
                  </select>
                  {!reviewMode && (
                    <button onClick={() => removeRock(rock.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16, padding: '4px 8px' }}>×</button>
                  )}
                </div>
              ))}
              {!reviewMode && (
                <button onClick={addRock} style={{ marginTop: 8, padding: '6px 14px', border: '1px dashed var(--jm-blue)', background: 'rgba(19,74,124,0.04)', color: 'var(--jm-blue)', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Add Rock</button>
              )}
            </div>
          </div>

          {/* ── IDS (Identify / Discuss / Solve) ── */}
          <div className={styles.category}>
            <div className={styles.catHeader}>
              <span className={styles.catTitle}>IDS — Issues</span>
              <span className={styles.catBadge}>{ids.filter(i => i.resolved).length}/{ids.length}</span>
            </div>
            <div className={styles.catBody} style={{ padding: 12 }}>
              {ids.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '8px 0' }}>No issues yet. Add one to Identify / Discuss / Solve.</div>
              )}
              {ids.map(item => (
                <div key={item.id} style={{ padding: '10px 12px', marginBottom: 8, border: '1px solid var(--border)', borderRadius: 8, background: item.resolved ? 'rgba(22,163,74,0.04)' : '#fff' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <input
                      type="checkbox"
                      checked={!!item.resolved}
                      onChange={e => updateIds(item.id, { resolved: e.target.checked })}
                      disabled={reviewMode}
                    />
                    <input
                      placeholder="Issue — what needs to be solved?"
                      value={item.issue}
                      onChange={e => updateIds(item.id, { issue: e.target.value })}
                      disabled={reviewMode}
                      style={{ flex: 1, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}
                    />
                    {!reviewMode && (
                      <button onClick={() => removeIds(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>×</button>
                    )}
                  </div>
                  <textarea
                    placeholder="Discussion notes"
                    value={item.discussion}
                    onChange={e => updateIds(item.id, { discussion: e.target.value })}
                    disabled={reviewMode}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', minHeight: 40, resize: 'vertical', boxSizing: 'border-box', marginBottom: 6 }}
                  />
                  <textarea
                    placeholder="Solution / action"
                    value={item.solution}
                    onChange={e => updateIds(item.id, { solution: e.target.value })}
                    disabled={reviewMode}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', minHeight: 40, resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              {!reviewMode && (
                <button onClick={addIds} style={{ marginTop: 4, padding: '6px 14px', border: '1px dashed var(--jm-blue)', background: 'rgba(19,74,124,0.04)', color: 'var(--jm-blue)', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Add Issue</button>
              )}
            </div>
          </div>

          {/* ── To-Dos ── */}
          <div className={styles.category}>
            <div className={styles.catHeader}>
              <span className={styles.catTitle}>To-Dos</span>
              <span className={styles.catBadge}>{todos.filter(t => t.done).length}/{todos.length}</span>
            </div>
            <div className={styles.catBody} style={{ padding: 12 }}>
              {todos.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '8px 0' }}>No to-dos yet. Add action items from the meeting.</div>
              )}
              {todos.map(todo => (
                <div key={todo.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', flexWrap: 'wrap' }}>
                  <input
                    type="checkbox"
                    checked={!!todo.done}
                    onChange={e => updateTodo(todo.id, { done: e.target.checked })}
                    disabled={reviewMode}
                  />
                  <input
                    placeholder="Action item"
                    value={todo.text}
                    onChange={e => updateTodo(todo.id, { text: e.target.value })}
                    disabled={reviewMode}
                    style={{ flex: '2 1 240px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.6 : 1 }}
                  />
                  <input
                    placeholder="Owner"
                    value={todo.owner}
                    onChange={e => updateTodo(todo.id, { owner: e.target.value })}
                    disabled={reviewMode}
                    style={{ flex: '1 1 120px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                  />
                  {!reviewMode && (
                    <button onClick={() => removeTodo(todo.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16, padding: '4px 8px' }}>×</button>
                  )}
                </div>
              ))}
              {!reviewMode && (
                <button onClick={addTodo} style={{ marginTop: 8, padding: '6px 14px', border: '1px dashed var(--jm-blue)', background: 'rgba(19,74,124,0.04)', color: 'var(--jm-blue)', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Add To-Do</button>
              )}
            </div>
          </div>

          {/* DM Review Actions */}
          {reviewMode && selectedRO && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--charcoal)', margin: 0 }}>Review Actions</h3>
                {reviewStatus && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                    background: reviewStatus === 'approved' ? 'rgba(22,163,74,0.1)' : reviewStatus === 'needs_revision' ? 'rgba(220,38,38,0.1)' : 'rgba(19,74,124,0.1)',
                    color: reviewStatus === 'approved' ? '#16a34a' : reviewStatus === 'needs_revision' ? '#dc2626' : 'var(--jm-blue)',
                  }}>
                    {reviewStatus === 'approved' ? 'Approved' : reviewStatus === 'needs_revision' ? 'Needs Revision' : 'Submitted'}
                  </span>
                )}
              </div>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Add a comment for the RO (optional)..."
                maxLength={1000}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', minHeight: 60, resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => submitReview('approved')}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => submitReview('needs_revision')}
                  style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #dc2626', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Needs Revision
                </button>
                {reviewComment && (
                  <button
                    onClick={() => submitReview('comment')}
                    style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', color: 'var(--gray-500)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Comment Only
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* History Toggle */}
      {!reviewMode && (
        <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{ background: 'none', border: 'none', color: 'var(--jm-blue)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {showHistory ? 'Hide History' : 'View Week History'}
          </button>

          {showHistory && (
            <div style={{ marginTop: 12 }}>
              {history.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>No scorecards submitted yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {history.map(h => (
                    <button
                      key={h.week}
                      onClick={() => { setWeek(h.week); setShowHistory(false); }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 14px', background: h.week === week ? 'rgba(19,74,124,0.06)' : '#fff',
                        border: `1px solid ${h.week === week ? 'var(--jm-blue)' : 'var(--border)'}`,
                        borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, textAlign: 'left', width: '100%',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--charcoal)' }}>Week {h.week}</span>
                        <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--gray-400)' }}>{getWeekDates(h.week)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                          background: h.status === 'approved' ? 'rgba(22,163,74,0.1)' : h.status === 'needs_revision' ? 'rgba(220,38,38,0.1)' : 'rgba(19,74,124,0.1)',
                          color: h.status === 'approved' ? '#16a34a' : h.status === 'needs_revision' ? '#dc2626' : 'var(--jm-blue)',
                        }}>
                          {h.status === 'approved' ? 'Approved' : h.status === 'needs_revision' ? 'Revision' : 'Submitted'}
                        </span>
                        <span style={{
                          fontWeight: 800, fontSize: 14,
                          color: h.grade >= 80 ? '#16a34a' : h.grade >= 60 ? '#f59e0b' : '#dc2626',
                        }}>
                          {h.grade}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
