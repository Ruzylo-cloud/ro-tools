'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import EvaluationPreview from '@/components/EvaluationPreview';
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
  const [form, setForm] = useState({
    employeeName: '',
    employeePosition: '',
    storeName: '',
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
      pdf.save(`performance-evaluation-${empName}.pdf`);
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
        <h2 className={styles.sidebarTitle}>Performance Evaluation</h2>
        <p className={styles.sidebarDesc}>
          Fill in employee details and ratings. Store and evaluator info are pre-filled from your profile.
        </p>
        <div className={styles.fields}>
          {/* Employee Info */}
          <div className={styles.sectionLabel}>Employee Info</div>
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

          {/* Ratings */}
          <div className={styles.sectionLabel}>Performance Ratings</div>
          {RATING_CATEGORIES.map((cat) => (
            <div key={cat} className={styles.ratingField}>
              <label className={styles.label}>{cat}</label>
              <div className={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.ratingBtn} ${form.ratings[cat] === n ? styles.ratingBtnActive : ''}`}
                    onClick={() => handleRating(cat, n)}
                    title={`${n} / 5`}
                  >
                    {n}
                  </button>
                ))}
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
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Areas for Improvement</label>
            <textarea
              className={styles.textarea}
              value={form.areasForImprovement}
              onChange={(e) => handleChange('areasForImprovement', e.target.value)}
              rows={3}
              placeholder="Areas where improvement is needed..."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Goals for Next Period</label>
            <textarea
              className={styles.textarea}
              value={form.goals}
              onChange={(e) => handleChange('goals', e.target.value)}
              rows={3}
              placeholder="Goals and objectives for the next period..."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Additional Comments</label>
            <textarea
              className={styles.textarea}
              value={form.additionalComments}
              onChange={(e) => handleChange('additionalComments', e.target.value)}
              rows={2}
              placeholder="Any other notes..."
            />
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
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <EvaluationPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
