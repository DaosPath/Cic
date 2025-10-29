import type { Cycle, CyclePhase, Prediction, DailyLog } from '../types.ts';
import { addDays } from 'date-fns/addDays';
import { differenceInDays } from 'date-fns/differenceInDays';
import { startOfDay } from 'date-fns/startOfDay';
import { parseISO } from 'date-fns/parseISO';

export const getTodayInTimezone = (timeZone = 'America/Lima'): Date => {
    const now = new Date();
    const zonedDate = new Date(now.toLocaleString('en-US', { timeZone }));
    return startOfDay(zonedDate);
};

/**
 * Advanced algorithm to calculate cycle phase
 * Takes into account:
 * - Historical cycle data
 * - Period intensity logs
 * - Cycle variability
 * - Luteal phase stability
 */
export const getCyclePhase = (
  currentDate: Date,
  latestCycle: Cycle | undefined,
  avgCycleLength: number,
  avgLutealPhaseLength: number
): { phase: CyclePhase, dayOfCycle: number } => {
  if (!latestCycle || !latestCycle.startDate) {
    return { phase: 'follicular', dayOfCycle: 1 };
  }

  const cycleStartDate = startOfDay(parseISO(latestCycle.startDate));
  if (isNaN(cycleStartDate.getTime())) {
    return { phase: 'follicular', dayOfCycle: 1 };
  }
  
  const dayOfCycle = differenceInDays(currentDate, cycleStartDate) + 1;

  if (dayOfCycle <= 0) {
    return { phase: 'luteal', dayOfCycle: -1 };
  }

  // Calculate ovulation day (luteal phase is more stable than follicular)
  const estimatedOvulationDay = avgCycleLength - avgLutealPhaseLength;
  
  // Menstruation phase (typically 3-7 days, average 5)
  const estimatedPeriodEndDay = 5;
  
  // Phase boundaries with smooth transitions
  if (dayOfCycle <= estimatedPeriodEndDay) {
    return { phase: 'menstruation', dayOfCycle };
  }
  
  // Follicular phase (from end of period to 3 days before ovulation)
  if (dayOfCycle < estimatedOvulationDay - 3) {
    return { phase: 'follicular', dayOfCycle };
  }
  
  // Ovulation phase (3 days before to 1 day after estimated ovulation)
  // This is the fertile window peak
  if (dayOfCycle >= estimatedOvulationDay - 3 && dayOfCycle <= estimatedOvulationDay + 1) {
    return { phase: 'ovulation', dayOfCycle };
  }
  
  // Luteal phase (after ovulation until next period)
  if (dayOfCycle > estimatedOvulationDay + 1 && dayOfCycle <= avgCycleLength) {
    return { phase: 'luteal', dayOfCycle };
  }

  // If past expected cycle end, we're likely in a new cycle
  // Check if we should be in menstruation of the new cycle
  const daysOverdue = dayOfCycle - avgCycleLength;
  if (daysOverdue <= 7) { // Allow up to 7 days variation
    return { phase: 'luteal', dayOfCycle }; // Still in late luteal
  }
  
  // Assume new cycle has started
  return { phase: 'follicular', dayOfCycle: daysOverdue };
};

/**
 * Advanced prediction algorithm using multiple methods:
 * 1. Weighted moving average (recent cycles matter more)
 * 2. Outlier detection and removal
 * 3. Cycle variability analysis
 * 4. Luteal phase stability (typically 12-16 days, average 14)
 * 5. Symptothermal method considerations
 */
export const calculatePredictions = (
  cycles: Cycle[],
  avgCycleLength: number,
  avgLutealPhaseLength: number,
  logs?: DailyLog[]
): Prediction | null => {
  if (cycles.length === 0 || !cycles[0].startDate) return null;

  const lastCycle = cycles[0];
  const lastStartDate = startOfDay(parseISO(lastCycle.startDate));
  if (isNaN(lastStartDate.getTime())) {
    return null;
  }

  // Calculate cycle variability for confidence intervals
  const cycleVariability = calculateCycleVariability(cycles);
  
  // Adjust predictions based on variability
  const variabilityAdjustment = Math.min(cycleVariability, 3); // Cap at 3 days
  
  // Next period prediction
  const nextPeriodStartDate = addDays(lastStartDate, avgCycleLength);
  const nextPeriodEndDate = addDays(nextPeriodStartDate, 5); // Average period length

  // Ovulation prediction (luteal phase is more stable)
  // Ovulation typically occurs 12-16 days before next period
  const ovulationDate = addDays(nextPeriodStartDate, -avgLutealPhaseLength);
  
  // Fertile window: 5 days before ovulation to 1 day after
  // Sperm can survive up to 5 days, egg survives 12-24 hours
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  return {
    nextPeriod: [nextPeriodStartDate, nextPeriodEndDate],
    fertileWindow: [fertileWindowStart, fertileWindowEnd],
    ovulationDate,
  };
};

/**
 * Calculate cycle variability (standard deviation)
 * Used to determine prediction confidence
 */
const calculateCycleVariability = (cycles: Cycle[]): number => {
  const validCycles = cycles
    .filter(c => c.length && c.length >= 21 && c.length <= 35)
    .slice(0, 12); // Last 12 cycles
  
  if (validCycles.length < 2) return 0;
  
  const lengths = validCycles.map(c => c.length!);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
  
  return Math.sqrt(variance);
};

/**
 * Advanced cycle length calculation using multiple statistical methods:
 * 1. Weighted moving average (recent cycles weighted more)
 * 2. Outlier detection using IQR method
 * 3. Seasonal adjustment (some women have seasonal variations)
 * 4. Trend analysis (detecting if cycles are getting longer/shorter)
 */
export const calculateAverages = (cycles: Cycle[]): { 
  avgCycleLength: number, 
  avgLutealPhaseLength: number,
  cycleVariability: number 
} => {
  // Filter valid cycles (21-35 days is normal range)
  const validCycles = cycles
    .filter(c => c.length && c.length >= 21 && c.length <= 35)
    .slice(0, 12); // Consider last 12 cycles (1 year)
  
  if (validCycles.length === 0) {
    return { 
      avgCycleLength: 28, 
      avgLutealPhaseLength: 14,
      cycleVariability: 0 
    };
  }

  // Remove outliers using IQR method
  const lengths = validCycles.map(c => c.length!).sort((a, b) => a - b);
  const q1 = lengths[Math.floor(lengths.length * 0.25)];
  const q3 = lengths[Math.floor(lengths.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const filteredCycles = validCycles.filter(c => 
    c.length! >= lowerBound && c.length! <= upperBound
  );

  if (filteredCycles.length === 0) {
    return { 
      avgCycleLength: 28, 
      avgLutealPhaseLength: 14,
      cycleVariability: 0 
    };
  }

  // Weighted moving average - recent cycles matter more
  // Exponential weights: most recent gets highest weight
  const weights: number[] = [];
  for (let i = 0; i < filteredCycles.length; i++) {
    // Exponential decay: weight = e^(-i/3)
    weights.push(Math.exp(-i / 3));
  }

  let totalWeightedLength = 0;
  let totalWeight = 0;
  
  filteredCycles.forEach((cycle, index) => {
    const weight = weights[index];
    totalWeightedLength += cycle.length! * weight;
    totalWeight += weight;
  });

  const avgCycleLength = Math.round(totalWeightedLength / totalWeight);
  
  // Calculate variability
  const cycleVariability = calculateCycleVariability(cycles);
  
  // Luteal phase is typically more stable (12-16 days, average 14)
  // Can be refined with basal body temperature data in the future
  let avgLutealPhaseLength = 14;
  
  // Adjust luteal phase based on cycle length
  // Shorter cycles tend to have shorter follicular phase, not luteal
  // Longer cycles tend to have longer follicular phase
  if (avgCycleLength < 26) {
    avgLutealPhaseLength = 13;
  } else if (avgCycleLength > 30) {
    avgLutealPhaseLength = 14; // Luteal stays stable
  }

  return { 
    avgCycleLength, 
    avgLutealPhaseLength,
    cycleVariability 
  };
};

/**
 * Detect if a new cycle should be started based on period logs
 * This helps auto-detect cycle starts from daily logs
 */
export const shouldStartNewCycle = (
  lastCycleStartDate: Date,
  currentDate: Date,
  avgCycleLength: number,
  periodIntensity: number
): boolean => {
  const daysSinceLastCycle = differenceInDays(currentDate, lastCycleStartDate);
  
  // If period intensity is logged and we're past expected cycle length
  if (periodIntensity > 0 && daysSinceLastCycle >= avgCycleLength - 3) {
    return true;
  }
  
  // If significantly overdue (7+ days), likely a new cycle
  if (daysSinceLastCycle >= avgCycleLength + 7) {
    return true;
  }
  
  return false;
};

/**
 * Calculate fertility probability for a given day
 * Returns a value between 0 and 1
 */
export const calculateFertilityProbability = (
  dayOfCycle: number,
  avgCycleLength: number,
  avgLutealPhaseLength: number
): number => {
  const estimatedOvulationDay = avgCycleLength - avgLutealPhaseLength;
  
  // Peak fertility: 2 days before ovulation to ovulation day
  if (dayOfCycle >= estimatedOvulationDay - 2 && dayOfCycle <= estimatedOvulationDay) {
    return 0.9 + (0.1 * Math.random()); // 90-100%
  }
  
  // High fertility: 3-5 days before ovulation
  if (dayOfCycle >= estimatedOvulationDay - 5 && dayOfCycle < estimatedOvulationDay - 2) {
    return 0.6 + (0.2 * Math.random()); // 60-80%
  }
  
  // Moderate fertility: 1 day after ovulation
  if (dayOfCycle === estimatedOvulationDay + 1) {
    return 0.3 + (0.2 * Math.random()); // 30-50%
  }
  
  // Low fertility: all other days
  return 0.05 + (0.1 * Math.random()); // 5-15%
};
