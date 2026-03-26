'use client';

import { forwardRef } from 'react';

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
        height: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '6px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '40px', width: 'auto' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '2px', background: '#134A7C', margin: '0 20px 6px' }} />

      {/* Header */}
      <div style={{
        padding: '18px 32px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: '14pt',
          fontWeight: 800,
          color: '#134A7C',
          letterSpacing: '2px',
        }}>
          JM VALLEY GROUP
        </div>
        <div style={{
          fontSize: '7pt',
          color: '#888',
          textAlign: 'right',
        }}>
          {evaluationPeriod || 'Evaluation Period'}
        </div>
      </div>

      {/* Title */}
      <div style={{
        textAlign: 'center',
        fontSize: '12pt',
        fontWeight: 700,
        color: '#134A7C',
        padding: '8px 32px 4px',
        letterSpacing: '1.5px',
      }}>
        EMPLOYEE PERFORMANCE EVALUATION
      </div>

      {/* Red Divider */}
      <div style={{ height: '2.5px', background: '#EE3227', margin: '0 32px 8px' }} />

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3px 20px',
        padding: '0 32px 6px',
        fontSize: '7.5pt',
      }}>
        {[
          ['Employee', employeeName || '—'],
          ['Position', employeePosition || '—'],
          ['Store', storeName || '—'],
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
      <div style={{ padding: '0 32px', marginTop: '4px' }}>
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
      <div style={{ padding: '6px 32px 0' }}>
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
      <div style={{ padding: '0 32px' }}>
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

      {/* Signatures */}
      <div style={{
        display: 'flex',
        gap: '32px',
        padding: '10px 32px 0',
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
            fontStyle: employeeSignature ? 'italic' : 'normal',
          }}>
            {employeeSignature || ''}
          </div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Employee Signature</div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Date: {formatDate(evaluationDate) || '___________'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            borderBottom: '1px solid #2D2D2D',
            paddingBottom: '2px',
            marginBottom: '2px',
            fontSize: '7.5pt',
            fontWeight: 500,
            color: '#2D2D2D',
            minHeight: '14px',
            fontStyle: evaluatorSignature ? 'italic' : 'normal',
          }}>
            {evaluatorSignature || ''}
          </div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Evaluator Signature</div>
          <div style={{ fontSize: '6pt', color: '#888' }}>Date: {formatDate(evaluationDate) || '___________'}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#EE3227',
        color: '#fff',
        textAlign: 'center',
        fontSize: '6.5pt',
        fontWeight: 700,
        padding: '5px 20px',
        letterSpacing: '1.5px',
      }}>
        CONFIDENTIAL &mdash; FOR INTERNAL USE ONLY
      </div>
    </div>
  );
});

export default EvaluationPreview;
