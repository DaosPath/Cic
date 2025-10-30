import React from 'react';
import type { DailyLog, Cycle } from '../types.ts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { ChatCTA } from './ChatCTA.tsx';

interface MonthlyInsightViewProps {
  logs: DailyLog[];
  cycles: Cycle[];
  onStartChat?: () => void;
}

export const MonthlyInsightView: React.FC<MonthlyInsightViewProps> = ({ logs, cycles, onStartChat }) => {
  const today = new Date();
  const stats = calculateMonthlyStats(logs, cycles);
  const monthLabel = format(today, 'MMMM yyyy', { locale: es });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🗓️</span>
          <h2 className="text-xl font-bold text-brand-text capitalize" style={{ fontWeight: 700, lineHeight: 1.3 }}>
            {format(today, 'MMMM yyyy', { locale: es })}
          </h2>
        </div>
        <p className="text-sm text-brand-text-dim" style={{ fontWeight: 500, lineHeight: 1.45 }}>
          Análisis completo del mes • {logs.length} días registrados
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <OverviewCard
          icon="📊"
          label="Días Registrados"
          value={`${logs.length}/30`}
          percentage={(logs.length / 30) * 100}
        />
        <OverviewCard
          icon="😴"
          label="Sueño Promedio"
          value={`${stats.avgSleep.toFixed(1)}h`}
          status={stats.avgSleep >= 7 ? 'good' : 'warning'}
        />
        <OverviewCard
          icon="🏃"
          label="Días Activos"
          value={`${stats.activeDays}`}
          percentage={(stats.activeDays / logs.length) * 100}
        />
        <OverviewCard
          icon="💧"
          label="Hidratación"
          value={`${stats.avgWater.toFixed(1)}L`}
          status={stats.avgWater >= 2 ? 'good' : 'warning'}
        />
      </div>

      {/* Cycle Info */}
      {stats.cyclesThisMonth.length > 0 && (
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔄</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Ciclos del Mes
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.cyclesThisMonth.map((cycle, index) => (
              <div key={cycle.id} className="bg-brand-surface/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Ciclo {index + 1}
                  </span>
                  {cycle.length && (
                    <span className="text-xs px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded">
                      {cycle.length} días
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-text-dim">
                  Inicio: {format(parseISO(cycle.startDate), "d 'de' MMM", { locale: es })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pain & Stress */}
        <div className="bg-brand-surface-2 border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <h3 className="text-sm font-semibold text-brand-text mb-4" style={{ fontWeight: 600 }}>
            Dolor y Estrés
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-brand-text-dim">Dolor Promedio</span>
                <span className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                  {stats.avgPain.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                  style={{ width: `${(stats.avgPain / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-brand-text-dim mt-1">
                {stats.painDays} días con dolor
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-brand-text-dim">Estrés Promedio</span>
                <span className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                  {stats.avgStress.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{ width: `${(stats.avgStress / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-brand-text-dim mt-1">
                {stats.highStressDays} días con estrés alto
              </p>
            </div>
          </div>
        </div>

        {/* Mood & Energy */}
        <div className="bg-brand-surface-2 border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <h3 className="text-sm font-semibold text-brand-text mb-4" style={{ fontWeight: 600 }}>
            Ánimo y Energía
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-brand-text-dim">Ánimo Promedio</span>
                <span className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                  {stats.avgMood.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent"
                  style={{ width: `${(stats.avgMood / 10) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-brand-text-dim">Distribución de Energía</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold text-red-400" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.low}
                  </div>
                  <div className="text-xs text-brand-text-dim">Baja</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold text-amber-400" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.medium}
                  </div>
                  <div className="text-xs text-brand-text-dim">Media</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold text-green-400" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.high}
                  </div>
                  <div className="text-xs text-brand-text-dim">Alta</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Symptoms */}
      {stats.topSymptoms.length > 0 && (
        <div className="bg-brand-surface-2 border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔍</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Síntomas Más Frecuentes
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.topSymptoms.slice(0, 6).map((symptom, index) => (
              <div key={index} className="bg-brand-surface rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-brand-text truncate" style={{ fontWeight: 600 }}>
                    {symptom.name}
                  </span>
                  <span className="text-xs text-brand-primary font-semibold">
                    {symptom.count}
                  </span>
                </div>
                <div className="w-full bg-brand-surface-2 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-brand-primary"
                    style={{ width: `${(symptom.count / logs.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Insights */}
      <div className="bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💡</span>
          <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
            Insights del Mes
          </h3>
        </div>
        <div className="space-y-3">
          {generateMonthlyInsights(stats, logs.length).map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-brand-primary mt-0.5">•</span>
              <p className="text-sm text-brand-text leading-relaxed flex-1" style={{ lineHeight: 1.6 }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat CTA */}
      {onStartChat && (
        <ChatCTA
          onStartChat={onStartChat}
          contextTitle={monthLabel}
          contextSubtitle="Explora ciclos, síntomas frecuentes y correlaciones del mes"
        />
      )}
    </div>
  );
};

interface OverviewCardProps {
  icon: string;
  label: string;
  value: string;
  percentage?: number;
  status?: 'good' | 'warning' | 'bad';
}

const OverviewCard: React.FC<OverviewCardProps> = ({ icon, label, value, percentage, status }) => {
  const getStatusColor = () => {
    if (status === 'good') return 'text-green-400';
    if (status === 'warning') return 'text-amber-400';
    if (status === 'bad') return 'text-red-400';
    return 'text-brand-text';
  };

  return (
    <div className="bg-brand-surface-2 border border-brand-border rounded-[18px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-all duration-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-brand-text-dim" style={{ fontWeight: 500 }}>{label}</p>
      </div>
      <p className={`text-xl font-bold ${getStatusColor()}`} style={{ fontWeight: 700 }}>
        {value}
      </p>
      {percentage !== undefined && (
        <div className="mt-2 w-full bg-brand-surface rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

function calculateMonthlyStats(logs: DailyLog[], cycles: Cycle[]) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const cyclesThisMonth = cycles.filter(c => {
    const cycleStart = parseISO(c.startDate);
    return cycleStart >= monthStart && cycleStart <= monthEnd;
  });

  const sleepLogs = logs.filter(l => l.sleepHours !== undefined);
  const painLogs = logs.filter(l => l.painLevel !== undefined && l.painLevel > 0);
  const stressLogs = logs.filter(l => l.stressScore !== undefined);
  const moodLogs = logs.filter(l => l.mood !== undefined);
  const waterLogs = logs.filter(l => l.waterIntake !== undefined);
  const activeDays = logs.filter(l => l.physicalActivity && l.physicalActivity !== 'none').length;

  const energyDistribution = {
    low: logs.filter(l => l.energyLevel === 'low').length,
    medium: logs.filter(l => l.energyLevel === 'medium').length,
    high: logs.filter(l => l.energyLevel === 'high').length
  };

  const symptomCounts: Record<string, number> = {};
  logs.forEach(log => {
    log.symptoms?.forEach(symptomId => {
      symptomCounts[symptomId] = (symptomCounts[symptomId] || 0) + 1;
    });
  });

  const topSymptoms = Object.entries(symptomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
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
    topSymptoms
  };
}

function generateMonthlyInsights(stats: ReturnType<typeof calculateMonthlyStats>, totalDays: number): string[] {
  const insights: string[] = [];

  const consistency = (totalDays / 30) * 100;
  if (consistency >= 80) {
    insights.push(`¡Excelente consistencia! Registraste ${totalDays} de 30 días este mes.`);
  } else if (consistency >= 50) {
    insights.push(`Registraste ${totalDays} días este mes. Intenta aumentar tu consistencia para mejores insights.`);
  }

  if (stats.cyclesThisMonth.length > 0) {
    insights.push(`Tuviste ${stats.cyclesThisMonth.length} ciclo${stats.cyclesThisMonth.length > 1 ? 's' : ''} este mes.`);
  }

  if (stats.avgSleep > 0) {
    if (stats.avgSleep < 6) {
      insights.push(`Tu sueño promedio (${stats.avgSleep.toFixed(1)}h) está muy por debajo de lo recomendado. Prioriza descansar más.`);
    } else if (stats.avgSleep >= 7 && stats.avgSleep <= 9) {
      insights.push(`¡Perfecto! Mantuviste un sueño saludable de ${stats.avgSleep.toFixed(1)}h en promedio.`);
    }
  }

  if (stats.painDays > 15) {
    insights.push(`Experimentaste dolor en ${stats.painDays} días este mes. Considera consultar con tu médico.`);
  }

  if (stats.highStressDays > 10) {
    insights.push(`Tuviste ${stats.highStressDays} días con estrés alto. Incorpora técnicas de manejo del estrés.`);
  }

  const activityPercentage = (stats.activeDays / totalDays) * 100;
  if (activityPercentage >= 70) {
    insights.push(`¡Increíble! Fuiste activa ${stats.activeDays} días este mes.`);
  } else if (activityPercentage < 30) {
    insights.push(`Solo ${stats.activeDays} días de actividad física. Intenta aumentar gradualmente.`);
  }

  if (stats.energyDistribution.low > stats.energyDistribution.high) {
    insights.push(`Tu energía estuvo mayormente baja este mes. Revisa tu sueño, nutrición y niveles de estrés.`);
  }

  return insights;
}
