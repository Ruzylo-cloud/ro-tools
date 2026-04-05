'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

const GENERATOR_ROUTES = {
  'written-warning': '/dashboard/generators/written-warning',
  'evaluation': '/dashboard/generators/evaluation',
  'resignation': '/dashboard/generators/resignation',
  'termination': '/dashboard/generators/termination',
  'meal-break-waiver': '/dashboard/generators/meal-break-waiver',
  'attestation-correction': '/dashboard/generators/attestation-correction',
  'onboarding-packets': '/dashboard/generators/onboarding-packets',
};

const TYPE_LABELS = {
  'written-warning': 'Written Warning',
  'evaluation': 'Performance Evaluation',
  'resignation': 'Employee Resignation',
  'termination': 'Employee Termination',
  'meal-break-waiver': 'Meal Break Waiver',
  'attestation-correction': 'Attestation Correction',
  'onboarding-packets': 'Onboarding Packet',
};

function StatusBadge({ status }) {
  const styles = {
    pending: { background: 'rgba(234,179,8,0.12)', color: '#a16207', border: '1px solid rgba(234,179,8,0.3)' },
    signed: { background: 'rgba(22,163,74,0.1)', color: '#15803d', border: '1px solid rgba(22,163,74,0.25)' },
  };
  const s = styles[status] || { background: 'var(--gray-100)', color: 'var(--gray-500)', border: '1px solid var(--border)' };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, ...s }}>
      {status === 'pending' ? '⏳ Awaiting Signature' : '✅ Signed'}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

function isExpired(createdAt) {
  return Date.now() - new Date(createdAt).getTime() > 72 * 60 * 60 * 1000;
}

export default function SignaturesPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | signed
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    fetch('/api/signing')
      .then(r => r.json())
      .then(data => { setRequests(data.requests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = requests.filter(r => {
    if (filter === 'pending') return r.status === 'pending' && !isExpired(r.createdAt);
    if (filter === 'signed') return r.status === 'signed';
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'pending' && !isExpired(r.createdAt)).length;
  const signedCount = requests.filter(r => r.status === 'signed').length;

  const copyLink = async (token) => {
    const url = `${window.location.origin}/sign/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch { showToast('Failed to copy', 'error'); }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 6 }}>
          Signatures
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
          Track signing requests sent from your generators. Links expire after 72 hours.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: requests.length, color: 'var(--jm-blue)' },
          { label: 'Awaiting', value: pendingCount, color: '#d97706' },
          { label: 'Signed', value: signedCount, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 100px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'pending', 'signed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
              background: filter === f ? 'var(--jm-blue)' : 'var(--white)',
              color: filter === f ? '#fff' : 'var(--gray-500)',
              fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Awaiting' : 'Signed'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gray-400)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', background: 'var(--white)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✍</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--jm-blue)', marginBottom: 6 }}>No signing requests yet</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            Open any generator with the ✍ e-sign badge and click "Send for Signature".
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => {
            const expired = r.status === 'pending' && isExpired(r.createdAt);
            return (
              <div
                key={r.token}
                style={{
                  background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px',
                  opacity: expired ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
                      {r.documentTitle || TYPE_LABELS[r.documentType] || r.documentType}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 6 }}>
                      <span style={{ marginRight: 12 }}>👤 {r.employeeName}</span>
                      <span style={{ marginRight: 12 }}>📧 {r.employeeEmail}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                      Sent {formatDate(r.createdAt)}
                      {r.signedAt && <span style={{ marginLeft: 12, color: '#16a34a' }}>Signed {formatDate(r.signedAt)}</span>}
                      {expired && <span style={{ marginLeft: 12, color: '#dc2626', fontWeight: 600 }}>Expired</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {expired ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}>
                        Expired
                      </span>
                    ) : (
                      <StatusBadge status={r.status} />
                    )}
                    {r.status === 'pending' && !expired && (
                      <button
                        onClick={() => copyLink(r.token)}
                        style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--jm-blue)' }}
                      >
                        {copiedToken === r.token ? '✓ Copied' : '🔗 Copy Link'}
                      </button>
                    )}
                    {r.status === 'signed' && GENERATOR_ROUTES[r.documentType] && (
                      <a
                        href={`${GENERATOR_ROUTES[r.documentType]}?sign_token=${r.token}`}
                        style={{ padding: '6px 12px', border: '1px solid #16a34a', borderRadius: 8, background: 'rgba(22,163,74,0.07)', textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#16a34a', display: 'inline-block' }}
                      >
                        📄 Finalize PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
