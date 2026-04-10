'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

// RT-233: FAQ accordion item
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setOpen(v => !v)}>
        {q}
        <span style={{ fontSize: '12px', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>
      {open && <div className="accordion-body" style={{ maxHeight: '200px' }}><div className="accordion-content">{a}</div></div>}
    </div>
  );
}

export default function SupportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bugTitle, setBugTitle] = useState('');
  const [bugDesc, setBugDesc] = useState('');
  const [bugScreenshot, setBugScreenshot] = useState(null); // RT-231
  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [featurePriority, setFeaturePriority] = useState('nice-to-have'); // RT-232
  const [featureCategory, setFeatureCategory] = useState(''); // RT-232
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [featureSubmitting, setFeatureSubmitting] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);
  const [featureSuccess, setFeatureSuccess] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketPage, setTicketPage] = useState(1);
  const TICKETS_PER_PAGE = 10;

  useEffect(() => {
    fetch('/api/support')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(data => setTickets(data.tickets || []))
      .catch(e => { console.error('[support] Failed to load tickets:', e); });
  }, []);

  const submitTicket = async (type) => {
    const title = type === 'bug' ? bugTitle : featureTitle;
    const description = type === 'bug' ? bugDesc : featureDesc;
    if (!title.trim() || !description.trim()) return;

    type === 'bug' ? setBugSubmitting(true) : setFeatureSubmitting(true);

    try {
      const extra = type === 'feature' ? { priority: featurePriority, category: featureCategory } : {};
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, description, ...extra }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (data.success) {
        if (type === 'bug') {
          setBugTitle(''); setBugDesc(''); setBugSuccess(true);
          setTimeout(() => setBugSuccess(false), 3000);
        } else {
          setFeatureTitle(''); setFeatureDesc(''); setFeatureSuccess(true);
          setTimeout(() => setFeatureSuccess(false), 3000);
        }
        setTickets(prev => [...prev, data.ticket]);
        showToast('Submitted successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to submit. Please try again.', 'error');
    }

    type === 'bug' ? setBugSubmitting(false) : setFeatureSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Support</h1>
        <p className={styles.subtitle}>Report bugs or request new features. We read every submission.</p>
      </div>

      <div className={styles.grid}>
        {/* Bug Reports */}
        <div className={styles.card}>
          <div className={styles.cardIcon}>&#x1F41B;</div>
          <div className={styles.cardTitle}>Bug Report</div>
          <div className={styles.cardDesc}>Something not working right? Let us know what happened.</div>
          {bugSuccess && <div className={styles.success}>Bug report submitted. Thank you!</div>}
          <div className={styles.field}>
            <label className={styles.label}>What went wrong?</label>
            <input className={styles.input} value={bugTitle} onChange={e => setBugTitle(e.target.value)} placeholder="e.g. PDF download shows blank page" maxLength={200} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Steps to reproduce</label>
            <textarea className={styles.textarea} value={bugDesc} onChange={e => setBugDesc(e.target.value)} placeholder="Tell us what you were doing when it happened..." maxLength={1000} />
            <div style={{ fontSize: '11px', color: 'var(--gray-400)', textAlign: 'right', marginTop: '4px' }}>{bugDesc.length}/1000</div>
          </div>
          {/* RT-231: Optional screenshot upload */}
          <div className={styles.field}>
            <label className={styles.label}>Screenshot (optional)</label>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={e => setBugScreenshot(e.target.files[0] || null)}
            />
            {bugScreenshot && <div className={styles.fileSelected}>📎 {bugScreenshot.name}</div>}
          </div>
          <button className={`${styles.submitBtn} ${styles.bugBtn}`} onClick={() => submitTicket('bug')} disabled={bugSubmitting || !bugTitle.trim() || !bugDesc.trim()}>
            {bugSubmitting ? 'Submitting...' : 'Submit Bug Report'}
          </button>
        </div>

        {/* Feature Requests */}
        <div className={styles.card}>
          <div className={styles.cardIcon}>&#x1F4A1;</div>
          <div className={styles.cardTitle}>Feature Request</div>
          <div className={styles.cardDesc}>Have an idea that would make your life easier? Tell us.</div>
          {featureSuccess && <div className={styles.success}>Feature request submitted. Thank you!</div>}
          <div className={styles.field}>
            <label className={styles.label}>What do you need?</label>
            <input className={styles.input} value={featureTitle} onChange={e => setFeatureTitle(e.target.value)} maxLength={200} placeholder="e.g. Door hanger generator" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tell us more</label>
            <textarea className={styles.textarea} value={featureDesc} onChange={e => setFeatureDesc(e.target.value)} placeholder="Describe the tool or feature you'd like to see..." maxLength={1000} />
            <div style={{ fontSize: '11px', color: 'var(--gray-400)', textAlign: 'right', marginTop: '4px' }}>{featureDesc.length}/1000</div>
          </div>
          {/* RT-232: Priority + category selectors */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <select className={styles.select} value={featurePriority} onChange={e => setFeaturePriority(e.target.value)}>
                <option value="urgent">🔴 Urgent — blocking me</option>
                <option value="high">🟠 High — need soon</option>
                <option value="nice-to-have">🟢 Nice to have</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={featureCategory} onChange={e => setFeatureCategory(e.target.value)}>
                <option value="">Select...</option>
                <option value="generator">Generator / Form</option>
                <option value="pdf">PDF Output</option>
                <option value="catering">Catering</option>
                <option value="scheduling">Scheduling</option>
                <option value="reporting">Reports / Scoreboard</option>
                <option value="mobile">Mobile / iOS</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button className={`${styles.submitBtn} ${styles.featureBtn}`} onClick={() => submitTicket('feature')} disabled={featureSubmitting || !featureTitle.trim() || !featureDesc.trim()}>
            {featureSubmitting ? 'Submitting...' : 'Submit Feature Request'}
          </button>
        </div>
      </div>

      {/* Previous tickets */}
      {/* RT-233: FAQ Accordion */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '\'Playfair Display\', serif', fontSize: '20px', fontWeight: 800, color: 'var(--jm-blue)', marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div className="accordion">
          {[
            { q: 'How do I update my store info?', a: 'Go to Store Profile in the nav. All fields are editable. Your store info auto-fills into every generator once saved.' },
            { q: 'Why isn\'t my signature saving?', a: 'Signatures are captured client-side. If the signature pad isn\'t working, try using a stylus or your finger on mobile. On desktop, a mouse works fine.' },
            { q: 'Can I save documents to Google Drive?', a: 'Yes — connect Google Drive in your Store Profile under Connected Services. Then every generator shows a "Save to Drive" button.' },
            { q: 'How do e-signatures work?', a: 'Click "Send for Signature" on any HR document. The employee receives an email with a secure link. They sign on any device and you both get a PDF copy.' },
            { q: 'Who can access Admin features?', a: 'Administrators and District Managers can access Admin. Role requests must be approved by an existing admin. Contact chrisr@jmvalley.com for issues.' },
            { q: 'How do I report a bug?', a: 'Use the Bug Report form on this page. Include what you were doing and what went wrong. We\'ll investigate within 24 hours.' },
          ].map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
        {/* RT-234: Status page + RT-235: Contact */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
            System status:{' '}
            <span style={{ color: '#16a34a', fontWeight: 600 }}>● All systems operational</span>
          </span>
          <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
            Contact:{' '}
            <a href="mailto:chrisr@jmvalley.com" style={{ color: 'var(--jm-blue)', fontWeight: 600 }}>chrisr@jmvalley.com</a>
          </span>
        </div>
      </div>

      <div className={styles.ticketsSection}>
        <div className={styles.ticketsTitle}>Your Submissions</div>
        {tickets.length === 0 ? (
          <div className={styles.empty}>No submissions yet.</div>
        ) : (
          <>
            {tickets
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, ticketPage * TICKETS_PER_PAGE)
              .map(t => (
                <div key={t.id} className={styles.ticket}>
                  <div className={styles.ticketHeader}>
                    <span className={`${styles.ticketType} ${t.type === 'bug' ? styles.typeBug : styles.typeFeature}`}>
                      {t.type === 'bug' ? 'Bug' : 'Feature'}
                    </span>
                    <span className={styles.ticketTitle}>{t.title}</span>
                  </div>
                  <div className={styles.ticketDesc}>{t.description}</div>
                  <div className={styles.ticketDate}>{new Date(t.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            {tickets.length > ticketPage * TICKETS_PER_PAGE && (
              <button
                className={styles.loadMoreBtn}
                onClick={() => setTicketPage(p => p + 1)}
              >
                Load More ({tickets.length - ticketPage * TICKETS_PER_PAGE} remaining)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
