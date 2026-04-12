'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const BOARD_COLORS = {
  general: '#134A7C', injuries: '#DC2626', maintenance: '#EA580C', cleaning: '#16A34A',
};

const ManagerLogPreview = forwardRef(function ManagerLogPreview({ data }, ref) {
  const {
    logDate = '', storeNumber = '', storeName = '', managerName = '', userEmail = '',
    boards = [],
  } = data || {};

  const formatDate = (d) => {
    if (!d) return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const sectionHdr = (text, color) => (
    <div style={{
      background: color || '#134A7C', color: '#fff', fontSize: '7pt', fontWeight: 700,
      padding: '2px 8px', borderRadius: '2px', marginBottom: '3px', marginTop: '6px',
      letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px',
    }}>
      <span>{text}</span>
    </div>
  );

  const entryRow = (entry, idx) => (
    <div key={idx} style={{
      padding: '3px 6px', borderLeft: '2px solid #e5e7eb', marginBottom: '3px',
      marginLeft: '4px',
    }}>
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
        {entry.content || '(empty)'}
      </div>
      <div style={{ fontSize: '5.5pt', color: '#9ca3af', marginTop: '1px' }}>
        {entry.time || ''} {entry.author ? `— ${entry.author}` : ''}
      </div>
    </div>
  );

  const defaultBoards = [
    { name: 'General', key: 'general', entries: [] },
    { name: 'Injuries / Safety', key: 'injuries', entries: [] },
    { name: 'Maintenance', key: 'maintenance', entries: [] },
    { name: 'Cleaning', key: 'cleaning', entries: [] },
  ];

  const displayBoards = boards.length > 0 ? boards : defaultBoards;

  return (
    <div
      ref={ref}
      style={{
        width: '612px', minHeight: '792px', background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex', flexDirection: 'column', margin: '0 auto',
      }}
    >
      <div style={{ height: '5px', background: '#EE3227' }} />
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JMVG" style={{ height: '70px', width: '70px', objectFit: 'contain' }} crossOrigin="anonymous" />
      </div>
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 4px' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>JM VALLEY GROUP</div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          JERSEY MIKE&apos;S SUBS &mdash; FRANCHISE OPERATIONS
        </div>
      </div>
      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      <div style={{ padding: '0 28px' }}>
        <div style={{
          textAlign: 'center', fontSize: '11pt', fontWeight: 800, color: '#134A7C',
          letterSpacing: '1px', padding: '4px 0 2px',
        }}>
          DAILY MANAGER LOG
        </div>
        <div style={{ textAlign: 'center', fontSize: '7pt', color: '#6b7280', marginBottom: '4px' }}>
          {formatDate(logDate)}
        </div>

        {/* Store / Manager info */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
          <div style={{ flex: 0.3 }}>
            <span style={{ fontSize: '6pt', color: '#6b7280', fontWeight: 500 }}>Store #</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7.5pt', fontWeight: 600, color: '#2D2D2D', minHeight: '12px' }}>
              {storeNumber}
            </div>
          </div>
          <div style={{ flex: 0.7 }}>
            <span style={{ fontSize: '6pt', color: '#6b7280', fontWeight: 500 }}>Store Name</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7.5pt', fontWeight: 600, color: '#2D2D2D', minHeight: '12px' }}>
              {storeName}
            </div>
          </div>
        </div>

        {/* Board sections */}
        {displayBoards.map((board, bi) => (
          <div key={bi}>
            {sectionHdr(board.name.toUpperCase(), BOARD_COLORS[board.key] || '#134A7C')}
            {board.entries && board.entries.length > 0 ? (
              board.entries.map((entry, ei) => entryRow(entry, ei))
            ) : (
              <div style={{
                border: '1px dashed #d1d5db', borderRadius: '2px', padding: '6px',
                fontSize: '6pt', color: '#9ca3af', textAlign: 'center',
                marginBottom: '3px', minHeight: '24px',
              }}>
                No entries &mdash; add notes in the form
              </div>
            )}
          </div>
        ))}

        {/* Manager signature */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: '14px' }}>
              <ManagerSignature name={managerName} email={userEmail} compact />
            </div>
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Manager on Duty</div>
          </div>
          <div style={{ width: '100px' }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '5.5pt', padding: '4px 28px', fontWeight: 400, lineHeight: 1.3,
      }}>
        Property of JM Valley Group. All rights reserved. Confidential &mdash; not for distribution.
      </div>
    </div>
  );
});

export default ManagerLogPreview;
