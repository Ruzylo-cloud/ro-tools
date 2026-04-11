'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { STORE_DIRECTORY, getStoreLabel } from '@/lib/store-directory';
import styles from './page.module.css';

const COLUMNS = [
  { key: 'hourly_wage',   label: 'Hourly $',    editable: true },
  { key: 'regular_hours', label: 'Reg Hrs',     editable: true },
  { key: 'ot_hours',      label: 'OT Hrs',      editable: true },
  { key: 'tipped_hours',  label: 'Tip Hrs',     editable: true },
  { key: 'tips_amount',   label: 'Tips $',      editable: true },
  { key: 'meal_periods',  label: 'Meals',       editable: true },
  { key: 'rest_breaks',   label: 'Breaks',      editable: true },
  { key: 'sick_hours',    label: 'Sick Hrs',    editable: true },
  { key: 'vacation_hours',label: 'PTO Hrs',     editable: true },
  { key: 'occ_minutes',   label: 'OCC Min',     editable: true },
  { key: 'split_shift',   label: 'Split',       editable: true },
  { key: 'total_hours',   label: 'Tot Hrs',     editable: false },
  { key: 'bonus',         label: 'Bonus',       editable: true },
  { key: 'other',         label: 'Other',       editable: true },
  { key: 'gross_pay',     label: 'Total $',     editable: false },
];

const SECTIONS = [
  { key: 'manager',    label: 'Managers',    roles: ['manager', 'agm'] },
  { key: 'shift_lead', label: 'Shift Leads', roles: ['shift_lead'] },
  { key: 'crew',       label: 'Crew',        roles: ['crew'] },
  { key: 'trainee',    label: 'Trainees',    roles: ['trainee'] },
];

const PL_KEYS = [
  { key: 'training',  label: 'Training' },
  { key: 'ctf',       label: 'CTF' },
  { key: 'marketer',  label: 'Marketer' },
  { key: 'sick_pto',  label: 'Sick + PTO' },
  { key: 'meetings',  label: 'Meetings' },
];

// Bi-weekly pay periods anchored to Monday starts
function buildPayPeriods(count = 12) {
  const out = [];
  const now = new Date();
  const day = now.getDay(); // 0 Sun .. 6 Sat
  const offset = (day + 6) % 7; // days since Monday
  const currentMon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
  // Snap to the Monday that starts the active biweek (even-week anchor)
  for (let i = 0; i < count; i++) {
    const start = new Date(currentMon);
    start.setDate(currentMon.getDate() - i * 14);
    const end = new Date(start);
    end.setDate(start.getDate() + 13);
    out.push({
      id: `${fmtDate(start)}_${fmtDate(end)}`,
      start: fmtDate(start),
      end: fmtDate(end),
      label: `${fmtDateShort(start)} — ${fmtDateShort(end)}${i === 0 ? ' (current)' : ''}`,
    });
  }
  return out;
}
function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
function fmtDateShort(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function money(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PayrollToolPage() {
  const generatedPeriods = useMemo(() => buildPayPeriods(12), []);
  const [storeId, setStoreId] = useState(STORE_DIRECTORY[0]?.id || '');
  const [periodId, setPeriodId] = useState(generatedPeriods[0]?.id || '');
  const [mcPeriods, setMcPeriods] = useState([]);
  const [mcPeriodId, setMcPeriodId] = useState('');
  const [entries, setEntries] = useState([]);
  const [totalsFromMc, setTotalsFromMc] = useState(null);
  const [breakdown, setBreakdown] = useState({ training: 0, ctf: 0, marketer: 0, sick_pto: 0, meetings: 0 });
  const [cashTipsOverride, setCashTipsOverride] = useState('');
  const [ccTips, setCcTips] = useState(0);
  const [notes, setNotes] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [newWatch, setNewWatch] = useState({ name: '', program: 'SP/PTO', date: '' });
  const [loading, setLoading] = useState(true);
  const [mcError, setMcError] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');

  // Initial load
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (storeId) qs.set('store_id', storeId);
      if (mcPeriodId) qs.set('period_id', mcPeriodId);
      const res = await fetch(`/api/mc/payroll?${qs.toString()}`);
      const data = await res.json();
      setMcError(data.mcError || null);
      setMcPeriods(data.periods || []);
      setEntries(data.entries || []);
      setTotalsFromMc(data.period ? {
        cc_tips: data.period.cc_tips || 0,
        cash_tips: data.period.cash_tips || 0,
        total_tips: data.period.total_tips || 0,
      } : null);
      setCcTips(data.period?.cc_tips || 0);
      if (data.breakdown && typeof data.breakdown === 'object') {
        setBreakdown({ training: 0, ctf: 0, marketer: 0, sick_pto: 0, meetings: 0, ...data.breakdown });
      }
      setNotes(data.notes || '');
      if (data.cashTipsOverride != null) setCashTipsOverride(String(data.cashTipsOverride));
      setWatchlist(Array.isArray(data.watchlist) ? data.watchlist : []);
    } catch (e) {
      setMcError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [storeId, mcPeriodId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Persist breakdown / notes / cash tips / watchlist
  const persist = useCallback(async (patch) => {
    setSavingStatus('Saving…');
    try {
      await fetch('/api/mc/payroll/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: storeId,
          period_id: mcPeriodId || periodId,
          ...patch,
        }),
      });
      setSavingStatus('Saved');
      setTimeout(() => setSavingStatus(''), 1500);
    } catch {
      setSavingStatus('Save failed');
      setTimeout(() => setSavingStatus(''), 2500);
    }
  }, [storeId, mcPeriodId, periodId]);

  const updateBreakdown = (key, value) => {
    setBreakdown(prev => ({ ...prev, [key]: Number(value) || 0 }));
  };

  // Group entries by section
  const grouped = useMemo(() => {
    const out = Object.fromEntries(SECTIONS.map(s => [s.key, []]));
    for (const e of entries) {
      const cat = (e.role_category || '').toLowerCase();
      const section = SECTIONS.find(s => s.roles.includes(cat));
      if (section) out[section.key].push(e);
      else out.crew.push(e);
    }
    return out;
  }, [entries]);

  // KPI calculations
  const cashTipsNum = cashTipsOverride === '' ? (totalsFromMc?.cash_tips || 0) : Number(cashTipsOverride) || 0;
  const totalTips = (Number(ccTips) || 0) + cashTipsNum;
  const totalTipsUsed = entries.reduce((s, e) => s + (Number(e.tips_amount) || 0), 0);
  const remainingTips = Math.max(0, totalTips - totalTipsUsed);
  const totalWages = entries.reduce((s, e) => s + (Number(e.gross_pay) || 0), 0);
  const plTotal = PL_KEYS.reduce((s, k) => s + (Number(breakdown[k.key]) || 0), 0);

  // CSV export
  const exportCsv = () => {
    const header = ['Section', 'Name', ...COLUMNS.map(c => c.label)];
    const rows = [];
    for (const section of SECTIONS) {
      for (const e of grouped[section.key]) {
        rows.push([
          section.label,
          e.employee_name || '',
          ...COLUMNS.map(c => e[c.key] ?? ''),
        ]);
      }
    }
    rows.push([]);
    rows.push(['P&L', '', ...PL_KEYS.map(k => k.label), 'Total']);
    rows.push(['', '', ...PL_KEYS.map(k => breakdown[k.key] || 0), plTotal]);
    rows.push([]);
    rows.push(['Tips', '', 'CC', 'Cash', 'Total', 'Remaining']);
    rows.push(['', '', ccTips, cashTipsNum, totalTips, remainingTips]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${storeId}_${mcPeriodId || periodId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateEntryCell = async (entryId, field, value) => {
    // Optimistic local update
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, [field]: value } : e));
    try {
      await fetch(`/api/mc/payroll/entries?entry_id=${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });
    } catch { /* non-fatal — still in local state */ }
  };

  const addWatch = () => {
    if (!newWatch.name.trim()) return;
    const next = [...watchlist, { ...newWatch, id: `w_${Date.now()}` }];
    setWatchlist(next);
    setNewWatch({ name: '', program: 'SP/PTO', date: '' });
    persist({ watchlist: next });
  };
  const removeWatch = (id) => {
    const next = watchlist.filter(w => w.id !== id);
    setWatchlist(next);
    persist({ watchlist: next });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Payroll Pull Workbench</h1>
          <div className={styles.subtitle}>
            Bi-weekly pay period review — replaces the Google Sheet workflow. {savingStatus && <span style={{ color: 'var(--jm-blue)', fontWeight: 600 }}>· {savingStatus}</span>}
          </div>
        </div>
        <div className={styles.toolbar}>
          <select className={styles.select} value={storeId} onChange={e => setStoreId(e.target.value)} title="Store">
            {STORE_DIRECTORY.map(s => (
              <option key={s.id} value={s.id}>{getStoreLabel(s.id)}</option>
            ))}
          </select>
          <select className={styles.select} value={mcPeriodId || periodId} onChange={e => {
            const v = e.target.value;
            if (mcPeriods.some(p => String(p.id) === v)) { setMcPeriodId(v); }
            else { setMcPeriodId(''); setPeriodId(v); }
          }} title="Pay period">
            {mcPeriods.length > 0 && (
              <optgroup label="Mission Control periods">
                {mcPeriods.map(p => (
                  <option key={p.id} value={p.id}>{p.start_date} → {p.end_date}</option>
                ))}
              </optgroup>
            )}
            <optgroup label="Generated (bi-weekly)">
              {generatedPeriods.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
          </select>
          <button className={styles.btn} onClick={loadData}>Refresh</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      {mcError && (
        <div className={`${styles.banner} ${styles.bannerWarn}`}>
          Mission Control payroll endpoint unavailable ({mcError}). P&amp;L breakdown, OCC notes,
          watchlist and CSV export work locally. Contact admin to wire the internal payroll bridge.
        </div>
      )}

      {/* KPI cards */}
      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>CC Tips</div>
          <div className={styles.kpiValue}>{money(ccTips)}</div>
          <div className={styles.kpiSub}>From FlexePOS</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Cash Tips</div>
          <div className={styles.kpiValue}>{money(cashTipsNum)}</div>
          <div className={styles.kpiSub}>Manager entered</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Total Tips</div>
          <div className={styles.kpiValue}>{money(totalTips)}</div>
          <div className={styles.kpiSub}>CC + Cash</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Remaining Crew Tips</div>
          <div className={styles.kpiValue}>{money(remainingTips)}</div>
          <div className={styles.kpiSub}>After distribution</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Total Wages</div>
          <div className={styles.kpiValue}>{money(totalWages)}</div>
          <div className={styles.kpiSub}>All sections</div>
        </div>
      </div>

      <div className={styles.layout}>
        <div>
          {/* Tip reconciliation */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Tip Reconciliation</div>
            <div className={styles.tipRecon}>
              <div className={styles.tipBox}>
                <div className={styles.tipBoxLabel}>CC Tips (auto)</div>
                <div className={styles.tipBoxValue}>{money(ccTips)}</div>
                <button className={styles.flexeBtn} disabled title="FlexePOS integration pending">
                  FlexePOS — not connected
                </button>
              </div>
              <div className={styles.tipBox}>
                <div className={styles.tipBoxLabel}>Cash Tips (manual)</div>
                <input
                  type="number"
                  className={styles.plInput}
                  value={cashTipsOverride}
                  placeholder={String(totalsFromMc?.cash_tips || '0')}
                  onChange={e => setCashTipsOverride(e.target.value)}
                  onBlur={() => persist({ cashTipsOverride: cashTipsOverride === '' ? null : Number(cashTipsOverride) })}
                />
              </div>
              <div className={styles.tipBox}>
                <div className={styles.tipBoxLabel}>Total Tips</div>
                <div className={styles.tipBoxValue}>{money(totalTips)}</div>
              </div>
              <div className={styles.tipBox}>
                <div className={styles.tipBoxLabel}>Distributed to Crew</div>
                <div className={styles.tipBoxValue}>{money(totalTipsUsed)}</div>
              </div>
            </div>
          </div>

          {/* 4 sections */}
          {SECTIONS.map(section => (
            <div key={section.key} className={styles.section}>
              <div className={styles.sectionTitle}>
                {section.label}
                <span className={styles.sectionBadge}>{grouped[section.key].length}</span>
              </div>
              {grouped[section.key].length === 0 ? (
                <div className={styles.emptySection}>
                  {loading ? 'Loading…' : `No ${section.label.toLowerCase()} entries for this period.`}
                </div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        {COLUMNS.map(c => <th key={c.key}>{c.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[section.key].map(e => (
                        <tr key={e.id}>
                          <td className={styles.nameCell}>{e.employee_name}</td>
                          {COLUMNS.map(c => (
                            <td key={c.key} className={c.editable ? '' : styles.totalCell}>
                              {c.editable ? (
                                <input
                                  className={styles.cellInput}
                                  type="number"
                                  step="0.01"
                                  defaultValue={e[c.key] ?? 0}
                                  onBlur={ev => updateEntryCell(e.id, c.key, Number(ev.target.value) || 0)}
                                />
                              ) : (
                                c.key === 'gross_pay' ? money(e[c.key]) : (e[c.key] ?? 0)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* P&L breakdown */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>P&amp;L Breakdown</div>
            <div className={styles.plGrid}>
              {PL_KEYS.map(k => (
                <div key={k.key} className={styles.plItem}>
                  <div className={styles.plLabel}>{k.label}</div>
                  <input
                    type="number"
                    className={styles.plInput}
                    value={breakdown[k.key] || 0}
                    onChange={e => updateBreakdown(k.key, e.target.value)}
                    onBlur={() => persist({ breakdown })}
                  />
                </div>
              ))}
              <div className={styles.plTotal}>
                <span>Total</span>
                <span>{money(plTotal)}</span>
              </div>
            </div>
          </div>

          {/* OCC notes */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>OCC Changes &amp; Notes</div>
            <textarea
              className={styles.notesArea}
              placeholder="Any overtime, correction requests, punch issues, or pay-period notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={() => persist({ notes })}
            />
          </div>
        </div>

        {/* Side panel: watchlist */}
        <aside className={styles.sidePanel}>
          <div className={styles.sidePanelTitle}>Past Employees Watchlist</div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 10 }}>
            SP/PTO eligibility, SHOE/Pants program dates.
          </div>
          {watchlist.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--gray-400)', padding: '14px 0' }}>No employees tracked.</div>
          )}
          {watchlist.map(w => (
            <div key={w.id} className={styles.watchItem}>
              <div className={styles.watchName}>
                <span>{w.name}</span>
                <button className={styles.removeBtn} onClick={() => removeWatch(w.id)} title="Remove">×</button>
              </div>
              <div className={styles.watchMeta}>{w.program}{w.date ? ` · ${w.date}` : ''}</div>
            </div>
          ))}
          <input
            className={styles.plInput}
            style={{ width: '100%', textAlign: 'left', marginTop: 8 }}
            placeholder="Employee name"
            value={newWatch.name}
            onChange={e => setNewWatch(v => ({ ...v, name: e.target.value }))}
          />
          <select
            className={styles.select}
            style={{ width: '100%', marginTop: 6 }}
            value={newWatch.program}
            onChange={e => setNewWatch(v => ({ ...v, program: e.target.value }))}
          >
            <option value="SP/PTO">SP/PTO Eligibility</option>
            <option value="SHOE">SHOE Program</option>
            <option value="Pants">Pants Program</option>
            <option value="Other">Other</option>
          </select>
          <input
            className={styles.plInput}
            style={{ width: '100%', textAlign: 'left', marginTop: 6 }}
            type="date"
            value={newWatch.date}
            onChange={e => setNewWatch(v => ({ ...v, date: e.target.value }))}
          />
          <button className={styles.watchAdd} onClick={addWatch}>+ Add to watchlist</button>
        </aside>
      </div>
    </div>
  );
}
