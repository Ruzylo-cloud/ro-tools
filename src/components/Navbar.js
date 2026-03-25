'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setIsAdmin(data.isAdmin || false))
      .catch(() => {});
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo}>
          <Image src="/nfl-x-jm-revised.jpeg" alt="RO Tools" width={72} height={36} style={{ borderRadius: '4px' }} />
          <span className={styles.logoText}>RO <span>Tools</span></span>
        </Link>
        <div className={styles.links}>
          <div className={styles.navItem}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          </div>

          <div className={styles.navItem}>
            <button className={styles.navLink}>
              Generators <span className={styles.chevron}>&#x25BE;</span>
            </button>
            <div className={styles.dropdown}>
              <Link href="/dashboard/flyer" className={styles.dropdownItem}>Catering Flyer</Link>
            </div>
          </div>

          <div className={styles.navItem}>
            <button className={styles.navLink}>
              Catering <span className={styles.chevron}>&#x25BE;</span>
            </button>
            <div className={styles.dropdown}>
              <span className={`${styles.dropdownItem} ${styles.comingSoon}`}>
                Catering Tracker <span className={styles.comingSoonBadge}>Soon</span>
              </span>
            </div>
          </div>

          <div className={styles.navItem}>
            <button className={styles.navLink}>
              Directives <span className={styles.chevron}>&#x25BE;</span>
            </button>
            <div className={styles.dropdown}>
              <span className={`${styles.dropdownItem} ${styles.comingSoon}`}>
                Coming Soon <span className={styles.comingSoonBadge}>Soon</span>
              </span>
            </div>
          </div>

          <div className={styles.navItem}>
            <Link href="/dashboard/profile" className={styles.navLink}>Store Profile</Link>
          </div>

          <div className={styles.navItem}>
            <Link href="/dashboard/updates" className={styles.navLink}>Updates</Link>
          </div>

          <div className={styles.navItem}>
            <Link href="/dashboard/support" className={styles.navLink}>Support</Link>
          </div>

          {isAdmin && (
            <div className={styles.navItem}>
              <Link href="/dashboard/admin" className={`${styles.navLink} ${styles.navLinkActive}`}>Admin</Link>
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button onClick={logout} className={styles.signOut}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}
