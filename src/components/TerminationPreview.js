'use client';

import { forwardRef } from 'react';

const TerminationPreview = forwardRef(function TerminationPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    storeNumber = '',
    supervisorName = '',
    hireDate = '',
    terminationDate = '',
    terminationType = 'Involuntary - Performance',
    previousDiscipline = '',
    terminationReason = '',
    finalPayDate = '',
    finalPayNotes = '',
    companyPropertyReturned = [],
    benefitsInfo = '',
    supervisorSignature = '',
    witnessName = '',
    witnessSignature = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

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

  const checkItem = (checked, label) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
      <div style={{
        width: '10px', height: '10px', border: '1.5px solid #134A7C', borderRadius: '2px',
        background: checked ? '#134A7C' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && <span style={{ color: '#fff', fontSize: '7pt', lineHeight: 1 }}>&#10003;</span>}
      </div>
      <span style={{ fontSize: '7pt', color: '#2D2D2D' }}>{label}</span>
    </div>
  );

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
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '60px', width: 'auto' }} crossOrigin="anonymous" />
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

      {/* Red Divider */}
      <div style={{ height: '1.5px', background: '#EE3227', margin: '2px 28px 4px' }} />

      {/* Title */}
      <div style={{
        textAlign: 'center', fontSize: '14pt', fontWeight: 700, color: '#134A7C',
        padding: '4px 0 4px', letterSpacing: '1px',
      }}>
        EMPLOYEE TERMINATION FORM
      </div>

      {/* Blue Divider */}
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 4px' }} />

      {/* Confidential Notice */}
      <div style={{
        textAlign: 'center', fontSize: '7pt', color: '#EE3227', fontWeight: 700,
        letterSpacing: '1px', marginBottom: '8px',
      }}>
        CONFIDENTIAL &mdash; FOR AUTHORIZED PERSONNEL ONLY
      </div>

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

          <div style={fieldLabel}>Hire Date</div>
          <div style={fieldValue}>{formatDate(hireDate) || '\u00A0'}</div>

          <div style={fieldLabel}>Termination Type</div>
          <div style={fieldValue}>{terminationType || '\u00A0'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={fieldLabel}>Position</div>
          <div style={fieldValue}>{employeePosition || '\u00A0'}</div>

          <div style={fieldLabel}>Supervisor</div>
          <div style={fieldValue}>{supervisorName || '\u00A0'}</div>

          <div style={fieldLabel}>Termination Date</div>
          <div style={fieldValue}>{formatDate(terminationDate) || '\u00A0'}</div>

          <div style={fieldLabel}>Final Pay Date</div>
          <div style={fieldValue}>{formatDate(finalPayDate) || '\u00A0'}</div>
        </div>
      </div>

      {/* Previous Discipline */}
      <div style={sectionHeader}>Previous Discipline / Warnings</div>
      <div style={sectionBody}>
        {previousDiscipline || '\u00A0'}
      </div>

      {/* Termination Reason */}
      <div style={sectionHeader}>Reason for Termination</div>
      <div style={{ ...sectionBody, minHeight: '48px' }}>
        {terminationReason || '\u00A0'}
      </div>

      {/* Final Pay Notes */}
      <div style={sectionHeader}>Final Pay Notes</div>
      <div style={sectionBody}>
        {finalPayNotes || '\u00A0'}
      </div>

      {/* Company Property Returned */}
      <div style={sectionHeader}>Company Property Returned</div>
      <div style={{ ...sectionBody, display: 'flex', flexWrap: 'wrap', gap: '8px 24px', padding: '6px 8px' }}>
        {checkItem(companyPropertyReturned.includes('Keys'), 'Keys')}
        {checkItem(companyPropertyReturned.includes('Uniform Shirts'), 'Uniform Shirts')}
        {checkItem(companyPropertyReturned.includes('Name Tag'), 'Name Tag')}
        {checkItem(companyPropertyReturned.includes('Apron'), 'Apron')}
        {checkItem(companyPropertyReturned.includes('Other'), 'Other')}
      </div>

      {/* Benefits / COBRA Info */}
      <div style={sectionHeader}>Benefits / COBRA Information</div>
      <div style={sectionBody}>
        {benefitsInfo || '\u00A0'}
      </div>

      {/* California Final Pay Notice */}
      <div style={{
        fontSize: '5.5pt', color: '#EE3227', lineHeight: 1.4, marginTop: '6px', fontWeight: 600,
        border: '1px solid #EE3227', borderRadius: '2px', padding: '4px 8px',
      }}>
        CALIFORNIA FINAL PAY NOTICE: Under California Labor Code &sect;201-202, final wages for involuntary termination must be paid at the time of termination.
      </div>

      {/* At-Will & Acknowledgment */}
      <div style={{ fontSize: '5.5pt', color: '#6b7280', lineHeight: 1.4, marginTop: '4px' }}>
        This termination form is part of JM Valley Group&apos;s employment separation process. Employment is at-will and may be terminated at any time, for any lawful reason, with or without notice. The employee acknowledges receipt of this form and understands that separation of employment is effective as of the termination date listed above. Employee may not be retaliated against for reporting safety concerns, wage violations, or exercising other rights protected under California law.
      </div>

      {/* Signatures — three columns */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '8px' }}>
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
        <div style={{ flex: 1 }}>
          <div style={{
            borderBottom: '1px solid #2D2D2D',
            paddingBottom: '2px',
            fontSize: '8pt',
            color: '#2D2D2D',
            fontWeight: 500,
            minHeight: '16px',
          }}>
            {witnessSignature || '\u00A0'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Witness: {witnessName || '___________'}</span>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Date: ___________</span>
          </div>
        </div>
      </div>

      {/* Employee acknowledgment line */}
      <div style={{ marginTop: '4px' }}>
        <div style={{
          borderBottom: '1px solid #2D2D2D',
          paddingBottom: '2px',
          fontSize: '8pt',
          color: '#2D2D2D',
          fontWeight: 500,
          minHeight: '16px',
        }}>
          {'\u00A0'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Employee Signature (acknowledges receipt, not agreement)</span>
          <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Date: ___________</span>
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

export default TerminationPreview;
