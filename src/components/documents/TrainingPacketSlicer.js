'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketSlicer = forwardRef(function TrainingPacketSlicer({ data }, ref) {
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
      title="SLICER TRAINING PACKET"
      subtitle="4-Week Slicer Certification"
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

      {sectionHeader('SLICER FUNDAMENTALS \u2014 WEEK 1')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Safety first: blade guard on when not actively slicing. NEVER leave slicer unattended while running')}
        {checkItem('Wash hands thoroughly before handling any meat or cheese')}
        {checkItem('Proper assembly: ensure blade, carriage, and product pusher are clean and secure before use')}
        {checkItem('Slicer settings: #1 for cold subs (standard), #2 for cheesesteak meat (thick)')}
        {checkItem('Slicing technique: smooth, consistent strokes. Let the slicer do the work')}
        {checkItem('Always use cut-resistant glove on the non-dominant hand')}
        {checkItem('Proper weight portions per sandwich size (Mini / Reg / Giant) \u2014 memorize posted chart')}
        {checkItem('Meat is sliced FRESH for every sub. Never pre-slice and let it sit')}
        {checkItem('Lay meat flat and evenly across the sub \u2014 full coverage from end to end')}
        {checkItem('Cheese is sliced and placed on the opposite side of the bread, overlapping slightly')}
      </div>

      {sectionHeader('COLD SUB BUILD \u2014 WEEK 2')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Bread selection and freshness check \u2014 if bread is too hard or stale, pull it')}
        {checkItem('Proper bread cutting technique: slight angle, not cutting all the way through')}
        {checkItem('Oil & vinegar application: 3 passes of oil, 3 passes of red wine vinegar')}
        {checkItem('Oregano and salt: light dusting, consistent coverage')}
        {checkItem('Mike\'s Way build order: onions, lettuce, tomatoes, vinegar, oil, oregano & salt')}
        {checkItem('Meat portions per sub size (use reference guide): Mini = 1/4 lb, Reg = 1/2 lb, Giant = 1 lb')}
        {checkItem('Cheese placement \u2014 2 triangles for Mini, 3 for Reg, 4 for Giant')}
        {checkItem('Topping placement: even distribution, no clumps, lettuce shredded properly')}
        {checkItem('Sub presentation: meat and toppings visible, not hanging over sides')}
        {checkItem('Speed benchmark: complete cold sub in under 90 seconds by end of week 2')}
      </div>

      {sectionHeader('SLICER MAINTENANCE & SAFETY \u2014 WEEK 3')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Clean slicer every 2 hours during service (or sooner if switching proteins)')}
        {checkItem('Full breakdown and sanitization at close: blade, carriage, product pusher, base')}
        {checkItem('NEVER submerge the slicer base in water')}
        {checkItem('Blade sharpening: use built-in sharpener, 4 passes on each side')}
        {checkItem('Proper storage of sliced proteins between uses \u2014 covered, labeled, dated')}
        {checkItem('FIFO rotation: First In, First Out for all refrigerated products')}
        {checkItem('Temperature checks: walk-in must be at or below 40\u00B0F, log daily')}
        {checkItem('All proteins must be back in the walk-in within 30 minutes of being pulled')}
        {checkItem('Know shelf life for all proteins (posted in walk-in)')}
        {checkItem('Report any slicer malfunction to manager immediately \u2014 do not attempt to fix')}
      </div>

      {sectionHeader('SLICER MASTERY & CERTIFICATION \u2014 WEEK 4')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Consistent portion accuracy within 0.5 oz (weigh random subs during rush)')}
        {checkItem('Speed: sub built in under 60 seconds consistently')}
        {checkItem('Customer interaction while slicing \u2014 acknowledge and engage customers in line')}
        {checkItem('Ability to handle 3+ subs in sequence without backup')}
        {checkItem('Work clean: station organized, no excess product on cutting board')}
        {checkItem('Proper handoff to wrapper: sub positioned correctly, order called out clearly')}
        {checkItem('Train others: demonstrate slicer technique to new team members')}
      </div>

      {/* Certification */}
      <div style={{
        background: '#EE3227', color: '#fff', fontSize: '8pt', fontWeight: 700,
        padding: '4px 10px', borderRadius: '3px', marginTop: '10px', marginBottom: '4px',
        letterSpacing: '0.5px', textAlign: 'center',
      }}>
        SLICER CERTIFICATION &mdash; 4 WEEK PROGRAM
      </div>
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.4', textAlign: 'center', fontStyle: 'italic', marginBottom: '8px' }}>
        Trainee demonstrates consistent portioning, speed, safety, and customer engagement while operating the slicer station during a full lunch rush.
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

export default TrainingPacketSlicer;
