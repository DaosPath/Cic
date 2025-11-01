import React from 'react';
import type { DailyLog } from '../types.ts';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { useTranslation } from '../hooks/useTranslation.ts';

interface DailyInsightModalProps {
  log: DailyLog | null;
  onClose: () => void;
}

export const DailyInsightModal: React.FC<DailyInsightModalProps> = ({ log, onClose }) => {
  const { translateSymptomId } = useTranslation();
  if (!log) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-brand-surface rounded-[18px] border border-brand-border shadow-xl max-w-lg w-full p-8 text-center">
          <div className="p-4 rounded-xl bg-brand-primary/15 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>
            Sin Registro Hoy
          </h2>
          <p className="text-sm text-brand-text-dim mb-6">
            No hay datos registrados para el día de hoy. Registra tu información para ver el análisis.
          </p>
          <button
            onClick={onClose}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl hover:bg-brand-primary/90 transition-colors font-semibold"
            style={{ fontWeight: 600 }}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const dateStr = format(parseISO(log.date), "EEEE, d 'de' MMMM", { locale: es });

  const getMoodEmoji = (mood?: number) => {
    if (!mood) return '😐';
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😕';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const getEnergyColor = (energy?: string) => {
    if (energy === 'low') return 'text-red-400';
    if (energy === 'medium') return 'text-amber-400';
    return 'text-green-400';
  };

  const getFlowIntensity = (intensity?: number) => {
    if (!intensity) return { text: 'Sin flujo', color: 'text-brand-text-dim' };
    if (intensity === 1) return { text: 'Ligero', color: 'text-pink-300' };
    if (intensity === 2) return { text: 'Moderado', color: 'text-pink-400' };
    if (intensity === 3) return { text: 'Abundante', color: 'text-pink-500' };
    return { text: 'Muy abundante', color: 'text-pink-600' };
  };

  const flow = getFlowIntensity(log.periodIntensity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-[18px] border border-brand-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-brand-border bg-gradient-to-r from-brand-primary/10 to-brand-accent/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <h2 className="text-xl font-bold text-brand-text capitalize" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                  {dateStr}
                </h2>
              </div>
              <p className="text-sm text-brand-text-dim">
                Resumen completo de tu día
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-brand-surface-2 transition-colors text-brand-text-dim hover:text-brand-text flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Period */}
            {log.periodIntensity !== undefined && log.periodIntensity > 0 && (
              <div className="col-span-2 bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🩸</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Menstruación
                  </h3>
                </div>
                <p className={`text-lg font-bold ${flow.color}`} style={{ fontWeight: 700 }}>
                  {flow.text}
                </p>
              </div>
            )}

            {/* Mood */}
            {log.mood !== undefined && (
              <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getMoodEmoji(log.mood)}</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Estado de Ánimo
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-brand-surface rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
                      style={{ width: `${(log.mood / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    {log.mood}/10
                  </span>
                </div>
              </div>
            )}

            {/* Energy */}
            {log.energyLevel && (
              <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚡</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Energía
                  </h3>
                </div>
                <p className={`text-base font-bold capitalize ${getEnergyColor(log.energyLevel)}`} style={{ fontWeight: 700 }}>
                  {log.energyLevel === 'low' ? 'Baja' : log.energyLevel === 'medium' ? 'Media' : 'Alta'}
                </p>
              </div>
            )}

            {/* Pain */}
            {log.painLevel !== undefined && log.painLevel > 0 && (
              <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🩹</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Dolor
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-brand-surface rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
                      style={{ width: `${(log.painLevel / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-red-400" style={{ fontWeight: 600 }}>
                    {log.painLevel}/10
                  </span>
                </div>
              </div>
            )}

            {/* Stress */}
            {log.stressScore !== undefined && (
              <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🧘</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Estrés
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-brand-surface rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                      style={{ width: `${(log.stressScore / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-amber-400" style={{ fontWeight: 600 }}>
                    {log.stressScore}/10
                  </span>
                </div>
              </div>
            )}

            {/* Sleep */}
            {log.sleepHours !== undefined && (
              <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">😴</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Sueño
                  </h3>
                </div>
                <p className="text-lg font-bold text-brand-text" style={{ fontWeight: 700 }}>
                  {log.sleepHours}h
                  {log.sleepQuality && (
                    <span className="text-sm text-brand-text-dim ml-2">
                      ({log.sleepQuality}/5 ⭐)
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Water */}
            {log.waterIntake !== undefined && log.waterIntake > 0 && (
              <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💧</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Hidratación
                  </h3>
                </div>
                <p className="text-lg font-bold text-blue-400" style={{ fontWeight: 700 }}>
                  {log.waterIntake}L
                </p>
              </div>
            )}

            {/* Physical Activity */}
            {log.physicalActivity && log.physicalActivity !== 'none' && (
              <div className="col-span-2 bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏃</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Actividad Física
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-brand-text capitalize" style={{ fontWeight: 600 }}>
                    {log.physicalActivity === 'light' ? 'Ligera' : log.physicalActivity === 'moderate' ? 'Moderada' : 'Intensa'}
                  </span>
                  {log.activityDuration && (
                    <span className="text-sm text-brand-text-dim">
                      {log.activityDuration} min
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Symptoms */}
            {log.symptoms && log.symptoms.length > 0 && (
              <div className="col-span-2 bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔍</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Síntomas ({log.symptoms.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {log.symptoms.map((symptomId, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-medium"
                    >
                      {translateSymptomId(symptomId)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {log.notes && (
              <div className="col-span-2 bg-brand-surface-2 border border-brand-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📝</span>
                  <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                    Notas
                  </h3>
                </div>
                <p className="text-sm text-brand-text leading-relaxed">
                  {log.notes}
                </p>
              </div>
            )}
          </div>

          {/* AI Insights for the day */}
          <div className="mt-6 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <h3 className="text-sm font-semibold text-brand-text" style={{ fontWeight: 600 }}>
                Insight del Día
              </h3>
            </div>
            <p className="text-sm text-brand-text leading-relaxed">
              {generateDailyInsight(log)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-border">
          <button
            onClick={onClose}
            className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-xl hover:bg-brand-primary/90 transition-all duration-150"
            style={{ fontWeight: 600 }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

function generateDailyInsight(log: DailyLog): string {
  const insights: string[] = [];

  // Sleep insight
  if (log.sleepHours !== undefined) {
    if (log.sleepHours < 6) {
      insights.push('Tu sueño fue insuficiente hoy. Intenta dormir 7-9 horas para mejor recuperación.');
    } else if (log.sleepHours >= 7 && log.sleepHours <= 9) {
      insights.push('¡Excelente! Dormiste las horas recomendadas.');
    }
  }

  // Mood + Energy correlation
  if (log.mood !== undefined && log.energyLevel) {
    if (log.mood <= 4 && log.energyLevel === 'low') {
      insights.push('Tu ánimo bajo y poca energía pueden estar relacionados. Considera una caminata corta o actividad que disfrutes.');
    }
  }

  // Pain insight
  if (log.painLevel !== undefined && log.painLevel >= 7) {
    insights.push('Tu nivel de dolor es alto. Considera aplicar calor local y descansar. Si persiste, consulta con tu médico.');
  }

  // Stress insight
  if (log.stressScore !== undefined && log.stressScore >= 7) {
    insights.push('Tu nivel de estrés es elevado. Prueba técnicas de respiración o meditación para relajarte.');
  }

  // Hydration insight
  if (log.waterIntake !== undefined) {
    if (log.waterIntake < 1.5) {
      insights.push('Tu hidratación está baja. Intenta beber al menos 2L de agua al día.');
    } else if (log.waterIntake >= 2) {
      insights.push('¡Bien hecho! Estás bien hidratada.');
    }
  }

  // Activity insight
  if (log.physicalActivity && log.physicalActivity !== 'none') {
    insights.push('¡Genial! La actividad física ayuda a regular tu ciclo y mejorar tu ánimo.');
  }

  return insights.length > 0
    ? insights.join(' ')
    : 'Sigue registrando tus datos para obtener insights personalizados.';
}
