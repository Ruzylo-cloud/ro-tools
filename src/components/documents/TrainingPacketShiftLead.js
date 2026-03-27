'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketShiftLead = forwardRef(function TrainingPacketShiftLead({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  const sectionHeader = (text) => (
    <div style={{
      background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
      padding: '3px 10px', borderRadius: '3px', marginBottom: '4px', marginTop: '8px',
      letterSpacing: '0.5px',
    }}>
      {text}
    </div>
  );

  const checkItem = (text, indent) => (
    <div style={{ display: 'flex', gap: '4px', paddingLeft: indent ? '14px' : 0 }}>
      <span style={{ color: '#EE3227', fontWeight: 700, minWidth: '18px', flexShrink: 0, fontSize: '10pt' }}>&#9744;</span>
      <span>{text}</span>
    </div>
  );

  return (
    <DocumentTemplate
      ref={ref}
      title="SHIFT LEAD TRAINING PACKET"
      subtitle="Shift Lead Certification Program"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Employee Name</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '9pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '14px',
          }}>
            {employeeName}
          </div>
        </div>
        <div style={{ width: '14px' }} />
        <div style={{ width: '140px' }}>
          <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Start Date</span>
          <div style={{
            borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '9pt',
            fontWeight: 600, color: '#2D2D2D', minHeight: '14px',
          }}>
            {startDate}
          </div>
        </div>
      </div>

      {sectionHeader('LEADERSHIP FUNDAMENTALS')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Lead by example: first to work, last to leave your station. Always be the hardest worker')}
        {checkItem('Maintain positive attitude \u2014 your energy sets the tone for the entire shift')}
        {checkItem('Direct traffic: assign positions, move people to where they\'re needed')}
        {checkItem('Communicate clearly: use names, give specific direction, confirm understanding')}
        {checkItem('Handle customer complaints with empathy. Apologize, fix it, offer a cookie or free sub card')}
        {checkItem('NEVER argue with a customer. If escalated, call GM/operator immediately')}
        {checkItem('Hold team to standards: uniform, phone policy, station cleanliness, food quality')}
        {checkItem('Run shift meetings: brief team on projections, specials, any updates from management')}
        {checkItem('Provide feedback in the moment \u2014 praise publicly, correct privately')}
      </div>

      {sectionHeader('SHIFT OPERATIONS')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Pre-shift: review daily projection, staffing, any catering orders due')}
        {checkItem('Assign positions based on team strengths and training level')}
        {checkItem('Monitor line speed: cold subs under 90 seconds, hot subs under 5 minutes')}
        {checkItem('Keep the line moving: if backup forms, jump in and help')}
        {checkItem('Monitor food quality: check portion accuracy, bread quality, sub presentation')}
        {checkItem('Manage breaks: ensure all team members take required breaks per CA labor law')}
        {checkItem('Track and log meal period waivers if applicable (shifts under 6 hours)')}
        {checkItem('Monitor inventory levels during shift \u2014 call for restocks before running out')}
        {checkItem('Handle all cash discrepancies \u2014 count register at shift change, document overages/shortages')}
        {checkItem('Online order management: ensure tickets are made on time, accuracy checked before bag is sealed')}
      </div>

      {sectionHeader('FOOD SAFETY & COMPLIANCE')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Temperature logs: check and log walk-in, prep table, and hot holding temps every 2 hours')}
        {checkItem('Ensure FIFO rotation is followed at all times')}
        {checkItem('Monitor handwashing compliance \u2014 glove changes, proper technique')}
        {checkItem('Verify all food prep dates and discard anything past shelf life')}
        {checkItem('Cal/OSHA compliance: know emergency exits, first aid kit location, fire extinguisher location')}
        {checkItem('Accident/injury: administer first aid, document incident, notify GM within 1 hour')}
        {checkItem('Food allergen awareness: know how to handle allergy requests safely')}
      </div>

      {sectionHeader('CLOSING SHIFT LEAD RESPONSIBILITIES')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Final customer out, doors locked at exactly closing time')}
        {checkItem('Verify all online/phone orders have been picked up or voided')}
        {checkItem('Count register: create end-of-day count, reconcile with POS totals')}
        {checkItem('Secure all cash in safe \u2014 never leave cash unattended')}
        {checkItem('Breakdown: slicer cleaned, grill scraped and cleaned, cold table emptied and sanitized')}
        {checkItem('All food stored, covered, labeled, dated in walk-in')}
        {checkItem('Floors swept and mopped: front of house and back of house')}
        {checkItem('Restrooms cleaned and restocked')}
        {checkItem('Trash taken out, new liners in all cans')}
        {checkItem('All equipment turned off (except walk-in compressor): ovens, grill, lights')}
        {checkItem('Set alarm system, lock all doors, verify all exits secured')}
      </div>

      {/* Certification */}
      <div style={{
        background: '#EE3227', color: '#fff', fontSize: '8pt', fontWeight: 700,
        padding: '4px 10px', borderRadius: '3px', marginTop: '10px', marginBottom: '4px',
        letterSpacing: '0.5px', textAlign: 'center',
      }}>
        SHIFT LEAD CERTIFICATION
      </div>
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.4', textAlign: 'center', fontStyle: 'italic', marginBottom: '8px' }}>
        Trainee successfully leads 10 full shifts (mix of opens, mids, and closes) with all quality, safety, and operational standards met. GM verification required.
      </div>

      {/* Sign Off */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '18px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '2px' }}>Trainee Signature / Date</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '18px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '2px' }}>Trainer Signature / Date</div>
        </div>
      </div>
    </DocumentTemplate>
  );
});

export default TrainingPacketShiftLead;
