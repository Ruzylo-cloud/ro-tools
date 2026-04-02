'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();

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

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo} onClick={closeDropdown}>
          <Image src="/jmvg-logo.png" alt="JM Valley Group" width={72} height={36} style={{ borderRadius: '4px', objectFit: 'contain' }} />
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
              className={`${styles.navLink} ${openDropdown === 'catering' || isActive('/dashboard/catering') || isActive('/dashboard/generators/catering') ? styles.navLinkActive : ''}`}
              onClick={() => toggleDropdown('catering')}
              aria-expanded={openDropdown === 'catering'}
              aria-haspopup="true"
            >
              Catering <span className={`${styles.chevron} ${openDropdown === 'catering' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
            </button>
            {openDropdown === 'catering' && (
              <div className={styles.dropdown}>
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

          {/* 7. Store Profile */}
          <div className={styles.navItem}>
            <Link href="/dashboard/profile" className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.navLinkActive : ''}`} onClick={closeDropdown}>Store Profile</Link>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {/* RT-064: Notification bell */}
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
        {/* Support icon */}
        <Link href="/dashboard/support" className={styles.iconBtn} onClick={closeDropdown} aria-label="Support and feedback" title="Support">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </Link>
        {/* Admin gear icon — conditional */}
        {isAdmin && (
          <Link href="/dashboard/admin" className={styles.iconBtn} onClick={closeDropdown} aria-label="Admin Panel" title="Admin Panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        )}
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
                  <img src={user.picture} alt="" width={28} height={28} className={styles.avatarImg} />
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
