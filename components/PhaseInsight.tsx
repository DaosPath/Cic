import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { getPhaseInsight } from '../services/ai.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import { LoadingSkeleton } from './ui/LoadingSkeleton.tsx';

export const PhaseInsight: React.FC = () => {
  const { currentPhase } = useContext(AppContext);
  const { t, language } = useTranslation();
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchInsight = async () => {
      setLoading(true);
      setError(false);
      try {
        const text = await getPhaseInsight(currentPhase, language);
        if (!cancelled) setInsight(text);
      } catch {
        if (!cancelled) {
          setError(true);
          setInsight('');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchInsight();
    return () => { cancelled = true; };
  }, [currentPhase, language]);

  return (
    <div className="aura-surface p-5 md:p-6 w-full">
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 p-2.5 rounded-[var(--radius-md)]"
          style={{ background: 'color-mix(in srgb, var(--lavender-grey) 30%, transparent)' }}
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--plum)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--text)] mb-1">{t('dailyTip')}</h3>
          <p className="text-[11px] text-[var(--text-3)] mb-3">Información general · no es un diagnóstico</p>
          {loading ? (
            <LoadingSkeleton variant="lines" label={t('loading')} />
          ) : error ? (
            <p className="text-sm text-[var(--text-2)]">
              No se pudo cargar el consejo ahora. Tus datos locales siguen seguros.
            </p>
          ) : (
            <p className="text-sm md:text-base text-[var(--text)] leading-relaxed">{insight}</p>
          )}
          <a
            href="#/insights"
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[var(--plum)] hover:underline min-h-[44px] items-center"
          >
            Ver más en Tendencias
          </a>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-3)] mt-4 text-right">{t('poweredByGemini')}</p>
    </div>
  );
};
