'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

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

function ToolCard({ tool, usageCount = 0 }) {
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
        {/* RT-082: Usage count badge */}
        {usageCount > 0 && <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px', background: 'rgba(19,74,124,0.08)', color: 'var(--jm-blue)' }}>{usageCount}×</span>}
        <div className={styles.cardIcon}>{tool.icon}</div>
        <h3 className={styles.cardTitle}>{tool.title}</h3>
        <p className={styles.cardDesc}>{tool.desc}</p>
        <div className={styles.cardAction}>Open Tool &rarr;</div>
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
  const [search, setSearch] = useState('');
  // RT-082: Usage counts
  const [usageMap, setUsageMap] = useState({});
  // RT-111: Recently used
  const [recentHrefs, setRecentHrefs] = useState([]);
  // RT-116: Grid vs list view
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setUsageMap(getUsageMap());
    setRecentHrefs(getRecentlyUsed().slice(0, 4));
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
            <span className={styles.categoryIcon}>🕐</span>
            <h2 className={styles.categoryLabel}>Recently Used</h2>
          </div>
          <div className={styles.grid}>
            {recentTools.map(t => (
              <ToolCard key={`recent-${t.href}`} tool={t} usageCount={usageMap[t.href] || 0} />
            ))}
          </div>
        </div>
      )}

      {filteredCategories.map(cat => (
        <div key={cat.id} className={styles.category} style={viewMode === 'list' ? { marginBottom: '16px' } : {}}>
          <div className={styles.categoryHeader}>
            <span className={styles.categoryIcon}>{cat.icon}</span>
            <h2 className={styles.categoryLabel}>{cat.label}</h2>
            <span className={styles.categoryCount}>{cat.tools.length}</span>
          </div>
          {/* RT-116: list mode = single column */}
          <div className={viewMode === 'list' ? styles.list : styles.grid}>
            {cat.tools.map(t => (
              <ToolCard key={t.href} tool={t} usageCount={usageMap[t.href] || 0} />
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
