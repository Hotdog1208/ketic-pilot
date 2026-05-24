export const ENERGY_CONSTANTS = {
  KWH_PER_VACANT_HOUR: 0.65,
  SUITE_MULTIPLIER: 1.4,
  COST_PER_KWH: 0.14,
  KETIC_SAVE_RATIO: 0.72,
  MIN_VACANCY_HOURS: 1,
} as const;

export function computeKwhWasted(vacancyHours: number, isSuite: boolean): number {
  const base = vacancyHours * ENERGY_CONSTANTS.KWH_PER_VACANT_HOUR;
  return round2(isSuite ? base * ENERGY_CONSTANTS.SUITE_MULTIPLIER : base);
}

export function computeCostWasted(kwhWasted: number): number {
  return round2(kwhWasted * ENERGY_CONSTANTS.COST_PER_KWH);
}

export function computeKeticSavings(costWasted: number): number {
  return round2(costWasted * ENERGY_CONSTANTS.KETIC_SAVE_RATIO);
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function projectAnnual(thirtyDayTotal: number): number {
  return Math.round((thirtyDayTotal * 365) / 30);
}

export function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}
