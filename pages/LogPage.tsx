import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog, Symptom } from '../types.ts';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import type { Translations } from '../services/i18n.ts';
import { AILogModal } from '../components/AILogModal.tsx';
import { CollapsibleSection } from '../components/LogFieldComponents.tsx';
import {
  MenstruationSection,
  FertilitySection,
  PainSection,
  MentalSection,
  SleepSection,
  ActivitySection,
  MedicationSection,
  HealthSection,
} from '../components/LogSections.tsx';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton.tsx';
import { Toast } from '../components/ui/Toast.tsx';

const moodKeys: Array<keyof Translations> = ['terrible', 'bad', 'normal', 'good', 'great'];

const intlLocales = {
  es: 'es-ES',
  en: 'en-US',
  tr: 'tr-TR',
} as const;

const emptyLog = (todayStr: string): DailyLog => ({
  id: todayStr,
  date: todayStr,
  symptoms: [],
  medications: [],
  periodProducts: [],
  activityType: [],
  supplements: [],
  homeRemedies: [],
  cravings: [],
  stressTriggers: [],
});

export const LogPage: React.FC = () => {
  const { settings, refreshData } = useContext(AppContext);
  const { t, language, translateSymptomId } = useTranslation();
  const todayStr = formatISO(startOfToday(), { representation: 'date' });
  const [log, setLog] = useState<DailyLog>(emptyLog(todayStr));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [draftDirty, setDraftDirty] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    menstruation: true,
    fertility: false,
    pain: false,
    symptoms: true,
    mental: false,
    sleep: false,
    activity: false,
    medication: false,
    health: false,
    context: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const intlLocale = intlLocales[language] ?? 'es-ES';

  const updateLog = useCallback((updater: DailyLog | ((prev: DailyLog) => DailyLog)) => {
    setLog((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setDraftDirty(true);
  }, []);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      const existingLog = await getLog(todayStr);
      if (existingLog) setLog(existingLog);
      else setLog(emptyLog(todayStr));
      setDraftDirty(false);
      setLoading(false);
    };
    fetchLog();
  }, [todayStr]);

  // Draft warning on unload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (draftDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [draftDirty]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(false);
    try {
      await upsertLog(log);
      await refreshData();
      setDraftDirty(false);
      setSaveToast(true);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const toggleSymptom = (symptomId: string) => {
    updateLog((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter((id) => id !== symptomId)
        : [...prev.symptoms, symptomId],
    }));
  };

  const handleAISuggestions = (suggestions: Partial<DailyLog>) => {
    updateLog((prev) => ({
      ...prev,
      ...suggestions,
      id: prev.id,
      date: prev.date,
      symptoms: suggestions.symptoms || prev.symptoms,
      medications: suggestions.medications || prev.medications,
      periodProducts: suggestions.periodProducts || prev.periodProducts || [],
      activityType: suggestions.activityType || prev.activityType || [],
      supplements: suggestions.supplements || prev.supplements || [],
      homeRemedies: suggestions.homeRemedies || prev.homeRemedies || [],
      cravings: suggestions.cravings || prev.cravings || [],
      stressTriggers: suggestions.stressTriggers || prev.stressTriggers || [],
    }));
  };

  if (loading) {
    return <LoadingSkeleton variant="page" label={t('loading')} />;
  }

  const formattedDate = new Intl.DateTimeFormat(intlLocale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const PeriodButton: React.FC<{ intensity: 0 | 1 | 2 | 3; label: string }> = ({ intensity, label }) => (
    <button
      type="button"
      onClick={() => updateLog({ ...log, periodIntensity: intensity })}
      className={`min-h-[var(--touch-min)] w-full py-2.5 px-3 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
        log.periodIntensity === intensity
          ? 'bg-[color-mix(in_srgb,var(--phase-menstruation)_18%,transparent)] text-[var(--phase-menstruation)] border border-[var(--phase-menstruation)]'
          : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--phase-menstruation)]'
      }`}
    >
      {label}
    </button>
  );

  const setLogBridge: React.Dispatch<React.SetStateAction<DailyLog>> = (action) => {
    if (typeof action === 'function') {
      updateLog(action);
    } else {
      updateLog(action);
    }
  };

  return (
    <div className="page-content safe-pb md:pb-12">
      <Toast message={t('logSaved')} visible={saveToast} onDismiss={() => setSaveToast(false)} />
      <Toast
        message="No se pudo guardar. Tus datos en pantalla no se han perdido; reintenta."
        visible={saveError}
        onDismiss={() => setSaveError(false)}
        variant="error"
      />

      <header className="aura-surface p-5 md:p-6 mb-5 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text)]">
              {t('dailyRecord')}
            </h1>
            <p className="text-sm text-[var(--text-2)] mt-1 capitalize">{formattedDate}</p>
            {draftDirty && (
              <p className="text-xs text-[var(--warning)] mt-2">Cambios sin guardar</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button type="button" onClick={() => setIsAIModalOpen(true)} className="aura-btn aura-btn-secondary text-sm">
              {t('chatWithAI')}
            </button>
            <div
              className="inline-flex p-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)]"
              role="group"
              aria-label="Modo de registro"
            >
              <button
                type="button"
                onClick={() => setIsAdvancedMode(false)}
                className={`min-h-[40px] px-4 rounded-full text-sm font-semibold ${
                  !isAdvancedMode ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--text-2)]'
                }`}
              >
                {t('simplifiedMode')}
              </button>
              <button
                type="button"
                onClick={() => setIsAdvancedMode(true)}
                className={`min-h-[40px] px-4 rounded-full text-sm font-semibold ${
                  isAdvancedMode ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--text-2)]'
                }`}
              >
                {t('advancedMode')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {!isAdvancedMode && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          <div className="lg:col-span-5 space-y-4">
            <section className="aura-surface p-5">
              <h2 className="text-base font-semibold text-[var(--text)] mb-4">{t('menstruationIntensity')}</h2>
              <div className="grid grid-cols-2 gap-2">
                <PeriodButton intensity={0} label={t('noFlow')} />
                <PeriodButton intensity={1} label={t('light')} />
                <PeriodButton intensity={2} label={t('medium')} />
                <PeriodButton intensity={3} label={t('heavy')} />
              </div>
            </section>

            <section className="aura-surface p-5">
              <h2 className="text-base font-semibold text-[var(--text)] mb-4">{t('mood')}</h2>
              <div className="grid grid-cols-5 gap-2" role="group" aria-label={t('mood')}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateLog({ ...log, mood: value as DailyLog['mood'] })}
                    className={`min-h-[var(--touch-min)] rounded-[var(--radius-md)] border tabular-nums font-bold transition-colors ${
                      log.mood === value
                        ? 'border-[var(--plum)] bg-[color-mix(in_srgb,var(--mauve)_14%,transparent)] text-[var(--plum)]'
                        : 'border-[var(--border)] text-[var(--text-2)]'
                    }`}
                    aria-label={`${t('mood')}: ${t(moodKeys[value - 1])}`}
                    aria-pressed={log.mood === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </section>

            <section className="aura-surface p-5">
              <h2 className="text-base font-semibold text-[var(--text)] mb-2">{t('symptoms')}</h2>
              <p className="text-xs text-[var(--text-2)] mb-3">Toca para activar o desactivar</p>
              <div className="flex flex-wrap gap-2">
                {settings.customSymptoms.map((symptom: Symptom) => (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`min-h-[40px] px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                      log.symptoms.includes(symptom.id)
                        ? 'bg-[color-mix(in_srgb,var(--mauve)_16%,transparent)] text-[var(--plum)] border-[var(--mauve)]'
                        : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                    }`}
                  >
                    {translateSymptomId(symptom.id)}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-7">
            <section className="aura-surface p-5 flex flex-col h-full min-h-[280px]">
              <label htmlFor="log-notes" className="text-base font-semibold text-[var(--text)] mb-3 block">
                {t('notes')}
              </label>
              <textarea
                id="log-notes"
                value={log.notes || ''}
                onChange={(e) => updateLog({ ...log, notes: e.target.value })}
                className="aura-input flex-1 min-h-[200px] resize-y"
                placeholder={t('addAnyAdditionalNotes')}
                rows={8}
              />
              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end sticky bottom-20 md:bottom-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="aura-btn aura-btn-primary"
                  data-testid="log-save-button"
                >
                  {saving ? t('loading') : t('saveRecord')}
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {isAdvancedMode && (
        <div className="space-y-4 max-w-3xl lg:max-w-none">
          <p className="text-sm text-[var(--text-2)]">
            Secciones adicionales. Lo esencial está arriba en modo simple; aquí puedes detallar.
          </p>
          <MenstruationSection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <CollapsibleSection
            title={t('mood')}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            isOpen={openSections.symptoms}
            onToggle={() => toggleSection('symptoms')}
          >
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateLog({ ...log, mood: value as DailyLog['mood'] })}
                  className={`min-h-[var(--touch-min)] rounded-[var(--radius-md)] border tabular-nums font-bold ${
                    log.mood === value
                      ? 'border-[var(--plum)] bg-[color-mix(in_srgb,var(--mauve)_14%,transparent)]'
                      : 'border-[var(--border)]'
                  }`}
                  aria-label={`${t('mood')}: ${t(moodKeys[value - 1])}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection
            title={t('symptoms')}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            isOpen={openSections.symptoms}
            onToggle={() => toggleSection('symptoms')}
          >
            <div className="flex flex-wrap gap-2">
              {settings.customSymptoms.map((symptom: Symptom) => (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`min-h-[40px] px-3 py-2 rounded-full text-sm border ${
                    log.symptoms.includes(symptom.id)
                      ? 'border-[var(--mauve)] text-[var(--plum)] bg-[color-mix(in_srgb,var(--mauve)_16%,transparent)]'
                      : 'border-[var(--border)]'
                  }`}
                >
                  {translateSymptomId(symptom.id)}
                </button>
              ))}
            </div>
          </CollapsibleSection>
          <FertilitySection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <PainSection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <MentalSection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <SleepSection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <ActivitySection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <MedicationSection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <HealthSection log={log} setLog={setLogBridge} openSections={openSections} toggleSection={toggleSection} />
          <CollapsibleSection
            title={t('notes')}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            isOpen
            onToggle={() => {}}
          >
            <label htmlFor="log-notes-adv" className="sr-only">{t('notes')}</label>
            <textarea
              id="log-notes-adv"
              value={log.notes || ''}
              onChange={(e) => updateLog({ ...log, notes: e.target.value })}
              className="aura-input min-h-[160px] resize-y"
              placeholder={t('addAnyAdditionalNotes')}
            />
          </CollapsibleSection>
          <div className="flex justify-center pt-2 sticky bottom-20 md:static">
            <button type="button" onClick={handleSave} disabled={saving} className="aura-btn aura-btn-primary">
              {saving ? t('loading') : t('saveRecord')}
            </button>
          </div>
        </div>
      )}

      <AILogModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApply={handleAISuggestions}
        currentDate={todayStr}
      />
    </div>
  );
};
