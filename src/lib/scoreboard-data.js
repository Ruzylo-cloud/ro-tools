/**
 * JMVG Weekly Scoreboard Data — 2026 Season
 *
 * Color system:
 *   Royal Blue = 4 targets (Grand Slam)
 *   Blue       = Double digit growth
 *   Green      = 3 targets (Trifecta)
 *   Yellow     = 2 targets
 *   Orange     = 1 target
 *
 * Targets: Labor < target, COGs Variance -1% to -2.5%, COGs Actual 22-25%, PY Growth > 0
 */

const WEEK_1 = [
  { storeId: '20273', netSales: 39231, pySales: 31879, breadCount: 224, pyGrowth: 0.35, cogsActual: 22.76, cogsVariance: -1.30, labor: 17.29, laborTarget: 19.60 },
  { storeId: '20366', netSales: 36342, pySales: 31346, breadCount: 211, pyGrowth: -17.24, cogsActual: 24.56, cogsVariance: -1.53, labor: 18.37, laborTarget: 19.90 },
  { storeId: '20381', netSales: 31892, pySales: 28995, breadCount: 195, pyGrowth: -6.81, cogsActual: 25.44, cogsVariance: -2.31, labor: 19.86, laborTarget: 20.40 },
  { storeId: '20363', netSales: 31876, pySales: 28133, breadCount: 183, pyGrowth: 4.30, cogsActual: 24.48, cogsVariance: -1.73, labor: 20.13, laborTarget: 20.40 },
  { storeId: '20294', netSales: 29971, pySales: 24793, breadCount: 179, pyGrowth: -27.29, cogsActual: 24.41, cogsVariance: -1.43, labor: 20.96, laborTarget: 20.60 },
  { storeId: '20245', netSales: 29034, pySales: 25669, breadCount: 179, pyGrowth: -10.23, cogsActual: 24.70, cogsVariance: -1.68, labor: 20.46, laborTarget: 20.60 },
  { storeId: '20218', netSales: 28315, pySales: 25414, breadCount: 178, pyGrowth: -18.98, cogsActual: 24.54, cogsVariance: -1.40, labor: 21.43, laborTarget: 20.70 },
  { storeId: '20267', netSales: 29961, pySales: 26207, breadCount: 176, pyGrowth: -11.96, cogsActual: 24.46, cogsVariance: -1.69, labor: 20.75, laborTarget: 20.60 },
  { storeId: '20026', netSales: 28435, pySales: 24949, breadCount: 175, pyGrowth: -3.32, cogsActual: 24.88, cogsVariance: -1.02, labor: 21.10, laborTarget: 20.70 },
  { storeId: '20156', netSales: 28821, pySales: 20821, breadCount: 166, pyGrowth: -27.20, cogsActual: 24.51, cogsVariance: -2.24, labor: 19.71, laborTarget: 20.70 },
  { storeId: '20048', netSales: 27372, pySales: 25207, breadCount: 162, pyGrowth: -20.60, cogsActual: 24.66, cogsVariance: -1.96, labor: 21.64, laborTarget: 20.80 },
  { storeId: '20255', netSales: 25411, pySales: 22273, breadCount: 150, pyGrowth: 115.58, cogsActual: 24.37, cogsVariance: -1.10, labor: 22.24, laborTarget: 21.00 },
  { storeId: '20311', netSales: 24576, pySales: 22847, breadCount: 149, pyGrowth: -20.55, cogsActual: 23.10, cogsVariance: -0.53, labor: 21.46, laborTarget: 21.10 },
  { storeId: '20116', netSales: 23873, pySales: 19419, breadCount: 136, pyGrowth: -2.92, cogsActual: 25.85, cogsVariance: -3.40, labor: 22.61, laborTarget: 21.20 },
  { storeId: '20352', netSales: 22543, pySales: 19248, breadCount: 133, pyGrowth: -9.81, cogsActual: 24.12, cogsVariance: -0.85, labor: 20.91, laborTarget: 21.30 },
  { storeId: '20011', netSales: 20382, pySales: 17297, breadCount: 123, pyGrowth: -17.83, cogsActual: 24.88, cogsVariance: -1.01, labor: 23.02, laborTarget: 21.80 },
  { storeId: '20075', netSales: 19045, pySales: 20705, breadCount: 116, pyGrowth: -14.45, cogsActual: 23.85, cogsVariance: -1.01, labor: 23.96, laborTarget: 21.90 },
  { storeId: '20424', netSales: 20269, pySales: 15302, breadCount: 112, pyGrowth: 0, cogsActual: 24.37, cogsVariance: -2.16, labor: 21.15, laborTarget: 21.80 },
  { storeId: '20335', netSales: 17728, pySales: 17132, breadCount: 108, pyGrowth: 2.31, cogsActual: 25.23, cogsVariance: -1.90, labor: 28.93, laborTarget: 22.10 },
  { storeId: '20388', netSales: 18932, pySales: 17322, breadCount: 108, pyGrowth: -17.36, cogsActual: 21.70, cogsVariance: 0.18, labor: 21.92, laborTarget: 22.00 },
  { storeId: '20360', netSales: 17223, pySales: 16613, breadCount: 105, pyGrowth: 3.55, cogsActual: 26.35, cogsVariance: -0.98, labor: 20.83, laborTarget: 22.10 },
];

const WEEK_2 = [
  { storeId: '20366', netSales: 46549, pySales: 36342, breadCount: 271, pyGrowth: -1.93, cogsActual: 23.62, cogsVariance: -1.78, labor: 17.56, laborTarget: 18.90 },
  { storeId: '20267', netSales: 38678, pySales: 29961, breadCount: 227, pyGrowth: 2.53, cogsActual: 23.20, cogsVariance: -0.98, labor: 17.82, laborTarget: 19.70 },
  { storeId: '20218', netSales: 36745, pySales: 28315, breadCount: 226, pyGrowth: -6.45, cogsActual: 24.71, cogsVariance: -1.53, labor: 18.54, laborTarget: 19.90 },
  { storeId: '20381', netSales: 36879, pySales: 31892, breadCount: 224, pyGrowth: -4.05, cogsActual: 23.49, cogsVariance: -1.02, labor: 19.56, laborTarget: 19.90 },
  { storeId: '20363', netSales: 35868, pySales: 31876, breadCount: 216, pyGrowth: 2.40, cogsActual: 24.89, cogsVariance: -2.30, labor: 18.99, laborTarget: 20.00 },
  { storeId: '20294', netSales: 34845, pySales: 29971, breadCount: 211, pyGrowth: -24.07, cogsActual: 24.24, cogsVariance: -1.64, labor: 20.21, laborTarget: 20.10 },
  { storeId: '20156', netSales: 33412, pySales: 28821, breadCount: 199, pyGrowth: -20.03, cogsActual: 23.32, cogsVariance: -1.07, labor: 18.58, laborTarget: 20.20 },
  { storeId: '20026', netSales: 31007, pySales: 28435, breadCount: 191, pyGrowth: 1.48, cogsActual: 24.36, cogsVariance: -1.18, labor: 20.52, laborTarget: 20.40 },
  { storeId: '20245', netSales: 31157, pySales: 29034, breadCount: 187, pyGrowth: 61.48, cogsActual: 24.08, cogsVariance: -1.96, labor: 19.30, laborTarget: 20.40 },
  { storeId: '20048', netSales: 30768, pySales: 27372, breadCount: 182, pyGrowth: -29.98, cogsActual: 23.11, cogsVariance: -1.31, labor: 19.95, laborTarget: 20.50 },
  { storeId: '20255', netSales: 29347, pySales: 25411, breadCount: 171, pyGrowth: -11.59, cogsActual: 21.84, cogsVariance: -0.23, labor: 20.20, laborTarget: 20.60 },
  { storeId: '20273', netSales: 28633, pySales: 39231, breadCount: 168, pyGrowth: 19.53, cogsActual: 23.70, cogsVariance: -1.00, labor: 20.22, laborTarget: 20.70 },
  { storeId: '20311', netSales: 28040, pySales: 24576, breadCount: 162, pyGrowth: -18.53, cogsActual: 22.21, cogsVariance: -1.22, labor: 20.77, laborTarget: 20.70 },
  { storeId: '20075', netSales: 26569, pySales: 24856, breadCount: 156, pyGrowth: 8.97, cogsActual: 22.50, cogsVariance: -1.07, labor: 18.50, laborTarget: 20.90 },
  { storeId: '20116', netSales: 26568, pySales: 23873, breadCount: 155, pyGrowth: 30.88, cogsActual: 23.99, cogsVariance: -1.89, labor: 20.15, laborTarget: 20.90 },
  { storeId: '20011', netSales: 25345, pySales: 20382, breadCount: 146, pyGrowth: -22.79, cogsActual: 23.83, cogsVariance: -1.76, labor: 19.49, laborTarget: 21.00 },
  { storeId: '20352', netSales: 23289, pySales: 22543, breadCount: 141, pyGrowth: -6.35, cogsActual: 23.40, cogsVariance: -1.45, labor: 20.73, laborTarget: 21.20 },
  { storeId: '20424', netSales: 23109, pySales: 20269, breadCount: 131, pyGrowth: 0, cogsActual: 23.33, cogsVariance: -1.13, labor: 21.96, laborTarget: 21.20 },
  { storeId: '20360', netSales: 19687, pySales: 18802, breadCount: 120, pyGrowth: 9.02, cogsActual: 24.87, cogsVariance: -1.23, labor: 22.20, laborTarget: 21.90 },
  { storeId: '20335', netSales: 19582, pySales: 18511, breadCount: 116, pyGrowth: 7.12, cogsActual: 24.17, cogsVariance: -1.75, labor: 20.30, laborTarget: 21.90 },
  { storeId: '20388', netSales: 14337, pySales: 18932, breadCount: 81, pyGrowth: 54.01, cogsActual: 24.08, cogsVariance: -1.69, labor: 24.10, laborTarget: 22.40 },
];

const WEEK_4 = [
  { storeId: '20366', netSales: 49360, pySales: 47662, breadCount: 287, pyGrowth: 8.64, cogsActual: 22.00, cogsVariance: -1.31, labor: 17.82, laborTarget: 18.60 },
  { storeId: '20381', netSales: 38239, pySales: 38766, breadCount: 242, pyGrowth: 15.41, cogsActual: 23.76, cogsVariance: -0.77, labor: 20.05, laborTarget: 19.70 },
  { storeId: '20218', netSales: 38623, pySales: 38668, breadCount: 239, pyGrowth: 3.07, cogsActual: 23.67, cogsVariance: -1.34, labor: 19.37, laborTarget: 19.70 },
  { storeId: '20294', netSales: 39768, pySales: 37862, breadCount: 237, pyGrowth: -11.72, cogsActual: 20.63, cogsVariance: -0.72, labor: 19.47, laborTarget: 19.60 },
  { storeId: '20363', netSales: 36239, pySales: 43050, breadCount: 221, pyGrowth: 16.84, cogsActual: 23.70, cogsVariance: -1.99, labor: 19.79, laborTarget: 19.90 },
  { storeId: '20267', netSales: 35963, pySales: 37767, breadCount: 217, pyGrowth: 5.96, cogsActual: 23.40, cogsVariance: -0.48, labor: 19.44, laborTarget: 20.00 },
  { storeId: '20245', netSales: 32699, pySales: 34232, breadCount: 201, pyGrowth: 38.68, cogsActual: 24.27, cogsVariance: -1.85, labor: 19.72, laborTarget: 20.30 },
  { storeId: '20156', netSales: 33829, pySales: 36037, breadCount: 198, pyGrowth: -16.84, cogsActual: 23.04, cogsVariance: -1.05, labor: 19.21, laborTarget: 20.20 },
  { storeId: '20048', netSales: 33298, pySales: 32523, breadCount: 194, pyGrowth: -1.04, cogsActual: 22.28, cogsVariance: -1.21, labor: 19.19, laborTarget: 20.20 },
  { storeId: '20026', netSales: 30948, pySales: 31821, breadCount: 192, pyGrowth: 0.67, cogsActual: 24.55, cogsVariance: -1.75, labor: 21.35, laborTarget: 20.50 },
  { storeId: '20255', netSales: 30813, pySales: 30162, breadCount: 184, pyGrowth: 24.34, cogsActual: 21.54, cogsVariance: 0.15, labor: 20.06, laborTarget: 20.50 },
  { storeId: '20352', netSales: 27946, pySales: 27539, breadCount: 167, pyGrowth: 6.38, cogsActual: 22.06, cogsVariance: -1.41, labor: 19.34, laborTarget: 20.80 },
  { storeId: '20311', netSales: 27876, pySales: 28718, breadCount: 163, pyGrowth: 6.09, cogsActual: 22.10, cogsVariance: -1.35, labor: 20.59, laborTarget: 20.80 },
  { storeId: '20116', netSales: 27311, pySales: 28512, breadCount: 159, pyGrowth: 6.40, cogsActual: 24.56, cogsVariance: -1.83, labor: 19.81, laborTarget: 20.80 },
  { storeId: '20075', netSales: 26741, pySales: 23728, breadCount: 157, pyGrowth: 14.89, cogsActual: 23.99, cogsVariance: -1.98, labor: 20.00, laborTarget: 20.90 },
  { storeId: '20273', netSales: 26094, pySales: 30049, breadCount: 155, pyGrowth: 14.77, cogsActual: 23.06, cogsVariance: -1.03, labor: 20.94, laborTarget: 20.90 },
  { storeId: '20011', netSales: 23358, pySales: 25473, breadCount: 138, pyGrowth: 0.23, cogsActual: 23.58, cogsVariance: -0.83, labor: 22.14, laborTarget: 21.20 },
  { storeId: '20424', netSales: 22023, pySales: 22063, breadCount: 128, pyGrowth: 0, cogsActual: 22.36, cogsVariance: -0.26, labor: 21.86, laborTarget: 21.30 },
  { storeId: '20335', netSales: 20711, pySales: 18954, breadCount: 122, pyGrowth: 10.96, cogsActual: 24.09, cogsVariance: -2.00, labor: 19.60, laborTarget: 21.80 },
  { storeId: '20360', netSales: 18477, pySales: 17579, breadCount: 114, pyGrowth: 10.63, cogsActual: 23.76, cogsVariance: -1.07, labor: 22.90, laborTarget: 22.00 },
  { storeId: '20388', netSales: 12327, pySales: 14916, breadCount: 73, pyGrowth: 11.75, cogsActual: 24.31, cogsVariance: -1.32, labor: 25.65, laborTarget: 22.60 },
];

const WEEK_5 = [
  { storeId: '20366', netSales: 43737, pySales: 49360, breadCount: 252, pyGrowth: -8.46, cogsActual: 23.37, cogsVariance: -1.11, labor: 18.64, laborTarget: 19.20 },
  { storeId: '20218', netSales: 39690, pySales: 38623, breadCount: 240, pyGrowth: -0.46, cogsActual: 23.96, cogsVariance: -1.87, labor: 19.53, laborTarget: 19.60 },
  { storeId: '20294', netSales: 37696, pySales: 39768, breadCount: 238, pyGrowth: -13.87, cogsActual: 25.40, cogsVariance: -2.54, labor: 21.15, laborTarget: 19.80 },
  { storeId: '20267', netSales: 39077, pySales: 35963, breadCount: 230, pyGrowth: 1.06, cogsActual: 18.72, cogsVariance: 1.02, labor: 18.29, laborTarget: 19.60 },
  { storeId: '20381', netSales: 38517, pySales: 38239, breadCount: 230, pyGrowth: 8.65, cogsActual: 23.75, cogsVariance: -1.46, labor: 20.09, laborTarget: 19.70 },
  { storeId: '20048', netSales: 36274, pySales: 33298, breadCount: 212, pyGrowth: 13.08, cogsActual: 23.80, cogsVariance: -1.43, labor: 18.29, laborTarget: 19.90 },
  { storeId: '20363', netSales: 35675, pySales: 36239, breadCount: 211, pyGrowth: 11.14, cogsActual: 25.34, cogsVariance: -3.46, labor: 21.04, laborTarget: 20.00 },
  { storeId: '20026', netSales: 32993, pySales: 30948, breadCount: 203, pyGrowth: 2.17, cogsActual: 23.99, cogsVariance: -1.75, labor: 20.16, laborTarget: 20.30 },
  { storeId: '20245', netSales: 34175, pySales: 32699, breadCount: 202, pyGrowth: 4.21, cogsActual: 22.90, cogsVariance: -2.01, labor: 19.54, laborTarget: 20.10 },
  { storeId: '20156', netSales: 33092, pySales: 33829, breadCount: 189, pyGrowth: -25.99, cogsActual: 22.52, cogsVariance: -1.21, labor: 19.85, laborTarget: 20.20 },
  { storeId: '20075', netSales: 29109, pySales: 23379, breadCount: 171, pyGrowth: 24.59, cogsActual: 22.18, cogsVariance: -1.37, labor: 18.80, laborTarget: 20.60 },
  { storeId: '20255', netSales: 28217, pySales: 30813, breadCount: 163, pyGrowth: 0.71, cogsActual: 21.94, cogsVariance: -0.03, labor: 20.69, laborTarget: 20.70 },
  { storeId: '20311', netSales: 27329, pySales: 27876, breadCount: 157, pyGrowth: 0.07, cogsActual: 25.44, cogsVariance: -3.81, labor: 21.53, laborTarget: 20.80 },
  { storeId: '20273', netSales: 25951, pySales: 26094, breadCount: 154, pyGrowth: 6.64, cogsActual: 24.54, cogsVariance: -1.07, labor: 21.38, laborTarget: 21.00 },
  { storeId: '20011', netSales: 25340, pySales: 23358, breadCount: 150, pyGrowth: -9.95, cogsActual: 23.96, cogsVariance: -1.95, labor: 20.23, laborTarget: 21.00 },
  { storeId: '20352', netSales: 26172, pySales: 27946, breadCount: 150, pyGrowth: 13.93, cogsActual: 24.82, cogsVariance: -2.10, labor: 20.18, laborTarget: 20.90 },
  { storeId: '20116', netSales: 27434, pySales: 27311, breadCount: 148, pyGrowth: 2.57, cogsActual: 21.83, cogsVariance: -2.02, labor: 20.23, laborTarget: 20.80 },
  { storeId: '20335', netSales: 21302, pySales: 17387, breadCount: 125, pyGrowth: 23.24, cogsActual: 23.29, cogsVariance: -1.75, labor: 19.10, laborTarget: 21.40 },
  { storeId: '20360', netSales: 20591, pySales: 16791, breadCount: 121, pyGrowth: 22.51, cogsActual: 23.03, cogsVariance: -1.01, labor: 19.90, laborTarget: 21.80 },
  { storeId: '20424', netSales: 21925, pySales: 22023, breadCount: 118, pyGrowth: 0, cogsActual: 22.88, cogsVariance: -2.03, labor: 22.16, laborTarget: 21.40 },
  { storeId: '20388', netSales: 15085, pySales: 12327, breadCount: 86, pyGrowth: 13.51, cogsActual: 23.85, cogsVariance: -0.76, labor: 22.98, laborTarget: 22.30 },
];

const WEEK_6 = [
  { storeId: '20218', netSales: 43074, pySales: 39690, breadCount: 267, pyGrowth: 18.57, cogsActual: 23.47, cogsVariance: -1.26, labor: 18.84, laborTarget: 19.20 },
  { storeId: '20366', netSales: 45294, pySales: 43737, breadCount: 261, pyGrowth: -9.73, cogsActual: 22.99, cogsVariance: -1.54, labor: 18.25, laborTarget: 19.00 },
  { storeId: '20381', netSales: 42457, pySales: 38517, breadCount: 254, pyGrowth: 21.32, cogsActual: 23.24, cogsVariance: -1.33, labor: 17.88, laborTarget: 19.30 },
  { storeId: '20294', netSales: 38128, pySales: 37696, breadCount: 229, pyGrowth: -13.10, cogsActual: 23.46, cogsVariance: -1.53, labor: 19.76, laborTarget: 19.70 },
  { storeId: '20363', netSales: 37863, pySales: 35675, breadCount: 226, pyGrowth: 13.55, cogsActual: 22.02, cogsVariance: -1.74, labor: 20.11, laborTarget: 19.80 },
  { storeId: '20267', netSales: 36990, pySales: 39077, breadCount: 223, pyGrowth: 0.42, cogsActual: 25.31, cogsVariance: -2.25, labor: 18.76, laborTarget: 19.90 },
  { storeId: '20245', netSales: 35052, pySales: 34175, breadCount: 210, pyGrowth: 16.47, cogsActual: 25.19, cogsVariance: -1.36, labor: 18.70, laborTarget: 20.00 },
  { storeId: '20026', netSales: 33380, pySales: 32993, breadCount: 206, pyGrowth: 1.04, cogsActual: 24.93, cogsVariance: -1.86, labor: 19.00, laborTarget: 20.20 },
  { storeId: '20156', netSales: 34689, pySales: 33092, breadCount: 204, pyGrowth: -14.96, cogsActual: 22.29, cogsVariance: -1.02, labor: 18.36, laborTarget: 20.10 },
  { storeId: '20048', netSales: 33125, pySales: 36274, breadCount: 196, pyGrowth: 7.52, cogsActual: 23.16, cogsVariance: -1.76, labor: 18.54, laborTarget: 20.20 },
  { storeId: '20255', netSales: 32385, pySales: 28217, breadCount: 189, pyGrowth: 11.50, cogsActual: 22.81, cogsVariance: -1.61, labor: 18.48, laborTarget: 20.30 },
  { storeId: '20116', netSales: 30197, pySales: 27434, breadCount: 174, pyGrowth: 14.57, cogsActual: 23.60, cogsVariance: -2.14, labor: 19.59, laborTarget: 20.50 },
  { storeId: '20311', netSales: 28275, pySales: 27329, breadCount: 173, pyGrowth: -12.80, cogsActual: 23.20, cogsVariance: -1.44, labor: 19.52, laborTarget: 20.70 },
  { storeId: '20352', netSales: 27485, pySales: 26172, breadCount: 164, pyGrowth: 10.22, cogsActual: 23.10, cogsVariance: -1.72, labor: 20.46, laborTarget: 20.80 },
  { storeId: '20075', netSales: 27449, pySales: 25522, breadCount: 161, pyGrowth: 7.44, cogsActual: 23.98, cogsVariance: -1.01, labor: 18.40, laborTarget: 20.80 },
  { storeId: '20011', netSales: 25633, pySales: 25340, breadCount: 150, pyGrowth: 1.83, cogsActual: 24.28, cogsVariance: -2.40, labor: 19.76, laborTarget: 21.00 },
  { storeId: '20424', netSales: 24716, pySales: 21925, breadCount: 143, pyGrowth: 0, cogsActual: 22.44, cogsVariance: -1.25, labor: 20.81, laborTarget: 21.10 },
  { storeId: '20273', netSales: 23088, pySales: 25951, breadCount: 137, pyGrowth: 1.31, cogsActual: 24.74, cogsVariance: -1.11, labor: 20.98, laborTarget: 21.20 },
  { storeId: '20335', netSales: 20041, pySales: 17916, breadCount: 119, pyGrowth: 10.59, cogsActual: 23.82, cogsVariance: -1.88, labor: 17.30, laborTarget: 21.80 },
  { storeId: '20360', netSales: 19254, pySales: 16751, breadCount: 116, pyGrowth: 12.63, cogsActual: 24.85, cogsVariance: -1.82, labor: 20.58, laborTarget: 21.90 },
  { storeId: '20388', netSales: 13588, pySales: 15085, breadCount: 77, pyGrowth: 10.60, cogsActual: 21.88, cogsVariance: -0.41, labor: 22.79, laborTarget: 22.50 },
];

const WEEK_7 = [
  { storeId: '20366', netSales: 42039, pySales: 42557, breadCount: 244, pyGrowth: -1.22, cogsActual: 24.41, cogsVariance: -0.90, labor: 19.01, laborTarget: 19.30 },
  { storeId: '20363', netSales: 40002, pySales: 31020, breadCount: 233, pyGrowth: 28.96, cogsActual: 24.79, cogsVariance: -3.20, labor: 18.14, laborTarget: 19.50 },
  { storeId: '20218', netSales: 35718, pySales: 34531, breadCount: 224, pyGrowth: 3.44, cogsActual: 23.81, cogsVariance: -1.50, labor: 20.36, laborTarget: 20.00 },
  { storeId: '20267', netSales: 36981, pySales: 35304, breadCount: 223, pyGrowth: 4.75, cogsActual: 22.98, cogsVariance: -1.35, labor: 18.02, laborTarget: 19.90 },
  { storeId: '20381', netSales: 36946, pySales: 33299, breadCount: 222, pyGrowth: 10.95, cogsActual: 24.18, cogsVariance: -1.84, labor: 19.72, laborTarget: 19.90 },
  { storeId: '20294', netSales: 36685, pySales: 42583, breadCount: 216, pyGrowth: -13.85, cogsActual: 23.07, cogsVariance: -1.51, labor: 20.31, laborTarget: 19.90 },
  { storeId: '20026', netSales: 31170, pySales: 30910, breadCount: 194, pyGrowth: 0.84, cogsActual: 41.38, cogsVariance: -15.78, labor: 19.48, laborTarget: 20.40 },
  { storeId: '20156', netSales: 32168, pySales: 40850, breadCount: 192, pyGrowth: -21.25, cogsActual: 23.99, cogsVariance: -0.85, labor: 20.33, laborTarget: 20.30 },
  { storeId: '20048', netSales: 31085, pySales: 24728, breadCount: 184, pyGrowth: 25.71, cogsActual: 23.29, cogsVariance: -1.80, labor: 19.24, laborTarget: 20.40 },
  { storeId: '20245', netSales: 29743, pySales: 30000, breadCount: 181, pyGrowth: -0.86, cogsActual: 25.25, cogsVariance: -2.32, labor: 20.41, laborTarget: 20.60 },
  { storeId: '20116', netSales: 28968, pySales: 25645, breadCount: 170, pyGrowth: 12.96, cogsActual: 24.55, cogsVariance: -2.67, labor: 19.63, laborTarget: 20.70 },
  { storeId: '20075', netSales: 25607, pySales: 21829, breadCount: 152, pyGrowth: 17.30, cogsActual: 23.76, cogsVariance: -1.97, labor: 18.60, laborTarget: 21.00 },
  { storeId: '20255', netSales: 25721, pySales: 25493, breadCount: 152, pyGrowth: 0.90, cogsActual: 24.42, cogsVariance: -1.88, labor: 23.18, laborTarget: 21.00 },
  { storeId: '20273', netSales: 25782, pySales: 30290, breadCount: 152, pyGrowth: -14.88, cogsActual: 23.85, cogsVariance: -1.07, labor: 19.53, laborTarget: 21.00 },
  { storeId: '20311', netSales: 26026, pySales: 34143, breadCount: 151, pyGrowth: -23.77, cogsActual: 22.34, cogsVariance: -1.35, labor: 20.90, laborTarget: 20.90 },
  { storeId: '20352', netSales: 24933, pySales: 22888, breadCount: 147, pyGrowth: 8.93, cogsActual: 23.14, cogsVariance: -1.62, labor: 21.00, laborTarget: 21.10 },
  { storeId: '20011', netSales: 24753, pySales: 22999, breadCount: 144, pyGrowth: 7.62, cogsActual: 24.47, cogsVariance: -1.78, labor: 20.33, laborTarget: 21.10 },
  { storeId: '20360', netSales: 19298, pySales: 15644, breadCount: 118, pyGrowth: 23.36, cogsActual: 22.21, cogsVariance: -1.58, labor: 20.94, laborTarget: 21.90 },
  { storeId: '20424', netSales: 19285, pySales: 0, breadCount: 114, pyGrowth: 0, cogsActual: 23.05, cogsVariance: -1.03, labor: 25.20, laborTarget: 21.90 },
  { storeId: '20335', netSales: 18155, pySales: 16301, breadCount: 108, pyGrowth: 11.38, cogsActual: 25.40, cogsVariance: -2.11, labor: 20.90, laborTarget: 22.00 },
  { storeId: '20388', netSales: 14412, pySales: 16354, breadCount: 85, pyGrowth: -11.88, cogsActual: 25.05, cogsVariance: -1.71, labor: 21.67, laborTarget: 22.40 },
];

const WEEK_8 = [
  { storeId: '20218', netSales: 38856, pySales: 39758, breadCount: 244, pyGrowth: -2.27, cogsActual: 22.87, cogsVariance: -1.12, labor: 18.12, laborTarget: 19.70 },
  { storeId: '20366', netSales: 41334, pySales: 47738, breadCount: 243, pyGrowth: -13.41, cogsActual: 23.13, cogsVariance: -1.35, labor: 18.26, laborTarget: 19.40 },
  { storeId: '20381', netSales: 36223, pySales: 41107, breadCount: 221, pyGrowth: -11.88, cogsActual: 23.66, cogsVariance: -1.35, labor: 18.71, laborTarget: 19.90 },
  { storeId: '20267', netSales: 35074, pySales: 39657, breadCount: 211, pyGrowth: -11.56, cogsActual: 23.07, cogsVariance: -1.96, labor: 19.03, laborTarget: 20.00 },
  { storeId: '20363', netSales: 35380, pySales: 37426, breadCount: 209, pyGrowth: -5.47, cogsActual: 24.18, cogsVariance: -1.50, labor: 19.57, laborTarget: 20.00 },
  { storeId: '20294', netSales: 33610, pySales: 48540, breadCount: 204, pyGrowth: -30.76, cogsActual: 23.91, cogsVariance: -1.79, labor: 20.01, laborTarget: 20.20 },
  { storeId: '20273', netSales: 33654, pySales: 33417, breadCount: 200, pyGrowth: 0.71, cogsActual: 23.21, cogsVariance: -1.02, labor: 18.05, laborTarget: 20.20 },
  { storeId: '20156', netSales: 33882, pySales: 46314, breadCount: 200, pyGrowth: -26.84, cogsActual: 21.34, cogsVariance: -0.85, labor: 19.00, laborTarget: 20.20 },
  { storeId: '20026', netSales: 31174, pySales: 36229, breadCount: 191, pyGrowth: -13.95, cogsActual: 22.54, cogsVariance: -5.75, labor: 19.38, laborTarget: 20.40 },
  { storeId: '20048', netSales: 31420, pySales: 35284, breadCount: 184, pyGrowth: -10.95, cogsActual: 23.12, cogsVariance: -1.43, labor: 19.94, laborTarget: 20.40 },
  { storeId: '20245', netSales: 29510, pySales: 36088, breadCount: 180, pyGrowth: -18.23, cogsActual: 23.84, cogsVariance: -1.29, labor: 20.20, laborTarget: 20.60 },
  { storeId: '20116', netSales: 28436, pySales: 28954, breadCount: 166, pyGrowth: -1.79, cogsActual: 24.27, cogsVariance: -1.97, labor: 21.22, laborTarget: 20.70 },
  { storeId: '20075', netSales: 24459, pySales: 26206, breadCount: 150, pyGrowth: -6.67, cogsActual: 23.50, cogsVariance: -1.53, labor: 21.65, laborTarget: 21.10 },
  { storeId: '20255', netSales: 25410, pySales: 29086, breadCount: 150, pyGrowth: -12.64, cogsActual: 22.96, cogsVariance: -1.90, labor: 22.97, laborTarget: 21.00 },
  { storeId: '20311', netSales: 23863, pySales: 38262, breadCount: 140, pyGrowth: -37.63, cogsActual: 24.25, cogsVariance: -2.12, labor: 25.18, laborTarget: 21.20 },
  { storeId: '20011', netSales: 22428, pySales: 26622, breadCount: 134, pyGrowth: -15.75, cogsActual: 23.96, cogsVariance: -2.23, labor: 21.98, laborTarget: 21.30 },
  { storeId: '20352', netSales: 22625, pySales: 27767, breadCount: 134, pyGrowth: -18.52, cogsActual: 23.30, cogsVariance: -1.56, labor: 22.16, laborTarget: 21.30 },
  { storeId: '20424', netSales: 19632, pySales: 0, breadCount: 113, pyGrowth: 0, cogsActual: 24.33, cogsVariance: -1.80, labor: 23.30, laborTarget: 21.90 },
  { storeId: '20335', netSales: 18904, pySales: 19464, breadCount: 112, pyGrowth: -2.87, cogsActual: 23.31, cogsVariance: -1.33, labor: 22.91, laborTarget: 22.00 },
  { storeId: '20360', netSales: 17924, pySales: 18853, breadCount: 106, pyGrowth: -4.93, cogsActual: 24.29, cogsVariance: -1.01, labor: 21.64, laborTarget: 22.10 },
  { storeId: '20388', netSales: 11210, pySales: 17161, breadCount: 66, pyGrowth: -34.68, cogsActual: 25.79, cogsVariance: -1.91, labor: 26.86, laborTarget: 22.70 },
];

const WEEK_9 = [
  { storeId: '20366', netSales: 48953, pySales: 47473, breadCount: 289, pyGrowth: 3.12, cogsActual: 23.14, cogsVariance: -0.61, labor: 18.04, laborTarget: 18.70 },
  { storeId: '20218', netSales: 45624, pySales: 38508, breadCount: 283, pyGrowth: 18.48, cogsActual: 24.15, cogsVariance: -1.61, labor: 17.15, laborTarget: 19.00 },
  { storeId: '20381', netSales: 44093, pySales: 39889, breadCount: 267, pyGrowth: 10.54, cogsActual: 24.17, cogsVariance: -1.54, labor: 17.99, laborTarget: 19.10 },
  { storeId: '20267', netSales: 41897, pySales: 39444, breadCount: 250, pyGrowth: 6.22, cogsActual: 24.53, cogsVariance: -1.28, labor: 17.81, laborTarget: 19.40 },
  { storeId: '20363', netSales: 40082, pySales: 36984, breadCount: 236, pyGrowth: 8.37, cogsActual: 24.90, cogsVariance: -2.27, labor: 18.98, laborTarget: 19.50 },
  { storeId: '20294', netSales: 39157, pySales: 49573, breadCount: 235, pyGrowth: -21.01, cogsActual: 23.08, cogsVariance: -1.28, labor: 17.85, laborTarget: 19.60 },
  { storeId: '20156', netSales: 39119, pySales: 44296, breadCount: 230, pyGrowth: -11.69, cogsActual: 25.23, cogsVariance: -0.80, labor: 17.66, laborTarget: 19.60 },
  { storeId: '20245', netSales: 36908, pySales: 30745, breadCount: 222, pyGrowth: 20.05, cogsActual: 23.11, cogsVariance: -1.62, labor: 18.25, laborTarget: 19.90 },
  { storeId: '20026', netSales: 35685, pySales: 31204, breadCount: 217, pyGrowth: 14.36, cogsActual: 11.85, cogsVariance: 5.19, labor: 18.34, laborTarget: 20.00 },
  { storeId: '20048', netSales: 35118, pySales: 32517, breadCount: 205, pyGrowth: 8.00, cogsActual: 22.68, cogsVariance: -1.11, labor: 18.30, laborTarget: 20.00 },
  { storeId: '20273', netSales: 33270, pySales: 24579, breadCount: 194, pyGrowth: 35.36, cogsActual: 23.05, cogsVariance: -1.11, labor: 18.53, laborTarget: 20.20 },
  { storeId: '20255', netSales: 32144, pySales: 28269, breadCount: 190, pyGrowth: 13.71, cogsActual: 24.13, cogsVariance: -1.40, labor: 18.74, laborTarget: 20.30 },
  { storeId: '20352', netSales: 31487, pySales: 27583, breadCount: 187, pyGrowth: 14.16, cogsActual: 21.80, cogsVariance: -1.61, labor: 17.84, laborTarget: 20.40 },
  { storeId: '20116', netSales: 30805, pySales: 29362, breadCount: 178, pyGrowth: 4.92, cogsActual: 22.53, cogsVariance: -1.79, labor: 19.96, laborTarget: 20.50 },
  { storeId: '20311', netSales: 29478, pySales: 40998, breadCount: 171, pyGrowth: -28.10, cogsActual: 23.17, cogsVariance: -1.87, labor: 20.05, laborTarget: 20.60 },
  { storeId: '20075', netSales: 28390, pySales: 26761, breadCount: 166, pyGrowth: 6.09, cogsActual: 23.58, cogsVariance: -1.10, labor: 19.12, laborTarget: 20.70 },
  { storeId: '20011', netSales: 27312, pySales: 26137, breadCount: 164, pyGrowth: 4.50, cogsActual: 24.69, cogsVariance: -1.99, labor: 19.11, laborTarget: 20.80 },
  { storeId: '20360', netSales: 22465, pySales: 18677, breadCount: 136, pyGrowth: 20.28, cogsActual: 24.68, cogsVariance: -1.56, labor: 19.38, laborTarget: 21.30 },
  { storeId: '20335', netSales: 23292, pySales: 18246, breadCount: 131, pyGrowth: 27.66, cogsActual: 24.34, cogsVariance: -2.24, labor: 19.23, laborTarget: 21.20 },
  { storeId: '20424', netSales: 21645, pySales: 0, breadCount: 124, pyGrowth: 0, cogsActual: 24.49, cogsVariance: -2.01, labor: 21.81, laborTarget: 21.40 },
  { storeId: '20388', netSales: 14375, pySales: 12958, breadCount: 82, pyGrowth: 10.93, cogsActual: 23.07, cogsVariance: -0.43, labor: 22.47, laborTarget: 22.40 },
];

const WEEK_10 = [
  { storeId: '20013', netSales: 54975, pySales: 0, breadCount: 326, pyGrowth: 0, cogsActual: 27.59, cogsVariance: -3.13, labor: 20.55, laborTarget: 18.40 },
  { storeId: '20218', netSales: 42809, pySales: 34750, breadCount: 266, pyGrowth: 23.19, cogsActual: 23.04, cogsVariance: -1.12, labor: 19.25, laborTarget: 19.30 },
  { storeId: '20366', netSales: 44840, pySales: 45651, breadCount: 257, pyGrowth: -1.78, cogsActual: 23.32, cogsVariance: -1.19, labor: 18.36, laborTarget: 19.10 },
  { storeId: '20381', netSales: 39757, pySales: 33027, breadCount: 236, pyGrowth: 20.38, cogsActual: 23.60, cogsVariance: -1.72, labor: 18.96, laborTarget: 19.60 },
  { storeId: '20363', netSales: 38119, pySales: 35078, breadCount: 225, pyGrowth: 8.67, cogsActual: 24.00, cogsVariance: -2.36, labor: 20.59, laborTarget: 19.70 },
  { storeId: '20294', netSales: 37097, pySales: 44326, breadCount: 221, pyGrowth: -16.31, cogsActual: 23.05, cogsVariance: -1.44, labor: 18.92, laborTarget: 19.80 },
  { storeId: '20267', netSales: 36992, pySales: 38441, breadCount: 215, pyGrowth: -3.77, cogsActual: 24.06, cogsVariance: -1.86, labor: 18.90, laborTarget: 19.90 },
  { storeId: '20156', netSales: 36262, pySales: 45232, breadCount: 212, pyGrowth: -19.83, cogsActual: 22.41, cogsVariance: -0.20, labor: 18.31, laborTarget: 19.90 },
  { storeId: '20048', netSales: 34541, pySales: 33598, breadCount: 202, pyGrowth: 2.81, cogsActual: 23.88, cogsVariance: -1.73, labor: 19.14, laborTarget: 20.10 },
  { storeId: '20026', netSales: 33168, pySales: 30780, breadCount: 196, pyGrowth: 7.76, cogsActual: 24.94, cogsVariance: -2.74, labor: 19.18, laborTarget: 20.20 },
  { storeId: '20245', netSales: 32700, pySales: 32129, breadCount: 192, pyGrowth: 1.78, cogsActual: 24.76, cogsVariance: -1.25, labor: 19.39, laborTarget: 20.30 },
  { storeId: '20075', netSales: 30876, pySales: 24308, breadCount: 179, pyGrowth: 27.02, cogsActual: 23.82, cogsVariance: -1.56, labor: 18.60, laborTarget: 20.50 },
  { storeId: '20116', netSales: 29427, pySales: 27155, breadCount: 173, pyGrowth: 8.37, cogsActual: 25.12, cogsVariance: -2.01, labor: 20.25, laborTarget: 20.60 },
  { storeId: '20311', netSales: 28783, pySales: 37143, breadCount: 170, pyGrowth: -22.51, cogsActual: 24.03, cogsVariance: -1.69, labor: 20.48, laborTarget: 20.70 },
  { storeId: '20255', netSales: 29179, pySales: 28542, breadCount: 168, pyGrowth: 2.23, cogsActual: 23.06, cogsVariance: -1.25, labor: 19.65, laborTarget: 20.60 },
  { storeId: '20273', netSales: 25454, pySales: 21739, breadCount: 147, pyGrowth: 17.09, cogsActual: 23.47, cogsVariance: -1.16, labor: 20.41, laborTarget: 21.00 },
  { storeId: '20011', netSales: 25532, pySales: 24048, breadCount: 147, pyGrowth: 6.17, cogsActual: 23.50, cogsVariance: -2.04, labor: 19.77, laborTarget: 21.00 },
  { storeId: '20352', netSales: 24975, pySales: 26574, breadCount: 142, pyGrowth: -6.02, cogsActual: 25.96, cogsVariance: -1.15, labor: 21.02, laborTarget: 21.10 },
  { storeId: '20360', netSales: 23274, pySales: 18613, breadCount: 139, pyGrowth: 25.04, cogsActual: 24.76, cogsVariance: -1.01, labor: 19.96, laborTarget: 21.20 },
  { storeId: '20335', netSales: 20986, pySales: 18536, breadCount: 125, pyGrowth: 13.22, cogsActual: 24.08, cogsVariance: -1.95, labor: 20.04, laborTarget: 21.80 },
  { storeId: '20424', netSales: 20057, pySales: 0, breadCount: 117, pyGrowth: 0, cogsActual: 24.03, cogsVariance: -1.32, labor: 22.64, laborTarget: 21.80 },
  { storeId: '20388', netSales: 12138, pySales: 11672, breadCount: 70, pyGrowth: 3.99, cogsActual: 22.50, cogsVariance: -0.24, labor: 24.42, laborTarget: 22.60 },
];

const WEEK_11 = [
  { storeId: '20013', netSales: 50436, pySales: 0, breadCount: 293, pyGrowth: 0, cogsActual: 15.41, cogsVariance: 6.32, labor: 22.97, laborTarget: 18.50 },
  { storeId: '20218', netSales: 45659, pySales: 34540, breadCount: 281, pyGrowth: 32.19, cogsActual: 24.43, cogsVariance: -1.59, labor: 18.40, laborTarget: 19.00 },
  { storeId: '20381', netSales: 45997, pySales: 31960, breadCount: 274, pyGrowth: 43.92, cogsActual: 22.93, cogsVariance: -0.70, labor: 16.77, laborTarget: 19.00 },
  { storeId: '20091', netSales: 47211, pySales: 37613, breadCount: 271, pyGrowth: 25.52, cogsActual: 23.69, cogsVariance: -1.37, labor: 17.77, laborTarget: 18.80 },
  { storeId: '20366', netSales: 44663, pySales: 45573, breadCount: 262, pyGrowth: -2.00, cogsActual: 23.15, cogsVariance: -0.58, labor: 17.46, laborTarget: 19.10 },
  { storeId: '20363', netSales: 41004, pySales: 30714, breadCount: 246, pyGrowth: 33.50, cogsActual: 25.03, cogsVariance: -2.48, labor: 18.36, laborTarget: 19.40 },
  { storeId: '20267', netSales: 40606, pySales: 36707, breadCount: 243, pyGrowth: 10.62, cogsActual: 23.39, cogsVariance: -1.38, labor: 17.17, laborTarget: 19.50 },
  { storeId: '20294', netSales: 38199, pySales: 44168, breadCount: 226, pyGrowth: -13.51, cogsActual: 23.89, cogsVariance: -1.56, labor: 18.70, laborTarget: 19.70 },
  { storeId: '20026', netSales: 36284, pySales: 31172, breadCount: 221, pyGrowth: 16.40, cogsActual: 23.01, cogsVariance: -1.04, labor: 18.21, laborTarget: 19.90 },
  { storeId: '20245', netSales: 36808, pySales: 30816, breadCount: 220, pyGrowth: 19.45, cogsActual: 23.96, cogsVariance: -1.23, labor: 18.28, laborTarget: 19.90 },
  { storeId: '20156', netSales: 37798, pySales: 40331, breadCount: 220, pyGrowth: -6.28, cogsActual: 23.51, cogsVariance: -1.03, labor: 17.22, laborTarget: 19.80 },
  { storeId: '20292', netSales: 36848, pySales: 28067, breadCount: 217, pyGrowth: 31.29, cogsActual: 19.98, cogsVariance: -2.75, labor: 18.78, laborTarget: 19.90 },
  { storeId: '20048', netSales: 34876, pySales: 33097, breadCount: 205, pyGrowth: 5.38, cogsActual: 24.05, cogsVariance: -1.67, labor: 20.07, laborTarget: 20.10 },
  { storeId: '20300', netSales: 31834, pySales: 26025, breadCount: 189, pyGrowth: 22.32, cogsActual: 24.75, cogsVariance: -1.69, labor: 20.20, laborTarget: 20.40 },
  { storeId: '20255', netSales: 32417, pySales: 26275, breadCount: 187, pyGrowth: 23.38, cogsActual: 23.64, cogsVariance: -1.34, labor: 18.54, laborTarget: 20.30 },
  { storeId: '20311', netSales: 30864, pySales: 36564, breadCount: 182, pyGrowth: -15.59, cogsActual: 22.64, cogsVariance: -1.91, labor: 19.37, laborTarget: 20.50 },
  { storeId: '20116', netSales: 31190, pySales: 25258, breadCount: 181, pyGrowth: 23.49, cogsActual: 23.24, cogsVariance: -1.21, labor: 19.53, laborTarget: 20.40 },
  { storeId: '20291', netSales: 30521, pySales: 22940, breadCount: 177, pyGrowth: 33.04, cogsActual: 24.13, cogsVariance: -1.46, labor: 20.75, laborTarget: 20.50 },
  { storeId: '20171', netSales: 29793, pySales: 35162, breadCount: 170, pyGrowth: -15.27, cogsActual: 30.24, cogsVariance: -0.94, labor: 21.67, laborTarget: 20.60 },
  { storeId: '20352', netSales: 28512, pySales: 24214, breadCount: 167, pyGrowth: 17.75, cogsActual: 23.08, cogsVariance: -0.92, labor: 19.52, laborTarget: 20.70 },
  { storeId: '20075', netSales: 28550, pySales: 23954, breadCount: 166, pyGrowth: 19.19, cogsActual: 23.71, cogsVariance: -1.35, labor: 18.88, laborTarget: 20.70 },
  { storeId: '20071', netSales: 27260, pySales: 23381, breadCount: 165, pyGrowth: 16.59, cogsActual: 36.26, cogsVariance: -13.55, labor: 22.11, laborTarget: 20.80 },
  { storeId: '20177', netSales: 27484, pySales: 23551, breadCount: 162, pyGrowth: 16.70, cogsActual: 20.96, cogsVariance: 1.21, labor: 23.60, laborTarget: 20.80 },
  { storeId: '20011', netSales: 27542, pySales: 22235, breadCount: 159, pyGrowth: 23.87, cogsActual: 24.38, cogsVariance: -1.38, labor: 19.64, laborTarget: 20.80 },
  { storeId: '20273', netSales: 27232, pySales: 23870, breadCount: 158, pyGrowth: 14.08, cogsActual: 22.29, cogsVariance: -3.56, labor: 18.98, laborTarget: 20.80 },
  { storeId: '20360', netSales: 21606, pySales: 18314, breadCount: 132, pyGrowth: 17.98, cogsActual: 22.78, cogsVariance: -1.10, labor: 19.28, laborTarget: 21.40 },
  { storeId: '20335', netSales: 21489, pySales: 17392, breadCount: 127, pyGrowth: 23.56, cogsActual: 24.10, cogsVariance: -1.48, labor: 20.17, laborTarget: 21.40 },
  { storeId: '20424', netSales: 21835, pySales: 0, breadCount: 126, pyGrowth: 0, cogsActual: 22.66, cogsVariance: -0.90, labor: 20.83, laborTarget: 21.40 },
  { storeId: '20388', netSales: 14099, pySales: 11120, breadCount: 80, pyGrowth: 26.79, cogsActual: 22.46, cogsVariance: 0.67, labor: 21.85, laborTarget: 22.40 },
];

const ALL_WEEKS = {
  1:  { dateRange: 'Dec 29 - Jan 4', data: WEEK_1 },
  2:  { dateRange: 'Jan 5 - Jan 11', data: WEEK_2 },
  // Week 3 (Jan 12 - Jan 18): awaiting PDF — PNG too low-res for data entry
  4:  { dateRange: 'Jan 19 - Jan 25', data: WEEK_4 },
  5:  { dateRange: 'Jan 26 - Feb 2', data: WEEK_5 },
  6:  { dateRange: 'Feb 3 - Feb 9', data: WEEK_6 },
  7:  { dateRange: 'Feb 9 - Feb 15', data: WEEK_7 },
  8:  { dateRange: 'Feb 16 - Feb 22', data: WEEK_8 },
  9:  { dateRange: 'Feb 23 - Mar 1', data: WEEK_9 },
  10: { dateRange: 'Mar 2 - Mar 8', data: WEEK_10 },
  11: { dateRange: 'Mar 9 - Mar 15', data: WEEK_11 },
};

function calculateTargets(row) {
  let targetsHit = 0;
  const details = {};
  details.labor = row.labor < row.laborTarget;
  if (details.labor) targetsHit++;
  details.cogsVariance = row.cogsVariance >= -2.5 && row.cogsVariance <= -1.0;
  if (details.cogsVariance) targetsHit++;
  details.cogsActual = row.cogsActual >= 22.0 && row.cogsActual <= 25.0;
  if (details.cogsActual) targetsHit++;
  details.pyGrowth = row.pyGrowth > 0 && row.pySales > 0;
  if (details.pyGrowth) targetsHit++;
  const doubleDigit = row.pyGrowth >= 10.0 && row.pySales > 0;
  let color = 'orange';
  if (targetsHit >= 4) color = 'royalblue';
  else if (doubleDigit) color = 'blue';
  else if (targetsHit >= 3) color = 'green';
  else if (targetsHit >= 2) color = 'yellow';
  else if (targetsHit === 0) color = 'none';
  return { targetsHit, details, color, isGrandSlam: targetsHit >= 4, isTrifecta: targetsHit >= 3, doubleDigit };
}

export function getLeaderboards() {
  const storeStats = {};
  for (const [, week] of Object.entries(ALL_WEEKS)) {
    for (const row of week.data) {
      if (!storeStats[row.storeId]) {
        storeStats[row.storeId] = { grandSlams: 0, trifectas: 0, growthWeeks: 0, growthSum: 0, weeksPlayed: 0 };
      }
      const stats = storeStats[row.storeId];
      const result = calculateTargets(row);
      if (result.isGrandSlam) stats.grandSlams++;
      if (result.isTrifecta) stats.trifectas++;
      if (row.pySales > 0) { stats.growthWeeks++; stats.growthSum += row.pyGrowth; }
      stats.weeksPlayed++;
    }
  }
  const entries = Object.entries(storeStats).map(([storeId, stats]) => ({
    storeId, grandSlams: stats.grandSlams, trifectas: stats.trifectas,
    avgGrowth: stats.growthWeeks > 0 ? stats.growthSum / stats.growthWeeks : 0,
    weeksPlayed: stats.weeksPlayed,
  }));
  return {
    grandSlams: [...entries].sort((a, b) => b.grandSlams - a.grandSlams),
    trifectas: [...entries].sort((a, b) => b.trifectas - a.trifectas),
    avgGrowth: [...entries].filter(e => e.avgGrowth !== 0).sort((a, b) => b.avgGrowth - a.avgGrowth),
  };
}

export function getWeekScoreboard(weekNum) {
  const week = ALL_WEEKS[weekNum];
  if (!week) return null;
  return {
    weekNum, dateRange: week.dateRange,
    rows: week.data.map(row => ({ ...row, ...calculateTargets(row) })).sort((a, b) => b.netSales - a.netSales),
  };
}

export function getAvailableWeeks() {
  return Object.entries(ALL_WEEKS).map(([num, w]) => ({
    weekNum: parseInt(num, 10), dateRange: w.dateRange,
  })).sort((a, b) => b.weekNum - a.weekNum);
}

export { ALL_WEEKS, calculateTargets };
