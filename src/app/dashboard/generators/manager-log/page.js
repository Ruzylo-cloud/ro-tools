'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import ManagerLogPreview from '@/components/ManagerLogPreview';
import SaveToDrive from '@/components/SaveToDrive';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import { brandedFilename, capturePreviewToPdf } from '@/lib/form-utils';
import styles from './page.module.css';

const DEFAULT_BOARDS = [
  { name: 'General', key: 'general', entries: [] },
  { name: 'Injuries / Safety', key: 'injuries', entries: [] },
  { name: 'Maintenance', key: 'maintenance', entries: [] },
  { name: 'Cleaning', key: 'cleaning', entries: [] },
];

export default function ManagerLogPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewZoom, setPreviewZoom] = useState(100);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm, clearDraft] = useFormDraft('manager-log', {
    logDate: new Date().toISOString().split('T')[0],
    storeNumber: '',
    storeName: '',
    managerName: '',
    userEmail: '',
    boards: DEFAULT_BOARDS.map(b => ({ ...b, entries: [] })),
  });

  const [activeBoard, setActiveBoard] = useState(0);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
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

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setForm(prev => {
      const boards = [...prev.boards];
      boards[activeBoard] = {
        ...boards[activeBoard],
        entries: [...boards[activeBoard].entries, {
          content: newEntry.trim(),
          author: prev.managerName || 'Manager',
          time,
        }],
      };
      return { ...prev, boards };
    });
    setNewEntry('');
    setErrors((prev) => ({ ...prev, entries: null }));
  };

  const removeEntry = (boardIdx, entryIdx) => {
    setForm(prev => {
      const boards = [...prev.boards];
      boards[boardIdx] = {
        ...boards[boardIdx],
        entries: boards[boardIdx].entries.filter((_, i) => i !== entryIdx),
      };
      return { ...prev, boards };
    });
  };

  const handleDownload = useCallback(async () => {
    const totalEntries = form.boards.reduce((sum, board) => sum + board.entries.length, 0);
    if (totalEntries === 0) {
      setErrors({ entries: 'Add at least one log entry before generating the daily report.' });
      showToast('Add at least one log entry before generating the daily report.', 'error');
      return;
    }
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const pdf = await capturePreviewToPdf(previewRef.current);
      if (!mountedRef.current) return;
      const fileName = brandedFilename('ManagerLog', form.storeName || form.storeNumber || 'Store');
      pdf.save(fileName);
      logActivity({ generatorType: 'manager-log', action: 'download', formData: { ...form, boards: form.boards.map(b => ({ name: b.name, entryCount: b.entries.length })) }, filename: fileName });
      // Save admin copy to GCS
      try {
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        await fetch('/api/employees/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: null,
            documentType: 'manager-log',
            fileName: fileName,
            content: pdfBase64,
            metadata: { storeNumber: form.storeNumber || '', logDate: form.logDate || '' },
          }),
        });
      } catch (err) { console.error('Admin doc save failed:', err); }
      showToast('Manager log PDF downloaded!', 'success'); clearDraft(); if (mountedRef.current) { setShowSuccess(true); setTimeout(() => { if (mountedRef.current) setShowSuccess(false); }, 2000); }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  // RT-139: Keyboard shortcut Ctrl+Enter to download
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleDownload(); }
  }, [handleDownload]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p></div>;
  }

  const BOARD_COLORS = { general: 'var(--jm-blue)', injuries: '#DC2626', maintenance: '#EA580C', cleaning: '#16A34A' };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Manager Log</h2>
        <p className={styles.sidebarDesc}>
          Record daily store notes across boards: General, Injuries, Maintenance, and Cleaning. Print as a daily report.
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Log Info</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input type="date" className={styles.input} value={form.logDate} onChange={(e) => setForm(prev => ({ ...prev, logDate: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Board</h3>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {form.boards.map((board, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveBoard(i)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                  border: activeBoard === i ? `2px solid ${BOARD_COLORS[board.key]}` : '1px solid var(--border)',
                  background: activeBoard === i ? `${BOARD_COLORS[board.key]}10` : 'var(--white)',
                  color: activeBoard === i ? BOARD_COLORS[board.key] : 'var(--gray-500)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {board.name} ({board.entries.length})
              </button>
            ))}
          </div>

          {/* Entry input */}
          <div className={styles.field}>
            <label className={styles.label}>New Entry on {form.boards[activeBoard].name}</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Type a log entry..."
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) addEntry(); }}
              maxLength={500}
            />
            <div className={styles.charCount}>{(newEntry || '').length}/500</div>
            {errors.entries && <div style={{ color: 'var(--jm-red)', fontSize: '12px', marginTop: '3px' }}>{errors.entries}</div>}
          </div>
          <button
            type="button"
            onClick={addEntry}
            style={{
              marginTop: '8px', padding: '8px 16px', background: BOARD_COLORS[form.boards[activeBoard].key],
              color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Add Entry
          </button>

          {/* Existing entries for active board */}
          {form.boards[activeBoard].entries.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              {form.boards[activeBoard].entries.map((entry, i) => (
                <div key={i} style={{
                  padding: '6px 8px', borderLeft: `3px solid ${BOARD_COLORS[form.boards[activeBoard].key]}`,
                  marginBottom: '6px', background: 'var(--gray-50)', borderRadius: '0 4px 4px 0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.4 }}>{entry.content}</div>
                    <div style={{ fontSize: '10px', color: 'var(--gray-400)', marginTop: '2px' }}>{entry.time}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(activeBoard, i)}
                    aria-label={`Remove log entry ${i + 1} from ${form.boards[activeBoard].name}`}
                    style={{
                      background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer',
                      fontSize: '14px', padding: '0 4px', flexShrink: 0,
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={`${styles.downloadBtn}${showSuccess ? ' gen-download-success' : ''}`} onClick={handleDownload} disabled={generating} title="Ctrl+Enter to download">
          {generating ? <><span className="gen-btn-spinner" />Generating...</> : showSuccess ? '✓ Downloaded!' : 'Download Daily Log PDF'}
        </button>
        <p className="gen-keyboard-hint">Tip: Press Ctrl+Enter to generate</p>
        <button
          type="button"
          onClick={() => { if (confirm('Clear all fields and start over?')) { clearDraft(); window.location.reload(); } }}
          style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'none', border: 'none', fontSize: '12px', color: 'var(--gray-400)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↺ Start over
        </button>
        <SaveToDrive
          getCanvasRef={() => previewRef.current}
          fileName={brandedFilename('ManagerLog', form.storeName || form.storeNumber || 'Store')}
          disabled={generating}
          generatorType="manager-log"
          formData={form}
        />
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--gray-500)' }}>
            <button onClick={() => setPreviewZoom(z => Math.max(50, z - 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ minWidth: '36px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{previewZoom}%</span>
            <button onClick={() => setPreviewZoom(z => Math.min(150, z + 10))} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <button onClick={() => setPreviewZoom(100)} style={{ padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', fontSize: '11px' }}>Reset</button>
          </div>
        </div>
        <div className={styles.previewContainer} style={{ overflow: 'auto' }}>
          <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top left', width: `${10000 / previewZoom}%` }}>
            <ManagerLogPreview ref={previewRef} data={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
