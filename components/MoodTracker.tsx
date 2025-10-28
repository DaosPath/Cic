import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { DailyLog } from '../types.ts';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import formatISO from 'date-fns/formatISO';
import startOfToday from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';

const moods = [
    { value: 1, emoji: '😠', label: 'Terrible' },
    { value: 2, emoji: '😔', label: 'Mal' },
    { value: 3, emoji: '😐', label: 'Normal' },
    { value: 4, emoji: '🙂', label: 'Bien' },
    { value: 5, emoji: '😊', label: 'Genial' },
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
        <div className="bg-brand-surface/50 p-4 rounded-lg backdrop-blur-sm w-full max-w-sm md:max-w-md">
            <h3 className="text-sm font-semibold text-brand-text-dim mb-3 text-center">¿Cómo te sientes hoy?</h3>
            <div className="flex justify-around items-center">
                {moods.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => handleMoodSelect(mood.value)}
                        className={`text-3xl md:text-4xl rounded-full p-2 transition-transform duration-200 hover:scale-125 ${selectedMood === mood.value ? 'bg-brand-primary/20 scale-125' : ''}`}
                        aria-label={mood.label}
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};