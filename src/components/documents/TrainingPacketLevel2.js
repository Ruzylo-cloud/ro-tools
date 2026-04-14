'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel2 = forwardRef(function TrainingPacketLevel2({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  const PAGE_W = 612;
  const PAGE_H = 792;
  const TOTAL_PAGES = 9;

  const pageStyle = {
    width: `${PAGE_W}px`,
    height: `${PAGE_H}px`,
    background: '#fff',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
  };

  const dayBanner = (text) => (
    <div style={{
      background: '#EE3227', color: '#fff', fontSize: '11pt', fontWeight: 800,
      padding: '3px 16px', display: 'inline-block',
      fontFamily: "'Arial Black', 'Impact', sans-serif",
      textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px',
      clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)',
      paddingRight: '28px',
    }}>
      {text}
    </div>
  );

  const sectionHeader = (text) => (
    <div style={{
      background: '#134A7C', color: '#fff', fontSize: '7pt', fontWeight: 700,
      padding: '2px 10px', borderRadius: '3px', marginBottom: '3px', marginTop: '6px',
      letterSpacing: '0.5px',
    }}>
      {text}
    </div>
  );

  const subHeader = (text) => (
    <div style={{
      fontSize: '7pt', fontWeight: 700, textDecoration: 'underline',
      color: '#2D2D2D', marginTop: '5px', marginBottom: '2px',
    }}>
      {text}
    </div>
  );

  const checkItem = (text) => (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '1px' }}>
      <span style={{ color: '#134A7C', fontWeight: 700, minWidth: '14px', flexShrink: 0, fontSize: '8pt' }}>&#9744;</span>
      <span style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.35 }}>{text}</span>
    </div>
  );

  const trainingTable = (rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.2pt', marginBottom: '4px', marginTop: '2px' }}>
      <thead>
        <tr style={{ background: '#F0F4F8' }}>
          <th style={{ border: '1px solid #ccc', padding: '2px 4px', textAlign: 'left', fontWeight: 700, width: '58%' }}>Item</th>
          <th style={{ border: '1px solid #ccc', padding: '2px 4px', textAlign: 'center', fontWeight: 700, width: '24%' }}>Trainer Name</th>
          <th style={{ border: '1px solid #ccc', padding: '2px 4px', textAlign: 'center', fontWeight: 700, width: '18%' }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px' }}>{row}</td>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px' }}></td>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px' }}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const pageNumber = (num) => (
    <div style={{
      position: 'absolute', bottom: '8px', right: '28px',
      fontSize: '6.5pt', color: '#6b7280',
    }}>
      Page {num} of {TOTAL_PAGES}
    </div>
  );

  const footer = () => (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 4px' }} />
      <div style={{
        background: '#EE3227', color: '#fff', textAlign: 'center',
        fontSize: '5.5pt', padding: '3px 28px', fontWeight: 400, lineHeight: 1.3,
      }}>
        Property of JM Valley Group. All rights reserved. Confidential &mdash; not for distribution.
      </div>
    </div>
  );

  const miniHeader = () => (
    <>
      <div style={{ height: '4px', background: '#EE3227' }} />
      <div style={{ textAlign: 'center', padding: '3px 28px 2px' }}>
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '40px', width: '40px', objectFit: 'contain' }} crossOrigin="anonymous" />
      </div>
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 4px' }} />
    </>
  );

  const lmsBlock = (videos, subtitle) => (
    <div style={{ marginTop: '4px' }}>
      <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '2px' }}>
        HOMEWORK - TRAINING VIDEOS on LMS
      </div>
      <div style={{ fontSize: '6pt', color: '#6b7280', marginBottom: '2px' }}>
        ({subtitle || 'watch on store iPad'})
      </div>
      {videos.map((v, i) => (
        <div key={i} style={{ fontSize: '6.2pt', color: '#2D2D2D', marginBottom: '1px' }}>
          <u>{v.title}</u><br />
          &nbsp;&nbsp;&nbsp;&nbsp;All Videos ({v.duration}) &nbsp;&nbsp;<span style={{ display: 'inline-block', width: '12px', height: '12px', border: '1px solid #2D2D2D', verticalAlign: 'middle' }}></span>
        </div>
      ))}
    </div>
  );

  const gmDebrief = (questionText) => (
    <div style={{ marginTop: '6px' }}>
      {sectionHeader('GM DEBRIEF - do at conclusion of training shift')}
      <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6 }}>
        <div style={{ marginBottom: '2px' }}>{questionText}</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>2 areas in which trainee is excelling:</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>2 areas of opportunity:</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>Discuss one Core Value the trainee is embodying:</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#6b7280' }}>
          Is there anything you&apos;d like to talk about or ask about while we&apos;re chatting? (don&apos;t write down, this is just opportunity for casual conversation)
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

      {/* ==================== PAGE 1 — DURING WEEK 2: Phone Orders & Lobby Checks ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="LEVEL 2 TRAINING PACKET"
          subtitle="Register / Wrap Certification — Days 10–18"
          storeNumber={storeNumber}
          storeName={storeName}
        >
          <div style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '6.5pt', color: '#6b7280', fontWeight: 500 }}>Employee Name</span>
              <div style={{ borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt', fontWeight: 600, color: '#2D2D2D', minHeight: '14px' }}>{employeeName}</div>
            </div>
            <div style={{ width: '130px' }}>
              <span style={{ fontSize: '6.5pt', color: '#6b7280', fontWeight: 500 }}>Start Date</span>
              <div style={{ borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt', fontWeight: 600, color: '#2D2D2D', minHeight: '14px' }}>{startDate}</div>
            </div>
          </div>

          {dayBanner('DURING WEEK 2: PHONE ORDERS & LOBBY CHECKS')}

          {sectionHeader('TRAIN PHONE ORDERS')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '3px' }}>
            Teach and then role play at least 5 phone orders.
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '3px' }}>
            When the phone rings, you answer <b>&quot;Jersey Mikes (location), How Can I Help You&quot;</b>
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '2px' }}>
            Guest orders: practice the order below with a ticket:
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, paddingLeft: '12px', marginBottom: '3px' }}>
            &bull; Mini 7 on white, mike&apos;s way no onion<br />
            &bull; Regular 13 on wheat, mike&apos;s way with jalapenos and mustard<br />
            &bull; Giant Roast Beef on rosemary parmesan, mike&apos;s way with mayo and bacon
          </div>
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#6b7280', marginBottom: '3px' }}>
            *You quote 15 minutes, the time when you take the order is 2pm. The guests&apos; name is Bob.
          </div>

          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            &bull; <b>ROLEPLAY</b> - practice 3-4 phone orders at the table together. Trainee &quot;answers&quot; your call and writes down what you order. Include 3 subs on each order.
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; PHONE ORDER BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Answer the phone before 3 rings')}
          {checkItem('Write phone orders with 100% accuracy (proper format, circling extras, writing name and realistic pick-up times)')}
          {checkItem('Communicate to the slicer, backline person or hot subber that you put an order up')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; LOBBY CHECK BENCHMARKS - check off when trainee has mastered</div>
          {checkItem(<>Lobby checking order: Clean large items first like pieces of trash on the floor; Wipe down tables with a sanitized towel from lobby bucket; Clean under tea machine and around fountain area, restock lids and straws; Wipe down tables, make sure to dry them, do not leave damp; Check &amp; clean or stock bathroom last</>)}
          {checkItem('Finish lobby check in 5 minutes max')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; VIDEO COMPLETION PERCENTAGE</div>
          {checkItem('Goal by this point is 27%')}
        </DocumentTemplate>
        {pageNumber(1)}
      </div>

      {/* ==================== PAGE 2 — DAY 10: REGISTER TRAINING ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 10 — REGISTER TRAINING')}

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginBottom: '4px' }}>
            TWO 6-hour shifts for training REGISTER
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Review Register list on next page',
            'Stock desserts - cookies & brownies are sticker side on back',
            'Register Checklist with trainer - FIFO chips, bottles',
            'How to deep clean - train on a new deep clean task',
          ])}

          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginTop: '4px', marginBottom: '4px' }}>
            &bull; <b>ROLEPLAY B4 THE RUSH</b> - roleplay the trainee ringing up and checking out the trainer. Trainee asks if they have shore points and then directs the trainer to answer prompts for credit card. Do this 3 times through, trainer present different scenarios.
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; REGISTER BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Greet every guest that enters the store and make eye contact with a smile! :)')}
          {checkItem(<>Tape every online order to a bag with tamper seal, <b>2 seals</b> for small bag/ <b>3 seals</b> for large bag, <b>fluff bag open</b> and <b>add napkins</b></>)}
          {checkItem(<>Write a &apos;P&apos; on all hot sub tickets once paid for and hang ticket on rack</>)}
          {checkItem(<>Write &quot;H&quot; on kitchen ticket when guest arrives early</>)}

          {lmsBlock([
            { title: 'New Hire: Cashier', duration: '8 min' },
            { title: 'New Hire: Basic Food Prep', duration: '18 min' },
          ], 'watch on store iPad')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; REGISTER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>
            Trainee completes register checklist with shift lead or trainer. Time this. <b>Goal = 45 minutes</b>.<br />
            Attempt #1 at register checklist <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes.
          </div>
        </div>
        {footer()}
        {pageNumber(2)}
      </div>

      {/* ==================== PAGE 3 — DAY 10: REGISTER POSITION details ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 10 — REGISTER TRAINING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '4px' }}>
            REGISTER POSITION: Review start of Day 10
          </div>

          {subHeader('Set Up/Cleanliness/Organization/Safety:')}
          {checkItem('1 pens, 1 sharpie, tip jar attached to register, seals for bags')}
          {checkItem('Drawer stocked with enough change, ask for change BEFORE you run out')}
          {checkItem(<>We don&apos;t accept bills larger than $20. Too many fakes in the past</>)}
          {checkItem('Keep area near register neat and clean, free of any clutter')}

          {subHeader('Guest Service/Communication:')}
          {checkItem('Smile, eye contact, be genuine')}
          {checkItem(<>Always ask if they&apos;re &quot;a part of our rewards program&quot;.</>)}
          {checkItem('Never ask a guest what they had, Wrapper will relay all sandwiches to you')}
          {checkItem(<>Greet all guests who walk in, identify those picking up. <b>You should know at all times, what everyone standing in the lobby is waiting for.</b> Online order, Hot Sub, etc.</>)}

          {subHeader('Operations:')}
          {checkItem(<>Ring sandwiches properly &ndash; default is Regular, touch Mini or Giant to change</>)}
          {checkItem(<>Main screen organization &amp; color coding &ndash; cold subs, hot subs, chicken subs</>)}
          {checkItem('Adjust size for fountain drinks, adding avocado, extra meat, cheese, etc.')}
          {checkItem(<>If credit card, instruct guest to &quot;One question, then chip in the reader&quot;. Point at credit card terminal.</>)}
          {checkItem(<>Ask guest if order is &quot;for here&quot; or &quot;to go&quot;? Press &quot;DINE-IN&quot; button if order is for here and press &quot;to-go&quot; button if the order is takeout.</>)}
          {checkItem('If guest has hot sub, take their green ticket, mark P for Paid & put on ticket rack')}
          {checkItem(<>If a guest checks in to pick up their order, and it is not ready, write <b>H for Here on the kitchen ticket in Sharpie</b>, so we know to call out the name when the order is ready. ALSO, check due time &amp; current time. If guest or driver is early, politely tell them the order due time &amp; that we&apos;ll definitely have it ready by then. Tone must be VERY KIND.</>)}
          {checkItem('If many items purchased, ask if they would like a bag. LA county must charge $.10 for a bag.')}

          {subHeader('Phone/Online Orders:')}
          {checkItem('All phone order and online order tickets must be taped to a bag IMMEDIATELY tamper evident seals and placed behind register area. NAPKINS in bags. Add chip, drink, desserts when time allows.')}
          {checkItem('Identify customers picking up and have Wrapper help you distribute. Online orders are ALL prepaid, hand directly to guest. Phone orders must be rung in and paid for in store.')}
          {checkItem(<>Look at ticket &amp; count subs, <b>CHECK THE BAG BEFORE YOU SEAL IT SHUT AND HAND OUT</b>, to make sure all drinks, chips, cookies etc. are in the bag</>)}
          {checkItem(<>Tape bag closed with tamper evident stickers, <b>for ALL delivery and online orders! 2 seals on a small bag and 3 seals on a large bag.</b></>)}
        </div>
        {footer()}
        {pageNumber(3)}
      </div>

      {/* ==================== PAGE 4 — DAY 11: REGISTER TRAINING ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 11 — REGISTER TRAINING')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Replace nozzles, turn on pepsi machine',
            "Roll out mat, make sure it's clean!",
            'How to properly clean bathroom',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; REGISTER BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Keep takeout order area organized (including trash area) and cups stocked.')}
          {checkItem('When working the register without a wrapper, split wrap station. Reg tears the paper, Sprinkler cuts the sub, Reg wraps the sub.')}
          {checkItem('Ask every guest Shore Points.')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Deep Clean videos
          </div>
          {checkItem('Scrub Trays')}
          {checkItem('Floor Grout')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; REGISTER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '6px' }}>
            Trainee completes register checklist on their own, shift lead or trainer checks work - correct improper work before clock out. Time the trainee for Register Checklist. <b>Goal = 45 minutes</b>.<br />
            Attempt #2 at register checklist <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes
          </div>

          {gmDebrief('What part of Register position do you feel is most challenging for you?')}
        </div>
        {footer()}
        {pageNumber(4)}
      </div>

      {/* ==================== PAGE 5 — DAY 12: REGISTER TRAINING + CERTIFICATION ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 12 — REGISTER TRAINING')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Review before lunch checklist or pre-close list, teach anything that is not yet learned',
            'How to rack for second bake or rack for morning bake',
            'Proper chip box storage back of house, how to open chip boxes, when to get next box',
            'Review Wrap/Reg list if training for closing',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; REGISTER BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Ring in Reg, Giant, and mini-sub sizes with 100% accuracy. Same with add-ons.')}
          {checkItem('Seal all online & deliver orders; 2 seals on a small bag, 3 seals on a large bag')}
          {checkItem(<>Tap bell and say &quot;thank you&quot; for guest tips</>)}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Deep Clean videos
          </div>
          {checkItem('Baseboards Bruh')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginTop: '10px', marginBottom: '4px' }}>
            DAY 13, 14, 15: REGISTER PROFICIENCY
          </div>
          <div style={{ textAlign: 'center', fontSize: '6.5pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '8px' }}>
            Continue to practice &amp; make progress &amp; complete prior pages as needed. Cover training list above. When ready, plan certification shift!
          </div>

          <div style={{
            textAlign: 'center', fontSize: '9pt', fontWeight: 700, fontStyle: 'italic',
            color: '#2D2D2D', marginBottom: '6px', textDecoration: 'underline',
          }}>
            REGISTER CERTIFICATION!!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee works lunch rush beside Trainer &amp; demonstrates proficiency. Trainee completes Register checklist <b>required time = 45 minutes.</b>
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '8px', marginBottom: '4px' }}>
            LEVEL 2:
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.8, paddingLeft: '20px' }}>
            Final attempt at Register Checklist: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Certification Awarded By - Trainer: <span style={{ display: 'inline-block', width: '160px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
            </div>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Date: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
            </div>
          </div>
        </div>
        {footer()}
        {pageNumber(5)}
      </div>

      {/* ==================== PAGE 6 — DAY 16: WRAPPING ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 16 — WRAPPING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '4px' }}>
            WRAP POSITION: Review start of Day 16
          </div>

          {subHeader('Area Set Up/Cleanliness/Organization:')}
          {checkItem('Sub bags/sleeves stocked on counter and below, Sharpie in place')}
          {checkItem('Knife, rag on pole below for wiping, clean countertop, proper knife usage')}
          {checkItem(<>PAPER COSTS: Paper length &ndash; 3 logos for mini, 4 logos for regular, 5 logos for giant (start with 6 for giants, for ease of training)</>)}
          {checkItem('Dress all lids with Avocado, Mayo, Bacon, CPR, Mustard, etc. ALL SAUCES get 3 LINES on the lid (proper portion for flavor)')}

          {subHeader('Guest Service/Communication:')}
          {checkItem(<>Communicate entire order to Register person &ndash; &quot;Regular 7 to-go with chips and a cookie for this gentleman&quot;. Never ask the guest what they ordered, stay aware.</>)}
          {checkItem(<><b>Label ALL subs</b> with number and NAME if applicable, use Sharpie</>)}
          {checkItem(<>Acknowledge all guests and &quot;Direct&quot; traffic in between sprinkling subs. Call up phone order pick up people to be rung up when appropriate, direct guests to register to pay, identify online and phone order people and ask their name.</>)}
          {checkItem(<>When handing out online or phone orders, <b>CHECK THE BAG BEFORE YOU SEAL IT SHUT AND HAND THE ORDER OUT</b>, to make sure all drinks, chips, cookies etc. are in the bag</>)}
          {checkItem(<>&quot;Chips and drink today?&quot; Say to every guest, every time.</>)}

          {subHeader('Wrapping the Sub:')}
          {checkItem('Tear paper clean and fast, only one paper at a time.')}
          {checkItem('Grab sub from sprinkle board with fingers on bottom, thumb on top, place on paper in center, diagonal')}
          {checkItem(<><b>Label</b> every sub bag with their number. &quot;7&quot; or &quot;13&quot;</>)}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Wrap and sticker all cookies',
            '15 mins Wrapping practice for muscle memory & SPEED - use hot sub bread',
            'Review Wrap training list on next page',
          ])}
        </div>
        {footer()}
        {pageNumber(6)}
      </div>

      {/* ==================== PAGE 7 — DAY 16 WRAPPING continued ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 16 — WRAPPING')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; WRAP BENCHMARKS - check off when trainee has mastered</div>
          {checkItem(<>Communicate every guest&apos;s entire order to Register</>)}
          {checkItem('Tear correct Logo par - 3 mini, 4 regular, 5 giant (do 6 giant during training, then move to 5)')}
          {checkItem(<>Ask guest if order is &quot;for here&quot; or &quot;to go&quot;? If order is for dine-in, DO NOT put sub in a brown sub bag sleeve. This signals to register that the order is &quot;for here&quot;.</>)}
          {checkItem('Offer chips and drink to every guest as they come down the line')}
          {checkItem('Apply mayo, bacon and other dressings to lids when sprinkler or guest requests them')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Deep Clean videos
          </div>
          {checkItem('Front Line Sweep')}
          {checkItem('Cabinet Doors')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; WRAP CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>
            Trainee completes wrap checklist on their own, shift lead or trainer checks work - correct improper work before clock out. Time the trainee for Wrap Checklist. <b>Goal = 25 minutes</b>.<br />
            Attempt #1 at wrap checklist <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes.
          </div>
        </div>
        {footer()}
        {pageNumber(7)}
      </div>

      {/* ==================== PAGE 8 — DAY 17: WRAPPING + CERTIFICATION ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 17 — WRAPPING')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Review before lunch checklist or pre-close list, teach anything that is not yet learned',
            'Review freezer setup, importance of bread boxes closed properly & facing properly. Cookie boxes too.',
            'Review proper placement of clean dishes',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; WRAP BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Audible POP of the sub bag')}
          {checkItem('Label every sub (no matter what) and communicate number to register person')}
          {checkItem('Greet every guest that enters and recognize to-go people')}
          {checkItem('Wrap a Giant in under 20 seconds')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; WRAP CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Trainee completes wrap checklist on their own, shift lead or trainer checks work - correct improper work before clock out. Time the trainee for Wrap Checklist. <b>Goal = 25 minutes</b>.<br />
            Attempt #2 at wrap checklist <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; VIDEO COMPLETION PERCENTAGE</div>
          {checkItem('Goal by this point is 35%')}

          <div style={{
            textAlign: 'center', fontSize: '9pt', fontWeight: 700, fontStyle: 'italic',
            color: '#2D2D2D', marginTop: '10px', marginBottom: '6px', textDecoration: 'underline',
          }}>
            WRAP CERTIFICATION!!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee works lunch rush beside Trainer &amp; demonstrates proficiency. Trainee completes Wrap checklist <b>required time = 25 minutes. Required time to Cut &amp; Wrap a giant = 20 seconds.</b>
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '6px', marginBottom: '4px' }}>
            LEVEL 2:
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.8, paddingLeft: '20px' }}>
            Final attempt at Wrap Checklist: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes (must be under 25 mins)<br />
            Cut &amp; Wrap a Giant: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> seconds (must be under 20 secs)
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Certification Awarded By - Trainer: <span style={{ display: 'inline-block', width: '160px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
            </div>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Date: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
            </div>
          </div>
        </div>
        {footer()}
        {pageNumber(8)}
      </div>

      {/* ==================== PAGE 9 — GM DEBRIEF for Wrap ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {gmDebrief('What part of Wrap position do you feel is most challenging for you?')}
        </div>
        {footer()}
        {pageNumber(9)}
      </div>
    </div>
  );
});

export default TrainingPacketLevel2;
