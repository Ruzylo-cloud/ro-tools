'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.logo}>
          <Image src="/nfl-x-jm-revised.jpeg" alt="RO Tools" width={72} height={36} style={{ borderRadius: '4px' }} />
          <span className={styles.logoText}>RO <span>Tools</span></span>
        </Link>
        <div className={styles.links}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/flyer">Flyer Generator</Link>
          <Link href="/dashboard/profile">Store Profile</Link>
        </div>
      </div>
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.userName}>{user.displayName}</span>
            <button onClick={logout} className={styles.signOut}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}
