'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const STORE_FIELDS = [
  { key: 'storeName', label: 'Store Name', placeholder: "Jersey Mike's #12345" },
  { key: 'street', label: 'Street Address', placeholder: '199 S Turnpike Rd' },
  { key: 'city', label: 'City', placeholder: 'Santa Barbara' },
  { key: 'state', label: 'State', placeholder: 'CA' },
  { key: 'phone', label: 'Store Phone', placeholder: '(805) 497-5800' },
  { key: 'operatorName', label: 'Operator Name', placeholder: 'John Smith' },
  { key: 'operatorPhone', label: 'Operator Phone', placeholder: '(805) 555-0100' },
  { key: 'assistantName', label: 'Assistant Name (optional)', placeholder: 'Jane Doe' },
  { key: 'assistantTitle', label: 'Assistant Title (optional)', placeholder: 'Catering Coordinator' },
  { key: 'assistantPhone', label: 'Assistant Phone (optional)', placeholder: '(805) 555-0200' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const updateField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateStore = (idx, key, value) => {
    setProfile(prev => {
      const stores = [...(prev.stores || [])];
      stores[idx] = { ...stores[idx], [key]: value };
      return { ...prev, stores };
    });
    setSaved(false);
  };

  const addStore = () => {
    setProfile(prev => ({
      ...prev,
      stores: [...(prev.stores || []), {
        storeName: '', street: '', city: '', state: '', phone: '',
        operatorName: '', operatorPhone: '', assistantName: '',
        assistantTitle: 'Catering Coordinator - Assistant Operator', assistantPhone: '',
      }],
    }));
    setSaved(false);
  };

  const removeStore = (idx) => {
    setProfile(prev => ({
      ...prev,
      stores: prev.stores.filter((_, i) => i !== idx),
    }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Keep top-level store fields synced with first store for flyer compat
      const saveData = { ...profile };
      if (profile.stores?.[0]) {
        Object.assign(saveData, profile.stores[0]);
      }
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });
      setSaved(true);
    } catch {
      alert('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.container}><p style={{ color: '#6b7280' }}>Loading profile...</p></div>;
  }

  const stores = profile?.stores || [];
  const isMultiStore = profile?.role === 'district_manager' || profile?.role === 'administrator';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Store Profile</h1>
        <p className={styles.subtitle}>This info auto-fills into all your tools. Update it here anytime.</p>
      </div>
      <form onSubmit={handleSave} className={styles.form}>
        {/* Basic info */}
        <div className={styles.field}>
          <label className={styles.label}>Your Name</label>
          <input className={styles.input} value={profile?.displayName || ''} onChange={e => updateField('displayName', e.target.value)} />
        </div>
        <div className={styles.field} style={{ marginTop: 14 }}>
          <label className={styles.label}>District Manager Name</label>
          <input className={styles.input} value={profile?.districtManager || ''} onChange={e => updateField('districtManager', e.target.value)} placeholder="Mike Johnson" />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

        {/* Stores */}
        {stores.map((store, idx) => (
          <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 16, background: '#fafbfc' }}>
            {isMultiStore && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ color: '#134A7C' }}>Store {idx + 1}</strong>
                {stores.length > 1 && <button type="button" onClick={() => removeStore(idx)} style={{ color: '#EE3227', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remove</button>}
              </div>
            )}
            {STORE_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className={styles.field} style={{ marginBottom: 10 }}>
                <label className={styles.label}>{label}</label>
                <input
                  className={styles.input}
                  placeholder={placeholder}
                  value={store[key] || ''}
                  onChange={e => updateStore(idx, key, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

        {isMultiStore && (
          <button type="button" onClick={addStore} style={{
            width: '100%', padding: 12, background: 'transparent', border: '2px dashed #d1d5db',
            borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer',
            fontFamily: 'inherit', marginBottom: 20,
          }}>
            + Add Another Store
          </button>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
