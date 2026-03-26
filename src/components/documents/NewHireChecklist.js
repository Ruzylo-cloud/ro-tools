'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const NewHireChecklist = forwardRef(function NewHireChecklist({ data }, ref) {
  const { employeeName = '', startDate = '', position = '', storeNumber = '', storeName = '', managerName = '' } = data || {};

  return (
    <DocumentTemplate
      ref={ref}
      title="NEW HIRE CHECKLIST"
      subtitle="Manager Onboarding Checklist"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info Grid */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '8pt', color: '#6b7280' }}>Employee Name</span>
          <div style={{ borderBottom: '1px solid #134A7C', fontSize: '10pt', fontWeight: 600, color: '#2D2D2D', minHeight: '18px', padding: '2px 0' }}>
            {employeeName}
          </div>
        </div>
        <div style={{ width: '130px' }}>
          <span style={{ fontSize: '8pt', color: '#6b7280' }}>Start Date</span>
          <div style={{ borderBottom: '1px solid #134A7C', fontSize: '10pt', fontWeight: 600, color: '#2D2D2D', minHeight: '18px', padding: '2px 0' }}>
            {startDate}
          </div>
        </div>
        <div style={{ width: '130px' }}>
          <span style={{ fontSize: '8pt', color: '#6b7280' }}>Position</span>
          <div style={{ borderBottom: '1px solid #134A7C', fontSize: '10pt', fontWeight: 600, color: '#2D2D2D', minHeight: '18px', padding: '2px 0' }}>
            {position}
          </div>
        </div>
      </div>

      {/* Before First Day */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', marginBottom: '6px', letterSpacing: '0.5px',
      }}>
        BEFORE FIRST DAY
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Confirm start date, time, and who to ask for',
          'Verify Food Handler Card is obtained or scheduled',
          'Uniform ordered/ready (shirt, hat, apron)',
          'ADP account setup - send team member link',
          'Add to Homebase schedule',
          'Prepare training packet (Level 1-3)',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '24px' }}>&#9744;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Day 1 */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '8px 0 6px', letterSpacing: '0.5px',
      }}>
        DAY 1 - ORIENTATION
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Collect all paperwork: I-9 with 2 forms of ID, signed handbook pages',
          'Review & sign Employee Handbook — including at-will employment acknowledgment',
          'Provide Sexual Harassment & Discrimination Prevention Policy (CA AB-1825)',
          'Provide written Meal & Rest Break Rights notice (CA Labor Code §512, §226.7)',
          'Provide Notice of Pay Rate, Pay Date & Payroll Practices (CA Labor Code §2810.5)',
          'Provide Workers\' Compensation information and rights notice',
          'Tour of store - all stations, break area, lockers, emergency exits',
          'Introduce to team members on shift',
          'Review uniform policy and phone policy',
          'Review schedule / Homebase / communication expectations',
          'Begin Level 1 Training Packet',
          'Assign training buddy/shift lead',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '24px' }}>&#9744;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* First Week */}
      <div style={{
        background: '#134A7C', color: '#fff', fontSize: '9pt', fontWeight: 700,
        padding: '4px 12px', borderRadius: '4px', margin: '8px 0 6px', letterSpacing: '0.5px',
      }}>
        FIRST WEEK FOLLOW-UP
      </div>
      <div style={{ fontSize: '8pt', color: '#2D2D2D', lineHeight: '1.8' }}>
        {[
          'Verify payroll is set up correctly in ADP',
          'Check in on training progress - Level 1 benchmarks',
          'Address any questions or concerns',
          'Review performance and attitude',
          'Confirm schedule for week 2',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '24px' }}>&#9744;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Manager Sign Off */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '24px' }} />
          <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '2px' }}>Manager: {managerName}</div>
        </div>
        <div style={{ width: '120px' }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '24px' }} />
          <div style={{ fontSize: '7.5pt', color: '#6b7280', marginTop: '2px' }}>Date</div>
        </div>
      </div>
    </DocumentTemplate>
  );
});

export default NewHireChecklist;
