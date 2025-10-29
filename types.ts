export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export interface Symptom {
  id: string;
  name: string;
  category: 'mood' | 'physical' | 'energy' | 'other';
}

export interface DailyLog {
  id: string; // YYYY-MM-DD
  date: string;
  
  // Menstruation - Extended
  periodIntensity?: 0 | 1 | 2 | 3; // 0: None, 1: Spotting, 2: Light, 3: Medium, 4: Heavy
  periodColor?: 'bright-red' | 'dark-red' | 'brown' | 'pink';
  periodConsistency?: 'watery' | 'thick' | 'clotty';
  hasClots?: boolean;
  periodProducts?: ('pad' | 'tampon' | 'cup' | 'disc')[];
  productSize?: 'small' | 'medium' | 'large';
  productCount?: number; // Daily count
  hasLeaks?: boolean;
  periodStartedToday?: boolean;
  periodEndedToday?: boolean;
  
  // Fertility
  ovulationTest?: 'positive' | 'negative' | 'unclear';
  cervixPosition?: 'high' | 'medium' | 'low';
  cervixFirmness?: 'firm' | 'soft';
  cervixOpening?: 'open' | 'closed';
  cervicalFluid?: 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg-white';
  sexualActivity?: boolean;
  sexualActivityTiming?: 'before-ovulation' | 'during-ovulation' | 'after-ovulation';
  protection?: boolean;
  
  // Pain - Extended
  painLevel?: number; // 0-10 scale
  painLocations?: string[]; // cramps, headache, back, breasts, etc.
  painDuration?: string;
  
  // Symptoms - Detailed
  symptoms: string[]; // array of symptom IDs
  // Gastro
  nausea?: boolean;
  vomiting?: boolean;
  diarrhea?: boolean;
  constipation?: boolean;
  gas?: boolean;
  appetite?: 'decreased' | 'normal' | 'increased';
  // Neuro
  headache?: boolean;
  migraine?: boolean;
  migraineWithAura?: boolean;
  dizziness?: boolean;
  brainFog?: boolean;
  // Musculoskeletal
  backPain?: boolean;
  pelvicPain?: boolean;
  muscleTension?: boolean;
  // Breast/Skin
  breastTenderness?: boolean;
  breastSwelling?: boolean;
  acne?: boolean;
  // Urinary/Vaginal
  urinaryBurning?: boolean;
  urinaryFrequency?: boolean;
  vaginalItching?: boolean;
  vaginalOdor?: boolean;
  vaginalDischarge?: string;
  // Other
  bloating?: boolean;
  waterRetention?: boolean;
  
  // Mental State & Libido
  mood?: 1 | 2 | 3 | 4 | 5; // 1: Awful, 5: Great
  anxiety?: boolean;
  sadness?: boolean;
  irritability?: boolean;
  calmness?: boolean;
  motivation?: 'low' | 'medium' | 'high';
  libido?: 'low' | 'normal' | 'high';
  stressLevel?: 'low' | 'medium' | 'high';
  stressScore?: number; // 0-10
  stressTriggers?: string[]; // Changed to string[] to allow custom triggers
  
  // Sleep & Habits
  sleepHours?: number;
  sleepQuality?: 1 | 2 | 3 | 4 | 5; // 1: Poor, 5: Excellent
  bedTime?: string; // HH:MM
  wakeTime?: string; // HH:MM
  napMinutes?: number;
  waterIntake?: number; // Liters
  caffeineIntake?: number; // Cups
  alcoholIntake?: number; // Units
  cravings?: string[]; // Changed to string[] to allow custom cravings
  
  // Physical Activity & Metrics
  physicalActivity?: 'none' | 'light' | 'moderate' | 'intense';
  activityType?: string[]; // Changed to string[] to allow custom activities
  activityDuration?: number; // Minutes
  activityIntensity?: number; // RPE 1-10
  steps?: number;
  restingHeartRate?: number;
  caloriesBurned?: number;
  
  // Medication & Care
  medications: { name: string; dose: string; time?: string }[];
  supplements?: string[]; // Changed to string[] to allow custom supplements
  contraception?: string;
  contraceptionDay?: number; // Day of blister pack
  hasIUD?: boolean;
  homeRemedies?: string[]; // Changed to string[] to allow custom remedies
  
  // Tests & Health
  pregnancyTest?: 'positive' | 'negative' | 'not-taken';
  hasColdSymptoms?: boolean;
  hasCovidSymptoms?: boolean;
  bloodPressure?: string; // e.g., "120/80"
  basalTemp?: number; // Basal body temperature
  weight?: number; // Weight in kg
  
  // Context (optional)
  timezone?: string;
  weather?: 'cold' | 'mild' | 'hot';
  location?: string;
  
  // Energy level
  energyLevel?: 'low' | 'medium' | 'high';
  
  // Notes
  notes?: string;
  
  // AI metadata
  aiGenerated?: boolean;
  aiConfidence?: number;
  aiAmbiguousFields?: string[];
}

export interface Cycle {
  id?: number; // DB autoincrement key
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  length?: number;
}

export type Language = 'es' | 'en' | 'tr' | 'auto';

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
  language: Language;
}

export interface Prediction {
  nextPeriod: [Date, Date];
  fertileWindow: [Date, Date];
  ovulationDate: Date;
}