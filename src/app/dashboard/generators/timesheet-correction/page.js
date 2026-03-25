'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import TimesheetCorrectionPreview from '@/components/TimesheetCorrectionPreview';
import styles from './page.module.css';

const FIELDS = [
  { key: 'employeeName', label: 'Employee Name', type: 'text' },
  { key: 'employeePosition', label: 'Position', type: 'text' },
  { key: 'storeName', label: 'Store Name', type: 'text' },
  { key: 'supervisorName', label: 'Supervisor Name', type: 'text' },
  { key: 'correctionDate', label: 'Date of Request', type: 'date' },
  { key: 'originalDate', label: 'Date of Shift', type: 'date' },
  { key: 'originalClockIn', label: 'Original Clock In', type: 'time' },
  { key: 'originalClockOut', label: 'Original Clock Out', type: 'time' },
  { key: 'correctedClockIn', label: 'Corrected Clock In', type: 'time' },
  { key: 'correctedClockOut', label: 'Corrected Clock Out', type: 'time' },
  { key: 'reason', label: 'Reason for Correction', type: 'textarea' },
  { key: 'employeeSignature', label: 'Employee Signature (Print Name)', type: 'text' },
  { key: 'supervisorSignature', label: 'Supervisor Signature (Print Name)', type: 'text' },
];

export default function TimesheetCorrectionPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ correctionDate: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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
      pdf.save('timesheet-correction.pdf');
    } catch (err) {
      console.error('PDF error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [showToast]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: '#6b7280', padding: '48px' }}>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Timesheet Correction</h2>
        <p className={styles.sidebarDesc}>Fill in the correction details. Auto-fills from your store profile.</p>
        <div className={styles.fields}>
          {FIELDS.map(({ key, label, type }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  className={styles.textarea}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
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
        <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <TimesheetCorrectionPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
