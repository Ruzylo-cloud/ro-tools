'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setIsAdmin(data.isAdmin || false))
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

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo} onClick={closeDropdown}>
          <Image src="/nfl-x-jm-revised.jpeg" alt="RO Tools" width={72} height={36} style={{ borderRadius: '4px' }} />
          <span className={styles.logoText}>RO <span>Tools</span></span>
        </Link>
        <div className={styles.links}>
          {/* 1. Dashboard */}
          <div className={styles.navItem}>
            <Link href="/dashboard" className={styles.navLink} onClick={closeDropdown}>Dashboard</Link>
          </div>

          {/* 2. Generators (dropdown) */}
          <div className={styles.navItem}>
            <button
              className={`${styles.navLink} ${openDropdown === 'generators' ? styles.navLinkActive : ''}`}
              onClick={() => toggleDropdown('generators')}
              aria-expanded={openDropdown === 'generators'}
              aria-haspopup="true"
            >
              Generators <span className={`${styles.chevron} ${openDropdown === 'generators' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
            </button>
            {openDropdown === 'generators' && (
              <div className={styles.dropdown}>
                <Link href="/dashboard/flyer" className={styles.dropdownItem} onClick={closeDropdown}>
                  <span className={styles.dropdownIcon}>&#x1F4CB;</span>
                  <div>
                    <div className={styles.dropdownLabel}>Catering Flyer</div>
                    <div className={styles.dropdownHint}>Print-ready PDF with store info</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Catering (dropdown) */}
          <div className={styles.navItem}>
            <button
              className={`${styles.navLink} ${openDropdown === 'catering' ? styles.navLinkActive : ''}`}
              onClick={() => toggleDropdown('catering')}
              aria-expanded={openDropdown === 'catering'}
              aria-haspopup="true"
            >
              Catering <span className={`${styles.chevron} ${openDropdown === 'catering' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
            </button>
            {openDropdown === 'catering' && (
              <div className={styles.dropdown}>
                <span className={`${styles.dropdownItem} ${styles.comingSoon}`}>
                  <span className={styles.dropdownIcon}>&#x1F4CA;</span>
                  <div>
                    <div className={styles.dropdownLabel}>Catering Tracker <span className={styles.comingSoonBadge}>Soon</span></div>
                    <div className={styles.dropdownHint}>Track prospects and follow-ups</div>
                  </div>
                </span>
              </div>
            )}
          </div>

          {/* 4. Directives (dropdown) */}
          <div className={styles.navItem}>
            <button
              className={`${styles.navLink} ${openDropdown === 'directives' ? styles.navLinkActive : ''}`}
              onClick={() => toggleDropdown('directives')}
              aria-expanded={openDropdown === 'directives'}
              aria-haspopup="true"
            >
              Directives <span className={`${styles.chevron} ${openDropdown === 'directives' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
            </button>
            {openDropdown === 'directives' && (
              <div className={styles.dropdown}>
                <span className={`${styles.dropdownItem} ${styles.comingSoon}`}>
                  <span className={styles.dropdownIcon}>&#x1F4DD;</span>
                  <div>
                    <div className={styles.dropdownLabel}>Coming Soon <span className={styles.comingSoonBadge}>Soon</span></div>
                    <div className={styles.dropdownHint}>Company directives and policies</div>
                  </div>
                </span>
              </div>
            )}
          </div>

          {/* 5. Store Profile */}
          <div className={styles.navItem}>
            <Link href="/dashboard/profile" className={styles.navLink} onClick={closeDropdown}>Store Profile</Link>
          </div>

          {/* 6. Support */}
          <div className={styles.navItem}>
            <Link href="/dashboard/support" className={styles.navLink} onClick={closeDropdown}>Support</Link>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {/* Admin gear icon — conditional */}
        {isAdmin && (
          <Link href="/dashboard/admin" className={styles.gearBtn} onClick={closeDropdown} title="Admin Panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        )}
        {user && (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button onClick={logout} className={styles.signOut}>Sign Out</button>
          </>
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
        <Link href="/dashboard" className={styles.mobileNavLink} onClick={closeMobileMenu}>Dashboard</Link>

        <button className={styles.mobileNavLink} onClick={() => toggleDropdown('m_generators')}>
          Generators <span className={`${styles.chevron} ${openDropdown === 'm_generators' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
        </button>
        {openDropdown === 'm_generators' && (
          <div className={styles.mobileDropdownItems}>
            <Link href="/dashboard/flyer" className={styles.mobileDropdownItem} onClick={closeMobileMenu}>
              <span>&#x1F4CB;</span> Catering Flyer
            </Link>
          </div>
        )}

        <button className={styles.mobileNavLink} onClick={() => toggleDropdown('m_catering')}>
          Catering <span className={`${styles.chevron} ${openDropdown === 'm_catering' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
        </button>
        {openDropdown === 'm_catering' && (
          <div className={styles.mobileDropdownItems}>
            <span className={styles.mobileDropdownItem} style={{ color: 'var(--gray-400)' }}>
              <span>&#x1F4CA;</span> Catering Tracker (Coming Soon)
            </span>
          </div>
        )}

        <button className={styles.mobileNavLink} onClick={() => toggleDropdown('m_directives')}>
          Directives <span className={`${styles.chevron} ${openDropdown === 'm_directives' ? styles.chevronOpen : ''}`}>&#x25BE;</span>
        </button>
        {openDropdown === 'm_directives' && (
          <div className={styles.mobileDropdownItems}>
            <span className={styles.mobileDropdownItem} style={{ color: 'var(--gray-400)' }}>
              <span>&#x1F4DD;</span> Coming Soon
            </span>
          </div>
        )}

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
