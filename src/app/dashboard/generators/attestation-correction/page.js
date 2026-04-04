'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import AttestationCorrectionPreview from '@/components/AttestationCorrectionPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const FIELDS = [
  { key: 'employeeName', label: 'Employee Name', type: 'text' },
  { key: 'employeePosition', label: 'Position', type: 'text' },
  { key: 'storeName', label: 'Store Name', type: 'text' },
  { key: 'supervisorName', label: 'Supervisor Name', type: 'text' },
  { key: 'correctionDate', label: 'Date of Request', type: 'date' },
  { key: 'attestationType', label: 'Attestation Type', type: 'select', options: [
    { value: 'meal', label: 'Meal Period' },
    { value: 'rest', label: 'Rest Break' },
    { value: 'both', label: 'Meal Period & Rest Break' },
  ]},
  { key: 'shiftDate', label: 'Date of Shift', type: 'date' },
  { key: 'shiftStart', label: 'Shift Start Time', type: 'time' },
  { key: 'shiftEnd', label: 'Shift End Time', type: 'time' },
  { key: 'originalAttestation', label: 'Original Attestation Response', type: 'text' },
  { key: 'correctedAttestation', label: 'Corrected Attestation Response', type: 'text' },
  { key: 'reason', label: 'Reason for Correction', type: 'textarea' },
  { key: 'employeeSignature', label: 'Employee Signature (Print Name)', type: 'text' },
  { key: 'supervisorSignature', label: 'Supervisor Signature (Print Name)', type: 'text' },
];

export default function AttestationCorrectionPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm, clearDraft] = useFormDraft('attestation-correction', {
    correctionDate: new Date().toISOString().split('T')[0],
    attestationType: 'meal',
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setForm(prev => ({
            ...prev,
            storeName: data.profile.storeName || '',
            userEmail: data.profile.email || '',
            supervisorName: data.profile.operatorName || '',
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
      pdf.save('attestation-correction.pdf');

      // Dual save to employee's internal file record
      if (form.employeeName) {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.employeeName,
            employeeId: form._employeeId || null,
            documentType: 'attestation-correction',
            fileName: 'attestation-correction.pdf',
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || form.managerName || '',
              storeNumber: form.storeNumber || '',
            },
          }),
        }).catch(() => {});
      }

      logActivity({ generatorType: 'attestation-correction', action: 'download', formData: form, filename: 'attestation-correction.pdf' });
      if (mountedRef.current) { showToast('✓ PDF downloaded successfully!', 'success'); clearDraft(); setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [showToast]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Attestation Correction</h2>
        <p className={styles.sidebarDesc}>Correct meal period or rest break attestation records.</p>
        <div className={styles.fields}>
          {FIELDS.map(({ key, label, type, options }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  className={styles.textarea}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                />
              ) : type === 'select' ? (
                // RT-096: Use select class for proper width/styling
                <select
                  className={styles.select || styles.input}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : key === 'employeeName' ? (
                <EmployeeSelect
                  value={form.employeeName}
                  onChange={(name, emp) => {
                    handleChange('employeeName', name);
                    if (emp && emp.id) handleChange('_employeeId', emp.id);
                  }}
                  onPositionFill={(pos) => handleChange('employeePosition', pos)}
                  storeNumber={form.storeNumber}
                  placeholder="Search employees..."
                />
              ) : (
                <input
                  type={type}
                  className={styles.input}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <button className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`} onClick={handleDownload} disabled={generating} title="Ctrl+Enter to download">
          {generating ? <><span className="gen-btn-spinner" />Generating PDF...</> : showSuccess ? '✓ Downloaded!' : 'Download PDF'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="attestation-correction.pdf"
          disabled={generating}
          generatorType="attestation-correction"
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
            <AttestationCorrectionPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
