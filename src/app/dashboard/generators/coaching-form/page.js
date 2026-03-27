'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import CoachingFormPreview from '@/components/CoachingFormPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import styles from './page.module.css';

const COACHING_TYPES = [
  { value: 'attendance', label: 'Attendance / Punctuality' },
  { value: 'performance', label: 'Job Performance' },
  { value: 'behavior', label: 'Conduct / Behavior' },
  { value: 'policy', label: 'Policy Violation' },
  { value: 'safety', label: 'Safety Concern' },
  { value: 'other', label: 'Other' },
];

export default function CoachingFormPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm] = useState({
    employeeName: '',
    position: '',
    storeNumber: '',
    storeName: '',
    coachName: '',
    coachingDate: '',
    coachingType: '',
    previousDates: '',
    concern: '',
    expectations: '',
    actionItems: '',
    followUpDate: '',
    consequences: 'Continued failure to meet expectations may result in further disciplinary action, up to and including termination of employment.',
    employeeComments: '',
  });

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          const p = data.profile;
          setForm(prev => ({
            ...prev,
            storeNumber: p.storeNumber || '',
            storeName: p.storeName || '',
            coachName: p.operatorName || user?.name || '',
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
      const name = form.employeeName ? form.employeeName.replace(/\s+/g, '-').toLowerCase() : 'employee';
      const fileName = `coaching-form-${name}.pdf`;
      pdf.save(fileName);
      logActivity({ generatorType: 'coaching-form', action: 'download', formData: form, filename: fileName });
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
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
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Employee Coaching</h2>
        <p className={styles.sidebarDesc}>
          Document verbal coaching conversations. This precedes formal written warnings and creates a paper trail for progressive discipline.
        </p>

        {/* Employee Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Employee Information</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Employee Name</label>
              <input type="text" className={styles.input} value={form.employeeName} onChange={(e) => handleChange('employeeName', e.target.value)} placeholder="Full name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Position</label>
              <input type="text" className={styles.input} value={form.position} onChange={(e) => handleChange('position', e.target.value)} placeholder="e.g. Team Member, Shift Lead" />
            </div>
          </div>
        </div>

        {/* Coaching Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Coaching Details</h3>
          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Coach / Manager</label>
                <input type="text" className={styles.input} value={form.coachName} onChange={(e) => handleChange('coachName', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <input type="date" className={styles.input} value={form.coachingDate} onChange={(e) => handleChange('coachingDate', e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Type of Coaching</label>
              <select className={styles.select} value={form.coachingType} onChange={(e) => handleChange('coachingType', e.target.value)}>
                <option value="">Select type...</option>
                {COACHING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Previous Coaching Dates (if any)</label>
              <input type="text" className={styles.input} value={form.previousDates} onChange={(e) => handleChange('previousDates', e.target.value)} placeholder="e.g. 3/10/2026, 3/15/2026" />
            </div>
          </div>
        </div>

        {/* Concern */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Description of Concern</h3>
          <div className={styles.field}>
            <textarea className={styles.textarea} rows={4} value={form.concern} onChange={(e) => handleChange('concern', e.target.value)} placeholder="Describe the specific behavior, incident, or performance issue. Include dates, times, and specific examples..." />
          </div>
        </div>

        {/* Expectations */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Expectations & Standards</h3>
          <div className={styles.field}>
            <textarea className={styles.textarea} rows={3} value={form.expectations} onChange={(e) => handleChange('expectations', e.target.value)} placeholder="What is the expected standard? Reference specific policies or procedures..." />
          </div>
        </div>

        {/* Action Items */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Action Items & Improvement Plan</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <textarea className={styles.textarea} rows={3} value={form.actionItems} onChange={(e) => handleChange('actionItems', e.target.value)} placeholder="Specific steps the employee will take to improve..." />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Follow-Up Date</label>
              <input type="date" className={styles.input} value={form.followUpDate} onChange={(e) => handleChange('followUpDate', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Consequences */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Consequences</h3>
          <div className={styles.field}>
            <textarea className={styles.textarea} rows={2} value={form.consequences} onChange={(e) => handleChange('consequences', e.target.value)} />
          </div>
        </div>

        {/* Employee Comments */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Employee Comments</h3>
          <div className={styles.field}>
            <textarea className={styles.textarea} rows={2} value={form.employeeComments} onChange={(e) => handleChange('employeeComments', e.target.value)} placeholder="Employee's response or comments (optional)..." />
          </div>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName={`coaching-form-${(form.employeeName || 'employee').replace(/\s+/g, '-').toLowerCase()}`}
          disabled={generating}
          generatorType="coaching-form"
          formData={form}
        />
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <CoachingFormPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
