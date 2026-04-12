'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

// RT-215: Store hours defaults
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_HOURS = { open: '10:00', close: '21:00', closed: false };

const STORE_FIELDS = [
  { key: 'storeNumber', label: 'Store Number', placeholder: '12345', max: 20 },
  { key: 'storeName', label: 'Store Name', placeholder: "Jersey Mike's #12345", max: 100 },
  { key: 'street', label: 'Street Address', placeholder: '199 S Turnpike Rd', max: 200 },
  { key: 'city', label: 'City', placeholder: 'Santa Barbara', max: 100 },
  { key: 'state', label: 'State', placeholder: 'CA', max: 5 },
  { key: 'phone', label: 'Store Phone', placeholder: '(805) 497-5800', max: 20 },
  { key: 'operatorName', label: 'Operator Name', placeholder: 'John Smith', max: 100 },
  { key: 'operatorPhone', label: 'Operator Phone', placeholder: '(805) 555-0100', max: 20 },
  { key: 'assistantName', label: 'Assistant Name (optional)', placeholder: 'Jane Doe', max: 100 },
  { key: 'assistantTitle', label: 'Assistant Title (optional)', placeholder: 'Catering Coordinator', max: 100 },
  { key: 'assistantPhone', label: 'Assistant Phone (optional)', placeholder: '(805) 555-0200', max: 20 },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasExtendedScopes, setHasExtendedScopes] = useState(false);
  const formRef = useRef(null);

  // RT-120: Ctrl+S to save profile
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const checkScopes = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/scopes');
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setHasExtendedScopes(data.hasExtendedScopes === true);
    } catch (e) { console.debug('[profile] scopes check failed (non-fatal):', e); }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => {
        setProfile(data.profile || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
    checkScopes();
  }, [user, checkScopes]);

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
    const storeName = profile?.stores?.[idx]?.storeName || `Store ${idx + 1}`;
    if (!confirm(`Remove "${storeName}"? This cannot be undone.`)) return;
    setProfile(prev => ({
      ...prev,
      stores: (prev.stores || []).filter((_, i) => i !== idx),
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
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      setSaved(true);
      showToast('Profile saved successfully.', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      showToast('Failed to save. Please try again.', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)' }}>Loading profile...</p></div>;
  }

  const stores = profile?.stores || [];
  const isMultiStore = profile?.role === 'district_manager' || profile?.role === 'administrator';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Store Profile</h1>
        <p className={styles.subtitle}>This info auto-fills into all your tools. Update it here anytime.</p>
        <Link href="/dashboard/history" className={styles.historyLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          View Generation History
        </Link>
      </div>
      <form ref={formRef} onSubmit={handleSave} className={styles.form}>
        {/* Basic info */}
        <div className={styles.field}>
          <label className={styles.label}>Your Name</label>
          <input className={styles.input} value={profile?.displayName || ''} onChange={e => updateField('displayName', e.target.value)} maxLength={100} />
        </div>
        <div className={styles.field} style={{ marginTop: 14 }}>
          <label className={styles.label}>District Manager Name</label>
          <input className={styles.input} value={profile?.districtManager || ''} onChange={e => updateField('districtManager', e.target.value)} placeholder="Mike Johnson" maxLength={100} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

        {/* Stores */}
        {stores.map((store, idx) => (
          <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16, background: 'var(--gray-50)' }}>
            {isMultiStore && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ color: 'var(--jm-blue)' }}>Store {idx + 1}</strong>
                {stores.length > 1 && <button type="button" onClick={() => removeStore(idx)} style={{ color: 'var(--jm-red)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Remove</button>}
              </div>
            )}
            {STORE_FIELDS.map(({ key, label, placeholder, max }) => (
              <div key={key} className={styles.field} style={{ marginBottom: 10 }}>
                <label className={styles.label}>{label}</label>
                <input
                  className={styles.input}
                  placeholder={placeholder}
                  maxLength={max}
                  value={store[key] || ''}
                  onChange={e => updateStore(idx, key, e.target.value)}
                />
              </div>
            ))}
            {/* RT-216: Map preview */}
            {(store.street && store.city) && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Location Preview</div>
                <iframe
                  title={`Map for ${store.storeName || 'store'}`}
                  width="100%"
                  height="180"
                  style={{ border: 'none', borderRadius: 8, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent([store.street, store.city, store.state].filter(Boolean).join(', '))}&output=embed&zoom=15`}
                />
              </div>
            )}
          </div>
        ))}

        {isMultiStore && (
          <button type="button" onClick={addStore} style={{
            width: '100%', padding: 12, background: 'transparent', border: '2px dashed var(--border)',
            borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--gray-500)', cursor: 'pointer',
            fontFamily: 'inherit', marginBottom: 20,
          }}>
            + Add Another Store
          </button>
        )}

        {/* RT-215: Store hours */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontFamily: '\'Playfair Display\', serif', fontSize: '18px', fontWeight: 800, color: 'var(--jm-blue)', marginBottom: '4px' }}>Store Hours</h3>
          <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '16px' }}>Auto-fills into catering flyers and order forms.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DAYS.map(day => {
              const hours = (profile?.hours || {})[day] || DEFAULT_HOURS;
              return (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: 'var(--gray-50)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ width: '90px', fontSize: '13px', fontWeight: 600, color: 'var(--charcoal)', flexShrink: 0 }}>{day}</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--gray-500)', flexShrink: 0 }}>
                    <input type="checkbox" checked={hours.closed || false} onChange={e => updateField('hours', { ...(profile?.hours || {}), [day]: { ...hours, closed: e.target.checked } })} />
                    Closed
                  </label>
                  {!hours.closed && (
                    <>
                      <input type="time" value={hours.open || '10:00'} onChange={e => updateField('hours', { ...(profile?.hours || {}), [day]: { ...hours, open: e.target.value } })} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }} />
                      <span style={{ color: 'var(--gray-400)', fontSize: '12px' }}>to</span>
                      <input type="time" value={hours.close || '21:00'} onChange={e => updateField('hours', { ...(profile?.hours || {}), [day]: { ...hours, close: e.target.value } })} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={`${styles.saveBtn}${saved ? ' gen-download-success' : ''}`} disabled={saving} title="Ctrl+S to save">
            {saving ? <><span className="gen-btn-spinner" />Saving...</> : saved ? '✓ Saved!' : 'Save Profile'}
          </button>
          <p className="gen-keyboard-hint">Tip: Press Ctrl+S to save</p>
        </div>
      </form>

      {/* Connected Services */}
      <div className={styles.servicesSection}>
        <h2 className={styles.servicesTitle}>Connected Services</h2>
        <p className={styles.servicesSubtitle}>Manage which Google services RO Tools can access on your behalf.</p>

        <div className={styles.serviceCard}>
          <div className={styles.serviceInfo}>
            <div className={styles.serviceName}>Google Drive, Sheets &amp; Docs</div>
            <div className={styles.serviceDesc}>Save generated PDFs directly to your Google Drive. Required for &quot;Save to Drive&quot; on all generators.</div>
          </div>
          {hasExtendedScopes ? (
            <div className={styles.serviceConnected}>
              <span className={styles.serviceStatusDot}></span>
              Connected
            </div>
          ) : (
            <button
              className={styles.serviceConnectBtn}
              onClick={() => { window.location.href = `/api/auth/upgrade?returnTo=/dashboard/profile`; }}
            >
              Connect
            </button>
          )}
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.serviceInfo}>
            <div className={styles.serviceName}>Gmail (Send Only)</div>
            <div className={styles.serviceDesc}>Send generated documents via email directly from the app. Granted alongside Drive access.</div>
          </div>
          {hasExtendedScopes ? (
            <div className={styles.serviceConnected}>
              <span className={styles.serviceStatusDot}></span>
              Connected
            </div>
          ) : (
            <div className={styles.serviceDisconnected}>Not connected</div>
          )}
        </div>

        {hasExtendedScopes && (
          <p className={styles.servicesNote}>
            To revoke access, visit your{' '}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--jm-blue)', fontWeight: 600 }}>
              Google Account Permissions
            </a>{' '}
            page and remove RO Tools. You&apos;ll be prompted to reconnect when using Drive features.
          </p>
        )}

        {/* RT-250: 2FA option (UI shell — TOTP coming soon) */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceInfo}>
            <div className={styles.serviceName}>Two-Factor Authentication</div>
            <div className={styles.serviceDesc}>Add an extra layer of security to your account with an authenticator app. Coming soon — currently secured via Google OAuth.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 6 }}>Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
