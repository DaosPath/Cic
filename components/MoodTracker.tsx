import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog } from '../types.ts';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

export const MoodTracker: React.FC = () => {
    const { refreshData } = useContext(AppContext);
    const { t } = useTranslation();
    const todayStr = formatISO(startOfToday(), { representation: 'date' });
    const [selectedMood, setSelectedMood] = useState<number | undefined>();
    const [showSaved, setShowSaved] = useState(false);

    const moods = [
        { value: 1, emoji: '😣', label: t('terrible'), ariaLabel: `${t('mood')}: ${t('terrible')}` },
        { value: 2, emoji: '😔', label: t('bad'), ariaLabel: `${t('mood')}: ${t('bad')}` },
        { value: 3, emoji: '😐', label: t('normal'), ariaLabel: `${t('mood')}: ${t('normal')}` },
        { value: 4, emoji: '🙂', label: t('good'), ariaLabel: `${t('mood')}: ${t('good')}` },
        { value: 5, emoji: '🤩', label: t('great'), ariaLabel: `${t('mood')}: ${t('great')}` },
    ];

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

        const existingLog = (await getLog(todayStr)) || {
            id: todayStr,
            date: todayStr,
            symptoms: [],
            medications: [],
        };

        const updatedLog: DailyLog = { ...existingLog, mood: newMood as any };
        await upsertLog(updatedLog);
        await refreshData();
        
        if (newMood !== undefined) {
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }
    };

    return (
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-[20px] backdrop-blur-lg border border-brand-text-dim/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-brand-text tracking-wide">{t('howDoYouFeel')}</h3>
                {showSaved && selectedMood && (
                    <span className="text-xs bg-phase-follicular/20 text-phase-follicular px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <span>✓</span> Guardado
                    </span>
                )}
            </div>
            <div className="flex justify-between items-start gap-2 mb-4">
                {moods.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => handleMoodSelect(mood.value)}
                        className={`flex flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300 hover:scale-105 active:scale-100 flex-1 ${
                            selectedMood === mood.value 
                                ? 'bg-phase-follicular/20 scale-105 shadow-lg ring-2 ring-phase-follicular/50 shadow-phase-follicular/20' 
                                : 'hover:bg-brand-surface/50'
                        }`}
                        aria-label={mood.ariaLabel}
                        aria-pressed={selectedMood === mood.value}
                        type="button"
                    >
                        <span className="text-3xl md:text-4xl">{mood.emoji}</span>
                        <span className="text-[10px] md:text-xs text-brand-text-dim font-medium text-center leading-tight">{mood.label}</span>
                    </button>
                ))}
            </div>
            <button 
                onClick={() => window.location.hash = '/log'}
                className="w-full md:w-auto md:ml-auto md:block border border-phase-follicular/40 text-phase-follicular px-4 py-2 rounded-full text-sm font-medium hover:bg-phase-follicular/10 transition-all duration-300 hover:shadow-lg hover:shadow-phase-follicular/20"
            >
                Registrar síntomas
            </button>
        </div>
    );
};
