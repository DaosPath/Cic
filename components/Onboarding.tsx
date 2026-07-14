import React, { useState } from 'react';
import type { AppSettings } from '../types.ts';
import { upsertCycle } from '../services/db.ts';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { subDays } from 'date-fns/subDays';

interface OnboardingProps {
  settings: AppSettings;
  onComplete: (partial: Partial<AppSettings>) => Promise<void>;
  onSkip: () => Promise<void>;
}

const STEPS = 4;

export const Onboarding: React.FC<OnboardingProps> = ({ settings, onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [cycleLength, setCycleLength] = useState(settings.cycleLength || 28);
  const [luteal, setLuteal] = useState(settings.lutealPhaseLength || 14);
  const [lastPeriodDaysAgo, setLastPeriodDaysAgo] = useState(0);
  const [name, setName] = useState(settings.userName || '');
  const [saving, setSaving] = useState(false);

  const progress = ((step + 1) / STEPS) * 100;

  const finish = async (withData: boolean) => {
    setSaving(true);
    try {
      if (withData && lastPeriodDaysAgo >= 0) {
        const start = subDays(startOfToday(), lastPeriodDaysAgo);
        await upsertCycle({
          startDate: formatISO(start, { representation: 'date' }),
        });
      }
      await onComplete({
        cycleLength,
        lutealPhaseLength: luteal,
        userName: name.trim() || undefined,
        onboardingComplete: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'color-mix(in srgb, var(--plum) 45%, transparent)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-lg bg-[var(--surface)] rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden animate-slide-up max-h-[92dvh] flex flex-col">
        <div className="relative h-28 sm:h-36 overflow-hidden flex-shrink-0">
          <img
            src="/assets/onboarding-orbit.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              el.parentElement!.style.background =
                'linear-gradient(135deg, var(--surface-2), color-mix(in srgb, var(--mauve) 25%, var(--surface)))';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent" />
          <div className="absolute bottom-3 left-5 right-5">
            <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS}>
              <div
                className="h-full rounded-full bg-[var(--plum)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--text-2)] mt-1.5 tabular-nums">
              Paso {step + 1} de {STEPS}
            </p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-2 overflow-y-auto flex-1">
          {step === 0 && (
            <div className="space-y-3">
              <h1 id="onboarding-title" className="font-display text-2xl font-semibold text-[var(--text)]">
                Bienvenida a Aura Ciclo
              </h1>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                Un espacio privado para registrar tu ciclo, síntomas y bienestar. Los datos se guardan en este dispositivo.
              </p>
              <ul className="text-sm text-[var(--text-2)] space-y-2 list-disc pl-5">
                <li>Registro diario rápido</li>
                <li>Calendario y estimaciones (no diagnósticos)</li>
                <li>Sin cuenta obligatoria</li>
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Tu ritmo habitual</h2>
              <p className="text-sm text-[var(--text-2)]">
                Usamos estos valores solo para estimar fechas. Puedes cambiarlos después en Ajustes.
              </p>
              <div className="aura-field">
                <label htmlFor="ob-cycle">Duración media del ciclo (días)</label>
                <input
                  id="ob-cycle"
                  type="number"
                  inputMode="numeric"
                  min={21}
                  max={45}
                  className="aura-input"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value, 10) || 28)}
                />
                <p className="help">Entre 21 y 45 es el rango habitual de referencia.</p>
              </div>
              <div className="aura-field">
                <label htmlFor="ob-luteal">Fase lútea estimada (días)</label>
                <input
                  id="ob-luteal"
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={16}
                  className="aura-input"
                  value={luteal}
                  onChange={(e) => setLuteal(parseInt(e.target.value, 10) || 14)}
                />
                <p className="help">Suele ser más estable; 14 es un valor habitual.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Último inicio de periodo</h2>
              <p className="text-sm text-[var(--text-2)]">
                Opcional. Si lo indicias, calculamos el día del ciclo. Si no lo sabes, puedes omitirlo.
              </p>
              <div className="aura-field">
                <label htmlFor="ob-last">Hace cuántos días empezó (0 = hoy)</label>
                <input
                  id="ob-last"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={60}
                  className="aura-input"
                  value={lastPeriodDaysAgo}
                  onChange={(e) => setLastPeriodDaysAgo(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
                <p className="help">Se guarda como ciclo local en este dispositivo.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Privacidad y nombre</h2>
              <div className="aura-field">
                <label htmlFor="ob-name">Cómo te gustaría que te llamemos (opcional)</label>
                <input
                  id="ob-name"
                  type="text"
                  autoComplete="nickname"
                  className="aura-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                />
              </div>
              <div className="aura-surface-2 p-4 text-sm text-[var(--text-2)] leading-relaxed space-y-2">
                <p className="font-semibold text-[var(--text)]">Dónde se guardan tus datos</p>
                <p>
                  En el almacenamiento local de este navegador (IndexedDB). No creamos una cuenta en la nube por defecto.
                  Puedes exportar o borrar todo desde Ajustes.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 pt-2 flex flex-col sm:flex-row gap-2 border-t border-[var(--border)] flex-shrink-0 safe-bottom-nav">
          {step === 0 ? (
            <button type="button" className="aura-btn aura-btn-ghost order-2 sm:order-1" onClick={() => onSkip()} disabled={saving}>
              Continuar sin configurar
            </button>
          ) : (
            <button type="button" className="aura-btn aura-btn-ghost order-2 sm:order-1" onClick={() => setStep((s) => s - 1)} disabled={saving}>
              Atrás
            </button>
          )}
          {step < STEPS - 1 ? (
            <button
              type="button"
              className="aura-btn aura-btn-primary flex-1 order-1 sm:order-2"
              onClick={() => setStep((s) => s + 1)}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              className="aura-btn aura-btn-primary flex-1 order-1 sm:order-2"
              onClick={() => finish(true)}
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Empezar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
