'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const EMPTY_FORM = () => ({
  guestName: '',
  address: '',
  complaintDate: new Date().toISOString().split('T')[0],
  cardCount: 1,
  reason: '',
  notes: '',
});

export default function FSCTrackerPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM());
  const [saving, setSaving] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/fsc?${params}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const openNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM());
    setShowModal(true);
  };

  const openEdit = (req) => {
    setEditId(req.id);
    setForm({
      guestName: req.guestName || '',
      address: req.address || '',
      complaintDate: req.complaintDate || '',
      cardCount: req.cardCount || 1,
      reason: req.reason || '',
      notes: req.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.guestName.trim()) return;
    setSaving(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const body = editId ? { id: editId, ...form } : form;
      const res = await fetch('/api/fsc', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Save failed');
      setShowModal(false);
      fetchRequests();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const markSent = async (id) => {
    const dateSent = new Date().toISOString().split('T')[0];
    await fetch('/api/fsc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, dateSent }),
    });
    fetchRequests();
  };

  const markUnsent = async (id) => {
    await fetch('/api/fsc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, dateSent: null }),
    });
    fetchRequests();
  };

  const deleteRequest = async (id) => {
    if (!confirm('Delete this FSC request?')) return;
    await fetch(`/api/fsc?id=${id}`, { method: 'DELETE' });
    fetchRequests();
  };

  // Stats
  const totalCards = requests.reduce((s, r) => s + (r.cardCount || 0), 0);
  const pending = requests.filter(r => !r.dateSent);
  const sent = requests.filter(r => !!r.dateSent);

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Loading FSC requests...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>FSC Tracker</h1>
          <p className={styles.subtitle}>Free Sub Card requests for guest recovery</p>
        </div>
        <button className={styles.addBtn} onClick={openNew}>+ New Request</button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{requests.length}</div>
          <div className={styles.statLabel}>Total Requests</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${pending.length > 0 ? styles.statAlert : ''}`}>{pending.length}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{sent.length}</div>
          <div className={styles.statLabel}>Sent</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalCards}</div>
          <div className={styles.statLabel}>Total Cards</div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <input
          className={styles.searchInput}
          placeholder="Search by guest name, reason..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {['all', 'pending', 'sent'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {requests.length === 0 ? (
        <div className={styles.empty}>
          {filter !== 'all' ? `No ${filter} requests found.` : 'No FSC requests yet. Click "+ New Request" to add one.'}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <span className={styles.colName}>Guest Name</span>
            <span className={styles.colDate}>Date</span>
            <span className={styles.colCards}>Cards</span>
            <span className={styles.colReason}>Reason</span>
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colActions}>Actions</span>
          </div>
          {requests.map(req => (
            <div key={req.id} className={styles.tableRow}>
              <span className={styles.colName}>{req.guestName}</span>
              <span className={styles.colDate}>{formatDate(req.complaintDate)}</span>
              <span className={styles.colCards}>{req.cardCount}</span>
              <span className={styles.colReason} title={req.reason}>{req.reason || '-'}</span>
              <span className={styles.colStatus}>
                {req.dateSent ? (
                  <span className={`${styles.statusBadge} ${styles.statusSent}`}>Sent</span>
                ) : (
                  <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span>
                )}
              </span>
              <span className={styles.colActions}>
                {req.dateSent ? (
                  <button className={styles.actionBtn} onClick={() => markUnsent(req.id)} title="Mark unsent">&#8634;</button>
                ) : (
                  <button className={styles.actionBtn} onClick={() => markSent(req.id)} title="Mark sent">&#10003;</button>
                )}
                <button className={styles.actionBtn} onClick={() => openEdit(req)} title="Edit">&#9998;</button>
                <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => deleteRequest(req.id)} title="Delete">&#10005;</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{editId ? 'Edit FSC Request' : 'New FSC Request'}</h2>
            <div className={styles.modalFields}>
              <div className={styles.modalField}>
                <label>Guest Name *</label>
                <input value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} placeholder="Guest name" />
              </div>
              <div className={styles.modalField}>
                <label>Mailing Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, City, State, ZIP" />
              </div>
              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label>Complaint Date</label>
                  <input type="date" value={form.complaintDate} onChange={e => setForm({ ...form, complaintDate: e.target.value })} />
                </div>
                <div className={styles.modalField}>
                  <label>Number of Cards</label>
                  <input type="number" min="1" max="50" value={form.cardCount} onChange={e => setForm({ ...form, cardCount: parseInt(e.target.value) || 1 })} />
                </div>
              </div>
              <div className={styles.modalField}>
                <label>Reason / Complaint</label>
                <textarea rows={3} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="What happened?" />
              </div>
              <div className={styles.modalField}>
                <label>Notes</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Internal notes" />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.modalSave} onClick={handleSave} disabled={saving || !form.guestName.trim()}>
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
