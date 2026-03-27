'use client';

/**
 * ManagerSignature — Auto-generates a manager's digital signature
 * for PDF forms. Renders their name in a cursive style with timestamp
 * and account email. Tied to their authenticated session.
 *
 * Props:
 *   name: string — manager's full name
 *   email: string — manager's @jmvalley.com email (optional, displayed if provided)
 *   date: string — date string (defaults to now)
 *   compact: boolean — smaller version for tight layouts
 */
export default function ManagerSignature({ name, email, date, compact = false }) {
  if (!name) return null;

  const now = new Date();
  const timestamp = date
    ? new Date(date + (date.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const fontSize = compact ? '18pt' : '22pt';
  const metaSize = compact ? '5pt' : '6pt';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: compact ? 1 : 2 }}>
      {/* Cursive signature */}
      <div style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize,
        fontWeight: 700,
        color: '#1a1a2e',
        letterSpacing: '0.3px',
        lineHeight: 1.1,
        borderBottom: '1px solid #2D2D2D',
        paddingBottom: compact ? 2 : 3,
        minWidth: compact ? 120 : 160,
      }}>
        {name}
      </div>
      {/* Metadata line */}
      <div style={{
        display: 'flex',
        gap: compact ? 4 : 6,
        fontSize: metaSize,
        color: '#6b7280',
        fontFamily: "'Poppins', sans-serif",
        fontStyle: 'normal',
      }}>
        <span>Digitally signed {timestamp} at {timeStr}</span>
      </div>
      {email && (
        <div style={{
          fontSize: metaSize,
          color: '#9ca3af',
          fontFamily: "'Poppins', sans-serif",
          fontStyle: 'normal',
        }}>
          {email}
        </div>
      )}
    </div>
  );
}
