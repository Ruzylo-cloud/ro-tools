'use client';

import { useState, useEffect } from 'react';
import { getLeaderboards, getWeekScoreboard, getAvailableWeeks } from '@/lib/scoreboard-data';
import { getStoreName, getStoreLabel, STORE_DIRECTORY } from '@/lib/store-directory';
import styles from './page.module.css';

const COLOR_MAP = {
  royalblue: { bg: 'rgba(19,74,124,0.12)', color: 'var(--jm-blue)', label: 'Grand Slam' },
  blue: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb', label: 'Double Digit' },
  green: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a', label: 'Trifecta' },
  yellow: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', label: '2 Targets' },
  orange: { bg: 'rgba(249,115,22,0.12)', color: '#c2410c', label: '1 Target' },
  none: { bg: 'transparent', color: 'var(--gray-400)', label: '0 Targets' },
};

function formatCurrency(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatPct(n) {
  return n.toFixed(2) + '%';
}

// RT-152: Metric definition tooltip
const METRIC_DEFS = {
  'Net Sales': 'Total gross sales for the week, excluding refunds.',
  'Bread': 'Bread loaves ordered — cross-referenced against sales volume.',
  'PY Growth': 'Year-over-year growth vs the same week last year. Target: > 0%.',
  'COGs': 'Cost of Goods Sold as % of net sales. Target: 22%–25%.',
  'Variance': 'COGs vs theoretical cost. Target: -1% to -2.5%.',
  'Labor': 'Labor cost as % of net sales. Target varies by store volume.',
  'Target': "Store's weekly labor % target set by the district manager.",
  'Status': 'Achievement tier: Grand Slam (4 targets), Trifecta (3), etc.',
};

function MetricTh({ label, children }) {
  const [show, setShow] = useState(false);
  const def = METRIC_DEFS[label];
  return (
    <th style={{ position: 'relative' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {children || label}
        {def && (
          <span
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <span style={{ fontSize: 9, opacity: 0.7, cursor: 'default', userSelect: 'none' }}>ⓘ</span>
            {show && (
              <span style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: '#1e293b', color: '#f1f5f9', fontSize: 11, padding: '6px 10px',
                borderRadius: 6, pointerEvents: 'none', marginBottom: 4, zIndex: 100,
                fontWeight: 400, lineHeight: 1.4, width: 190, whiteSpace: 'normal', textTransform: 'none',
              }}>{def}</span>
            )}
          </span>
        )}
      </span>
    </th>
  );
}

// RT-121: Trend arrow component
function TrendArrow({ current, previous, higherIsBetter = true, fmt }) {
  if (!previous || previous === 0) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return <span style={{ color: 'var(--gray-400)', fontSize: '11px' }}>—</span>;
  const isGood = higherIsBetter ? diff > 0 : diff < 0;
  const arrow = diff > 0 ? '▲' : '▼';
  const color = isGood ? '#16a34a' : '#dc2626';
  const label = fmt ? fmt(Math.abs(diff)) : Math.abs(diff).toFixed(1);
  return (
    <span style={{ color, fontSize: '10px', marginLeft: '4px', fontWeight: 700 }}>
      {arrow} {label}
    </span>
  );
}

function ServerEntries({ week, saved }) {
  const [entries, setEntries] = useState([]);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    setLoadError(false);
    fetch(`/api/scoreboard/entries?week=${week}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setEntries(d.entries || []))
      .catch(() => setLoadError(true));
  }, [week, saved]);
  if (loadError) return <div style={{ marginTop: 20, color: 'var(--jm-red)', fontSize: 13 }}>Failed to load entries for this week.</div>;
  if (entries.length === 0) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Saved Week {week} Entries ({entries.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map((e) => (
          <div key={e.id || e.storeId} style={{ padding: '10px 14px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>{getStoreName(e.storeId)} #{e.storeId}</span>
            <span>Sales: ${(e.netSales || 0).toLocaleString()}</span>
            {e.labor > 0 && <span>Labor: {e.labor}%</span>}
            {e.cogsActual > 0 && <span>COGs: {e.cogsActual}%</span>}
            {e.targetsHit !== undefined && <span>Targets: {e.targetsHit}/4</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScoreboardPage() {
  const [tab, setTab] = useState('leaderboard');
  const availableWeeksInit = getAvailableWeeks();
  const [selectedWeek, setSelectedWeek] = useState(availableWeeksInit.length > 0 ? availableWeeksInit[0].weekNum : 12);
  // RT-144: Metric category filter
  const [metricTab, setMetricTab] = useState('all');
  // RT-148: Store comparison
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  // RT-146: Data entry form
  const [entryForm, setEntryForm] = useState({ storeId: '', netSales: '', pySales: '', breadCount: '', cogsActual: '', cogsVariance: '', labor: '', laborTarget: '' });
  const [entrySaved, setEntrySaved] = useState(false);

  const leaderboards = getLeaderboards();
  const weeks = getAvailableWeeks();
  const weekData = getWeekScoreboard(selectedWeek);
  // RT-121: Previous week for trend arrows
  const prevWeekData = getWeekScoreboard(selectedWeek - 1);
  const prevWeekMap = prevWeekData
    ? Object.fromEntries(prevWeekData.rows.map(r => [r.storeId, r]))
    : {};

  const minWeek = weeks.length > 0 ? weeks[0].weekNum : 1;
  const maxWeek = weeks.length > 0 ? weeks[weeks.length - 1].weekNum : 11;

  // RT-150: CSV export for current week
  const exportScoreboardCSV = () => {
    if (!weekData) return;
    const headers = ['Rank', 'Store', 'Net Sales', 'PY Growth %', 'Labor %', 'COGs %', 'Targets Hit'];
    const rows = weekData.rows.map((row, i) => [
      i + 1,
      getStoreLabel(row.storeId),
      row.netSales,
      row.pySales > 0 ? formatPct(row.pyGrowth) : 'N/A',
      formatPct(row.labor),
      formatPct(row.cogsActual),
      row.colorCode || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoreboard-week${selectedWeek}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className={styles.title}>JMVG Scoreboard</h1>
          <p className={styles.subtitle}>Weekly performance across all 30+ stores. Track targets, growth, and who&apos;s leading the pack.</p>
        </div>
        {/* RT-150: Export CSV */}
        {weekData && (
          <button onClick={exportScoreboardCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--jm-blue)', cursor: 'pointer', flexShrink: 0 }}>
            ↓ Export CSV
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'leaderboard' ? styles.tabActive : ''}`} onClick={() => setTab('leaderboard')}>
          Leaderboards
        </button>
        <button className={`${styles.tab} ${tab === 'weekly' ? styles.tabActive : ''}`} onClick={() => setTab('weekly')}>
          Weekly Scoreboard
        </button>
        {/* RT-148: Store comparison tab */}
        <button className={`${styles.tab} ${tab === 'compare' ? styles.tabActive : ''}`} onClick={() => setTab('compare')}>
          Compare Stores
        </button>
        {/* RT-146: Data entry tab */}
        <button className={`${styles.tab} ${tab === 'entry' ? styles.tabActive : ''}`} onClick={() => setTab('entry')}>
          Enter Data
        </button>
      </div>

      {/* Leaderboards Tab */}
      {tab === 'leaderboard' && (
        <div className={styles.leaderboards}>
          {/* Grand Slams */}
          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <h2 className={styles.boardTitle}>Grand Slams</h2>
              <span className={styles.boardBadge} style={{ background: COLOR_MAP.royalblue.bg, color: COLOR_MAP.royalblue.color }}>4 Targets</span>
            </div>
            <p className={styles.boardDesc}>All 4 targets hit in a single week: Labor, COGs Variance, COGs Actual, PY Growth.</p>
            <div className={styles.boardList}>
              {leaderboards.grandSlams.filter(s => s.grandSlams > 0).map((s, i) => (
                <div key={s.storeId} className={styles.boardRow}>
                  <span className={styles.boardRank}>#{i + 1}</span>
                  <span className={styles.boardStore}>{getStoreName(s.storeId)}</span>
                  <span className={styles.boardStoreId}>#{s.storeId}</span>
                  <span className={styles.boardValue}>{s.grandSlams}</span>
                </div>
              ))}
              {leaderboards.grandSlams.filter(s => s.grandSlams > 0).length === 0 && (
                <div className={styles.boardEmpty}>No Grand Slams yet this season.</div>
              )}
            </div>
          </div>

          {/* Trifectas */}
          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <h2 className={styles.boardTitle}>Trifectas</h2>
              <span className={styles.boardBadge} style={{ background: COLOR_MAP.green.bg, color: COLOR_MAP.green.color }}>3+ Targets</span>
            </div>
            <p className={styles.boardDesc}>3 or more targets hit in a single week.</p>
            <div className={styles.boardList}>
              {leaderboards.trifectas.filter(s => s.trifectas > 0).map((s, i) => (
                <div key={s.storeId} className={styles.boardRow}>
                  <span className={styles.boardRank}>#{i + 1}</span>
                  <span className={styles.boardStore}>{getStoreName(s.storeId)}</span>
                  <span className={styles.boardStoreId}>#{s.storeId}</span>
                  <span className={styles.boardValue}>{s.trifectas}</span>
                </div>
              ))}
              {leaderboards.trifectas.filter(s => s.trifectas > 0).length === 0 && (
                <div className={styles.boardEmpty}>No Trifectas yet this season.</div>
              )}
            </div>
          </div>

          {/* Avg Growth */}
          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <h2 className={styles.boardTitle}>Highest Avg Growth %</h2>
              <span className={styles.boardBadge} style={{ background: COLOR_MAP.blue.bg, color: COLOR_MAP.blue.color }}>YoY</span>
            </div>
            <p className={styles.boardDesc}>Average year-over-year sales growth across all tracked weeks.</p>
            <div className={styles.boardList}>
              {leaderboards.avgGrowth.slice(0, 15).map((s, i) => (
                <div key={s.storeId} className={styles.boardRow}>
                  <span className={styles.boardRank}>#{i + 1}</span>
                  <span className={styles.boardStore}>{getStoreName(s.storeId)}</span>
                  <span className={styles.boardStoreId}>#{s.storeId}</span>
                  <span className={`${styles.boardValue} ${s.avgGrowth >= 10 ? styles.boardValueGreen : ''}`}>{s.avgGrowth.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Scoreboard Tab */}
      {tab === 'weekly' && (
        <div>
          {/* RT-139: Week Navigator — prev/next arrows + dropdown */}
          <div className={styles.weekNav}>
            <button
              className={styles.weekNavBtn}
              onClick={() => setSelectedWeek(w => Math.max(minWeek, w - 1))}
              disabled={selectedWeek <= minWeek}
              aria-label="Previous week"
            >‹</button>
            <div className={styles.weekSelectorWrap}>
              <label className={styles.weekLabel}>Week {selectedWeek}</label>
              <select
                className={styles.weekSelect}
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value, 10))}
              >
                {weeks.map(w => (
                  <option key={w.weekNum} value={w.weekNum}>Week {w.weekNum} — {w.dateRange}</option>
                ))}
              </select>
            </div>
            <button
              className={styles.weekNavBtn}
              onClick={() => setSelectedWeek(w => Math.min(maxWeek, w + 1))}
              disabled={selectedWeek >= maxWeek}
              aria-label="Next week"
            >›</button>
          </div>

          {/* RT-144: Metric category tabs */}
          <div className={styles.metricTabs}>
            {['all', 'sales', 'labor', 'cogs'].map(m => (
              <button
                key={m}
                className={`${styles.metricTab} ${metricTab === m ? styles.metricTabActive : ''}`}
                onClick={() => setMetricTab(m)}
              >
                {m === 'all' ? 'All Metrics' : m === 'sales' ? 'Sales & Growth' : m === 'labor' ? 'Labor' : 'COGs'}
              </button>
            ))}
          </div>

          {/* Color Legend */}
          <div className={styles.legend}>
            {Object.entries(COLOR_MAP).filter(([k]) => k !== 'none').map(([key, val]) => (
              <span key={key} className={styles.legendItem} style={{ background: val.bg, color: val.color }}>
                {val.label}
              </span>
            ))}
          </div>

          {/* RT-138: Empty state */}
          {/* RT-137: Scoreboard Table with sticky header */}
          {/* RT-153: Targets reference bar */}
          {weekData && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {[
                { label: 'PY Growth', target: '> 0%', color: '#16a34a' },
                { label: 'COGs', target: '22–25%', color: '#2563eb' },
                { label: 'COGs Variance', target: '-1% to -2.5%', color: '#2563eb' },
                { label: 'Labor', target: 'Below store target', color: '#b45309' },
              ].map(t => (
                <div key={t.label} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  <span style={{ color: 'var(--gray-500)', fontWeight: 500 }}>{t.label}: </span>
                  <span style={{ color: t.color }}>{t.target}</span>
                </div>
              ))}
            </div>
          )}

          {weekData ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                {/* RT-136: Sticky header */}
                <thead className={styles.stickyHead}>
                  <tr>
                    <th>#</th>
                    <th>Store</th>
                    {(metricTab === 'all' || metricTab === 'sales') && <MetricTh label="Net Sales" />}
                    {(metricTab === 'all' || metricTab === 'sales') && <MetricTh label="Bread" />}
                    {(metricTab === 'all' || metricTab === 'sales') && <MetricTh label="PY Growth" />}
                    {(metricTab === 'all' || metricTab === 'cogs') && <MetricTh label="COGs" />}
                    {(metricTab === 'all' || metricTab === 'cogs') && <MetricTh label="Variance" />}
                    {(metricTab === 'all' || metricTab === 'labor') && <MetricTh label="Labor" />}
                    {(metricTab === 'all' || metricTab === 'labor') && <MetricTh label="Target" />}
                    <MetricTh label="Status" />
                  </tr>
                </thead>
                <tbody>
                  {weekData.rows.map((row, i) => {
                    const c = COLOR_MAP[row.color] || COLOR_MAP.none;
                    const prev = prevWeekMap[row.storeId];
                    // RT-154: Threshold alert — flag rows with critically out-of-range metrics
                    const criticalAlerts = [];
                    if (row.cogsActual > 27) criticalAlerts.push(`COGs ${formatPct(row.cogsActual)} (target 22–25%)`);
                    if (row.pySales > 0 && row.pyGrowth < -5) criticalAlerts.push(`PY growth ${formatPct(row.pyGrowth)}`);
                    if (row.labor > row.laborTarget + 3) criticalAlerts.push(`Labor ${formatPct(row.labor)} (${formatPct(row.labor - row.laborTarget)} over target)`);
                    return (
                      <tr key={row.storeId} style={{ background: c.bg }}>
                        <td>
                          {i + 1}
                          {/* RT-154: Critical threshold alert icon */}
                          {criticalAlerts.length > 0 && (
                            <span title={`Alerts:\n${criticalAlerts.join('\n')}`} style={{ marginLeft: 4, cursor: 'default', fontSize: 12 }}>⚠️</span>
                          )}
                        </td>
                        <td className={styles.storeCell}>
                          <span className={styles.storeName}>{getStoreName(row.storeId)}</span>
                          <span className={styles.storeId}>#{row.storeId}</span>
                        </td>
                        {(metricTab === 'all' || metricTab === 'sales') && (
                          <td className={styles.salesCell}>
                            {formatCurrency(row.netSales)}
                            {/* RT-121: Trend arrow */}
                            <TrendArrow current={row.netSales} previous={prev?.netSales} fmt={v => '$' + Math.round(v/1000) + 'k'} />
                          </td>
                        )}
                        {(metricTab === 'all' || metricTab === 'sales') && <td>{row.breadCount}</td>}
                        {(metricTab === 'all' || metricTab === 'sales') && (
                          <td>
                            {/* RT-122: Color coding */}
                            <span style={{ color: row.pyGrowth > 0 ? '#16a34a' : row.pyGrowth < 0 ? '#dc2626' : '#6b7280', fontWeight: 600 }}>
                              {row.pySales > 0 ? formatPct(row.pyGrowth) : 'N/A'}
                            </span>
                            <TrendArrow current={row.pyGrowth} previous={prev?.pyGrowth} fmt={v => v.toFixed(1) + '%'} />
                          </td>
                        )}
                        {(metricTab === 'all' || metricTab === 'cogs') && (
                          <td>
                            <span style={{ color: row.cogsActual >= 22 && row.cogsActual <= 25 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                              {formatPct(row.cogsActual)}
                            </span>
                          </td>
                        )}
                        {(metricTab === 'all' || metricTab === 'cogs') && (
                          <td>
                            <span style={{ color: row.cogsVariance >= -2.5 && row.cogsVariance <= -1 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                              {formatPct(row.cogsVariance)}
                            </span>
                          </td>
                        )}
                        {(metricTab === 'all' || metricTab === 'labor') && (
                          <td>
                            <span style={{ color: row.labor < row.laborTarget ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                              {formatPct(row.labor)}
                            </span>
                            <TrendArrow current={row.labor} previous={prev?.labor} higherIsBetter={false} fmt={v => v.toFixed(1) + '%'} />
                          </td>
                        )}
                        {(metricTab === 'all' || metricTab === 'labor') && <td>{formatPct(row.laborTarget)}</td>}
                        <td>
                          <span className={styles.statusBadge} style={{ background: c.bg, color: c.color }}>
                            {c.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* RT-143: Mobile card layout (hidden on desktop via CSS) */}
              <div className={styles.mobileCards}>
                {weekData.rows.map((row, i) => {
                  const c = COLOR_MAP[row.color] || COLOR_MAP.none;
                  const prev = prevWeekMap[row.storeId];
                  return (
                    <div key={row.storeId} className={styles.mobileCard} style={{ borderLeftColor: c.color }}>
                      <div className={styles.mobileCardHeader}>
                        <span className={styles.mobileCardRank}>#{i + 1}</span>
                        <div>
                          <div className={styles.mobileCardStore}>{getStoreName(row.storeId)}</div>
                          <div className={styles.mobileCardId}>Store #{row.storeId}</div>
                        </div>
                        <span className={styles.statusBadge} style={{ background: c.bg, color: c.color, marginLeft: 'auto' }}>{c.label}</span>
                      </div>
                      <div className={styles.mobileCardMetrics}>
                        <div className={styles.mobileMetric}>
                          <span className={styles.mobileMetricLabel}>Sales</span>
                          <span className={styles.mobileMetricVal}>{formatCurrency(row.netSales)}</span>
                        </div>
                        <div className={styles.mobileMetric}>
                          <span className={styles.mobileMetricLabel}>Growth</span>
                          <span style={{ fontWeight: 700, color: row.pyGrowth > 0 ? '#16a34a' : '#dc2626' }}>
                            {row.pySales > 0 ? formatPct(row.pyGrowth) : 'N/A'}
                          </span>
                        </div>
                        <div className={styles.mobileMetric}>
                          <span className={styles.mobileMetricLabel}>Labor</span>
                          <span style={{ fontWeight: 700, color: row.labor < row.laborTarget ? '#16a34a' : '#dc2626' }}>
                            {formatPct(row.labor)}
                          </span>
                        </div>
                        <div className={styles.mobileMetric}>
                          <span className={styles.mobileMetricLabel}>COGs</span>
                          <span style={{ fontWeight: 700, color: row.cogsActual >= 22 && row.cogsActual <= 25 ? '#16a34a' : '#dc2626' }}>
                            {formatPct(row.cogsActual)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* RT-138: Empty state */
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <h3 className={styles.emptyTitle}>No Data for Week {selectedWeek}</h3>
              <p className={styles.emptyDesc}>Scoreboard data hasn&apos;t been entered for this week yet.</p>
              <button className={styles.emptyBtn} onClick={() => setSelectedWeek(maxWeek)}>
                Go to Latest Week
              </button>
            </div>
          )}
        </div>
      )}

      {/* RT-148: Store comparison tab */}
      {tab === 'compare' && (() => {
        const storeIds = weekData ? [...new Set(weekData.rows.map(r => r.storeId))].sort() : [];
        const rowA = compareA && weekData ? weekData.rows.find(r => r.storeId === compareA) : null;
        const rowB = compareB && weekData ? weekData.rows.find(r => r.storeId === compareB) : null;
        const METRICS = [
          { key: 'netSales', label: 'Net Sales', fmt: formatCurrency, higherBetter: true },
          { key: 'pyGrowth', label: 'PY Growth %', fmt: formatPct, higherBetter: true },
          { key: 'breadCount', label: 'Bread Count', fmt: v => v, higherBetter: true },
          { key: 'cogsActual', label: 'COGs %', fmt: formatPct, higherBetter: false },
          { key: 'cogsVariance', label: 'COGs Variance', fmt: formatPct, higherBetter: false },
          { key: 'labor', label: 'Labor %', fmt: formatPct, higherBetter: false },
          { key: 'laborTarget', label: 'Labor Target', fmt: formatPct },
        ];
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {[{ label: 'Store A', val: compareA, setter: setCompareA, color: 'var(--jm-blue)' }, { label: 'Store B', val: compareB, setter: setCompareB, color: 'var(--jm-red)' }].map(s => (
                <div key={s.label}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</label>
                  <select
                    value={s.val}
                    onChange={e => s.setter(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: `2px solid ${s.val ? s.color : 'var(--border)'}`, borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--charcoal)' }}
                  >
                    <option value="">Select a store...</option>
                    {storeIds.map(id => <option key={id} value={id}>{getStoreName(id)} — #{id}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {rowA && rowB ? (
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--gray-50)', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--jm-blue)' }}>{getStoreName(compareA)}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Metric</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--jm-red)', textAlign: 'right' }}>{getStoreName(compareB)}</span>
                </div>
                {METRICS.map(m => {
                  const vA = rowA[m.key], vB = rowB[m.key];
                  const aWins = m.higherBetter !== undefined ? (m.higherBetter ? vA > vB : vA < vB) : null;
                  return (
                    <div key={m.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: aWins === true ? '#16a34a' : aWins === false ? '#dc2626' : 'var(--charcoal)' }}>{m.fmt(vA)}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{m.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: aWins === false ? '#16a34a' : aWins === true ? '#dc2626' : 'var(--charcoal)', textAlign: 'right' }}>{m.fmt(vB)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>⚖️</div>
                <h3 className={styles.emptyTitle}>Select Two Stores</h3>
                <p className={styles.emptyDesc}>Choose two stores above to compare their Week {selectedWeek} metrics head-to-head.</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* RT-146: Data entry tab */}
      {tab === 'entry' && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 6 }}>Enter Weekly Scoreboard Data</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>Enter Week {selectedWeek} data for a store. Saved entries are stored locally for this session.</p>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              {/* Store selector */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Store *</label>
                <select value={entryForm.storeId} onChange={e => setEntryForm(f => ({ ...f, storeId: e.target.value }))} style={{ width: '100%', maxWidth: 340, padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'var(--white)' }}>
                  <option value="">Select a store...</option>
                  {STORE_DIRECTORY.filter(s => s.ro).map(s => <option key={s.id} value={s.id}>{s.name !== s.id ? s.name : s.id} — #{s.id}</option>)}
                </select>
              </div>
              {[
                { key: 'netSales', label: 'Net Sales ($)', placeholder: '45000' },
                { key: 'pySales', label: 'PY Sales ($)', placeholder: '42000' },
                { key: 'breadCount', label: 'Bread Count', placeholder: '265' },
                { key: 'cogsActual', label: 'COGs Actual (%)', placeholder: '23.5' },
                { key: 'cogsVariance', label: 'COGs Variance (%)', placeholder: '-1.5' },
                { key: 'labor', label: 'Labor (%)', placeholder: '19.2' },
                { key: 'laborTarget', label: 'Labor Target (%)', placeholder: '20.0' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{f.label}</label>
                  <input
                    type="number"
                    value={entryForm[f.key]}
                    onChange={e => setEntryForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={async () => {
                  if (!entryForm.storeId || !entryForm.netSales) return;
                  try {
                    const res = await fetch('/api/scoreboard/entries', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        weekNum: selectedWeek,
                        storeId: entryForm.storeId,
                        netSales: parseFloat(entryForm.netSales) || 0,
                        pySales: parseFloat(entryForm.pySales) || 0,
                        breadCount: parseInt(entryForm.breadCount) || 0,
                        cogsActual: parseFloat(entryForm.cogsActual) || 0,
                        cogsVariance: parseFloat(entryForm.cogsVariance) || 0,
                        labor: parseFloat(entryForm.labor) || 0,
                        laborTarget: parseFloat(entryForm.laborTarget) || 0,
                      }),
                    });
                    if (!res.ok) throw new Error('Save failed');
                    setEntryForm({ storeId: '', netSales: '', pySales: '', breadCount: '', cogsActual: '', cogsVariance: '', labor: '', laborTarget: '' });
                    setEntrySaved(true);
                    setTimeout(() => setEntrySaved(false), 2500);
                  } catch {
                    alert('Failed to save entry. Please try again.');
                  }
                }}
                disabled={!entryForm.storeId || !entryForm.netSales}
                style={{ padding: '10px 24px', background: 'var(--jm-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (!entryForm.storeId || !entryForm.netSales) ? 0.5 : 1 }}
              >
                Save Entry
              </button>
              {entrySaved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Saved!</span>}
            </div>
          </div>
          {/* Recent entries — fetched from server */}
          <ServerEntries week={selectedWeek} saved={entrySaved} />
        </div>
      )}

      {/* Data Note */}
      <div className={styles.disclaimer}>
        Data spans Weeks 1-12 (Dec 29 - Mar 22, 2026). New stores (SD/Riverside) joined in Week 10-11. Leaderboard totals reflect each store&apos;s available weeks.
      </div>
    </div>
  );
}
