'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketLevel3 = forwardRef(function TrainingPacketLevel3({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  const PAGE_W = 612;
  const PAGE_H = 792;
  const TOTAL_PAGES = 6;

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
      <div style={{ fontSize: '6pt', color: '#6b7280', marginBottom: '2px' }}>
        (send report to GM of time spent on videos, time will be added to next paycheck)
      </div>
      {videos.map((v, i) => (
        <div key={i} style={{ fontSize: '6.2pt', color: '#2D2D2D', marginBottom: '1px' }}>
          <u>{v.title}</u><br />
          &nbsp;&nbsp;&nbsp;&nbsp;All Videos ({v.duration}) &nbsp;&nbsp;______
        </div>
      ))}
    </div>
  );

  const gmDebrief = (questionText) => (
    <div style={{ marginTop: '6px' }}>
      {sectionHeader('GM DEBRIEF - end of training shift')}
      <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6 }}>
        <div style={{ marginBottom: '2px' }}>{questionText} ______________________________________</div>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '4px', height: '12px' }} />
        <div style={{ marginBottom: '2px' }}>2 areas in which trainee is excelling: ______________________________________</div>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '4px', height: '12px' }} />
        <div style={{ marginBottom: '2px' }}>2 areas of opportunity: ______________________________________</div>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '4px', height: '12px' }} />
        <div style={{ marginBottom: '2px' }}>Discuss one Core Value the trainee is embodying: ______________________________________</div>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '4px', height: '12px' }} />
        <div style={{ fontSize: '6pt', fontStyle: 'italic', color: '#6b7280' }}>
          Is there anything you&apos;d like to talk about or ask about while we&apos;re chatting? (don&apos;t write down, this is just opportunity for casual conversation)
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

      {/* ==================== PAGE 1 — DAY 18: HOT SUBS MENU QUIZ ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="LEVEL 3 TRAINING PACKET"
          subtitle="Hot Subs Certification — Days 18–25"
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

          {dayBanner('DAY 18 — HOT SUBS')}

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '2px', marginTop: '4px' }}>
            HOT SUBS MENU QUIZ
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Trainee <b>MUST PASS HOT SUB MENU QUIZ</b> <b>before</b> training begins
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.2pt', marginBottom: '4px' }}>
            <tbody>
              {[
                ['#16/17', '#26'],
                ['#42/43', '#44'],
                ['#55/56', '#31'],
                ['#65/66', '#64'],
              ].map(([left, right], i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', fontWeight: 700, width: '10%', background: '#F0F4F8' }}>{left}</td>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', width: '40%' }}>
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ height: '10px' }} />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', fontWeight: 700, width: '10%', background: '#F0F4F8' }}>{right}</td>
                  <td style={{ border: '1px solid #ccc', padding: '1px 4px', width: '40%' }}>
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ borderBottom: '1px solid #eee', height: '10px', marginBottom: '1px' }} />
                    <div style={{ height: '10px' }} />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}></td>
                <td colSpan={2} style={{ border: '1px solid #ccc', padding: '2px 4px', background: '#E5E7EB', fontWeight: 700, textAlign: 'center' }}>
                  SCORE _________ %
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '4px' }}>
            C-BOPS stands for __________________
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.6, paddingLeft: '12px', marginTop: '2px' }}>
            C = __________________ (Cheese)<br />
            B = __________________ (Bread)<br />
            O = __________________ (Onions)<br />
            P = __________________ (Peppers)<br />
            S = __________________ (Steak)
          </div>
        </DocumentTemplate>
        {pageNumber(1)}
      </div>

      {/* ==================== PAGE 2 — DAY 18: HOT SUBS TRAINING ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 18 — HOT SUBS')}

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', marginBottom: '4px' }}>
            TWO 6-hour shifts training on HOT SUBS
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            <>Discuss the importance of <b>timing</b> in cooking meat. We are the CHEF. We are controlling quality of product.</>,
            <>Pass Hot Sub Quiz with 86% or higher - <b>must pass before you begin</b> training on the grill</>,
            'Review next page on hot sub station',
            'Cut bread so at least 50% of the bread is on the bottom half',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; HOT SUBS BENCHMARKS - check off when trainee has mastered</div>
          {checkItem(<><b>C-BOPS</b> every time. Lay out Cheese first, then Bread, Onions, Peppers, Steak.</>)}
          {checkItem('Sear meat for 30 seconds on the first side, then flip & cut in right away.')}
          {checkItem('When you flip the Steak, you also flip the Bread.')}
          {checkItem('Scrape grill after every sub.')}
          {checkItem('Food quality. Do not overcook the steak!! NO MORE THAN TWO pieces of meat on the grill during training.')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; HOT SUBS CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>
            Trainee completes hot subs checklist with shift lead or trainer. Time this. <b>Goal = 40 minutes</b>.<br />
            Attempt #1 at hot subs checklist ________ minutes.
          </div>

          {lmsBlock([
            { title: 'New Hire: Hot Subs', duration: '18 min' },
            { title: 'Team Member: Bread', duration: '15 min' },
          ])}
        </div>
        {footer()}
        {pageNumber(2)}
      </div>

      {/* ==================== PAGE 3 — DAY 18: HOT SUBS STATION DETAILS ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 18 — HOT SUBS')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginBottom: '4px' }}>
            DAY 18 - HOT SUBS
          </div>

          {subHeader('Area Set Up/Cleanliness/Organization:')}
          {checkItem('Stock area with bags, cutting board, knife. Stock hot sub fridge unit, top; sauces, bottom; meats. Stock top with: 2 red & yellow scrapers, 2 red & yellow dough cutters, 1 white scraper & dough cutter, 1 black dough cutter, grill scraper & salt.')}
          {checkItem('Keep grill clean. No build up, scrape every time.')}
          {checkItem('Grill top set at 350, 4 burners underneath, 1 burner may burn low - ask shift lead to turn it UP!')}
          {checkItem('Always label every sub bag with number or name.')}

          {subHeader('Guest Service/Communication:')}
          {checkItem(<><b>BEFORE</b> handing out hot sub to guest, check ticket rack by register to confirm it was PAID, then call out name and hand off sub. Throw away &quot;P&quot; ticket.</>)}
          {checkItem('Proper amounts of ingredients on all subs = subs taste perfect!!')}
          {checkItem('Use posted guides for hot subs until completely committed to memory')}

          {subHeader('Operations:')}
          {checkItem(<><b>Sense of Urgency!</b> When the first ticket goes up on the rack, the sub must be on the grill, cooking, within 30 seconds.</>)}
          {checkItem(<>Always follow C-BOPS. <b>C</b>heese, <b>B</b>read, <b>O</b>nions, <b>P</b>eppers, <b>S</b>teak.</>)}
          {checkItem('NEVER overcook meat. Cheese should go on when meat is still pink.')}
          {checkItem(<><b>Allow meat to SEAR before flipping or cutting it</b>. This means letting the meat cook for 30 seconds on side 1, then flip and cut the 4 by 4.</>)}
          {checkItem('Cut with 4 by 4 motion, make sure all pieces are bite size. Not too large or small.')}
          {checkItem(<><b>Cook and assemble all giants as TWO REGULARS. Wrap as Giant.</b></>)}
        </div>
        {footer()}
        {pageNumber(3)}
      </div>

      {/* ==================== PAGE 4 — DAY 19: HOT SUBS ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 19 — HOT SUBS')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'Fully stock Hot Sub station (both phillies, let, tom, backup cheese)',
            'How to deep clean Hot Sub unit',
            'How to prep steak and chicken back ups',
            'How to read production report to decide how many back ups to make. Check 3 to close for current day and 8 to close for the following',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; HOT SUBS BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Always check to make sure the sub is paid for and take tickets down')}
          {checkItem('Be efficient. (Get cheese ready, get wrap paper ready, call for backup when more than 4 subs on your tickets)')}
          {checkItem('No food left on the grill')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Jolt Deep Clean videos
          </div>
          {checkItem('Cleaning the grill with Oil')}
          {checkItem('Dumping Grease & Oil')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; HOT SUBS CHECKLIST</div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, marginBottom: '4px' }}>
            Trainee completes hot subs checklist with shift lead or trainer. Time this. <b>Goal = 40 minutes</b>.<br />
            Attempt #2 at hot subs checklist ________ minutes
          </div>

          {gmDebrief('What part of Hot Subs position do you feel is most challenging for you?')}
        </div>
        {footer()}
        {pageNumber(4)}
      </div>

      {/* ==================== PAGE 5 — DAY 20: HOT SUBS + DAYS 21-25 ADVANCED ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('HOT SUBS')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; TRAINING LIST</div>
          {trainingTable([
            'How to write Hot Sub tickets',
            'How to deep clean grill hoods',
            'How to pre close the hot sub station',
          ])}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>&bull; HOT SUBS BENCHMARKS - check off when trainee has mastered</div>
          {checkItem('Keep hot Sub area clean and stocked. Call for backups only when you cannot leave your station. Otherwise, you stock.')}
          {checkItem('Take guest hot sub orders during downtime.')}
          {checkItem('Only corners of cheese are melted on the steak')}
          {checkItem('Make a R17 in under 2 minutes')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '4px', marginBottom: '2px' }}>
            &bull; TRAINING VIDEOS - Jolt Deep Clean videos
          </div>
          {checkItem('Walk in Floors & Corners')}
          {checkItem('Sneeze Guard Posts')}

          <div style={{ textAlign: 'center', fontSize: '8pt', fontWeight: 700, textDecoration: 'underline', color: '#2D2D2D', marginTop: '10px', marginBottom: '4px' }}>
            DAY 21 - 25: HOT SUBS
          </div>
          <div style={{ textAlign: 'center', fontSize: '6.5pt', fontStyle: 'italic', color: '#2D2D2D', marginBottom: '8px' }}>
            Continue to practice &amp; complete prior pages as needed. When ready, submit video &amp; plan certification shift!
          </div>

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '2px' }}>Advanced Hot Subbing:</div>
          {checkItem('Once there is more than 4 sandwiches on your ticket rack (that could be one ticket, with 4 hot subs on it!) you MUST CALL FOR A SECOND PERSON TO THE HOT SUB STATION. Alert shift lead if someone does not come.')}
          {checkItem(<>If you have 4 tickets or more, call for &quot;backup at the grill&quot;. One of you pulls papers, lay out cheese, get bread on the grill, put down onions &amp; peppers, distribute finished subs. THE OTHER PERSON stands at grill and does the cooking and placing of meats into bread.</>)}
          {checkItem('Whenever possible, take hot sub orders from customers in line starting with whoever is next to order')}
          {checkItem(<>As you are taking orders, notice how many tickets are up above the grill. <b>Tell guests to expect longer wait times</b> when more than 3 tickets are up.</>)}
          {checkItem('Write ticket on pad, green copy to customer, yellow copy to ticket line above grill')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, marginTop: '6px', marginBottom: '2px' }}>&bull; VIDEO COMPLETION PERCENTAGE</div>
          {checkItem('Goal by this point is 45%')}
        </div>
        {footer()}
        {pageNumber(5)}
      </div>

      {/* ==================== PAGE 6 — HOT SUBS CERTIFICATION ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('HOT SUBS')}

          <div style={{
            textAlign: 'center', fontSize: '9pt', fontWeight: 700, fontStyle: 'italic',
            color: '#2D2D2D', marginBottom: '6px', marginTop: '8px', textDecoration: 'underline',
          }}>
            HOT SUBS CERTIFICATION!!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Trainee works a rush with Trainer, demonstrates proficiency in the position, AND completes Hot Sub checklist in 40 minutes or less, AND makes a Regular 17 in under 2 minutes.
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginTop: '8px', marginBottom: '4px' }}>
            LEVEL 3:
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.8, paddingLeft: '20px' }}>
            Final attempt at Hot Subs Checklist time: ________ minutes<br />
            Time to make a regular 17: ____ minutes _______ seconds (must be under 2 mins)<br />
            Hot Subs Certification submitted: ________ (video of #17 cooked &amp; wrapped)
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Certification Awarded By - Trainer: _________________________
            </div>
            <div style={{ fontSize: '6.5pt', color: '#2D2D2D' }}>
              Date: _________
            </div>
          </div>

          <div style={{
            textAlign: 'center', fontSize: '10pt', fontWeight: 700,
            color: '#EE3227', marginTop: '24px', marginBottom: '6px',
          }}>
            CONGRATS ON REACHING LEVEL 3!!
          </div>
          <div style={{ textAlign: 'center', fontSize: '7pt', color: '#2D2D2D', fontStyle: 'italic' }}>
            Ask your GM to complete the below with you, and then you will be added to the tip pool!
          </div>
        </div>
        {footer()}
        {pageNumber(6)}
      </div>
    </div>
  );
});

export default TrainingPacketLevel3;
