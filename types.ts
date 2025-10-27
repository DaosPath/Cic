export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export interface Symptom {
  id: string;
  name: string;
  category: 'mood' | 'physical' | 'energy' | 'other';
}

export interface DailyLog {
  id: string; // YYYY-MM-DD
  date: string;
  periodIntensity?: 0 | 1 | 2 | 3; // 0: No period, 1: Light, 2: Medium, 3: Heavy
  symptoms: string[]; // array of symptom IDs
  mood?: 1 | 2 | 3 | 4 | 5; // 1: Awful, 5: Great
  medications: { name: string; dose: string }[];
  notes?: string;
  energyLevel?: number; // 1-5
}

export interface Cycle {
  id?: number; // DB autoincrement key
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  length?: number;
}

export interface AppSettings {
  userName?: string;
  cycleLength: number;
  lutealPhaseLength: number;
  startOfWeek: 'sunday' | 'monday';
  discreteMode: boolean;
  pin?: string;
  isDevMode?: boolean;
  customSymptoms: Symptom[];
  favoriteSymptomIds?: string[];
}

export interface Prediction {
  nextPeriod: [Date, Date];
  fertileWindow: [Date, Date];
  ovulationDate: Date;
}