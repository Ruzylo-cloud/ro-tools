'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import WorkOrderPreview from '@/components/WorkOrderPreview';
import SaveToDrive from '@/components/SaveToDrive';
import EmployeeSelect from '@/components/EmployeeSelect';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import { validateRequired, brandedFilename } from '@/lib/form-utils';
import styles from './page.module.css';

const CATEGORIES = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'structural', label: 'Structural' },
  { value: 'general', label: 'General' },
];

const PRIORITIES = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function WorkOrdersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewZoom, setPreviewZoom] = useState(100);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm, clearDraft] = useFormDraft('work-orders', {
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    reportedBy: '',
    assignedTo: '',
    assignedType: 'internal',
    equipment: '',
    location: '',
    estimatedCost: '',
    dueDate: '',
    storeNumber: '',
    storeName: '',
    managerName: '',
    userEmail: '',
    date: new Date().toISOString().split('T')[0],
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
            managerName: p.operatorName || user?.name || '',
            userEmail: p.email || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = useCallback(async () => {
    const errs = validateRequired(form, [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Issue Description' },
    ]);
    if (Object.keys(errs).length) { setErrors(errs); showToast('Please fill in all required fields.', 'error'); return; }
    setErrors({});
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
      const fileName = brandedFilename('WorkOrder', form.title || form.equipment || 'Request');
      pdf.save(fileName);
      logActivity({ generatorType: 'work-orders', action: 'download', formData: form, filename: fileName });
      // Save admin copy to GCS
      try {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        await fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: null,
            documentType: 'work-orders',
            fileName: fileName,
            content: pdfBase64,
            metadata: { storeNumber: form.storeNumber || '', title: form.title || '' },
          }),
        });
      } catch (err) { console.error('Admin doc save failed:', err); }
      showToast('Work order PDF downloaded!', 'success'); clearDraft(); if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
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
        <h2 className={styles.sidebarTitle}>Work Orders</h2>
        <p className={styles.sidebarDesc}>
          Create maintenance and equipment work orders. Track issues, assign vendors or staff, and document resolutions.
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Work Order Details</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                className={styles.input}
                value={form.title}
                onChange={(e) => {
                  handleChange('title', e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: null }));
                }}
                placeholder="e.g. Slicer blade needs replacement"
              />
              {errors.title && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.title}</div>}
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                {/* RT-109: Priority color indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select className={styles.select} style={{ flex: 1 }} value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: form.priority === 'urgent' ? '#dc2626' : form.priority === 'high' ? '#f97316' : form.priority === 'medium' ? '#ca8a04' : '#6b7280',
                    boxShadow: form.priority === 'urgent' ? '0 0 6px rgba(220,38,38,0.5)' : 'none',
                  }} />
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={4} value={form.description} onChange={(e) => { handleChange('description', e.target.value); if (errors.description) setErrors(p => ({ ...p, description: null })); }} placeholder="Describe the issue, when it started, and any troubleshooting already tried..." maxLength={800} />
              <div className={styles.charCount}>{(form.description || '').length}/800</div>
              {errors.description && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.description}</div>}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Equipment / Location</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Equipment / Asset</label>
              <input type="text" className={styles.input} value={form.equipment} onChange={(e) => handleChange('equipment', e.target.value)} placeholder="e.g. Hobart Slicer #2, Walk-in cooler" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Location in Store</label>
              <input type="text" className={styles.input} value={form.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="e.g. Back line, Office, Restroom" />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Assignment</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Reported By</label>
              <EmployeeSelect
                value={form.reportedBy}
                onChange={(name) => handleChange('reportedBy', name)}
                storeNumber={form.storeNumber}
                placeholder="Who reported the issue..."
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Assigned To</label>
              <input type="text" className={styles.input} value={form.assignedTo} onChange={(e) => handleChange('assignedTo', e.target.value)} placeholder="Staff member or vendor name" />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Assignment Type</label>
                <select className={styles.select} value={form.assignedType} onChange={(e) => handleChange('assignedType', e.target.value)}>
                  <option value="internal">Internal Staff</option>
                  <option value="vendor">Vendor / External</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Estimated Cost</label>
                <input type="number" className={styles.input} value={form.estimatedCost} onChange={(e) => handleChange('estimatedCost', e.target.value)} placeholder="$0.00" min="0" step="0.01" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Due Date</label>
              <input type="date" className={styles.input} value={form.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} />
            </div>
          </div>
        </div>

        <button className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`} onClick={handleDownload} disabled={generating} title="Ctrl+Enter to download">
          {generating ? <><span className="gen-btn-spinner" />Generating...</> : showSuccess ? '✓ Downloaded!' : 'Download Work Order PDF'}
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
          fileName={brandedFilename('WorkOrder', form.title || form.equipment || 'Request')}
          disabled={generating}
          generatorType="work-orders"
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
            <WorkOrderPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
