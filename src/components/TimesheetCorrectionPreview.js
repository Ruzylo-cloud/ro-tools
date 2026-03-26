'use client';

import { forwardRef } from 'react';

const TimesheetCorrectionPreview = forwardRef(function TimesheetCorrectionPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    supervisorName = '',
    correctionDate = new Date().toISOString().split('T')[0],
    originalDate = '',
    originalClockIn = '',
    originalClockOut = '',
    correctedClockIn = '',
    correctedClockOut = '',
    reason = '',
    employeeSignature = '',
    supervisorSignature = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '_______________';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div ref={ref} style={{
      width: '612px', height: '792px', background: '#fff',
      fontFamily: "'Poppins', sans-serif", position: 'relative', overflow: 'hidden',
      padding: '40px 44px',
    }}>
      {/* Top Red Bar */}
      <div style={{ height: '6px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '40px', width: 'auto' }} crossOrigin="anonymous" />
      </div>

      {/* Blue Divider */}
      <div style={{ height: '2px', background: '#134A7C', margin: '0 20px 6px' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '16pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>
          JM VALLEY GROUP
        </div>
        <div style={{ fontSize: '7pt', color: '#6b7280', letterSpacing: '1px', marginTop: '2px' }}>
          JERSEY MIKE&apos;S SUBS — FRANCHISE OPERATIONS
        </div>
      </div>

      <div style={{ height: '2px', background: '#EE3227', margin: '10px 0' }} />

      <div style={{
        textAlign: 'center', fontSize: '14pt', fontWeight: 700, color: '#134A7C',
        padding: '12px 0 8px', letterSpacing: '1px',
      }}>
        TIMESHEET CORRECTION FORM
      </div>

      <div style={{ height: '1px', background: '#134A7C', margin: '0 0 16px' }} />

      {/* Info Grid */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '9pt' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Employee Name</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{employeeName || ''}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Position</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{employeePosition || ''}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '9pt' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Store Location</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{storeName || ''}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date of Request</div>
          <div style={{ borderBottom: '1px solid #ccc', padding: '4px 0', minHeight: '20px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
        </div>
      </div>

      {/* Original vs Corrected */}
      <div style={{
        background: '#134A7C', color: '#fff', padding: '6px 12px',
        fontSize: '9pt', fontWeight: 700, borderRadius: '4px 4px 0 0', letterSpacing: '0.5px',
      }}>
        TIME CORRECTION DETAILS
      </div>

      <div style={{ border: '1px solid #134A7C', borderTop: 'none', borderRadius: '0 0 4px 4px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '8px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Date of Shift</div>
          <div style={{ flex: 1, padding: '8px 12px', color: '#2D2D2D' }}>{formatDate(originalDate)}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '8px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Clock In</div>
          <div style={{ flex: 1, padding: '8px 12px', color: '#2D2D2D' }}>{originalClockIn || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '8px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Clock Out</div>
          <div style={{ flex: 1, padding: '8px 12px', color: '#2D2D2D' }}>{originalClockOut || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '8px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Clock In</div>
          <div style={{ flex: 1, padding: '8px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedClockIn || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt' }}>
          <div style={{ width: '30%', padding: '8px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Clock Out</div>
          <div style={{ flex: 1, padding: '8px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedClockOut || '—'}</div>
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
        padding: '12px', fontSize: '9pt', color: '#2D2D2D', minHeight: '60px',
        lineHeight: 1.5, marginBottom: '20px', whiteSpace: 'pre-wrap',
      }}>
        {reason || ''}
      </div>

      {/* Acknowledgment */}
      <div style={{ fontSize: '8pt', color: '#6b7280', lineHeight: 1.5, marginBottom: '24px', fontStyle: 'italic' }}>
        By signing below, both parties acknowledge that this timesheet correction is accurate and agree to the adjusted times recorded above. This form will be kept on file for payroll records.
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '16px' }}>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Employee Signature</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '8px 0', minHeight: '24px', fontStyle: 'italic', color: '#2D2D2D' }}>{employeeSignature || ''}</div>
          <div style={{ fontSize: '7pt', color: '#9ca3af', marginTop: '4px' }}>Print Name</div>
        </div>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '8px 0', minHeight: '24px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '16px' }}>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Supervisor / Manager Signature</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '8px 0', minHeight: '24px', fontStyle: 'italic', color: '#2D2D2D' }}>{supervisorSignature || ''}</div>
          <div style={{ fontSize: '7pt', color: '#9ca3af', marginTop: '4px' }}>Print Name</div>
        </div>
        <div style={{ flex: 1, fontSize: '9pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '4px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '8px 0', minHeight: '24px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '7pt', padding: '6px 20px',
      }}>
        CONFIDENTIAL — FOR INTERNAL USE ONLY · {storeName || 'JM Valley Group'}
      </div>
    </div>
  );
});

export default TimesheetCorrectionPreview;
