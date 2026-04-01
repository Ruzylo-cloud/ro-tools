'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const DEFAULT_DOCUMENTS = [
  { name: 'W-4 Federal Tax Withholding', category: 'tax' },
  { name: 'DE-4 State Tax Withholding (California)', category: 'tax' },
  { name: 'I-9 Employment Eligibility', category: 'legal' },
  { name: 'Direct Deposit Authorization', category: 'payroll' },
  { name: 'Employee Handbook Acknowledgment', category: 'policy' },
  { name: 'At-Will Employment Agreement', category: 'legal' },
  { name: 'Confidentiality Agreement', category: 'legal' },
  { name: 'Anti-Harassment Policy Acknowledgment', category: 'policy' },
  { name: 'Food Handler Card Verification', category: 'certification' },
  { name: 'Uniform & Equipment Checklist', category: 'operations' },
  { name: 'Emergency Contact Form', category: 'personal' },
  { name: 'Photo ID Copy on File', category: 'legal' },
  { name: 'Meal Break Waiver (if applicable)', category: 'legal' },
  { name: 'Safety Training Acknowledgment', category: 'training' },
  { name: 'LMS Account Setup Confirmation', category: 'training' },
];

const CATEGORY_COLORS = {
  tax: '#D97706', legal: '#134A7C', payroll: '#16A34A', policy: '#7C3AED',
  certification: '#EA580C', operations: '#2563EB', personal: '#6366F1', training: '#059669',
};

const OnboardingPacketPreview = forwardRef(function OnboardingPacketPreview({ data }, ref) {
  const {
    employeeName = '', position = '', startDate = '', storeNumber = '', storeName = '',
    managerName = '', userEmail = '',
    documents = DEFAULT_DOCUMENTS,
    completedDocs = [],
    customDocs = [],
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  const allDocs = [...documents, ...customDocs.filter(d => d.name)];
  const completedCount = completedDocs.length;
  const totalCount = allDocs.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
          NEW HIRE ONBOARDING PACKET
        </div>

        {/* Progress bar */}
        <div style={{ margin: '4px 0', background: '#f3f4f6', borderRadius: '3px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: pct === 100 ? '#16A34A' : '#134A7C',
            borderRadius: '3px', transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '6pt', color: '#6b7280', marginBottom: '4px' }}>
          {completedCount}/{totalCount} documents complete ({pct}%)
        </div>

        {/* Employee info */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Employee Name</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{employeeName}</div>
          </div>
          <div style={{ flex: 0.5 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Position</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{position}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
          <div style={{ flex: 0.25 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Store #</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{storeNumber}</div>
          </div>
          <div style={{ flex: 0.45 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Store Name</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{storeName}</div>
          </div>
          <div style={{ flex: 0.3 }}>
            <span style={{ fontSize: '5.5pt', color: '#6b7280' }}>Start Date</span>
            <div style={{ borderBottom: '1px solid #134A7C', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '10px' }}>{formatDate(startDate)}</div>
          </div>
        </div>

        {/* Document checklist header */}
        <div style={{
          background: '#134A7C', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
          padding: '2px 8px', borderRadius: '2px', marginBottom: '2px',
          letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between',
        }}>
          <span>DOCUMENT CHECKLIST</span>
          <span>STATUS</span>
        </div>

        {/* Document rows */}
        {allDocs.map((doc, i) => {
          const isCompleted = completedDocs.includes(doc.name);
          const catColor = CATEGORY_COLORS[doc.category] || '#6b7280';
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '2px 4px', borderBottom: '1px solid #f3f4f6',
              background: i % 2 === 0 ? '#fff' : '#fafbfc',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '8px', height: '8px', border: `1.5px solid ${isCompleted ? '#16A34A' : '#d1d5db'}`,
                  borderRadius: '2px', background: isCompleted ? '#16A34A' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isCompleted && <span style={{ color: '#fff', fontSize: '6px', fontWeight: 800, lineHeight: 1 }}>&#10003;</span>}
                </div>
                <span style={{ fontSize: '6pt', color: '#2D2D2D' }}>{doc.name}</span>
                <span style={{
                  fontSize: '4.5pt', color: catColor, fontWeight: 600, background: `${catColor}15`,
                  padding: '0 3px', borderRadius: '1px',
                }}>
                  {doc.category}
                </span>
              </div>
              <span style={{
                fontSize: '5.5pt', fontWeight: 600,
                color: isCompleted ? '#16A34A' : '#D97706',
              }}>
                {isCompleted ? 'DONE' : 'PENDING'}
              </span>
            </div>
          );
        })}

        {/* Acknowledgment */}
        <div style={{
          fontSize: '5pt', color: '#6b7280', marginTop: '6px', lineHeight: 1.35, fontStyle: 'italic',
        }}>
          I acknowledge that all documents listed above have been reviewed and completed. I understand that failure to submit required documentation within the first 3 days of employment may delay onboarding. Original documents are on file with store management.
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5pt', color: '#6b7280', marginTop: '1px' }}>Employee Signature</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: '14px' }}>
              <ManagerSignature name={managerName} email={userEmail} compact />
            </div>
            <div style={{ fontSize: '5pt', color: '#6b7280', marginTop: '1px' }}>Manager Signature</div>
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

export default OnboardingPacketPreview;
