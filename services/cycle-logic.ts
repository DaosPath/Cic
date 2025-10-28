import type { Cycle, CyclePhase, Prediction } from '../types.ts';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';
import startOfDay from 'date-fns/startOfDay';
import parseISO from 'date-fns/parseISO';

export const getTodayInTimezone = (timeZone = 'America/Lima'): Date => {
    const now = new Date();
    const zonedDate = new Date(now.toLocaleString('en-US', { timeZone }));
    return startOfDay(zonedDate);
};

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
    return { phase: 'follicular', dayOfCycle: 1 }; // Invalid date
  }
  const dayOfCycle = differenceInDays(currentDate, cycleStartDate) + 1;

  if (dayOfCycle <= 0) {
      return { phase: 'luteal', dayOfCycle: -1 };
  }

  const estimatedOvulationDay = avgCycleLength - avgLutealPhaseLength;
  const estimatedPeriodEndDay = 5; // Assuming an average of 5 days

  if (dayOfCycle <= estimatedPeriodEndDay) {
    return { phase: 'menstruation', dayOfCycle };
  }
  if (dayOfCycle < estimatedOvulationDay - 2) {
    return { phase: 'follicular', dayOfCycle };
  }
  if (dayOfCycle >= estimatedOvulationDay - 2 && dayOfCycle <= estimatedOvulationDay + 1) {
    return { phase: 'ovulation', dayOfCycle };
  }
  if (dayOfCycle > estimatedOvulationDay + 1 && dayOfCycle <= avgCycleLength) {
    return { phase: 'luteal', dayOfCycle };
  }

  // If past expected cycle end, assume follicular of next cycle
  return { phase: 'follicular', dayOfCycle: dayOfCycle - avgCycleLength };
};


export const calculatePredictions = (
  cycles: Cycle[],
  avgCycleLength: number,
  avgLutealPhaseLength: number
): Prediction | null => {
  if (cycles.length === 0 || !cycles[0].startDate) return null;

  const lastCycle = cycles[0];
  const lastStartDate = startOfDay(parseISO(lastCycle.startDate));
  if (isNaN(lastStartDate.getTime())) {
    return null; // Invalid date
  }

  const nextPeriodStartDate = addDays(lastStartDate, avgCycleLength);
  const nextPeriodEndDate = addDays(nextPeriodStartDate, 5); // Average 5 days

  const ovulationDate = addDays(nextPeriodStartDate, -avgLutealPhaseLength);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  return {
    nextPeriod: [nextPeriodStartDate, nextPeriodEndDate],
    fertileWindow: [fertileWindowStart, fertileWindowEnd],
    ovulationDate,
  };
};

export const calculateAverages = (cycles: Cycle[]): { avgCycleLength: number, avgLutealPhaseLength: number } => {
    // Prediction algorithm: weighted moving average of the last 6 cycles.
    // Weights: [0.5, 0.75, 1, 1, 1.25, 1.5] for most recent to oldest
    const relevantCycles = cycles.filter(c => c.length).slice(0, 6);
    if (relevantCycles.length === 0) {
        return { avgCycleLength: 28, avgLutealPhaseLength: 14 };
    }

    const weights = [1.5, 1.25, 1, 1, 0.75, 0.5];
    let totalWeightedLength = 0;
    let totalWeight = 0;
    
    relevantCycles.forEach((cycle, index) => {
        if (cycle.length && cycle.length > 15 && cycle.length < 60) { // Filter outliers
            const weight = weights[index] || 1;
            totalWeightedLength += cycle.length * weight;
            totalWeight += weight;
        }
    });

    if (totalWeight === 0) return { avgCycleLength: 28, avgLutealPhaseLength: 14 };

    const avgCycleLength = Math.round(totalWeightedLength / totalWeight);
    return { avgCycleLength, avgLutealPhaseLength: 14 }; // Luteal is more stable
};