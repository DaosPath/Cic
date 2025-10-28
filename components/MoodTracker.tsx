import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { DailyLog } from '../types.ts';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import formatISO from 'date-fns/formatISO';
import startOfToday from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';

const moods = [
    { value: 1, emoji: '😠', label: 'Terrible', ariaLabel: 'Seleccionar estado de ánimo: Terrible' },
    { value: 2, emoji: '😔', label: 'Mal', ariaLabel: 'Seleccionar estado de ánimo: Mal' },
    { value: 3, emoji: '😐', label: 'Normal', ariaLabel: 'Seleccionar estado de ánimo: Normal' },
    { value: 4, emoji: '🙂', label: 'Bien', ariaLabel: 'Seleccionar estado de ánimo: Bien' },
    { value: 5, emoji: '😊', label: 'Genial', ariaLabel: 'Seleccionar estado de ánimo: Genial' },
];

export const MoodTracker: React.FC = () => {
    const { refreshData } = useContext(AppContext);
    const todayStr = formatISO(startOfToday(), { representation: 'date' });
    const [selectedMood, setSelectedMood] = useState<number | undefined>();

    useEffect(() => {
        const fetchMood = async () => {
            const log = await getLog(todayStr);
            if (log && log.mood) {
                setSelectedMood(log.mood);
            }
        };
        fetchMood();
    }, [todayStr]);

    const handleMoodSelect = async (moodValue: number) => {
        const newMood = selectedMood === moodValue ? undefined : moodValue;
        setSelectedMood(newMood);
        
        const existingLog = await getLog(todayStr) || {
            id: todayStr,
            date: todayStr,
            symptoms: [],
            medications: [],
        };
        
        const updatedLog: DailyLog = { ...existingLog, mood: newMood as any };
        await upsertLog(updatedLog);
        await refreshData();
    };

    return (
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl w-full">
            <h3 className="text-lg font-bold text-brand-text mb-5 text-center tracking-wide">¿Cómo te sientes hoy?</h3>
            <div className="flex justify-between items-center px-2">
                {moods.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => handleMoodSelect(mood.value)}
                        className={`text-3xl md:text-4xl rounded-xl p-3 transition-all duration-300 hover:scale-110 active:scale-105 flex-shrink-0 ${selectedMood === mood.value ? 'bg-brand-primary/40 scale-110 shadow-xl ring-2 ring-brand-primary/50' : 'hover:bg-brand-primary/10 hover:shadow-lg'}`}
                        aria-label={mood.ariaLabel}
                        aria-pressed={selectedMood === mood.value}
                        type="button"
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};