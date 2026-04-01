'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const CATEGORIES = [
  'Exterior & Parking Lot', 'Lobby & Dining Area', 'Restrooms', 'Front Line',
  'Meat Case & Cold Side', 'Hot Side & Grill', 'Walk-In Cooler', 'Dry Storage',
  'Back of House', 'Employee Appearance', 'Customer Service', 'Food Safety & Temps',
  'Signage & Marketing', 'Overall Store Cleanliness',
];

function gradeFromPct(pct) {
  if (pct >= 95) return { grade: 'A+', color: '#16A34A' };
  if (pct >= 90) return { grade: 'A', color: '#16A34A' };
  if (pct >= 85) return { grade: 'B+', color: '#2563EB' };
  if (pct >= 80) return { grade: 'B', color: '#2563EB' };
  if (pct >= 70) return { grade: 'C', color: '#D97706' };
  return { grade: 'D', color: '#DC2626' };
}

function scoreColor(s) {
  const n = parseInt(s) || 0;
  if (n >= 9) return '#16A34A';
  if (n >= 7) return '#2563EB';
  if (n >= 5) return '#D97706';
  return '#DC2626';
}

const DMWalkthroughPreview = forwardRef(function DMWalkthroughPreview({ data }, ref) {
  const {
    storeNumber = '', storeName = '', inspectorName = '', inspectionDate = '',
    scores = {}, notes = {}, actionItems = [], userEmail = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  const totalScore = CATEGORIES.reduce((sum, c) => sum + (parseInt(scores[c]) || 0), 0);
  const maxScore = CATEGORIES.length * 10;
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const { grade, color: gradeColor } = gradeFromPct(pct);

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
      <div style={{ textAlign: 'center', padding: '4px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JMVG" style={{ height: '60px', width: 'auto' }} crossOrigin="anonymous" />
      </div>
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 3px' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '7pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>JM VALLEY GROUP</div>
        <div style={{ fontSize: '5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '1px' }}>
          JERSEY MIKE&apos;S SUBS &mdash; FRANCHISE OPERATIONS
        </div>
      </div>
      <div style={{ height: '1px', background: '#EE3227', margin: '1px 28px 3px' }} />

      <div style={{ padding: '0 28px' }}>
        <div style={{
          textAlign: 'center', fontSize: '10pt', fontWeight: 800, color: '#134A7C',
          letterSpacing: '1px', padding: '2px 0 1px',
        }}>
          DM STORE WALK-THROUGH
        </div>

        {/* Grade badge */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <span style={{
            display: 'inline-block', background: gradeColor, color: '#fff',
            fontSize: '10pt', fontWeight: 800, padding: '2px 12px', borderRadius: '4px',
          }}>
            {grade} &mdash; {pct}%
          </span>
          <span style={{ fontSize: '6pt', color: '#6b7280', marginLeft: '6px' }}>
            {totalScore}/{maxScore} points
          </span>
        </div>

        {/* Store info */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
          <div style={{ flex: 0.25 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Store #</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{storeNumber}</div>
          </div>
          <div style={{ flex: 0.45 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Store Name</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{storeName}</div>
          </div>
          <div style={{ flex: 0.3 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Date</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{formatDate(inspectionDate)}</div>
          </div>
        </div>

        {/* Scoring table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2px', fontSize: '6.5pt' }}>
          <thead>
            <tr style={{ background: '#134A7C', color: '#fff' }}>
              <th style={{ padding: '2px 4px', textAlign: 'left', fontWeight: 700, fontSize: '6pt' }}>CATEGORY</th>
              <th style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 700, width: '40px', fontSize: '6pt' }}>SCORE</th>
              <th style={{ padding: '2px 4px', textAlign: 'left', fontWeight: 700, fontSize: '6pt' }}>NOTES</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat, i) => {
              const s = scores[cat] || '';
              return (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={{ padding: '2px 4px', color: '#2D2D2D', fontWeight: 500, fontSize: '6pt' }}>{cat}</td>
                  <td style={{ padding: '2px 4px', textAlign: 'center', fontWeight: 700, color: s ? scoreColor(s) : '#999' }}>
                    {s ? `${s}/10` : '—'}
                  </td>
                  <td style={{ padding: '2px 4px', color: '#6b7280', fontSize: '5.5pt' }}>{notes[cat] || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Action Items */}
        {actionItems.length > 0 && (
          <>
            <div style={{
              background: '#EE3227', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
              padding: '2px 8px', borderRadius: '2px', marginTop: '5px', marginBottom: '2px',
              letterSpacing: '0.5px',
            }}>
              ACTION ITEMS
            </div>
            {actionItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '6px', fontSize: '6pt', padding: '2px 0',
                borderBottom: '1px solid #f3f4f6',
              }}>
                <span style={{ fontWeight: 700, color: '#EE3227', flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ color: '#2D2D2D', flex: 1 }}>{item.description}</span>
                {item.assignedTo && <span style={{ color: '#6b7280', flexShrink: 0 }}>({item.assignedTo})</span>}
                {item.dueDate && <span style={{ color: '#6b7280', flexShrink: 0 }}>Due: {formatDate(item.dueDate)}</span>}
              </div>
            ))}
          </>
        )}

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: '14px' }}>
              <ManagerSignature name={inspectorName} email={userEmail} compact />
            </div>
            <div style={{ fontSize: '5pt', color: '#6b7280', marginTop: '1px' }}>District Manager</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5pt', color: '#6b7280', marginTop: '1px' }}>Restaurant Operator</div>
          </div>
          <div style={{ width: '70px' }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
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

export default DMWalkthroughPreview;
