'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import Orientation from '@/components/documents/Orientation';
import TrainingPacketLevel1 from '@/components/documents/TrainingPacketLevel1';
import TrainingPacketLevel2 from '@/components/documents/TrainingPacketLevel2';
import TrainingPacketLevel3 from '@/components/documents/TrainingPacketLevel3';
import TrainingPacketSlicer from '@/components/documents/TrainingPacketSlicer';
import TrainingPacketOpener from '@/components/documents/TrainingPacketOpener';
import TrainingPacketShiftLead from '@/components/documents/TrainingPacketShiftLead';
import NewHireChecklist from '@/components/documents/NewHireChecklist';
import SaveToDrive from '@/components/SaveToDrive';
import EmployeeSelect from '@/components/EmployeeSelect';
import { useFormDraft } from '@/lib/useFormDraft';
import { logActivity } from '@/lib/log-activity';
import styles from './page.module.css';

// RT-180: Knowledge check quizzes per training level
const QUIZ_DATA = {
  level1: {
    title: 'Level 1 Knowledge Check',
    questions: [
      { q: 'What is the correct bread-to-meat ratio for a standard 7.5" sub?', options: ['4 oz meat, 1/2 bread', '3 oz meat, full bread', 'Depends on the sub number', '2 oz meat per side'], answer: 2 },
      { q: 'Which sub uses provolone, ham, and cappacuolo?', options: ['#3 Ham & Provolone', '#2 Jersey Shore\'s Favorite', '#5 The Super Sub', '#4 The Number Four'], answer: 1 },
      { q: 'What does "Mike\'s Way" include?', options: ['Lettuce, tomato, mustard', 'Onions, lettuce, tomatoes, vinegar, oil, oregano & salt', 'Mayo, lettuce, tomato', 'Oil, vinegar, pickles'], answer: 1 },
      { q: 'What temperature should the cold prep area be kept at?', options: ['32°F', '38°F or below', '45°F', '50°F'], answer: 1 },
      { q: 'How often should gloves be changed when switching tasks?', options: ['Every 2 hours', 'Only if visibly dirty', 'Between every different food task', 'Once per shift'], answer: 2 },
    ],
  },
  level2: {
    title: 'Level 2 Knowledge Check',
    questions: [
      { q: 'What is the correct procedure when a register shows a discrepancy?', options: ['Ignore if under $1', 'Alert manager immediately', 'Correct it yourself', 'Close the drawer'], answer: 1 },
      { q: 'Which payment method requires a signature for amounts over $25?', options: ['Cash', 'Credit card', 'Debit card', 'None — all cards are tap-to-pay'], answer: 3 },
      { q: 'When should a manager\'s override be used?', options: ['For any void', 'Only for refunds over $10', 'When a customer complains', 'For all price adjustments and refunds'], answer: 3 },
      { q: 'The correct way to greet a customer at the counter is:', options: ['Hi, what do you want?', '"Welcome to Jersey Mike\'s, what can I get for you?"', 'Wave and wait for them to speak', 'Start making food immediately'], answer: 1 },
      { q: 'What is the maximum time a sub can sit before being discarded?', options: ['30 minutes', '1 hour', '2 hours', '4 hours'], answer: 2 },
    ],
  },
  level3: {
    title: 'Level 3 Knowledge Check',
    questions: [
      { q: 'What internal temperature must hot subs reach before serving?', options: ['145°F', '155°F', '165°F', '180°F'], answer: 2 },
      { q: 'Which hot sub is made with grilled chicken, peppers, and onions?', options: ['Chicken Philly', 'Big Kahuna', 'Chipotle Chicken Cheese', 'Chicken Caesar'], answer: 1 },
      { q: 'How long can a hot sub be held in the warming unit?', options: ['10 minutes', '15 minutes', '30 minutes', '1 hour'], answer: 1 },
      { q: 'What type of bread is required for the Philly Cheese Steak?', options: ['White', 'Wheat', 'Rosemary Parm', 'Any bread'], answer: 2 },
      { q: 'Proper hand washing after handling raw proteins requires:', options: ['5 seconds with soap', 'Hand sanitizer only', '20 seconds with soap and warm water', 'Glove change only'], answer: 2 },
    ],
  },
  orientation: {
    title: 'Orientation Knowledge Check',
    questions: [
      { q: 'Jersey Mike\'s was founded in what year?', options: ['1956', '1971', '1987', '2000'], answer: 0 },
      { q: 'What does JMVG stand for?', options: ['Jersey Mike\'s Valley Group', 'Jersey Mike\'s Ventura Group', 'Jersey Mike\'s Valley Gold', 'Jersey Mike\'s Venture Group'], answer: 0 },
      { q: 'Break policy: How long is a paid break for a 5-hour shift?', options: ['No paid break', '10 minutes', '15 minutes', '30 minutes'], answer: 2 },
      { q: 'Uniform policy requires:', options: ['Any clean shirt', 'Jersey Mike\'s branded shirt, cap required, non-slip shoes', 'Khaki pants only', 'Branded shirt, jeans OK'], answer: 1 },
      { q: 'Who should you contact first if you cannot make your shift?', options: ['Corporate HR', 'Your direct manager', 'A co-worker to cover', 'Call the store during closing'], answer: 1 },
    ],
  },
  slicer: {
    title: 'Slicer Certification Check',
    questions: [
      { q: 'Before using the slicer, you must:', options: ['Just put on gloves', 'Inspect blade, ensure guard is in place, put on cut-resistant gloves', 'Ask a manager to start it', 'Clean it first with water'], answer: 1 },
      { q: 'What is the OSHA-required minimum PPE when operating a meat slicer?', options: ['Standard food service gloves', 'Cut-resistant gloves only', 'Cut-resistant gloves + chain-mail apron', 'No specific requirement'], answer: 2 },
      { q: 'Slicer blades must be cleaned and sanitized:', options: ['At end of day only', 'Every 4 hours and when switching proteins', 'When visibly dirty', 'Once a week'], answer: 1 },
      { q: 'What is the correct slice thickness for roast beef (setting)?', options: ['1', '2-3', '5-6', '8-10'], answer: 1 },
      { q: 'After cleaning the slicer blade, you should:', options: ['Air dry', 'Re-sanitize with food-safe sanitizer then air dry', 'Towel dry immediately', 'Apply oil'], answer: 1 },
    ],
  },
};

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
  const { showToast } = useToast();
  const [docDraft, setDocDraft, clearDocDraft] = useFormDraft('documents', { selected: 'level1', employeeName: '', startDate: '', position: '', managerName: '' });

  const selected = (() => {
    if (typeof window !== 'undefined') {
      const t = new URLSearchParams(window.location.search).get('template');
      if (t && COMPONENT_MAP[t]) return t;
    }
    return docDraft.selected || 'level1';
  })();

  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const n = new URLSearchParams(window.location.search).get('name');
      if (n) return { employeeName: n };
    }
    return { employeeName: docDraft.employeeName || '', startDate: docDraft.startDate || '', position: docDraft.position || '', managerName: docDraft.managerName || '' };
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const mountedRef = useRef(true);
  const [storeInfo, setStoreInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0); // RT-172: progress indicator
  const [showPreview, setShowPreview] = useState(true); // RT-165: toggle preview
  // RT-164: Recently used templates
  const [recentTemplates, setRecentTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rt-recent-docs') || '[]'); } catch (e) { console.debug('[documents] recent docs read failed (non-fatal):', e); return []; }
  });
  // RT-178: Training progress tracking (employee → completed levels)
  const [trainingProgress, setTrainingProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rt-training-progress') || '{}'); } catch (e) { console.debug('[documents] training progress read failed (non-fatal):', e); return {}; }
  });
  // RT-179: Show certificate option after successful download
  const [lastDownload, setLastDownload] = useState(null);
  // RT-180: End quiz/assessment
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const docRef = useRef(null);
  // RT-148: Use a ref so the keyboard handler always calls the latest handleDownload (avoids stale closure)
  const handleDownloadRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
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

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleDownloadRef.current?.(); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setDocDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateChange = (id) => {
    setDocDraft(prev => ({ ...prev, selected: id }));
    setForm(prev => ({ employeeName: prev.employeeName || '', startDate: prev.startDate || '', position: prev.position || '', managerName: prev.managerName || '' }));
    // RT-164: Track recently used
    setRecentTemplates(prev => {
      const updated = [id, ...prev.filter(t => t !== id)].slice(0, 4);
      try { localStorage.setItem('rt-recent-docs', JSON.stringify(updated)); } catch (e) { console.debug('[documents] recent docs save failed (non-fatal):', e); }
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
      showToast('✓ PDF downloaded successfully!', 'success');
      if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
      // RT-178: Track training progress
      if (form.employeeName) {
        const key = form.employeeName.trim().toLowerCase();
        const updated = { ...trainingProgress, [key]: [...new Set([...(trainingProgress[key] || []), selected])] };
        setTrainingProgress(updated);
        try { localStorage.setItem('rt-training-progress', JSON.stringify(updated)); } catch (e) { console.debug('[documents] training progress save failed (non-fatal):', e); }
      }
      // RT-179: Track last download for certificate offer
      if (form.employeeName && selected !== 'newhire') {
        setLastDownload({ employeeName: form.employeeName, template: selected, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) });
      }
      // RT-180: Offer knowledge check quiz after training download
      if (QUIZ_DATA[selected] && form.employeeName) {
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(null);
        setTimeout(() => setShowQuiz(true), 1200);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    }
    setGenerating(false);
    setTimeout(() => setGenerateProgress(0), 1500);
  };
  // RT-148: Keep ref current so the keyboard handler always invokes the latest handleDownload
  handleDownloadRef.current = handleDownload;

  // RT-126/RT-165: Batch download — generates current template + opens each remaining in new tab
  const handleBatchDownload = () => {
    const empName = form.employeeName || '';
    if (!empName) { showToast('Enter an employee name first to download all packets.', 'warning'); return; }
    // Download current doc immediately
    handleDownload();
    // Open remaining templates in new tabs with pre-filled name
    TEMPLATES.filter(t => t.id !== selected && t.id !== 'newhire').forEach((t, i) => {
      setTimeout(() => {
        window.open(`${window.location.origin}/dashboard/documents?template=${t.id}&name=${encodeURIComponent(empName)}`, '_blank');
      }, (i + 1) * 800);
    });
  };

  // RT-168: Copy share/deep-link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard/documents?template=${selected}`;
    navigator.clipboard.writeText(url).catch(e => { console.debug('[documents] Clipboard copy failed:', e); });
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
        <p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading...</p>
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
              {key === 'employeeName' ? (
                <EmployeeSelect
                  value={form.employeeName || ''}
                  onChange={(name, emp) => {
                    handleChange('employeeName', name);
                    if (emp?.position) handleChange('position', emp.position);
                  }}
                  storeNumber={storeInfo.storeNumber}
                  placeholder="Search employees..."
                />
              ) : type === 'textarea' ? (
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
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', background: '#134A7C', borderRadius: 2, width: `${generateProgress}%`, transition: 'width 0.3s ease' }} />
          </div>
        )}

        <button
          className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`}
          onClick={handleDownload}
          disabled={generating}
          title="Ctrl+Enter to download"
        >
          {generating ? <><span className="gen-btn-spinner" />Generating PDF… {generateProgress}%</> : showSuccess ? '✓ Downloaded!' : 'Download PDF'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>

        {/* RT-177: Training packet navigation (prev / next) */}
        {(() => {
          const idx = TEMPLATES.findIndex(t => t.id === selected);
          return (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => idx > 0 && handleTemplateChange(TEMPLATES[idx - 1].id)}
                disabled={idx <= 0}
                style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 12, fontWeight: 600, color: idx <= 0 ? '#9ca3af' : '#374151', cursor: idx <= 0 ? 'not-allowed' : 'pointer' }}
              >
                ← {idx > 0 ? TEMPLATES[idx - 1].name : 'Previous'}
              </button>
              <button
                onClick={() => idx < TEMPLATES.length - 1 && handleTemplateChange(TEMPLATES[idx + 1].id)}
                disabled={idx >= TEMPLATES.length - 1}
                style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 12, fontWeight: 600, color: idx >= TEMPLATES.length - 1 ? '#9ca3af' : '#374151', cursor: idx >= TEMPLATES.length - 1 ? 'not-allowed' : 'pointer' }}
              >
                {idx < TEMPLATES.length - 1 ? TEMPLATES[idx + 1].name : 'Next'} →
              </button>
            </div>
          );
        })()}

        {/* RT-126/RT-165: Batch download all packets */}
        {form.employeeName && (
          <button
            onClick={handleBatchDownload}
            disabled={generating}
            style={{ width: '100%', marginTop: 8, padding: '10px', background: 'var(--white)', border: '1px solid #134A7C', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#134A7C', cursor: 'pointer' }}
          >
            📦 Download All Packets
          </button>
        )}

        {/* RT-169: Print + RT-168: Copy Link */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={handlePrint}
            disabled={generating}
            style={{ flex: 1, padding: '10px', background: 'var(--white)', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
          >
            🖨️ Print
          </button>
          <button
            onClick={handleCopyLink}
            style={{ flex: 1, padding: '10px', background: 'var(--white)', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
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
            style={{ padding: '4px 12px', background: 'var(--gray-100)', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
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

      {/* RT-180: Knowledge check quiz modal */}
      {showQuiz && QUIZ_DATA[selected] && (() => {
        const quiz = QUIZ_DATA[selected];
        const submitQuiz = () => {
          let score = 0;
          quiz.questions.forEach((q, i) => { if (quizAnswers[i] === q.answer) score++; });
          setQuizScore(score);
          setQuizSubmitted(true);
          // Save result to training progress
          const pct = Math.round((score / quiz.questions.length) * 100);
          const key = (form.employeeName || '').trim().toLowerCase();
          if (key && pct >= 80) {
            setTrainingProgress(prev => {
              const updated = { ...prev, [key]: [...new Set([...(prev[key] || []), selected + '-quiz'])] };
              try { localStorage.setItem('rt-training-progress', JSON.stringify(updated)); } catch (e) { console.debug('[documents] training progress save failed (non-fatal):', e); }
              return updated;
            });
          }
        };
        const pct = quizScore !== null ? Math.round((quizScore / quiz.questions.length) * 100) : 0;
        const passed = pct >= 80;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => !quizSubmitted && setShowQuiz(false)}>
            <div style={{ background: 'var(--white)', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px 24px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#134A7C' }}>{quiz.title}</div>
                  <button onClick={() => setShowQuiz(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--gray-500)', lineHeight: 1 }}>&times;</button>
                </div>
                {!quizSubmitted && (
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
                    Answer all {quiz.questions.length} questions. Score 80% or higher to pass.
                    {form.employeeName && <strong style={{ color: '#134A7C' }}> — {form.employeeName}</strong>}
                  </p>
                )}
              </div>
              <div style={{ padding: '20px 24px' }}>
                {quizSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ fontSize: 56, marginBottom: 8 }}>{passed ? '🎉' : '📝'}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: passed ? '#16a34a' : '#dc2626', marginBottom: 4 }}>
                      {quizScore}/{quiz.questions.length} &mdash; {pct}%
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: passed ? '#15803d' : '#b91c1c', marginBottom: 16 }}>
                      {passed ? 'Passed! Great job.' : 'Not quite — review the training material and try again.'}
                    </div>
                    {/* Show correct/incorrect breakdown */}
                    <div style={{ textAlign: 'left', marginBottom: 20 }}>
                      {quiz.questions.map((q, i) => {
                        const correct = quizAnswers[i] === q.answer;
                        return (
                          <div key={i} style={{ padding: '8px 12px', marginBottom: 6, borderRadius: 8, background: correct ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)', border: `1px solid ${correct ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}` }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: correct ? '#15803d' : '#dc2626' }}>{correct ? '✓' : '✗'} {q.q}</div>
                            {!correct && <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>Correct: {q.options[q.answer]}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      {!passed && (
                        <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null); }} style={{ padding: '10px 24px', background: '#134A7C', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Retake Quiz
                        </button>
                      )}
                      <button onClick={() => setShowQuiz(false)} style={{ padding: '10px 24px', background: passed ? '#16a34a' : '#f3f4f6', color: passed ? '#fff' : '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {passed ? 'Done' : 'Close'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {quiz.questions.map((q, i) => (
                      <div key={i} style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{i + 1}. {q.q}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {q.options.map((opt, j) => (
                            <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${quizAnswers[i] === j ? '#134A7C' : '#e5e7eb'}`, background: quizAnswers[i] === j ? 'rgba(19,74,124,0.06)' : 'var(--white)', cursor: 'pointer', fontSize: 13, fontWeight: quizAnswers[i] === j ? 600 : 400, color: 'var(--text)', transition: 'all 0.15s' }}>
                              <input type="radio" name={`q${i}`} value={j} checked={quizAnswers[i] === j} onChange={() => setQuizAnswers(prev => ({ ...prev, [i]: j }))} style={{ accentColor: '#134A7C' }} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < quiz.questions.length}
                      style={{ width: '100%', padding: '12px', background: Object.keys(quizAnswers).length < quiz.questions.length ? '#9ca3af' : '#134A7C', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: Object.keys(quizAnswers).length < quiz.questions.length ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                    >
                      Submit Quiz ({Object.keys(quizAnswers).length}/{quiz.questions.length} answered)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
