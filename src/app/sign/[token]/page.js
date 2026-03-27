'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';

export default function SigningPage({ params }) {
  const { token } = params;
  const canvasRef = useRef(null);
  const [signingData, setSigningData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, ready, signed, already-signed, expired, not-found, error
  const [signedAt, setSignedAt] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch signing request data
  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/signing/${token}`);
        if (res.ok) {
          const data = await res.json();
          setSigningData(data);
          setStatus('ready');
        } else if (res.status === 404) {
          setStatus('not-found');
        } else if (res.status === 410) {
          const data = await res.json();
          if (data.signedAt) {
            setSignedAt(data.signedAt);
            setStatus('already-signed');
          } else {
            setStatus('expired');
          }
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }
    fetchRequest();
  }, [token]);

  // Initialize canvas
  useEffect(() => {
    if (status !== 'ready' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
  }, [status]);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  }, [getPos]);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback((e) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    setHasDrawn(false);
  }, []);

  const handleSubmit = async () => {
    if (!hasDrawn || submitting) return;
    setSubmitting(true);
    setErrorMsg('');

    const canvas = canvasRef.current;
    if (!canvas) {
      setSubmitting(false);
      return;
    }

    const signatureDataUrl = canvas.toDataURL('image/png');

    try {
      const res = await fetch(`/api/signing/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureDataUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setSignedAt(data.signedAt);
        setStatus('signed');
      } else {
        const data = await res.json();
        if (res.status === 410) {
          if (data.signedAt) {
            setSignedAt(data.signedAt);
            setStatus('already-signed');
          } else {
            setStatus('expired');
          }
        } else {
          setErrorMsg(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
    }
    setSubmitting(false);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // Not found
  if (status === 'not-found') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>&#128269;</div>
          <h1 className={styles.statusTitle}>Document Not Found</h1>
          <p className={styles.statusMessage}>
            This signing link is invalid or the document has been removed.
          </p>
          <span className={styles.errorBadge}>Invalid Link</span>
        </div>
        <p className={styles.footer}>RO Tools &mdash; JM Valley Group</p>
      </div>
    );
  }

  // Expired
  if (status === 'expired') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>&#9203;</div>
          <h1 className={styles.statusTitle}>Link Expired</h1>
          <p className={styles.statusMessage}>
            This signing link has expired. Please contact your manager to request a new one.
          </p>
          <span className={styles.errorBadge}>Expired</span>
        </div>
        <p className={styles.footer}>RO Tools &mdash; JM Valley Group</p>
      </div>
    );
  }

  // Already signed
  if (status === 'already-signed') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>&#9989;</div>
          <h1 className={styles.statusTitle}>Already Signed</h1>
          <p className={styles.statusMessage}>
            This document has already been signed.
          </p>
          {signedAt && (
            <p className={styles.statusTimestamp}>
              Signed on {new Date(signedAt).toLocaleString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true,
              })}
            </p>
          )}
          <span className={styles.successBadge}>Completed</span>
        </div>
        <p className={styles.footer}>RO Tools &mdash; JM Valley Group</p>
      </div>
    );
  }

  // Success after signing
  if (status === 'signed') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>&#10004;&#65039;</div>
          <h1 className={styles.statusTitle}>Document Signed</h1>
          <p className={styles.statusMessage}>
            Thank you, {signingData?.employeeName}. Your signature has been recorded.
          </p>
          {signedAt && (
            <p className={styles.statusTimestamp}>
              Signed on {new Date(signedAt).toLocaleString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true,
              })}
            </p>
          )}
          <span className={styles.successBadge}>Signature Recorded</span>
        </div>
        <p className={styles.footer}>RO Tools &mdash; JM Valley Group</p>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>&#9888;&#65039;</div>
          <h1 className={styles.statusTitle}>Something Went Wrong</h1>
          <p className={styles.statusMessage}>
            We couldn&apos;t load this document. Please try again or contact your manager.
          </p>
          <span className={styles.errorBadge}>Error</span>
        </div>
        <p className={styles.footer}>RO Tools &mdash; JM Valley Group</p>
      </div>
    );
  }

  // Main signing form
  const createdDate = signingData?.createdAt
    ? new Date(signingData.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : '';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>JM Valley Group</h1>
          <p className={styles.headerSub}>Secure Document Signing</p>
        </div>
        <div className={styles.body}>
          {/* Document Info */}
          <div className={styles.docInfo}>
            <p className={styles.docLabel}>Document</p>
            <h2 className={styles.docTitle}>{signingData.documentTitle}</h2>
            <div className={styles.docMeta}>
              <div className={styles.docMetaItem}>
                <span className={styles.docMetaLabel}>Type:</span>
                <span>{signingData.documentType}</span>
              </div>
              <div className={styles.docMetaItem}>
                <span className={styles.docMetaLabel}>Employee:</span>
                <span>{signingData.employeeName}</span>
              </div>
              <div className={styles.docMetaItem}>
                <span className={styles.docMetaLabel}>From:</span>
                <span>{signingData.managerName}</span>
              </div>
              {createdDate && (
                <div className={styles.docMetaItem}>
                  <span className={styles.docMetaLabel}>Date:</span>
                  <span>{createdDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature Pad */}
          <p className={styles.signPrompt}>
            Please sign below to acknowledge this document
          </p>
          <div className={styles.canvasWrapper}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className={styles.canvasActions}>
            <span className={styles.canvasHint}>
              {hasDrawn ? 'Signature captured' : 'Draw your signature above'}
            </span>
            <button className={styles.clearBtn} onClick={clearCanvas} type="button">
              Clear
            </button>
          </div>

          {errorMsg && (
            <p style={{ color: '#EE3227', fontSize: '14px', textAlign: 'center', marginBottom: 16 }}>
              {errorMsg}
            </p>
          )}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!hasDrawn || submitting}
            type="button"
          >
            {submitting ? 'Submitting...' : 'Sign Document'}
          </button>

          <p className={styles.legalText}>
            By clicking &ldquo;Sign Document&rdquo;, you agree that your electronic signature is the
            legal equivalent of your manual signature on this document. Your IP address and
            timestamp will be recorded.
          </p>
        </div>
      </div>
      <p className={styles.footer}>RO Tools &mdash; JM Valley Group</p>
    </div>
  );
}
