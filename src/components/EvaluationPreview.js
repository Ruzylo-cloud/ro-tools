'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const RATING_CATEGORIES = [
  'Attendance & Punctuality',
  'Quality of Work',
  'Speed & Efficiency',
  'Customer Service',
  'Teamwork & Cooperation',
  'Communication',
  'Initiative & Problem Solving',
  'Adherence to Policies',
  'Cleanliness & Organization',
  'Overall Performance',
];

const EvaluationPreview = forwardRef(function EvaluationPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    storeNumber = '',
    evaluatorName = '',
    evaluationDate = '',
    evaluationPeriod = '',
    ratings = {},
    strengths = '',
    areasForImprovement = '',
    goals = '',
    additionalComments = '',
    employeeSignature = '',
    evaluatorSignature = '',
    userEmail = '',
  } = data || {};

  const ratingValues = RATING_CATEGORIES.map(cat => ratings[cat] || 0);
  const filledCount = ratingValues.filter(v => v > 0).length;
  const average = filledCount > 0
    ? (ratingValues.reduce((a, b) => a + b, 0) / filledCount).toFixed(1)
    : '—';

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        minHeight: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        margin: '0 auto',
        padding: '0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '90px', width: '90px', objectFit: 'contain' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 4px' }} />

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>
          JM VALLEY GROUP
        </div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          JERSEY MIKE&apos;S SUBS — FRANCHISE OPERATIONS
        </div>
      </div>

      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: '12pt', fontWeight: 700, color: '#134A7C',
        padding: '4px 0 4px', letterSpacing: '1.5px',
      }}>
        EMPLOYEE PERFORMANCE EVALUATION
      </div>

      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 8px' }} />

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3px 20px',
        padding: '0 28px 6px',
        fontSize: '7.5pt',
      }}>
        {[
          ['Employee', employeeName || '—'],
          ['Position', employeePosition || '—'],
          ['Store', storeName ? (storeNumber ? `${storeName} (#${storeNumber})` : storeName) : '—'],
          ['Evaluator', evaluatorName || '—'],
          ['Date', formatDate(evaluationDate) || '—'],
          ['Period', evaluationPeriod || '—'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', gap: '6px' }}>
            <span style={{ fontWeight: 700, color: '#134A7C', minWidth: '52px' }}>{label}:</span>
            <span style={{ color: '#2D2D2D' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Rating Table */}
      <div style={{ padding: '0 28px', marginTop: '4px' }}>
        {/* Table Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          background: '#134A7C',
          borderRadius: '3px 3px 0 0',
        }}>
          <div style={{ flex: 1, fontSize: '7pt', fontWeight: 700, color: '#fff' }}>Category</div>
          <div style={{ display: 'flex', gap: '6px', width: '140px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} style={{
                width: '20px',
                textAlign: 'center',
                fontSize: '6.5pt',
                fontWeight: 700,
                color: '#fff',
              }}>{n}</div>
            ))}
          </div>
          <div style={{ width: '60px', textAlign: 'center', fontSize: '6.5pt', fontWeight: 700, color: '#fff' }}>Score</div>
        </div>

        {/* Table Rows */}
        {RATING_CATEGORIES.map((cat, idx) => {
          const score = ratings[cat] || 0;
          return (
            <div key={cat} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '3px 8px',
              background: idx % 2 === 0 ? '#F0F4F8' : '#fff',
              borderLeft: '1px solid #e0e0e0',
              borderRight: '1px solid #e0e0e0',
              borderBottom: idx === RATING_CATEGORIES.length - 1 ? '1px solid #e0e0e0' : 'none',
            }}>
              <div style={{ flex: 1, fontSize: '6.5pt', fontWeight: 500, color: '#2D2D2D' }}>
                {cat}
              </div>
              <div style={{ display: 'flex', gap: '6px', width: '140px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} style={{
                    width: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: score >= n ? '#134A7C' : '#ddd',
                      transition: 'background 0.2s',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{
                width: '60px',
                textAlign: 'center',
                fontSize: '7pt',
                fontWeight: 700,
                color: score > 0 ? '#134A7C' : '#ccc',
              }}>
                {score > 0 ? `${score}/5` : '—'}
              </div>
            </div>
          );
        })}

        {/* Average Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          background: '#134A7C',
          borderRadius: '0 0 3px 3px',
        }}>
          <div style={{ flex: 1, fontSize: '7pt', fontWeight: 700, color: '#fff' }}>AVERAGE SCORE</div>
          <div style={{ width: '200px', textAlign: 'center', fontSize: '8pt', fontWeight: 800, color: '#fff' }}>
            {average}{average !== '—' ? ' / 5' : ''}
          </div>
        </div>
      </div>

      {/* Comment Sections */}
      <div style={{ padding: '6px 28px 0' }}>
        {[
          ['Strengths', strengths],
          ['Areas for Improvement', areasForImprovement],
          ['Goals for Next Period', goals],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: '4px' }}>
            <div style={{
              fontSize: '7pt',
              fontWeight: 700,
              color: '#134A7C',
              borderBottom: '1px solid #134A7C',
              paddingBottom: '1px',
              marginBottom: '2px',
            }}>
              {title}
            </div>
            <div style={{
              fontSize: '6.5pt',
              color: '#2D2D2D',
              lineHeight: 1.4,
              minHeight: '18px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {text || '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Comments */}
      <div style={{ padding: '0 28px' }}>
        <div style={{
          fontSize: '7pt',
          fontWeight: 700,
          color: '#134A7C',
          borderBottom: '1px solid #134A7C',
          paddingBottom: '1px',
          marginBottom: '2px',
        }}>
          Additional Comments
        </div>
        <div style={{
          fontSize: '6.5pt',
          color: '#2D2D2D',
          lineHeight: 1.4,
          minHeight: '18px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {additionalComments || '—'}
        </div>
      </div>

      {/* At-Will & Acknowledgment */}
      <div style={{ padding: '4px 28px 0', fontSize: '5.5pt', color: '#6b7280', lineHeight: 1.4 }}>
        This evaluation does not constitute a contract of employment. Employment is at-will and may be terminated at any time, for any lawful reason, with or without notice, regardless of performance rating. Employee has the right to review and add written comments. Employee may not be retaliated against for reporting safety concerns, wage violations, discrimination, or exercising rights protected under California or federal law.
      </div>

      {/* Signatures */}
      <div style={{
        display: 'flex',
        gap: '32px',
        padding: '6px 28px 0',
      }}>

        <div style={{ flex: 1 }}>
          <div style={{
            borderBottom: '1px solid #2D2D2D',
            paddingBottom: '2px',
            marginBottom: '2px',
            fontSize: '7.5pt',
            fontWeight: 500,
            color: '#2D2D2D',
            minHeight: '14px',
            fontStyle: employeeSignature && !employeeSignature.startsWith('data:') ? 'italic' : 'normal',
          }}>
            {employeeSignature?.startsWith('data:')
              ? <img src={employeeSignature} style={{ height: '36px', maxWidth: '200px', display: 'block' }} alt="signature" />
              : (employeeSignature || '')}
          </div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Employee Signature</div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Date: {formatDate(evaluationDate) || '___________'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            paddingBottom: '2px',
            marginBottom: '2px',
            fontSize: '7.5pt',
            fontWeight: 500,
            color: '#2D2D2D',
            minHeight: '14px',
          }}>
            <ManagerSignature name={evaluatorName || evaluatorSignature} email={userEmail} compact />
          </div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Evaluator Signature</div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Date: {formatDate(evaluationDate) || '___________'}</div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '5.5pt', padding: '4px 28px', fontWeight: 400, lineHeight: 1.3,
      }}>
        Property of JM Valley Group. All rights reserved. Confidential &mdash; not for distribution.
      </div>
    </div>
  );
});

export default EvaluationPreview;
