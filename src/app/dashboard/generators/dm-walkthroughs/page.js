'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import DMWalkthroughPreview from '@/components/DMWalkthroughPreview';
import { logActivity } from '@/lib/log-activity';
import { useFormDraft } from '@/lib/useFormDraft';
import styles from './page.module.css';

const CATEGORIES = [
  'Exterior & Parking Lot', 'Lobby & Dining Area', 'Restrooms', 'Front Line',
  'Meat Case & Cold Side', 'Hot Side & Grill', 'Walk-In Cooler', 'Dry Storage',
  'Back of House', 'Employee Appearance', 'Customer Service', 'Food Safety & Temps',
  'Signage & Marketing', 'Overall Store Cleanliness',
];

export default function DMWalkthroughsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);
  const mountedRef = useRef(true);

  const [form, setForm, clearDraft] = useFormDraft('dm-walkthroughs', {
    storeNumber: '',
    storeName: '',
    inspectorName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    userEmail: '',
    scores: {},
    notes: {},
    actionItems: [],
  });

  const [newAction, setNewAction] = useState({ description: '', assignedTo: '', dueDate: '' });

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
            inspectorName: p.operatorName || user?.name || '',
            userEmail: p.email || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const setScore = (category, value) => {
    setForm(prev => ({ ...prev, scores: { ...prev.scores, [category]: value } }));
  };

  const setNote = (category, value) => {
    setForm(prev => ({ ...prev, notes: { ...prev.notes, [category]: value } }));
  };

  const addAction = () => {
    if (!newAction.description.trim()) return;
    setForm(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, { ...newAction, description: newAction.description.trim() }],
    }));
    setNewAction({ description: '', assignedTo: '', dueDate: '' });
  };

  const removeAction = (idx) => {
    setForm(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== idx),
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
      const slug = form.storeName ? form.storeName.replace(/\s+/g, '-').toLowerCase() : 'store';
      const fileName = `dm-walkthrough-${slug}-${form.inspectionDate || 'today'}.pdf`;
      pdf.save(fileName);
      logActivity({ generatorType: 'dm-walkthroughs', action: 'download', formData: form, filename: fileName });
      showToast('Walkthrough PDF downloaded!', 'success'); clearDraft();
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [form, showToast]);

  const totalScore = CATEGORIES.reduce((sum, c) => sum + (parseInt(form.scores[c]) || 0), 0);
  const maxScore = CATEGORIES.length * 10;
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const filledCount = CATEGORIES.filter(c => form.scores[c]).length;

  if (loading) {
    return <div className={styles.container}><p style={{ color: 'var(--gray-500)', padding: '48px' }}>Loading store info...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>DM Walk-Through</h2>
        <p className={styles.sidebarDesc}>
          District Manager store inspection. Score 14 categories (1-10), add notes and action items. Generates a branded evaluation report.
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Inspection Info</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Inspector (DM)</label>
              <input type="text" className={styles.input} value={form.inspectorName} onChange={(e) => setForm(prev => ({ ...prev, inspectorName: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Inspection Date</label>
              <input type="date" className={styles.input} value={form.inspectionDate} onChange={(e) => setForm(prev => ({ ...prev, inspectionDate: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Scores ({filledCount}/{CATEGORIES.length}) &mdash; {pct}%
          </h3>
          <div className={styles.fields}>
            {CATEGORIES.map(cat => (
              <div key={cat} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <label className={styles.label} style={{ marginBottom: 0 }}>{cat}</label>
                  {/* RT-099: Score slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="range"
                      min={1} max={10} step={1}
                      value={form.scores[cat] || 5}
                      onChange={(e) => setScore(cat, e.target.value)}
                      className={styles.scoreSlider}
                    />
                    <span className={styles.scoreValue} style={{
                      color: !form.scores[cat] ? 'var(--gray-400)' :
                        parseInt(form.scores[cat]) >= 8 ? '#16a34a' :
                        parseInt(form.scores[cat]) >= 5 ? '#d97706' : '#dc2626'
                    }}>
                      {form.scores[cat] || '—'}
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  className={styles.input}
                  value={form.notes[cat] || ''}
                  onChange={(e) => setNote(cat, e.target.value)}
                  placeholder="Notes..."
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Action Items ({form.actionItems.length})</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <input type="text" className={styles.input} value={newAction.description} onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))} placeholder="Action item description..." />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <input type="text" className={styles.input} value={newAction.assignedTo} onChange={(e) => setNewAction(prev => ({ ...prev, assignedTo: e.target.value }))} placeholder="Assigned to" style={{ fontSize: '12px' }} />
              </div>
              <div className={styles.field}>
                <input type="date" className={styles.input} value={newAction.dueDate} onChange={(e) => setNewAction(prev => ({ ...prev, dueDate: e.target.value }))} style={{ fontSize: '12px' }} />
              </div>
            </div>
            <button type="button" onClick={addAction} style={{
              padding: '6px 14px', background: '#EE3227', color: '#fff', border: 'none',
              borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Add Action Item
            </button>

            {form.actionItems.map((item, i) => (
              <div key={i} style={{
                padding: '6px 8px', background: '#fef2f2', borderLeft: '3px solid #EE3227',
                borderRadius: '0 4px 4px 0', display: 'flex', justifyContent: 'space-between', gap: '8px',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                  <strong>{i + 1}.</strong> {item.description}
                  {item.assignedTo && <span style={{ color: 'var(--gray-500)' }}> ({item.assignedTo})</span>}
                </div>
                <button type="button" onClick={() => removeAction(i)} style={{
                  background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px',
                }}>
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating...' : 'Download Evaluation PDF'}
        </button>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <DMWalkthroughPreview ref={previewRef} data={form} />
        </div>
      </div>
    </div>
  );
}
