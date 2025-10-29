import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog, Symptom } from '../types.ts';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import type { Translations } from '../services/i18n.ts';

const moodEmojis = [
    { value: 1, emoji: '😣' },
    { value: 2, emoji: '😔' },
    { value: 3, emoji: '😐' },
    { value: 4, emoji: '🙂' },
    { value: 5, emoji: '🤩' },
] as const;

const moodKeys: Array<keyof Translations> = ['terrible', 'bad', 'normal', 'good', 'great'];

const intlLocales = {
    es: 'es-ES',
    en: 'en-US',
    tr: 'tr-TR',
} as const;

export const LogPage: React.FC = () => {
    const { settings, refreshData } = useContext(AppContext);
    const { t, language } = useTranslation();
    const todayStr = formatISO(startOfToday(), { representation: 'date' });
    const [log, setLog] = useState<DailyLog>({
        id: todayStr,
        date: todayStr,
        symptoms: [],
        medications: [],
    });
    const [loading, setLoading] = useState(true);

    const intlLocale = intlLocales[language] ?? 'es-ES';

    useEffect(() => {
        const fetchLog = async () => {
            setLoading(true);
            const existingLog = await getLog(todayStr);
            if (existingLog) {
                setLog(existingLog);
            }
            setLoading(false);
        };
        fetchLog();
    }, [todayStr]);

    const handleSave = async () => {
        await upsertLog(log);
        await refreshData();
        alert(t('logSaved'));
    };

    const toggleSymptom = (symptomId: string) => {
        setLog(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptomId)
                ? prev.symptoms.filter(id => id !== symptomId)
                : [...prev.symptoms, symptomId],
        }));
    };

    if (loading) {
        return <div className="p-4 md:p-8 pt-16 text-center">{t('loading')}</div>;
    }

    const formattedDate = new Intl.DateTimeFormat(intlLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    const PeriodButton: React.FC<{ intensity: 0 | 1 | 2 | 3; label: string }> = ({ intensity, label }) => (
        <button
            onClick={() => setLog({ ...log, periodIntensity: intensity })}
            className={`w-full py-2.5 px-3 rounded-[18px] text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                log.periodIntensity === intensity
                    ? 'bg-phase-menstruation/20 text-phase-menstruation border border-phase-menstruation shadow-sm'
                    : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50 hover:border-phase-menstruation/30'
            }`}
            style={{ fontWeight: 500, lineHeight: 1.45 }}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen px-4 md:px-8 pt-12 pb-24 md:pb-12">
            <div className="max-w-[1140px] mx-auto">
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 md:p-8 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 md:mb-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-brand-text tracking-tight" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('dailyRecord')}</h1>
                        <p className="text-base md:text-lg text-brand-text-dim/80 font-medium" style={{ fontWeight: 500, lineHeight: 1.45 }}>
                            {formattedDate}
                        </p>
                        <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent mx-auto rounded-full"></div>
                    </div>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 rounded-xl bg-phase-menstruation/15">
                                <svg className="w-5 h-5 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('menstruationIntensity')}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <PeriodButton intensity={0} label={t('noFlow')} />
                            <PeriodButton intensity={1} label={t('light')} />
                            <PeriodButton intensity={2} label={t('medium')} />
                            <PeriodButton intensity={3} label={t('heavy')} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 rounded-xl bg-brand-accent/15">
                                <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('mood')}</h2>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            {moodEmojis.map(({ value, emoji }) => (
                                <button
                                    key={value}
                                    onClick={() => setLog({ ...log, mood: value as DailyLog['mood'] })}
                                    className={`text-[32px] md:text-[36px] rounded-xl p-2 md:p-2.5 transition-all duration-200 hover:scale-105 active:scale-100 ${log.mood === value ? 'bg-brand-primary/20 scale-105 shadow-lg ring-2 ring-brand-primary/50' : 'hover:bg-brand-surface/50'}`}
                                    aria-label={`${t('mood')}: ${t(moodKeys[value - 1])}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 rounded-xl bg-brand-primary/15">
                                <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('symptoms')}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {settings.customSymptoms.map((symptom: Symptom) => (
                                <button
                                    key={symptom.id}
                                    onClick={() => toggleSymptom(symptom.id)}
                                    className={`px-4 py-2.5 rounded-[18px] text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                                        log.symptoms.includes(symptom.id)
                                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary shadow-sm'
                                            : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50 hover:border-brand-primary/30'
                                    }`}
                                    style={{ fontWeight: 500, lineHeight: 1.45 }}
                                >
                                    {symptom.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col">
                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 rounded-xl bg-brand-positive/15">
                                <svg className="w-5 h-5 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.45 }}>{t('notes')}</h2>
                        </div>
                        <textarea
                            value={log.notes || ''}
                            onChange={(e) => setLog({ ...log, notes: e.target.value })}
                            className="w-full flex-1 min-h-[320px] lg:min-h-0 bg-brand-surface p-4 md:p-5 rounded-[18px] border border-brand-border hover:bg-brand-surface-2 focus:border-brand-primary outline-none transition-all duration-200 resize-none text-brand-text font-normal"
                            placeholder={t('addAnyAdditionalNotes')}
                            style={{ 
                                fontWeight: 400, 
                                lineHeight: 1.6,
                                boxShadow: 'none',
                                WebkitBoxShadow: 'none'
                            }}
                        />
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleSave}
                                className="group bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold py-3 px-10 rounded-full shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5"
                                style={{ fontWeight: 600 }}
                            >
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('saveRecord')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};
