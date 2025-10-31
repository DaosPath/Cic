import React from 'react';
import type { DailyLog } from '../types.ts';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { UnifiedChatCTA } from './UnifiedChatCTA.tsx';

type AnalysisMode = 'simple' | 'ai';
type AnalysisView = 'dia' | 'semana' | 'mes' | 'ciclo' | '6m' | 'ano';
type AnalysisRange = '3m' | '6m' | '12m';

interface DailyInsightViewProps {
  log: DailyLog | null;
  onStartChat?: () => void;
  cyclePhase?: string;
  cycleDay?: number;
  // Props opcionales para compatibilidad (manejados por InsightsPage)
  view?: AnalysisView;
  range?: AnalysisRange;
  onModeChange?: (mode: AnalysisMode) => void;
  onViewChange?: (view: AnalysisView) => void;
  onRangeChange?: (range: AnalysisRange) => void;
  onExport?: () => void;
}

export const DailyInsightView: React.FC<DailyInsightViewProps> = ({
  log,
  onStartChat,
  cyclePhase,
  cycleDay
}) => {

  if (!log) {
    return (
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-[var(--surface-2)] rounded-[18px] p-8 border border-[var(--border)] text-center shadow-sm">
          <div className="p-4 rounded-xl bg-[var(--brand)]/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
            Sin Registro Hoy
          </h2>
          <p className="text-sm text-[var(--text-2)]" style={{ lineHeight: 1.5 }}>
            No hay datos registrados para el día de hoy. Registra tu información para ver el análisis.
          </p>
        </div>
      </div>
    );
  }

  const dateStr = format(parseISO(log.date), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <div className="max-w-[1200px] mx-auto px-4 animate-fadeIn">
      {/* Banner del día */}
      <div className="bg-[var(--surface)] rounded-[18px] p-5 border border-[var(--border)] shadow-sm" style={{ marginBottom: '24px' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] capitalize" style={{ fontWeight: 700, letterSpacing: '-0.2px', marginBottom: '12px' }}>
              {dateStr}
            </h1>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            {cyclePhase && (
              <div className="px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)] flex items-center justify-center" style={{ fontWeight: 500, height: '28px' }}>
                🌙 {cyclePhase}
              </div>
            )}
            {cycleDay && (
              <div className="px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)] flex items-center justify-center" style={{ fontWeight: 500, height: '28px' }}>
                Día {cycleDay}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-12 gap-4" style={{ marginBottom: '24px' }}>
        {/* Estrés */}
        {log.stressScore !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Estrés
              </h3>
            </div>
            
            {/* Squiggles decorativos */}
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,12 4,8 8,10 12,6 16,9 20,5 24,7 28,4 32,6" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.stressScore}/10
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-300"
                  style={{ width: `${(log.stressScore / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sueño */}
        {log.sleepHours !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Sueño
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,10 4,7 8,8 12,5 16,6 20,4 24,5 28,3 32,4" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.sleepHours}h
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${Math.min((log.sleepHours / 9) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Hidratación */}
        {log.waterIntake !== undefined && log.waterIntake > 0 && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Hidratación
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,11 4,9 8,10 12,7 16,8 20,6 24,8 28,5 32,7" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.waterIntake}L
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${Math.min((log.waterIntake / 3) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actividad */}
        {log.physicalActivity && log.physicalActivity !== 'none' && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Actividad
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,14 4,11 8,13 12,9 16,11 20,8 24,10 28,7 32,9" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.activityDuration || 0}min
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className={`h-full transition-all duration-300 ${
                    log.physicalActivity === 'light' ? 'bg-green-400' :
                    log.physicalActivity === 'moderate' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`}
                  style={{ width: log.physicalActivity === 'light' ? '33%' : log.physicalActivity === 'moderate' ? '66%' : '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Ánimo */}
        {log.mood !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[20px]">{getMoodEmoji(log.mood)}</span>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Ánimo
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,8 4,6 8,9 12,5 16,7 20,4 24,6 28,3 32,5" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.mood}/5
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-300"
                  style={{ width: `${(log.mood / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Energía */}
        {log.energyLevel && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[20px]">{getEnergyEmoji(log.energyLevel)}</span>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Energía
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,12 4,9 8,11 12,7 16,9 20,6 24,8 28,5 32,7" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-2xl font-bold text-[var(--text)] capitalize" style={{ fontWeight: 700, fontSize: '24px', lineHeight: '1' }}>
                {log.energyLevel}
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className={`h-full transition-all duration-300 ${
                    log.energyLevel === 'low' ? 'bg-red-400' :
                    log.energyLevel === 'medium' ? 'bg-amber-400' :
                    'bg-green-400'
                  }`}
                  style={{ width: log.energyLevel === 'low' ? '33%' : log.energyLevel === 'medium' ? '66%' : '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dolor */}
        {log.painLevel !== undefined && log.painLevel > 0 && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Dolor
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-red-400">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,10 4,8 8,12 12,6 16,10 20,4 24,8 28,2 32,6" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.painLevel}/10
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-red-400 transition-all duration-300"
                  style={{ width: `${(log.painLevel / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Calidad del Sueño */}
        {log.sleepQuality !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[20px]">⭐</span>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Calidad Sueño
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,11 4,8 8,9 12,6 16,7 20,5 24,6 28,4 32,5" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.sleepQuality}/5
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${(log.sleepQuality / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pasos */}
        {log.steps !== undefined && log.steps > 0 && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[20px]">👟</span>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Pasos
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-24">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,13 4,10 8,12 12,8 16,10 20,7 24,9 28,6 32,8" />
              </svg>
            </div>
            
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-2xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '24px', lineHeight: '1' }}>
                {log.steps.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="w-full bg-[var(--surface-2)] rounded-full overflow-hidden" style={{ height: '6px', borderRadius: '8px' }}>
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-300"
                  style={{ width: `${Math.min((log.steps / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insight del día */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Insight del Día
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-xs font-medium border border-[var(--brand)]/20 whitespace-nowrap ml-auto" style={{ fontWeight: 500 }}>
            85% confianza
          </span>
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {generateDailyInsights(log).map((insight, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text)]" style={{ lineHeight: 1.45 }}>
              <span className="text-[var(--brand)] mt-0.5 font-bold">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Síntomas */}
      {log.symptoms && log.symptoms.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔍</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Síntomas ({log.symptoms.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {log.symptoms.map((symptomId, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-xs font-medium border border-[var(--brand)]/20"
                style={{ fontWeight: 500 }}
              >
                {symptomId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
        {/* Sueño Detallado */}
        {(log.bedTime || log.wakeTime || log.napMinutes) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🛏️</span>
              <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
                Detalles del Sueño
              </h3>
            </div>
            <div className="space-y-2">
              {log.bedTime && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Hora de dormir</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.bedTime}</span>
                </div>
              )}
              {log.wakeTime && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Hora de despertar</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.wakeTime}</span>
                </div>
              )}
              {log.napMinutes && log.napMinutes > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Siesta</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.napMinutes} min</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actividad Física Detallada */}
        {(log.activityType || log.activityIntensity || log.caloriesBurned) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏃‍♀️</span>
              <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
                Detalles de Actividad
              </h3>
            </div>
            <div className="space-y-2">
              {log.activityType && log.activityType.length > 0 && (
                <div>
                  <span className="text-xs text-[var(--text-2)]">Tipo</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {log.activityType.map((type, index) => (
                      <span key={index} className="px-2 py-0.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {log.activityIntensity && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Intensidad (RPE)</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.activityIntensity}/10</span>
                </div>
              )}
              {log.caloriesBurned && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Calorías quemadas</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.caloriesBurned} kcal</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Consumo */}
        {(log.caffeineIntake || log.alcoholIntake || log.cravings) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">☕</span>
              <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
                Consumo
              </h3>
            </div>
            <div className="space-y-2">
              {log.caffeineIntake && log.caffeineIntake > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Cafeína</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.caffeineIntake} tazas</span>
                </div>
              )}
              {log.alcoholIntake && log.alcoholIntake > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Alcohol</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.alcoholIntake} unidades</span>
                </div>
              )}
              {log.cravings && log.cravings.length > 0 && (
                <div>
                  <span className="text-xs text-[var(--text-2)]">Antojos</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {log.cravings.map((craving, index) => (
                      <span key={index} className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs">
                        {craving}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Métricas de Salud */}
        {(log.restingHeartRate || log.bloodPressure || log.basalTemp || log.weight) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">❤️</span>
              <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
                Métricas de Salud
              </h3>
            </div>
            <div className="space-y-2">
              {log.restingHeartRate && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">FC en reposo</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.restingHeartRate} bpm</span>
                </div>
              )}
              {log.bloodPressure && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Presión arterial</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.bloodPressure} mmHg</span>
                </div>
              )}
              {log.basalTemp && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Temp. basal</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.basalTemp}°C</span>
                </div>
              )}
              {log.weight && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-2)]">Peso</span>
                  <span className="text-sm font-medium text-[var(--text)]">{log.weight} kg</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Medicamentos y Suplementos */}
      {((log.medications && log.medications.length > 0) || (log.supplements && log.supplements.length > 0)) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💊</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Medicamentos y Suplementos
            </h3>
          </div>
          <div className="space-y-3">
            {log.medications && log.medications.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-2)] mb-2">Medicamentos</h4>
                <div className="space-y-1">
                  {log.medications.map((med, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text)]">{med.name}</span>
                      <div className="text-[var(--text-2)] text-xs">
                        {med.dose} {med.time && `• ${med.time}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {log.supplements && log.supplements.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-2)] mb-2">Suplementos</h4>
                <div className="flex flex-wrap gap-1">
                  {log.supplements.map((supplement, index) => (
                    <span key={index} className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs">
                      {supplement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      {log.notes && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📝</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Notas
            </h3>
          </div>
          <p className="text-sm text-[var(--text)]" style={{ lineHeight: 1.6 }}>
            {log.notes}
          </p>
        </div>
      )}

      {/* Chat CTA Unificado */}
      <UnifiedChatCTA
        onStartChat={onStartChat}
        contextTitle={dateStr}
        contextSubtitle={`Pregunta sobre tus datos del día, síntomas y patrones${cyclePhase ? ` • ${cyclePhase}` : ''}`}
        contextInfo={{
          date: dateStr,
          cyclePhase,
          cycleDay
        }}
        keyMetrics={{
          stress: log?.stressScore,
          sleep: log?.sleepHours,
          mood: log?.mood,
          energy: log?.energyLevel
        }}
        mode="ai"
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 200ms ease-out;
        }
        
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        
        /* Ensure consistent transitions */
        * {
          transition-duration: 180ms;
          transition-timing-function: ease;
        }
        
        /* Focus states for accessibility */
        button:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

function getMoodEmoji(mood: number): string {
  if (mood <= 1) return '😢';
  if (mood <= 2) return '😕';
  if (mood <= 3) return '😐';
  if (mood <= 4) return '🙂';
  return '😊';
}

function getEnergyEmoji(energy: string): string {
  if (energy === 'low') return '🔋';
  if (energy === 'medium') return '⚡';
  return '✨';
}

function generateDailyInsights(log: DailyLog): string[] {
  const insights: string[] = [];

  // Análisis del sueño
  if (log.sleepHours !== undefined) {
    if (log.sleepHours < 6) {
      insights.push('Tu sueño fue insuficiente. Intenta dormir 7-9 horas para mejor recuperación.');
    } else if (log.sleepHours >= 7 && log.sleepHours <= 9) {
      if (log.sleepQuality && log.sleepQuality >= 4) {
        insights.push('Excelente descanso. Dormiste las horas recomendadas con buena calidad.');
      } else {
        insights.push('Buena duración de sueño, pero considera mejorar la calidad del descanso.');
      }
    }
  }

  // Relación ánimo-energía
  if (log.mood !== undefined && log.energyLevel) {
    if (log.mood <= 2 && log.energyLevel === 'low') {
      insights.push('Tu ánimo bajo y poca energía pueden estar relacionados. Considera una caminata corta o exposición al sol.');
    } else if (log.mood >= 4 && log.energyLevel === 'high') {
      insights.push('¡Excelente combinación de buen ánimo y alta energía! Aprovecha este momento.');
    }
  }

  // Análisis del dolor
  if (log.painLevel !== undefined && log.painLevel >= 7) {
    if (log.painLocations && log.painLocations.length > 0) {
      insights.push(`Dolor alto en ${log.painLocations.join(', ')}. Considera aplicar calor local y descansar.`);
    } else {
      insights.push('Nivel de dolor alto. Considera aplicar calor local y descansar.');
    }
  }

  // Estrés y manejo
  if (log.stressScore !== undefined && log.stressScore >= 7) {
    if (log.stressTriggers && log.stressTriggers.length > 0) {
      insights.push(`Estrés elevado por ${log.stressTriggers.join(', ')}. Prueba técnicas de respiración o meditación.`);
    } else {
      insights.push('Estrés elevado. Prueba técnicas de respiración o meditación.');
    }
  }

  // Hidratación
  if (log.waterIntake !== undefined) {
    if (log.waterIntake < 1.5) {
      insights.push('Hidratación baja. Intenta beber al menos 2L de agua al día.');
    } else if (log.waterIntake >= 2.5) {
      insights.push('¡Excelente hidratación! Mantén este hábito saludable.');
    }
  }

  // Actividad física
  if (log.physicalActivity && log.physicalActivity !== 'none') {
    if (log.activityDuration && log.activityDuration >= 30) {
      insights.push('¡Genial! Cumpliste con los 30 minutos recomendados de actividad física.');
    } else {
      insights.push('La actividad física ayuda a regular tu ciclo y mejorar tu ánimo.');
    }
  }

  // Análisis de pasos
  if (log.steps !== undefined) {
    if (log.steps >= 10000) {
      insights.push('¡Increíble! Superaste los 10,000 pasos recomendados.');
    } else if (log.steps >= 7500) {
      insights.push('Buen nivel de actividad diaria. Intenta llegar a 10,000 pasos.');
    }
  }

  // Cafeína y sueño
  if (log.caffeineIntake && log.caffeineIntake > 3 && log.sleepQuality && log.sleepQuality <= 2) {
    insights.push('Alto consumo de cafeína puede estar afectando tu calidad de sueño.');
  }

  // Síntomas frecuentes
  if (log.symptoms && log.symptoms.length >= 3) {
    insights.push(`Registraste ${log.symptoms.length} síntomas hoy. Considera descansar más.`);
  }

  if (insights.length === 0) {
    insights.push('Sigue registrando tus datos para obtener insights personalizados más detallados.');
  }

  return insights;
}