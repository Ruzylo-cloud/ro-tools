/**
 * JMVG Weekly Scoreboard Data — Weeks 1-11, 2026.
 *
 * Color system (from JMVG scorecard):
 *   Royal Blue = 4 targets reached
 *   Blue       = Double digit growth
 *   Green      = 3 targets reached
 *   Yellow     = 2 targets reached
 *   Orange     = 1 target reached
 *
 * Targets:
 *   LABOR:         Less than labor target based on previous week sales
 *   COGS_VARIANCE: Between -1% and -2.5%
 *   COGS_ACTUAL:   Between 22.0% and 25.0%
 *   PY_GROWTH:     Positive year-over-year sales growth
 *
 * Grand Slam = 4 targets reached (Royal Blue)
 * Trifecta   = 3 targets reached (Green)
 */

// Week 11 data (Mar 9-15, 2026) — from JMVG Scoreboard PDF
const WEEK_11 = [
  { storeId: '20013', netSales: 50436, pySales: 0,     breadCount: 293, pyGrowth: 0,      cogsActual: 15.41, cogsVariance: 6.32,   labor: 22.97, laborTarget: 18.50 },
  { storeId: '20218', netSales: 45659, pySales: 34540, breadCount: 281, pyGrowth: 32.19,  cogsActual: 24.43, cogsVariance: -1.59,  labor: 18.40, laborTarget: 19.00 },
  { storeId: '20381', netSales: 45997, pySales: 31960, breadCount: 274, pyGrowth: 43.92,  cogsActual: 22.93, cogsVariance: -0.70,  labor: 16.77, laborTarget: 19.00 },
  { storeId: '20091', netSales: 47211, pySales: 37613, breadCount: 271, pyGrowth: 25.52,  cogsActual: 23.69, cogsVariance: -1.37,  labor: 17.77, laborTarget: 18.80 },
  { storeId: '20366', netSales: 44663, pySales: 45573, breadCount: 262, pyGrowth: -2.00,  cogsActual: 23.15, cogsVariance: -0.58,  labor: 17.46, laborTarget: 19.10 },
  { storeId: '20363', netSales: 41004, pySales: 30714, breadCount: 246, pyGrowth: 33.50,  cogsActual: 25.03, cogsVariance: -2.48,  labor: 18.36, laborTarget: 19.40 },
  { storeId: '20267', netSales: 40606, pySales: 36707, breadCount: 243, pyGrowth: 10.62,  cogsActual: 23.39, cogsVariance: -1.38,  labor: 17.17, laborTarget: 19.50 },
  { storeId: '20294', netSales: 38199, pySales: 44168, breadCount: 226, pyGrowth: -13.51, cogsActual: 23.89, cogsVariance: -1.56,  labor: 18.70, laborTarget: 19.70 },
  { storeId: '20026', netSales: 36284, pySales: 31172, breadCount: 221, pyGrowth: 16.40,  cogsActual: 23.01, cogsVariance: -1.04,  labor: 18.21, laborTarget: 19.90 },
  { storeId: '20245', netSales: 36808, pySales: 30816, breadCount: 220, pyGrowth: 19.45,  cogsActual: 23.96, cogsVariance: -1.23,  labor: 18.28, laborTarget: 19.90 },
  { storeId: '20156', netSales: 37798, pySales: 40331, breadCount: 220, pyGrowth: -6.28,  cogsActual: 23.51, cogsVariance: -1.03,  labor: 17.22, laborTarget: 19.80 },
  { storeId: '20292', netSales: 36848, pySales: 28067, breadCount: 217, pyGrowth: 31.29,  cogsActual: 19.98, cogsVariance: -2.75,  labor: 18.78, laborTarget: 19.90 },
  { storeId: '20048', netSales: 34876, pySales: 33097, breadCount: 205, pyGrowth: 5.38,   cogsActual: 24.05, cogsVariance: -1.67,  labor: 20.07, laborTarget: 20.10 },
  { storeId: '20300', netSales: 31834, pySales: 26025, breadCount: 189, pyGrowth: 22.32,  cogsActual: 24.75, cogsVariance: -1.69,  labor: 20.20, laborTarget: 20.40 },
  { storeId: '20255', netSales: 32417, pySales: 26275, breadCount: 187, pyGrowth: 23.38,  cogsActual: 23.64, cogsVariance: -1.34,  labor: 18.54, laborTarget: 20.30 },
  { storeId: '20311', netSales: 30864, pySales: 36564, breadCount: 182, pyGrowth: -15.59, cogsActual: 22.64, cogsVariance: -1.91,  labor: 19.37, laborTarget: 20.50 },
  { storeId: '20116', netSales: 31190, pySales: 25258, breadCount: 181, pyGrowth: 23.49,  cogsActual: 23.24, cogsVariance: -1.21,  labor: 19.53, laborTarget: 20.40 },
  { storeId: '20291', netSales: 30521, pySales: 22940, breadCount: 177, pyGrowth: 33.04,  cogsActual: 24.13, cogsVariance: -1.46,  labor: 20.75, laborTarget: 20.50 },
  { storeId: '20171', netSales: 29793, pySales: 35162, breadCount: 170, pyGrowth: -15.27, cogsActual: 30.24, cogsVariance: -0.94,  labor: 21.67, laborTarget: 20.60 },
  { storeId: '20352', netSales: 28512, pySales: 24214, breadCount: 167, pyGrowth: 17.75,  cogsActual: 23.08, cogsVariance: -0.92,  labor: 19.52, laborTarget: 20.70 },
  { storeId: '20075', netSales: 28550, pySales: 23954, breadCount: 166, pyGrowth: 19.19,  cogsActual: 23.71, cogsVariance: -1.35,  labor: 18.88, laborTarget: 20.70 },
  { storeId: '20071', netSales: 27260, pySales: 23381, breadCount: 165, pyGrowth: 16.59,  cogsActual: 36.26, cogsVariance: -13.55, labor: 22.11, laborTarget: 20.80 },
  { storeId: '20177', netSales: 27484, pySales: 23551, breadCount: 162, pyGrowth: 16.70,  cogsActual: 20.96, cogsVariance: 1.21,   labor: 23.60, laborTarget: 20.80 },
  { storeId: '20011', netSales: 27542, pySales: 22235, breadCount: 159, pyGrowth: 23.87,  cogsActual: 24.38, cogsVariance: -1.38,  labor: 19.64, laborTarget: 20.80 },
  { storeId: '20273', netSales: 27232, pySales: 23870, breadCount: 158, pyGrowth: 14.08,  cogsActual: 22.29, cogsVariance: -3.56,  labor: 18.98, laborTarget: 20.80 },
  { storeId: '20360', netSales: 21606, pySales: 18314, breadCount: 132, pyGrowth: 17.98,  cogsActual: 22.78, cogsVariance: -1.10,  labor: 19.28, laborTarget: 21.40 },
  { storeId: '20335', netSales: 21489, pySales: 17392, breadCount: 127, pyGrowth: 23.56,  cogsActual: 24.10, cogsVariance: -1.48,  labor: 20.17, laborTarget: 21.40 },
  { storeId: '20424', netSales: 21835, pySales: 0,     breadCount: 126, pyGrowth: 0,      cogsActual: 22.66, cogsVariance: -0.90,  labor: 20.83, laborTarget: 21.40 },
  { storeId: '20388', netSales: 14099, pySales: 11120, breadCount: 80,  pyGrowth: 26.79,  cogsActual: 22.46, cogsVariance: 0.67,   labor: 21.85, laborTarget: 22.40 },
];

const ALL_WEEKS = {
  11: { dateRange: 'Mar 9 - Mar 15', data: WEEK_11 },
  // Weeks 1-2, 4-10 to be added as data becomes available
  // Week 3 excluded — waiting on data
};

/**
 * Calculate how many targets a store hit in a given week.
 * Returns { targetsHit, details, color }
 */
function calculateTargets(row) {
  let targetsHit = 0;
  const details = {};

  // 1. Labor under target
  details.labor = row.labor < row.laborTarget;
  if (details.labor) targetsHit++;

  // 2. COGS Variance between -1% and -2.5%
  details.cogsVariance = row.cogsVariance >= -2.5 && row.cogsVariance <= -1.0;
  if (details.cogsVariance) targetsHit++;

  // 3. COGS Actual between 22% and 25%
  details.cogsActual = row.cogsActual >= 22.0 && row.cogsActual <= 25.0;
  if (details.cogsActual) targetsHit++;

  // 4. Positive PY growth
  details.pyGrowth = row.pyGrowth > 0 && row.pySales > 0;
  if (details.pyGrowth) targetsHit++;

  // Double digit growth check
  const doubleDigit = row.pyGrowth >= 10.0 && row.pySales > 0;

  // Color assignment
  let color = 'orange'; // 1 target
  if (targetsHit >= 4) color = 'royalblue';
  else if (doubleDigit) color = 'blue';
  else if (targetsHit >= 3) color = 'green';
  else if (targetsHit >= 2) color = 'yellow';
  else if (targetsHit === 0) color = 'none';

  return { targetsHit, details, color, isGrandSlam: targetsHit >= 4, isTrifecta: targetsHit >= 3, doubleDigit };
}

/**
 * Get leaderboard stats across all available weeks.
 * Returns sorted arrays for grand slams, trifectas, and avg growth.
 */
export function getLeaderboards() {
  const storeStats = {};

  for (const [weekNum, week] of Object.entries(ALL_WEEKS)) {
    for (const row of week.data) {
      if (!storeStats[row.storeId]) {
        storeStats[row.storeId] = { grandSlams: 0, trifectas: 0, growthWeeks: 0, growthSum: 0, weeksPlayed: 0 };
      }
      const stats = storeStats[row.storeId];
      const result = calculateTargets(row);
      if (result.isGrandSlam) stats.grandSlams++;
      if (result.isTrifecta) stats.trifectas++;
      if (row.pySales > 0) {
        stats.growthWeeks++;
        stats.growthSum += row.pyGrowth;
      }
      stats.weeksPlayed++;
    }
  }

  const entries = Object.entries(storeStats).map(([storeId, stats]) => ({
    storeId,
    grandSlams: stats.grandSlams,
    trifectas: stats.trifectas,
    avgGrowth: stats.growthWeeks > 0 ? stats.growthSum / stats.growthWeeks : 0,
    weeksPlayed: stats.weeksPlayed,
  }));

  return {
    grandSlams: [...entries].sort((a, b) => b.grandSlams - a.grandSlams),
    trifectas: [...entries].sort((a, b) => b.trifectas - a.trifectas),
    avgGrowth: [...entries].filter(e => e.avgGrowth !== 0).sort((a, b) => b.avgGrowth - a.avgGrowth),
  };
}

/**
 * Get a specific week's full scoreboard with targets calculated.
 */
export function getWeekScoreboard(weekNum) {
  const week = ALL_WEEKS[weekNum];
  if (!week) return null;

  return {
    weekNum,
    dateRange: week.dateRange,
    rows: week.data.map(row => ({
      ...row,
      ...calculateTargets(row),
    })).sort((a, b) => b.netSales - a.netSales),
  };
}

/**
 * Get list of available weeks.
 */
export function getAvailableWeeks() {
  return Object.entries(ALL_WEEKS).map(([num, w]) => ({
    weekNum: parseInt(num, 10),
    dateRange: w.dateRange,
  })).sort((a, b) => b.weekNum - a.weekNum);
}

export { ALL_WEEKS, calculateTargets };
