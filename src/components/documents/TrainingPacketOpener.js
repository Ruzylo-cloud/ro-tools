'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketOpener = forwardRef(function TrainingPacketOpener({ data }, ref) {
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
      title="OPENER TRAINING PACKET"
      subtitle="Opening Shift Certification"
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

      {sectionHeader('PRE-OPEN CHECKLIST \u2014 ARRIVAL (1 HOUR BEFORE OPEN)')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Arrive on time, in full uniform, ready to work')}
        {checkItem('Disarm alarm system with assigned code')}
        {checkItem('Turn on ALL lights: front, back, lobby, restrooms, outdoor signage')}
        {checkItem('Start ovens immediately \u2014 preheat to correct temperatures (posted on oven)')}
        {checkItem('Start grill \u2014 set to 350\u00B0F')}
        {checkItem('Check walk-in temps: walk-in cooler (below 40\u00B0F), freezer (below 0\u00B0F). Log temps')}
        {checkItem('Pull bread from freezer to proof rack per daily bread projection')}
        {checkItem('Check voicemails and online orders \u2014 print any early tickets')}
        {checkItem('Review Homebase for any messages from management')}
      </div>

      {sectionHeader('FOOD PREP \u2014 45 MIN BEFORE OPEN')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Pull proteins from walk-in: set up slicer station with morning proteins')}
        {checkItem('Prep onions: slice thin and even, enough for full day based on projections')}
        {checkItem('Prep tomatoes: core, slice end to end, consistent thickness')}
        {checkItem('Prep lettuce: hand-shred into uniform pieces, fill 3 bins minimum')}
        {checkItem('Prep peppers: slice for cheesesteak (onions and peppers)')}
        {checkItem('Stock cold table: all proteins, cheeses, vegetables in proper order')}
        {checkItem('Check condiment levels: oil, vinegar, mayo, mustard, hot peppers, cherry pepper relish')}
        {checkItem('Stock chips, cookies, and drinks in display areas')}
        {checkItem('Check all fountain drink syrups \u2014 replace any that are low')}
        {checkItem('Fill ice bin at drink station')}
      </div>

      {sectionHeader('LINE SETUP \u2014 15 MIN BEFORE OPEN')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Wrap station: stock paper, labels, Sharpies, bags (all sizes), stickers')}
        {checkItem('Register station: count drawer (should be $200), enter opening count, 3 pens, tip jar')}
        {checkItem('Hot sub station: stock ticket pads, bags, hot sub paper')}
        {checkItem('Lobby: chairs down, tables wiped, condiment bar stocked, trash cans lined')}
        {checkItem('Restrooms: stocked with soap, paper towels, toilet paper. Clean and dry')}
        {checkItem('Front door area: sweep entrance, check for any overnight deliveries')}
        {checkItem('Turn on music system to appropriate volume')}
        {checkItem('Unlock front door at EXACTLY opening time \u2014 not early, not late')}
      </div>

      {sectionHeader('QUALITY CHECKS & STANDARDS')}
      <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: '1.35' }}>
        {checkItem('Bread quality: proof rack bread should be soft, risen, not flat or overproofed')}
        {checkItem('First round of bread in oven: time according to posted schedule')}
        {checkItem('Taste-test sub: make yourself a mini to verify all ingredients are fresh')}
        {checkItem('Signage: all menu boards visible, pricing current, promotional materials displayed')}
        {checkItem('POS system: verify all items ring correctly, check for any system updates')}
      </div>

      {/* Certification */}
      <div style={{
        background: '#EE3227', color: '#fff', fontSize: '8pt', fontWeight: 700,
        padding: '4px 10px', borderRadius: '3px', marginTop: '10px', marginBottom: '4px',
        letterSpacing: '0.5px', textAlign: 'center',
      }}>
        OPENER CERTIFICATION
      </div>
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.4', textAlign: 'center', fontStyle: 'italic', marginBottom: '8px' }}>
        Trainee opens the store independently with all stations ready, food prepped to standard, and doors unlocked on time for 5 consecutive opening shifts.
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

export default TrainingPacketOpener;
