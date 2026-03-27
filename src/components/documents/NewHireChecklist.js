'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const NewHireChecklist = forwardRef(function NewHireChecklist({ data }, ref) {
  const { employeeName = '', startDate = '', position = '', storeNumber = '', storeName = '', managerName = '' } = data || {};

  const sectionHeader = (text) => (
    <div style={{
      background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
      padding: '3px 10px', borderRadius: '3px', marginBottom: '4px', marginTop: '8px',
      letterSpacing: '0.5px',
    }}>
      {text}
    </div>
  );

  const checkItem = (text) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '18px', flexShrink: 0, fontSize: '10pt' }}>&#9744;</span>
      <span>{text}</span>
    </div>
  );

  return (
    <DocumentTemplate
      ref={ref}
      title="NEW HIRE CHECKLIST"
      subtitle="Manager Onboarding Checklist"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Employee Name</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '2px 0', fontSize: '9pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '16px',
          }}>
            {employeeName}
          </div>
        </div>
        <div style={{ width: '140px' }}>
          <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Start Date</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '2px 0', fontSize: '9pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '16px',
          }}>
            {startDate}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Position</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '2px 0', fontSize: '9pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '16px',
          }}>
            {position}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Manager Name</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '2px 0', fontSize: '9pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '16px',
          }}>
            {managerName}
          </div>
        </div>
      </div>

      {sectionHeader('BEFORE FIRST DAY')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Confirm start date, time, and who to ask for')}
        {checkItem('Verify Food Handler Card is obtained or scheduled')}
        {checkItem('Uniform ordered/ready (shirt, hat, apron)')}
        {checkItem('ADP account setup - send team member link')}
        {checkItem('Add to Homebase schedule')}
        {checkItem('Prepare training packet (Level 1-3)')}
      </div>

      {sectionHeader('DAY 1 - ORIENTATION')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Collect all paperwork: I-9 with 2 forms of ID, signed handbook pages')}
        {checkItem('Review & sign Employee Handbook \u2014 including at-will employment acknowledgment')}
        {checkItem('Provide Sexual Harassment & Discrimination Prevention Policy (CA AB-1825)')}
        {checkItem('Provide written Meal & Rest Break Rights notice (CA Labor Code \u00A7512, \u00A7226.7)')}
        {checkItem('Provide Notice of Pay Rate, Pay Date & Payroll Practices (CA Labor Code \u00A72810.5)')}
        {checkItem('Provide Workers\' Compensation information and rights notice')}
        {checkItem('Tour of store - all stations, break area, lockers, emergency exits')}
        {checkItem('Introduce to team members on shift')}
        {checkItem('Review uniform policy and phone policy')}
        {checkItem('Review schedule / Homebase / communication expectations')}
        {checkItem('Begin Level 1 Training Packet')}
        {checkItem('Assign training buddy/shift lead')}
      </div>

      {sectionHeader('FIRST WEEK FOLLOW-UP')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Verify payroll is set up correctly in ADP')}
        {checkItem('Check in on training progress - Level 1 benchmarks')}
        {checkItem('Address any questions or concerns')}
        {checkItem('Review performance and attitude')}
        {checkItem('Confirm schedule for week 2')}
      </div>

      {/* Sign Off */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '18px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '2px' }}>Manager Signature / Date</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '18px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '2px' }}>Employee Signature / Date</div>
        </div>
      </div>
    </DocumentTemplate>
  );
});

export default NewHireChecklist;
