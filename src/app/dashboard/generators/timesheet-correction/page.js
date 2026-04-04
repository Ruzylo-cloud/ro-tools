'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import TimesheetCorrectionPreview from '@/components/TimesheetCorrectionPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

// RT-108: Pay period options (Homebase uses Sun-Sat weekly)
function getPayPeriods() {
  const periods = [];
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (d.getDay() + i * 7));
    const start = new Date(d);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const fmt = (dt) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    periods.push({ label: `${fmt(start)} – ${fmt(end)}`, startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] });
  }
  return periods;
}

const FIELDS = [
  { key: 'employeeName', label: 'Employee Name', type: 'text' },
  { key: 'employeePosition', label: 'Position', type: 'text' },
  { key: 'storeName', label: 'Store Name', type: 'text' },
  { key: 'supervisorName', label: 'Supervisor Name', type: 'text' },
  { key: 'correctionDate', label: 'Date of Request', type: 'date' },
  { key: 'originalDate', label: 'Date of Shift', type: 'date' },
  { key: 'originalClockIn', label: 'Original Clock In', type: 'time' },
  { key: 'originalClockOut', label: 'Original Clock Out', type: 'time' },
  { key: 'originalBreakOut', label: 'Original Break Clock Out', type: 'time' },
  { key: 'originalBreakIn', label: 'Original Break Clock In', type: 'time' },
  { key: 'correctedClockIn', label: 'Corrected Clock In', type: 'time' },
  { key: 'correctedClockOut', label: 'Corrected Clock Out', type: 'time' },
  { key: 'correctedBreakOut', label: 'Corrected Break Clock Out', type: 'time' },
  { key: 'correctedBreakIn', label: 'Corrected Break Clock In', type: 'time' },
  { key: 'reason', label: 'Reason for Correction', type: 'textarea' },
  { key: 'employeeSignature', label: 'Employee Signature (Print Name)', type: 'text' },
  { key: 'supervisorSignature', label: 'Supervisor Signature (Print Name)', type: 'text' },
];

export default function TimesheetCorrectionPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm, clearDraft] = useFormDraft('timesheet-correction', { correctionDate: new Date().toISOString().split('T')[0] });
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
      pdf.save('timesheet-correction.pdf');

      // Dual save to employee's internal file record
      if (form.employeeName) {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.employeeName,
            employeeId: form._employeeId || null,
            documentType: 'timesheet-correction',
            fileName: 'timesheet-correction.pdf',
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || form.managerName || '',
              storeNumber: form.storeNumber || '',
            },
          }),
        }).catch(() => {});
      }

      logActivity({ generatorType: 'timesheet-correction', action: 'download', formData: form, filename: 'timesheet-correction.pdf' });
      if (mountedRef.current) { showToast('✓ PDF downloaded successfully!', 'success'); clearDraft(); }
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
        <h2 className={styles.sidebarTitle}>Timesheet Correction</h2>
        <p className={styles.sidebarDesc}>Fill in the correction details. Auto-fills from your store profile.</p>
        <div className={styles.fields}>
          {/* RT-108: Pay period selector */}
          <div className={styles.field}>
            <label className={styles.label}>Pay Period</label>
            <select
              className={styles.select}
              value={form._payPeriod || ''}
              onChange={e => {
                const [startDate, endDate] = e.target.value.split('|');
                setForm(prev => ({ ...prev, _payPeriod: e.target.value, originalDate: startDate || prev.originalDate }));
              }}
            >
              <option value="">Select pay period...</option>
              {getPayPeriods().map(p => (
                <option key={p.startDate} value={`${p.startDate}|${p.endDate}`}>{p.label}</option>
              ))}
            </select>
          </div>

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
        <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName="timesheet-correction.pdf"
          disabled={generating}
          generatorType="timesheet-correction"
          formData={form}
        />
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
