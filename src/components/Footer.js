// RT-016: Fixed bottom status bar — matches RC .sbar exactly
import Link from 'next/link';
import styles from './Footer.module.css';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      RO Tools v2.9.3 &nbsp;&middot;&nbsp; &copy; {year} JM Valley Group &nbsp;|&nbsp;{' '}
      <Link href="/dashboard/support">Support</Link>
      &nbsp;|&nbsp;
      <Link href="/dashboard/updates">Changelog</Link>
      &nbsp;|&nbsp;
      <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
    </footer>
  );
}
