'use client';

import { forwardRef } from 'react';

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
  } = data || {};

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return d;
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

  const coachingTypeLabel = {
    attendance: 'Attendance / Punctuality',
    performance: 'Job Performance',
    behavior: 'Conduct / Behavior',
    policy: 'Policy Violation',
    safety: 'Safety Concern',
    other: 'Other',
  }[coachingType] || coachingType;

  return (
    <div
      ref={ref}
      style={{
        width: '612px',
        height: '792px',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      <div style={{ padding: '0 40px' }}>
        {/* Red top bar */}
        <div style={{ height: '6px', background: '#EE3227', borderRadius: '0 0 3px 3px' }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', padding: '8px 0 2px' }}>
          <img src="/jmvg-logo.png" alt="JMVG" style={{ width: '120px', height: 'auto' }} crossOrigin="anonymous" />
        </div>

        {/* Company name */}
        <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, color: '#134A7C', letterSpacing: '2px' }}>
          JM VALLEY GROUP
        </div>
        <div style={{ textAlign: 'center', fontSize: '6pt', color: '#6b7280', letterSpacing: '1px', marginBottom: '2px' }}>
          JERSEY MIKE&apos;S SUBS &mdash; FRANCHISE OPERATIONS
        </div>
        <div style={{ height: '2px', background: '#EE3227', margin: '2px 0 4px' }} />

        {/* Title */}
        <div style={{
          textAlign: 'center', fontSize: '13pt', fontWeight: 800, color: '#134A7C',
          letterSpacing: '1px', marginBottom: '2px',
        }}>
          EMPLOYEE COACHING FORM
        </div>
        <div style={{
          textAlign: 'center', fontSize: '7pt', color: '#6b7280', marginBottom: '6px',
        }}>
          Verbal Coaching &amp; Counseling Documentation
        </div>

        {/* Employee Info */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
          {fieldRow('Employee Name', employeeName)}
          {fieldRow('Position', position, 0.6)}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
          {fieldRow('Store #', storeNumber, 0.3)}
          {fieldRow('Store Name', storeName, 0.7)}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2px' }}>
          {fieldRow('Coach / Manager', coachName)}
          {fieldRow('Date', formatDate(coachingDate), 0.5)}
        </div>

        {/* Coaching Type */}
        {sectionHeader('TYPE OF COACHING')}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
          {['attendance', 'performance', 'behavior', 'policy', 'safety', 'other'].map(type => (
            <div key={type} style={{
              display: 'flex', alignItems: 'center', gap: '3px', fontSize: '6.5pt',
            }}>
              <div style={{
                width: '9px', height: '9px', border: '1.5px solid #134A7C', borderRadius: '50%',
                background: coachingType === type ? '#134A7C' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {coachingType === type && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ color: '#2D2D2D' }}>
                {{
                  attendance: 'Attendance',
                  performance: 'Performance',
                  behavior: 'Conduct',
                  policy: 'Policy',
                  safety: 'Safety',
                  other: 'Other',
                }[type]}
              </span>
            </div>
          ))}
        </div>
        {previousDates && (
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '2px' }}>
            <span style={{ fontWeight: 600 }}>Previous Coaching Dates:</span> {previousDates}
          </div>
        )}

        {/* Concern */}
        {sectionHeader('DESCRIPTION OF CONCERN')}
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '4px 8px',
          fontSize: '7pt', color: '#2D2D2D', minHeight: '50px', lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {concern || 'Describe the specific behavior, incident, or performance issue...'}
        </div>

        {/* Expectations */}
        {sectionHeader('EXPECTATIONS & STANDARDS')}
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '4px 8px',
          fontSize: '7pt', color: '#2D2D2D', minHeight: '36px', lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {expectations || 'What is the expected standard of performance or behavior?'}
        </div>

        {/* Action Items */}
        {sectionHeader('ACTION ITEMS & IMPROVEMENT PLAN')}
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '4px 8px',
          fontSize: '7pt', color: '#2D2D2D', minHeight: '36px', lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {actionItems || 'Specific steps the employee will take to improve...'}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          {fieldRow('Follow-Up Date', formatDate(followUpDate), 0.5)}
          <div style={{ flex: 1 }} />
        </div>

        {/* Consequences */}
        {sectionHeader('CONSEQUENCES IF NOT CORRECTED')}
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '4px 8px',
          fontSize: '7pt', color: '#2D2D2D', minHeight: '24px', lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {consequences || 'Continued failure to meet expectations may result in further disciplinary action, up to and including termination of employment.'}
        </div>

        {/* Employee Comments */}
        {sectionHeader('EMPLOYEE COMMENTS')}
        <div style={{
          border: '1px solid #ccc', borderRadius: '3px', padding: '4px 8px',
          fontSize: '7pt', color: '#2D2D2D', minHeight: '30px', lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {employeeComments || ''}
        </div>

        {/* Acknowledgment */}
        <div style={{
          fontSize: '6pt', color: '#6b7280', marginTop: '6px', lineHeight: 1.5, fontStyle: 'italic',
        }}>
          By signing below, the employee acknowledges this coaching conversation took place. This signature does not
          necessarily indicate agreement with the above statements. This is a verbal coaching record and does not
          constitute a formal written warning per California Labor Code.
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
            <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>Employee Signature</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
            <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>Manager / Coach Signature</div>
          </div>
          <div style={{ width: '90px' }}>
            <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
            <div style={{ fontSize: '6pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '6pt', fontWeight: 600, padding: '4px 20px',
        letterSpacing: '0.5px',
      }}>
        CONFIDENTIAL &mdash; INTERNAL USE ONLY &mdash; JM VALLEY GROUP
      </div>
    </div>
  );
});

export default CoachingFormPreview;
