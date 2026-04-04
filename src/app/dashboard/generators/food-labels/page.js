'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import FoodLabelPreview from '@/components/FoodLabelPreview';
import EmployeeSelect from '@/components/EmployeeSelect';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const CATEGORIES = [
  { value: 'produce', label: 'Produce' },
  { value: 'protein', label: 'Protein' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'prepared', label: 'Prepared' },
  { value: 'bread', label: 'Bread' },
  { value: 'sauce', label: 'Sauce / Dressing' },
  { value: 'other', label: 'Other' },
];

const ALLERGENS = ['milk', 'eggs', 'wheat', 'soy', 'fish', 'shellfish', 'tree nuts', 'peanuts'];

const LABEL_SIZES = [
  { value: '2x2', label: '2" x 2"' },
  { value: '2x1', label: '2" x 1"' },
  { value: '1x1', label: '1" x 1"' },
];

export default function FoodLabelsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm, clearDraft] = useFormDraft('food-labels', {
    itemName: '',
    category: '',
    shelfLifeHours: '',
    shelfLifeDays: '',
    allergens: [],
    storageTemp: '',
    preparedBy: '',
    storeNumber: '',
    storeName: '',
    labelSize: '2x2',
    quantity: '4',
  });

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          const p = data.profile;
          setForm(prev => ({
            ...prev,
            storeNumber: p.storeNumber || '',
            storeName: p.storeName || '',
            preparedBy: p.operatorName || user?.name || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleAllergen = (allergen) => {
    setForm(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, logging: false, width: 612, height: 792,
      });
      if (!mountedRef.current) return;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 612, 792);
      const name = form.itemName ? form.itemName.replace(/\s+/g, '-').toLowerCase() : 'food-labels';
      const fileName = `food-labels-${name}.pdf`;
      pdf.save(fileName);
      logActivity({ generatorType: 'food-labels', action: 'download', formData: form, filename: fileName });
      showToast('Food labels PDF downloaded!', 'success'); clearDraft(); if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Food Labels</h2>
        <p className={styles.sidebarDesc}>
          Generate printable food prep labels with item name, prep/expiry dates, allergens, and storage info.
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Item Information</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Item Name</label>
              <input type="text" className={styles.input} value={form.itemName} onChange={(e) => handleChange('itemName', e.target.value)} placeholder="e.g. Sliced Turkey, Provolone, Onions" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Shelf Life</h3>
          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Hours</label>
                <input type="number" className={styles.input} value={form.shelfLifeHours} onChange={(e) => handleChange('shelfLifeHours', e.target.value)} placeholder="e.g. 4" min="0" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Days</label>
                <input type="number" className={styles.input} value={form.shelfLifeDays} onChange={(e) => handleChange('shelfLifeDays', e.target.value)} placeholder="e.g. 3" min="0" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Storage Temperature</label>
              <input type="text" className={styles.input} value={form.storageTemp} onChange={(e) => handleChange('storageTemp', e.target.value)} placeholder="e.g. 41°F or below" />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Allergens</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {ALLERGENS.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAllergen(a)}
                style={{
                  padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                  border: form.allergens.includes(a) ? '2px solid #134A7C' : '1px solid var(--border)',
                  background: form.allergens.includes(a) ? 'rgba(19,74,124,0.08)' : 'var(--white)',
                  color: form.allergens.includes(a) ? '#134A7C' : 'var(--gray-500)',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Print Settings</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Prepared By</label>
              <EmployeeSelect
                value={form.preparedBy}
                onChange={(name) => handleChange('preparedBy', name)}
                storeNumber={form.storeNumber}
                placeholder="Search employees..."
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Label Size</label>
                <select className={styles.select} value={form.labelSize} onChange={(e) => handleChange('labelSize', e.target.value)}>
                  {LABEL_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Quantity</label>
                <input type="number" className={styles.input} value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} min="1" max="12" />
              </div>
            </div>
          </div>
        </div>

        <button className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`} onClick={handleDownload} disabled={generating} title="Ctrl+Enter to download">
          {generating ? <><span className="gen-btn-spinner" />Generating...</> : showSuccess ? '✓ Downloaded!' : 'Print Labels (PDF)'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--gray-500)' }}>
            <button onClick={() => setPreviewZoom(z => Math.max(50, z - 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ minWidth: '36px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{previewZoom}%</span>
            <button onClick={() => setPreviewZoom(z => Math.min(150, z + 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <button onClick={() => setPreviewZoom(100)} style={{ padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '11px' }}>Reset</button>
          </div>
        </div>
        <div className={styles.previewContainer} style={{ overflow: 'auto' }}>
          <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top left', width: `${10000 / previewZoom}%` }}>
            <FoodLabelPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
