'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import OnboardingPacketPreview from '@/components/OnboardingPacketPreview';
import EmployeeSelect from '@/components/EmployeeSelect';
import { logActivity } from '@/lib/log-activity';
import styles from './page.module.css';

const DEFAULT_DOCUMENTS = [
  { name: 'W-4 Federal Tax Withholding', category: 'tax' },
  { name: 'DE-4 State Tax Withholding (California)', category: 'tax' },
  { name: 'I-9 Employment Eligibility', category: 'legal' },
  { name: 'Direct Deposit Authorization', category: 'payroll' },
  { name: 'Employee Handbook Acknowledgment', category: 'policy' },
  { name: 'At-Will Employment Agreement', category: 'legal' },
  { name: 'Confidentiality Agreement', category: 'legal' },
  { name: 'Anti-Harassment Policy Acknowledgment', category: 'policy' },
  { name: 'Food Handler Card Verification', category: 'certification' },
  { name: 'Uniform & Equipment Checklist', category: 'operations' },
  { name: 'Emergency Contact Form', category: 'personal' },
  { name: 'Photo ID Copy on File', category: 'legal' },
  { name: 'Meal Break Waiver (if applicable)', category: 'legal' },
  { name: 'Safety Training Acknowledgment', category: 'training' },
  { name: 'LMS Account Setup Confirmation', category: 'training' },
];

export default function OnboardingPacketsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm] = useState({
    employeeName: '',
    position: '',
    startDate: '',
    storeNumber: '',
    storeName: '',
    managerName: '',
    userEmail: '',
    documents: DEFAULT_DOCUMENTS,
    completedDocs: [],
    customDocs: [],
  });

  const [newCustomDoc, setNewCustomDoc] = useState('');

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
            managerName: p.operatorName || user?.name || '',
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

  const toggleDoc = (docName) => {
    setForm(prev => ({
      ...prev,
      completedDocs: prev.completedDocs.includes(docName)
        ? prev.completedDocs.filter(d => d !== docName)
        : [...prev.completedDocs, docName],
    }));
  };

  const addCustomDoc = () => {
    if (!newCustomDoc.trim()) return;
    setForm(prev => ({
      ...prev,
      customDocs: [...prev.customDocs, { name: newCustomDoc.trim(), category: 'operations' }],
    }));
    setNewCustomDoc('');
  };

  const removeCustomDoc = (idx) => {
    setForm(prev => ({
      ...prev,
      customDocs: prev.customDocs.filter((_, i) => i !== idx),
      completedDocs: prev.completedDocs.filter(d => d !== prev.customDocs[idx]?.name),
    }));
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
      const name = form.employeeName ? form.employeeName.replace(/\s+/g, '-').toLowerCase() : 'new-hire';
      const fileName = `onboarding-${name}.pdf`;
      pdf.save(fileName);

      if (form.employeeName) {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.employeeName,
            employeeId: form._employeeId || null,
            documentType: 'onboarding-packet',
            fileName,
            content: pdfBase64,
            metadata: { createdBy: form.managerName, storeNumber: form.storeNumber },
          }),
        }).catch(() => {});
      }

      logActivity({ generatorType: 'onboarding-packets', action: 'download', formData: { ...form, completedDocs: form.completedDocs }, filename: fileName });
      showToast('Onboarding packet PDF downloaded!', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  const allDocs = [...form.documents, ...form.customDocs.filter(d => d.name)];
  const completedCount = form.completedDocs.length;
  const totalCount = allDocs.length;

  if (loading) {
    return <div className={styles.container}><p style={{ color: '#6b7280', padding: '48px' }}>Loading store info...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Onboarding Packet</h2>
        <p className={styles.sidebarDesc}>
          Track new hire onboarding documents. Check off items as they are completed and generate a branded checklist PDF.
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>New Hire Info</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Employee Name</label>
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
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Position</label>
                <input type="text" className={styles.input} value={form.position} onChange={(e) => handleChange('position', e.target.value)} placeholder="Team Member" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Start Date</label>
                <input type="date" className={styles.input} value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Documents ({completedCount}/{totalCount})
          </h3>
          <div style={{ marginBottom: '8px', background: '#f3f4f6', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              width: `${totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%`,
              height: '100%', background: completedCount === totalCount ? '#16A34A' : '#134A7C',
              borderRadius: '4px', transition: 'width 0.3s',
            }} />
          </div>

          {allDocs.map((doc, i) => {
            const isChecked = form.completedDocs.includes(doc.name);
            const isCustom = i >= form.documents.length;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 0', borderBottom: '1px solid #f3f4f6',
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDoc(doc.name)}
                  style={{ accentColor: '#134A7C', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{
                  fontSize: '12px', color: isChecked ? '#16A34A' : '#2D2D2D',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  flex: 1,
                }}>
                  {doc.name}
                </span>
                {isCustom && (
                  <button type="button" onClick={() => removeCustomDoc(i - form.documents.length)} style={{
                    background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px',
                  }}>
                    &times;
                  </button>
                )}
              </div>
            );
          })}

          {/* Add custom doc */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            <input
              type="text"
              className={styles.input}
              value={newCustomDoc}
              onChange={(e) => setNewCustomDoc(e.target.value)}
              placeholder="Add custom document..."
              onKeyDown={(e) => { if (e.key === 'Enter') addCustomDoc(); }}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addCustomDoc} style={{
              padding: '8px 12px', background: '#134A7C', color: '#fff', border: 'none',
              borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              +
            </button>
          </div>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating...' : 'Download Onboarding PDF'}
        </button>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <OnboardingPacketPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
