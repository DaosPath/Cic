import React from 'react';
import type { DailyLog } from '../types.ts';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { UnifiedChatCTA } from './UnifiedChatCTA.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';

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
  const { t, translateEnergyLevel, translateSymptomId } = useTranslation();

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
            {t('noLogTodayTitle')}
          </h2>
          <p className="text-sm text-[var(--text-2)]" style={{ lineHeight: 1.5 }}>
            {t('noLogTodayDescription')}
          </p>
        </div>
      </div>
    );
  }

  const dateStr = format(parseISO(log.date), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <div className="max-w-[1200px] mx-auto px-4 animate-fadeIn">
      {/* 1) Encabezado del día */}
      <div 
        className="rounded-[18px] p-5 border border-[#2a2a2a] shadow-[0_4px_16px_rgba(0,0,0,0.3)]" 
        style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] capitalize" style={{ fontWeight: 700, letterSpacing: '-0.2px', marginBottom: '6px' }}>
              {dateStr}
            </h1>
            <p className="text-xs text-[var(--text-2)]" style={{ opacity: 0.7 }}>
              Análisis completo del día
            </p>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            {cyclePhase && (
              <div className="px-3 py-1.5 bg-[var(--brand)]/10 rounded-full text-xs font-medium text-[var(--text)] flex items-center justify-center" style={{ fontWeight: 500, height: '28px' }}>
                🌙 {cyclePhase}
              </div>
            )}
            {cycleDay && (
              <div className="px-3 py-1.5 bg-[var(--accent)]/10 rounded-full text-xs font-medium text-[var(--text)] flex items-center justify-center" style={{ fontWeight: 500, height: '28px' }}>
                Día {cycleDay}
              </div>
            )}
          </div>
        </div>
        {/* Separador tenue */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" style={{ opacity: 0.5 }} />
      </div>

      {/* 2) Menstruación */}
      {log.periodIntensity !== undefined && log.periodIntensity > 0 && (
        <div 
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]" 
          style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🩸</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Menstruación
            </h3>
            {log.aiGenerated && (
              <span 
                className="ml-auto px-2 py-0.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-xs font-medium cursor-help" 
                title="Detectado automáticamente por IA"
                style={{ fontWeight: 500 }}
              >
                Auto IA
              </span>
            )}
          </div>
          
          {/* Chips en una fila */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Intensidad como chip activo */}
            <div className="px-3 py-1.5 bg-[var(--brand)]/20 rounded-full text-xs font-medium text-[var(--text)]" style={{ fontWeight: 500 }}>
              {['Sin', 'Manchado', 'Ligero', 'Medio', 'Abundante'][log.periodIntensity]}
            </div>
            
            {/* Color */}
            {log.periodColor && (
              <div className="px-3 py-1.5 bg-[var(--brand)]/20 rounded-full text-xs font-medium text-[var(--text)]" style={{ fontWeight: 500 }}>
                {log.periodColor === 'bright-red' ? 'Rojo brillante' :
                 log.periodColor === 'dark-red' ? 'Rojo oscuro' :
                 log.periodColor === 'brown' ? 'Marrón' : 'Rosa'}
              </div>
            )}

            {/* Consistencia */}
            {log.periodConsistency && (
              <div className="px-3 py-1.5 bg-[var(--brand)]/20 rounded-full text-xs font-medium text-[var(--text)]" style={{ fontWeight: 500 }}>
                {log.periodConsistency === 'watery' ? 'Acuoso' :
                 log.periodConsistency === 'thick' ? 'Espeso' : 'Con coágulos'}
              </div>
            )}

            {/* Coágulos */}
            {log.hasClots && (
              <div className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium" style={{ fontWeight: 500 }}>
                Coágulos
              </div>
            )}
          </div>

          {/* Productos - Mini tabla compacta */}
          {(log.periodProducts || log.productCount || log.hasLeaks) && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-2)] mb-3" style={{ fontWeight: 500 }}>Productos</p>
              {log.periodProducts && log.periodProducts.length > 0 ? (
                <div className="space-y-2">
                  {log.periodProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 px-3 bg-[var(--brand)]/15 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {product === 'pad' ? '🩹' :
                           product === 'tampon' ? '🧻' :
                           product === 'cup' ? '🥤' : '💿'}
                        </span>
                        <span className="text-xs text-[var(--text)]">
                          {product === 'pad' ? 'Toalla' :
                           product === 'tampon' ? 'Tampón' :
                           product === 'cup' ? 'Copa' : 'Disco'}
                        </span>
                      </div>
                      {log.productCount && (
                        <span className="text-xs font-medium text-[var(--text-2)]">×{log.productCount}</span>
                      )}
                    </div>
                  ))}
                  {log.hasLeaks && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <span className="text-xs text-amber-400">⚠️ Fugas registradas</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-2)] italic" style={{ opacity: 0.6 }}>
                  Sin productos registrados
                </p>
              )}
            </div>
          )}

          {/* Inicio/Fin del período */}
          {(log.periodStartedToday || log.periodEndedToday) && (
            <div className="mt-3 flex gap-2">
              {log.periodStartedToday && (
                <span className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-medium border border-pink-500/20">
                  Período comenzó hoy
                </span>
              )}
              {log.periodEndedToday && (
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                  Período terminó hoy
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3) Fertilidad y Ovulación */}
      {(log.ovulationTest || log.cervicalFluid || log.cervixPosition || log.sexualActivity) && (
        <div 
          className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)] relative" 
          style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
          }}
        >
          {/* Banner ventana fértil */}
          {cyclePhase && (cyclePhase === 'Ovulación' || cyclePhase === 'Folicular') && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-purple-400/50 to-purple-500/50 rounded-t-[18px]" />
          )}
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🥚</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Fertilidad y Ovulación
            </h3>
            {cyclePhase && (cyclePhase === 'Ovulación' || cyclePhase === 'Folicular') && (
              <span className="ml-auto px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20">
                Ventana fértil
              </span>
            )}
          </div>

          {/* Píldoras principales: Test LH y Moco */}
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Test de Ovulación */}
            {log.ovulationTest && (
              <div className={`px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 ${
                log.ovulationTest === 'positive' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                log.ovulationTest === 'negative' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/30' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`} style={{ fontWeight: 500 }}>
                <span className="text-base">
                  {log.ovulationTest === 'positive' ? '✓' :
                   log.ovulationTest === 'negative' ? '✗' : '?'}
                </span>
                Test LH: {log.ovulationTest === 'positive' ? 'Positivo' :
                         log.ovulationTest === 'negative' ? 'Negativo' : 'No claro'}
              </div>
            )}

            {/* Moco Cervical */}
            {log.cervicalFluid && (
              <div className="px-4 py-2.5 bg-[var(--accent)]/20 rounded-xl text-sm font-medium text-[var(--text)] inline-flex items-center gap-2" style={{ fontWeight: 500 }}>
                <span className="text-base">💧</span>
                Moco: {log.cervicalFluid === 'dry' ? 'Seco' :
                       log.cervicalFluid === 'sticky' ? 'Pegajoso' :
                       log.cervicalFluid === 'creamy' ? 'Cremoso' :
                       log.cervicalFluid === 'watery' ? 'Acuoso' : 'Clara de huevo'}
                {log.cervicalFluid === 'egg-white' && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs" style={{ fontWeight: 600 }}>
                    Más fértil
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Cérvix - Fila de tres chips */}
          {(log.cervixPosition || log.cervixFirmness || log.cervixOpening) && (
            <div className="mb-4">
              <p className="text-xs text-[var(--text-2)] mb-2" style={{ fontWeight: 500 }}>Cérvix</p>
              <div className="flex flex-wrap gap-2">
                {log.cervixPosition && (
                  <div className="px-3 py-1.5 bg-[var(--accent)]/20 rounded-full text-xs text-[var(--text)]" style={{ fontWeight: 500 }}>
                    {log.cervixPosition === 'high' ? 'Alto' : log.cervixPosition === 'medium' ? 'Medio' : 'Bajo'}
                  </div>
                )}
                {log.cervixFirmness && (
                  <div className="px-3 py-1.5 bg-[var(--accent)]/20 rounded-full text-xs text-[var(--text)]" style={{ fontWeight: 500 }}>
                    {log.cervixFirmness === 'firm' ? 'Firme' : 'Suave'}
                  </div>
                )}
                {log.cervixOpening && (
                  <div className="px-3 py-1.5 bg-[var(--accent)]/20 rounded-full text-xs text-[var(--text)]" style={{ fontWeight: 500 }}>
                    {log.cervixOpening === 'open' ? 'Abierto' : 'Cerrado'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actividad Sexual */}
          {log.sexualActivity && (
            <div className="pt-3 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-2)]">Actividad Sexual</span>
                <span className="px-2 py-1 bg-pink-500/10 text-pink-400 rounded text-xs font-medium">
                  Sí
                </span>
              </div>
              {log.sexualActivityTiming && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-2)]">Momento</span>
                  <span className="text-xs text-[var(--text)]">
                    {log.sexualActivityTiming === 'before-ovulation' ? 'Antes de ovulación' :
                     log.sexualActivityTiming === 'during-ovulation' ? 'Durante ovulación' : 'Después de ovulación'}
                  </span>
                </div>
              )}
              {log.protection !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-2)]">Protección</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    log.protection ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {log.protection ? 'Sí' : 'No'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-12 gap-4" style={{ marginBottom: '24px' }}>
        {/* 4) Estrés - KPI unificado */}
        {log.stressScore !== undefined && (
          <div 
            className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-lg hover:border-[var(--brand)]/30 transition-all duration-200 relative overflow-hidden group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2" 
            style={{ height: '96px', padding: '16px' }}
            tabIndex={0}
            role="button"
            aria-label={`Nivel de estrés: ${log.stressScore} de 10`}
          >
            {/* Icono + etiqueta arriba */}
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Estrés
              </h3>
            </div>
            
            {/* Sparkline tenue y consistente */}
            <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--brand)]">
                <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,12 L8,8 L16,10 L24,6 L32,9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            {/* Valor grande al centro */}
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <p className="text-3xl font-bold text-[var(--text)] tabular-nums" style={{ fontWeight: 700, fontSize: '28px', lineHeight: '1' }}>
                {log.stressScore}/10
              </p>
            </div>
            
            {/* Barra/medidor abajo */}
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
        
        {/* Sin registro - marcador amable */}
        {log.stressScore === undefined && (
          <div 
            className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm relative overflow-hidden" 
            style={{ height: '96px', padding: '16px', opacity: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Estrés
              </h3>
            </div>
            <div className="flex items-center justify-center flex-1" style={{ marginTop: '8px' }}>
              <p className="text-xs text-[var(--text-2)] italic">Sin registro</p>
            </div>
          </div>
        )}

        {/* 4) Sueño - KPI unificado */}
        {log.sleepHours !== undefined && (
          <div 
            className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-200 relative overflow-hidden group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2" 
            style={{ height: '96px', padding: '16px' }}
            tabIndex={0}
            role="button"
            aria-label={`Horas de sueño: ${log.sleepHours} horas`}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Sueño
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,10 L8,7 L16,8 L24,5 L32,6" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* 4) Hidratación - KPI unificado */}
        {log.waterIntake !== undefined && log.waterIntake > 0 && (
          <div 
            className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-200 relative overflow-hidden group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2" 
            style={{ height: '96px', padding: '16px' }}
            tabIndex={0}
            role="button"
            aria-label={`Hidratación: ${log.waterIntake} litros`}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Hidratación
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-[var(--accent)]">
                <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,11 L8,9 L16,10 L24,7 L32,8" strokeLinecap="round" strokeLinejoin="round" />
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
                {translateEnergyLevel(log.energyLevel)}
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

        {/* 4) Dolor - KPI unificado */}
        {log.painLevel !== undefined && log.painLevel > 0 && (
          <div 
            className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-lg hover:border-[var(--brand)]/30 transition-all duration-200 relative overflow-hidden group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2" 
            style={{ height: '96px', padding: '16px' }}
            tabIndex={0}
            role="button"
            aria-label={`Nivel de dolor: ${log.painLevel} de 10`}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>
                Dolor
              </h3>
            </div>
            
            <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-red-400">
                <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,10 L8,8 L16,12 L24,6 L32,9" strokeLinecap="round" strokeLinejoin="round" />
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

      {/* 5) Insight del día */}
      <div 
        className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]" 
        style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Insight del Día
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-xs font-medium whitespace-nowrap ml-auto" style={{ fontWeight: 500 }}>
            85% confianza
          </span>
        </div>

        {/* Chips de fuente */}
        <div className="flex flex-wrap gap-2 mb-4">
          {log.sleepHours && (
            <button className="px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs hover:bg-[var(--accent)]/20 transition-colors" style={{ fontWeight: 500 }}>
              Sueño
            </button>
          )}
          {log.stressScore && (
            <button className="px-2 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-xs hover:bg-[var(--brand)]/20 transition-colors" style={{ fontWeight: 500 }}>
              Estrés
            </button>
          )}
          {log.ovulationTest && (
            <button className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs hover:bg-purple-500/20 transition-colors" style={{ fontWeight: 500 }}>
              LH
            </button>
          )}
          {log.mood && (
            <button className="px-2 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-xs hover:bg-[var(--brand)]/20 transition-colors" style={{ fontWeight: 500 }}>
              Ánimo
            </button>
          )}
        </div>

        {/* Estructura: Hallazgo, Por qué importa, Recomendaciones */}
        <div className="space-y-4">
          {generateDailyInsights(log).slice(0, 3).map((insight, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-[var(--brand)] mt-0.5 text-sm">•</span>
                <p className="text-sm text-[var(--text)] flex-1" style={{ lineHeight: 1.5 }}>
                  {insight}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Ver evidencias */}
        {generateDailyInsights(log).length > 3 && (
          <button 
            className="mt-4 w-full py-2 text-xs text-[var(--text-2)] hover:text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-2)] transition-all"
            style={{ fontWeight: 500 }}
          >
            Ver evidencias ({generateDailyInsights(log).length - 3} más)
          </button>
        )}
      </div>

      {/* Síntomas Detallados por Categoría */}
      {(log.symptoms && log.symptoms.length > 0) || hasDetailedSymptoms(log) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔍</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Síntomas Detallados
            </h3>
            {/* 10) Marcadores IA coherentes */}
            {log.aiGenerated && (
              <span 
                className="ml-auto px-2 py-0.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-xs font-medium cursor-help" 
                title="Detectado automáticamente por IA"
                style={{ fontWeight: 500 }}
              >
                Auto IA
              </span>
            )}
            {log.aiAmbiguousFields && log.aiAmbiguousFields.length > 0 && (
              <span 
                className="ml-auto px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-xs font-medium cursor-help border border-amber-500/20" 
                title="Datos ambiguos que requieren confirmación"
                style={{ fontWeight: 500 }}
              >
                ⚠️ Ambiguo
              </span>
            )}
          </div>

          {/* Síntomas Generales */}
          {log.symptoms && log.symptoms.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-[var(--text-2)] mb-2">Generales</p>
              <div className="flex flex-wrap gap-2">
                {log.symptoms.map((symptomId, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-xs font-medium border border-[var(--brand)]/20"
                  >
                    {translateSymptomId(symptomId)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gastrointestinales */}
          {(log.nausea || log.vomiting || log.diarrhea || log.constipation || log.gas || log.appetite) && (
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-2)] mb-2">🤢 Gastrointestinales</p>
              <div className="flex flex-wrap gap-2">
                {log.nausea && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Náuseas</span>}
                {log.vomiting && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Vómitos</span>}
                {log.diarrhea && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Diarrea</span>}
                {log.constipation && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Estreñimiento</span>}
                {log.gas && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Gases</span>}
                {log.appetite && (
                  <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">
                    Apetito: {log.appetite === 'decreased' ? 'Disminuido' : log.appetite === 'increased' ? 'Aumentado' : 'Normal'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Neurológicos */}
          {(log.headache || log.migraine || log.migraineWithAura || log.dizziness || log.brainFog) && (
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-2)] mb-2">🧠 Neurológicos</p>
              <div className="flex flex-wrap gap-2">
                {log.headache && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Dolor de cabeza</span>}
                {log.migraine && <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium">Migraña</span>}
                {log.migraineWithAura && <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium">Migraña con aura</span>}
                {log.dizziness && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Mareos</span>}
                {log.brainFog && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Niebla mental</span>}
              </div>
            </div>
          )}

          {/* Musculoesqueléticos */}
          {(log.backPain || log.pelvicPain || log.muscleTension) && (
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-2)] mb-2">💪 Musculoesqueléticos</p>
              <div className="flex flex-wrap gap-2">
                {log.backPain && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Dolor de espalda</span>}
                {log.pelvicPain && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Dolor pélvico</span>}
                {log.muscleTension && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Tensión muscular</span>}
              </div>
            </div>
          )}

          {/* Senos y Piel */}
          {(log.breastTenderness || log.breastSwelling || log.acne) && (
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-2)] mb-2">👗 Senos y Piel</p>
              <div className="flex flex-wrap gap-2">
                {log.breastTenderness && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Sensibilidad en senos</span>}
                {log.breastSwelling && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Hinchazón de senos</span>}
                {log.acne && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Acné</span>}
              </div>
            </div>
          )}

          {/* Urinarios y Vaginales */}
          {(log.urinaryBurning || log.urinaryFrequency || log.vaginalItching || log.vaginalOdor || log.vaginalDischarge) && (
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-2)] mb-2">🚽 Urinarios y Vaginales</p>
              <div className="flex flex-wrap gap-2">
                {log.urinaryBurning && <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-medium">Ardor al orinar</span>}
                {log.urinaryFrequency && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Frecuencia urinaria</span>}
                {log.vaginalItching && <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-medium">Picazón vaginal</span>}
                {log.vaginalOdor && <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-medium">Olor vaginal</span>}
                {log.vaginalDischarge && (
                  <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">
                    Flujo: {log.vaginalDischarge}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Otros */}
          {(log.bloating || log.waterRetention || log.hasColdSymptoms || log.hasCovidSymptoms) && (
            <div>
              <p className="text-xs text-[var(--text-2)] mb-2">🔄 Otros</p>
              <div className="flex flex-wrap gap-2">
                {log.bloating && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Hinchazón</span>}
                {log.waterRetention && <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">Retención de líquidos</span>}
                {log.hasColdSymptoms && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">Síntomas de resfriado</span>}
                {log.hasCovidSymptoms && <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium">Síntomas de COVID</span>}
              </div>
            </div>
          )}
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

        {/* 6) Actividad - Detalles */}
        {(log.activityType || log.activityIntensity || log.caloriesBurned || log.physicalActivity) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏃‍♀️</span>
              <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
                Actividad
              </h3>
            </div>
            {log.activityType && log.activityType.length > 0 ? (
              <div className="space-y-3">
                {/* Tipo como chip */}
                <div className="flex flex-wrap gap-2">
                  {log.activityType.map((type, index) => (
                    <span key={index} className="px-3 py-1.5 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-xs" style={{ fontWeight: 500 }}>
                      {type}
                    </span>
                  ))}
                </div>
                
                {/* Duración y calorías alineadas */}
                <div className="flex items-center gap-4">
                  {log.activityDuration && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[var(--text-2)]">Duración:</span>
                      <span className="text-sm font-medium text-[var(--text)]">{log.activityDuration}min</span>
                    </div>
                  )}
                  {log.caloriesBurned && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[var(--text-2)]">Calorías:</span>
                      <span className="text-sm font-medium text-[var(--text)]">{log.caloriesBurned} kcal</span>
                    </div>
                  )}
                </div>

                {/* Tira de tags adicionales */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                  {log.activityIntensity && (
                    <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">
                      RPE {log.activityIntensity}/10
                    </span>
                  )}
                  {log.steps && log.steps > 0 && (
                    <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">
                      {log.steps.toLocaleString()} pasos
                    </span>
                  )}
                  {log.restingHeartRate && (
                    <span className="px-2 py-1 bg-[var(--brand)]/20 rounded text-xs text-[var(--text)]">
                      FC {log.restingHeartRate} bpm
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-2)] italic" style={{ opacity: 0.6 }}>
                Sin actividad registrada
              </p>
            )}
          </div>
        )}

        {/* 6) Consumo */}
        {(log.waterIntake || log.caffeineIntake || log.alcoholIntake || log.cravings) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">☕</span>
              <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
                Consumo
              </h3>
            </div>
            {(log.waterIntake || log.caffeineIntake || log.alcoholIntake) ? (
              <div className="space-y-3">
                {/* Agua, cafeína, alcohol con iconos */}
                <div className="space-y-2">
                  {log.waterIntake && log.waterIntake > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💧</span>
                        <span className="text-xs text-[var(--text-2)]">Agua</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{log.waterIntake}L</span>
                    </div>
                  )}
                  {log.caffeineIntake && log.caffeineIntake > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">☕</span>
                        <span className="text-xs text-[var(--text-2)]">Cafeína</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{log.caffeineIntake} tazas</span>
                    </div>
                  )}
                  {log.alcoholIntake && log.alcoholIntake > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🍷</span>
                        <span className="text-xs text-[var(--text-2)]">Alcohol</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{log.alcoholIntake} unidades</span>
                    </div>
                  )}
                </div>

                {/* Antojos como chips resaltados */}
                {log.cravings && log.cravings.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-2)] mb-2 block">Antojos</span>
                    <div className="flex flex-wrap gap-2">
                      {log.cravings.map((craving, index) => (
                        <span key={index} className="px-3 py-1.5 bg-[var(--accent)]/20 text-[var(--accent)] rounded-full text-xs" style={{ fontWeight: 500 }}>
                          {craving}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-2)] italic" style={{ opacity: 0.6 }}>
                Sin consumos registrados
              </p>
            )}
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

      {/* 7) Medicamentos y cuidado */}
      {((log.medications && log.medications.length > 0) || (log.supplements && log.supplements.length > 0) || log.contraception || log.homeRemedies) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💊</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Medicamentos y Cuidado
            </h3>
          </div>
          <div className="space-y-4">
            {/* Medicamentos - Lista estilo receta */}
            {log.medications && log.medications.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-2)] mb-2" style={{ fontWeight: 500 }}>Medicamentos</h4>
                <div className="space-y-2">
                  {log.medications.map((med, index) => (
                    <div key={index} className="flex items-center gap-2 p-2.5 bg-[var(--brand)]/15 rounded-lg">
                      <span className="text-sm font-medium text-[var(--text)] flex-1">{med.name}</span>
                      <span className="px-2 py-0.5 bg-[var(--brand)]/20 text-[var(--brand)] rounded text-xs" style={{ fontWeight: 500 }}>
                        {med.dose}
                      </span>
                      {med.time && (
                        <span className="px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] rounded text-xs" style={{ fontWeight: 500 }}>
                          {med.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anticonceptivo - Bloque aparte con icono */}
            {(log.contraception || log.contraceptionDay !== undefined || log.hasIUD) && (
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">💊</span>
                  <h4 className="text-xs font-medium text-[var(--text-2)]" style={{ fontWeight: 500 }}>Anticonceptivo</h4>
                </div>
                <div className="space-y-2">
                  {log.contraception && (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-[var(--text-2)]">Tipo</span>
                      <span className="text-sm font-medium text-[var(--text)]">{log.contraception}</span>
                    </div>
                  )}
                  {log.contraceptionDay !== undefined && (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-[var(--text-2)]">Día del blíster</span>
                      <span className="px-3 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded-full text-sm font-medium">
                        Día {log.contraceptionDay}
                      </span>
                    </div>
                  )}
                  {log.hasIUD && (
                    <div className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/20 inline-flex items-center gap-1.5">
                      <span>✓</span>
                      DIU activo
                    </div>
                  )}
                  {/* Badge de adherencia (placeholder) */}
                  {log.contraceptionDay !== undefined && (
                    <div className="mt-2 px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs inline-block" style={{ fontWeight: 500 }}>
                      ✓ Adherencia del día
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Suplementos */}
            {log.supplements && log.supplements.length > 0 && (
              <div className="pt-3 border-t border-[var(--border)]">
                <h4 className="text-xs font-medium text-[var(--text-2)] mb-2" style={{ fontWeight: 500 }}>Suplementos</h4>
                <div className="flex flex-wrap gap-2">
                  {log.supplements.map((supplement, index) => (
                    <span key={index} className="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs border border-[var(--accent)]/30" style={{ fontWeight: 500 }}>
                      {supplement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Remedios Caseros */}
            {log.homeRemedies && log.homeRemedies.length > 0 && (
              <div className="pt-3 border-t border-[var(--border)]">
                <h4 className="text-xs font-medium text-[var(--text-2)] mb-2" style={{ fontWeight: 500 }}>Remedios Caseros</h4>
                <div className="flex flex-wrap gap-2">
                  {log.homeRemedies.map((remedy, index) => (
                    <span key={index} className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/30" style={{ fontWeight: 500 }}>
                      {remedy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pruebas y Métricas de Salud */}
      {(log.pregnancyTest || log.restingHeartRate || log.bloodPressure || log.basalTemp || log.weight) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🩺</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Pruebas y Métricas de Salud
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Test de Embarazo */}
            {log.pregnancyTest && log.pregnancyTest !== 'not-taken' && (
              <div className="col-span-full p-3 rounded-lg border" style={{
                backgroundColor: log.pregnancyTest === 'positive' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                borderColor: log.pregnancyTest === 'positive' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'
              }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text)]">Test de Embarazo</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    log.pregnancyTest === 'positive' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {log.pregnancyTest === 'positive' ? 'Positivo' : 'Negativo'}
                  </span>
                </div>
              </div>
            )}

            {/* Vitales */}
            {log.restingHeartRate && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-2)]">FC en reposo</p>
                <p className="text-lg font-bold text-[var(--text)]">{log.restingHeartRate} <span className="text-sm font-normal text-[var(--text-2)]">bpm</span></p>
              </div>
            )}
            {log.bloodPressure && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-2)]">Presión arterial</p>
                <p className="text-lg font-bold text-[var(--text)]">{log.bloodPressure} <span className="text-sm font-normal text-[var(--text-2)]">mmHg</span></p>
              </div>
            )}
            {log.basalTemp && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-2)]">Temp. basal</p>
                <p className="text-lg font-bold text-[var(--text)]">{log.basalTemp} <span className="text-sm font-normal text-[var(--text-2)]">°C</span></p>
              </div>
            )}
            {log.weight && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-2)]">Peso</p>
                <p className="text-lg font-bold text-[var(--text)]">{log.weight} <span className="text-sm font-normal text-[var(--text-2)]">kg</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8) Contexto y ambiente */}
      {(log.weather || log.energyLevel || log.location || log.timezone) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌍</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Contexto y Ambiente
            </h3>
          </div>
          
          {/* Clima + energía en cabecera */}
          <div className="flex items-center gap-3 mb-3">
            {log.weather && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--brand)]/20 rounded-lg">
                <span className="text-sm" style={{ color: cyclePhase ? 'var(--brand)' : 'inherit' }}>
                  {log.weather === 'cold' ? '❄️' : log.weather === 'mild' ? '☁️' : '☀️'}
                </span>
                <span className="text-xs text-[var(--text)]" style={{ fontWeight: 500 }}>
                  {log.weather === 'cold' ? 'Frío' : log.weather === 'mild' ? 'Templado' : 'Caluroso'}
                </span>
              </div>
            )}
            {log.energyLevel && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)]/20 rounded-lg">
                <span className="text-sm">{getEnergyEmoji(log.energyLevel)}</span>
                <span className="text-xs text-[var(--text)] capitalize" style={{ fontWeight: 500 }}>
                  Energía {translateEnergyLevel(log.energyLevel)}
                </span>
              </div>
            )}
          </div>

          {/* Ubicación y zona horaria - Segunda línea discreta */}
          {(log.location || log.timezone) && (
            <div className="flex items-center gap-4 text-xs text-[var(--text-2)]" style={{ opacity: 0.7 }}>
              {log.location && (
                <div className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{log.location}</span>
                </div>
              )}
              {log.timezone && (
                <div className="flex items-center gap-1.5">
                  <span>🕐</span>
                  <span>{log.timezone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 9) Notas - Transformadas en píldoras y bullets */}
      {log.notes && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Notas
            </h3>
          </div>
          
          {/* Transformar texto en bullets estructurados */}
          <div className="space-y-2">
            {log.notes.split(/[.!?]\s+/).filter(s => s.trim()).map((sentence, idx) => {
              // Detectar entidades clave para resaltar
              const hasNumber = /\d+/.test(sentence);
              const hasDuration = /(minutos?|horas?|días?)/i.test(sentence);
              const hasLevel = /(alto|bajo|medio|leve|fuerte)/i.test(sentence);
              
              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--brand)] mt-0.5 text-xs">•</span>
                  <p className="text-sm text-[var(--text)] flex-1" style={{ lineHeight: 1.5 }}>
                    {sentence.trim()}
                    {(hasNumber || hasDuration || hasLevel) && (
                      <span className="ml-2 px-2 py-0.5 bg-[var(--surface-2)] text-[var(--text-2)] rounded text-xs">
                        {hasNumber && sentence.match(/\d+/)?.[0]}
                        {hasDuration && ' ' + sentence.match(/(minutos?|horas?|días?)/i)?.[0]}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Anclas a secciones relacionadas */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap gap-2">
            {log.ovulationTest && (
              <button className="text-xs text-[var(--text-2)] hover:text-[var(--brand)] underline decoration-dotted" style={{ fontWeight: 500 }}>
                → Ver Fertilidad
              </button>
            )}
            {log.sleepHours && (
              <button className="text-xs text-[var(--text-2)] hover:text-[var(--accent)] underline decoration-dotted" style={{ fontWeight: 500 }}>
                → Ver Sueño
              </button>
            )}
            {log.symptoms && log.symptoms.length > 0 && (
              <button className="text-xs text-[var(--text-2)] hover:text-[var(--brand)] underline decoration-dotted" style={{ fontWeight: 500 }}>
                → Ver Síntomas
              </button>
            )}
          </div>
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
        
        /* 11) Interacciones suaves - Hover leve en tarjetas y chips */
        [class*="rounded-"][class*="border"]:hover {
          transform: translateY(-1px);
        }
        
        [class*="rounded-full"]:hover {
          transform: scale(1.02);
        }
        
        /* 12) Ritmo y coherencia - Sombra única para todas las cards */
        [class*="shadow-sm"] {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        [class*="shadow-lg"] {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        
        /* 13) Accesibilidad - Foco visible en todos los controles */
        button:focus-visible,
        [role="button"]:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* Objetivos táctiles cómodos - mínimo 44x44px */
        button,
        [role="button"],
        a {
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Contraste suficiente en texto secundario */
        [class*="text-[var(--text-2)]"] {
          color: rgba(255, 255, 255, 0.7);
        }
        
        /* Navegación por teclado en chips */
        [class*="rounded-full"]:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        
        /* Transiciones consistentes */
        * {
          transition-duration: 180ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

function hasDetailedSymptoms(log: DailyLog): boolean {
  return !!(
    log.nausea || log.vomiting || log.diarrhea || log.constipation || log.gas || log.appetite ||
    log.headache || log.migraine || log.migraineWithAura || log.dizziness || log.brainFog ||
    log.backPain || log.pelvicPain || log.muscleTension ||
    log.breastTenderness || log.breastSwelling || log.acne ||
    log.urinaryBurning || log.urinaryFrequency || log.vaginalItching || log.vaginalOdor || log.vaginalDischarge ||
    log.bloating || log.waterRetention || log.hasColdSymptoms || log.hasCovidSymptoms
  );
}

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

  // Menstruación y fertilidad
  if (log.periodIntensity && log.periodIntensity >= 3) {
    if (log.hasLeaks) {
      insights.push('Flujo abundante con fugas. Considera usar productos de mayor capacidad o cambiarlos más frecuentemente.');
    } else if (log.periodIntensity === 4) {
      insights.push('Flujo muy abundante. Monitorea si persiste más de 2 días y consulta si es necesario.');
    }
  }

  // Ovulación y fertilidad
  if (log.ovulationTest === 'positive' && log.cervicalFluid === 'egg-white') {
    insights.push('Test LH positivo y moco fértil. Estás en tu ventana de máxima fertilidad.');
  } else if (log.ovulationTest === 'positive') {
    insights.push('Test de ovulación positivo. Ovulación probable en las próximas 24-36 horas.');
  }

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

  // Alcohol
  if (log.alcoholIntake && log.alcoholIntake >= 3) {
    insights.push('Consumo alto de alcohol. Puede afectar tu sueño, hidratación y ciclo hormonal.');
  }

  // Síntomas preocupantes
  if (log.urinaryBurning || log.vaginalItching || log.vaginalOdor) {
    insights.push('Síntomas urinarios/vaginales detectados. Si persisten, consulta con tu médico.');
  }

  // Migraña
  if (log.migraine || log.migraineWithAura) {
    insights.push('Migraña registrada. Descansa en un lugar oscuro y silencioso. Considera tu medicación habitual.');
  }

  // Síntomas frecuentes
  const totalSymptoms = (log.symptoms?.length || 0) + (hasDetailedSymptoms(log) ? 1 : 0);
  if (totalSymptoms >= 5) {
    insights.push(`Múltiples síntomas hoy (${totalSymptoms}). Prioriza el descanso y autocuidado.`);
  }

  // Adherencia anticonceptivo
  if (log.contraception && !log.contraceptionDay) {
    insights.push('Recuerda registrar el día del blister para mejor seguimiento de adherencia.');
  }

  // Temperatura basal
  if (log.basalTemp && log.basalTemp > 37.0) {
    insights.push('Temperatura basal elevada. Puede indicar fase lútea o inicio de ovulación.');
  }

  // Peso
  if (log.weight) {
    // Este insight requeriría comparación con registros anteriores
    // Por ahora solo lo mencionamos si está presente
  }

  if (insights.length === 0) {
    insights.push('Sigue registrando tus datos para obtener insights personalizados más detallados.');
  }

  return insights.slice(0, 6); // Máximo 6 insights por día
}
