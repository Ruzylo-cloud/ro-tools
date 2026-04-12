'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel1 = forwardRef(function TrainingPacketLevel1({ data }, ref) {
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

  const lmsBlock = (videos) => (
    <div style={{ marginTop: '4px' }}>
      <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '2px' }}>
        HOMEWORK - TRAINING VIDEOS on LMS
      </div>
      <div style={{ fontSize: '6pt', color: '#6b7280', marginBottom: '2px' }}>
        (send report to GM of time spent on videos, time will be added to next paycheck)
      </div>
      {videos.map((v, i) => (
        <div key={i} style={{ fontSize: '6.2pt', color: '#2D2D2D', marginBottom: '1px' }}>
          <u>{v.title}</u><br />
          &nbsp;&nbsp;&nbsp;&nbsp;All Videos ({v.duration}) &nbsp;&nbsp;<span style={{ display: 'inline-block', width: '12px', height: '12px', border: '1px solid #2D2D2D', verticalAlign: 'middle' }}>&nbsp;</span>
        </div>
      ))}
    </div>
  );

  const gmDebrief = () => (
    <div style={{ marginTop: '6px' }}>
      {sectionHeader('GM DEBRIEF - end of training shift')}
      <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6 }}>
        <div style={{ marginBottom: '2px' }}>What has been most difficult for you so far?</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>What is your favorite part of the job so far?</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>2 areas in which trainee is excelling:</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>2 areas of opportunity:</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ marginBottom: '2px' }}>Discuss one Core Value the trainee is embodying:</div>
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ borderBottom: '1px solid #2D2D2D', height: '14px', marginBottom: '4px' }} />
        <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#6b7280' }}>
          Is there anything you&apos;d like to talk about or ask about while we&apos;re chatting? (don&apos;t write down, this is just opportunity for casual conversation)
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

      {/* ==================== PAGE 1 — DAY 2: SPRINKLE BACK LINE ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="LEVEL 1 TRAINING PACKET"
          subtitle="Sprinkle / Wrap Certification \u2014 Days 2\u20139"
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

          {dayBanner('DAY 3 \u2014 SPRINKLING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '3px' }}>
            DAY 2 - <i>SPRINKLE on BACK LINE</i>
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginBottom: '4px' }}>
            TWO 6-hour shifts for training SPRINKLE
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Spend 10 mins golden bottle - 2 oz mark',
            'Place, cut & wrap a few subs. Reg & Giant.',
            'Back Line Checklist with trainer',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SPRINKLE BENCHMARKS - check off when mastered</div>
          {checkItem('All toppings placed from END to END?')}
          {checkItem('Proper lettuce amount & sweep sides, put extra back in bin')}
          {checkItem('Keep your station clean')}
          {checkItem(<>Visually recognize <b>8&apos;s and 9&apos;s</b> &amp; remember mayo bacon</>)}

          {lmsBlock([
            { title: 'New Hire: Sprinkling', duration: '14 min' },
            { title: 'New Hire: New Hire Essentials', duration: '11 min' },
          ])}
        </DocumentTemplate>
        {pageNumber(1)}
      </div>

      {/* ==================== PAGE 2 — DAY 3: SPRINKLE BACK LINE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '4px' }}>
            DAY 3 - <i>SPRINKLE on BACK LINE</i>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Review Sprinkle one pager on next page',
            '10 mins golden bottle again - 2oz',
            'How to setup BACK line \u2013 how and when to stock',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SPRINKLE BENCHMARKS - check off when mastered</div>
          {checkItem('End your shift with as little lettuce as possible in the slush trough')}
          {checkItem(<>Visually recognize <b>8&apos;s and 9&apos;s</b> &amp; remember mayo bacon</>)}
          {checkItem('3 stripes of mustard (or any other dressing)?')}
          {checkItem('No tomatoes falling off the sub from uneven lettuce')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS on iPad - Jolt Deep Clean videos
          </div>
          {checkItem('Deep Clean intro and Wash Sinks')}
          {checkItem('Towel Talk')}

          <div style={{
            textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline',
            color: '#2D2D2D', marginTop: '10px', marginBottom: '4px',
          }}>
            <i>SPRINKLE POSITION</i> : Review start of <b>Day 3</b>
          </div>

          {subHeader('Proper Sprinkling Technique')}
          {checkItem(<><b>Onions</b> \u2013 lite onions - Olympic rings</>)}
          {checkItem(<><b>Lettuce</b> \u2013 shape lettuce as you place, SWEEP sides, extra goes back in lettuce bin</>)}
          {checkItem(<><b>Tomatoes</b> \u2013 grab from line closest to you, use before moving to next line of tomatoes. Tomatoes are always neat, JUICE STRAINED OUT.</>)}
          {checkItem(<><b>&quot;The Juice&quot;</b> \u2013 proper form, smooth motion, 2 passes vinegar, 3 passes oil.</>)}
          {checkItem(<><b>Oregano</b> \u2013 hold shaker horizontal, 2 passes, cover tomatoes completely</>)}
          {checkItem(<><b>Salt</b> \u2013 1 shake per tomato, 1 pass only - #6 gets TWO PASSES of salt</>)}
          {checkItem(<><b>Bacon</b> - 4 slices for giant, 2 for regular, 1 for mini</>)}
          {checkItem('The mark of a great sprinkler is an EMPTY TROUGH at the end of the shift = NO WASTE!')}
        </div>
        {footer()}
        {pageNumber(2)}
      </div>

      {/* ==================== PAGE 3 — DAY 3 cont: Setup/Cleanliness + Portion Control ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 3 \u2014 SPRINKLING')}

          {subHeader('Set Up/Cleanliness/Organization/Safety:')}
          {checkItem('Always wash hands first thing, wear gloves, change gloves often.')}
          {checkItem('Proper drop in set up, all condiments mounded over, stock when it hits 50%')}
          {checkItem('Keep drop in area clean, wipe down regularly, take pickles out of mayo, etc.')}
          {checkItem('Never cut on any sprinkle board - move sandwich off board to cut')}
          {checkItem("Use point finger & thumb to remove tickets from front line ticket rack - DON'T TOUCH GLASS - no smudge marks")}

          {subHeader('Portion Control:')}
          {checkItem('Proper amount of onion, lettuce, tomato, juices, spices very important to flavor')}
          {checkItem(<>Complete ALL Mike&apos;s Way ingredients <b>before</b> adding anything additional</>)}
          {checkItem('Use reminders for pickles, jalapeno, ban peppers')}
          {checkItem("Direct wrapper to dress all lids (all 8's, 9's, Cali's, mayo, cpr, etc) & get sides")}

          {lmsBlock([
            { title: 'New Hire: Advanced Food Safety', duration: '15 min' },
            { title: 'New Hire: Wrapping', duration: '8 min' },
          ])}
        </div>
        {footer()}
        {pageNumber(3)}
      </div>

      {/* ==================== PAGE 4 — DAY 4: SPRINKLE BACK LINE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 4 \u2014 SPRINKLING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '4px' }}>
            DAY 4 - <i>SPRINKLE on BACK LINE</i>
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'How to Sweep & Mop properly - behind items',
            'Fill wash sinks & how to wash (remove stickers!!!)',
            'Consolidate/Stack Bread for front rack when cool',
            'Take cold sub quiz on next page',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Jolt Deep Clean videos
          </div>
          {checkItem('Goo Gone')}
          {checkItem('Magic Eraser')}

          {gmDebrief()}
        </div>
        {footer()}
        {pageNumber(4)}
      </div>

      {/* ==================== PAGE 5 — COLD SUB MENU TEST ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{
            background: '#EE3227', color: '#fff', fontSize: '11pt', fontWeight: 800,
            padding: '3px 16px', display: 'inline-block',
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px',
            clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)',
            paddingRight: '28px',
          }}>
            COLD SUB MENU TEST
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.2pt', marginBottom: '6px' }}>
            <tbody>
              {[
                ['#2', '#1'], ['#3', '#4'], ['#5', '#11'], ['#6', '#12'],
                ['#7', '#14'], ['#8', '#13'], ['#9', ''], ['#10', 'Cali Club'],
              ].map(([left, right], i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', fontWeight: 700, width: '8%', background: '#F0F4F8' }}>{left}</td>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', width: '42%' }}>
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ height: '10px' }} />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', fontWeight: 700, width: '8%', background: '#F0F4F8' }}>{right}</td>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', width: '42%' }}>
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ height: '10px' }} />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}></td>
                <td colSpan={2} style={{ border: '1px solid #ccc', padding: '2px 4px', background: '#E5E7EB', fontWeight: 700, textAlign: 'center' }}>
                  SCORE <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> %
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '4px' }}>
            Mike&apos;s Way includes: <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> &nbsp;&nbsp; <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> &nbsp;&nbsp; <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
          </div>
          <div style={{ fontSize: '7pt', color: '#2D2D2D', marginTop: '2px' }}>
            <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> &nbsp;&nbsp; <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> &nbsp;&nbsp; <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> &nbsp;&nbsp; <span style={{ display: 'inline-block', width: '90px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span>
          </div>
        </div>
        {footer()}
        {pageNumber(5)}
      </div>

      {/* ==================== PAGE 6 — DAY 5: SPRINKLE FRONT LINE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 5 \u2014 SPRINKLING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '4px' }}>
            <b>DAY 5 -</b> SPRINKLE on FRONT LINE!
          </div>

          {subHeader('Guest Service/Communication:')}
          {checkItem("First thing to say, ALWAYS \"would you like your sandwich Mike's Way\" & SMILE")}
          {checkItem('If you or the guest cannot hear each other, POINT at the item in question (eg. point at the tomatoes when you say "tomatoes?"), so they can nod yes or no.')}
          {checkItem("Always tell wrapper what number sandwich and who it's for as you pass down the line")}
          {checkItem('Call for double sprinkler or ask wrapper to "sprinkle dance" as needed. OFTEN.')}
          {checkItem("If avocado is added to sub, always say \"it's an extra charge, is that ok\"")}
          {checkItem("Train the guest: Mike's Way, no onion, easy juice, etc.")}

          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginTop: '4px', marginBottom: '4px' }}>
            &bull; <b>ROLEPLAY B4 THE RUSH</b> - roleplay topping off a Mike&apos;s way sub with the trainee. Trainer plays the part of the customer, trainee asks if they want their sub &quot;Mike&apos;s way&quot;. Use hot sub bread, trainer says yes to Mike&apos;s way but adds extras. Coach up trainee. Do 2-3 times through.
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Review areas that trainee needs practice',
            'How to: keep front line 50% full and clean',
            'How to Deep Clean - tools, cleaning products',
            'Complete After Lunch Sprinkle list with Trainer',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SPRINKLE BENCHMARKS - check off when mastered</div>
          {checkItem("Ask every customer if they want their sub \"Mike's Way\"")}
          {checkItem('Instruct wrapper to dress lids')}
          {checkItem('Communicate subs down the line')}
          {checkItem('Sprinkle 2 subs at a time')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Jolt Deep Clean videos - watch after lunch rush.
          </div>
          {checkItem('Rinsing O/V Bottles')}
          {checkItem('Mop Vac')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SPRINKLE CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>
            Trainee completes sprinkle checklist on their own with shift lead or trainer. Time this.<br />
            <b>Goal = 35 minutes</b>. Attempt #1 at sprinkle checklist <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes.
          </div>
        </div>
        {footer()}
        {pageNumber(6)}
      </div>

      {/* ==================== PAGE 7 — DAY 6: SPRINKLE FRONT LINE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 6 \u2014 SPRINKLING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '4px' }}>
            <b>DAY 6 -</b> SPRINKLE on FRONT LINE
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; SPRINKLE BENCHMARKS - check off when mastered</div>
          {checkItem('Sprinkle 3 subs at a time')}
          {checkItem('Sprinkle without a wrapper. Put subs on paper, cut for the register person to wrap.')}
          {checkItem("Train guests how to order relative to Mike's Way")}
          {checkItem('Sprinkle a Giant in under 30 seconds')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Catering \u2013 wrapping, stickering, boxing orders',
            'Prep Mayo \u2013 how many, count what you have 1st',
            'Prep Avocado \u2013 how many, count what u have 1st',
            'Train how to answer phone and take phone orders (all instructions on following page)',
            'Train how to lobby check (instructions next page)',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>&bull; SPRINKLE CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Trainee completes sprinkle checklist on their own, shift lead or trainer checks work - correct improper work before clock out. Time the trainee for Sprinkle Checklist. <b>Goal = 35 minutes</b>.
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginBottom: '6px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;Attempt #2 at sprinkle checklist <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes
          </div>
        </div>
        {footer()}
        {pageNumber(7)}
      </div>

      {/* ==================== PAGE 8 — DAYS 7,8,9: PROFICIENCY + CERTIFICATION ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 7, 8 & 9 \u2014 SPRINKLING')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '4px' }}>
            DAY 7, 8, 9: <i>SPRINKLE on FRONT LINE</i>
          </div>
          <div style={{ textAlign: 'center', fontSize: '6.5pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '8px' }}>
            Continue to practice &amp; make progress &amp; complete prior pages as needed. Cover training list above. When ready, submit video &amp; plan certification shift!
          </div>

          <div style={{
            textAlign: 'center', fontSize: '9pt', fontWeight: 700, fontStyle: 'italic',
            color: '#2D2D2D', marginBottom: '6px', textDecoration: 'underline',
          }}>
            SPRINKLE CERTIFICATION!!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee works lunch rush beside Trainer &amp; Trainer submits video executing Mike&apos;s Way. Trainee completes <b>Sprinkle checklist in required time = 35 minutes and Sprinkle a GIANT in the required time = 30 seconds or less</b>
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '8px', marginBottom: '4px' }}>
            LEVEL 1:
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.8, paddingLeft: '20px' }}>
            -Final attempt at Sprinkle Checklist: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> minutes (must be under 35 mins)<br />
            -Sprinkle a Giant: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> seconds (must be under 30 secs)<br />
            -Sprinkle Certification submitted: <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}>&nbsp;</span> (video submission of Mike&apos;s Way, moving sub to paper, cut and wrap required)
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
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
    </div>
  );
});

export default TrainingPacketLevel1;
