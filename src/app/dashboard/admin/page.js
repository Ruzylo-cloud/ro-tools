'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

const GENERATOR_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'training-level1', label: 'Level 1 Training' },
  { value: 'training-level2', label: 'Level 2 Training' },
  { value: 'training-level3', label: 'Level 3 Training' },
  { value: 'training-slicer', label: 'Slicer Training' },
  { value: 'training-opener', label: 'Opener Training' },
  { value: 'training-shiftlead', label: 'Shift Lead Training' },
  { value: 'new-hire-checklist', label: 'New Hire Checklist' },
  { value: 'written-warning', label: 'Written Warning' },
  { value: 'coaching-form', label: 'Coaching Form' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'attestation-correction', label: 'Attestation Correction' },
  { value: 'timesheet-correction', label: 'Timesheet Correction' },
  { value: 'catering-order', label: 'Catering Order' },
  { value: 'injury-report', label: 'Injury Report' },
  { value: 'flyer', label: 'Catering Flyer' },
];

const ACTION_TYPES = [
  { value: '', label: 'All Actions' },
  { value: 'download', label: 'Download' },
  { value: 'drive-save', label: 'Drive Save' },
  { value: 'email-send', label: 'Email Send' },
];

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Logs state
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsOffset, setLogsOffset] = useState(0);
  const [logSearch, setLogSearch] = useState('');
  const [logType, setLogType] = useState('');
  const [logAction, setLogAction] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      try {
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();

        if (cancelled) return;

        if (!profileData.isAdmin) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);

        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();

        if (!cancelled && usersData.users) {
          setUsers(usersData.users);
        }
      } catch {
        // Silently handle — user sees empty state
      }
      if (!cancelled) setLoading(false);
    }

    loadAdmin();
    return () => { cancelled = true; };
  }, [router]);

  const fetchLogs = useCallback(async (offset = 0) => {
    setLogsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50', offset: String(offset) });
      if (logSearch) params.set('search', logSearch);
      if (logType) params.set('type', logType);
      if (logAction) params.set('action', logAction);
      const res = await fetch(`/api/logs?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setLogsTotal(data.total || 0);
      setLogsOffset(offset);
    } catch {
      showToast('Failed to load logs.', 'error');
    }
    setLogsLoading(false);
  }, [logSearch, logType, logAction, showToast]);

  useEffect(() => {
    if (tab === 'logs' && isAdmin) {
      fetchLogs(0);
    }
  }, [tab, isAdmin, fetchLogs]);

  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (userId, action) => {
    setActionLoading(userId);
    try {
      await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      showToast('Action failed. Please try again.', 'error');
    }
    setActionLoading(null);
  };

  if (loading) return <div className={styles.container}><p style={{ color: '#6b7280' }}>Loading...</p></div>;
  if (!isAdmin) return null;

  const pending = users.filter(u => u.rolePending);
  const approved = users.filter(u => !u.rolePending);

  const roleClass = (role, isApproved) => {
    if (!isApproved) return styles.rolePending;
    if (role === 'administrator') return styles.roleAdmin;
    if (role === 'district_manager') return styles.roleDm;
    return styles.roleOp;
  };

  const roleLabel = (role) => {
    if (role === 'administrator') return 'Admin';
    if (role === 'district_manager') return 'District Manager';
    return 'Operator';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const actionBadgeStyle = (action) => {
    if (action === 'download') return { background: 'rgba(19,74,124,0.1)', color: '#134A7C' };
    if (action === 'drive-save') return { background: 'rgba(22,163,74,0.1)', color: '#16a34a' };
    if (action === 'email-send') return { background: 'rgba(238,50,39,0.1)', color: '#EE3227' };
    return { background: '#f3f4f6', color: '#6b7280' };
  };

  const extractDetail = (log) => {
    const fd = log.formData || {};
    const parts = [];
    if (fd.employeeName) parts.push(fd.employeeName);
    if (fd.customerName) parts.push(fd.customerName);
    if (fd.storeName) parts.push(fd.storeName);
    return parts.join(' · ') || '—';
  };

  const logsPageCount = Math.ceil(logsTotal / 50);
  const logsCurrentPage = Math.floor(logsOffset / 50) + 1;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <p className={styles.subtitle}>Manage users, approvals, and activity logs.</p>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`}
          onClick={() => setTab('users')}
        >
          Users
        </button>
        <button
          className={`${styles.tab} ${tab === 'logs' ? styles.tabActive : ''}`}
          onClick={() => setTab('logs')}
        >
          Activity Logs
        </button>
      </div>

      {tab === 'users' && (
        <>
          {/* Pending Approvals */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Pending Approvals</div>
            {pending.length === 0 ? (
              <div className={styles.empty}>No pending approvals.</div>
            ) : (
              pending.map(u => (
                <div key={u.id} className={styles.userRow}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{u.displayName || 'No name'}</span>
                    <span className={styles.userEmail}>{u.email}</span>
                  </div>
                  <span className={`${styles.userRole} ${styles.rolePending}`}>
                    Requesting: {roleLabel(u.role)}
                  </span>
                  <div className={styles.actions}>
                    <button className={styles.approveBtn} onClick={() => handleAction(u.id, 'approve')} disabled={actionLoading === u.id}>
                      {actionLoading === u.id ? '...' : 'Approve'}
                    </button>
                    <button className={styles.denyBtn} onClick={() => handleAction(u.id, 'deny')} disabled={actionLoading === u.id}>
                      {actionLoading === u.id ? '...' : 'Deny'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* All Users */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>All Users</div>
            {approved.length === 0 ? (
              <div className={styles.empty}>No users yet.</div>
            ) : (
              approved.map(u => (
                <div key={u.id} className={styles.userRow}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{u.displayName || 'No name'}</span>
                    <span className={styles.userEmail}>{u.email}</span>
                  </div>
                  <span className={`${styles.userRole} ${roleClass(u.role, u.roleApproved)}`}>
                    {roleLabel(u.role)}
                  </span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{u.stores} store{u.stores !== 1 ? 's' : ''}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'logs' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Activity Logs</div>

          {/* Filters */}
          <div className={styles.logFilters}>
            <input
              type="text"
              className={styles.logSearch}
              placeholder="Search by name, email, document..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs(0)}
            />
            <select className={styles.logSelect} value={logType} onChange={(e) => { setLogType(e.target.value); }}>
              {GENERATOR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select className={styles.logSelect} value={logAction} onChange={(e) => { setLogAction(e.target.value); }}>
              {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <button className={styles.logSearchBtn} onClick={() => fetchLogs(0)}>Search</button>
          </div>

          {logsLoading ? (
            <div className={styles.empty}>Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className={styles.empty}>No activity logs found.</div>
          ) : (
            <>
              <div className={styles.logTable}>
                <div className={styles.logHeader}>
                  <span className={styles.logColTime}>Time</span>
                  <span className={styles.logColUser}>User</span>
                  <span className={styles.logColType}>Type</span>
                  <span className={styles.logColAction}>Action</span>
                  <span className={styles.logColDetail}>Detail</span>
                </div>
                {logs.map((log) => (
                  <div key={log.id} className={styles.logRow}>
                    <span className={styles.logColTime}>{formatTimestamp(log.timestamp)}</span>
                    <span className={styles.logColUser}>
                      <span style={{ fontWeight: 600 }}>{log.userName || '—'}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{log.userEmail || ''}</span>
                    </span>
                    <span className={styles.logColType}>{log.generatorType || '—'}</span>
                    <span className={styles.logColAction}>
                      <span className={styles.actionBadge} style={actionBadgeStyle(log.action)}>
                        {log.action || '—'}
                      </span>
                    </span>
                    <span className={styles.logColDetail}>{extractDetail(log)}</span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {logsPageCount > 1 && (
                <div className={styles.logPagination}>
                  <button
                    className={styles.logPageBtn}
                    disabled={logsOffset === 0}
                    onClick={() => fetchLogs(logsOffset - 50)}
                  >
                    Previous
                  </button>
                  <span className={styles.logPageInfo}>
                    Page {logsCurrentPage} of {logsPageCount} ({logsTotal} total)
                  </span>
                  <button
                    className={styles.logPageBtn}
                    disabled={logsOffset + 50 >= logsTotal}
                    onClick={() => fetchLogs(logsOffset + 50)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
