import React from 'react';
import type { Locale } from 'date-fns';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr } from 'date-fns/locale/tr';
import { UnifiedChatCTA } from './UnifiedChatCTA.tsx';
import type { DailyLog, Cycle, Language } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

interface MonthlyInsightViewProps {
  logs: DailyLog[];
  cycles: Cycle[];
  onStartChat?: () => void;
  mode?: 'simple' | 'ai';
}

export const MonthlyInsightView: React.FC<MonthlyInsightViewProps> = ({ logs, cycles, onStartChat, mode = 'simple' }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = monthEnd.getDate();
  const { t, translateEnergyLevel, translateSymptomId, language } = useTranslation();
  const dateLocale = language === 'tr' ? tr : language === 'en' ? enUS : es;
  const dateLabelPattern = language === 'es' ? "d 'de' MMM" : 'd MMM';
  const monthLabel = format(today, 'LLLL yyyy', { locale: dateLocale });
  const startLabel = format(monthStart, dateLabelPattern, { locale: dateLocale });
  const endLabel = format(monthEnd, dateLabelPattern, { locale: dateLocale });
  const stats = calculateMonthlyStats(logs, cycles, language, dateLocale);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div
        className="border border-[#2a2a2a] rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white capitalize" style={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {monthLabel}
          </h1>
          <div className="px-3 py-1.5 bg-brand-primary/20 rounded-full">
            <span className="text-sm font-semibold text-brand-primary tabular-nums" style={{ fontWeight: 600 }}>
              {t('weeklySummaryDays', { count: daysInMonth })}
            </span>
          </div>
        </div>
        <div className="h-px bg-[var(--border)] mb-4" />
        <p className="text-sm text-[var(--text-2)]" style={{ fontWeight: 500, lineHeight: 1.5 }}>
          {t('insightsMonthSubtitle')} • {t('weeklySummaryRecords', { start: startLabel, end: endLabel, logs: stats.totalLogs })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="border border-[#2a2a2a] rounded-[18px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-200 relative flex flex-col"
          style={{
            height: '108px',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[20px] leading-none text-brand-primary">📅</span>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>{t('loggedDaysLabel')}</p>
          </div>
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="var(--surface-2)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="var(--brand)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - stats.totalLogs / daysInMonth)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-brand-primary tabular-nums" style={{ fontWeight: 700, fontSize: '14px' }}>
                  {Math.round((stats.totalLogs / daysInMonth) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tabular-nums" style={{ fontWeight: 700, lineHeight: 1 }}>
                {stats.totalLogs}
              </span>
              <span className="text-xs text-[var(--text-2)] mt-0.5" style={{ fontSize: '11px' }}>
                / {daysInMonth}
              </span>
            </div>
          </div>
        </div>

        <KPICard
          icon={<span className="text-[20px] leading-none text-brand-accent">😴</span>}
          label={t('metricSleep')}
          value={stats.avgSleep > 0 ? `${stats.avgSleep.toFixed(1)}h` : '0h'}
          sparklineData={stats.sleepSparkline || []}
          status={stats.avgSleep >= 7 ? 'good' : stats.avgSleep > 0 ? 'warning' : undefined}
        />

        <KPICard
          icon={<span className="text-[20px] leading-none text-brand-primary">🏃</span>}
          label={t('activityDaysLabel')}
          value={`${stats.activeDays}`}
          sparklineData={stats.activitySparkline || []}
        />

        <KPICard
          icon={<span className="text-[20px] leading-none text-brand-accent">💧</span>}
          label={t('metricHydration')}
          value={stats.avgWater > 0 ? `${stats.avgWater.toFixed(1)}L` : '0L'}
          sparklineData={stats.waterSparkline || []}
          status={stats.avgWater >= 2 ? 'good' : stats.avgWater > 0 ? 'warning' : undefined}
        />
      </div>

      {stats.cyclesThisMonth.length > 0 && (
        <div
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🌀</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('cyclesThisMonthTitle')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.cyclesThisMonth.map((cycle, index) => (
              <div key={cycle.id ?? `${cycle.startDate}-${index}`} className="bg-[var(--surface-2)] rounded-lg p-3 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white" style={{ fontWeight: 600 }}>
                    {t('cycleLabel', { number: index + 1 })}
                  </span>
                  {cycle.length && (
                    <span className="text-xs px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded">
                      {t('weeklySummaryDays', { count: cycle.length })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-2)]">
                  {t('startLabel')}: {format(parseISO(cycle.startDate), dateLabelPattern, { locale: dateLocale })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div
          className="col-span-12 md:col-span-6 border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-5" style={{ fontWeight: 600 }}>
            {t('metricPain')} & {t('metricStress')}
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">{t('metricPain')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white tabular-nums" style={{ fontWeight: 600 }}>
                    {stats.avgPain.toFixed(1)}/10
                  </span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                    {t('weeklySummaryDays', { count: stats.painDays })}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '8px' }}>
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
                  style={{ width: `${(stats.avgPain / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">{t('metricStress')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white tabular-nums" style={{ fontWeight: 600 }}>
                    {stats.avgStress.toFixed(1)}/10
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                    {t('highStressDaysLabel')}: {stats.highStressDays}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '8px' }}>
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${(stats.avgStress / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-span-12 md:col-span-6 border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-5" style={{ fontWeight: 600 }}>
            {t('metricMood')} & {t('metricEnergy')}
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">{t('avgMoodLabel')}</span>
                <span className="text-sm font-semibold text-white tabular-nums" style={{ fontWeight: 600 }}>
                  {stats.avgMood.toFixed(1)}/5
                </span>
              </div>
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '8px' }}>
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
                  style={{ width: `${(stats.avgMood / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[var(--text-2)]">{t('energyDistributionTitle')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="px-3 py-2 bg-red-500/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-400 tabular-nums" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.low}
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-0.5">{translateEnergyLevel('low')}</div>
                </div>
                <div className="px-3 py-2 bg-amber-500/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-amber-400 tabular-nums" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.medium}
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-0.5">{translateEnergyLevel('medium')}</div>
                </div>
                <div className="px-3 py-2 bg-green-500/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-400 tabular-nums" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.high}
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-0.5">{translateEnergyLevel('high')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.topSymptoms.length > 0 && (
        <div
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🩺</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('commonSymptomsTitle')}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.topSymptoms.slice(0, 6).map((symptom, index) => (
              <div key={index} className="bg-[var(--surface-2)] rounded-lg p-3 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white truncate" style={{ fontWeight: 600 }}>
                    {translateSymptomId(symptom.name)}
                  </span>
                  <span className="text-xs text-brand-primary font-semibold tabular-nums">
                    {symptom.count}
                  </span>
                </div>
                <div className="w-full bg-[var(--surface)] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-brand-primary transition-all duration-300"
                    style={{ width: `${stats.totalLogs ? (symptom.count / stats.totalLogs) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="border border-[#2a2a2a] rounded-[18px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="text-base font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('monthlyInsightsTitle')}
            </h3>
          </div>
          <div className="px-2.5 py-1 bg-brand-primary/20 rounded-full">
            <span className="text-xs font-medium text-brand-primary" style={{ fontWeight: 500 }}>
              {t('highConfidenceLabel')}
            </span>
          </div>
        </div>

        {generateMonthlyInsights(stats, t, translateSymptomId, daysInMonth).length > 0 ? (
          <div className="space-y-3">
            {generateMonthlyInsights(stats, t, translateSymptomId, daysInMonth).map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-brand-primary mt-1 text-sm font-bold">•</span>
                <p className="text-sm text-white leading-relaxed flex-1" style={{ lineHeight: 1.6 }}>
                  {insight}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="w-12 h-12 text-[var(--text-2)] opacity-40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm font-medium text-white mb-1" style={{ fontWeight: 500 }}>
              {t('notEnoughData')}
            </p>
            <p className="text-xs text-[var(--text-2)]">
              {t('insightsEmptyDescriptionLine2')}
            </p>
          </div>
        )}
      </div>

      <UnifiedChatCTA
        onStartChat={onStartChat}
        contextTitle={monthLabel}
        contextSubtitle={t('insightsMonthSubtitle')}
        contextInfo={{
          date: monthLabel,
          cyclePhase: undefined,
          cycleDay: undefined
        }}
        keyMetrics={{
          stress: stats.avgStress,
          sleep: stats.avgSleep,
          mood: stats.avgMood,
          energy: stats.energyDistribution.high
        }}
        mode={mode}
      />
    </div>
  );
};

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sparklineData: number[];
  status?: 'good' | 'warning' | 'bad';
}

const KPICard: React.FC<KPICardProps> = ({ icon, label, value, sparklineData, status }) => {
  const getStatusColor = () => {
    if (status === 'good') return 'text-green-400';
    if (status === 'warning') return 'text-amber-400';
    if (status === 'bad') return 'text-red-400';
    return 'text-white';
  };

  return (
    <div
      className="border border-[#2a2a2a] rounded-[18px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-200 relative"
      style={{
        height: '108px',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
      }}
    >
      <div className="absolute top-3 right-3">
        <MiniSparkline data={sparklineData} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>{label}</p>
      </div>

      <div className="flex items-baseline" style={{ marginTop: '12px' }}>
        <p className={`text-3xl font-bold tabular-nums ${getStatusColor()}`} style={{ fontWeight: 700, fontSize: '30px', lineHeight: 1 }}>
          {value}
        </p>
      </div>
    </div>
  );
};

interface MiniSparklineProps {
  data: number[];
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <svg width="40" height="16" className="opacity-20">
        <line x1="0" y1="8" x2="40" y2="8" stroke="var(--text-2)" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 40;
    const y = 16 - ((value - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="40" height="16" className="opacity-60">
      <polyline
        fill="none"
        stroke="var(--brand)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

function calculateMonthlyStats(logs: DailyLog[], cycles: Cycle[], language: Language, dateLocale: Locale) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = monthEnd.getDate();
  const dateLabelPattern = language === 'es' ? "d 'de' MMM" : 'd MMM';

  const monthLogs = logs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= monthStart && logDate <= monthEnd;
  });

  const cyclesThisMonth = cycles.filter(c => {
    const cycleStart = parseISO(c.startDate);
    return cycleStart >= monthStart && cycleStart <= monthEnd;
  });

  const sleepLogs = monthLogs.filter(l => l.sleepHours !== undefined);
  const painLogs = monthLogs.filter(l => l.painLevel !== undefined && l.painLevel > 0);
  const stressLogs = monthLogs.filter(l => l.stressScore !== undefined);
  const moodLogs = monthLogs.filter(l => l.mood !== undefined);
  const waterLogs = monthLogs.filter(l => l.waterIntake !== undefined);
  const activeDays = monthLogs.filter(l => l.physicalActivity && l.physicalActivity !== 'none').length;

  const energyDistribution = {
    low: monthLogs.filter(l => l.energyLevel === 'low').length,
    medium: monthLogs.filter(l => l.energyLevel === 'medium').length,
    high: monthLogs.filter(l => l.energyLevel === 'high').length
  };

  const symptomCounts: Record<string, number> = {};
  monthLogs.forEach(log => {
    log.symptoms?.forEach(symptomId => {
      symptomCounts[symptomId] = (symptomCounts[symptomId] || 0) + 1;
    });
  });

  const topSymptoms = Object.entries(symptomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sleepSparkline: number[] = [];
  const waterSparkline: number[] = [];
  const activitySparkline: number[] = [];

  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = monthLogs.find(l => l.date === dateStr);

    sleepSparkline.push(log?.sleepHours || 0);
    waterSparkline.push(log?.waterIntake || 0);
    activitySparkline.push(log?.physicalActivity && log.physicalActivity !== 'none' ? 1 : 0);
  }

  return {
    totalLogs: monthLogs.length,
    cyclesThisMonth,
    avgSleep: sleepLogs.length > 0
      ? sleepLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / sleepLogs.length
      : 0,
    avgPain: painLogs.length > 0
      ? painLogs.reduce((sum, l) => sum + (l.painLevel || 0), 0) / painLogs.length
      : 0,
    painDays: painLogs.length,
    avgStress: stressLogs.length > 0
      ? stressLogs.reduce((sum, l) => sum + (l.stressScore || 0), 0) / stressLogs.length
      : 0,
    highStressDays: stressLogs.filter(l => (l.stressScore || 0) >= 7).length,
    avgMood: moodLogs.length > 0
      ? moodLogs.reduce((sum, l) => sum + (l.mood || 0), 0) / moodLogs.length
      : 0,
    avgWater: waterLogs.length > 0
      ? waterLogs.reduce((sum, l) => sum + (l.waterIntake || 0), 0) / waterLogs.length
      : 0,
    activeDays,
    energyDistribution,
    topSymptoms,
    sleepSparkline,
    waterSparkline,
    activitySparkline,
    dateLabelPattern,
    dateLocale
  };
}

function generateMonthlyInsights(
  stats: ReturnType<typeof calculateMonthlyStats>,
  t: (key: keyof import('../services/i18n.ts').Translations, reps?: Record<string, string | number>) => string,
  translateSymptomId: (id: string) => string,
  daysInMonth: number
): string[] {
  const insights: string[] = [];
  const activityPercentage = daysInMonth ? Math.round((stats.activeDays / daysInMonth) * 100) : 0;

  insights.push(t('monthlyInsightConsistency', { days: stats.totalLogs, total: daysInMonth }));

  if (stats.cyclesThisMonth.length > 0) {
    insights.push(t('monthlyInsightCycles', { count: stats.cyclesThisMonth.length }));
  }

  if (stats.avgSleep > 0) {
    if (stats.avgSleep < 6) {
      insights.push(t('monthlyInsightSleepLow', { hours: stats.avgSleep.toFixed(1) }));
    } else if (stats.avgSleep >= 7 && stats.avgSleep <= 9) {
      insights.push(t('monthlyInsightSleepGood', { hours: stats.avgSleep.toFixed(1) }));
    }
  }

  if (stats.painDays > 0) {
    insights.push(t('monthlyInsightPain', { days: stats.painDays, pain: stats.avgPain.toFixed(1) }));
  }

  if (stats.highStressDays > 0) {
    insights.push(t('monthlyInsightStress', { days: stats.highStressDays, stress: stats.avgStress.toFixed(1) }));
  }

  if (activityPercentage >= 70) {
    insights.push(t('monthlyInsightActivityHigh', { active: stats.activeDays, percent: activityPercentage }));
  } else if (activityPercentage > 0 && activityPercentage < 30) {
    insights.push(t('monthlyInsightActivityLow', { active: stats.activeDays, percent: activityPercentage }));
  }

  if (stats.energyDistribution.low > stats.energyDistribution.high) {
    insights.push(t('monthlyInsightEnergyLow'));
  }

  if (stats.avgWater > 0) {
    insights.push(t('monthlyInsightHydration', { liters: stats.avgWater.toFixed(1) }));
  }

  if (stats.topSymptoms.length > 0) {
    const topSymptom = stats.topSymptoms[0];
    insights.push(t('monthlyInsightTopSymptom', { symptom: translateSymptomId(topSymptom.name), count: topSymptom.count }));
  }

  return insights;
}
