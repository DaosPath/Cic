/**
 * Tests that drive shipped cycle-logic pure functions.
 * Run: node --experimental-strip-types --test tests/cycle-logic.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getCyclePhase,
  calculatePredictions,
  calculateAverages,
  shouldStartNewCycle,
} from '../services/cycle-logic.ts';
import type { Cycle, DailyLog } from '../types.ts';

/** Local calendar date (avoids UTC off-by-one vs parseISO startOfDay). */
const localDate = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe('getCyclePhase', () => {
  it('returns follicular day 1 without a cycle', () => {
    const result = getCyclePhase(localDate(2024, 6, 15), undefined, 28, 14);
    assert.equal(result.phase, 'follicular');
    assert.equal(result.dayOfCycle, 1);
  });

  it('labels early days as menstruation for a typical cycle', () => {
    const cycle: Cycle = { startDate: '2024-06-01' };
    const day3 = getCyclePhase(localDate(2024, 6, 3), cycle, 28, 14);
    assert.equal(day3.phase, 'menstruation');
    assert.equal(day3.dayOfCycle, 3);
  });

  it('labels mid-cycle ovulation window for 28-day / 14-luteal', () => {
    const cycle: Cycle = { startDate: '2024-06-01' };
    // ovulation day = 28 - 14 = 14; window 11–15
    const day14 = getCyclePhase(localDate(2024, 6, 14), cycle, 28, 14);
    assert.equal(day14.phase, 'ovulation');
    assert.equal(day14.dayOfCycle, 14);
  });

  it('labels late cycle as luteal', () => {
    const cycle: Cycle = { startDate: '2024-06-01' };
    const day20 = getCyclePhase(localDate(2024, 6, 20), cycle, 28, 14);
    assert.equal(day20.phase, 'luteal');
    assert.equal(day20.dayOfCycle, 20);
  });
});

describe('calculateAverages', () => {
  it('returns defaults when no valid cycles', () => {
    const avg = calculateAverages([]);
    assert.equal(avg.avgCycleLength, 28);
    assert.equal(avg.avgLutealPhaseLength, 14);
  });

  it('computes weighted average from valid lengths', () => {
    const cycles: Cycle[] = [
      { startDate: '2024-05-01', length: 28 },
      { startDate: '2024-04-03', length: 30 },
      { startDate: '2024-03-04', length: 27 },
    ];
    const avg = calculateAverages(cycles);
    assert.ok(avg.avgCycleLength >= 21 && avg.avgCycleLength <= 35);
    assert.ok(avg.avgLutealPhaseLength >= 12 && avg.avgLutealPhaseLength <= 16);
  });
});

describe('calculatePredictions', () => {
  it('returns null without cycles', () => {
    assert.equal(calculatePredictions([], 28, 14), null);
  });

  it('returns next period and fertile window from last start', () => {
    const cycles: Cycle[] = [{ startDate: '2024-06-01', length: 28 }];
    const pred = calculatePredictions(cycles, 28, 14);
    assert.ok(pred);
    assert.ok(pred!.nextPeriod[0] instanceof Date);
    assert.ok(pred!.fertileWindow[0] instanceof Date);
    assert.ok(pred!.ovulationDate instanceof Date);
    // next period ~ June 1 + 28 days
    assert.equal(pred!.nextPeriod[0].toISOString().slice(0, 10), '2024-06-29');
  });
});

describe('shouldStartNewCycle', () => {
  it('starts when period logged near expected length', () => {
    const last = new Date('2024-06-01');
    const current = new Date('2024-06-28');
    assert.equal(shouldStartNewCycle(last, current, 28, 2), true);
  });

  it('does not start early without intensity', () => {
    const last = new Date('2024-06-01');
    const current = new Date('2024-06-10');
    assert.equal(shouldStartNewCycle(last, current, 28, 0), false);
  });
});

// Prediction labeling contract used by UI (estimate vs registered)
describe('prediction labeling assumptions', () => {
  it('predictions are estimates (not guarantees) — window has length', () => {
    const cycles: Cycle[] = [{ startDate: '2024-01-01', length: 28 }];
    const pred = calculatePredictions(cycles, 28, 14)!;
    const fertileDays =
      (pred.fertileWindow[1].getTime() - pred.fertileWindow[0].getTime()) / (86400000);
    assert.ok(fertileDays >= 4, 'fertile window should span multiple days (estimate)');
  });
});
