'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import ManagerLogPreview from '@/components/ManagerLogPreview';
import { logActivity } from '@/lib/log-activity';
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
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm] = useState({
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
      const fileName = `manager-log-${form.logDate || 'today'}.pdf`;
      pdf.save(fileName);
      logActivity({ generatorType: 'manager-log', action: 'download', formData: { ...form, boards: form.boards.map(b => ({ name: b.name, entryCount: b.entries.length })) }, filename: fileName });
      showToast('Manager log PDF downloaded!', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p></div>;
  }

  const BOARD_COLORS = { general: '#134A7C', injuries: '#DC2626', maintenance: '#EA580C', cleaning: '#16A34A' };

  return (
    <div className={styles.container}>
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
            />
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
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>{entry.time}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(activeBoard, i)}
                    style={{
                      background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer',
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

        <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating...' : 'Download Daily Log PDF'}
        </button>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <ManagerLogPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
