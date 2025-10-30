import React from 'react';
import type { DailyLog } from '../types.ts';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { ChatCTA } from './ChatCTA.tsx';

interface DailyInsightViewProps {
  log: DailyLog | null;
  onStartChat?: () => void;
  cyclePhase?: string;
  cycleDay?: number;
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
    <div className="max-w-[1200px] mx-auto px-4 space-y-6 animate-fadeIn">
      {/* Banner del día */}
      <div className="bg-[var(--surface)] rounded-[18px] p-5 border-b border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] capitalize mb-1" style={{ fontWeight: 700 }}>
              {dateStr}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {cyclePhase && (
              <div className="px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                🌙 {cyclePhase}
              </div>
            )}
            {cycleDay && (
              <div className="px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Día {cycleDay}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs Grid - 12 columns */}
      <div className="grid grid-cols-12 gap-4">
        {/* Estrés */}
        {log.stressScore !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Estrés
                </h3>
              </div>
              {/* Mini sparkline - últimos 7 días */}
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,12 4,8 8,10 12,6 16,9 20,5 24,7 28,4 32,6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
              {log.stressScore}/10
            </p>
            <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden mb-1">
              <div
                className="h-full bg-[var(--brand)] transition-all duration-300"
                style={{ width: `${(log.stressScore / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>
              {log.stressScore <= 3 ? 'Bajo' : log.stressScore <= 6 ? 'Moderado' : 'Alto'}
            </p>
          </div>
        )}

        {/* Sueño */}
        {log.sleepHours !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Sueño
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,10 4,7 8,8 12,5 16,6 20,4 24,5 28,3 32,4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
              {log.sleepHours}h
            </p>
            <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden mb-1">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${Math.min((log.sleepHours / 9) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>
              {log.sleepQuality ? `Calidad ${log.sleepQuality}/5` : 'Sin calidad'}
            </p>
          </div>
        )}

        {/* Hidratación */}
        {log.waterIntake !== undefined && log.waterIntake > 0 && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Hidratación
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,11 4,9 8,10 12,7 16,8 20,6 24,8 28,5 32,7" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
              {log.waterIntake}L
            </p>
            <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden mb-1">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${Math.min((log.waterIntake / 3) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>
              {log.waterIntake >= 2 ? 'Óptima' : 'Baja'}
            </p>
          </div>
        )}

        {/* Actividad */}
        {log.physicalActivity && log.physicalActivity !== 'none' && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Actividad
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,14 4,11 8,13 12,9 16,11 20,8 24,10 28,7 32,9" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
              {log.activityDuration || 0} min
            </p>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                log.physicalActivity === 'light' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                log.physicalActivity === 'moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`} style={{ fontWeight: 500 }}>
                {log.physicalActivity === 'light' ? 'Ligera' : log.physicalActivity === 'moderate' ? 'Moderada' : 'Intensa'}
              </span>
            </div>
          </div>
        )}

        {/* Dolor */}
        {log.painLevel !== undefined && log.painLevel > 0 && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Dolor
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,13 4,10 8,11 12,8 16,10 20,7 24,9 28,6 32,8" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
              {log.painLevel}/10
            </p>
            <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden mb-1">
              <div
                className="h-full bg-[var(--brand)] transition-all duration-300"
                style={{ width: `${(log.painLevel / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>
              {log.painLevel <= 3 ? 'Leve' : log.painLevel <= 6 ? 'Moderado' : 'Intenso'}
            </p>
          </div>
        )}

        {/* Ánimo */}
        {log.mood !== undefined && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getMoodEmoji(log.mood)}</span>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Ánimo
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,9 4,7 8,8 12,6 16,7 20,5 24,6 28,4 32,5" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontWeight: 700 }}>
              {log.mood}/10
            </p>
            <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition-all duration-300"
                style={{ width: `${(log.mood / 10) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>
              {log.mood <= 3 ? 'Bajo' : log.mood <= 6 ? 'Neutro' : 'Positivo'}
            </p>
          </div>
        )}

        {/* Energía */}
        {log.energyLevel && (
          <div className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Energía
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,10 4,8 8,9 12,7 16,8 20,6 24,7 28,5 32,6" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold capitalize mb-2 ${getEnergyColor(log.energyLevel)}`} style={{ fontWeight: 700 }}>
              {log.energyLevel === 'low' ? 'Baja' : log.energyLevel === 'medium' ? 'Media' : 'Alta'}
            </p>
            <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden mb-1">
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
        )}

        {/* Menstruación */}
        {log.periodIntensity !== undefined && log.periodIntensity > 0 && (
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 rounded-[18px] p-4 shadow-sm hover:shadow-md transition-all duration-200 group" style={{ minHeight: '108px' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                  Menstruación
                </h3>
              </div>
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-200">
                <svg width="32" height="16" viewBox="0 0 32 16" className="text-pink-400">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,8 4,6 8,7 12,5 16,6 20,4 24,5 28,3 32,4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-pink-400 mb-2" style={{ fontWeight: 700 }}>
              {getFlowIntensity(log.periodIntensity).text}
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-2)]" style={{ fontWeight: 500 }}>
              {log.periodColor && <span>Color: {log.periodColor}</span>}
              {log.hasClots && <span>• Con coágulos</span>}
            </div>
          </div>
        )}
      </div>

      {/* Insight del día */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Insight del Día
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-xs font-medium border border-[var(--brand)]/20 whitespace-nowrap" style={{ fontWeight: 500 }}>
            85% confianza
          </span>
        </div>
        <ul className="space-y-2.5">
          {generateDailyInsights(log).map((insight, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text)]" style={{ lineHeight: 1.6 }}>
              <span className="text-[var(--brand)] mt-0.5 font-bold">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Síntomas */}
      {log.symptoms && log.symptoms.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
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

      {/* Notas */}
      {log.notes && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
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

      {/* Chat CTA */}
      {onStartChat && (
        <div 
          className="bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] rounded-[18px] p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)]"
          onClick={onStartChat}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onStartChat()}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-lg font-semibold text-white" style={{ fontWeight: 600 }}>
                  Chatear con IA
                </h3>
              </div>
              <p className="text-sm text-white/90 mb-3" style={{ lineHeight: 1.5 }}>
                Pregunta sobre tus datos del día, síntomas y patrones
              </p>
              <div className="flex items-center gap-2 text-xs text-white/80" style={{ fontWeight: 500 }}>
                <span>📅 {dateStr}</span>
                {cyclePhase && <span>• 🌙 {cyclePhase}</span>}
              </div>
            </div>
            <button
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full font-medium transition-all duration-150 min-h-[44px] min-w-[44px] group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{ fontWeight: 500 }}
            >
              Iniciar chat →
            </button>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
};

function getMoodEmoji(mood?: number) {
  if (!mood) return '😐';
  if (mood <= 2) return '😢';
  if (mood <= 4) return '😕';
  if (mood <= 6) return '😐';
  if (mood <= 8) return '🙂';
  return '😊';
}

function getEnergyColor(energy?: string) {
  if (energy === 'low') return 'text-red-400';
  if (energy === 'medium') return 'text-amber-400';
  return 'text-green-400';
}

function getFlowIntensity(intensity?: number) {
  if (!intensity) return { text: 'Sin flujo', color: 'text-[var(--text-2)]' };
  if (intensity === 1) return { text: 'Ligero', color: 'text-pink-300' };
  if (intensity === 2) return { text: 'Moderado', color: 'text-pink-400' };
  if (intensity === 3) return { text: 'Abundante', color: 'text-pink-500' };
  return { text: 'Muy abundante', color: 'text-pink-600' };
}

function generateDailyInsights(log: DailyLog): string[] {
  const insights: string[] = [];

  if (log.sleepHours !== undefined) {
    if (log.sleepHours < 6) {
      insights.push('Tu sueño fue insuficiente. Intenta dormir 7-9 horas para mejor recuperación.');
    } else if (log.sleepHours >= 7 && log.sleepHours <= 9) {
      insights.push('Excelente descanso. Dormiste las horas recomendadas.');
    }
  }

  if (log.mood !== undefined && log.energyLevel) {
    if (log.mood <= 4 && log.energyLevel === 'low') {
      insights.push('Tu ánimo bajo y poca energía pueden estar relacionados. Considera una caminata corta.');
    }
  }

  if (log.painLevel !== undefined && log.painLevel >= 7) {
    insights.push('Nivel de dolor alto. Considera aplicar calor local y descansar.');
  }

  if (log.stressScore !== undefined && log.stressScore >= 7) {
    insights.push('Estrés elevado. Prueba técnicas de respiración o meditación.');
  }

  if (log.waterIntake !== undefined) {
    if (log.waterIntake < 1.5) {
      insights.push('Hidratación baja. Intenta beber al menos 2L de agua al día.');
    } else if (log.waterIntake >= 2) {
      insights.push('Bien hidratada. Mantén este hábito saludable.');
    }
  }

  if (log.physicalActivity && log.physicalActivity !== 'none') {
    insights.push('La actividad física ayuda a regular tu ciclo y mejorar tu ánimo.');
  }

  if (insights.length === 0) {
    insights.push('Sigue registrando tus datos para obtener insights personalizados.');
  }

  return insights;
}
