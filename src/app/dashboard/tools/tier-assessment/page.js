'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { STORE_DIRECTORY, getStoreLabel } from '@/lib/store-directory';
import styles from './page.module.css';

// Canonical 15-category fallback list. Keys MUST match the server-side
// rubric (M343/M346) and the iOS app. The rubric is also loaded at runtime
// from /api/mc/stability/rubric — that response is authoritative and will
// override this list once available.
const DEFAULT_CATEGORIES = [
  { key: 'reliability',     name: 'Reliability' },
  { key: 'urgency',         name: 'Urgency' },
  { key: 'sprinkling',      name: 'Sprinkling' },
  { key: 'hot_subs',        name: 'Hot Subs' },
  { key: 'wrapping',        name: 'Reg / Wrap' },
  { key: 'slicing',         name: 'Slicing' },
  { key: 'lms_completion',  name: 'LMS' },
  { key: 'coaching',        name: 'Coach / Example' },
  { key: 'growth',          name: 'Growth' },
  { key: 'cleanliness',     name: 'Cleanliness' },
  { key: 'food_handling',   name: 'Food Handling' },
  { key: 'communication',   name: 'Communication' },
  { key: 'decision_making', name: 'Decision Making' },
  { key: 'core_values',     name: 'Core Values' },
  { key: 'team_player',     name: 'Team Player' },
];

const TIERS = ['A', 'B', 'C', 'D'];
const TIER_DEFS = {
  A: 'Leadership Material',
  B: 'Good Employee',
  C: 'Needs Improvement',
  D: 'Action Required',
};
// Rank is used for sparkline height — A is highest.
const TIER_RANK = { A: 4, B: 3, C: 2, D: 1 };
// Priority order for tie-break: HIGHER tier wins (A before B before C before D).
const TIER_PRIORITY = ['A', 'B', 'C', 'D'];

function majorityTier(scores) {
  const tally = { A: 0, B: 0, C: 0, D: 0 };
  for (const v of Object.values(scores || {})) {
    if (v?.tier && tally[v.tier] !== undefined) tally[v.tier]++;
  }
  const max = Math.max(tally.A, tally.B, tally.C, tally.D);
  if (max === 0) return '';
  // Tie-break: higher tier wins (A > B > C > D).
  for (const t of TIER_PRIORITY) {
    if (tally[t] === max) return t;
  }
  return '';
}

export default function TierAssessmentPage() {
  const [tab, setTab] = useState('assess');
  const [storeId, setStoreId] = useState(STORE_DIRECTORY[0]?.id || '');
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [scores, setScores] = useState({}); // { categoryKey: { tier, notes } }
  const [override, setOverride] = useState('');
  const [assessorNotes, setAssessorNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [rubric, setRubric] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [mcEmployeeError, setMcEmployeeError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load employees for the selected store
  useEffect(() => {
    setLoading(true);
    fetch(`/api/employees?store=${storeId}`)
      .then(r => r.json())
      .then(d => {
        const list = d.employees || [];
        setEmployees(list);
        setMcEmployeeError(list.length === 0 ? 'No employees returned from Mission Control for this store.' : null);
        if (list.length > 0 && !list.some(e => String(e.id) === String(employeeId))) {
          setEmployeeId(String(list[0].id));
        }
      })
      .catch((e) => { setMcEmployeeError(String(e?.message || e)); })
      .finally(() => setLoading(false));
  }, [storeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load rubric once. The rubric response is authoritative for category
  // names and ordering — we fall back to DEFAULT_CATEGORIES only if the
  // API is unreachable.
  useEffect(() => {
    fetch('/api/mc/stability/rubric')
      .then(r => r.json())
      .then(d => setRubric(Array.isArray(d.rubric) ? d.rubric : []))
      .catch(() => setRubric([]));
  }, []);

  // Canonical category list: prefer live rubric, fall back to defaults.
  const categories = useMemo(() => {
    if (Array.isArray(rubric) && rubric.length > 0) {
      return rubric
        .slice()
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(r => ({ key: r.category_key, name: r.category_name || r.category_key }));
    }
    return DEFAULT_CATEGORIES;
  }, [rubric]);

  // Load history when employee changes
  const loadHistory = useCallback(() => {
    if (!employeeId) { setHistory([]); return; }
    fetch(`/api/mc/stability/assessments?employee_id=${employeeId}`)
      .then(r => r.json())
      .then(d => setHistory(Array.isArray(d.assessments) ? d.assessments : []))
      .catch(() => setHistory([]));
  }, [employeeId]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const updateScore = (categoryKey, tier) => {
    setScores(prev => ({ ...prev, [categoryKey]: { ...(prev[categoryKey] || {}), tier } }));
  };
  const updateNote = (categoryKey, notes) => {
    setScores(prev => ({ ...prev, [categoryKey]: { ...(prev[categoryKey] || {}), notes } }));
  };

  const computedTier = useMemo(() => majorityTier(scores), [scores]);
  const finalTier = override || computedTier;

  const completedCount = Object.values(scores).filter(v => v?.tier).length;

  const submit = async () => {
    if (!employeeId) { setMessage('Pick an employee first.'); return; }
    if (!finalTier) { setMessage('Score at least one category before submitting.'); return; }
    setSubmitting(true);
    setMessage('');
    try {
      const employeeName = employees.find(e => String(e.id) === String(employeeId))?.name || '';
      const category_scores = Object.entries(scores)
        .filter(([, v]) => v?.tier)
        .map(([k, v]) => ({ category_key: k, tier: v.tier, notes: v.notes || '' }));
      const res = await fetch('/api/mc/stability/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: Number(employeeId),
          employee_name: employeeName,
          overall_tier: finalTier,
          category_scores,
          assessor_notes: assessorNotes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage(data.mcOk ? 'Submitted to Mission Control.' : 'Saved locally (MC unreachable).');
        // Reset + reload history
        setScores({});
        setOverride('');
        setAssessorNotes('');
        loadHistory();
      } else {
        setMessage(data.error || 'Failed to submit.');
      }
    } catch (e) {
      setMessage(String(e?.message || e));
    } finally {
      setSubmitting(false);
    }
  };

  const sparklineData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .slice(-10)
      .map(h => {
        const tier = (h.overall_tier || h.tier || '').toUpperCase();
        return {
          tier,
          rank: TIER_RANK[tier] || 0,
          date: h.assessed_at ? new Date(h.assessed_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) : '',
        };
      })
      .filter(d => d.rank > 0);
  }, [history]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ABC Employee Tier Assessment</h1>
        <div className={styles.subtitle}>15-category rubric with A/B/C/D grading. Majority vote with tie-break to the higher tier (A &gt; B &gt; C &gt; D).</div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'assess' ? styles.tabActive : ''}`} onClick={() => setTab('assess')}>Assessment</button>
        <button className={`${styles.tab} ${tab === 'history' ? styles.tabActive : ''}`} onClick={() => setTab('history')}>History</button>
        <button className={`${styles.tab} ${tab === 'rubric' ? styles.tabActive : ''}`} onClick={() => setTab('rubric')}>Rubric</button>
      </div>

      {tab !== 'rubric' && (
        <div className={styles.picker}>
          <span className={styles.pickerLabel}>Store</span>
          <select className={styles.select} value={storeId} onChange={e => setStoreId(e.target.value)}>
            {STORE_DIRECTORY.map(s => <option key={s.id} value={s.id}>{getStoreLabel(s.id)}</option>)}
          </select>
          <span className={styles.pickerLabel}>Employee</span>
          <select className={styles.select} value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
            {employees.length === 0 && <option value="">— none —</option>}
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}{e.position ? ` · ${e.position}` : ''}</option>)}
          </select>
        </div>
      )}

      {mcEmployeeError && tab !== 'rubric' && (
        <div className={styles.banner}>
          {mcEmployeeError} You can still use the rubric view. Wire Mission Control employee import to populate this list.
        </div>
      )}

      {loading && tab !== 'rubric' && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--gray-400)', fontSize: '14px' }}>Loading employees…</div>
      )}

      {tab === 'assess' && !loading && (
        <>
          <div className={styles.summary}>
            <div>
              <div className={styles.summaryLabel}>Categories Scored</div>
              <div className={styles.summaryValue}>{completedCount} / {categories.length}</div>
            </div>
            <div>
              <div className={styles.summaryLabel}>Computed Tier</div>
              {computedTier ? (
                <span className={`${styles.tierBadgeBig} ${styles[`tier${computedTier}`]}`}>{computedTier} · {TIER_DEFS[computedTier]}</span>
              ) : (
                <span className={`${styles.tierBadgeBig} ${styles.tierNone}`}>—</span>
              )}
            </div>
            <div>
              <div className={styles.summaryLabel}>Override</div>
              <div className={styles.overridePicker}>
                {TIERS.map(t => (
                  <button
                    key={t}
                    className={`${styles.overrideBtn} ${override === t ? `${styles.overrideBtnActive} ${styles[`tier${t}`]}` : ''}`}
                    onClick={() => setOverride(override === t ? '' : t)}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.assessWrap}>
            <table className={styles.assessTable}>
              <thead>
                <tr>
                  <th>Category</th>
                  {TIERS.map(t => <th key={t} className={styles.tierHead}>{t}</th>)}
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr key={cat.key}>
                    <td className={styles.catName}>
                      <span className={styles.catNum}>{i + 1}.</span>{cat.name}
                    </td>
                    {TIERS.map(t => (
                      <td key={t} className={styles.tierCell}>
                        <input
                          type="radio"
                          name={`row_${cat.key}`}
                          className={styles.radio}
                          checked={scores[cat.key]?.tier === t}
                          onChange={() => updateScore(cat.key, t)}
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        className={styles.catNote}
                        placeholder="Optional note..."
                        value={scores[cat.key]?.notes || ''}
                        onChange={e => updateNote(cat.key, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className={styles.pickerLabel} style={{ display: 'block', marginBottom: 6 }}>Assessor Notes</label>
            <textarea
              className={styles.notesArea}
              value={assessorNotes}
              onChange={e => setAssessorNotes(e.target.value)}
              placeholder="Overall observations, action items, development plan..."
            />
          </div>

          <div className={styles.submitBar}>
            {message && <div style={{ alignSelf: 'center', color: 'var(--gray-600)', fontSize: 12 }}>{message}</div>}
            <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={submitting || !employeeId} onClick={submit}>
              {submitting ? 'Submitting…' : 'Submit Assessment'}
            </button>
          </div>
        </>
      )}

      {tab === 'history' && !loading && (
        <>
          {sparklineData.length > 1 && (
            <div className={styles.historyCard}>
              <div className={styles.rubricTitle}>Tier Trend</div>
              <div className={styles.sparkline}>
                {sparklineData.map((d, i) => {
                  const color = d.tier === 'A' ? '#16a34a' : d.tier === 'B' ? '#2563eb' : d.tier === 'C' ? '#f59e0b' : '#dc2626';
                  return (
                    <div key={i} className={styles.sparkItem}>
                      <div className={styles.sparkBar} style={{ height: `${(d.rank / 4) * 100}%`, background: color }} />
                      <div className={styles.sparkDate}>{d.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {history.length === 0 ? (
            <div className={styles.empty}>No assessments yet for this employee.</div>
          ) : (
            history.map(h => {
              const tier = (h.overall_tier || h.tier || '').toUpperCase();
              return (
                <div key={h.id} className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <span className={`${styles.tierBadgeBig} ${styles[`tier${tier}`] || styles.tierNone}`}>{tier || '—'}</span>
                    <span className={styles.historyDate}>
                      {h.assessed_at ? new Date(h.assessed_at).toLocaleString() : ''}
                      {h.assessed_by ? ` · ${h.assessed_by}` : ''}
                    </span>
                  </div>
                  {h.assessor_notes && <div className={styles.historyNotes}>{h.assessor_notes}</div>}
                </div>
              );
            })
          )}
        </>
      )}

      {tab === 'rubric' && (
        <>
          <div className={styles.banner}>
            Reference rubric (read-only). Owners and company admins can edit the A/B/C/D descriptions for each category from the Mission Control rubric editor.
          </div>
          {categories.map((cat, i) => {
            const r = rubric.find(x => x.category_key === cat.key) || {};
            return (
              <div key={cat.key} className={styles.rubricCard}>
                <div className={styles.rubricTitle}>{i + 1}. {cat.name}</div>
                <div className={styles.rubricGrid}>
                  {TIERS.map(t => {
                    const desc = r[`tier_${t.toLowerCase()}_description`];
                    return (
                      <div key={t} className={styles.rubricCol}>
                        <div className={styles.rubricTierLabel} style={{
                          color: t === 'A' ? '#16a34a' : t === 'B' ? '#2563eb' : t === 'C' ? '#f59e0b' : '#dc2626',
                        }}>{t} · {TIER_DEFS[t]}</div>
                        <div className={`${styles.rubricDesc} ${!desc ? styles.rubricEmpty : ''}`}>
                          {desc || '— placeholder —'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
