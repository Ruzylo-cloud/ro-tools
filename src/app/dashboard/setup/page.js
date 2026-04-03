'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { searchStores, getStoresForDM, getStoreForRO } from '@/lib/store-directory';
import styles from './page.module.css';

const DEFAULT_ADMIN_EMAILS = [
  'chris@jmvalley.com',
  'david@jmvalley.com',
  'bethany@jmvalley.com',
  'daniel@jmvalley.com',
  'brittany@jmvalley.com',
];

const EMPTY_STORE = {
  storeName: '',
  street: '',
  city: '',
  state: '',
  phone: '',
  operatorName: '',
  operatorPhone: '',
  assistantName: '',
  assistantTitle: 'Catering Coordinator - Assistant Operator',
  assistantPhone: '',
};

const STORE_FIELDS = [
  { key: 'storeName', label: 'Store Name', placeholder: "Jersey Mike's #12345", required: true },
  { key: 'street', label: 'Street Address', placeholder: '199 S Turnpike Rd', required: true },
  { key: 'city', label: 'City', placeholder: 'Santa Barbara', required: true },
  { key: 'state', label: 'State', placeholder: 'CA', required: true },
  { key: 'phone', label: 'Store Phone', placeholder: '(805) 497-5800', required: true },
  { key: 'operatorName', label: 'Operator Name', placeholder: 'John Smith', required: true },
  { key: 'operatorPhone', label: 'Operator Phone', placeholder: '(805) 555-0100', required: true },
  { key: 'assistantName', label: 'Assistant Name', placeholder: 'Jane Doe', required: false },
  { key: 'assistantTitle', label: 'Assistant Title', placeholder: 'Catering Coordinator', required: false },
  { key: 'assistantPhone', label: 'Assistant Phone', placeholder: '(805) 555-0200', required: false },
];

export default function SetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState('role'); // 'role' | 'info'
  const isAutoAdmin = DEFAULT_ADMIN_EMAILS.includes(user?.email?.toLowerCase());
  const [role, setRole] = useState(isAutoAdmin ? 'administrator' : '');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [districtManager, setDistrictManager] = useState('');
  const [stores, setStores] = useState([{ ...EMPTY_STORE }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSearchIdx, setStoreSearchIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);

  const updateStore = (idx, key, value) => {
    setStores(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s));
  };

  const handleStoreNumberSearch = (idx, value) => {
    setStoreSearch(value);
    setStoreSearchIdx(idx);
    if (value.length > 0) {
      setSuggestions(searchStores(value).slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  const selectStore = (idx, store) => {
    updateStore(idx, 'storeNumber', store.id);
    updateStore(idx, 'storeName', `Jersey Mike's #${store.id} - ${store.name}`);
    setStoreSearch('');
    setSuggestions([]);
    setStoreSearchIdx(-1);
  };

  const addStore = () => {
    setStores(prev => [...prev, { ...EMPTY_STORE }]);
  };

  const removeStore = (idx) => {
    if (stores.length <= 1) return;
    setStores(prev => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (!displayName.trim()) return 'Please enter your name.';

    if (role === 'operator') {
      const store = stores[0];
      for (const f of STORE_FIELDS) {
        if (f.required && !store[f.key]?.trim()) {
          return `Please fill in ${f.label} for your store.`;
        }
      }
    }

    if (role === 'district_manager' || role === 'administrator') {
      for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        // At minimum need store name and address for each store slot
        if (!store.storeName?.trim()) return `Please fill in Store Name for Store ${i + 1}.`;
        if (!store.street?.trim()) return `Please fill in Street Address for Store ${i + 1}.`;
        if (!store.city?.trim()) return `Please fill in City for Store ${i + 1}.`;
        if (!store.state?.trim()) return `Please fill in State for Store ${i + 1}.`;
        if (!store.phone?.trim()) return `Please fill in Store Phone for Store ${i + 1}.`;
        if (!store.operatorName?.trim()) return `Please fill in Operator Name for Store ${i + 1}.`;
        if (!store.operatorPhone?.trim()) return `Please fill in Operator Phone for Store ${i + 1}.`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (saving) return; // Debounce
    const err = validate();
    if (err) {
      setError(err);
      setTimeout(() => setError(''), 5000);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const profileData = {
        setupComplete: true,
        role,
        displayName,
        districtManager,
        stores,
        // Keep first store fields at top level for backward compat with flyer
        ...stores[0],
      };

      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  if (step === 'role') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to RO Tools</h1>
          <p className={styles.subtitle}>Let&apos;s get you set up. First, select your role.</p>
        </div>
        <div className={styles.roleGrid}>
          <div
            className={`${styles.roleCard} ${role === 'operator' ? styles.selected : ''}`}
            onClick={() => setRole('operator')}
          >
            <div className={styles.roleIcon}>&#x1F3EA;</div>
            <div className={styles.roleName}>Restaurant Operator</div>
            <div className={styles.roleDesc}>You run a single store and need tools for your location.</div>
          </div>
          <div
            className={`${styles.roleCard} ${role === 'district_manager' ? styles.selected : ''}`}
            onClick={() => setRole('district_manager')}
          >
            <div className={styles.roleIcon}>&#x1F4CB;</div>
            <div className={styles.roleName}>District Manager</div>
            <div className={styles.roleDesc}>You oversee multiple stores and need visibility across locations. Requires admin approval.</div>
          </div>
          <div
            className={`${styles.roleCard} ${role === 'administrator' ? styles.selected : ''}`}
            onClick={() => setRole('administrator')}
          >
            <div className={styles.roleIcon}>&#x2699;&#xFE0F;</div>
            <div className={styles.roleName}>Administrator</div>
            <div className={styles.roleDesc}>System admin with access to all stores and settings. Requires admin approval.</div>
          </div>
        </div>
        {isAutoAdmin && (
          <div className={styles.autoAdminNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#134A7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Your email qualifies for automatic administrator access.
          </div>
        )}
        {role && (
          <button className={styles.submitBtn} onClick={() => {
            // Auto-prefill stores based on role and email
            const email = user?.email || '';
            if (role === 'district_manager') {
              const dmStores = getStoresForDM(email);
              if (dmStores.length > 0) {
                setStores(dmStores.map(s => ({
                  ...EMPTY_STORE,
                  storeNumber: s.id,
                  storeName: `Jersey Mike's #${s.id}${s.name !== s.id ? ' - ' + s.name : ''}`,
                  operatorName: s.ro || '',
                })));
              }
            } else if (role === 'operator') {
              const roStore = getStoreForRO(email);
              if (roStore) {
                setStores([{
                  ...EMPTY_STORE,
                  storeNumber: roStore.id,
                  storeName: `Jersey Mike's #${roStore.id}${roStore.name !== roStore.id ? ' - ' + roStore.name : ''}`,
                  operatorName: roStore.ro || user?.name || '',
                  street: roStore.address || '',
                }]);
              }
            }
            setStep('info');
          }}>
            Continue as {role === 'operator' ? 'Restaurant Operator' : role === 'district_manager' ? 'District Manager' : 'Administrator'}
          </button>
        )}
      </div>
    );
  }

  // Step 2: Info form
  const isMultiStore = role === 'district_manager' || role === 'administrator';
  const showFullStoreFields = role !== 'administrator';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {role === 'operator' ? 'Set Up Your Store' : role === 'district_manager' ? 'Set Up Your Stores' : 'Administrator Setup'}
        </h1>
        <p className={styles.subtitle}>
          {role === 'operator'
            ? 'This info auto-fills into all your tools. Fill it in once and you\'re set.'
            : role === 'district_manager'
            ? 'Add your stores below. You can always add more later.'
            : 'Basic info to get you started. Add stores you want to manage.'}
        </p>
      </div>

      <div className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        {/* Basic Info */}
        <div className={styles.sectionTitle}>Your Info</div>
        <div className={styles.sectionDesc}>Basic account details.</div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Your Name</label>
            <input
              className={styles.input}
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Chris Ruzylo"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>District Manager Name <span className={styles.labelOptional}>(optional)</span></label>
            <input
              className={styles.input}
              value={districtManager}
              onChange={e => setDistrictManager(e.target.value)}
              placeholder="Mike Johnson"
            />
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Stores */}
        <div className={styles.sectionTitle}>
          {isMultiStore ? 'Your Stores' : 'Store Information'}
        </div>
        <div className={styles.sectionDesc}>
          {role === 'operator'
            ? 'Required fields are needed for flyer generation. Assistant info is optional.'
            : 'Add each store location. Operator and assistant info is per-store.'}
        </div>

        {stores.map((store, idx) => (
          <div key={idx} className={styles.storeCard}>
            {isMultiStore && (
              <div className={styles.storeCardHeader}>
                <div className={styles.storeCardTitle}>Store {idx + 1}</div>
                {stores.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removeStore(idx)}>Remove</button>
                )}
              </div>
            )}
            {/* Predictive Store Number Search */}
            <div className={styles.field} style={{ marginBottom: 12, position: 'relative' }}>
              <label className={styles.label}>Store Number</label>
              <input
                className={styles.input}
                value={storeSearchIdx === idx ? storeSearch : (store.storeNumber || '')}
                onChange={e => handleStoreNumberSearch(idx, e.target.value)}
                onFocus={() => { setStoreSearchIdx(idx); setStoreSearch(store.storeNumber || ''); }}
                onBlur={() => setTimeout(() => { setSuggestions([]); setStoreSearchIdx(-1); }, 200)}
                placeholder="Start typing store number (e.g. 20360)..."
                autoComplete="off"
              />
              {storeSearchIdx === idx && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
                }}>
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={() => selectStore(idx, s)}
                      style={{
                        display: 'block', width: '100%', padding: '8px 12px', border: 'none',
                        background: 'transparent', textAlign: 'left', cursor: 'pointer',
                        fontFamily: 'inherit', fontSize: 13, color: '#2D2D2D',
                        borderBottom: '1px solid #f3f4f6',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#134A7C' }}>{s.id}</span>
                      <span style={{ color: '#6b7280' }}> — {s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.fieldGrid}>
              {STORE_FIELDS.map(({ key, label, placeholder, required }) => {
                // For admin role, skip assistant fields and make operator fields optional labels
                const isOptional = !required || (role === 'administrator' && key !== 'storeName');
                return (
                  <div key={key} className={styles.field}>
                    <label className={styles.label}>
                      {label} {isOptional && <span className={styles.labelOptional}>(optional)</span>}
                    </label>
                    <input
                      className={styles.input}
                      value={store[key] || ''}
                      onChange={e => updateStore(idx, key, e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {isMultiStore && (
          <button className={styles.addStoreBtn} onClick={addStore}>
            + Add Another Store
          </button>
        )}

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}
