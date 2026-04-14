/**
 * Shared directive definitions used by both the web dashboard
 * (/dashboard/directives) and the /api/directives/static endpoint
 * that the iOS app hits to mirror the same content.
 *
 * Keep this file as the single source of truth — do NOT duplicate
 * the array into the page or another module.
 */
export const DIRECTIVES = [
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
          { text: 'Block out May 11-14 on your schedule for the retreat. Mark these as blackout dates in the store schedule.', priority: 'high' },
          { text: 'Put up Easter sign ASAP. Ask your DM if you would like to remain open for Easter.', priority: 'high' },
          { text: 'Review Ameena\'s delegation presentation. Which tasks can you delegate to your crew?', priority: 'medium' },
        ],
      },
      {
        title: 'Key Announcements',
        type: 'list',
        items: [
          'JMVG grew from 21 to 30 stores — welcome San Diego and Riverside teams (12 new family members)',
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
          { date: '2026-05-11', label: 'JMVG Retreat begins (May 11-14) — blackout on the store schedule' },
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

/**
 * Flattens a structured directive into the simple shape consumed
 * by the iOS Directive model ({ id, title, content, category,
 * publishedAt, expiresAt }). Sections are serialized as plain text
 * with blank lines between them.
 */
export function flattenDirective(d) {
  const parts = [];
  if (d.description) parts.push(d.description);
  for (const section of d.sections || []) {
    const heading = section.title ? `\n${section.title.toUpperCase()}` : '';
    if (heading) parts.push(heading);
    if (section.note) parts.push(`Note: ${section.note}`);
    switch (section.type) {
      case 'highlight':
        if (section.content) parts.push(section.content);
        break;
      case 'list':
        for (const item of section.items || []) parts.push(`• ${item}`);
        break;
      case 'actions':
        for (const item of section.items || []) {
          const prio = item.priority ? ` [${item.priority}]` : '';
          parts.push(`• ${item.text}${prio}`);
        }
        break;
      case 'dates':
        for (const item of section.items || []) parts.push(`• ${item.date} — ${item.label}`);
        break;
      case 'scorecard':
        for (const item of section.items || []) parts.push(`• ${item.label} — ${item.description}`);
        break;
      case 'months':
        for (const item of section.items || []) {
          parts.push(`${item.month} — ${item.focus}`);
          if (item.details) parts.push(`  ${item.details}`);
        }
        break;
      case 'table':
        if (section.headers) parts.push(section.headers.join(' | '));
        for (const row of section.rows || []) parts.push(row.join(' | '));
        break;
      default:
        if (section.content) parts.push(section.content);
    }
  }
  return {
    id: d.id,
    title: d.title,
    content: parts.join('\n').trim(),
    category: d.category ? d.category.charAt(0).toUpperCase() + d.category.slice(1) : 'General',
    publishedAt: d.updatedDate ? `${d.updatedDate}T00:00:00.000Z` : null,
    expiresAt: null,
  };
}
