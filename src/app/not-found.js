// RT-262: 404 page with navigation suggestions
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gray-50)',
      padding: '32px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 48,
        fontWeight: 800,
        color: 'var(--jm-blue)',
        marginBottom: 8,
      }}>404</h1>
      <p style={{ fontSize: 18, color: 'var(--gray-600)', marginBottom: 32 }}>
        This page doesn&apos;t exist.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/dashboard" style={{
          background: 'var(--jm-blue)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 14,
        }}>
          Go to Dashboard
        </Link>
        <Link href="/dashboard/generators" style={{
          background: 'white',
          color: 'var(--jm-blue)',
          padding: '12px 24px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 14,
          border: '1.5px solid var(--jm-blue)',
        }}>
          Open Generators
        </Link>
        <Link href="/dashboard/support" style={{
          background: 'white',
          color: 'var(--gray-600)',
          padding: '12px 24px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 14,
          border: '1px solid var(--border)',
        }}>
          Get Help
        </Link>
      </div>
    </div>
  );
}
