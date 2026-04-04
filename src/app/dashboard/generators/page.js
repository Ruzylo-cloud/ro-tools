'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

// RT-069: Custom SVG icons (stroke-based, consistent across platforms)
const ICONS = {
  '📝': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  '⭐': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  '💬': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  '📤': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="12 12 12 18"/><polyline points="9 15 12 18 15 15"/></svg>,
  '🛑': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  '🚑': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  '🔧': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  '📓': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  '🔍': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  '📋': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  '📄': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  '🏷️': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  '📦': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  '📊': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  '⏰': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  '🍽️': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  '👤': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  '⚙️': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  '🥪': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  '⚖️': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 9l9-7 9 7"/><path d="M6 12H3l3 6s1 2 3 2"/><path d="M18 12h3l-3 6s-1 2-3 2"/></svg>,
};

function GenIcon({ emoji, size = 24, color = 'currentColor' }) {
  const svg = ICONS[emoji];
  if (!svg) return <span style={{ fontSize: size * 0.8 }}>{emoji}</span>;
  return (
    <span style={{ display: 'inline-flex', width: size, height: size, color, flexShrink: 0 }}>
      {svg}
    </span>
  );
}

// RT-057: Generators that require e-sign
const ESIGN_TOOLS = new Set([
  '/dashboard/generators/written-warning',
  '/dashboard/generators/evaluation',
  '/dashboard/generators/resignation',
  '/dashboard/generators/termination',
  '/dashboard/generators/meal-break-waiver',
  '/dashboard/generators/attestation-correction',
  '/dashboard/generators/onboarding-packets',
]);

// RT-038: Grouped by category
const CATEGORIES = [
  {
    id: 'hr',
    label: 'HR Documents',
    icon: '👤',
    tools: [
      { href: '/dashboard/generators/written-warning', icon: '📝', title: 'Written Warning', desc: 'Corrective action forms with uniform branding. Auto-fills store info.', isNew: false },
      { href: '/dashboard/generators/evaluation', icon: '⭐', title: 'Performance Evaluation', desc: 'Employee evaluations with scoring rubric. Download as branded PDF.', isNew: false },
      { href: '/dashboard/generators/coaching-form', icon: '💬', title: 'Employee Coaching', desc: 'Verbal coaching documentation. Precedes formal written warnings.', isNew: false },
      { href: '/dashboard/generators/resignation', icon: '📤', title: 'Employee Resignation', desc: 'Resignation documentation with exit checklist and final pay info.', isNew: false },
      { href: '/dashboard/generators/termination', icon: '🛑', title: 'Employee Termination', desc: 'Termination forms with prior discipline, final pay, and property return.', isNew: false },
      { href: '/dashboard/generators/injury-report', icon: '🚑', title: 'Injury Report', desc: 'OSHA-compliant workplace injury forms. Auto-sends to HR on submission.', isNew: false },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: '⚙️',
    tools: [
      { href: '/dashboard/generators/work-orders', icon: '🔧', title: 'Work Orders', desc: 'Maintenance and equipment work orders with priority, assignment, and tracking.', isNew: false },
      { href: '/dashboard/generators/manager-log', icon: '📓', title: 'Manager Log', desc: 'Daily manager log across boards: General, Injuries, Maintenance, Cleaning.', isNew: false },
      { href: '/dashboard/generators/dm-walkthroughs', icon: '🔍', title: 'DM Walk-Through', desc: 'Store inspection evaluations with 14 scored categories and action items.', isNew: false },
      { href: '/dashboard/generators/onboarding-packets', icon: '📋', title: 'Onboarding Packet', desc: 'New hire document checklist with progress tracking and e-signatures.', isNew: false },
      { href: '/dashboard/documents', icon: '📄', title: 'Training Documents', desc: 'Level 1-3 training packets and new hire onboarding checklists.', isNew: false },
      { href: '/dashboard/generators/food-labels', icon: '🏷️', title: 'Food Labels', desc: 'Printable food prep labels with item name, prep/expiry dates, and allergens.', isNew: false },
    ],
  },
  {
    id: 'catering',
    label: 'Catering',
    icon: '🥪',
    tools: [
      { href: '/dashboard/flyer', icon: '📋', title: 'Catering Flyer', desc: 'Print-ready catering flyers with store info, menu, and pricing.', isNew: false },
      { href: '/dashboard/generators/catering-order', icon: '📦', title: 'Catering Order Form', desc: 'Customer-facing order forms with menu, pricing, and delivery details.', isNew: false },
      { href: '/dashboard/catering-tracker', icon: '📊', title: 'Catering Tracker', desc: 'Client CRM with follow-ups, order history, and reordering.', isNew: false },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: '⚖️',
    tools: [
      { href: '/dashboard/generators/timesheet-correction', icon: '⏰', title: 'Timesheet Correction', desc: 'Clock in/out correction forms for payroll adjustments.', isNew: false },
      { href: '/dashboard/generators/attestation-correction', icon: '📋', title: 'Attestation Correction', desc: 'Meal period and rest break attestation correction forms.', isNew: false },
      { href: '/dashboard/generators/meal-break-waiver', icon: '🍽️', title: 'Meal Break Waiver', desc: 'California-compliant meal period waiver per Labor Code §512.', isNew: false },
    ],
  },
];

function ToolCard({ tool, usageCount = 0, hasDraft = false }) {
  const [tooltip, setTooltip] = useState(false);
  // RT-082: Track usage on click
  const handleClick = () => {
    try {
      const usage = JSON.parse(localStorage.getItem('rt-gen-usage') || '{}');
      usage[tool.href] = (usage[tool.href] || 0) + 1;
      localStorage.setItem('rt-gen-usage', JSON.stringify(usage));
      const recent = JSON.parse(localStorage.getItem('rt-gen-recent') || '[]');
      const updated = [tool.href, ...recent.filter(h => h !== tool.href)].slice(0, 8);
      localStorage.setItem('rt-gen-recent', JSON.stringify(updated));
    } catch {}
  };
  return (
    <div className={styles.cardWrap}>
      <Link href={tool.href} className={styles.card} onClick={handleClick}>
        {tool.isNew && <span className={styles.badgeNew}>New</span>}
        {/* RT-061: Draft saved indicator */}
        {hasDraft && <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', background: 'rgba(37,99,235,0.10)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.18)' }}>draft</span>}
        {/* RT-082: Usage count badge */}
        {usageCount > 0 && <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px', background: 'rgba(19,74,124,0.08)', color: 'var(--jm-blue)' }}>{usageCount}×</span>}
        <div className={styles.cardIcon}><GenIcon emoji={tool.icon} size={28} /></div>
        <h3 className={styles.cardTitle}>{tool.title}</h3>
        <p className={styles.cardDesc}>{tool.desc}</p>
        <div className={styles.cardAction}>Open Tool &rarr;</div>
        {/* RT-057: E-sign indicator */}
        {ESIGN_TOOLS.has(tool.href) && (
          <span className={styles.eSignBadge}>✍ e-sign</span>
        )}
      </Link>
      <button
        className={styles.tooltipBtn}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
        aria-label={`More info about ${tool.title}`}
      >
        ?
        {tooltip && (
          <div className={styles.tooltipBox} role="tooltip">{tool.desc}</div>
        )}
      </button>
    </div>
  );
}

// RT-082/111: Usage tracking via localStorage
function getUsageMap() {
  try { return JSON.parse(localStorage.getItem('rt-gen-usage') || '{}'); } catch { return {}; }
}
function getRecentlyUsed() {
  try { return JSON.parse(localStorage.getItem('rt-gen-recent') || '[]'); } catch { return []; }
}

export default function GeneratorsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams?.get('q') || '');
  // RT-082: Usage counts
  const [usageMap, setUsageMap] = useState({});
  // RT-111: Recently used
  const [recentHrefs, setRecentHrefs] = useState([]);
  // RT-116: Grid vs list view
  const [viewMode, setViewMode] = useState('grid');
  // RT-055: Collapsed categories
  const [collapsed, setCollapsed] = useState({});
  // RT-061: Draft detection
  const [draftsSet, setDraftsSet] = useState(new Set());

  useEffect(() => {
    setUsageMap(getUsageMap());
    setRecentHrefs(getRecentlyUsed().slice(0, 4));
    try {
      const drafts = new Set();
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ro-tools-draft-')) {
          try {
            const { ts } = JSON.parse(localStorage.getItem(k) || '{}');
            if (ts && Date.now() - ts < 7 * 24 * 60 * 60 * 1000) {
              drafts.add(k.replace('ro-tools-draft-', ''));
            }
          } catch {}
        }
      }
      setDraftsSet(drafts);
    } catch {}
  }, []);

  const filteredCategories = search.trim()
    ? CATEGORIES.map(cat => ({
        ...cat,
        tools: cat.tools.filter(t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.desc.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.tools.length > 0)
    : CATEGORIES;

  // Build recently-used tools list from all categories
  const allTools = CATEGORIES.flatMap(c => c.tools);
  const recentTools = recentHrefs.map(href => allTools.find(t => t.href === href)).filter(Boolean);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Generators</h1>
        <p className={styles.subtitle}>Select a tool to get started. Every document auto-fills your store info and downloads as a branded PDF.</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          {/* RT-116: View toggle */}
          <button onClick={() => setViewMode('grid')} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: viewMode === 'grid' ? 'var(--jm-blue)' : 'var(--white)', color: viewMode === 'grid' ? '#fff' : 'var(--gray-500)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Grid</button>
          <button onClick={() => setViewMode('list')} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: viewMode === 'list' ? 'var(--jm-blue)' : 'var(--white)', color: viewMode === 'list' ? '#fff' : 'var(--gray-500)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>List</button>
        </div>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search generators..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')} aria-label="Clear search">×</button>
          )}
        </div>
      </div>

      {/* RT-111: Recently used section */}
      {!search && recentTools.length > 0 && (
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <span className={styles.categoryIcon}><GenIcon emoji="⏰" size={18} /></span>
            <h2 className={styles.categoryLabel}>Recently Used</h2>
          </div>
          <div className={styles.grid}>
            {recentTools.map(t => (
              <ToolCard key={`recent-${t.href}`} tool={t} usageCount={usageMap[t.href] || 0} hasDraft={draftsSet.has(t.href.split('/').pop())} />
            ))}
          </div>
        </div>
      )}

      {filteredCategories.map(cat => (
        <div key={cat.id} className={styles.category} style={viewMode === 'list' ? { marginBottom: '16px' } : {}}>
          {/* RT-055: Collapsible category header */}
          <div
            className={`${styles.categoryHeader} ${styles.categoryHeaderCollapse}`}
            onClick={() => setCollapsed(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
            role="button"
            aria-expanded={!collapsed[cat.id]}
          >
            <span className={styles.categoryIcon}><GenIcon emoji={cat.icon} size={18} /></span>
            <h2 className={styles.categoryLabel}>{cat.label}</h2>
            <span className={styles.categoryCount}>{cat.tools.length}</span>
            <span className={`${styles.collapseChevron} ${collapsed[cat.id] ? styles.closed : styles.open}`}>▾</span>
          </div>
          {/* RT-116: list mode = single column */}
          <div className={`${viewMode === 'list' ? styles.list : styles.grid} ${collapsed[cat.id] ? styles.categoryCollapsed : ''}`}>
            {cat.tools.map(t => (
              <ToolCard key={t.href} tool={t} usageCount={usageMap[t.href] || 0} hasDraft={draftsSet.has(t.href.split('/').pop())} />
            ))}
          </div>
        </div>
      ))}

      {filteredCategories.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <p className={styles.emptyText}>No generators match &ldquo;{search}&rdquo;</p>
          <button className={styles.emptyReset} onClick={() => setSearch('')}>Clear search</button>
        </div>
      )}
    </div>
  );
}
