'use client';

import { forwardRef } from 'react';

const InjuryReportPreview = forwardRef(function InjuryReportPreview({ data }, ref) {
  const {
    employeeName = '',
    position = '',
    storeNumber = '',
    storeName = '',
    dateOfIncident = '',
    timeOfIncident = '',
    locationOfIncident = '',
    injuryType = '',
    bodyPartAffected = '',
    description = '',
    witnessName = '',
    witnessPhone = '',
    firstAidGiven = false,
    firstAidDescription = '',
    medicalTreatment = false,
    medicalFacility = '',
    employeeLeftWork = false,
    returnToWorkDate = '',
    supervisorName = '',
    supervisorActions = '',
    preventiveMeasures = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const sectionHeader = (text) => (
    <div style={{
      background: '#134A7C', color: '#fff', fontSize: '7.5pt', fontWeight: 700,
      padding: '3px 10px', borderRadius: '3px', marginBottom: '4px', marginTop: '8px',
      letterSpacing: '0.5px',
    }}>
      {text}
    </div>
  );

  const fieldRow = (label, value, width) => (
    <div style={{ flex: width || 1 }}>
      <span style={{ fontSize: '6.5pt', color: '#6b7280', fontWeight: 500 }}>{label}</span>
      <div style={{
        borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt',
        fontWeight: 600, color: '#2D2D2D', minHeight: '13px',
      }}>
        {value || ''}
      </div>
    </div>
  );

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
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JMVG" style={{ height: '40px', width: 'auto' }} crossOrigin="anonymous" />
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

      <div style={{ padding: '0 28px' }}>
        {/* Title */}
        <div style={{
          textAlign: 'center', fontSize: '13pt', fontWeight: 800, color: '#134A7C',
          letterSpacing: '1px', padding: '4px 0 4px',
        }}>
          WORKPLACE INJURY REPORT
        </div>
        <div style={{
          textAlign: 'center', fontSize: '7pt', color: '#EE3227', fontWeight: 600, marginBottom: '6px',
        }}>
          OSHA COMPLIANT &mdash; CALIFORNIA LABOR CODE &sect;6409.1
        </div>

        {/* Employee Info */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
          {fieldRow('Employee Name', employeeName)}
          {fieldRow('Position', position, 0.6)}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2px' }}>
          {fieldRow('Store #', storeNumber, 0.4)}
          {fieldRow('Store Name', storeName, 0.6)}
          {fieldRow('Date Reported', new Date().toLocaleDateString('en-US'))}
        </div>

        {/* Incident Details */}
        {sectionHeader('INCIDENT DETAILS')}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '3px' }}>
          {fieldRow('Date of Incident', formatDate(dateOfIncident))}
          {fieldRow('Time of Incident', formatTime(timeOfIncident), 0.6)}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '3px' }}>
          {fieldRow('Location of Incident', locationOfIncident)}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '3px' }}>
          {fieldRow('Type of Injury', injuryType)}
          {fieldRow('Body Part Affected', bodyPartAffected)}
        </div>

        {sectionHeader('DESCRIPTION OF INCIDENT')}
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '4px 8px',
          fontSize: '7pt', color: '#2D2D2D', minHeight: '40px', lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {description || 'Describe what happened in detail...'}
        </div>

        {sectionHeader('WITNESSES')}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2px' }}>
          {fieldRow('Witness Name', witnessName)}
          {fieldRow('Witness Phone', witnessPhone, 0.6)}
        </div>

        {sectionHeader('TREATMENT & RESPONSE')}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '3px', fontSize: '7pt' }}>
          <div style={{ flex: 1 }}>
            {checkItem(firstAidGiven, 'First Aid Administered on Site')}
            {firstAidGiven && firstAidDescription && (
              <div style={{ fontSize: '6.5pt', color: '#444', paddingLeft: '14px', marginBottom: '2px' }}>
                {firstAidDescription}
              </div>
            )}
            {checkItem(medicalTreatment, 'Medical Treatment Sought')}
            {medicalTreatment && medicalFacility && (
              <div style={{ fontSize: '6.5pt', color: '#444', paddingLeft: '14px', marginBottom: '2px' }}>
                Facility: {medicalFacility}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {checkItem(employeeLeftWork, 'Employee Left Work Due to Injury')}
            {employeeLeftWork && (
              <div style={{ fontSize: '6.5pt', color: '#444', paddingLeft: '14px' }}>
                Expected Return: {formatDate(returnToWorkDate) || 'TBD'}
              </div>
            )}
          </div>
        </div>

        {sectionHeader('SUPERVISOR RESPONSE')}
        <div style={{ marginBottom: '3px' }}>
          {fieldRow('Supervisor Name', supervisorName)}
        </div>
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '3px 8px',
          fontSize: '6.5pt', color: '#2D2D2D', minHeight: '24px', lineHeight: 1.4,
          whiteSpace: 'pre-wrap', marginBottom: '3px',
        }}>
          <span style={{ fontWeight: 600, color: '#134A7C' }}>Actions Taken: </span>
          {supervisorActions || '\u2014'}
        </div>
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '3px 8px',
          fontSize: '6.5pt', color: '#2D2D2D', minHeight: '24px', lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}>
          <span style={{ fontWeight: 600, color: '#134A7C' }}>Preventive Measures: </span>
          {preventiveMeasures || '\u2014'}
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
            <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>Employee Signature</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
            <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>Supervisor Signature</div>
          </div>
          <div style={{ width: '90px' }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
            <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
          </div>
        </div>

        <div style={{
          fontSize: '5pt', color: '#6b7280', textAlign: 'center', marginTop: '6px', fontStyle: 'italic',
          lineHeight: 1.35,
        }}>
          Cal/OSHA &sect;6409.1: Employers must report serious injuries within 8 hours. A copy will be sent to HR (bethany@jmvalley.com).
          Employee rights: medical treatment via workers&apos; compensation regardless of fault, right to report unsafe conditions without retaliation (Labor Code &sect;6311),
          right to request Cal/OSHA investigation (1-800-321-OSHA), and right to access OSHA 300 Log.
        </div>
      </div>

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

export default InjuryReportPreview;
