'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const TrainingPacketShiftLead = forwardRef(function TrainingPacketShiftLead({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  const PAGE_W = 612;
  const PAGE_H = 792;
  const TOTAL_PAGES = 10;

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

  const sectionHeaderLight = (text) => (
    <div style={{
      background: '#B8CCE0', color: '#000', fontSize: '6.5pt', fontWeight: 700,
      padding: '2px 10px', marginBottom: '2px', marginTop: '5px',
    }}>
      {text}
    </div>
  );

  const sectionHeaderGray = (text) => (
    <div style={{
      background: '#808080', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
      padding: '2px 10px', marginBottom: '2px', marginTop: '5px',
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

  const markDoneTable = (rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.2pt', marginBottom: '3px', marginTop: '2px' }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px', lineHeight: 1.3 }}>{row}</td>
            <td style={{ border: '1px solid #ccc', padding: '2px 4px', width: '70px', textAlign: 'center' }}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const proficiencyTable = (title, rows) => (
    <>
      <div style={{
        background: '#D9D9D9', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
        marginTop: '5px', marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{title}</span>
        <span>Proficient?</span>
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', fontSize: '5.8pt',
          padding: '1px 6px', borderBottom: '1px solid #e5e5e5',
          background: i % 2 === 0 ? '#fff' : '#FAFAFA',
        }}>
          <span style={{ flex: 1, color: '#2D2D2D', lineHeight: 1.3 }}>{row}</span>
          <span style={{ width: '50px', textAlign: 'center', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '1.5px solid #134A7C' }}></span>
          </span>
        </div>
      ))}
    </>
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

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

      {/* ==================== PAGE 1 — EVALUATION: CHARACTER TRAITS + CUSTOMER COMPLAINTS + STATE OF STORE ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="SHIFT LEAD TRAINING PACKET"
          subtitle="Leadership Development Program"
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

          <div style={{
            background: '#FFFF00', fontSize: '6pt', fontWeight: 600, textAlign: 'center',
            padding: '3px 10px', marginBottom: '4px', lineHeight: 1.3,
          }}>
            This evaluation determines whether the crew member is a good fit for / ready to train as Shift Lead. GM and shift lead candidate should review together the week prior to training beginning.
          </div>

          <div style={{
            display: 'flex', fontSize: '6pt', fontWeight: 700, padding: '2px 6px',
            borderBottom: '1px solid #ccc', marginBottom: '1px', justifyContent: 'space-between',
          }}>
            <span>Character Traits. Shift Leads must exemplify the below character traits.</span>
            <span style={{ fontSize: '5.5pt', whiteSpace: 'nowrap' }}>Shift Lead in training Initial</span>
          </div>

          {[
            { title: 'Servant Leadership', desc: 'helping the crew out constantly. You are never too good to do dishes, take out trash, clean drains. Show you\u2019re on the same team by continuing to work hard and get your hands dirty.' },
            { title: 'Positive Attitude', desc: 'You are a role model for the team! Must maintain a mindset of accepting a challenge head on and with a positive approach. We will not let any call outs, last minute catering, late night rushes ruin team spirit.' },
            { title: '360 Vision Always', desc: 'observe everything happening in the store at all times. Notice and ACT right away for small instances, before they become a breakdown (long wait times at grill, tickets backing up, person standing by register looking annoyed)' },
            { title: 'Planning Ahead', desc: 'store leadership must think about how busy it may be due to weather / coupons / ads & promotions. Must be able to visualize the flow of the line based on who you position where, how it will impact the team if you send someone on break, manage time well to ensure catering is never late, etc.' },
            { title: 'Lots of Communication', desc: 'remind crew members of any store promos, tell them we have a trainee today, prepare them for what is coming ex: "after you grill that sub will you please move to slice so Dan can take his break". "Pepsi is coming in today, will you please put it away when it does."' },
            { title: 'Wording', desc: 'always use kind tones with all customers and team members. You set the tone for customer service, the team will follow the behavior, words, facial expressions and attitude you express to customers. You are there to lead the team as you work alongside them, not to boss them around. Eg: "will you move to sprinkle please" rather than "move to sprinkle".' },
          ].map((trait, i) => (
            <div key={i} style={{
              fontSize: '5.8pt', color: '#2D2D2D', padding: '2px 6px',
              borderBottom: '1px solid #e5e5e5', lineHeight: 1.25, display: 'flex',
            }}>
              <div style={{ flex: 1 }}>
                <b>{trait.title}</b> - {trait.desc}
              </div>
              <div style={{ width: '60px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '16px', height: '16px', border: '1.5px solid #134A7C' }}></div>
              </div>
            </div>
          ))}

          <div style={{ fontSize: '5.8pt', color: '#2D2D2D', padding: '3px 6px', lineHeight: 1.25, marginTop: '3px' }}>
            <b>Customer Complaints:</b> As a shift lead it is now your role to assist the AGM and GM in customer complaints. What do you say when someone comes up to you to complain or when they call the store to speak with a manager? What is something you don&apos;t want to do when handling a customer complaint? It is not always the easiest thing to do but with practice it is achievable. <u>ROLE PLAY</u>: Here are some sample prompt questions to answer when doing the interactive role play with your trainer. 1. (Phone order) Hello, You forgot my chips and cookie. 2. (phone order) Hey, I got back to work and I opened up my sandwich and it is SO soggy!!! 3. I specifically said NO mayo and you put mayo on my sandwich and now its ruined! 4. I ordered a Giant $8 and I recieved a Regular Tuna. 5. (busy lunch rush, lots of hot sub tickets) Hello, I ordered my hot sub a long time ago and it&apos;s still not ready!!!!
          </div>

          <div style={{ fontSize: '5.8pt', color: '#2D2D2D', padding: '3px 6px', lineHeight: 1.25, marginTop: '2px' }}>
            <b>State of the Store</b>: One of the biggest keys to success in leading your team for the day is knowing exactly what the state of the store is in. Here are some questions that you need to ask yourself and be able to answer wither, before, during or after your shift. How many lettuce bins are in the walk in? Who&apos;s going on break next? Where is the prep person at on their prep list (progress made)? What is <span style={{ display: 'inline-block', width: '80px', borderBottom: '1px solid #2D2D2D' }}></span> (enter anyone&apos;s name) doing in the back right now? What&apos;s left to be done, in order to make sure you turn over a fully reset store to the night lead? How much bread is left? Is anyone in a bad mood today? Is everyone in Uniform?
          </div>
        </DocumentTemplate>
        {pageNumber(1)}
      </div>

      {/* ==================== PAGE 2 — EVALUATION: PROFICIENCY TABLES (SPRINKLING, WRAPPING, REGISTER) ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{
            textAlign: 'center', fontSize: '8pt', fontWeight: 700, color: '#2D2D2D',
            marginBottom: '4px', background: '#D9D9D9', padding: '3px 10px',
          }}>
            EVALUATION TO DETERMINE SHIFT LEAD READINESS
          </div>
          <div style={{ fontSize: '5.8pt', color: '#2D2D2D', marginBottom: '3px', lineHeight: 1.3 }}>
            Crew member should demonstrate proficiency in all points described below, prior to beginning training for shift lead position
          </div>

          {proficiencyTable('Skill Level - Sprinkling', [
            'Keep your sprinkle area clean and set up properly at all times - juice bottles and spices clean and lined up, all ingredients at 50% or higher, area surrounding front drop in clean',
            'Be polite and engaged with in store customers - head and eyes up whenever possible. Smile.',
            'Ask "would you like it Mike\'s Way" every time - if not, direct customer to proper order of sprinkling. "any onion, lettuce or tomato for you?".',
            'Assemble all toppings in proper order. Finish Mike\'s Way ingredients before any add ons.',
            'Keep the banter to a minimum. Slicers and Wrappers banter, Sprinkler and Register do not.',
            'Proper juicing technique and amount of juice - able to hit the 2 oz mark at anytime.',
            'Proper amount of all sprinkle ingredients',
            'Utilize wrapper properly to dress all lids',
            'Use reminders for all add ons',
            'Be able to teach and coach sprinklers to the level of excellence',
          ])}

          {proficiencyTable('Skill Level - Wrapping', [
            'Topping off all lids for sprinkler',
            'Coaching and correcting sprinkler to proper technique',
            'Proper wrapping technique - paper amount, cut with hand over knife, bag pop, crease and twist',
            'Ask all customers if they\'d like "chips and a drink" and relay all orders to register',
            'Direct traffic with pickups and in store customers',
            'Float around store to help hot sub & 2nd line as needed',
            'Assist register with tickets, bags, pickup orders',
          ])}

          {proficiencyTable('Skill Level - Register', [
            'Greet customers with kind tone, ensure they are helped or directed as needed',
            'Maintain an organized work space, clean and neat, bags organized well',
            'Multitask with tickets printing, customers to be rung out and pick ups. Ask for help from Wrap as needed.',
            'Direct customers to enter phone number, encourage sign ups for Shore points',
          ])}
        </div>
        {footer()}
        {pageNumber(2)}
      </div>

      {/* ==================== PAGE 3 — EVALUATION: SLICING/QB + HOT SUBS + ONLINE TRAINING ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {proficiencyTable('Skill Level - Slicing / Quarterbacking', [
            'Greet all customers with friendly tone',
            'Effectively communicate with customers - start conversation, help with selection if needed, have extensive knowledge of menu',
            'Close the meatcase door after each meat, don\'t skip over using the ends, keep meats well organized',
            'Slide meats and cheese into slicer properly, no left hand inside slicing area ever',
            'Proper catch and flowering of large meats, catch flip of flat, build height with flower, no thumb with flat meats/cheese',
            'Equal distribution of all meat and cheese end to end',
            'Slice all subs to proper weight, weigh your subs often, note whether other team members are weighing theirs',
            'Move with a sense of urgency, show pride and effort in slicing speed',
            'Know how to prepare blade for sharpening, how to sharpen, lube, disassemble slicer and clean properly, reassemble',
            'Control the pace of the line well, sending down 2-4 subs at a time, never more',
            'Move people around whenever necessary to create a smooth flow of your front line',
            'Maintain 360 degree vision of lobby, customers, grill, sprinkle, register, back of house. Direct the shift from the slicer.',
            'Keep the slicer clean throughout the rush - quick sweeps of piles of meat often, wipe down with rag every 30 mins',
            'Direct sprinkler to keep station, neat, clean and all items stocked to 50% minimum',
            'Delegate tuna and veggies to sprinkler whenever possible, to allow you a pause to clean slicer or evaluate back of house pace and give instruction as needed',
            'Call for someone to write hot sub tickets during lunch rush times to allow pause for items above as well',
            'Instruct crew members to double sprinkle when appropriate, lobby check, call for 2nd person on grill',
            <>Be able to teach and coach slicers to the level of excellence. NO brand new slicers slicing rushes. NO slicer training until GM trains first slice training shift. <b>Slicer Safety is always taught before anything else.</b></>,
          ])}

          {proficiencyTable('Skill Level - Hot Subs', [
            'Follows BOPS order every time - Bread, Onion, Peppers, Steaks',
            'Area stays clean and well stocked',
            'Subs are cooked perfectly, not under or overcooked',
            'Subs are well put together, end to end distribution',
            'Able to coach up a trainee from beginning to end on how to work the station to the level of excellence',
          ])}

          <div style={{
            background: '#D9D9D9', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '5px', marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Online Training Needed:</span>
            <span>Complete?</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', fontSize: '5.8pt',
            padding: '1px 6px', borderBottom: '1px solid #e5e5e5',
          }}>
            <span style={{ color: '#2D2D2D' }}>Injuries Zoom: LINK Passcode: &amp;^3567V^</span>
            <span style={{ width: '50px', textAlign: 'center' }}>&#9744;</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', fontSize: '5.8pt',
            padding: '1px 6px', borderBottom: '1px solid #e5e5e5',
          }}>
            <span style={{ color: '#2D2D2D' }}>Sexual Harrassment Training Course: INFO</span>
            <span style={{ width: '50px', textAlign: 'center' }}>&#9744;</span>
          </div>
        </div>
        {footer()}
        {pageNumber(3)}
      </div>

      {/* ==================== PAGE 4 — DM/FRANCHISEE INTERVIEW QUESTIONS ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{
            fontSize: '6.5pt', fontWeight: 700, padding: '3px 6px',
            borderBottom: '1px solid #000', marginBottom: '2px',
          }}>
            Questions to be asked by the DM or franchisee as part of conversation, no need to record responses.
          </div>

          {[
            'Where have you worked before Jersey Mike\'s?',
            'How long have you been with us?',
            'What are some of your favorite things about working here?',
            'What are some things you don\'t like about working here?',
            'What are some of your long term goals?',
            'What do you like to do in your free time?',
            'Who are some of your leadership role models and why?',
            'Do you have any previous leadership experience in any capacity?',
            'How well do you interact with others?',
            'Why do you want to be a shift lead?',
            'What are some important skills for a leader to have?',
            'How do you respond to feedback?',
            'Talk about a specific time when you had significant impact on a difficult shift.',
            'How would your team describe you? Do you feel respected by the crew?',
            'What are some of your strengths and weaknesses?',
            'Can you describe a time when you led by example?',
            'How will being a shift lead be different than what you do now?',
            'Do any of the extra shift lead duties stand out to you?',
            'Which of our core values resonates with you the most?',
          ].map((q, i) => (
            <div key={i} style={{
              fontSize: '5.8pt', color: '#2D2D2D', padding: '2px 6px',
              borderBottom: '1px solid #e5e5e5', lineHeight: 1.3,
            }}>
              {q}
            </div>
          ))}

          <div style={{ height: '8px' }} />

          {[
            '*Review call out sheet and timesheets. Make sure candidate is on time and does not call out.',
            '*Review their training packet and certification videos.',
            '*Have they been Phase 1 certified?',
            '*What positions have they been trained on including opening, prep and closing tasks?',
            '*Review their availability and school schedule.',
          ].map((item, i) => (
            <div key={i} style={{
              fontSize: '5.8pt', color: '#2D2D2D', padding: '2px 6px',
              borderBottom: '1px solid #e5e5e5', lineHeight: 1.3,
            }}>
              {item}
            </div>
          ))}

          <div style={{
            fontSize: '5.8pt', color: '#2D2D2D', padding: '6px 6px', lineHeight: 1.35,
            border: '1px solid #ccc', marginTop: '8px', background: '#FAFAFA',
          }}>
            The most significant area of growth in the shift lead position is the increased amount of responsibilty in the store. There is an expectation to have a greater awareness of all aspects of store operations and be able to communicate to other leads and management about the performance of the crew.
          </div>
        </div>
        {footer()}
        {pageNumber(4)}
      </div>

      {/* ==================== PAGE 5 — TRAINING DAY ONE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
            <div style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '6.5pt', color: '#2D2D2D', fontWeight: 600 }}>Name:</span>
              <div style={{ borderBottom: '1px solid #134A7C', flex: 1, fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '12px' }}>{employeeName}</div>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '6.5pt', color: '#2D2D2D', fontWeight: 600 }}>Training Start Date:</span>
              <div style={{ borderBottom: '1px solid #134A7C', width: '100px', fontSize: '7pt', fontWeight: 600, color: '#2D2D2D', minHeight: '12px' }}>{startDate}</div>
            </div>
          </div>

          {dayBanner('TRAINING DAY ONE: 8AM OR 3PM START TIME')}

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '4px', marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Main Goals on each shift</span>
            <span>Mark as Done</span>
          </div>
          {markDoneTable([
            '1. Serve our customers well - a Sub Above experience!',
            '2. Maintain a clean and clutter free store throughout your shift',
            '3. Run an efficient shift - ensure ACES in places during the RUSH and that your team uses their time well',
            '4. Complete all Checklists & review the team\u2019s work',
            '5. Turn over a clean & well prepared store to the next team',
          ])}
          <div style={{ fontSize: '5.8pt', color: '#2D2D2D', fontWeight: 700, fontStyle: 'italic', padding: '2px 6px', lineHeight: 1.3, marginBottom: '4px' }}>
            The way you reach these goals is going to be slightly different each day, depending on how the shift unfolds.
          </div>

          {sectionHeaderLight('Whiteboard - Positions, Breaks, Deep Cleaning')}
          {markDoneTable([
            'Determine each persons\u2019 position for the day based on their skill levels in each position, flow of the team, plans for the day and training',
            'Do NOT determine positions based on the crew members\u2019 personal preference. Sometimes this is possible, but everyone should work every position on a regular basis.',
            <><b>All breaks must be scheduled and the time written on the white board - every shift, no exceptions</b>. Crew members are responsible to remember their own break times, once you have written them.</>,
            '30 minute clock out breaks must begin by the 4th hour of work. If their start time is 10am, they must begin their break by 2pm. 10 minute break can be taken at anytime.',
            <><b>Break Times -</b> No breaks during lunch or dinner rush at any stores, anytime. 2-3 breaks should be scheduled between 10-11am and the remainder of breaks happen between 130-330pm. 10 minute break for shifts 4.5 hours and less, 30 minute clock out break for shifts 5 hours or more.</>,
            'Deep Cleans can be assigned on the board or chosen by each team member',
          ])}

          {sectionHeaderLight('Training List of Items')}
          {markDoneTable([
            '1. GM: fills out the white board with shift lead trainee - explain reasoning for placement of each crew member. ACES in PLACES. Fill in break times and deep cleans as well.',
            '2. SL in training: work Wrap, or Float position. Focus attention on the pace of the line and how well each crew member is keeping up with the rush.',
            '3. SL in training: Notice whether team members take their break on time or miss the time and require reminding. Discuss why it\u2019s important to take breaks on time.',
          ])}

          {sectionHeaderLight('Training Videos on LMS - HOMEWORK')}
          {markDoneTable([
            'clock into Flex, login to LMS site, click on Jersey Mike\u2019s Training twice',
            '\u2022 ensure all New Hire and all Team Member videos have been completed',
            '\u2022 watch: Shift Lead - Closing and Opening',
          ])}
          <div style={{
            fontSize: '6pt', fontWeight: 700, padding: '2px 6px',
            borderBottom: '1px solid #ccc', background: '#FAFAFA',
          }}>
            Video Completion Percentage after the above (73%)
          </div>
        </div>
        {footer()}
        {pageNumber(5)}
      </div>

      {/* ==================== PAGE 6 — TRAINING DAY TWO ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('TRAINING DAY TWO: 8AM OR 3PM START TIME')}

          <div style={{
            background: '#000', color: '#fff', fontSize: '6pt', fontWeight: 700,
            padding: '2px 6px', marginBottom: '2px',
          }}>
            POP QUIZ QUESTIONS BELOW!! COVER THROUGHOUT SHIFT.
          </div>

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Food Quality - discuss each item in detail at beginning of shift</span>
            <span>Mark as Done</span>
          </div>
          {markDoneTable([
            '1. Are there day dot stickers on all Prep items and Opener items?',
            '2. How many onion bins are left from yesterday? Should be half of a bin on the front line, no more.',
            '3. How does the roast beef look, is it red and juicy in the center and sitting bloody side up?',
            '4. Check philly steaks, are they defrosted enough for today\u2019s use and are there enough bins to get through the whole day?',
            '5. Is the bacon crisp, but not breaking?',
            '6. Is the lettuce green and bright and sliced to the proper thickness?',
            '7. How does the bread from today look? Not under or overproofed, baked to the right color, stays erect.',
          ])}

          {sectionHeaderLight('Training List of Items')}
          {markDoneTable([
            '1. GM: fills out the white board with shift lead trainee - ask trainee for input and decide on positions together. ACES in PLACES. Fill out break times and deep cleans.',
            '2. SL in training: work Wrap, or Float position. Focus attention on the pace of the line and how well each crew member is keeping up with the rush.',
            '3. SL in training: Notice whether team members take their break on time or miss the time and require reminding. Discuss why it\u2019s important to take breaks on time.',
            '4. SL in training: check on the teams\u2019 checklist work today - choose 1-2 lists to look over and check the team members\u2019 work. No need to give the team meber feedback, this is for your own knowledge and training.',
          ])}

          {sectionHeaderLight('Lead by example - review anytime during training shift')}
          {markDoneTable([
            'As the shift lead, you are the example to the rest of the team. You will set the tone for the team\u2019s attitude towards their work, each other, and customers.',
            'Never complain or verbalizing anything negative during the shift (not about crew OR customers). We do desire to hear your complaints or concerns, however they should be brought to our attention in a professional manner - one on one to your GM, or a phone call or email to store owners is appropriate.',
            'Show you\u2019re still a member of the team by continuing to WORK HARD and get your hands dirty. Do dishes, do deep cleans, take out the trash, clean the drains.',
            'Use the proper technique at every station, EVERY TIME! The crew is watching you. What\u2019s important to you, will be important to them.',
            'Role play a very angry customer with the shift lead. Teach how to diffuse the situation and to get them out of the store asap. Review at what point to ask them to leave the store. Ask your DM to help train this!',
          ])}

          {sectionHeaderGray('POP QUIZ QUESTIONS')}
          {markDoneTable([
            'How much bread is left for the day after the lunch rush?',
            'Is anything being delivered today? If so, who will put it away?',
          ])}
        </div>
        {footer()}
        {pageNumber(6)}
      </div>

      {/* ==================== PAGE 7 — TRAINING DAY THREE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('TRAINING DAY THREE: 8AM OR 3PM START TIME')}

          <div style={{
            background: '#000', color: '#fff', fontSize: '6pt', fontWeight: 700,
            padding: '2px 6px', marginBottom: '2px',
          }}>
            POP QUIZ QUESTIONS BELOW!! COVER THROUGHOUT SHIFT.
          </div>

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '4px', marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Maintain Jersey Mike&apos;s standards &amp; Always Be Training! - notice these throughout your shift today</span>
            <span>Mark as Done</span>
          </div>
          {markDoneTable([
            'Are customers receiving excellent service from EVERY crew member?',
            'Is the crew welcoming every customer that walks in, every time?',
            'Is the entire crew cleaning as they go, throughout the shift?',
            'Is the crew in complete uniform? Belt, hat (not worn backwards), clean shirt, clean apron?',
            'Notice whether crew members are using proper technique at their station. No need for correction, this is for training / practice learning to be mindful of this.',
          ])}

          {sectionHeaderLight('Training List of Items')}
          {markDoneTable([
            '1. SL in training: fills out the white board with shift lead trainee - ask trainee for input and decide on positions together. ACES in PLACES. Fill out break times and deep cleans.',
            '2. SL in training: look over all food quality with trainer and discuss. Bacon, bread, lettuce, beefs, amount of prep done, philly steak thaw, tuna has enough mayo, etc.',
            '3. SL in training: check on the teams\u2019 checklist work today - choose 1-2 lists to look over and check the team members\u2019 work. No need to give the team member feedback yet, this is for your own knowledge and training.',
            '4. SL in training: complete register / safe count & fill out closeout with trainer',
          ])}

          {sectionHeaderGray('POP QUIZ QUESTIONS')}
          {markDoneTable([
            'Was anyone in a bad mood?',
            'Who still has to go on break?',
            'Is everyone in the correct uniform?',
            'What is the back prep person doing right now in the back?',
            'When was the last lobby check?',
            'How much bread is left?',
            'If we decide to make bread now, what time will it be ready?',
          ])}

          <div style={{
            background: '#EE3227', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
            padding: '2px 6px', marginTop: '5px', marginBottom: '1px',
          }}>
            Role Playing Scenarios that require Correction- Discuss with DM how to train these
          </div>
          {markDoneTable([
            'Someone is talking/socializing too much with other crew members when they should be working',
            'Uniform is not correct',
          ])}

          {sectionHeaderLight('Training Videos on LMS - HOMEWORK')}
          {markDoneTable([
            'clock into Flex, login to LMS site, click on Jersey Mike\u2019s Training twice',
            '\u2022 watch: Shift Lead - Intro to Crunchtime',
            '\u2022 watch: Shift Lead - Ordering',
          ])}
          <div style={{
            fontSize: '6pt', fontWeight: 700, padding: '2px 6px',
            borderBottom: '1px solid #ccc', background: '#FAFAFA',
          }}>
            Video Completion Percentage (76%)
          </div>
        </div>
        {footer()}
        {pageNumber(7)}
      </div>

      {/* ==================== PAGE 8 — TRAINING DAY FOUR ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('TRAINING DAY FOUR')}

          <div style={{
            background: '#000', color: '#fff', fontSize: '6pt', fontWeight: 700,
            padding: '2px 6px', marginBottom: '2px',
          }}>
            POP QUIZ QUESTIONS BELOW!! COVER THROUGHOUT SHIFT.
          </div>

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '4px', marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Responsibilities during a shift - cover before the rush</span>
            <span>Mark as Done</span>
          </div>
          <div style={{ fontSize: '5.8pt', color: '#2D2D2D', padding: '2px 6px', borderBottom: '1px solid #e5e5e5', lineHeight: 1.3 }}>
            Have a vision for your shift. QUESTIONS to ask yourself:
          </div>
          {markDoneTable([
            '\u2022 who is working & what are their in/out times?',
            '\u2022 what extra prep may need to be done by the opener or the back prep shift for today or tomorrow\u2019s catering or large orders?',
            '\u2022 is today a holiday, and what might that mean for how busy we will be?',
            '\u2022 what\u2019s the weather like today, and how will that affect how busy we are? Hot = BUSY! Cold/rainy = slow',
            '\u2022 is anyone training today and if so, where will I place them, and who will be their assigned trainer? Do they need to be set up to watch videos?',
            <><b>\u2022 Labor Control</b>: discuss how it &quot;feels&quot; to be understaffed or overstaffed on a shift &amp; shift lead&apos;s ability to cut when needed</>,
            '\u2022 Deep cleans- double check crew\u2019s work and ensure the deep clean is done well',
          ])}

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '5px', marginBottom: '1px',
          }}>
            POS and CFT - most computer problems can be handled with a reset of the CFT and a reload of the POS. Try this right away if malfunction or freezing occurs.
          </div>
          {markDoneTable([
            'POS: computer ("point of sale")   CFT: credit card machine',
            'Orders: ensure all orders are being "selected" and "cleared" after lunch rush & at closing. A build up of orders will cause the system to glitch and freeze',
            'Trouble shooting: Hold clear and minus sign on CFT to reboot POS. This takes 2 full minutes. Reload POS once CFT has reloaded',
            'Call jersey mikes support right away if trouble shooting doesn\u2019t work (877) 589-5667. Number should be posted on POS at all times.',
          ])}

          {sectionHeaderLight('Training List of Items')}
          {markDoneTable([
            '1. SL in training: fills out the white board with shift lead trainee - ask trainee for input and decide on positions together. ACES in PLACES. Fill out break times and deep cleans.',
            '2. SL in training: review deep cleans completed by crew members, give praise and feedback',
            '3. SL in training: complete register / safe count & fill out closeout with trainer',
            '4. SL in training: print prodution report for 3pm - closing hours, to decide how much bread to bake for the rest of the shift. Teach how to use this method!',
          ])}

          {sectionHeaderGray('POP QUIZ QUESTIONS')}
          {markDoneTable([
            'Who still has to go on break?',
            'When was the last lobby check?',
            'What is being delivered today?',
            'How many philly steak back ups are in the walk in?',
            'How many bins of lettuce are left in the walk in?',
            'How did last night\u2019s closers / today\u2019s mid shift crew do in resetting the store for the next team?',
          ])}

          <div style={{
            background: '#EE3227', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
            padding: '2px 6px', marginTop: '5px', marginBottom: '1px',
          }}>
            Role Playing Scenarios that require Correction- Discuss with DM how to train these
          </div>
          {markDoneTable([
            'A large catering order comes in. How will you react and what will you do?',
            'Leaving meat case open/not executing details/chips not fifo\u2019d/not using tongs etc',
          ])}
        </div>
        {footer()}
        {pageNumber(8)}
      </div>

      {/* ==================== PAGE 9 — TRAINING DAY FIVE ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('TRAINING DAY FIVE')}

          <div style={{
            background: '#000', color: '#fff', fontSize: '6pt', fontWeight: 700,
            padding: '2px 6px', marginBottom: '2px',
          }}>
            POP QUIZ QUESTIONS BELOW!! COVER THROUGHOUT SHIFT.
          </div>

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '4px', marginBottom: '1px', display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Receiving Orders</span>
            <span>Mark as Done</span>
          </div>
          {markDoneTable([
            <>D&amp;D: double check produce and send back anything unsatisfactory. Eg: yellow or hard tomatoes, lettuce that is already browning, avocados if the whole box is ripe already. *Make sure the driver <b>takes old empty crates</b> with him, those are not to be stored in our back of house!</>,
            'Sysco: double check with driver that everything on the order is there, and check order paper against what you received as often as time allows. SEND back any containers that are already opened or seals broken',
            <>Pepsi: double check that all is there and see that order is put away as soon as possible. *Make sure the Pepsi driver <b>takes back old crates</b>, those are not to be stored in our back of house!</>,
            'Aramark: by the time they deliver, we should be down to our last 20 towels and last 10 aprons. If we have more than 20 towels or 10 aprons left at delivery, we are overpaying for our linens. Bring this to the attention of your GM! Also, make sure the Aramark driver leaves enough bags to collect the dirty towels we will have. Slow stores need 2 bags, busier stores need 4-5 bags to collect dirty towels.',
            <><b>*Offer to make your delivery driver a sub on us, and learn their name!</b> Happy drivers = deliveries at convenient times, and provision of what we need if stock is ever scarce</>,
          ])}

          <div style={{
            background: '#B8CCE0', fontSize: '6.5pt', fontWeight: 700, padding: '2px 6px',
            marginTop: '5px', marginBottom: '1px',
          }}>
            HR Policies/ Managing crew members
          </div>
          {markDoneTable([
            'Language - no cussing tolerated, bring to GM\u2019s attention and they will address',
            'Gossip: even small comments can brew large problems over time. Be aware of any crew member that shares information that is not theirs to share & bring to GM\u2019s attention always.',
            'Music in lobby AND back of house need to be appropirate, no cussing, no vulgar or offensive lyrics',
            'No touching other employees in any way at any time. If you witness another crew member touching someone, always bring to GM\u2019s attention right away.',
            'If small instances are not addressed, they lead to big instances. We need you to report any and all small instances!!',
          ])}

          {sectionHeaderLight('Training List of Items')}
          {markDoneTable([
            '1. SL in training: fills out the white board with shift lead trainee - ask trainee for input and decide on positions together. ACES in PLACES. Fill out break times and deep cleans.',
            '2. SL in training: look over all food quality with trainer and discuss. Bacon, bread, lettuce, beefs, amount of prep done, philly steak thaw, tuna has enough mayo, etc.',
            '3. SL in training: complete register / safe count & fill out closeout with trainer',
            '4. SL in training: print prodution report for 3pm - closing hours, to decide how much bread to bake for the rest of the shift. Teach how to use this method!',
          ])}

          {sectionHeaderGray('POP QUIZ QUESTIONS')}
          {markDoneTable([
            'How many bins of tomatoes & onions are in the walk in?',
            'What time will a crew member be back from break?',
            'How many catering boxes can you make in an hour?',
            'How do you feel we\u2019re doing on labor for today? Check and compare.',
            'Are there any promotions happening today?',
            'How much bread is left?',
            'Did anyone take an excessively long break today?',
          ])}

          <div style={{
            background: '#EE3227', color: '#fff', fontSize: '6.5pt', fontWeight: 700,
            padding: '2px 6px', marginTop: '5px', marginBottom: '1px',
          }}>
            Role Playing Scenarios that require Correction- Discuss with DM how to train these
          </div>
          {markDoneTable([
            'Crew member being on their phone too much',
            'Crew member not cleaning as they go',
          ])}
        </div>
        {footer()}
        {pageNumber(9)}
      </div>

      {/* ==================== PAGE 10 — GM DEBRIEF ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{
            background: '#D9D9D9', fontSize: '8pt', fontWeight: 700, padding: '4px 10px',
            marginTop: '10px', marginBottom: '6px',
          }}>
            GM DEBRIEF
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', fontWeight: 600, marginBottom: '3px' }}>
            What are two strengths the trainee possesses? Fill in Below.
          </div>
          <div style={{ borderBottom: '1px solid #ccc', height: '14px', marginBottom: '4px' }} />
          <div style={{ borderBottom: '1px solid #ccc', height: '14px', marginBottom: '10px' }} />

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', fontWeight: 600, marginBottom: '3px' }}>
            What are two areas of opportunity for the trainee to improve? Fill in Below.
          </div>
          <div style={{ borderBottom: '1px solid #ccc', height: '14px', marginBottom: '4px' }} />
          <div style={{ borderBottom: '1px solid #ccc', height: '14px', marginBottom: '10px' }} />

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', padding: '3px 0', borderBottom: '1px solid #e5e5e5', marginBottom: '2px' }}>
            Talk about a time when you had to give correction during training.
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', padding: '3px 0', borderBottom: '1px solid #e5e5e5', marginBottom: '2px' }}>
            Talk about a time when you gave praise during training.
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', fontWeight: 600, marginTop: '4px', marginBottom: '3px' }}>
            Are there any recurring food quality issues that you&apos;ve noticed during training? Fill in Below.
          </div>
          <div style={{ borderBottom: '1px solid #ccc', height: '14px', marginBottom: '4px' }} />
          <div style={{ borderBottom: '1px solid #ccc', height: '14px', marginBottom: '10px' }} />

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', padding: '3px 0', borderBottom: '1px solid #e5e5e5', marginBottom: '2px' }}>
            Have you had to handle any customer complaints?
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', padding: '3px 0', borderBottom: '1px solid #e5e5e5', marginBottom: '2px' }}>
            Have you had to handle any conflicts with the crew?
          </div>
        </div>
        {footer()}
        {pageNumber(10)}
      </div>
    </div>
  );
});

export default TrainingPacketShiftLead;
