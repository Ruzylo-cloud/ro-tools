'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Orientation from '@/components/documents/Orientation';
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

// RT-185: Thumbnails — each template has an emoji + accent color for visual thumbnail
// RT-183: addedDate tracks when templates were added/updated for "New" notification
// RT-127: version field for template versioning
const TEMPLATES = [
  { id: 'orientation', name: 'Orientation', desc: 'Day 1 - Policies', icon: '🎯', color: '#134A7C', addedDate: '2025-01-01', version: '1.2' },
  { id: 'level1', name: 'Level 1 Training', desc: 'Sprinkle / Wrap', icon: '🥖', color: '#2563eb', addedDate: '2025-01-01', version: '1.3' },
  { id: 'level2', name: 'Level 2 Training', desc: 'Register / Wrap', icon: '🧾', color: '#0891b2', addedDate: '2025-01-01', version: '1.3' },
  { id: 'level3', name: 'Level 3 Training', desc: 'Hot Subs', icon: '🔥', color: '#dc2626', addedDate: '2025-01-01', version: '1.3' },
  { id: 'slicer', name: 'Slicer Training', desc: '4-Week Certification', icon: '🏆', color: '#d97706', addedDate: '2026-03-01', version: '2.0' },
  { id: 'opener', name: 'Opener Training', desc: 'Opening Shift', icon: '🌅', color: '#7c3aed', addedDate: '2026-03-01', version: '2.0' },
  { id: 'shiftlead', name: 'Shift Lead', desc: 'Leadership Program', icon: '⭐', color: '#059669', addedDate: '2026-03-01', version: '2.0' },
  { id: 'newhire', name: 'New Hire Checklist', desc: 'Manager Onboarding', icon: '📋', color: '#64748b', addedDate: '2025-06-01', version: '1.1' },
];

const TEMPLATE_FIELDS = {
  orientation: [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startDate', label: 'Start Date' },
  ],
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
  orientation: Orientation,
  level1: TrainingPacketLevel1,
  level2: TrainingPacketLevel2,
  level3: TrainingPacketLevel3,
  slicer: TrainingPacketSlicer,
  opener: TrainingPacketOpener,
  shiftlead: TrainingPacketShiftLead,
  newhire: NewHireChecklist,
};

const FILE_NAMES = {
  orientation: 'orientation-packet',
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
  const [generateProgress, setGenerateProgress] = useState(0); // RT-172: progress indicator
  const [showPreview, setShowPreview] = useState(true); // RT-165: toggle preview
  // RT-164: Recently used templates
  const [recentTemplates, setRecentTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rt-recent-docs') || '[]'); } catch { return []; }
  });
  // RT-178: Training progress tracking (employee → completed levels)
  const [trainingProgress, setTrainingProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rt-training-progress') || '{}'); } catch { return {}; }
  });
  // RT-179: Show certificate option after successful download
  const [lastDownload, setLastDownload] = useState(null);
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
    // RT-164: Track recently used
    setRecentTemplates(prev => {
      const updated = [id, ...prev.filter(t => t !== id)].slice(0, 4);
      try { localStorage.setItem('rt-recent-docs', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleDownload = async () => {
    if (!docRef.current) return;
    setGenerating(true);
    setGenerateProgress(10); // RT-172
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const pages = docRef.current.querySelectorAll('[data-pdf-page]');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

      if (pages.length > 0) {
        for (let i = 0; i < pages.length; i++) {
          setGenerateProgress(Math.round(20 + (i / pages.length) * 70)); // RT-172
          const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            logging: false,
            width: 612,
            height: 792,
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);
        }
      } else {
        const canvas = await html2canvas(docRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 612,
          height: 792,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 612, 792);
      }

      const empName = (form.employeeName || 'document').replace(/\s+/g, '-').toLowerCase();
      // RT-171: Include store name in filename
      const storePart = storeInfo.storeNumber ? `-store${storeInfo.storeNumber}` : '';
      const fileName = `${FILE_NAMES[selected]}-${empName}${storePart}.pdf`;
      setGenerateProgress(95); // RT-172
      pdf.save(fileName);
      setGenerateProgress(100);
      logActivity({ generatorType: selected === 'newhire' ? 'new-hire-checklist' : `training-${selected}`, action: 'download', formData: docData, filename: fileName });
      // RT-178: Track training progress
      if (form.employeeName) {
        const key = form.employeeName.trim().toLowerCase();
        const updated = { ...trainingProgress, [key]: [...new Set([...(trainingProgress[key] || []), selected])] };
        setTrainingProgress(updated);
        try { localStorage.setItem('rt-training-progress', JSON.stringify(updated)); } catch {}
      }
      // RT-179: Track last download for certificate offer
      if (form.employeeName && selected !== 'newhire') {
        setLastDownload({ employeeName: form.employeeName, template: selected, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) });
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
    setGenerating(false);
    setTimeout(() => setGenerateProgress(0), 1500);
  };

  // RT-168: Copy share/deep-link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard/documents?template=${selected}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  // RT-169: Print (open preview in print dialog)
  const handlePrint = () => {
    if (!docRef.current) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write('<html><head><title>Print</title><style>body{margin:0}@media print{body{margin:0}}</style></head><body>');
    w.document.write(docRef.current.innerHTML);
    w.document.write('</body></html>');
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
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

        {/* RT-164: Recently used templates */}
        {recentTemplates.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div className={styles.sectionLabel} style={{ marginBottom: 6 }}>Recent</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {recentTemplates.map(id => {
                const t = TEMPLATES.find(x => x.id === id);
                if (!t) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleTemplateChange(id)}
                    style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, background: selected === id ? '#134A7C' : '#f0f4f8', color: selected === id ? '#fff' : '#134A7C', border: '1px solid #d1d5db', borderRadius: 16, cursor: 'pointer' }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Template Selector */}
        <div className={styles.sectionLabel}>Select Template</div>
        <div className={styles.templateGrid}>
          {TEMPLATES.map(t => {
            const empKey = (form.employeeName || '').trim().toLowerCase();
            const isDone = empKey && trainingProgress[empKey]?.includes(t.id);
            // RT-183: "New" badge for recently added/updated templates (within 60 days)
            const isNew = t.addedDate && (Date.now() - new Date(t.addedDate).getTime()) < 60 * 86400000;
            return (
              <div
                key={t.id}
                className={`${styles.templateCard} ${selected === t.id ? styles.templateCardActive : ''}`}
                onClick={() => handleTemplateChange(t.id)}
                style={{ position: 'relative' }}
              >
                {/* RT-183: New badge */}
                {isNew && !isDone && (
                  <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 8, background: '#EE3227', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New</span>
                )}
                {/* RT-185: Visual thumbnail */}
                <div className={styles.templateThumb} style={{ background: selected === t.id ? 'rgba(255,255,255,0.15)' : `${t.color}18` }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                </div>
                <div className={styles.templateName}>{t.name}</div>
                <div className={styles.templateDesc}>{t.desc}</div>
                {/* RT-127: Version tag */}
                {t.version && <div style={{ fontSize: 9, fontWeight: 700, color: selected === t.id ? 'rgba(255,255,255,0.6)' : '#9ca3af', marginTop: 2 }}>v{t.version}</div>}
                {/* RT-178: Completed checkmark */}
                {isDone && <div className={styles.templateDone}>✓ Done</div>}
              </div>
            );
          })}
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

        {/* RT-172: Progress bar */}
        {generating && generateProgress > 0 && (
          <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', background: '#134A7C', borderRadius: 2, width: `${generateProgress}%`, transition: 'width 0.3s ease' }} />
          </div>
        )}

        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? `Generating PDF… ${generateProgress}%` : 'Download PDF'}
        </button>

        {/* RT-177: Training packet navigation (prev / next) */}
        {(() => {
          const idx = TEMPLATES.findIndex(t => t.id === selected);
          return (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => idx > 0 && handleTemplateChange(TEMPLATES[idx - 1].id)}
                disabled={idx <= 0}
                style={{ flex: 1, padding: '8px', background: '#f0f4f8', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 12, fontWeight: 600, color: idx <= 0 ? '#9ca3af' : '#374151', cursor: idx <= 0 ? 'not-allowed' : 'pointer' }}
              >
                ← {idx > 0 ? TEMPLATES[idx - 1].name : 'Previous'}
              </button>
              <button
                onClick={() => idx < TEMPLATES.length - 1 && handleTemplateChange(TEMPLATES[idx + 1].id)}
                disabled={idx >= TEMPLATES.length - 1}
                style={{ flex: 1, padding: '8px', background: '#f0f4f8', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 12, fontWeight: 600, color: idx >= TEMPLATES.length - 1 ? '#9ca3af' : '#374151', cursor: idx >= TEMPLATES.length - 1 ? 'not-allowed' : 'pointer' }}
              >
                {idx < TEMPLATES.length - 1 ? TEMPLATES[idx + 1].name : 'Next'} →
              </button>
            </div>
          );
        })()}

        {/* RT-169: Print + RT-168: Copy Link */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={handlePrint}
            disabled={generating}
            style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            🖨️ Print
          </button>
          <button
            onClick={handleCopyLink}
            style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            🔗 Copy Link
          </button>
        </div>

        <SaveToDrive
          getCanvasRef={() => docRef.current}
          fileName={`${FILE_NAMES[selected]}-${(form.employeeName || 'document').replace(/\s+/g, '-').toLowerCase()}`}
          disabled={generating}
          generatorType={selected === 'newhire' ? 'new-hire-checklist' : `training-${selected}`}
          formData={docData}
        />

        {/* RT-179: Completion certificate offer */}
        {lastDownload && lastDownload.template === selected && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#15803d', marginBottom: 6 }}>✓ Training downloaded!</div>
            <button
              onClick={async () => {
                const { jsPDF } = await import('jspdf');
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
                const W = 792, H = 612;
                // Background
                pdf.setFillColor(248, 250, 252);
                pdf.rect(0, 0, W, H, 'F');
                // Border
                pdf.setDrawColor(19, 74, 124);
                pdf.setLineWidth(3);
                pdf.rect(20, 20, W - 40, H - 40);
                pdf.setLineWidth(1);
                pdf.rect(28, 28, W - 56, H - 56);
                // Header
                pdf.setFontSize(11);
                pdf.setTextColor(19, 74, 124);
                pdf.setFont('helvetica', 'bold');
                pdf.text('JM VALLEY GROUP', W / 2, 80, { align: 'center' });
                pdf.setFontSize(28);
                pdf.text('Certificate of Completion', W / 2, 130, { align: 'center' });
                // Body
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(100, 100, 100);
                pdf.text('This certifies that', W / 2, 195, { align: 'center' });
                pdf.setFontSize(26);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(19, 74, 124);
                pdf.text(lastDownload.employeeName, W / 2, 240, { align: 'center' });
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(100, 100, 100);
                const tname = TEMPLATES.find(t => t.id === lastDownload.template)?.name || lastDownload.template;
                pdf.text(`has successfully completed the`, W / 2, 280, { align: 'center' });
                pdf.setFontSize(18);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(238, 50, 39);
                pdf.text(tname, W / 2, 315, { align: 'center' });
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Issued: ${lastDownload.date}`, W / 2, 370, { align: 'center' });
                // Signature line
                pdf.setDrawColor(180, 180, 180);
                pdf.line(220, 440, 380, 440);
                pdf.line(430, 440, 590, 440);
                pdf.setFontSize(10);
                pdf.text('Manager Signature', 300, 455, { align: 'center' });
                pdf.text('Date', 510, 455, { align: 'center' });
                pdf.save(`completion-certificate-${lastDownload.employeeName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
              }}
              style={{ width: '100%', padding: '8px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🏆 Download Completion Certificate
            </button>
          </div>
        )}
      </div>

      {/* RT-165: Preview panel with toggle */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
          <button
            onClick={() => setShowPreview(p => !p)}
            style={{ padding: '4px 12px', background: '#f0f4f8', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            {showPreview ? 'Hide' : 'Show'}
          </button>
        </div>
        {showPreview && (
          <div className={styles.previewContainer}>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet" />
            <DocComponent ref={docRef} data={docData} />
          </div>
        )}
        {/* Keep docRef accessible even when hidden */}
        {!showPreview && (
          <div style={{ display: 'none' }}>
            <DocComponent ref={docRef} data={docData} />
          </div>
        )}
      </div>
    </div>
  );
}
