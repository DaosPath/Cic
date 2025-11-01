import React from 'react';
import type { DailyLog, Cycle } from '../types.ts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { UnifiedChatCTA } from './UnifiedChatCTA.tsx';

interface MonthlyInsightViewProps {
  logs: DailyLog[];
  cycles: Cycle[];
  onStartChat?: () => void;
  mode?: 'simple' | 'ai';
}

export const MonthlyInsightView: React.FC<MonthlyInsightViewProps> = ({ logs, cycles, onStartChat, mode = 'simple' }) => {
  const today = new Date();
  const stats = calculateMonthlyStats(logs, cycles);
  const monthLabel = format(today, 'MMMM yyyy', { locale: es });
  const daysInMonth = endOfMonth(today).getDate();

  // Debug: verificar datos
  console.log('MonthlyInsightView - logs:', logs.length, 'cycles:', cycles.length);
  console.log('Stats:', stats);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner del mes mejorado */}
      <div 
        className="border border-[#2a2a2a] rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white capitalize" style={{ fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {format(today, 'MMMM yyyy', { locale: es })}
          </h1>
          <div className="px-3 py-1.5 bg-brand-primary/20 rounded-full">
            <span className="text-sm font-semibold text-brand-primary tabular-nums" style={{ fontWeight: 600 }}>
              {daysInMonth} días
            </span>
          </div>
        </div>
        <div className="h-px bg-[var(--border)] mb-4" />
        <p className="text-sm text-[var(--text-2)]" style={{ fontWeight: 500, lineHeight: 1.5 }}>
          Análisis completo del mes • {logs.length} días registrados
        </p>
      </div>

      {/* KPIs mejorados - fila superior */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Días Registrados con ring */}
        <div 
          className="border border-[#2a2a2a] rounded-[18px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-200 relative flex flex-col"
          style={{
            height: '108px',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>Días Registrados</p>
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
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - logs.length / daysInMonth)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-brand-primary tabular-nums" style={{ fontWeight: 700, fontSize: '14px' }}>
                  {Math.round((logs.length / daysInMonth) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tabular-nums" style={{ fontWeight: 700, lineHeight: 1 }}>
                {logs.length}
              </span>
              <span className="text-xs text-[var(--text-2)] mt-0.5" style={{ fontSize: '11px' }}>
                de {daysInMonth}
              </span>
            </div>
          </div>
        </div>

        {/* Sueño Promedio con sparkline */}
        <KPICard
          icon={
            <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
          label="Sueño Promedio"
          value={stats.avgSleep > 0 ? `${stats.avgSleep.toFixed(1)}h` : '0h'}
          sparklineData={stats.sleepSparkline || []}
          status={stats.avgSleep >= 7 ? 'good' : stats.avgSleep > 0 ? 'warning' : undefined}
        />

        {/* Días Activos con sparkline */}
        <KPICard
          icon={
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          label="Días Activos"
          value={`${stats.activeDays}`}
          sparklineData={stats.activitySparkline || []}
        />

        {/* Hidratación con sparkline */}
        <KPICard
          icon={
            <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          }
          label="Hidratación"
          value={stats.avgWater > 0 ? `${stats.avgWater.toFixed(1)}L` : '0L'}
          sparklineData={stats.waterSparkline || []}
          status={stats.avgWater >= 2 ? 'good' : stats.avgWater > 0 ? 'warning' : undefined}
        />
      </div>

      {/* Cycle Info */}
      {stats.cyclesThisMonth.length > 0 && (
        <div 
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔄</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              Ciclos del Mes
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.cyclesThisMonth.map((cycle, index) => (
              <div key={cycle.id} className="bg-[var(--surface-2)] rounded-lg p-3 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white" style={{ fontWeight: 600 }}>
                    Ciclo {index + 1}
                  </span>
                  {cycle.length && (
                    <span className="text-xs px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded">
                      {cycle.length} días
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-2)]">
                  Inicio: {format(parseISO(cycle.startDate), "d 'de' MMM", { locale: es })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secciones centrales - 2 columnas balanceadas */}
      <div className="grid grid-cols-12 gap-6">
        {/* Dolor y Estrés - col 6 */}
        <div 
          className="col-span-12 md:col-span-6 border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-5" style={{ fontWeight: 600 }}>
            Dolor y Estrés
          </h3>
          <div className="space-y-5">
            {/* Dolor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">Promedio</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white tabular-nums" style={{ fontWeight: 600 }}>
                    {stats.avgPain.toFixed(1)}/10
                  </span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                    {stats.painDays} días
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

            {/* Estrés */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">Promedio</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white tabular-nums" style={{ fontWeight: 600 }}>
                    {stats.avgStress.toFixed(1)}/10
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                    {stats.highStressDays} días alto
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

        {/* Ánimo y Energía - col 6 */}
        <div 
          className="col-span-12 md:col-span-6 border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-5" style={{ fontWeight: 600 }}>
            Ánimo y Energía
          </h3>
          <div className="space-y-5">
            {/* Ánimo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">Ánimo Promedio</span>
                <span className="text-sm font-semibold text-white tabular-nums" style={{ fontWeight: 600 }}>
                  {stats.avgMood.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '8px' }}>
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
                  style={{ width: `${(stats.avgMood / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Energía - pills iguales */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[var(--text-2)]">Distribución de Energía</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="px-3 py-2 bg-red-500/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-400 tabular-nums" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.low}
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-0.5">Baja</div>
                </div>
                <div className="px-3 py-2 bg-amber-500/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-amber-400 tabular-nums" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.medium}
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-0.5">Media</div>
                </div>
                <div className="px-3 py-2 bg-green-500/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-400 tabular-nums" style={{ fontWeight: 700 }}>
                    {stats.energyDistribution.high}
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-0.5">Alta</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Symptoms */}
      {stats.topSymptoms.length > 0 && (
        <div 
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔍</span>
            <h3 className="text-sm font-semibold text-white" style={{ fontWeight: 600 }}>
              Síntomas Más Frecuentes
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.topSymptoms.slice(0, 6).map((symptom, index) => (
              <div key={index} className="bg-[var(--surface-2)] rounded-lg p-3 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white truncate" style={{ fontWeight: 600 }}>
                    {symptom.name}
                  </span>
                  <span className="text-xs text-brand-primary font-semibold tabular-nums">
                    {symptom.count}
                  </span>
                </div>
                <div className="w-full bg-[var(--surface)] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-brand-primary transition-all duration-300"
                    style={{ width: `${(symptom.count / logs.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights del Mes mejorado */}
      <div 
        className="border border-[#2a2a2a] rounded-[18px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <h3 className="text-base font-semibold text-white" style={{ fontWeight: 600 }}>
              Insights del Mes
            </h3>
          </div>
          <div className="px-2.5 py-1 bg-brand-primary/20 rounded-full">
            <span className="text-xs font-medium text-brand-primary" style={{ fontWeight: 500 }}>
              85% confianza
            </span>
          </div>
        </div>

        {generateMonthlyInsights(stats, logs.length).length > 0 ? (
          <div className="space-y-3">
            {generateMonthlyInsights(stats, logs.length).map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-brand-primary mt-1 text-sm font-bold">•</span>
                <div className="flex-1">
                  <p className="text-sm text-white leading-relaxed" style={{ lineHeight: 1.6 }}>
                    {insight}
                  </p>
                  {index === 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                        Hábitos
                      </span>
                    </div>
                  )}
                  {index === 1 && stats.cyclesThisMonth.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                        Registro
                      </span>
                    </div>
                  )}
                  {(index === 2 || index === 3) && (stats.avgSleep < 6 || stats.painDays > 15 || stats.highStressDays > 10) && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                        Médico
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="w-12 h-12 text-[var(--text-2)] opacity-40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm font-medium text-white mb-1" style={{ fontWeight: 500 }}>
              Sin insights disponibles
            </p>
            <p className="text-xs text-[var(--text-2)]">
              Registra más días para obtener análisis personalizados
            </p>
          </div>
        )}
      </div>

      {/* Chat CTA Unificado */}
      <UnifiedChatCTA
        onStartChat={onStartChat}
        contextTitle={monthLabel}
        contextSubtitle="Explora ciclos, síntomas frecuentes y correlaciones del mes"
        contextInfo={{
          date: monthLabel,
          cyclePhase: undefined,
          cycleDay: undefined
        }}
        keyMetrics={{
          stress: stats.avgStress,
          sleep: stats.avgSleep,
          mood: stats.avgMood,
          energy: undefined
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
      {/* Sparkline en esquina superior derecha */}
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
    // Placeholder tenue si no hay datos
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

function calculateMonthlyStats(logs: DailyLog[], cycles: Cycle[]) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = endOfMonth(today).getDate();

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

  // Generar sparklines de 30 días
  const sleepSparkline: number[] = [];
  const waterSparkline: number[] = [];
  const activitySparkline: number[] = [];

  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = logs.find(l => l.date === dateStr);

    sleepSparkline.push(log?.sleepHours || 0);
    waterSparkline.push(log?.waterIntake || 0);
    activitySparkline.push(log?.physicalActivity && log.physicalActivity !== 'none' ? 1 : 0);
  }

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
    topSymptoms,
    sleepSparkline,
    waterSparkline,
    activitySparkline
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
