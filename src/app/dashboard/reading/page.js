'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';

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
    ],
    discussionQuestions: [
      'What is one habit you currently have at your store that compounds positively? What about negatively?',
      'James Clear says "You do not rise to the level of your goals — you fall to the level of your systems." What systems at your store need improvement?',
      'Which of the four laws (Obvious, Attractive, Easy, Satisfying) is the hardest to apply with your team?',
      'How could you use habit stacking to improve your opening or closing procedures?',
      'Clear talks about identity-based habits. Instead of "I want to run a better store," the shift is "I am the type of operator who..." — finish that sentence.',
      'What is one 1% improvement you could make this week that would compound over time?',
    ],
    howToApply: [
      'Post a "Habit Scorecard" in the back office — list 5 daily habits (9:59 ready, bread count by 10 AM, FIFO check, etc.) and check them off each day.',
      'Use habit stacking for your team: "After clocking in, the first thing you do is check the prep list" — make it the default, not a choice.',
      'Make good habits obvious: put the closing checklist on the counter at 8 PM, not hidden in a binder.',
      'Celebrate small wins publicly — when someone hits their bread count 5 days in a row, call it out at the next team meeting.',
      'Remove friction from desired behaviors: pre-stage cleaning supplies so the closing crew doesn\'t have to hunt for them.',
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
    ],
    discussionQuestions: [
      'Which of the six habits (clarity, energy, necessity, productivity, influence, courage) is your strongest? Your weakest?',
      'How do you manage your energy during a 10-hour shift? What drains you and what recharges you?',
      'Burchard says "raise necessity" — what makes your role feel truly necessary beyond just a paycheck?',
      'How do you currently influence your team? What could you do to challenge them to grow more?',
      'What is one courageous conversation you\'ve been avoiding with a team member?',
    ],
    howToApply: [
      'Start each shift by writing down your top 3 priorities for the day — this is "seeking clarity" in action.',
      'Take a 2-minute energy reset between lunch rush and mid-afternoon — step outside, breathe, reset your intention.',
      'Before your next store visit (DMs) or shift start (ROs), ask yourself: "What does this team need from me right now?" — that\'s necessity.',
      'Identify one team member per week to specifically develop — give them a stretch assignment and coach them through it.',
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
    ],
    discussionQuestions: [
      'Are you currently a Doer, Supervisor, Coach, or Leader? What would it take to move up one level?',
      'When you visit a store, do you inspect AND develop? Or just inspect?',
      'What\'s the biggest consistency gap across your district/store right now?',
      'Sullivan says invest 80% of development time in top performers. Are you doing that, or spending more time on underperformers?',
      'What does your ideal store visit look like? Write out the agenda.',
    ],
    howToApply: [
      'Create a standardized store visit checklist — 10 items you check every time, with a development conversation built in.',
      'Identify your top 2 ROs/SLs and schedule monthly 1-on-1 development sessions with them.',
      'Document your store\'s "playbook" — the 20 things that must happen the same way every day, regardless of who\'s working.',
      'Practice the delegation framework: What needs to be done, why it matters, what "done well" looks like, when it\'s due, and what support they need.',
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
    ],
    discussionQuestions: [
      'What is your biggest excuse right now? What would happen if you eliminated it completely?',
      'Tracy says the most important task at each moment determines your success. What task are you avoiding?',
      'How disciplined are you with your store\'s daily closeout? Weekly reports? Monthly P&L review?',
      'What would your store look like if every team member had zero excuses?',
    ],
    howToApply: [
      'Start each day by identifying your "frog" — the one task you\'re most likely to procrastinate on — and do it first.',
      'Eliminate the phrase "I can\'t because..." from your vocabulary for one week. Replace it with "How can I..."',
      'Set a non-negotiable rule: closeout completed within 30 minutes of closing, no exceptions.',
      'Hold yourself to the same standards you hold your team. If they can\'t be late, neither can you.',
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
    ],
    discussionQuestions: [
      'Which of the 21 laws is the hardest for you to practice consistently?',
      'Maxwell says leadership is influence. Who influences your store the most — and is it you?',
      'What is the "lid" on your store\'s potential right now? Is it a people problem or a leadership problem?',
      'How are you investing in your own leadership development on a daily basis?',
      'Who is your leadership legacy? Name one person you\'re actively developing to lead after you.',
    ],
    howToApply: [
      'Pick one law per week to focus on. Write it on a sticky note on your desk. Evaluate yourself at the end of each week.',
      'Ask your team for honest feedback: "On a scale of 1-10, how much do you trust me? What would make it a 10?"',
      'Identify the lid on each of your shift leads\' potential and create a 30-day development plan for each.',
      'Practice the Law of Addition: do one thing today that adds value to someone on your team with zero expectation of return.',
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
    ],
    discussionQuestions: [
      'What was the hardest part of your transition from crew to management?',
      'Is there a difficult conversation you need to have with someone this week?',
      'How do you handle delegating to someone who used to be your peer?',
      'What did you wish someone had told you before you became a manager?',
      'McCormick says listen more than you talk in the first 90 days. Do you still practice this?',
    ],
    howToApply: [
      'When promoting a new shift lead, sit down with them and walk through this book\'s first 3 chapters together.',
      'Create a "New Manager Checklist" for your store — the 20 things every new SL needs to know in their first 30 days.',
      'Practice the difficult conversation framework: describe the behavior, explain the impact, ask for their perspective, agree on next steps.',
      'Schedule a weekly 15-minute check-in with your newest manager. Ask: "What\'s your biggest challenge right now?"',
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
    ],
    discussionQuestions: [
      'What energy do you bring to the store each day? Would your team describe it as positive?',
      'Gordon says "oneness over separateness." How connected does your team feel to each other?',
      'When was the last time you led from fear (deadlines, consequences) vs. love (purpose, connection)?',
      'What is one thing you could change about your mindset that would transform your leadership?',
    ],
    howToApply: [
      'Start each shift with a 30-second positive energy check — greet every team member by name and ask how they\'re doing.',
      'When things go wrong during a rush, pause and reset your energy before reacting. Your team watches you.',
      'Create a "team wins" board in the back — write one positive thing that happened each day.',
      'Before a difficult conversation, ask yourself: "Am I approaching this from fear or from genuine care for this person?"',
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
    ],
    discussionQuestions: [
      'What is your "frog" this week — the task you keep putting off?',
      'Tracy says 20% of tasks drive 80% of results. What\'s in your 20%?',
      'How much time do you spend on "C" and "D" tasks that could be delegated or eliminated?',
      'Do you "single handle" tasks, or do you jump between 5 things at once during a shift?',
    ],
    howToApply: [
      'Every morning before the store opens, write your top 3 frogs on a sticky note. Eat the biggest one first.',
      'Use the ABCDE method on your weekly to-do list. Be honest — how many items are really "E" (eliminate)?',
      'Block 30 minutes of uninterrupted time each day for your most important task. No phone, no interruptions.',
      'Teach your shift leads to identify their frog too. Make it a daily team habit.',
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
    ],
    discussionQuestions: [
      'Which quadrant do you default to — Radical Candor, Ruinous Empathy, Obnoxious Aggression, or Manipulative Insincerity?',
      'Think of the last time you avoided giving critical feedback. What was the cost of that silence?',
      'How do you receive feedback? Are you modeling the behavior you want from your team?',
      'Scott says praise publicly, criticize privately. Are you consistent with this?',
      'What would change if every person on your team practiced Radical Candor with each other?',
    ],
    howToApply: [
      'This week, give one piece of specific praise and one piece of kind, clear criticism to a team member.',
      'When you see a sub made wrong, use the framework: "I care about you AND the standard is..." — both at the same time.',
      'Ask your shift leads: "What\'s one thing I could do better as your manager?" Then actually listen and act on it.',
      'Post the 2x2 matrix (Care Personally / Challenge Directly) in the office. Reference it in coaching conversations.',
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
    ],
    discussionQuestions: [
      'What level are you at with your team? Are you at different levels with different people?',
      'Maxwell says you can be at Level 4 with one person and Level 2 with another. Who needs you to level up?',
      'What would it take for you to move from Production (Level 3) to People Development (Level 4)?',
      'Who in your life operates at Level 5? What makes them different?',
    ],
    howToApply: [
      'Honestly assess your level with each direct report. Write it down. Then create a plan to go up one level with each.',
      'If you\'re stuck at Level 1 (Position) with someone, invest in the relationship before trying to get results.',
      'To reach Level 3, focus on one measurable result you can achieve in the next 30 days that your team can see.',
      'To reach Level 4, identify one person you\'ll mentor this quarter and commit to developing their leadership capacity.',
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
    ],
    discussionQuestions: [
      'What are your written goals for this year? This quarter? This month?',
      'Tracy says 95% of what we do is habitual. What habits are running your store on autopilot?',
      'What is the most valuable use of your time right now — and are you doing it?',
      'How much time per week do you invest in your own skills and knowledge?',
    ],
    howToApply: [
      'Write down your top 3 goals for the next 90 days. Review them every morning before your shift.',
      'Track one key metric daily for 30 days (labor %, customer complaints, on-time opens). The habit of tracking creates the habit of improving.',
      'Invest 30 minutes per day in learning — this book club, podcasts, or industry articles.',
      'Create a "habit audit" for your store — what happens automatically, and what falls through the cracks?',
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
    ],
    discussionQuestions: [
      'We use L10 meetings at JM Valley. How closely do your weekly meetings follow the EOS format?',
      'What are your 3-7 rocks this quarter? Can you name them right now without looking?',
      'How effective is your IDS process? Do issues get solved or just discussed repeatedly?',
      'Wickman says "right person, right seat." Is everyone on your team in the right seat?',
      'What 5-15 numbers on a weekly scorecard would give you the true pulse of your store?',
    ],
    howToApply: [
      'Use the L10 format exactly as described: segue, scorecard, rock review, to-do list, IDS. Don\'t skip steps.',
      'Set 3-5 rocks (90-day priorities) for yourself and each shift lead. Review them weekly.',
      'When an issue comes up, use IDS: state the issue in one sentence, discuss for max 5 minutes, decide the solution and who owns it.',
      'Build a weekly scorecard: sales, labor %, food cost %, customer complaints, on-time opens, checklist completion, attestation completion.',
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
    ],
    discussionQuestions: [
      'Sinek says "leaders eat last." Do you literally eat last at your store? Does your team notice?',
      'How safe does your team feel to make mistakes, ask questions, or challenge a decision?',
      'When was the last time you put a team member\'s needs above your own convenience?',
      'What is one thing you could do this week to expand the Circle of Safety at your store?',
    ],
    howToApply: [
      'During the next team lunch or meeting, serve yourself last. It\'s symbolic but your team will notice.',
      'When someone makes a mistake, respond with "What happened?" instead of "Why did you do that?" — safety before accountability.',
      'Take the worst shift once a month. Work the position nobody wants. Show your team you\'re not above any task.',
      'If you fire someone, do it with dignity and compassion. How you treat people on their worst day defines your leadership.',
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
    ],
    discussionQuestions: [
      'What would "unreasonable hospitality" look like at your Jersey Mike\'s location?',
      'When was the last time a customer told a story about their experience at your store? Was it positive?',
      'Guidara says hospitality is a dialogue, not a monologue. How well do you listen to your customers?',
      'What is one small, unexpected thing you could do for a regular customer this week?',
      'How do you teach your crew to be hospitable vs. just transactional?',
    ],
    howToApply: [
      'Create a "legend" this week — do something unexpected for a customer. Remember their name. Give a kid a free cookie. Deliver a catering order with a handwritten note.',
      'Train your team to ask one question beyond the order: "First time here?" or "How\'s your day going?" — genuine connection.',
      'Keep a notebook of regular customers\' names and usual orders. Greet them by name.',
      'When something goes wrong with an order, don\'t just fix it — make it a legendary recovery. The complaint is the opportunity.',
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
    ],
    discussionQuestions: [
      'Could your store run smoothly for a week without you? If not, what would break first?',
      'Are you the Entrepreneur, the Manager, or the Technician in your daily work? Which should you be more of?',
      'What processes at your store exist only in someone\'s head? How would you document them?',
      'Gerber says "your business is a system." What system at your store is broken or missing?',
      'How much time do you spend working IN the business vs. ON the business?',
    ],
    howToApply: [
      'Pick one process this week (opening, closing, prep) and document it step-by-step so anyone could follow it.',
      'Test your systems: have your newest employee run the process from the documentation alone. Where do they get stuck?',
      'Schedule 2 hours per week for "working ON the business" — not making subs, not solving problems, but improving systems.',
      'Use RO Control\'s checklist system to turn your tribal knowledge into repeatable processes that any shift lead can execute.',
    ],
    audibleUrl: 'https://www.audible.com/pd/The-E-Myth-Revisited-Audiobook/B002V1LGZE',
    amazonUrl: 'https://www.amazon.com/Myth-Revisited-Small-Businesses-About/dp/0887307280',
  },
];

const DEFAULT_FAVORITES = ['atomic-habits', 'traction', 'multi-unit-leadership', 'unreasonable-hospitality', 'leaders-eat-last'];

export default function ReadingPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
  const book = BOOKS.find(b => b.id === selectedBook);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('reading-favorites', JSON.stringify(next));
      return next;
    });
  };

  const sortedBooks = [...BOOKS].sort((a, b) => a.author.localeCompare(b.author));

  return (
    <div className={styles.container}>
      {!selectedBook ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 800, color: '#134A7C', marginBottom: 8 }}>
              Leadership Reading
            </h1>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              The books that shape how we lead at JM Valley Group. Each one has been read, discussed, and applied by our management team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {sortedBooks.map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedBook(b.id)}
                style={{
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '24px 20px',
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
                <div style={{ fontSize: 36, marginBottom: 12 }}>📖</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 800, color: '#134A7C', marginBottom: 4 }}>
                  {b.title}
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>{b.author}</div>
              </div>
            ))}
          </div>
        </>
      ) : book ? (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button
            onClick={() => setSelectedBook(null)}
            style={{ background: 'none', border: 'none', color: '#134A7C', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Back to Library
          </button>

          {/* Book Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 800, color: '#134A7C', marginBottom: 8 }}>
              {book.title}
            </h1>
            <div style={{ fontSize: 18, color: '#6b7280', marginBottom: 8 }}>by {book.author}</div>
            <button
              onClick={(e) => toggleFavorite(e, book.id)}
              style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 20, padding: '4px 14px', cursor: 'pointer', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {favorites.includes(book.id) ? '\u2764\uFE0F' : '\u{1F90D}'} {favorites.includes(book.id) ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>

          {/* About the Author */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#134A7C', marginBottom: 12 }}>
              About the Author
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>{book.aboutAuthor}</p>
          </div>

          {/* Why This Book Matters */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: '3px solid #EE3227', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#EE3227', marginBottom: 12 }}>
              Why This Book Matters for JM Valley
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>{book.importance}</p>
          </div>

          {/* Key Excerpts */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#134A7C', marginBottom: 16 }}>
              Key Chapters & Excerpts
            </h2>
            {book.keyExcerpts.map((ex, i) => (
              <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < book.keyExcerpts.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#134A7C', marginBottom: 6 }}>
                  {ex.chapter}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151', fontStyle: 'italic', paddingLeft: 16, borderLeft: '3px solid #e5e7eb' }}>
                  &ldquo;{ex.excerpt}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Discussion Questions */}
          {book.discussionQuestions && book.discussionQuestions.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#134A7C', marginBottom: 16 }}>
                Discussion Questions for Book Club
              </h2>
              <ol style={{ paddingLeft: 24, fontSize: 15, lineHeight: 2, color: '#374151' }}>
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

          {/* Get the Book */}
          <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 20 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: '#134A7C', marginBottom: 16 }}>
              Get This Book
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#134A7C', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
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
