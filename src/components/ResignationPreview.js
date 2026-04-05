'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const ResignationPreview = forwardRef(function ResignationPreview({ data }, ref) {
  const {
    employeeName = '',
    employeePosition = '',
    storeName = '',
    storeNumber = '',
    managerName = '',
    resignationDate = '',
    lastDay = '',
    resignationType = 'Voluntary',
    reason = '',
    noticeGiven = '2+ Weeks',
    equipmentReturned = {},
    exitInterviewCompleted = false,
    finalPayInfo = '',
    employeeSignature = '',
    managerSignature = '',
    userEmail = '',
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

  const checkboxStyle = (checked) => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    border: '1px solid #134A7C',
    borderRadius: '1px',
    marginRight: '4px',
    background: checked ? '#134A7C' : '#fff',
    verticalAlign: 'middle',
  });

  const equipmentItems = [
    { key: 'keys', label: 'Keys' },
    { key: 'uniform', label: 'Uniform' },
    { key: 'nameTag', label: 'Name Tag' },
    { key: 'other', label: 'Other' },
  ];

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
        EMPLOYEE RESIGNATION FORM
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

          <div style={fieldLabel}>Resignation Date</div>
          <div style={fieldValue}>{resignationDate || '\u00A0'}</div>

          <div style={fieldLabel}>Resignation Type</div>
          <div style={fieldValue}>{resignationType || '\u00A0'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={fieldLabel}>Position</div>
          <div style={fieldValue}>{employeePosition || '\u00A0'}</div>

          <div style={fieldLabel}>Manager</div>
          <div style={fieldValue}>{managerName || '\u00A0'}</div>

          <div style={fieldLabel}>Last Day of Work</div>
          <div style={fieldValue}>{lastDay || '\u00A0'}</div>

          <div style={fieldLabel}>Notice Given</div>
          <div style={fieldValue}>{noticeGiven || '\u00A0'}</div>
        </div>
      </div>

      {/* Reason for Resignation */}
      <div style={sectionHeader}>Reason for Resignation</div>
      <div style={{ ...sectionBody, minHeight: '48px' }}>
        {reason || '\u00A0'}
      </div>

      {/* Equipment Returned */}
      <div style={sectionHeader}>Equipment Returned</div>
      <div style={sectionBody}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {equipmentItems.map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', fontSize: '7pt' }}>
              <div style={checkboxStyle(equipmentReturned[item.key])} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exit Interview */}
      <div style={sectionHeader}>Exit Interview</div>
      <div style={sectionBody}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '7pt' }}>
          <div style={checkboxStyle(exitInterviewCompleted)} />
          <span>Exit Interview Completed</span>
        </div>
      </div>

      {/* Final Pay Information */}
      <div style={sectionHeader}>Final Pay Information</div>
      <div style={{ ...sectionBody, minHeight: '40px' }}>
        {finalPayInfo || '\u00A0'}
      </div>

      {/* Acknowledgment */}
      <div style={{ fontSize: '5.5pt', color: '#6b7280', lineHeight: 1.4, marginTop: '6px' }}>
        This form documents the separation of employment between the above-named employee and JM Valley Group. By signing below, the employee acknowledges their voluntary resignation and confirms the return of all company property. Final wages will be paid in accordance with California Labor Code requirements. This document does not constitute a waiver of any rights under California or federal law. The employee may contact the California Labor Commissioner&apos;s Office with any questions regarding final pay or employment rights.
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
            {employeeSignature?.startsWith('data:')
              ? <img src={employeeSignature} style={{ height: '36px', maxWidth: '200px', display: 'block' }} alt="signature" />
              : (employeeSignature || '\u00A0')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Employee Signature</span>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Date: ___________</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            paddingBottom: '2px',
            fontSize: '8pt',
            color: '#2D2D2D',
            fontWeight: 500,
            minHeight: '16px',
          }}>
            <ManagerSignature name={managerName || managerSignature} email={userEmail} compact />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '6pt', color: '#666', fontWeight: 600 }}>Manager Signature</span>
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

export default ResignationPreview;
