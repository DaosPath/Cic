import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { parseISO } from 'date-fns/parseISO';
import { differenceInDays } from 'date-fns/differenceInDays';
import type { Cycle, Symptom, DailyLog } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import { AIInsightsList } from '../components/AIInsightsList.tsx';
import { formatInsightsForChat, formatContextForChat, addUserMessage, addAssistantMessage, type ChatMessage, type ChatContext } from '../services/ai-chat-formatter.ts';
import { createChatSession, sendChatMessage, type ChatSession } from '../services/ai-chat.ts';
import { AIChat } from '../components/AIChat.tsx';
import { useAIInsights } from '../hooks/useAIInsights.ts';
import type { AIInsight } from '../services/ai-insights.ts';
import { DailyInsightView } from '../components/DailyInsightView.tsx';
import { WeeklyInsightView } from '../components/WeeklyInsightView.tsx';
import { MonthlyInsightView } from '../components/MonthlyInsightView.tsx';
import { UnifiedChatCTA } from '../components/UnifiedChatCTA.tsx';
import { format } from 'date-fns/format';
import { subDays } from 'date-fns/subDays';
import { startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr } from 'date-fns/locale/tr';

const intlLocales = {
    es: 'es-ES',
    en: 'en-US',
    tr: 'tr-TR',
} as const;

// Helper functions
const getCyclePhase = (cycle: Cycle, date: Date): string => {
    const dayOfCycle = differenceInDays(date, parseISO(cycle.startDate)) + 1;
    const cycleLength = cycle.length || 28;

    if (dayOfCycle <= 5) return 'Menstrual';
    if (dayOfCycle <= 13) return 'Folicular';
    if (dayOfCycle <= 16) return 'Ovulación';
    if (dayOfCycle <= cycleLength) return 'Lútea';
    return 'Post-ciclo';
};

const calculateStandardDeviation = (values: number[]): number => {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
};

const calculateRegularity = (cycles: Cycle[]): number => {
    const lengths = cycles.filter(c => c.length && c.length >= 21 && c.length <= 35).map(c => c.length!);
    if (lengths.length < 2) return 0;
    const stdDev = calculateStandardDeviation(lengths);
    // Regularity: 100 = perfect (stdDev = 0), 0 = very irregular (stdDev > 7)
    return Math.max(0, Math.min(100, 100 - (stdDev * 14)));
};

const calculateMovingAverage = (data: number[], window: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - window + 1);
        const subset = data.slice(start, i + 1);
        result.push(subset.reduce((a, b) => a + b, 0) / subset.length);
    }
    return result;
};

// Cycle Length Chart Component
const CycleLengthChart: React.FC<{ cycles: Cycle[]; avgCycleLength: number }> = ({ cycles, avgCycleLength }) => {
    const { t, language } = useTranslation();
    const intlLocale = intlLocales[language] ?? 'es-ES';
    const validCycles = cycles.filter(c => c.length && c.length >= 21 && c.length <= 45).reverse();

    if (validCycles.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-brand-text-dim">
                {t('notEnoughData')}
            </div>
        );
    }

    const lengths = validCycles.map(c => c.length!);
    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);

    // Calculate moving average
    const movingAvg = calculateMovingAverage(lengths, 3);

    return (
        <div className="h-full flex flex-col">
            {/* Chart */}
            <div className="h-48 flex items-end gap-2 pb-8 relative">
                {validCycles.map((cycle, index) => {
                    // Use pixels for more visible differences: 4px per day
                    const baseHeight = 80; // Base height in pixels
                    const heightPx = baseHeight + ((cycle.length! - 28) * 8); // 8px per day difference from 28

                    const deviation = Math.abs(cycle.length! - avgCycleLength);

                    return (
                        <div key={cycle.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Bar */}
                            <div
                                className="w-full rounded-t-lg transition-all duration-200 group-hover:opacity-80 relative"
                                style={{
                                    height: `${Math.max(40, Math.min(180, heightPx))}px`,
                                    background: deviation > 3
                                        ? 'linear-gradient(to top, rgba(251, 146, 60, 0.6), rgba(251, 146, 60, 0.9))'
                                        : 'linear-gradient(to top, rgba(139, 92, 246, 0.6), rgba(139, 92, 246, 0.9))'
                                }}
                            >
                                {/* Moving average line point */}
                                {movingAvg[index] && (
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-accent border-2 border-brand-surface"
                                        style={{
                                            bottom: `${baseHeight + ((movingAvg[index] - 28) * 8) - heightPx}px`
                                        }}
                                    />
                                )}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                <div className="bg-brand-surface-2 border border-brand-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                                    <div className="text-xs font-semibold text-brand-text">{cycle.length} {t('days')}</div>
                                    <div className="text-xs text-brand-text-dim">
                                        {new Date(cycle.startDate).toLocaleDateString(intlLocale, { month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="text-[10px] text-brand-text-dim absolute -bottom-6">
                                {index % Math.ceil(validCycles.length / 6) === 0 ? validCycles.length - index : ''}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Average line legend */}
            <div className="flex items-center justify-between text-xs text-brand-text-dim mt-2 pt-2 border-t border-brand-border">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-purple-500/60 to-purple-500/90" />
                    <span>{t('chartDurationLabel')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-accent border-2 border-brand-surface" />
                    <span>{t('chartMovingAverageLabel')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-orange-500/60 to-orange-500/90" />
                    <span>{t('chartIrregularLabel')}</span>
                </div>
            </div>
        </div>
    );
};

// Symptom Heatmap Component
const SymptomHeatmap: React.FC<{ logs: DailyLog[]; cycles: Cycle[]; symptoms: Symptom[] }> = ({ logs, cycles, symptoms }) => {
    const topSymptoms = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            log.symptoms.forEach(symptomId => {
                counts[symptomId] = (counts[symptomId] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([id]) => symptoms.find(s => s.id === id))
            .filter(Boolean) as Symptom[];
    }, [logs, symptoms]);

    const heatmapData = useMemo(() => {
        const data: Record<string, Record<number, number>> = {};

        topSymptoms.forEach(symptom => {
            data[symptom.id] = { 0: 0, 1: 0, 2: 0, 3: 0 }; // phases: menstruation, follicular, ovulation, luteal
        });

        logs.forEach(log => {
            const logDate = parseISO(log.date);
            const cycle = cycles.find(c => {
                const start = parseISO(c.startDate);
                const end = c.endDate ? parseISO(c.endDate) : new Date();
                return logDate >= start && logDate <= end;
            });

            if (cycle) {
                const dayInCycle = differenceInDays(logDate, parseISO(cycle.startDate)) + 1;
                let phase = 0;

                if (dayInCycle <= 5) phase = 0; // menstruation
                else if (dayInCycle <= 13) phase = 1; // follicular
                else if (dayInCycle <= 17) phase = 2; // ovulation
                else phase = 3; // luteal

                log.symptoms.forEach(symptomId => {
                    if (data[symptomId]) {
                        data[symptomId][phase]++;
                    }
                });
            }
        });

        return data;
    }, [logs, cycles, topSymptoms]);

    const { t, translateSymptomId } = useTranslation();
    const phaseKeys = ['phaseMenstruation', 'phaseFollicular', 'phaseOvulation', 'phaseLuteal'] as const;
    const phaseShortKeys = ['phaseShortMenstruation', 'phaseShortFollicular', 'phaseShortOvulation', 'phaseShortLuteal'] as const;
    const phaseLabels = phaseKeys.map(key => t(key));
    const phaseShortLabels = phaseShortKeys.map(key => t(key));
    const phases = phaseLabels;
    const phaseColors = ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

    if (topSymptoms.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-brand-text-dim">
                {t('symptomHeatmapNoData')}
            </div>
        );
    }

    const maxCount = Math.max(...Object.values(heatmapData).flatMap(phases => Object.values(phases)));

    return (
        <div className="space-y-3">
            {topSymptoms.map(symptom => (
                <div key={symptom.id} className="space-y-1">
                    <div className="text-xs font-semibold text-brand-text truncate" style={{ fontWeight: 600 }}>
                        {translateSymptomId(symptom.id)}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        {phases.map((phase, phaseIndex) => {
                            const count = heatmapData[symptom.id][phaseIndex];
                            const intensity = maxCount > 0 ? count / maxCount : 0;

                            return (
                                <div
                                    key={phaseIndex}
                                    className="h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-150 hover:scale-105 cursor-pointer group relative"
                                    style={{
                                        backgroundColor: `${phaseColors[phaseIndex]}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
                                        border: `1px solid ${phaseColors[phaseIndex]}40`
                                    }}
                                >
                                    <span className="text-white drop-shadow-md">{count}</span>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                        <div className="bg-brand-surface-2 border border-brand-border rounded-lg px-2 py-1 shadow-xl whitespace-nowrap">
                                            <div className="text-xs text-brand-text">{phase}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                {phases.map((phase, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: phaseColors[index] }}
                        />
                    <span className="text-[10px] text-brand-text-dim">{phaseShortLabels[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Symptom Correlations Component
const SymptomCorrelations: React.FC<{ logs: DailyLog[]; cycles: Cycle[]; symptoms: Symptom[] }> = ({ logs, cycles, symptoms }) => {
    const correlations = useMemo(() => {
        const topSymptoms = (() => {
            const counts: Record<string, number> = {};
            logs.forEach(log => {
                log.symptoms.forEach(symptomId => {
                    counts[symptomId] = (counts[symptomId] || 0) + 1;
                });
            });
            return Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([id]) => id);
        })();

        const pairs: Array<{ symptom1: string; symptom2: string; correlation: number; count: number }> = [];

        for (let i = 0; i < topSymptoms.length; i++) {
            for (let j = i + 1; j < topSymptoms.length; j++) {
                const s1 = topSymptoms[i];
                const s2 = topSymptoms[j];

                let bothCount = 0;
                let s1OnlyCount = 0;
                let s2OnlyCount = 0;

                logs.forEach(log => {
                    const hasS1 = log.symptoms.includes(s1);
                    const hasS2 = log.symptoms.includes(s2);

                    if (hasS1 && hasS2) bothCount++;
                    else if (hasS1) s1OnlyCount++;
                    else if (hasS2) s2OnlyCount++;
                });

                const total = bothCount + s1OnlyCount + s2OnlyCount;
                const correlation = total > 0 ? (bothCount / total) * 100 : 0;

                if (bothCount > 0) {
                    pairs.push({
                        symptom1: s1,
                        symptom2: s2,
                        correlation: Math.round(correlation),
                        count: bothCount
                    });
                }
            }
        }

        return pairs.sort((a, b) => b.correlation - a.correlation).slice(0, 6);
    }, [logs]);

    const { t, translateSymptomId } = useTranslation();

    if (correlations.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-brand-text-dim">
                {t('correlationNoData')}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {correlations.map((corr, index) => {
                const symptom1 = symptoms.find(s => s.id === corr.symptom1);
                const symptom2 = symptoms.find(s => s.id === corr.symptom2);

                if (!symptom1 || !symptom2) return null;

                return (
                    <div key={index} className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                                <span className="text-xs font-semibold text-brand-text truncate" style={{ fontWeight: 600 }}>
                                    {translateSymptomId(symptom1.id)}
                                </span>
                            </div>
                            <svg className="w-4 h-4 text-brand-text-dim flex-shrink-0 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                                <span className="text-xs font-semibold text-brand-text truncate" style={{ fontWeight: 600 }}>
                                    {translateSymptomId(symptom2.id)}
                                </span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-2 bg-brand-surface rounded-full overflow-hidden mb-2">
                            <div
                                className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${corr.correlation}%`,
                                    background: corr.correlation > 60
                                        ? 'linear-gradient(to right, #8b5cf6, #a78bfa)'
                                        : corr.correlation > 30
                                            ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                                            : 'linear-gradient(to right, #6b7280, #9ca3af)'
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-text-dim">
                            {corr.count === 1
                                ? t('correlationMatchSingular', { count: corr.count })
                                : t('correlationMatchPlural', { count: corr.count })}
                        </span>
                            <span className="font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                                {corr.correlation}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const InsightsPage: React.FC = () => {
    const { cycles, logs, settings, toggleFavoriteSymptom } = useContext(AppContext);
    const { t, language, translateSymptomId } = useTranslation();
    const [timeRange, setTimeRange] = useState<3 | 6 | 12>(6);
    const [showPredictions, setShowPredictions] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // AI Mode State
    const [analysisMode, setAnalysisMode] = useState<'simple' | 'ai'>(() => {
        return (localStorage.getItem('analysisMode') as 'simple' | 'ai') || 'simple';
    });
    const [aiTimeMode, setAiTimeMode] = useState<'day' | 'week' | 'month' | 'current-cycle' | 'year'>('day');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isChatMode, setIsChatMode] = useState(false);
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const viewLabels = useMemo<Record<string, string>>(
        () => ({
            day: t('viewDay'),
            week: t('viewWeek'),
            month: t('viewMonth'),
            'current-cycle': t('viewCycle'),
            year: t('viewYear'),
        }),
        [t]
    );
    const analysisModeLabels = useMemo<Record<'simple' | 'ai', string>>(
        () => ({
            simple: t('analysisModeSimple'),
            ai: t('analysisModeAI'),
        }),
        [t]
    );
    const intlLocale = intlLocales[language] ?? 'es-ES';
    const dateLocale = language === 'tr' ? tr : language === 'en' ? enUS : es;

    // Current cycle info for mobile CTA
    const today = new Date();
    const activeCycle = cycles.find(c => {
        const start = parseISO(c.startDate);
        const end = c.endDate ? parseISO(c.endDate) : new Date();
        return today >= start && today <= end;
    });
    const currentCyclePhase = activeCycle ? getCyclePhase(activeCycle, today) : undefined;
    const currentCycleDay = activeCycle ? differenceInDays(today, parseISO(activeCycle.startDate)) + 1 : undefined;

    // Save mode preference
    useEffect(() => {
        localStorage.setItem('analysisMode', analysisMode);
    }, [analysisMode]);

    // Use AI Insights hook
    const {
        insights: aiInsights,
        isLoading: isGeneratingInsights,
        saveInsight: handleSaveInsight,
        pinInsight: handlePinInsight,
        discardInsight: handleDiscardInsight
    } = useAIInsights({
        logs,
        cycles,
        timeRange,
        enabled: analysisMode === 'ai' && !isChatMode
    });

    // Filter cycles by time range
    const filteredCycles = useMemo(() => {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - timeRange);
        return cycles.filter(c => {
            const cycleDate = parseISO(c.startDate);
            return cycleDate >= cutoffDate;
        });
    }, [cycles, timeRange]);

    // Calculate KPIs
    const kpis = useMemo(() => {
        const validCycles = filteredCycles.filter(c => c.length && c.length >= 21 && c.length <= 35);
        const lengths = validCycles.map(c => c.length!);

        if (lengths.length === 0) {
            return {
                avgCycleLength: 0,
                variability: 0,
                regularity: 0,
                avgPeriodDuration: 0,
                trends: { cycle: 0, variability: 0, regularity: 0, period: 0 }
            };
        }

        const avgCycleLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
        const variability = calculateStandardDeviation(lengths);
        const regularity = calculateRegularity(validCycles);

        // Calculate average period duration
        const periodDurations = logs
            .filter(log => log.periodIntensity && log.periodIntensity > 0)
            .reduce((acc, log) => {
                const date = log.date;
                if (!acc[date]) acc[date] = true;
                return acc;
            }, {} as Record<string, boolean>);

        const avgPeriodDuration = Object.keys(periodDurations).length > 0
            ? Math.round(Object.keys(periodDurations).length / validCycles.length)
            : 5;

        // Calculate trends (compare first half vs second half)
        const midpoint = Math.floor(lengths.length / 2);
        const firstHalf = lengths.slice(0, midpoint);
        const secondHalf = lengths.slice(midpoint);

        const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        return {
            avgCycleLength,
            variability: Math.round(variability * 10) / 10,
            regularity: Math.round(regularity),
            avgPeriodDuration,
            trends: {
                cycle: avgSecond - avgFirst,
                variability: 0,
                regularity: 0,
                period: 0
            }
        };
    }, [filteredCycles, logs]);

    // Symptom frequencies
    const symptomData = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            log.symptoms.forEach(symptomId => {
                counts[symptomId] = (counts[symptomId] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([id, count]) => ({
                id,
                name: settings.customSymptoms.find(s => s.id === id)?.name || t('unknownSymptom'),
                count,
            }))
            .sort((a, b) => b.count - a.count);
    }, [logs, settings.customSymptoms, t]);

    if (cycles.length < 2) {
        return (
            <div className="min-h-screen px-4 md:px-8 pt-12 pb-24 md:pb-12">
                <div className="max-w-[1200px] mx-auto">
                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-12 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] text-center">
                        <div className="p-4 rounded-xl bg-brand-primary/15 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                            {t('insightsEmptyTitle')}
                        </h1>
                        <p className="text-base text-brand-text-dim leading-relaxed" style={{ lineHeight: 1.6 }}>
                            {t('insightsEmptyDescriptionLine1')}<br />
                            {t('insightsEmptyDescriptionLine2')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const exportToCSV = () => {
        const csv = [
            [t('cycle'), t('date'), t('cycleDuration'), t('menstruation')].join(','),
            ...filteredCycles.map((c, i) => [
                filteredCycles.length - i,
                c.startDate,
                c.length || '',
                ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cycle-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Chat Handlers
    const handleStartChat = (insights: AIInsight[]) => {
        const rangeLabel = t('insightsRangeTitle', { months: timeRange });
        const initialMessage = formatInsightsForChat(
            insights,
            rangeLabel,
            { showPredictions }
        );

        // Create a session for insights-based chat
        const context = createChatContext();
        const viewType = aiTimeMode === 'day' ? 'daily' : aiTimeMode === 'week' ? 'weekly' : aiTimeMode === 'month' ? 'monthly' : 'general';
        const session = createChatSession(context, language, logs, cycles, viewType);

        setChatMessages([initialMessage]);
        setChatSession(session);
        setIsChatMode(true);
    };

    const handleStartChatWithContext = (context: ChatContext) => {
        const initialMessage = formatContextForChat(context);
        const viewType = context.type === 'day' ? 'daily' : context.type === 'week' ? 'weekly' : context.type === 'month' ? 'monthly' : 'general';
        const session = createChatSession(context, language, logs, cycles, viewType);
        setChatMessages([initialMessage]);
        setChatSession(session);
        setIsChatMode(true);
    };

    // Función helper para las etiquetas de vista
    const getViewLabel = (view: string): string => {
        return viewLabels[view] || view;
    };

    const createChatContext = (): ChatContext => {
        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        const longDateFormat =
            language === 'es'
                ? "EEEE, d 'de' MMMM"
                : language === 'tr'
                    ? 'd MMMM EEEE'
                    : 'EEEE, MMMM d';
        const shortMonthFormat = language === 'es' ? "d 'de' MMM" : 'd MMM';

        switch (aiTimeMode) {
            case 'day':
                return {
                    type: 'day',
                    title: format(today, longDateFormat, { locale: dateLocale }),
                    subtitle: t('insightsDaySubtitle'),
                    data: {
                        log: logs.find(l => l.date === todayStr),
                    }
                };

            case 'week':
                const weekAgo = subDays(today, 6);
                return {
                    type: 'week',
                    title: t('weeklySummaryWeekRange', {
                        start: format(weekAgo, shortMonthFormat, { locale: dateLocale }),
                        end: format(today, shortMonthFormat, { locale: dateLocale }),
                    }),
                    subtitle: t('insightsWeekSubtitle'),
                    data: {
                        logs: logs.filter(l => {
                            const logDate = parseISO(l.date);
                            return logDate >= weekAgo;
                        })
                    }
                };

            case 'month':
                const monthStart = startOfMonth(today);
                const monthEnd = endOfMonth(today);
                return {
                    type: 'month',
                    title: format(today, 'MMMM yyyy', { locale: dateLocale }),
                    subtitle: t('insightsMonthSubtitle'),
                    data: {
                        logs: logs.filter(l => {
                            const logDate = parseISO(l.date);
                            return logDate >= monthStart && logDate <= monthEnd;
                        }),
                        cycles: cycles.filter(c => {
                            const cycleDate = parseISO(c.startDate);
                            return cycleDate >= monthStart && cycleDate <= monthEnd;
                        })
                    }
                };

            case 'current-cycle':
                return {
                    type: 'cycle',
                    title: t('currentCycle'),
                    subtitle: t('insightsCurrentCycleSubtitle'),
                    data: {
                        cycles: [cycles[0]],
                        logs: logs.filter(l => {
                            if (!cycles[0]) return false;
                            const logDate = parseISO(l.date);
                            const cycleStart = parseISO(cycles[0].startDate);
                            return logDate >= cycleStart;
                        })
                    }
                };

            case 'year':
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - timeRange);
                return {
                    type: 'year',
                    title: t('insightsRangeTitle', { months: timeRange }),
                    subtitle: timeRange === 3 ? t('insightsQuarterlySubtitle') : timeRange === 6 ? t('insightsSemiAnnualSubtitle') : t('insightsAnnualSubtitle'),
                    data: {
                        logs: logs.filter(l => parseISO(l.date) >= monthsAgo),
                        cycles: cycles.filter(c => parseISO(c.startDate) >= monthsAgo)
                    }
                };

            default:
                return {
                    type: 'year',
                    title: t('insightsGeneralTitle'),
                    subtitle: t('insightsGeneralSubtitle')
                };
        }
    };

    const handleBackToInsights = () => {
        setIsChatMode(false);
        setChatMessages([]);
        setChatSession(null);
    };

    const handleSendChatMessage = async (message: string) => {
        if (!chatSession) return;

        // Add user message
        const userMsg = addUserMessage(message);
        setChatMessages(prev => [...prev, userMsg]);

        // Update session history
        chatSession.history.push(userMsg);

        // Set loading state
        setIsSendingMessage(true);

        try {
            // Get AI response
            const response = await sendChatMessage(chatSession, message);

            // Add assistant message
            const assistantMsg = addAssistantMessage(response);
            setChatMessages(prev => [...prev, assistantMsg]);

            // Update session history
            chatSession.history.push(assistantMsg);
        } catch (error) {
            console.error('Error sending chat message:', error);

            // Add error message
            const errorMsg = addAssistantMessage(
                'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
            );
            setChatMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsSendingMessage(false);
        }
    };

    return (
        <div className="min-h-screen px-4 md:px-8 pt-12 pb-24 md:pb-12">
            <div className="max-w-[1200px] mx-auto">
                {/* Header Universal - Siempre visible */}
                <div className="sticky top-0 z-40 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-[var(--bg)]/95 backdrop-blur-lg border-b border-[var(--border)] mb-6 transition-all duration-200">
                    <div className="max-w-[1200px] mx-auto">
                        {!isChatMode ? (
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                {/* Primera fila: Modo + Vista (responsive) */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center flex-wrap" style={{ gap: '6px' }} role="tablist">
                                        {/* Pills de modo: Simple | IA */}
                                        <div className="flex items-center" style={{ gap: '6px' }}>
                                            {(['simple', 'ai'] as const).map((modeOption) => (
                                                <button
                                                    key={modeOption}
                                                    onClick={() => setAnalysisMode(modeOption)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                                        analysisMode === modeOption
                                                            ? 'bg-[var(--brand)] text-white shadow-sm'
                                                            : 'bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                                                    }`}
                                                    style={{
                                                        fontWeight: 500,
                                                        padding: '6px 10px',
                                                        fontSize: '13px'
                                                    }}
                                                    role="tab"
                                                    aria-selected={analysisMode === modeOption}
                                                    aria-label={t('analysisModeLabel', {
                                                        mode: analysisModeLabels[modeOption],
                                                    })}
                                                >
                                                    {analysisModeLabels[modeOption]}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Separador - solo desktop */}
                                        <div className="hidden md:block w-px h-6 bg-[var(--border)]" />

                                        {/* Pills de vista: Día | Semana | Mes | Ciclo | Año */}
                                        <div className="flex items-center flex-wrap" style={{ gap: '6px' }}>
                                            {(['day', 'week', 'month', 'current-cycle', 'year'] as const).map((viewOption) => (
                                                <button
                                                    key={viewOption}
                                                    onClick={() => setAiTimeMode(viewOption)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${aiTimeMode === viewOption
                                                        ? 'bg-[var(--brand)] text-white shadow-sm'
                                                        : 'bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                                                        }`}
                                                    style={{
                                                        fontWeight: 500,
                                                        padding: '6px 10px',
                                                        fontSize: '13px'
                                                    }}
                                                    role="tab"
                                                    aria-selected={aiTimeMode === viewOption}
                                                    aria-label={t('viewModeLabel', {
                                                        view: getViewLabel(viewOption),
                                                    })}
                                                >
                                                    {getViewLabel(viewOption)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Botón exportar - Compacto en mobile */}
                                    <button
                                        onClick={exportToCSV}
                                        className="px-2 py-1.5 md:px-3 bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 shrink-0"
                                        style={{ fontWeight: 500 }}
                                        aria-label={t('exportData')}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="hidden sm:inline">{t('exportData')}</span>
                                    </button>
                                </div>

                                {/* Segunda fila: Rango (solo para año) */}
                                {aiTimeMode === 'year' && (
                                    <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)] md:border-t-0 md:pt-0">
                                        <span className="text-xs font-medium text-[var(--text-2)] shrink-0" style={{ fontWeight: 500 }}>
                                            Rango:
                                        </span>
                                        <div className="flex items-center" style={{ gap: '6px' }}>
                                            {([3, 6, 12] as const).map((rangeOption) => (
                                                <button
                                                    key={rangeOption}
                                                    onClick={() => setTimeRange(rangeOption)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${timeRange === rangeOption
                                                        ? 'bg-[var(--brand)] text-white shadow-sm'
                                                        : 'bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                                                        }`}
                                                    style={{
                                                        fontWeight: 500,
                                                        padding: '6px 10px',
                                                        fontSize: '13px'
                                                    }}
                                                    role="tab"
                                                    aria-selected={timeRange === rangeOption}
                                                    aria-label={`Rango ${rangeOption}M`}
                                                >
                                                    {rangeOption}M
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleBackToInsights}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)] hover:border-[var(--brand)] transition-all duration-150 flex items-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                                style={{ fontWeight: 500 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver a Insights
                            </button>
                        )}
                    </div>
                </div>

                {/* Chat Mode */}
                {isChatMode && (() => {
                    const today = new Date();
                    const activeCycle = cycles.find(c => {
                        const start = parseISO(c.startDate);
                        const end = c.endDate ? parseISO(c.endDate) : new Date();
                        return today >= start && today <= end;
                    });

                    return (
                        <div className="fixed inset-0 bg-[var(--bg)] z-50 overflow-hidden">
                            <AIChat
                                messages={chatMessages}
                                onSendMessage={handleSendChatMessage}
                                onBack={handleBackToInsights}
                                isLoading={isSendingMessage}
                                contextInfo={{
                                    timeRange: aiTimeMode === 'day' ? 'Hoy' : aiTimeMode === 'week' ? 'Esta semana' : aiTimeMode === 'month' ? 'Este mes' : undefined,
                                    cyclePhase: activeCycle ? getCyclePhase(activeCycle, today) : undefined,
                                    cycleDay: activeCycle ? differenceInDays(today, parseISO(activeCycle.startDate)) + 1 : undefined
                                }}
                            />
                        </div>
                    );
                })()}

                {/* AI Mode */}
                {!isChatMode && analysisMode === 'ai' && (
                    <>
                        {/* Time-specific views */}
                        {aiTimeMode === 'day' && (() => {
                            const today = new Date();
                            const todayLog = logs.find(l => l.date === format(today, 'yyyy-MM-dd'));
                            const activeCycle = cycles.find(c => {
                                const start = parseISO(c.startDate);
                                const end = c.endDate ? parseISO(c.endDate) : new Date();
                                return today >= start && today <= end;
                            });

                            return (
                                <DailyInsightView
                                    log={todayLog || null}
                                    onStartChat={() => handleStartChatWithContext(createChatContext())}
                                    cyclePhase={activeCycle ? getCyclePhase(activeCycle, today) : undefined}
                                    cycleDay={activeCycle ? differenceInDays(today, parseISO(activeCycle.startDate)) + 1 : undefined}
                                />
                            );
                        })()}

                        {aiTimeMode === 'week' && (
                            <WeeklyInsightView
                                logs={logs.filter(l => {
                                    const logDate = parseISO(l.date);
                                    const weekAgo = subDays(new Date(), 6);
                                    return logDate >= weekAgo;
                                })}
                                onStartChat={() => handleStartChatWithContext(createChatContext())}
                                mode={analysisMode}
                            />
                        )}

                        {aiTimeMode === 'month' && (
                            <MonthlyInsightView
                                logs={logs.filter(l => {
                                    const logDate = parseISO(l.date);
                                    const monthStart = startOfMonth(new Date());
                                    const monthEnd = endOfMonth(new Date());
                                    return logDate >= monthStart && logDate <= monthEnd;
                                })}
                                cycles={cycles}
                                onStartChat={() => handleStartChatWithContext(createChatContext())}
                                mode={analysisMode}
                            />
                        )}

                        {aiTimeMode === 'current-cycle' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-8 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] text-center">
                                    <div className="p-4 rounded-xl bg-brand-primary/15 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>
                                        Ciclo Actual
                                    </h2>
                                    <p className="text-sm text-brand-text-dim" style={{ lineHeight: 1.45 }}>
                                        Vista detallada del ciclo en curso - En desarrollo
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-brand-primary/10 via-brand-accent/10 to-brand-primary/10 border border-brand-primary/30 rounded-[18px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                                    <button
                                        onClick={() => handleStartChatWithContext(createChatContext())}
                                        className="w-full group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-full shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-105 active:scale-100 transition-all duration-200"
                                        style={{ fontWeight: 600 }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span>{t('startChat')}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Insights list for year */}
                        {aiTimeMode === 'year' && (
                            <>
                                <AIInsightsList
                                    insights={aiInsights}
                                    onSave={handleSaveInsight}
                                    onPin={handlePinInsight}
                                    onDiscard={handleDiscardInsight}
                                    onStartChat={(insights) => {
                                        // Use insights-based chat for long-term views
                                        handleStartChat(insights);
                                    }}
                                    isLoading={isGeneratingInsights}
                                />

                                {/* Chat CTA Unificado para vista anual */}
                                <UnifiedChatCTA
                                    onStartChat={() => handleStartChatWithContext(createChatContext())}
                                    contextTitle={t('insightsRangeTitle', { months: timeRange })}
                                    contextSubtitle={t('insightsAnnualSubtitle')}
                                    contextInfo={{
                                        date: t('insightsRangeTitle', { months: timeRange }),
                                        cyclePhase: undefined,
                                        cycleDay: undefined
                                    }}
                                    keyMetrics={{
                                        stress: undefined,
                                        sleep: undefined,
                                        mood: undefined,
                                        energy: undefined
                                    }}
                                    mode="ai"
                                />
                            </>
                        )}
                    </>
                )}

                {/* Simple Mode */}
                {!isChatMode && analysisMode === 'simple' && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                            {/* Average Cycle Length */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-brand-primary/15">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {kpis.trends.cycle !== 0 && (
                                        <span className={`text-xs font-semibold flex items-center gap-1 ${kpis.trends.cycle > 0 ? 'text-brand-warning' : 'text-brand-positive'
                                            }`}>
                                            {kpis.trends.cycle > 0 ? '▲' : '▼'} {Math.abs(Math.round(kpis.trends.cycle))}d
                                        </span>
                                    )}
                                </div>
                                <div className="text-3xl font-bold text-brand-text mb-1" style={{ fontWeight: 700 }}>
                                    {kpis.avgCycleLength}
                                </div>
                                <div className="text-sm text-brand-text-dim" style={{ fontWeight: 500 }}>
                                    {t('kpiCycleAverage')}
                                </div>
                            </div>

                            {/* Variability */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-brand-accent/15">
                                        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-brand-text mb-1" style={{ fontWeight: 700 }}>
                                    ±{kpis.variability}
                                </div>
                                <div className="text-sm text-brand-text-dim" style={{ fontWeight: 500 }}>
                                    {t('kpiVariability')}
                                </div>
                            </div>

                            {/* Regularity */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-brand-positive/15">
                                        <svg className="w-5 h-5 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-brand-text mb-1" style={{ fontWeight: 700 }}>
                                    {kpis.regularity}%
                                </div>
                                <div className="text-sm text-brand-text-dim" style={{ fontWeight: 500 }}>
                                    {t('kpiRegularity')}
                                </div>
                            </div>

                            {/* Average Period Duration */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-phase-menstruation/15">
                                        <svg className="w-5 h-5 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-brand-text mb-1" style={{ fontWeight: 700 }}>
                                    {kpis.avgPeriodDuration}
                                </div>
                                <div className="text-sm text-brand-text-dim" style={{ fontWeight: 500 }}>
                                    {t('kpiPeriodDuration')}
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Cycle Duration Chart */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-brand-primary/15">
                                            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                            {t('cycleDurationTitle')}
                                        </h2>
                                    </div>
                                </div>
                                <div className="bg-brand-surface/30 p-4 rounded-xl h-64">
                                    <CycleLengthChart cycles={filteredCycles} avgCycleLength={kpis.avgCycleLength} />
                                </div>
                            </div>

                            {/* Cycle History */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-xl bg-brand-accent/15">
                                        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {t('cycleHistoryTitle')}
                                    </h2>
                                </div>
                                <div className="space-y-2 h-64 overflow-y-auto pr-2">
                                    {filteredCycles.slice(0, 10).map((cycle, index) => (
                                        <div key={cycle.id} className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border hover:border-brand-primary/30 transition-all duration-150">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                                                        {t('cycleLabel', { number: filteredCycles.length - index })}
                                                    </div>
                                                    <div className="text-xs text-brand-text-dim">
                                                        {new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short', year: 'numeric' }).format(parseISO(cycle.startDate))}
                                                    </div>
                                                </div>
                                                {cycle.length && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full text-sm font-semibold">
                                                            {cycle.length}d
                                                        </span>
                                                        {(cycle.length < 24 || cycle.length > 32) && (
                                                            <span className="text-brand-warning text-xs">⚠</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Symptom Analysis */}
                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 rounded-xl bg-brand-positive/15">
                                    <svg className="w-5 h-5 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                    {t('symptomAnalysisTitle')}
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {symptomData.slice(0, 8).map((symptom, index) => (
                                    <div key={symptom.id} className="bg-brand-surface-2 p-4 rounded-xl border border-brand-border hover:border-brand-primary/30 transition-all duration-150 hover:scale-[1.02]">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-text">
                                                {index + 1}
                                            </div>
                                            <button
                                                onClick={() => toggleFavoriteSymptom(symptom.id)}
                                                className="p-1 rounded-lg hover:bg-brand-primary/10 transition-colors"
                                            >
                                                <svg className={`w-4 h-4 ${(settings.favoriteSymptomIds || []).includes(symptom.id) ? 'text-yellow-400' : 'text-brand-text-dim'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        </div>
                                            <div className="text-sm font-semibold text-brand-text mb-1 truncate" style={{ fontWeight: 600 }}>
                                                {translateSymptomId(symptom.id)}
                                            </div>
                                        <div className="text-xs text-brand-text-dim">
                                            {symptom.count} {symptom.count === 1 ? t('record') : t('records')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Heatmap */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-brand-warning/15">
                                        <svg className="w-5 h-5 text-brand-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {t('symptomHeatmapTitle')}
                                    </h2>
                                </div>
                                <SymptomHeatmap logs={logs} cycles={filteredCycles} symptoms={settings.customSymptoms} />
                            </div>

                            {/* Correlations */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-brand-primary/15">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {t('correlationsTitle')}
                                    </h2>
                                </div>
                                <SymptomCorrelations logs={logs} cycles={filteredCycles} symptoms={settings.customSymptoms} />
                            </div>
                        </div>
                    </>
                )}
            </div>


        </div>
    );
};
