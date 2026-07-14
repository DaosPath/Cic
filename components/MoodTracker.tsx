import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { DailyLog } from '../types.ts';
import { formatISO } from 'date-fns/formatISO';
import { startOfToday } from 'date-fns/startOfToday';
import { getLog, upsertLog } from '../services/db.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import { Link } from 'react-router-dom';

export const MoodTracker: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const { t } = useTranslation();
  const todayStr = formatISO(startOfToday(), { representation: 'date' });
  const [selectedMood, setSelectedMood] = useState<number | undefined>();
  const [showSaved, setShowSaved] = useState(false);

  const moods = [
    { value: 1, symbol: '1', label: t('terrible'), ariaLabel: `${t('mood')}: ${t('terrible')}` },
    { value: 2, symbol: '2', label: t('bad'), ariaLabel: `${t('mood')}: ${t('bad')}` },
    { value: 3, symbol: '3', label: t('normal'), ariaLabel: `${t('mood')}: ${t('normal')}` },
    { value: 4, symbol: '4', label: t('good'), ariaLabel: `${t('mood')}: ${t('good')}` },
    { value: 5, symbol: '5', label: t('great'), ariaLabel: `${t('mood')}: ${t('great')}` },
  ];

  useEffect(() => {
    const fetchMood = async () => {
      const log = await getLog(todayStr);
      if (log && log.mood) setSelectedMood(log.mood);
    };
    fetchMood();
  }, [todayStr]);

  const handleMoodSelect = async (moodValue: number) => {
    const newMood = selectedMood === moodValue ? undefined : moodValue;
    setSelectedMood(newMood);

    const existingLog = (await getLog(todayStr)) || {
      id: todayStr,
      date: todayStr,
      symptoms: [],
      medications: [],
    };

    const updatedLog: DailyLog = { ...existingLog, mood: newMood as DailyLog['mood'] };
    await upsertLog(updatedLog);
    await refreshData();

    if (newMood !== undefined) {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  return (
    <div className="aura-surface p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--text)]">{t('howDoYouFeel')}</h3>
        {showSaved && selectedMood && (
          <span className="prediction-label" style={{ color: 'var(--positive)' }}>
            {t('logSaved')}
          </span>
        )}
      </div>
      <div
        className="grid grid-cols-5 gap-2 mb-4"
        role="group"
        aria-label={t('mood')}
      >
        {moods.map((mood) => {
          const active = selectedMood === mood.value;
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => handleMoodSelect(mood.value)}
              aria-label={mood.ariaLabel}
              aria-pressed={active}
              className={`flex flex-col items-center justify-center gap-1 min-h-[var(--touch-min)] rounded-[var(--radius-md)] border transition-colors p-2 ${
                active
                  ? 'border-[var(--plum)] bg-[color-mix(in_srgb,var(--mauve)_14%,transparent)] text-[var(--plum)]'
                  : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--brand)]'
              }`}
            >
              <span className="tabular-nums text-lg font-bold" aria-hidden="true">{mood.symbol}</span>
              <span className="text-[10px] font-medium leading-tight text-center">{mood.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[var(--text-3)] mb-3">Escala 1–5 · se guarda al tocar</p>
      <Link to="/log" className="aura-btn aura-btn-secondary w-full text-sm">
        {t('logSymptoms') || t('log')}
      </Link>
    </div>
  );
};
