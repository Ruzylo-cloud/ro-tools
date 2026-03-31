'use client';

import { useState } from 'react';
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
    ],
    audibleUrl: 'https://www.audible.com/pd/The-E-Myth-Revisited-Audiobook/B002V1LGZE',
    amazonUrl: 'https://www.amazon.com/Myth-Revisited-Small-Businesses-About/dp/0887307280',
  },
];

export default function ReadingPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const book = BOOKS.find(b => b.id === selectedBook);

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {BOOKS.map(b => (
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
                {b.readCount > 1 && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: '#EE3227', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                    Read {b.readCount}x
                  </div>
                )}
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
            {book.readCount > 1 && (
              <span style={{ background: 'rgba(238,50,39,0.1)', color: '#EE3227', fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
                Read {book.readCount} times
              </span>
            )}
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
