'use client';

import { forwardRef } from 'react';
import DocumentTemplate from '../DocumentTemplate';

const Orientation = forwardRef(function Orientation({ data }, ref) {
  const { employeeName = '', startDate = '', storeNumber = '', storeName = '' } = data || {};

  const PAGE_W = 612;
  const PAGE_H = 792;

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
      background: '#EE3227',
      color: '#fff',
      fontSize: '12pt',
      fontWeight: 800,
      padding: '4px 16px',
      display: 'inline-block',
      fontFamily: "'Arial Black', 'Impact', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '6px',
      clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)',
      paddingRight: '28px',
    }}>
      {text}
    </div>
  );

  const sectionHeader = (text) => (
    <div style={{
      fontSize: '7pt', fontWeight: 700, textDecoration: 'underline',
      color: '#2D2D2D', marginTop: '6px', marginBottom: '2px',
    }}>
      {text}
    </div>
  );

  const checkItem = (text, opts = {}) => (
    <div style={{
      display: 'flex', gap: '3px', marginBottom: '1px',
      paddingLeft: opts.indent ? '12px' : 0,
    }}>
      <span style={{ color: '#134A7C', fontWeight: 700, minWidth: '14px', flexShrink: 0, fontSize: '8pt' }}>&#9744;</span>
      <span style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.35 }}>{text}</span>
    </div>
  );

  const bulletItem = (text) => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '1px', paddingLeft: '8px' }}>
      <span style={{ color: '#2D2D2D', fontSize: '6pt', lineHeight: 1.4 }}>&bull;</span>
      <span style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4 }}>{text}</span>
    </div>
  );

  const signLine = (label) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginTop: '6px' }}>
      <div style={{ borderBottom: '1px solid #134A7C', flex: 1, height: '14px' }} />
      <span style={{ fontSize: '6pt', color: '#6b7280', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );

  const pageNumber = (num, total) => (
    <div style={{
      position: 'absolute', bottom: '8px', right: '28px',
      fontSize: '6.5pt', color: '#6b7280',
    }}>
      Page {num} of {total}
    </div>
  );

  const footer = () => (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
    }}>
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

  const TOTAL_PAGES = 5;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* ==================== PAGE 1 ==================== */}
      <div data-pdf-page style={pageStyle}>
        <DocumentTemplate
          title="ORIENTATION PACKET"
          subtitle="Day 1 \u2014 Policies & Procedures"
          storeNumber={storeNumber}
          storeName={storeName}
        >
          <div style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '6.5pt', color: '#6b7280', fontWeight: 500 }}>Employee Name</span>
              <div style={{ borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt', fontWeight: 600, color: '#2D2D2D', minHeight: '14px' }}>
                {employeeName}
              </div>
            </div>
            <div style={{ width: '130px' }}>
              <span style={{ fontSize: '6.5pt', color: '#6b7280', fontWeight: 500 }}>Start Date</span>
              <div style={{ borderBottom: '1px solid #134A7C', padding: '1px 0', fontSize: '8pt', fontWeight: 600, color: '#2D2D2D', minHeight: '14px' }}>
                {startDate}
              </div>
            </div>
          </div>

          {dayBanner('DAY 1 \u2014 ORIENTATION')}

          <div style={{ fontSize: '6.5pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '3px' }}>
            Before beginning orientation, must complete the following:
          </div>
          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.4, paddingLeft: '8px', marginBottom: '4px' }}>
            {bulletItem(<><b>Send new hire contact info (first & last name, email, phone number and whether they are a minor) to brittany@jmvalley.com at least 72 hours prior to orientation</b></>)}
            {bulletItem(<><b>Confirm with Brittany that all onboarding documents have been completed and submitted by new hire</b></>)}
            {bulletItem(<><b>Receive work permit from new hire if they are a minor</b></>)}
          </div>

          <div style={{ fontSize: '7pt', fontWeight: 700, color: '#2D2D2D', marginBottom: '3px' }}>
            Greet, Welcome, Give uniform
          </div>

          {checkItem(<><b>History of Jersey Mikes \u2013 Importance of the \u201cexperience\u201d of each customer</b></>)}
          {checkItem('Review of training packet / training program / shift notes / level certifications. Thoroughly discuss how our training program works.')}
          {checkItem('Uniform requirements. CLEAN UNIFORM, every shift. White undershirt only. Shirt tucked, hair behind visor, apron clean, black work shoes, all nose piercings must be removed when in uniform, gauges must be clear or nude, beard must be trimmed to 1/4 inch, neck shaved clean for each shift.')}
          {checkItem('Scheduling Preferences: awarded for work ethic, attitude, reliability, sense of urgency. Hours are given based on performance, schedules are never guaranteed.')}

          {sectionHeader('Daily Procedures')}
          {checkItem('Treat all of the equipment in the store with CARE. It is very expensive.')}
          {checkItem('Clock in for each shift (no earlier than 5 minutes before shift). Must be in full uniform and ready to work, BEFORE clocking in (hat, apron on, shirt tucked in, items put away in locker).')}
          {checkItem('Punctuality is extremely important. We schedule based on hourly sales.')}
          {checkItem('Out time is always give or take 30 minutes. Checklist must be completed and must be ok\'d by shift lead before leaving.')}
          {checkItem(<>Homebase - schedule is published every Friday and is available to view on the store iPad. Homebase is also used for TEAM COMMUNICATION - messages from Management or Shift Leads should be read after you clock in for your shift. <b>15 mins will also be automatically added</b> to your check each payroll for time you may spend reading messages at home. Use of Homebase when off the clock is not required.</>)}
          {checkItem('Pay periods: every other Friday, direct deposit is available, sign up on ADP.')}
        </DocumentTemplate>
        {pageNumber(1, TOTAL_PAGES)}
      </div>

      {/* ==================== PAGE 2 ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 1 \u2014 ORIENTATION')}

          {checkItem('Overtime \u2013 not permitted without specific authorization.')}
          {checkItem('Break and meal periods \u2013 10 min break for 4.5 hour shift or less, 30 minute CLOCK OUT meal period for a 5 hour shift or longer. We follow CA labor laws for all breaks, please take your breaks as scheduled.')}
          {checkItem('Free Mini per shift, we will make it for you. If you prefer to make it yourself, clock out prior to making. Write your mini sandwich in on your checklist each day.')}
          {checkItem(<>Anything more than your free mini, chips and fountain soda is 50% off. Bottle drinks are 50% not free. Your discount applies to you only. Friends / family receive 20% off with RO approval.</>)}
          {checkItem(<>Use of phone while on shift not permitted - <b>phones must be left in your locker</b></>)}
          {checkItem('Stay in work station at all times, alert shift lead if need to get water, use restroom, etc.')}
          {checkItem('Location of hand sinks \u2013 procedure of and importance of washing hands / changing gloves.')}

          {sectionHeader('Guest Service')}
          {checkItem('KIND TONES!! We must practice approachability and warmth with the way we speak to our guests.')}
          {checkItem("We expect a smile, positive attitude, willingness to work hard, be a great team member to fellow employees, and make each guest's day better! It's the Jersey Mike's way.")}
          {checkItem(<>MESS UPS! They happen! Don&apos;t beat yourself up for it. Must learn from it. <u>Steps</u>: First, show empathy. &quot;So sorry we messed that up or forgot that item. Let me get my manager or supervisor for you.&quot; <b>Only SHIFT LEADS are permitted to handle order mistakes.</b></>)}
          {checkItem('Include guests in your conversations! Make sure to always banter!')}
          {checkItem(<>Offer FREE COOKIES TO KIDS. <b>Ask parents first!</b></>)}

          {sectionHeader('Store Policies')}
          {checkItem(<><b><u>Accident reporting procedure</u></b> \u2013 You will cut or burn yourself on the job. Please use care, ALWAYS when using knives or removing items from the oven. Most cuts or burns can be treated with our first aid kit. Always immediately report any injury to your <b><u>Restaurant Operator</u></b>.</>)}
          {checkItem('Absenteeism, Illness, Emergencies \u2013 CALL OUTS ARE NOT PERMITTED. We expect you to show up for all scheduled shifts. If you desire to be scheduled less hours, let your GM know!')}
          {checkItem('For emergencies, all employees must call the RO at least 3 hours before your scheduled shift.')}
          {checkItem('If you cannot make it to your shift, you must find someone to work it.')}
          {checkItem('If you have a valid reason for inability to attend a shift it must be communicated a MINIMUM of 3 hours prior to your shift start time.')}
        </div>
        {footer()}
        {pageNumber(2, TOTAL_PAGES)}
      </div>

      {/* ==================== PAGE 3 ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 1 \u2014 ORIENTATION')}

          {checkItem(<>If there&apos;s an emergency you must <b>CALL, NOT TEXT</b> the RO. If you cannot get a hold of the RO, you must call the store and speak with the shift lead. Do NOT EVER COMMUNICATE INABILITY TO COME IN FOR A SHIFT with a TEXT.</>)}
          {checkItem('If you are going to be late (even 2 minutes), you must CALL THE STORE.')}
          {checkItem('If you "no show" or "no call" to a shift OR walk out during a shift, this is considered automatic resignation.')}
          {checkItem(<><b>We use a 3 strike policy to address deficient behavior.</b> Failure to properly notify management team of tardiness, OR failure to abide by proper uniform guidelines will result in 1 strike. 1 strike = documenting. 2 strikes = suspension. 3 strikes = termination.</>)}
          {checkItem(<>Requesting time off procedure: all requests due <b>7 days</b> before the week of request begins. More than 3 days in a row off requires 3 weeks notice. <b>10 days</b> per year of time off.</>)}
          {checkItem('In case of fire, get out, call 911.')}
          {checkItem('Apron must be removed when you leave back area: restroom, lobby check, trash run, etc.')}
          {checkItem('Always remove gloves before touching a rag or any cleaning products.')}
          {checkItem('Break boxes down immediately - put in box trash can.')}
          {checkItem('No access behind the line when not in uniform.')}
          {checkItem('Parking requirements \u2013 not in front of the store, park off premises if small lot.')}
          {checkItem(<>Review our shoes &amp; shirt program. At your 30 day mark, ask for another work shirt. At 90 days, you&apos;re eligible for 1 new pair non-slip work shoes per year, $50 reimbursement. Also once a year we will reimburse up to $50 for a new pair of work pants.</>)}
          {checkItem(<>Review friend referral program. If you refer a friend to work here, once they hit their 90 day mark, you get a <b>$150 cash</b> bonus.</>)}

          {sectionHeader('Training Policy in Regards to Pay / Growth Opportunities')}
          {checkItem('Completion of Training at Level 3 Certification will result in being added to the store tip pool. 6 week training program - extended at times to allow for mastery.')}
          {checkItem('We have a ton of opportunities for growth! Trainers, Shift Leads, Lead Trainer, ARO and RO. Communicate your desire for growth with your RO.')}

          {signLine('\u2190 Trainee Sign / Date')}
        </div>
        {footer()}
        {pageNumber(3, TOTAL_PAGES)}
      </div>

      {/* ==================== PAGE 4 — BE A GOOD TEAM PLAYER ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          <div style={{
            textAlign: 'center', fontSize: '18pt', fontWeight: 800,
            color: '#134A7C', marginTop: '8px', marginBottom: '8px',
            letterSpacing: '0.5px',
          }}>
            BE A GOOD TEAM PLAYER!
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
            When you arrive and clock in, your body is here, which is great!! Your mind must also be here, and turned ON, ready to learn and pay attention to what is happening around you.
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
            It takes a team of well trained, like minded people, with positive and helpful attitudes, to keep our shifts running smoothly and fun!! We will show you how to be a contributing, strong member of our team!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '4px' }}>
            Being a good team player may mean&hellip;
          </div>
          {bulletItem('Staying until the job is done, which may be later than your out time')}
          {bulletItem('Doing someone else\'s checklist when needed, or helping with part of it')}
          {bulletItem('Helping to put away Sysco, even if you have not been asked to')}
          {bulletItem('Coming in early, when we get a large order we need to complete')}
          {bulletItem('If you see something about to run out, or running low, stock it')}
          {bulletItem('If you see something that\'s spilled, wipe it up')}
          {bulletItem('If you use the bathroom, and you notice there\'s no toilet paper in there, stock it!')}
          {bulletItem('Refill the water bottle and corn meal shaker if it\'s running low.')}
          {bulletItem('Refill the spray bottles of cleaning solution!')}

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginTop: '8px', marginBottom: '6px' }}>
            <b>When you notice something that needs to be done, if you have time, YOU do it.</b> When the rush ends, grab a drink, take a minute to breathe, and then get the store put back together and ready for the next rush. It&apos;s coming!
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '6px' }}>
            It&apos;s in our hands, how stressful a shift has to be. If we think ahead, a shift can be challenging but smooth. If we don&apos;t think ahead, a rush will not be smooth, we will barely get through it. It&apos;s <i>everyone&apos;s</i> job to think ahead and look at what is happening all around you.
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5, marginBottom: '8px' }}>
            Once you start showing these habits, that&apos;s how we know you are an ACE. Trainees stick to their checklists. Aces (promotions, raises, bonus eligible positions) all come from teamwork and thinking ahead.
          </div>

          {signLine('\u2190 Trainee Sign / Date')}
        </div>
        {footer()}
        {pageNumber(4, TOTAL_PAGES)}
      </div>

      {/* ==================== PAGE 5 — CORE VALUES + LMS VIDEOS ==================== */}
      <div data-pdf-page style={pageStyle}>
        {miniHeader()}
        <div style={{ padding: '0 28px', flex: 1 }}>
          {dayBanner('DAY 1 \u2014 ORIENTATION')}

          <div style={{
            textAlign: 'center', fontSize: '14pt', fontWeight: 800,
            color: '#134A7C', marginTop: '4px', marginBottom: '6px',
          }}>
            JM Valley Group CORE VALUES
          </div>

          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '4px' }}>
              <b>Why do we exist?</b><br />
              We exist to positively impact others through individual and company growth.
            </div>
            <div style={{ marginBottom: '4px' }}>
              <b>What do we do?</b><br />
              We build the world&apos;s best sub sandwiches, while providing the &quot;Jersey Mike&apos;s Experience.&quot;
            </div>
            <div style={{ marginBottom: '4px' }}>
              <b>How do we behave?</b><br />
              We show our character by demonstrating our CORE VALUES through the behaviors below:
            </div>
          </div>

          <div style={{ fontSize: '6.2pt', color: '#2D2D2D', lineHeight: 1.45, paddingLeft: '8px' }}>
            <div style={{ marginBottom: '3px' }}>
              <b>Desire for Growth:</b> Be Coach-able, Lead by Example, Take Initiative when things need to be done
              <div style={{ paddingLeft: '10px', fontStyle: 'italic', fontSize: '6pt' }}>
                Saying &quot;thank you&quot; when someone takes the time to correct you or show you something new is a great example of being coachable.
              </div>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <b>Integrity:</b> Be Honest, Reliable, and Respectful
              <div style={{ paddingLeft: '10px', fontStyle: 'italic', fontSize: '6pt' }}>
                Showing up ON TIME is showing integrity because you are showing your team that you do what you say you&apos;ll do and people can rely on you. When you show up late, you lack integrity and your team will lose trust in you.
              </div>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <b>Golden Sub Rule:</b> Have a Good Attitude, Follow Directions, Servant Leadership
            </div>
            <div style={{ marginBottom: '3px' }}>
              <b>Team Player:</b> Put others First, Strive for Excellence, Be Flexible
              <div style={{ paddingLeft: '10px', fontStyle: 'italic', fontSize: '6pt' }}>
                Helping another crew member complete their checklist or offering to do extra dishes is an example of being a team player. Our focus is always the success of the TEAM, not just ONE person.
              </div>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <b>Positivity:</b> Be Grateful, Energetic, Show Tolerance for fellow crew members and customers
              <div style={{ paddingLeft: '10px', fontStyle: 'italic', fontSize: '6pt' }}>
                It only takes one drop of ink to muddle up a clear glass of water. Remember that we all make an impact, what kind of impact do you want to make?
              </div>
            </div>
            <div style={{ marginBottom: '3px' }}>
              How do we achieve <b>Operational Excellence?</b> By giving our customers&apos; a positive experience in our store, putting care into the product we serve, and showing speed when we serve it.
            </div>
          </div>

          {signLine('\u2190 Trainee Sign / Date')}

          <div style={{
            background: '#134A7C', color: '#fff', fontSize: '8pt', fontWeight: 700,
            padding: '3px 10px', borderRadius: '3px', marginTop: '10px', marginBottom: '4px',
            letterSpacing: '0.5px',
          }}>
            ORIENTATION TRAINING VIDEOS on LMS
          </div>
          <div style={{ fontSize: '6.5pt', color: '#2D2D2D', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div>
                <u>New Hire: Welcome to Jersey Mikes</u> -<br />
                &nbsp;&nbsp;&nbsp;&nbsp;All Videos (10 min) &nbsp;&nbsp;<span style={{ display: 'inline-block', width: '12px', height: '12px', border: '1px solid #2D2D2D', verticalAlign: 'middle' }}></span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <div>
                <u>New Hire: Intro to Food Safety</u> -<br />
                &nbsp;&nbsp;&nbsp;&nbsp;All Videos (12 min) &nbsp;&nbsp;<span style={{ display: 'inline-block', width: '12px', height: '12px', border: '1px solid #2D2D2D', verticalAlign: 'middle' }}></span>
              </div>
            </div>
          </div>
        </div>
        {footer()}
        {pageNumber(5, TOTAL_PAGES)}
      </div>
    </div>
  );
});

export default Orientation;
