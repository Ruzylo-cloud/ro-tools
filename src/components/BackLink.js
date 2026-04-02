// RT-015: Back to Dashboard link for all sub-pages
import Link from 'next/link';

export default function BackLink({ href = '/dashboard', label = 'Back to Dashboard' }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--jm-blue)',
        textDecoration: 'none',
        marginBottom: '20px',
        opacity: 0.8,
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
    >
      ← {label}
    </Link>
  );
}
