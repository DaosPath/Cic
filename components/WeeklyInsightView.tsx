import React from 'react';
import type { DailyLog } from '../types.ts';
import { format, subDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { ChatCTA } from './ChatCTA.tsx';

interface WeeklyInsightViewProps {
  logs: DailyLog[];
  onStartChat?: () => void;
}

export const WeeklyInsightView: React.FC<WeeklyInsightViewProps> = ({ logs, onStartChat }) => {
  const today = new Date();
  const weekStart = subDays(today, 6);
  const stats = calculateWeeklyStats(logs);
  const weekLabel = `Semana del ${format(weekStart, "d 'de' MMM", { locale: es })} al ${format(today, "d 'de' MMM", { locale: es })}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📆</span>
          <h2 className="text-xl font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
            Resumen Semanal
          </h2>
        </div>
        <p className="text-sm text-brand-text-dim" style={{ fontWeight: 500, lineHeight: 1.45 }}>
          {format(weekStart, "d 'de' MMMM", { locale: es })} - {format(today, "d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon="😴"
          label="Sueño Promedio"
          value={`${stats.avgSleep.toFixed(1)}h`}
          status={stats.avgSleep >= 7 ? 'good' : stats.avgSleep >= 6 ? 'warning' : 'bad'}
        />
        <MetricCard
          icon="🩹"
          label="Dolor Promedio"
          value={`${stats.avgPain.toFixed(1)}/10`}
          status={stats.avgPain < 4 ? 'good' : stats.avgPain < 7 ? 'warning' : 'bad'}
        />
        <MetricCard
          icon="🧘"
          label="Estrés Promedio"
          value={`${stats.avgStress.toFixed(1)}/10`}
          status={stats.avgStress < 5 ? 'good' : stats.avgStress < 7 ? 'warning' : 'bad'}
        />
        <MetricCard
          icon="💧"
          label="Hidratación"
          value={`${stats.avgWater.toFixed(1)}L`}
          status={stats.avgWater >= 2 ? 'good' : stats.avgWater >= 1.5 ? 'warning' : 'bad'}
        />
      </div>

      {/* Daily Breakdown */}
      <div className="bg-brand-surface-2 border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <h3 className="text-sm font-semibold text-brand-text mb-4" style={{ fontWeight: 600 }}>
          Desglose Diario
        </h3>
        <div className="space-y-2">
          {stats.dailyBreakdown.map((day, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg hover:bg-brand-surface-2 transition-all duration-150"
            >
              <div className="flex-shrink-0 w-20">
                <p className="text-xs font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                  {day.dayName}
                </p>
                <p className="text-xs text-brand-text-dim">{day.date}</p>
              </div>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                {day.hasData ? (
                  <>
                    {day.mood !== undefined && (
                      <span className="text-sm" title={`Ánimo: ${day.mood}/10`}>
                        {getMoodEmoji(day.mood)}
                      </span>
                    )}
                    {day.energy && (
                      <span className="text-sm" title={`Energía: ${day.energy}`}>
                        {getEnergyEmoji(day.energy)}
                      </span>
                    )}
                    {day.pain !== undefined && day.pain > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                        Dolor {day.pain}
                      </span>
                    )}
                    {day.sleep !== undefined && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        {day.sleep}h
                      </span>
                    )}
                    {day.activity && day.activity !== 'none' && (
                      <span className="text-sm">🏃</span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-brand-text-dim italic">Sin registro</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      {stats.activityDays > 0 && (
        <div className="bg-brand-surface-2 border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏃</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Actividad Física
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-2xl font-bold text-brand-text" style={{ fontWeight: 700 }}>
                {stats.activityDays}/7
              </p>
              <p className="text-xs text-brand-text-dim">días activos</p>
            </div>
            <div className="flex-1">
              <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
                  style={{ width: `${(stats.activityDays / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patterns & Insights */}
      <div className="bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💡</span>
          <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
            Patrones de la Semana
          </h3>
        </div>
        <div className="space-y-3">
          {generateWeeklyInsights(stats).map((insight, index) => (
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
          contextTitle={weekLabel}
          contextSubtitle="Analiza tendencias semanales, patrones de sueño y actividad"
        />
      )}
    </div>
  );
};

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'bad';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, status }) => {
  const statusColors = {
    good: 'border-green-500/30 bg-green-500/10',
    warning: 'border-amber-500/30 bg-amber-500/10',
    bad: 'border-red-500/30 bg-red-500/10'
  };

  return (
    <div className={`border rounded-[18px] p-4 ${statusColors[status]} shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-all duration-200`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-brand-text-dim" style={{ fontWeight: 500 }}>{label}</p>
      </div>
      <p className="text-xl font-bold text-brand-text" style={{ fontWeight: 700 }}>
        {value}
      </p>
    </div>
  );
};

function calculateWeeklyStats(logs: DailyLog[]) {
  const today = new Date();
  const weekAgo = subDays(today, 6);

  const weekLogs = logs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= weekAgo && logDate <= today;
  });

  const dailyBreakdown = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = weekLogs.find(l => l.date === dateStr);

    dailyBreakdown.push({
      dayName: format(date, 'EEE', { locale: es }),
      date: format(date, 'd/M'),
      hasData: !!log,
      mood: log?.mood,
      energy: log?.energyLevel,
      pain: log?.painLevel,
      sleep: log?.sleepHours,
      activity: log?.physicalActivity
    });
  }

  const sleepLogs = weekLogs.filter(l => l.sleepHours !== undefined);
  const painLogs = weekLogs.filter(l => l.painLevel !== undefined);
  const stressLogs = weekLogs.filter(l => l.stressScore !== undefined);
  const waterLogs = weekLogs.filter(l => l.waterIntake !== undefined);
  const activityDays = weekLogs.filter(l => l.physicalActivity && l.physicalActivity !== 'none').length;

  return {
    avgSleep: sleepLogs.length > 0
      ? sleepLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / sleepLogs.length
      : 0,
    avgPain: painLogs.length > 0
      ? painLogs.reduce((sum, l) => sum + (l.painLevel || 0), 0) / painLogs.length
      : 0,
    avgStress: stressLogs.length > 0
      ? stressLogs.reduce((sum, l) => sum + (l.stressScore || 0), 0) / stressLogs.length
      : 0,
    avgWater: waterLogs.length > 0
      ? waterLogs.reduce((sum, l) => sum + (l.waterIntake || 0), 0) / waterLogs.length
      : 0,
    activityDays,
    dailyBreakdown,
    totalLogs: weekLogs.length
  };
}

function generateWeeklyInsights(stats: ReturnType<typeof calculateWeeklyStats>): string[] {
  const insights: string[] = [];

  if (stats.totalLogs >= 5) {
    insights.push(`¡Excelente! Registraste ${stats.totalLogs} de 7 días esta semana. La consistencia es clave para insights precisos.`);
  } else if (stats.totalLogs >= 3) {
    insights.push(`Registraste ${stats.totalLogs} días esta semana. Intenta registrar diariamente para mejores insights.`);
  } else {
    insights.push(`Solo registraste ${stats.totalLogs} días. Aumenta tu frecuencia de registro para análisis más completos.`);
  }

  if (stats.avgSleep > 0) {
    if (stats.avgSleep < 6) {
      insights.push(`Tu promedio de sueño (${stats.avgSleep.toFixed(1)}h) está por debajo de lo recomendado. Prioriza dormir 7-9 horas.`);
    } else if (stats.avgSleep >= 7 && stats.avgSleep <= 9) {
      insights.push(`¡Perfecto! Tu sueño promedio de ${stats.avgSleep.toFixed(1)}h está en el rango óptimo.`);
    }
  }

  if (stats.avgPain > 0) {
    if (stats.avgPain >= 7) {
      insights.push(`Tu dolor promedio (${stats.avgPain.toFixed(1)}/10) es alto. Considera consultar con tu médico.`);
    } else if (stats.avgPain >= 4) {
      insights.push(`Experimentaste dolor moderado esta semana (${stats.avgPain.toFixed(1)}/10). Prueba técnicas de manejo del dolor.`);
    }
  }

  if (stats.avgStress > 0 && stats.avgStress >= 7) {
    insights.push(`Tu nivel de estrés (${stats.avgStress.toFixed(1)}/10) es elevado. Incorpora técnicas de relajación diarias.`);
  }

  if (stats.activityDays >= 5) {
    insights.push(`¡Increíble! Hiciste ejercicio ${stats.activityDays} días. Mantén este ritmo.`);
  } else if (stats.activityDays >= 3) {
    insights.push(`Hiciste ejercicio ${stats.activityDays} días. Intenta llegar a 5 días por semana.`);
  } else if (stats.activityDays > 0) {
    insights.push(`Solo ${stats.activityDays} días de actividad. Aumenta gradualmente a 30 min diarios.`);
  }

  if (stats.avgWater > 0) {
    if (stats.avgWater < 1.5) {
      insights.push(`Tu hidratación promedio (${stats.avgWater.toFixed(1)}L) es baja. Objetivo: 2-2.5L diarios.`);
    } else if (stats.avgWater >= 2) {
      insights.push(`¡Bien hidratada! Promedio de ${stats.avgWater.toFixed(1)}L al día.`);
    }
  }

  return insights;
}

function getMoodEmoji(mood: number): string {
  if (mood <= 2) return '😢';
  if (mood <= 4) return '😕';
  if (mood <= 6) return '😐';
  if (mood <= 8) return '🙂';
  return '😊';
}

function getEnergyEmoji(energy: string): string {
  if (energy === 'low') return '🔋';
  if (energy === 'medium') return '⚡';
  return '✨';
}
