/**
 * Demo Mode — Pre-seeded data for presentation/demo access.
 * Demo users get read-only access with realistic sample data.
 * No real data is exposed. No writes to /data/.
 */

export const DEMO_PROFILE = {
  setupComplete: true,
  role: 'administrator',
  roleApproved: true,
  displayName: 'Chris Ruzylo',
  districtManager: 'Narek Khudabakhshyan',
  storeNumber: '20360',
  storeName: "Jersey Mike's #20360 - Santa Barbara",
  street: '199 S Turnpike Rd Suite 102',
  city: 'Santa Barbara',
  state: 'CA',
  phone: '(820) 203-4891',
  operatorName: 'Chris Ruzylo',
  operatorPhone: '(805) 555-0100',
  assistantName: 'Adrian Llamas',
  assistantTitle: 'Assistant Restaurant Operator',
  assistantPhone: '(805) 555-0200',
  stores: [
    {
      storeNumber: '20360',
      storeName: "Jersey Mike's #20360 - Santa Barbara",
      street: '199 S Turnpike Rd Suite 102',
      city: 'Santa Barbara',
      state: 'CA',
      phone: '(820) 203-4891',
      operatorName: 'Chris Ruzylo',
      operatorPhone: '(805) 555-0100',
      assistantName: 'Adrian Llamas',
      assistantTitle: 'Assistant Restaurant Operator',
      assistantPhone: '(805) 555-0200',
    },
  ],
};

export const DEMO_USERS = [
  {
    id: 'demo-user-1',
    email: 'chrisr@jmvalley.com',
    displayName: 'Chris Ruzylo',
    role: 'administrator',
    roleApproved: true,
    rolePending: false,
    setupComplete: true,
    storeCount: 1,
  },
  {
    id: 'demo-user-2',
    email: 'jacob@jmvalley.com',
    displayName: 'Jacob Elliott',
    role: 'district_manager',
    roleApproved: true,
    rolePending: false,
    setupComplete: true,
    storeCount: 6,
  },
  {
    id: 'demo-user-3',
    email: 'marco@jmvalley.com',
    displayName: 'Marco Gonzalez',
    role: 'operator',
    roleApproved: true,
    rolePending: false,
    setupComplete: true,
    storeCount: 1,
  },
  {
    id: 'demo-user-4',
    email: 'newmanager@jmvalley.com',
    displayName: 'Sarah Thompson',
    role: 'district_manager',
    roleApproved: false,
    rolePending: true,
    setupComplete: true,
    storeCount: 3,
  },
];

export const DEMO_TICKETS = [
  {
    id: 'demo-ticket-1',
    type: 'feature',
    title: 'Add bulk catering order export to CSV',
    description: 'Would be helpful to export all catering orders for a date range as a CSV for accounting reconciliation.',
    status: 'open',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    createdAt: '2026-03-24T10:30:00.000Z',
  },
  {
    id: 'demo-ticket-2',
    type: 'bug',
    title: 'PDF download cuts off bottom signature line on mobile',
    description: 'When generating a Written Warning on iPhone Safari, the bottom signature area gets cut off in the downloaded PDF.',
    status: 'open',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    createdAt: '2026-03-22T14:15:00.000Z',
  },
  {
    id: 'demo-ticket-3',
    type: 'feature',
    title: 'Employee scheduling integration with Homebase',
    description: 'It would save time if we could pull shift data from Homebase directly into timesheet correction forms.',
    status: 'open',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    createdAt: '2026-03-20T09:45:00.000Z',
  },
];

export const DEMO_LOGS = [
  {
    id: 'demo-log-1',
    generatorType: 'written-warning',
    action: 'download',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    filename: 'JMVG_WrittenWarning_John_Doe_2026-04-02.pdf',
    formData: { employeeName: 'John Doe', warningType: 'Written Warning', storeNumber: '20360' },
    createdAt: '2026-04-02T16:30:00.000Z',
  },
  {
    id: 'demo-log-2',
    generatorType: 'catering-order',
    action: 'download',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    filename: 'JMVG_CateringOrder_Acme_Corp_2026-04-01.pdf',
    formData: { customerName: 'Acme Corp', totalSubs: 24, deliveryDate: '2026-04-05' },
    createdAt: '2026-04-01T11:15:00.000Z',
  },
  {
    id: 'demo-log-3',
    generatorType: 'evaluation',
    action: 'drive-save',
    userId: 'demo-user-2',
    userName: 'Jacob Elliott',
    userEmail: 'jacob@jmvalley.com',
    filename: 'JMVG_Evaluation_Jane_Smith_2026-03-31.pdf',
    formData: { employeeName: 'Jane Smith', overallScore: 4.2, storeNumber: '20381' },
    createdAt: '2026-03-31T09:00:00.000Z',
  },
  {
    id: 'demo-log-4',
    generatorType: 'injury-report',
    action: 'email-send',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    filename: 'JMVG_InjuryReport_Alex_Martinez_2026-03-28.pdf',
    formData: { employeeName: 'Alex Martinez', injuryType: 'Laceration', storeNumber: '20360' },
    createdAt: '2026-03-28T14:22:00.000Z',
  },
  {
    id: 'demo-log-5',
    generatorType: 'coaching-form',
    action: 'download',
    userId: 'demo-user-3',
    userName: 'Marco Gonzalez',
    userEmail: 'marco@jmvalley.com',
    filename: 'JMVG_CoachingForm_Tyler_Brooks_2026-03-26.pdf',
    formData: { employeeName: 'Tyler Brooks', coachingTopic: 'Uniform compliance', storeNumber: '20388' },
    createdAt: '2026-03-26T10:45:00.000Z',
  },
  {
    id: 'demo-log-6',
    generatorType: 'meal-break-waiver',
    action: 'download',
    userId: 'demo-user',
    userName: 'Chris Ruzylo',
    userEmail: 'demo@ro-tools.app',
    filename: 'JMVG_MealBreakWaiver_Sarah_Kim_2026-03-25.pdf',
    formData: { employeeName: 'Sarah Kim', shiftDate: '2026-03-25', storeNumber: '20360' },
    createdAt: '2026-03-25T08:30:00.000Z',
  },
  {
    id: 'demo-log-7',
    generatorType: 'termination',
    action: 'download',
    userId: 'demo-user-2',
    userName: 'Jacob Elliott',
    userEmail: 'jacob@jmvalley.com',
    filename: 'JMVG_Termination_Chris_Reed_2026-03-22.pdf',
    formData: { employeeName: 'Chris Reed', reason: 'No call no show', storeNumber: '20381' },
    createdAt: '2026-03-22T15:00:00.000Z',
  },
];

/**
 * DEMO_SCOREBOARD — 5 weeks of realistic weekly performance records for 7 stores.
 * Shape matches what ALL_WEEKS in scoreboard-data.js provides: each entry is an
 * array of store rows with the same fields used by getWeekScoreboard / getLeaderboards.
 * (The live scoreboard page reads from scoreboard-data.js directly, so this export is
 * available for any future demo-aware scoreboard API or admin preview.)
 */
export const DEMO_SCOREBOARD = {
  1: {
    dateRange: 'Dec 29 - Jan 4',
    data: [
      { storeId: '20360', netSales: 17223, pySales: 16613, breadCount: 105, pyGrowth: 3.55, cogsActual: 23.80, cogsVariance: -1.45, labor: 20.83, laborTarget: 22.10 },
      { storeId: '20366', netSales: 36342, pySales: 31346, breadCount: 211, pyGrowth: 5.10, cogsActual: 23.90, cogsVariance: -1.53, labor: 18.37, laborTarget: 19.90 },
      { storeId: '20381', netSales: 31892, pySales: 28995, breadCount: 195, pyGrowth: 4.30, cogsActual: 24.20, cogsVariance: -1.73, labor: 19.86, laborTarget: 20.40 },
      { storeId: '20218', netSales: 28315, pySales: 25414, breadCount: 178, pyGrowth: 11.41, cogsActual: 23.54, cogsVariance: -1.40, labor: 19.43, laborTarget: 20.70 },
      { storeId: '20267', netSales: 29961, pySales: 26207, breadCount: 176, pyGrowth: 14.33, cogsActual: 23.46, cogsVariance: -1.69, labor: 19.75, laborTarget: 20.60 },
      { storeId: '20363', netSales: 31876, pySales: 28133, breadCount: 183, pyGrowth: 4.30, cogsActual: 23.48, cogsVariance: -1.73, labor: 20.13, laborTarget: 20.40 },
      { storeId: '20388', netSales: 18932, pySales: 17322, breadCount: 108, pyGrowth: 9.29, cogsActual: 22.70, cogsVariance: -1.18, labor: 21.92, laborTarget: 22.00 },
    ],
  },
  2: {
    dateRange: 'Jan 5 - Jan 11',
    data: [
      { storeId: '20366', netSales: 46549, pySales: 36342, breadCount: 271, pyGrowth: 12.43, cogsActual: 23.62, cogsVariance: -1.78, labor: 17.56, laborTarget: 18.90 },
      { storeId: '20381', netSales: 36879, pySales: 31892, breadCount: 224, pyGrowth: 5.65, cogsActual: 23.49, cogsVariance: -1.02, labor: 19.56, laborTarget: 19.90 },
      { storeId: '20218', netSales: 36745, pySales: 28315, breadCount: 226, pyGrowth: 8.55, cogsActual: 23.71, cogsVariance: -1.53, labor: 18.54, laborTarget: 19.90 },
      { storeId: '20267', netSales: 38678, pySales: 29961, breadCount: 227, pyGrowth: 2.53, cogsActual: 23.20, cogsVariance: -0.98, labor: 17.82, laborTarget: 19.70 },
      { storeId: '20363', netSales: 35868, pySales: 31876, breadCount: 216, pyGrowth: 2.40, cogsActual: 24.89, cogsVariance: -2.30, labor: 18.99, laborTarget: 20.00 },
      { storeId: '20360', netSales: 19687, pySales: 18802, breadCount: 120, pyGrowth: 9.02, cogsActual: 23.87, cogsVariance: -1.23, labor: 22.20, laborTarget: 21.90 },
      { storeId: '20388', netSales: 14337, pySales: 18932, breadCount: 81, pyGrowth: 11.01, cogsActual: 23.08, cogsVariance: -1.69, labor: 24.10, laborTarget: 22.40 },
    ],
  },
  3: {
    dateRange: 'Jan 12 - Jan 18',
    data: [
      { storeId: '20366', netSales: 47662, pySales: 46549, breadCount: 278, pyGrowth: 2.98, cogsActual: 22.55, cogsVariance: -1.87, labor: 17.66, laborTarget: 18.80 },
      { storeId: '20381', netSales: 38766, pySales: 36879, breadCount: 236, pyGrowth: 13.97, cogsActual: 23.71, cogsVariance: -1.48, labor: 19.36, laborTarget: 19.80 },
      { storeId: '20218', netSales: 38668, pySales: 36745, breadCount: 237, pyGrowth: 8.43, cogsActual: 23.03, cogsVariance: -1.45, labor: 18.48, laborTarget: 19.70 },
      { storeId: '20267', netSales: 37767, pySales: 38678, breadCount: 223, pyGrowth: 3.64, cogsActual: 23.97, cogsVariance: -1.98, labor: 17.93, laborTarget: 19.80 },
      { storeId: '20363', netSales: 43050, pySales: 35868, breadCount: 247, pyGrowth: 25.53, cogsActual: 23.32, cogsVariance: -1.79, labor: 18.01, laborTarget: 19.30 },
      { storeId: '20360', netSales: 20842, pySales: 17325, breadCount: 126, pyGrowth: 22.37, cogsActual: 23.39, cogsVariance: -1.61, labor: 19.94, laborTarget: 21.80 },
      { storeId: '20388', netSales: 14917, pySales: 14337, breadCount: 85, pyGrowth: 21.21, cogsActual: 22.08, cogsVariance: -1.29, labor: 21.25, laborTarget: 22.40 },
    ],
  },
  4: {
    dateRange: 'Jan 19 - Jan 25',
    data: [
      { storeId: '20366', netSales: 49360, pySales: 47662, breadCount: 287, pyGrowth: 8.64, cogsActual: 22.00, cogsVariance: -1.31, labor: 17.82, laborTarget: 18.60 },
      { storeId: '20381', netSales: 38239, pySales: 38766, breadCount: 242, pyGrowth: 15.41, cogsActual: 23.76, cogsVariance: -1.77, labor: 20.05, laborTarget: 19.70 },
      { storeId: '20218', netSales: 38623, pySales: 38668, breadCount: 239, pyGrowth: 3.07, cogsActual: 23.67, cogsVariance: -1.34, labor: 19.37, laborTarget: 19.70 },
      { storeId: '20267', netSales: 35963, pySales: 37767, breadCount: 217, pyGrowth: 5.96, cogsActual: 23.40, cogsVariance: -1.48, labor: 19.44, laborTarget: 20.00 },
      { storeId: '20363', netSales: 36239, pySales: 43050, breadCount: 221, pyGrowth: 16.84, cogsActual: 23.70, cogsVariance: -1.99, labor: 19.79, laborTarget: 19.90 },
      { storeId: '20360', netSales: 18477, pySales: 17579, breadCount: 114, pyGrowth: 10.63, cogsActual: 23.76, cogsVariance: -1.07, labor: 22.90, laborTarget: 22.00 },
      { storeId: '20388', netSales: 12327, pySales: 14916, breadCount: 73, pyGrowth: 11.75, cogsActual: 23.31, cogsVariance: -1.32, labor: 25.65, laborTarget: 22.60 },
    ],
  },
  5: {
    dateRange: 'Jan 26 - Feb 2',
    data: [
      { storeId: '20366', netSales: 43737, pySales: 49360, breadCount: 252, pyGrowth: 6.46, cogsActual: 23.37, cogsVariance: -1.11, labor: 18.64, laborTarget: 19.20 },
      { storeId: '20381', netSales: 38517, pySales: 38239, breadCount: 230, pyGrowth: 8.65, cogsActual: 23.75, cogsVariance: -1.46, labor: 20.09, laborTarget: 19.70 },
      { storeId: '20218', netSales: 39690, pySales: 38623, breadCount: 240, pyGrowth: 10.46, cogsActual: 23.96, cogsVariance: -1.87, labor: 19.53, laborTarget: 19.60 },
      { storeId: '20267', netSales: 39077, pySales: 35963, breadCount: 230, pyGrowth: 1.06, cogsActual: 23.72, cogsVariance: -1.02, labor: 18.29, laborTarget: 19.60 },
      { storeId: '20363', netSales: 35675, pySales: 36239, breadCount: 211, pyGrowth: 11.14, cogsActual: 24.34, cogsVariance: -2.46, labor: 21.04, laborTarget: 20.00 },
      { storeId: '20360', netSales: 20591, pySales: 16791, breadCount: 121, pyGrowth: 22.51, cogsActual: 23.03, cogsVariance: -1.01, labor: 19.90, laborTarget: 21.80 },
      { storeId: '20388', netSales: 15085, pySales: 12327, breadCount: 86, pyGrowth: 13.51, cogsActual: 23.85, cogsVariance: -1.76, labor: 22.98, laborTarget: 22.30 },
    ],
  },
};

/**
 * DEMO_CATERING_CLIENTS — 5 realistic catering clients for demo store #20360.
 * Shape matches the enriched client objects returned by GET /api/catering/clients:
 * base client fields + computed totalRevenue, orderCount, lastOrderDate, lastOrderAmount.
 */
export const DEMO_CATERING_CLIENTS = [
  {
    id: 'demo-client-1',
    clientName: 'Rachel Torres',
    companyName: 'Deckers Brands — SB HQ',
    phone: '(805) 967-7611',
    email: 'rachel.torres@deckers.com',
    address: '250 Coromar Dr, Goleta, CA 93117',
    notes: 'Orders for quarterly all-hands meetings. Prefers mix of #7 and #13. Always requests extra napkins and condiment packs.',
    notableDates: [
      { label: 'Q2 All-Hands', date: '2026-06-15' },
      { label: 'Q4 All-Hands', date: '2026-12-08' },
    ],
    reorderFrequency: 'quarterly',
    createdBy: 'demo-user',
    createdAt: '2025-09-12T10:00:00.000Z',
    updatedAt: '2026-03-28T14:00:00.000Z',
    totalRevenue: 3847.50,
    orderCount: 4,
    lastOrderDate: '2026-03-28',
    lastOrderAmount: 1079.40,
  },
  {
    id: 'demo-client-2',
    clientName: 'Mike Sandoval',
    companyName: 'Santa Barbara Unified — Washington Elementary',
    phone: '(805) 963-4338',
    email: 'msandoval@sbusd.org',
    address: '1215 Samarkand Dr, Santa Barbara, CA 93105',
    notes: 'Teacher appreciation lunches, end-of-year events. Budget-conscious — watches the sub count closely. Usually books 2-3 weeks in advance.',
    notableDates: [
      { label: 'Teacher Appreciation Week', date: '2026-05-04' },
      { label: 'Last Day of School Lunch', date: '2026-06-12' },
    ],
    reorderFrequency: 'yearly',
    createdBy: 'demo-user',
    createdAt: '2025-10-05T09:30:00.000Z',
    updatedAt: '2026-01-15T11:00:00.000Z',
    totalRevenue: 1258.65,
    orderCount: 2,
    lastOrderDate: '2026-01-15',
    lastOrderAmount: 629.65,
  },
  {
    id: 'demo-client-3',
    clientName: 'Jasmine Okafor',
    companyName: 'Cottage Health — HR Dept',
    phone: '(805) 682-7111',
    email: 'jokafor@cottagehospital.com',
    address: '400 W Pueblo St, Santa Barbara, CA 93105',
    notes: 'Monthly team lunches for HR. Rotating on a set schedule — very reliable account. Pays by corporate card on delivery. Asks for a receipt every time.',
    notableDates: [],
    reorderFrequency: 'monthly',
    createdBy: 'demo-user',
    createdAt: '2025-07-20T08:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
    totalRevenue: 5184.00,
    orderCount: 9,
    lastOrderDate: '2026-04-01',
    lastOrderAmount: 576.00,
  },
  {
    id: 'demo-client-4',
    clientName: 'Trevor Winslow',
    companyName: 'UCSB Club Baseball',
    phone: '(805) 893-3216',
    email: 'twinslow@ucsb.edu',
    address: 'Campus—Harder Stadium, Isla Vista, CA 93106',
    notes: 'Post-game team meals, pre-season kickoff. 20-30 subs per order. Usually pays cash on delivery. Scheduling varies by season.',
    notableDates: [
      { label: 'Season Opener Meal', date: '2026-02-07' },
      { label: 'End of Season Banquet', date: '2026-05-16' },
    ],
    reorderFrequency: 'biweekly',
    createdBy: 'demo-user',
    createdAt: '2026-01-10T15:00:00.000Z',
    updatedAt: '2026-03-22T17:00:00.000Z',
    totalRevenue: 1617.30,
    orderCount: 5,
    lastOrderDate: '2026-03-22',
    lastOrderAmount: 359.80,
  },
  {
    id: 'demo-client-5',
    clientName: 'Dana Whitfield',
    companyName: 'Procore Technologies',
    phone: '(805) 308-9000',
    email: 'dwhitfield@procore.com',
    address: '6309 Carpinteria Ave, Carpinteria, CA 93013',
    notes: 'Sprint wrap-up lunches for engineering team. Large headcount orders ($800-$1200). Prefers advance notice of 1 week. Will occasionally do back-to-back weeks during crunch periods.',
    notableDates: [
      { label: 'Engineering All-Hands', date: '2026-07-22' },
    ],
    reorderFrequency: 'monthly',
    createdBy: 'demo-user',
    createdAt: '2025-11-03T11:00:00.000Z',
    updatedAt: '2026-03-31T10:00:00.000Z',
    totalRevenue: 4320.00,
    orderCount: 4,
    lastOrderDate: '2026-03-31',
    lastOrderAmount: 1080.00,
  },
];

/**
 * DEMO_CATERING_ORDERS — order history matching DEMO_CATERING_CLIENTS.
 * Used by /api/catering/clients/[id] and /api/catering/orders in demo mode.
 */
export const DEMO_CATERING_ORDERS = [
  // Deckers Brands orders
  { id: 'demo-order-1', clientId: 'demo-client-1', orderDate: '2026-03-28', totalAmount: 1079.40, itemCount: 12, headCount: 55, notes: 'Q1 wrap-up all-hands', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-03-28T14:00:00.000Z' },
  { id: 'demo-order-2', clientId: 'demo-client-1', orderDate: '2025-12-18', totalAmount: 899.50, itemCount: 10, headCount: 45, notes: 'Holiday team lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-12-18T13:00:00.000Z' },
  { id: 'demo-order-3', clientId: 'demo-client-1', orderDate: '2025-11-05', totalAmount: 989.80, itemCount: 11, headCount: 50, notes: 'Q3 all-hands', autoGenerated: true, createdBy: 'demo-user', createdAt: '2025-11-05T12:00:00.000Z' },
  { id: 'demo-order-4', clientId: 'demo-client-1', orderDate: '2025-09-12', totalAmount: 878.80, itemCount: 10, headCount: 44, notes: 'First order', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-09-12T11:00:00.000Z' },
  // Washington Elementary orders
  { id: 'demo-order-5', clientId: 'demo-client-2', orderDate: '2026-01-15', totalAmount: 629.65, itemCount: 7, headCount: 32, notes: 'Staff training day lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2026-01-15T11:00:00.000Z' },
  { id: 'demo-order-6', clientId: 'demo-client-2', orderDate: '2025-10-05', totalAmount: 629.00, itemCount: 7, headCount: 31, notes: 'Teacher appreciation', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-10-05T10:00:00.000Z' },
  // Cottage Health orders
  { id: 'demo-order-7', clientId: 'demo-client-3', orderDate: '2026-04-01', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'April HR lunch', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-04-01T12:00:00.000Z' },
  { id: 'demo-order-8', clientId: 'demo-client-3', orderDate: '2026-03-04', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'March HR lunch', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-03-04T12:00:00.000Z' },
  { id: 'demo-order-9', clientId: 'demo-client-3', orderDate: '2026-02-04', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Feb HR lunch', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-02-04T12:00:00.000Z' },
  { id: 'demo-order-10', clientId: 'demo-client-3', orderDate: '2026-01-07', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Jan HR lunch', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-01-07T12:00:00.000Z' },
  { id: 'demo-order-11', clientId: 'demo-client-3', orderDate: '2025-12-03', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Dec HR lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-12-03T12:00:00.000Z' },
  { id: 'demo-order-12', clientId: 'demo-client-3', orderDate: '2025-11-04', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Nov HR lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-11-04T12:00:00.000Z' },
  { id: 'demo-order-13', clientId: 'demo-client-3', orderDate: '2025-10-07', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Oct HR lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-10-07T12:00:00.000Z' },
  { id: 'demo-order-14', clientId: 'demo-client-3', orderDate: '2025-09-02', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Sep HR lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-09-02T12:00:00.000Z' },
  { id: 'demo-order-15', clientId: 'demo-client-3', orderDate: '2025-08-05', totalAmount: 576.00, itemCount: 6, headCount: 28, notes: 'Aug HR lunch', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-08-05T12:00:00.000Z' },
  // UCSB Club Baseball orders
  { id: 'demo-order-16', clientId: 'demo-client-4', orderDate: '2026-03-22', totalAmount: 359.80, itemCount: 4, headCount: 22, notes: 'Post-game meal', autoGenerated: false, createdBy: 'demo-user', createdAt: '2026-03-22T18:00:00.000Z' },
  { id: 'demo-order-17', clientId: 'demo-client-4', orderDate: '2026-03-08', totalAmount: 269.85, itemCount: 3, headCount: 18, notes: 'Doubleheader post-game', autoGenerated: false, createdBy: 'demo-user', createdAt: '2026-03-08T18:00:00.000Z' },
  { id: 'demo-order-18', clientId: 'demo-client-4', orderDate: '2026-02-22', totalAmount: 359.80, itemCount: 4, headCount: 22, notes: 'Post-game meal', autoGenerated: false, createdBy: 'demo-user', createdAt: '2026-02-22T18:00:00.000Z' },
  { id: 'demo-order-19', clientId: 'demo-client-4', orderDate: '2026-02-07', totalAmount: 359.80, itemCount: 4, headCount: 22, notes: 'Season opener meal', autoGenerated: false, createdBy: 'demo-user', createdAt: '2026-02-07T18:00:00.000Z' },
  { id: 'demo-order-20', clientId: 'demo-client-4', orderDate: '2026-01-10', totalAmount: 268.05, itemCount: 3, headCount: 17, notes: 'Pre-season kickoff', autoGenerated: false, createdBy: 'demo-user', createdAt: '2026-01-10T16:00:00.000Z' },
  // Procore Technologies orders
  { id: 'demo-order-21', clientId: 'demo-client-5', orderDate: '2026-03-31', totalAmount: 1080.00, itemCount: 12, headCount: 60, notes: 'Q1 sprint wrap-up', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-03-31T12:00:00.000Z' },
  { id: 'demo-order-22', clientId: 'demo-client-5', orderDate: '2026-02-28', totalAmount: 1080.00, itemCount: 12, headCount: 60, notes: 'Feb sprint wrap', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-02-28T12:00:00.000Z' },
  { id: 'demo-order-23', clientId: 'demo-client-5', orderDate: '2026-01-31', totalAmount: 1080.00, itemCount: 12, headCount: 60, notes: 'Jan sprint wrap', autoGenerated: true, createdBy: 'demo-user', createdAt: '2026-01-31T12:00:00.000Z' },
  { id: 'demo-order-24', clientId: 'demo-client-5', orderDate: '2025-11-03', totalAmount: 1080.00, itemCount: 12, headCount: 60, notes: 'Nov sprint wrap', autoGenerated: false, createdBy: 'demo-user', createdAt: '2025-11-03T12:00:00.000Z' },
];

/**
 * Check if a session is a demo session.
 */
export function isDemo(session) {
  return session?.isDemo === true || session?.email === 'demo@ro-tools.app';
}
