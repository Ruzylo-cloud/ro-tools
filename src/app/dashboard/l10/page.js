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

  // Check if user is DM/Admin
  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      const role = d.profile?.role || '';
      if (['administrator', 'district_manager'].includes(role) && d.profile?.roleApproved) {
        setUserRole(role);
      }
    }).catch(() => {});
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
    } catch (err) {
      setValues({});
      setTimeFinished('');
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
      } else {
        setValues({});
        setTimeFinished('');
      }
      setDirty(false);
    } else if (!reviewMode) {
      load(week);
    }
  }, [week, reviewMode, selectedRO, allScorecards, load]);

  useEffect(() => {
    if (reviewMode) loadAll(week);
  }, [week, reviewMode, loadAll]);

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
        body: JSON.stringify({ week, values, grade, timeFinished: timeFinished || null }),
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
      </div>

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
              />
              <span className={styles.metricGoal}>Goal: 11:00 AM</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
