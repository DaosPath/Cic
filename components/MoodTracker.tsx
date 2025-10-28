import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog } from '../types.ts';
import formatISO from 'date-fns/formatISO';
import startOfToday from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

export const MoodTracker: React.FC = () => {
    const { refreshData } = useContext(AppContext);
    const { t } = useTranslation();
    const todayStr = formatISO(startOfToday(), { representation: 'date' });
    const [selectedMood, setSelectedMood] = useState<number | undefined>();

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
    };

    return (
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl w-full">
            <h3 className="text-lg font-bold text-brand-text mb-5 text-center tracking-wide">{t('howDoYouFeel')}</h3>
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
