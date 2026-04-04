'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import InjuryReportPreview from '@/components/InjuryReportPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import EmployeeSelect from '@/components/EmployeeSelect';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const INJURY_TYPES = [
  'Cut / Laceration',
  'Burn (Heat / Chemical)',
  'Slip / Trip / Fall',
  'Strain / Sprain',
  'Repetitive Motion',
  'Object Struck By / Against',
  'Equipment Related',
  'Other',
];

const LOCATIONS = [
  'Behind the line / Kitchen',
  'Walk-in cooler / Freezer',
  'Register / Front counter',
  'Lobby / Dining area',
  'Restroom',
  'Back office / Storage',
  'Parking lot / Exterior',
  'Other',
];

export default function InjuryReportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm, clearDraft] = useFormDraft('injury-report', {
    employeeName: '',
    position: '',
    storeNumber: '',
    storeName: '',
    dateOfIncident: '',
    timeOfIncident: '',
    locationOfIncident: '',
    injuryType: '',
    bodyPartAffected: '',
    description: '',
    witnessName: '',
    witnessPhone: '',
    firstAidGiven: false,
    firstAidDescription: '',
    medicalTreatment: false,
    medicalFacility: '',
    employeeLeftWork: false,
    returnToWorkDate: '',
    supervisorName: '',
    supervisorActions: '',
    preventiveMeasures: '',
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
            supervisorName: p.operatorName || '',
            userEmail: p.email || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (sent) setSent(false);
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
      const fileName = `injury-report-${name}.pdf`;
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
            documentType: 'injury-report',
            fileName: fileName,
            content: pdfBase64,
            metadata: {
              createdBy: form.supervisorName || form.managerName || '',
              storeNumber: form.storeNumber || '',
            },
          }),
        }).catch(() => {});
      }

      logActivity({ generatorType: 'injury-report', action: 'download', formData: form, filename: fileName });
      showToast('PDF downloaded successfully!', 'success'); clearDraft(); if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form.employeeName, showToast]);

  const handleSubmitToHR = useCallback(async () => {
    if (!form.employeeName || !form.description) {
      showToast('Please fill in at least the employee name and description before submitting.', 'error');
      return;
    }
    setSending(true);
    try {
      const formatDate = (d) => {
        if (!d) return 'N/A';
        const parts = d.split('-');
        return parts.length === 3 ? `${parts[1]}/${parts[2]}/${parts[0]}` : d;
      };

      const htmlBody = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#134A7C;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;font-size:18px;">Workplace Injury Report</h2>
            <p style="margin:4px 0 0;opacity:0.8;font-size:13px;">Submitted via RO Tools</p>
          </div>
          <div style="padding:20px 24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 0;font-weight:bold;width:160px;color:#134A7C;">Employee:</td><td>${form.employeeName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Position:</td><td>${form.position || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Store:</td><td>${form.storeNumber ? '#' + form.storeNumber + ' ' : ''}${form.storeName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Date of Incident:</td><td>${formatDate(form.dateOfIncident)}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Time:</td><td>${form.timeOfIncident || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Location:</td><td>${form.locationOfIncident || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Injury Type:</td><td>${form.injuryType || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;color:#134A7C;">Body Part:</td><td>${form.bodyPartAffected || 'N/A'}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:12px 0;">
            <h3 style="color:#134A7C;font-size:14px;margin:0 0 6px;">Description</h3>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#333;">${form.description.replace(/\n/g, '<br>')}</p>
            ${form.witnessName ? `<hr style="border:none;border-top:1px solid #eee;margin:12px 0;"><p style="font-size:13px;"><strong>Witness:</strong> ${form.witnessName}${form.witnessPhone ? ' | ' + form.witnessPhone : ''}</p>` : ''}
            <hr style="border:none;border-top:1px solid #eee;margin:12px 0;">
            <p style="font-size:13px;"><strong>First Aid Given:</strong> ${form.firstAidGiven ? 'Yes' : 'No'}${form.firstAidGiven && form.firstAidDescription ? ' — ' + form.firstAidDescription : ''}</p>
            <p style="font-size:13px;"><strong>Medical Treatment:</strong> ${form.medicalTreatment ? 'Yes' : 'No'}${form.medicalTreatment && form.medicalFacility ? ' — ' + form.medicalFacility : ''}</p>
            <p style="font-size:13px;"><strong>Employee Left Work:</strong> ${form.employeeLeftWork ? 'Yes' : 'No'}${form.employeeLeftWork && form.returnToWorkDate ? ' — Expected return: ' + formatDate(form.returnToWorkDate) : ''}</p>
            ${form.supervisorActions ? `<p style="font-size:13px;"><strong>Actions Taken:</strong> ${form.supervisorActions}</p>` : ''}
            ${form.preventiveMeasures ? `<p style="font-size:13px;"><strong>Preventive Measures:</strong> ${form.preventiveMeasures}</p>` : ''}
            <hr style="border:none;border-top:1px solid #eee;margin:12px 0;">
            <p style="font-size:11px;color:#999;">Submitted by ${user?.name || 'Unknown'} (${user?.email || 'N/A'}) on ${new Date().toLocaleString('en-US')}</p>
          </div>
        </div>
      `;

      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'bethany@jmvalley.com',
          subject: `Injury Report: ${form.employeeName} — ${form.storeName || 'Store'} — ${formatDate(form.dateOfIncident)}`,
          htmlBody,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSent(true);
        showToast('Injury report sent to HR (bethany@jmvalley.com)', 'success');
        logActivity({ generatorType: 'injury-report', action: 'email-send', formData: form, filename: `injury-report-${form.employeeName || 'employee'}.pdf` });
      } else {
        showToast(result.error || 'Failed to send email. You may need to sign out and back in to grant email permissions.', 'error');
      }
    } catch (err) {
      console.error('Email send error:', err);
      showToast('Failed to send email. Please try again.', 'error');
    }
    if (mountedRef.current) setSending(false);
  }, [form, user, showToast]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Injury Report</h2>
        <p className={styles.sidebarDesc}>
          Document workplace injuries per Cal/OSHA requirements. Submitting sends a copy to HR automatically.
        </p>

        {/* Employee Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Employee Information</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Employee Name *</label>
              <EmployeeSelect
                value={form.employeeName}
                onChange={(name, emp) => {
                  handleChange('employeeName', name);
                  if (emp && emp.id) handleChange('_employeeId', emp.id);
                }}
                onPositionFill={(pos) => handleChange('position', pos)}
                storeNumber={form.storeNumber}
                placeholder="Search employees..."
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Position</label>
              <input type="text" className={styles.input} value={form.position} onChange={(e) => handleChange('position', e.target.value)} placeholder="e.g. Team Member, Shift Lead" />
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Incident Details</h3>
          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Date of Incident</label>
                <input type="date" className={styles.input} value={form.dateOfIncident} onChange={(e) => handleChange('dateOfIncident', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Time</label>
                <input type="time" className={styles.input} value={form.timeOfIncident} onChange={(e) => handleChange('timeOfIncident', e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <select className={styles.select} value={form.locationOfIncident} onChange={(e) => handleChange('locationOfIncident', e.target.value)}>
                <option value="">Select location...</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Type of Injury</label>
              <select className={styles.select} value={form.injuryType} onChange={(e) => handleChange('injuryType', e.target.value)}>
                <option value="">Select type...</option>
                {INJURY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* RT-102: Body diagram — click to select body part */}
            <div className={styles.field}>
              <label className={styles.label}>Body Part Affected</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <svg viewBox="0 0 80 160" width="70" height="140" style={{ flexShrink: 0, cursor: 'pointer' }} aria-label="Body diagram - click to select body part">
                  {/* Head */}
                  <ellipse cx="40" cy="14" rx="11" ry="13" fill={form.bodyPartAffected === 'Head' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Head')} style={{ cursor: 'pointer' }} />
                  {/* Neck */}
                  <rect x="36" y="27" width="8" height="8" rx="2" fill={form.bodyPartAffected === 'Neck' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Neck')} style={{ cursor: 'pointer' }} />
                  {/* Torso */}
                  <rect x="25" y="35" width="30" height="38" rx="4" fill={form.bodyPartAffected === 'Chest / Back' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Chest / Back')} style={{ cursor: 'pointer' }} />
                  {/* Left arm */}
                  <rect x="10" y="36" width="13" height="32" rx="5" fill={form.bodyPartAffected === 'Left Arm' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Left Arm')} style={{ cursor: 'pointer' }} />
                  {/* Right arm */}
                  <rect x="57" y="36" width="13" height="32" rx="5" fill={form.bodyPartAffected === 'Right Arm' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Right Arm')} style={{ cursor: 'pointer' }} />
                  {/* Left hand */}
                  <ellipse cx="16" cy="76" rx="7" ry="5" fill={form.bodyPartAffected === 'Left Hand' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Left Hand')} style={{ cursor: 'pointer' }} />
                  {/* Right hand */}
                  <ellipse cx="64" cy="76" rx="7" ry="5" fill={form.bodyPartAffected === 'Right Hand' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Right Hand')} style={{ cursor: 'pointer' }} />
                  {/* Left leg */}
                  <rect x="26" y="73" width="13" height="46" rx="5" fill={form.bodyPartAffected === 'Left Leg' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Left Leg')} style={{ cursor: 'pointer' }} />
                  {/* Right leg */}
                  <rect x="41" y="73" width="13" height="46" rx="5" fill={form.bodyPartAffected === 'Right Leg' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Right Leg')} style={{ cursor: 'pointer' }} />
                  {/* Left foot */}
                  <ellipse cx="31" cy="125" rx="9" ry="5" fill={form.bodyPartAffected === 'Left Foot' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Left Foot')} style={{ cursor: 'pointer' }} />
                  {/* Right foot */}
                  <ellipse cx="49" cy="125" rx="9" ry="5" fill={form.bodyPartAffected === 'Right Foot' ? '#EE3227' : '#e5e7eb'} stroke="#9ca3af" strokeWidth="1" onClick={() => handleChange('bodyPartAffected', 'Right Foot')} style={{ cursor: 'pointer' }} />
                </svg>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>Click body part or type below</div>
                  <input type="text" className={styles.input} value={form.bodyPartAffected} onChange={(e) => handleChange('bodyPartAffected', e.target.value)} placeholder="e.g. Left hand, right ankle" />
                  {form.bodyPartAffected && (
                    <button onClick={() => handleChange('bodyPartAffected', '')} style={{ marginTop: 4, fontSize: 10, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear</button>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description of Incident *</label>
              <textarea className={styles.textarea} rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="What happened? Be specific about the sequence of events..." />
            </div>
          </div>
        </div>

        {/* Witnesses */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Witnesses</h3>
          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Witness Name</label>
                <input type="text" className={styles.input} value={form.witnessName} onChange={(e) => handleChange('witnessName', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Witness Phone</label>
                <input type="text" className={styles.input} value={form.witnessPhone} onChange={(e) => handleChange('witnessPhone', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Treatment */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Treatment & Response</h3>
          <div className={styles.fields}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.firstAidGiven} onChange={(e) => handleChange('firstAidGiven', e.target.checked)} />
              <span>First Aid Administered</span>
            </label>
            {form.firstAidGiven && (
              <div className={styles.field}>
                <label className={styles.label}>First Aid Description</label>
                <input type="text" className={styles.input} value={form.firstAidDescription} onChange={(e) => handleChange('firstAidDescription', e.target.value)} placeholder="What first aid was given?" />
              </div>
            )}
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.medicalTreatment} onChange={(e) => handleChange('medicalTreatment', e.target.checked)} />
              <span>Medical Treatment Sought</span>
            </label>
            {form.medicalTreatment && (
              <div className={styles.field}>
                <label className={styles.label}>Medical Facility</label>
                <input type="text" className={styles.input} value={form.medicalFacility} onChange={(e) => handleChange('medicalFacility', e.target.value)} placeholder="Hospital or clinic name" />
              </div>
            )}
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.employeeLeftWork} onChange={(e) => handleChange('employeeLeftWork', e.target.checked)} />
              <span>Employee Left Work</span>
            </label>
            {form.employeeLeftWork && (
              <div className={styles.field}>
                <label className={styles.label}>Expected Return to Work Date</label>
                <input type="date" className={styles.input} value={form.returnToWorkDate} onChange={(e) => handleChange('returnToWorkDate', e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* Supervisor */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Supervisor Response</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Supervisor Name</label>
              <input type="text" className={styles.input} value={form.supervisorName} onChange={(e) => handleChange('supervisorName', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Actions Taken</label>
              <textarea className={styles.textarea} rows={2} value={form.supervisorActions} onChange={(e) => handleChange('supervisorActions', e.target.value)} placeholder="What actions were taken immediately?" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Preventive Measures</label>
              <textarea className={styles.textarea} rows={2} value={form.preventiveMeasures} onChange={(e) => handleChange('preventiveMeasures', e.target.value)} placeholder="Steps to prevent recurrence..." />
            </div>
          </div>
        </div>

        <button className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`} onClick={handleDownload} disabled={generating} title="Ctrl+Enter to download">
          {generating ? <><span className="gen-btn-spinner" />Generating PDF...</> : showSuccess ? '✓ Downloaded!' : 'Download PDF'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>

        {sent ? (
          <div className={styles.sentBadge}>
            &#10003; Sent to HR (bethany@jmvalley.com)
          </div>
        ) : (
          <button className={styles.submitBtn} onClick={handleSubmitToHR} disabled={sending}>
            {sending ? 'Sending to HR...' : 'Submit to HR (bethany@jmvalley.com)'}
          </button>
        )}

        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName={`injury-report-${(form.employeeName || 'employee').replace(/\s+/g, '-').toLowerCase()}`}
          disabled={generating}
          generatorType="injury-report"
          formData={form}
        />
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <InjuryReportPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
