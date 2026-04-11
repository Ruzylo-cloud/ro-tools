'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { STORE_DIRECTORY, getStoreLabel } from '@/lib/store-directory';
import styles from './page.module.css';

const ROLE_SLOTS = [
  { key: 'RO',      label: 'RO' },
  { key: 'ARO',     label: 'ARO' },
  { key: 'SL_1',    label: 'SL 1' },
  { key: 'SL_2',    label: 'SL 2' },
  { key: 'SL_CREW', label: 'SL / Crew' },
];

const STATUSES = [
  { key: 'filled',   label: 'Filled',   cls: 'statusFilled' },
  { key: 'vacant',   label: 'Vacant',   cls: 'statusVacant' },
  { key: 'training', label: 'Training', cls: 'statusTraining' },
  { key: 'at_risk',  label: 'At-Risk',  cls: 'statusAtRisk' },
];

const TIERS = ['A', 'B', 'C', 'D'];

export default function StabilitySnapshotPage() {
  const [snapshot, setSnapshot] = useState([]);
  const [selectedStores, setSelectedStores] = useState(() => new Set(STORE_DIRECTORY.map(s => s.id)));
  const [editCell, setEditCell] = useState(null); // { storeNumber, slot, current }
  const [loading, setLoading] = useState(true);
  const [mcError, setMcError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mc/stability');
      const data = await res.json();
      setSnapshot(data.snapshot || []);
      setMcError(data.mcError || null);
    } catch (e) {
      setMcError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visibleStores = useMemo(
    () => snapshot.filter(s => selectedStores.has(String(s.storeNumber))),
    [snapshot, selectedStores],
  );

  // If MC empty, synthesize shell from directory so grid still renders
  const displayStores = useMemo(() => {
    if (visibleStores.length > 0) return visibleStores;
    return STORE_DIRECTORY
      .filter(s => selectedStores.has(s.id))
      .map(s => ({
        storeNumber: s.id,
        storeName: getStoreLabel(s.id),
        roles: Object.fromEntries(ROLE_SLOTS.map(r => [r.key, {
          label: r.label, employeeName: '', status: 'vacant', notes: '', tier: '',
        }])),
      }));
  }, [visibleStores, selectedStores]);

  // KPIs
  const stats = useMemo(() => {
    let filled = 0, vacant = 0, atRisk = 0, total = 0;
    for (const store of displayStores) {
      for (const slotKey of ROLE_SLOTS.map(r => r.key)) {
        total++;
        const r = store.roles?.[slotKey];
        if (!r) { vacant++; continue; }
        if (r.status === 'filled') filled++;
        else if (r.status === 'at_risk') atRisk++;
        else if (r.status === 'vacant' || !r.employeeName) vacant++;
      }
    }
    return { filled, vacant, atRisk, total };
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

  const openEdit = (store, slotKey) => {
    const r = store.roles?.[slotKey] || {};
    setEditCell({
      storeNumber: String(store.storeNumber),
      storeName: store.storeName,
      slot: slotKey,
      employeeName: r.employeeName || '',
      status: r.status || 'vacant',
      tier: r.tier || '',
      notes: r.notes || '',
    });
  };

  const saveEdit = async () => {
    if (!editCell) return;
    const body = {
      store_number: editCell.storeNumber,
      role_slot: editCell.slot,
      employee_name: editCell.employeeName,
      status: editCell.status,
      tier: editCell.tier,
      notes: editCell.notes,
    };
    try {
      await fetch('/api/mc/stability/cell', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch { /* non-fatal — always update local */ }
    // Local update
    setSnapshot(prev => {
      const exists = prev.some(s => String(s.storeNumber) === editCell.storeNumber);
      const updater = (s) => {
        if (String(s.storeNumber) !== editCell.storeNumber) return s;
        return {
          ...s,
          roles: {
            ...(s.roles || {}),
            [editCell.slot]: {
              label: ROLE_SLOTS.find(r => r.key === editCell.slot)?.label,
              employeeName: editCell.employeeName,
              status: editCell.status,
              tier: editCell.tier,
              notes: editCell.notes,
            },
          },
        };
      };
      if (exists) return prev.map(updater);
      // Create shell entry
      return [...prev, {
        storeNumber: editCell.storeNumber,
        storeName: editCell.storeName,
        roles: { [editCell.slot]: {
          employeeName: editCell.employeeName,
          status: editCell.status,
          tier: editCell.tier,
          notes: editCell.notes,
        } },
      }];
    });
    setEditCell(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Weekly Employee Stability Snapshot</h1>
          <div className={styles.subtitle}>
            Role-slot grid per store. Click any cell to edit inline. Saves directly to Mission Control.
          </div>
        </div>
        <div className={styles.toolbar}>
          <button className={styles.btn} onClick={load}>Refresh</button>
        </div>
      </div>

      {mcError && (
        <div className={styles.banner}>
          Mission Control stability endpoint unavailable ({mcError}). Edits save locally; grid falls back to the store directory shell.
        </div>
      )}

      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Total Slots</div>
          <div className={styles.kpiValue}>{stats.total}</div>
          <div className={styles.kpiSub}>{displayStores.length} stores × {ROLE_SLOTS.length} roles</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Filled</div>
          <div className={styles.kpiValue} style={{ color: '#16a34a' }}>{stats.filled}</div>
          <div className={styles.kpiSub}>{stats.total > 0 ? Math.round(stats.filled / stats.total * 100) : 0}%</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Vacant</div>
          <div className={styles.kpiValue} style={{ color: '#dc2626' }}>{stats.vacant}</div>
          <div className={styles.kpiSub}>Open role slots</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>At-Risk</div>
          <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>{stats.atRisk}</div>
          <div className={styles.kpiSub}>Flagged for attention</div>
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
                  <th key={store.storeNumber}>{store.storeNumber} {store.storeName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLE_SLOTS.map(slot => (
                <tr key={slot.key}>
                  <td className={styles.roleCell}>{slot.label}</td>
                  {displayStores.map(store => {
                    const r = store.roles?.[slot.key] || {};
                    const statusMeta = STATUSES.find(s => s.key === r.status) || STATUSES[1];
                    const tierKey = (r.tier || '').toUpperCase();
                    return (
                      <td key={store.storeNumber}>
                        <div className={styles.cell} onClick={() => openEdit(store, slot.key)}>
                          {r.employeeName ? (
                            <div className={styles.cellName}>{r.employeeName}</div>
                          ) : (
                            <div className={styles.vacant}>— vacant —</div>
                          )}
                          <div className={styles.cellMeta}>
                            {tierKey && TIERS.includes(tierKey) && (
                              <span className={`${styles.tierBadge} ${styles[`tier${tierKey}`]}`}>{tierKey}</span>
                            )}
                            <span className={`${styles.statusDot} ${styles[statusMeta.cls]}`} />
                            <span className={styles.statusText}>{statusMeta.label}</span>
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

      {editCell && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setEditCell(null); }}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>{editCell.storeName || editCell.storeNumber} · {ROLE_SLOTS.find(r => r.key === editCell.slot)?.label}</div>
            <div className={styles.modalSub}>Store {editCell.storeNumber}</div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Employee Name</label>
              <input
                className={styles.input}
                value={editCell.employeeName}
                onChange={e => setEditCell(c => ({ ...c, employeeName: e.target.value }))}
                placeholder="Full name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Status</label>
              <select
                className={styles.fieldSelect}
                value={editCell.status}
                onChange={e => setEditCell(c => ({ ...c, status: e.target.value }))}
              >
                {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Tier</label>
              <div className={styles.tierPicker}>
                {TIERS.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tierOpt} ${editCell.tier === t ? `${styles.tierOptActive} ${styles[`tier${t}`]}` : ''}`}
                    onClick={() => setEditCell(c => ({ ...c, tier: c.tier === t ? '' : t }))}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Notes</label>
              <textarea
                className={styles.textarea}
                value={editCell.notes}
                onChange={e => setEditCell(c => ({ ...c, notes: e.target.value }))}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setEditCell(null)}>Cancel</button>
              <button className={styles.btnSave} onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
