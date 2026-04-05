'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

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
    originalBreakOut = '',
    originalBreakIn = '',
    correctedClockIn = '',
    correctedClockOut = '',
    correctedBreakOut = '',
    correctedBreakIn = '',
    reason = '',
    employeeSignature = '',
    supervisorSignature = '',
    userEmail = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '_______________';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

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
          JERSEY MIKE&apos;S SUBS — FRANCHISE OPERATIONS
        </div>
      </div>

      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      <div style={{
        textAlign: 'center', fontSize: '14pt', fontWeight: 700, color: '#134A7C',
        padding: '4px 0 4px', letterSpacing: '1px',
      }}>
        TIMESHEET CORRECTION FORM
      </div>

      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 16px' }} />

      <div style={{ padding: '0 28px' }}>

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
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Date of Shift</div>
          <div style={{ flex: 1, padding: '6px 12px', color: '#2D2D2D' }}>{formatDate(originalDate)}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Clock In</div>
          <div style={{ flex: 1, padding: '6px 12px', color: '#2D2D2D' }}>{originalClockIn || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Clock Out</div>
          <div style={{ flex: 1, padding: '6px 12px', color: '#2D2D2D' }}>{originalClockOut || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Break Out</div>
          <div style={{ flex: 1, padding: '6px 12px', color: '#2D2D2D' }}>{originalBreakOut || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '2px solid #134A7C' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 600, color: '#134A7C', background: '#f0f4f8' }}>Original Break In</div>
          <div style={{ flex: 1, padding: '6px 12px', color: '#2D2D2D' }}>{originalBreakIn || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Clock In</div>
          <div style={{ flex: 1, padding: '6px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedClockIn || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Clock Out</div>
          <div style={{ flex: 1, padding: '6px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedClockOut || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Break Out</div>
          <div style={{ flex: 1, padding: '6px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedBreakOut || '—'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: '8.5pt' }}>
          <div style={{ width: '30%', padding: '6px 12px', fontWeight: 700, color: '#EE3227', background: '#f0f4f8' }}>Corrected Break In</div>
          <div style={{ flex: 1, padding: '6px 12px', fontWeight: 600, color: '#EE3227' }}>{correctedBreakIn || '—'}</div>
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
        padding: '8px 12px', fontSize: '8.5pt', color: '#2D2D2D', minHeight: '40px',
        lineHeight: 1.4, marginBottom: '14px', whiteSpace: 'pre-wrap',
      }}>
        {reason || ''}
      </div>

      {/* Acknowledgment */}
      <div style={{ fontSize: '6.5pt', color: '#6b7280', lineHeight: 1.4, marginBottom: '10px', fontStyle: 'italic' }}>
        By signing below, both parties acknowledge that this timesheet correction is accurate and agree to the adjusted times recorded above. Per California Labor Code &sect;226, this correction will be reflected in wage statements. If this results in additional wages owed, corrected pay will be included in the next regular paycheck or sooner as required by law. Employees are entitled to accurate records of all hours worked, meal periods, and rest breaks.
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '10px' }}>
        <div style={{ flex: 1, fontSize: '8.5pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Employee Signature</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '18px', fontStyle: 'italic', color: '#2D2D2D' }}>
            {employeeSignature?.startsWith('data:')
              ? <img src={employeeSignature} style={{ height: '36px', maxWidth: '200px', display: 'block' }} alt="signature" />
              : (employeeSignature || '')}
          </div>
          <div style={{ fontSize: '7pt', color: '#9ca3af', marginTop: '2px' }}>Print Name</div>
        </div>
        <div style={{ flex: 1, fontSize: '8.5pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '18px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '10px' }}>
        <div style={{ flex: 1, fontSize: '8.5pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Supervisor / Manager Signature</div>
          <div style={{ padding: '6px 0', minHeight: '18px', color: '#2D2D2D' }}><ManagerSignature name={supervisorName || supervisorSignature} email={userEmail} compact /></div>
          <div style={{ fontSize: '7pt', color: '#9ca3af', marginTop: '2px' }}>Print Name</div>
        </div>
        <div style={{ flex: 1, fontSize: '8.5pt' }}>
          <div style={{ fontWeight: 600, color: '#134A7C', marginBottom: '2px' }}>Date</div>
          <div style={{ borderBottom: '2px solid #134A7C', padding: '6px 0', minHeight: '18px', color: '#2D2D2D' }}>{formatDate(correctionDate)}</div>
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

export default TimesheetCorrectionPreview;
