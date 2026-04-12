'use client';

import { forwardRef } from 'react';
import ManagerSignature from './ManagerSignature';

const CoachingFormPreview = forwardRef(function CoachingFormPreview({ data }, ref) {
  const {
    employeeName = '',
    position = '',
    storeNumber = '',
    storeName = '',
    coachName = '',
    coachingDate = '',
    coachingType = '',
    previousDates = '',
    concern = '',
    expectations = '',
    actionItems = '',
    followUpDate = '',
    consequences = '',
    employeeComments = '',
    userEmail = '',
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
  };

  const sectionHdr = (text) => (
    <div style={{
      background: '#134A7C', color: '#fff', fontSize: '7pt', fontWeight: 700,
      padding: '2px 8px', borderRadius: '2px', marginBottom: '2px', marginTop: '5px',
      letterSpacing: '0.5px',
    }}>
      {text}
    </div>
  );

  const fieldRow = (label, value, width) => (
    <div style={{ flex: width || 1 }}>
      <span style={{ fontSize: '6pt', color: '#6b7280', fontWeight: 500 }}>{label}</span>
      <div style={{
        borderBottom: '1px solid #134A7C', padding: '0', fontSize: '7.5pt',
        fontWeight: 600, color: '#2D2D2D', minHeight: '12px',
      }}>
        {value || ''}
      </div>
    </div>
  );

  const textBox = (content, placeholder, minH) => (
    <div style={{
      border: '1px solid #ccc', borderRadius: '2px', padding: '3px 6px',
      fontSize: '6.5pt', color: content ? '#2D2D2D' : '#999', minHeight: minH || '28px',
      lineHeight: 1.4, whiteSpace: 'pre-wrap',
    }}>
      {content || placeholder || ''}
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
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
      }}
    >
      {/* Top Red Bar */}
      <div style={{ height: '5px', background: '#EE3227' }} />

      {/* JMVG Logo */}
      <div style={{ textAlign: 'center', padding: '5px 0 2px' }}>
        <img src="/jmvg-logo.png" alt="JMVG" style={{ height: '90px', width: '90px', objectFit: 'contain' }} crossOrigin="anonymous" />
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
          textAlign: 'center', fontSize: '11pt', fontWeight: 800, color: '#134A7C',
          letterSpacing: '1px', padding: '4px 0 4px',
        }}>
          EMPLOYEE COACHING FORM
        </div>
        <div style={{ textAlign: 'center', fontSize: '6pt', color: '#6b7280', marginBottom: '4px' }}>
          Verbal Coaching &amp; Counseling Documentation
        </div>

        {/* Employee Info */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Employee Name', employeeName)}
          {fieldRow('Position', position, 0.6)}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3px' }}>
          {fieldRow('Store #', storeNumber, 0.3)}
          {fieldRow('Store Name', storeName, 0.7)}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1px' }}>
          {fieldRow('Coach / Manager', coachName)}
          {fieldRow('Date', formatDate(coachingDate), 0.5)}
        </div>

        {/* Coaching Type */}
        {sectionHdr('TYPE OF COACHING')}
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '1px' }}>
          {['attendance', 'performance', 'behavior', 'policy', 'safety', 'other'].map(type => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '6pt' }}>
              <div style={{
                width: '8px', height: '8px', border: '1.5px solid #134A7C', borderRadius: '50%',
                background: coachingType === type ? '#134A7C' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {coachingType === type && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ color: '#2D2D2D' }}>
                {{ attendance: 'Attendance', performance: 'Performance', behavior: 'Conduct', policy: 'Policy', safety: 'Safety', other: 'Other' }[type]}
              </span>
            </div>
          ))}
        </div>
        {previousDates && (
          <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>
            <span style={{ fontWeight: 600 }}>Previous Coaching Dates:</span> {previousDates}
          </div>
        )}

        {/* Concern */}
        {sectionHdr('DESCRIPTION OF CONCERN')}
        {textBox(concern, 'Describe the specific behavior, incident, or performance issue...', '40px')}

        {/* Expectations */}
        {sectionHdr('EXPECTATIONS & STANDARDS')}
        {textBox(expectations, 'What is the expected standard of performance or behavior?', '28px')}

        {/* Action Items */}
        {sectionHdr('ACTION ITEMS & IMPROVEMENT PLAN')}
        {textBox(actionItems, 'Specific steps the employee will take to improve...', '28px')}
        <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
          {fieldRow('Follow-Up Date', formatDate(followUpDate), 0.5)}
          <div style={{ flex: 1 }} />
        </div>

        {/* Consequences */}
        {sectionHdr('CONSEQUENCES IF NOT CORRECTED')}
        {textBox(consequences, 'Continued failure to meet expectations may result in further disciplinary action, up to and including termination of employment.', '20px')}

        {/* Employee Comments */}
        {sectionHdr('EMPLOYEE COMMENTS')}
        {textBox(employeeComments, '', '24px')}

        {/* Acknowledgment */}
        <div style={{
          fontSize: '5pt', color: '#6b7280', marginTop: '5px', lineHeight: 1.35, fontStyle: 'italic',
        }}>
          By signing below, employee acknowledges this coaching conversation took place. Signature does not indicate agreement. This is a verbal coaching record, not a formal written warning per California Labor Code. This does not alter at-will employment status — employment may be terminated at any time, for any lawful reason, with or without notice. Employee has the right to add written comments above and may not be retaliated against for reporting safety concerns, wage violations, discrimination, or exercising rights protected under California or federal law.
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Employee Signature</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ minHeight: '14px' }}>
              <ManagerSignature name={coachName} email={userEmail} compact />
            </div>
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Manager / Coach Signature</div>
          </div>
          <div style={{ width: '80px' }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '14px' }} />
            <div style={{ fontSize: '5.5pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
          </div>
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

export default CoachingFormPreview;
