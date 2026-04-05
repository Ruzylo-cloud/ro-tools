'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';

/**
 * ESignButton — "Send for Signature" button + modal for e-sign generators.
 *
 * Props:
 *   documentTitle  — e.g. "Written Warning — John Smith"
 *   documentType   — e.g. "written-warning"
 *   employeeName   — pre-fill the modal
 *   formData       — full form data to store with the signing request
 *   disabled       — disable if required fields not filled
 */
export default function ESignButton({ documentTitle, documentType, employeeName, formData, disabled }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [signingUrl, setSigningUrl] = useState(null);
  const [copyLabel, setCopyLabel] = useState('Copy Link');

  // Suggest email from name
  const suggestedEmail = employeeName
    ? employeeName.toLowerCase().replace(/\s+/g, '.') + '@jmvalley.com'
    : '';

  const handleOpen = () => {
    setEmail(suggestedEmail);
    setSigningUrl(null);
    setCopyLabel('Copy Link');
    setOpen(true);
  };

  const handleSend = async () => {
    if (!email || !email.endsWith('@jmvalley.com')) {
      showToast('Email must be a @jmvalley.com address.', 'error');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/signing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          documentTitle,
          employeeName,
          employeeEmail: email,
          formData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.signingUrl) {
        setSigningUrl(data.signingUrl);
        showToast('Signing request sent!', 'success');
      } else {
        showToast(data.error || 'Failed to create signing request.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
    setSending(false);
  };

  const handleCopy = () => {
    if (!signingUrl) return;
    navigator.clipboard.writeText(signingUrl).then(() => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy Link'), 2000);
    }).catch(() => showToast('Failed to copy', 'error'));
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '12px',
          background: disabled ? 'var(--gray-200)' : 'linear-gradient(135deg, #134A7C 0%, #1a5a94 100%)',
          color: disabled ? 'var(--gray-500)' : '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'opacity 0.15s',
        }}
        title={disabled ? 'Fill required fields first' : 'Send document for employee signature'}
      >
        ✍ Send for Signature
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px',
          }}
        >
          <div style={{
            background: 'var(--white)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--jm-blue)', marginBottom: '4px' }}>
                  Send for Signature
                </div>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                  Employee will receive an email with a signing link.
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 1, padding: '0 0 0 12px' }}>×</button>
            </div>

            {!signingUrl ? (
              <>
                {/* Document info */}
                <div style={{ background: 'rgba(19,74,124,0.06)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Document</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--jm-blue)' }}>{documentTitle || documentType}</div>
                  {employeeName && (
                    <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}>Employee: {employeeName}</div>
                  )}
                </div>

                {/* Email input */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Employee Email <span style={{ color: 'var(--jm-red)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="firstname.lastname@jmvalley.com"
                    autoFocus
                    style={{
                      width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px',
                      fontSize: '14px', color: 'var(--text)', background: 'var(--white)', outline: 'none', boxSizing: 'border-box',
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '4px' }}>
                    Must be a @jmvalley.com address. Link expires in 72 hours.
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setOpen(false)} style={{ flex: 1, padding: '11px', border: '1px solid var(--border)', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sending || !email}
                    style={{
                      flex: 2, padding: '11px', background: sending ? 'var(--gray-300)' : '#134A7C',
                      color: '#fff', border: 'none', borderRadius: '8px', cursor: sending ? 'default' : 'pointer',
                      fontSize: '14px', fontWeight: 700,
                    }}
                  >
                    {sending ? 'Sending...' : '✉ Send Signing Request'}
                  </button>
                </div>
              </>
            ) : (
              /* Success state */
              <>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', marginBottom: '6px' }}>Request Sent!</div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                    {employeeName || 'Employee'} will receive an email to sign the document.
                  </div>
                </div>
                <div style={{ background: 'var(--gray-100)', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '4px' }}>Signing Link</div>
                  <div style={{ fontSize: '12px', color: 'var(--text)', wordBreak: 'break-all', fontFamily: 'monospace' }}>{signingUrl}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCopy} style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    {copyLabel}
                  </button>
                  <button onClick={() => setOpen(false)} style={{ flex: 1, padding: '10px', background: '#134A7C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
