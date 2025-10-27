import type { DailyLog, Cycle } from '../types.ts';
import { formatISO, addDays, subDays } from 'date-fns';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateDevData = (): { logs: DailyLog[], cycles: Cycle[] } => {
    const cycles: Cycle[] = [];
    const logs: DailyLog[] = [];
    let currentDate = subDays(new Date(), 365); 

    for (let i = 0; i < 13; i++) {
        const cycleLength = randomInt(27, 31);
        const startDate = currentDate;

        const newCycle: Cycle = {
            startDate: formatISO(startDate, { representation: 'date' }),
            endDate: formatISO(addDays(startDate, cycleLength -1), { representation: 'date' }),
            length: cycleLength,
        };

        for (let day = 0; day < cycleLength; day++) {
            const logDate = addDays(startDate, day);
            const logDateStr = formatISO(logDate, { representation: 'date' });
            
            const newLog: DailyLog = {
                id: logDateStr,
                date: logDateStr,
                symptoms: [],
                medications: [],
            };

            if (day < 5) {
                newLog.periodIntensity = day === 1 ? 3 : day < 3 ? 2 : 1;
            } else {
                 newLog.periodIntensity = 0;
            }
            
            const symptomsToAdd: string[] = [];
            if (day < 5) { // Menstruation
                if (Math.random() < 0.8) symptomsToAdd.push('cramps');
                if (Math.random() < 0.6) symptomsToAdd.push('fatigue');
                if (Math.random() < 0.3) symptomsToAdd.push('headache');
            } else if (day > cycleLength - 10) { // Luteal
                 if (Math.random() < 0.7) symptomsToAdd.push('irritability');
                 if (Math.random() < 0.5) symptomsToAdd.push('bloating');
                 if (Math.random() < 0.4) symptomsToAdd.push('fatigue');
            } else if (day > 12 && day < 16) { // Ovulation
                 if (Math.random() < 0.3) symptomsToAdd.push('bloating');
            }

            newLog.symptoms = [...new Set(symptomsToAdd)];

            if (Math.random() < 0.1) {
                newLog.notes = "Un día de prueba generado automáticamente.";
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