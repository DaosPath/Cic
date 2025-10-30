import type { DailyLog, Cycle } from '../types.ts';
import { formatISO } from 'date-fns/formatISO';
import { addDays } from 'date-fns/addDays';
import { subDays } from 'date-fns/subDays';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
const randomChoice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBool = (probability: number = 0.5) => Math.random() < probability;

// Realistic symptom pools by phase
const symptomsByPhase = {
    menstruation: ['cramps', 'fatigue', 'headache', 'backache', 'nausea', 'bloating', 'mood-swings'],
    follicular: ['acne', 'increased-energy', 'clear-skin'],
    ovulation: ['bloating', 'breast-tenderness', 'increased-libido', 'cervical-mucus'],
    luteal: ['irritability', 'bloating', 'fatigue', 'breast-tenderness', 'food-cravings', 'mood-swings', 'acne', 'anxiety']
};

const activityTypes: Array<'light' | 'moderate' | 'intense'> = ['light', 'moderate', 'intense'];
const energyLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

export const generateDevData = (): { logs: DailyLog[], cycles: Cycle[] } => {
    const cycles: Cycle[] = [];
    const logs: DailyLog[] = [];
    let currentDate = subDays(new Date(), 365);

    for (let i = 0; i < 13; i++) {
        const cycleLength = randomInt(27, 31);
        const startDate = currentDate;

        const newCycle: Cycle = {
            startDate: formatISO(startDate, { representation: 'date' }),
            endDate: formatISO(addDays(startDate, cycleLength - 1), { representation: 'date' }),
            length: cycleLength,
        };

        for (let day = 0; day < cycleLength; day++) {
            const logDate = addDays(startDate, day);
            const logDateStr = formatISO(logDate, { representation: 'date' });

            // Determine phase
            let phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
            if (day < 5) phase = 'menstruation';
            else if (day < 13) phase = 'follicular';
            else if (day < 17) phase = 'ovulation';
            else phase = 'luteal';

            const newLog: DailyLog = {
                id: logDateStr,
                date: logDateStr,
                symptoms: [],
                medications: [],
                periodProducts: [],
                activityType: [],
                supplements: [],
                homeRemedies: [],
                cravings: [],
                stressTriggers: [],
            };

            // Period intensity
            if (day < 5) {
                newLog.periodIntensity = day === 0 ? 1 : day === 1 ? 3 : day === 2 ? 2 : 1;
                newLog.periodColor = randomChoice(['bright-red', 'dark-red', 'brown'] as const);
                if (day < 3 && randomBool(0.4)) {
                    newLog.hasClots = true;
                }
                if (newLog.periodIntensity > 0) {
                    newLog.periodProducts = [randomChoice(['pad', 'tampon', 'cup', 'disc'] as const)];
                }
            } else {
                newLog.periodIntensity = 0;
            }

            // Symptoms based on phase
            const symptomsToAdd: string[] = [];
            const phaseSymptoms = symptomsByPhase[phase];
            phaseSymptoms.forEach(symptom => {
                const probability = phase === 'menstruation' ? 0.7 : phase === 'luteal' ? 0.5 : 0.3;
                if (randomBool(probability)) {
                    symptomsToAdd.push(symptom);
                }
            });
            newLog.symptoms = [...new Set(symptomsToAdd)];

            // Mood (1-5, varies by phase)
            if (randomBool(0.8)) {
                if (phase === 'menstruation') {
                    newLog.mood = randomInt(2, 4) as 1 | 2 | 3 | 4 | 5;
                } else if (phase === 'follicular') {
                    newLog.mood = randomInt(3, 5) as 1 | 2 | 3 | 4 | 5;
                } else if (phase === 'ovulation') {
                    newLog.mood = randomInt(4, 5) as 1 | 2 | 3 | 4 | 5;
                } else { // luteal
                    newLog.mood = randomInt(2, 4) as 1 | 2 | 3 | 4 | 5;
                }
            }

            // Energy level
            if (randomBool(0.8)) {
                if (phase === 'menstruation') {
                    newLog.energyLevel = randomChoice(['low', 'medium']);
                } else if (phase === 'follicular' || phase === 'ovulation') {
                    newLog.energyLevel = randomChoice(['medium', 'high']);
                } else {
                    newLog.energyLevel = randomChoice(['low', 'medium']);
                }
            }

            // Pain level (0-10)
            if (phase === 'menstruation' && randomBool(0.8)) {
                newLog.painLevel = randomInt(3, 8);
                if (newLog.painLevel > 5) {
                    newLog.painLocations = [randomChoice(['abdomen', 'lower-back', 'legs'] as const)];
                }
            } else if (phase === 'ovulation' && randomBool(0.3)) {
                newLog.painLevel = randomInt(1, 4);
                newLog.painLocations = ['abdomen'];
            }

            // Stress score (0-10)
            if (randomBool(0.7)) {
                newLog.stressScore = randomInt(2, 7);
            }

            // Sleep
            if (randomBool(0.9)) {
                newLog.sleepHours = parseFloat(randomFloat(5.5, 9).toFixed(1));
                newLog.sleepQuality = randomInt(2, 5) as 1 | 2 | 3 | 4 | 5;
            }

            // Water intake (L)
            if (randomBool(0.8)) {
                newLog.waterIntake = parseFloat(randomFloat(1.2, 3.0).toFixed(1));
            }

            // Physical activity
            if (randomBool(0.6)) {
                newLog.physicalActivity = randomChoice(activityTypes);
                newLog.activityDuration = randomInt(15, 90);
                newLog.activityType = [randomChoice(['cardio', 'strength', 'yoga', 'walking', 'cycling'] as const)];
            } else {
                newLog.physicalActivity = 'none';
            }

            // Basal temperature (only around ovulation)
            if (phase === 'ovulation' && randomBool(0.5)) {
                newLog.basalTemp = parseFloat(randomFloat(36.5, 37.2).toFixed(1));
            }

            // Sexual activity
            if (randomBool(0.3)) {
                newLog.sexualActivity = randomBool(0.7);
            }

            // Medications (if pain is high)
            if (newLog.painLevel && newLog.painLevel > 5 && randomBool(0.6)) {
                newLog.medications = [{ name: 'Ibuprofeno', dose: '400mg' }];
            }

            // Supplements
            if (randomBool(0.3)) {
                newLog.supplements = [randomChoice(['Vitamina D', 'Magnesio', 'Hierro', 'Omega-3'])];
            }

            // Cravings (especially in luteal phase)
            if (phase === 'luteal' && randomBool(0.5)) {
                newLog.cravings = [randomChoice(['chocolate', 'dulces', 'salado', 'carbohidratos'])];
            }

            // Notes (occasionally)
            if (randomBool(0.15)) {
                const notes = [
                    "Me sentí bien hoy, con buena energía.",
                    "Día tranquilo, sin molestias.",
                    "Un poco cansada pero manejable.",
                    "Buen día de ejercicio.",
                    "Necesito descansar más.",
                    "Día productivo y positivo."
                ];
                newLog.notes = randomChoice(notes);
            }

            logs.push(newLog);
        }

        cycles.push(newCycle);
        currentDate = addDays(startDate, cycleLength);
    }

    // Make the last cycle "ongoing"
    const latestCycle = cycles[cycles.length - 1];
    delete latestCycle.endDate;
    delete latestCycle.length;

    const todayStr = formatISO(new Date(), { representation: 'date' });
    const filteredLogs = logs.filter(l => l.id <= todayStr);

    return { logs: filteredLogs, cycles };
};

// Generate logs for a specific date range
export const generateLogsForDateRange = (startDate: Date, endDate: Date): DailyLog[] => {
    const logs: DailyLog[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const logDateStr = formatISO(currentDate, { representation: 'date' });

        const newLog: DailyLog = {
            id: logDateStr,
            date: logDateStr,
            symptoms: [],
            medications: [],
            periodProducts: [],
            activityType: [],
            supplements: [],
            homeRemedies: [],
            cravings: [],
            stressTriggers: [],
        };

        // Random realistic data
        if (randomBool(0.8)) {
            newLog.mood = randomInt(2, 5) as 1 | 2 | 3 | 4 | 5;
        }

        if (randomBool(0.8)) {
            newLog.energyLevel = randomChoice(energyLevels);
        }

        if (randomBool(0.9)) {
            newLog.sleepHours = parseFloat(randomFloat(6, 9).toFixed(1));
            newLog.sleepQuality = randomInt(2, 5) as 1 | 2 | 3 | 4 | 5;
        }

        if (randomBool(0.7)) {
            newLog.waterIntake = parseFloat(randomFloat(1.5, 3.0).toFixed(1));
        }

        if (randomBool(0.5)) {
            newLog.physicalActivity = randomChoice(activityTypes);
            newLog.activityDuration = randomInt(20, 60);
        } else {
            newLog.physicalActivity = 'none';
        }

        if (randomBool(0.6)) {
            newLog.stressScore = randomInt(2, 6);
        }

        // Random symptoms
        if (randomBool(0.4)) {
            const allSymptoms = Object.values(symptomsByPhase).flat();
            const numSymptoms = randomInt(1, 3);
            const selectedSymptoms: string[] = [];
            for (let i = 0; i < numSymptoms; i++) {
                selectedSymptoms.push(randomChoice(allSymptoms));
            }
            newLog.symptoms = [...new Set(selectedSymptoms)];
        }

        logs.push(newLog);
        currentDate = addDays(currentDate, 1);
    }

    return logs;
};

// Generate a single realistic log for today
export const generateTodayLog = (): DailyLog => {
    const todayStr = formatISO(new Date(), { representation: 'date' });

    return {
        id: todayStr,
        date: todayStr,
        periodIntensity: 0,
        mood: randomInt(3, 5) as 1 | 2 | 3 | 4 | 5,
        energyLevel: randomChoice(energyLevels),
        painLevel: randomBool(0.3) ? randomInt(1, 5) : undefined,
        stressScore: randomInt(2, 6),
        sleepHours: parseFloat(randomFloat(6.5, 8.5).toFixed(1)),
        sleepQuality: randomInt(3, 5) as 1 | 2 | 3 | 4 | 5,
        waterIntake: parseFloat(randomFloat(1.8, 2.5).toFixed(1)),
        physicalActivity: randomBool(0.7) ? randomChoice(activityTypes) : 'none',
        activityDuration: randomBool(0.7) ? randomInt(30, 60) : undefined,
        symptoms: randomBool(0.3) ? [randomChoice(Object.values(symptomsByPhase).flat())] : [],
        medications: [],
        periodProducts: [],
        activityType: [],
        supplements: [],
        homeRemedies: [],
        cravings: [],
        stressTriggers: [],
        notes: randomBool(0.2) ? "Registro generado automáticamente para pruebas." : undefined
    };
};

// Fill missing days in a date range with realistic data
export const fillMissingDays = (existingLogs: DailyLog[], startDate: Date, endDate: Date): DailyLog[] => {
    const existingDates = new Set(existingLogs.map(log => log.date));
    const newLogs: DailyLog[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dateStr = formatISO(currentDate, { representation: 'date' });

        if (!existingDates.has(dateStr)) {
            const generatedLogs = generateLogsForDateRange(currentDate, currentDate);
            newLogs.push(...generatedLogs);
        }

        currentDate = addDays(currentDate, 1);
    }

    return newLogs;
};