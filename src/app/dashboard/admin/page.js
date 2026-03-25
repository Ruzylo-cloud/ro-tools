'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const roleClass = (role, approved) => {
    if (!approved) return styles.rolePending;
    if (role === 'administrator') return styles.roleAdmin;
    if (role === 'district_manager') return styles.roleDm;
    return styles.roleOp;
  };

  const roleLabel = (role) => {
    if (role === 'administrator') return 'Admin';
    if (role === 'district_manager') return 'District Manager';
    return 'Operator';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <p className={styles.subtitle}>Manage users and approve role requests.</p>

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
    </div>
  );
}
