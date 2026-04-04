'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import ResignationPreview from '@/components/ResignationPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import { useFormDraft } from '@/lib/useFormDraft';
import { validateRequired } from '@/lib/form-utils';
import styles from './page.module.css';

const RESIGNATION_TYPES = [
  'Voluntary',
  'Job Abandonment',
  'Mutual Agreement',
];

const NOTICE_OPTIONS = [
  '2+ Weeks',
  '1 Week',
  'Less Than 1 Week',
  'No Notice',
  'Immediate',
];

function getTodayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function ResignationPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm, clearDraft] = useFormDraft('resignation', {
    employeeName: '',
    employeePosition: '',
    storeName: '',
    storeNumber: '',
    managerName: '',
    resignationDate: getTodayStr(),
    lastDay: '',
    resignationType: 'Voluntary',
    reason: '',
    noticeGiven: '2+ Weeks',
    equipmentReturned: {
      keys: false,
      uniform: false,
      nameTag: false,
      other: false,
    },
    exitInterviewCompleted: false,
    finalPayInfo: '',
    employeeSignature: '',
    managerSignature: '',
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewZoom, setPreviewZoom] = useState(100);
  const previewRef = useRef(null);

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
            storeNumber: data.profile.storeNumber || '',
            managerName: data.profile.operatorName || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      // RT-106: Auto-calculate last day from resignation date + notice period
      const noticeKey = key === 'noticeGiven' ? value : next.noticeGiven;
      const dateKey = key === 'resignationDate' ? value : next.resignationDate;
      if (noticeKey && dateKey) {
        const base = new Date(dateKey + 'T12:00:00');
        const daysMap = { '2+ Weeks': 14, '1 Week': 7, 'Less Than 1 Week': 3, 'No Notice': 0, 'Immediate': 0 };
        const days = daysMap[noticeKey] ?? 0;
        base.setDate(base.getDate() + days);
        next.lastDay = base.toISOString().split('T')[0];
      }
      return next;
    });
  };

  const handleEquipmentChange = (item, checked) => {
    setForm(prev => ({
      ...prev,
      equipmentReturned: {
        ...prev.equipmentReturned,
        [item]: checked,
      },
    }));
  };

  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const handleDownload = useCallback(async () => {
    const errs = validateRequired(form, [{ key: 'employeeName', label: 'Employee Name' }, { key: 'reason', label: 'Reason for Resignation' }]);
    if (Object.keys(errs).length) { setErrors(errs); showToast('Please fill in all required fields.', 'error'); return; }
    setErrors({});
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(previewRef.current, {
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

      const dateStr = form.resignationDate
        ? form.resignationDate.replace(/-/g, '')
        : getTodayStr().replace(/-/g, '');
      const fileName = form.employeeName
        ? `Resignation_${form.employeeName.replace(/\s+/g, '_')}_${dateStr}.pdf`
        : `Resignation_${dateStr}.pdf`;
      pdf.save(fileName);

      // Dual save to employee's internal file record
      if (form.employeeName) {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.employeeName,
            employeeId: form._employeeId || null,
            documentType: 'resignation',
            fileName: fileName,
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || form.managerName || '',
              storeNumber: form.storeNumber || '',
            },
          }),
        }).catch(() => {});
      }

      logActivity({ generatorType: 'resignation', action: 'download', formData: form, filename: fileName });
      if (mountedRef.current) { showToast('✓ PDF downloaded successfully!', 'success'); clearDraft(); setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  // RT-139: Keyboard shortcut Ctrl+Enter to download
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
        <h2 className={styles.sidebarTitle}>Employee Resignation</h2>
        <p className={styles.sidebarDesc}>
          Fill out the resignation details. Store info is pre-filled from your profile.
        </p>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Employee Name</label>
            <EmployeeSelect
              value={form.employeeName}
              onChange={(name, emp) => {
                handleChange('employeeName', name);
                if (emp && emp.id) handleChange('_employeeId', emp.id);
                if (errors.employeeName) setErrors(prev => ({ ...prev, employeeName: null }));
              }}
              onPositionFill={(pos) => handleChange('employeePosition', pos)}
              storeNumber={form.storeNumber}
              placeholder="Search employees..."
            />
            {errors.employeeName && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.employeeName}</div>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Employee Position</label>
            <input
              type="text"
              className={styles.input}
              value={form.employeePosition}
              onChange={(e) => handleChange('employeePosition', e.target.value)}
              placeholder="e.g. Crew Member"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Store Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Store Number</label>
            <input
              type="text"
              className={styles.input}
              value={form.storeNumber}
              onChange={(e) => handleChange('storeNumber', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Manager Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.managerName}
              onChange={(e) => handleChange('managerName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Resignation Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.resignationDate}
              onChange={(e) => handleChange('resignationDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Last Day of Work</label>
            <input
              type="date"
              className={styles.input}
              value={form.lastDay}
              onChange={(e) => handleChange('lastDay', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Resignation Type</label>
            <select
              className={styles.select}
              value={form.resignationType}
              onChange={(e) => handleChange('resignationType', e.target.value)}
            >
              {RESIGNATION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Reason for Resignation</label>
            <textarea
              className={styles.textarea}
              value={form.reason}
              onChange={(e) => { handleChange('reason', e.target.value); if (errors.reason) setErrors(p => ({ ...p, reason: null })); }}
              placeholder="Reason for leaving..."
              rows={3}
              maxLength={600}
            />
            <div className={styles.charCount}>{(form.reason || '').length}/600</div>
            {errors.reason && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.reason}</div>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Notice Given</label>
            <select
              className={styles.select}
              value={form.noticeGiven}
              onChange={(e) => handleChange('noticeGiven', e.target.value)}
            >
              {NOTICE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {/* RT-106: Auto-calc hint */}
            {form.lastDay && (
              <p style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4 }}>
                Last day auto-set to {new Date(form.lastDay + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Equipment Returned</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.equipmentReturned.keys}
                  onChange={(e) => handleEquipmentChange('keys', e.target.checked)}
                />
                <span>Keys</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.equipmentReturned.uniform}
                  onChange={(e) => handleEquipmentChange('uniform', e.target.checked)}
                />
                <span>Uniform</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.equipmentReturned.nameTag}
                  onChange={(e) => handleEquipmentChange('nameTag', e.target.checked)}
                />
                <span>Name Tag</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.equipmentReturned.other}
                  onChange={(e) => handleEquipmentChange('other', e.target.checked)}
                />
                <span>Other</span>
              </label>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.exitInterviewCompleted}
                onChange={(e) => handleChange('exitInterviewCompleted', e.target.checked)}
              />
              <span>Exit Interview Completed</span>
            </label>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Final Pay Notes</label>
            <textarea
              className={styles.textarea}
              value={form.finalPayInfo}
              onChange={(e) => handleChange('finalPayInfo', e.target.value)}
              placeholder="Notes about final paycheck, PTO payout, etc..."
              rows={2}
              maxLength={400}
            />
            <div className={styles.charCount}>{(form.finalPayInfo || '').length}/400</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Employee Signature (Printed Name)</label>
            <input
              type="text"
              className={styles.input}
              value={form.employeeSignature}
              onChange={(e) => handleChange('employeeSignature', e.target.value)}
              placeholder="Employee printed name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Manager Signature (Printed Name)</label>
            <input
              type="text"
              className={styles.input}
              value={form.managerSignature}
              onChange={(e) => handleChange('managerSignature', e.target.value)}
              placeholder="Manager printed name"
            />
          </div>
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
          onClick={() => { if (confirm('Clear all fields and start over?')) { clearDraft(); window.location.reload(); } }}
          style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'none', border: 'none', fontSize: '12px', color: 'var(--gray-400)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↺ Start over
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="resignation.pdf"
          disabled={generating}
          generatorType="resignation"
          formData={form}
        />
      </div>

      {/* Preview */}
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
            <ResignationPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
