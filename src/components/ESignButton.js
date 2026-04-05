'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/Toast';

/**
 * ESignButton — "Send for Signature" button + modal.
 * Works two ways:
 *   1. Email flow — enter any email, employee gets a link in their inbox
 *   2. Link flow  — no email needed, manager copies/shares the link directly
 *                   (for crew who sign in by PIN only)
 */
export default function ESignButton({ documentTitle, documentType, employeeName, formData, disabled }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { signingUrl, emailSent }
  const [copyLabel, setCopyLabel] = useState('Copy Link');
  const [showQr, setShowQr] = useState(false);
  const inputRef = useRef(null);

  // Focus email input when modal opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleOpen = () => {
    setEmail('');
    setResult(null);
    setCopyLabel('Copy Link');
    setShowQr(false);
    setOpen(true);
  };

  const handleSend = async () => {
    // Basic format check if email provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Enter a valid email address or leave it blank.', 'error');
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
          employeeEmail: email || undefined,
          formData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.signingUrl) {
        setResult({ signingUrl: data.signingUrl, emailSent: data.emailSent });
        if (email && data.emailSent) {
          showToast('Signing request sent via email!', 'success');
        } else if (email && !data.emailSent) {
          showToast('Link generated — email failed, share manually.', 'warning');
        } else {
          showToast('Signing link generated!', 'success');
        }
      } else {
        showToast(data.error || 'Failed to create signing request.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
    setSending(false);
  };

  const handleCopy = () => {
    if (!result?.signingUrl) return;
    navigator.clipboard.writeText(result.signingUrl).then(() => {
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
            background: 'var(--white)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '460px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--jm-blue)', marginBottom: '2px' }}>
                  Send for Signature
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                  Email optional — crew members can sign via a shared link too.
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 1, padding: '0 0 0 12px' }}>×</button>
            </div>

            {!result ? (
              <>
                {/* Document info */}
                <div style={{ background: 'rgba(19,74,124,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Document</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--jm-blue)' }}>{documentTitle || documentType}</div>
                  {employeeName && (
                    <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>Employee: {employeeName}</div>
                  )}
                </div>

                {/* Email input — optional */}
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Employee Email <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(optional)</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Leave blank to get a shareable link"
                    style={{
                      width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px',
                      fontSize: '14px', color: 'var(--text)', background: 'var(--white)', outline: 'none', boxSizing: 'border-box',
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  />
                </div>

                {/* Context hint */}
                <div style={{ fontSize: '11px', color: 'var(--gray-400)', marginBottom: '20px', lineHeight: 1.5 }}>
                  {email
                    ? 'Employee will receive an email with the signing link (72-hour expiry).'
                    : 'A signing link will be generated — you can text it, open it on a shared tablet, or show a QR code.'}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setOpen(false)} style={{ flex: 1, padding: '11px', border: '1px solid var(--border)', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    style={{
                      flex: 2, padding: '11px',
                      background: sending ? 'var(--gray-300)' : '#134A7C',
                      color: '#fff', border: 'none', borderRadius: '8px',
                      cursor: sending ? 'default' : 'pointer',
                      fontSize: '14px', fontWeight: 700,
                    }}
                  >
                    {sending ? 'Generating...' : email ? '✉ Send via Email' : '🔗 Get Signing Link'}
                  </button>
                </div>
              </>
            ) : (
              /* Success state */
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>
                    {result.emailSent ? '✅' : '🔗'}
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: result.emailSent ? '#16a34a' : 'var(--jm-blue)', marginBottom: '4px' }}>
                    {result.emailSent ? 'Email Sent!' : 'Link Ready'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                    {result.emailSent
                      ? `${employeeName || 'Employee'} will receive an email to sign.`
                      : 'Share this link with the employee to collect their signature.'}
                  </div>
                </div>

                {/* Link display */}
                <div style={{ background: 'var(--gray-100)', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '4px' }}>Signing Link</div>
                  <div style={{ fontSize: '12px', color: 'var(--text)', wordBreak: 'break-all', fontFamily: 'monospace' }}>{result.signingUrl}</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button
                    onClick={handleCopy}
                    style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}
                  >
                    {copyLabel}
                  </button>
                  <button
                    onClick={() => window.open(result.signingUrl, '_blank')}
                    style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--jm-blue)' }}
                    title="Open signing page on this device for in-person signing"
                  >
                    Open Here
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ flex: 1, padding: '10px', background: '#134A7C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
                  >
                    Done
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--gray-400)', textAlign: 'center' }}>
                  Link expires in 72 hours &bull; Valid for one signature
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
