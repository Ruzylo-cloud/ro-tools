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
        height: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
        padding: '24px 32px 0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
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
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <div style={{
          fontSize: '16pt',
          fontWeight: 800,
          color: '#134A7C',
          letterSpacing: '1px',
        }}>
          JM VALLEY GROUP
        </div>
        <div style={{
          fontSize: '10pt',
          fontWeight: 700,
          color: '#134A7C',
          letterSpacing: '1.5px',
          marginTop: '2px',
        }}>
          WRITTEN WARNING / CORRECTIVE ACTION FORM
        </div>
      </div>

      {/* Red divider */}
      <div style={{ height: '3px', background: '#EE3227', margin: '6px 0 10px' }} />

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

      {/* Spacer to push signatures down */}
      <div style={{ flex: 1 }} />

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

      {/* Footer */}
      <div style={{
        background: '#EE3227',
        color: '#fff',
        textAlign: 'center',
        fontSize: '7pt',
        fontWeight: 700,
        padding: '5px 0',
        letterSpacing: '1.5px',
        margin: '0 -32px',
      }}>
        CONFIDENTIAL &mdash; FOR INTERNAL USE ONLY
      </div>
    </div>
  );
});

export default WrittenWarningPreview;
