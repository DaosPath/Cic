import React from 'react';
import type { Locale } from 'date-fns';
import { format, subDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr } from 'date-fns/locale/tr';
import { UnifiedChatCTA } from './UnifiedChatCTA.tsx';
import type { DailyLog, Language } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

interface WeeklyInsightViewProps {
  logs: DailyLog[];
  onStartChat?: () => void;
  mode?: 'simple' | 'ai';
}

export const WeeklyInsightView: React.FC<WeeklyInsightViewProps> = ({ logs, onStartChat, mode = 'simple' }) => {
  const today = new Date();
  const weekStart = subDays(today, 6);
  const { t, translateEnergyLevel, translateSymptomId, language } = useTranslation();
  const dateLocale = language === 'tr' ? tr : language === 'en' ? enUS : es;
  const dateLabelPattern = language === 'es' ? "d 'de' MMM" : 'd MMM';
  const startLabel = format(weekStart, dateLabelPattern, { locale: dateLocale });
  const endLabel = format(today, dateLabelPattern, { locale: dateLocale });
  const weekLabel = t('weeklySummaryWeekRange', { start: startLabel, end: endLabel });
  const stats = calculateWeeklyStats(logs, language, dateLocale);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-300">
      <div
        className="border border-[#2a2a2a] rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white" style={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {t('weeklySummaryTitle')}
          </h1>
          <div className="px-3 py-1.5 bg-brand-primary/20 rounded-full">
            <span className="text-sm font-semibold text-brand-primary tabular-nums" style={{ fontWeight: 600 }}>
              {t('weeklySummaryDays', { count: 7 })}
            </span>
          </div>
        </div>
        <div className="h-px bg-[var(--border)] mb-4" />
        <p className="text-sm text-[var(--text-2)]" style={{ fontWeight: 500, lineHeight: 1.5 }}>
          {t('weeklySummaryRecords', { start: startLabel, end: endLabel, logs: stats.totalLogs })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          icon="😴"
          label={t('metricSleep')}
          value={`${stats.avgSleep.toFixed(1)}h`}
          type="habit"
          sparklineData={stats.sleepSparkline}
        />
        <MetricCard
          icon="💊"
          label={t('metricPain')}
          value={`${stats.avgPain.toFixed(1)}/10`}
          type="state"
          sparklineData={stats.painSparkline}
        />
        <MetricCard
          icon="🍃"
          label={t('metricStress')}
          value={`${stats.avgStress.toFixed(1)}/10`}
          type="state"
          sparklineData={stats.stressSparkline}
        />
        <MetricCard
          icon="💧"
          label={t('metricHydration')}
          value={`${stats.avgWater.toFixed(1)}L`}
          type="habit"
          sparklineData={stats.waterSparkline}
        />
        <MetricCard
          icon="😊"
          label={t('metricMood')}
          value={`${stats.avgMood.toFixed(1)}/5`}
          type="state"
          sparklineData={stats.moodSparkline}
        />
        <MetricCard
          icon="⚡"
          label={t('metricEnergy')}
          value={`${stats.highEnergyDays}/7`}
          type="habit"
          sparklineData={stats.energySparkline}
        />
      </div>

      <div
        className="border border-[#2a2a2a] rounded-[18px] shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="p-5 border-b border-[#2a2a2a]">
          <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
            {t('dailyBreakdownTitle')}
          </h3>
        </div>
        <div className="divide-y divide-[#2a2a2a]">
          {stats.dailyBreakdown.map((day, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface-2)] transition-colors duration-150"
            >
              <div className="flex-shrink-0 w-20">
                <p className="text-xs font-semibold text-white" style={{ fontWeight: 600 }}>
                  {day.dayName}
                </p>
                <p className="text-xs text-[var(--text-2)]">{day.date}</p>
              </div>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                {day.hasData ? (
                  <>
                    {day.mood !== undefined && (
                      <span className="text-sm" title={`${t('metricMood')}: ${day.mood}/5`}>
                        {getMoodEmoji(day.mood)}
                      </span>
                    )}
                    {day.energy && (
                      <span className="text-sm" title={`${t('metricEnergy')}: ${translateEnergyLevel(day.energy)}`}>
                        {getEnergyEmoji(day.energy)}
                      </span>
                    )}
                    {day.pain !== undefined && day.pain > 0 && (
                      <span className="text-xs px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-md font-medium">
                        {t('metricPain')} {day.pain}
                      </span>
                    )}
                    {day.sleep !== undefined && (
                      <span className="text-xs px-2 py-1 bg-brand-accent/20 text-brand-accent rounded-md font-medium">
                        {day.sleep}h
                      </span>
                    )}
                    {day.activity && day.activity !== 'none' && (
                      <span className="text-sm" title={t('physicalActivityTitle')}>🏃</span>
                    )}
                  </>
                ) : (
                  <span className="text-xs px-2 py-1 bg-[var(--surface-2)] text-[var(--text-2)] rounded-md font-medium">
                    {t('weeklyNoRecord')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏃</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('physicalActivityTitle')}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-2xl font-bold text-white tabular-nums" style={{ fontWeight: 700 }}>
                  {stats.activityDays}/7
                </p>
                <p className="text-xs text-[var(--text-2)]">{t('activityDaysLabel')}</p>
              </div>
              <div className="flex-1">
                <div className="relative w-full bg-[var(--surface-2)] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stats.activityDays >= 5
                        ? 'bg-green-500/20 border-r-2 border-green-500'
                        : stats.activityDays >= 3
                        ? 'bg-amber-500/20 border-r-2 border-amber-500'
                        : 'bg-red-500/20 border-r-2 border-red-500'
                    }`}
                    style={{ width: `${(stats.activityDays / 7) * 100}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[var(--text-2)]/40"
                    style={{ left: `${(5 / 7) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-2)] mt-1">{t('activityGoalLabel')}: 5/7</p>
              </div>
            </div>
            {stats.totalActivityMinutes > 0 && (
              <div className="pt-2 border-t border-[#2a2a2a]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">{t('totalMinutesLabel')}</span>
                  <span className="text-sm font-medium text-white tabular-nums">{stats.totalActivityMinutes} min</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🛌</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('sleepQualityTitle')}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-2)]">{t('sleepAvgHours')}</span>
              <span className="text-sm font-medium text-white tabular-nums">{stats.avgSleep.toFixed(1)}h</span>
            </div>
            {stats.avgSleepQuality > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-2)]">{t('sleepAvgQuality')}</span>
                <span className="text-sm font-medium text-white tabular-nums">{stats.avgSleepQuality.toFixed(1)}/5</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-2)]">{t('sleepGoodDays')}</span>
              <span className="text-sm font-medium text-white tabular-nums">{stats.goodSleepDays}/7</span>
            </div>
          </div>
        </div>

        <div
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🧠</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('mentalWellnessTitle')}
            </h3>
          </div>
          <div className="space-y-3">
            {stats.avgMood > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-2)]">{t('avgMoodLabel')}</span>
                <span className="text-sm font-medium text-white tabular-nums">{stats.avgMood.toFixed(1)}/5</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-2)]">{t('highStressDaysLabel')}</span>
              <span className="text-sm font-medium text-white tabular-nums">{stats.highStressDays}/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-2)]">{t('highEnergyDaysLabel')}</span>
              <span className="text-sm font-medium text-white tabular-nums">{stats.highEnergyDays}/7</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.topSymptoms.map((symptom, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--surface-2)] rounded-lg">
                <span className="text-sm text-white">{translateSymptomId(symptom.name)}</span>
                <span className="text-xs px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-full font-medium tabular-nums">
                  {symptom.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(stats.avgCaffeine > 0 || stats.avgAlcohol > 0 || stats.topCravings.length > 0) && (
        <div
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🥤</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('consumptionTrendsTitle')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.avgCaffeine > 0 && (
              <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
                <p className="text-2xl font-bold text-white tabular-nums" style={{ fontWeight: 700 }}>
                  {stats.avgCaffeine.toFixed(1)}
                </p>
                <p className="text-xs text-[var(--text-2)]">{t('caffeineLabel')}</p>
              </div>
            )}
            {stats.avgAlcohol > 0 && (
              <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
                <p className="text-2xl font-bold text-white tabular-nums" style={{ fontWeight: 700 }}>
                  {stats.avgAlcohol.toFixed(1)}
                </p>
                <p className="text-xs text-[var(--text-2)]">{t('alcoholLabel')}</p>
              </div>
            )}
            {stats.topCravings.length > 0 && (
              <div className="p-3 bg-[var(--surface-2)] rounded-lg">
                <p className="text-xs text-[var(--text-2)] mb-2">{t('frequentCravings')}</p>
                <div className="flex flex-wrap gap-1">
                  {stats.topCravings.slice(0, 3).map((craving, index) => (
                    <span key={index} className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent rounded text-xs">
                      {craving}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              {t('weeklyPatternsTitle')}
            </h3>
          </div>
          <div className="px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-md">
            <span className="text-xs font-medium">{t('highConfidenceLabel')}</span>
          </div>
        </div>
        <div className="space-y-3">
          {generateWeeklyInsights(stats, t, translateSymptomId).map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-brand-primary mt-1 text-sm font-bold">•</span>
              <p className="text-sm text-white leading-relaxed flex-1" style={{ lineHeight: 1.6 }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      <UnifiedChatCTA
        onStartChat={onStartChat}
        contextTitle={weekLabel}
        contextSubtitle={t('weeklyChatSubtitle')}
        contextInfo={{
          date: weekLabel,
          cyclePhase: undefined,
          cycleDay: undefined
        }}
        keyMetrics={{
          stress: stats.avgStress,
          sleep: stats.avgSleep,
          mood: stats.avgMood,
          energy: stats.highEnergyDays
        }}
        mode={mode}
      />
    </div>
  );
};

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  type: 'habit' | 'state';
  sparklineData: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, type, sparklineData }) => {
  const isHabit = type === 'habit';
  const colorClass = isHabit ? 'text-brand-accent' : 'text-brand-primary';

  return (
    <div
      className="relative border border-[#2a2a2a] rounded-[18px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-200"
      style={{
        height: '100px',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
      }}
    >
      <div className="absolute top-3 right-3">
        <MiniSparkline data={sparklineData} color={isHabit ? 'accent' : 'primary'} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[20px] leading-none">{icon}</span>
        <p className="text-xs text-[var(--text-2)] font-medium">{label}</p>
      </div>

      <p className={`text-[28px] font-bold ${colorClass} leading-none tabular-nums`} style={{ fontWeight: 700 }}>
        {value}
      </p>
    </div>
  );
};

interface MiniSparklineProps {
  data: number[];
  color: 'accent' | 'primary';
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({ data, color }) => {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 24;
      const y = 12 - ((value - min) / range) * 12;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = color === 'accent' ? 'var(--accent)' : 'var(--brand)';

  return (
    <svg width="24" height="12" className="opacity-60">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

function calculateWeeklyStats(logs: DailyLog[], language: Language, dateLocale: Locale) {
  const today = new Date();
  const weekAgo = subDays(today, 6);
  const dateLabelPattern = language === 'es' ? "d 'de' MMM" : 'd MMM';

  const weekLogs = logs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= weekAgo && logDate <= today;
  });

  const dailyBreakdown: {
    dayName: string;
    date: string;
    hasData: boolean;
    mood?: number;
    energy?: DailyLog['energyLevel'];
    pain?: number;
    sleep?: number;
    activity?: DailyLog['physicalActivity'];
  }[] = [];

  const sleepSparkline: number[] = [];
  const painSparkline: number[] = [];
  const stressSparkline: number[] = [];
  const waterSparkline: number[] = [];
  const moodSparkline: number[] = [];
  const energySparkline: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = weekLogs.find(l => l.date === dateStr);

    dailyBreakdown.push({
      dayName: format(date, 'EEE', { locale: dateLocale }),
      date: format(date, dateLabelPattern, { locale: dateLocale }),
      hasData: !!log,
      mood: log?.mood,
      energy: log?.energyLevel,
      pain: log?.painLevel,
      sleep: log?.sleepHours,
      activity: log?.physicalActivity
    });

    sleepSparkline.push(log?.sleepHours || 0);
    painSparkline.push(log?.painLevel || 0);
    stressSparkline.push(log?.stressScore || 0);
    waterSparkline.push(log?.waterIntake || 0);
    moodSparkline.push(log?.mood || 0);
    energySparkline.push(
      log?.energyLevel === 'high' ? 3 : log?.energyLevel === 'medium' ? 2 : log?.energyLevel === 'low' ? 1 : 0
    );
  }

  const sleepLogs = weekLogs.filter(l => l.sleepHours !== undefined);
  const painLogs = weekLogs.filter(l => l.painLevel !== undefined);
  const stressLogs = weekLogs.filter(l => l.stressScore !== undefined);
  const waterLogs = weekLogs.filter(l => l.waterIntake !== undefined);
  const moodLogs = weekLogs.filter(l => l.mood !== undefined);
  const sleepQualityLogs = weekLogs.filter(l => l.sleepQuality !== undefined);
  const caffeineLogs = weekLogs.filter(l => l.caffeineIntake !== undefined && l.caffeineIntake > 0);
  const alcoholLogs = weekLogs.filter(l => l.alcoholIntake !== undefined && l.alcoholIntake > 0);

  const activityDays = weekLogs.filter(l => l.physicalActivity && l.physicalActivity !== 'none').length;
  const highStressDays = weekLogs.filter(l => l.stressScore && l.stressScore >= 7).length;
  const highEnergyDays = weekLogs.filter(l => l.energyLevel === 'high').length;
  const goodSleepDays = weekLogs.filter(l => l.sleepHours && l.sleepHours >= 7 && l.sleepHours <= 9).length;

  const totalActivityMinutes = weekLogs.reduce((sum, l) => sum + (l.activityDuration || 0), 0);

  const symptomCounts: { [key: string]: number } = {};
  weekLogs.forEach(log => {
    if (log.symptoms) {
      log.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    }
  });
  const topSymptoms = Object.entries(symptomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const cravingCounts: { [key: string]: number } = {};
  weekLogs.forEach(log => {
    if (log.cravings) {
      log.cravings.forEach(craving => {
        cravingCounts[craving] = (cravingCounts[craving] || 0) + 1;
      });
    }
  });
  const topCravings = Object.entries(cravingCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => item.name);

  return {
    avgSleep: sleepLogs.length > 0 ? sleepLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / sleepLogs.length : 0,
    avgPain: painLogs.length > 0 ? painLogs.reduce((sum, l) => sum + (l.painLevel || 0), 0) / painLogs.length : 0,
    avgStress: stressLogs.length > 0 ? stressLogs.reduce((sum, l) => sum + (l.stressScore || 0), 0) / stressLogs.length : 0,
    avgWater: waterLogs.length > 0 ? waterLogs.reduce((sum, l) => sum + (l.waterIntake || 0), 0) / waterLogs.length : 0,
    avgMood: moodLogs.length > 0 ? moodLogs.reduce((sum, l) => sum + (l.mood || 0), 0) / moodLogs.length : 0,
    avgSleepQuality:
      sleepQualityLogs.length > 0
        ? sleepQualityLogs.reduce((sum, l) => sum + (l.sleepQuality || 0), 0) / sleepQualityLogs.length
        : 0,
    avgCaffeine:
      caffeineLogs.length > 0
        ? caffeineLogs.reduce((sum, l) => sum + (l.caffeineIntake || 0), 0) / caffeineLogs.length
        : 0,
    avgAlcohol:
      alcoholLogs.length > 0 ? alcoholLogs.reduce((sum, l) => sum + (l.alcoholIntake || 0), 0) / alcoholLogs.length : 0,

    activityDays,
    highStressDays,
    highEnergyDays,
    goodSleepDays,
    totalActivityMinutes,

    dailyBreakdown,
    topSymptoms,
    topCravings,
    totalLogs: weekLogs.length,

    sleepSparkline,
    painSparkline,
    stressSparkline,
    waterSparkline,
    moodSparkline,
    energySparkline
  };
}

function generateWeeklyInsights(
  stats: ReturnType<typeof calculateWeeklyStats>,
  t: (key: keyof import('../services/i18n.ts').Translations, reps?: Record<string, string | number>) => string,
  translateSymptomId: (id: string) => string
): string[] {
  const insights: string[] = [
    t('weeklyInsightConsistency', { logs: stats.totalLogs }),
    t('weeklyInsightSleep', { hours: stats.avgSleep.toFixed(1) }),
    t('weeklyInsightMood', { mood: stats.avgMood.toFixed(1) }),
    t('weeklyInsightActivity', { days: stats.activityDays, minutes: stats.totalActivityMinutes }),
    t('weeklyInsightPain', { pain: stats.avgPain.toFixed(1) }),
    t('weeklyInsightHydration', { liters: stats.avgWater.toFixed(1) })
  ];

  if (stats.topSymptoms.length > 0) {
    const topSymptom = stats.topSymptoms[0];
    insights.push(t('weeklyInsightTopSymptom', { symptom: translateSymptomId(topSymptom.name), count: topSymptom.count }));
  }

  if (stats.avgCaffeine > 0) {
    insights.push(t('weeklyInsightCaffeine', { cups: stats.avgCaffeine.toFixed(1) }));
  }

  return insights;
}

function getMoodEmoji(mood: number): string {
  if (mood <= 2) return '😣';
  if (mood <= 3) return '😐';
  if (mood <= 4) return '🙂';
  if (mood <= 5) return '😊';
  return '😄';
}

function getEnergyEmoji(energy: string): string {
  if (energy === 'low') return '😪';
  if (energy === 'medium') return '🙂';
  return '⚡';
}
