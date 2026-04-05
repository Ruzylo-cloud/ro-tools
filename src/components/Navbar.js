'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import styles from './Navbar.module.css';

const SEARCH_ITEMS = [
  { label: 'Dashboard Overview', path: '/dashboard', icon: '🏠', keywords: 'home overview dashboard' },
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
  { label: 'Catering Flyer', path: '/dashboard/flyer', icon: '🖨️', keywords: 'flyer catering print menu' },
  { label: 'Catering Tracker', path: '/dashboard/catering-tracker', icon: '📊', keywords: 'catering crm tracker clients orders' },
  { label: 'Marketing Directives', path: '/dashboard/directives', icon: '📅', keywords: 'directives marketing monthly campaign' },
  { label: 'Scoreboard', path: '/dashboard/scoreboard', icon: '🏆', keywords: 'scoreboard leaderboard scores sales rankings' },
  { label: 'Documents', path: '/dashboard/documents', icon: '📁', keywords: 'documents files library' },
  { label: 'Document History', path: '/dashboard/history', icon: '🕐', keywords: 'history past documents generated' },
  { label: 'Reading List', path: '/dashboard/reading', icon: '📚', keywords: 'reading books library leadership development' },
  { label: 'Updates & Changelog', path: '/dashboard/updates', icon: '🆕', keywords: 'updates changelog releases features' },
  { label: 'Store Profile', path: '/dashboard/profile', icon: '🏪', keywords: 'store profile address phone managers' },
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

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const pathname = usePathname();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSelected, setSearchSelected] = useState(-1);

  const isActive = (path) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.isAdmin || false);
        setUserRole(data.profile?.role || data.role || '');
      })
      .catch(() => {});
    // RT-064: Poll for unread updates (simplified — uses local storage diff)
    fetch('/api/updates?limit=1')
      .then(r => r.json())
      .then(d => {
        const latest = d.updates?.[0]?.id || '';
        const seen = localStorage.getItem('rt-last-update') || '';
        if (latest && latest !== seen) setUnreadCount(1);
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
      // Close search dropdown if clicking outside searchWrap
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleDropdown = useCallback((name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
    setOpenDropdown(null);
  }, []);

  // Dark mode toggle
  const [theme, setTheme] = useState('light');
  // RT-064: Notification bell
  const [unreadCount, setUnreadCount] = useState(0);
  // RT-070: User role
  const [userRole, setUserRole] = useState('');

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

  // Search: Ctrl+K or / to open dropdown
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchSelected(-1);
    const results = searchFilter(q);
    setSearchResults(results);
  }, []);

  const handleSearchKeyDown = useCallback((e) => {
    if (!searchOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchSelected(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchSelected(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = searchSelected >= 0 ? searchSelected : 0;
      if (searchResults[idx]) {
        router.push(searchResults[idx].path);
        setSearchQuery('');
        setSearchOpen(false);
        setSearchResults([]);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  }, [searchOpen, searchResults, searchSelected, router]);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setSearchOpen(false), 150);
  }, []);

  const handleSearchItemClick = useCallback((path) => {
    router.push(path);
    setSearchQuery('');
    setSearchResults([]);
    setSearchOpen(false);
  }, [router]);

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo} onClick={closeDropdown}>
          <Image src="/jmvg-logo.png" alt="JM Valley Group" width={72} height={36} priority style={{ borderRadius: '4px', objectFit: 'contain' }} />
          <span className={styles.logoText}>RO <span>Tools</span></span>
        </Link>
        <div className={styles.links}>
          {/* 1. Dashboard */}
          <div className={styles.navItem}>
            <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Overview</Link>
          </div>

          {/* 2. Generators (direct link) */}
          <div className={styles.navItem}>
            <Link href="/dashboard/generators" className={`${styles.navLink} ${isActive('/dashboard/generators') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Generators</Link>
          </div>

          {/* 3. Catering (dropdown) */}
          <div className={styles.navItem}>
            <button
              className={`${styles.navLink} ${openDropdown === 'catering' || isActive('/dashboard/catering') || isActive('/dashboard/generators/catering') || pathname === '/dashboard/flyer' ? styles.navLinkActive : ''}`}
              onClick={() => toggleDropdown('catering')}
              aria-expanded={openDropdown === 'catering'}
              aria-haspopup="true"
            >
              Catering <span className={`${styles.chevron} ${openDropdown === 'catering' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
            </button>
            {openDropdown === 'catering' && (
              <div className={styles.dropdown}>
                <Link href="/dashboard/flyer" className={styles.dropdownItem} onClick={closeDropdown}>
                  <span className={styles.dropdownIcon}>&#x1F5A8;</span>
                  <div>
                    <div className={styles.dropdownLabel}>Catering Flyer</div>
                    <div className={styles.dropdownHint}>Print-ready flyer with menu &amp; pricing</div>
                  </div>
                </Link>
                <Link href="/dashboard/generators/catering-order" className={styles.dropdownItem} onClick={closeDropdown}>
                  <span className={styles.dropdownIcon}>&#x1F4DD;</span>
                  <div>
                    <div className={styles.dropdownLabel}>Catering Order</div>
                    <div className={styles.dropdownHint}>Customer-facing order form PDF</div>
                  </div>
                </Link>
                <Link href="/dashboard/catering-tracker" className={styles.dropdownItem} onClick={closeDropdown}>
                  <span className={styles.dropdownIcon}>&#x1F4CA;</span>
                  <div>
                    <div className={styles.dropdownLabel}>Catering Tracker</div>
                    <div className={styles.dropdownHint}>Track clients, orders, and follow-ups</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Directives (standalone page) */}
          <div className={styles.navItem}>
            <Link href="/dashboard/directives" className={`${styles.navLink} ${isActive('/dashboard/directives') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Directives</Link>
          </div>

          {/* 5. Scoreboard */}
          <div className={styles.navItem}>
            <Link href="/dashboard/scoreboard" className={`${styles.navLink} ${isActive('/dashboard/scoreboard') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Scoreboard</Link>
          </div>

          {/* 6. Reading */}
          <div className={styles.navItem}>
            <Link href="/dashboard/reading" className={`${styles.navLink} ${isActive('/dashboard/reading') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Reading</Link>
          </div>

          {/* 7. Signatures */}
          <div className={styles.navItem}>
            <Link href="/dashboard/signatures" className={`${styles.navLink} ${isActive('/dashboard/signatures') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Signatures</Link>
          </div>

          {/* 8. Store Profile */}
          <div className={styles.navItem}>
            <Link href="/dashboard/profile" className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Store Profile</Link>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {/* Global search: icon button → dropdown */}
        <div className={styles.searchWrap} ref={searchRef}>
          <button
            className={styles.searchIconBtn}
            onClick={() => setSearchOpen(prev => !prev)}
            aria-label="Search (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          {searchOpen && (
            <div className={styles.searchDropdown}>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchBlur}
                placeholder="Search... (Ctrl+K)"
                autoFocus
                className={styles.searchInput}
                autoComplete="off"
              />
              {searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {searchResults.map((r, i) => (
                    <div
                      key={r.path}
                      className={`${styles.searchResultItem} ${i === searchSelected ? styles.searchResultActive : ''}`}
                      onMouseDown={() => handleSearchItemClick(r.path)}
                    >
                      <span className={styles.searchResultIcon}>{r.icon || '→'}</span>
                      <div>
                        <div className={styles.searchResultTitle}>{r.label}</div>
                        {r.desc && <div className={styles.searchResultDesc}>{r.desc}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <Link
          href="/dashboard/updates"
          className={styles.iconBtn}
          onClick={() => { setUnreadCount(0); closeDropdown(); }}
          aria-label={unreadCount ? `${unreadCount} new update` : 'Updates'}
          title="Updates"
          style={{ position: 'relative' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#EE3227', borderRadius: '50%', border: '1px solid var(--white)' }} aria-hidden="true" />
          )}
        </Link>
        {/* RT-070: Role badge */}
        {userRole && (
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: 'rgba(19,74,124,0.08)', color: 'var(--jm-blue)', display: 'none' }} className={styles.roleBadge}>
            {userRole.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        )}
        {/* Theme toggle */}
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title={theme === 'light' ? 'Dark mode' : 'Light mode'} style={{ fontSize: '18px' }}>
          {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
        </button>
        {/* RT-029: Profile dropdown */}
        {user && (
          <div className={styles.profileWrap}>
            <button
              className={styles.profileBtn}
              onClick={() => toggleDropdown('profile')}
              aria-expanded={openDropdown === 'profile'}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className={styles.avatar}>
                {user.picture ? (
                  // RT-268: Lazy load avatar image
                  <img src={user.picture} alt="" width={28} height={28} className={styles.avatarImg} loading="lazy" />
                ) : (
                  <span className={styles.avatarInitials}>
                    {(user.name || user.email || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <span className={styles.profileName}>{user.name?.split(' ')[0] || 'Account'}</span>
              <span className={`${styles.chevron} ${openDropdown === 'profile' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
            </button>
            {openDropdown === 'profile' && (
              <div className={`${styles.dropdown} ${styles.profileDropdown}`} style={{ right: 0, left: 'auto', minWidth: 200 }}>
                <div className={styles.profileInfo}>
                  <div className={styles.profileFullName}>{user.name}</div>
                  <div className={styles.profileEmail}>{user.email}</div>
                  {/* RT-070: Role badge in profile dropdown */}
                  {userRole && (
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: 'rgba(19,74,124,0.08)', color: 'var(--jm-blue)' }}>
                      {userRole.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  )}
                </div>
                <div className={styles.dropdownDivider} />
                <Link href="/dashboard/profile" className={styles.dropdownItem} onClick={closeDropdown}>
                  <span className={styles.dropdownIcon}>🏪</span>
                  <div><div className={styles.dropdownLabel}>Store Profile</div></div>
                </Link>
                <Link href="/dashboard/support" className={styles.dropdownItem} onClick={closeDropdown}>
                  <span className={styles.dropdownIcon}>💬</span>
                  <div><div className={styles.dropdownLabel}>Support</div></div>
                </Link>
                {isAdmin && (
                  <Link href="/dashboard/admin" className={styles.dropdownItem} onClick={closeDropdown}>
                    <span className={styles.dropdownIcon}>⚙️</span>
                    <div><div className={styles.dropdownLabel}>Admin Panel</div></div>
                  </Link>
                )}
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.signOutItem}`} onClick={() => { closeDropdown(); logout(); }}>
                  <span className={styles.dropdownIcon}>🚪</span>
                  <div><div className={styles.dropdownLabel} style={{ color: 'var(--jm-red)' }}>Sign Out</div></div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hamburger button (visible on mobile) */}
      <button className={styles.hamburger} onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <Link href="/dashboard" className={styles.mobileNavLink} onClick={closeMobileMenu}>Overview</Link>

        <Link href="/dashboard/generators" className={styles.mobileNavLink} onClick={closeMobileMenu}>Generators</Link>

        <button className={styles.mobileNavLink} onClick={() => toggleDropdown('m_catering')}>
          Catering <span className={`${styles.chevron} ${openDropdown === 'm_catering' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
        </button>
        {openDropdown === 'm_catering' && (
          <div className={styles.mobileDropdownItems}>
            <Link href="/dashboard/flyer" className={styles.mobileDropdownItem} onClick={closeMobileMenu}>
              <span>&#x1F5A8;</span> Catering Flyer
            </Link>
            <Link href="/dashboard/generators/catering-order" className={styles.mobileDropdownItem} onClick={closeMobileMenu}>
              <span>&#x1F4DD;</span> Catering Order
            </Link>
            <Link href="/dashboard/catering-tracker" className={styles.mobileDropdownItem} onClick={closeMobileMenu}>
              <span>&#x1F4CA;</span> Catering Tracker
            </Link>
          </div>
        )}

        <Link href="/dashboard/directives" className={styles.mobileNavLink} onClick={closeMobileMenu}>Directives</Link>
        <Link href="/dashboard/scoreboard" className={styles.mobileNavLink} onClick={closeMobileMenu}>Scoreboard</Link>

        <Link href="/dashboard/reading" className={styles.mobileNavLink} onClick={closeMobileMenu}>Reading</Link>
        <Link href="/dashboard/profile" className={styles.mobileNavLink} onClick={closeMobileMenu}>Store Profile</Link>
        <Link href="/dashboard/support" className={styles.mobileNavLink} onClick={closeMobileMenu}>Support</Link>

        {isAdmin && (
          <Link href="/dashboard/admin" className={styles.mobileNavLink} onClick={closeMobileMenu}>Admin Panel</Link>
        )}

        <div className={styles.mobileDivider}></div>

        {user && (
          <div className={styles.mobileUserInfo}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 4 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{user.email}</div>
            <button onClick={() => { closeMobileMenu(); logout(); }} className={styles.mobileSignOut}>Sign Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
