'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel2 = forwardRef(function TrainingPacketLevel2({ data }, ref) {
  const { employeeName = '', storeNumber = '', storeName = '' } = data || {};

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
      <span style={{ color: '#134A7C', fontWeight: 700, minWidth: '20px', flexShrink: 0 }}>___</span>
      <span>{text}</span>
    </div>
  );

  return (
    <DocumentTemplate
      ref={ref}
      title="LEVEL 2 TRAINING PACKET"
      subtitle="Register / Wrap Certification \u2014 Weeks 3 & 4"
      storeNumber={storeNumber}
      storeName={storeName}
    >
      {/* Employee Info */}
      <div style={{ marginBottom: '6px' }}>
        <span style={{ fontSize: '7pt', color: '#6b7280', fontWeight: 500 }}>Employee: </span>
        <span style={{
          fontSize: '9pt', fontWeight: 600, color: '#2D2D2D',
          borderBottom: '1px solid #134A7C', padding: '0 4px',
        }}>
          {employeeName || '___________________'}
        </span>
      </div>

      {sectionHeader('REGISTER BENCHMARKS \u2014 WEEK 3, DAY 1')}
      <div style={{ fontSize: '7pt', color: '#2D2D2D', lineHeight: '1.55' }}>
        {checkItem('Greet every customer that enters the store and make eye contact with a smile!')}
        {checkItem('Ring in Reg, Giant, and Mini sub sizes with 100% accuracy. Same with add-ons.')}
        {checkItem('Ask every customer if they have Shore Points, and if not ask to sign them up.')}
      </div>

      {sectionHeader('REGISTER STATION TRAINING')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginBottom: '2px' }}>Set Up / Organization / Safety:</div>
        {checkItem('3 pens, 2 sharpie, tip jar attached to register, tape behind.')}
        {checkItem('Drawer stocked with enough change, ask for change BEFORE you run out.')}
        {checkItem('ALL BILLS LARGER THAN $20 must be checked by Manager or Shift Lead.')}
        {checkItem('Keep area near register neat, clean, free of any clutter.')}

        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginTop: '4px', marginBottom: '2px' }}>Customer Service / Communication:</div>
        {checkItem('Smile, eye contact, be genuine.')}
        {checkItem('Always ask if they\'re "a part of our rewards program". Offer to sign them up.')}
        {checkItem('Never ask customer what they had \u2013 Wrapper relays all sandwiches to you.')}
        {checkItem('Always offer receipt and thank them for coming in.')}
        {checkItem('Know at all times what everyone in the lobby is waiting for (online, hot sub, etc.).')}

        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginTop: '4px', marginBottom: '2px' }}>Operations:</div>
        {checkItem('Ring sandwiches properly \u2013 default is Regular, touch Mini or Giant to change.')}
        {checkItem('Main screen organization & color coding \u2013 cold subs, hot subs, chicken subs.')}
        {checkItem('Adjust size for fountain drinks, adding avo, extra meat, cheese, etc.')}
        {checkItem('Credit card: instruct customer "Two questions first, then chip in the reader".')}
        {checkItem('Hot sub customer: take green ticket, ring up, mark P for Paid, put on ticket rack.')}
        {checkItem('Customer early for pickup: write H for Here on bag. Politely tell them due time.')}
        {checkItem('Cash: choose amount, change displays. Count back change if bill larger than $20.')}
        {checkItem('2+ subs purchased: offer larger bag, instruct to lay flat during transport.')}

        <div style={{ fontWeight: 700, color: '#134A7C', fontSize: '7pt', marginTop: '4px', marginBottom: '2px' }}>Phone / Online Orders:</div>
        {checkItem('All phone/online order tickets taped to bag IMMEDIATELY. NAPKINS in togo bags.')}
        {checkItem('Identify customers picking up. Online orders are ALL prepaid.')}
        {checkItem('Check ticket & count sandwiches, check bag before handing out.')}
        {checkItem('TAPE BAG CLOSED with tamper evident stickers for all 3rd party orders!')}
      </div>

      {sectionHeader('REGISTER / WRAP COMBINED \u2014 WEEK 3, DAY 3-4')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Label ALL subs with number and NAME if applicable, use Sharpie.')}
        {checkItem('Acknowledge all customers and "Direct" traffic. Call up phone order pickups.')}
        {checkItem('Count sandwiches in bag before handing out online/phone orders.')}
        {checkItem('Dress lids: Avocado, Mayo, Bacon, CPR, Mustard \u2013 ALL SAUCES get 3 LINES.')}
        {checkItem('Any downtime: put on gloves and help sprinkle/wrap, then jump back to register.')}
        {checkItem('Offer chips and a drink to every customer, every time.')}
        {checkItem('PAPER COSTS: 3 logos for mini, 4 logos for regular, 6 logos for giant.')}
      </div>

      {sectionHeader('LOBBY CHECK BENCHMARKS')}
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: '1.5' }}>
        {checkItem('Finish lobby check in 3-5 minutes max.')}
        {checkItem('Offer to fill drinks for customers and clear their trash.')}
        {checkItem('Proper order: large trash first, wipe tables, clean under tea machine, wipe chairs, restock lids/straws, check bathroom last.')}
        {checkItem('Asking EVERY customer to enter phone number for rewards?')}
        {checkItem('WELCOMING EVERY CUSTOMER as soon as they walk in?')}
        {checkItem('Tapping bell and saying "thank you" for customer tips?')}
      </div>

      {/* Certification */}
      <div style={{
        background: '#EE3227', color: '#fff', fontSize: '8pt', fontWeight: 700,
        padding: '4px 10px', borderRadius: '3px', margin: '8px 0 4px',
        textAlign: 'center', letterSpacing: '1px',
      }}>
        LEVEL 2: REGISTER CERTIFICATION
      </div>
      <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
        Once trainee feels confident, they should ask to be certified. Trainee works lunch rush beside Trainer and demonstrates proficiency.
      </div>

      {/* Sign Off */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '1px' }}>Employee Signature</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '1px' }}>Trainer Signature</div>
        </div>
        <div style={{ width: '100px' }}>
          <div style={{ borderBottom: '1px solid #134A7C', height: '16px' }} />
          <div style={{ fontSize: '6.5pt', color: '#6b7280', marginTop: '1px' }}>Date</div>
        </div>
      </div>
    </DocumentTemplate>
  );
});

export default TrainingPacketLevel2;
