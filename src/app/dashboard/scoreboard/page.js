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

export default function ScoreboardPage() {
  const [tab, setTab] = useState('leaderboard');
  const [selectedWeek, setSelectedWeek] = useState(11);

  const leaderboards = getLeaderboards();
  const weeks = getAvailableWeeks();
  const weekData = getWeekScoreboard(selectedWeek);

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
          {/* Week Selector */}
          <div className={styles.weekSelector}>
            <label className={styles.weekLabel}>Week:</label>
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

          {/* Color Legend */}
          <div className={styles.legend}>
            {Object.entries(COLOR_MAP).filter(([k]) => k !== 'none').map(([key, val]) => (
              <span key={key} className={styles.legendItem} style={{ background: val.bg, color: val.color }}>
                {val.label}
              </span>
            ))}
          </div>

          {/* Scoreboard Table */}
          {weekData ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Store</th>
                    <th>Net Sales</th>
                    <th>Bread</th>
                    <th>PY Growth</th>
                    <th>COGs</th>
                    <th>Variance</th>
                    <th>Labor</th>
                    <th>Target</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weekData.rows.map((row, i) => {
                    const c = COLOR_MAP[row.color] || COLOR_MAP.none;
                    return (
                      <tr key={row.storeId} style={{ background: c.bg }}>
                        <td>{i + 1}</td>
                        <td className={styles.storeCell}>
                          <span className={styles.storeName}>{getStoreName(row.storeId)}</span>
                          <span className={styles.storeId}>#{row.storeId}</span>
                        </td>
                        <td className={styles.salesCell}>{formatCurrency(row.netSales)}</td>
                        <td>{row.breadCount}</td>
                        <td style={{ color: row.pyGrowth > 0 ? '#16a34a' : row.pyGrowth < 0 ? '#dc2626' : '#6b7280', fontWeight: 600 }}>
                          {row.pySales > 0 ? formatPct(row.pyGrowth) : 'N/A'}
                        </td>
                        <td>{formatPct(row.cogsActual)}</td>
                        <td>{formatPct(row.cogsVariance)}</td>
                        <td style={{ color: row.labor < row.laborTarget ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                          {formatPct(row.labor)}
                        </td>
                        <td>{formatPct(row.laborTarget)}</td>
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
            </div>
          ) : (
            <div className={styles.empty}>No data available for this week.</div>
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
