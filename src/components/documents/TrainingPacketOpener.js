'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketOpener = forwardRef(function TrainingPacketOpener({ data }, ref) {
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

  const qualityCheckTable = (title, rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.2pt', marginBottom: '4px', marginTop: '2px' }}>
      <thead>
        <tr style={{ background: '#F0F4F8' }}>
          <th colSpan={4} style={{ border: '1px solid #ccc', padding: '2px 6px', textAlign: 'left', fontWeight: 700, fontSize: '6.5pt' }}>{title}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px', width: '70%' }}>{row}</td>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px', textAlign: 'center', width: '10%', fontWeight: 600 }}>YES</td>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px', textAlign: 'center', width: '5%' }}>/</td>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px', textAlign: 'center', width: '10%', fontWeight: 600 }}>NO</td>
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

  const lmsBlock = (videos) => (
    <div style={{ marginTop: '4px' }}>
      <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '2px' }}>
        HOMEWORK - TRAINING VIDEOS on LMS
      </div>
      <div style={{ fontSize: '6pt', color: '#6b7280', marginBottom: '2px', fontStyle: 'italic' }}>
        Watch on LMS (send report to GM of time spent on videos, time will be added to next paycheck) Training.JerseyMikes.com Login with username and 4 digit code. Watch the following AGAIN during training even if watched in prior training. Check box when watched.
      </div>
      {videos.map((v, i) => (
        <div key={i} style={{ fontSize: '6.2pt', color: '#2D2D2D', marginBottom: '1px' }}>
          <b>{v.title}</b><br />
          &nbsp;&nbsp;&nbsp;&nbsp;{v.sub} &nbsp;&nbsp;&#9744;
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

      {/* ==================== PAGE 1 — OPENER CHARACTERISTICS ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="OPENER TRAINING PACKET"
          subtitle="6 Shifts — Opening Timeline 7:00–10:00am"
          storeNumber={storeNumber}
          storeName={storeName}
        >
          <div style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '8px' }}>
            OPENER TRAINING - 6 Shifts Total
          </div>

          <div style={{ fontSize: '7pt', color: '#2D2D2D', marginBottom: '8px' }}>
            Cover the following characteristics with trainee before first shift
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.6, paddingLeft: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
              <span style={{ flexShrink: 0, fontSize: '7pt' }}>&#9733;</span>
              <span><i>Our openers are our HEAD CHEFS! They are impacting the food quality that every one of our guests will experience each day. They must be able to prepare food to exact specifications.</i></span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
              <span style={{ flexShrink: 0, fontSize: '7pt' }}>&#9733;</span>
              <span><i>An opener must be a morning person, reliable, consistent, hard working, self directed and have an attention to detail.</i></span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
              <span style={{ flexShrink: 0, fontSize: '7pt' }}>&#9733;</span>
              <span><i>An opener cannot be slow, careless, messy or unreliable.</i></span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
              <span style={{ flexShrink: 0, fontSize: '7pt' }}>&#9733;</span>
              <span><i>Openers carry a lot of responsibility and set the tone for the whole day. If they are behind, the day is behind.</i></span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
              <span style={{ flexShrink: 0, fontSize: '7pt' }}>&#9733;</span>
              <span><i>Openers must show up to all shifts. If you are ill, you <u>must</u> contact the GM the night before.</i></span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
              <span style={{ flexShrink: 0, fontSize: '7pt' }}>&#9733;</span>
              <span><i>They are looked up to and can often grow into leadership. It is an honor to GET to be an opener.</i></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', marginBottom: '4px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '7pt', color: '#2D2D2D', fontWeight: 700 }}>Trainee Name:</span>
              <div style={{ borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt', fontWeight: 600, color: '#2D2D2D', minHeight: '14px' }}>{employeeName}</div>
            </div>
            <div style={{ width: '160px' }}>
              <span style={{ fontSize: '7pt', color: '#2D2D2D', fontWeight: 700 }}>Today&apos;s Date:</span>
              <div style={{ borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt', fontWeight: 600, color: '#2D2D2D', minHeight: '14px' }}>{startDate}</div>
            </div>
          </div>
        </DocumentTemplate>
        {pageNumber(1)}
      </div>

      {/* ==================== PAGE 2 — OPENING TIMELINE 7-9:00 ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{ textAlign: 'center', fontSize: '10pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '6px' }}>
            OPENING TIMELINE
          </div>

          {sectionHeader('7-7:45:')}
          {checkItem('Clock in, wash hands, apron on')}
          {checkItem(<>Set <b>Grill</b> to <b>375 degrees</b></>)}
          {checkItem('Turn on backline drop in')}
          {checkItem(<>Set <b>Proofer</b> to <b>120 degrees/4-8 humidity</b> depending on weather outside</>)}
          {checkItem(<>Set <b>Oven</b> to <b>350 degrees</b></>)}
          {checkItem(<>Start <b>soap</b> (100-115 degrees) and <b>sanitizer</b> (68-70 degrees) sinks</>)}
          {checkItem(<>Turn on meat case light <b>*{'{'} NOT POWER SWITCH {'}'}</b></>)}
          {checkItem('Turn on frontline drop in and bacon warmer')}
          {checkItem("Pull both bread racks out of the walk-in (or 1 rack at a time if it's summertime)")}
          {checkItem('Spray the ends and stretch all the bread on both racks')}
          {checkItem(<>Make all the cookies <b>{'{'}small on one tray, big ones on a separate tray{'}'}</b></>)}
          {checkItem('Cook mini cookies for 6 mins, large cookies for 8 mins')}
          {checkItem('Run a piece of completely dry cardboard through each slicer to remove any moisture')}
          {checkItem(<>Sharpen and <u>lube</u> both slicers every morning</>)}
          {checkItem("Clean the stones gently but quickly with alcohol and a brush, make sure you're wearing gloves")}
          {checkItem('Wipe all metal shards and debris off the slicer')}
          {checkItem("Take out the cookies once the shine is gone. Don't wait until they're brown.")}

          {sectionHeader('7:45-9:00:')}
          <div style={{ fontSize: '6pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '2px' }}>
            {'{'}set up your tomato station with washed tomatoes, the tomato slicer, and enough pans according to the production report{'}'}
          </div>
          {checkItem(<>Slice tomato&apos;s <b>{'{'}when done, clean area and wash off and put away the tomato slicer before moving on, Do not sanitize, never leave in sink{'}'}</b></>)}
          {checkItem('Get out the onion and lettuce from the walk-in')}
          {checkItem(<>Oil the grill and put 5 sheets of bacon down {'{'}use a timer: 4-5 mins on side one, 2-3 mins on side two{'}'} <b>{'{'}bacon must be flimsy NOT stiff{'}'}</b></>)}
          {checkItem(<>Start slicing onions <b>{'{'}Check size/thickness before moving forward{'}'}</b> <i>{'{'}If onions are making you cry, slice a good amount. Leave them to air out and slice a bin of tomatoes so you don&apos;t lose time!{'}'}</i></>)}
          {checkItem('Begin lettuce on onion free slicer')}
          {checkItem('Slice 2-4 heads at once and repeat until you have a mountain of lettuce to fill up 3 bins.')}
          {checkItem('Finish up lettuce no later than 9am')}
          {checkItem(<>Quickly fully clean the slicer <b>{'{'}before the lettuce dries onto it{'}'}</b> until it&apos;s lettuce free</>)}
          {checkItem('Sweep lettuce up from floor')}
        </div>
        {footer()}
        {pageNumber(2)}
      </div>

      {/* ==================== PAGE 3 — TIMELINE 9-10am + SHIFT 1 ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {sectionHeader('9-9:59:')}
          {checkItem(<>Stock front line <b>{'{'}With the freshest, neatest produce{'}'} {'{'}Mound all side items{'}'} {'{'}Make sure to have all Knifes and spatulas{'}'}</b></>)}
          {checkItem(<>Set up backline <b>{'{'}Make sure to have all Knifes and spatulas{'}'}</b></>)}
          {checkItem('Set up the Hot sub unit.')}
          {checkItem('Put day dot stickers on all prepped foods')}
          {checkItem('Put all produce (prep bins and backups) away in the walk-in')}
          {checkItem('Do ALL opening dishes')}
          {checkItem('Check off remainder of opener list on Jolt')}
          {checkItem(<>Communicate whatever bread/bacon (if any) is left with the shift lead {'{'}if you still have rosemary to be made after 10am it must already be ready to go with parmesan and rosemary{'}'}</>)}

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#EE3227', marginTop: '4px', marginBottom: '2px', lineHeight: 1.4 }}>
            NOTE: Urgency is key and you must multitask well and watch bread and bacon throughout.
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 800, textDecoration: 'underline', color: '#2D2D2D', marginTop: '4px', marginBottom: '6px' }}>
            10am!!! BREAK TIME (;
          </div>

          <div style={{ height: '1px', background: '#134A7C', margin: '4px 0' }} />

          {dayBanner('SHIFT 1')}

          {sectionHeader('\u26A0\uFE0F SPECIAL INSTRUCTION')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, paddingLeft: '10px', marginBottom: '3px' }}>
            <div>&bull; Instruct the trainee to not touch the slicer until Shift 3 for safety purposes.</div>
            <div>&bull; Turn on all lights & equipment. Show trainee how to do it, then turn it back off and have them do it with their own hands immediately after you show them.</div>
            <div>&bull; Focus on bread, cookies, bacon and tomatoes today ONLY. Do not teach lettuce or onions or any slicer tasks.</div>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Stretch & spray all bread - spray EDGES',
            "Bake Cookies \u2013 350. Don\u2019t wait til they\u2019re brown. Pull out when the shine is gone.",
            'Production Report \u2013 review & teach how to follow',
            'Cook Bacon - strain grease before placing in bin',
            'Cook bacon 7 mins one side, 3 mins on other side (70%/30%)',
            'Slice tomatoes stem side down \u2013 drain juice from bins',
            'Only discard 2 slices from both ends and store UPRIGHT',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '2px', marginBottom: '2px' }}>&#9745; OPENER CHECKLIST</div>
          <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: 1.4, paddingLeft: '10px', marginBottom: '2px' }}>
            <div>&bull; Review Jolt opener checklist together</div>
            <div>&bull; Check off groups of 2-3 items as you do them</div>
            <div>&bull; Complete with and under supervision of trainer or shift lead.</div>
            <div>&bull; Don&apos;t forget to always answer the phone especially before 10 am as this is when catering orders come in.</div>
          </div>

          {lmsBlock([
            { title: 'Library: Operations Essentials', sub: 'All 4 "Perfect Prep" Videos' },
            { title: 'Bread', sub: 'All Videos under Bread (18 min)' },
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginTop: '3px' }}>
            Write in Time Opening was completed at: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> (Goal = 9:45am)
          </div>
        </div>
        {footer()}
        {pageNumber(3)}
      </div>

      {/* ==================== PAGE 4 — SHIFT 2 ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('SHIFT 2')}

          {sectionHeader('\u26A0\uFE0F SPECIAL INSTRUCTION')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, paddingLeft: '10px', marginBottom: '3px' }}>
            <div>&bull; Time management will determine your success as an opener</div>
            <div>&bull; Opening shift must multi-task and move quickly, even though there are no customers in the store.</div>
            <div>&bull; Baking Bread takes a long time to get down well. It takes attention to a lot of details. For example: ability to read different weather days, keep the bread moist enough but not too wet, make sure it&apos;s proofed to the right size but not too big. Keep at it and you&apos;ll get it down!! We believe in you!</div>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Always wash hands first thing, always wear gloves, change gloves if touch face, rag, etc',
            'Set up work area properly before beginning, CLEAN AS YOU GO and sanitize as needed',
            'Keep back area neat and orderly.',
            'Always wash tomato slicer & lettuce slicer IMMEDIATELY and put tomato slicer back on its shelf right away.',
            'If short on any food product, message GM or Shift Lead immediately upon realizing.',
            'Always communicate with Shift Lead if you are behind on opening tasks.',
            'ALL BREAD CHOICES MUST BE READY BEFORE OPENING: White, Wheat, Minis and Rosemary Parm bread out of the oven by 9:40am. You can continue to bake the remainder of your white bread after 10am if needed, but all CHOICES must be available when we open.',
            'Always have your checklist close by. Check items off as you go and fully complete your checklist before break.',
            'Bake cookies at 350, pull before they\u2019re brown',
            'Cook Bacon - strain grease before placing in bin',
            'Proof and bake bread with trainer',
            'Prep all Tomato bins',
          ])}
        </div>
        {footer()}
        {pageNumber(4)}
      </div>

      {/* ==================== PAGE 5 — SHIFT 2 BENCHMARKS + QUALITY CHECKS ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '2px' }}>
            SHIFT 2 <span style={{ fontSize: '6pt', fontWeight: 400 }}>(continued)</span>
          </div>

          {sectionHeader('\uD83D\uDCDD BENCHMARKS')}
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '3px' }}>
            Trainer coach up trainee in the below areas and check them off once trainee shows they have created the habit.
          </div>
          {checkItem('Use timer to make bacon. 5-6 mins before flipping, 3-4 minutes on side 2.')}
          {checkItem('Never leave bread oven door open longer than necessary to load / unload bread.')}
          {checkItem('Hot bread goes above raw dough or previously cooked bread, never under.')}

          {sectionHeader('\uD83D\uDC4D QUALITY CHECK')}
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '3px' }}>
            Please complete the below & next page at 9:45am and discuss findings with your trainee!
          </div>

          {qualityCheckTable('BACON QUALITY CHECK', [
            'Is the bacon defrosted from you stocking it in the fridge yesterday?',
            'Did you wait for the grill to preheat completely before starting it?',
            'Cooked evenly across both sides? No raw spots',
            'Is it being timed correctly? 7 minutes and 3 minutes',
            'Is it being neatly arranged on the pan?',
          ])}

          {qualityCheckTable('COOKIES QUALITY CHECK', [
            'Were the small cookies and large cookies cooked on separate trays?',
            'Correct times/temp used?',
            'Correct color? Edges golden brown',
            'Proper texture? Bendy, gooey with crispy edges.',
          ])}

          {qualityCheckTable('TOMATOES QUALITY CHECK', [
            'Using ruby red tomatoes only?',
            'Throwing away the right amount of the ends?',
            'Are they neatly arranged on the pan?',
            "Bins properly FIFO'd?",
            'Are all bins labeled with correct day dot sticker?',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginTop: '4px' }}>
            Write in Time Opening was completed at: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> (Goal = 9:45am)
          </div>
        </div>
        {footer()}
        {pageNumber(5)}
      </div>

      {/* ==================== PAGE 6 — SHIFT 3 ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('SHIFT 3')}

          {sectionHeader('\u26A0\uFE0F SPECIAL INSTRUCTION')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, paddingLeft: '10px', marginBottom: '3px' }}>
            <div>&bull; TEACH SLICER SAFETY THOROUGHLY. NO LEFT HANDS IN THE SLICER EVER!</div>
            <div>&bull; Use measuring tomato for establishing thickness of onions and lettuce. EVERY MORNING, EVERY SHIFT!</div>
            <div>&bull; Notify shift lead if any produce seems expired or unuseable</div>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Slice onions to proper thickness (half tomato)',
            'Separate hot sub onions and fluff cold sub onions in bins',
            'Slice lettuce 2 heads at a time to proper thickness. (two thirds of a tomato) Break twice before placing in bin.',
            'Mix lettuce from previous day with new lettuce. One old bin into 2 new bins. There should be no more than 2 bins left over from previous day.',
            'Sort Tomatoes',
          ])}

          {sectionHeader('\uD83D\uDCDD BENCHMARKS')}
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '3px' }}>
            Trainer coach up trainee in the below areas and check them off once trainee shows they have created the habit.
          </div>
          {checkItem('Determine when all bread needs to be sprayed. Keep it moist but not too wet.')}
          {checkItem('Keep raw dough covered, flap down and zippers zipped.')}
          {checkItem('Have all bread options out of oven by 9:40am. Rose Parm, White, Wheat, all Minis.')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '3px', marginBottom: '2px' }}>&#9745; OPENER CHECKLIST</div>
          <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: 1.4, paddingLeft: '10px', marginBottom: '2px' }}>
            <div>&bull; Trainee is responsible for checking off opener checklist on their own</div>
            <div>&bull; Check off as you go, do not wait until end of shift and check everything off</div>
          </div>
          <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginTop: '2px', marginBottom: '4px' }}>
            Write In Time Opening was completed at: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> (goal = 9:45am)
          </div>

          {sectionHeader('\uD83D\uDCAF GM DEBRIEF')}
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '3px' }}>
            Do at conclusion of 3rd opening training shift
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '2px' }}>What part of the opening shift do you feel is most challenging for you?</div>
            <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
            <div style={{ marginBottom: '2px' }}>2 areas in which trainee is excelling:</div>
            <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
            <div style={{ marginBottom: '2px' }}>2 areas of opportunity:</div>
            <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
          </div>

          {lmsBlock([
            { title: 'New Hire', sub: 'Sorting Tomatoes & Tomato Prep & Slicing' },
            { title: 'Advanced Food Prep', sub: 'Slicing Lettuce & Lettuce Management (6 min)' },
          ])}
        </div>
        {footer()}
        {pageNumber(6)}
      </div>

      {/* ==================== PAGE 7 — SHIFT 4 + BREAD QUALITY CHECK ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('SHIFT 4')}

          {sectionHeader('\u26A0\uFE0F SPECIAL INSTRUCTION')}
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.5, paddingLeft: '10px', marginBottom: '3px' }}>
            <div>&bull; Make sure trainee is practicing slicer safety</div>
            <div>&bull; Make sure trainee is using measuring tomato</div>
            <div>&bull; Coach up trainee with multi tasking and make sure they are moving with urgency</div>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Slice onions & proper thickness (half tomato)',
            'Slice lettuce \u2013 2 heads at a time, break twice before placing in bin',
            'Take care of bread with help from trainer as needed',
          ])}

          {sectionHeader('\uD83D\uDCDD BENCHMARKS')}
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '3px' }}>
            Trainer coach up trainee in the below areas and check them off once trainee shows they have created the habit.
          </div>
          {checkItem('Turn on all lights and equipment in the store on your own, no help or hints!')}
          {checkItem('Print production report and instruct opening trainer on how much of each item needs to be prepped')}
          {checkItem('Proof ALL bread to the right size & bake it to the right color')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '3px', marginBottom: '2px' }}>&#9745; OPENER CHECKLIST</div>
          <div style={{ fontSize: '6pt', color: '#2D2D2D', lineHeight: 1.4, paddingLeft: '10px', marginBottom: '2px' }}>
            <div>&bull; Trainee is responsible for checking off opener checklist on their own</div>
            <div>&bull; Check off as you go, do not wait until end of shift and check everything off</div>
          </div>

          {sectionHeader('\uD83D\uDC4D QUALITY CHECK')}
          <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '3px' }}>
            Please complete the below & following page at 9:45am and discuss findings with your trainee!
          </div>

          {qualityCheckTable('BREAD QUALITY CHECK', [
            'Fully stretched end to end?',
            'Stretched evenly, no lumpy spots?',
            'Scoring done well? 1 inch margins each side, tapering deeper towards the middle.',
            'Does it pass the erect test? Hold it by one end and does it hold its shape?',
            'Color, is it golden brown, or too light or too dark?',
            'Texture, is it spongy and too wet? Or hard and dry?',
            'Proofing: is it under proofed, over proofed or just right?',
            "Are the edges of the bread curving upward indicating they weren't sprayed enough?",
            'Is there a correct amount of rosemary?',
            'Is there a correct amount of parmesan?',
          ])}
        </div>
        {footer()}
        {pageNumber(7)}
      </div>

      {/* ==================== PAGE 8 — SHIFTS 5 & 6 + CERTIFICATION ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('SHIFT 5')}

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee should be doing the majority of opening tasks on their own by now. Trainer is there to observe, coach, and correct. Continue to practice and make progress on all prior items.
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Trainee completes full opening with minimal guidance from trainer',
            'Trainer observes and provides real-time coaching notes',
            'All bread options out of oven by 9:40am',
            'All produce sliced and stocked by 9:45am',
            'Opener checklist completed independently before break',
          ])}

          {sectionHeader('\uD83D\uDCDD BENCHMARKS')}
          {checkItem('Trainee can turn on all lights and equipment without any help')}
          {checkItem('Trainee can read and follow production report independently')}
          {checkItem('Trainee manages bread proofing, baking, and spraying with confidence')}
          {checkItem('Trainee manages time effectively \u2014 all tasks done by 9:45am')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginTop: '3px', marginBottom: '6px' }}>
            Write in Time Opening was completed at: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> (Goal = 9:45am)
          </div>

          <div style={{ height: '1px', background: '#134A7C', margin: '4px 0' }} />

          {dayBanner('SHIFT 6')}

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee performs the entire opening independently. Trainer observes only and provides final assessment. This is the certification shift.
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Trainee performs full opening 100% independently',
            'All equipment turned on, bread proofed and baked, produce sliced and stocked',
            'Opener checklist completed and all tasks done before 10am break',
            'Quality of all food items meets standards',
          ])}

          <div style={{
            textAlign: 'center', fontSize: '9pt', fontWeight: 700, fontStyle: 'italic',
            color: '#2D2D2D', marginTop: '6px', marginBottom: '4px', textDecoration: 'underline',
          }}>
            OPENER CERTIFICATION
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee completes the entire opening shift independently. All bread choices out of oven by 9:40am, all produce sliced and stocked, opener checklist fully completed, and break taken by 10am. <b>Goal = 9:45am completion.</b>
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.8, paddingLeft: '20px' }}>
            -Final Opening Time: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> (must be by 9:45am)<br />
            -All bread choices available by 9:40am: <span style={{ display: 'inline-block', width: '60px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> YES / NO<br />
            -Quality check passed: <span style={{ display: 'inline-block', width: '60px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> YES / NO<br />
            -Opener checklist completed independently: <span style={{ display: 'inline-block', width: '60px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> YES / NO
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Certification Awarded By - Trainer: <span style={{ display: 'inline-block', width: '120px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
            </div>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Date: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
            </div>
          </div>
        </div>
        {footer()}
        {pageNumber(8)}
      </div>
    </div>
  );
});

export default TrainingPacketOpener;
