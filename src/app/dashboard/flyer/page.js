'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import FlyerPreview from '@/components/FlyerPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const EDITABLE_FIELDS = [
  { key: 'street', label: 'Street Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'phone', label: 'Store Phone' },
  { key: 'operatorName', label: 'Operator Name' },
  { key: 'operatorPhone', label: 'Operator Phone' },
  { key: 'assistantName', label: 'Assistant Name' },
  { key: 'assistantTitle', label: 'Assistant Title' },
  { key: 'assistantPhone', label: 'Assistant Phone' },
];

// RT-141: Flyer template options
const FLYER_TEMPLATES = [
  { id: 'classic', label: 'Classic Blue', desc: 'Blue + Red' },
  { id: 'bold', label: 'Bold Red', desc: 'Red header, blue accents' },
  { id: 'dark', label: 'Dark Pro', desc: 'Charcoal + Gold' },
];

// RT-140: All 16 menu items for the override editor
const ALL_MENU_ITEMS = [
  { key: 'BLT', num: '#1', defaultDesc: 'Bacon, lettuce, tomato & mayo' },
  { key: "Jersey Shore's Favorite", num: '#2', defaultDesc: 'Provolone, ham & cappacuolo' },
  { key: 'Ham & Provolone', num: '#3', defaultDesc: 'Provolone & ham' },
  { key: 'The Number Four', num: '#4', defaultDesc: 'Provolone, prosciuttini & cappacuolo' },
  { key: 'The Super Sub', num: '#5', defaultDesc: 'Provolone, ham, prosciuttini & cappacuolo' },
  { key: 'Roast Beef & Provolone', num: '#6', defaultDesc: 'Provolone & oven-roasted top rounds' },
  { key: 'Turkey & Provolone', num: '#7', defaultDesc: 'Provolone & 99% fat-free turkey' },
  { key: 'Club Sub', num: '#8', defaultDesc: 'Provolone, turkey, ham, bacon & mayo' },
  { key: 'Club Supreme', num: '#9', defaultDesc: 'Swiss, roast beef, turkey, bacon & mayo' },
  { key: 'Tuna Fish', num: '#10', defaultDesc: 'Made fresh in-store daily' },
  { key: 'Stickball Special', num: '#11', defaultDesc: 'Provolone, ham & salami' },
  { key: 'Cancro Special', num: '#12', defaultDesc: 'Provolone, roast beef & pepperoni' },
  { key: 'The Original Italian', num: '#13', defaultDesc: 'Provolone, ham, prosciuttini, cappacuolo, salami & pepperoni' },
  { key: 'The Veggie', num: '#14', defaultDesc: 'Swiss, provolone & green bell peppers' },
  { key: 'California Club', num: '', defaultDesc: 'Provolone, turkey, bacon & avocado' },
  { key: 'Turkey Club', num: '', defaultDesc: 'Provolone, turkey, bacon & mayo' },
];

export default function FlyerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // RT-141: template selector — persisted in draft
  const [flyerDraft, setFlyerDraft, clearFlyerDraft] = useFormDraft('flyer', { template: 'classic', overrides: {} });
  const flyerTemplate = flyerDraft.template || 'classic';
  const menuOverrides = flyerDraft.overrides || {};
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const flyerRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => {
        if (data.profile) setForm(data.profile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setFlyerTemplate = (t) => setFlyerDraft(prev => ({ ...prev, template: t }));

  const handleMenuOverride = (itemKey, field, value) => {
    setFlyerDraft(prev => {
      const prevOverrides = prev.overrides || {};
      const current = prevOverrides[itemKey] || {};
      const item = ALL_MENU_ITEMS.find(i => i.key === itemKey);
      return {
        ...prev,
        overrides: {
          ...prevOverrides,
          [itemKey]: {
            name: current.name !== undefined ? current.name : itemKey,
            desc: current.desc !== undefined ? current.desc : (item?.defaultDesc ?? ''),
            [field]: value,
          },
        },
      };
    });
  };

  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const handleDownload = useCallback(async () => {
    if (!flyerRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 612,
        height: 792,
      });

      if (!mountedRef.current) return;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);
      pdf.save('catering-flyer.pdf');
      logActivity({ generatorType: 'flyer', action: 'download', formData: form, filename: 'catering-flyer.pdf' });
      if (mountedRef.current) {
        setShowSuccess(true);
        setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [showToast, form]);

  // RT-149: Ctrl+Enter keyboard shortcut — consistent with all generators
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleDownload(); }
  }, [handleDownload]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Flyer Details</h2>
        <p className={styles.sidebarDesc}>
          Pre-filled from your store profile. Edit here for one-off changes.
        </p>

        {/* RT-141: Template selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Template</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {FLYER_TEMPLATES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFlyerTemplate(t.id)}
                style={{
                  flex: 1, padding: '7px 4px', borderRadius: 8,
                  border: flyerTemplate === t.id ? '2px solid #134A7C' : '1px solid var(--border)',
                  background: flyerTemplate === t.id ? 'rgba(19,74,124,0.06)' : 'var(--white)',
                  cursor: 'pointer', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: flyerTemplate === t.id ? '#134A7C' : '#374151' }}>{t.label}</div>
                <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fields}>
          {EDITABLE_FIELDS.map(({ key, label }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <input
                type="text"
                className={styles.input}
                value={form[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* RT-140: Collapsible menu item editor */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setShowMenuEditor(v => !v)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '9px 12px', background: 'var(--gray-50)', border: '1px solid var(--border)',
              borderRadius: showMenuEditor ? '8px 8px 0 0' : 8, cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: 'var(--text)',
            }}
          >
            <span>Customize Menu</span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>{showMenuEditor ? '▲' : '▼'}</span>
          </button>
          {showMenuEditor && (
            <div style={{
              border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px',
              padding: '10px 12px', background: 'var(--white)', maxHeight: 320, overflowY: 'auto',
            }}>
              {ALL_MENU_ITEMS.map(item => {
                const override = menuOverrides[item.key] || {};
                const currentName = override.name !== undefined ? override.name : item.key;
                const currentDesc = override.desc !== undefined ? override.desc : item.defaultDesc;
                return (
                  <div key={item.key} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 4 }}>
                      {item.num ? `${item.num} ` : ''}{item.key}
                    </div>
                    <input
                      type="text"
                      value={currentName}
                      onChange={e => handleMenuOverride(item.key, 'name', e.target.value)}
                      placeholder="Name"
                      style={{
                        width: '100%', padding: '4px 8px', fontSize: 12, border: '1px solid var(--border)',
                        borderRadius: 6, marginBottom: 4, boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="text"
                      value={currentDesc}
                      onChange={e => handleMenuOverride(item.key, 'desc', e.target.value)}
                      placeholder="Description"
                      style={{
                        width: '100%', padding: '4px 8px', fontSize: 11, border: '1px solid var(--border)',
                        borderRadius: 6, color: 'var(--gray-500)', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`}
          onClick={handleDownload}
          disabled={generating}
          title="Ctrl+Enter to download"
        >
          {generating ? <><span className="gen-btn-spinner" />Generating PDF...</> : showSuccess ? '✓ Downloaded!' : 'Download PDF'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>
        <button
          type="button"
          onClick={() => { if (confirm('Clear all customizations and start over?')) { clearFlyerDraft(); window.location.reload(); } }}
          style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'none', border: 'none', fontSize: '12px', color: 'var(--gray-400)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↺ Start over
        </button>

        <SaveToDrive
          getCanvasRef={() => flyerRef.current}
          fileName="catering-flyer"
          disabled={generating}
          generatorType="flyer"
          formData={form}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
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
          <FlyerPreview
            ref={flyerRef}
            data={form}
            template={flyerTemplate}
            menuOverrides={menuOverrides}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
