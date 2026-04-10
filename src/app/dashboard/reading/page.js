'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import styles from '../page.module.css';

const RECOMMENDED_ORDER = [
  'atomic-habits',
  'no-excuses',
  'eat-that-frog',
  'first-time-manager',
  'the-one-truth',
  'leaders-eat-last',
  'multi-unit-leadership',
  '21-laws-of-leadership',
  '5-levels-of-leadership',
  'radical-candor',
  'high-performance-habits',
  'unreasonable-hospitality',
  'traction',
  'e-myth-revisited',
  'million-dollar-habits',
];

const BOOKS = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    readCount: 2,
    aboutAuthor: 'James Clear is a writer, speaker, and world-renowned expert on habit formation. His work has appeared in the New York Times, Time, and the Wall Street Journal. He is the creator of the Habits Academy, the leading online training platform for organizations and individuals seeking to build better habits. His website jamesclear.com receives millions of visitors each month, and hundreds of thousands subscribe to his email newsletter.',
    importance: 'This book is the cornerstone of personal and professional development at JM Valley. The 1% daily improvement philosophy directly applies to store operations — from food quality consistency to labor efficiency. Every small habit compounds. When your entire team adopts this mindset, a store transforms from reactive to proactive. Read twice because the second reading reveals patterns you missed the first time.',
    keyExcerpts: [
      { chapter: 'The Fundamentals', excerpt: 'You do not rise to the level of your goals. You fall to the level of your systems. Goals are about the results you want to achieve. Systems are about the processes that lead to those results.' },
      { chapter: 'The 1st Law: Make It Obvious', excerpt: 'The process of behavior change always starts with awareness. You need to be aware of your habits before you can change them. Pointing-and-Calling raises your level of awareness from a nonconscious habit to a more conscious level.' },
      { chapter: 'The 2nd Law: Make It Attractive', excerpt: 'The culture we live in determines which behaviors are attractive to us. We tend to adopt habits that are praised and approved of by our culture because we have a strong desire to fit in and belong.' },
      { chapter: 'The 3rd Law: Make It Easy', excerpt: 'The most effective way to learn is practice, not planning. Focus on taking action, not being in motion. Habit formation is the process by which a behavior becomes progressively more automatic through repetition.' },
      { chapter: 'The 4th Law: Make It Satisfying', excerpt: 'We are more likely to repeat a behavior when the experience is satisfying. The human brain evolved to prioritize immediate rewards over delayed rewards. The Cardinal Rule of Behavior Change: What is immediately rewarded is repeated.' },
      { chapter: 'Identity-Based Habits', excerpt: 'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become. Every action you take is a vote for the type of person you wish to become.' },
      { chapter: 'The Plateau of Latent Potential', excerpt: 'People make a few small changes, fail to see a tangible result, and decide to stop. But habits often appear to make no difference until you cross a critical threshold — the Plateau of Latent Potential.' },
      { chapter: 'Habit Stacking', excerpt: 'One of the best ways to build a new habit is to identify a current habit you already do each day and then stack your new behavior on top. This is called habit stacking: After I [CURRENT HABIT], I will [NEW HABIT].' },
      { chapter: 'Environment Design', excerpt: 'Environment is the invisible hand that shapes human behavior. People often choose products not because of what they are, but because of where they are. If you want to make a habit a big part of your life, make the cue a big part of your environment.' },
      { chapter: 'The Two-Minute Rule', excerpt: 'When you start a new habit, it should take less than two minutes to do. A habit must be established before it can be improved. You have to standardize before you can optimize.' },
      { chapter: 'Temptation Bundling', excerpt: 'Temptation bundling works by linking an action you want to do with an action you need to do. You are more likely to find a behavior attractive if you get to do one of your favorite things at the same time.' },
      { chapter: 'The Goldilocks Rule', excerpt: 'The greatest threat to success is not failure but boredom. We get bored with habits because they stop delighting us. The Goldilocks Rule states that humans experience peak motivation when working on tasks that are right on the edge of their current abilities.' },
      { chapter: 'Never Miss Twice', excerpt: 'The first mistake is never the one that ruins you. It is the spiral of repeated mistakes that follows. Missing once is an accident. Missing twice is the start of a new habit.' },
      { chapter: 'Habit Tracking', excerpt: 'Habit tracking is powerful on multiple levels. It creates a visual cue that can remind you to act, it is inherently motivating because you see the progress you are making, and it feels satisfying to record your success in the moment.' },
    ],
    discussionQuestions: [
      'What is one habit you currently have at your store that compounds positively? What about negatively?',
      'James Clear says "You do not rise to the level of your goals — you fall to the level of your systems." What systems at your store need improvement?',
      'Which of the four laws (Obvious, Attractive, Easy, Satisfying) is the hardest to apply with your team?',
      'How could you use habit stacking to improve your opening or closing procedures?',
      'Clear talks about identity-based habits. Instead of "I want to run a better store," the shift is "I am the type of operator who..." — finish that sentence.',
      'What is one 1% improvement you could make this week that would compound over time?',
      'How have you designed your store environment to make good habits obvious and bad habits invisible?',
      'What bad habit at your store has been normalized? What would it take to break that cycle?',
      'Think about your best shift lead. What identity-based belief drives their behavior on shift?',
      'The two-minute rule says to make habits small enough to start immediately. What habit have you been delaying because it feels too big?',
      'Clear says "never miss twice." Have you seen this principle play out with a team member\'s attendance or performance?',
      'What does your habit scorecard look like for the store opening routine?',
      'How do you make desired behaviors at your store "satisfying" for your team?',
    ],
    howToApply: [
      'Post a "Habit Scorecard" in the back office — list 5 daily habits (9:59 ready, bread count by 10 AM, FIFO check, etc.) and check them off each day.',
      'Use habit stacking for your team: "After clocking in, the first thing you do is check the prep list" — make it the default, not a choice.',
      'Make good habits obvious: put the closing checklist on the counter at 8 PM, not hidden in a binder.',
      'Celebrate small wins publicly — when someone hits their bread count 5 days in a row, call it out at the next team meeting.',
      'Remove friction from desired behaviors: pre-stage cleaning supplies so the closing crew doesn\'t have to hunt for them.',
      'Implement the two-minute rule for your worst recurring problem — if the fix takes less than two minutes, do it right now instead of logging it.',
      'Create a visual habit tracker on the manager board — food cost, labor %, on-time opens. Make progress visible.',
      'Use temptation bundling: pair a task people dislike (end-of-day inventory) with something they enjoy (playing their favorite music while doing it).',
      'Establish "never miss twice" as a team standard — one bad prep day is an accident, two in a row requires a conversation.',
      'Design the store environment so the right behavior is the default: knife block always at the station, gloves always at the register, clipboard always on the hook.',
      'Apply the Goldilocks Rule when assigning tasks — stretch your best performers just beyond their comfort zone so they stay engaged, not overwhelmed.',
    ],
    keyTakeaways: [
      'Small 1% improvements compound to massive results over time — the math of habit is exponential, not linear.',
      'You fall to the level of your systems, not your goals — build better systems and results follow automatically.',
      'Identity shapes behavior: before changing what you do, change who you believe you are.',
      'The four laws of behavior change — make it obvious, attractive, easy, and satisfying — work for building any habit.',
      'Environment design is more powerful than willpower — arrange your space so good habits are the path of least resistance.',
      'Never miss twice: one slip is an accident, two in a row is the beginning of a new (bad) habit.',
      'Habit tracking creates visual evidence of progress and fuels motivation to continue.',
      'The Plateau of Latent Potential explains why results seem slow at first — trust the system even when you can\'t see the results yet.',
    ],
    storeScenarios: [
      'Your line crew keeps skipping the daily bread count because there\'s no system prompting it. You laminate a habit card that reads "After unlocking the door, count bread before touching anything else." Within two weeks it\'s automatic — the habit is stacked onto opening, not left to memory. The bread runs stop.',
      'You want your team to stop leaving the prep station messy between rushes. Instead of posting a sign, you redesign the station so the bus tub is right at arm\'s reach (make it easy) and add a whiteboard where the crew draws a checkmark after each cleanup (make it satisfying). Cleanliness becomes the default state within a month.',
      'A new shift lead is struggling to run pre-shift lineups. You apply the two-minute rule: instead of a full 10-minute briefing he\'s intimidated by, you ask him to start with just one topic — 60 seconds, one thing the crew needs to know. After two weeks he\'s running five-minute lineups with confidence. The habit grew from something small enough to actually start.',
    ],
    chapterDeepDive: [
      { chapter: 'The Surprising Power of Atomic Habits', summary: 'Clear introduces the core premise: 1% better every day results in 37x improvement in a year. For store operators, this reframes every small decision — whether you check the prep list or skip it, whether you give feedback or stay quiet. The chapter demolishes the idea that dramatic changes require dramatic actions, arguing instead that tiny consistent improvements are the most reliable path to lasting results. It also introduces the concept of systems vs. goals: winners and losers often share the same goals, but differ in their systems.' },
      { chapter: 'How Your Habits Shape Your Identity', summary: 'This chapter introduces the most important idea in the book: habits are votes for the type of person you want to become. Every time you complete a checklist, you vote for "I am a disciplined operator." Every time you skip it, you vote against that identity. Clear argues that the most effective long-term behavior change happens at the identity level, not the outcome level. For JM Valley managers, this means the question isn\'t "how do I get my team to follow procedures?" but "how do I help my team see themselves as professionals who take pride in precision?"' },
      { chapter: 'The Man Who Didn\'t Look Right (Make It Obvious)', summary: 'Using a story about British cycling, Clear explains how environment design — the arrangement of cues in your physical space — can make good habits automatic without requiring willpower. The application to store operations is immediate: if you want the closing checklist completed every night, it needs to be visible and unavoidable at closing time, not buried in a binder. Cue design is store design. The best-run stores in JM Valley have physically arranged their back-of-house so the right behavior is the default behavior.' },
      { chapter: 'The Secret to Self-Control (Make It Difficult)', summary: 'Clear presents a counterintuitive truth: the people with the best self-control rarely have to use it. Instead, they\'ve structured their environment to avoid temptation entirely. For store managers, this applies to everything from phone usage policies (make phones invisible during peak hours) to food safety (make the unsafe shortcut physically harder than the correct procedure). Self-control is a short-term strategy; environment design is a long-term one.' },
      { chapter: 'The Role of Family and Friends (Make It Attractive)', summary: 'One of the most powerful lessons in this chapter for managers: we adopt the habits of the groups we belong to. This is why store culture is so powerful. If your best performers visibly celebrate cleaning up after each other, checking temperatures, and running precise lineups, new hires adopt those habits naturally. Culture is the most scalable habit system you have. The chapter challenges operators to ask: what does "normal" look like at your store, and is it the normal you want?' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Atomic-Habits-Audiobook/1524779261',
    amazonUrl: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
  },
  {
    id: 'high-performance-habits',
    title: 'High Performance Habits',
    author: 'Brendon Burchard',
    readCount: 1,
    aboutAuthor: 'Brendon Burchard is the world\'s leading high performance coach and one of the most-watched, quoted, and followed personal development trainers in history. A #1 New York Times bestselling author, his books include The Motivation Manifesto, The Charge, and Life\'s Golden Ticket. He has been named one of the Top 100 Most Followed Public Figures on Facebook.',
    importance: 'High performance isn\'t about working harder — it\'s about working with greater clarity, energy, necessity, productivity, influence, and courage. As a store operator, you\'re managing dozens of people, hundreds of daily decisions, and thousands of customer interactions. This book gives you the six habits that separate the top performers in any field from everyone else. Apply these to your store and watch the difference in team output.',
    keyExcerpts: [
      { chapter: 'Seek Clarity', excerpt: 'High performers are clear on who they want to be, how they want to interact with others, what they want, and what will bring them the greatest meaning.' },
      { chapter: 'Generate Energy', excerpt: 'High performers have mastered the art of generating energy when they need it. They don\'t just manage their time — they manage their transitions, emotional states, and physical wellbeing.' },
      { chapter: 'Raise Necessity', excerpt: 'When you feel that what you\'re doing truly matters, you perform at a higher level. High performers associate a deeper level of meaning and urgency with their daily activities.' },
      { chapter: 'Increase Productivity', excerpt: 'The secret to productivity isn\'t about being busy. It\'s about identifying the outputs that matter and focusing obsessively on producing quality work in those areas.' },
      { chapter: 'Develop Influence', excerpt: 'High performers shape how others think about themselves and their abilities. They challenge people to grow and give them confidence.' },
      { chapter: 'Demonstrate Courage', excerpt: 'High performers take action despite fear and uncertainty. They share their ideas, stand up for others, and do the right thing even when it\'s hard.' },
      { chapter: 'The Difference', excerpt: 'The six habits — clarity, energy, necessity, productivity, influence, courage — are deliberate habits. High performers don\'t just stumble into greatness. They practice these daily.' },
      { chapter: 'Prolific Quality Output', excerpt: 'High performers focus on PQO — prolific quality output. They know their primary field of interest and obsessively create high-quality work in that area. Busyness is not a badge of honor. Output quality is.' },
      { chapter: 'Progressive Mastery', excerpt: 'Don\'t just develop competence — develop mastery through progressive challenge. Seek situations that stretch you, then reflect on what you learned, then apply it at the next level. Mastery is a spiral, not a ladder.' },
      { chapter: 'Clearing the Fog', excerpt: 'Extraordinary results require extraordinary clarity. Most people live in a fog of competing demands. High performers step back, get clear on what matters most, then act with purpose. Clarity precedes mastery.' },
      { chapter: 'The Power of Transitions', excerpt: 'One key to generating sustained energy is learning to transition between activities intentionally. Between the lunch rush and the afternoon lull, between one conversation and the next — what you do in the gap determines your next performance.' },
      { chapter: 'Teaching Others', excerpt: 'One of the most powerful ways to develop influence is to teach what you know. When you deliberately seek to educate, challenge, and serve your team, they grow — and so does your leadership.' },
      { chapter: 'Increasing Courage', excerpt: 'Courage is not the absence of fear. It\'s speaking up despite the fear, making the hard call despite the uncertainty, confronting the underperformer despite the discomfort. High performers train themselves to act before the fear fully sets in.' },
      { chapter: 'How They Think About the Future', excerpt: 'High performers imagine an inspiring future and work backward. They visualize not just the outcome but the specific behaviors that will produce it. Then they show up each day and execute those behaviors as if the future has already been decided.' },
    ],
    discussionQuestions: [
      'Which of the six habits (clarity, energy, necessity, productivity, influence, courage) is your strongest? Your weakest?',
      'How do you manage your energy during a 10-hour shift? What drains you and what recharges you?',
      'Burchard says "raise necessity" — what makes your role feel truly necessary beyond just a paycheck?',
      'How do you currently influence your team? What could you do to challenge them to grow more?',
      'What is one courageous conversation you\'ve been avoiding with a team member?',
      'Burchard separates "busyness" from "prolific quality output." Which one best describes a typical day for you?',
      'What does clarity look like for you in your role? Can you clearly articulate your top 3 priorities this week without looking at notes?',
      'How do you handle your energy transitions during the shift — from rush to slow, from one conversation to the next?',
      'Who on your team would benefit most from you developing your influence with them?',
      'Think of a recent moment when you lacked courage as a leader. What should you have done differently?',
      'Burchard asks: what is your PQO — your primary output that defines success in your role? What is yours?',
      'If you adopted progressive mastery in your role, what skill would you start developing more deliberately right now?',
    ],
    howToApply: [
      'Start each shift by writing down your top 3 priorities for the day — this is "seeking clarity" in action.',
      'Take a 2-minute energy reset between lunch rush and mid-afternoon — step outside, breathe, reset your intention.',
      'Before your next store visit (DMs) or shift start (ROs), ask yourself: "What does this team need from me right now?" — that\'s necessity.',
      'Identify one team member per week to specifically develop — give them a stretch assignment and coach them through it.',
      'Define your PQO as a manager: yours might be "a well-trained crew that runs the store correctly without me present." Make decisions that point toward that output.',
      'Build intentional transitions into your shift: before the lunch rush, do a 60-second mental reset. After the rush, do a 60-second debrief with your lead before moving on.',
      'Practice one courageous act per week: give the feedback you\'ve been avoiding, make the staffing decision you\'ve been delaying, have the honest conversation.',
      'Ask your team monthly: "What would make me a better leader for you?" — this develops your influence and models the courage to receive feedback.',
      'Set a quarterly "mastery goal" for yourself — one skill you will systematically improve. Track it in your planner.',
      'When you feel your energy flagging mid-shift, use the phrase "release, reset, recharge" — release the last thing, reset your posture and mindset, recharge with a focused 30-second intention.',
    ],
    keyTakeaways: [
      'High performance is built on six deliberate habits: clarity, energy, necessity, productivity, influence, and courage.',
      'Clarity precedes mastery — you cannot perform at your best without knowing exactly what you\'re trying to produce.',
      'Energy management (including transitions between activities) matters as much as time management.',
      'Raising necessity — connecting your daily work to deeper meaning — unlocks a level of motivation that external pressure alone cannot.',
      'Influence is developed deliberately by teaching, challenging, and serving those around you.',
      'Prolific quality output is the real measure of a high performer — not how busy you look, but what you actually produce.',
      'Courage is trained, not inherited — and it starts with taking small uncomfortable actions consistently.',
    ],
    storeScenarios: [
      'Your store has a strong lunch crew but the afternoon team underperforms on prep, leaving the evening rush shorthanded. You apply "seek clarity" — instead of a general pep talk, you write out three specific non-negotiable outputs for the afternoon crew (prep list 100% by 3 PM, lobby clean every 30 min, freezer temp logged) and post them on the manager board. Within a week, the vague underperformance has a name — and a solution.',
      'You\'re heading into a difficult conversation with a crew member about chronic tardiness. You feel yourself wanting to soften the message to avoid conflict. This is exactly the moment Burchard\'s "demonstrate courage" habit applies. You take a breath, walk in, and deliver the message with directness and care: "I need you here on time. Here\'s why it matters to the team." The conversation is uncomfortable for three minutes. The crew member\'s behavior improves.',
      'During the holiday rush, you notice your energy collapsing around 2 PM every day — and your team reads it. You implement "generate energy" with a physical reset: after the lunch rush, you step outside for 90 seconds, breathe, and mentally close the rush before opening the afternoon. The team notices the shift. Your afternoon demeanor changes, and the 2 PM energy crash becomes a 2 PM energy reset.',
    ],
    chapterDeepDive: [
      { chapter: 'Seek Clarity', summary: 'Burchard opens the book\'s habits section by arguing that most people live in ambiguity — they know roughly what their job is, but not precisely what they\'re optimizing for or what kind of leader they want to be. Seeking clarity means defining your self-image (who you are), your social commitments (how you treat others), your ambitions (what you want to build), and your meaning (why any of it matters). For JM Valley managers, this chapter is a call to articulate your specific leadership vision for your store — not "I want to run a good store" but something concrete enough to make daily decisions against.' },
      { chapter: 'Generate Energy', summary: 'This chapter reframes energy as something you generate, not merely preserve. Burchard identifies three dimensions of energy management: physical (exercise, sleep, nutrition), psychological (managing transitions and mental states), and emotional (cultivating positivity and releasing negativity between interactions). The operational insight for store managers is the transition concept: the gap between the lunch rush and the next thing is not dead time — it\'s a performance opportunity. How you show up after the rush is determined by how consciously you transition out of it.' },
      { chapter: 'Raise Necessity', summary: 'Necessity is the feeling that what you are doing truly must be done — that it matters, that people are counting on you, that failure is not acceptable. Burchard argues that top performers cultivate this feeling internally rather than waiting for external pressure to create it. For store managers, this means connecting daily tasks to bigger stakes: a poor prep job doesn\'t just mean a slow line, it means a team member looking bad in front of customers. Raising necessity turns routine tasks into meaningful acts.' },
      { chapter: 'Increase Productivity', summary: 'Burchard makes a sharp distinction between being busy and producing output that matters. He introduces the concept of PQO — Prolific Quality Output — and argues that high performers obsessively identify their primary output and spend most of their energy there. For an RO, the PQO might be "a well-trained team that executes standards correctly without supervision." Every activity that doesn\'t build toward that output is secondary. This chapter challenges managers to ruthlessly prioritize and delegate everything else.' },
      { chapter: 'Demonstrate Courage', summary: 'The final habit is the most neglected because it requires vulnerability. Courage in leadership isn\'t about dramatic moments — it\'s about daily small acts: giving the honest feedback, making the unpopular scheduling decision, telling the DM what\'s actually happening at the store. Burchard argues that courage is a skill you build by choosing discomfort consistently. The corollary is that silence and avoidance are also choices — ones that erode your leadership credibility over time. This chapter is a direct challenge to every manager who has softened a message to avoid conflict.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/High-Performance-Habits-Audiobook/B074G5JMD2',
    amazonUrl: 'https://www.amazon.com/High-Performance-Habits-Extraordinary-People/dp/1401952852',
  },
  {
    id: 'multi-unit-leadership',
    title: 'Multi-Unit Leadership',
    author: 'Jim Sullivan',
    readCount: 1,
    aboutAuthor: 'Jim Sullivan is a bestselling author, keynote speaker, and the CEO of Sullivision.com. He has over 30 years of experience in the restaurant and food service industry. His clients include McDonald\'s, Starbucks, Applebee\'s, and hundreds of franchise organizations worldwide. He is considered the top thought leader in multi-unit restaurant operations.',
    importance: 'This is THE book for JM Valley district managers and multi-store operators. Jim Sullivan literally wrote the playbook on managing multiple restaurant locations simultaneously. Every challenge you face — consistency across stores, developing managers, delegating effectively, store visits that actually improve performance — is addressed with practical, proven frameworks from the restaurant industry specifically.',
    keyExcerpts: [
      { chapter: 'The Multi-Unit Leader Mindset', excerpt: 'The leap from single-unit to multi-unit management is the biggest career transition in the restaurant industry. You\'re no longer managing a restaurant — you\'re managing the people who manage the restaurant.' },
      { chapter: 'Building Your Team', excerpt: 'Your success as a multi-unit leader is determined by the quality of the general managers in your district. Invest 80% of your development time in your top performers, not your bottom ones.' },
      { chapter: 'Store Visits That Work', excerpt: 'Every store visit should have a purpose, a plan, and a follow-up. The best multi-unit leaders don\'t just inspect — they inspect and develop simultaneously.' },
      { chapter: 'Consistent Standards', excerpt: 'Your customers don\'t care which location they visit. They expect the same quality, speed, and experience every time. Consistency is the currency of multi-unit leadership.' },
      { chapter: 'Delegation vs. Abdication', excerpt: 'Delegation is giving someone a task with clear expectations, resources, and a deadline. Abdication is dumping a task and hoping for the best. Know the difference.' },
      { chapter: 'The 4 Stages of Multi-Unit Development', excerpt: 'Multi-unit leaders evolve through four stages: Doer (I do it), Supervisor (I watch you do it), Coach (I develop you to do it), and Leader (I develop leaders who develop others).' },
      { chapter: 'Communication Cadence', excerpt: 'The best multi-unit leaders establish a predictable communication rhythm with their GMs — weekly calls, monthly reviews, quarterly planning sessions. Predictability creates safety. Safety creates candor. Candor creates improvement.' },
      { chapter: 'The Power of Follow-Up', excerpt: 'What gets inspected gets respected. The single biggest failure of multi-unit leaders is not following up on commitments. When you inspect what you expect, you send the message that standards are real.' },
      { chapter: 'Selecting the Right GMs', excerpt: 'Hiring and placing the right general manager is the highest-leverage decision a multi-unit leader makes. Spend more time selecting than correcting. A great GM will solve 80% of your problems before you even know about them.' },
      { chapter: 'Crisis Management Across Stores', excerpt: 'Multi-unit leaders must be able to triage — knowing which store needs attention today vs. which can wait. The skill is reading the data and trusting your instincts. Numbers tell you where to look. Relationships tell you what is really going on.' },
      { chapter: 'Training as a Competitive Advantage', excerpt: 'The stores that win on consistency are the stores that invest in ongoing training, not just new hire orientation. Training is not an event — it is the culture. When learning is constant, standards stay high.' },
      { chapter: 'Building a Winning Culture', excerpt: 'Culture is what your team does when you\'re not watching. If your stores look the same whether or not you\'re there, you\'ve built a culture. If performance spikes when you visit and drops when you leave, you\'ve built compliance, not culture.' },
      { chapter: 'The District Scorecard', excerpt: 'Numbers don\'t lie — but they do tell incomplete stories. The scorecard tells you what happened. Your relationships with your GMs tell you why it happened. Use both to lead effectively.' },
      { chapter: 'Recognition and Retention', excerpt: 'The number one reason restaurant employees leave is not pay — it\'s feeling unappreciated. Multi-unit leaders who build recognition systems into their culture see significantly better retention numbers across every location they oversee.' },
    ],
    discussionQuestions: [
      'Are you currently a Doer, Supervisor, Coach, or Leader? What would it take to move up one level?',
      'When you visit a store, do you inspect AND develop? Or just inspect?',
      'What\'s the biggest consistency gap across your district/store right now?',
      'Sullivan says invest 80% of development time in top performers. Are you doing that, or spending more time on underperformers?',
      'What does your ideal store visit look like? Write out the agenda.',
      'What is your communication cadence with your GMs? Is it predictable enough that they know when to expect to hear from you?',
      'Where in the last month did you delegate well? Where did you abdicate?',
      'How do you measure culture at your stores — what does it look like when the culture is working vs. when it\'s broken?',
      'Do your stores perform the same when you\'re there as when you\'re not? If not, what is the gap?',
      'How do you currently recognize your best performers? Is it systematic or sporadic?',
      'What does your district or store scorecard track? Is it giving you the full picture or just the financial data?',
      'If you could only improve one store visit practice, what would it be?',
    ],
    howToApply: [
      'Create a standardized store visit checklist — 10 items you check every time, with a development conversation built in.',
      'Identify your top 2 ROs/SLs and schedule monthly 1-on-1 development sessions with them.',
      'Document your store\'s "playbook" — the 20 things that must happen the same way every day, regardless of who\'s working.',
      'Practice the delegation framework: What needs to be done, why it matters, what "done well" looks like, when it\'s due, and what support they need.',
      'Set a weekly communication touchpoint with your key managers — 15 minutes, same day every week, consistent agenda.',
      'After every store visit, send a written follow-up within 24 hours with three things: what was strong, what needs improvement, and what you\'ll check next time.',
      'Build a district recognition system — a monthly "shout-out" board, a quarterly top performer recognition, something consistent and public.',
      'Conduct a quarterly "right seat" review of your team — is every person in the role that fits their skills and character?',
      'Use the 4-Stage framework (Doer, Supervisor, Coach, Leader) in your next 1-on-1 — tell your SL explicitly which stage they are and what moves them to the next.',
      'Create a "store health dashboard" — sales trend, labor %, food cost %, QSC score, staffing level, checklist compliance. Review it every Monday.',
    ],
    keyTakeaways: [
      'The multi-unit leader\'s job is to manage the people who manage the restaurant — not to manage the restaurant itself.',
      'Consistency is the currency of multi-unit leadership — customers expect the same experience at every location every time.',
      'Invest development time in your top performers, not just your problem children; your ceiling rises when your best people grow.',
      'Delegation requires clear expectations, resources, and follow-up — anything less is abdication.',
      'What gets inspected gets respected — follow-up is not optional, it is the job.',
      'Culture is what your team does when you\'re not watching — building it requires time and intentionality.',
      'Recognition and appreciation are more powerful retention tools than pay in most restaurant contexts.',
    ],
    storeScenarios: [
      'A DM has two stores underperforming and one store crushing it. Sullivan\'s principle says: spend 80% of your development time on the winning store\'s manager, not the two struggling ones. You schedule deep monthly sessions with your top RO to push her toward DM-level thinking. Within one quarter, she\'s training the other two managers. Your worst stores improve not because you fixed them directly, but because you grew a leader who did.',
      'You visit a store and find it looking great — the line is moving, subs are portioned correctly, and the lobby is clean. But you notice it\'s because you called ahead. Last visit, unannounced, it was a mess. Sullivan\'s lesson: you haven\'t built culture, you\'ve built compliance. You begin using unannounced visits as a calibration tool and focus your coaching on "what we do when no one is watching."',
      'Your RO is working 60-hour weeks making every sub himself to keep quality up. You give him the Doer-to-Coach conversation: "Every hour you spend on the line is an hour not spent training someone who can run the line without you." You build him a 30-day plan to cross-train two crew members and track the result. Within a month, he\'s doing lineup briefings instead of making subs — and the store quality is actually higher.',
    ],
    chapterDeepDive: [
      { chapter: 'The Leadership Leap', summary: 'Sullivan opens by naming the central paradox of multi-unit management: the skills that made you a great single-store operator — speed, personal execution, hands-on presence — actually become obstacles at the multi-unit level. Your job is now to develop other operators, not to operate yourself. This chapter gives language to a transition many managers struggle to articulate. For JM Valley DMs, it reframes every instinct to "just go fix it" into an opportunity to "develop someone who can fix it."' },
      { chapter: 'The GM Selection Decision', summary: 'Sullivan argues that selecting the right GM is the highest-leverage decision in multi-unit leadership — more impactful than any system, visit, or training program. He provides a framework for evaluating candidates on character, competence, and cultural fit. For JM Valley, this chapter is a direct argument for slowing down promotions and being deliberate: a wrong GM hire costs six to twelve months of lost momentum in a store. A right hire multiplies your effectiveness across that location for years.' },
      { chapter: 'The Perfect Store Visit', summary: 'Most store visits fail, Sullivan argues, because they are inspection tours, not development conversations. A great visit follows a clear structure: pre-visit review of the data, arrival with specific hypotheses, observation before conversation, a coaching session on one key development point, and a written follow-up within 24 hours. The insight for JM Valley operators is that the visit is a leadership touchpoint first and an inspection second — and the development conversation is what makes it stick.' },
      { chapter: 'Building a Culture of Consistent Standards', summary: 'Consistency doesn\'t happen by accident. Sullivan lays out the three pillars of cross-location consistency: shared standards (everyone knows what right looks like), shared language (the same terms mean the same things at every store), and shared accountability (variance from standard is visible and addressed). For JM Valley, this chapter validates the entire RO Control system — the checklists, attestations, and scorecards are consistency infrastructure. They don\'t replace leadership; they give leaders the data they need to lead effectively.' },
      { chapter: 'Recognition, Retention, and Culture', summary: 'Sullivan presents compelling data that employee turnover is the single largest cost in multi-unit restaurant operations — and that the primary driver of turnover is not compensation, it\'s feeling unseen and unappreciated. His recognition framework is simple: make it specific, make it public, and make it frequent. For JM Valley, this is a challenge to operators who rely entirely on pay increases to motivate their best people. The operators with the lowest turnover are the ones who make their crew members feel like the most important people in the building.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Multi-Unit-Leadership-Audiobook/B00SLSC7OC',
    amazonUrl: 'https://www.amazon.com/Multi-Unit-Leadership-Next-Generation-Leader/dp/0971584915',
  },
  {
    id: 'no-excuses',
    title: 'No Excuses!',
    author: 'Brian Tracy',
    readCount: 1,
    aboutAuthor: 'Brian Tracy is Chairman and CEO of Brian Tracy International, a company specializing in the training and development of individuals and organizations. He has consulted for more than 1,000 companies and addressed more than 5,000,000 people in 5,000+ talks and seminars. He is the bestselling author of over 80 books translated into dozens of languages.',
    importance: 'Self-discipline is the foundation of everything in store management. When you eliminate excuses from your vocabulary, you take complete ownership of your results — labor costs, food quality, team development, customer satisfaction. Brian Tracy breaks down exactly how to build the self-discipline muscle in every area of life and work. This is the book that turns good operators into great ones.',
    keyExcerpts: [
      { chapter: 'Self-Discipline and Success', excerpt: 'The ability to discipline yourself to delay gratification in the short term in order to enjoy greater rewards in the long term is the indispensable prerequisite for success.' },
      { chapter: 'Self-Discipline and Work', excerpt: 'Your ability to select your most important task at each moment, and then to get started on that task and to get it done both quickly and well, will probably have more of an impact on your success than any other quality or skill you can develop.' },
      { chapter: 'Self-Discipline and Leadership', excerpt: 'Leaders are made, not born. You become a leader by doing what leaders do, over and over, until it becomes automatic and natural for you.' },
      { chapter: 'Self-Discipline and Time Management', excerpt: 'Time management is really life management. Every minute you spend planning saves ten minutes in execution.' },
      { chapter: 'Self-Discipline and Money', excerpt: 'The habit of saving and investing before you spend is the foundation of financial success. Pay yourself first, then pay your bills.' },
      { chapter: 'Taking Complete Responsibility', excerpt: 'The acceptance of complete, personal responsibility — with no blaming, no complaining, and no excuses — is the foundation of high performance in every area of life and work.' },
      { chapter: 'Self-Discipline in Your Personal Life', excerpt: 'The development of self-discipline in one area of your life has a positive spillover effect into every other area. You cannot compartmentalize discipline. It is either a virtue you have or one you are building.' },
      { chapter: 'The Seven Disciplines of High Achievers', excerpt: 'High achievers are disciplined in their goals, plans, priorities, follow-through, time use, physical health, and continuous learning. Each discipline reinforces the others in a compounding cycle of performance.' },
      { chapter: 'The Courage to Change', excerpt: 'Self-discipline requires the courage to do what is right even when it is hard. The undisciplined person always chooses the path of least resistance. The disciplined person chooses the path that leads to the result they want, even when it is uncomfortable.' },
      { chapter: 'Self-Discipline in Goals and Objectives', excerpt: 'Written goals activate your subconscious mind to find creative solutions and opportunities. When you write a goal, you commit to it at a deeper level. When you review it daily, you reinforce the neural pathways that drive behavior.' },
      { chapter: 'Self-Discipline and Persistence', excerpt: 'Persistence is self-discipline in action. Every time you persist in the face of adversity, you build your character and your confidence. You become stronger. You become the kind of person who succeeds.' },
      { chapter: 'Action Without Excuse', excerpt: 'When you stop making excuses and start taking responsibility, you discover a previously unknown power: the power of your own will. This power has been inside you all along. Excuses were simply blocking access to it.' },
      { chapter: 'Self-Discipline and Sales', excerpt: 'Every interaction with a customer is a sales opportunity — an opportunity to create a loyal, returning guest. Discipline in customer service means showing up fully for every interaction, even the hundredth one of the day.' },
      { chapter: 'The Master Skill', excerpt: 'Self-discipline is the master skill. Every other skill becomes available to you when you develop the discipline to practice it. Without self-discipline, talent, intelligence, and resources are wasted.' },
    ],
    discussionQuestions: [
      'What is your biggest excuse right now? What would happen if you eliminated it completely?',
      'Tracy says the most important task at each moment determines your success. What task are you avoiding?',
      'How disciplined are you with your store\'s daily closeout? Weekly reports? Monthly P&L review?',
      'What would your store look like if every team member had zero excuses?',
      'Tracy says leaders are made through repeated action. What leadership behavior are you practicing consistently?',
      'Where in your role do you default to complaining vs. problem-solving?',
      'Have you written down your goals for this quarter? If not, what is stopping you?',
      'Where do you see the "undisciplined path of least resistance" being taken at your store?',
      'How does your personal self-discipline (sleep, health, planning) affect your performance as a manager?',
      'What is one area where you have been making excuses that you will take ownership of this week?',
      'Tracy\'s seven disciplines include continuous learning. How much intentional learning are you doing each week?',
      'When you hold team members accountable, are you modeling the same standards you\'re enforcing?',
    ],
    howToApply: [
      'Start each day by identifying your "frog" — the one task you\'re most likely to procrastinate on — and do it first.',
      'Eliminate the phrase "I can\'t because..." from your vocabulary for one week. Replace it with "How can I..."',
      'Set a non-negotiable rule: closeout completed within 30 minutes of closing, no exceptions.',
      'Hold yourself to the same standards you hold your team. If they can\'t be late, neither can you.',
      'Write down three professional goals for the next 90 days and review them every morning during your shift check-in.',
      'When something goes wrong at your store, do a 30-second "responsibility audit" — what did I control here? What will I do differently?',
      'Track one discipline habit for 21 days: daily huddle with your team, daily P&L check-in, daily compliment to a crew member. Watch it become automatic.',
      'Implement a "no-excuse debrief" after operational failures — not to blame, but to identify the system or standard that broke down and fix it.',
      'Use the seven-discipline checklist weekly: goals, plans, priorities, follow-through, time, health, learning. Rate yourself 1-5 in each area.',
      'Make one phone call you\'ve been putting off this week. Postponed conversations are just excuses in disguise.',
    ],
    keyTakeaways: [
      'Self-discipline is the master skill — every other capability multiplies when you develop the ability to execute despite discomfort.',
      'Complete responsibility means no blaming, no complaining, and no excuses — you own every result.',
      'Leaders are made through consistent action, not born with talent.',
      'Time management is life management — planning is not bureaucracy, it is the highest leverage use of your time.',
      'Written goals activate subconscious problem-solving and commit you to a higher level of performance.',
      'Persistence in the face of adversity builds character that makes future challenges easier.',
      'The disciplined person consistently chooses the hard right over the easy wrong.',
    ],
    storeScenarios: [
      'Your store consistently misses the 9:59 ready standard, and the team\'s default explanation is "the bread delivery was late." You apply Tracy\'s no-excuses framework: you stop accepting the excuse and instead ask "what can we control?" The team realizes they can stage the slicers, position the portioning paper, and brief the crew before the bread arrives — cutting setup time by four minutes. The standard starts being hit. The excuse was masking a solvable problem.',
      'A shift lead is consistently leaving her closeout incomplete, and her explanation is always different — too busy, understaffed, a customer issue. You sit her down with the "complete responsibility" framework: "I\'m not interested in the reasons. What system do we need to put in place so this never happens again regardless of circumstances?" Together you build a 30-minute closeout protocol that she owns. It becomes her discipline, not your enforcement.',
      'You\'ve been telling yourself you\'ll start reviewing your weekly P&L every Monday for three months. You haven\'t. Tracy\'s message lands: this is an excuse disguised as intention. You block Monday 8 AM as a calendar appointment, print the P&L on Sunday night, and treat it as non-negotiable as the store opening. The habit takes hold in two weeks. Within a month you catch a food cost variance you would have missed for another quarter.',
    ],
    chapterDeepDive: [
      { chapter: 'The Choice of a Lifetime', summary: 'Tracy opens by presenting self-discipline not as a punishment but as a superpower — the single ability that, once developed, unlocks every other capability you have. He argues that everyone has the potential for self-discipline but that most people never develop it because they have never been explicitly shown how. This chapter is both a diagnosis of why operators underperform and a permission slip to believe that discipline is a learnable skill, not a personality trait.' },
      { chapter: 'Taking Complete Responsibility', summary: 'This is the philosophical core of the book. Tracy argues that accepting total responsibility for every result in your life — including results you didn\'t cause but that you could have prevented — is the foundation of all personal power. For store managers, this means that excuses about staffing, supply chain, or company policies are all just noise that prevents you from seeing what you can actually control and improve. The shift from "I can\'t because" to "how can I" is one of the most transformative changes an operator can make.' },
      { chapter: 'Self-Discipline in Leadership', summary: 'Tracy makes the case that leadership is not a gift — it is a set of behaviors practiced so consistently that they become automatic. The disciplined leader shows up on time, follows through on commitments, gives honest feedback, and holds standards even when it is inconvenient. Tracy\'s insight for JM Valley is direct: your team doesn\'t follow your words, they follow your habits. The leader who wants their crew to be disciplined must model discipline in every observable behavior.' },
      { chapter: 'The Seven Disciplines of Success', summary: 'Tracy distills high achievement into seven disciplines: disciplined goals (written, reviewed daily), disciplined plans (weekly and daily task lists), disciplined priorities (the most important task first), disciplined follow-through (finishing what you start), disciplined time use (no wasted hours), disciplined health (physical energy supports mental performance), and disciplined learning (30 minutes of growth per day). For managers, this chapter provides a weekly self-assessment framework. Rate yourself 1-5 in each area and watch your weakest discipline become the bottleneck you address.' },
      { chapter: 'Action Without Excuse', summary: 'The final chapter lands the book\'s central message: when you stop finding reasons why things can\'t be done and start asking how they can be done, a hidden reservoir of capability opens up. Tracy calls this the "power of will" — and argues it has been inside every person all along, simply blocked by the habit of excuse-making. For JM Valley operators, this chapter is a direct challenge: identify the one excuse you use most frequently about your store, your team, or your situation — and eliminate it today. Not next week. Today.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/No-Excuses-Audiobook/B004XMIMHE',
    amazonUrl: 'https://www.amazon.com/No-Excuses-Self-Discipline-Brian-Tracy/dp/1593156324',
  },
  {
    id: '21-laws-of-leadership',
    title: 'The 21 Irrefutable Laws of Leadership',
    author: 'John C. Maxwell',
    readCount: 2,
    aboutAuthor: 'John C. Maxwell is an internationally recognized leadership expert, speaker, coach, and author who has sold over 33 million books in 50 languages. He has been identified as the #1 leader in business by the American Management Association and the #1 most influential leadership expert in the world by Business Insider and Inc. magazine.',
    importance: 'Leadership is the single most important skill in restaurant operations. Your store\'s culture, performance, and team retention all flow from your leadership. Maxwell\'s 21 laws are universal — they apply whether you\'re leading a crew of 10 or a district of 200. Read this twice because the second time through, you\'ll see how each law connects to the others and compounds.',
    keyExcerpts: [
      { chapter: 'The Law of the Lid', excerpt: 'Leadership ability determines a person\'s level of effectiveness. The lower an individual\'s ability to lead, the lower the lid on his potential. The higher the leadership, the greater the effectiveness.' },
      { chapter: 'The Law of Influence', excerpt: 'The true measure of leadership is influence — nothing more, nothing less. If you don\'t have influence, you will never be able to lead others.' },
      { chapter: 'The Law of Process', excerpt: 'Leadership develops daily, not in a day. What matters most is what you do day after day, over the long haul.' },
      { chapter: 'The Law of Buy-In', excerpt: 'People buy into the leader, then the vision. As a leader, you don\'t earn credibility by telling people your vision. You earn it by showing them your character.' },
      { chapter: 'The Law of Legacy', excerpt: 'A leader\'s lasting value is measured by succession. A life isn\'t significant except for its impact on other lives.' },
      { chapter: 'The Law of Navigation', excerpt: 'Anyone can steer the ship, but it takes a leader to chart the course. Leaders see more than others see, see farther than others see, and see before others see.' },
      { chapter: 'The Law of Addition', excerpt: 'Leaders add value by serving others. The bottom line in leadership isn\'t how far we advance ourselves but how far we advance others.' },
      { chapter: 'The Law of Solid Ground', excerpt: 'Trust is the foundation of leadership. Character makes trust possible. Trust makes leadership possible.' },
      { chapter: 'The Law of Respect', excerpt: 'People naturally follow leaders stronger than themselves. Respect is earned through a combination of strength, skill, character, and results. It cannot be demanded — it can only be earned.' },
      { chapter: 'The Law of Magnetism', excerpt: 'Who you are is who you attract. If you want to attract high performers, become one. Your team\'s culture reflects your character — not your intentions, your actual behaviors.' },
      { chapter: 'The Law of Connection', excerpt: 'Leaders touch a heart before they ask for a hand. Before you can get someone\'s best effort, they need to know you genuinely care about them as a person. Connection precedes direction.' },
      { chapter: 'The Law of the Inner Circle', excerpt: 'A leader\'s potential is determined by those closest to him. The people around you don\'t just help you achieve your goals — they define your ceiling. Surround yourself with people who make you better.' },
      { chapter: 'The Law of Empowerment', excerpt: 'Only secure leaders give power to others. Insecure leaders protect their authority by withholding it. Empowering your team doesn\'t diminish you — it multiplies you.' },
      { chapter: 'The Law of Timing', excerpt: 'The wrong decision at the right time is a mistake. The right decision at the wrong time is also a mistake. The truly great leader makes the right decision at the right time.' },
    ],
    discussionQuestions: [
      'Which of the 21 laws is the hardest for you to practice consistently?',
      'Maxwell says leadership is influence. Who influences your store the most — and is it you?',
      'What is the "lid" on your store\'s potential right now? Is it a people problem or a leadership problem?',
      'How are you investing in your own leadership development on a daily basis?',
      'Who is your leadership legacy? Name one person you\'re actively developing to lead after you.',
      'The Law of Magnetism says you attract who you are. What does your current team reflect about you?',
      'How well do you connect with your team members before directing them? Do you know their motivations?',
      'Who is in your "inner circle" as a leader — the 2-3 people who make you better?',
      'Do you empower your team to make decisions, or do you hold authority too tightly? Why?',
      'When was the last time you made the right decision at the wrong time? What did you learn?',
      'Maxwell says "buy-in is bought with character, not vision." Is your team following you or just your title?',
      'What does your leadership legacy look like — who will step into your role stronger because of working with you?',
    ],
    howToApply: [
      'Pick one law per week to focus on. Write it on a sticky note on your desk. Evaluate yourself at the end of each week.',
      'Ask your team for honest feedback: "On a scale of 1-10, how much do you trust me? What would make it a 10?"',
      'Identify the lid on each of your shift leads\' potential and create a 30-day development plan for each.',
      'Practice the Law of Addition: do one thing today that adds value to someone on your team with zero expectation of return.',
      'Apply the Law of Connection: learn one new personal fact about each team member this week. Use it in your next conversation.',
      'Identify your inner circle — the 2-3 people you develop and lean on. Invest intentional time with them weekly.',
      'Use the Law of Empowerment: delegate one decision this week that you would normally make yourself. Coach the person through it instead.',
      'Apply the Law of the Lid to your store: if your leadership is the lid, raise it by reading, getting feedback, and developing one new skill this month.',
      'Review your team through the Law of Magnetism lens: what qualities does your current team reflect about your leadership culture?',
      'Set a "leadership legacy" goal: by the end of this year, one person at your store will be ready for a promotion because of your investment in them.',
    ],
    keyTakeaways: [
      'Leadership is influence — nothing more, nothing less — and it is built through daily consistent action.',
      'You fall to the level of your leadership lid; raising your leadership ceiling is the fastest way to raise your store\'s ceiling.',
      'People buy into the leader before they buy into the vision — character and trust come before strategy.',
      'You attract who you are: your team\'s culture reflects your actual character, not your stated intentions.',
      'Connection precedes direction — touch people\'s hearts before asking for their best effort.',
      'Only secure leaders empower others; the best leaders multiply themselves by developing new leaders.',
      'A leader\'s legacy is measured in people developed, not positions held.',
    ],
    storeScenarios: [
      'A new RO has been managing her store for three months and is frustrated that her team "doesn\'t listen." You walk her through the Law of the Lid: the team\'s performance is a reflection of her leadership ceiling, not their potential. Together you identify two things: she gives directives before building connection, and she rarely follows up after she asks for something. She commits to one change — learning every crew member\'s name and one thing about their life. Within two weeks, team engagement visibly shifts.',
      'Your best shift lead is undermining the RO\'s authority in subtle ways — suggesting to the crew that the RO\'s rules don\'t apply when he\'s running the shift. You apply the Law of Solid Ground with your RO: "This is a trust problem. Address it directly, specifically, and today. If you wait, the ground gets softer." She has the conversation. It is uncomfortable. The behavior changes. She learns that the law of trust requires vigilance.',
      'You have a chance to promote internally, but the most experienced person isn\'t the best leader. The most likely leader is a younger crew member who has the Law of Magnetism in spades — she makes everyone around her better. You apply the Law of Navigation, choose the right person, and build a transition plan. The promoted leader struggles initially, but grows into the role faster than the veteran would have because her natural influence was already there.',
    ],
    chapterDeepDive: [
      { chapter: 'The Law of the Lid', summary: 'Maxwell opens the book with what may be its most important concept: your effectiveness as a leader is capped by your leadership ability. A store with a 5-out-of-10 leader will never perform at a 7, regardless of team quality, location, or support. The application for JM Valley is urgent: every operator must treat their own leadership development as the single most important ongoing investment they make. Attending the book club, practicing feedback, and developing your team are not optional activities — they are the primary job.' },
      { chapter: 'The Law of Process', summary: 'Maxwell dismantles the myth of overnight leadership development. Great leaders are built through daily, consistent, seemingly small investments in learning, practice, and self-reflection. There are no shortcuts. Maxwell argues that the leaders who wait for a major event to develop their skills (a promotion, a crisis, a training program) are always behind the leaders who invest ten minutes a day in growth. For JM Valley managers, this law validates the reading program itself: the ROI is invisible week-to-week but transformative year-over-year.' },
      { chapter: 'The Law of Buy-In', summary: 'One of the most practically relevant laws for store managers: people follow the leader before they follow the direction. This means that when you announce a new standard, a new schedule system, or a new policy, your team\'s buy-in is directly proportional to how much they trust you as a person — not how well you explain the policy. Maxwell\'s challenge to operators: are you investing in the relationship equity that makes your directives land? Or are you managing by position and hoping compliance follows?' },
      { chapter: 'The Law of Connection', summary: 'The most commonly violated law in restaurant management. Maxwell argues that you must connect with people on a personal, human level before you can effectively direct them. This is especially true in high-stress, high-turnover environments like fast-casual restaurants. The RO who knows their crew members\' goals, struggles, and reasons for being there has a fundamentally different team than the one who treats everyone as interchangeable parts. Connection is not a soft concept — it is a hard performance driver.' },
      { chapter: 'The Law of Legacy', summary: 'Maxwell ends the 21 laws with the question that reframes everything: what will you leave behind? For JM Valley leaders, the legacy is not the revenue you generated or the quality scores you hit — it is the people you developed who go on to lead well themselves. The operators who think about legacy invest in their shift leads differently: not as labor units to be managed, but as future leaders to be developed. This long-game mindset transforms the entire character of a store\'s culture.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/The-21-Irrefutable-Laws-of-Leadership-Audiobook/B006MV9978',
    amazonUrl: 'https://www.amazon.com/21-Irrefutable-Laws-Leadership-25th/dp/1400236177',
  },
  {
    id: 'first-time-manager',
    title: 'The First-Time Manager',
    author: 'Jim McCormick',
    readCount: 2,
    aboutAuthor: 'Jim McCormick is an expert in risk-taking, leadership, and management. A former world record-holding skydiver, he brings a unique perspective on courage and decision-making to leadership development. This book, now in its 7th edition, has helped millions of new managers navigate their first leadership role.',
    importance: 'Every RO and shift lead at JM Valley should read this before or immediately after their first promotion. The transition from "doing the work" to "leading people who do the work" is the hardest shift in any career. This book covers the exact situations you\'ll face: giving feedback, handling conflict, delegating tasks, building trust, and managing people who were your peers yesterday. Read twice because the challenges in your first year are different from year two.',
    keyExcerpts: [
      { chapter: 'The Road to Management', excerpt: 'The skills that made you successful as an individual contributor are not the same skills that will make you successful as a manager. You must learn to achieve results through others.' },
      { chapter: 'Building Trust', excerpt: 'Trust is the foundation of any working relationship. As a new manager, you earn trust through consistency, transparency, and following through on your commitments.' },
      { chapter: 'Delegating', excerpt: 'Delegating isn\'t about dumping work on others. It\'s about developing your team\'s capabilities while freeing yourself to focus on higher-level responsibilities.' },
      { chapter: 'Having Difficult Conversations', excerpt: 'The conversation you\'re avoiding is usually the conversation you most need to have. Address issues early, directly, and with compassion.' },
      { chapter: 'Managing Former Peers', excerpt: 'Being promoted over your friends is one of the hardest transitions. You must redefine the relationship without destroying it. Be fair, be consistent, and be clear about your new role.' },
      { chapter: 'Your First 90 Days', excerpt: 'The first 90 days set the tone for your entire tenure as a manager. Listen more than you talk. Observe before you change. Build relationships before you enforce rules.' },
      { chapter: 'Setting Expectations', excerpt: 'People perform best when they know exactly what is expected of them. Your job as a new manager is to make the standards crystal clear — not once, but continuously.' },
      { chapter: 'Motivating Your Team', excerpt: 'Different people are motivated by different things. A great manager takes the time to understand what matters to each individual on the team and connects their work to that motivation.' },
      { chapter: 'Performance Reviews', excerpt: 'No one should be surprised by a performance review. If your feedback is coming as news, you haven\'t been doing your job as a manager. Reviews should be a summary of ongoing conversations, not a revelation.' },
      { chapter: 'Time Management for Managers', excerpt: 'As a manager, your time is now a shared resource. You must guard it fiercely while remaining accessible. The manager who is too busy to develop their team is not managing — they are just doing.' },
      { chapter: 'Managing Up', excerpt: 'Being a great manager means being a great direct report. Understand your boss\'s priorities, communicate proactively, and never let your manager be surprised by something you knew about.' },
      { chapter: 'Building a Positive Team Culture', excerpt: 'Culture is not what you say — it is what you tolerate. If you allow poor behavior, rudeness, or cutting corners without addressing it, you have made that the culture. Every action and inaction sends a message.' },
      { chapter: 'The Legal Side of Management', excerpt: 'New managers often don\'t know what they don\'t know about employment law. Document everything. Follow your company\'s HR procedures. When in doubt, ask before acting.' },
      { chapter: 'Continuous Improvement as a Manager', excerpt: 'The best managers are students of their craft. They seek feedback, read books like this one, observe great leaders, and reflect on their own performance constantly. Management is not a destination — it is a practice.' },
    ],
    discussionQuestions: [
      'What was the hardest part of your transition from crew to management?',
      'Is there a difficult conversation you need to have with someone this week?',
      'How do you handle delegating to someone who used to be your peer?',
      'What did you wish someone had told you before you became a manager?',
      'McCormick says listen more than you talk in the first 90 days. Do you still practice this?',
      'Have you clearly set expectations with every person on your team? Do they know exactly what "good" looks like?',
      'When was the last time you connected someone\'s daily work to their personal motivation?',
      'Do your team members get surprised by feedback in their reviews? What does that tell you about your day-to-day coaching?',
      'How do you manage your own time to ensure you have space for developing your team?',
      'Are you "managing up" effectively — keeping your RO or DM informed before they have to ask?',
      'What behavior at your store are you currently tolerating that you shouldn\'t be?',
      'What is one area where you need to continue growing as a manager right now?',
    ],
    howToApply: [
      'When promoting a new shift lead, sit down with them and walk through this book\'s first 3 chapters together.',
      'Create a "New Manager Checklist" for your store — the 20 things every new SL needs to know in their first 30 days.',
      'Practice the difficult conversation framework: describe the behavior, explain the impact, ask for their perspective, agree on next steps.',
      'Schedule a weekly 15-minute check-in with your newest manager. Ask: "What\'s your biggest challenge right now?"',
      'Write down the explicit performance expectations for each role at your store. Can you hand a new SL a document that describes exactly what "excellent" looks like for their job?',
      'Before your next team meeting, make a list of each person\'s motivators. Reference at least one in your communication.',
      'Establish a "no surprise reviews" standard: every coaching conversation is documented and referenced at the next review.',
      'Block two 30-minute blocks per week labeled "team development" — use them for coaching, not operations.',
      'Practice managing up: send your RO or DM a weekly one-paragraph update on your store\'s biggest challenge and what you\'re doing about it.',
      'Identify one behavior you\'ve been tolerating that violates your standard. Address it this week.',
    ],
    keyTakeaways: [
      'The skills that made you a great individual contributor are not the skills that make you a great manager — the transition requires learning an entirely new set of tools.',
      'Trust is built through consistency, transparency, and follow-through — not through authority or position.',
      'The conversation you avoid most is usually the one you most need to have.',
      'Culture is what you tolerate, not what you say — every inaction sends a message.',
      'Managing former peers requires redefining relationships with clarity and fairness, not avoiding the awkwardness.',
      'No one should be surprised by a performance review — ongoing feedback makes reviews a summary, not a revelation.',
      'Great managers are perpetual students of their craft — they never stop seeking feedback and improving.',
    ],
    storeScenarios: [
      'A crew member who was your best friend before your promotion is now showing up late repeatedly. You\'ve been avoiding the conversation because of the friendship. McCormick\'s framework applies: "The conversation you\'re avoiding is the one you most need to have." You sit down with him privately, describe the behavior (three late arrivals this month), explain the impact (it puts the opening crew in a bind), ask for his perspective, and agree on a plan. The friendship survives because you treated him like a professional, not like you were protecting yourself.',
      'You\'ve been promoted to RO and find yourself still making subs during every rush instead of coaching your line. You recognize this as the classic first-time manager trap — doing the work instead of developing people who do the work. You commit to one shift per week where you don\'t touch a sub and instead spend every minute coaching, correcting, and praising. Within three weeks, the line crew runs more reliably without you — because you stopped rescuing them and started developing them.',
      'A new shift lead is struggling to run lineups confidently. You realize you never explicitly defined what a good lineup looks like — you assumed she would figure it out from watching. You sit down, write a one-page lineup guide (purpose, format, 60 seconds maximum, one key focus), walk her through it, observe her first three attempts, and give specific feedback after each. Her improvement is immediate because clarity replaced ambiguity.',
    ],
    chapterDeepDive: [
      { chapter: 'The Road to Management', summary: 'McCormick opens with the single most important truth about the management transition: what got you here won\'t get you there. The skills that made you the best crew member — speed, accuracy, work ethic, subject matter expertise — are largely irrelevant to your new role. Your new job is to build an environment where other people can perform well consistently. This requires patience, communication, and relationship skills that most new managers have never been formally trained in. The chapter is a gracious warning: you are starting over at something new, and that is okay.' },
      { chapter: 'Your First 90 Days', summary: 'This chapter gives new managers a permission slip to slow down. The instinct is to change things immediately to signal authority. McCormick argues the opposite: in your first 90 days, listen four times more than you talk, observe the team before you judge them, and build relationship equity before you spend it. For JM Valley new shift leads, this chapter is an antidote to the common mistake of coming in with big changes before the team trusts you. Trust first. Change second. Results follow.' },
      { chapter: 'Delegating', summary: 'McCormick reframes delegation as a development tool, not a time-saving device. When you delegate effectively — with clear expectations, the right level of support, and genuine follow-up — you build capability in your team and free yourself for higher-leverage work. The common failure is either not delegating at all (doing everything yourself) or delegating without support (abdicating). This chapter gives managers a practical framework: assign the task, explain why it matters, describe what success looks like, set a deadline, and check in at the midpoint.' },
      { chapter: 'Motivation and Individual Differences', summary: 'Not everyone is motivated by the same things, and this chapter challenges managers to stop treating their team as a single unit. Some people are motivated by recognition, others by autonomy, others by skill development, others by flexibility. McCormick\'s challenge to managers: do you actually know what motivates each person on your team? This knowledge is not optional for high performance — it is the foundation of effective management. The manager who knows why each person shows up can align work, recognition, and opportunity in ways that keep their best people engaged and committed.' },
      { chapter: 'Difficult Conversations', summary: 'McCormick devotes significant space to the skill that most new managers avoid: direct, honest, compassionate feedback. The framework he provides (describe the specific behavior, explain the concrete impact, invite perspective, agree on next steps) is simple enough to remember and powerful enough to change relationships. For JM Valley managers, the biggest takeaway is the opening line: "The conversation you\'re avoiding is usually the one you most need to have." Avoidance is not kindness — it is a failure of leadership that costs both parties.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/The-First-Time-Manager-Audiobook/B01N6BBJ4Z',
    amazonUrl: 'https://www.amazon.com/First-Time-Manager-Jim-McCormick/dp/1400247373',
  },
  {
    id: 'the-one-truth',
    title: 'The One Truth',
    author: 'Jon Gordon',
    readCount: 1,
    aboutAuthor: 'Jon Gordon is a bestselling author of 28 books including The Energy Bus, The Power of Positive Leadership, and Training Camp. His principles have been put to the test by numerous Fortune 500 companies, professional and college sports teams, school districts, hospitals, and non-profits. He is one of the most sought-after speakers and consultants in the world.',
    importance: 'Jon Gordon\'s work on positive energy and team culture is directly applicable to running a Jersey Mike\'s store. The energy you bring as a leader sets the tone for your entire team and every customer interaction. The One Truth strips away complexity and gives you one foundational principle that changes how you show up, how you lead, and how you handle the inevitable challenges of restaurant operations.',
    keyExcerpts: [
      { chapter: 'The One Truth', excerpt: 'The One Truth is that everything in your life comes down to your state of mind. When you understand this, you realize you have the power to transform any situation by changing your perspective and energy.' },
      { chapter: 'Oneness Over Separateness', excerpt: 'When we feel connected to something greater than ourselves — our team, our mission, our purpose — we tap into a source of strength and resilience that separates great leaders from average ones.' },
      { chapter: 'Energy', excerpt: 'Your energy is contagious. As a leader, you don\'t just manage tasks — you manage energy. Positive energy fuels performance, creativity, and resilience in your team.' },
      { chapter: 'Fear vs. Love', excerpt: 'Fear divides. Love unites. When you lead from a place of love and connection, you create an environment where people give their best — not because they have to, but because they want to.' },
      { chapter: 'The Power of Now', excerpt: 'Most suffering comes from either reliving the past or fearing the future. The most effective leaders operate in the present — fully engaged with what is happening right now, not distracted by what already happened or might happen.' },
      { chapter: 'Separateness Creates Fear', excerpt: 'When we feel separate — from our team, our purpose, our values — fear fills the void. Fear in a workplace creates politics, disengagement, and selfishness. Oneness creates courage, generosity, and commitment.' },
      { chapter: 'Your State Creates Your Story', excerpt: 'You don\'t see the world as it is — you see it through the filter of your current state. When you change your state, you change the story you\'re telling yourself about what\'s possible. And when the story changes, so does the action.' },
      { chapter: 'Presence as a Leader', excerpt: 'The greatest gift you can give someone is your full presence. When you are fully present with your team, they feel valued. When they feel valued, they invest in you. Leadership presence is not a skill — it is a discipline of attention.' },
      { chapter: 'Love in Leadership', excerpt: 'Caring for your team is not weakness — it is the most powerful force in human leadership. Gordon argues that the best-performing teams he has observed are the ones where the leader genuinely loves the people they lead.' },
      { chapter: 'Transforming Challenges', excerpt: 'Every challenge in your store — a difficult customer, a bad prep day, a team conflict — is an opportunity to demonstrate your state of mind. Your response to adversity teaches your team more about leadership than anything you say in a meeting.' },
      { chapter: 'The Practice of Gratitude', excerpt: 'Gratitude is not a passive feeling — it is an active practice that retrains your brain to look for what\'s working rather than what\'s failing. Leaders who practice gratitude create cultures of appreciation that are measurably more resilient.' },
      { chapter: 'Connected Teams Win', excerpt: 'The data is clear: connected teams outperform disconnected ones in every measurable way — productivity, retention, quality, customer satisfaction. Connection is not a soft outcome. It is a competitive advantage.' },
    ],
    discussionQuestions: [
      'What energy do you bring to the store each day? Would your team describe it as positive?',
      'Gordon says "oneness over separateness." How connected does your team feel to each other?',
      'When was the last time you led from fear (deadlines, consequences) vs. love (purpose, connection)?',
      'What is one thing you could change about your mindset that would transform your leadership?',
      'Gordon says your state creates your story. What story are you telling yourself about your store, your team, and your role?',
      'Do you feel fully present during your shifts, or are you distracted by what happened before the shift or what\'s coming after?',
      'How would your team describe the energy of the store when you walk in vs. when someone else is in charge?',
      'What does it mean to you to "love" your team? What does that look like in practical, daily behavior?',
      'Think of the last adversity your store faced. What did your response teach your team about leadership?',
      'Do you have a gratitude practice? What would change if you named three things you\'re grateful for about your team each week?',
      'What would a truly "connected" team look like at your store? What would be different?',
    ],
    howToApply: [
      'Start each shift with a 30-second positive energy check — greet every team member by name and ask how they\'re doing.',
      'When things go wrong during a rush, pause and reset your energy before reacting. Your team watches you.',
      'Create a "team wins" board in the back — write one positive thing that happened each day.',
      'Before a difficult conversation, ask yourself: "Am I approaching this from fear or from genuine care for this person?"',
      'Practice full presence: when you\'re coaching someone, put your phone away and give them 100% of your attention.',
      'At the end of each shift, name one thing each team member did well. Say it out loud.',
      'Replace fear-based motivators ("you\'ll lose your job if this keeps up") with purpose-based ones ("this is what it means to the customer when we do this right").',
      'When your store faces a challenge, practice the mindset shift: "This is happening for us, not to us. What can we learn?"',
      'Implement a weekly "connection moment" in your team meeting — one minute where someone shares something good from their life, not just their job.',
      'Track your own state: at the start and end of each shift, rate your energy 1-10 and identify what raised or lowered it.',
    ],
    keyTakeaways: [
      'Your state of mind determines your experience — and as a leader, it determines your team\'s experience.',
      'Oneness — the feeling of connection to the team, the mission, and something bigger — is the antidote to fear and disengagement.',
      'Energy is contagious: your team\'s culture is downstream of your daily emotional state.',
      'Leading from love (genuine care, connection, purpose) produces better performance than leading from fear.',
      'Full presence is the greatest leadership gift you can give your team.',
      'Gratitude is an active practice that builds resilience and creates a culture of appreciation.',
      'Connected teams measurably outperform disconnected ones on every metric.',
    ],
    storeScenarios: [
      'Your store is in a slump — morale is low after a tough week of being understaffed. You come in Monday with deliberate energy: you greet everyone by name, you tell a story about why you love this team, and you kick off the shift by naming one strength each person brings. Nobody says anything, but the shift runs differently. By Thursday, a crew member tells you "I don\'t know what changed, but this week has been different." Gordon\'s message: the leader\'s state is the store\'s state.',
      'A customer is aggressive and rude to a crew member at the register. Your crew member\'s face falls. You see it. After the customer leaves, you walk over and say two sentences: "That was not okay, and it is not a reflection of how valuable you are. You handled it with class." Twenty seconds. The crew member stands taller for the rest of the shift. Leading from love is not complicated — it is present.',
      'You\'ve been managing your new hire\'s tardiness through a fear lens: "One more time and you\'re written up." It\'s not working. You switch to Gordon\'s framework and have a different conversation: "I need to understand why this keeps happening. What\'s going on in your life?" She tells you about a childcare situation. You adjust her schedule. The tardiness stops. Connection solved what correction couldn\'t.',
    ],
    chapterDeepDive: [
      { chapter: 'The One Truth Explained', summary: 'Gordon\'s central thesis is disarmingly simple: everything in your life is shaped by your state of mind — your thoughts, beliefs, perceptions, and emotional state. This is not wishful thinking; it is neuroscience. The state you are in colors everything you see and determines how you respond to every situation. For store managers, this is both a diagnosis and a prescription: the stores that underperform are often led by managers in a chronic state of stress, fear, or reactivity. The stores that thrive are led by managers who have learned to manage their inner world.' },
      { chapter: 'Oneness vs. Separateness', summary: 'This chapter introduces the book\'s most powerful distinction. Oneness is the feeling of connection — to your team, your purpose, your values, and something larger than yourself. Separateness is the feeling of isolation, competition, and threat. Gordon argues that most workplace dysfunction is a manifestation of separateness: politics, selfishness, disengagement, blame. The leader\'s job is to cultivate oneness — through shared purpose, genuine relationships, and a culture where people feel they belong to something meaningful.' },
      { chapter: 'Fear vs. Love', summary: 'Gordon makes the case that the choice between fear-based and love-based leadership is the most consequential choice a manager makes daily. Fear-based management uses consequences, surveillance, and pressure to drive behavior. It produces compliance but kills discretionary effort. Love-based leadership uses care, purpose, and connection to produce engagement — people who give more than required because they genuinely care about the outcome. For JM Valley, this chapter challenges every manager to audit their motivational approach: are you building a team that performs because they want to, or only because they have to?' },
      { chapter: 'State Changes Everything', summary: 'One of the most immediately applicable chapters in the book. Gordon argues that you can change any situation by changing your state — your emotional and mental condition in the moment. He provides practical techniques: breath, gratitude, reframing, movement. For shift managers, the insight is that the way you enter the building at 9:45 AM sets the tone for the next six hours. The two-minute pre-shift ritual of shifting your state — checking gratitude, setting intention, letting go of whatever happened before — is one of the most leveraged practices in restaurant leadership.' },
      { chapter: 'The Practice of Gratitude and Connection', summary: 'Gordon closes with a challenge to build gratitude and connection into daily leadership practice, not as a one-time exercise but as an ongoing discipline. He provides evidence that teams with higher connection report higher job satisfaction, lower turnover, better customer service scores, and stronger financial performance. The message for JM Valley operators: connection is not a luxury — it is a performance variable. The weekly team huddle where you learn one thing about each person, the end-of-shift appreciation ritual, the genuine interest in your team\'s lives — these are not soft activities. They are the infrastructure of a winning culture.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/The-One-Truth-Audiobook/B0B8V2MNSG',
    amazonUrl: 'https://www.amazon.com/One-Truth-Elevate-Mind-Transform/dp/1119902398',
  },
  {
    id: 'eat-that-frog',
    title: 'Eat That Frog!',
    author: 'Brian Tracy',
    readCount: 1,
    aboutAuthor: 'Brian Tracy is one of the top professional speakers in the world, addressing more than 250,000 people each year. He has written over 80 books that have been translated into dozens of languages. As a business consultant, he has worked with more than 1,000 companies. His approach to time management and productivity has transformed careers worldwide.',
    importance: 'Time management is the #1 skill that separates successful operators from overwhelmed ones. Your frog is that one critical task you\'re avoiding — the conversation with an underperforming employee, the labor analysis, the closeout you\'ve been putting off. Brian Tracy teaches you to tackle your biggest, most impactful task first thing every day. When your entire management team adopts this, productivity across the store skyrockets.',
    keyExcerpts: [
      { chapter: 'Set the Table', excerpt: 'Before you can determine your frog and get on with eating it, you have to decide exactly what you want to achieve in each area of your life. Clarity is perhaps the most important concept in personal productivity.' },
      { chapter: 'Apply the 80/20 Rule', excerpt: 'Twenty percent of your activities will account for eighty percent of your results. Always concentrate your efforts on that top twenty percent.' },
      { chapter: 'Consider the Consequences', excerpt: 'The most important tasks you can do each day are often the hardest and most complex. But the payoff for completing them is tremendous.' },
      { chapter: 'The ABCDE Method', excerpt: 'Before starting work, list everything you have to do. Then label each task: A (must do), B (should do), C (nice to do), D (delegate), E (eliminate). Then do your As first.' },
      { chapter: 'Single Handle Every Task', excerpt: 'Once you start your most important task, discipline yourself to work at it without diversion or distraction until it is 100% complete. This is the real key to high performance.' },
      { chapter: 'Focus on Key Result Areas', excerpt: 'In every job, there are usually four to six key result areas where you absolutely must perform well to succeed. Clarifying these areas is one of the most important things you can ever do for your career.' },
      { chapter: 'The Law of Three', excerpt: 'Of all the tasks you could do, only three of them account for 90% of the value you produce. Identify those three and work on them first, every day.' },
      { chapter: 'Prepare Thoroughly Before You Begin', excerpt: 'The more time you spend preparing before you begin a task, the faster you will complete it once you start. Slow down to go fast. Think before you do.' },
      { chapter: 'Do Your Homework', excerpt: 'Continuous learning is essential to success. The more you know, the more confident and capable you become. The manager who keeps learning outperforms the manager who stopped.' },
      { chapter: 'Motivate Yourself into Action', excerpt: 'Develop a positive, upbeat attitude toward yourself and your work. Become your own best cheerleader. The person who maintains a positive inner dialogue performs at a higher level in every situation.' },
      { chapter: 'Practice Creative Procrastination', excerpt: 'Since you cannot do everything, you must procrastinate on something. Deliberately choose to procrastinate on low-value activities and protect your high-value work fiercely.' },
      { chapter: 'Leverage Your Special Talents', excerpt: 'You have special skills and abilities that set you apart. Your job is to identify your unique talents and concentrate your energies on doing those things in an excellent fashion.' },
      { chapter: 'Identify Your Key Constraints', excerpt: 'For every goal you have, there is a limiting factor — one thing that determines how fast you can achieve it. Identify the constraint and focus your attention there first.' },
      { chapter: 'Technology as Servant, Not Master', excerpt: 'Your goal is to use technology to improve your quality of life rather than allow it to use you. Be intentional about when and how you engage with your devices, or they will manage your attention for you.' },
    ],
    discussionQuestions: [
      'What is your "frog" this week — the task you keep putting off?',
      'Tracy says 20% of tasks drive 80% of results. What\'s in your 20%?',
      'How much time do you spend on "C" and "D" tasks that could be delegated or eliminated?',
      'Do you "single handle" tasks, or do you jump between 5 things at once during a shift?',
      'What are the 3-6 key result areas of your role? Could you name them without help?',
      'Where does your team\'s time go during slow periods? Is that time being invested in value-generating activities?',
      'What is the one limiting constraint that is most holding back your store\'s performance right now?',
      'Tracy says prepare thoroughly before beginning. How much of your shift starts without preparation?',
      'Are you using technology intentionally (checklists, scheduling apps) or being used by it (phone distractions)?',
      'What is one task you\'ve been "creatively procrastinating" on that you can handle in the next 24 hours?',
      'Tracy\'s "Law of Three" says three tasks produce 90% of your value. What are your three?',
      'When was the last time you completed a major task from start to finish without interruption?',
    ],
    howToApply: [
      'Every morning before the store opens, write your top 3 frogs on a sticky note. Eat the biggest one first.',
      'Use the ABCDE method on your weekly to-do list. Be honest — how many items are really "E" (eliminate)?',
      'Block 30 minutes of uninterrupted time each day for your most important task. No phone, no interruptions.',
      'Teach your shift leads to identify their frog too. Make it a daily team habit.',
      'Apply the 80/20 rule to your team: identify the 2-3 people who produce 80% of your best results and invest disproportionately in their development.',
      'Identify your store\'s key constraint — the one bottleneck that limits everything else. Make removing it your next rock.',
      'Create a "delegate or eliminate" review every Friday: go through your task list and offload everything that isn\'t in your top 20%.',
      'Build a pre-shift preparation ritual: 10 minutes before the door opens, review priorities, confirm coverage, identify your frog for the shift.',
      'Use creative procrastination consciously: deliberately delay responding to non-urgent messages until after you\'ve completed your most important task.',
      'Apply the Law of Three to your role this week: name your three highest-value contributions. Make sure 80% of your time is protecting them.',
    ],
    keyTakeaways: [
      'Your "frog" is the most impactful thing you\'re avoiding — eat it first thing every morning and your day improves dramatically.',
      '20% of your tasks produce 80% of your results — identify that 20% and protect it fiercely.',
      'The ABCDE method gives every task a priority and makes it impossible to confuse urgency with importance.',
      'Single-handling — completing one task from start to finish without interruption — is the most powerful productivity habit available.',
      'Creative procrastination is a strategy: deliberately delay low-value work to protect high-value work.',
      'Preparation before starting saves more time than it costs — slow down to go fast.',
      'Identifying your key constraint is the fastest path to breakthrough performance.',
    ],
    storeScenarios: [
      'You\'ve been starting every shift by checking sales numbers, answering texts, and walking the floor. By 10:30 AM you\'re already reactive. You apply Tracy\'s "eat the frog" principle: you identify the one task each day that will make the biggest difference if completed before anything else. On Monday it\'s cross-training a new hire. On Tuesday it\'s a labor schedule correction. On Wednesday it\'s the inventory order. You eat those frogs first, every day, for two weeks. The shift\'s entire character changes.',
      'Your closing manager routinely leaves the office paperwork incomplete because "something always comes up." You apply the ABCDE method together: the paperwork is an A (must-do), not a C. You redesign the closing protocol to make the paperwork the first thing completed when the final customer leaves — before cleaning, before restocking, before anything. The "something comes up" problem disappears because the A is done before the Cs even start.',
      'You realize you\'re spending 60% of your shift managing a small part of your team (your two most challenging employees) and only 10% developing your two best performers. You apply the 80/20 rule in reverse: you shift your development investment toward your high performers, give the two challenging employees a clear structure with less personalized attention, and watch your best crew members grow in ways that eventually solve the bottom-performer problem organically.',
    ],
    chapterDeepDive: [
      { chapter: 'The "Eat That Frog" Principle', summary: 'Tracy introduces the central metaphor: if you eat a live frog first thing every morning, you can go through the rest of the day knowing the worst is behind you. The "frog" is your most important task — usually the one you\'re most likely to procrastinate. Tracy argues that your first act of the day determines your momentum and your self-concept. Starting with your frog trains your brain to associate the beginning of the day with conquest rather than avoidance. For JM Valley managers, this chapter reframes the pre-open hour as the highest-leverage time of the day.' },
      { chapter: 'The 80/20 Rule Applied', summary: 'Tracy applies Pareto\'s principle to time management with precision: 20% of your activities produce 80% of your results, 20% of your customers produce 80% of your revenue, 20% of your team produces 80% of your best results. The insight is not just academic — it is an operational directive. Managers who spend equal time on all tasks are chronically underperforming relative to their potential. Clarity about what is in your 20% is the prerequisite for everything else. This chapter is a direct invitation to audit how you spend your time.' },
      { chapter: 'The ABCDE Method', summary: 'One of the most practical frameworks in the book, the ABCDE method gives every task a category: A (must do, serious consequences if skipped), B (should do, mild consequences if skipped), C (nice to do, no consequences), D (delegate to someone else), E (eliminate entirely). Tracy\'s instruction is simple: never do a B while an A is undone. Never do a C while a B is undone. For JM Valley shift leads especially, this chapter gives language to a daily challenge: distinguishing between tasks that feel urgent and tasks that are actually important.' },
      { chapter: 'Focus on Key Result Areas', summary: 'Tracy argues that every job has 4-6 key result areas — the specific outputs that determine whether you are succeeding in your role. Your performance in these areas is non-negotiable. Everything else is secondary. For a JM Valley RO, the key result areas might be: team development, food quality consistency, labor efficiency, customer experience, and operational standards. Tracy\'s challenge is to identify yours explicitly, then audit whether your daily activities actually serve those areas.' },
      { chapter: 'The Habits of Mental Discipline', summary: 'Tracy closes by arguing that all the techniques in the book are ultimately habits of mind — ways of thinking that, practiced consistently, become automatic. The manager who has developed the habit of starting with their frog, applying the 80/20 rule, and single-handling their most important tasks is not just more productive — they are fundamentally different in how they experience their work. Overwhelm is largely a mindset; discipline is largely a practice. This chapter is a reminder that the goal is not a better to-do list — it is a better operating system for your mind.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Eat-That-Frog-Audiobook/B002V8KXCI',
    amazonUrl: 'https://www.amazon.com/Eat-That-Frog-Great-Procrastinating/dp/162656941X',
  },
  {
    id: 'radical-candor',
    title: 'Radical Candor',
    author: 'Kim Scott',
    readCount: 2,
    aboutAuthor: 'Kim Scott is the co-founder of Radical Candor and the author of three books. She has been a CEO coach and advisor at Dropbox, Qualtrics, Twitter, and several other companies. She was a member of the faculty at Apple University and led AdSense, YouTube, and DoubleClick teams at Google. She has managed teams at Apple, Google, and several startups.',
    importance: 'The most important thing you do as a store leader is give feedback. Radical Candor gives you the framework to do it right — caring personally while challenging directly. Most managers either avoid tough conversations (Ruinous Empathy) or deliver feedback harshly (Obnoxious Aggression). This book teaches the sweet spot. Read twice because your first read changes how you think about feedback, and your second read changes how you actually deliver it.',
    keyExcerpts: [
      { chapter: 'Build Radically Candid Relationships', excerpt: 'Radical Candor is what happens when you put Care Personally and Challenge Directly together. It\'s not about being harsh or insensitive — it\'s about caring enough to tell people the truth.' },
      { chapter: 'Ruinous Empathy', excerpt: 'Most management mistakes happen in the Ruinous Empathy quadrant — you care personally but fail to challenge directly. You see a problem but say nothing because you don\'t want to hurt someone\'s feelings.' },
      { chapter: 'Getting, Giving, and Encouraging Feedback', excerpt: 'Start by asking for feedback before giving it. When you show vulnerability and willingness to hear hard truths, you create a culture where feedback flows in all directions.' },
      { chapter: 'The Feedback Loop', excerpt: 'Praise should be specific and sincere. Criticism should be kind, clear, and immediate. Both should be aimed at making the person better, not making you feel powerful.' },
      { chapter: 'Obnoxious Aggression', excerpt: 'Obnoxious Aggression is what happens when you challenge directly but don\'t show you care personally. It\'s the boss who says harsh things and thinks they\'re "just being honest."' },
      { chapter: 'Manipulative Insincerity', excerpt: 'The worst quadrant is when you neither care personally nor challenge directly. This is backstabbing, passive-aggressive behavior, and political maneuvering.' },
      { chapter: 'The 2x2 Matrix', excerpt: 'The four quadrants — Radical Candor, Ruinous Empathy, Obnoxious Aggression, Manipulative Insincerity — give you a shared language for feedback culture. Naming the quadrant matters because it makes the invisible visible.' },
      { chapter: 'Guidance', excerpt: 'Guidance is the lifeblood of a team. Without it, people can\'t grow, and managers can\'t lead. Guidance means both praise and criticism, delivered in a way that helps the person improve.' },
      { chapter: 'Praising in Public, Criticizing in Private', excerpt: 'Public praise is a gift. Public criticism is a punishment. The best managers know the difference and use both strategically. Praise publicly so the whole team learns what excellence looks like. Correct privately so dignity is preserved.' },
      { chapter: 'Managing Your Boss', excerpt: 'Radical Candor applies upward too. If you see your manager making a mistake that you have information to prevent, staying silent is a failure of candor. Good leaders create an environment where direct reports challenge them too.' },
      { chapter: 'Building a Radically Candid Culture', excerpt: 'Culture is not what you say — it is the feedback you tolerate, the praise you give, the silence you allow. A Radically Candid culture is built conversation by conversation, not by declaration.' },
      { chapter: 'The Importance of Specificity', excerpt: 'Vague feedback is worse than no feedback. "Great job" teaches nothing. "Your sandwich portions were exactly right during the rush and the line moved faster because of it" teaches everything.' },
      { chapter: 'Hiring and Firing with Candor', excerpt: 'Radical Candor applies to your hardest decisions. Hiring someone you\'re not sure about is a form of Ruinous Empathy — toward both them and the team. Keeping someone who is failing the standard is not kindness; it is a quiet cruelty.' },
      { chapter: 'Personal Relationships as the Foundation', excerpt: 'You don\'t have to be friends with everyone you manage, but you do have to care about them. The difference between caring personally and being best friends is the difference between Radical Candor and Ruinous Empathy.' },
    ],
    discussionQuestions: [
      'Which quadrant do you default to — Radical Candor, Ruinous Empathy, Obnoxious Aggression, or Manipulative Insincerity?',
      'Think of the last time you avoided giving critical feedback. What was the cost of that silence?',
      'How do you receive feedback? Are you modeling the behavior you want from your team?',
      'Scott says praise publicly, criticize privately. Are you consistent with this?',
      'What would change if every person on your team practiced Radical Candor with each other?',
      'What is one piece of feedback you have been delivering with Ruinous Empathy — softened to the point of being useless?',
      'Have you ever delivered feedback that landed in Obnoxious Aggression? What happened?',
      'Do you give specific praise, or general praise? What is the difference in impact?',
      'Is your team psychologically safe enough to challenge you? How do you know?',
      'Scott says building a candid culture happens conversation by conversation. What is the next conversation you need to have?',
      'How do you handle the situation where someone\'s self-assessment doesn\'t match your assessment of their performance?',
      'What does Radical Candor look like when someone is struggling and might need to be moved or let go?',
    ],
    howToApply: [
      'This week, give one piece of specific praise and one piece of kind, clear criticism to a team member.',
      'When you see a sub made wrong, use the framework: "I care about you AND the standard is..." — both at the same time.',
      'Ask your shift leads: "What\'s one thing I could do better as your manager?" Then actually listen and act on it.',
      'Post the 2x2 matrix (Care Personally / Challenge Directly) in the office. Reference it in coaching conversations.',
      'Practice specific praise: instead of "good job today," try "your portioning on the sliced turkey during the lunch rush was perfect — every sub was consistent and the line moved faster."',
      'Before your next feedback conversation, ask yourself: "Am I in Ruinous Empathy? Am I softening this so much it won\'t land?"',
      'Create a team norm: every shift ends with one specific appreciation from the manager to the team. One thing, specific, sincere.',
      'Start soliciting upward feedback at your weekly check-ins. Ask: "What\'s one thing I did this week that made your job harder?"',
      'Apply Radical Candor to your toughest personnel decision right now. Are you avoiding it? What does candor require?',
      'Share the 2x2 framework with your entire team so they have a shared language for feedback culture at the store level.',
    ],
    keyTakeaways: [
      'Radical Candor is caring personally while challenging directly — both dimensions are non-negotiable.',
      'Most management failures live in Ruinous Empathy: softening feedback out of care until it loses its power to help.',
      'Specific, timely feedback is the lifeblood of a growing team — vague feedback teaches nothing.',
      'Praise publicly so the team learns what excellence looks like; criticize privately so dignity is preserved.',
      'Feedback culture is built conversation by conversation — not declared, built.',
      'Asking for feedback before giving it creates the safety and credibility needed for candor to flow both ways.',
      'Silence in the face of a problem is not kindness — it is a slow failure of leadership.',
    ],
    storeScenarios: [
      'A new crew member has been portioning subs incorrectly for two weeks. Every shift lead notices but no one has said anything because "she\'s still learning." This is textbook Ruinous Empathy — they care about her feelings but have failed to give her the information she needs to improve. You introduce the Radical Candor framework: pull her aside, tell her specifically what\'s wrong, show her the correct portion, and tell her why it matters. She corrects immediately. She later says it was the most useful coaching she\'d received. Two weeks of silence was not kindness.',
      'You have a shift lead who snaps at crew members during the rush. He\'s high-performing on metrics but the team dreads working with him. You have been avoiding the conversation because you don\'t want to lose his production. This is living in Ruinous Empathy toward the team and Obnoxious Aggression toward his culture impact. You apply Radical Candor: "Your results are excellent and your treatment of the crew is not acceptable. Both things are true. Here\'s what needs to change." He is surprised — no one has ever challenged his behavior before. The conversation changes his leadership trajectory.',
      'You\'ve been asking your team for feedback for months and getting silence. Then you share one specific piece of feedback you received about your own leadership and what you changed because of it. In the next meeting, three people offer honest observations about the store. You created the model. Candor is modeled from the top down before it flows bottom up.',
    ],
    chapterDeepDive: [
      { chapter: 'The Radical Candor Framework', summary: 'Scott opens with the 2x2 matrix that defines the entire book: the horizontal axis is "challenge directly" and the vertical axis is "care personally." Radical Candor lives in the top right — high on both dimensions. Most managers live in the bottom right (Ruinous Empathy) — high care, low challenge. The insight is that caring without challenging is not actually caring — it is protecting your own comfort at the expense of the other person\'s growth. For JM Valley managers, this framework provides immediate diagnostic value: which quadrant characterizes your last five feedback conversations?' },
      { chapter: 'The Art of Giving Guidance', summary: 'Scott provides a masterclass in the mechanics of feedback. Great praise is specific (what exactly did they do), sincere (you mean it), and timely (close to the event). Great criticism is kind (you care about the person), clear (they understand exactly what needs to change), and immediate (before the behavior becomes a pattern). The most common failure is vagueness — "great job" or "you need to do better" teach nothing. Scott\'s challenge to store managers: before your next piece of feedback, ask whether the person hearing it will know exactly what to do differently or keep doing.' },
      { chapter: 'Getting Feedback from Your Team', summary: 'One of the most practically important chapters in the book. Scott argues that the best way to create a feedback culture is to model it by soliciting feedback yourself — visibly, regularly, and by demonstrating that you act on what you hear. The technique: ask a specific question ("what is one thing I could do differently to make your job easier?"), listen without defending, thank them, and then follow up on what they told you. When your team sees that feedback moves to action, they start giving you real information instead of safe answers.' },
      { chapter: 'Creating a Culture of Guidance', summary: 'Feedback culture is not created by a single conversation or a training session — it is built through hundreds of small consistent moments over time. Scott\'s framework for culture-building: model it yourself (ask for and give feedback constantly), coach it in others (help your shift leads give better feedback), and hold the standard when it lapses (address Ruinous Empathy and Obnoxious Aggression when you see it). For JM Valley, this chapter reframes the book club itself as a culture-building activity: when managers discuss these frameworks together, they create shared language that makes candor easier.' },
      { chapter: 'The Hardest Cases: Hiring, Firing, and Promoting', summary: 'Scott extends Radical Candor to the hardest personnel decisions. Hiring someone you\'re not confident about is a form of Ruinous Empathy — you\'re protecting yourself from the discomfort of rejection at the expense of the team and the candidate. Keeping someone in a role they\'re failing is not kindness — it is a quiet cruelty that denies them the information they need to find their right role. Promoting someone prematurely is the same. Radical Candor in these moments means being honest about what you see, what you need, and what is fair — even when it is uncomfortable.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Radical-Candor-Audiobook/B01KTIEFDI',
    amazonUrl: 'https://www.amazon.com/Radical-Candor-Revised-Kick-Ass-Humanity/dp/1250235375',
  },
  {
    id: '5-levels-of-leadership',
    title: 'The 5 Levels of Leadership',
    author: 'John C. Maxwell',
    readCount: 1,
    aboutAuthor: 'John C. Maxwell is a #1 New York Times bestselling author, coach, and speaker who has sold more than 33 million books in fifty languages. In 2014 he was identified as the #1 leader in business by the American Management Association. He has trained more than 6 million leaders worldwide through his organizations.',
    importance: 'This book gives you a clear roadmap for your leadership journey — from Position (people follow because they have to) to Pinnacle (people follow because of who you are). Most store leaders operate at Level 1 or 2. The ROs who reach Level 3 (Production) and Level 4 (People Development) are the ones who build stores that run themselves. Maxwell shows you exactly what each level looks like and how to climb.',
    keyExcerpts: [
      { chapter: 'Level 1: Position', excerpt: 'People follow you because they have to. This is the entry level of leadership. The only influence you have at this level comes from your title. Don\'t stay here.' },
      { chapter: 'Level 2: Permission', excerpt: 'People follow you because they want to. When you connect with people and develop relationships, they give you permission to lead them beyond your title.' },
      { chapter: 'Level 3: Production', excerpt: 'People follow you because of what you have done for the organization. Results give you credibility. When you produce, you create momentum.' },
      { chapter: 'Level 4: People Development', excerpt: 'People follow you because of what you have done for them. The greatest leaders invest their time developing other leaders, not just followers.' },
      { chapter: 'Level 5: Pinnacle', excerpt: 'People follow you because of who you are and what you represent. This level is reserved for leaders who have spent a lifetime growing and developing others.' },
      { chapter: 'The Upside of Each Level', excerpt: 'Each level unlocks new rights and responsibilities. Level 2 gives you permission to lead. Level 3 gives you credibility through results. Level 4 gives you multiplication through people development.' },
      { chapter: 'The Downside of Level 1', excerpt: 'Leaders who stay at Position too long breed resentment. People will do what you say, but they won\'t give you their best. You have their presence without their hearts. That is a recipe for mediocrity.' },
      { chapter: 'Building Relationships at Level 2', excerpt: 'To lead at Level 2, you must love people. It requires genuine interest in who they are, what they value, and what they need. You can\'t fake Level 2. People know when you\'re going through the motions.' },
      { chapter: 'The Production Leader', excerpt: 'Level 3 leaders set the pace. They out-work, out-produce, and out-perform. They create a culture of results simply by modeling it. But if they stay at Level 3, they become a bottleneck — everything flows through them.' },
      { chapter: 'Developing People at Level 4', excerpt: 'The shift from Level 3 to Level 4 requires a profound identity change. You stop defining success by what you produce and start defining it by what the people you develop produce. Your results are now found in other people.' },
      { chapter: 'The Rare Level 5', excerpt: 'Very few leaders reach Level 5. It requires decades of faithful service, genuine sacrifice for others, and a reputation that transcends any single role or organization. It is not achieved — it is recognized.' },
      { chapter: 'Living at Multiple Levels', excerpt: 'You are never at the same level with everyone. You might be at Level 4 with your best shift lead and Level 2 with a new hire. Assessing your level with each person is the starting point for every development decision.' },
      { chapter: 'Moving Up Requires Letting Go', excerpt: 'To move from Level 3 to Level 4, you must let go of being the best operator in the room. Your ego may resist this. But the greatest act of a Level 3 leader is developing someone who surpasses them.' },
      { chapter: 'The Purpose of Leadership', excerpt: 'The purpose of leadership is to serve the people you lead by helping them become the best version of themselves. This is not an abstract principle — it is a daily choice about where you invest your attention.' },
    ],
    discussionQuestions: [
      'What level are you at with your team? Are you at different levels with different people?',
      'Maxwell says you can be at Level 4 with one person and Level 2 with another. Who needs you to level up?',
      'What would it take for you to move from Production (Level 3) to People Development (Level 4)?',
      'Who in your life operates at Level 5? What makes them different?',
      'Have you stayed at Level 1 (Position) with anyone on your team? What has been the cost?',
      'What does "letting go of being the best operator in the room" actually look like in your daily behavior?',
      'How do you know when someone has given you permission to lead them beyond your title?',
      'What result could you produce in the next 30 days that would build credibility at Level 3 with your team?',
      'Name one person you are intentionally developing to eventually surpass your current role.',
      'What does Level 5 leadership look like at the JM Valley scale? Who exemplifies it?',
      'If your team described your leadership level, what would they say?',
    ],
    howToApply: [
      'Honestly assess your level with each direct report. Write it down. Then create a plan to go up one level with each.',
      'If you\'re stuck at Level 1 (Position) with someone, invest in the relationship before trying to get results.',
      'To reach Level 3, focus on one measurable result you can achieve in the next 30 days that your team can see.',
      'To reach Level 4, identify one person you\'ll mentor this quarter and commit to developing their leadership capacity.',
      'Have a "levels conversation" with your shift leads: explain the model and ask them which level they are operating at. Make it a development tool, not a judgment.',
      'Schedule one pure "people development" hour per week — an hour with no operational agenda, just developing someone.',
      'Track your Level 4 progress: how many people have you moved up a role because of your deliberate investment in them?',
      'Practice the Level 4 identity shift: start measuring your success by what your team produces, not what you produce personally.',
      'Share the 5 Levels model with your newest manager and use it as a framework for their 90-day development plan.',
      'Use Level 5 thinking to ask: "What am I building that will outlast me in this role?"',
    ],
    keyTakeaways: [
      'Leadership has five levels — from positional authority (Level 1) to earned influence through a lifetime of developing others (Level 5).',
      'Most store leaders live between Level 1 and 3; reaching Level 4 requires a fundamental shift in identity — from producer to developer.',
      'You are never at the same level with every person; assess your level individually and lead accordingly.',
      'To move from Level 3 to Level 4, you must let go of being the best operator and invest in making others better.',
      'Level 4 leaders multiply themselves through people development; Level 3 leaders are always bottlenecks.',
      'The purpose of leadership is to serve those you lead by helping them become the best version of themselves.',
      'Your leadership level is not your title — it is what people follow you for.',
    ],
    storeScenarios: [
      'A newly promoted shift lead is at Level 1 with half his team — they follow his instructions because they have to, not because they respect him. You coach him through the Level 2 investment: spend one week doing nothing but connecting with each person on his team — learning their names, their situations, their goals. Within two weeks, the team\'s body language changes. He has permission now. The instructions land differently because the person giving them has changed.',
      'Your strongest RO is hitting every metric but the store collapses when she takes a day off. She is stuck at Level 3 — her results are real but entirely dependent on her personal execution. You have the Level 4 conversation: "Your store\'s success can\'t live in your hands alone. Who are you developing to run this shift as well as you do?" She identifies two candidates. You build a 60-day development plan together. Within two months, she takes a weekend off and the store runs cleanly. That\'s the Level 4 breakthrough.',
      'A DM reflects on her career and realizes that every store that thrived under her leadership did so because of the managers she developed — not because of any system she installed. She is operating at the edge of Level 4. You help her name it: her legacy is not the stores she ran, it is the leaders she built. This reframe changes how she thinks about every 1-on-1 and every coaching conversation going forward.',
    ],
    chapterDeepDive: [
      { chapter: 'Level 1: Position — Rights', summary: 'Maxwell describes Level 1 as the floor of leadership — the minimum. You have a title. People comply. But compliance without engagement is a fragile foundation. The danger at Level 1 is staying too long and concluding that compliance is the same thing as leadership. It isn\'t. For JM Valley shift leads who are newly promoted, this chapter is both a warning and a starting point: your title got you in the door, but it will not build the team you need. The work of leadership begins the moment you acknowledge that your authority alone is insufficient.' },
      { chapter: 'Level 2: Permission — Relationships', summary: 'Maxwell argues that you earn the right to lead people beyond your title by genuinely caring about them as human beings. This is not manipulation — it is the authentic investment of attention, curiosity, and care. The Level 2 insight for JM Valley managers: the crew members who work hardest for you are the ones who know you see them as people, not just labor. This level is built in small daily moments — remembering a name, asking a real question, being genuinely interested in the answer.' },
      { chapter: 'Level 3: Production — Results', summary: 'Level 3 leaders produce. They set the standard by their own performance. They create a culture of results through example, not just instruction. The trap of Level 3 is that production-obsessed leaders become bottlenecks — everything flows through them, and the store fails when they\'re absent. For JM Valley operators who are excellent at operations, this chapter is a gentle warning: your value as a leader is not your ability to make the best sub in the store. It is your ability to build a team that makes great subs consistently without you.' },
      { chapter: 'Level 4: People Development — Reproduction', summary: 'The most transformative chapter in the book for store operators. Maxwell argues that Level 4 requires a complete identity shift: you stop defining your success by what you produce and start defining it by what the people you develop produce. The indicators of a Level 4 leader: their stores perform well when they\'re absent, their best people go on to lead their own stores, and the culture they built outlasts their tenure. For JM Valley, reaching Level 4 is what separates operators who build lasting legacies from those who simply run good stores for a season.' },
      { chapter: 'The 5 Levels as a Daily Practice', summary: 'Maxwell closes by reframing the 5 Levels not as a career progression but as a daily practice. On every shift, in every interaction, you are operating at a level with each person you lead. The daily question is not "what level am I" but "what level am I with this person, in this moment, and what does moving up one level require from me today?" For JM Valley book club participants, this chapter makes the model immediately actionable: pick one relationship, identify the level, and make one intentional move toward the next level this week.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/The-5-Levels-of-Leadership-Audiobook/B006N14N24',
    amazonUrl: 'https://www.amazon.com/5-Levels-Leadership-Proven-Maximize/dp/1599953633',
  },
  {
    id: 'million-dollar-habits',
    title: 'Million Dollar Habits',
    author: 'Brian Tracy',
    readCount: 1,
    aboutAuthor: 'Brian Tracy is one of the world\'s top success experts. He has started, built, managed, or turned around 22 businesses. He has written 80+ books and produced 300+ audio and video learning programs. His goal-setting and personal development methods have transformed the lives of millions.',
    importance: 'This book connects the dots between daily habits and financial success. For store operators managing millions in annual revenue, the habits you build around inventory management, labor optimization, customer service, and team development directly determine your P&L. Tracy shows you the specific habits that separate top-performing managers from average ones — and how to install them systematically.',
    keyExcerpts: [
      { chapter: 'The Power of Habit', excerpt: 'Successful people are simply those with successful habits. Your habits determine 95% of everything you think, feel, do, and achieve.' },
      { chapter: 'The Habits of Top Businesspeople', excerpt: 'The most successful business operators have the habit of thinking about results before they start any task. They ask: What is the most valuable use of my time right now?' },
      { chapter: 'The Habits of Self-Made Millionaires', excerpt: 'Every self-made millionaire has developed the habit of saving and investing a percentage of their income — and reinvesting in their own skills and knowledge.' },
      { chapter: 'The Habit of Goal Setting', excerpt: 'Only 3% of adults have written goals. That 3% earns more than the other 97% combined. Writing down your goals is the single most powerful thing you can do for your future.' },
      { chapter: 'The Habit of Planning', excerpt: 'Every minute spent in planning saves ten minutes in execution. The habit of planning your day the night before is one of the most powerful productivity habits you can build. You arrive at work already knowing your top priority.' },
      { chapter: 'The Habit of Continuous Learning', excerpt: 'High performers read one hour per day in their field. They listen to educational audio in their cars. They attend seminars and courses. Over ten years, this habit creates an insurmountable competitive advantage.' },
      { chapter: 'The Habit of Health', excerpt: 'Your physical energy is the foundation of your mental and emotional performance. The habit of regular exercise, good nutrition, and adequate sleep is not optional for high performance — it is the prerequisite.' },
      { chapter: 'The Habit of Action', excerpt: 'High performers have a bias toward action. When they see a problem, they act. When they have an idea, they implement. The habit of acting before you feel ready is what separates performers from dreamers.' },
      { chapter: 'The Habit of People Building', excerpt: 'The most successful business operators invest consistently in the people around them. They mentor, develop, and challenge their teams. Their success is measured not in what they produce but in what their people produce.' },
      { chapter: 'The Habit of Customer Focus', excerpt: 'Million-dollar habits include the constant habit of asking: "How can I serve my customers better?" Every interaction is an opportunity to build loyalty. Loyalty is the only sustainable competitive advantage.' },
      { chapter: 'The Habit of Excellent Performance', excerpt: 'High performers commit to doing every job excellently. Not perfection — excellence. They understand that the habit of excellent work compounds over time into a reputation that opens doors and creates opportunities.' },
      { chapter: 'The Habit of Financial Management', excerpt: 'Successful operators track their numbers obsessively. They know their margins, their cost percentages, their labor ratios. The habit of financial awareness is what allows them to make smart decisions before problems become crises.' },
    ],
    discussionQuestions: [
      'What are your written goals for this year? This quarter? This month?',
      'Tracy says 95% of what we do is habitual. What habits are running your store on autopilot?',
      'What is the most valuable use of your time right now — and are you doing it?',
      'How much time per week do you invest in your own skills and knowledge?',
      'Tracy says people builders measure their success by what their team produces. Are you there yet?',
      'What does the habit of customer focus look like at your store — do you have a system for it or is it ad hoc?',
      'Do you review your store\'s financial metrics weekly? What would the habit of financial awareness change?',
      'What is the gap between your current habits and the habits of a million-dollar operator?',
      'Which of Tracy\'s habits do you already have? Which ones are you missing?',
      'Tracy says 3% of people have written goals. Are you in the 3%?',
      'What would your store look like in one year if you installed one new million-dollar habit per month?',
    ],
    howToApply: [
      'Write down your top 3 goals for the next 90 days. Review them every morning before your shift.',
      'Track one key metric daily for 30 days (labor %, customer complaints, on-time opens). The habit of tracking creates the habit of improving.',
      'Invest 30 minutes per day in learning — this book club, podcasts, or industry articles.',
      'Create a "habit audit" for your store — what happens automatically, and what falls through the cracks?',
      'Plan your next day the night before: identify your top 3 priorities and write them on a notepad before you leave the store.',
      'Install the habit of customer focus: every shift, identify one customer interaction that went above and beyond and share it at the next team huddle.',
      'Review your P&L weekly — not monthly, weekly. Build the habit of financial awareness before variances become crises.',
      'Build the "people building" habit into your schedule: one dedicated development conversation per shift, with a different team member each time.',
      'Install the habit of excellent performance as a team standard: define what "excellent" looks like for your top 5 daily tasks and post it where everyone can see.',
      'Build the habit of physical health for yourself: even a 15-minute walk before a long shift changes your energy and decision-making quality.',
    ],
    keyTakeaways: [
      'Successful people are simply those with successful habits — your 95% automated behavior is your ceiling.',
      'Written goals activate subconscious problem-solving and compound daily in ways that unwritten goals never can.',
      'The habit of continuous learning over 10 years creates an insurmountable competitive advantage.',
      'Million-dollar operators measure their success not by their own production but by what their people produce.',
      'Financial awareness — tracking numbers weekly — allows you to solve problems before they become crises.',
      'The habit of customer focus, practiced consistently, builds the loyalty that is the only sustainable competitive advantage.',
      'Excellence is a habit: doing every job well compounds into a reputation that opens doors.',
    ],
    storeScenarios: [
      'You\'ve been reviewing your P&L monthly, but Tracy\'s habit of financial awareness challenges you to go weekly. The first Monday you do it, you catch a food cost variance on deli meat that has been creeping for three weeks. You address it Tuesday. Had you waited for the monthly review, you would have paid for four more weeks of waste. The habit of weekly financial review pays for itself in the first month.',
      'Your store has excellent operators who never seem to grow into leadership roles. You realize you\'ve been building performers but not builders. You install Tracy\'s "people building" habit: every shift, identify one crew member showing leadership potential and give them one stretch task with coaching. Over three months, two crew members are ready for shift lead promotions. The habit of developing people creates a pipeline that management-by-instinct never does.',
      'A crew member who has been struggling with consistency improves dramatically after you switch from random correction to Tracy\'s habit of excellent performance framework: you define exactly what "excellent" looks like on her role (specific, measurable, observable), post it at her station, and check it against the definition — not against your mood. The clarity changes her performance because she finally knows exactly what the target looks like.',
    ],
    chapterDeepDive: [
      { chapter: 'The Foundation of Million-Dollar Habits', summary: 'Tracy opens by making a sweeping claim: success in every area of life is the predictable result of specific, learnable habits. This is not motivational rhetoric — it is a direct challenge to the belief that some people are just lucky or talented. The operators who build million-dollar stores do so through habits they installed deliberately, starting from nothing. For JM Valley managers, this chapter is both a permission slip (you can learn what they do) and an accountability mirror (you already know some of what you should be doing and aren\'t).' },
      { chapter: 'The Habit of Goal Setting', summary: 'Tracy presents the most researched finding in his body of work: people with clearly written goals earn ten times more than those without them, in the same industry, with the same education. The habit of goal-setting is not about motivation — it is about programming. Written goals activate your reticular activating system, which causes you to see opportunities and solutions you would otherwise miss. For JM Valley managers, the application is immediate: write three goals for this quarter, laminate them, and review them every morning. The results will surprise you within 30 days.' },
      { chapter: 'Habits of Top Business Operators', summary: 'This chapter is the most directly applicable to JM Valley store management. Tracy profiles the specific daily habits of high-performing business operators across industries: they plan their days the night before, they begin each day with their most important task, they continuously invest in their own development, they keep obsessive financial awareness, and they make customer service a daily discipline. For restaurant managers, this chapter is a checklist: which of these habits do you have? Which are missing? The gap between where you are and where you want to be is mostly a habits gap.' },
      { chapter: 'The Habit of Customer Focus', summary: 'Tracy argues that the single most powerful competitive advantage in any service business is customer loyalty — and that loyalty is built through consistent, deliberate, excellent customer focus. Not once in a while. Not when you feel like it. Every interaction, every day. For JM Valley, this chapter connects directly to the "A Sub Above" brand promise: unreasonable hospitality is not a marketing tagline, it is a daily operational habit. Tracy\'s challenge: can you point to a specific customer focus habit you practice systematically, or is it entirely dependent on individual mood and energy?' },
      { chapter: 'Building Million-Dollar Teams', summary: 'In his final major chapter, Tracy argues that million-dollar operators build million-dollar teams — and that team-building is itself a habit. The habits he describes: hiring slowly and carefully, developing people deliberately, recognizing excellent performance consistently, removing underperformers promptly, and creating a culture where the best people want to stay. For JM Valley managers, this chapter closes the loop between personal habits and organizational results: your team\'s performance is a direct reflection of your team-building habits over the past six to twelve months.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Million-Dollar-Habits-Audiobook/B002VA8ZDG',
    amazonUrl: 'https://www.amazon.com/Million-Dollar-Habits-Practical-Power-Packed/dp/1599186195',
  },
  {
    id: 'traction',
    title: 'Traction',
    author: 'Gino Wickman',
    readCount: 1,
    aboutAuthor: 'Gino Wickman is the creator of the Entrepreneurial Operating System (EOS), a practical method for achieving business success. He has been an entrepreneur since the age of 21 and has been coaching, teaching, and speaking to thousands of business owners and leaders for over 25 years. EOS is used by over 200,000 companies worldwide.',
    importance: 'This is the book that gave us the L10 meeting system, the accountability chart, rocks (quarterly goals), scorecards, and the IDS process. If you want to understand WHY we run our weekly meetings the way we do, and WHY the scorecard metrics matter, read Traction. It\'s the operating system behind the operating system. Every DM and RO should understand EOS because it\'s the framework that holds JM Valley together.',
    keyExcerpts: [
      { chapter: 'The EOS Model', excerpt: 'Most business problems come down to six key components: Vision, People, Data, Issues, Process, and Traction. Strengthen all six and you build an unstoppable organization.' },
      { chapter: 'The Level 10 Meeting', excerpt: 'The Level 10 Meeting is a weekly pulse check that keeps your leadership team aligned, accountable, and focused on what matters most. It follows a strict agenda: segue, scorecard, rock review, to-do list, IDS.' },
      { chapter: 'Rocks', excerpt: 'Rocks are your 90-day priorities — the 3 to 7 most important things that must get done this quarter. When everyone knows their rocks, the whole organization moves in the same direction.' },
      { chapter: 'IDS', excerpt: 'IDS stands for Identify, Discuss, and Solve. This is the framework for processing issues quickly and decisively. Most teams waste hours talking about problems. IDS forces a solution in minutes.' },
      { chapter: 'The Accountability Chart', excerpt: 'Every seat in the organization must be filled by the right person (shares your core values) in the right seat (has the skill and desire for the role). When both align, you get an A-player.' },
      { chapter: 'The Scorecard', excerpt: 'A scorecard is a weekly report with 5-15 numbers that give you an absolute pulse on your business. If you can\'t measure it, you can\'t manage it.' },
      { chapter: 'The Visionary and the Integrator', excerpt: 'Every business needs a Visionary — the dreamer, the idea generator — and an Integrator — the one who executes, resolves conflict, and creates accountability. When these two roles are misaligned, the organization stalls.' },
      { chapter: 'Core Values', excerpt: 'Core values define who you are. They are non-negotiable. The right people share them. The wrong people don\'t. Hiring, firing, praising, and disciplining should all happen in the context of your core values.' },
      { chapter: 'The Right People in the Right Seats', excerpt: 'There is a precise formula: Right People (who share your core values) + Right Seats (the right function for their skills and desires) = getting the right things done. One without the other creates dysfunction.' },
      { chapter: 'Issues List', excerpt: 'A healthy organization doesn\'t suppress issues — it surfaces them and solves them. The issues list is a running inventory of everything that needs to be addressed. If it\'s on the list, it will get solved. If it\'s not on the list, it will fester.' },
      { chapter: 'Process', excerpt: 'Documenting your core processes is the foundation of scalability. When the processes are documented and followed by all, you get consistent results. When they\'re in someone\'s head, you get consistent inconsistency.' },
      { chapter: 'Traction — Getting Things Done', excerpt: 'Traction means executing your vision with discipline and accountability. Most businesses fail not because the vision was wrong, but because the vision was never translated into specific actions with specific owners and specific deadlines.' },
      { chapter: 'The 90-Day World', excerpt: 'Humans can only maintain focus and urgency for about 90 days. Quarterly rocks take advantage of this natural rhythm — creating enough time to accomplish something meaningful and enough urgency to stay focused.' },
      { chapter: 'Healthy vs. Smart', excerpt: 'Wickman argues that being "smart" (strategy, marketing, finance) matters far less than being "healthy" (trust, communication, clarity, accountability). Healthy organizations make better decisions, faster, with less politics.' },
    ],
    discussionQuestions: [
      'We use L10 meetings at JM Valley. How closely do your weekly meetings follow the EOS format?',
      'What are your 3-7 rocks this quarter? Can you name them right now without looking?',
      'How effective is your IDS process? Do issues get solved or just discussed repeatedly?',
      'Wickman says "right person, right seat." Is everyone on your team in the right seat?',
      'What 5-15 numbers on a weekly scorecard would give you the true pulse of your store?',
      'Where does your organization have the Visionary-Integrator tension? How is it being managed?',
      'Do your core values affect your hiring and firing decisions? Or are they just words on a wall?',
      'What processes at your store live in someone\'s head that should be documented?',
      'How much of your weekly meeting is consumed by issues that recur week after week without resolution?',
      'What is the gap between your 90-day rocks and what you actually accomplished last quarter?',
      'Is your store "healthy" by Wickman\'s definition — clear, trust-based, accountable, good at IDS?',
      'What is the single biggest unresolved issue at your store that needs to be IDSed this week?',
    ],
    howToApply: [
      'Use the L10 format exactly as described: segue, scorecard, rock review, to-do list, IDS. Don\'t skip steps.',
      'Set 3-5 rocks (90-day priorities) for yourself and each shift lead. Review them weekly.',
      'When an issue comes up, use IDS: state the issue in one sentence, discuss for max 5 minutes, decide the solution and who owns it.',
      'Build a weekly scorecard: sales, labor %, food cost %, customer complaints, on-time opens, checklist completion, attestation completion.',
      'Conduct a "right seat" review of your team this quarter: assess each person on core values fit AND role capability separately.',
      'Document one core process per month in your store\'s playbook until every major operation has a written procedure.',
      'Create an issues list and keep it visible in the manager area. When a new issue surfaces, it goes on the list — not in your head.',
      'Run your L10 meeting with a timer. IDS segments should not exceed 20 minutes total. Discipline in the meeting creates discipline in the operation.',
      'At the start of every new quarter, hold a rocks-setting session: what are the 3-5 most important things we must get done in the next 90 days?',
      'Ask your team to identify one "unhealthy" behavior in the organization — one place where the truth isn\'t being told, or an issue is being swept under the rug. Put it on the issues list.',
    ],
    keyTakeaways: [
      'EOS\'s six components — Vision, People, Data, Issues, Process, Traction — address virtually every organizational problem in any business.',
      'Rocks (90-day priorities) harness the human capacity for focused urgency better than annual goals alone.',
      'IDS (Identify, Discuss, Solve) is the most efficient issue-resolution framework available for a leadership team.',
      'Right Person + Right Seat is the most important personnel equation in any organization.',
      'The scorecard creates absolute accountability — if you can\'t measure it, you can\'t manage it.',
      'Healthy organizations outperform smart ones because they make better decisions faster with less internal dysfunction.',
      'Process documentation is the foundation of scalability — tribal knowledge creates consistent inconsistency.',
    ],
    storeScenarios: [
      'Your weekly manager meeting keeps running over 90 minutes and issues are never truly resolved. You implement the L10 format exactly: 90 minutes, fixed agenda, IDS capped at 20 minutes. First meeting, people look at the clock nervously. Second meeting, they come prepared because they know time is limited. By the third meeting, two of your longest-running issues have been solved — because IDS forced a decision instead of another discussion. The format is not bureaucracy. The format is how you get traction.',
      'A shift lead has been in her role for eight months and still struggles with managing labor on slow days. You apply the right-person-right-seat framework honestly: she has the right values and character (right person) but needs more development in operational judgment (growing toward the right seat). You stop treating this as a performance problem and start treating it as a development gap. You create a 60-day coaching plan focused specifically on labor management. By the end, she\'s making good calls independently. She was always the right person — she just needed the seat to fit her better.',
      'Your store has no documented processes beyond the official Jersey Mike\'s training materials. When your best shift lead leaves for college, you lose three years of operational knowledge in one week. You implement EOS\'s process component: one process documented per week, reviewed by the next shift lead, refined until it works without the person who wrote it. In 90 days, your 12 core processes are documented. The next departure costs you ten minutes of knowledge transfer instead of weeks of re-learning.',
    ],
    chapterDeepDive: [
      { chapter: 'The EOS Model', summary: 'Wickman introduces his six-component framework as a complete operating system for any business. The components are: Vision (where are we going and why), People (do we have the right people in the right seats), Data (are we measuring what matters), Issues (do we surface and solve problems effectively), Process (are core operations documented and followed), and Traction (are we translating vision into executed priorities). The insight for JM Valley is that most store problems can be classified into one of these six areas — and that diagnosis is half the solution. The RO who can say "our issue is in the People component" or "our issue is in the Process component" is already ahead of the one who just says "everything is a mess."' },
      { chapter: 'The Vision Component', summary: 'Wickman argues that most organizational dysfunction stems from lack of shared vision — not disagreement, but genuine ambiguity about where the organization is going and why. He introduces the Vision/Traction Organizer (V/TO) as a tool for aligning a leadership team around a common destination. For JM Valley, this chapter reinforces the importance of DMs and ROs understanding not just their individual store goals but the district\'s five-year vision. When every leader can articulate the shared destination, daily decisions align automatically.' },
      { chapter: 'The People Component', summary: 'This is the most practically impactful EOS chapter for store managers. Wickman provides a precise framework: the Accountability Chart (not an org chart — a chart of functions and the person responsible for each), combined with the "Right Person, Right Seat" assessment (right person = shares core values; right seat = has the skill and desire for the role). For JM Valley, this chapter is an invitation to get brutally honest about your team: who has the right values but the wrong role, who has the right role but isn\'t a values fit, and what do those assessments require you to do?' },
      { chapter: 'The Data Component', summary: 'Wickman\'s scorecard concept is simple and powerful: every week, your leadership team reviews 5-15 numbers that give them an objective, unfiltered view of the business. No narratives, no context, no explanations — just the numbers and whether they\'re on track. For JM Valley, this chapter validates the RO Control scorecard system and challenges operators to identify their true pulse metrics. What are the 5-10 numbers that, if you knew them every Monday morning, would tell you everything you needed to know about your store\'s health?' },
      { chapter: 'Getting Traction — Rocks and L10 Meetings', summary: 'The final major chapter delivers EOS\'s most operationally relevant tools: rocks (90-day priorities owned by specific people) and the Level 10 Meeting (a weekly 90-minute pulse check with a disciplined agenda). Wickman\'s argument is that vision without execution is hallucination, and execution without accountability is abdication. Rocks create the first; L10 meetings create the second. For JM Valley, this chapter is the theoretical foundation for how the district\'s L10 meetings are structured — and a challenge to every manager to run their own version of traction at the store level.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Traction-Audiobook/B00CH3F1NA',
    amazonUrl: 'https://www.amazon.com/Traction-Get-Grip-Your-Business/dp/1936661837',
  },
  {
    id: 'leaders-eat-last',
    title: 'Leaders Eat Last',
    author: 'Simon Sinek',
    readCount: 1,
    aboutAuthor: 'Simon Sinek is a British-American author, motivational speaker, and organizational consultant. He is best known for popularizing the concept of "why" in his first TED Talk (the third most-watched TED Talk of all time) and his books Start with Why and The Infinite Game. He advises organizations from small startups to the Pentagon.',
    importance: 'The title says it all — and it\'s literal in the restaurant business. The best store leaders serve their team before themselves. They take the worst shifts, eat last at team meals, and put their people\'s needs first. Sinek explains the biology behind why this works: when leaders create safety, teams produce oxytocin and trust, which leads to extraordinary performance. This is why some stores thrive and others churn through employees.',
    keyExcerpts: [
      { chapter: 'Protection from Above', excerpt: 'When the people have to manage dangers from inside the organization, the organization itself becomes less able to face the dangers from outside.' },
      { chapter: 'The Circle of Safety', excerpt: 'When we feel safe inside the organization, we will naturally combine our talents and our strengths and work tirelessly to face the dangers outside and seize the opportunities.' },
      { chapter: 'Empathy', excerpt: 'Leadership is not about being in charge. It is about taking care of those in your charge.' },
      { chapter: 'The Courage to Do the Right Thing', excerpt: 'The true price of leadership is the willingness to place the needs of others above your own. Great leaders truly care about those they are privileged to lead.' },
      { chapter: 'The Biology of Trust', excerpt: 'When we feel safe, our brains release oxytocin, which makes us more trusting, generous, and cooperative. When we feel threatened, cortisol floods our system and we become self-protective.' },
      { chapter: 'Dopamine vs. Oxytocin', excerpt: 'Dopamine is the chemical of individual achievement — it feels good to hit a goal. Oxytocin is the chemical of human connection — it feels good to belong. The best leaders create cultures rich in both.' },
      { chapter: 'Why Good Leaders Make You Feel Safe', excerpt: 'The true test of leadership is not whether people follow you when times are good. The test is whether they trust you enough to tell you the truth when things are hard.' },
      { chapter: 'The Abstract Challenge', excerpt: 'The biggest threat to modern organizations is not competition — it is the abstraction of people. When leaders stop seeing their people as humans and start seeing them as metrics, the Circle of Safety collapses.' },
      { chapter: 'Integrity', excerpt: 'Integrity is not a quality you are born with. It is a practice. It means doing what you say, saying what you mean, and holding yourself to the same standards you hold others.' },
      { chapter: 'The Responsibility of Business', excerpt: 'A business exists not only to generate profit for shareholders but to provide opportunity, safety, and dignity to the people who do the work. When leaders forget this, the trust that makes performance possible disappears.' },
      { chapter: 'Leading the Next Generation', excerpt: 'The generation now entering the workforce grew up with technology as their primary social infrastructure. They hunger for real human connection, mentorship, and belonging. The leaders who provide it will build extraordinary teams.' },
      { chapter: 'The Marine Corps Model', excerpt: 'In the Marines, officers eat last — literally. This tradition communicates a clear message: your people\'s needs come before your own. It is not weakness. It is the highest form of leadership courage.' },
      { chapter: 'Social Capital', excerpt: 'Social capital — the trust and goodwill within an organization — is the invisible fuel that makes everything work. It is built through small, consistent acts of service and sacrifice. It is destroyed through self-interest and indifference.' },
    ],
    discussionQuestions: [
      'Sinek says "leaders eat last." Do you literally eat last at your store? Does your team notice?',
      'How safe does your team feel to make mistakes, ask questions, or challenge a decision?',
      'When was the last time you put a team member\'s needs above your own convenience?',
      'What is one thing you could do this week to expand the Circle of Safety at your store?',
      'Sinek talks about cortisol vs. oxytocin. What creates more cortisol (threat) at your store than it should?',
      'Do your team members feel like people or like metrics to you? How would they answer that question?',
      'When was the last time someone on your team told you the truth when it was hard?',
      'How do you model integrity — doing what you say and saying what you mean — in front of your team?',
      'What is the current level of social capital at your store? Is it building or depleting?',
      'How do you build a Circle of Safety for your generation Z employees who hunger for real connection?',
      'What internal threat (politics, favoritism, inconsistency) currently damages the Circle of Safety at your store?',
    ],
    howToApply: [
      'During the next team lunch or meeting, serve yourself last. It\'s symbolic but your team will notice.',
      'When someone makes a mistake, respond with "What happened?" instead of "Why did you do that?" — safety before accountability.',
      'Take the worst shift once a month. Work the position nobody wants. Show your team you\'re not above any task.',
      'If you fire someone, do it with dignity and compassion. How you treat people on their worst day defines your leadership.',
      'Identify one internal threat to your Circle of Safety (favoritism, inconsistent standards, gossip) and address it directly this week.',
      'Have a "biology of trust" conversation with your shift leads: explain cortisol and oxytocin in plain terms and ask what at the store creates more of each.',
      'Check your language during stressful moments: are you creating cortisol ("you\'re going to lose your job") or building oxytocin ("we\'re in this together, let\'s solve it")?',
      'Build social capital intentionally: one act of genuine service to a team member per shift, no agenda, no expectation of return.',
      'Create a "psychological safety" check-in at your monthly team meeting: "Is there anything happening at this store that makes it hard to do your best work? I want to know."',
      'Model integrity in the small things: if you say the kitchen closes at 9:50, close it at 9:50 even when it\'s inconvenient. Your team watches your consistency.',
    ],
    keyTakeaways: [
      'Leadership is not about being in charge — it is about taking care of those in your charge.',
      'The Circle of Safety eliminates internal threats so the team can focus energy on external challenges.',
      'Cortisol (threat) destroys trust and cooperation; oxytocin (connection and safety) creates it.',
      'Social capital — trust built through consistent small acts of service — is the fuel that makes extraordinary performance possible.',
      'Integrity is a daily practice: doing what you say, saying what you mean, holding yourself to the standards you hold others.',
      'When leaders eat last (literally and figuratively), they communicate that their people\'s needs come before their own.',
      'Teams that feel safe tell the truth — and truth-telling is the foundation of all effective problem-solving.',
    ],
    storeScenarios: [
      'Your store is understaffed on a Saturday lunch. Instead of calling in a crew member on their day off, you come in and work the line alongside your team. You say nothing about it. You don\'t announce the sacrifice. You just show up and work. By closing, three crew members have mentioned it to each other. One of them comes to you the following week and picks up a voluntary extra shift when you need coverage. Sinek\'s principle in action: service builds social capital that returns with interest.',
      'A crew member drops a tray of prepped sandwiches ten minutes before the rush. Her face goes white — she\'s waiting for the reaction. You say, "Okay, let\'s rebuild it together. What do we need?" No blame. No consequence beyond the loss of time. She works faster than you\'ve ever seen her work for the rest of the shift. You built oxytocin when she expected cortisol. She will not forget it.',
      'You notice that one of your shift leads is creating internal fear in his section by ranking crew members loudly in front of each other. The Circle of Safety is being damaged from inside. You have the conversation directly: "Your results are excellent. The way you\'re motivating people is creating fear, not performance. That\'s not our culture." You address it because leaders eat last means leaders protect their people — even from other leaders.',
    ],
    chapterDeepDive: [
      { chapter: 'The Biology of Leadership', summary: 'Sinek grounds the entire book in neuroscience: four key chemicals drive human behavior at work. Endorphins mask pain (useful for pushing through hard work). Dopamine rewards goal achievement (useful for individual motivation). Serotonin is the chemical of social status and recognition (it makes people feel proud and valued). Oxytocin is the chemical of trust, bonding, and genuine connection (it is the foundation of team performance). Sinek\'s argument is that the best leaders deliberately create environments where serotonin and oxytocin can flow — through recognition, connection, safety, and service.' },
      { chapter: 'The Circle of Safety', summary: 'The most operationally relevant chapter in the book. Sinek argues that every leader\'s primary job is to create a safe environment where people can focus their energy on external challenges (customers, competition, operational excellence) rather than internal threats (favoritism, inconsistency, judgment, retaliation). When the Circle of Safety is strong, teams innovate, communicate honestly, and perform at their ceiling. When it is broken — by politics, fear, or self-serving leadership — teams protect themselves instead of serving customers. For JM Valley managers, this chapter is a direct audit of your store\'s culture.' },
      { chapter: 'Why Leaders Eat Last', summary: 'This chapter traces the book\'s central metaphor to the United States Marine Corps, where officers literally eat last in the chow line. The tradition is not ceremonial — it communicates a foundational truth about leadership priority. For restaurant managers, the application is both literal (do you eat with your team or before them?) and metaphorical (do you take the best shift and leave the worst to others, or do you absorb the inconvenient needs of the operation first?). Sinek argues that small, consistent acts of sacrifice are the currency of genuine trust — and that trust, once built, enables extraordinary team performance.' },
      { chapter: 'The Courage to Lead', summary: 'Sinek distinguishes between authority and leadership: authority is given by a title; leadership is earned through courage. Courageous leadership means making decisions that serve the long-term health of your people even when the short-term result is costly. It means having the difficult conversation, taking the unpopular position, refusing to sacrifice a team member to protect yourself. For JM Valley, this chapter directly challenges every operator who has softened a standard to avoid conflict, kept an underperformer to avoid a hard conversation, or stayed silent about a problem to stay comfortable.' },
      { chapter: 'The Next Generation of Leaders', summary: 'Sinek closes with a challenge to leaders in the current era: the generation entering the workforce has grown up with digital connection as a substitute for human belonging — and they are hungry for the real thing. The leaders who create genuine circles of safety, who know their team members\' names and stories, who build cultures of trust rather than compliance, will attract and retain the best of this generation. For JM Valley, this chapter makes the case that investing in human connection at the store level is not just good culture — it is a direct competitive advantage in an industry where turnover is the number one cost.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Leaders-Eat-Last-Audiobook/B00GGSOX1A',
    amazonUrl: 'https://www.amazon.com/Leaders-Eat-Last-Together-Others/dp/1591848016',
  },
  {
    id: 'unreasonable-hospitality',
    title: 'Unreasonable Hospitality',
    author: 'Will Guidara',
    readCount: 1,
    aboutAuthor: 'Will Guidara is the former co-owner of Eleven Madison Park, which was named the #1 restaurant in the world in 2017. He is a passionate advocate for the power of hospitality to transform businesses and lives. His approach to guest experience has been adopted by companies far beyond the restaurant industry, from tech startups to Fortune 500 companies.',
    importance: 'This is the most directly applicable book to what we do every single day. Will Guidara turned a restaurant into the best in the world through relentless, creative, over-the-top hospitality. His examples will make you rethink every customer interaction at your store. The hot dog story alone will change how you think about going above and beyond. If Jersey Mike\'s stands for "A Sub Above," this book shows you what "above" really looks like.',
    keyExcerpts: [
      { chapter: 'The Birth of Unreasonable Hospitality', excerpt: 'I started to realize that the biggest opportunities to blow people\'s minds came not from the food or the wine, but from the way we made them feel.' },
      { chapter: 'Setting the Table', excerpt: 'Hospitality is a dialogue, not a monologue. It\'s about listening to what people need and responding in a way that makes them feel seen and valued.' },
      { chapter: 'The Hot Dog Story', excerpt: 'Sometimes the most powerful thing you can do is break every rule of fine dining to give someone exactly what they didn\'t know they wanted. That\'s unreasonable hospitality.' },
      { chapter: 'One Size Fits One', excerpt: 'True hospitality is not about treating everyone the same. It\'s about treating everyone as an individual. The best experiences feel personally crafted, because they are.' },
      { chapter: 'Legends', excerpt: 'We created "legends" — moments of extraordinary hospitality that became the stories guests told for years. These legends didn\'t cost much, but they were priceless in their impact.' },
      { chapter: 'Black Sheep', excerpt: 'Every rule exists for a reason. But every rule also has an exception. The best hospitality comes from knowing when to break the rules in service of the guest.' },
      { chapter: 'The Power of Presence', excerpt: 'True hospitality requires full presence. When you are distracted, your guests feel it. When you are fully there — attentive, curious, genuinely interested — guests feel that too. And they never forget it.' },
      { chapter: 'Empathy as a Skill', excerpt: 'Hospitality is the practice of empathy at scale. You are constantly reading people — their mood, their needs, what they\'re celebrating, what they\'re carrying — and responding accordingly. This is a skill, and it can be developed.' },
      { chapter: 'The Details That Matter', excerpt: 'Excellence in hospitality is not built in grand gestures. It is built in a thousand small details executed perfectly every time. The guest who returns again and again is returning because no detail was overlooked.' },
      { chapter: 'Creating a Culture of Hospitality', excerpt: 'You cannot teach people to be hospitable through a manual. You teach them by creating a culture where hospitality is the standard — where going above and beyond is normal, not exceptional.' },
      { chapter: 'Recovering from Mistakes', excerpt: 'How you handle a mistake is more important than the mistake itself. A great recovery can build more loyalty than a perfect experience. The guest remembers not that something went wrong, but that someone cared enough to make it right — and then some.' },
      { chapter: 'Leadership Through Hospitality', excerpt: 'The same principles that apply to guests apply to your team. If you want your people to create extraordinary experiences for guests, you must create extraordinary experiences for your people. Hospitality starts with your leadership.' },
      { chapter: 'The Business Case for Hospitality', excerpt: 'Hospitality is not a soft skill — it is a hard business strategy. The data is unambiguous: guests who feel genuinely cared for spend more, return more often, and tell more people. Investing in hospitality is the highest-return investment in the business.' },
    ],
    discussionQuestions: [
      'What would "unreasonable hospitality" look like at your Jersey Mike\'s location?',
      'When was the last time a customer told a story about their experience at your store? Was it positive?',
      'Guidara says hospitality is a dialogue, not a monologue. How well do you listen to your customers?',
      'What is one small, unexpected thing you could do for a regular customer this week?',
      'How do you teach your crew to be hospitable vs. just transactional?',
      'What is a "legend" you could create at your store? What would it cost? What would it be worth?',
      'Guidara says hospitality starts with how you treat your team. How hospitable are you as a leader to your own crew?',
      'When was the last time something went wrong with a customer\'s order? How was it handled? Was it a legendary recovery?',
      'What details at your store are consistently overlooked that a truly hospitality-focused team would never miss?',
      'How do you train your crew to read a customer\'s mood and adapt accordingly?',
      'Guidara argues that hospitality is the highest-return business strategy. Do you treat it as such — or as a nice-to-have?',
      'What would your store\'s "one size fits one" practice look like? How would you personalize the experience?',
    ],
    howToApply: [
      'Create a "legend" this week — do something unexpected for a customer. Remember their name. Give a kid a free cookie. Deliver a catering order with a handwritten note.',
      'Train your team to ask one question beyond the order: "First time here?" or "How\'s your day going?" — genuine connection.',
      'Keep a notebook of regular customers\' names and usual orders. Greet them by name.',
      'When something goes wrong with an order, don\'t just fix it — make it a legendary recovery. The complaint is the opportunity.',
      'Apply Guidara\'s leadership principle: host your team the way you want them to host customers. Create moments of recognition, surprise, and genuine care.',
      'Establish a weekly "legend story" practice: at every team meeting, someone shares a moment of hospitality that happened that week. Celebrate it. Let it set the standard.',
      'Teach your crew to identify the "hospitality opportunity" in every transaction — not the upsell, the moment to make someone feel genuinely seen.',
      'Apply "one size fits one" to your regular customers: do you know what each one usually orders? Have it started before they finish the sentence.',
      'Build a recovery protocol: when an order is wrong, the recovery is (1) apologize genuinely, (2) remake it immediately, (3) do something extra — a cookie, a thank you, a genuine moment of care.',
      'Make hospitality a daily metric: how many customers left your store with a story worth telling? Set a target and track it.',
    ],
    keyTakeaways: [
      'The most powerful hospitality comes not from the product but from making people feel genuinely seen, valued, and cared for.',
      'Hospitality is a dialogue, not a monologue — it requires listening, reading the guest, and responding to who they actually are.',
      '"One size fits one" means every interaction is an opportunity to personalize, not just to serve.',
      'Legends are created through small, thoughtful acts of unexpected generosity — they cost little and are remembered forever.',
      'How you handle a mistake matters more than the mistake itself — a legendary recovery builds more loyalty than a perfect experience.',
      'Hospitality starts with how leaders treat their own team — you cannot create a hospitable culture without modeling it.',
      'Hospitality is not a soft skill; it is a hard business strategy with measurable returns in loyalty, frequency, and referrals.',
    ],
    storeScenarios: [
      'A regular customer mentions in passing that today is her birthday. She orders her usual turkey sub. As she\'s paying, your crew member slips a cookie in the bag with a note: "Happy Birthday from your Jersey Mike\'s family." She comes back the next week and tells three friends about it. The cookie cost $0.30. The loyalty is worth fifty return visits. That is what a legend looks like at the Jersey Mike\'s scale.',
      'A catering order is ready five minutes late and the customer is visibly stressed — it\'s for a company lunch and she was counting on you. You don\'t just apologize. You walk the order to her car, help load it, and hand her a card with your direct number: "If anything is missing or wrong, call me personally. We\'re going to make this right." She calls later to say everything was perfect. She books her next four catering orders with you. Guidara\'s principle: the recovery is more powerful than perfection.',
      'During a busy Saturday rush, a dad is trying to order for three kids with different preferences, clearly overwhelmed. Your crew member stops, slows down, makes eye contact with each kid, and lets them each describe what they want directly. The dad exhales visibly. At the end he says "that was the best service I\'ve had anywhere in months." It took sixty extra seconds and changed how that family sees your store forever. Unreasonable hospitality at the fast-casual scale looks exactly like that.',
    ],
    chapterDeepDive: [
      { chapter: 'The Birth of Unreasonable Hospitality', summary: 'Guidara opens with a provocation: in a world where food quality and technical skill are increasingly commoditized, the only true differentiator is how you make people feel. His journey from good restaurant manager to world-class hospitality architect began with this simple realization. For JM Valley, this chapter is a direct challenge: if every Jersey Mike\'s in America makes the same sub, what makes your store the one people choose, return to, and tell their friends about? The answer is always the same — it is how your team makes people feel.' },
      { chapter: 'The Philosophy of Unreasonable Hospitality', summary: 'Guidara defines his philosophy: unreasonable hospitality means going so far beyond what is expected that the guest is genuinely surprised. It is not efficient. It is not scalable in the traditional sense. But it is extraordinarily powerful because it creates the emotional memories that build genuine loyalty. For JM Valley, this chapter is not an argument for violating company standards — it is an argument for using your discretion and creativity within those standards to create moments that your guests will remember and talk about.' },
      { chapter: 'One Size Fits One', summary: 'This chapter is a direct challenge to the industrial model of hospitality — treating every customer identically. Guidara argues that the most powerful hospitality experiences are the ones that feel personally crafted. For a fast-casual restaurant, this is not about custom menus — it is about remembering a name, asking a real question, noticing when someone is celebrating or struggling, and responding as a human rather than as a transaction processor. The crew member who greets a regular by name and says "your usual?" has just created an Eleven Madison Park moment at the Jersey Mike\'s scale.' },
      { chapter: 'Building a Culture of Hospitality', summary: 'Guidara\'s most important operational insight: you cannot hire for hospitality if your culture doesn\'t model it. If the manager is transactional with their team, the team will be transactional with customers. If the manager creates moments of genuine appreciation, surprise, and care for their people, those people will naturally extend the same energy to guests. This chapter challenges every JM Valley manager to examine whether they are hosting their own team — creating the same quality of experience for their crew that they want their crew to create for customers.' },
      { chapter: 'The Business Case', summary: 'Guidara closes with data: Eleven Madison Park\'s extraordinary hospitality program was not a cost center — it was the primary driver of the restaurant\'s financial success and global reputation. The lessons for JM Valley are direct: every act of unreasonable hospitality has a measurable return in customer lifetime value, referral revenue, and catering bookings. The crew member who spends sixty extra seconds creating a legend for a guest is not being inefficient — they are making the single highest-return investment available at that moment in your store.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/Unreasonable-Hospitality-Audiobook/B0B5BCXFNK',
    amazonUrl: 'https://www.amazon.com/Unreasonable-Hospitality-Remarkable-Giving-People/dp/0593418573',
  },
  {
    id: 'e-myth-revisited',
    title: 'The E-Myth Revisited',
    author: 'Michael E. Gerber',
    readCount: 1,
    aboutAuthor: 'Michael E. Gerber is the world\'s #1 small business guru according to Inc. Magazine. He has written 28 E-Myth books, built 18 companies, and his ideas have helped transform hundreds of thousands of businesses worldwide. His core insight — that most businesses fail because they\'re run by technicians, not entrepreneurs — has changed how an entire generation thinks about business.',
    importance: 'This is the book that teaches you to work ON your business, not IN it. Every JM Valley operator needs this shift in mindset. If you\'re the one making subs, you\'re not leading. Gerber\'s franchise model (build systems so anyone can replicate the result) is literally what we\'re doing with RO Control — systemizing every operation so your store runs the same whether you\'re there or not.',
    keyExcerpts: [
      { chapter: 'The E-Myth', excerpt: 'The fatal assumption is: if you understand the technical work of a business, you understand a business that does that technical work. They are completely different things.' },
      { chapter: 'The Entrepreneur, the Manager, and the Technician', excerpt: 'Every business owner is three people in one: the Entrepreneur who dreams, the Manager who plans, and the Technician who does. Most small businesses fail because the Technician runs the show.' },
      { chapter: 'Working ON Your Business', excerpt: 'Your business is not your life. Your business is a system for producing results. If you have to be there for it to work, you don\'t own a business — you own a job.' },
      { chapter: 'The Franchise Prototype', excerpt: 'The franchise model forces you to build a business that works without you. Document every process, create systems for everything, and train people to follow those systems perfectly.' },
      { chapter: 'The Turn-Key Revolution', excerpt: 'A business that depends on you is not a business — it\'s a job. And it\'s the worst job in the world because you\'re working for a lunatic.' },
      { chapter: 'The Business Development Process', excerpt: 'Innovation, quantification, and orchestration. First, innovate a better way. Then, quantify the results. Finally, orchestrate it so anyone can replicate it every time.' },
      { chapter: 'The Childhood of a Business', excerpt: 'Every business starts in the Infancy stage — when the owner is the business. Growth requires the business to survive the owner\'s absence. The entrepreneur who cannot let go stays trapped in infancy forever.' },
      { chapter: 'Adolescence and the Need for Help', excerpt: 'As a business grows, the Technician-owner tries to delegate but doesn\'t have systems to delegate to. They give work to people but not context, procedures, or training. The result: chaos.' },
      { chapter: 'Beyond the Comfort Zone', excerpt: 'Every business that fails to mature does so because the owner\'s comfort zone becomes the business\'s ceiling. Growth requires the owner to operate beyond their comfort zone — to become an entrepreneur even when every instinct says to be a technician.' },
      { chapter: 'Your Primary Aim', excerpt: 'Gerber asks: what do you want your life to look like? Not your business — your life. The business exists to serve the life, not the other way around. The business should give you freedom, not consume you.' },
      { chapter: 'Your Strategic Objective', excerpt: 'A strategic objective is a very clear statement of what your business looks like when it is done. It is both a vision and a standard. Everything you build in the business either moves you toward that objective or it doesn\'t.' },
      { chapter: 'People Strategy', excerpt: 'People in a great business are not told what to do — they are given a system to work within. The system runs the business; people run the system. When the system is clear, excellent people thrive and average people perform above their natural level.' },
      { chapter: 'The Management System', excerpt: 'A management system is a system for managing people to produce the results you want. It replaces heroic individual performance with reliable, systemic performance. It is the antidote to the owner\'s dependency trap.' },
    ],
    discussionQuestions: [
      'Could your store run smoothly for a week without you? If not, what would break first?',
      'Are you the Entrepreneur, the Manager, or the Technician in your daily work? Which should you be more of?',
      'What processes at your store exist only in someone\'s head? How would you document them?',
      'Gerber says "your business is a system." What system at your store is broken or missing?',
      'How much time do you spend working IN the business vs. ON the business?',
      'What is your store\'s equivalent of Gerber\'s "franchise prototype" — the way the store should run perfectly every day?',
      'What would your strategic objective (the store\'s ideal state when "done") look like?',
      'Gerber says the system runs the business; people run the system. Do your people have a clear system to run?',
      'What would change about your role if you operated like an entrepreneur instead of a technician?',
      'What is the one process at your store that is most dependent on a specific person\'s knowledge?',
      'How does RO Control\'s checklist and attestation system fulfill Gerber\'s "franchise prototype" vision?',
    ],
    howToApply: [
      'Pick one process this week (opening, closing, prep) and document it step-by-step so anyone could follow it.',
      'Test your systems: have your newest employee run the process from the documentation alone. Where do they get stuck?',
      'Schedule 2 hours per week for "working ON the business" — not making subs, not solving problems, but improving systems.',
      'Use RO Control\'s checklist system to turn your tribal knowledge into repeatable processes that any shift lead can execute.',
      'Write your store\'s strategic objective: what does the ideal version of your store look like in 90 days? In one year?',
      'Identify the three things at your store that only you can do. Then systematize two of them so someone else can do them.',
      'Implement the Business Development Process for one recurring problem: innovate a solution, quantify its impact, then orchestrate it into a repeatable procedure.',
      'Conduct an "owner dependency audit": list every task that stops working when you\'re not there. Prioritize systemizing the top three.',
      'Build a training manual section for each role at your store. The test: a new hire should be able to reach 80% proficiency by following the manual alone.',
      'Apply Gerber\'s test to your store: if you sold it tomorrow, would the new owner be able to run it from your documentation? If not, you own a job, not a business.',
    ],
    keyTakeaways: [
      'Most businesses fail not because owners lack passion or skill, but because technicians are running businesses that need entrepreneurs.',
      'The goal of every business is to build a system that works without the owner — to own a business, not a job.',
      'The franchise prototype mindset means documenting every process so that anyone can execute it consistently.',
      '"Innovation, quantification, orchestration" is the loop for improving any system: try a better way, measure the result, make it the standard.',
      'The system runs the business; people run the system — clarity of process enables people to perform above their natural level.',
      'Working ON the business (improving systems, developing people) is more valuable than working IN it (making subs, solving problems).',
      'Your business exists to serve your life — not the other way around.',
    ],
    storeScenarios: [
      'You return from a week of vacation to find your store in chaos. Nothing was documented, the shift leads did everything "their own way," and two food safety logs were incomplete. This is the E-Myth problem in live action: your store depended on you, not on systems. You spend the next two weeks building a three-part opening protocol, a closing protocol, and a temperature log procedure — all written so clearly that your most junior shift lead can execute them perfectly. The next vacation is chaos-free.',
      'Your best RO is resisting the checklist system because "I already know what needs to be done." You show her Gerber\'s principle: "When the process lives in your head, it dies when you leave or get sick. When it\'s documented, it belongs to the store forever." She writes the process down. Three months later, she promotes a new shift lead who runs the opening protocol correctly from day one. She says it was the most useful thing she built all year.',
      'A new investor visits two stores in the district. One has three binders of documented processes, a training manual for each role, and checklists that run the store automatically. The other relies on the manager\'s memory and hustle. The investor asks which store they can scale. The answer is obvious. Gerber\'s message: systems are not bureaucracy, they are how you multiply yourself without being present.',
    ],
    chapterDeepDive: [
      { chapter: 'The Entrepreneurial Myth', summary: 'Gerber opens with a devastating diagnosis: most people who start or run businesses do so because they are good at a specific technical skill, and they believe that skill qualifies them to run a business built around it. A great chef opens a restaurant. A great sandwich maker becomes a franchise operator. But technical excellence and business management are completely different skills. The restaurant industry is littered with excellent technicians who built their businesses into traps — jobs they can never leave, operations that collapse without their constant presence.' },
      { chapter: 'The Three Personalities', summary: 'Gerber\'s most useful framework: every business owner contains three distinct personalities — the Entrepreneur (dreamer, creator, visionary), the Manager (organizer, systematizer, planner), and the Technician (executor, craftsman, doer). In a healthy business, all three are present in balance. In most small businesses, the Technician dominates — creating a business that produces excellent work but cannot scale, delegate, or survive the owner\'s absence. For JM Valley operators, the question is direct: which personality is running your store today, and which one should be?' },
      { chapter: 'The Franchise Prototype', summary: 'Gerber argues that every business — whether or not it is actually a franchise — should be built as if it could be franchised. This means: every process is documented, every standard is explicit, every role has a clear description, and the result is consistent whether or not the founder is present. The insight for JM Valley is striking: we are literally a franchise operation, which means the infrastructure for this already exists. The question is whether individual operators are using it as the tool it is, or bypassing it to rely on personal heroics.' },
      { chapter: 'The Business Development Process', summary: 'Gerber introduces a three-step loop for building great business systems: Innovate (find a better way to do something), Quantify (measure whether it actually works better), and Orchestrate (make the better way the standard procedure everyone follows). For JM Valley store managers, this is the framework for every operational improvement. The manager who tries something new in the lineup briefing, tracks whether it reduces wait time, and then builds it into the SOP is practicing the Business Development Process — whether they know Gerber\'s name or not.' },
      { chapter: 'Your Primary Aim', summary: 'Gerber ends the book with a question that catches many business owners off guard: what do you want your life to look like? Not your quarterly targets, not your operational goals — your life. He argues that the business should exist to serve the life, not the other way around. For JM Valley managers who are working 60-hour weeks just to keep their stores running, this chapter is both a diagnosis and a challenge. The business that requires your constant presence is not serving your life — it is consuming it. Building systems is not just good operations; it is reclaiming your time.' },
    ],
    audibleUrl: 'https://www.audible.com/pd/The-E-Myth-Revisited-Audiobook/B002V1LGZE',
    amazonUrl: 'https://www.amazon.com/Myth-Revisited-Small-Businesses-About/dp/0887307280',
  },
];

const DEFAULT_FAVORITES = ['atomic-habits', 'traction', 'multi-unit-leadership', 'unreasonable-hospitality', 'leaders-eat-last'];

// Quiz questions per book (20 per book, 90% = 18/20 to pass — all answers found in this page's content)
const QUIZ_PASS_THRESHOLD = 0.9; // 90% — need 18/20 to pass
const BOOK_QUIZZES = {
  'atomic-habits': [
    { q: 'James Clear says you do not rise to your goals, you fall to the level of your ___.', opts: ['Habits', 'Systems', 'Motivation', 'Discipline'], a: 1 },
    { q: 'A 1% daily improvement compounds to roughly how much better after one year?', opts: ['37x better', '10x better', '100x better', '3x better'], a: 0 },
    { q: 'Which of the Four Laws of behavior change is "Make It Easy"?', opts: ['1st Law', '2nd Law', '3rd Law', '4th Law'], a: 2 },
    { q: 'Identity-based habits start with asking: who do I want to ___?', opts: ['Achieve', 'Become', 'Impress', 'Manage'], a: 1 },
    { q: 'Habit stacking format is: After I [current habit], I will ___.', opts: ['Rest', 'Perform a new habit', 'Reward myself', 'Review goals'], a: 1 },
    { q: 'The Plateau of Latent Potential means habits appear to make no difference until you cross a ___.', opts: ['Goal line', 'Critical threshold', 'Comfort zone', 'Mindset shift'], a: 1 },
    { q: 'Pointing-and-Calling raises habit awareness from ___ to conscious.', opts: ['Emotional', 'Nonconscious', 'Physical', 'Behavioral'], a: 1 },
    { q: 'The Cardinal Rule of Behavior Change: what is immediately rewarded is ___.', opts: ['Forgotten', 'Repeated', 'Questioned', 'Improved'], a: 1 },
    { q: 'Clear says the most effective way to change your habits is to focus on who you wish to ___.', opts: ['Achieve', 'Impress', 'Become', 'Manage'], a: 2 },
    { q: 'The 1st Law of Behavior Change — Make It Obvious — starts with ___.', opts: ['Reward', 'Awareness', 'Action', 'Identity'], a: 1 },
    { q: 'Clear says the 2nd Law (Make It Attractive) works because we adopt habits that are ___ by our culture.', opts: ['Required', 'Praised and approved', 'Tracked', 'Scheduled'], a: 1 },
    { q: 'Habit formation is the process by which a behavior becomes more ___ through repetition.', opts: ['Creative', 'Automatic', 'Social', 'Scheduled'], a: 1 },
    { q: 'Every action you take is a ___ for the type of person you wish to become.', opts: ['Statement', 'Vote', 'Promise', 'Goal'], a: 1 },
    { q: 'Clear\'s systems-over-goals insight means: systems are about the ___ that lead to results.', opts: ['Habits', 'Processes', 'Goals', 'Metrics'], a: 1 },
    { q: 'Which law says: "What is immediately rewarded is repeated; what is immediately punished is avoided"?', opts: ['1st Law', '2nd Law', '3rd Law', '4th Law'], a: 3 },
    { q: 'The Habit Scorecard in practice involves writing down daily habits and ___ them each day.', opts: ['Skipping', 'Checking off', 'Measuring in detail', 'Emailing to your boss'], a: 1 },
    { q: 'To make good habits obvious, Clear recommends putting cues ___ in your environment.', opts: ['Hidden away', 'Prominently visible', 'On your phone', 'In your head'], a: 1 },
    { q: 'Clear says: "Goals are about the results you want to achieve. Systems are about the ___ that lead to those results."', opts: ['Resources', 'Processes', 'People', 'Schedules'], a: 1 },
    { q: 'Removing friction from desired behaviors is a key strategy under which law?', opts: ['Make It Obvious', 'Make It Attractive', 'Make It Easy', 'Make It Satisfying'], a: 2 },
    { q: 'The Plateau of Latent Potential is also described as the ___ where habits compound before becoming visible.', opts: ['Learning curve', 'Valley of disappointment', 'Growth phase', 'Habit loop'], a: 1 },
  ],
  'high-performance-habits': [
    { q: 'How many habits does Brendon Burchard identify for high performance?', opts: ['4', '5', '6', '7'], a: 2 },
    { q: 'Which habit involves finding deeper meaning and urgency in daily work?', opts: ['Seek Clarity', 'Generate Energy', 'Raise Necessity', 'Develop Influence'], a: 2 },
    { q: 'High performers manage their time AND their ___.', opts: ['Money', 'Transitions', 'Team', 'Goals'], a: 1 },
    { q: 'Demonstrating courage means taking action despite ___.', opts: ['Success', 'Praise', 'Fear', 'Resources'], a: 2 },
    { q: 'High performers are clear on what will bring them the greatest ___.', opts: ['Salary', 'Fame', 'Meaning', 'Control'], a: 2 },
    { q: 'Developing Influence means challenging people to grow and giving them ___.', opts: ['Orders', 'Confidence', 'Warnings', 'Deadlines'], a: 1 },
    { q: 'The secret to productivity for high performers is identifying the ___ that matter.', opts: ['People', 'Outputs', 'Systems', 'Meetings'], a: 1 },
    { q: 'High performers don\'t stumble into greatness — they ___ these six habits daily.', opts: ['Avoid', 'Practice', 'Teach', 'Measure'], a: 1 },
    { q: 'Generating Energy includes managing your ___, emotional states, and physical wellbeing.', opts: ['Calendar', 'Transitions', 'Budget', 'Team size'], a: 1 },
    { q: 'Burchard says high performers share their ideas, stand up for others — they demonstrate ___.', opts: ['Intelligence', 'Courage', 'Authority', 'Patience'], a: 1 },
    { q: 'Raising Necessity means associating a deeper level of ___ with daily activities.', opts: ['Stress', 'Meaning and urgency', 'Competition', 'Recognition'], a: 1 },
    { q: 'The six habits are described as ___ habits — not natural traits.', opts: ['Inherited', 'Deliberate', 'Effortless', 'Automatic'], a: 1 },
    { q: 'High performers shape how others think about ___ and their abilities.', opts: ['The company', 'Themselves', 'The competition', 'The future'], a: 1 },
    { q: 'Seek Clarity means being clear on who you want to be AND how you want to ___.', opts: ['Earn more', 'Interact with others', 'Be remembered', 'Lead meetings'], a: 1 },
    { q: 'Burchard\'s research found that the six habits were consistently practiced by ___ across all fields.', opts: ['Beginners', 'Top performers', 'Executives only', 'Young leaders'], a: 1 },
    { q: 'High performers focus on producing quality work in the output areas that ___.', opts: ['Are easiest', 'Matter most', 'Others ignore', 'Take least time'], a: 1 },
    { q: 'Increase Productivity is about focusing obsessively on outputs, not on being ___.', opts: ['Strategic', 'Busy', 'Visible', 'Liked'], a: 1 },
    { q: 'To generate energy when needed, high performers have mastered the art of managing their ___.', opts: ['Schedule blocks', 'Emotional and physical state', 'Staff assignments', 'Meeting agendas'], a: 1 },
    { q: 'Burchard says if you feel that what you\'re doing truly matters, you perform at a ___ level.', opts: ['More comfortable', 'Higher', 'Steadier', 'Different'], a: 1 },
    { q: 'The sixth habit — demonstrating courage — includes doing the right thing even when it\'s ___.', opts: ['Efficient', 'Convenient', 'Hard', 'Profitable'], a: 2 },
  ],
  'multi-unit-leadership': [
    { q: 'Jim Sullivan says the biggest career leap in restaurants is going from single-unit to ___ management.', opts: ['Corporate', 'Franchise', 'Multi-unit', 'Regional'], a: 2 },
    { q: 'Sullivan recommends investing 80% of development time on your ___.', opts: ['Weakest performers', 'Top performers', 'Middle performers', 'Newest hires'], a: 1 },
    { q: 'Delegation includes clear expectations, resources, and a deadline. Abdication is ___.', opts: ['Better for complex tasks', 'Dumping a task and hoping for the best', 'The same as delegation', 'Preferred by MULs'], a: 1 },
    { q: 'The 4th stage of multi-unit development is:', opts: ['Doer', 'Coach', 'Leader', 'Supervisor'], a: 2 },
    { q: 'Multi-unit leaders manage the ___ who manage the restaurant.', opts: ['Systems', 'People', 'Budget', 'Schedule'], a: 1 },
    { q: 'Every store visit should have a purpose, a plan, and a ___.', opts: ['Scorecard', 'Follow-up', 'Celebration', 'Critique'], a: 1 },
    { q: 'Consistency is described as the ___ of multi-unit leadership.', opts: ['Foundation', 'Goal', 'Currency', 'Challenge'], a: 2 },
    { q: 'Your success as a MUL is determined by the quality of your ___.', opts: ['Menu', 'General managers', 'Marketing', 'Store design'], a: 1 },
    { q: 'The best MULs don\'t just inspect stores — they inspect AND ___ simultaneously.', opts: ['Report', 'Develop', 'Audit', 'Score'], a: 1 },
    { q: 'Stage 1 of multi-unit development (Doer) means the leader says "I ___ it."', opts: ['Delegate', 'Watch you do', 'Do', 'Coach you to do'], a: 2 },
    { q: 'Stage 2 of multi-unit development (Supervisor) means "I ___ you do it."', opts: ['Teach', 'Watch', 'Replace', 'Grade'], a: 1 },
    { q: 'Sullivan says: customers don\'t care which location they visit — they expect the same ___ every time.', opts: ['Price', 'Quality, speed, and experience', 'Layout', 'Promotions'], a: 1 },
    { q: 'What should a standardized store visit checklist include beyond inspection items?', opts: ['A closing time', 'A development conversation', 'A sales pitch', 'A social media post'], a: 1 },
    { q: 'Sullivan recommends monthly ___ development sessions with your top ROs or SLs.', opts: ['Performance review', '1-on-1', 'Group training', 'Scorecard meeting'], a: 1 },
    { q: 'Your "playbook" should document the ___ things that must happen the same way every day.', opts: ['5', '10', '20', '50'], a: 2 },
    { q: 'Stage 3 of multi-unit development (Coach) means "I ___ you to do it."', opts: ['Observe', 'Grade', 'Develop', 'Watch'], a: 2 },
    { q: 'Stage 4 of multi-unit development (Leader) means "I develop ___ who develop others."', opts: ['Systems', 'Leaders', 'Processes', 'Teams'], a: 1 },
    { q: 'Sullivan says the delegation framework should include: what needs to be done, why it matters, what "done well" looks like, when it\'s due, and what ___ they need.', opts: ['Pay they get', 'Support', 'Approval', 'Recognition'], a: 1 },
    { q: 'The multi-unit leader\'s primary job is not managing operations — it\'s managing ___.', opts: ['Schedules', 'People who manage operations', 'Customers', 'Inventory'], a: 1 },
    { q: 'Sullivan says top multi-unit leaders develop their ___ performers most, not their bottom ones.', opts: ['Average', 'Newest', 'Top', 'Weakest'], a: 2 },
  ],
  'traction': [
    { q: 'EOS stands for:', opts: ['Employee Operations System', 'Entrepreneurial Operating System', 'Executive Outcomes Strategy', 'Essential Operations Standard'], a: 1 },
    { q: 'The Level 10 Meeting agenda begins with which item?', opts: ['Rock review', 'Scorecard', 'Segue', 'IDS'], a: 2 },
    { q: 'EOS has how many key components?', opts: ['4', '5', '6', '8'], a: 2 },
    { q: 'Rocks in EOS are your top priorities for the ___.', opts: ['Day', 'Week', 'Quarter', 'Year'], a: 2 },
    { q: 'IDS stands for Identify, Discuss, and ___.', opts: ['Share', 'Schedule', 'Solve', 'Summarize'], a: 2 },
    { q: 'A scorecard in EOS should have ___ weekly numbers.', opts: ['1–3', '5–15', '20–30', '50+'], a: 1 },
    { q: 'The Accountability Chart ensures every seat is filled by the right person in the right ___.', opts: ['Building', 'Seat', 'Time', 'Role'], a: 1 },
    { q: 'Wickman says if you can\'t measure it, you can\'t ___ it.', opts: ['Grow', 'Manage', 'Scale', 'Improve'], a: 1 },
    { q: 'The six EOS components include Vision, People, Data, Issues, Process, and ___.', opts: ['Goals', 'Traction', 'Systems', 'Revenue'], a: 1 },
    { q: 'IDS forces a solution to issues in ___ rather than hours of circular discussion.', opts: ['Seconds', 'Minutes', 'Days', 'Weeks'], a: 1 },
    { q: 'Rocks should be the ___ most important things that must get done this quarter.', opts: ['1 to 2', '3 to 7', '10 to 15', '20+'], a: 1 },
    { q: 'A scorecard gives you an absolute ___ on your business each week.', opts: ['Report', 'Pulse', 'Summary', 'Analysis'], a: 1 },
    { q: 'An A-player in EOS is someone who shares your ___ values and has the skill and desire for the role.', opts: ['Financial', 'Core', 'Personal', 'Operational'], a: 1 },
    { q: 'The Level 10 Meeting is described as a ___ pulse check that keeps the leadership team aligned.', opts: ['Daily', 'Monthly', 'Weekly', 'Quarterly'], a: 2 },
    { q: 'L10 stands for Level ___ Meeting in EOS.', opts: ['5', '8', '10', '15'], a: 2 },
    { q: 'Wickman says most business problems come down to six key ___.', opts: ['People', 'Components', 'Processes', 'Issues'], a: 1 },
    { q: 'When everyone knows their Rocks, the whole organization moves in the same ___.', opts: ['Speed', 'Direction', 'Style', 'Budget'], a: 1 },
    { q: 'The L10 agenda item "to-do list" reviews action items from the ___ meeting.', opts: ['Last week\'s', 'Last month\'s', 'Last quarter\'s', 'Today\'s'], a: 0 },
    { q: 'Wickman says "strengthen all six components and you build an ___ organization."', opts: ['Efficient', 'Unstoppable', 'Scalable', 'Profitable'], a: 1 },
    { q: 'The EOS scorecard metrics suggested for a store include sales, labor %, food cost %, and ___.', opts: ['Revenue growth', 'Customer complaints', 'Investor returns', 'Market share'], a: 1 },
  ],
  'leaders-eat-last': [
    { q: 'Sinek\'s "Circle of Safety" creates a culture of ___ and trust.', opts: ['Competition', 'Belonging', 'Accountability', 'Recognition'], a: 1 },
    { q: 'Which chemical does Sinek associate with the feeling of belonging and trust?', opts: ['Dopamine', 'Cortisol', 'Serotonin', 'Oxytocin'], a: 3 },
    { q: 'The title "Leaders Eat Last" comes from which organization\'s practice?', opts: ['Special Forces', 'US Marine Corps', 'Navy SEALs', 'Army Rangers'], a: 1 },
    { q: 'Sinek says self-interest over team is what destroys ___ in organizations.', opts: ['Revenue', 'Trust', 'Culture', 'Morale'], a: 1 },
    { q: 'When people feel safe inside the organization, they face external dangers ___.', opts: ['Reluctantly', 'More effectively', 'Alone', 'With anxiety'], a: 1 },
    { q: 'Leadership is not about being in charge — it\'s about taking care of those ___.', opts: ['You manage', 'In your charge', 'Who perform best', 'Who follow rules'], a: 1 },
    { q: 'When the team feels threatened, which chemical floods their system making them self-protective?', opts: ['Dopamine', 'Serotonin', 'Cortisol', 'Oxytocin'], a: 2 },
    { q: 'The true price of leadership is placing the needs of ___ above your own.', opts: ['Shareholders', 'Others', 'Your boss', 'Customers'], a: 1 },
    { q: 'When leaders create safety, teams produce ___ and trust.', opts: ['Dopamine', 'Serotonin', 'Cortisol', 'Oxytocin'], a: 3 },
    { q: 'Sinek says great leaders truly ___ about those they are privileged to lead.', opts: ['Know everything', 'Care', 'Monitor', 'Challenge'], a: 1 },
    { q: 'When people have to manage dangers from ___ the organization, they become less able to face outside challenges.', opts: ['Outside', 'Above', 'Inside', 'Below'], a: 2 },
    { q: 'The biology of trust chapter links the Circle of Safety to which chemical response?', opts: ['Adrenaline for performance', 'Oxytocin for trust and cooperation', 'Dopamine for reward', 'Cortisol for focus'], a: 1 },
    { q: 'Sinek says some stores thrive while others churn through employees because of how leaders create ___.', opts: ['Profit', 'Safety', 'Schedules', 'Rules'], a: 1 },
    { q: 'Taking the worst shift once a month demonstrates which leadership principle?', opts: ['Authority', 'Leaders eat last', 'Safety protocols', 'Accountability'], a: 1 },
    { q: 'Responding to a mistake with "What happened?" instead of "Why did you do that?" reinforces ___.', opts: ['Authority', 'Accountability', 'Safety before accountability', 'Policy compliance'], a: 2 },
    { q: 'When the Circle of Safety expands, the team naturally combines ___ and strengths.', opts: ['Goals and values', 'Talents and strengths', 'Skills and metrics', 'Ideas and systems'], a: 1 },
    { q: 'Sinek says how you treat people on their ___ day defines your leadership.', opts: ['Best', 'Busiest', 'Worst', 'First'], a: 2 },
    { q: 'Protection from above means leaders shield their teams from ___ within the organization.', opts: ['Customers', 'Competition', 'Dangers', 'Auditors'], a: 2 },
    { q: 'Leaders who create a Circle of Safety allow teams to focus on threats ___ rather than internal politics.', opts: ['From customers', 'From competition and outside', 'From regulators', 'From schedules'], a: 1 },
    { q: 'Sinek says the best store leaders serve their ___ before themselves.', opts: ['Customers', 'Investors', 'Team', 'Community'], a: 2 },
  ],
  'unreasonable-hospitality': [
    { q: 'Will Guidara describes hospitality as a ___, not a monologue.', opts: ['Performance', 'Dialogue', 'Transaction', 'Formula'], a: 1 },
    { q: 'The book\'s title reflects Guidara\'s philosophy of being creatively ___ in service.', opts: ['Efficient', 'Strict', 'Over-the-top', 'Consistent'], a: 2 },
    { q: '"One size fits one" means treating each guest as ___.', opts: ['Part of a segment', 'An individual', 'A VIP', 'A regular'], a: 1 },
    { q: 'Eleven Madison Park was ranked #1 restaurant in the world in ___.', opts: ['2010', '2015', '2017', '2020'], a: 2 },
    { q: 'Guidara says the biggest opportunities to blow people\'s minds came not from the food but from the way you made them ___.', opts: ['Spend more', 'Feel', 'Come back', 'Wait'], a: 1 },
    { q: 'A "legend" is a moment of extraordinary hospitality that guests ___.', opts: ['Complained about', 'Told stories about for years', 'Posted on Yelp', 'Forgot quickly'], a: 1 },
    { q: 'True hospitality is treating everyone as ___ — not treating everyone the same.', opts: ['A transaction', 'An individual', 'A repeat customer', 'Part of a system'], a: 1 },
    { q: 'Guidara says every rule has an exception. The best hospitality comes from knowing when to ___ the rules for the guest.', opts: ['Enforce', 'Break', 'Explain', 'Review'], a: 1 },
    { q: 'Hospitality is a ___, which means it requires listening and responding to what people need.', opts: ['Script', 'Dialogue', 'System', 'Transaction'], a: 1 },
    { q: 'The "hot dog story" demonstrates breaking every rule of fine dining to give someone ___.', opts: ['A discount', 'Exactly what they didn\'t know they wanted', 'A longer wait', 'Extra courses'], a: 1 },
    { q: 'Legends at Guidara\'s restaurant didn\'t cost much, but they were priceless in their ___.', opts: ['Cost efficiency', 'Impact', 'Frequency', 'Media coverage'], a: 1 },
    { q: 'Guidara says "one size fits one" means the best experiences feel ___ crafted.', opts: ['Efficiently', 'Systematically', 'Personally', 'Quickly'], a: 2 },
    { q: 'At Jersey Mike\'s, applying unreasonable hospitality could look like remembering a customer\'s ___ and usual order.', opts: ['Account number', 'Name', 'Birthday', 'Address'], a: 1 },
    { q: 'Guidara says a complaint is actually an ___ for a legendary recovery.', opts: ['Obstacle', 'Opportunity', 'Exception', 'Interruption'], a: 1 },
    { q: 'Guidara\'s philosophy says the "Black Sheep" chapter is about knowing when to break the rules ___.', opts: ['For efficiency', 'In service of the guest', 'For cost savings', 'For consistency'], a: 1 },
    { q: 'Training crew to ask one question beyond the order — "First time here?" — creates ___ connection.', opts: ['Transactional', 'Genuine', 'Scripted', 'Required'], a: 1 },
    { q: 'Guidara says listening to what people need and responding in a way that makes them feel ___ is the core of hospitality.', opts: ['Impressed', 'Seen and valued', 'Surprised', 'Rewarded'], a: 1 },
    { q: 'The hospitality approach described as "unreasonable" is one that is ___ the normal standard.', opts: ['Below', 'At', 'Slightly above', 'Creatively and dramatically above'], a: 3 },
    { q: '"Setting the Table" chapter argues hospitality requires understanding what people ___ before responding.', opts: ['Order', 'Need', 'Expect', 'Complain about'], a: 1 },
    { q: 'Guidara says doing something unexpected — even breaking rules of fine dining — can create a ___ moment.', opts: ['Compliance', 'Legendary hospitality', 'Safety issue', 'Refund'], a: 1 },
  ],
  'e-myth-revisited': [
    { q: 'The "E-Myth" is the mistaken belief that technical skill in a job means you understand the ___ built around that job.', opts: ['Market', 'Business', 'System', 'Customer'], a: 1 },
    { q: 'Gerber says most small businesses fail because which personality runs them?', opts: ['Entrepreneur', 'Manager', 'Technician', 'Visionary'], a: 2 },
    { q: 'The franchise prototype concept means building a business that works without ___.', opts: ['Investment', 'You', 'Staff', 'Marketing'], a: 1 },
    { q: 'The three-step Business Development Process is: Innovate, Quantify, and ___.', opts: ['Systematize', 'Orchestrate', 'Delegate', 'Optimize'], a: 1 },
    { q: 'Gerber says if you have to be there for it to work, you don\'t own a business — you own a ___.', opts: ['Franchise', 'Job', 'System', 'Brand'], a: 1 },
    { q: 'Every business owner contains three personalities. Which is the organizer and planner?', opts: ['Entrepreneur', 'Manager', 'Technician', 'Visionary'], a: 1 },
    { q: 'The Technician personality creates a business that cannot ___.', opts: ['Make money', 'Scale or survive the owner\'s absence', 'Hire well', 'Serve customers'], a: 1 },
    { q: 'Gerber says your business should exist to serve your ___, not the other way around.', opts: ['Investors', 'Life', 'Brand', 'Goals'], a: 1 },
    { q: 'The Entrepreneur personality is the ___, the creator, the visionary.', opts: ['Manager', 'Dreamer', 'Executor', 'Planner'], a: 1 },
    { q: 'Gerber says the fatal assumption is: if you understand the ___ of a business, you understand a business.', opts: ['Customer', 'Market', 'Technical work', 'Finances'], a: 2 },
    { q: 'The franchise model forces you to build a business that works by documenting every ___.', opts: ['Employee review', 'Process and system', 'Sales figure', 'Customer complaint'], a: 1 },
    { q: 'Innovate, then Quantify the results, then ___ so anyone can replicate it.', opts: ['Delegate', 'Orchestrate', 'Document', 'Automate'], a: 1 },
    { q: 'Gerber calls a business that requires your constant presence "the worst ___ in the world."', opts: ['Investment', 'Job', 'System', 'Partnership'], a: 1 },
    { q: 'The test of a great business system is that your ___ employee can execute it correctly from documentation alone.', opts: ['Best', 'Most experienced', 'Newest', 'Brightest'], a: 2 },
    { q: 'Working ON the business means spending time ___, not making subs or solving daily problems.', opts: ['Recruiting', 'Improving systems', 'Doing marketing', 'Checking sales'], a: 1 },
    { q: 'The "Turn-Key Revolution" means the business runs because of ___, not because of heroic individuals.', opts: ['Revenue', 'Systems', 'Leadership', 'Customers'], a: 1 },
    { q: 'Gerber\'s "Primary Aim" chapter challenges operators to ask: what do you want your ___ to look like?', opts: ['Balance sheet', 'Life', 'Store', 'Team'], a: 1 },
    { q: 'A store that depends on the manager\'s memory and hustle ___ scale.', opts: ['Can quickly', 'Cannot', 'Will slowly', 'Should always'], a: 1 },
    { q: 'Documenting a process so clearly that anyone can follow it is the foundation of ___.', opts: ['The franchise prototype', 'The E-Myth', 'Abdication', 'The technician trap'], a: 0 },
    { q: 'Gerber says in a healthy business, which three personalities are present in ___.', opts: ['Sequence', 'Balance', 'Competition', 'Isolation'], a: 1 },
  ],
  'no-excuses': [
    { q: 'Tracy says delaying gratification in the short term is the prerequisite for:', opts: ['Happiness', 'Success', 'Respect', 'Balance'], a: 1 },
    { q: '"Leaders are made, not born" means leadership is the result of:', opts: ['Natural talent', 'Doing what leaders do repeatedly', 'Education', 'Connections'], a: 1 },
    { q: 'Tracy says every minute spent planning saves how many minutes in execution?', opts: ['5', '8', '10', '15'], a: 2 },
    { q: 'Self-discipline is the ability to select the most important task and ___ it quickly and well.', opts: ['Delegate', 'Execute', 'Delay', 'Simplify'], a: 1 },
    { q: 'Tracy says your ability to select your most important task will have more impact than any other ___ you can develop.', opts: ['Resource', 'Quality or skill', 'Connection', 'Strategy'], a: 1 },
    { q: 'The habit of saving and investing before spending is the foundation of ___.', opts: ['Discipline', 'Financial success', 'Time management', 'Team building'], a: 1 },
    { q: 'Tracy\'s definition of self-discipline includes delaying short-term gratification for ___ rewards.', opts: ['Peer approval', 'Greater long-term', 'Recognition', 'Comfort'], a: 1 },
    { q: 'According to Tracy, time management is really ___ management.', opts: ['Project', 'Life', 'Stress', 'Energy'], a: 1 },
    { q: 'Tracy says: "The ability to discipline yourself to delay gratification is the ___ prerequisite for success."', opts: ['Optional', 'Indispensable', 'Sufficient', 'Initial'], a: 1 },
    { q: 'No Excuses means eliminating "I can\'t because..." and replacing it with ___.', opts: ['"It\'s too hard"', '"How can I..."', '"Someone else should"', '"Let me think about it"'], a: 1 },
    { q: 'Self-discipline and leadership means doing what ___ do, over and over, until it\'s natural.', opts: ['Followers', 'Leaders', 'Managers', 'Mentors'], a: 1 },
    { q: 'Tracy says the self-discipline to complete a major task on time has more impact on your career than ___.', opts: ['Your title', 'Almost anything else', 'Your network', 'Your education'], a: 1 },
    { q: 'For store operators, self-discipline means consistently completing ___ within 30 minutes of closing.', opts: ['The opening checklist', 'The closeout paperwork', 'The inventory', 'The staff review'], a: 1 },
    { q: 'Tracy says holding yourself to the same standards as your team is an example of self-discipline applied to ___.', opts: ['Finance', 'Leadership', 'Operations', 'Hiring'], a: 1 },
    { q: 'The chapter on self-discipline and work focuses on selecting the most important task at each ___.', opts: ['Month', 'Week', 'Moment', 'Shift'], a: 2 },
    { q: 'Tracy says self-discipline is the foundation of ___ in every area of life and work.', opts: ['Wealth', 'Everything', 'Relationships', 'Health'], a: 1 },
    { q: 'Starting each day by identifying your most important task and doing it first is called the ___ principle.', opts: ['Prioritization', '"Eat the Frog"', 'Self-discipline loop', 'Productivity habit'], a: 1 },
    { q: 'Tracy says remove the phrase "I can\'t because..." for one ___ to break the excuse habit.', opts: ['Hour', 'Day', 'Week', 'Month'], a: 2 },
    { q: 'Self-discipline and money includes paying ___ first, then your bills.', opts: ['Your team', 'Yourself', 'Your investors', 'Your taxes'], a: 1 },
    { q: 'Tracy says great leaders are made by doing what leaders do, not by ___.', opts: ['Working hard', 'Natural talent or birth', 'Being liked', 'Getting promoted'], a: 1 },
  ],
  '21-laws-of-leadership': [
    { q: 'The Law of the Lid states that your leadership ability determines your level of ___.', opts: ['Income', 'Effectiveness', 'Popularity', 'Knowledge'], a: 1 },
    { q: 'The true measure of leadership is ___ — nothing more, nothing less.', opts: ['Authority', 'Influence', 'Title', 'Experience'], a: 1 },
    { q: 'The Law of Process says leadership develops ___, not in a day.', opts: ['Naturally', 'Daily', 'Slowly', 'Randomly'], a: 1 },
    { q: 'The Law of Buy-In says people buy into the ___ before the vision.', opts: ['System', 'Leader', 'Plan', 'Results'], a: 1 },
    { q: 'The Law of Addition says leaders add value by ___ others.', opts: ['Challenging', 'Serving', 'Managing', 'Promoting'], a: 1 },
    { q: 'The Law of Solid Ground states that ___ is the foundation of leadership.', opts: ['Results', 'Trust', 'Knowledge', 'Vision'], a: 1 },
    { q: 'The Law of Navigation says leaders chart the course because they see ___ than others see.', opts: ['Less', 'More, farther, and before', 'Differently', 'Faster'], a: 1 },
    { q: 'A leader\'s lasting value is measured by ___, according to the Law of Legacy.', opts: ['Revenue', 'Succession', 'Fame', 'Tenure'], a: 1 },
    { q: 'The Law of Legacy says a life isn\'t significant except for its ___ on other lives.', opts: ['Demands', 'Impact', 'Length', 'Achievements'], a: 1 },
    { q: 'The Law of the Lid means: the ___ the leadership, the greater the effectiveness.', opts: ['Stricter', 'Higher', 'Older', 'Calmer'], a: 1 },
    { q: 'Maxwell says leadership develops ___ — what matters is what you do day after day.', opts: ['Instantly', 'Overnight', 'Daily over time', 'Through reading'], a: 2 },
    { q: 'The Law of Influence: if you don\'t have influence, you will never be able to ___ others.', opts: ['Like', 'Lead', 'Manage', 'Train'], a: 1 },
    { q: 'Trust is made possible by ___, and trust makes leadership possible.', opts: ['Authority', 'Character', 'Experience', 'Titles'], a: 1 },
    { q: 'Maxwell says leaders see more, see farther, and see ___ before others see.', opts: ['Clearly', 'Better', 'Before / earlier', 'From above'], a: 2 },
    { q: 'The Law of Buy-In means you earn credibility not by telling your vision but by showing your ___.', opts: ['Results', 'Character', 'Plan', 'Authority'], a: 1 },
    { q: 'The Law of Addition says the bottom line in leadership isn\'t how far you advance ___ but others.', opts: ['The company', 'Yourself', 'The mission', 'Your team'], a: 1 },
    { q: 'Maxwell says every leader has a "lid" — the ceiling on their store\'s potential set by their own ___.', opts: ['Budget', 'Leadership level', 'Experience', 'Team size'], a: 1 },
    { q: 'Which law applies when a team member doesn\'t follow your direction because they don\'t trust you yet?', opts: ['Law of Legacy', 'Law of Solid Ground', 'Law of Navigation', 'Law of the Lid'], a: 1 },
    { q: 'The Law of Process: what matters most is what you do ___, over the long haul.', opts: ['Once', 'Day after day', 'When inspired', 'Under pressure'], a: 1 },
    { q: 'Maxwell says picking one law per week to focus on and evaluating yourself at the end is an example of ___.', opts: ['Law of Legacy', 'Deliberate leadership development', 'Law of Buy-In', 'Servant leadership'], a: 1 },
  ],
  'first-time-manager': [
    { q: 'The skills that made you great as an individual contributor are ___ the skills that make you a great manager.', opts: ['The same as', 'Not the same as', 'More important than', 'Less relevant than'], a: 1 },
    { q: 'As a new manager, you earn trust through consistency, transparency, and ___.', opts: ['Authority', 'Following through on commitments', 'Years of experience', 'Being liked'], a: 1 },
    { q: 'McCormick says the conversation you\'re avoiding is usually the conversation you most ___.', opts: ['Should document', 'Need to have', 'Can postpone', 'Should escalate'], a: 1 },
    { q: 'Your first 90 days set the tone. McCormick says to ___ more than you talk.', opts: ['Document', 'Listen', 'Challenge', 'Teach'], a: 1 },
    { q: 'Delegating frees you to focus on ___ responsibilities.', opts: ['Easier', 'Lower-level', 'Higher-level', 'Fewer'], a: 2 },
    { q: 'When promoted over former peers, be fair, consistent, and clear about your ___.', opts: ['Goals', 'New role', 'Timeline', 'Authority level'], a: 1 },
    { q: 'McCormick says observe before you ___ in your first 90 days.', opts: ['Listen', 'Change', 'Report', 'Hire'], a: 1 },
    { q: 'Delegating is about developing team capabilities while freeing yourself — not about ___ work.', opts: ['Hard', 'Dumping', 'Splitting', 'Reducing'], a: 1 },
    { q: 'A new manager must learn to achieve results ___, not by doing everything themselves.', opts: ['Quickly', 'Through others', 'Alone', 'Systematically'], a: 1 },
    { q: 'The difficult conversation framework involves: describe the behavior, explain the ___, ask for perspective, agree on next steps.', opts: ['Solution', 'Impact', 'Policy', 'Consequence'], a: 1 },
    { q: 'During your first 90 days, McCormick says: ___ before you change.', opts: ['Report', 'Plan', 'Observe', 'Train'], a: 2 },
    { q: 'McCormick says build ___ before you enforce rules in your first 90 days.', opts: ['Systems', 'Relationships', 'Authority', 'Metrics'], a: 1 },
    { q: 'Address issues ___, directly, and with compassion.', opts: ['Once', 'Early', 'Gently', 'Formally'], a: 1 },
    { q: 'Managing former peers requires redefining the relationship without ___ it.', opts: ['Improving', 'Destroying', 'Formalizing', 'Expanding'], a: 1 },
    { q: 'A "New Manager Checklist" for your store should cover things every new shift lead needs to know in their first ___ days.', opts: ['7', '14', '30', '60'], a: 2 },
    { q: 'A weekly ___ with your newest manager asking "What\'s your biggest challenge?" builds trust and growth.', opts: ['Performance review', '15-minute check-in', 'Email update', 'Group meeting'], a: 1 },
    { q: 'The road to management chapter warns that technical excellence and ___ management are completely different skills.', opts: ['Team', 'Business', 'Time', 'Project'], a: 1 },
    { q: 'Trust as a new manager is earned through ___ in your behavior day after day.', opts: ['Excellence', 'Consistency', 'Authority', 'Proximity'], a: 1 },
    { q: 'McCormick says first-time managers often fail because they try to ___ too quickly before building relationships.', opts: ['Train', 'Delegate', 'Change things', 'Hire'], a: 2 },
    { q: 'When something goes wrong, the best approach for a new manager is to give a ___ assignment and coach the person through it.', opts: ['Standard', 'Stretch', 'Familiar', 'Solo'], a: 1 },
  ],
  'the-one-truth': [
    { q: 'Gordon\'s One Truth is that everything comes down to your ___.', opts: ['Habits', 'State of mind', 'Network', 'Work ethic'], a: 1 },
    { q: 'Oneness is the feeling of ___ to your team, purpose, and something larger than yourself.', opts: ['Superiority', 'Connection', 'Independence', 'Control'], a: 1 },
    { q: 'Gordon says fear ___, while love unites.', opts: ['Motivates', 'Divides', 'Protects', 'Strengthens'], a: 1 },
    { q: 'Your energy as a leader is ___ — it spreads to your entire team.', opts: ['Private', 'Contagious', 'Irrelevant', 'Fixed'], a: 1 },
    { q: 'When you lead from love and connection, people give their best because they ___.', opts: ['Have to', 'Want to', 'Are paid to', 'Are told to'], a: 1 },
    { q: 'Gordon says connected teams measurably ___ disconnected ones on every metric.', opts: ['Match', 'Outperform', 'Mirror', 'Follow'], a: 1 },
    { q: 'Gordon says the leader\'s state IS the ___ state.', opts: ['Customer\'s', 'Store\'s', 'Company\'s', 'Team\'s'], a: 1 },
    { q: 'Separateness in the workplace shows up as politics, selfishness, disengagement, and ___.', opts: ['Growth', 'Blame', 'Turnover', 'Learning'], a: 1 },
    { q: 'Gordon says the One Truth is not wishful thinking — it is ___.', opts: ['Spirituality', 'Neuroscience', 'Management theory', 'Philosophy'], a: 1 },
    { q: 'The pre-shift ritual Gordon recommends involves shifting your ___ before you walk in the door.', opts: ['Schedule', 'State', 'Phone', 'Priorities'], a: 1 },
    { q: 'Responding to a problem from fear uses ___, while love-based leadership produces discretionary effort.', opts: ['Growth mindset', 'Compliance', 'Culture', 'Connection'], a: 1 },
    { q: 'Creating a "team wins" board where one positive thing is written each day is an example of building ___.', opts: ['Documentation', 'Oneness and gratitude', 'Accountability', 'Compliance'], a: 1 },
    { q: 'Gordon\'s "Fear vs. Love" chapter argues fear-based management produces ___ but kills discretionary effort.', opts: ['Growth', 'Compliance', 'Loyalty', 'Excellence'], a: 1 },
    { q: 'The Oneness vs. Separateness framework: Oneness produces ___ within the team.', opts: ['Competition', 'Belonging and shared purpose', 'Individual recognition', 'Formal processes'], a: 1 },
    { q: 'Gordon says "State Changes Everything" — which practical technique can shift your state before a shift?', opts: ['Reviewing the schedule', 'Breath, gratitude, reframing', 'Checking sales numbers', 'Writing to-do lists'], a: 1 },
    { q: 'When a crew member is rude to a customer, approaching the situation from love means addressing ___ first.', opts: ['The customer complaint', 'The crew member\'s value and dignity', 'The policy violation', 'The discipline process'], a: 1 },
    { q: 'Gordon says "what changed, but this week has been different" — this shows the ___ effect of the leader\'s energy.', opts: ['Financial', 'Ripple / contagious', 'Random', 'Motivational'], a: 1 },
    { q: 'Gordon says gratitude and connection are not soft activities — they are the ___ of a winning culture.', opts: ['Bonus', 'Infrastructure', 'Exception', 'Ideal'], a: 1 },
    { q: 'The One Truth principle is that your ___ colors everything you see and determines how you respond.', opts: ['Paycheck', 'State of mind', 'Title', 'Experience'], a: 1 },
    { q: 'Gordon says connection is not a luxury for store operators — it is a ___ variable.', opts: ['Soft', 'Performance', 'Optional', 'Emotional'], a: 1 },
  ],
  'eat-that-frog': [
    { q: 'Your "frog" is the task that is most ___ and most likely to be avoided.', opts: ['Simple', 'Impactful', 'Enjoyable', 'Routine'], a: 1 },
    { q: 'Tracy says 20% of your activities account for ___% of your results.', opts: ['50', '60', '80', '90'], a: 2 },
    { q: 'In the ABCDE method, "D" tasks are ones you should ___.', opts: ['Do first', 'Delete', 'Delegate', 'Delay'], a: 2 },
    { q: 'Single-handling means completing one task from start to finish without ___.', opts: ['Help', 'Diversion or distraction', 'A plan', 'Deadlines'], a: 1 },
    { q: 'The Law of Three says ___ tasks produce 90% of the value you contribute.', opts: ['One', 'Two', 'Three', 'Five'], a: 2 },
    { q: 'Creative procrastination means deliberately choosing to procrastinate on ___ activities.', opts: ['Important', 'Low-value', 'Team', 'Urgent'], a: 1 },
    { q: 'Tracy says preparing thoroughly before starting a task helps you complete it ___.', opts: ['Perfectly', 'Faster', 'Alone', 'Correctly'], a: 1 },
    { q: 'Key Result Areas are the 4–6 areas where you absolutely must perform well to ___.', opts: ['Get promoted', 'Succeed', 'Stay employed', 'Be respected'], a: 1 },
    { q: 'The "E" in the ABCDE method stands for ___.', opts: ['Execute', 'Eliminate', 'Escalate', 'Evaluate'], a: 1 },
    { q: 'Tracy says "A" tasks in the ABCDE method are ones you ___ do.', opts: ['Sometimes', 'Must', 'Should', 'Could'], a: 1 },
    { q: 'The 80/20 rule applied to your team means the top ___ employees produce 80% of your best results.', opts: ['1', '2-3', '5-6', '10'], a: 1 },
    { q: 'Tracy says block ___ minutes of uninterrupted time each day for your most important task.', opts: ['10', '20', '30', '60'], a: 2 },
    { q: 'Identifying the one constraint most limiting your store\'s performance makes it your next ___.', opts: ['Problem', 'Rock / priority', 'Hire', 'Meeting topic'], a: 1 },
    { q: 'Tracy says technology should be used to ___ your quality of life, not the other way around.', opts: ['Replace', 'Improve', 'Track', 'Document'], a: 1 },
    { q: 'The daily "frog ritual" means writing your top ___ frogs on a sticky note before the store opens.', opts: ['1', '3', '5', '10'], a: 1 },
    { q: 'The "C" in ABCDE stands for tasks that are ___ to do.', opts: ['Critical', 'Nice', 'Creative', 'Complex'], a: 1 },
    { q: 'Apply 80/20 to your to-do list: how many items are really "E" — tasks you should ___.', opts: ['Delegate', 'Eliminate', 'Delay', 'Document'], a: 1 },
    { q: 'Tracy says continuous learning means the manager who keeps ___ outperforms the one who stopped.', opts: ['Working', 'Learning', 'Delegating', 'Planning'], a: 1 },
    { q: 'Tracy\'s key insight about "setting the table" is that ___ is the most important concept in personal productivity.', opts: ['Speed', 'Clarity', 'Energy', 'Focus'], a: 1 },
    { q: 'A pre-shift preparation ritual of ___ minutes before the door opens sets priorities and confirms coverage.', opts: ['2', '5', '10', '30'], a: 2 },
  ],
  'radical-candor': [
    { q: 'Radical Candor means caring ___ while challenging ___.', opts: ['Less / more', 'Personally / directly', 'Indirectly / gently', 'Sometimes / always'], a: 1 },
    { q: 'Most management mistakes happen in the ___ quadrant.', opts: ['Radical Candor', 'Obnoxious Aggression', 'Ruinous Empathy', 'Manipulative Insincerity'], a: 2 },
    { q: 'Ruinous Empathy means you care personally but fail to ___.', opts: ['Listen', 'Challenge directly', 'Set goals', 'Be available'], a: 1 },
    { q: 'Obnoxious Aggression is challenging directly without ___.', opts: ['Authority', 'Caring personally', 'Evidence', 'A plan'], a: 1 },
    { q: 'The worst quadrant — neither care nor challenge — is ___.', opts: ['Ruinous Empathy', 'Radical Candor', 'Manipulative Insincerity', 'Obnoxious Aggression'], a: 2 },
    { q: 'Scott says start getting feedback before ___ it — model the behavior you want.', opts: ['Documenting', 'Giving', 'Requesting', 'Writing'], a: 1 },
    { q: 'Praise should be specific and sincere. Criticism should be kind, clear, and ___.', opts: ['Private', 'Immediate', 'Written', 'Formal'], a: 1 },
    { q: 'When you show vulnerability, feedback flows in ___ directions.', opts: ['One', 'Two', 'Three', 'All'], a: 3 },
    { q: 'Radical Candor is NOT about being harsh — it\'s about caring enough to tell people the ___.', opts: ['Rules', 'Truth', 'Plan', 'Expectations'], a: 1 },
    { q: 'Ruinous Empathy is seeing a problem and saying nothing because you don\'t want to hurt someone\'s ___.', opts: ['Performance', 'Feelings', 'Career', 'Status'], a: 1 },
    { q: 'Manipulative Insincerity involves backstabbing, passive-aggressive behavior, and political ___.', opts: ['Awareness', 'Maneuvering', 'Sensitivity', 'Intelligence'], a: 1 },
    { q: 'Using the Radical Candor framework, "I care about you AND the standard is..." addresses both dimensions of ___.', opts: ['Compliance', 'Care and challenge', 'Performance review', 'Discipline'], a: 1 },
    { q: 'Scott says: both praise and criticism should be aimed at making the person ___, not making you feel powerful.', opts: ['Comfortable', 'Better', 'Compliant', 'Accountable'], a: 1 },
    { q: 'The Obnoxious Aggression quadrant is sometimes called "just being honest" but it lacks ___.', opts: ['Evidence', 'Caring personally', 'Directness', 'Clarity'], a: 1 },
    { q: 'Posting the Radical Candor 2x2 matrix in the office and referencing it in coaching conversations is an example of ___.', opts: ['Compliance training', 'Building a feedback culture', 'Performance documentation', 'HR protocol'], a: 1 },
    { q: 'Scott recommends asking your shift leads: "What\'s one thing I could do ___ as your manager?"', opts: ['Faster', 'Better', 'More', 'Less'], a: 1 },
    { q: 'Radical Candor lives in the quadrant where you ___ personally AND ___ directly.', opts: ['Punish / reward', 'Care / challenge', 'Listen / teach', 'Plan / execute'], a: 1 },
    { q: 'Criticism in Radical Candor is immediately rewarded by a culture where people ___ grow.', opts: ['Fear to', 'Want to', 'Are required to', 'Schedule to'], a: 1 },
    { q: 'Kim Scott\'s experience at companies like Google and Apple shows that Radical Candor is applicable at ___.', opts: ['Only tech companies', 'Any level of any organization', 'Executive level only', 'HR teams only'], a: 1 },
    { q: 'Practicing Radical Candor means giving one piece of specific ___ and one piece of kind criticism each week.', opts: ['Report', 'Praise', 'Warning', 'Update'], a: 1 },
  ],
  '5-levels-of-leadership': [
    { q: 'At Level 1 (Position), people follow you because they ___.', opts: ['Trust you', 'Have to', 'Want to', 'Respect you'], a: 1 },
    { q: 'At Level 2 (Permission), people follow you because they ___.', opts: ['Have to', 'Are paid to', 'Want to', 'Are required to'], a: 2 },
    { q: 'Level 3 (Production) gives you credibility through ___.', opts: ['Relationships', 'Results', 'Title', 'Experience'], a: 1 },
    { q: 'Level 4 (People Development): people follow because of what you\'ve done for ___.', opts: ['The company', 'Them personally', 'The community', 'The bottom line'], a: 1 },
    { q: 'Level 5 (Pinnacle) is reserved for leaders who spent a lifetime growing and developing ___.', opts: ['Systems', 'Others', 'Profits', 'Processes'], a: 1 },
    { q: 'Maxwell says you can be at different levels with ___ people simultaneously.', opts: ['Only senior', 'Different', 'Your best', 'Entry-level'], a: 1 },
    { q: 'Level 4\'s upside is ___ through people development.', opts: ['Authority', 'Multiplication', 'Income', 'Recognition'], a: 1 },
    { q: 'To reach Level 3, produce ___ that your team can see.', opts: ['Plans', 'Results', 'Relationships', 'Ideas'], a: 1 },
    { q: 'The only influence you have at Level 1 comes from your ___.', opts: ['Relationships', 'Results', 'Title', 'Character'], a: 2 },
    { q: 'Maxwell says: don\'t stay at Level ___. Grow beyond it.', opts: ['3', '4', '1', '2'], a: 2 },
    { q: 'Level 2 gives you ___ to lead beyond your title.', opts: ['Results', 'Money', 'Permission', 'Authority'], a: 2 },
    { q: 'Maxwell\'s roadmap for reaching Level 4: first commit to developing one person this ___.', opts: ['Year', 'Month', 'Day', 'Quarter'], a: 3 },
    { q: 'An honest assessment of your leadership level with each direct report requires writing it ___ and creating a plan.', opts: ['In a review', 'Down', 'On a whiteboard', 'In an email'], a: 1 },
    { q: 'Level 3 (Production) creates ___ for the leader because results are visible.', opts: ['Followers', 'Credibility', 'Income', 'Authority'], a: 1 },
    { q: 'If you\'re stuck at Level 1 with someone, Maxwell says invest in the ___ before trying to get results.', opts: ['System', 'Relationship', 'Training', 'Performance plan'], a: 1 },
    { q: 'Maxwell says the greatest leaders invest their time developing other ___, not just followers.', opts: ['Systems', 'Metrics', 'Leaders', 'Customers'], a: 2 },
    { q: 'Level 5 leaders have spent a lifetime growing and developing others and are followed because of ___.', opts: ['Their title', 'Who they are and what they represent', 'Their results', 'Their experience'], a: 1 },
    { q: 'To move from Level 2 to Level 3, focus on one measurable ___ you can achieve in 30 days.', opts: ['Relationship', 'Result', 'Plan', 'Hire'], a: 1 },
    { q: 'Maxwell says you can be at Level 4 with one person and Level ___ with another simultaneously.', opts: ['1', '2', '3', '5'], a: 1 },
    { q: 'Level 4 gives you multiplication because you\'re developing people who then develop ___.', opts: ['Metrics', 'Systems', 'Others', 'Processes'], a: 2 },
  ],
  'million-dollar-habits': [
    { q: 'Tracy says successful people are simply those with ___ habits.', opts: ['Productive', 'Successful', 'Positive', 'Consistent'], a: 1 },
    { q: 'Your habits determine roughly ___% of everything you think, feel, do, and achieve.', opts: ['50', '75', '95', '100'], a: 2 },
    { q: 'Top businesspeople ask before every task: What is the most ___ use of my time right now?', opts: ['Efficient', 'Valuable', 'Urgent', 'Creative'], a: 1 },
    { q: 'Only ___% of adults have written goals — and they earn more than all others combined.', opts: ['1', '3', '10', '25'], a: 1 },
    { q: 'The habit of saving involves reinvesting in your own ___ and knowledge.', opts: ['Brand', 'Skills', 'Network', 'Comfort'], a: 1 },
    { q: 'Tracking one key metric daily for 30 days creates the habit of ___.', opts: ['Comparing', 'Improving', 'Reporting', 'Planning'], a: 1 },
    { q: 'Self-made millionaires save income ___.', opts: ['After all expenses', 'Before spending', 'When they can', 'Annually'], a: 1 },
    { q: 'Writing down your goals is the ___ most powerful thing you can do for your future.', opts: ['Least', 'Second', 'Single most', 'Third'], a: 2 },
    { q: 'Tracy says 95% of what we do is ___ — habits run our stores on autopilot.', opts: ['Scheduled', 'Habitual', 'Intentional', 'Reactive'], a: 1 },
    { q: 'The habit of goal setting means reviewing your written goals ___ before your shift.', opts: ['Weekly', 'Monthly', 'Every morning', 'Quarterly'], a: 2 },
    { q: 'A "habit audit" for your store asks: what happens ___, and what falls through the cracks?', opts: ['Automatically', 'Rarely', 'Manually', 'By luck'], a: 0 },
    { q: 'Tracy says top businesspeople think about ___ before they start any task.', opts: ['Their team', 'Results', 'Resources', 'Their schedule'], a: 1 },
    { q: 'Investing 30 minutes per day in your own learning is described as investing in your ___.', opts: ['Free time', 'Skills and knowledge', 'Career brand', 'Personal life'], a: 1 },
    { q: 'A 90-day goal review cycle means writing your top ___ goals for the next 90 days.', opts: ['1', '2', '3', '5'], a: 2 },
    { q: 'Tracy says your habits are running your store whether you designed them or ___.', opts: ['Intended them to', 'Not', 'Hired for them', 'Measured them'], a: 1 },
    { q: 'The most successful business operators have the habit of thinking about ___ before starting any task.', opts: ['Their team', 'Results', 'Resources', 'Their boss'], a: 1 },
    { q: 'Tracy says the habit of tracking daily creates the habit of ___.', opts: ['Measuring', 'Improving', 'Comparing', 'Reporting'], a: 1 },
    { q: 'Tracy says million-dollar habits apply to operators managing ___ in annual revenue.', opts: ['Thousands', 'Hundreds of thousands', 'Millions', 'Any amount'], a: 2 },
    { q: 'The book connects daily habits directly to ___ outcomes for store operators.', opts: ['Customer', 'Financial', 'Social', 'Marketing'], a: 1 },
    { q: 'Tracy\'s power of habit thesis: your habits don\'t just affect your behavior — they affect ___ you think, feel, do, and achieve.', opts: ['Some of', 'Most of', '95% of everything', 'Half of'], a: 2 },
  ],
};

export default function ReadingPage() {
  const { showToast } = useToast();
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
  const [readBooks, setReadBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quizActive, setQuizActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScores, setQuizScores] = useState({});
  // Chapter deep dive expand/collapse state
  const [expandedChapters, setExpandedChapters] = useState({});
  const book = BOOKS.find(b => b.id === selectedBook);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch(e) { console.debug('[reading] favorites parse failed:', e); }
    try {
      const savedRead = localStorage.getItem('rt-reading-read');
      if (savedRead) setReadBooks(JSON.parse(savedRead));
    } catch(e) { console.debug('[reading] read-books parse failed:', e); }
    try {
      const savedScores = localStorage.getItem('rt-reading-quiz-scores');
      if (savedScores) setQuizScores(JSON.parse(savedScores));
    } catch(e) { console.debug('[reading] quiz-scores parse failed:', e); }
  }, []);

  useEffect(() => {
    setQuizActive(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setExpandedChapters({});
  }, [selectedBook]);

  // Handle ?book= URL param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bookParam = params.get('book');
      if (bookParam && BOOKS.find(b => b.id === bookParam)) {
        setSelectedBook(bookParam);
      }
    }
  }, []);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('reading-favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleRead = (e, id) => {
    e.stopPropagation();
    setReadBooks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('rt-reading-read', JSON.stringify(next));
      return next;
    });
  };

  const toggleChapter = (idx) => {
    setExpandedChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const sortedBooks = [...BOOKS].sort((a, b) => a.author.localeCompare(b.author));
  const filteredBooks = searchQuery
    ? sortedBooks.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedBooks;

  // Reading Journey helpers
  const nextUpBook = RECOMMENDED_ORDER.find(id => !readBooks.includes(id));
  const nextUpBookData = BOOKS.find(b => b.id === nextUpBook);
  const quizBookIds = Object.keys(BOOK_QUIZZES);
  const quizzesTaken = quizBookIds.filter(id => quizScores[id] !== undefined);
  const quizzesNotTaken = RECOMMENDED_ORDER.filter(id => BOOK_QUIZZES[id] && quizScores[id] === undefined);
  const nextQuizBookId = quizzesNotTaken[0];
  const nextQuizBook = BOOKS.find(b => b.id === nextQuizBookId);
  const passingScore = (id) => {
    const total = BOOK_QUIZZES[id]?.length || 20;
    return Math.round(total * QUIZ_PASS_THRESHOLD);
  };
  const allComplete = readBooks.length >= BOOKS.length;

  return (
    <div className={styles.container}>
      {!selectedBook ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 8 }}>
              Leadership Reading
            </h1>
            <p style={{ fontSize: 16, color: 'var(--gray-500)', maxWidth: 600, margin: '0 auto' }}>
              The books that shape how we lead at JM Valley Group. Each one has been read, discussed, and applied by our management team.
            </p>
          </div>

          {/* Reading Journey Tracker */}
          <div style={{ marginBottom: 28, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: 'var(--jm-blue)', margin: 0 }}>
                Your Reading Journey
              </h2>
              <span style={{ fontSize: 13, fontWeight: 700, color: allComplete ? '#16a34a' : 'var(--jm-blue)' }}>
                {readBooks.length} / {BOOKS.length} complete
              </span>
            </div>

            {allComplete ? (
              <div style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', borderRadius: 10, padding: '14px 20px', color: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>🎉</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>You\'ve completed the entire library!</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Outstanding commitment to leadership growth.</div>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{ height: '100%', borderRadius: 3, background: 'var(--jm-blue)', width: `${Math.round((readBooks.length / BOOKS.length) * 100)}%`, transition: 'width 0.4s' }} />
                </div>

                {/* Completed books row */}
                {readBooks.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Completed</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {readBooks.map(id => {
                        const b = BOOKS.find(x => x.id === id);
                        if (!b) return null;
                        return (
                          <div
                            key={id}
                            onClick={() => setSelectedBook(id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(19,74,124,0.08)', border: '1px solid rgba(19,74,124,0.15)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--jm-blue)' }}
                          >
                            <span style={{ color: '#16a34a', fontSize: 13 }}>✓</span>
                            {b.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Next Up */}
                {nextUpBookData && (
                  <div style={{ background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Next Up in Recommended Order</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--jm-blue)' }}>{nextUpBookData.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>by {nextUpBookData.author}</div>
                    </div>
                    <button
                      onClick={() => setSelectedBook(nextUpBookData.id)}
                      style={{ padding: '8px 18px', background: 'var(--jm-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Start Reading →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quiz Progress Tracker */}
          <div style={{ marginBottom: 24, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: 'var(--jm-blue)', margin: 0 }}>
                📝 Quiz Progress
              </h2>
              <span style={{ fontSize: 13, fontWeight: 700, color: quizzesTaken.length === quizBookIds.length ? '#16a34a' : 'var(--jm-blue)' }}>
                {quizzesTaken.length} / {quizBookIds.length} quizzes taken
              </span>
            </div>

            {quizzesTaken.length === quizBookIds.length ? (
              <div style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', borderRadius: 10, padding: '14px 20px', color: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>🏆</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>All quizzes completed!</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Outstanding knowledge — you know this library.</div>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{ height: '100%', borderRadius: 3, background: '#EE3227', width: `${Math.round((quizzesTaken.length / quizBookIds.length) * 100)}%`, transition: 'width 0.4s' }} />
                </div>

                {/* Tests Taken */}
                {quizzesTaken.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Tests Taken</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {quizzesTaken.map(id => {
                        const b = BOOKS.find(x => x.id === id);
                        if (!b) return null;
                        const score = quizScores[id];
                        const total = BOOK_QUIZZES[id].length;
                        const pct = Math.round((score / total) * 100);
                        const passed = score >= passingScore(id);
                        return (
                          <div key={id} onClick={() => setSelectedBook(id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: passed ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.05)', border: `1px solid ${passed ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`, borderRadius: 8, cursor: 'pointer' }}>
                            <span style={{ fontSize: 16 }}>{passed ? '✅' : '❌'}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--jm-blue)' }}>{b.title}</div>
                              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{b.author}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: passed ? '#16a34a' : '#dc2626' }}>{score}/{total}</div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: passed ? '#16a34a' : '#dc2626' }}>{pct}% — {passed ? 'PASSED' : 'RETRY'}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Next Test Up */}
                {nextQuizBook && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Next Test Up</div>
                    <div style={{ background: 'rgba(238,50,39,0.05)', border: '1px solid rgba(238,50,39,0.15)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--jm-blue)' }}>{nextQuizBook.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>by {nextQuizBook.author} · 20 questions · need 18/20 to pass</div>
                      </div>
                      <button onClick={() => setSelectedBook(nextQuizBook.id)} style={{ padding: '8px 18px', background: '#EE3227', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Take Test →
                      </button>
                    </div>
                    {quizzesNotTaken.length > 1 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 6 }}>Also upcoming:</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {quizzesNotTaken.slice(1, 5).map(id => {
                            const b = BOOKS.find(x => x.id === id);
                            return b ? (
                              <div key={id} onClick={() => setSelectedBook(id)} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: 'var(--gray-200)', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', color: 'var(--text)' }}>
                                {b.title}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Search filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search books by title or author"
              style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', color: 'var(--charcoal)' }}
            />
          </div>

          {/* Book grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {filteredBooks.map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedBook(b.id)}
                style={{
                  background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(19,74,124,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <button
                  onClick={(e) => toggleFavorite(e, b.id)}
                  style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 }}
                  title={favorites.includes(b.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.includes(b.id) ? '\u2764\uFE0F' : '\u{1F90D}'}
                </button>
                {readBooks.includes(b.id) && (
                  <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--jm-blue)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: '14px 0 8px 0', letterSpacing: '0.05em' }}>
                    READ
                  </div>
                )}
                <div style={{ fontSize: 36, marginBottom: 12 }}>📖</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 4 }}>
                  {b.title}
                </div>
                <div style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 12 }}>{b.author}</div>
                <button
                  onClick={e => toggleRead(e, b.id)}
                  style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', border: `1px solid ${readBooks.includes(b.id) ? 'var(--jm-blue)' : 'var(--border)'}`, borderRadius: 20, background: readBooks.includes(b.id) ? 'var(--jm-blue)' : 'transparent', color: readBooks.includes(b.id) ? '#fff' : 'var(--gray-500)', cursor: 'pointer' }}
                >
                  {readBooks.includes(b.id) ? '✓ Read' : 'Mark as Read'}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : book ? (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button
            onClick={() => setSelectedBook(null)}
            style={{ background: 'none', border: 'none', color: 'var(--jm-blue)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Back to Library
          </button>

          {/* Book Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 8 }}>
              {book.title}
            </h1>
            <div style={{ fontSize: 18, color: 'var(--gray-500)', marginBottom: 16 }}>by {book.author}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={(e) => toggleFavorite(e, book.id)}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 14px', cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {favorites.includes(book.id) ? '\u2764\uFE0F' : '\u{1F90D}'} {favorites.includes(book.id) ? 'Favorited' : 'Add to Favorites'}
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/dashboard/reading?book=${book.id}`;
                  navigator.clipboard.writeText(url).then(() => showToast('Link copied!', 'success')).catch(() => showToast('Failed to copy link', 'error'));
                }}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 14px', cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                🔗 Share
              </button>
              {/* Mark Reading Complete CTA */}
              <button
                onClick={(e) => toggleRead(e, book.id)}
                style={{
                  background: readBooks.includes(book.id) ? '#16a34a' : 'var(--jm-blue)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  padding: '6px 20px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.2s',
                }}
              >
                {readBooks.includes(book.id) ? '✓ Reading Complete' : 'Mark Reading Complete'}
              </button>
            </div>
            {readBooks.includes(book.id) && (
              <div style={{ marginTop: 12, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                Congratulations on completing this book! Keep building your leadership library.
              </div>
            )}
          </div>

          {/* About the Author */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 12 }}>
              About the Author
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text)' }}>{book.aboutAuthor}</p>
          </div>

          {/* Why This Book Matters */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderTop: '3px solid #EE3227', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#EE3227', marginBottom: 12 }}>
              Why This Book Matters for JM Valley
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text)' }}>{book.importance}</p>
          </div>

          {/* Key Excerpts */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 16 }}>
              Key Chapters & Excerpts
            </h2>
            {book.keyExcerpts.map((ex, i) => (
              <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < book.keyExcerpts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--jm-blue)', marginBottom: 6 }}>
                  {ex.chapter}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text)', fontStyle: 'italic', paddingLeft: 16, borderLeft: '3px solid var(--border)' }}>
                  &ldquo;{ex.excerpt}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Discussion Questions */}
          {book.discussionQuestions && book.discussionQuestions.length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 16 }}>
                Discussion Questions for Book Club
              </h2>
              <ol style={{ paddingLeft: 24, fontSize: 15, lineHeight: 2, color: 'var(--text)' }}>
                {book.discussionQuestions.map((q, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {/* How to Apply */}
          {book.howToApply && (
            <div style={{ background: 'linear-gradient(135deg, #134A7C 0%, #1a5a94 100%)', borderRadius: 14, padding: 28, marginBottom: 20, color: '#fff' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
                How to Apply This at Your Store
              </h2>
              <div style={{ fontSize: 15, lineHeight: 1.9, opacity: 0.95 }}>
                {book.howToApply.map((item, i) => (
                  <div key={i} style={{ marginBottom: 12, display: 'flex', gap: 10 }}>
                    <span style={{ fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {book.keyTakeaways && book.keyTakeaways.length > 0 && (
            <div style={{ background: 'rgba(19,74,124,0.06)', border: '1px solid rgba(19,74,124,0.15)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 16 }}>
                Key Takeaways
              </h2>
              <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                {book.keyTakeaways.map((t, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 15, lineHeight: 1.7, color: 'var(--text)' }}>
                    <span style={{ color: 'var(--jm-blue)', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Store Scenarios */}
          {book.storeScenarios && book.storeScenarios.length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 16 }}>
                This Book at Your Store
              </h2>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20, marginTop: -8 }}>Real scenarios that show how these concepts play out in a Jersey Mike\'s environment.</p>
              {book.storeScenarios.map((scenario, i) => (
                <div key={i} style={{ marginBottom: i < book.storeScenarios.length - 1 ? 16 : 0, padding: '16px 20px', background: 'rgba(238,50,39,0.06)', border: '1px solid rgba(238,50,39,0.2)', borderLeft: '4px solid #EE3227', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#EE3227', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Scenario {i + 1}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>{scenario}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chapter Deep Dive */}
          {book.chapterDeepDive && book.chapterDeepDive.length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 6 }}>
                Chapter Deep Dive
              </h2>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>Expanded analysis of key chapters and why they matter for JM Valley operators.</p>
              {book.chapterDeepDive.map((item, i) => (
                <div key={i} style={{ marginBottom: 10, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleChapter(i)}
                    style={{ width: '100%', textAlign: 'left', padding: '14px 18px', background: expandedChapters[i] ? 'rgba(19,74,124,0.06)' : 'var(--gray-100)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--jm-blue)' }}>{item.chapter}</span>
                    <span style={{ fontSize: 18, color: 'var(--jm-blue)', flexShrink: 0, transform: expandedChapters[i] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                  </button>
                  {expandedChapters[i] && (
                    <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
                      <p style={{ fontSize: 14, lineHeight: 1.85, color: 'var(--text)', margin: 0 }}>{item.summary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quiz / Assessment */}
          {BOOK_QUIZZES[book?.id] && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: quizActive ? 20 : 0 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: 'var(--jm-blue)', margin: 0 }}>
                  📝 Comprehension Quiz
                </h2>
                {!quizActive && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {quizScores[book.id] !== undefined && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: quizScores[book.id] >= passingScore(book.id) ? '#16a34a' : '#dc2626' }}>
                        Last score: {quizScores[book.id]}/{BOOK_QUIZZES[book.id]?.length || 20} {quizScores[book.id] >= passingScore(book.id) ? '✅ PASSED' : '❌ RETRY'}
                      </span>
                    )}
                    <button
                      onClick={() => { setQuizActive(true); setQuizAnswers({}); setQuizSubmitted(false); }}
                      style={{ padding: '8px 20px', background: 'var(--jm-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                    >
                      {quizScores[book.id] !== undefined ? 'Retake Quiz' : 'Take Quiz'}
                    </button>
                  </div>
                )}
              </div>
              {quizActive && (
                <div>
                  {!quizSubmitted && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(19,74,124,0.08)', borderRadius: 8, border: '1px solid rgba(19,74,124,0.2)', marginBottom: 20, fontSize: 13, color: 'var(--jm-blue)', fontWeight: 600 }}>
                      <span>📋 {BOOK_QUIZZES[book.id]?.length || 20} questions</span>
                      <span>Need {passingScore(book.id)}/{BOOK_QUIZZES[book.id]?.length || 20} to pass (90%)</span>
                    </div>
                  )}
                  {BOOK_QUIZZES[book.id].map((q, qi) => (
                    <div key={qi} style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--gray-100)', borderRadius: 10, border: quizSubmitted ? (quizAnswers[qi] === q.a ? '1.5px solid #16a34a' : '1.5px solid #dc2626') : '1px solid var(--border)' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                        {qi + 1}. {q.q}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {q.opts.map((opt, oi) => {
                          const isSelected = quizAnswers[qi] === oi;
                          const isCorrect = quizSubmitted && oi === q.a;
                          const isWrong = quizSubmitted && isSelected && oi !== q.a;
                          return (
                            <button
                              key={oi}
                              disabled={quizSubmitted}
                              onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                              style={{
                                textAlign: 'left', padding: '10px 14px', borderRadius: 8, cursor: quizSubmitted ? 'default' : 'pointer', fontSize: 14, transition: 'all 0.15s',
                                border: isCorrect ? '1.5px solid #16a34a' : isWrong ? '1.5px solid #dc2626' : isSelected ? '1.5px solid #134A7C' : '1px solid var(--border)',
                                background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isSelected ? 'rgba(19,74,124,0.06)' : 'var(--white)',
                                color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : isSelected ? 'var(--jm-blue)' : 'var(--text)',
                                fontWeight: isSelected || isCorrect ? 600 : 400,
                              }}
                            >
                              {isCorrect && quizSubmitted ? '✓ ' : isWrong ? '✗ ' : ''}{opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {!quizSubmitted ? (
                    <button
                      onClick={() => {
                        if (Object.keys(quizAnswers).length < BOOK_QUIZZES[book.id].length) return;
                        setQuizSubmitted(true);
                        const score = BOOK_QUIZZES[book.id].filter((q, qi) => quizAnswers[qi] === q.a).length;
                        setQuizScores(prev => {
                          const next = { ...prev, [book.id]: score };
                          localStorage.setItem('rt-reading-quiz-scores', JSON.stringify(next));
                          return next;
                        });
                      }}
                      disabled={Object.keys(quizAnswers).length < BOOK_QUIZZES[book.id].length}
                      style={{ width: '100%', padding: '12px', background: Object.keys(quizAnswers).length < BOOK_QUIZZES[book.id].length ? 'var(--border)' : 'var(--jm-blue)', color: Object.keys(quizAnswers).length < BOOK_QUIZZES[book.id].length ? '#9ca3af' : '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: Object.keys(quizAnswers).length < BOOK_QUIZZES[book.id].length ? 'not-allowed' : 'pointer' }}
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <div style={{ fontSize: 36, fontWeight: 800, color: quizScores[book.id] >= passingScore(book.id) ? '#16a34a' : '#dc2626', marginBottom: 8 }}>
                        {quizScores[book.id]}/{BOOK_QUIZZES[book.id]?.length || 20}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 6 }}>
                        Need {passingScore(book.id)}/{BOOK_QUIZZES[book.id]?.length || 20} to pass (90%)
                      </div>
                      <div style={{ fontSize: 15, color: 'var(--text)', marginBottom: 16 }}>
                        {quizScores[book.id] === (BOOK_QUIZZES[book.id]?.length || 20) ? '🎉 Perfect score! You know this book cold.' : quizScores[book.id] >= passingScore(book.id) ? '✅ PASSED — great job! You absorbed the key concepts.' : '📖 Not quite — review the excerpts and key takeaways, then retry.'}
                      </div>
                      <button onClick={() => { setQuizActive(false); setQuizSubmitted(false); setQuizAnswers({}); }} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
                        Close Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Get the Book */}
          <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 20 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: 'var(--jm-blue)', marginBottom: 16 }}>
              Get This Book
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'var(--jm-blue)', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
              >
                📦 Amazon
              </a>
              <a
                href={book.audibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#EE3227', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
              >
                🎧 Audible
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
