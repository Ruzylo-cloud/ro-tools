'use client';

import Link from 'next/link';
import styles from './page.module.css';

const TOOLS = [
  { href: '/dashboard/flyer', icon: '\u{1F4CB}', title: 'Catering Flyer', desc: 'Print-ready catering flyers with store info, menu, and pricing.' },
  { href: '/dashboard/generators/catering-order', icon: '\u{1F4E6}', title: 'Catering Order Form', desc: 'Customer-facing order forms with menu, pricing, and delivery details.' },
  { href: '/dashboard/generators/written-warning', icon: '\u{1F4DD}', title: 'Written Warning', desc: 'Corrective action forms with uniform branding. Auto-fills store info.' },
  { href: '/dashboard/generators/evaluation', icon: '\u2B50', title: 'Performance Evaluation', desc: 'Employee evaluations with scoring rubric. Download as branded PDF.' },
  { href: '/dashboard/generators/timesheet-correction', icon: '\u23F0', title: 'Timesheet Correction', desc: 'Clock in/out correction forms for payroll adjustments.' },
  { href: '/dashboard/generators/attestation-correction', icon: '\u{1F4CB}', title: 'Attestation Correction', desc: 'Meal period and rest break attestation correction forms.' },
  { href: '/dashboard/generators/injury-report', icon: '\u{1F6D1}', title: 'Injury Report', desc: 'OSHA-compliant workplace injury forms. Auto-sends to HR on submission.' },
  { href: '/dashboard/generators/coaching-form', icon: '\u{1F4AC}', title: 'Employee Coaching', desc: 'Verbal coaching documentation. Precedes formal written warnings.' },
  { href: '/dashboard/documents', icon: '\u{1F4C4}', title: 'Training Documents', desc: 'Level 1-3 training packets and new hire onboarding checklists.' },
];

export default function GeneratorsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Generators</h1>
        <p className={styles.subtitle}>Select a tool to get started. Every document auto-fills your store info and downloads as a branded PDF.</p>
      </div>
      <div className={styles.grid}>
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href} className={styles.card}>
            <div className={styles.cardIcon}>{t.icon}</div>
            <h3 className={styles.cardTitle}>{t.title}</h3>
            <p className={styles.cardDesc}>{t.desc}</p>
            <div className={styles.cardAction}>Open Tool &rarr;</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
