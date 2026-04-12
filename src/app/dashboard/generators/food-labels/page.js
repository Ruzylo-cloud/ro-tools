'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import FoodLabelPreview from '@/components/FoodLabelPreview';
import SaveToDrive from '@/components/SaveToDrive';
import EmployeeSelect from '@/components/EmployeeSelect';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import { validateRequired, brandedFilename, capturePreviewToPdf } from '@/lib/form-utils';
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
  const [errors, setErrors] = useState({});
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
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
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
    const errs = validateRequired(form, [{ key: 'itemName', label: 'Item Name' }]);
    if (!form.shelfLifeHours && !form.shelfLifeDays) {
      errs.shelfLife = 'Shelf life hours or days is required';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const pdf = await capturePreviewToPdf(previewRef.current);
      if (!mountedRef.current) return;
      const fileName = brandedFilename('FoodLabels', form.itemName || form.preparedBy || 'Labels');
      pdf.save(fileName);
      logActivity({ generatorType: 'food-labels', action: 'download', formData: form, filename: fileName });
      // Save admin copy to GCS
      try {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        await fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.preparedBy || null,
            documentType: 'food-labels',
            fileName: fileName,
            content: pdfBase64,
            metadata: { storeNumber: form.storeNumber || '', preparedBy: form.preparedBy || '' },
          }),
        });
      } catch (err) { console.error('Admin doc save failed:', err); }
      showToast('Food labels PDF downloaded!', 'success'); clearDraft(); if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  // RT-139: Keyboard shortcut Ctrl+Enter to download
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleDownload(); }
  }, [handleDownload]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p></div>;
  }

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
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
              <input
                type="text"
                className={styles.input}
                value={form.itemName}
                onChange={(e) => {
                  handleChange('itemName', e.target.value);
                  if (errors.itemName) setErrors((p) => ({ ...p, itemName: null }));
                }}
                placeholder="e.g. Sliced Turkey, Provolone, Onions"
                maxLength={100}
              />
              {errors.itemName && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.itemName}</div>}
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
                <input
                  type="number"
                  className={styles.input}
                  value={form.shelfLifeHours}
                  onChange={(e) => {
                    handleChange('shelfLifeHours', e.target.value);
                    if (errors.shelfLife) setErrors((p) => ({ ...p, shelfLife: null }));
                  }}
                  placeholder="e.g. 4"
                  min="0"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Days</label>
                <input
                  type="number"
                  className={styles.input}
                  value={form.shelfLifeDays}
                  onChange={(e) => {
                    handleChange('shelfLifeDays', e.target.value);
                    if (errors.shelfLife) setErrors((p) => ({ ...p, shelfLife: null }));
                  }}
                  placeholder="e.g. 3"
                  min="0"
                />
              </div>
            </div>
            {errors.shelfLife && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.shelfLife}</div>}
            <div className={styles.field}>
              <label className={styles.label}>Storage Temperature</label>
              <input type="text" className={styles.input} value={form.storageTemp} onChange={(e) => handleChange('storageTemp', e.target.value)} placeholder="e.g. 41°F or below" maxLength={50} />
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
                  color: form.allergens.includes(a) ? 'var(--jm-blue)' : 'var(--gray-500)',
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
        <button
          type="button"
          onClick={() => { if (confirm('Clear all fields and start over?')) { clearDraft(); window.location.reload(); } }}
          style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'none', border: 'none', fontSize: '12px', color: 'var(--gray-400)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↺ Start over
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName={brandedFilename('FoodLabels', form.itemName || form.preparedBy || 'Labels')}
          disabled={generating}
          generatorType="food-labels"
          formData={form}
        />
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
