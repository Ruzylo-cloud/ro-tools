'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const ACKNOWLEDGMENTS = [
  'I understand that I am entitled to a 30-minute unpaid meal period for shifts over 5 hours.',
  'I voluntarily choose to waive my meal period as permitted under California Labor Code \u00A7512.',
  'I understand this waiver can be revoked at any time with written notice to my manager.',
  'I understand that if my shift exceeds 12 hours, I cannot waive my second meal period.',
];

const MealBreakWaiverPreview = forwardRef(function MealBreakWaiverPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    storeNumber = '',
    managerName = '',
    waiverDate = new Date().toISOString().split('T')[0],
    waiverType = 'first',
    shiftSchedule = '',
    employeeSignature = '',
    managerSignature = '',
    userEmail = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '_______________';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const waiverTypeLabel = waiverType === 'first'
    ? 'First Meal Period Waiver (shifts 6-12 hrs)'
    : waiverType === 'second'
    ? 'Second Meal Period Waiver (shifts 10-12 hrs)'
    : 'On-Duty Meal Period Agreement';

  return (
    <div ref={ref} style={{
      width: '612px', minHeight: '792px', background: '#fff',
      fontFamily: "'Poppins', sans-serif",
      padding: '0',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
    }}>
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '90px', width: 'auto' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1.5px', background: '#134A7C', margin: '0 28px 4px' }} />

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>
          JM VALLEY GROUP
        </div>
        <div style={{ fontSize: '5.5pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          JERSEY MIKE&apos;S SUBS &mdash; FRANCHISE OPERATIONS
        </div>
      </div>

      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      <div style={{
        textAlign: 'center', fontSize: '13pt', fontWeight: 700, color: '#134A7C',
        padding: '4px 0 4px', letterSpacing: '1px',
      }}>
        MEAL PERIOD WAIVER AGREEMENT
      </div>

      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 16px' }} />

      <div style={{ padding: '0 28px' }}>

      {/* California Legal Notice */}
      <div style={{
        background: '#f0f4f8', border: '1px solid #134A7C', borderRadius: '4px',
        padding: '8px 12px', marginBottom: '16px', fontSize: '7pt', color: '#134A7C',
        fontWeight: 600, lineHeight: 1.5, textAlign: 'center',
      }}>
        This agreement is made pursuant to California Labor Code &sect;512 and Industrial Welfare Commission Order No. 5-2001, Section 11.
      </div>

      {/* Info Grid */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', fontSize: '9pt' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Employee Name</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{employeeName}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Position</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{employeePosition}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', fontSize: '9pt' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Store Location</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>
            {storeName || storeNumber
              ? `${storeName}${storeNumber ? ` (#${storeNumber})` : ''}`
              : ''}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Waiver Date</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(waiverDate)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '9pt' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Manager Name</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{managerName}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Waiver Type</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{waiverTypeLabel}</div>
        </div>
      </div>

      {/* Shift Schedule */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        TYPICAL SHIFT SCHEDULE
      </div>
      <div style={{
        border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px',
        padding: '12px', fontSize: '9pt', color: '#2D2D2D', minHeight: '40px',
        lineHeight: 1.5, marginBottom: '16px', whiteSpace: 'pre-wrap',
      }}>
        {shiftSchedule || ''}
      </div>

      {/* Acknowledgments */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        EMPLOYEE ACKNOWLEDGMENTS
      </div>
      <div style={{
        border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px',
        padding: '12px', marginBottom: '16px',
      }}>
        {ACKNOWLEDGMENTS.map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: i < ACKNOWLEDGMENTS.length - 1 ? '8px' : '0' }}>
            <div style={{
              width: '14px', height: '14px', minWidth: '14px', marginTop: '1px',
              border: '1.5px solid #134A7C', borderRadius: '2px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#f0f4f8',
            }}>
              <span style={{ color: '#134A7C', fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>&#10003;</span>
            </div>
            <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: 1.5 }}>
              {i + 1}. {text}
            </div>
          </div>
        ))}
      </div>

      {/* Revocation Notice */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        REVOCATION NOTICE
      </div>
      <div style={{
        border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px',
        padding: '12px', fontSize: '8pt', color: '#2D2D2D', lineHeight: 1.5,
        marginBottom: '16px',
      }}>
        This waiver is voluntary and may be revoked by the employee at any time by providing written notice to their manager. Upon revocation, the employer will provide all meal periods as required by law. This waiver remains in effect until revoked in writing or until the employee&apos;s employment ends, whichever occurs first.
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '14px' }}>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Employee Signature</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', fontStyle: 'italic', color: '#2D2D2D' }}>
            {employeeSignature?.startsWith('data:')
              ? <img src={employeeSignature} style={{ height: '36px', maxWidth: '200px', display: 'block' }} alt="signature" />
              : (employeeSignature || '')}
          </div>
        </div>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(waiverDate)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Manager / Supervisor</div>
          <div style={{ padding: '6px 0', minHeight: '20px', color: '#2D2D2D' }}><ManagerSignature name={managerName || managerSignature} email={userEmail} compact /></div>
        </div>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(waiverDate)}</div>
        </div>
      </div>

      </div>{/* end content wrapper */}

      {/* Spacer + Footer */}
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

export default MealBreakWaiverPreview;
