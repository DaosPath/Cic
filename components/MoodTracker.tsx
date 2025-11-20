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
        { value: 2, emoji: '🙁', label: t('bad'), ariaLabel: `${t('mood')}: ${t('bad')}` },
        { value: 3, emoji: '😐', label: t('normal'), ariaLabel: `${t('mood')}: ${t('normal')}` },
        { value: 4, emoji: '🙂', label: t('good'), ariaLabel: `${t('mood')}: ${t('good')}` },
        { value: 5, emoji: '😄', label: t('great'), ariaLabel: `${t('mood')}: ${t('great')}` },
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
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] w-full">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base md:text-lg font-semibold text-brand-text tracking-wide" style={{ lineHeight: 1.4 }}>{t('howDoYouFeel')}</h3>
                {showSaved && selectedMood && (
                    <span className="text-xs bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <span>✅</span> {t('logSaved')}
                    </span>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-5 w-full">
                {moods.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => handleMoodSelect(mood.value)}
                        className={`flex flex-col items-center gap-2 rounded-xl p-2 md:p-3 transition duration-300 transform-gpu w-full h-full ${
                            selectedMood === mood.value 
                                ? 'bg-brand-primary/20 shadow-lg ring-2 ring-brand-primary/50 shadow-brand-primary/20' 
                                : 'hover:bg-brand-surface/50'
                        }`}
                        aria-label={mood.ariaLabel}
                        aria-pressed={selectedMood === mood.value}
                        type="button"
                    >
                        <span className="text-4xl md:text-[42px]">{mood.emoji}</span>
                        <span className="text-[10px] md:text-xs text-brand-text-dim/80 font-medium text-center leading-tight" style={{ lineHeight: 1.3 }}>{mood.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex justify-end">
                <button 
                    onClick={() => window.location.hash = '/log'}
                    className="bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-accent transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/30 hover:scale-[1.02]"
                >
                    {t('logSymptoms')}
                </button>
            </div>
        </div>
    );
};


