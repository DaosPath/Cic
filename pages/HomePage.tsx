import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr as trLocale } from 'date-fns/locale/tr';
import { CycleRing } from '../components/CycleRing.tsx';
import { MoodTracker } from '../components/MoodTracker.tsx';
import { PhaseInsight } from '../components/PhaseInsight.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';

const phaseColors: Record<string, string> = {
    menstruation: "text-phase-menstruation",
    follicular: "text-phase-follicular",
    ovulation: "text-phase-ovulation",
    luteal: "text-phase-luteal"
};

const dateFnsLocales = {
    es,
    en: enUS,
    tr: trLocale,
} as const;

const intlLocales = {
    es: 'es-ES',
    en: 'en-US',
    tr: 'tr-TR',
} as const;

const formatDayMonth = (date: Date, locale: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);

const formatShortRange = (date: Date, locale: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);

export const HomePage: React.FC = () => {
    const { currentPhase, dayOfCycle, predictions, settings, isLoading } = useContext(AppContext);
    const { t, language } = useTranslation();

    const discrete = settings.discreteMode;
    const dateLocale = dateFnsLocales[language] ?? es;
    const intlLocale = intlLocales[language] ?? 'es-ES';
    const distanceOptions = { locale: dateLocale, addSuffix: true as const };

    const getPhaseTranslation = (phase: string) => {
        switch (phase) {
            case 'menstruation': return t('menstruation');
            case 'follicular': return t('follicular');
            case 'ovulation': return t('ovulation');
            case 'luteal': return t('luteal');
            default: return phase;
        }
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"></div>;
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start text-center p-4 md:p-8 gap-5 md:gap-6 pt-8 md:pt-12">
            {/* Hero Section - Cycle Ring */}
            <div className="flex flex-col items-center justify-center animate-fade-in">
                <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center mb-4 group">
                    <CycleRing phase={currentPhase} />
                    <div className="absolute z-10 text-center pointer-events-none">
                        <span className="text-7xl md:text-8xl font-extrabold text-brand-text drop-shadow-2xl tracking-tight relative">
                            {dayOfCycle > 0 ? dayOfCycle : '...'}
                            <span className="absolute inset-0 blur-xl opacity-40 text-phase-follicular">{dayOfCycle > 0 ? dayOfCycle : '...'}</span>
                        </span>
                        <p className="text-lg md:text-xl text-brand-text-dim mt-2 font-light tracking-wide">{dayOfCycle > 0 ? t('dayOfCycle') : t('calculating')}</p>
                    </div>
                </div>
                <div className="relative">
                    <h1 className="text-4xl md:text-5xl font-bold capitalize text-phase-follicular drop-shadow-lg transition-all duration-700 tracking-tight">
                        {discrete ? t('currentPhase') : getPhaseTranslation(currentPhase)}
                    </h1>
                </div>
            </div>

            {/* Mood Tracker */}
            <div className="w-full max-w-lg md:max-w-[520px] animate-slide-up">
                <MoodTracker />
            </div>

            {/* Predictions Cards */}
            <div className="w-full max-w-lg md:max-w-[520px] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-[20px] backdrop-blur-lg border border-brand-text-dim/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-center mb-3">
                            <div className="p-3 rounded-full bg-phase-follicular/15 backdrop-blur-sm">
                                <svg className="w-5 h-5 text-phase-follicular" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-brand-text uppercase tracking-[0.15em] mb-3 text-center opacity-90">
                            {discrete ? t('nextEvent') : t('nextPeriod')}
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-brand-text text-center">
                            {predictions ? (
                                discrete
                                    ? formatDistanceToNow(predictions.nextPeriod[0], distanceOptions)
                                    : formatDayMonth(predictions.nextPeriod[0], intlLocale)
                            ) : t('calculating')}
                        </p>
                    </div>
                    <div className="group bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-[20px] backdrop-blur-lg border border-brand-text-dim/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-center mb-3">
                            <div className="p-3 rounded-full bg-phase-follicular/15 backdrop-blur-sm">
                                <svg className="w-5 h-5 text-phase-follicular" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-brand-text uppercase tracking-[0.15em] mb-3 text-center opacity-90">
                            {discrete ? t('relevantWindow') : t('fertileWindow')}
                        </h3>
                        <p className="text-2xl md:text-3xl font-bold text-brand-text text-center">
                            {predictions ? (
                                discrete
                                    ? formatDistanceToNow(predictions.fertileWindow[0], distanceOptions)
                                    : `${formatShortRange(predictions.fertileWindow[0], intlLocale)} - ${formatShortRange(predictions.fertileWindow[1], intlLocale)}`
                            ) : t('calculating')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Phase Insight */}
            <div className="w-full max-w-lg md:max-w-[520px] animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <PhaseInsight />
            </div>

            {/* Disclaimer */}
            <div className="mt-auto pt-12 pb-24 md:pb-10 text-center px-6 max-w-lg md:max-w-[520px]">
                <div className="w-full h-px bg-brand-text-dim/10 mb-6"></div>
                <p className="text-xs text-brand-text-dim/60 leading-relaxed font-light">
                    {t('medicalDisclaimer')}
                </p>
            </div>
        </div>
    );
};
