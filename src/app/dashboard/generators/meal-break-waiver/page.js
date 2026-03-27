'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import MealBreakWaiverPreview from '@/components/MealBreakWaiverPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import styles from './page.module.css';

const FIELDS = [
  { key: 'employeeName', label: 'Employee Name', type: 'text' },
  { key: 'employeePosition', label: 'Position', type: 'text' },
  { key: 'storeName', label: 'Store Name', type: 'text' },
  { key: 'storeNumber', label: 'Store Number', type: 'text' },
  { key: 'managerName', label: 'Manager Name', type: 'text' },
  { key: 'waiverDate', label: 'Waiver Date', type: 'date' },
  { key: 'waiverType', label: 'Waiver Type', type: 'select', options: [
    { value: 'first', label: 'First Meal Period Waiver (shifts 6-12 hrs)' },
    { value: 'second', label: 'Second Meal Period Waiver (shifts 10-12 hrs)' },
    { value: 'on-duty', label: 'On-Duty Meal Period Agreement' },
  ]},
  { key: 'shiftSchedule', label: 'Typical Shift Schedule', type: 'textarea' },
  { key: 'employeeSignature', label: 'Employee Signature (Print Name)', type: 'text' },
  { key: 'managerSignature', label: 'Manager Signature (Print Name)', type: 'text' },
];

export default function MealBreakWaiverPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    waiverDate: new Date().toISOString().split('T')[0],
    waiverType: 'first',
  });
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
            storeNumber: data.profile.storeNumber || '',
            managerName: data.profile.operatorName || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const getFileName = () => {
    const name = (form.employeeName || 'Employee').replace(/\s+/g, '');
    const date = form.waiverDate || new Date().toISOString().split('T')[0];
    return `MealBreakWaiver_${name}_${date}.pdf`;
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
      const filename = getFileName();
      pdf.save(filename);
      logActivity({ generatorType: 'meal-break-waiver', action: 'download', formData: form, filename });
    } catch (err) {
      console.error('PDF error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: '#6b7280', padding: '48px' }}>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Meal Break Waiver</h2>
        <p className={styles.sidebarDesc}>Generate a California-compliant meal period waiver agreement.</p>
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
                <select
                  className={styles.input}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
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
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName={getFileName()}
          disabled={generating}
          generatorType="meal-break-waiver"
          formData={form}
        />
      </div>
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <MealBreakWaiverPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
