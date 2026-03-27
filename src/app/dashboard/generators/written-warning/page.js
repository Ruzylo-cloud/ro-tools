'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import WrittenWarningPreview from '@/components/WrittenWarningPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
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

export default function WrittenWarningPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    employeeName: '',
    employeePosition: '',
    storeName: '',
    storeNumber: '',
    supervisorName: '',
    warningDate: getTodayStr(),
    warningType: 'Written Warning',
    violationCategory: '',
    violationDescription: '',
    previousWarnings: '',
    expectedImprovement: '',
    consequencesIfNotImproved: '',
    employeeComments: '',
    employeeSignature: '',
    supervisorSignature: '',
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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

  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const handleDownload = useCallback(async () => {
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

      const fileName = form.employeeName
        ? `written-warning-${form.employeeName.replace(/\s+/g, '-').toLowerCase()}.pdf`
        : 'written-warning.pdf';
      pdf.save(fileName);
      logActivity({ generatorType: 'written-warning', action: 'download', formData: form, filename: fileName });
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form.employeeName, showToast]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: '#6b7280', padding: '48px' }}>Loading store info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Written Warning</h2>
        <p className={styles.sidebarDesc}>
          Fill out the corrective action details. Store info is pre-filled from your profile.
        </p>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Employee Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.employeeName}
              onChange={(e) => handleChange('employeeName', e.target.value)}
              placeholder="Full name"
            />
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
            <label className={styles.label}>Supervisor Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.supervisorName}
              onChange={(e) => handleChange('supervisorName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Warning Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.warningDate}
              onChange={(e) => handleChange('warningDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Warning Type</label>
            <select
              className={styles.select}
              value={form.warningType}
              onChange={(e) => handleChange('warningType', e.target.value)}
            >
              {WARNING_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Violation Category</label>
            <select
              className={styles.select}
              value={form.violationCategory}
              onChange={(e) => handleChange('violationCategory', e.target.value)}
            >
              <option value="">Select category...</option>
              {VIOLATION_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Violation Description</label>
            <textarea
              className={styles.textarea}
              value={form.violationDescription}
              onChange={(e) => handleChange('violationDescription', e.target.value)}
              placeholder="Describe the violation in detail..."
              rows={3}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Previous Warnings</label>
            <textarea
              className={styles.textarea}
              value={form.previousWarnings}
              onChange={(e) => handleChange('previousWarnings', e.target.value)}
              placeholder="List any previous warnings..."
              rows={2}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Expected Improvement</label>
            <textarea
              className={styles.textarea}
              value={form.expectedImprovement}
              onChange={(e) => handleChange('expectedImprovement', e.target.value)}
              placeholder="What is expected going forward..."
              rows={2}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Consequences If Not Improved</label>
            <textarea
              className={styles.textarea}
              value={form.consequencesIfNotImproved}
              onChange={(e) => handleChange('consequencesIfNotImproved', e.target.value)}
              placeholder="Consequences of continued violation..."
              rows={2}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Employee Comments</label>
            <textarea
              className={styles.textarea}
              value={form.employeeComments}
              onChange={(e) => handleChange('employeeComments', e.target.value)}
              placeholder="Employee response (optional)..."
              rows={2}
            />
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
            <label className={styles.label}>Supervisor Signature (Printed Name)</label>
            <input
              type="text"
              className={styles.input}
              value={form.supervisorSignature}
              onChange={(e) => handleChange('supervisorSignature', e.target.value)}
              placeholder="Supervisor printed name"
            />
          </div>
        </div>
        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="written-warning.pdf"
          disabled={generating}
          generatorType="written-warning"
          formData={form}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <WrittenWarningPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
