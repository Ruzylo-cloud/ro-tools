'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

export default function SupportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bugTitle, setBugTitle] = useState('');
  const [bugDesc, setBugDesc] = useState('');
  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [featureSubmitting, setFeatureSubmitting] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);
  const [featureSuccess, setFeatureSuccess] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketPage, setTicketPage] = useState(1);
  const TICKETS_PER_PAGE = 10;

  useEffect(() => {
    fetch('/api/support')
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []))
      .catch(() => {});
  }, []);

  const submitTicket = async (type) => {
    const title = type === 'bug' ? bugTitle : featureTitle;
    const description = type === 'bug' ? bugDesc : featureDesc;
    if (!title.trim() || !description.trim()) return;

    type === 'bug' ? setBugSubmitting(true) : setFeatureSubmitting(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, description }),
      });
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
            <input className={styles.input} value={bugTitle} onChange={e => setBugTitle(e.target.value)} placeholder="e.g. PDF download shows blank page" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Steps to reproduce</label>
            <textarea className={styles.textarea} value={bugDesc} onChange={e => setBugDesc(e.target.value)} placeholder="Tell us what you were doing when it happened..." />
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
            <input className={styles.input} value={featureTitle} onChange={e => setFeatureTitle(e.target.value)} placeholder="e.g. Door hanger generator" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tell us more</label>
            <textarea className={styles.textarea} value={featureDesc} onChange={e => setFeatureDesc(e.target.value)} placeholder="Describe the tool or feature you'd like to see..." />
          </div>
          <button className={`${styles.submitBtn} ${styles.featureBtn}`} onClick={() => submitTicket('feature')} disabled={featureSubmitting || !featureTitle.trim() || !featureDesc.trim()}>
            {featureSubmitting ? 'Submitting...' : 'Submit Feature Request'}
          </button>
        </div>
      </div>

      {/* Previous tickets */}
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
