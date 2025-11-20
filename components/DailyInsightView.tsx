import React from 'react';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr } from 'date-fns/locale/tr';

import type { DailyLog } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

type AnalysisMode = 'simple' | 'ai';
type AnalysisView = 'dia' | 'semana' | 'mes' | 'ciclo' | '6m' | 'ano';
type AnalysisRange = '3m' | '6m' | '12m';

interface DailyInsightViewProps {
  log: DailyLog | null;
  onStartChat?: () => void;
  cyclePhase?: string;
  cycleDay?: number;
  view?: AnalysisView;
  range?: AnalysisRange;
  onModeChange?: (mode: AnalysisMode) => void;
  onViewChange?: (view: AnalysisView) => void;
  onRangeChange?: (range: AnalysisRange) => void;
  onExport?: () => void;
}

const localeMap = {
  es,
  en: enUS,
  tr,
} as const;

const formatDate = (date: string, language: 'es' | 'en' | 'tr') => {
  const locale = localeMap[language] ?? es;
  const pattern =
    language === 'es' ? "EEEE, d 'de' MMMM" : language === 'tr' ? 'd MMMM EEEE' : 'EEEE, MMMM d';
  return format(parseISO(date), pattern, { locale });
};

const getFlowLabel = (value?: number, t?: (k: string) => string) => {
  if (!t) return '';
  if (value === 0) return t('noFlow');
  if (value === 1) return t('light');
  if (value === 2) return t('medium');
  if (value === 3) return t('heavy');
  return '';
};

const getMoodEmoji = (mood?: number) => {
  if (!mood) return '😐';
  if (mood <= 2) return '😣';
  if (mood === 3) return '😌';
  if (mood === 4) return '🙂';
  return '🤩';
};

export const DailyInsightView: React.FC<DailyInsightViewProps> = ({
  log,
  onStartChat,
  cyclePhase,
  cycleDay,
}) => {
  const { t, translateSymptomId, language } = useTranslation();

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
          <p className="text-sm text-[var(--text-2)]">{t('noLogTodayDescription')}</p>
        </div>
      </div>
    );
  }

  const resolvedLang: 'es' | 'en' | 'tr' = language === 'auto' ? 'es' : language;
  const dateStr = formatDate(log.date, resolvedLang);
  const flowLabel = getFlowLabel(log.periodIntensity, t);

  return (
    <div className="max-w-[1200px] mx-auto px-4 space-y-5">
      {/* Header */}
      <div className="rounded-[18px] p-5 border border-[var(--border)] bg-[var(--surface)] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] capitalize" style={{ fontWeight: 700 }}>
            {dateStr}
          </h1>
          <p className="text-xs text-[var(--text-2)]">{t('dailyInsightModalTitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {cyclePhase && (
            <div className="px-3 py-1.5 bg-[var(--brand)]/10 rounded-full text-xs font-medium text-[var(--text)]">
              {cyclePhase}
            </div>
          )}
          {cycleDay !== undefined && (
            <div className="px-3 py-1.5 bg-[var(--accent)]/10 rounded-full text-xs font-medium text-[var(--text)]">
              {t('dayOfCycle')}: {cycleDay}
            </div>
          )}
        </div>
      </div>

      {/* Flow */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-[var(--text)] font-semibold" style={{ fontWeight: 600 }}>
          <span>❤️</span>
          <span>{t('menstruationIntensity')}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--text)]">
          <span>{t('menstruation')}</span>
          <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
            {flowLabel}
          </span>
        </div>
      </div>

      {/* Mood */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-[var(--text)] font-semibold" style={{ fontWeight: 600 }}>
          <span>😊</span>
          <span>{t('mood')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
          {log.mood !== undefined && (
            <span className="text-sm text-[var(--text-2)]">{log.mood}/5</span>
          )}
        </div>
      </div>

      {/* Symptoms */}
      {log.symptoms && log.symptoms.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-[var(--text)] font-semibold" style={{ fontWeight: 600 }}>
            <span>🩺</span>
            <span>{t('symptoms')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {log.symptoms.map((symptomId, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-medium border border-[var(--brand)]/20"
              >
                {translateSymptomId(symptomId)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-[var(--text)] font-semibold" style={{ fontWeight: 600 }}>
          <span>📝</span>
          <span>{t('notes')}</span>
        </div>
        <p className="text-sm text-[var(--text-2)]">
          {log.notes || t('addAnyAdditionalNotes')}
        </p>
      </div>

      {onStartChat && (
        <button
          onClick={onStartChat}
          className="w-full py-3 rounded-[14px] bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand)]/90 transition-colors"
          style={{ fontWeight: 600 }}
        >
          {t('chatWithAI')}
        </button>
      )}
    </div>
  );
};
