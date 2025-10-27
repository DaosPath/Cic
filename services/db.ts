import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DailyLog, Cycle, AppSettings } from '../types.ts';

const DB_NAME = 'AuraCicloDB';
const DB_VERSION = 1;

interface AuraCicloDB extends DBSchema {
  logs: {
    key: string;
    value: DailyLog;
  };
  cycles: {
    key: number;
    value: Cycle;
    indexes: { byStartDate: string };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

let dbPromise: Promise<IDBPDatabase<AuraCicloDB>> | null = null;

const getDb = (): Promise<IDBPDatabase<AuraCicloDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<AuraCicloDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cycles')) {
          const cycleStore = db.createObjectStore('cycles', { keyPath: 'id', autoIncrement: true });
          cycleStore.createIndex('byStartDate', 'startDate');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
};

// --- Logs ---
export const getLog = async (date: string): Promise<DailyLog | undefined> => {
  const db = await getDb();
  return db.get('logs', date);
};

export const getAllLogs = async (): Promise<DailyLog[]> => {
  const db = await getDb();
  return db.getAll('logs');
};

export const upsertLog = async (log: DailyLog): Promise<void> => {
  const db = await getDb();
  await db.put('logs', log);
};

// --- Cycles ---
export const getAllCycles = async (): Promise<Cycle[]> => {
    const db = await getDb();
    return (await db.getAllFromIndex('cycles', 'byStartDate')).reverse();
};

export const upsertCycle = async (cycle: Cycle): Promise<void> => {
    const db = await getDb();
    await db.put('cycles', cycle);
};

export const getLatestCycle = async (): Promise<Cycle | undefined> => {
    const cycles = await getAllCycles();
    return cycles[0];
};


// --- Settings ---
export const getSettings = async (): Promise<AppSettings> => {
  const db = await getDb();
  const settings = await db.get('settings', 'appSettings');
  return settings || {
    cycleLength: 28,
    lutealPhaseLength: 14,
    startOfWeek: 'monday',
    discreteMode: false,
    isDevMode: false,
    customSymptoms: [
        { id: 'headache', name: 'Dolor de cabeza', category: 'physical' },
        { id: 'cramps', name: 'Cólicos', category: 'physical' },
        { id: 'bloating', name: 'Hinchazón', category: 'physical' },
        { id: 'irritability', name: 'Irritabilidad', category: 'mood' },
        { id: 'fatigue', name: 'Fatiga', category: 'energy' },
    ],
    favoriteSymptomIds: [],
  };
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  const db = await getDb();
  await db.put('settings', settings, 'appSettings');
};

// --- Data Management ---
export const clearAndBulkInsert = async (data: { logs: DailyLog[], cycles: Cycle[] }) => {
  const db = await getDb();
  
  const txLogs = db.transaction('logs', 'readwrite');
  await txLogs.store.clear();
  for (const log of data.logs) {
    txLogs.store.put(log);
  }
  await txLogs.done;

  const txCycles = db.transaction('cycles', 'readwrite');
  await txCycles.store.clear();
  for (const cycle of data.cycles) {
    txCycles.store.put(cycle);
  }
  await txCycles.done;
};

export const clearLogsAndCycles = async () => {
    const db = await getDb();
    await db.clear('logs');
    await db.clear('cycles');
};


export const getBackupData = async () => {
  const db = await getDb();
  const logs = await db.getAll('logs');
  const cycles = await db.getAll('cycles');
  const settings = await db.get('settings', 'appSettings');
  return { logs, cycles, settings };
};

export const restoreBackupData = async (data: { logs: DailyLog[], cycles: Cycle[], settings: AppSettings }) => {
  await clearAndBulkInsert({ logs: data.logs, cycles: data.cycles });
  await saveSettings(data.settings);
};