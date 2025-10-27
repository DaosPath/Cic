import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getSettings, getAllLogs, getAllCycles, saveSettings } from '../services/db.ts';
import { getCyclePhase, calculatePredictions, getTodayInTimezone, calculateAverages } from '../services/cycle-logic.ts';
import type { AppSettings, DailyLog, Cycle, CyclePhase, Prediction } from '../types.ts';

interface AppContextType {
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    logs: DailyLog[];
    cycles: Cycle[];
    currentPhase: CyclePhase;
    dayOfCycle: number;
    predictions: Prediction | null;
    isLoading: boolean;
    refreshData: () => Promise<void>;
    toggleFavoriteSymptom: (symptomId: string) => Promise<void>;
}

const defaultSettings: AppSettings = {
    cycleLength: 28,
    lutealPhaseLength: 14,
    startOfWeek: 'monday',
    discreteMode: false,
    customSymptoms: [],
    favoriteSymptomIds: [],
};

export const AppContext = createContext<AppContextType>({
    settings: defaultSettings,
    setSettings: () => {},
    logs: [],
    cycles: [],
    currentPhase: 'follicular',
    dayOfCycle: 1,
    predictions: null,
    isLoading: true,
    refreshData: async () => {},
    toggleFavoriteSymptom: async () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [currentPhase, setCurrentPhase] = useState<CyclePhase>('follicular');
    const [dayOfCycle, setDayOfCycle] = useState<number>(1);
    const [predictions, setPredictions] = useState<Prediction | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [dbSettings, dbLogs, dbCycles] = await Promise.all([
                getSettings(),
                getAllLogs(),
                getAllCycles(),
            ]);

            setSettings(dbSettings);
            setLogs(dbLogs);
            setCycles(dbCycles);

            const today = getTodayInTimezone();
            const latestCycle = dbCycles[0];

            const { avgCycleLength, avgLutealPhaseLength } = calculateAverages(dbCycles);
            
            const { phase, dayOfCycle } = getCyclePhase(
                today,
                latestCycle,
                avgCycleLength || dbSettings.cycleLength,
                dbSettings.lutealPhaseLength
            );
            setCurrentPhase(phase);
            setDayOfCycle(dayOfCycle);

            const newPredictions = calculatePredictions(
                dbCycles,
                avgCycleLength || dbSettings.cycleLength,
                dbSettings.lutealPhaseLength
            );
            setPredictions(newPredictions);

        } catch (error) {
            console.error("Failed to refresh data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const toggleFavoriteSymptom = async (symptomId: string) => {
        const currentFavorites = settings.favoriteSymptomIds || [];
        const newFavorites = currentFavorites.includes(symptomId)
          ? currentFavorites.filter(id => id !== symptomId)
          : [...currentFavorites, symptomId];
        
        const newSettings = { ...settings, favoriteSymptomIds: newFavorites };
        
        setSettings(newSettings); // Optimistic update
        await saveSettings(newSettings);
    };


    const value = {
        settings,
        setSettings,
        logs,
        cycles,
        currentPhase,
        dayOfCycle,
        predictions,
        isLoading,
        refreshData,
        toggleFavoriteSymptom,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};