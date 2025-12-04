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
        <div className="w-full min-h-screen flex flex-col items-center justify-start text-center px-4 md:px-8 pt-8 md:pt-12 overflow-x-hidden">
            <div className="w-full max-w-[1140px] flex flex-col items-center gap-6 md:gap-8">
                {/* Hero Section - Cycle Ring */}
                <div className="flex flex-col items-center justify-center animate-fade-in">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center mb-3 group overflow-hidden">
                        <CycleRing phase={currentPhase} />
                        <div className="absolute z-10 text-center pointer-events-none">
                            <span 
                                className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-brand-text tracking-tight relative" 
                                style={{ 
                                    textShadow: '0 0 40px var(--particle), 0 4px 12px rgba(0, 0, 0, 0.6), 0 0 2px var(--brand)',
                                    filter: 'drop-shadow(0 0 8px var(--particle))'
                                }}
                            >
                                {dayOfCycle > 0 ? dayOfCycle : '...'}
                            </span>
                            <p className="text-sm md:text-base text-brand-text-dim/80 mt-3 font-light tracking-wide">{dayOfCycle > 0 ? t('dayOfCycle') : t('calculating')}</p>
                        </div>
                    </div>
                    <div className="relative mt-6 md:mt-8">
                        <h1 className="text-3xl md:text-4xl font-bold capitalize text-brand-primary transition-all duration-700 tracking-tight" style={{ fontWeight: 700 }}>
                            {discrete ? t('currentPhase') : getPhaseTranslation(currentPhase)}
                        </h1>
                    </div>
                </div>

                {/* Mood Tracker */}
                <div className="w-full animate-slide-up">
                    <MoodTracker />
                </div>

                {/* Predictions Cards */}
                <div className="w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="group bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-brand-primary/30 hover:scale-[1.01] transition-all duration-300 min-h-[160px] flex flex-col justify-between">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-brand-primary/15 backdrop-blur-sm">
                                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xs font-semibold text-brand-text/70 uppercase tracking-[0.12em] mb-4 text-center" style={{ lineHeight: 1.4 }}>
                                {discrete ? t('nextEvent') : t('nextPeriod')}
                            </h3>
                            <p className="text-3xl md:text-4xl font-bold text-brand-text text-center" style={{ lineHeight: 1.2 }}>
                                {predictions ? (
                                    discrete
                                        ? formatDistanceToNow(predictions.nextPeriod[0], distanceOptions)
                                        : formatDayMonth(predictions.nextPeriod[0], intlLocale)
                                ) : t('calculating')}
                            </p>
                        </div>
                        <div className="group bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-brand-accent/30 hover:scale-[1.01] transition-all duration-300 min-h-[160px] flex flex-col justify-between">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-brand-accent/15 backdrop-blur-sm">
                                    <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xs font-semibold text-brand-text/70 uppercase tracking-[0.12em] mb-4 text-center" style={{ lineHeight: 1.4 }}>
                                {discrete ? t('relevantWindow') : t('fertileWindow')}
                            </h3>
                            <p className="text-3xl md:text-4xl font-bold text-brand-text text-center" style={{ lineHeight: 1.2 }}>
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
                <div className="w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <PhaseInsight />
                </div>

                {/* Chat CTA */}
                <div className="w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="relative overflow-hidden rounded-[20px] border border-brand-border bg-gradient-to-br from-brand-surface/95 via-brand-surface-2/95 to-brand-surface/90 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.45)] transition-all duration-300">
                        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,165,0,0.12),transparent_45%),radial-gradient(circle_at_80%_35%,rgba(255,105,180,0.12),transparent_40%)]"></div>
                        <div className="relative p-6 md:p-7 flex flex-col gap-5">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                <div className="p-3 rounded-2xl bg-brand-primary/15 backdrop-blur-sm border border-brand-primary/30 shadow-[0_6px_20px_rgba(255,165,0,0.15)]">
                                    <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-brand-text mb-1 leading-tight" style={{ fontWeight: 750 }}>
                                        {t('chatWithAI')}
                                    </h3>
                                    <p className="text-sm text-brand-text-dim leading-relaxed" style={{ fontWeight: 500 }}>
                                        {t('askAboutCycle')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { window.location.hash = '/insights?chat=1'; }}
                                    className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-black transition-all duration-200 overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, #fdbb2d 0%, #f97316 35%, #f59e0b 100%)',
                                        boxShadow: '0 6px 24px rgba(253,187,45,0.25), 0 4px 12px rgba(249,115,22,0.25)'
                                    }}
                                >
                                    <span className="text-sm md:text-base" style={{ fontWeight: 700 }}>{t('startChat')}</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xs uppercase tracking-[0.14em] text-brand-text-dim/80 font-semibold">
                                    {t('context')}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/15 border border-brand-primary/30 text-brand-primary">
                                    {t('dayOfCycle')}: {dayOfCycle > 0 ? dayOfCycle : '--'}
                                </span>
                                {!discrete && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 border border-brand-accent/30 text-brand-accent capitalize">
                                        {getPhaseTranslation(currentPhase)}
                                    </span>
                                )}
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-surface-2/80 border border-brand-border/50 text-brand-text-dim">
                                    {predictions ? formatDayMonth(predictions.nextPeriod[0], intlLocale) : t('calculating')}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[t('chatQuickSleep'), t('chatQuickCycle'), t('chatQuickRecommendations'), t('aiLogExample5')].map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => { window.location.hash = '/insights?chat=1'; sessionStorage.setItem('prefillChatPrompt', prompt); }}
                                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface-2/80 border border-brand-border/40 text-brand-text hover:border-brand-primary/40 hover:text-brand-primary transition-all duration-150"
                                        style={{ fontWeight: 600 }}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-8 pb-24 md:pb-10 text-center w-full">
                    <div className="w-full h-px bg-brand-border mb-6"></div>
                    <p className="text-xs text-brand-text-dim/50 leading-relaxed font-light" style={{ lineHeight: 1.6 }}>
                        {t('medicalDisclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};
