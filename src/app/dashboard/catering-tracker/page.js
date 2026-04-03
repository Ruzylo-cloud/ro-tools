'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

const FREQUENCY_OPTIONS = [
  { value: '', label: 'Not set' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one-time', label: 'One-time' },
];

const FREQUENCY_DAYS = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
  yearly: 365,
};

function getFollowUpStatus(lastOrderDate, reorderFrequency) {
  if (!lastOrderDate || !reorderFrequency || reorderFrequency === 'one-time' || !FREQUENCY_DAYS[reorderFrequency]) {
    return 'none';
  }
  const days = FREQUENCY_DAYS[reorderFrequency];
  const last = new Date(lastOrderDate);
  const now = new Date();
  const elapsed = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (elapsed > days * 1.2) return 'overdue';
  if (elapsed > days * 0.8) return 'approaching';
  return 'ontrack';
}

function getNextExpectedDate(lastOrderDate, reorderFrequency) {
  if (!lastOrderDate || !reorderFrequency || reorderFrequency === 'one-time' || !FREQUENCY_DAYS[reorderFrequency]) return null;
  const last = new Date(lastOrderDate + 'T00:00:00');
  last.setDate(last.getDate() + FREQUENCY_DAYS[reorderFrequency]);
  return last.toISOString().split('T')[0];
}

function getUpcomingNotableDates(clients, daysAhead = 30) {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + daysAhead);
  const events = [];

  for (const client of clients) {
    if (!client.notableDates?.length) continue;
    for (const nd of client.notableDates) {
      if (!nd.date || !nd.label) continue;
      // Handle recurring annual events: check this year and next year
      const baseDate = new Date(nd.date + 'T00:00:00');
      for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
        const eventDate = new Date(baseDate);
        eventDate.setFullYear(now.getFullYear() + yearOffset);
        if (eventDate >= now && eventDate <= cutoff) {
          const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
          events.push({
            clientId: client.id,
            clientName: client.clientName,
            companyName: client.companyName,
            label: nd.label,
            date: eventDate.toISOString().split('T')[0],
            daysUntil,
          });
        }
      }
    }
  }

  events.sort((a, b) => a.daysUntil - b.daysUntil);
  return events;
}

function formatCurrency(amount) {
  return '$' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function frequencyLabel(freq) {
  return FREQUENCY_OPTIONS.find(f => f.value === freq)?.label || '—';
}

function daysUntilLabel(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

export default function CateringTrackerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('lastOrder');
  const [sortOrder, setSortOrder] = useState('desc');
  // RT-140: Client status filter
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | overdue | approaching
  // RT-152: Show/hide archived clients
  const [showArchived, setShowArchived] = useState(false);

  // Modal state
  const [modal, setModal] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);
  const [clientRevenue, setClientRevenue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Form state for add/edit
  const [form, setForm] = useState({
    clientName: '', companyName: '', phone: '', email: '', address: '', notes: '',
    notableDates: [], reorderFrequency: '',
  });

  // Order form state
  const [orderForm, setOrderForm] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: '', itemCount: '', headCount: '', notes: '',
  });

  const searchRef = useRef(search);
  searchRef.current = search;

  const fetchClients = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sort, order: sortOrder });
      if (searchRef.current) params.set('search', searchRef.current);
      const res = await fetch(`/api/catering/clients?${params}`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      showToast('Failed to load clients.', 'error');
    }
    setLoading(false);
  }, [sort, sortOrder, showToast]);

  useEffect(() => {
    if (user) fetchClients();
  }, [user, fetchClients]);

  // Escape key closes modal
  useEffect(() => {
    if (!modal) return;
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modal]);

  const fetchClientDetail = async (clientId) => {
    try {
      const res = await fetch(`/api/catering/clients/${clientId}`);
      const data = await res.json();
      setSelectedClient(data.client);
      setClientOrders(data.orders || []);
      setClientRevenue(data.totalRevenue || 0);
    } catch {
      showToast('Failed to load client details.', 'error');
    }
  };

  const openAdd = () => {
    setForm({ clientName: '', companyName: '', phone: '', email: '', address: '', notes: '', notableDates: [], reorderFrequency: '' });
    setModal('add');
  };

  const openEdit = (client) => {
    setForm({
      clientName: client.clientName || '',
      companyName: client.companyName || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      notes: client.notes || '',
      notableDates: client.notableDates || [],
      reorderFrequency: client.reorderFrequency || '',
    });
    setSelectedClient(client);
    setModal('edit');
  };

  const openDetail = async (client) => {
    setSelectedClient(client);
    setClientRevenue(client.totalRevenue || 0);
    setClientOrders([]);
    setDetailLoading(true);
    setModal('detail');
    await fetchClientDetail(client.id);
    setDetailLoading(false);
  };

  const openOrderLog = (client) => {
    setSelectedClient(client);
    setOrderForm({ orderDate: new Date().toISOString().split('T')[0], totalAmount: '', itemCount: '', headCount: '', notes: '' });
    setModal('order');
  };

  const closeModal = () => {
    setModal(null);
    setSelectedClient(null);
    setClientOrders([]);
  };

  // Navigate to catering order form pre-filled with client info
  const generateOrderForClient = (client) => {
    sessionStorage.setItem('catering-prefill', JSON.stringify({
      clientName: client.clientName,
      companyName: client.companyName,
      phone: client.phone,
      email: client.email,
      address: client.address,
    }));
    router.push('/dashboard/generators/catering-order?prefill=client');
  };

  // Reorder from a past order — pre-fill form with full order snapshot
  const reorderFromOrder = (order, client) => {
    const snapshot = order.formSnapshot || {};
    sessionStorage.setItem('catering-reorder', JSON.stringify({
      customerName: client.clientName,
      customerPhone: client.phone,
      customerEmail: client.email,
      companyName: client.companyName,
      deliveryAddress: snapshot.deliveryAddress || client.address,
      boxes: snapshot.boxes || [],
      includeChips: snapshot.includeChips || false,
      includeDrinks: snapshot.includeDrinks || false,
      cookiePlatter: snapshot.cookiePlatter || 0,
      browniePlatter: snapshot.browniePlatter || 0,
      discount: snapshot.discount || 0,
      specialRequests: snapshot.specialRequests || '',
    }));
    router.push('/dashboard/generators/catering-order?reorder=true');
  };

  const handleSaveClient = async () => {
    if (!form.clientName.trim()) { showToast('Client name is required.', 'error'); return; }
    // RT-135: Validate email format if provided
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('Please enter a valid email address.', 'error'); return;
    }
    // RT-135: Validate phone has at least 10 digits if provided
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid phone number.', 'error'); return;
    }
    setSaving(true);
    try {
      const isEdit = modal === 'edit' && selectedClient;
      const url = isEdit ? `/api/catering/clients/${selectedClient.id}` : '/api/catering/clients';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { let msg = 'Failed to save client.'; try { const e = await res.json(); msg = e.error || msg; } catch(e) {} throw new Error(msg); }
      showToast(isEdit ? 'Client updated.' : 'Client added.', 'success');
      closeModal();
      fetchClients();
    } catch (err) {
      showToast(err.message || 'Failed to save client.', 'error');
    }
    setSaving(false);
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Delete this client and all their order history?')) return;
    try {
      const res = await fetch(`/api/catering/clients/${clientId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Client deleted.', 'success');
      closeModal();
      fetchClients();
    } catch {
      showToast('Failed to delete client.', 'error');
    }
  };

  const handleLogOrder = async () => {
    if (!orderForm.totalAmount) { showToast('Total amount is required.', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/catering/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClient.id, ...orderForm, totalAmount: parseFloat(orderForm.totalAmount) }),
      });
      if (!res.ok) throw new Error();
      showToast('Order logged.', 'success');
      closeModal();
      fetchClients();
    } catch {
      showToast('Failed to log order.', 'error');
    }
    setSaving(false);
  };

  const addNotableDate = () => {
    setForm(prev => ({ ...prev, notableDates: [...prev.notableDates, { label: '', date: '' }] }));
  };

  const removeNotableDate = (idx) => {
    setForm(prev => ({ ...prev, notableDates: prev.notableDates.filter((_, i) => i !== idx) }));
  };

  const updateNotableDate = (idx, key, value) => {
    setForm(prev => {
      const dates = [...prev.notableDates];
      dates[idx] = { ...dates[idx], [key]: value };
      return { ...prev, notableDates: dates };
    });
  };

  const toggleSort = (field) => {
    if (sort === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    else { setSort(field); setSortOrder('desc'); }
  };

  // RT-140/141: Filter clients by status
  const filteredClients = clients.filter(c => {
    if (!showArchived && c.archived) return false;
    if (statusFilter === 'all') return true;
    const status = getFollowUpStatus(c.lastOrderDate, c.reorderFrequency);
    if (statusFilter === 'overdue') return status === 'overdue';
    if (statusFilter === 'approaching') return status === 'approaching';
    if (statusFilter === 'active') {
      const thisMonth = new Date().toISOString().slice(0, 7);
      return c.lastOrderDate && c.lastOrderDate.startsWith(thisMonth);
    }
    return true;
  });

  // Computed data
  const top3 = [...clients].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)).slice(0, 3).filter(c => c.totalRevenue > 0);
  const upcomingEvents = getUpcomingNotableDates(clients, 30);

  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const activeThisMonth = clients.reduce((sum, c) => {
    if (c.lastOrderDate && c.lastOrderDate.startsWith(thisMonth)) return sum + 1;
    return sum;
  }, 0);
  const needFollowUp = clients.filter(c => getFollowUpStatus(c.lastOrderDate, c.reorderFrequency) === 'overdue').length;
  // RT-145: Average order size
  const totalOrders = clients.reduce((sum, c) => sum + (c.orderCount || 0), 0);
  const avgOrderSize = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // RT-147: Export clients to CSV
  const exportCsv = () => {
    const header = ['Client', 'Company', 'Phone', 'Email', 'Orders', 'Revenue', 'Last Order', 'Frequency'];
    const rows = clients.map(c => [
      c.clientName || '', c.companyName || '', c.phone || '', c.email || '',
      c.orderCount || 0, c.totalRevenue || 0, c.lastOrderDate || '', c.reorderFrequency || '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`));
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `catering-clients-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className={styles.container}><p style={{ color: '#6b7280' }}>Loading...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Catering Tracker</h1>
          <p className={styles.subtitle}>Manage catering clients, track orders, and follow up on repeat business.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* RT-147: CSV export */}
          <button onClick={exportCsv} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            ↓ Export
          </button>
          <button className={styles.addBtn} onClick={openAdd}>+ Add Client</button>
        </div>
      </div>

      {/* RT-142: Order notification banner — overdue clients needing follow-up */}
      {needFollowUp > 0 && (
        <div style={{ background: 'rgba(238,50,39,0.06)', border: '1px solid rgba(238,50,39,0.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
              {needFollowUp} client{needFollowUp > 1 ? 's are' : ' is'} overdue for follow-up
            </span>
            <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>
              Their reorder window has passed — reach out to keep the business.
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('overdue')}
            style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0 }}
          >
            View
          </button>
        </div>
      )}

      {/* Stats — RT-145/146 added */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalClients}</div>
          <div className={styles.statLabel}>Total Clients</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(totalRevenue)}</div>
          <div className={styles.statLabel}>Total Revenue</div>
        </div>
        <div className={styles.statCard}>
          {/* RT-146: Average order size */}
          <div className={styles.statValue}>{formatCurrency(avgOrderSize)}</div>
          <div className={styles.statLabel}>Avg Order Size</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{activeThisMonth}</div>
          <div className={styles.statLabel}>Active This Month</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${needFollowUp > 0 ? styles.statAlert : ''}`}>{needFollowUp}</div>
          <div className={styles.statLabel}>Need Follow-Up</div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className={styles.eventsSection}>
          <h2 className={styles.eventsTitle}>Upcoming Events <span className={styles.eventsCount}>{upcomingEvents.length}</span></h2>
          <div className={styles.eventsList}>
            {upcomingEvents.map((ev, i) => (
              <div key={`${ev.clientId}-${ev.date}-${i}`} className={styles.eventRow}>
                <div className={styles.eventDate}>
                  <span className={styles.eventDay}>{new Date(ev.date + 'T00:00:00').getDate()}</span>
                  <span className={styles.eventMonth}>{new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className={styles.eventInfo}>
                  <span className={styles.eventLabel}>{ev.label}</span>
                  <span className={styles.eventClient}>{ev.clientName}{ev.companyName ? ` — ${ev.companyName}` : ''}</span>
                </div>
                <div className={styles.eventUrgency}>
                  <span className={`${styles.eventBadge} ${ev.daysUntil <= 7 ? styles.eventUrgent : ev.daysUntil <= 14 ? styles.eventSoon : styles.eventNormal}`}>
                    {daysUntilLabel(ev.daysUntil)}
                  </span>
                </div>
                <button className={styles.eventAction} onClick={() => {
                  const c = clients.find(cl => cl.id === ev.clientId);
                  if (c) generateOrderForClient(c);
                }} title="Generate order">
                  New Order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 */}
      {top3.length > 0 && (
        <div className={styles.topSection}>
          <h2 className={styles.topTitle}>Top Clients</h2>
          <div className={styles.topCards}>
            {top3.map((c, i) => (
              <div key={c.id} className={styles.topCard} onClick={() => openDetail(c)}>
                <div className={styles.topRank}>#{i + 1}</div>
                <div className={styles.topInfo}>
                  <div className={styles.topName}>{c.clientName}</div>
                  {c.companyName && <div className={styles.topCompany}>{c.companyName}</div>}
                </div>
                <div className={styles.topStats}>
                  <div className={styles.topRevenue}>{formatCurrency(c.totalRevenue)}</div>
                  <div className={styles.topOrders}>{c.orderCount} order{c.orderCount !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Sort */}
      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchClients()}
        />
        <button className={styles.searchBtn} onClick={fetchClients}>Search</button>
      </div>

      {/* RT-140: Status filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { key: 'all', label: 'All Clients' },
          { key: 'active', label: '🟢 Active' },
          { key: 'overdue', label: '🔴 Overdue' },
          { key: 'approaching', label: '🟡 Due Soon' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            style={{
              padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 16, cursor: 'pointer', border: '1px solid',
              background: statusFilter === f.key ? '#134A7C' : '#fff',
              color: statusFilter === f.key ? '#fff' : '#374151',
              borderColor: statusFilter === f.key ? '#134A7C' : '#d1d5db',
            }}
          >
            {f.label}
          </button>
        ))}
        {/* RT-152: Show archived toggle */}
        <button
          onClick={() => setShowArchived(p => !p)}
          style={{ padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 16, cursor: 'pointer', border: '1px solid #d1d5db', background: '#fff', color: '#9ca3af', marginLeft: 'auto' }}
        >
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </button>
      </div>

      {/* Client Table */}
      {filteredClients.length === 0 ? (
        <div className={styles.empty}>
          {search ? 'No clients match your search.' : statusFilter !== 'all' ? 'No clients match this filter.' : 'No catering clients yet. Add one or generate a catering order to get started.'}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <span className={styles.colName} onClick={() => toggleSort('name')}>
              Client {sort === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
            <span className={styles.colOrders} onClick={() => toggleSort('orders')}>
              Orders {sort === 'orders' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
            <span className={styles.colRevenue} onClick={() => toggleSort('revenue')}>
              Revenue {sort === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
            <span className={styles.colLast} onClick={() => toggleSort('lastOrder')}>
              Last Order {sort === 'lastOrder' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
            <span className={styles.colNext}>Next Expected</span>
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colActions}>Actions</span>
          </div>
          {filteredClients.map(c => {
            const status = getFollowUpStatus(c.lastOrderDate, c.reorderFrequency);
            const nextDate = getNextExpectedDate(c.lastOrderDate, c.reorderFrequency);
            return (
              <div key={c.id} className={styles.tableRow}>
                <span className={styles.colName} onClick={() => openDetail(c)}>
                  <span className={styles.clientName}>{c.clientName}</span>
                  {c.companyName && <span className={styles.clientCompany}>{c.companyName}</span>}
                </span>
                <span className={styles.colOrders}>{c.orderCount || 0}</span>
                <span className={styles.colRevenue}>{formatCurrency(c.totalRevenue)}</span>
                <span className={styles.colLast}>{formatDate(c.lastOrderDate)}</span>
                <span className={styles.colNext}>{nextDate ? formatDate(nextDate) : '—'}</span>
                <span className={styles.colStatus}>
                  {c.reorderFrequency && c.reorderFrequency !== 'one-time' ? (
                    <span className={`${styles.statusBadge} ${styles['status_' + status]}`}>
                      {status === 'overdue' ? 'Overdue' : status === 'approaching' ? 'Due Soon' : status === 'ontrack' ? 'On Track' : '—'}
                    </span>
                  ) : (
                    <span className={styles.statusMuted}>{c.reorderFrequency === 'one-time' ? 'One-time' : '—'}</span>
                  )}
                </span>
                <span className={styles.colActions}>
                  <button className={styles.actionBtn} onClick={() => generateOrderForClient(c)} title="New order form">+</button>
                  <button className={styles.actionBtn} onClick={() => openOrderLog(c)} title="Log order">$</button>
                  <button className={styles.actionBtn} onClick={() => openEdit(c)} title="Edit">&#9998;</button>
                  <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => handleDeleteClient(c.id)} title="Delete">&times;</button>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Backdrop */}
      {modal && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {/* Add / Edit Client */}
            {(modal === 'add' || modal === 'edit') && (
              <>
                <h2 className={styles.modalTitle}>{modal === 'add' ? 'Add Client' : 'Edit Client'}</h2>
                <div className={styles.modalFields}>
                  <div className={styles.modalField}>
                    <label>Client Name *</label>
                    <input type="text" value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Jane Doe" />
                  </div>
                  <div className={styles.modalField}>
                    <label>Company</label>
                    <input type="text" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} placeholder="Acme Corp" />
                  </div>
                  <div className={styles.modalRow}>
                    <div className={styles.modalField}>
                      <label>Phone</label>
                      <input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" />
                    </div>
                    <div className={styles.modalField}>
                      <label>Email</label>
                      <input type="text" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" />
                    </div>
                  </div>
                  <div className={styles.modalField}>
                    <label>Address</label>
                    <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St" />
                  </div>
                  <div className={styles.modalField}>
                    <label>Reorder Frequency</label>
                    <select value={form.reorderFrequency} onChange={e => setForm(p => ({ ...p, reorderFrequency: e.target.value }))}>
                      {FREQUENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div className={styles.modalField}>
                    <label>Notes</label>
                    <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Preferences, dietary restrictions, delivery notes..." />
                  </div>

                  {/* Notable Dates */}
                  <div className={styles.modalField}>
                    <label>Notable Dates</label>
                    {form.notableDates.map((nd, i) => (
                      <div key={i} className={styles.notableDateRow}>
                        <input type="text" value={nd.label} onChange={e => updateNotableDate(i, 'label', e.target.value)} placeholder="Event name" />
                        <input type="date" value={nd.date} onChange={e => updateNotableDate(i, 'date', e.target.value)} />
                        <button className={styles.removeNdBtn} onClick={() => removeNotableDate(i)}>&times;</button>
                      </div>
                    ))}
                    <button className={styles.addNdBtn} onClick={addNotableDate}>+ Add Date</button>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.modalCancel} onClick={closeModal}>Cancel</button>
                  <button className={styles.modalSave} onClick={handleSaveClient} disabled={saving}>
                    {saving ? 'Saving...' : modal === 'add' ? 'Add Client' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}

            {/* Client Detail */}
            {modal === 'detail' && selectedClient && (
              <>
                <div className={styles.detailHeader}>
                  <div>
                    <h2 className={styles.modalTitle}>{selectedClient.clientName}</h2>
                    {selectedClient.companyName && <p className={styles.detailCompany}>{selectedClient.companyName}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className={styles.generateBtn} onClick={() => { const c = selectedClient; closeModal(); generateOrderForClient(c); }}>
                      + New Order
                    </button>
                    {/* RT-142: Notify client button */}
                    {(selectedClient.email || selectedClient.phone) && (
                      <button
                        type="button"
                        onClick={() => {
                          const msg = `Hi${selectedClient.clientName ? ' ' + selectedClient.clientName.split(' ')[0] : ''}! Just a reminder about your upcoming catering order from Jersey Mike's. Reply or call us to confirm. Thanks!`;
                          if (selectedClient.email) {
                            window.open(`mailto:${selectedClient.email}?subject=Your Upcoming Catering Order&body=${encodeURIComponent(msg)}`);
                          } else {
                            window.open(`sms:${selectedClient.phone}?body=${encodeURIComponent(msg)}`);
                          }
                        }}
                        style={{ padding: '7px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        📬 Notify
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.detailGrid}>
                  {selectedClient.phone && <div><span className={styles.detailLabel}>Phone</span><span>{selectedClient.phone}</span></div>}
                  {selectedClient.email && <div><span className={styles.detailLabel}>Email</span><span>{selectedClient.email}</span></div>}
                  {selectedClient.address && <div><span className={styles.detailLabel}>Address</span><span>{selectedClient.address}</span></div>}
                  <div><span className={styles.detailLabel}>Frequency</span><span>{frequencyLabel(selectedClient.reorderFrequency)}</span></div>
                  <div><span className={styles.detailLabel}>Total Revenue</span><span className={styles.detailRevenue}>{formatCurrency(clientRevenue)}</span></div>
                  <div><span className={styles.detailLabel}>Total Orders</span><span>{clientOrders.length}</span></div>
                  {(() => {
                    const next = getNextExpectedDate(selectedClient.lastOrderDate || clientOrders[0]?.orderDate, selectedClient.reorderFrequency);
                    if (!next) return null;
                    const status = getFollowUpStatus(selectedClient.lastOrderDate || clientOrders[0]?.orderDate, selectedClient.reorderFrequency);
                    return (
                      <div>
                        <span className={styles.detailLabel}>Next Expected</span>
                        <span className={status === 'overdue' ? styles.detailOverdue : status === 'approaching' ? styles.detailApproaching : ''}>
                          {formatDate(next)}
                        </span>
                      </div>
                    );
                  })()}
                </div>
                {selectedClient.notes && (
                  <div className={styles.detailNotes}>
                    <span className={styles.detailLabel}>Notes</span>
                    <p>{selectedClient.notes}</p>
                  </div>
                )}
                {selectedClient.notableDates?.length > 0 && (
                  <div className={styles.detailDates}>
                    <span className={styles.detailLabel}>Notable Dates</span>
                    {selectedClient.notableDates.map((nd, i) => (
                      <div key={i} className={styles.detailDateItem}>
                        <span>{nd.label}</span>
                        <span className={styles.detailDateVal}>{formatDate(nd.date)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* RT-133: Order Timeline */}
                <div className={styles.detailOrders}>
                  <h3 className={styles.detailOrdersTitle}>Order History</h3>
                  {detailLoading ? (
                    <p className={styles.detailEmpty}>Loading orders...</p>
                  ) : clientOrders.length === 0 ? (
                    <p className={styles.detailEmpty}>No orders yet.</p>
                  ) : (
                    <div style={{ position: 'relative', paddingLeft: 24, marginTop: 8 }}>
                      {/* Vertical timeline line */}
                      <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: '#e5e7eb' }} />
                      {clientOrders.map((o, idx) => (
                        <div key={o.id} style={{ position: 'relative', marginBottom: 16 }}>
                          {/* Timeline dot */}
                          <div style={{ position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%', background: idx === 0 ? '#134A7C' : '#9ca3af', border: '2px solid #fff', boxShadow: '0 0 0 1px #e5e7eb' }} />
                          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{formatCurrency(o.totalAmount)}</span>
                              <span style={{ fontSize: 11, color: '#9ca3af' }}>{formatDate(o.orderDate)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              {o.itemCount > 0 && <span style={{ fontSize: 11, color: '#6b7280' }}>{o.itemCount} subs</span>}
                              {o.headCount > 0 && <span style={{ fontSize: 11, color: '#6b7280' }}>{o.headCount} people</span>}
                              {o.autoGenerated && <span style={{ fontSize: 10, background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>Auto</span>}
                              {o.formSnapshot && (
                                <button
                                  style={{ fontSize: 11, color: '#134A7C', background: 'none', border: '1px solid #134A7C', borderRadius: 12, padding: '2px 8px', cursor: 'pointer', marginLeft: 'auto' }}
                                  onClick={() => { const c = selectedClient; closeModal(); reorderFromOrder(o, c); }}
                                >
                                  Reorder
                                </button>
                              )}
                            </div>
                            {o.notes && <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4, fontStyle: 'italic' }}>{o.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.modalCancel} onClick={closeModal}>Close</button>
                  <button className={styles.modalSave} onClick={() => { const c = selectedClient; closeModal(); openOrderLog(c); }}>Log Order</button>
                  <button className={styles.modalEdit} onClick={() => { const c = selectedClient; closeModal(); openEdit(c); }}>Edit</button>
                </div>
              </>
            )}

            {/* Log Order */}
            {modal === 'order' && selectedClient && (
              <>
                <h2 className={styles.modalTitle}>Log Order — {selectedClient.clientName}</h2>
                <div className={styles.modalFields}>
                  <div className={styles.modalRow}>
                    <div className={styles.modalField}>
                      <label>Order Date *</label>
                      <input type="date" value={orderForm.orderDate} onChange={e => setOrderForm(p => ({ ...p, orderDate: e.target.value }))} />
                    </div>
                    <div className={styles.modalField}>
                      <label>Total Amount *</label>
                      <input type="number" step="0.01" min="0" value={orderForm.totalAmount} onChange={e => setOrderForm(p => ({ ...p, totalAmount: e.target.value }))} placeholder="0.00" />
                    </div>
                  </div>
                  <div className={styles.modalRow}>
                    <div className={styles.modalField}>
                      <label>Sub Count</label>
                      <input type="number" min="0" value={orderForm.itemCount} onChange={e => setOrderForm(p => ({ ...p, itemCount: e.target.value }))} placeholder="0" />
                    </div>
                    <div className={styles.modalField}>
                      <label>Head Count</label>
                      <input type="number" min="0" value={orderForm.headCount} onChange={e => setOrderForm(p => ({ ...p, headCount: e.target.value }))} placeholder="0" />
                    </div>
                  </div>
                  <div className={styles.modalField}>
                    <label>Notes</label>
                    <textarea rows={2} value={orderForm.notes} onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))} placeholder="Order notes..." />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.modalCancel} onClick={closeModal}>Cancel</button>
                  <button className={styles.modalSave} onClick={handleLogOrder} disabled={saving}>
                    {saving ? 'Saving...' : 'Log Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
