'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import TerminationPreview from '@/components/TerminationPreview';
import SaveToDrive from '@/components/SaveToDrive';
import ESignButton from '@/components/ESignButton';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import { useFormDraft } from '@/lib/useFormDraft';
import { validateRequired, capturePreviewToPdf } from '@/lib/form-utils';
import styles from './page.module.css';

// RT-107: Pre-termination checklist component
const TERM_CHECKLIST = [
  'HR / district manager notified',
  'Final paycheck prepared',
  'Exit interview scheduled or waived',
  'Final timesheet reviewed',
  'System access removed (POS, Homebase)',
  'Unemployment notice provided',
];

function TerminationChecklist() {
  const [checked, setChecked] = useState([]);
  const toggle = (item) => setChecked(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  const allDone = checked.length === TERM_CHECKLIST.length;
  return (
    <div style={{ background: allDone ? 'rgba(22,163,74,0.05)' : 'rgba(220,38,38,0.04)', border: `1px solid ${allDone ? '#bbf7d0' : '#fecaca'}`, borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: allDone ? '#16a34a' : '#dc2626', marginBottom: 8 }}>
        PRE-TERMINATION CHECKLIST {allDone ? '✓' : `${checked.length}/${TERM_CHECKLIST.length}`}
      </div>
      {TERM_CHECKLIST.map(item => (
        <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gray-700)', cursor: 'pointer', padding: '3px 0' }}>
          <input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} style={{ accentColor: 'var(--jm-blue)' }} />
          <span style={{ textDecoration: checked.includes(item) ? 'line-through' : 'none', color: checked.includes(item) ? '#9ca3af' : 'var(--charcoal)' }}>{item}</span>
        </label>
      ))}
    </div>
  );
}

const TERMINATION_TYPES = [
  'Involuntary - Performance',
  'Involuntary - Policy Violation',
  'Involuntary - Attendance',
  'Involuntary - Misconduct',
  'Involuntary - Other',
  'Layoff/Reduction in Force',
];

const COMPANY_PROPERTY_ITEMS = [
  'Keys',
  'Uniform Shirts',
  'Name Tag',
  'Apron',
  'Other',
];

function getTodayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function TerminationPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm, clearDraft] = useFormDraft('termination', {
    employeeName: '',
    employeePosition: '',
    storeName: '',
    storeNumber: '',
    supervisorName: '',
    hireDate: '',
    terminationDate: getTodayStr(),
    terminationType: 'Involuntary - Performance',
    previousDiscipline: '',
    terminationReason: '',
    finalPayDate: getTodayStr(),
    finalPayNotes: '',
    companyPropertyReturned: [],
    benefitsInfo: '',
    supervisorSignature: '',
    witnessName: '',
    witnessSignature: '',
    employeeSignature: '',
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
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => {
        if (data.profile) {
          setForm(prev => ({
            ...prev,
            storeName: data.profile.storeName || '',
            userEmail: data.profile.email || '',
            storeNumber: data.profile.storeNumber || '',
            supervisorName: data.profile.operatorName || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Pre-fill from completed signing request
  const searchParams = useSearchParams();
  const signToken = searchParams?.get('sign_token');

  useEffect(() => {
    if (!signToken || !user) return;
    fetch(`/api/signing/manager/${signToken}`)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => {
        if (data.formData && Object.keys(data.formData).length > 0) {
          setForm(prev => ({ ...prev, ...data.formData }));
        }
        if (data.signatureDataUrl) {
          setForm(prev => ({ ...prev, employeeSignature: data.signatureDataUrl }));
        }
      })
      .catch(e => { console.debug('[termination] Signature token load failed:', e); });
  }, [signToken, user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePropertyToggle = (item) => {
    setForm(prev => {
      const current = prev.companyPropertyReturned;
      if (current.includes(item)) {
        return { ...prev, companyPropertyReturned: current.filter(i => i !== item) };
      }
      return { ...prev, companyPropertyReturned: [...current, item] };
    });
  };

  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const handleDownload = useCallback(async () => {
    const errs = validateRequired(form, [{ key: 'employeeName', label: 'Employee Name' }, { key: 'terminationReason', label: 'Termination Reason' }]);
    if (Object.keys(errs).length) { setErrors(errs); showToast('Please fill in all required fields.', 'error'); return; }
    setErrors({});
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const pdf = await capturePreviewToPdf(previewRef.current);
      if (!mountedRef.current) return;

      const dateStr = form.terminationDate || getTodayStr();
      const fileName = form.employeeName
        ? `Termination_${form.employeeName.replace(/\s+/g, '_')}_${dateStr}.pdf`
        : `Termination_${dateStr}.pdf`;
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
            documentType: 'termination',
            fileName: fileName,
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || form.managerName || '',
              storeNumber: form.storeNumber || '',
            },
          }),
        }).catch(err => console.error('[doc-save] failed:', err));
      }

      logActivity({ generatorType: 'termination', action: 'download', formData: form, filename: fileName });
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
        <h2 className={styles.sidebarTitle}>Employee Termination</h2>
        <p className={styles.sidebarDesc}>
          Fill out the termination details. Store info is pre-filled from your profile.
        </p>
        {/* RT-107: Pre-termination checklist */}
        <TerminationChecklist />
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
              maxLength={100}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Store Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              maxLength={100}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Store Number</label>
            <input
              type="text"
              className={styles.input}
              value={form.storeNumber}
              onChange={(e) => handleChange('storeNumber', e.target.value)}
              maxLength={10}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Supervisor Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.supervisorName}
              onChange={(e) => handleChange('supervisorName', e.target.value)}
              maxLength={100}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Hire Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Termination Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.terminationDate}
              onChange={(e) => handleChange('terminationDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Termination Type</label>
            <select
              className={styles.select}
              value={form.terminationType}
              onChange={(e) => handleChange('terminationType', e.target.value)}
            >
              {TERMINATION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Previous Discipline</label>
            <textarea
              className={styles.textarea}
              value={form.previousDiscipline}
              onChange={(e) => handleChange('previousDiscipline', e.target.value)}
              placeholder="List prior warnings, coaching, or disciplinary actions..."
              rows={3}
              maxLength={600}
            />
            <div className={styles.charCount}>{(form.previousDiscipline || '').length}/600</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Termination Reason</label>
            <textarea
              className={styles.textarea}
              value={form.terminationReason}
              onChange={(e) => { handleChange('terminationReason', e.target.value); if (errors.terminationReason) setErrors(p => ({ ...p, terminationReason: null })); }}
              placeholder="Detailed reason for termination..."
              rows={3}
              maxLength={800}
            />
            <div className={styles.charCount}>{(form.terminationReason || '').length}/800</div>
            {errors.terminationReason && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.terminationReason}</div>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Final Pay Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.finalPayDate}
              onChange={(e) => handleChange('finalPayDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Final Pay Notes</label>
            <textarea
              className={styles.textarea}
              value={form.finalPayNotes}
              onChange={(e) => handleChange('finalPayNotes', e.target.value)}
              placeholder="Notes about final pay, accrued PTO, etc..."
              rows={2}
              maxLength={400}
            />
            <div className={styles.charCount}>{(form.finalPayNotes || '').length}/400</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Company Property Returned</label>
            {COMPANY_PROPERTY_ITEMS.map(item => (
              <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--charcoal)', cursor: 'pointer', padding: '2px 0' }}>
                <input
                  type="checkbox"
                  checked={form.companyPropertyReturned.includes(item)}
                  onChange={() => handlePropertyToggle(item)}
                  style={{ accentColor: 'var(--jm-blue)' }}
                />
                {item}
              </label>
            ))}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Benefits / COBRA Notes</label>
            <textarea
              className={styles.textarea}
              value={form.benefitsInfo}
              onChange={(e) => handleChange('benefitsInfo', e.target.value)}
              placeholder="COBRA eligibility, benefits continuation info..."
              rows={2}
              maxLength={400}
            />
            <div className={styles.charCount}>{(form.benefitsInfo || '').length}/400</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Supervisor Signature (Printed Name)</label>
            <input
              type="text"
              className={styles.input}
              value={form.supervisorSignature}
              onChange={(e) => handleChange('supervisorSignature', e.target.value)}
              placeholder="Supervisor printed name"
              maxLength={100}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Witness Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.witnessName}
              onChange={(e) => handleChange('witnessName', e.target.value)}
              placeholder="Witness full name"
              maxLength={100}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Witness Signature (Printed Name)</label>
            <input
              type="text"
              className={styles.input}
              value={form.witnessSignature}
              onChange={(e) => handleChange('witnessSignature', e.target.value)}
              placeholder="Witness printed name"
              maxLength={100}
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
        <ESignButton
          documentType="termination"
          documentTitle={`Employee Termination${form.employeeName ? ' — ' + form.employeeName : ''}`}
          employeeName={form.employeeName}
          formData={form}
          disabled={!form.employeeName}
        />
        <button
          type="button"
          onClick={() => { if (confirm('Clear all fields and start over?')) { clearDraft(); window.location.reload(); } }}
          style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'none', border: 'none', fontSize: '12px', color: 'var(--gray-400)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↺ Start over
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="termination.pdf"
          disabled={generating}
          generatorType="termination"
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
            <TerminationPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
