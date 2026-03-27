'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketSlicer = forwardRef(function TrainingPacketSlicer({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  const PAGE_W = 612;
  const PAGE_H = 792;
  const TOTAL_PAGES = 8;

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

  const blankCheck = (text) => (
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
        <img src="/jmvg-logo.png" alt="JM Valley Group" style={{ height: '40px', width: 'auto' }} crossOrigin="anonymous" />
      </div>
      <div style={{ height: '1px', background: '#134A7C', margin: '0 28px 4px' }} />
    </>
  );

  const highlightBanner = (text) => (
    <div style={{
      background: '#FEF08A', padding: '2px 10px', fontSize: '7.5pt', fontWeight: 700,
      color: '#2D2D2D', marginBottom: '4px', borderRadius: '3px', display: 'inline-block',
    }}>
      {text}
    </div>
  );

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

      {/* ==================== PAGE 1 — Week 1: Day 1, Back Line Slice ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="SLICER TRAINING PACKET"
          subtitle="4-Week Certification Program"
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

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, fontStyle: 'italic', color: '#2D2D2D', marginBottom: '4px' }}>
            - 4 Week Slicer Training Packet -
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '6px', fontStyle: 'italic' }}>
            Crew members must work a minimum of 3 - 6 months, and be at least 18 years of age, before slice training can begin.
          </div>

          {dayBanner('WEEK 1: DAY 1 \u2014 BACK LINE SLICE!')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Warm up with slice count - 5 slices provolone = 2 oz',
            <span style={{ background: '#FEF08A' }}>Warm up with slice count - 3 slices Boiled Ham = 1.8 oz</span>,
            'Weigh all subs',
            'Collect all ends in a bucket for weight',
            'Clean slicer & lubricate arm and meat guard',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SLICING BENCHMARKS - Trainer coach up trainee in the below areas &amp; check them off once trainee shows they have created the habit:</div>
          {blankCheck('Weigh EVERY sub - slice up to weight')}
          {blankCheck('Proper order of meat and cheese when building all subs')}
          {blankCheck('Remove excess meat consistently \u2013 NO MEAT BUILD UP on slicer')}
          {blankCheck('Slice to the absolute end of each piece of meat and cheese')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Trainee completes entire slicer checklist with and under supervision of trainer or shift lead
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; JOLT TRAINING VIDEOS</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '2px' }}>
            Slicer cleaning during the rush <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; HOMEWORK TRAINING VIDEOS</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>
            Go on training.jerseymikes.com to access videos and login with your credentials.<br />
            Slicing - ALL videos under Slicing (40 min) <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
          </div>
        </DocumentTemplate>
        {pageNumber(1)}
      </div>

      {/* ==================== PAGE 2 — Week 1: Day 1 & 2, Back Line Slice Details ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 1: DAY 1 & 2 \u2014 BACK LINE SLICE!!')}

          <div style={{ fontSize: '6.2pt', color: '#6b7280', fontStyle: 'italic', marginBottom: '4px' }}>
            Trainer covers AT BACK LINE SLICER STATION, after seated training packet review
          </div>

          {subHeader('Area Set Up/Cleanliness/Organization:')}
          {blankCheck('Knife and scale set up / charged')}
          {blankCheck('WEIGH ALL SANDWICHES - even seasoned slicers must "warm up" with weighing their sandwiches')}
          {blankCheck('Check that all meats and cheeses are stocked, unwrapped, backups available, organized well. Keep meat case looking NEAT. No pile up of old meat. Use the ends until they\'re gone.')}
          {blankCheck('Push back and forth with slicer, never press down into blade')}
          {blankCheck('Always position the guard on top of the meat or cheese, for safety')}
          {blankCheck('Slicing guide / weight chart \u2013 location of and importance of use')}
          {blankCheck('How to sharpen and lubricate the slicer, done once a day - explain why it\'s important')}
          {blankCheck(<><b>Slicer must be <i>*kept clear of meat build up, *wiped down consistently, and *thoroughly cleaned after every rush &amp; before walking away</i></b></>)}
          {blankCheck('Slicer must be cleaned and wiped down with warm soapy water at the end of every night')}
          {blankCheck('Blade guard must be washed, dried and put back right away, always. NEVER leave a blade guard unattended.')}

          {subHeader('Operations:')}
          {blankCheck('Importance of meat thickness / thinness \u2013 taste and texture')}
          {blankCheck('How to properly slice the bread. Halfway through, rest knuckles of slicing hand on counter, keep thumb up on bread hand')}
          {blankCheck('Catch, Flower, Flip \u2013 cover sub from END to END always')}
          {blankCheck('Close meat case door after every meat')}
          {blankCheck('Weigh all your sandwiches, slightly over is ok, under is never ok')}
          {blankCheck('Verbally communicate whose sandwich is whose to your sprinkler')}
          {blankCheck(<span style={{ color: '#EE3227' }}>Calling out for lobby checks as needed. Regular glance at lobby tables for wipe downs.</span>)}
          {blankCheck('Always clean the slicer and change your gloves for EVERY veggie sandwich.')}
          {blankCheck('Proper procedure for Gluten Free bread \u2013 new knife, parchment paper, new gloves, make sub on top of parchment paper down the line. Communication of GF sub coming down the line. Regulars and giants ONLY.')}
          {blankCheck(<><b>Always slice 2 or more sandwiches at a time. Mandatory 3 subs at a time during rush - no more, no less. Study shows THREE subs at a time keeps line moving fastest all the way down.</b></>)}
          {blankCheck('Efficiency techniques at Slice: help your sprinkler, when line backs up, ask the customer if they want theirs Mike\'s Way. Think Ahead.')}
          {blankCheck('Banter with guests: this is a fun way to interact with our guests and make them feel welcome and a part of our lives here at Jersey Mike\'s')}

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginTop: '6px' }}>
            Back Line Slice List Completion - Signed off by: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '140px' }}>&nbsp;</span> Date: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
          </div>
        </div>
        {footer()}
        {pageNumber(2)}
      </div>

      {/* ==================== PAGE 3 — Week 1: Day 2, Back Line Slice ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 1: DAY 2 \u2014 BACK LINE SLICE!!')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Hand wash guards & put back together immediately',
            'Clean and stock meat case, FIFO',
            'Importance of using all meats to very end',
            'How to set up thickness for the shift - 3 slices ham = 1.8 oz',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SLICING BENCHMARKS</div>
          {blankCheck('Slice 3 subs at a time - be efficient')}
          {blankCheck('Weigh EVERY sub - slice up to weight')}
          {blankCheck('Thoroughly clean slicer every 30 minutes')}
          {blankCheck('Slice to the absolute end of each piece of meat and cheese')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Trainee completes entire slicer checklist with and under supervision of trainer or shift lead
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; HOMEWORK TRAINING VIDEOS</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '6px' }}>
            Bread - ALL Videos under Bread (16 min) <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
          </div>

          {sectionHeader('GM DEBRIEF - do at conclusion of 2nd back line slicer training shift')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '2px' }}>What part of slicing do you feel is most challenging for you? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '220px' }}>&nbsp;</span></div>
            <div style={{ borderBottom: '1px solid #2D2D2D', marginBottom: '4px', height: '12px' }} />
            <div style={{ marginBottom: '2px' }}>2 areas in which trainee is excelling: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '220px' }}>&nbsp;</span></div>
            <div style={{ borderBottom: '1px solid #2D2D2D', marginBottom: '4px', height: '12px' }} />
            <div style={{ marginBottom: '2px' }}>2 areas of opportunity: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '220px' }}>&nbsp;</span></div>
            <div style={{ borderBottom: '1px solid #2D2D2D', marginBottom: '4px', height: '12px' }} />
          </div>
        </div>
        {footer()}
        {pageNumber(3)}
      </div>

      {/* ==================== PAGE 4 — Week 1 & 2, Back Line Slice Solidifying ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 1 & 2 \u2014 BACK LINE SLICE!!')}

          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '6px', fontStyle: 'italic' }}>
            Trainee work BACK LINE SLICE station for 2 weeks to solidify training, shift lead check all checklist work before clock out each shift.
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING VIDEOS - None</div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICING BENCHMARKS</div>
          {blankCheck(<span style={{ color: '#EE3227' }}>Work on rush preparedness and efficiency \u2013 grab at least 2 loaves each time you go to the bread display, have regular bread ready to go.</span>)}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Clean slicer thoroughly with warm soapy water',
            'Dry blade and run cardboard through to remove oils',
            'Sharpen and lubricate slicer',
            '\u00A0',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '6px' }}>
            Trainee completes entire slicer checklist on their own. Shift lead check work.
          </div>

          {sectionHeader('ACCURACY CHECK!')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6, paddingLeft: '8px' }}>
            <div>&bull; Weighing subs? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span></div>
            <div>&bull; Enter weight in ounces for: #7 <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '60px' }}>&nbsp;</span> #8 <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '60px' }}>&nbsp;</span> #13 <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '60px' }}>&nbsp;</span></div>
            <div>&bull; No left hand? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span></div>
            <div>&bull; Keeping the meat case door closed? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span></div>
            <div>&bull; Flowering large meats? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span></div>
            <div>&bull; No thumbs used when catching / flipping flat meats &amp; cheese? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span></div>
            <div>&bull; Is the bread cut in half with 50/50 on top and bottom? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span></div>
            <div style={{ color: '#EE3227' }}>&bull; <b>360 vision,</b> calling out lobby checks at least every 30 mins? Ensuring lobby check timer is set.</div>
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', fontWeight: 700, marginTop: '8px', fontStyle: 'italic' }}>
            Once all accuracy checks have been confirmed, slicer is eligible to move up to Front Line Slice / Quarterbacking the Line.
          </div>
        </div>
        {footer()}
        {pageNumber(4)}
      </div>

      {/* ==================== PAGE 5 — Week 3: Day 1, Front Line Slice / Quarterbacking ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 3: DAY 1 \u2014 FRONT LINE SLICE!')}
          {highlightBanner('aka QUARTERBACKING THE LINE')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; TRAINING VIDEOS</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Log in to BEHIND THE COUNTER, <b>hover over Training, click on &quot;Library Videos&quot;</b><br />
            Speed of Experience: Slicing - ALL Videos under Speed of Experience: Slicing (37 mins) <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SLICING BENCHMARKS</div>
          {blankCheck(<>Greet every customer that enters, make eye contact <b>with a smile</b></>)}
          {blankCheck('Delegate all 10\'s and 14\'s to your sprinkler \u2013 use the time to CLEAN the slicer')}
          {blankCheck('Delegate writing of all hot sub tickets to grill person or floater during rush time. "Can I get a hot sub ticket please"')}
          {blankCheck(<span style={{ color: '#EE3227' }}><b>360 vision,</b> calling out lobby checks every 30 minutes or when needed.</span>)}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Warm up with slice count - 5 slices provolone = 2oz',
            'Weigh subs at start of shift to establish accuracy before rush begins',
            'Discuss calling "audibles" with shift lead when applicable',
            '\u00A0',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>
            Trainee completes entire slicer checklist on their own. Shift lead check work.
          </div>
        </div>
        {footer()}
        {pageNumber(5)}
      </div>

      {/* ==================== PAGE 6 — Week 3: Day 1 & 2, Front Line Slice Detailed ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 3: DAY 1 & 2 \u2014 FRONT LINE SLICE!!')}
          {highlightBanner('QUARTERBACKING THE LINE')}

          {subHeader('First Impression:')}
          {blankCheck('Slicer must smile, make eye contact and give all their attention to the customer')}
          {blankCheck('You are the first person they engage with \u2013 set the tone for their experience')}
          {blankCheck('New customers may have questions, be patient and kind, you are forming their first visit!')}
          {blankCheck("Always recommend cold subs Mike's Way - this is the flavor profile people come to Jersey Mike's to get. If they don't try it Mike's Way, they didn't really try Jersey Mike's!")}

          {subHeader('Area Set Up/Cleanliness/Organization:')}
          {blankCheck('Knife and scale set up \u2013 WEIGH FIRST ONE OF EACH TYPE OF SANDWICH, until your weight is right on - even seasoned slicers must "warm up" with weighing their sandwiches')}
          {blankCheck('Pen, order pad and prepped order sheets on top of meat case for hot sub orders')}
          {blankCheck('Check that all meats and cheeses are fully stocked and, unwrapped, backups in meat case. Maintain organization throughout the shift. No pile up of ends - use the ends until they\'re gone.')}
          {blankCheck('Weight charts with bread, without, and double meat \u2013 location of / when to use')}
          {blankCheck(<><b>Slicer must be kept clear of meat build up</b> - always consider the &quot;look&quot; of the slicer from the customer point of view</>)}
          {blankCheck(<><b>Slicer must be wiped down consistently, and thoroughly cleaned after every rush and before walking away</b></>)}

          {subHeader('Operations:')}
          {blankCheck('Same operation principles as back line slice - now let\'s add some front line specifics')}
          {blankCheck('Verbally communicate whose sandwich is whose to your sprinkler. "#8 comin down for the gentleman" or "this miss has the next 3 subs comin down"')}
          {blankCheck(<span style={{ color: '#EE3227' }}>Have 360 vision, and call out for lobby checks regularly. See who may be available and specifically ask that individual to do it.</span>)}
          {blankCheck(<><b>Control the pace of the line</b> \u2013 if you get ahead or there&apos;s lots of hot subs, CLEAN your slicer, double sprinkle, hop over to wrap - keep the line <b>moving</b> at every station.</>)}
          {blankCheck('NEVER pile up subs for your sprinkler - if sprinkler gets behind, double sprinkle instead')}
          {blankCheck('Same procedure for Gluten Free bread as back line')}
          {blankCheck(<><b>Always slice 2 or more sandwiches at a time. Mandatory 3 subs at a time during rush.</b></>)}

          {subHeader('QUARTERBACKING the Line:')}
          {blankCheck('Maintain 360* vision at all times - be aware of everything happening in lobby/front line')}
          {blankCheck('Supervise sprinkler and make sure they are putting the right amount of juice and spices')}
          {blankCheck('Ensure front line drop in stays stocked - call for backups or instruct who to stock')}
          {blankCheck('Keep an eye on the lobby - ask wrap to do/assign lobby checks when needed.')}
          {blankCheck('Efficiency techniques at Slice:')}
          <div style={{ paddingLeft: '16px' }}>
            {blankCheck('Help your sprinkler when line backs up')}
            {blankCheck('Grab 1 giant of each type of bread when grabbing from bread rack')}
            {blankCheck('Prep 1 of each giant in between lunch rush lulls for quick bread setup')}
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginTop: '4px' }}>
            Slicing Checklist Completion - Signed off by: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '140px' }}>&nbsp;</span> Date: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
          </div>
        </div>
        {footer()}
        {pageNumber(6)}
      </div>

      {/* ==================== PAGE 7 — Week 3: Day 2, Front Line Slice ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 3: DAY 2 \u2014 FRONT LINE SLICE!')}
          {highlightBanner('aka QUARTERBACKING THE LINE')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING VIDEOS - None. Finish up any training videos not watched on prior days.</div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICING BENCHMARKS</div>
          {blankCheck('Banter with customers when appropriate')}
          {blankCheck(<span style={{ color: '#EE3227' }}>Calling out for lobby checks at least every 30 minutes and as needed.</span>)}
          {blankCheck("Learn 'body language' and how to be in charge of the line and the flow of the customer experience.")}
          {blankCheck('Direct sprinkler and wrap to restock line as needed')}
          {blankCheck('Slice a G13 in under 70 seconds')}
          {blankCheck('Coaching guests on their specialty orders: "I want a 7 with avocado + Bacon" = CA Club')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Time a giant 13 and write in on Speed Kills sheet',
            'Clean slicer & surrounding area every 30 minutes',
            'Restock meat case during lulls in rush',
            '\u00A0',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SLICER CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '6px' }}>
            Trainee completes slicer checklist on their own. Shift lead check work.
          </div>

          {sectionHeader('GM DEBRIEF - do at conclusion of 2nd front line slicer training shift')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '2px' }}>What part of front line slicer position do you feel is most challenging for you? <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '180px' }}>&nbsp;</span></div>
            <div style={{ borderBottom: '1px solid #2D2D2D', marginBottom: '4px', height: '12px' }} />
            <div style={{ marginBottom: '2px' }}>2 areas in which trainee is excelling: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '220px' }}>&nbsp;</span></div>
            <div style={{ borderBottom: '1px solid #2D2D2D', marginBottom: '4px', height: '12px' }} />
            <div style={{ marginBottom: '2px' }}>2 areas of opportunity: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '220px' }}>&nbsp;</span></div>
            <div style={{ borderBottom: '1px solid #2D2D2D', marginBottom: '4px', height: '12px' }} />
          </div>
        </div>
        {footer()}
        {pageNumber(7)}
      </div>

      {/* ==================== PAGE 8 — Week 3 & 4, Quarterbacking + Slicer Certification ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('WEEK 3 & 4')}
          {highlightBanner('QUARTERBACKING THE LINE')}

          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
            The remainder of week 3 and 4 are for working the front line slice position on every shift, practicing leading the shift from the slicer.
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
            Managers and Shift Leads must consistently provide <b>feedback</b> and <b>coaching</b> on &quot;Quarterbacking&quot; the line, <b>in real time</b>, during lunch and dinner rushes.
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginBottom: '8px' }}>
            VIDEO COMPLETION PERCENTAGE: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '40px' }}>&nbsp;</span> Goal by this point is 51%
          </div>

          <div style={{
            textAlign: 'center', fontSize: '9pt', fontWeight: 700, fontStyle: 'italic',
            color: '#2D2D2D', marginBottom: '6px', textDecoration: 'underline',
          }}>
            SLICER CERTIFICATION!!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
            Once trainee has spent <b>4 weeks</b> in slicer position, they should ask to be certified. To achieve certification, trainee works lunch rush beside Trainer. Trainer submits video of #13 being made properly.
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '8px', marginBottom: '4px' }}>
            LEVEL 4:
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.8, paddingLeft: '20px' }}>
            <b>Slice Certification <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '60px' }}>&nbsp;</span> (video submission of #13 required)</b>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Certification Awarded By - Trainer: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '160px' }}>&nbsp;</span>
            </div>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Date: <span style={{ borderBottom: '1px solid #2D2D2D', display: 'inline-block', width: '80px' }}>&nbsp;</span>
            </div>
          </div>

          <div style={{
            textAlign: 'center', fontSize: '8pt', fontWeight: 700, fontStyle: 'italic',
            color: '#134A7C', marginTop: '20px',
          }}>
            *CONGRATS on completing SLICER TRAINING!!*
          </div>
        </div>
        {footer()}
        {pageNumber(8)}
      </div>
    </div>
  );
});

export default TrainingPacketSlicer;
