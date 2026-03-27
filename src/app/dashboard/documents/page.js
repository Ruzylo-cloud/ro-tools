'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import TrainingPacketLevel1 from '@/components/documents/TrainingPacketLevel1';
import TrainingPacketLevel2 from '@/components/documents/TrainingPacketLevel2';
import TrainingPacketLevel3 from '@/components/documents/TrainingPacketLevel3';
import TrainingPacketSlicer from '@/components/documents/TrainingPacketSlicer';
import TrainingPacketOpener from '@/components/documents/TrainingPacketOpener';
import TrainingPacketShiftLead from '@/components/documents/TrainingPacketShiftLead';
import NewHireChecklist from '@/components/documents/NewHireChecklist';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import styles from './page.module.css';

const TEMPLATES = [
  { id: 'level1', name: 'Level 1 Training', desc: 'Sprinkle / Wrap', icon: '1' },
  { id: 'level2', name: 'Level 2 Training', desc: 'Register / Wrap', icon: '2' },
  { id: 'level3', name: 'Level 3 Training', desc: 'Hot Subs', icon: '3' },
  { id: 'slicer', name: 'Slicer Training', desc: '4-Week Certification', icon: 'S' },
  { id: 'opener', name: 'Opener Training', desc: 'Opening Shift', icon: 'O' },
  { id: 'shiftlead', name: 'Shift Lead', desc: 'Leadership Program', icon: 'L' },
  { id: 'newhire', name: 'New Hire Checklist', desc: 'Manager Onboarding', icon: '+' },
];

const TEMPLATE_FIELDS = {
  level1: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
  level2: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
  level3: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
  slicer: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
  opener: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
  shiftlead: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
  newhire: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'position', label: 'Position' },
    { key: 'managerName', label: 'Manager Name' },
  ],
};

const COMPONENT_MAP = {
  level1: TrainingPacketLevel1,
  level2: TrainingPacketLevel2,
  level3: TrainingPacketLevel3,
  slicer: TrainingPacketSlicer,
  opener: TrainingPacketOpener,
  shiftlead: TrainingPacketShiftLead,
  newhire: NewHireChecklist,
};

const FILE_NAMES = {
  level1: 'level-1-training-packet',
  level2: 'level-2-training-packet',
  level3: 'level-3-training-packet',
  slicer: 'slicer-training-packet',
  opener: 'opener-training-packet',
  shiftlead: 'shift-lead-training-packet',
  newhire: 'new-hire-checklist',
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('level1');
  const [form, setForm] = useState({});
  const [storeInfo, setStoreInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const docRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setStoreInfo({
            storeNumber: data.profile.storeNumber || '',
            storeName: data.profile.storeName || data.profile.city || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateChange = (id) => {
    setSelected(id);
    setForm({});
  };

  const handleDownload = async () => {
    if (!docRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(docRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 612,
        height: 792,
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);

      const empName = (form.employeeName || 'document').replace(/\s+/g, '-').toLowerCase();
      const fileName = `${FILE_NAMES[selected]}-${empName}.pdf`;
      pdf.save(fileName);
      logActivity({ generatorType: selected === 'newhire' ? 'new-hire-checklist' : `training-${selected}`, action: 'download', formData: docData, filename: fileName });
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
    setGenerating(false);
  };

  const DocComponent = COMPONENT_MAP[selected];
  const fields = TEMPLATE_FIELDS[selected] || [];
  const docData = { ...storeInfo, ...form };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: '#6b7280', padding: '48px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Documents</h2>
        <p className={styles.sidebarDesc}>
          Generate branded JMVG documents. Select a template, fill in the details, and download.
        </p>

        {/* Template Selector */}
        <div className={styles.sectionLabel}>Select Template</div>
        <div className={styles.templateGrid}>
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              className={`${styles.templateCard} ${selected === t.id ? styles.templateCardActive : ''}`}
              onClick={() => handleTemplateChange(t.id)}
            >
              <div className={styles.templateIcon}>{t.icon}</div>
              <div className={styles.templateName}>{t.name}</div>
              <div className={styles.templateDesc}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Fields */}
        <div className={styles.sectionLabel}>Details</div>
        <div className={styles.fields}>
          {fields.map(({ key, label, type, options }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  className={styles.textarea}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : type === 'select' ? (
                <select
                  className={styles.select}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  <option value="">Select...</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  className={styles.input}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>

        <SaveToDrive
          getCanvasRef={() => docRef.current}
          fileName={`${FILE_NAMES[selected]}-${(form.employeeName || 'document').replace(/\s+/g, '-').toLowerCase()}`}
          disabled={generating}
          generatorType={selected === 'newhire' ? 'new-hire-checklist' : `training-${selected}`}
          formData={docData}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet" />
          <DocComponent ref={docRef} data={docData} />
        </div>
      </div>
    </div>
  );
}
