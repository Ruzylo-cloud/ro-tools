'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel3 = forwardRef(function TrainingPacketLevel3({ data }, ref) {
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
      title="LEVEL 3 TRAINING PACKET"
      subtitle="Hot Subs Certification &mdash; Weeks 5 & 6"
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

      {sectionHeader('HOT SUBS BENCHMARKS \u2014 WEEK 5, DAY 1')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('BOPS every time. Bread, Onions, Peppers, Steak.')}
        {checkItem('Scrape grill after every round of subs.')}
        {checkItem('Food quality. Do not overcook the steak!! No more than 4 pieces of meat on the grill.')}
        {checkItem('Label every sub (no matter what) before calling name or leaving sub by register.')}
      </div>

      {sectionHeader('HOT SUB STATION TRAINING')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginBottom: '2px' }}>Set Up / Cleanliness / Organization:</div>
        {checkItem('Always wash hands first thing, always wear gloves, change gloves if touch mask, rag, etc.')}
        {checkItem('Stock area with bags, hot sub paper (red logos), cutting board, knife. Stock hot sub fridge unit \u2013 top sauces, bottom meats. Stock top with 2 scrapers & 2 spatulas of each color.')}
        {checkItem('Keep grill clean. No build up, scrape every time.')}
        {checkItem('Grill top set at 350.')}
        {checkItem('Check hot sub bread to see what you have. Alert shift lead if running low or empty.')}

        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginTop: '4px', marginBottom: '2px' }}>Customer Service / Communication:</div>
        {checkItem('Whenever possible, take hot sub orders from customers in line starting with whoever is next.')}
        {checkItem('If more than 3 tickets up above grill, tell customers to expect longer wait times.')}
        {checkItem('Write ticket on pad \u2013 green copy to customer, yellow copy to ticket line above grill.')}
        {checkItem('BEFORE handing out hot sub: check ticket rack by register to confirm it was PAID, then call out name.')}
        {checkItem('Always label every sub bag with number or name.')}
        {checkItem('Ask wrap to help distribute subs if needed.')}

        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginTop: '4px', marginBottom: '2px' }}>Portion Control:</div>
        {checkItem('Proper amounts of ingredients on all sandwiches = sandwich tastes perfect!')}
        {checkItem('Use posted guides for hot subs until completely committed to memory.')}

        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginTop: '4px', marginBottom: '2px' }}>Operations:</div>
        {checkItem('Sense of Urgency! First ticket up = sub on grill within 30 seconds.')}
        {checkItem('More than 4 sandwiches on ticket rack? CALL FOR A SECOND PERSON. Alert shift lead.')}
        {checkItem('Always follow BOPS. Bread, Onions, Peppers, Steak.')}
        {checkItem('NEVER overcook meat. Cheese goes on when meat is still pink.')}
        {checkItem('Allow meat to SEAR: 30 seconds side 1, 30 seconds side 2 BEFORE cutting 4 by 4.')}
        {checkItem('Cut with 4 by 4 motion \u2013 all pieces bite size. Not too large or small.')}
        {checkItem('Regulars are NOT cut. Giants are served as 2 regulars, wrapped together.')}
        {checkItem('Use tongs to grab steak and chicken, EVERY time!')}
      </div>

      {sectionHeader('HOT SUBS MASTERY \u2014 WEEKS 5-6')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Keep hot sub area clean and stocked. Stock yourself, call for backup only when you can\'t leave.')}
        {checkItem('Take customer hot sub orders during downtime.')}
        {checkItem('BOPS every time.')}
        {checkItem('Dark brown sear on each side / cheese on when steak is still pink.')}
        {checkItem('Tongs used every time.')}
        {checkItem('Removing "P" hot sub tickets every time.')}
        {checkItem('No food left on the grill.')}
        {checkItem('Cut steaks no more and no less than 16 times.')}
        {checkItem('Only corners of cheese are melted on the steak.')}
      </div>

      {/* Certification */}
      <div style={{
        background: '#EE3227', color: '#fff', fontSize: '8pt', fontWeight: 700,
        padding: '4px 10px', borderRadius: '3px', marginTop: '10px', marginBottom: '4px',
        textAlign: 'center', letterSpacing: '0.5px',
      }}>
        LEVEL 3: HOT SUBS CERTIFICATION
      </div>
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.4, textAlign: 'center', fontStyle: 'italic', marginBottom: '8px' }}>
        Once trainee feels confident, they should ask to be certified. Trainee works lunch rush beside Trainer. Trainer submits video of #17 being made properly.
      </div>
      <div style={{ fontSize: '7pt', color: '#EE3227', fontWeight: 700, textAlign: 'center', margin: '2px 0 6px' }}>
        CONGRATS ON REACHING LEVEL 3! LET YOUR GM KNOW TO ADD YOU TO THE TIP POOL!
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

export default TrainingPacketLevel3;
