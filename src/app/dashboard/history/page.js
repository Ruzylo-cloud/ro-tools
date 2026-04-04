'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const TYPE_LABELS = {
  'flyer': 'Catering Flyer',
  'catering-order': 'Catering Order',
  'written-warning': 'Written Warning',
  'evaluation': 'Performance Evaluation',
  'timesheet-correction': 'Timesheet Correction',
  'attestation-correction': 'Attestation Correction',
  'injury-report': 'Injury Report',
  'coaching-form': 'Employee Coaching',
  'new-hire-checklist': 'New Hire Checklist',
  'termination': 'Employee Termination',
  'resignation': 'Employee Resignation',
  'meal-break-waiver': 'Meal Break Waiver',
  'food-labels': 'Food Labels',
  'work-orders': 'Work Orders',
  'manager-log': 'Manager Log',
  'dm-walkthroughs': 'DM Walk-Through',
  'onboarding-packets': 'Onboarding Packet',
  'training-level1': 'Level 1 Training',
  'training-level2': 'Level 2 Training',
  'training-level3': 'Level 3 Training',
  'training-slicer': 'Slicer Training',
  'training-opener': 'Opener Training',
  'training-shiftlead': 'Shift Lead Training',
  'training-orientation': 'Orientation Packet',
};

const ALL_TYPES = Object.keys(TYPE_LABELS);

const ACTION_LABELS = {
  'download': 'Download',
  'drive-save': 'Drive Save',
  'email-send': 'Email',
};

const LIMIT = 50;

function getKeyDetail(log) {
  const fd = log.formData || {};
  if (log.generatorType === 'flyer') return fd.storeName || '';
  if (log.generatorType === 'catering-order') return fd.customerName || '';
  // HR forms — employee name
  return fd.employeeName || fd.customerName || '';
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function actionBadgeClass(action) {
  if (action === 'drive-save') return styles.badgeDrive;
  if (action === 'email-send') return styles.badgeEmail;
  return styles.badgeDownload;
}

// RT-239: CSV export helper
function exportToCSV(logs) {
  const headers = ['Date', 'Document Type', 'Action', 'Key Details'];
  const rows = logs.map(log => [
    formatDate(log.timestamp),
    TYPE_LABELS[log.generatorType] || log.generatorType || '',
    ACTION_LABELS[log.action] || log.action || '',
    getKeyDetail(log),
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ro-tools-history-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const debounceRef = useRef(null);

  const fetchLogs = useCallback(async (currentOffset) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', LIMIT);
      params.set('offset', currentOffset);
      if (search.trim()) params.set('search', search.trim());
      if (typeFilter) params.set('type', typeFilter);
      if (dateFrom) params.set('from', new Date(dateFrom).toISOString());
      if (dateTo) {
        // Set to end of day
        const toEnd = new Date(dateTo);
        toEnd.setHours(23, 59, 59, 999);
        params.set('to', toEnd.toISOString());
      }
      if (actionFilter) params.set('action', actionFilter);

      const res = await fetch(`/api/logs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch {
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, actionFilter, dateFrom, dateTo]);

  // Re-fetch when filters change (debounce search)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setOffset(0);
      fetchLogs(0);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, typeFilter, actionFilter, dateFrom, dateTo, fetchLogs]);

  // Re-fetch on pagination
  useEffect(() => {
    fetchLogs(offset);
  }, [offset]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayLogs = logs;

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>History</h1>
        {/* RT-239: CSV export */}
        {displayLogs.length > 0 && (
          <button
            onClick={() => exportToCSV(displayLogs)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--jm-blue)', cursor: 'pointer' }}
          >
            ↓ Export CSV
          </button>
        )}
      </div>
      <p className={styles.subtitle}>Your document generation history</p>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search history..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Document Types</option>
          {ALL_TYPES.map(t => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
        >
          <option value="">All Actions</option>
          <option value="download">Download</option>
          <option value="drive-save">Drive Save</option>
          <option value="email-send">Email</option>
        </select>
        <input
          type="date"
          className={styles.dateInput}
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          title="From date"
        />
        <input
          type="date"
          className={styles.dateInput}
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          title="To date"
        />
        {(search || typeFilter || actionFilter || dateFrom || dateTo) && (
          <button
            onClick={() => { setSearch(''); setTypeFilter(''); setActionFilter(''); setDateFrom(''); setDateTo(''); }}
            style={{ padding: '6px 12px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <div>Loading history...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayLogs.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>&#x1F4C4;</div>
          <div className={styles.emptyTitle}>No history found</div>
          <div className={styles.emptyText}>
            {search || typeFilter || actionFilter || dateFrom || dateTo
              ? 'Try adjusting your filters.'
              : 'Documents you generate will appear here.'}
          </div>
        </div>
      )}

      {/* Results Table */}
      {!loading && displayLogs.length > 0 && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>Document Type</th>
                  <th>Action</th>
                  <th>Key Details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayLogs.map(log => (
                  <tr key={log.id}>
                    <td className={styles.dateCell}>{formatDate(log.timestamp)}</td>
                    <td className={styles.typeCell}>{TYPE_LABELS[log.generatorType] || log.generatorType}</td>
                    <td>
                      <span className={`${styles.badge} ${actionBadgeClass(log.action)}`}>
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className={styles.detailCell}>{getKeyDetail(log)}</td>
                    <td>
                      <Link
                        href={`/dashboard/generators/${log.generatorType}?prefill=1`}
                        className={styles.regenLink}
                      >
                        Re-generate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.pageInfo}>
              Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
            </div>
            <div className={styles.pageButtons}>
              <button
                className={styles.pageBtn}
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
              >
                Previous
              </button>
              <button
                className={styles.pageBtn}
                disabled={offset + LIMIT >= total}
                onClick={() => setOffset(offset + LIMIT)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
