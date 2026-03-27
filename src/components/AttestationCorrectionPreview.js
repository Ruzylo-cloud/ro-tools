'use client';

import { forwardRef } from 'react';

const AttestationCorrectionPreview = forwardRef(function AttestationCorrectionPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    supervisorName = '',
    correctionDate = new Date().toISOString().split('T')[0],
    attestationType = 'meal',
    shiftDate = '',
    shiftStart = '',
    shiftEnd = '',
    originalAttestation = '',
    correctedAttestation = '',
    reason = '',
    employeeSignature = '',
    supervisorSignature = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '_______________';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const typeLabel = attestationType === 'meal' ? 'Meal Period' : attestationType === 'rest' ? 'Rest Break' : 'Meal Period & Rest Break';

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
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '40px', width: 'auto' }} crossOrigin="anonymous" />
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

      <div style={{
        textAlign: 'center', fontSize: '13pt', fontWeight: 700, color: '#134A7C',
        padding: '4px 0 4px', letterSpacing: '1px',
      }}>
        ATTESTATION CORRECTION FORM
      </div>
      <div style={{
        textAlign: 'center', fontSize: '9pt', color: '#EE3227', fontWeight: 600,
        marginBottom: '4px',
      }}>
        {typeLabel} Attestation
      </div>

      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 16px' }} />

      <div style={{ padding: '0 28px' }}>

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

      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '9pt' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Store Location</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{storeName}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date of Request</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
        </div>
      </div>

      {/* Shift Details */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        SHIFT DETAILS
      </div>
      <div style={{ border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', fontSize: '8.5pt' }}>
          <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Date of Shift</div>
            <div style={{ color: '#2D2D2D' }}>{formatDate(shiftDate)}</div>
          </div>
          <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Shift Start</div>
            <div style={{ color: '#2D2D2D' }}>{shiftStart || '—'}</div>
          </div>
          <div style={{ flex: 1, padding: '8px 12px' }}>
            <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Shift End</div>
            <div style={{ color: '#2D2D2D' }}>{shiftEnd || '—'}</div>
          </div>
        </div>
      </div>

      {/* Attestation Details */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        ATTESTATION CORRECTION DETAILS
      </div>
      <div style={{ border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '35%', padding: '8px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Attestation</div>
          <div style={{ flex: 1, padding: '8px 12px', color: '#2D2D2D' }}>{originalAttestation || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt' }}>
          <div style={{ width: '35%', padding: '8px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Attestation</div>
          <div style={{ flex: 1, padding: '8px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedAttestation || '—'}</div>
        </div>
      </div>

      {/* Reason */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        REASON FOR CORRECTION
      </div>
      <div style={{
        border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px',
        padding: '12px', fontSize: '9pt', color: '#2D2D2D', minHeight: '50px',
        lineHeight: 1.5, marginBottom: '16px', whiteSpace: 'pre-wrap',
      }}>
        {reason || ''}
      </div>

      {/* Compliance Notice */}
      <div style={{ fontSize: '6pt', color: '#134A7C', lineHeight: 1.4, marginBottom: '4px', fontWeight: 600 }}>
        CALIFORNIA MEAL &amp; REST BREAK RIGHTS (Labor Code &sect;512, &sect;226.7)
      </div>
      <div style={{ fontSize: '5.5pt', color: '#6b7280', lineHeight: 1.4, marginBottom: '8px' }}>
        Employees are entitled to a 30-minute uninterrupted meal period for shifts over 5 hours and a paid 10-minute rest break for each 4-hour work period. If a required meal period or rest break was not provided, the employee is entitled to one additional hour of pay at regular rate per missed break. Employees may not be retaliated against for asserting break rights or filing a wage claim with the CA DLSE.
      </div>

      {/* Acknowledgment */}
      <div style={{ fontSize: '6.5pt', color: '#6b7280', lineHeight: 1.4, marginBottom: '12px' }}>
        I acknowledge that the information above is correct and all meal/rest break records are accurately reflected. I understand that falsifying attestation records is a violation of company policy and may result in disciplinary action. If this correction results in premium pay owed, it will be paid per California Labor Code.
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '14px' }}>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Employee Signature</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', fontStyle: 'italic', color: '#2D2D2D' }}>{employeeSignature}</div>
        </div>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Supervisor / Manager</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', fontStyle: 'italic', color: '#2D2D2D' }}>{supervisorSignature}</div>
        </div>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
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

export default AttestationCorrectionPreview;
