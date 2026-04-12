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
  { value: 'termination', label: 'Termination' },
  { value: 'resignation', label: 'Resignation' },
  { value: 'meal-break-waiver', label: 'Meal Break Waiver' },
  { value: 'work-orders', label: 'Work Orders' },
  { value: 'manager-log', label: 'Manager Log' },
  { value: 'dm-walkthroughs', label: 'DM Walk-Through' },
  { value: 'onboarding-packets', label: 'Onboarding Packet' },
  { value: 'food-labels', label: 'Food Labels' },
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
  // RT-230: Date range filter for logs
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  // RT-225: User search filter
  const [userSearch, setUserSearch] = useState('');
  // RT-128: Analytics stats
  const [analytics, setAnalytics] = useState(null);
  // RT-229: Stats
  const [userStats, setUserStats] = useState({ total: 0, pending: 0, approved: 0, admins: 0 });

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      try {
        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) throw new Error(profileRes.statusText);
        const profileData = await profileRes.json();

        if (cancelled) return;

        if (!profileData.isAdmin) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);

        const usersRes = await fetch('/api/admin/users');
        if (!usersRes.ok) throw new Error(usersRes.statusText);
        const usersData = await usersRes.json();

        if (!cancelled && usersData.users) {
          setUsers(usersData.users);
          // RT-229: Compute stats
          const all = usersData.users;
          setUserStats({
            total: all.length,
            pending: all.filter(u => u.rolePending).length,
            approved: all.filter(u => !u.rolePending).length,
            admins: all.filter(u => u.role === 'administrator').length,
          });
        }
      } catch (e) {
        console.error('[admin] loadStats failed (user sees empty state):', e);
      }
      if (!cancelled) setLoading(false);
    }

    loadAdmin();
    return () => { cancelled = true; };
  }, [router]);

  // RT-224: Export logs to CSV
  const exportLogsCsv = async () => {
    try {
      const params = new URLSearchParams({ limit: '1000', offset: '0' });
      if (logSearch) params.set('search', logSearch);
      if (logType) params.set('type', logType);
      if (logAction) params.set('action', logAction);
      if (logDateFrom) params.set('from', logDateFrom);
      if (logDateTo) params.set('to', logDateTo);
      const res = await fetch(`/api/logs?${params}`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const rows = data.logs || [];
      const header = ['Time', 'User', 'Email', 'Type', 'Action', 'Detail'];
      const csv = [header, ...rows.map(l => [
        formatTimestamp(l.timestamp),
        l.userName || '',
        l.userEmail || '',
        l.generatorType || '',
        l.action || '',
        extractDetail(l),
      ].map(v => `"${String(v).replace(/"/g, '""')}"`))].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `activity-logs-${new Date().toISOString().slice(0,10)}.csv`;
      a.click(); URL.revokeObjectURL(url);
      showToast('CSV exported', 'success');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  const fetchLogs = useCallback(async (offset = 0) => {
    setLogsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50', offset: String(offset) });
      if (logSearch) params.set('search', logSearch);
      if (logType) params.set('type', logType);
      if (logAction) params.set('action', logAction);
      // RT-230: Date range
      if (logDateFrom) params.set('from', logDateFrom);
      if (logDateTo) params.set('to', logDateTo);
      const res = await fetch(`/api/logs?${params}`);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setLogs(data.logs || []);
      setLogsTotal(data.total || 0);
      setLogsOffset(offset);
    } catch {
      showToast('Failed to load logs.', 'error');
    }
    setLogsLoading(false);
  }, [logSearch, logType, logAction, logDateFrom, logDateTo, showToast]);

  useEffect(() => {
    if (tab === 'logs' && isAdmin) {
      fetchLogs(0);
    }
  }, [tab, isAdmin, fetchLogs]);

  const [actionLoading, setActionLoading] = useState(null);
  // RT-219: Deactivation confirmation
  const [confirmAction, setConfirmAction] = useState(null); // { userId, action, userName }
  // RT-223: Bulk selection
  const [bulkSelected, setBulkSelected] = useState([]);

  const handleAction = async (userId, action) => {
    setActionLoading(userId);
    setConfirmAction(null);
    try {
      const res0 = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      // RT-218: Approval email notification
      const targetUser = users.find(u => u.id === userId);
      if (res0.ok && targetUser) {
        const msg = action === 'approve'
          ? `Approved — ${targetUser.email} notified`
          : `Denied — ${targetUser.email} notified`;
        showToast(msg, action === 'approve' ? 'success' : 'error');
      }
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      showToast('Action failed. Please try again.', 'error');
    }
    setActionLoading(null);
  };

  // RT-223: Bulk approve/deny all selected
  const handleBulkAction = async (action) => {
    for (const userId of bulkSelected) {
      await handleAction(userId, action);
    }
    setBulkSelected([]);
  };

  const toggleBulkSelect = (id) => {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (loading) return <div className={styles.container}><p style={{ color: 'var(--gray-500)' }}>Loading...</p></div>;
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
    if (action === 'download') return { background: 'rgba(19,74,124,0.1)', color: 'var(--jm-blue)' };
    if (action === 'drive-save') return { background: 'rgba(22,163,74,0.1)', color: '#16a34a' };
    if (action === 'email-send') return { background: 'rgba(238,50,39,0.1)', color: 'var(--jm-red)' };
    return { background: '#f3f4f6', color: 'var(--gray-500)' };
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

  // RT-225: Filtered users by search + store filter
  const [storeFilter, setStoreFilter] = useState('');
  const filteredApproved = approved.filter(u => {
    if (userSearch) {
      const q = userSearch.toLowerCase();
      if (!(u.displayName || '').toLowerCase().includes(q) && !(u.email || '').toLowerCase().includes(q)) return false;
    }
    if (storeFilter && u.storeNumber !== storeFilter) return false;
    return true;
  });
  const uniqueStores = [...new Set(approved.map(u => u.storeNumber).filter(Boolean))].sort();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <p className={styles.subtitle}>Manage users, approvals, and activity logs.</p>
      {/* RT-229: Stats bar */}
      {!loading && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Users', val: userStats.total, color: 'var(--jm-blue)' },
            { label: 'Pending', val: userStats.pending, color: 'var(--jm-red)' },
            { label: 'Approved', val: userStats.approved, color: '#16a34a' },
            { label: 'Admins', val: userStats.admins, color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 100, padding: '12px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`}
          onClick={() => setTab('users')}
        >
          Users
          {/* RT-222: Pending badge */}
          {pending.length > 0 && (
            <span style={{ marginLeft: 6, background: 'var(--jm-red)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', verticalAlign: 'middle' }}>
              {pending.length}
            </span>
          )}
        </button>
        <button
          className={`${styles.tab} ${tab === 'logs' ? styles.tabActive : ''}`}
          onClick={() => setTab('logs')}
        >
          Activity Logs
        </button>
        {/* RT-128: Analytics tab */}
        <button
          className={`${styles.tab} ${tab === 'stats' ? styles.tabActive : ''}`}
          onClick={() => {
            setTab('stats');
            if (!analytics) {
              fetch('/api/logs/analytics').then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); }).then(d => setAnalytics(d)).catch(e => { console.error('[admin] Analytics load failed:', e); });
            }
          }}
        >
          Analytics
        </button>
      </div>

      {/* RT-219: Deactivation confirmation modal */}
      {confirmAction && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--white)', borderRadius: 12, padding: 28, maxWidth: 360, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 8 }}>
              {confirmAction.action === 'deny' ? 'Deny Access?' : 'Approve User?'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>
              {confirmAction.action === 'deny'
                ? `This will deny ${confirmAction.userName}'s role request. They will remain in the system as Operator.`
                : `This will approve ${confirmAction.userName}'s role request and notify them by email.`
              }
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmAction(null)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--white)', cursor: 'pointer', fontSize: 13 }}>
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirmAction.userId, confirmAction.action)}
                style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: confirmAction.action === 'deny' ? '#dc2626' : '#16a34a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                {confirmAction.action === 'deny' ? 'Deny' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <>
          {/* Pending Approvals */}
          <div className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className={styles.sectionTitle} style={{ margin: 0 }}>Pending Approvals</div>
              {/* RT-223: Bulk actions */}
              {bulkSelected.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)', alignSelf: 'center' }}>{bulkSelected.length} selected</span>
                  <button onClick={() => handleBulkAction('approve')} style={{ padding: '4px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Approve All
                  </button>
                  <button onClick={() => handleBulkAction('deny')} style={{ padding: '4px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Deny All
                  </button>
                </div>
              )}
            </div>
            {pending.length === 0 ? (
              <div className={styles.empty}>No pending approvals.</div>
            ) : (
              pending.map(u => (
                <div key={u.id} className={styles.userRow}>
                  {/* RT-223: Bulk checkbox */}
                  <input type="checkbox" checked={bulkSelected.includes(u.id)} onChange={() => toggleBulkSelect(u.id)} style={{ accentColor: 'var(--jm-blue)', marginRight: 8 }} />
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{u.displayName || 'No name'}</span>
                    <span className={styles.userEmail}>{u.email}</span>
                  </div>
                  <span className={`${styles.userRole} ${styles.rolePending}`}>
                    Requesting: {roleLabel(u.role)}
                  </span>
                  <div className={styles.actions}>
                    <button className={styles.approveBtn} onClick={() => setConfirmAction({ userId: u.id, action: 'approve', userName: u.displayName || u.email })} disabled={actionLoading === u.id}>
                      {actionLoading === u.id ? '...' : 'Approve'}
                    </button>
                    {/* RT-219: Confirm before deny */}
                    <button className={styles.denyBtn} onClick={() => setConfirmAction({ userId: u.id, action: 'deny', userName: u.displayName || u.email })} disabled={actionLoading === u.id}>
                      {actionLoading === u.id ? '...' : 'Deny'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* All Users */}
          <div className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div className={styles.sectionTitle} style={{ margin: 0 }}>All Users</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Store filter */}
                {uniqueStores.length > 1 && (
                  <select
                    value={storeFilter}
                    onChange={e => setStoreFilter(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: '#111' }}
                  >
                    <option value="">All Stores</option>
                    {uniqueStores.map(s => <option key={s} value={s}>Store #{s}</option>)}
                  </select>
                )}
                {/* RT-225: User search */}
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  maxLength={200}
                  style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: '#111', width: 200 }}
                />
              </div>
            </div>
            {filteredApproved.length === 0 ? (
              <div className={styles.empty}>{userSearch ? 'No users match your search.' : 'No users yet.'}</div>
            ) : (
              filteredApproved.map(u => (
                <div key={u.id} className={styles.userRow}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{u.displayName || 'No name'}</span>
                    <span className={styles.userEmail}>{u.email}</span>
                    {/* RT-226: Last login */}
                    {u.lastLoginAt && (
                      <span style={{ fontSize: 10, color: '#9ca3af', display: 'block' }}>
                        Last login: {new Date(u.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
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

          {/* Filters — RT-230 date range, RT-224 export */}
          <div className={styles.logFilters}>
            <input
              type="text"
              className={styles.logSearch}
              placeholder="Search by name, email, document..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs(0)}
              maxLength={200}
            />
            <select className={styles.logSelect} value={logType} onChange={(e) => { setLogType(e.target.value); }}>
              {GENERATOR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select className={styles.logSelect} value={logAction} onChange={(e) => { setLogAction(e.target.value); }}>
              {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            {/* RT-230: Date range */}
            <input type="date" value={logDateFrom} onChange={e => setLogDateFrom(e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: '#111' }} title="From date" />
            <input type="date" value={logDateTo} onChange={e => setLogDateTo(e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: '#111' }} title="To date" />
            <button className={styles.logSearchBtn} onClick={() => fetchLogs(0)}>Search</button>
            {/* RT-224: Export CSV */}
            <button
              onClick={exportLogsCsv}
              style={{ padding: '6px 14px', background: 'var(--jm-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              ↓ CSV
            </button>
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

      {/* RT-128: Analytics tab */}
      {tab === 'stats' && (
        <div>
          {!analytics ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Loading analytics...</div>
          ) : (
            <>
              {/* Summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'Total Generated', val: analytics.total, color: 'var(--jm-blue)' },
                  { label: 'Today', val: analytics.today, color: '#2563eb' },
                  { label: 'This Week', val: analytics.thisWeek, color: '#16a34a' },
                  { label: 'This Month', val: analytics.thisMonth, color: '#7c3aed' },
                  { label: 'Active Users (7d)', val: analytics.activeUsers7, color: '#b45309' },
                  { label: 'Active Users (30d)', val: analytics.activeUsers30, color: '#0891b2' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Top generators */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 20px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--jm-blue)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Top Generators</div>
                {analytics.topGenerators.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No data yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {analytics.topGenerators.map((g, i) => {
                      const maxCount = analytics.topGenerators[0]?.count || 1;
                      const pct = Math.round((g.count / maxCount) * 100);
                      return (
                        <div key={g.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 20, fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'right', flexShrink: 0 }}>{i + 1}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.label}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--jm-blue)', flexShrink: 0, marginLeft: 8 }}>{g.count}</span>
                            </div>
                            <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 2, background: i === 0 ? 'var(--jm-red)' : 'var(--jm-blue)', width: `${pct}%`, transition: 'width 0.5s' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
