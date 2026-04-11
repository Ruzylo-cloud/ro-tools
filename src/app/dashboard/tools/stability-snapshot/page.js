'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { STORE_DIRECTORY, getStoreLabel } from '@/lib/store-directory';
import styles from './page.module.css';

// Canonical 7 leadership role slots returned by Mission Control's
// /api/tools/stability-snapshot endpoint. Do not invent labels here; the
// backend is the source of truth and sends role_label with each slot.
const DEFAULT_ROLE_KEYS = [
  'owner',
  'company_admin',
  'director',
  'restaurant_operator',
  'asst_restaurant_operator',
  'manager',
  'shift_lead',
];

const DEFAULT_ROLE_LABELS = {
  owner: 'Owner',
  company_admin: 'Company Admin',
  director: 'Director / DM',
  restaurant_operator: 'Restaurant Operator (GM)',
  asst_restaurant_operator: 'Asst. Restaurant Operator (AGM)',
  manager: 'Manager',
  shift_lead: 'Shift Lead',
};

const TIERS = ['A', 'B', 'C', 'D'];

export default function StabilitySnapshotPage() {
  const [snapshots, setSnapshots] = useState([]);
  const [roleKeys, setRoleKeys] = useState(DEFAULT_ROLE_KEYS);
  const [roleLabels, setRoleLabels] = useState(DEFAULT_ROLE_LABELS);
  const [summary, setSummary] = useState(null);
  const [selectedStores, setSelectedStores] = useState(() => new Set(STORE_DIRECTORY.map(s => s.id)));
  const [loading, setLoading] = useState(true);
  const [mcError, setMcError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mc/stability/snapshot');
      const data = await res.json();
      setSnapshots(Array.isArray(data.snapshots) ? data.snapshots : []);
      setRoleKeys(Array.isArray(data.roleKeys) && data.roleKeys.length ? data.roleKeys : DEFAULT_ROLE_KEYS);
      setRoleLabels(data.roleLabels && Object.keys(data.roleLabels).length ? data.roleLabels : DEFAULT_ROLE_LABELS);
      setSummary(data.summary || null);
      setMcError(data.mcError || null);
    } catch (e) {
      setMcError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Synthesize an empty shell for every directory store the user hasn't
  // filtered out, then overlay real MC snapshots on top. This guarantees
  // every store is visible (even with zero leadership recorded) so DMs can
  // instantly spot understaffed stores — that's the entire point of the grid.
  const displayStores = useMemo(() => {
    const byNumber = new Map();
    for (const snap of snapshots) {
      if (snap?.storeNumber) byNumber.set(String(snap.storeNumber), snap);
    }
    const visible = STORE_DIRECTORY
      .filter(s => selectedStores.has(s.id))
      .map(s => {
        const existing = byNumber.get(String(s.id));
        if (existing) return existing;
        return {
          storeNumber: s.id,
          storeName: getStoreLabel(s.id),
          roles: roleKeys.map(key => ({
            role: key,
            role_label: roleLabels[key] || key,
            employee_name: null,
            tier: null,
            status: 'open',
          })),
          filledCount: 0,
          totalSlots: roleKeys.length,
          openSlots: roleKeys.length,
          belowBCount: 0,
          isFullStore: false,
        };
      });
    // Also surface any MC stores that aren't in the directory (edge case).
    for (const snap of snapshots) {
      const key = String(snap.storeNumber);
      if (!STORE_DIRECTORY.find(s => s.id === key) && selectedStores.has(key)) {
        visible.push(snap);
      }
    }
    return visible;
  }, [snapshots, selectedStores, roleKeys, roleLabels]);

  // KPIs (locally computed for the current filter; backend summary covers all).
  const stats = useMemo(() => {
    let filled = 0, open = 0, total = 0, belowB = 0, fullStores = 0;
    for (const store of displayStores) {
      for (const slot of store.roles || []) {
        total++;
        if (slot.status === 'filled' && slot.employee_name) {
          filled++;
          if (slot.tier && slot.tier !== 'A' && slot.tier !== 'B') belowB++;
        } else {
          open++;
        }
      }
      if (store.isFullStore) fullStores++;
    }
    return { filled, open, total, belowB, fullStores };
  }, [displayStores]);

  const toggleStore = (id) => {
    setSelectedStores(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelectedStores(new Set(STORE_DIRECTORY.map(s => s.id)));
  const clearAll = () => setSelectedStores(new Set());

  const tierClass = (tier) => {
    const t = (tier || '').toUpperCase();
    if (TIERS.includes(t)) return styles[`tier${t}`];
    return styles.tierNone;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Weekly Employee Stability Snapshot</h1>
          <div className={styles.subtitle}>
            Leadership stability per store. Each column is a store, each row is a canonical role slot.
            Green = filled with A/B tier, amber = filled with C/D, red = OPEN gap. A full store has every slot filled B-or-better.
          </div>
        </div>
        <div className={styles.toolbar}>
          <button className={styles.btn} onClick={load}>Refresh</button>
        </div>
      </div>

      {mcError && (
        <div className={styles.banner}>
          Mission Control stability endpoint unavailable ({mcError}). Showing empty-shell grid from the store directory.
        </div>
      )}

      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Stores</div>
          <div className={styles.kpiValue}>{displayStores.length}</div>
          <div className={styles.kpiSub}>{stats.fullStores} full (all B+)</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Filled</div>
          <div className={styles.kpiValue} style={{ color: '#16a34a' }}>{stats.filled}</div>
          <div className={styles.kpiSub}>
            {stats.total > 0 ? Math.round(stats.filled / stats.total * 100) : 0}% of {stats.total} slots
          </div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Open Gaps</div>
          <div className={styles.kpiValue} style={{ color: '#dc2626' }}>{stats.open}</div>
          <div className={styles.kpiSub}>Unfilled leadership slots</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Below B</div>
          <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>{stats.belowB}</div>
          <div className={styles.kpiSub}>Filled with C or D tier</div>
        </div>
      </div>

      <div className={styles.filters}>
        <span className={styles.filterLabel}>Stores</span>
        <button className={styles.chip} onClick={selectAll}>All</button>
        <button className={styles.chip} onClick={clearAll}>None</button>
        {STORE_DIRECTORY.map(s => (
          <button
            key={s.id}
            className={`${styles.chip} ${selectedStores.has(s.id) ? styles.chipActive : ''}`}
            onClick={() => toggleStore(s.id)}
          >
            {getStoreLabel(s.id)}
          </button>
        ))}
      </div>

      <div className={styles.gridWrap}>
        <div className={styles.gridScroll}>
          <table className={styles.grid}>
            <thead>
              <tr>
                <th>Role</th>
                {displayStores.map(store => (
                  <th key={store.storeNumber}>
                    {store.storeNumber} {store.storeName}
                    {store.isFullStore && <span style={{ marginLeft: 6 }} title="Full store: every slot B or better">★</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleKeys.map(key => (
                <tr key={key}>
                  <td className={styles.roleCell}>{roleLabels[key] || key}</td>
                  {displayStores.map(store => {
                    const slot = (store.roles || []).find(r => r.role === key) || {
                      status: 'open', employee_name: null, tier: null,
                    };
                    const isOpen = slot.status !== 'filled' || !slot.employee_name;
                    const tierKey = (slot.tier || '').toUpperCase();
                    return (
                      <td key={store.storeNumber}>
                        <div className={styles.cell}>
                          {isOpen ? (
                            <div className={styles.vacant}>— OPEN —</div>
                          ) : (
                            <div className={styles.cellName}>{slot.employee_name}</div>
                          )}
                          <div className={styles.cellMeta}>
                            {!isOpen && (
                              <span className={`${styles.tierBadge} ${tierClass(tierKey)}`}>
                                {tierKey || '—'}
                              </span>
                            )}
                            <span className={`${styles.statusDot} ${isOpen ? styles.statusVacant : styles.statusFilled}`} />
                            <span className={styles.statusText}>{isOpen ? 'Open' : 'Filled'}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray-400)' }}>Loading…</div>}

      {summary && !loading && (
        <div style={{ marginTop: 16, fontSize: 11, color: 'var(--gray-500)', textAlign: 'center' }}>
          Source of truth: Mission Control employees + tier assessments. Fill rate across portfolio:{' '}
          <strong>{summary.fillRatePct}%</strong> ({summary.filledSlots}/{summary.totalSlots} slots,{' '}
          {summary.fullStores}/{summary.totalStores} full stores).
        </div>
      )}
    </div>
  );
}
