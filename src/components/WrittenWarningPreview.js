'use client';

import { forwardRef } from 'react';

const WrittenWarningPreview = forwardRef(function WrittenWarningPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    storeNumber = '',
    supervisorName = '',
    warningDate = '',
    warningType = 'Written Warning',
    violationCategory = '',
    violationDescription = '',
    previousWarnings = '',
    expectedImprovement = '',
    consequencesIfNotImproved = '',
    employeeComments = '',
    employeeSignature = '',
    supervisorSignature = '',
  } = data || {};

  const sectionHeader = {
    background: '#134A7C',
    color: '#fff',
    fontSize: '7pt',
    fontWeight: 700,
    padding: '3px 8px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    marginTop: '6px',
  };

  const sectionBody = {
    border: '1px solid #ccc',
    borderTop: 'none',
    padding: '5px 8px',
    fontSize: '7pt',
    color: '#2D2D2D',
    minHeight: '28px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const fieldLabel = {
    fontSize: '6pt',
    fontWeight: 700,
    color: '#134A7C',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  const fieldValue = {
    fontSize: '8pt',
    color: '#2D2D2D',
    fontWeight: 500,
    minHeight: '14px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '1px',
    marginBottom: '2px',
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
        WRITTEN WARNING / CORRECTIVE ACTION FORM
      </div>

      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 12px' }} />

      <div style={{ padding: '0 28px' }}>

      {/* Info grid — two columns */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
        <div style={{ flex: 1 }}>
          <div style={fieldLabel}>Employee Name</div>
          <div style={fieldValue}>{employeeName || '\u00A0'}</div>

          <div style={fieldLabel}>Store</div>
          <div style={fieldValue}>
            {storeName || storeNumber
              ? `${storeName}${storeNumber ? ` (#${storeNumber})` : ''}`
              : '\u00A0'}
          </div>

          <div style={fieldLabel}>Warning Type</div>
          <div style={fieldValue}>{warningType || '\u00A0'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={fieldLabel}>Position</div>
          <div style={fieldValue}>{employeePosition || '\u00A0'}</div>

          <div style={fieldLabel}>Date</div>
          <div style={fieldValue}>{warningDate || '\u00A0'}</div>

          <div style={fieldLabel}>Violation Category</div>
          <div style={fieldValue}>{violationCategory || '\u00A0'}</div>
        </div>
      </div>

      {/* Violation Details */}
      <div style={sectionHeader}>Violation Details</div>
      <div style={{ ...sectionBody, minHeight: '48px' }}>
        {violationDescription || '\u00A0'}
      </div>

      {/* Previous Warnings */}
      <div style={sectionHeader}>Previous Warnings</div>
      <div style={sectionBody}>
        {previousWarnings || '\u00A0'}
      </div>

      {/* Expected Improvement */}
      <div style={sectionHeader}>Expected Improvement</div>
      <div style={sectionBody}>
        {expectedImprovement || '\u00A0'}
      </div>

      {/* Consequences If Not Improved */}
      <div style={sectionHeader}>Consequences If Not Improved</div>
      <div style={sectionBody}>
        {consequencesIfNotImproved || '\u00A0'}
      </div>

      {/* Employee Comments */}
      <div style={sectionHeader}>Employee Comments</div>
      <div style={{ ...sectionBody, minHeight: '40px' }}>
        {employeeComments || '\u00A0'}
      </div>

      {/* At-Will & Acknowledgment */}
      <div style={{ fontSize: '5.5pt', color: '#6b7280', lineHeight: 1.4, marginTop: '6px' }}>
        This written warning is part of JM Valley Group&apos;s progressive corrective action process. It does not constitute a contract of employment or alter at-will employment status. Employment is at-will and may be terminated at any time, for any lawful reason, with or without notice. Employee has the right to provide written comments above and may not be retaliated against for reporting safety concerns, wage violations, or exercising other rights protected under California law. By signing, employee acknowledges receipt of this warning and the opportunity to respond.
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: '32px', marginTop: '10px', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            borderBottom: '1px solid #2D2D2D',
            paddingBottom: '2px',
            fontSize: '8pt',
            color: '#2D2D2D',
            fontWeight: 500,
            minHeight: '16px',
          }}>
            {employeeSignature || '\u00A0'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Employee Signature</span>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Date: ___________</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            borderBottom: '1px solid #2D2D2D',
            paddingBottom: '2px',
            fontSize: '8pt',
            color: '#2D2D2D',
            fontWeight: 500,
            minHeight: '16px',
          }}>
            {supervisorSignature || '\u00A0'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Supervisor Signature</span>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Date: ___________</span>
          </div>
        </div>
      </div>

      </div>{/* end content wrapper */}

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

export default WrittenWarningPreview;
