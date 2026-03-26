'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel1 = forwardRef(function TrainingPacketLevel1({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  return (
    <DocumentTemplate
      ref={ref}
      title="LEVEL 1 TRAINING PACKET"
      subtitle="Day 1 - Orientation / Policies & Procedures"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '8pt', color: '#6b7280', fontWeight: 500 }}>Employee Name</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '2px 0', fontSize: '10pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '18px',
          }}>
            {employeeName}
          </div>
        </div>
        <div style={{ width: '20px' }} />
        <div style={{ width: '160px' }}>
          <span style={{ fontSize: '8pt', color: '#6b7280', fontWeight: 500 }}>Start Date</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '2px 0', fontSize: '10pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '18px',
          }}>
            {startDate}
          </div>
        </div>
      </div>

      {/* Section: Welcome */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        WELCOME TO JERSEY MIKE&apos;S SUBS
      </div>

      {/* Checklist items */}
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.7' }}>
        {[
          'Greet, Welcome, Give uniform, collect paperwork',
          'Review Paperwork & send to payroll, circle anything that is missing',
          ['ID and 2 forms of ID', 'All Signature Pages in Handbook', 'Food Handler Card'],
          'GM send I9 to ADP / send team member link to set up ADP account',
          'History of Jersey Mikes - Importance of the "experience" of each customer',
          'Review of training packet / training program / shift notes / level certifications',
        ].map((item, i) => (
          Array.isArray(item) ? (
            <div key={i} style={{ paddingLeft: '20px' }}>
              {item.map((sub, j) => (
                <div key={j} style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ color: '#134A7C', fontWeight: 700 }}>___</span>
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          ) : (
            <div key={i} style={{ display: 'flex', gap: '6px' }}>
              <span style={{ color: '#134A7C', fontWeight: 700 }}>___</span>
              <span>{item}</span>
            </div>
          )
        ))}
      </div>

      {/* Section: Uniform & Scheduling */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '8px 0 6px', letterSpacing: '0.5px',
      }}>
        UNIFORM REQUIREMENTS &amp; SCHEDULING
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.7' }}>
        {[
          'CLEAN UNIFORM, every shift. Shirt tucked, hair behind visor, apron clean, black work shoes',
          'No piercing must be stud, gauges must be white or nude',
          'Scheduling Preferences: awarded for work ethic, attitude, reliability, sense of urgency',
          'Hours are given based on performance, schedules are never guaranteed',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: '#134A7C', fontWeight: 700 }}>___</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Section: Daily Procedures */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '8px 0 6px', letterSpacing: '0.5px',
      }}>
        DAILY PROCEDURES
      </div>
      <div style={{ fontSize: '7.5pt', color: '#2D2D2D', lineHeight: '1.6' }}>
        {[
          'Treat all of the equipment in the store with CARE. It is very expensive.',
          'Clock in each shift (no earlier than 5 min before). Full uniform, ready to work.',
          'BEFORE clocking in: hat, apron on, shirt tucked in, items put away in locker.',
          'Punctuality is extremely important.',
          'Cut time is always give or take 30 minutes. Checklist must be completed.',
          'Homebase schedule comes out every Friday. Used for TEAM COMMUNICATION.',
          'Pay periods: every other Friday, direct deposit available, sign up on ADP.',
          'Overtime - not permitted without specific authorization.',
          'Break and meal periods - 10 min break for 4.5 hour shift or less, 30 min CLOCK OUT meal break for 5+ hours.',
          'Free Mini per shift. Write your mini sandwich in on your checklist each day.',
          'More than your free mini, chips and fountain soda is 50% off. Your discount applies to you only.',
          'Use of phone while on the clock not permitted - phones must be left in your locker.',
          'Stay in work station at all times, alert shift lead if need to get water, use restroom, etc.',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: '#134A7C', fontWeight: 700 }}>___</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </DocumentTemplate>
  );
});

export default TrainingPacketLevel1;
