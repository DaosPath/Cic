import React from 'react';
import type { DailyLog } from '../types.ts';
import { format, subDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { UnifiedChatCTA } from './UnifiedChatCTA.tsx';

interface WeeklyInsightViewProps {
  logs: DailyLog[];
  onStartChat?: () => void;
  mode?: 'simple' | 'ai';
}

export const WeeklyInsightView: React.FC<WeeklyInsightViewProps> = ({ logs, onStartChat, mode = 'simple' }) => {
  const today = new Date();
  const weekStart = subDays(today, 6);
  const stats = calculateWeeklyStats(logs);
  const weekLabel = `Semana del ${format(weekStart, "d 'de' MMM", { locale: es })} al ${format(today, "d 'de' MMM", { locale: es })}`;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Sticky */}
      <div className="sticky top-0 z-10 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
              Resumen Semanal
            </h2>
            <div className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
              <span className="text-xs font-medium text-brand-primary">
                {format(weekStart, "d MMM", { locale: es })} - {format(today, "d MMM", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          icon="😴"
          label="Sueño Promedio"
          value={`${stats.avgSleep.toFixed(1)}h`}
          type="habit"
          sparklineData={stats.sleepSparkline}
        />
        <MetricCard
          icon="🩹"
          label="Dolor Promedio"
          value={`${stats.avgPain.toFixed(1)}/10`}
          type="state"
          sparklineData={stats.painSparkline}
        />
        <MetricCard
          icon="🧘"
          label="Estrés Promedio"
          value={`${stats.avgStress.toFixed(1)}/10`}
          type="state"
          sparklineData={stats.stressSparkline}
        />
        <MetricCard
          icon="💧"
          label="Hidratación"
          value={`${stats.avgWater.toFixed(1)}L`}
          type="habit"
          sparklineData={stats.waterSparkline}
        />
        <MetricCard
          icon="😊"
          label="Ánimo Promedio"
          value={`${stats.avgMood.toFixed(1)}/5`}
          type="state"
          sparklineData={stats.moodSparkline}
        />
        <MetricCard
          icon="⚡"
          label="Energía Alta"
          value={`${stats.highEnergyDays}/7`}
          type="habit"
          sparklineData={stats.energySparkline}
        />
      </div>

      {/* Desglose Diario */}
      <div className="bg-brand-surface border border-brand-border rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="p-5 border-b border-brand-border">
          <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
            Desglose Diario
          </h3>
        </div>
        <div className="divide-y divide-brand-border">
          {stats.dailyBreakdown.map((day, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-3 hover:bg-brand-surface-2 transition-colors duration-150"
            >
              <div className="flex-shrink-0 w-16">
                <p className="text-xs font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                  {day.dayName}
                </p>
                <p className="text-xs text-brand-text-2">{day.date}</p>
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
                      <span className="text-xs px-2 py-1 bg-brand-primary/12 text-brand-primary rounded-md font-medium">
                        Dolor {day.pain}
                      </span>
                    )}
                    {day.sleep !== undefined && (
                      <span className="text-xs px-2 py-1 bg-brand-accent/12 text-brand-accent rounded-md font-medium">
                        {day.sleep}h
                      </span>
                    )}
                    {day.activity && day.activity !== 'none' && (
                      <span className="text-sm">🏃</span>
                    )}
                  </>
                ) : (
                  <button className="text-xs px-2 py-1 bg-brand-border/12 text-brand-text-2 rounded-md hover:bg-brand-border/16 hover:text-brand-text transition-colors duration-150 font-medium">
                    Sin registro
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas Semanales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Actividad Física */}
        <div className="bg-brand-surface border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏃</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Actividad Física
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-2xl font-bold text-brand-text" style={{ fontWeight: 700 }}>
                  {stats.activityDays}/7
                </p>
                <p className="text-xs text-brand-text-2">días activos</p>
              </div>
              <div className="flex-1">
                <div className="relative w-full bg-brand-surface-2 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stats.activityDays >= 5 
                        ? 'bg-green-500/16 border-r-2 border-green-500' 
                        : stats.activityDays >= 3 
                        ? 'bg-amber-500/16 border-r-2 border-amber-500' 
                        : 'bg-red-500/16 border-r-2 border-red-500'
                    }`}
                    style={{ width: `${(stats.activityDays / 7) * 100}%` }}
                  />
                  {/* Meta marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-brand-text-2/40"
                    style={{ left: `${(5 / 7) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-brand-text-2 mt-1">Meta: 5 días/semana</p>
              </div>
            </div>
            {stats.totalActivityMinutes > 0 && (
              <div className="pt-2 border-t border-brand-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-text-2">Total minutos</span>
                  <span className="text-sm font-medium text-brand-text">{stats.totalActivityMinutes} min</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calidad del Sueño */}
        <div className="bg-brand-surface border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🌙</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Calidad del Sueño
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-text-2">Promedio horas</span>
              <span className="text-sm font-medium text-brand-text">{stats.avgSleep.toFixed(1)}h</span>
            </div>
            {stats.avgSleepQuality > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-brand-text-2">Calidad promedio</span>
                <span className="text-sm font-medium text-brand-text">{stats.avgSleepQuality.toFixed(1)}/5</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-text-2">Días con buen sueño</span>
              <span className="text-sm font-medium text-brand-text">{stats.goodSleepDays}/7</span>
            </div>
          </div>
        </div>

        {/* Bienestar Mental */}
        <div className="bg-brand-surface border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🧠</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Bienestar Mental
            </h3>
          </div>
          <div className="space-y-3">
            {stats.avgMood > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-brand-text-2">Ánimo promedio</span>
                <span className="text-sm font-medium text-brand-text">{stats.avgMood.toFixed(1)}/5</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-text-2">Días con estrés alto</span>
              <span className="text-sm font-medium text-brand-text">{stats.highStressDays}/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-text-2">Días con energía alta</span>
              <span className="text-sm font-medium text-brand-text">{stats.highEnergyDays}/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Síntomas más Frecuentes */}
      {stats.topSymptoms.length > 0 && (
        <div className="bg-brand-surface border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔍</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Síntomas más Frecuentes
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.topSymptoms.map((symptom, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-surface-2 rounded-lg">
                <span className="text-sm text-brand-text">{symptom.name}</span>
                <span className="text-xs px-2 py-1 bg-brand-primary/12 text-brand-primary rounded-full font-medium">
                  {symptom.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tendencias de Consumo */}
      {(stats.avgCaffeine > 0 || stats.avgAlcohol > 0 || stats.topCravings.length > 0) && (
        <div className="bg-brand-surface border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">☕</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Tendencias de Consumo
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.avgCaffeine > 0 && (
              <div className="text-center p-3 bg-brand-surface-2 rounded-lg">
                <p className="text-2xl font-bold text-brand-text" style={{ fontWeight: 700 }}>
                  {stats.avgCaffeine.toFixed(1)}
                </p>
                <p className="text-xs text-brand-text-2">tazas cafeína/día</p>
              </div>
            )}
            {stats.avgAlcohol > 0 && (
              <div className="text-center p-3 bg-brand-surface-2 rounded-lg">
                <p className="text-2xl font-bold text-brand-text" style={{ fontWeight: 700 }}>
                  {stats.avgAlcohol.toFixed(1)}
                </p>
                <p className="text-xs text-brand-text-2">unidades alcohol/día</p>
              </div>
            )}
            {stats.topCravings.length > 0 && (
              <div className="p-3 bg-brand-surface-2 rounded-lg">
                <p className="text-xs text-brand-text-2 mb-2">Antojos frecuentes</p>
                <div className="flex flex-wrap gap-1">
                  {stats.topCravings.slice(0, 3).map((craving, index) => (
                    <span key={index} className="px-2 py-0.5 bg-brand-accent/12 text-brand-accent rounded text-xs">
                      {craving}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patrones de la Semana */}
      <div className="bg-brand-surface border border-brand-border rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
              Patrones de la Semana
            </h3>
          </div>
          <div className="px-2 py-1 bg-brand-primary/12 text-brand-primary rounded-md">
            <span className="text-xs font-medium">Alta confianza</span>
          </div>
        </div>
        <div className="space-y-3">
          {generateWeeklyInsights(stats).map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-brand-primary mt-0.5 text-xs">•</span>
              <p className="text-sm text-brand-text leading-relaxed flex-1" style={{ lineHeight: 1.6 }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat CTA Unificado */}
      <UnifiedChatCTA
        onStartChat={onStartChat}
        contextTitle={weekLabel}
        contextSubtitle="Analiza tendencias semanales, patrones de sueño y actividad"
        contextInfo={{
          date: weekLabel,
          cyclePhase: undefined,
          cycleDay: undefined
        }}
        keyMetrics={{
          stress: stats.avgStress,
          sleep: stats.avgSleep,
          mood: undefined,
          energy: undefined
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
  const colorClass = isHabit ? 'text-brand-accent' : 'text-brand-primary/80';
  const bgClass = isHabit ? 'bg-brand-accent/12' : 'bg-brand-primary/12';

  return (
    <div className={`relative h-[100px] border border-brand-border rounded-[18px] p-4 ${bgClass} shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-150 focus-within:ring-2 focus-within:ring-brand-primary/20`}>
      {/* Mini Sparkline */}
      <div className="absolute top-3 right-3">
        <MiniSparkline data={sparklineData} color={isHabit ? 'accent' : 'primary'} />
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[20px] leading-none">{icon}</span>
        <p className="text-xs text-brand-text-2 font-medium">{label}</p>
      </div>
      
      <p className={`text-[28px] font-bold ${colorClass} leading-none`} style={{ fontWeight: 700 }}>
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

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 24;
    const y = 12 - ((value - min) / range) * 12;
    return `${x},${y}`;
  }).join(' ');

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

function calculateWeeklyStats(logs: DailyLog[]) {
  const today = new Date();
  const weekAgo = subDays(today, 6);

  const weekLogs = logs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= weekAgo && logDate <= today;
  });

  const dailyBreakdown = [];
  const sleepSparkline = [];
  const painSparkline = [];
  const stressSparkline = [];
  const waterSparkline = [];
  const moodSparkline = [];
  const energySparkline = [];

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

    // Sparkline data (7 days)
    sleepSparkline.push(log?.sleepHours || 0);
    painSparkline.push(log?.painLevel || 0);
    stressSparkline.push(log?.stressScore || 0);
    waterSparkline.push(log?.waterIntake || 0);
    moodSparkline.push(log?.mood || 0);
    energySparkline.push(log?.energyLevel === 'high' ? 3 : log?.energyLevel === 'medium' ? 2 : log?.energyLevel === 'low' ? 1 : 0);
  }

  // Filtros por tipo de dato
  const sleepLogs = weekLogs.filter(l => l.sleepHours !== undefined);
  const painLogs = weekLogs.filter(l => l.painLevel !== undefined);
  const stressLogs = weekLogs.filter(l => l.stressScore !== undefined);
  const waterLogs = weekLogs.filter(l => l.waterIntake !== undefined);
  const moodLogs = weekLogs.filter(l => l.mood !== undefined);
  const sleepQualityLogs = weekLogs.filter(l => l.sleepQuality !== undefined);
  const caffeineLogs = weekLogs.filter(l => l.caffeineIntake !== undefined && l.caffeineIntake > 0);
  const alcoholLogs = weekLogs.filter(l => l.alcoholIntake !== undefined && l.alcoholIntake > 0);

  // Contadores
  const activityDays = weekLogs.filter(l => l.physicalActivity && l.physicalActivity !== 'none').length;
  const highStressDays = weekLogs.filter(l => l.stressScore && l.stressScore >= 7).length;
  const highEnergyDays = weekLogs.filter(l => l.energyLevel === 'high').length;
  const goodSleepDays = weekLogs.filter(l => l.sleepHours && l.sleepHours >= 7 && l.sleepHours <= 9).length;

  // Actividad total
  const totalActivityMinutes = weekLogs.reduce((sum, l) => sum + (l.activityDuration || 0), 0);

  // Síntomas más frecuentes
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

  // Antojos más frecuentes
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
    // Promedios básicos
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
    avgMood: moodLogs.length > 0
      ? moodLogs.reduce((sum, l) => sum + (l.mood || 0), 0) / moodLogs.length
      : 0,
    avgSleepQuality: sleepQualityLogs.length > 0
      ? sleepQualityLogs.reduce((sum, l) => sum + (l.sleepQuality || 0), 0) / sleepQualityLogs.length
      : 0,
    avgCaffeine: caffeineLogs.length > 0
      ? caffeineLogs.reduce((sum, l) => sum + (l.caffeineIntake || 0), 0) / caffeineLogs.length
      : 0,
    avgAlcohol: alcoholLogs.length > 0
      ? alcoholLogs.reduce((sum, l) => sum + (l.alcoholIntake || 0), 0) / alcoholLogs.length
      : 0,

    // Contadores
    activityDays,
    highStressDays,
    highEnergyDays,
    goodSleepDays,
    totalActivityMinutes,

    // Arrays y listas
    dailyBreakdown,
    topSymptoms,
    topCravings,
    totalLogs: weekLogs.length,

    // Sparklines
    sleepSparkline,
    painSparkline,
    stressSparkline,
    waterSparkline,
    moodSparkline,
    energySparkline
  };
}

function generateWeeklyInsights(stats: ReturnType<typeof calculateWeeklyStats>): string[] {
  const insights: string[] = [];

  // Consistencia de registro
  if (stats.totalLogs >= 6) {
    insights.push(`¡Excelente consistencia! Registraste ${stats.totalLogs} de 7 días esta semana.`);
  } else if (stats.totalLogs >= 4) {
    insights.push(`Buena consistencia con ${stats.totalLogs} días registrados. Intenta completar los 7 días.`);
  } else if (stats.totalLogs >= 2) {
    insights.push(`Registraste ${stats.totalLogs} días. Aumenta la frecuencia para mejores insights.`);
  }

  // Análisis del sueño
  if (stats.avgSleep > 0) {
    if (stats.avgSleep < 6) {
      insights.push(`Sueño insuficiente (${stats.avgSleep.toFixed(1)}h promedio). Prioriza 7-9 horas diarias.`);
    } else if (stats.avgSleep >= 7 && stats.avgSleep <= 9) {
      if (stats.goodSleepDays >= 5) {
        insights.push(`¡Excelente! ${stats.goodSleepDays} días con sueño óptimo esta semana.`);
      } else {
        insights.push(`Buen promedio de sueño (${stats.avgSleep.toFixed(1)}h), pero mejora la consistencia.`);
      }
    }
  }

  // Bienestar mental
  if (stats.avgMood > 0) {
    if (stats.avgMood >= 4) {
      insights.push(`¡Genial! Tu ánimo promedio (${stats.avgMood.toFixed(1)}/5) fue muy bueno esta semana.`);
    } else if (stats.avgMood <= 2.5) {
      insights.push(`Tu ánimo estuvo bajo (${stats.avgMood.toFixed(1)}/5). Considera actividades que te gusten.`);
    }
  }

  // Estrés y energía
  if (stats.highStressDays >= 4) {
    insights.push(`${stats.highStressDays} días con estrés alto. Incorpora técnicas de relajación diarias.`);
  } else if (stats.highEnergyDays >= 4) {
    insights.push(`¡Fantástico! ${stats.highEnergyDays} días con alta energía esta semana.`);
  }

  // Actividad física
  if (stats.activityDays >= 5) {
    if (stats.totalActivityMinutes >= 150) {
      insights.push(`¡Increíble! ${stats.activityDays} días activos y ${stats.totalActivityMinutes} minutos totales.`);
    } else {
      insights.push(`Excelente frecuencia (${stats.activityDays} días). Intenta aumentar la duración.`);
    }
  } else if (stats.activityDays >= 3) {
    insights.push(`${stats.activityDays} días activos. Objetivo: 5 días por semana.`);
  } else if (stats.activityDays > 0) {
    insights.push(`Solo ${stats.activityDays} días de actividad. Aumenta gradualmente.`);
  }

  // Dolor
  if (stats.avgPain >= 6) {
    insights.push(`Dolor alto esta semana (${stats.avgPain.toFixed(1)}/10). Considera consultar con tu médico.`);
  } else if (stats.avgPain >= 3 && stats.avgPain < 6) {
    insights.push(`Dolor moderado (${stats.avgPain.toFixed(1)}/10). Prueba técnicas de manejo del dolor.`);
  }

  // Hidratación
  if (stats.avgWater >= 2.5) {
    insights.push(`¡Excelente hidratación! Promedio de ${stats.avgWater.toFixed(1)}L diarios.`);
  } else if (stats.avgWater < 1.5) {
    insights.push(`Hidratación baja (${stats.avgWater.toFixed(1)}L). Objetivo: 2-2.5L diarios.`);
  }

  // Síntomas frecuentes
  if (stats.topSymptoms.length >= 3) {
    const topSymptom = stats.topSymptoms[0];
    insights.push(`Síntoma más frecuente: ${topSymptom.name} (${topSymptom.count} días).`);
  }

  // Consumo
  if (stats.avgCaffeine >= 4) {
    insights.push(`Alto consumo de cafeína (${stats.avgCaffeine.toFixed(1)} tazas/día). Puede afectar el sueño.`);
  }

  if (insights.length === 0) {
    insights.push('Continúa registrando para obtener insights más detallados sobre tus patrones semanales.');
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
