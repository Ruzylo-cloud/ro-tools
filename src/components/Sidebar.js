'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import styles from './Sidebar.module.css';

const MC_BASE_URL = 'https://mission-control-1049928336088.us-central1.run.app';

const SEARCH_ITEMS = [
  { label: 'Dashboard Overview', path: '/dashboard', icon: '📌', keywords: 'home overview dashboard' },
  { label: 'All Generators', path: '/dashboard/generators', icon: '📄', keywords: 'forms generate documents all' },
  { label: 'Catering Order', path: '/dashboard/generators/catering-order', icon: '📝', keywords: 'catering order customer client' },
  { label: 'Written Warning', path: '/dashboard/generators/written-warning', icon: '⚠️', keywords: 'warning discipline write-up hr' },
  { label: 'Employee Evaluation', path: '/dashboard/generators/evaluation', icon: '📋', keywords: 'evaluation review performance' },
  { label: 'Coaching Form', path: '/dashboard/generators/coaching-form', icon: '🗣️', keywords: 'coaching counseling conversation' },
  { label: 'Injury Report', path: '/dashboard/generators/injury-report', icon: '🩺', keywords: 'injury incident report accident' },
  { label: 'Resignation Letter', path: '/dashboard/generators/resignation', icon: '✉️', keywords: 'resignation quit two week notice' },
  { label: 'Termination Form', path: '/dashboard/generators/termination', icon: '📋', keywords: 'termination fire let go separation' },
  { label: 'Meal Break Waiver', path: '/dashboard/generators/meal-break-waiver', icon: '🍽️', keywords: 'meal break waiver lunch california' },
  { label: 'Timesheet Correction', path: '/dashboard/generators/timesheet-correction', icon: '⏰', keywords: 'timesheet time correction punch' },
  { label: 'Attestation Correction', path: '/dashboard/generators/attestation-correction', icon: '✍️', keywords: 'attestation correction shift' },
  { label: 'DM Walkthrough', path: '/dashboard/generators/dm-walkthroughs', icon: '🔍', keywords: 'dm district manager walkthrough inspection' },
  { label: 'Manager Log', path: '/dashboard/generators/manager-log', icon: '📓', keywords: 'manager log daily notes' },
  { label: 'Work Order', path: '/dashboard/generators/work-orders', icon: '🔧', keywords: 'work order repair maintenance' },
  { label: 'Onboarding Packet', path: '/dashboard/generators/onboarding-packets', icon: '🆕', keywords: 'onboarding new hire orientation packet' },
  { label: 'Food Labels', path: '/dashboard/generators/food-labels', icon: '🏷️', keywords: 'food label date prep labels' },
  { label: 'Signatures', path: '/dashboard/signatures', icon: '✍️', keywords: 'esign signatures documents sign' },
  { label: 'Catering Flyer', path: '/dashboard/flyer', icon: '🖨️', keywords: 'flyer catering print menu' },
  { label: 'Catering Tracker', path: '/dashboard/catering-tracker', icon: '📊', keywords: 'catering crm tracker clients orders' },
  { label: 'Marketing Directives', path: '/dashboard/directives', icon: '📅', keywords: 'directives marketing monthly campaign' },
  { label: 'Scoreboard', path: '/dashboard/scoreboard', icon: '🏆', keywords: 'scoreboard leaderboard scores sales rankings' },
  { label: 'Payroll Workbench', path: '/dashboard/tools/payroll', icon: '💵', keywords: 'payroll pay period wages tips tools' },
  { label: 'Stability Snapshot', path: '/dashboard/tools/stability-snapshot', icon: '🧱', keywords: 'stability snapshot role slot staffing tools' },
  { label: 'Tier Assessment', path: '/dashboard/tools/tier-assessment', icon: '🎯', keywords: 'abc tier assessment rubric employees tools' },
  { label: 'Reading List', path: '/dashboard/reading', icon: '📚', keywords: 'reading books library leadership development' },
  { label: 'Store Profile', path: '/dashboard/profile', icon: '🏪', keywords: 'store profile address phone managers' },
  { label: 'Documents', path: '/dashboard/documents', icon: '📁', keywords: 'documents files library' },
  { label: 'Support & Feedback', path: '/dashboard/support', icon: '💬', keywords: 'support help feedback bug report' },
  { label: 'Admin Panel', path: '/dashboard/admin', icon: '⚙️', keywords: 'admin users roles manage' },
];

function searchFilter(q) {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];
  return SEARCH_ITEMS.filter(item =>
    item.label.toLowerCase().includes(lower) ||
    item.keywords.toLowerCase().includes(lower)
  ).slice(0, 8);
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestUpdateId, setLatestUpdateId] = useState('');
  const [notifCount, setNotifCount] = useState(0);
  const [theme, setTheme] = useState('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [stores, setStores] = useState([]);
  const [activeStore, setActiveStore] = useState(null);

  // Collapsible sections
  const [openSections, setOpenSections] = useState({ generators: false, catering: false, tools: false });

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchSelected, setSearchSelected] = useState(-1);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const searchInputRef = useRef(null);

  const isActive = useCallback((path, exact = false) => {
    if (exact || path === '/dashboard') return pathname === path;
    return pathname.startsWith(path);
  }, [pathname]);

  // Auto-open sections on active path
  useEffect(() => {
    const inGenerators = pathname.startsWith('/dashboard/generators') || pathname.startsWith('/dashboard/signatures');
    const inCatering = pathname.startsWith('/dashboard/flyer') || pathname.startsWith('/dashboard/catering');
    const inTools = pathname.startsWith('/dashboard/tools');
    setOpenSections({ generators: inGenerators, catering: inCatering, tools: inTools });
  }, [pathname]);

  // Collapse state init
  useEffect(() => {
    const saved = localStorage.getItem('rt-sidebar-collapsed');
    if (saved === '1') {
      setCollapsed(true);
      document.body.classList.add('rt-sidebar-collapsed');
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    document.body.classList.toggle('rt-sidebar-collapsed', next);
    localStorage.setItem('rt-sidebar-collapsed', next ? '1' : '0');
  }, [collapsed]);

  // Load admin/role + stores + unread updates + RC notification count
  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        setIsAdmin(d.isAdmin || false);
        setUserRole(d.profile?.role || d.role || '');
        const storeList = d.stores ||
          (d.profile?.stores?.length > 0
            ? d.profile.stores.map(s => ({ id: s.storeName, name: s.city ? `${s.city}, ${s.state}` : `Store ${s.storeName}` }))
            : d.profile?.storeName
              ? [{ id: d.profile.storeName, name: d.profile.city ? `${d.profile.city}, ${d.profile.state}` : `Store ${d.profile.storeName}` }]
              : []);
        setStores(storeList);
        const saved = localStorage.getItem('jmvg-active-store');
        const match = storeList.find(s => String(s.id) === String(saved));
        setActiveStore(match || storeList[0] || null);
      })
      .catch((e) => { console.debug('[sidebar] profile load failed (non-fatal):', e); });
    fetch('/api/updates?limit=1')
      .then(r => r.json())
      .then(d => {
        const latest = d.updates?.[0]?.id || '';
        const seen = localStorage.getItem('rt-last-update') || '';
        setLatestUpdateId(latest);
        if (latest && latest !== seen) setUnreadCount(1);
      })
      .catch((e) => { console.debug('[sidebar] updates check failed (non-fatal):', e); });
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => { if (d.count > 0) setNotifCount(d.count); })
      .catch((e) => { console.debug('[sidebar] notifications count failed (non-fatal):', e); });
    const notifInterval = setInterval(() => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => setNotifCount(d.count || 0))
        .catch((e) => { console.debug('[sidebar] notifications poll failed (non-fatal):', e); });
    }, 120000);
    return () => clearInterval(notifInterval);
  }, []);

  const loadNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await fetch('/api/notifications?mode=list');
      const data = await res.json();
      setNotifItems(Array.isArray(data) ? data : []);
    } catch {
      setNotifItems([]);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    if (notifOpen) loadNotifications();
  }, [notifOpen, loadNotifications]);

  // Theme init
  useEffect(() => {
    const saved = localStorage.getItem('ro-tools-theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ro-tools-theme', next);
  }, [theme]);

  // Ctrl+K / "/" global search shortcut
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement?.tagName;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || document.activeElement?.isContentEditable) return;
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const toggleSection = useCallback((name) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const navClick = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleSearchNav = useCallback((path) => {
    router.push(path);
    setSearchOpen(false);
    setNotifOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setMobileOpen(false);
  }, [router]);

  const getNotificationDestination = useCallback((item) => {
    const haystack = `${item?.type || ''} ${item?.title || ''} ${item?.message || ''}`.toLowerCase();
    if (haystack.includes('changelog') || haystack.includes('update')) {
      return { kind: 'internal', path: '/dashboard/updates' };
    }
    if (haystack.includes('directive')) {
      return { kind: 'internal', path: '/dashboard/directives' };
    }
    if (haystack.includes('scoreboard')) {
      return { kind: 'internal', path: '/dashboard/scoreboard' };
    }
    if (haystack.includes('support')) {
      return { kind: 'internal', path: '/dashboard/support' };
    }
    if (haystack.includes('task')) {
      return { kind: 'external', url: `${MC_BASE_URL}#tasks` };
    }
    if (haystack.includes('checklist') || haystack.includes('corrective')) {
      return { kind: 'external', url: `${MC_BASE_URL}#checklists` };
    }
    if (haystack.includes('schedule') || haystack.includes('shift') || haystack.includes('no_show') || haystack.includes('time off') || haystack.includes('time-off') || haystack.includes('labor')) {
      return { kind: 'external', url: `${MC_BASE_URL}#schedule` };
    }
    if (haystack.includes('email')) {
      return { kind: 'external', url: `${MC_BASE_URL}#emails` };
    }
    if (haystack.includes('automation') || haystack.includes('backup') || haystack.includes('webhook')) {
      return { kind: 'external', url: `${MC_BASE_URL}#automations` };
    }
    if (haystack.includes('sync') || haystack.includes('integration') || haystack.includes('gmail') || haystack.includes('homebase') || haystack.includes('jolt')) {
      return { kind: 'external', url: `${MC_BASE_URL}#integrations` };
    }
    if (haystack.includes('employee') || haystack.includes('birthday') || haystack.includes('vacation delegation')) {
      return { kind: 'external', url: `${MC_BASE_URL}#staff-directory` };
    }
    return { kind: 'external', url: `${MC_BASE_URL}#dashboard` };
  }, []);

  const handleNotificationClick = useCallback(async (item) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read', id: item.id }),
      });
    } catch (e) { console.debug('[sidebar] notification mark-read failed (non-fatal):', e); }

    setNotifItems(prev => prev.map(n => n.id === item.id ? { ...n, read: 1 } : n));
    setNotifCount(prev => Math.max(0, prev - (item.read ? 0 : 1)));
    setNotifOpen(false);
    setMobileOpen(false);

    const dest = getNotificationDestination(item);
    if (dest.kind === 'internal') {
      router.push(dest.path);
      return;
    }
    window.location.href = dest.url;
  }, [getNotificationDestination, router]);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read-all' }),
      });
      setNotifItems(prev => prev.map(n => ({ ...n, read: 1 })));
      setNotifCount(0);
    } catch (e) { console.debug('[sidebar] mark-all-read failed (non-fatal):', e); }
  }, []);

  const toggleNotifications = useCallback(() => {
    setSearchOpen(false);
    setNotifOpen(v => !v);
  }, []);

  const timeAgo = useCallback((value) => {
    const ts = new Date(value).getTime();
    if (!ts) return '';
    const diff = Math.max(0, Date.now() - ts);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(value).toLocaleDateString();
  }, []);

  const notifIcon = useCallback((type) => {
    const map = {
      task_assigned: '✅',
      task_overdue: '⏰',
      task_escalated: '⚠️',
      checklist_due: '📋',
      shift_checklist: '📋',
      no_show: '👤',
      warning: '⚠️',
      error: '✕',
      info: 'ℹ️',
      automation_failure: '🤖',
      corrective_action: '🧯',
      corrective_action_escalated: '🚨',
      corrective_action_recheck: '🔁',
    };
    return map[type] || '🔔';
  }, []);

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchSelected(p => Math.min(p + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchSelected(p => Math.max(p - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = searchSelected >= 0 ? searchSelected : 0;
      if (searchResults[idx]) handleSearchNav(searchResults[idx].path);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  }, [searchResults, searchSelected, handleSearchNav]);

  const ChevronIcon = ({ open }) => (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className={styles.mobileTopBar}>
        <Link href="/dashboard" className={styles.mobileLogo} onClick={navClick}>
          <Image src="/jmvg-logo.png" alt="JM Valley Group" width={40} height={20} priority style={{ borderRadius: '3px', objectFit: 'contain' }} />
          <span className={styles.mobileLogoText}>RO <span>Tools</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className={styles.mobileIconBtn} onClick={() => { setSearchOpen(v => !v); setTimeout(() => searchInputRef.current?.focus(), 50); }} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            className={styles.mobileIconBtn}
            onClick={toggleNotifications}
            aria-label="Notifications"
            style={{ position: 'relative', textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {notifCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '15px', height: '15px', background: '#EE3227', color: '#fff', borderRadius: '8px', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', border: '2px solid #fff' }}>
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── Backdrop (mobile only) ── */}
      {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />}

      {/* ── Global search dropdown ── */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className={styles.searchModal}>
            <div className={styles.searchInputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0, color: 'var(--gray-400)' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchSelected(-1);
                  setSearchResults(searchFilter(e.target.value));
                }}
                maxLength={100}
                onKeyDown={handleSearchKeyDown}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="Search pages... (⌘K)"
                className={styles.searchInput}
                autoComplete="off"
              />
              <kbd className={styles.searchKbd} onClick={() => setSearchOpen(false)}>Esc</kbd>
            </div>
            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((r, i) => (
                  <div
                    key={r.path}
                    className={`${styles.searchResult} ${i === searchSelected ? styles.searchResultActive : ''}`}
                    onMouseDown={() => handleSearchNav(r.path)}
                  >
                    <span className={styles.searchResultIcon}>{r.icon || '→'}</span>
                    <div>
                      <div className={styles.searchResultTitle}>{r.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className={styles.searchEmpty}>No results for &ldquo;{searchQuery}&rdquo;</div>
            )}
          </div>
        </div>
      )}

      {notifOpen && (
        <div className={styles.notifOverlay} onClick={e => { if (e.target === e.currentTarget) setNotifOpen(false); }}>
          <div className={styles.notifModal}>
            <div className={styles.notifHeader}>
              <div className={styles.notifHeaderTitle}>Notifications</div>
              <div className={styles.notifHeaderActions}>
                {!!notifCount && <button className={styles.notifHeaderBtn} onClick={markAllNotificationsRead}>Mark all read</button>}
                <button className={styles.notifHeaderBtn} onClick={() => setNotifOpen(false)} aria-label="Close notifications">×</button>
              </div>
            </div>
            <div className={styles.notifList}>
              {notifLoading ? (
                <div className={styles.notifEmpty}>Loading...</div>
              ) : notifItems.length === 0 ? (
                <div className={styles.notifEmpty}>No notifications yet</div>
              ) : notifItems.map(item => (
                <div
                  key={item.id}
                  className={`${styles.notifItem} ${!item.read ? styles.notifUnread : ''}`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className={styles.notifIcon}>{notifIcon(item.type)}</div>
                  <div className={styles.notifBody}>
                    <div className={styles.notifTitle}>{item.title}</div>
                    {item.message && <div className={styles.notifMessage}>{item.message}</div>}
                    <div className={styles.notifTime}>{timeAgo(item.created_at)}</div>
                  </div>
                  {!item.read && <div className={styles.notifUnreadDot} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Expand tab (when collapsed) ── */}
      {collapsed && (
        <button className={styles.expandTab} onClick={toggleCollapse} title="Expand sidebar" aria-label="Expand sidebar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''} ${collapsed ? styles.sidebarCollapsed : ''}`} aria-label="Navigation sidebar">

        {/* Logo */}
        <Link href="/dashboard" className={styles.logo} onClick={navClick}>
          <Image src="/jmvg-logo.png" alt="JM Valley Group" width={72} height={36} priority style={{ borderRadius: '4px', objectFit: 'contain' }} />
          <span className={styles.logoText}>RO <span>Tools</span></span>
        </Link>

        {/* Search trigger */}
        <button
          className={styles.searchTrigger}
          onClick={() => { setSearchOpen(v => !v); setTimeout(() => searchInputRef.current?.focus(), 50); }}
          aria-label="Search (⌘K)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search...</span>
          <kbd className={styles.kbdHint}>⌘K</kbd>
        </button>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">

          {/* Overview */}
          <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard', true) ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>📌</span> Overview
          </Link>

          {/* Generators (collapsible) */}
          <div className={styles.group}>
            <button
              className={`${styles.groupBtn} ${(openSections.generators || isActive('/dashboard/generators') || isActive('/dashboard/signatures')) ? styles.groupBtnActive : ''}`}
              onClick={() => toggleSection('generators')}
              aria-expanded={openSections.generators}
            >
              <span className={styles.icon}>📄</span>
              Generators
              <ChevronIcon open={openSections.generators} />
            </button>
            {openSections.generators && (
              <div className={styles.subItems}>
                <Link href="/dashboard/generators" className={`${styles.subLink} ${pathname === '/dashboard/generators' ? styles.subLinkActive : ''}`} onClick={navClick}>
                  All Generators
                </Link>
                <Link href="/dashboard/generators/written-warning" className={`${styles.subLink} ${isActive('/dashboard/generators/written-warning') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>⚠️</span> Written Warning
                </Link>
                <Link href="/dashboard/generators/evaluation" className={`${styles.subLink} ${isActive('/dashboard/generators/evaluation') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>📋</span> Evaluation
                </Link>
                <Link href="/dashboard/generators/coaching-form" className={`${styles.subLink} ${isActive('/dashboard/generators/coaching-form') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🗣️</span> Coaching Form
                </Link>
                <Link href="/dashboard/generators/injury-report" className={`${styles.subLink} ${isActive('/dashboard/generators/injury-report') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🩺</span> Injury Report
                </Link>
                <Link href="/dashboard/generators/resignation" className={`${styles.subLink} ${isActive('/dashboard/generators/resignation') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>✉️</span> Resignation
                </Link>
                <Link href="/dashboard/generators/termination" className={`${styles.subLink} ${isActive('/dashboard/generators/termination') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>📋</span> Termination
                </Link>
                <Link href="/dashboard/generators/meal-break-waiver" className={`${styles.subLink} ${isActive('/dashboard/generators/meal-break-waiver') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🍽️</span> Meal Break Waiver
                </Link>
                <Link href="/dashboard/generators/timesheet-correction" className={`${styles.subLink} ${isActive('/dashboard/generators/timesheet-correction') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>⏰</span> Timesheet Correction
                </Link>
                <Link href="/dashboard/generators/attestation-correction" className={`${styles.subLink} ${isActive('/dashboard/generators/attestation-correction') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>✍️</span> Attestation
                </Link>
                <Link href="/dashboard/generators/dm-walkthroughs" className={`${styles.subLink} ${isActive('/dashboard/generators/dm-walkthroughs') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🔍</span> DM Walk-Through
                </Link>
                <Link href="/dashboard/generators/manager-log" className={`${styles.subLink} ${isActive('/dashboard/generators/manager-log') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>📓</span> Manager Log
                </Link>
                <Link href="/dashboard/generators/work-orders" className={`${styles.subLink} ${isActive('/dashboard/generators/work-orders') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🔧</span> Work Orders
                </Link>
                <Link href="/dashboard/generators/onboarding-packets" className={`${styles.subLink} ${isActive('/dashboard/generators/onboarding-packets') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🆕</span> Onboarding Packet
                </Link>
                <Link href="/dashboard/generators/food-labels" className={`${styles.subLink} ${isActive('/dashboard/generators/food-labels') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🏷️</span> Food Labels
                </Link>
                <Link href="/dashboard/signatures" className={`${styles.subLink} ${isActive('/dashboard/signatures') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>✍️</span> Signatures
                </Link>
              </div>
            )}
          </div>

          {/* Catering (collapsible) */}
          <div className={styles.group}>
            <button
              className={`${styles.groupBtn} ${(openSections.catering || isActive('/dashboard/flyer') || isActive('/dashboard/catering')) ? styles.groupBtnActive : ''}`}
              onClick={() => toggleSection('catering')}
              aria-expanded={openSections.catering}
            >
              <span className={styles.icon}>🍱</span>
              Catering
              <ChevronIcon open={openSections.catering} />
            </button>
            {openSections.catering && (
              <div className={styles.subItems}>
                <Link href="/dashboard/flyer" className={`${styles.subLink} ${pathname === '/dashboard/flyer' ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🖨️</span> Catering Flyer
                </Link>
                <Link href="/dashboard/generators/catering-order" className={`${styles.subLink} ${isActive('/dashboard/generators/catering-order') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>📝</span> Catering Order
                </Link>
                <Link href="/dashboard/catering-tracker" className={`${styles.subLink} ${isActive('/dashboard/catering-tracker') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>📊</span> Catering Tracker
                </Link>
              </div>
            )}
          </div>

          {/* Tools (collapsible) */}
          <div className={styles.group}>
            <button
              className={`${styles.groupBtn} ${(openSections.tools || isActive('/dashboard/tools')) ? styles.groupBtnActive : ''}`}
              onClick={() => toggleSection('tools')}
              aria-expanded={openSections.tools}
            >
              <span className={styles.icon}>🛠️</span>
              Tools
              <ChevronIcon open={openSections.tools} />
            </button>
            {openSections.tools && (
              <div className={styles.subItems}>
                <Link href="/dashboard/tools/payroll" className={`${styles.subLink} ${isActive('/dashboard/tools/payroll') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>💵</span> Payroll Workbench
                </Link>
                <Link href="/dashboard/tools/stability-snapshot" className={`${styles.subLink} ${isActive('/dashboard/tools/stability-snapshot') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🧱</span> Stability Snapshot
                </Link>
                <Link href="/dashboard/tools/tier-assessment" className={`${styles.subLink} ${isActive('/dashboard/tools/tier-assessment') ? styles.subLinkActive : ''}`} onClick={navClick}>
                  <span>🎯</span> Tier Assessment
                </Link>
              </div>
            )}
          </div>

          <Link href="/dashboard/directives" className={`${styles.navLink} ${isActive('/dashboard/directives') ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>📅</span> Directives
          </Link>

          <Link href="/dashboard/scoreboard" className={`${styles.navLink} ${isActive('/dashboard/scoreboard') ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>🏆</span> Scoreboard
          </Link>

          <Link href="/dashboard/reading" className={`${styles.navLink} ${isActive('/dashboard/reading') ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>📚</span> Reading
          </Link>

          <Link href="/dashboard/profile" className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>🏪</span> Store Profile
          </Link>

          <Link href="/dashboard/documents" className={`${styles.navLink} ${isActive('/dashboard/documents') ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>📁</span> Documents
          </Link>

          <Link href="/dashboard/support" className={`${styles.navLink} ${isActive('/dashboard/support') ? styles.navLinkActive : ''}`} onClick={navClick}>
            <span className={styles.icon}>💬</span> Support
          </Link>

          {isAdmin && (
            <>
              <div className={styles.divider} />
              <Link href="/dashboard/admin" className={`${styles.navLink} ${isActive('/dashboard/admin') ? styles.navLinkActive : ''}`} onClick={navClick}>
                <span className={styles.icon}>⚙️</span> Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          {/* Store picker — select for multi-store, label for single store (RC pattern) */}
          <div className={styles.storePicker}>
            {stores.length > 1 ? (
              <select
                className={styles.storeSelect}
                value={activeStore?.id || ''}
                onChange={e => {
                  const s = stores.find(x => String(x.id) === e.target.value);
                  if (s) { setActiveStore(s); localStorage.setItem('jmvg-active-store', String(s.id)); }
                }}
                title="Switch active store"
              >
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <div className={styles.storeLabel}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <span>{activeStore?.name || 'Loading store...'}</span>
              </div>
            )}
          </div>

          {/* Icon row: Notifications + Dark mode toggle */}
          <div className={styles.footerIconRow}>
            <button
              className={styles.footerIconBtn}
              onClick={toggleNotifications}
              aria-label="Notifications"
              title="Notifications"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>Notifications</span>
              {notifCount > 0 && (
                <span className={styles.iconBtnBadge}>{notifCount > 9 ? '9+' : notifCount}</span>
              )}
            </button>
            <button
              className={styles.footerIconBtn}
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          {/* Collapse button */}
          <button className={styles.collapseBtn} onClick={toggleCollapse} title="Collapse sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Collapse</span>
          </button>

          {/* User row */}
          {user && (
            <div className={styles.userRow}>
              <div className={styles.avatar}>
                <span className={styles.avatarInitials}>
                  {(user.name || user.email || '?').split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || '?'}
                </span>
              </div>
              <div className={styles.userMeta}>
                <div className={styles.userName}>{user.name?.split(' ')[0] || 'Account'}</div>
                {userRole && <div className={styles.userRole}>{userRole.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>}
              </div>
              <button className={styles.signOutBtn} onClick={logout} title="Sign out" aria-label="Sign out">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
          <div className={styles.footerVersion}>
            RO Tools v2.9.8 &nbsp;&middot;&nbsp; &copy; 2026 JM Valley Group
          </div>
        </div>
      </aside>
    </>
  );
}
