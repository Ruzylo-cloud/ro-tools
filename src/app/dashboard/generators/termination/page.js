'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import TerminationPreview from '@/components/TerminationPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
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
          <input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} style={{ accentColor: '#134A7C' }} />
          <span style={{ textDecoration: checked.includes(item) ? 'line-through' : 'none', color: checked.includes(item) ? '#9ca3af' : '#374151' }}>{item}</span>
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
  const [form, setForm] = useState({
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
            userEmail: data.profile.email || '',
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
        }).catch(() => {});
      }

      logActivity({ generatorType: 'termination', action: 'download', formData: form, filename: fileName });
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

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
              }}
              onPositionFill={(pos) => handleChange('employeePosition', pos)}
              storeNumber={form.storeNumber}
              placeholder="Search employees..."
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
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Termination Reason</label>
            <textarea
              className={styles.textarea}
              value={form.terminationReason}
              onChange={(e) => handleChange('terminationReason', e.target.value)}
              placeholder="Detailed reason for termination..."
              rows={3}
            />
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
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Company Property Returned</label>
            {COMPANY_PROPERTY_ITEMS.map(item => (
              <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2D2D2D', cursor: 'pointer', padding: '2px 0' }}>
                <input
                  type="checkbox"
                  checked={form.companyPropertyReturned.includes(item)}
                  onChange={() => handlePropertyToggle(item)}
                  style={{ accentColor: '#134A7C' }}
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
          <div className={styles.field}>
            <label className={styles.label}>Witness Name</label>
            <input
              type="text"
              className={styles.input}
              value={form.witnessName}
              onChange={(e) => handleChange('witnessName', e.target.value)}
              placeholder="Witness full name"
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
        </div>
        <div className={styles.previewContainer}>
          <TerminationPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
