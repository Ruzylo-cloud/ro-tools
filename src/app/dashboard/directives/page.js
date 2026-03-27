'use client';

import { useState } from 'react';
import styles from './page.module.css';

const DIRECTIVES = [
  {
    id: 'monthly-directive-apr-2026',
    title: 'April 2026 — Monthly Marketing Directive',
    category: 'marketing',
    status: 'active',
    updatedDate: '2026-03-26',
    description: 'Grassroots marketing to medical offices. Fill out before marketing week.',
    sections: [
      {
        title: 'April Directive: Medical Office Outreach',
        content: 'Grassroots marketing to medical offices. Specifically ask for managers of each department. Hand out FSC & Menus. Target at least 3 locations. Track contacts and orders placed.',
        type: 'highlight',
      },
      {
        title: 'Marketing Outreach Tracker',
        type: 'table',
        note: 'Fill out BEFORE marketing week. Minimum 3 locations. Manager contact is required.',
        headers: ['#', 'Place', 'Contact Name', 'Position', 'Phone / Email', 'Handed Out', 'Qty', 'Order?'],
        rows: [
          ['1', '(Business name)', '(Name)', 'Manager', '(Phone / Email)', 'FSC & Menu', '3', 'Y/N'],
          ['2', '(Business name)', '(Name)', 'Manager', '(Phone / Email)', 'FSC & Menu', '3', 'Y/N'],
          ['3', '(Business name)', '(Name)', 'Manager', '(Phone / Email)', 'FSC & Menu', '3', 'Y/N'],
        ],
      },
      {
        title: 'JMVG Scorecard — End of Month',
        type: 'scorecard',
        note: 'Fill out at the END of the month.',
        items: [
          { label: '$ Added from Upselling', description: 'Track revenue from upselling focus items (Cali Club, Extra Bacon)' },
          { label: '$ Added from Marketing Initiative', description: 'Revenue attributed to grassroots outreach and marketing campaigns' },
          { label: '$ Added from Store-Specific Idea', description: 'Revenue from your own store-level creative marketing idea' },
          { label: 'Growth % Target', description: '5% month-over-month growth target' },
          { label: 'Actual Growth %', description: 'Your actual growth vs. same month last year' },
        ],
      },
      {
        title: '2026 Upselling Focus Items',
        type: 'list',
        items: [
          'Cali Club — featured upsell item',
          'Extra Bacon — add-on upsell push',
        ],
      },
    ],
  },
  {
    id: 'ro-meeting-mar-2026',
    title: 'ALL RO Meeting Recap — March 18, 2026',
    category: 'operations',
    status: 'active',
    updatedDate: '2026-03-22',
    description: 'Action items and key announcements from the latest all-RO meeting.',
    sections: [
      {
        title: 'Action Items',
        type: 'actions',
        items: [
          { text: 'Fill out the new JMVG Sales Growth Scorecard before marketing week and at the end of the month.', priority: 'high' },
          { text: 'All Shift Leads, AROs, ROs and DMs MUST attend Shift Lead Zoom on 3/26 from 8-10am.', priority: 'high' },
          { text: 'Select an accountability partner to help you improve your hard and soft skills. Cannot be someone that reports to you. Share your self assessment with them.', priority: 'medium' },
          { text: 'Block out May 11-14 on your schedule for the retreat. Make these black out dates on Homebase.', priority: 'high' },
          { text: 'Put up Easter sign ASAP. Ask your DM if you would like to remain open for Easter.', priority: 'high' },
          { text: 'Review Ameena\'s delegation presentation. Which tasks can you delegate to your crew?', priority: 'medium' },
        ],
      },
      {
        title: 'Key Announcements',
        type: 'list',
        items: [
          'JMVG grew from 21 to 29 stores — welcome San Diego and Riverside teams (11 new family members)',
          'New team members: Nick, Josh, Samantha, Thom, Eddie, Sebastian, Ben, Gabby, Natasya, Sabrina, Bryan',
          'February marketing outreach results reviewed',
          'Soft Skills vs Hard Skills training discussion',
          'The Power of Delegation presentation by Ameena',
          'SD Team: see attached upselling doc from meeting email',
        ],
      },
      {
        title: 'Development Updates',
        type: 'list',
        items: [
          'Buellton update',
          'NorCal expansion',
          'Riverside / San Diego integration',
          'Oxnard development',
          'Lompoc development',
        ],
      },
      {
        title: 'Key Dates',
        type: 'dates',
        items: [
          { date: '2026-03-26', label: 'Shift Lead Training Zoom (8-10am)' },
          { date: '2026-04-05', label: 'Easter — post signage ASAP, confirm hours with DM' },
          { date: '2026-04-29', label: 'Next ALL RO Meeting' },
          { date: '2026-05-11', label: 'JMVG Retreat begins (May 11-14) — blackout on Homebase' },
        ],
      },
    ],
  },
  {
    id: 'marketing-2026',
    title: '2026 Marketing Calendar',
    category: 'marketing',
    status: 'active',
    updatedDate: '2026-03-25',
    description: 'Year-round marketing focus areas, promotions, and campaign schedule.',
    sections: [
      {
        title: 'Q1 2026 — January through March',
        type: 'months',
        items: [
          { month: 'January', focus: 'New Year Kickoff', details: 'Sub of the Month launch, loyalty push, catering outreach to local businesses returning from holiday.' },
          { month: 'February', focus: 'Super Bowl / Valentine\'s', details: 'Game day catering push, special combo deals, social media blitz for Super Bowl Sunday orders. Marketing outreach results tracked.' },
          { month: 'March', focus: 'Spring Catering Push', details: 'March Madness promotions, corporate catering leave-behinds, fundraiser season begins. Shift Lead training zoom. Easter signage goes up.' },
        ],
      },
      {
        title: 'Q2 2026 — April through June',
        type: 'months',
        items: [
          { month: 'April', focus: 'Medical Office Grassroots', details: 'Grassroots marketing to medical offices — target department managers. FSC & Menu distribution. Easter hours. JMVG Retreat May 11-14 blackout prep.' },
          { month: 'May', focus: 'Graduation Season + Retreat', details: 'Graduation party catering packages, group order promotions. JMVG Retreat May 11-14. Social media graduation giveaways.' },
          { month: 'June', focus: 'Summer Launch', details: 'Summer sub specials, hiring push for summer staff, extended hours marketing.' },
        ],
      },
      {
        title: 'Q3 2026 — July through September',
        type: 'months',
        items: [
          { month: 'July', focus: '4th of July / Summer Peak', details: 'Independence Day catering, beach/park delivery marketing, loyalty rewards double points.' },
          { month: 'August', focus: 'Back to School', details: 'School lunch catering, teacher appreciation orders, after-school combo deals.' },
          { month: 'September', focus: 'Football Season Start', details: 'NFL kickoff catering push, tailgate party boxes, fantasy football league promotions.' },
        ],
      },
      {
        title: 'Q4 2026 — October through December',
        type: 'months',
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

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isPast(dateStr) {
  return new Date(dateStr + 'T23:59:59') < new Date();
}

export default function DirectivesPage() {
  const [expanded, setExpanded] = useState(DIRECTIVES[0]?.id || null);

  const renderSection = (section) => {
    // Highlight block
    if (section.type === 'highlight') {
      return (
        <div className={styles.highlightBlock}>
          <p>{section.content}</p>
        </div>
      );
    }

    // Table
    if (section.type === 'table') {
      return (
        <div className={styles.tableSection}>
          {section.note && <p className={styles.sectionNote}>{section.note}</p>}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{section.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {section.rows.map((row, ri) => (
                  <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Scorecard
    if (section.type === 'scorecard') {
      return (
        <div className={styles.scorecardSection}>
          {section.note && <p className={styles.sectionNote}>{section.note}</p>}
          <div className={styles.scorecardItems}>
            {section.items.map((item, i) => (
              <div key={i} className={styles.scorecardItem}>
                <div className={styles.scorecardLabel}>{item.label}</div>
                <div className={styles.scorecardDesc}>{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Action items
    if (section.type === 'actions') {
      return (
        <div className={styles.sectionItems}>
          {section.items.map((item, i) => (
            <div key={i} className={`${styles.actionItem} ${styles['priority_' + item.priority]}`}>
              <span className={styles.actionPriority}>
                {item.priority === 'high' ? '!' : '\u2022'}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      );
    }

    // Dates
    if (section.type === 'dates') {
      return (
        <div className={styles.datesList}>
          {section.items.map((item, i) => (
            <div key={i} className={`${styles.dateItem} ${isPast(item.date) ? styles.datePast : ''}`}>
              <span className={styles.dateValue}>{formatShortDate(item.date)}</span>
              <span className={styles.dateLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      );
    }

    // Simple list
    if (section.type === 'list') {
      return (
        <div className={styles.sectionItems}>
          {section.items.map((item, i) => (
            <div key={i} className={styles.listItem}>{item}</div>
          ))}
        </div>
      );
    }

    // Month items (marketing calendar)
    if (section.type === 'months') {
      return (
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
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Marketing Directives</h1>
        <p className={styles.subtitle}>Monthly marketing directives, action items, and campaign calendar for JMVG.</p>
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
                    {renderSection(section)}
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
