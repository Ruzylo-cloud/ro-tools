'use client';

import { useState } from 'react';
import styles from './page.module.css';

const DIRECTIVES = [
  {
    id: 'marketing-2026',
    title: 'Marketing Directive',
    category: 'marketing',
    status: 'active',
    updatedDate: '2026-03-25',
    description: 'Current marketing calendar, promotions, and campaign schedule for 2026.',
    sections: [
      {
        title: 'Q1 2026 — January through March',
        items: [
          { month: 'January', focus: 'New Year Kickoff', details: 'Sub of the Month launch, loyalty push, catering outreach to local businesses returning from holiday.' },
          { month: 'February', focus: 'Super Bowl / Valentine\'s', details: 'Game day catering push, special combo deals, social media blitz for Super Bowl Sunday orders.' },
          { month: 'March', focus: 'Spring Catering Push', details: 'March Madness promotions, corporate catering leave-behinds, fundraiser season begins.' },
        ],
      },
      {
        title: 'Q2 2026 — April through June',
        items: [
          { month: 'April', focus: 'Community Engagement', details: 'Earth Day initiatives, local school fundraiser partnerships, spring menu refresh.' },
          { month: 'May', focus: 'Graduation Season', details: 'Graduation party catering packages, group order promotions, social media graduation giveaways.' },
          { month: 'June', focus: 'Summer Launch', details: 'Summer sub specials, hiring push for summer staff, extended hours marketing.' },
        ],
      },
      {
        title: 'Q3 2026 — July through September',
        items: [
          { month: 'July', focus: '4th of July / Summer Peak', details: 'Independence Day catering, beach/park delivery marketing, loyalty rewards double points.' },
          { month: 'August', focus: 'Back to School', details: 'School lunch catering, teacher appreciation orders, after-school combo deals.' },
          { month: 'September', focus: 'Football Season Start', details: 'NFL kickoff catering push, tailgate party boxes, fantasy football league promotions.' },
        ],
      },
      {
        title: 'Q4 2026 — October through December',
        items: [
          { month: 'October', focus: 'Fall Promotions', details: 'Halloween community events, fall menu items, corporate catering holiday planning outreach.' },
          { month: 'November', focus: 'Holiday Prep', details: 'Thanksgiving week catering, Black Friday/Small Business Saturday deals, holiday party booking.' },
          { month: 'December', focus: 'Holiday Season', details: 'Holiday party catering packages, gift card promotions, year-end corporate catering blitz.' },
        ],
      },
    ],
  },
];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DirectivesPage() {
  const [expanded, setExpanded] = useState(DIRECTIVES[0]?.id || null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Directives</h1>
        <p className={styles.subtitle}>Current company directives, calendars, and operational guidelines.</p>
      </div>

      <div className={styles.directivesList}>
        {DIRECTIVES.map((directive) => (
          <div key={directive.id} className={styles.directive}>
            <button
              className={`${styles.directiveHeader} ${expanded === directive.id ? styles.directiveHeaderActive : ''}`}
              onClick={() => setExpanded(prev => prev === directive.id ? null : directive.id)}
            >
              <div className={styles.directiveHeaderLeft}>
                <span className={`${styles.statusBadge} ${styles['status_' + directive.status]}`}>
                  {directive.status === 'active' ? 'Active' : 'Archived'}
                </span>
                <div>
                  <div className={styles.directiveTitle}>{directive.title}</div>
                  <div className={styles.directiveDesc}>{directive.description}</div>
                </div>
              </div>
              <div className={styles.directiveHeaderRight}>
                <span className={styles.directiveDate}>Updated {formatDate(directive.updatedDate)}</span>
                <span className={`${styles.expandChevron} ${expanded === directive.id ? styles.expandChevronOpen : ''}`}>&#x25BE;</span>
              </div>
            </button>

            {expanded === directive.id && (
              <div className={styles.directiveBody}>
                {directive.sections.map((section) => (
                  <div key={section.title} className={styles.section}>
                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                    <div className={styles.sectionItems}>
                      {section.items.map((item) => (
                        <div key={item.month} className={styles.item}>
                          <div className={styles.itemMonth}>{item.month}</div>
                          <div className={styles.itemContent}>
                            <div className={styles.itemFocus}>{item.focus}</div>
                            <div className={styles.itemDetails}>{item.details}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
