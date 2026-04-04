'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import EvaluationPreview from '@/components/EvaluationPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import { validateRequired } from '@/lib/form-utils';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const RATING_CATEGORIES = [
  'Attendance & Punctuality',
  'Quality of Work',
  'Speed & Efficiency',
  'Customer Service',
  'Teamwork & Cooperation',
  'Communication',
  'Initiative & Problem Solving',
  'Adherence to Policies',
  'Cleanliness & Organization',
  'Overall Performance',
];

function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default function EvaluationPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm, clearDraft] = useFormDraft('evaluation', {
    employeeName: '',
    employeePosition: '',
    storeName: '',
    storeNumber: '',
    evaluatorName: '',
    evaluationDate: getTodayString(),
    evaluationPeriod: '',
    ratings: {},
    strengths: '',
    areasForImprovement: '',
    goals: '',
    additionalComments: '',
    employeeSignature: '',
    evaluatorSignature: '',
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [errors, setErrors] = useState({}); // RT-135
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
            storeNumber: data.profile.storeNumber || '',
            userEmail: data.profile.email || '',
            evaluatorName: data.profile.operatorName || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRating = (category, value) => {
    setForm(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value },
    }));
  };

  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const handleDownload = useCallback(async () => {
    // RT-135: Client validation
    const errs = validateRequired(form, ['employeeName', 'evaluationDate']);
    if (Object.keys(errs).length) { setErrors(errs); return; }
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

      const empName = form.employeeName ? form.employeeName.replace(/\s+/g, '-').toLowerCase() : 'employee';
      const fileName = `performance-evaluation-${empName}.pdf`;
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
            documentType: 'evaluation',
            fileName: fileName,
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || form.managerName || '',
              storeNumber: form.storeNumber || '',
            },
          }),
        }).catch(() => {});
      }

      logActivity({ generatorType: 'evaluation', action: 'download', formData: form, filename: fileName });
      // RT-118: Success feedback
      if (mountedRef.current) { showToast('✓ PDF downloaded! Evaluation saved to employee record.', 'success'); clearDraft(); setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form.employeeName, showToast]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Performance Evaluation</h2>
        <p className={styles.sidebarDesc}>
          Fill in employee details and ratings. Store and evaluator info are pre-filled from your profile.
        </p>
        <div className={styles.fields}>
          {/* Employee Info */}
          <div className={styles.sectionLabel}>Employee Info</div>
          <div className={styles.field}>
            <label className={styles.label}>Employee Name <span style={{color:'var(--jm-red)'}}>*</span></label>
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
            {errors.employeeName && <div style={{color:'var(--jm-red)',fontSize:'12px',marginTop:'3px'}}>{errors.employeeName}</div>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Position</label>
            <input
              type="text"
              className={styles.input}
              value={form.employeePosition}
              onChange={(e) => handleChange('employeePosition', e.target.value)}
              placeholder="e.g. Crew Member, Shift Lead"
            />
          </div>

          {/* Evaluation Info */}
          <div className={styles.sectionLabel}>Evaluation Info</div>
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
            <label className={styles.label}>Evaluator Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.evaluatorName}
              onChange={(e) => handleChange('evaluatorName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Evaluation Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.evaluationDate}
              onChange={(e) => handleChange('evaluationDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Evaluation Period</label>
            <input
              type="text"
              className={styles.input}
              value={form.evaluationPeriod}
              onChange={(e) => handleChange('evaluationPeriod', e.target.value)}
              placeholder="e.g. Q1 2026 or Annual 2026"
            />
          </div>

          {/* Ratings — RT-093: Visual star rating */}
          <div className={styles.sectionLabel}>Performance Ratings</div>
          {/* RT-100: Average score bar */}
          {Object.keys(form.ratings).length > 0 && (() => {
            const rated = RATING_CATEGORIES.filter(c => form.ratings[c]);
            const avg = rated.length > 0 ? (rated.reduce((s, c) => s + form.ratings[c], 0) / rated.length) : 0;
            const pct = (avg / 5) * 100;
            const color = avg >= 4 ? '#16a34a' : avg >= 3 ? '#2563eb' : avg >= 2 ? '#ca8a04' : '#dc2626';
            return (
              <div style={{ marginBottom: 12, padding: '10px 12px', background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  <span>Overall Score</span>
                  <span style={{ color }}>{avg.toFixed(1)} / 5.0 ({rated.length}/{RATING_CATEGORIES.length} rated)</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })()}
          {RATING_CATEGORIES.map((cat) => (
            <div key={cat} className={styles.ratingField}>
              <label className={styles.label}>{cat}</label>
              <div className={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.ratingBtn} ${form.ratings[cat] >= n ? styles.ratingBtnActive : ''}`}
                    onClick={() => handleRating(cat, n)}
                    title={['Unsatisfactory', 'Needs Improvement', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'][n - 1]}
                    aria-label={`Rate ${cat} ${n} out of 5`}
                  >
                    ★
                  </button>
                ))}
                {form.ratings[cat] && (
                  <span className={styles.ratingLabel}>
                    {['Unsatisfactory', 'Needs Improvement', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'][form.ratings[cat] - 1]}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Comments */}
          <div className={styles.sectionLabel}>Comments</div>
          <div className={styles.field}>
            <label className={styles.label}>Strengths</label>
            <textarea
              className={styles.textarea}
              value={form.strengths}
              onChange={(e) => handleChange('strengths', e.target.value)}
              rows={3}
              placeholder="Key strengths and accomplishments..."
              maxLength={600}
            />
            <div className={styles.charCount}>{(form.strengths || '').length}/600</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Areas for Improvement</label>
            <textarea
              className={styles.textarea}
              value={form.areasForImprovement}
              onChange={(e) => handleChange('areasForImprovement', e.target.value)}
              rows={3}
              placeholder="Areas where improvement is needed..."
              maxLength={600}
            />
            <div className={styles.charCount}>{(form.areasForImprovement || '').length}/600</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Goals for Next Period</label>
            <textarea
              className={styles.textarea}
              value={form.goals}
              onChange={(e) => handleChange('goals', e.target.value)}
              rows={3}
              placeholder="Goals and objectives for the next period..."
              maxLength={600}
            />
            <div className={styles.charCount}>{(form.goals || '').length}/600</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Additional Comments</label>
            <textarea
              className={styles.textarea}
              value={form.additionalComments}
              onChange={(e) => handleChange('additionalComments', e.target.value)}
              rows={2}
              placeholder="Any other notes..."
              maxLength={400}
            />
            <div className={styles.charCount}>{(form.additionalComments || '').length}/400</div>
          </div>

          {/* Signatures */}
          <div className={styles.sectionLabel}>Signatures</div>
          <div className={styles.field}>
            <label className={styles.label}>Employee Signature</label>
            <input
              type="text"
              className={styles.input}
              value={form.employeeSignature}
              onChange={(e) => handleChange('employeeSignature', e.target.value)}
              placeholder="Employee prints name to sign"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Evaluator Signature</label>
            <input
              type="text"
              className={styles.input}
              value={form.evaluatorSignature}
              onChange={(e) => handleChange('evaluatorSignature', e.target.value)}
              placeholder="Evaluator prints name to sign"
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
          fileName="performance-evaluation.pdf"
          disabled={generating}
          generatorType="evaluation"
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
            <EvaluationPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
