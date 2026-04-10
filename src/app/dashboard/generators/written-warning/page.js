'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import WrittenWarningPreview from '@/components/WrittenWarningPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import ESignButton from '@/components/ESignButton';
import { useFormDraft } from '@/lib/useFormDraft';
import { validateRequired, brandedFilename } from '@/lib/form-utils';
import styles from './page.module.css';

const WARNING_TYPES = [
  'Verbal Warning',
  'Written Warning',
  'Final Warning',
  'Suspension',
  'Termination',
];

const VIOLATION_CATEGORIES = [
  'Attendance',
  'Performance',
  'Conduct',
  'Policy Violation',
  'Safety',
  'Other',
];

function getTodayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const INITIAL_FORM = {
  employeeName: '',
  employeePosition: '',
  storeName: '',
  storeNumber: '',
  supervisorName: '',
  warningDate: '',
  warningType: 'Written Warning',
  violationCategory: '',
  violationDescription: '',
  previousWarnings: '',
  expectedImprovement: '',
  consequencesIfNotImproved: '',
  employeeComments: '',
  employeeSignature: '',
  supervisorSignature: '',
};

// RT-063: Required fields list
const REQUIRED_FIELDS = [
  { key: 'employeeName', label: 'Employee Name' },
  { key: 'violationDescription', label: 'Violation Description' },
  { key: 'violationCategory', label: 'Violation Category' },
];

export default function WrittenWarningPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  // RT-061: Auto-save draft
  const [form, setForm, clearDraft] = useFormDraft('written-warning', {
    ...INITIAL_FORM,
    warningDate: getTodayStr(),
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  // RT-062: Inline validation errors
  const [errors, setErrors] = useState({});
  // RT-086: PDF preview zoom
  const [previewZoom, setPreviewZoom] = useState(100);
  const [showSuccess, setShowSuccess] = useState(false);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => {
        if (data.profile) {
          setForm(prev => ({
            ...prev,
            storeName: prev.storeName || data.profile.storeName || '',
            userEmail: data.profile.email || '',
            storeNumber: prev.storeNumber || data.profile.storeNumber || '',
            supervisorName: prev.supervisorName || data.profile.operatorName || '',
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
      .catch(() => {});
  }, [signToken, user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;

    // RT-062: Validate before generating
    const errs = validateRequired(form, REQUIRED_FIELDS);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setGenerating(true);
    setShowSuccess(false);
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

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);

      // RT-089: Branded filename
      const fileName = brandedFilename('WrittenWarning', form.employeeName);
      pdf.save(fileName);
      logActivity({ generatorType: 'written-warning', action: 'download', formData: form, filename: fileName });

      // RT-118: Success feedback
      if (mountedRef.current) {
        setShowSuccess(true);
        showToast('PDF downloaded successfully!', 'success');
        clearDraft();
        setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 3000);
      }

      // Dual save to employee record
      if (form.employeeName) {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.employeeName,
            employeeId: form._employeeId || null,
            documentType: 'written-warning',
            fileName,
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || '',
              storeNumber: form.storeNumber || '',
              warningType: form.warningType || '',
              warningDate: form.warningDate || '',
            },
          }),
        }).catch(err => console.error('[doc-save] failed:', err));
      }
    } catch (err) {
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast, clearDraft]);

  // RT-120: Keyboard submit (Ctrl+Enter)
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleDownload();
    }
  }, [handleDownload]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading store info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Written Warning</h2>
        <p className={styles.sidebarDesc}>
          Fill out the corrective action details. Store info is pre-filled from your profile.
          {Object.keys(errors).length > 0 && (
            <span className={styles.validationSummary}> Please fix the highlighted fields.</span>
          )}
        </p>

        <div className={styles.fields}>
          {/* Employee Name — required */}
          <div className={styles.field}>
            <label className={styles.label}>
              Employee Name <span className={styles.required}>*</span>
            </label>
            <EmployeeSelect
              value={form.employeeName}
              onChange={(name, emp) => {
                handleChange('employeeName', name);
                if (emp?.id) handleChange('_employeeId', emp.id);
              }}
              onPositionFill={(pos) => handleChange('employeePosition', pos)}
              storeNumber={form.storeNumber}
              placeholder="Search employees..."
              hasError={!!errors.employeeName}
            />
            {errors.employeeName && <p className={styles.errorMsg}>{errors.employeeName}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-position">Employee Position</label>
            <input
              id="ww-position"
              type="text"
              className={styles.input}
              value={form.employeePosition}
              onChange={(e) => handleChange('employeePosition', e.target.value)}
              placeholder="e.g. Crew Member"
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-store-name">Store Name</label>
            <input id="ww-store-name" type="text" className={styles.input} value={form.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)} maxLength={100} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-store-num">Store Number</label>
            <input id="ww-store-num" type="text" className={styles.input} value={form.storeNumber}
              onChange={(e) => handleChange('storeNumber', e.target.value)} maxLength={10} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-supervisor">Supervisor Name</label>
            <input id="ww-supervisor" type="text" className={styles.input} value={form.supervisorName}
              onChange={(e) => handleChange('supervisorName', e.target.value)}
              placeholder="Manager name" maxLength={100} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-date">Warning Date</label>
            <input id="ww-date" type="date" className={styles.input} value={form.warningDate}
              onChange={(e) => handleChange('warningDate', e.target.value)} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-type">Warning Type</label>
            <select id="ww-type" className={styles.select} value={form.warningType}
              onChange={(e) => handleChange('warningType', e.target.value)}>
              {WARNING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {/* RT-110: Severity visual (1-3 scale) */}
            {form.warningType && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', alignItems: 'center' }}>
                {['Verbal Warning', 'Written Warning', 'Final Warning', 'Suspension', 'Termination'].map((type, i) => {
                  const currentIdx = WARNING_TYPES.indexOf(form.warningType);
                  const isActive = i <= currentIdx;
                  const color = i >= 4 ? '#dc2626' : i >= 3 ? '#f97316' : i >= 2 ? '#ca8a04' : i >= 1 ? '#2563eb' : '#6b7280';
                  return (
                    <div key={type} title={type} style={{ flex: 1, height: '4px', borderRadius: '2px', background: isActive ? color : 'var(--border)', transition: 'background 0.2s' }} />
                  );
                })}
                <span style={{ fontSize: '11px', color: 'var(--gray-500)', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                  {WARNING_TYPES.indexOf(form.warningType) + 1}/5
                </span>
              </div>
            )}
          </div>

          {/* Violation Category — required */}
          <div className={styles.field}>
            <label className={styles.label}>
              Violation Category <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.select} ${errors.violationCategory ? styles.inputError : ''}`}
              value={form.violationCategory}
              onChange={(e) => handleChange('violationCategory', e.target.value)}>
              <option value="">Select category...</option>
              {VIOLATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.violationCategory && <p className={styles.errorMsg}>{errors.violationCategory}</p>}
          </div>

          {/* Violation Description — required, with char count */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-violation">
              Violation Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="ww-violation"
              className={`${styles.textarea} ${errors.violationDescription ? styles.inputError : ''}`}
              value={form.violationDescription}
              onChange={(e) => handleChange('violationDescription', e.target.value)}
              placeholder="Describe the violation in detail..."
              rows={3}
              maxLength={1000}
              aria-describedby={errors.violationDescription ? 'ww-violation-err' : undefined}
            />
            {/* RT-064: Character count */}
            <div className={styles.charCount}>{form.violationDescription.length}/1000</div>
            {errors.violationDescription && <p id="ww-violation-err" className={styles.errorMsg}>{errors.violationDescription}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-prev-warnings">Previous Warnings</label>
            <textarea id="ww-prev-warnings" className={styles.textarea} value={form.previousWarnings}
              onChange={(e) => handleChange('previousWarnings', e.target.value)}
              placeholder="List any previous warnings..." rows={2} maxLength={600} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-improvement">Expected Improvement</label>
            <textarea id="ww-improvement" className={styles.textarea} value={form.expectedImprovement}
              onChange={(e) => handleChange('expectedImprovement', e.target.value)}
              placeholder="What is expected going forward..." rows={2} maxLength={600} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-consequences">Consequences If Not Improved</label>
            <textarea id="ww-consequences" className={styles.textarea} value={form.consequencesIfNotImproved}
              onChange={(e) => handleChange('consequencesIfNotImproved', e.target.value)}
              placeholder="Consequences of continued violation..." rows={2} maxLength={600} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-emp-comments">Employee Comments</label>
            <textarea id="ww-emp-comments" className={styles.textarea} value={form.employeeComments}
              onChange={(e) => handleChange('employeeComments', e.target.value)}
              placeholder="Employee response (optional)..." rows={2} maxLength={600} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-emp-sig">Employee Signature (Printed Name)</label>
            <input id="ww-emp-sig" type="text" className={styles.input} value={form.employeeSignature}
              onChange={(e) => handleChange('employeeSignature', e.target.value)}
              placeholder="Employee printed name" maxLength={100} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ww-sup-sig">Supervisor Signature (Printed Name)</label>
            <input id="ww-sup-sig" type="text" className={styles.input} value={form.supervisorSignature}
              onChange={(e) => handleChange('supervisorSignature', e.target.value)}
              placeholder="Supervisor printed name" maxLength={100} />
          </div>
        </div>

        {/* RT-117: Loading state, RT-118: Success state */}
        <button
          className={`${styles.downloadBtn} ${showSuccess ? styles.downloadBtnSuccess : ''}`}
          onClick={handleDownload}
          disabled={generating}
          title="Ctrl+Enter to download"
        >
          {generating ? (
            <><span className={styles.btnSpinner} /> Generating PDF...</>
          ) : showSuccess ? (
            <>✓ Downloaded!</>
          ) : (
            'Download PDF'
          )}
        </button>
        <p className={styles.keyboardHint}>Tip: Press Ctrl+Enter to generate</p>
        <ESignButton
          documentType="written-warning"
          documentTitle={`Written Warning${form.employeeName ? ' — ' + form.employeeName : ''}`}
          employeeName={form.employeeName}
          formData={form}
          disabled={!form.employeeName || !form.violationDescription}
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
          fileName={brandedFilename('WrittenWarning', form.employeeName)}
          disabled={generating}
          generatorType="written-warning"
          formData={form}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
          {/* RT-086: Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--gray-500)' }}>
            <button onClick={() => setPreviewZoom(z => Math.max(50, z - 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ minWidth: '36px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{previewZoom}%</span>
            <button onClick={() => setPreviewZoom(z => Math.min(150, z + 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <button onClick={() => setPreviewZoom(100)} style={{ padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '11px' }}>Reset</button>
          </div>
        </div>
        {/* RT-087: Preview scale + dark mode */}
        <div className={styles.previewContainer} style={{ overflow: 'auto' }}>
          <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top left', width: `${10000 / previewZoom}%` }}>
            <WrittenWarningPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
