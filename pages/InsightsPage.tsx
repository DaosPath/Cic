import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { parseISO } from 'date-fns/parseISO';
import type { Cycle, Symptom } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import type { Translations } from '../services/i18n.ts';

const intlLocales = {
    es: 'es-ES',
    en: 'en-US',
    tr: 'tr-TR',
} as const;

const getSymptomName = (id: string, symptoms: Symptom[], fallback: string): string => {
    const symptom = symptoms.find(s => s.id === id);
    return symptom ? symptom.name : fallback;
};

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-brand-secondary'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface CycleLengthChartProps {
    cycles: Cycle[];
    t: (key: keyof Translations) => string;
    daysLabel: string;
    chartLabel: string;
}

const CycleLengthChart: React.FC<CycleLengthChartProps> = ({ cycles, t, daysLabel, chartLabel }) => {
    const chartData = cycles
        .map(c => c.length || 0)
        .filter(len => len > 0 && len < 60)
        .slice(0, 10)
        .reverse();

    if (chartData.length < 2) return null;

    const maxLen = Math.max(...chartData, 35);
    const minLen = Math.min(...chartData, 21);
    const avgLen = Math.round(chartData.reduce((a, b) => a + b, 0) / chartData.length);
    const chartHeight = 200;
    const chartWidth = 350;
    const barWidth = chartWidth / chartData.length;

    return (
        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-2xl bg-brand-primary/10">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('cycleDuration')}</h2>
                    <p className="text-sm text-brand-text-dim">{`${t('average')}: ${avgLen} ${daysLabel}`}</p>
                </div>
            </div>
            <div className="bg-brand-surface/30 p-4 rounded-2xl">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" aria-label={chartLabel}>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c8a2c8" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#c8a2c8" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    {chartData.map((len, index) => {
                        const range = maxLen - minLen;
                        const heightRatio = range > 0 ? (len - minLen) / range : 0.5;
                        const topMargin = 36;
                        const bottomMargin = 20;
                        const usableHeight = chartHeight - topMargin - bottomMargin;
                        const barHeight = Math.max(15, heightRatio * usableHeight);
                        const x = index * barWidth;
                        const barBase = chartHeight - bottomMargin;
                        const barTop = barBase - barHeight;
                        const numberY = Math.max(12, barTop - 16);
                        let unitY = numberY + 10;
                        const maxUnitY = barTop - 4;
                        if (unitY > maxUnitY) {
                            unitY = Math.max(numberY + 4, maxUnitY);
                        }

                        return (
                            <g key={index}>
                                <rect
                                    x={x + barWidth * 0.2}
                                    y={barBase - barHeight}
                                    width={barWidth * 0.6}
                                    height={barHeight}
                                    fill="url(#gradient)"
                                    rx="6"
                                    className="drop-shadow-sm"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={numberY}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fontWeight={600}
                                    className="fill-current text-brand-text"
                                >
                                    {len}
                                </text>
                                <text
                                    x={x + barWidth / 2}
                                    y={unitY}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fontWeight={500}
                                    className="fill-current text-brand-text"
                                >
                                    {daysLabel}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export const InsightsPage: React.FC = () => {
    const { cycles, logs, settings, toggleFavoriteSymptom } = useContext(AppContext);
    const { t, language } = useTranslation();

    const intlLocale = intlLocales[language] ?? 'es-ES';

    const globalSymptomFrequencies = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            log.symptoms.forEach(symptomId => {
                counts[symptomId] = (counts[symptomId] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([id, count]) => ({
                id,
                name: getSymptomName(id, settings.customSymptoms, t('unknownSymptom')),
                count,
            }))
            .sort((a, b) => b.count - a.count);
    }, [logs, settings.customSymptoms, t]);

    const favoriteSymptoms = useMemo(() => {
        return (settings.favoriteSymptomIds || [])
            .map(id => settings.customSymptoms.find(s => s.id === id))
            .filter((s): s is Symptom => !!s);
    }, [settings.favoriteSymptomIds, settings.customSymptoms]);

    if (cycles.length < 2) {
        return (
            <div className="min-h-screen p-4 md:p-8 pt-12 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-12 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl text-center">
                    <div className="p-4 rounded-3xl bg-brand-primary/10 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-text tracking-tight">{t('cycleAnalysis')}</h1>
                    <p className="text-lg text-brand-text-dim leading-relaxed">
                        {t('notEnoughData')}<br />
                        {t('keepTracking')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 pt-12 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-8 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl mb-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-brand-text tracking-tight">{t('cycleAnalysis')}</h1>
                    <p className="text-lg md:text-xl text-brand-text-dim font-light">
                        {t('discoverPatterns')}
                    </p>
                    <div className="mt-4 w-20 h-1 bg-gradient-to-r from-brand-primary/50 to-brand-primary mx-auto rounded-full"></div>
                </div>
            </div>

            <div className="mb-8">
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-2xl bg-yellow-300/10">
                            <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('favoriteSymptoms')}</h2>
                    </div>
                    {favoriteSymptoms.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {favoriteSymptoms.map(symptom => (
                                <div key={symptom.id} className="bg-gradient-to-r from-yellow-300/20 to-yellow-300/10 p-4 rounded-2xl flex items-center gap-3 border border-yellow-300/30 shadow-lg">
                                    <StarIcon filled={true} />
                                    <span className="font-semibold text-brand-text">{symptom.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-brand-text-dim">{t('markImportantSymptoms')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <CycleLengthChart
                        cycles={cycles}
                        t={t}
                        daysLabel={t('days')}
                        chartLabel={t('cycleDurationChartAria')}
                    />

                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-2xl bg-blue-400/10">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('cycleHistory')}</h2>
                        </div>
                        <div className="space-y-3 h-80 lg:h-96 overflow-y-auto pr-2">
                            {cycles.map((cycle, index) => (
                                <div key={cycle.id} className="bg-brand-surface/30 p-4 rounded-2xl border border-brand-primary/10 hover:border-brand-primary/20 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-bold text-brand-text">
                                            {index === 0 ? t('currentCycle') : `${t('cycle')} ${cycles.length - index}`}
                                        </h3>
                                        {cycle.length && (
                                            <span className="bg-brand-primary/20 text-brand-text px-3 py-1 rounded-full text-sm font-bold">
                                                {cycle.length} {t('days')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-brand-text-dim">
                                        {new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(parseISO(cycle.startDate))}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl flex flex-col lg:h-[700px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-2xl bg-green-400/10">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('symptomAnalysis')}</h2>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                        {globalSymptomFrequencies.map((symptom, index) => (
                            <div key={symptom.id} className="bg-brand-surface/30 p-4 rounded-2xl flex justify-between items-center border border-brand-primary/10 hover:border-brand-primary/20 transition-all duration-300 hover:scale-[1.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-sm font-bold text-brand-text">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-brand-text">{symptom.name}</p>
                                        <p className="text-xs text-brand-text-dim">
                                            {symptom.count} {symptom.count === 1 ? t('record') : t('records')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleFavoriteSymptom(symptom.id)}
                                    className="p-2 rounded-2xl hover:bg-brand-primary/10 transition-all duration-300 hover:scale-110 active:scale-95"
                                >
                                    <StarIcon filled={(settings.favoriteSymptomIds || []).includes(symptom.id)} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
