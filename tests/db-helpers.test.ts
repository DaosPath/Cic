/**
 * Persistence path tests driving shipped getLog / upsertLog.
 * Uses fake-indexeddb so IndexedDB APIs exist in Node.
 * Run: node --experimental-strip-types --test tests/db-helpers.test.ts
 */
import 'fake-indexeddb/auto';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  getLog,
  upsertLog,
  getAllLogs,
  __resetDbForTests,
  saveSettings,
  getSettings,
} from '../services/db.ts';
import type { DailyLog } from '../types.ts';

describe('shipped IndexedDB log helpers', () => {
  beforeEach(async () => {
    await __resetDbForTests();
  });

  afterEach(async () => {
    await __resetDbForTests();
  });

  it('upsertLog then getLog round-trips a representative DailyLog', async () => {
    const log: DailyLog = {
      id: '2024-07-14',
      date: '2024-07-14',
      symptoms: ['cramps', 'headache'],
      medications: [{ name: 'ibuprofeno', dose: '400mg' }],
      periodIntensity: 2,
      mood: 4,
      sleepHours: 7.5,
      notes: 'prueba de persistencia',
      energyLevel: 'medium',
    };

    await upsertLog(log);
    const loaded = await getLog('2024-07-14');

    assert.ok(loaded, 'getLog should return the saved log');
    assert.equal(loaded!.id, '2024-07-14');
    assert.equal(loaded!.mood, 4);
    assert.equal(loaded!.periodIntensity, 2);
    assert.equal(loaded!.sleepHours, 7.5);
    assert.equal(loaded!.notes, 'prueba de persistencia');
    assert.deepEqual(loaded!.symptoms, ['cramps', 'headache']);
    assert.equal(loaded!.medications[0]?.name, 'ibuprofeno');
  });

  it('upsertLog updates an existing day without creating duplicates', async () => {
    const day = '2024-08-01';
    await upsertLog({
      id: day,
      date: day,
      symptoms: ['fatigue'],
      medications: [],
      mood: 2,
    });
    await upsertLog({
      id: day,
      date: day,
      symptoms: ['fatigue', 'bloating'],
      medications: [],
      mood: 5,
      notes: 'actualizado',
    });

    const all = await getAllLogs();
    const sameDay = all.filter((l) => l.id === day);
    assert.equal(sameDay.length, 1);
    assert.equal(sameDay[0].mood, 5);
    assert.deepEqual(sameDay[0].symptoms, ['fatigue', 'bloating']);
    assert.equal(sameDay[0].notes, 'actualizado');
  });

  it('getLog returns undefined for a day never saved', async () => {
    const missing = await getLog('2099-01-01');
    assert.equal(missing, undefined);
  });

  it('saveSettings / getSettings round-trip themeMode', async () => {
    const settings = await getSettings();
    await saveSettings({
      ...settings,
      themeMode: 'dark',
      onboardingComplete: true,
      cycleLength: 30,
    });
    const again = await getSettings();
    assert.equal(again.themeMode, 'dark');
    assert.equal(again.cycleLength, 30);
    assert.equal(again.onboardingComplete, true);
  });
});
