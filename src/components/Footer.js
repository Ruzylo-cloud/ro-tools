// RT-016: Footer with version number and support link
import Link from 'next/link';
import { changelog } from '@/lib/changelog';
import styles from './Footer.module.css';

const version = changelog[0]?.version || 'v2.6';
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <span className={styles.brand}>RO Tools</span>
        <span className={styles.version}>{version}</span>
        <span className={styles.sep}>·</span>
        <span className={styles.copy}>© {year} JM Valley Group</span>
      </div>
      <div className={styles.right}>
        <Link href="/dashboard/support" className={styles.link}>Support</Link>
        <span className={styles.sep}>·</span>
        <Link href="/dashboard/updates" className={styles.link}>Changelog</Link>
        <span className={styles.sep}>·</span>
        <Link href="/privacy" className={styles.link}>Privacy</Link>
      </div>
    </footer>
  );
}
