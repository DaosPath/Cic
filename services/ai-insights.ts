import type { Cycle, DailyLog } from '../types.ts';
import { differenceInDays } from 'date-fns/differenceInDays';
import { parseISO } from 'date-fns/parseISO';
import type { Translations } from './i18n.ts';

export interface AIInsight {
  id: string;
  type:
    | 'cycle-regularity'
    | 'flow-changes'
    | 'pain-spike'
    | 'stress-spike'
    | 'sleep-quality'
    | 'energy-pattern'
    | 'contraception-adherence'
    | 'emerging-symptom'
    | 'correlation'
    | 'basal-temp'
    | 'ovulation'
    | 'physical-activity'
    | 'hydration'
    | 'weight-trend';
  priority: number;
  confidence: number;
  title: string;
  whyItMatters: string;
  insight: string;
  evidence: {
    values: number[];
    labels: string[];
    summary: string;
  };
  timeRange: string;
  recommendations: Array<{
    text: string;
    category: 'habit' | 'medical' | 'lifestyle';
  }>;
  dataSource: string;
}

export function generateAIInsights(
  logs: DailyLog[],
  cycles: Cycle[],
  timeRange: number = 6,
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight[] {
  const insights: AIInsight[] = [];
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - timeRange);

  const recentLogs = logs.filter(log => parseISO(log.date) >= cutoffDate);
  const recentCycles = cycles.filter(c => parseISO(c.startDate) >= cutoffDate);

  const regularity = analyzeCycleRegularity(recentCycles, t);
  if (regularity) insights.push(regularity);

  const pain = analyzePainPatterns(recentLogs, t);
  if (pain) insights.push(pain);

  const stress = analyzeStressPatterns(recentLogs, t);
  if (stress) insights.push(stress);

  const sleep = analyzeSleepQuality(recentLogs, t);
  if (sleep) insights.push(sleep);

  const energy = analyzeEnergyPatterns(recentLogs, t);
  if (energy) insights.push(energy);

  insights.push(...analyzeSymptomCorrelations(recentLogs, t));

  const hydration = analyzeHydration(recentLogs, t);
  if (hydration) insights.push(hydration);

  const activity = analyzePhysicalActivity(recentLogs, t);
  if (activity) insights.push(activity);

  return insights.sort((a, b) => b.priority - a.priority);
}

function analyzeCycleRegularity(
  cycles: Cycle[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  if (cycles.length < 3) return null;

  const lengths = cycles.filter(c => c.length).map(c => c.length!) ;
  if (lengths.length < 3) return null;

  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const isRegular = stdDev < 3;
  const confidence = Math.min(95, 60 + lengths.length * 5);

  return {
    id: 'cycle-regularity',
    type: 'cycle-regularity',
    priority: 9,
    confidence,
    title: isRegular ? t('aiCycleRegularTitle') : t('aiCycleIrregularTitle'),
    whyItMatters: t('aiCycleWhy'),
    insight: isRegular
      ? t('aiCycleInsightRegular', { stdDev: Math.round(stdDev) })
      : t('aiCycleInsightIrregular', { stdDev: Math.round(stdDev) }),
    evidence: {
      values: lengths,
      labels: lengths.map((_, i) => t('cycleLabel', { number: lengths.length - i })),
      summary: t('aiCycleEvidenceSummary', { avg: Math.round(avg), stdDev: Math.round(stdDev) })
    },
    timeRange: t('aiTimeRangeCycles', { count: lengths.length }),
    recommendations: isRegular
      ? [
          { text: t('aiRecMaintainRoutine'), category: 'habit' },
          { text: t('aiRecKeepLogging'), category: 'habit' }
        ]
      : [
          { text: t('aiRecTrackFactors'), category: 'habit' },
          { text: t('aiRecConsultDoctor'), category: 'medical' },
          { text: t('aiRecSleepRoutine'), category: 'lifestyle' }
        ],
    dataSource: 'cycle-length-analysis'
  };
}

function analyzePainPatterns(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  const painLogs = logs.filter(log => log.painLevel && log.painLevel > 0);
  if (painLogs.length < 5) return null;

  const avgPain = painLogs.reduce((sum, log) => sum + (log.painLevel || 0), 0) / painLogs.length;
  const highPainDays = painLogs.filter(log => (log.painLevel || 0) >= 7).length;
  const painPercentage = (painLogs.length / logs.length) * 100;

  const priority = avgPain > 6 ? 8 : avgPain > 4 ? 6 : 4;
  const confidence = Math.min(90, 50 + painLogs.length * 2);

  return {
    id: 'pain-patterns',
    type: 'pain-spike',
    priority,
    confidence,
    title: avgPain > 6 ? t('aiPainHighTitle') : t('aiPainModerateTitle'),
    whyItMatters: t('aiPainWhy'),
    insight: t('aiPainInsight', {
      percent: Math.round(painPercentage),
      avgPain: avgPain.toFixed(1),
      highPainDays
    }),
    evidence: {
      values: painLogs.map(log => log.painLevel || 0),
      labels: painLogs.map(log => log.date.slice(5)),
      summary: t('aiPainSummary', { days: painLogs.length, avgPain: avgPain.toFixed(1) })
    },
    timeRange: t('aiTimeRangeDays', { days: logs.length }),
    recommendations: avgPain > 6
      ? [
          { text: t('aiRecConsultDoctor'), category: 'medical' },
          { text: t('aiRecPainRelief'), category: 'lifestyle' }
        ]
      : [
          { text: t('aiRecTrackFactors'), category: 'habit' },
          { text: t('aiRecPainRelief'), category: 'lifestyle' }
        ],
    dataSource: 'pain-level-tracking'
  };
}

function analyzeStressPatterns(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  const stressLogs = logs.filter(log => log.stressScore !== undefined);
  if (stressLogs.length < 7) return null;

  const avgStress = stressLogs.reduce((sum, log) => sum + (log.stressScore || 0), 0) / stressLogs.length;
  const highStressDays = stressLogs.filter(log => (log.stressScore || 0) >= 7).length;
  const stressPercentage = (highStressDays / stressLogs.length) * 100;

  const priority = avgStress > 7 ? 7 : avgStress > 5 ? 5 : 3;
  const confidence = Math.min(85, 40 + stressLogs.length * 3);

  return {
    id: 'stress-patterns',
    type: 'stress-spike',
    priority,
    confidence,
    title: avgStress > 7 ? t('aiStressHighTitle') : t('aiStressModerateTitle'),
    whyItMatters: t('aiStressWhy'),
    insight: t('aiStressInsight', { avgStress: avgStress.toFixed(1), percent: Math.round(stressPercentage) }),
    evidence: {
      values: stressLogs.map(log => log.stressScore || 0),
      labels: stressLogs.map(log => log.date.slice(5)),
      summary: t('aiStressSummary', { total: stressLogs.length, high: highStressDays })
    },
    timeRange: t('aiTimeRangeDays', { days: stressLogs.length }),
    recommendations: avgStress > 7
      ? [
          { text: t('aiRecStressTechniques'), category: 'lifestyle' },
          { text: t('aiRecConsultDoctor'), category: 'medical' }
        ]
      : [
          { text: t('aiRecMaintainRoutine'), category: 'habit' },
          { text: t('aiRecStressTechniques'), category: 'lifestyle' }
        ],
    dataSource: 'stress-tracking'
  };
}

function analyzeSleepQuality(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  const sleepLogs = logs.filter(log => log.sleepHours !== undefined);
  if (sleepLogs.length < 7) return null;

  const avgSleep = sleepLogs.reduce((sum, log) => sum + (log.sleepHours || 0), 0) / sleepLogs.length;
  const poorSleepDays = sleepLogs.filter(log => (log.sleepHours || 0) < 6).length;
  const qualityLogs = sleepLogs.filter(log => log.sleepQuality !== undefined);
  const avgQuality = qualityLogs.length > 0
    ? qualityLogs.reduce((sum, log) => sum + (log.sleepQuality || 0), 0) / qualityLogs.length
    : 0;

  const priority = avgSleep < 6 ? 8 : avgSleep < 7 ? 6 : 4;
  const confidence = Math.min(90, 50 + sleepLogs.length * 2);

  return {
    id: 'sleep-quality',
    type: 'sleep-quality',
    priority,
    confidence,
    title: avgSleep < 6 ? t('aiSleepLowTitle') : avgSleep < 7 ? t('aiSleepSuboptimalTitle') : t('aiSleepGoodTitle'),
    whyItMatters: t('aiSleepWhy'),
    insight: t('aiSleepInsight', {
      avgSleep: avgSleep.toFixed(1),
      poorSleepDays,
      avgQuality: avgQuality > 0 ? avgQuality.toFixed(1) : undefined
    }),
    evidence: {
      values: sleepLogs.map(log => log.sleepHours || 0),
      labels: sleepLogs.map(log => log.date.slice(5)),
      summary: t('aiSleepSummary', { nights: sleepLogs.length, avgSleep: avgSleep.toFixed(1) })
    },
    timeRange: t('aiTimeRangeDays', { days: sleepLogs.length }),
    recommendations: avgSleep < 7
      ? [
          { text: t('aiRecSleepRoutine'), category: 'habit' },
          { text: t('aiRecKeepLogging'), category: 'habit' }
        ]
      : [
          { text: t('aiRecMaintainRoutine'), category: 'habit' }
        ],
    dataSource: 'sleep-tracking'
  };
}

function analyzeEnergyPatterns(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  const energyLogs = logs.filter(log => log.energyLevel !== undefined);
  if (energyLogs.length < 7) return null;

  const lowEnergyDays = energyLogs.filter(log => log.energyLevel === 'low').length;
  const highEnergyDays = energyLogs.filter(log => log.energyLevel === 'high').length;
  const lowEnergyPercentage = (lowEnergyDays / energyLogs.length) * 100;

  const priority = lowEnergyPercentage > 60 ? 7 : lowEnergyPercentage > 40 ? 5 : 3;
  const confidence = Math.min(85, 45 + energyLogs.length * 2);

  return {
    id: 'energy-patterns',
    type: 'energy-pattern',
    priority,
    confidence,
    title: lowEnergyPercentage > 60 ? t('aiEnergyLowTitle') : t('aiEnergyMixedTitle'),
    whyItMatters: t('aiEnergyWhy'),
    insight: t('aiEnergyInsight', { lowPercent: Math.round(lowEnergyPercentage), highDays: highEnergyDays }),
    evidence: {
      values: energyLogs.map(log => log.energyLevel === 'low' ? 1 : log.energyLevel === 'medium' ? 2 : 3),
      labels: energyLogs.map(log => log.date.slice(5)),
      summary: t('aiEnergySummary', { low: lowEnergyDays, high: highEnergyDays })
    },
    timeRange: t('aiTimeRangeDays', { days: energyLogs.length }),
    recommendations: lowEnergyPercentage > 60
      ? [
          { text: t('aiRecEnergyCheck'), category: 'medical' },
          { text: t('aiRecSleepRoutine'), category: 'habit' }
        ]
      : [
          { text: t('aiRecMaintainRoutine'), category: 'habit' }
        ],
    dataSource: 'energy-tracking'
  };
}

function analyzeSymptomCorrelations(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight[] {
  const insights: AIInsight[] = [];
  
  const moodSleepLogs = logs.filter(log => log.mood !== undefined && log.sleepHours !== undefined);
  if (moodSleepLogs.length >= 10) {
    const poorSleepBadMood = moodSleepLogs.filter(log => (log.sleepHours || 0) < 6 && (log.mood || 0) <= 2).length;
    const correlation = (poorSleepBadMood / moodSleepLogs.length) * 100;
    
    if (correlation > 30) {
      insights.push({
        id: 'mood-sleep-correlation',
        type: 'correlation',
        priority: 6,
        confidence: Math.min(80, 50 + moodSleepLogs.length),
        title: t('aiCorrelationMoodSleepTitle'),
        whyItMatters: t('aiCorrelationMoodSleepWhy'),
        insight: t('aiCorrelationMoodSleepInsight', { percent: Math.round(correlation) }),
        evidence: {
          values: [poorSleepBadMood, moodSleepLogs.length - poorSleepBadMood],
          labels: [t('aiCorrelationMoodSleepLabelPoor'), t('aiCorrelationMoodSleepLabelOther')],
          summary: t('aiCorrelationMoodSleepSummary', { poor: poorSleepBadMood, total: moodSleepLogs.length })
        },
        timeRange: t('aiTimeRangeDays', { days: moodSleepLogs.length }),
        recommendations: [
          { text: t('aiRecSleepRoutine'), category: 'habit' },
          { text: t('aiRecStressTechniques'), category: 'lifestyle' }
        ],
        dataSource: 'mood-sleep-correlation'
      });
    }
  }

  return insights;
}

function analyzeHydration(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  const hydrationLogs = logs.filter(log => log.waterIntake !== undefined);
  if (hydrationLogs.length < 7) return null;

  const avgWater = hydrationLogs.reduce((sum, log) => sum + (log.waterIntake || 0), 0) / hydrationLogs.length;
  const lowHydrationDays = hydrationLogs.filter(log => (log.waterIntake || 0) < 1.5).length;

  const priority = avgWater < 1.5 ? 5 : 3;
  const confidence = Math.min(85, 40 + hydrationLogs.length * 3);

  return {
    id: 'hydration',
    type: 'hydration',
    priority,
    confidence,
    title: avgWater < 1.5 ? t('aiHydrationLowTitle') : t('aiHydrationGoodTitle'),
    whyItMatters: t('aiHydrationWhy'),
    insight: t('aiHydrationInsight', { avgWater: avgWater.toFixed(1), lowDays: lowHydrationDays }),
    evidence: {
      values: hydrationLogs.map(log => log.waterIntake || 0),
      labels: hydrationLogs.map(log => log.date.slice(5)),
      summary: t('aiHydrationSummary', { days: hydrationLogs.length, avgWater: avgWater.toFixed(1) })
    },
    timeRange: t('aiTimeRangeDays', { days: hydrationLogs.length }),
    recommendations: avgWater < 1.5
      ? [
          { text: t('aiRecStayHydrated'), category: 'habit' },
          { text: t('aiRecKeepLogging'), category: 'habit' }
        ]
      : [
          { text: t('aiRecMaintainRoutine'), category: 'habit' }
        ],
    dataSource: 'hydration-tracking'
  };
}

function analyzePhysicalActivity(
  logs: DailyLog[],
  t: (key: keyof Translations, reps?: Record<string, string | number>) => string
): AIInsight | null {
  const activityLogs = logs.filter(log => log.physicalActivity && log.physicalActivity !== 'none');
  if (logs.length < 14) return null;

  const activityPercentage = (activityLogs.length / logs.length) * 100;
  const durations = activityLogs.filter(log => log.activityDuration).map(log => log.activityDuration || 0);
  const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

  const priority = activityPercentage < 30 ? 6 : 4;
  const confidence = Math.min(85, 40 + logs.length * 2);

  return {
    id: 'physical-activity',
    type: 'physical-activity',
    priority,
    confidence,
    title: activityPercentage < 30 ? t('aiActivityLowTitle') : t('aiActivityGoodTitle'),
    whyItMatters: t('aiActivityWhy'),
    insight: t('aiActivityInsight', {
      percent: Math.round(activityPercentage),
      avgDuration: avgDuration > 0 ? Math.round(avgDuration) : undefined
    }),
    evidence: {
      values: logs.map(log => log.physicalActivity && log.physicalActivity !== 'none' ? 1 : 0),
      labels: logs.map(log => log.date.slice(5)),
      summary: t('aiActivitySummary', { active: activityLogs.length, total: logs.length })
    },
    timeRange: t('aiTimeRangeDays', { days: logs.length }),
    recommendations: activityPercentage < 30
      ? [
          { text: t('aiRecMoveMore'), category: 'lifestyle' },
          { text: t('aiRecMaintainRoutine'), category: 'habit' }
        ]
      : [
          { text: t('aiRecMaintainRoutine'), category: 'habit' }
        ],
    dataSource: 'activity-tracking'
  };
}
