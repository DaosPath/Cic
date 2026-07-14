import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext.tsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr as trLocale } from 'date-fns/locale/tr';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { CycleRing } from '../components/CycleRing.tsx';
import { MoodTracker } from '../components/MoodTracker.tsx';
import { PhaseInsight } from '../components/PhaseInsight.tsx';
import { PredictionLabel } from '../components/ui/PredictionLabel.tsx';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';
import { getLog } from '../services/db.ts';

const dateFnsLocales = { es, en: enUS, tr: trLocale } as const;
const intlLocales = { es: 'es-ES', en: 'en-US', tr: 'tr-TR' } as const;

const formatDayMonth = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);

const formatShortRange = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);

export const HomePage: React.FC = () => {
  const { currentPhase, dayOfCycle, predictions, settings, isLoading, cycles, logs } = useContext(AppContext);
  const { t, language } = useTranslation();
  const [todayLogged, setTodayLogged] = useState(false);

  const discrete = settings.discreteMode;
  const dateLocale = dateFnsLocales[language] ?? es;
  const intlLocale = intlLocales[language] ?? 'es-ES';
  const distanceOptions = { locale: dateLocale, addSuffix: true as const };
  const cycleLength = settings.cycleLength || 28;

  useEffect(() => {
    const todayStr = formatISO(startOfToday(), { representation: 'date' });
    getLog(todayStr).then((log) => {
      setTodayLogged(Boolean(log && (log.mood || log.symptoms?.length || log.periodIntensity || log.notes)));
    });
  }, [logs]);

  const getPhaseTranslation = (phase: string) => {
    switch (phase) {
      case 'menstruation': return t('menstruation');
      case 'follicular': return t('follicular');
      case 'ovulation': return t('ovulation');
      case 'luteal': return t('luteal');
      default: return phase;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton variant="page" label={t('loading')} />;
  }

  const hasCycleData = cycles.length > 0;
  const greetName = settings.userName ? `, ${settings.userName}` : '';

  return (
    <div className="page-content safe-pb md:pb-8">
      <header className="mb-6 md:mb-8">
        <p className="text-sm text-[var(--text-2)] mb-1">
          {new Intl.DateTimeFormat(intlLocale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text)] tracking-tight">
          Hola{greetName}
        </h1>
      </header>

      <div className="desktop-grid-home">
        {/* 1. Current state — only claim day/phase/history when a cycle exists */}
        <section
          className="home-hero flex flex-col items-center text-center animate-fade-in p-4 md:p-6"
          data-skin-home-hero
        >
          {hasCycleData ? (
            <>
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center mb-1 overflow-hidden rounded-full">
                <CycleRing
                  phase={currentPhase}
                  cycleDay={dayOfCycle > 0 ? dayOfCycle : undefined}
                  cycleLength={cycleLength}
                  size={320}
                  showLegend={false}
                />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                  <span
                    className="tabular-nums text-6xl sm:text-7xl md:text-8xl font-extrabold text-[var(--text)] tracking-tight"
                    style={{
                      textShadow:
                        '0 0 40px var(--particle), 0 4px 12px rgba(0, 0, 0, 0.55), 0 0 2px var(--brand)',
                      filter: 'drop-shadow(0 0 8px var(--particle))',
                    }}
                  >
                    {dayOfCycle > 0 ? dayOfCycle : '—'}
                  </span>
                  <p className="text-sm md:text-base text-[var(--text-2)] mt-2 font-light tracking-wide">
                    {dayOfCycle > 0 ? t('dayOfCycle') : t('calculating')}
                  </p>
                </div>
              </div>
              <h2 className="mt-4 text-xl md:text-2xl font-semibold capitalize text-[var(--plum)]">
                {discrete ? t('currentPhase') : getPhaseTranslation(currentPhase)}
              </h2>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <PredictionLabel kind="basedOnHistory" language={language === 'auto' ? 'es' : language} />
                <PredictionLabel kind="mayVary" language={language === 'auto' ? 'es' : language} />
              </div>
              <p className="text-xs text-[var(--text-2)] mt-3 max-w-xs leading-relaxed">
                Día del ciclo y fase son estimaciones a partir de tus registros y preferencias. Pueden variar.
              </p>
            </>
          ) : (
            <div className="w-full py-2">
              <EmptyState
                title="Aún no hay un ciclo registrado"
                description="Registra el inicio de tu periodo o completa el registro diario para ver el día del ciclo y las estimaciones."
                actionLabel={t('log')}
                onAction={() => { window.location.hash = '/log'; }}
                secondaryNote="Tus datos se guardan solo en este dispositivo. No mostramos un día o fase inventados."
                illustrationSrc="/assets/empty-cycle.jpg"
                illustrationAlt=""
              />
            </div>
          )}
        </section>

        {/* 2. Primary action + mood */}
        <section className="home-actions space-y-4 animate-slide-up">
          <div className="aura-surface p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-base font-semibold text-[var(--text)]">Hoy</h2>
                <p className="text-sm text-[var(--text-2)] mt-0.5">
                  {todayLogged ? 'Ya hay un registro parcial o completo.' : 'Aún no has registrado el día.'}
                </p>
              </div>
              <span
                className="prediction-label"
                style={
                  todayLogged
                    ? { color: 'var(--positive)', borderColor: 'color-mix(in srgb, var(--positive) 40%, var(--border))' }
                    : undefined
                }
              >
                {todayLogged ? 'Registrado' : 'Pendiente'}
              </span>
            </div>
            <Link to="/log" className="aura-btn aura-btn-primary w-full">
              {todayLogged ? 'Editar registro' : t('log')}
            </Link>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link to="/calendar" className="aura-btn aura-btn-secondary text-sm">
                {t('calendar')}
              </Link>
              <Link to="/insights" className="aura-btn aura-btn-secondary text-sm">
                {t('insights')}
              </Link>
            </div>
          </div>
          <MoodTracker />
        </section>

        {/* 3. Predictions — only when we have cycle history to estimate from */}
        <section className="home-predictions animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {hasCycleData && predictions ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="aura-surface p-5 text-left">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-2)]">
                    {discrete ? t('nextEvent') : t('nextPeriod')}
                  </h3>
                  <PredictionLabel kind="estimated" language={language === 'auto' ? 'es' : language} />
                </div>
                <p className="tabular-nums text-2xl md:text-3xl font-bold text-[var(--text)]">
                  {discrete
                    ? formatDistanceToNow(predictions.nextPeriod[0], distanceOptions)
                    : formatDayMonth(predictions.nextPeriod[0], intlLocale)}
                </p>
                {!discrete && (
                  <p className="text-xs text-[var(--text-2)] mt-1">
                    {formatDistanceToNow(predictions.nextPeriod[0], distanceOptions)} · puede variar
                  </p>
                )}
              </div>
              <div className="aura-surface p-5 text-left">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-2)]">
                    {discrete ? t('relevantWindow') : t('fertileWindow')}
                  </h3>
                  <PredictionLabel kind="estimated" language={language === 'auto' ? 'es' : language} />
                </div>
                <p className="tabular-nums text-2xl md:text-3xl font-bold text-[var(--text)]">
                  {discrete
                    ? formatDistanceToNow(predictions.fertileWindow[0], distanceOptions)
                    : `${formatShortRange(predictions.fertileWindow[0], intlLocale)} – ${formatShortRange(predictions.fertileWindow[1], intlLocale)}`}
                </p>
                <p className="text-xs text-[var(--text-2)] mt-1">Estimación, no un hecho exacto.</p>
              </div>
            </div>
          ) : (
            <div className="aura-surface p-5 text-left">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Próximas fechas</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                Cuando registres un ciclo, aquí verás estimaciones de la siguiente menstruación y la ventana fértil — siempre etiquetadas como estimadas.
              </p>
            </div>
          )}
        </section>

        {/* 4–5. Secondary */}
        <section className="home-secondary space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <PhaseInsight />
          <div className="aura-surface p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[var(--text)] mb-1">{t('chatWithAI')}</h3>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">{t('askAboutCycle')}</p>
                <p className="text-[11px] text-[var(--text-3)] mt-2">{t('medicalDisclaimer') || 'Información general, no diagnóstico médico.'}</p>
              </div>
              <button
                type="button"
                onClick={() => { window.location.hash = '/insights?chat=1'; }}
                className="aura-btn aura-btn-secondary flex-shrink-0"
              >
                {t('startChat')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
