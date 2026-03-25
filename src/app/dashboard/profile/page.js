'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

const FIELDS = [
  { key: 'storeName', label: 'Store Name', placeholder: "Jersey Mike's #12345" },
  { key: 'street', label: 'Street Address', placeholder: '199 S Turnpike Rd' },
  { key: 'city', label: 'City', placeholder: 'Santa Barbara' },
  { key: 'state', label: 'State', placeholder: 'CA' },
  { key: 'phone', label: 'Store Phone', placeholder: '(805) 497-5800' },
  { key: 'operatorName', label: 'Operator Name', placeholder: 'John Smith' },
  { key: 'operatorPhone', label: 'Operator Phone', placeholder: '(805) 555-0100' },
  { key: 'assistantName', label: 'Assistant Name', placeholder: 'Jane Doe' },
  { key: 'assistantTitle', label: 'Assistant Title', placeholder: 'Catering Coordinator - Assistant Operator' },
  { key: 'assistantPhone', label: 'Assistant Phone', placeholder: '(805) 555-0200' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const snap = await getDoc(doc(db, 'stores', user.uid));
      if (snap.exists()) {
        setForm(snap.data());
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await setDoc(doc(db, 'stores', user.uid), {
        ...form,
        email: user.email,
      }, { merge: true });
      setSaved(true);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: '#6b7280' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Store Profile</h1>
        <p className={styles.subtitle}>This info auto-fills into all your tools. Update it here anytime.</p>
      </div>
      <form onSubmit={handleSave} className={styles.form}>
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={placeholder}
              value={form[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
