'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel1 = forwardRef(function TrainingPacketLevel1({ data }, ref) {
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
      title="LEVEL 1 TRAINING PACKET"
      subtitle="Sprinkle / Wrap Certification"
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

      <div style={{
        textAlign: 'center', fontSize: '9pt', fontWeight: 700, color: '#134A7C',
        margin: '4px 0 6px', letterSpacing: '0.5px',
      }}>
        DAY 1 - ORIENTATION / POLICIES &amp; PROCEDURES
      </div>

      {sectionHeader('WELCOME TO JERSEY MIKE\'S SUBS')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Greet, Welcome, Give uniform, collect paperwork')}
        {checkItem('Review Paperwork & send to payroll, circle anything that is missing')}
        {checkItem('I9 and 2 forms of ID', true)}
        {checkItem('All Signature Pages in Handbook', true)}
        {checkItem('Food Handler Card', true)}
        {checkItem('GM send I9 to ADP / send team member link to set up ADP account')}
        {checkItem('History of Jersey Mikes \u2013 Importance of the "experience" of each customer')}
        {checkItem('Review of training packet / training program / shift notes / level certifications. Thoroughly discuss how our training program works.')}
        {checkItem('Uniform requirements. CLEAN UNIFORM, every shift. Shirt tucked, hair behind visor, apron clean, black work shoes, nose piercing must be stud, gauges must be white or nude.')}
        {checkItem('Scheduling Preferences: awarded for work ethic, attitude, reliability, sense of urgency. Hours are given based on performance, schedules are never guaranteed.')}
      </div>

      {sectionHeader('DAILY PROCEDURES')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Treat all of the equipment in the store with CARE. It is very expensive.')}
        {checkItem('Clock in for each shift (no earlier than 5 min before). Full uniform, ready to work, BEFORE clocking in (hat, apron on, shirt tucked in, items put away in locker).')}
        {checkItem('Punctuality is extremely important.')}
        {checkItem('Out time is always give or take 30 minutes. Checklist must be completed and ok\'d by shift lead before leaving.')}
        {checkItem('Homebase \u2013 schedule comes out every Friday. Also used for TEAM COMMUNICATION \u2013 messages from Management must be read thoroughly.')}
        {checkItem('Pay periods: every other Friday, direct deposit available, sign up on ADP.')}
        {checkItem('Overtime \u2013 not permitted without specific authorization.')}
        {checkItem('Break and meal periods \u2013 10 min break for 4.5 hr shift or less, 30 min CLOCK OUT meal break for 5+ hr shift.')}
        {checkItem('Free Mini per shift. Write your mini sandwich in on your checklist each day.')}
        {checkItem('Anything more than your free mini, chips and fountain soda is 50% off. Your discount applies to you only. Friends / family receive 20% off with GM approval.')}
        {checkItem('Use of phone while on the clock not permitted \u2013 phones must be left in your locker.')}
        {checkItem('Stay in work station at all times, alert shift lead if need to get water, use restroom, etc.')}
      </div>

      {sectionHeader('CUSTOMER SERVICE')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('KIND TONES!! Practice approachability and warmth with the way we speak to customers.')}
        {checkItem('We expect a smile, positive attitude, willingness to work hard, and make each customer\'s day better!')}
        {checkItem('MESS UPS! Show empathy. "So sorry we messed that up." Only SHIFT LEADS handle order mistakes.')}
        {checkItem('Include customers in your conversations! Always banter!')}
        {checkItem('Offer FREE COOKIES TO KIDS. Always ask parents first!')}
      </div>

      {sectionHeader('STORE POLICIES')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Accident reporting \u2013 Always report any injury to your GM immediately.')}
        {checkItem('Absenteeism \u2013 CALL OUTS ARE NOT PERMITTED. Find someone to work your shift.')}
        {checkItem('Requesting time off: 2 weeks notice. More than 3 days requires 4 weeks. 10 days/year.')}
        {checkItem('Apron removed when leaving back area: restroom, lobby check, trash run, etc.')}
        {checkItem('Always remove gloves before touching a rag or any cleaning products.')}
        {checkItem('No access behind the line when NOT in uniform.')}
        {checkItem('Review shoes & shirt program (at 3 month mark: $45 toward shoes + 2nd shirt).')}
        {checkItem('Friend referral program: $100 cash bonus when referral hits 90 day mark.')}
      </div>

      {sectionHeader('TRAINING PAY / GROWTH')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Completion of each Level = $50 BONUS.')}
        {checkItem('Level 3 Certification = added to store tip pool. 6 week training program.')}
        {checkItem('Growth opportunities: Trainers, Shift Leads, Lead Trainer, AGM and GM.')}
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

export default TrainingPacketLevel1;
