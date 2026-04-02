'use client';

import { useState } from 'react';
import { getLeaderboards, getWeekScoreboard, getAvailableWeeks } from '@/lib/scoreboard-data';
import { getStoreName, getStoreLabel } from '@/lib/store-directory';
import styles from './page.module.css';

const COLOR_MAP = {
  royalblue: { bg: 'rgba(19,74,124,0.12)', color: '#134A7C', label: 'Grand Slam' },
  blue: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb', label: 'Double Digit' },
  green: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a', label: 'Trifecta' },
  yellow: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', label: '2 Targets' },
  orange: { bg: 'rgba(249,115,22,0.12)', color: '#c2410c', label: '1 Target' },
  none: { bg: 'transparent', color: '#9ca3af', label: '0 Targets' },
};

function formatCurrency(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatPct(n) {
  return n.toFixed(2) + '%';
}

// RT-121: Trend arrow component
function TrendArrow({ current, previous, higherIsBetter = true, fmt }) {
  if (!previous || previous === 0) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return <span style={{ color: '#9ca3af', fontSize: '11px' }}>—</span>;
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

export default function ScoreboardPage() {
  const [tab, setTab] = useState('leaderboard');
  const [selectedWeek, setSelectedWeek] = useState(11);
  // RT-144: Metric category filter
  const [metricTab, setMetricTab] = useState('all');

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>JMVG Scoreboard</h1>
        <p className={styles.subtitle}>Weekly performance across all 30+ stores. Track targets, growth, and who&apos;s leading the pack.</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'leaderboard' ? styles.tabActive : ''}`} onClick={() => setTab('leaderboard')}>
          Leaderboards
        </button>
        <button className={`${styles.tab} ${tab === 'weekly' ? styles.tabActive : ''}`} onClick={() => setTab('weekly')}>
          Weekly Scoreboard
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
          {weekData ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                {/* RT-136: Sticky header */}
                <thead className={styles.stickyHead}>
                  <tr>
                    <th>#</th>
                    <th>Store</th>
                    {(metricTab === 'all' || metricTab === 'sales') && <th>Net Sales</th>}
                    {(metricTab === 'all' || metricTab === 'sales') && <th>Bread</th>}
                    {(metricTab === 'all' || metricTab === 'sales') && <th>PY Growth</th>}
                    {(metricTab === 'all' || metricTab === 'cogs') && <th>COGs</th>}
                    {(metricTab === 'all' || metricTab === 'cogs') && <th>Variance</th>}
                    {(metricTab === 'all' || metricTab === 'labor') && <th>Labor</th>}
                    {(metricTab === 'all' || metricTab === 'labor') && <th>Target</th>}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weekData.rows.map((row, i) => {
                    const c = COLOR_MAP[row.color] || COLOR_MAP.none;
                    const prev = prevWeekMap[row.storeId];
                    return (
                      <tr key={row.storeId} style={{ background: c.bg }}>
                        <td>{i + 1}</td>
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

      {/* Data Note */}
      <div className={styles.disclaimer}>
        Data spans Weeks 1-11 (Dec 29 - Mar 15, 2026). New stores (SD/Riverside) joined in Week 10-11. Leaderboard totals reflect each store&apos;s available weeks.
      </div>
    </div>
  );
}
