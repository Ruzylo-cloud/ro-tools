'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const WriteUpForm = forwardRef(function WriteUpForm({ data }, ref) {
  const {
    employeeName = '', position = '', storeNumber = '', storeName = '',
    managerName = '', date = '', violationType = '', description = '',
    previousWarnings = '', actionTaken = '',
  } = data || {};

  return (
    <DocumentTemplate
      ref={ref}
      title="EMPLOYEE CORRECTIVE ACTION"
      subtitle="Written Warning / Disciplinary Notice"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '7.5pt', color: '#6b7280' }}>Employee Name</span>
          <div style={{ borderBottom: '1px solid #134A7C', fontSize: '9pt', fontWeight: 600, color: '#2D2D2D', minHeight: '16px', padding: '2px 0' }}>
            {employeeName}
          </div>
        </div>
        <div style={{ width: '120px' }}>
          <span style={{ fontSize: '7.5pt', color: '#6b7280' }}>Position</span>
          <div style={{ borderBottom: '1px solid #134A7C', fontSize: '9pt', fontWeight: 600, color: '#2D2D2D', minHeight: '16px', padding: '2px 0' }}>
            {position}
          </div>
        </div>
        <div style={{ width: '100px' }}>
          <span style={{ fontSize: '7.5pt', color: '#6b7280' }}>Date</span>
          <div style={{ borderBottom: '1px solid #134A7C', fontSize: '9pt', fontWeight: 600, color: '#2D2D2D', minHeight: '16px', padding: '2px 0' }}>
            {date}
          </div>
        </div>
      </div>

      {/* Violation Type */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        TYPE OF VIOLATION
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', fontSize: '8pt' }}>
        {['Attendance/Tardiness', 'Insubordination', 'Policy Violation', 'Performance', 'Safety', 'Conduct', 'Other'].map(type => (
          <div key={type} style={{
            display: 'flex', gap: '4px', alignItems: 'center',
            padding: '3px 8px', border: '1px solid #e5e7eb', borderRadius: '4px',
            background: violationType === type ? '#134A7C' : '#fff',
            color: violationType === type ? '#fff' : '#2D2D2D',
          }}>
            {violationType === type ? '\u2611' : '\u2610'} {type}
          </div>
        ))}
      </div>

      {/* Warning Level */}
      <div style={{
        background: '#EE3227', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        WARNING LEVEL
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '8pt' }}>
        {['Verbal Warning', '1st Written Warning', '2nd Written Warning', 'Final Warning', 'Termination'].map(level => (
          <div key={level} style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#2D2D2D' }}>
            <span style={{ color: '#EE3227', fontWeight: 700 }}>&#9744;</span> {level}
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        DESCRIPTION OF INCIDENT
      </div>
      <div style={{
        border: '1px solid #e5e7eb', borderRadius: '4px', minHeight: '80px',
        padding: '6px 8px', fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.6',
      }}>
        {description || ' '}
      </div>

      {/* Previous Warnings */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '8px 0 6px', letterSpacing: '0.5px',
      }}>
        PREVIOUS WARNINGS / CORRECTIVE ACTIONS
      </div>
      <div style={{
        border: '1px solid #e5e7eb', borderRadius: '4px', minHeight: '40px',
        padding: '6px 8px', fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.6',
      }}>
        {previousWarnings || ' '}
      </div>

      {/* Action Taken */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '8px 0 6px', letterSpacing: '0.5px',
      }}>
        ACTION TO BE TAKEN / EXPECTATIONS GOING FORWARD
      </div>
      <div style={{
        border: '1px solid #e5e7eb', borderRadius: '4px', minHeight: '40px',
        padding: '6px 8px', fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.6',
      }}>
        {actionTaken || ' '}
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '14px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '22px' }} />
          <div style={{ fontSize: '7pt', color: '#6b7280', marginTop: '2px' }}>Employee Signature</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '22px' }} />
          <div style={{ fontSize: '7pt', color: '#6b7280', marginTop: '2px' }}>Manager: {managerName}</div>
        </div>
        <div style={{ width: '90px' }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '22px' }} />
          <div style={{ fontSize: '7pt', color: '#6b7280', marginTop: '2px' }}>Date</div>
        </div>
      </div>

      <div style={{ fontSize: '7pt', color: '#6b7280', marginTop: '8px', fontStyle: 'italic', textAlign: 'center' }}>
        Employee signature acknowledges receipt of this notice, not necessarily agreement with its contents.
      </div>
    </DocumentTemplate>
  );
});

export default WriteUpForm;
