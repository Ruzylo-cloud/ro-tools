'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import FlyerPreview from '@/components/FlyerPreview';
import SaveToDrive from '@/components/SaveToDrive';
import styles from './page.module.css';

const EDITABLE_FIELDS = [
  { key: 'street', label: 'Street Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'phone', label: 'Store Phone' },
  { key: 'operatorName', label: 'Operator Name' },
  { key: 'operatorPhone', label: 'Operator Phone' },
  { key: 'assistantName', label: 'Assistant Name' },
  { key: 'assistantTitle', label: 'Assistant Title' },
  { key: 'assistantPhone', label: 'Assistant Phone' },
];

export default function FlyerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const flyerRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setForm(data.profile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  const handleDownload = useCallback(async () => {
    if (!flyerRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(flyerRef.current, {
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
      pdf.save('catering-flyer.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      if (mountedRef.current) showToast('Failed to generate PDF. Please try again.', 'error');
    }
    if (mountedRef.current) setGenerating(false);
  }, [showToast]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: '#6b7280', padding: '48px' }}>Loading store info...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Flyer Details</h2>
        <p className={styles.sidebarDesc}>
          Pre-filled from your store profile. Edit here for one-off changes.
        </p>
        <div className={styles.fields}>
          {EDITABLE_FIELDS.map(({ key, label }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <input
                type="text"
                className={styles.input}
                value={form[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
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
          getCanvasRef={() => flyerRef.current}
          fileName="catering-flyer"
          disabled={generating}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
        </div>
        <div className={styles.previewContainer}>
          <FlyerPreview ref={flyerRef} data={form} />
        </div>
      </div>
    </div>
  );
}
