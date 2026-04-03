'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

// Marketing calendar month->focus map for Overview tab
const MONTH_FOCUS = {
  'January': 'New Year Kickoff',
  'February': 'Super Bowl / Valentine\'s',
  'March': 'Spring Catering Push',
  'April': 'Medical Office Grassroots',
  'May': 'Graduation Season + Retreat',
  'June': 'Summer Launch',
  'July': '4th of July / Summer Peak',
  'August': 'Back to School',
  'September': 'Football Season Start',
  'October': 'Fall Promotions',
  'November': 'Holiday Prep',
  'December': 'Holiday Season',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SCORECARD_MONTHS = [
  'January 2026','February 2026','March 2026','April 2026','May 2026','June 2026',
  'July 2026','August 2026','September 2026','October 2026','November 2026','December 2026',
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

function isCurrentMonth(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function DirectivesPage() {
  const [tab, setTab] = useState('overview');
  const [expanded, setExpanded] = useState(DIRECTIVES[0]?.id || null);
  // RT-194: Search filter
  const [directiveSearch, setDirectiveSearch] = useState('');
  // RT-195: Category filter
  const [categoryFilter, setCategoryFilter] = useState('');
  // RT-198: Archive view (show vs. hide older items)
  const [showArchive, setShowArchive] = useState(false);
  // RT-199: Per-directive acknowledgment set
  const [readIds, setReadIds] = useState(new Set());

  // Outreach state
  const [outreachEntries, setOutreachEntries] = useState([]);
  const [outreachForm, setOutreachForm] = useState({
    business: '', contact: '', position: '', phone: '', materials: 'FSC & Menu', qty: '3', order: 'N', followUp: '',
  });
  const [outreachSaved, setOutreachSaved] = useState(false);

  // Scorecard state
  const [scorecard, setScorecard] = useState({});
  const [scorecardMonth, setScorecardMonth] = useState('April 2026');
  const [scorecardSaved, setScorecardSaved] = useState(false);
  // RT-196: Rich text directive editor
  const [showCreateDirective, setShowCreateDirective] = useState(false);
  const [draftDirective, setDraftDirective] = useState({ title: '', category: 'operations', body: '' });
  const [savedDrafts, setSavedDrafts] = useState(() => { try { return JSON.parse(localStorage.getItem('directive-drafts') || '[]'); } catch { return []; } });
  const richEditorRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('reading-outreach');
      if (stored) setOutreachEntries(JSON.parse(stored));
    } catch(e) {}
    try {
      const sc = localStorage.getItem('directives-scorecard');
      if (sc) setScorecard(JSON.parse(sc));
    } catch(e) {}
    // RT-199: Load read directive IDs
    try {
      const r = localStorage.getItem('directives-read');
      if (r) setReadIds(new Set(JSON.parse(r)));
    } catch(e) {}
  }, []);

  // RT-199: Toggle directive read status
  const toggleRead = (id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('directives-read', JSON.stringify([...next]));
      return next;
    });
  };

  // Helpers
  const saveOutreach = (entries) => {
    setOutreachEntries(entries);
    localStorage.setItem('reading-outreach', JSON.stringify(entries));
  };

  const addOutreachEntry = () => {
    if (!outreachForm.business.trim()) return;
    const entry = { ...outreachForm, id: Date.now(), addedAt: new Date().toISOString() };
    const updated = [...outreachEntries, entry];
    saveOutreach(updated);
    setOutreachForm({ business: '', contact: '', position: '', phone: '', materials: 'FSC & Menu', qty: '3', order: 'N', followUp: '' });
    setOutreachSaved(true);
    setTimeout(() => setOutreachSaved(false), 2000);
  };

  const removeOutreachEntry = (id) => {
    saveOutreach(outreachEntries.filter(e => e.id !== id));
  };

  const saveScorecardMonth = () => {
    const updated = { ...scorecard, [scorecardMonth]: { ...(scorecard[scorecardMonth] || {}), ...(scorecardMonthData) } };
    setScorecard(updated);
    localStorage.setItem('directives-scorecard', JSON.stringify(updated));
    setScorecardSaved(true);
    setTimeout(() => setScorecardSaved(false), 2000);
  };

  const scorecardMonthData = scorecard[scorecardMonth] || {};
  const updateScorecardField = (field, value) => {
    setScorecard(prev => ({
      ...prev,
      [scorecardMonth]: { ...(prev[scorecardMonth] || {}), [field]: value },
    }));
  };

  // Calendar: collect all date items from DIRECTIVES
  const allCalendarDates = [];
  DIRECTIVES.forEach(d => {
    d.sections.forEach(s => {
      if (s.type === 'dates') {
        s.items.forEach(item => {
          allCalendarDates.push({ ...item, source: d.title });
        });
      }
    });
  });
  // Add marketing calendar items (first of each month as synthetic dates)
  const calendarMonthDates = [
    { date: '2026-01-01', label: 'January Focus: New Year Kickoff', source: '2026 Marketing Calendar' },
    { date: '2026-02-01', label: 'February Focus: Super Bowl / Valentine\'s', source: '2026 Marketing Calendar' },
    { date: '2026-03-01', label: 'March Focus: Spring Catering Push', source: '2026 Marketing Calendar' },
    { date: '2026-04-01', label: 'April Focus: Medical Office Grassroots', source: '2026 Marketing Calendar' },
    { date: '2026-05-01', label: 'May Focus: Graduation Season + Retreat', source: '2026 Marketing Calendar' },
    { date: '2026-06-01', label: 'June Focus: Summer Launch', source: '2026 Marketing Calendar' },
    { date: '2026-07-01', label: 'July Focus: 4th of July / Summer Peak', source: '2026 Marketing Calendar' },
    { date: '2026-08-01', label: 'August Focus: Back to School', source: '2026 Marketing Calendar' },
    { date: '2026-09-01', label: 'September Focus: Football Season Start', source: '2026 Marketing Calendar' },
    { date: '2026-10-01', label: 'October Focus: Fall Promotions', source: '2026 Marketing Calendar' },
    { date: '2026-11-01', label: 'November Focus: Holiday Prep', source: '2026 Marketing Calendar' },
    { date: '2026-12-01', label: 'December Focus: Holiday Season', source: '2026 Marketing Calendar' },
  ];
  const allDates = [...allCalendarDates, ...calendarMonthDates].sort((a, b) => a.date.localeCompare(b.date));

  // RT-197: New directive notification (updated within 14 days)
  const isNewDirective = (dateStr) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    return new Date(dateStr + 'T00:00:00') >= cutoff;
  };
  const newDirectiveCount = DIRECTIVES.filter(d => d.status === 'active' && isNewDirective(d.updatedDate)).length;

  // Overview stats
  const activeCount = DIRECTIVES.filter(d => d.status === 'active').length;
  const now = new Date();
  const currentMonthName = MONTH_NAMES[now.getMonth()];
  const currentFocus = MONTH_FOCUS[currentMonthName] || '—';
  const futureDates = allCalendarDates.filter(d => !isPast(d.date)).sort((a, b) => a.date.localeCompare(b.date));
  const nextKeyDate = futureDates[0] || null;

  const renderSection = (section) => {
    if (section.type === 'highlight') {
      return (
        <div className={styles.highlightBlock}>
          <p>{section.content}</p>
        </div>
      );
    }

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

    if (section.type === 'list') {
      return (
        <div className={styles.sectionItems}>
          {section.items.map((item, i) => (
            <div key={i} className={styles.listItem}>{item}</div>
          ))}
        </div>
      );
    }

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

      {/* RT-197: New directives notification banner */}
      {newDirectiveCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(238,50,39,0.06)', border: '1px solid rgba(238,50,39,0.2)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13 }}>
          <span style={{ fontSize: 16 }}>🔔</span>
          <span style={{ fontWeight: 700, color: '#EE3227' }}>{newDirectiveCount} new {newDirectiveCount === 1 ? 'directive' : 'directives'}</span>
          <span style={{ color: '#4b5563' }}>updated in the last 14 days — review the Directives tab</span>
          {tab !== 'directives' && (
            <button onClick={() => setTab('directives')} style={{ marginLeft: 'auto', padding: '4px 12px', background: '#EE3227', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View</button>
          )}
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {['overview', 'directives', 'outreach', 'scorecard', 'calendar', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 8, border: 'none', background: tab === t ? '#134A7C' : 'transparent', color: tab === t ? '#fff' : 'var(--gray-500)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize', transition: 'background 0.15s, color 0.15s' }}>
            {t}
            {/* RT-197: Badge on Directives tab */}
            {t === 'directives' && newDirectiveCount > 0 && (
              <span style={{ background: '#EE3227', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 800, padding: '1px 5px', lineHeight: 1.4 }}>{newDirectiveCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {/* Active Directives card */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Active Directives</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#134A7C', lineHeight: 1, marginBottom: 6 }}>{activeCount}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>directives currently active</div>
            </div>

            {/* Current Focus card */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Current Focus</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#134A7C', lineHeight: 1.25, marginBottom: 6 }}>{currentFocus}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{currentMonthName} marketing focus</div>
            </div>

            {/* Next Key Date card */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Next Key Date</div>
              {nextKeyDate ? (
                <>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#134A7C', lineHeight: 1.25, marginBottom: 6 }}>{formatShortDate(nextKeyDate.date)}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.4 }}>{nextKeyDate.label}</div>
                </>
              ) : (
                <div style={{ fontSize: 14, color: 'var(--gray-500)' }}>No upcoming dates</div>
              )}
            </div>
          </div>

          {/* Quick summary of active directives */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
            <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: 16, fontWeight: 800, color: '#134A7C', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #EE3227' }}>Active Directives</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DIRECTIVES.filter(d => d.status === 'active').map(d => (
                <div key={d.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 10, borderLeft: '3px solid #134A7C' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{d.description}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', marginTop: 2 }}>Updated {formatDate(d.updatedDate)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── DIRECTIVES TAB ─── */}
      {tab === 'directives' && (
        <div className={styles.directivesList}>
          {/* RT-196: Rich text editor modal */}
          {showCreateDirective && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowCreateDirective(false)}>
              <div style={{ background: 'var(--white)', borderRadius: 16, width: '100%', maxWidth: 660, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#134A7C' }}>Create Directive</div>
                  <button onClick={() => setShowCreateDirective(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--gray-500)' }}>&times;</button>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</label>
                    <input value={draftDirective.title} onChange={e => setDraftDirective(d => ({ ...d, title: e.target.value }))} placeholder="Directive title..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                    <select value={draftDirective.category} onChange={e => setDraftDirective(d => ({ ...d, category: e.target.value }))} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--white)', cursor: 'pointer' }}>
                      <option value="operations">Operations</option>
                      <option value="marketing">Marketing</option>
                      <option value="calendar">Calendar</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                  {/* RT-196: Rich text toolbar */}
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Body</label>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: 2, padding: '6px 8px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                      {[
                        { cmd: 'bold', label: '<b>B</b>', title: 'Bold' },
                        { cmd: 'italic', label: '<i>I</i>', title: 'Italic' },
                        { cmd: 'underline', label: '<u>U</u>', title: 'Underline' },
                        { cmd: 'strikeThrough', label: '<s>S</s>', title: 'Strikethrough' },
                      ].map(({ cmd, label, title }) => (
                        <button key={cmd} title={title} onMouseDown={e => { e.preventDefault(); document.execCommand(cmd, false); richEditorRef.current?.focus(); }} style={{ padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--white)', cursor: 'pointer', fontSize: 13, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: label }} />
                      ))}
                      <div style={{ width: 1, background: 'var(--border)', margin: '2px 4px' }} />
                      {[
                        { cmd: 'insertUnorderedList', label: '• List', title: 'Bullet list' },
                        { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
                        { cmd: 'formatBlock', arg: 'H3', label: 'H3', title: 'Heading' },
                        { cmd: 'formatBlock', arg: 'P', label: 'P', title: 'Paragraph' },
                      ].map(({ cmd, arg, label, title }) => (
                        <button key={label} title={title} onMouseDown={e => { e.preventDefault(); document.execCommand(cmd, false, arg); richEditorRef.current?.focus(); }} style={{ padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--white)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{label}</button>
                      ))}
                      <div style={{ width: 1, background: 'var(--border)', margin: '2px 4px' }} />
                      <button title="Clear formatting" onMouseDown={e => { e.preventDefault(); document.execCommand('removeFormat', false); richEditorRef.current?.focus(); }} style={{ padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--white)', cursor: 'pointer', fontSize: 11, color: 'var(--gray-500)' }}>Clear</button>
                    </div>
                    <div
                      ref={richEditorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={e => setDraftDirective(d => ({ ...d, body: e.currentTarget.innerHTML }))}
                      style={{ minHeight: 180, padding: '12px 14px', fontSize: 14, lineHeight: 1.6, outline: 'none', color: 'var(--text)', fontFamily: 'inherit' }}
                      data-placeholder="Write the directive content here..."
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
                    <button onClick={() => {
                      if (!draftDirective.title.trim()) return;
                      const draft = { ...draftDirective, id: Date.now(), savedAt: new Date().toLocaleDateString() };
                      const updated = [draft, ...savedDrafts];
                      setSavedDrafts(updated);
                      try { localStorage.setItem('directive-drafts', JSON.stringify(updated)); } catch {}
                      setShowCreateDirective(false);
                      setDraftDirective({ title: '', category: 'operations', body: '' });
                    }} disabled={!draftDirective.title.trim()} style={{ padding: '10px 22px', background: draftDirective.title.trim() ? '#134A7C' : '#e5e7eb', color: draftDirective.title.trim() ? '#fff' : '#9ca3af', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: draftDirective.title.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                      Save Draft
                    </button>
                  </div>
                  {savedDrafts.length > 0 && (
                    <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Saved Drafts</div>
                      {savedDrafts.map(d => (
                        <div key={d.id} style={{ padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 8, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{d.title}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{d.category} · {d.savedAt}</div>
                          </div>
                          <button onClick={() => setSavedDrafts(prev => { const u = prev.filter(x => x.id !== d.id); try { localStorage.setItem('directive-drafts', JSON.stringify(u)); } catch {} return u; })} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>&times;</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* RT-194: Search, RT-195: Category filter, RT-198: Archive toggle */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-bar" style={{ flex: '1', minWidth: '200px' }}>
              <span className="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                type="text"
                placeholder="Search directives..."
                value={directiveSearch}
                onChange={e => setDirectiveSearch(e.target.value)}
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', background: 'var(--white)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="">All Categories</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
              <option value="calendar">Calendar</option>
            </select>
            {/* RT-198: Archive toggle */}
            <button
              onClick={() => setShowArchive(v => !v)}
              style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: showArchive ? 'var(--jm-blue)' : 'var(--white)', color: showArchive ? '#fff' : 'var(--gray-600)', cursor: 'pointer' }}
            >
              {showArchive ? '📁 Showing Archived' : '📁 Show Archived'}
            </button>
            {/* RT-200: Print */}
            <button
              onClick={() => window.print()}
              style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'none', cursor: 'pointer', color: 'var(--gray-600)' }}
            >
              🖨️ Print
            </button>
            {/* RT-196: Create directive with rich text editor */}
            <button
              onClick={() => { setDraftDirective({ title: '', category: 'operations', body: '' }); setShowCreateDirective(true); }}
              style={{ padding: '8px 14px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#134A7C', color: '#fff', cursor: 'pointer' }}
            >
              + New Directive
            </button>
          </div>
          {(() => {
            const filtered = DIRECTIVES.filter(d => {
              if (!showArchive && d.status !== 'active') return false;
              if (categoryFilter && d.category !== categoryFilter) return false;
              if (directiveSearch) {
                const q = directiveSearch.toLowerCase();
                return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
              }
              return true;
            });
            if (filtered.length === 0) {
              return <div className="empty-state"><div className="empty-title">No directives found</div><div className="empty-desc">Try adjusting your search or filters.</div></div>;
            }
            // RT-199: Compliance summary bar
            const activeCount = filtered.filter(d => d.status === 'active').length;
            const readCount = filtered.filter(d => d.status === 'active' && readIds.has(d.id)).length;
            const pct = activeCount > 0 ? Math.round((readCount / activeCount) * 100) : 0;

            return (
              <>
                {/* RT-199: Compliance header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '10px 16px', background: pct === 100 ? 'rgba(22,163,74,0.08)' : 'rgba(245,158,11,0.08)', borderRadius: 8, border: `1px solid ${pct === 100 ? 'rgba(22,163,74,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? '#166534' : '#92400e' }}>
                    {pct === 100 ? '✓ All directives acknowledged' : `${readCount}/${activeCount} directives acknowledged`}
                  </span>
                  <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : '#d97706', borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: pct === 100 ? '#166534' : '#92400e' }}>{pct}%</span>
                </div>
                {filtered.map((directive) => (
                <div key={directive.id} className={styles.directive}>
                  <button
                    className={`${styles.directiveHeader} ${expanded === directive.id ? styles.directiveHeaderActive : ''}`}
                    onClick={() => setExpanded(prev => prev === directive.id ? null : directive.id)}
                  >
                    <div className={styles.directiveHeaderLeft}>
                      <span className={`${styles.statusBadge} ${styles['status_' + directive.status]}`}>
                        {directive.status === 'active' ? 'Active' : 'Archived'}
                      </span>
                      {/* RT-197: New badge for recently updated directives */}
                      {isNewDirective(directive.updatedDate) && (
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#EE3227', color: '#fff', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.5px' }}>NEW</span>
                      )}
                      {/* RT-199: Read badge */}
                      {readIds.has(directive.id) && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(22,163,74,0.12)', color: '#166534', padding: '2px 7px', borderRadius: 4 }}>✓ Read</span>
                      )}
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
                      {/* RT-199: Mark as read button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleRead(directive.id); }}
                          style={{ padding: '7px 16px', borderRadius: 7, border: '1.5px solid', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', background: readIds.has(directive.id) ? 'rgba(22,163,74,0.1)' : 'transparent', borderColor: readIds.has(directive.id) ? '#16a34a' : 'var(--border)', color: readIds.has(directive.id) ? '#166534' : 'var(--gray-600)' }}
                        >
                          {readIds.has(directive.id) ? '✓ Marked as Read' : 'Mark as Read'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </>
            );
          })()}
        </div>
      )}

      {/* ─── OUTREACH TAB ─── */}
      {tab === 'outreach' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Form */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
            <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: 16, fontWeight: 800, color: '#134A7C', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #EE3227' }}>Log Business Visit</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Business Name *</label>
                <input value={outreachForm.business} onChange={e => setOutreachForm(f => ({ ...f, business: e.target.value }))} placeholder="e.g. Kaiser Permanente" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Contact Name</label>
                <input value={outreachForm.contact} onChange={e => setOutreachForm(f => ({ ...f, contact: e.target.value }))} placeholder="e.g. Jane Smith" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Position</label>
                <input value={outreachForm.position} onChange={e => setOutreachForm(f => ({ ...f, position: e.target.value }))} placeholder="e.g. Department Manager" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Phone / Email</label>
                <input value={outreachForm.phone} onChange={e => setOutreachForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. (805) 555-0100" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Materials Handed Out</label>
                <input value={outreachForm.materials} onChange={e => setOutreachForm(f => ({ ...f, materials: e.target.value }))} placeholder="e.g. FSC & Menu" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Quantity</label>
                <input value={outreachForm.qty} onChange={e => setOutreachForm(f => ({ ...f, qty: e.target.value }))} placeholder="3" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Order Placed?</label>
                <select value={outreachForm.order} onChange={e => setOutreachForm(f => ({ ...f, order: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--white)', boxSizing: 'border-box' }}>
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 5 }}>Follow-Up Date</label>
                <input type="date" value={outreachForm.followUp} onChange={e => setOutreachForm(f => ({ ...f, followUp: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={addOutreachEntry} disabled={!outreachForm.business.trim()} style={{ padding: '10px 22px', background: outreachForm.business.trim() ? '#134A7C' : '#e5e7eb', color: outreachForm.business.trim() ? '#fff' : '#9ca3af', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: outreachForm.business.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'background 0.15s' }}>Add Entry</button>
              {outreachSaved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Saved!</span>}
            </div>
          </div>

          {/* Table */}
          {outreachEntries.length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
              <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: 16, fontWeight: 800, color: '#134A7C', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #EE3227' }}>Outreach Log ({outreachEntries.length} entries)</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-50)' }}>
                      {['Business', 'Contact', 'Position', 'Phone/Email', 'Materials', 'Qty', 'Order?', 'Follow-Up', ''].map((h, i) => (
                        <th key={i} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.3px', fontSize: 10, borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outreachEntries.map((e) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', color: 'var(--text)', fontWeight: 600 }}>{e.business}</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{e.contact || '—'}</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{e.position || '—'}</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{e.phone || '—'}</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{e.materials}</td>
                        <td style={{ padding: '8px 10px', color: '#4b5563' }}>{e.qty}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ fontWeight: 700, color: e.order === 'Y' ? '#16a34a' : '#6b7280' }}>{e.order}</span>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#4b5563', whiteSpace: 'nowrap' }}>{e.followUp ? formatShortDate(e.followUp) : '—'}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <button onClick={() => removeOutreachEntry(e.id)} style={{ background: 'none', border: 'none', color: '#EE3227', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: '2px 6px' }}>x</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {outreachEntries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 14 }}>No outreach entries yet. Log your first business visit above.</div>
          )}
        </div>
      )}

      {/* ─── SCORECARD TAB ─── */}
      {tab === 'scorecard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
            <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: 16, fontWeight: 800, color: '#134A7C', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #EE3227' }}>Monthly Revenue Scorecard</div>

            {/* Month selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 6 }}>Month</label>
              <select value={scorecardMonth} onChange={e => setScorecardMonth(e.target.value)} style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'var(--white)', fontWeight: 600, color: '#134A7C' }}>
                {SCORECARD_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'upselling', label: '$ from Upselling', desc: 'Revenue from upselling focus items (Cali Club, Extra Bacon)', prefix: '$' },
                { key: 'marketing', label: '$ from Marketing Initiative', desc: 'Revenue from grassroots outreach and campaigns', prefix: '$' },
                { key: 'storeIdea', label: '$ from Store-Specific Idea', desc: 'Revenue from your own store-level creative marketing idea', prefix: '$' },
                { key: 'growthTarget', label: 'Growth % Target', desc: 'Default: 5% month-over-month growth target', prefix: '%', default: '5' },
                { key: 'growthActual', label: 'Actual Growth %', desc: 'Your actual growth vs. same month last year', prefix: '%' },
              ].map(field => {
                const val = (scorecard[scorecardMonth] || {})[field.key] || '';
                const isGrowthComparison = field.key === 'growthActual';
                const targetVal = parseFloat((scorecard[scorecardMonth] || {}).growthTarget || 5);
                const actualVal = parseFloat(val);
                let highlightColor = null;
                if (isGrowthComparison && val !== '') {
                  highlightColor = actualVal >= targetVal ? '#16a34a' : '#EE3227';
                }
                return (
                  <div key={field.key} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 16px', background: highlightColor ? (actualVal >= targetVal ? 'rgba(22,163,74,0.05)' : 'rgba(238,50,39,0.05)') : '#f9fafb', borderRadius: 10, borderLeft: `3px solid ${highlightColor || '#134A7C'}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{field.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{field.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {field.prefix === '$' && <span style={{ fontSize: 16, fontWeight: 700, color: '#9ca3af' }}>$</span>}
                      <input
                        type="number"
                        value={val || (field.key === 'growthTarget' ? (val === '' ? '' : val) : '')}
                        placeholder={field.key === 'growthTarget' ? '5' : '0'}
                        onChange={e => updateScorecardField(field.key, e.target.value)}
                        style={{ width: 90, padding: '8px 10px', border: `1px solid ${highlightColor || '#e5e7eb'}`, borderRadius: 8, fontSize: 14, fontWeight: 700, textAlign: 'right', color: highlightColor || '#2D2D2D', outline: 'none', fontFamily: 'inherit', background: 'var(--white)' }}
                      />
                      {field.prefix === '%' && <span style={{ fontSize: 14, fontWeight: 700, color: '#9ca3af' }}>%</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
              <button onClick={saveScorecardMonth} style={{ padding: '10px 22px', background: '#134A7C', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Save Scorecard</button>
              {scorecardSaved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Saved!</span>}
            </div>
          </div>

          {/* Saved months summary */}
          {Object.keys(scorecard).length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
              <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: 16, fontWeight: 800, color: '#134A7C', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #EE3227' }}>Saved Months</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(scorecard).filter(([, v]) => v && Object.keys(v).some(k => v[k] !== '' && v[k] !== undefined)).map(([month, data]) => {
                  const target = parseFloat(data.growthTarget || 5);
                  const actual = parseFloat(data.growthActual);
                  const hasGrowth = !isNaN(actual);
                  const met = hasGrowth && actual >= target;
                  return (
                    <div key={month} style={{ display: 'flex', gap: 16, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 10, alignItems: 'center', borderLeft: `3px solid ${hasGrowth ? (met ? '#16a34a' : '#EE3227') : '#134A7C'}` }}>
                      <div style={{ fontWeight: 700, color: '#134A7C', fontSize: 14, minWidth: 120 }}>{month}</div>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', flex: 1 }}>
                        {data.upselling && <span style={{ fontSize: 12, color: '#4b5563' }}>Upselling: <strong>${data.upselling}</strong></span>}
                        {data.marketing && <span style={{ fontSize: 12, color: '#4b5563' }}>Marketing: <strong>${data.marketing}</strong></span>}
                        {data.storeIdea && <span style={{ fontSize: 12, color: '#4b5563' }}>Store Idea: <strong>${data.storeIdea}</strong></span>}
                        {hasGrowth && <span style={{ fontSize: 12, fontWeight: 700, color: met ? '#16a34a' : '#EE3227' }}>Growth: {data.growthActual}% {met ? '(met target)' : `(target ${target}%)`}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── CALENDAR TAB ─── */}
      {tab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px' }}>
            <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: 16, fontWeight: 800, color: '#134A7C', marginBottom: 20, paddingBottom: 8, borderBottom: '2px solid #EE3227' }}>2026 Key Dates Timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {allDates.map((item, i) => {
                const past = isPast(item.date);
                const current = isCurrentMonth(item.date);
                const isCalendarMonth = item.source === '2026 Marketing Calendar';
                return (
                  <div key={i} style={{ display: 'flex', gap: 0, position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: current ? '#16a34a' : past ? '#d1d5db' : '#134A7C', border: `2px solid ${current ? '#16a34a' : past ? '#d1d5db' : '#134A7C'}`, marginTop: 14, flexShrink: 0, zIndex: 1 }} />
                      {i < allDates.length - 1 && <div style={{ width: 2, flex: 1, background: '#e5e7eb', minHeight: 8 }} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, padding: '10px 0 10px 10px', opacity: past ? 0.45 : 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: current ? '#16a34a' : past ? '#9ca3af' : '#134A7C', minWidth: 70, flexShrink: 0 }}>{formatShortDate(item.date)}</span>
                        <span style={{ fontSize: 13, color: past ? '#9ca3af' : '#2D2D2D', fontWeight: isCalendarMonth ? 400 : 500 }}>{item.label}</span>
                        {current && <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(22,163,74,0.12)', color: '#16a34a', padding: '2px 8px', borderRadius: 100 }}>THIS MONTH</span>}
                      </div>
                      {item.source && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{item.source}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── RT-145: HISTORY TAB ─── */}
      {tab === 'history' && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: '#134A7C', marginBottom: 16 }}>Communication History</h2>
          {readIds.size === 0 && outreachEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>No history yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Mark directives as read and log outreach visits to see your history here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Read directives */}
              {DIRECTIVES.filter(d => readIds.has(d.id)).map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderLeft: '4px solid #16a34a', borderRadius: 8 }}>
                  <span style={{ fontSize: 18 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{d.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>Directive acknowledged</div>
                  </div>
                  <span style={{ fontSize: 11, background: 'rgba(22,163,74,0.1)', color: '#166534', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>Read</span>
                </div>
              ))}
              {/* Outreach visits */}
              {outreachEntries.slice().reverse().map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderLeft: '4px solid #134A7C', borderRadius: 8 }}>
                  <span style={{ fontSize: 18 }}>🏢</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{e.business}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                      {e.contact && `${e.contact} · `}{e.materials} · {e.qty} qty
                    </div>
                  </div>
                  <span style={{ fontSize: 11, background: 'rgba(19,74,124,0.1)', color: '#134A7C', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>Outreach</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
