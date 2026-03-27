'use client';

import { useState, useEffect, useCallback } from 'react';
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
  return 'on-track';
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

export default function CateringTrackerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('lastOrder');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal state
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'detail' | 'order' | null
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);
  const [clientRevenue, setClientRevenue] = useState(0);
  const [saving, setSaving] = useState(false);

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

  const fetchClients = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sort, order: sortOrder });
      if (search) params.set('search', search);
      const res = await fetch(`/api/catering/clients?${params}`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      showToast('Failed to load clients.', 'error');
    }
    setLoading(false);
  }, [search, sort, sortOrder, showToast]);

  useEffect(() => {
    if (user) fetchClients();
  }, [user, fetchClients]);

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
    setModal('detail');
    await fetchClientDetail(client.id);
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

  const handleSaveClient = async () => {
    if (!form.clientName.trim()) { showToast('Client name is required.', 'error'); return; }
    setSaving(true);
    try {
      const isEdit = modal === 'edit' && selectedClient;
      const url = isEdit ? `/api/catering/clients/${selectedClient.id}` : '/api/catering/clients';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
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

  // Compute top 3 clients by revenue
  const top3 = [...clients].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)).slice(0, 3).filter(c => c.totalRevenue > 0);

  // Compute stats
  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const ordersThisMonth = clients.reduce((sum, c) => {
    // Approximate: count clients with lastOrderDate this month
    if (c.lastOrderDate && c.lastOrderDate.startsWith(thisMonth)) return sum + 1;
    return sum;
  }, 0);
  const needFollowUp = clients.filter(c => getFollowUpStatus(c.lastOrderDate, c.reorderFrequency) === 'overdue').length;

  if (loading) return <div className={styles.container}><p style={{ color: '#6b7280' }}>Loading...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Catering Tracker</h1>
          <p className={styles.subtitle}>Manage catering clients, track orders, and follow up on repeat business.</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Client</button>
      </div>

      {/* Stats */}
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
          <div className={styles.statValue}>{ordersThisMonth}</div>
          <div className={styles.statLabel}>Orders This Month</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${needFollowUp > 0 ? styles.statAlert : ''}`}>{needFollowUp}</div>
          <div className={styles.statLabel}>Need Follow-Up</div>
        </div>
      </div>

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

      {/* Client Table */}
      {clients.length === 0 ? (
        <div className={styles.empty}>
          {search ? 'No clients match your search.' : 'No catering clients yet. Add one or generate a catering order to get started.'}
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
            <span className={styles.colStatus}>Status</span>
            <span className={styles.colActions}>Actions</span>
          </div>
          {clients.map(c => {
            const status = getFollowUpStatus(c.lastOrderDate, c.reorderFrequency);
            return (
              <div key={c.id} className={styles.tableRow}>
                <span className={styles.colName} onClick={() => openDetail(c)}>
                  <span className={styles.clientName}>{c.clientName}</span>
                  {c.companyName && <span className={styles.clientCompany}>{c.companyName}</span>}
                </span>
                <span className={styles.colOrders}>{c.orderCount || 0}</span>
                <span className={styles.colRevenue}>{formatCurrency(c.totalRevenue)}</span>
                <span className={styles.colLast}>{formatDate(c.lastOrderDate)}</span>
                <span className={styles.colStatus}>
                  {c.reorderFrequency && c.reorderFrequency !== 'one-time' ? (
                    <span className={`${styles.statusBadge} ${styles['status_' + status]}`}>
                      {status === 'overdue' ? 'Overdue' : status === 'approaching' ? 'Due Soon' : status === 'on-track' ? 'On Track' : '—'}
                    </span>
                  ) : (
                    <span className={styles.statusMuted}>{c.reorderFrequency === 'one-time' ? 'One-time' : '—'}</span>
                  )}
                </span>
                <span className={styles.colActions}>
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
                <h2 className={styles.modalTitle}>{selectedClient.clientName}</h2>
                {selectedClient.companyName && <p className={styles.detailCompany}>{selectedClient.companyName}</p>}
                <div className={styles.detailGrid}>
                  {selectedClient.phone && <div><span className={styles.detailLabel}>Phone</span><span>{selectedClient.phone}</span></div>}
                  {selectedClient.email && <div><span className={styles.detailLabel}>Email</span><span>{selectedClient.email}</span></div>}
                  {selectedClient.address && <div><span className={styles.detailLabel}>Address</span><span>{selectedClient.address}</span></div>}
                  <div><span className={styles.detailLabel}>Frequency</span><span>{frequencyLabel(selectedClient.reorderFrequency)}</span></div>
                  <div><span className={styles.detailLabel}>Total Revenue</span><span className={styles.detailRevenue}>{formatCurrency(clientRevenue)}</span></div>
                  <div><span className={styles.detailLabel}>Total Orders</span><span>{clientOrders.length}</span></div>
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

                {/* Order History */}
                <div className={styles.detailOrders}>
                  <h3 className={styles.detailOrdersTitle}>Order History</h3>
                  {clientOrders.length === 0 ? (
                    <p className={styles.detailEmpty}>No orders yet.</p>
                  ) : (
                    clientOrders.map(o => (
                      <div key={o.id} className={styles.detailOrderRow}>
                        <span>{formatDate(o.orderDate)}</span>
                        <span className={styles.detailOrderAmount}>{formatCurrency(o.totalAmount)}</span>
                        {o.itemCount > 0 && <span className={styles.detailOrderMeta}>{o.itemCount} subs</span>}
                        {o.autoGenerated && <span className={styles.detailOrderAuto}>Auto</span>}
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.modalCancel} onClick={closeModal}>Close</button>
                  <button className={styles.modalSave} onClick={() => { closeModal(); openOrderLog(selectedClient); }}>Log Order</button>
                  <button className={styles.modalEdit} onClick={() => { closeModal(); openEdit(selectedClient); }}>Edit</button>
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
