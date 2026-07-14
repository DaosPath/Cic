import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { addMonths } from 'date-fns/addMonths';
import { subMonths } from 'date-fns/subMonths';
import { startOfMonth } from 'date-fns/startOfMonth';
import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { endOfWeek } from 'date-fns/endOfWeek';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isToday } from 'date-fns/isToday';
import { formatISO } from 'date-fns/formatISO';
import { getDate } from 'date-fns/getDate';
import { startOfDay } from 'date-fns/startOfDay';
import { addDays } from 'date-fns/addDays';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { tr as trLocale } from 'date-fns/locale/tr';
import { useTranslation } from '../hooks/useTranslation.ts';
import { getLog, upsertLog } from '../services/db.ts';
import type { DailyLog, Symptom, CyclePhase } from '../types.ts';
import { parseISO } from 'date-fns/parseISO';
import { differenceInDays } from 'date-fns/differenceInDays';
const dateFnsLocales = {
    es,
    en: enUS,
    tr: trLocale,
} as const;
const intlLocales = {
    es: 'es-ES',
    en: 'en-US',
    tr: 'tr-TR',
} as const;
const moodEmojis = [
    { value: 1, emoji: '😣' },
    { value: 2, emoji: '😌' },
    { value: 3, emoji: '🙂' },
    { value: 4, emoji: '😊' },
    { value: 5, emoji: '🤩' },
] as const;
interface DayCellProps {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFuture: boolean;
    isPeriod: boolean;
    periodIntensity?: number;
    isFertile: boolean;
    isOvulation: boolean;
    isPredicted: boolean;
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
    isDimmed: boolean;
    cyclePhase: CyclePhase | null;
    log?: DailyLog;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseDown: () => void;
    showTooltip: boolean;
}
const DayCell: React.FC<DayCellProps> = ({
    date,
    dayNumber,
    isCurrentMonth,
    isToday,
    isFuture,
    isPeriod,
    periodIntensity,
    isFertile,
    isOvulation,
    isPredicted,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isDimmed,
    cyclePhase,
    log,
    onClick,
    onMouseEnter,
    onMouseDown,
    showTooltip
}) => {
    const { t, language } = useTranslation();
    const dateLocale = dateFnsLocales[language === 'auto' ? 'es' : language] ?? es;

    // Clean cell: fill only, no stacked borders/shadows. Selection & today use discrete accents.
    let fillStyle: React.CSSProperties = {};
    let textClasses = isCurrentMonth ? 'text-brand-text' : 'text-brand-text-dim/35';
    let cellOpacity = isDimmed ? 0.28 : 1;
    let predicted = false;

    if (isFuture) {
        textClasses = 'text-brand-text-dim/30';
        cellOpacity = 0.45;
    } else if (isPeriod && periodIntensity) {
        const alpha = [0, 0.22, 0.38, 0.52, 0.62][periodIntensity] ?? 0.52;
        fillStyle = { backgroundColor: `color-mix(in srgb, var(--phase-menstruation) ${Math.round(alpha * 100)}%, transparent)` };
        textClasses = periodIntensity >= 3 ? 'text-white font-semibold' : 'text-brand-text font-medium';
        predicted = !!isPredicted;
    } else if (isOvulation) {
        fillStyle = { backgroundColor: 'color-mix(in srgb, var(--phase-ovulation) 32%, transparent)' };
        textClasses = 'text-brand-text font-semibold';
        predicted = !!isPredicted;
    } else if (isFertile) {
        fillStyle = { backgroundColor: 'color-mix(in srgb, var(--phase-follicular) 22%, transparent)' };
        textClasses = 'text-brand-text font-medium';
        predicted = !!isPredicted;
    } else if (cyclePhase && !isFuture) {
        const phaseVar: Record<string, string> = {
            menstruation: 'var(--phase-menstruation)',
            follicular: 'var(--phase-follicular)',
            ovulation: 'var(--phase-ovulation)',
            luteal: 'var(--phase-luteal)',
        };
        fillStyle = {
            backgroundColor: `color-mix(in srgb, ${phaseVar[cyclePhase] || 'var(--brand)'} 10%, transparent)`,
        };
    }

    if (isInRange && !isSelected) {
        fillStyle = {
            ...fillStyle,
            backgroundColor:
                fillStyle.backgroundColor ||
                'color-mix(in srgb, var(--brand) 12%, transparent)',
        };
    }

    const labelDate = format(date, 'd MMMM yyyy', { locale: dateLocale });
    const activate = () => {
        if (!isFuture) onClick();
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (isFuture) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <button
            type="button"
            className={`relative w-full aspect-square flex items-center justify-center rounded-lg
                appearance-none p-0 m-0 border-0 outline-none
                transition-colors duration-150
                focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface)]
                ${isFuture ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}
                ${isSelected ? 'z-[1]' : ''}
                ${predicted ? 'opacity-75' : ''}
            `}
            style={{
                ...fillStyle,
                opacity: cellOpacity,
                // Selected: single soft outline (no double border + ring)
                boxShadow: isSelected
                    ? 'inset 0 0 0 2px var(--brand)'
                    : isRangeStart || isRangeEnd
                      ? 'inset 0 0 0 2px var(--brand)'
                      : predicted && !isSelected
                        ? 'inset 0 0 0 1px color-mix(in srgb, var(--text-2) 35%, transparent)'
                        : fillStyle.boxShadow,
                backgroundImage:
                    predicted && !isSelected
                        ? 'repeating-linear-gradient(135deg, transparent, transparent 3px, color-mix(in srgb, var(--text) 4%, transparent) 3px, color-mix(in srgb, var(--text) 4%, transparent) 4px)'
                        : undefined,
            }}
            onClick={activate}
            onMouseEnter={onMouseEnter}
            onMouseDown={isFuture ? undefined : onMouseDown}
            onKeyDown={onKeyDown}
            role="gridcell"
            aria-label={`${labelDate}${isToday ? ', hoy' : ''}${isSelected ? ', seleccionado' : ''}${log ? ', con registro' : ''}${predicted ? ', estimado' : ''}`}
            aria-selected={isSelected}
            aria-disabled={isFuture}
            disabled={isFuture}
            tabIndex={isCurrentMonth && !isFuture ? 0 : -1}
            data-testid={isToday ? 'calendar-day-today' : `calendar-day-${dayNumber}`}
            data-date={formatISO(date, { representation: 'date' })}
        >
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
                <span
                    className={`text-sm md:text-base font-medium tabular-nums leading-none ${textClasses} ${
                        isToday
                            ? 'bg-[var(--brand)] text-[var(--bg)] w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold'
                            : ''
                    }`}
                >
                    {dayNumber}
                </span>
                {/* Compact data dots — bottom center */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5 min-h-[4px]">
                    {log?.mood ? (
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                    ) : null}
                    {log?.symptoms && log.symptoms.length > 0 ? (
                        <span className="w-1 h-1 rounded-full bg-[var(--brand)]" aria-hidden="true" />
                    ) : null}
                    {log?.notes ? (
                        <span className="w-1 h-1 rounded-full bg-[var(--positive)]" aria-hidden="true" />
                    ) : null}
                    {isPeriod && periodIntensity && periodIntensity > 0 ? (
                        <span
                            className="w-1 h-1 rounded-full bg-[var(--phase-menstruation)]"
                            aria-hidden="true"
                        />
                    ) : null}
                    {isOvulation ? (
                        <span className="w-1 h-1 rounded-full bg-[var(--phase-ovulation)]" aria-hidden="true" />
                    ) : null}
                </div>
            </div>
            {showTooltip && log && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none animate-fade-in">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-md)] p-3 min-w-[180px] text-left">
                        <div className="text-xs font-bold text-brand-text mb-2 pb-2 border-b border-[var(--border)]">
                            {format(date, 'MMM d, yyyy', { locale: dateLocale })}
                        </div>
                        {log.periodIntensity && log.periodIntensity > 0 && (
                            <div className="text-xs text-brand-text mb-1">
                                {t('menstruationIntensity')}: {log.periodIntensity}/3
                            </div>
                        )}
                        {log.mood && (
                            <div className="text-xs text-brand-text mb-1">
                                {t('mood')}: {moodEmojis[log.mood - 1]?.emoji}
                            </div>
                        )}
                        {log.symptoms && log.symptoms.length > 0 && (
                            <div className="text-xs text-brand-text mb-1">
                                {log.symptoms.length} {t('symptoms')}
                            </div>
                        )}
                        {log.notes && (
                            <div className="text-xs text-brand-text-dim truncate">
                                {log.notes.substring(0, 40)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </button>
    );
};
// Day Editor Drawer Component
interface DayEditorProps {
    date: Date;
    log: DailyLog;
    onSave: (log: DailyLog) => void;
    onClose: () => void;
}
const DayEditor: React.FC<DayEditorProps> = ({ date, log: initialLog, onSave, onClose }) => {
    const { settings } = useContext(AppContext);
    const { t, translateEnergyLevel, translateSymptomId, language } = useTranslation();
    const dateLocale = dateFnsLocales[language === 'auto' ? 'es' : language] ?? es;
    const [log, setLog] = useState<DailyLog>(initialLog);
    const [saved, setSaved] = useState(false);
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    // Update log when date changes
    useEffect(() => {
        setLog(initialLog);
        setSaved(false);
    }, [date, initialLog]);
    // Helper to check if a field has data
    const hasData = (field: keyof DailyLog): boolean => {
        const value = log[field];
        if (value === undefined || value === null) return false;
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value > 0;
        if (typeof value === 'string') return value.length > 0;
        if (Array.isArray(value)) {
            // Special handling for medications array
            if (field === 'medications') {
                return value.length > 0 && value.some(m => 
                    (typeof m === 'object' && m !== null && (m.name || m.dose)) || 
                    (typeof m === 'string' && m.length > 0)
                );
            }
            return value.length > 0;
        }
        return false;
    };
    const handleSave = async () => {
        await upsertLog(log);
        onSave(log);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    const PeriodButton: React.FC<{ intensity: 0 | 1 | 2 | 3; label: string }> = ({ intensity, label }) => (
        <button
            onClick={() => setLog({ ...log, periodIntensity: intensity })}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                log.periodIntensity === intensity
                    ? 'bg-phase-menstruation/20 text-phase-menstruation border border-phase-menstruation'
                    : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50'
            }`}
        >
            {label}
        </button>
    );
    return (
        <div
            className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[420px] bg-brand-surface border-l border-brand-border shadow-2xl z-50 overflow-y-auto animate-slide-in-right"
            data-testid="day-details-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-editor-title"
        >
            <div className="sticky top-0 bg-brand-surface/95 backdrop-blur-lg border-b border-brand-border p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 id="day-editor-title" className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                            {format(date, 'LLLL d, yyyy', { locale: dateLocale })}
                        </h2>
                        <p className="text-sm text-brand-text-dim" style={{ fontWeight: 500 }}>
                            {format(date, 'EEEE', { locale: dateLocale })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-150 hover:scale-105 active:scale-95"
                        aria-label="Cerrar"
                    >
                        <svg className="w-5 h-5 text-brand-text-dim hover:text-brand-text transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Mode Toggle */}
                <div className="flex bg-brand-surface-2 rounded-lg p-1 border border-brand-border">
                    <button
                        onClick={() => setIsAdvancedMode(false)}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                            !isAdvancedMode
                                ? 'bg-brand-primary text-white shadow-sm'
                                : 'text-brand-text-dim hover:text-brand-text'
                        }`}
                        style={{ fontWeight: 500 }}
                    >
                        {t('simplifiedMode')}
                    </button>
                    <button
                        onClick={() => setIsAdvancedMode(true)}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                            isAdvancedMode
                                ? 'bg-brand-primary text-white shadow-sm'
                                : 'text-brand-text-dim hover:text-brand-text'
                        }`}
                        style={{ fontWeight: 500 }}
                    >
                        {t('advancedMode')}
                    </button>
                </div>
            </div>
            <div className="p-4 space-y-3">
                {/* Simplified Mode - Basic Fields */}
                {!isAdvancedMode && (
                    <>
                        {/* Menstruation */}
                        <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <h3 className="text-xs font-bold text-brand-text" style={{ fontWeight: 700 }}>
                                    {t('menstruationIntensity')}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <PeriodButton intensity={0} label={t('noFlow')} />
                                <PeriodButton intensity={1} label={t('light')} />
                                <PeriodButton intensity={2} label={t('medium')} />
                                <PeriodButton intensity={3} label={t('heavy')} />
                            </div>
                        </div>
                        {/* Mood */}
                        <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xs font-bold text-brand-text" style={{ fontWeight: 700 }}>
                                    {t('mood')}
                                </h3>
                            </div>
                            <div className="flex justify-between gap-1">
                                {moodEmojis.map(({ value, emoji }) => (
                                    <button
                                        key={value}
                                        onClick={() => setLog({ ...log, mood: value as DailyLog['mood'] })}
                                        className={`text-2xl rounded-lg p-2 transition-all duration-200 ${
                                            log.mood === value 
                                                ? 'bg-brand-primary/20 ring-2 ring-brand-primary/50' 
                                                : 'hover:bg-brand-surface/50'
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Symptoms */}
                        <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-xs font-bold text-brand-text" style={{ fontWeight: 700 }}>
                                    {t('symptoms')}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {settings.customSymptoms.map((symptom: Symptom) => (
                                    <button
                                        key={symptom.id}
                                        onClick={() => {
                                            const symptoms = log.symptoms || [];
                                            setLog({
                                                ...log,
                                                symptoms: symptoms.includes(symptom.id)
                                                    ? symptoms.filter(id => id !== symptom.id)
                                                    : [...symptoms, symptom.id]
                                            });
                                        }}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                            log.symptoms?.includes(symptom.id)
                                                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary'
                                                : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50'
                                        }`}
                                    >
                                        {translateSymptomId(symptom.id) || symptom.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Notes */}
                        <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <h3 className="text-xs font-bold text-brand-text" style={{ fontWeight: 700 }}>
                                    {t('notes')}
                                </h3>
                            </div>
                            <textarea
                                value={log.notes || ''}
                                onChange={(e) => setLog({ ...log, notes: e.target.value })}
                                className="w-full h-20 bg-brand-surface p-2.5 rounded-lg border border-brand-border hover:bg-brand-surface-2 focus:border-brand-primary outline-none transition-all duration-200 resize-none text-brand-text text-xs"
                                placeholder={t('addAnyAdditionalNotes')}
                                style={{ fontWeight: 400, lineHeight: 1.5 }}
                            />
                        </div>
                    </>
                )}
                {/* Advanced Mode - Show only fields with data */}
                {isAdvancedMode && (
                    <>
                        {/* Menstruation Details */}
                        {(hasData('periodIntensity') || hasData('periodColor') || hasData('hasClots') || hasData('periodProducts')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>Menstruaci?n</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('periodIntensity') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('menstruationIntensity')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {[t('noFlow'), t('spotting'), t('light'), t('medium'), t('heavy')][log.periodIntensity || 0]}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('periodColor') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('menstruationColorLabel')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {{
                                                    'bright-red': t('menstruationColorBrightRed'),
                                                    'dark-red': t('menstruationColorDarkRed'),
                                                    brown: t('menstruationColorBrown'),
                                                    pink: t('menstruationColorPink')
                                                }[log.periodColor!]}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('hasClots') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Co?gulos:</span>
                                            <span className="text-brand-text font-medium">S?</span>
                                        </div>
                                    )}
                                    {hasData('periodProducts') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Productos:</span>
                                            <span className="text-brand-text font-medium">
                                                {log.periodProducts?.map(p => {
                                                    const translations: Record<string, string> = {
                                                        pad: 'Toalla',
                                                        tampon: 'Tamp?n',
                                                        cup: 'Copa',
                                                        disc: 'Disco'
                                                    };
                                                    return translations[p] || p;
                                                }).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Mood */}
                        {hasData('mood') && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>{t('mood')}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{moodEmojis.find(m => m.value === log.mood)?.emoji}</span>
                                    <span className="text-xs text-brand-text">
                        {[t('terrible'), t('bad'), t('normal'), t('good'), t('great')][log.mood! - 1]}
                                    </span>
                                </div>
                            </div>
                        )}
                        {/* Pain */}
                        {(hasData('painLevel') || hasData('painLocations')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>Dolor</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('painLevel') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Nivel:</span>
                                            <span className="text-brand-text font-medium">{log.painLevel}/10</span>
                                        </div>
                                    )}
                                    {hasData('painLocations') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Ubicaci?n:</span>
                                            <span className="text-brand-text font-medium">{log.painLocations?.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Energy & Stress */}
                        {(hasData('energyLevel') || hasData('stressScore') || hasData('stressLevel')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>{t('metricEnergy')} & {t('mentalStressLabel')}</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('energyLevel') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('energyLabel')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {translateEnergyLevel(log.energyLevel)}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('stressScore') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('dailyInsightStressTitle')}:</span>
                                            <span className="text-brand-text font-medium">{log.stressScore}/10</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Sleep */}
                        {(hasData('sleepHours') || hasData('sleepQuality')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>{t('sleepHabits')}</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('sleepHours') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('sleepHoursLabel')}:</span>
                                            <span className="text-brand-text font-medium">{log.sleepHours}h</span>
                                        </div>
                                    )}
                                    {hasData('sleepQuality') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('sleepQualityLabel')}:</span>
                                            <span className="text-brand-text font-medium">{log.sleepQuality}/5</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Physical Activity */}
                        {(hasData('physicalActivity') || hasData('activityType') || hasData('activityDuration')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>{t('physicalActivityTitle')}</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('physicalActivity') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('activityIntensityLabel')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {log.physicalActivity === 'none'
                                                    ? t('activityIntensityNone')
                                                    : log.physicalActivity === 'light'
                                                        ? t('activityIntensityLight')
                                                        : log.physicalActivity === 'moderate'
                                                            ? t('activityIntensityModerate')
                                                            : t('activityIntensityIntense')}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('activityType') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('activityTypeLabel')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {log.activityType?.map(typeKey => {
                                                    const translations: Record<string, string> = {
                                                        walking: t('activityTypeWalking'),
                                                        running: t('activityTypeRunning'),
                                                        strength: t('activityTypeStrength'),
                                                        yoga: t('activityTypeYoga'),
                                                        other: t('activityTypePlaceholder')
                                                    };
                                                    return translations[typeKey] || typeKey;
                                                }).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('activityDuration') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('activityDurationLabel')}:</span>
                                            <span className="text-brand-text font-medium">{log.activityDuration} min</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Fertility */}
                        {(hasData('cervicalFluid') || hasData('ovulationTest')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>{t('fertility')}</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('cervicalFluid') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('cervicalFlowLabel')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {log.cervicalFluid === 'dry' ? t('cervicalFlowDry') :
                                                 log.cervicalFluid === 'sticky' ? t('cervicalFlowSticky') :
                                                 log.cervicalFluid === 'creamy' ? t('cervicalFlowCreamy') :
                                                 log.cervicalFluid === 'watery' ? t('cervicalFlowWatery') : t('cervicalFlowEggWhite')}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('ovulationTest') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('ovulationTestLabel')}:</span>
                                            <span className="text-brand-text font-medium">
                                                {log.ovulationTest === 'positive' ? t('ovulationTestPositive') :
                                                 log.ovulationTest === 'negative' ? t('ovulationTestNegative') : t('ovulationTestIndeterminate')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Supplements & Medication */}
                        {(hasData('supplements') || hasData('medications') || hasData('contraception')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>Medicaci?n</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('supplements') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Suplementos:</span>
                                            <span className="text-brand-text font-medium">
                                                {log.supplements?.map(s => {
                                                    const translations: Record<string, string> = {
                                                        iron: 'Hierro',
                                                        magnesium: 'Magnesio',
                                                        omega3: 'Omega-3',
                                                        vitaminD: 'Vitamina D',
                                                        other: 'Otro'
                                                    };
                                                    return translations[s] || s;
                                                }).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {hasData('medications') && Array.isArray(log.medications) && log.medications.length > 0 && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-brand-text-dim">Medicamentos:</span>
                                            <div className="space-y-0.5">
                                                {log.medications.map((m, idx) => (
                                                    <div key={idx} className="text-brand-text font-medium text-xs">
                                                        ? {typeof m === 'object' && m !== null ? `${m.name || ''}${m.dose ? ` ${m.dose}` : ''}` : String(m)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {hasData('contraception') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Anticonceptivo:</span>
                                            <span className="text-brand-text font-medium">{log.contraception}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Health Metrics */}
                        {(hasData('basalTemp') || hasData('weight') || hasData('waterIntake')) && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>M?tricas de Salud</h3>
                                <div className="space-y-1.5 text-xs">
                                    {hasData('basalTemp') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Temperatura basal:</span>
                                            <span className="text-brand-text font-medium">{log.basalTemp}?C</span>
                                        </div>
                                    )}
                                    {hasData('weight') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">Peso:</span>
                                            <span className="text-brand-text font-medium">{log.weight} kg</span>
                                        </div>
                                    )}
                                    {hasData('waterIntake') && (
                                        <div className="flex justify-between">
                                            <span className="text-brand-text-dim">{t('sleepWaterLabel')}:</span>
                                            <span className="text-brand-text font-medium">{log.waterIntake} L</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Symptoms */}
                        {hasData('symptoms') && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>{t('symptoms')}</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {log.symptoms?.map(symptomId => {
                                        const symptom = settings.customSymptoms.find(s => s.id === symptomId);
                                        return symptom ? (
                                            <span key={symptomId} className="px-2 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary text-xs">
                                                {symptom.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Notes */}
                        {hasData('notes') && (
                            <div className="bg-brand-surface-2 p-3 rounded-xl border border-brand-border">
                                <h3 className="text-xs font-bold text-brand-text mb-2" style={{ fontWeight: 700 }}>Notas</h3>
                                <p className="text-xs text-brand-text leading-relaxed">{log.notes}</p>
                            </div>
                        )}
                        {/* Empty State */}
                        {!hasData('periodIntensity') && !hasData('mood') && !hasData('painLevel') && !hasData('energyLevel') && 
                         !hasData('sleepHours') && !hasData('physicalActivity') && !hasData('symptoms') && !hasData('notes') &&
                         !hasData('cervicalFluid') && !hasData('supplements') && !hasData('basalTemp') && (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-brand-text-dim/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm text-brand-text-dim">No hay datos registrados</p>
                                <p className="text-xs text-brand-text-dim/70 mt-1">Cambia a modo simplificado para agregar</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
// Month Selector Modal
interface MonthSelectorProps {
    currentDate: Date;
    onSelect: (date: Date) => void;
    onClose: () => void;
}
const MonthSelector: React.FC<MonthSelectorProps> = ({ currentDate, onSelect, onClose }) => {
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const months = Array.from({ length: 12 }, (_, i) => new Date(selectedYear, i, 1));
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border rounded-[18px] shadow-2xl max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setSelectedYear(selectedYear - 1)}
                        className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-150 hover:scale-110 active:scale-95"
                    >
                        <svg className="w-5 h-5 text-brand-text hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-bold text-brand-text" style={{ fontWeight: 700 }}>{selectedYear}</h3>
                    <button
                        onClick={() => setSelectedYear(selectedYear + 1)}
                        className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-150 hover:scale-110 active:scale-95"
                    >
                        <svg className="w-5 h-5 text-brand-text hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {months.map((month, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onSelect(month);
                                onClose();
                            }}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 ${
                                month.getMonth() === currentDate.getMonth() && month.getFullYear() === currentDate.getFullYear()
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'bg-brand-surface-2 text-brand-text hover:bg-brand-primary/20 hover:shadow-sm'
                            }`}
                            style={{ fontWeight: 500 }}
                        >
                            {format(month, 'MMM')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
// Main Calendar Component
export const CalendarPage: React.FC = () => {
    const { logs, predictions, settings, refreshData, cycles } = useContext(AppContext);
    const { t, language, translateSymptomId } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showMonthSelector, setShowMonthSelector] = useState(false);
    const [showPredictions, setShowPredictions] = useState(true);
    const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'period' | 'fertile' | 'ovulation'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const dateLocale = dateFnsLocales[language] ?? es;
    const intlLocale = intlLocales[language] ?? 'es-ES';
    const weekStartsOn = settings.startOfWeek === 'monday' ? 1 : 0;
    const daysInGrid = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const gridStart = startOfWeek(monthStart, { weekStartsOn });
        const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn });
        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, [currentMonth, weekStartsOn]);
    const logsMap = useMemo(() => new Map(logs.map(log => [log.id, log])), [logs]);
    const weekDays = useMemo(() => {
        const base = startOfWeek(new Date(), { weekStartsOn });
        return Array.from({ length: 7 }, (_, index) =>
            format(addDays(base, index), 'EEE', { locale: dateLocale })
        );
    }, [dateLocale, weekStartsOn]);
    const monthLabel = format(currentMonth, 'MMMM', { locale: dateLocale });
    const yearLabel = format(currentMonth, 'yyyy');
    const nextMonth = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setCurrentMonth(addMonths(currentMonth, 1));
            setIsLoading(false);
        }, 150);
    }, [currentMonth]);
    const prevMonth = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setCurrentMonth(subMonths(currentMonth, 1));
            setIsLoading(false);
        }, 150);
    }, [currentMonth]);
    const goToToday = useCallback(() => {
        setCurrentMonth(startOfMonth(new Date()));
        setSelectedDate(new Date());
    }, []);
    const handleDayClick = useCallback((date: Date) => {
        // Don't allow selecting future dates
        const today = startOfDay(new Date());
        if (startOfDay(date) > today) {
            return;
        }
        setSelectedDate(date);
        setRangeStart(null);
        setRangeEnd(null);
    }, []);
    const handleDayMouseDown = useCallback((date: Date) => {
        // Don't allow range selection starting from future dates
        const today = startOfDay(new Date());
        if (startOfDay(date) > today) {
            return;
        }
        setIsDragging(true);
        setRangeStart(date);
        setRangeEnd(date);
    }, []);
    const handleDayMouseEnter = useCallback((date: Date) => {
        const today = startOfDay(new Date());
        const isFuture = startOfDay(date) > today;
        if (!isFuture) {
            setHoveredDate(date);
        } else {
            // Clear tooltip when hovering over future dates
            setHoveredDate(null);
        }
        if (isDragging && rangeStart && !isFuture) {
            setRangeEnd(date);
        }
    }, [isDragging, rangeStart]);
    const handleMouseLeave = useCallback(() => {
        setHoveredDate(null);
    }, []);
    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging && rangeStart && rangeEnd) {
                // Range selection completed
                setIsDragging(false);
            }
        };
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [isDragging, rangeStart, rangeEnd]);
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedDate) return;
            let newDate: Date | null = null;
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    newDate = addDays(selectedDate, -1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    newDate = addDays(selectedDate, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    newDate = addDays(selectedDate, -7);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    newDate = addDays(selectedDate, 7);
                    break;
                case 'Escape':
                    e.preventDefault();
                    setSelectedDate(null);
                    break;
            }
            if (newDate) {
                // Don't allow navigating to future dates
                const today = startOfDay(new Date());
                if (startOfDay(newDate) > today) {
                    return;
                }
                setSelectedDate(newDate);
                // Change month if needed
                if (!isSameMonth(newDate, currentMonth)) {
                    setCurrentMonth(startOfMonth(newDate));
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedDate, currentMonth]);
    const handleSaveDay = useCallback(async (log: DailyLog) => {
        await refreshData();
    }, [refreshData]);
    const handleCloseEditor = useCallback(() => {
        setSelectedDate(null);
    }, []);
    const exportToCSV = useCallback(() => {
        const monthLogs = logs.filter(log => {
            const logDate = new Date(log.date);
            return isSameMonth(logDate, currentMonth);
        });
        const csv = [
            [t('date'), t('menstruationIntensity'), t('mood'), t('symptoms'), t('notes')].join(','),
            ...monthLogs.map(log => [
                log.date,
                log.periodIntensity || '',
                log.mood || '',
                (log.symptoms || []).map(translateSymptomId).join(';'),
                (log.notes || '').replace(/,/g, ';')
            ].join(','))
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ciclo-${format(currentMonth, 'yyyy-MM')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [logs, currentMonth]);
    const exportToICal = useCallback(() => {
        const monthLogs = logs.filter(log => {
            const logDate = new Date(log.date);
            return isSameMonth(logDate, currentMonth);
        });
        const events = monthLogs
            .filter(log => log.periodIntensity && log.periodIntensity > 0)
            .map(log => {
                const date = new Date(log.date);
                const dateStr = format(date, 'yyyyMMdd');
                return [
                    'BEGIN:VEVENT',
                    `DTSTART;VALUE=DATE:${dateStr}`,
                    `DTEND;VALUE=DATE:${dateStr}`,
                    `SUMMARY:Menstruaci?n (${log.periodIntensity}/3)`,
                    `DESCRIPTION:${log.notes || ''}`,
                    'END:VEVENT'
                ].join('\n');
            });
        const ical = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Aura Ciclo//ES',
            ...events,
            'END:VCALENDAR'
        ].join('\n');
        const blob = new Blob([ical], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ciclo-${format(currentMonth, 'yyyy-MM')}.ics`;
        a.click();
        URL.revokeObjectURL(url);
    }, [logs, currentMonth]);
    const selectedRangeCount = useMemo(() => {
        if (!rangeStart || !rangeEnd) return 0;
        const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
        const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
        return eachDayOfInterval({ start, end }).length;
    }, [rangeStart, rangeEnd]);
    return (
        <div className="page-content safe-pb md:pb-12">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="aura-surface p-5 md:p-6 mb-6 sticky top-0 z-40">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center justify-between md:justify-start gap-4">
                            <button
                                onClick={prevMonth}
                                className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-150 hover:scale-110 active:scale-95 hover:shadow-sm"
                                aria-label={t('previousMonth')}
                            >
                                <svg className="w-5 h-5 text-brand-text hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setShowMonthSelector(true)}
                                className="text-center hover:bg-brand-surface-2 px-4 py-2 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <h1 className="text-2xl md:text-3xl font-bold capitalize text-brand-text" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    {monthLabel}
                                </h1>
                                <p className="text-sm md:text-base text-brand-text-dim" style={{ fontWeight: 500 }}>
                                    {yearLabel}
                                </p>
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-150 hover:scale-110 active:scale-95 hover:shadow-sm"
                                aria-label={t('nextMonth')}
                            >
                                <svg className="w-5 h-5 text-brand-text hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-brand-primary/20 text-brand-primary border border-brand-primary hover:bg-brand-primary/30 hover:scale-105 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md"
                                style={{ fontWeight: 500 }}
                            >
                                {t('today')}
                            </button>
                                <button
                                    onClick={() => setShowPredictions(!showPredictions)}
                                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-150 hover:scale-105 active:scale-95 ${
                                        showPredictions
                                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary shadow-sm'
                                            : 'bg-transparent text-brand-text-dim border border-brand-border hover:bg-brand-surface-2 hover:text-brand-text'
                                    }`}
                                >
                                    {t('predictions')}
                                </button>
                            <div className="relative group">
                                <button className="p-2 rounded-lg hover:bg-brand-surface-2 transition-colors">
                                    <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 top-full mt-2 bg-brand-surface border border-brand-border rounded-lg shadow-xl p-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <button
                                            onClick={exportToCSV}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-surface-2 text-sm text-brand-text transition-colors flex items-center gap-2"
                                        >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                            {t('exportCsv')}
                                        </button>
                                        <button
                                        onClick={exportToICal}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-surface-2 text-sm text-brand-text transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                            {t('exportICal')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Range Selection Info */}
                    {rangeStart && rangeEnd && selectedRangeCount > 1 && (
                        <div className="mt-4 px-4 py-2.5 bg-brand-primary/15 border border-brand-primary/40 rounded-xl text-sm text-brand-primary flex items-center justify-between shadow-sm animate-fade-in">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="font-semibold" style={{ fontWeight: 600 }}>
                                    {selectedRangeCount} d?a{selectedRangeCount > 1 ? 's' : ''} seleccionado{selectedRangeCount > 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setRangeStart(null);
                                    setRangeEnd(null);
                                }}
                                className="text-xs font-medium hover:bg-brand-primary/20 px-2 py-1 rounded-lg transition-all duration-150"
                                style={{ fontWeight: 500 }}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
                {/* Calendar Grid */}
                <div className="aura-surface p-4 md:p-6 mb-6 transition-all duration-200">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1" role="row">
                                {weekDays.map((day, index) => (
                                    <div key={index} className="text-center py-1.5" role="columnheader">
                                        <span className="text-[11px] md:text-xs font-semibold text-brand-text-dim uppercase tracking-wide">
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5 md:gap-1" role="grid" onMouseLeave={handleMouseLeave}>
                                {daysInGrid.map((day) => {
                                    const dayId = formatISO(day, { representation: 'date' });
                                    const log = logsMap.get(dayId);
                                    const isPeriod = !!(log?.periodIntensity && log.periodIntensity > 0);
                                    const dayStart = startOfDay(day);
                                    const today = startOfDay(new Date());
                                    const isFuture = dayStart > today;
                                    // Calculate cycle phase for this day
                                    let cyclePhase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal' | null = null;
                                    if (cycles.length > 0 && cycles[0].startDate) {
                                        const cycleStartDate = startOfDay(parseISO(cycles[0].startDate));
                                        const dayOfCycle = differenceInDays(dayStart, cycleStartDate) + 1;
                                        if (dayOfCycle > 0 && dayOfCycle <= settings.cycleLength + 7) {
                                            const estimatedOvulationDay = settings.cycleLength - settings.lutealPhaseLength;
                                            const estimatedPeriodEndDay = 5;
                                            if (dayOfCycle <= estimatedPeriodEndDay) {
                                                cyclePhase = 'menstruation';
                                            } else if (dayOfCycle < estimatedOvulationDay - 3) {
                                                cyclePhase = 'follicular';
                                            } else if (dayOfCycle >= estimatedOvulationDay - 3 && dayOfCycle <= estimatedOvulationDay + 1) {
                                                cyclePhase = 'ovulation';
                                            } else if (dayOfCycle > estimatedOvulationDay + 1 && dayOfCycle <= settings.cycleLength) {
                                                cyclePhase = 'luteal';
                                            }
                                        }
                                    }
                                    let isFertile = false;
                                    let isOvulation = false;
                                    let isPredicted = false;
                                    if (predictions && showPredictions) {
                                        if (dayStart >= predictions.fertileWindow[0] && dayStart <= predictions.fertileWindow[1]) {
                                            isFertile = true;
                                            isPredicted = !log;
                                        }
                                        if (isSameDay(dayStart, predictions.ovulationDate)) {
                                            isOvulation = true;
                                            isPredicted = !log;
                                        }
                                    }
                                    if (showOnlyConfirmed && !log) {
                                        isFertile = false;
                                        isOvulation = false;
                                    }
                                    // Filter logic - hide non-matching days
                                    let shouldDim = false;
                                    if (activeFilter === 'period' && !isPeriod) shouldDim = true;
                                    if (activeFilter === 'fertile' && !isFertile) shouldDim = true;
                                    if (activeFilter === 'ovulation' && !isOvulation) shouldDim = true;
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                                    const isRangeStart = rangeStart && isSameDay(day, rangeStart);
                                    const isRangeEnd = rangeEnd && isSameDay(day, rangeEnd);
                                    const isInRange = rangeStart && rangeEnd && dayStart >= (rangeStart < rangeEnd ? rangeStart : rangeEnd) && dayStart <= (rangeStart < rangeEnd ? rangeEnd : rangeStart);
                                    const showTooltip = hoveredDate && isSameDay(day, hoveredDate) && !!log;
                                    return (
                                        <DayCell
                                            key={dayId}
                                            date={day}
                                            dayNumber={getDate(day)}
                                            isCurrentMonth={isSameMonth(day, currentMonth)}
                                            isToday={isToday(day)}
                                            isFuture={isFuture}
                                            isPeriod={isPeriod}
                                            periodIntensity={log?.periodIntensity}
                                            isFertile={isFertile}
                                            isOvulation={isOvulation}
                                            isPredicted={isPredicted}
                                            isSelected={!!isSelected}
                                            isRangeStart={!!isRangeStart}
                                            isRangeEnd={!!isRangeEnd}
                                            isInRange={!!isInRange}
                                            isDimmed={shouldDim}
                                            cyclePhase={cyclePhase}
                                            log={log}
                                            onClick={() => handleDayClick(day)}
                                            onMouseEnter={() => handleDayMouseEnter(day)}
                                            onMouseDown={() => handleDayMouseDown(day)}
                                            showTooltip={showTooltip}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
                {/* Legend: phases (filters) + indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    <section className="aura-surface p-4 md:p-5" aria-labelledby="legend-phases-title">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <h3 id="legend-phases-title" className="text-sm font-semibold text-brand-text tracking-tight">
                                {t('cyclePhasesTitle')}
                            </h3>
                            {activeFilter !== 'all' && (
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter('all')}
                                    className="text-[11px] font-medium text-brand-text-dim hover:text-brand-primary min-h-[32px] px-2 rounded-full hover:bg-[var(--surface-2)] transition-colors"
                                >
                                    Ver todo
                                </button>
                            )}
                        </div>
                        <p className="text-[11px] text-brand-text-dim mb-3 leading-relaxed">
                            Toca para filtrar el mes. El relleno del día refleja la fase o el dato.
                        </p>
                        <div className="flex flex-col gap-2" role="group" aria-label={t('cyclePhasesTitle')}>
                            {(
                                [
                                    {
                                        id: 'period' as const,
                                        label: t('menstruation'),
                                        swatch: 'var(--phase-menstruation)',
                                        active: activeFilter === 'period',
                                    },
                                    {
                                        id: 'fertile' as const,
                                        label: t('fertileWindow'),
                                        swatch: 'var(--phase-follicular)',
                                        active: activeFilter === 'fertile',
                                    },
                                    {
                                        id: 'ovulation' as const,
                                        label: t('ovulation'),
                                        swatch: 'var(--phase-ovulation)',
                                        active: activeFilter === 'ovulation',
                                        star: true,
                                    },
                                ] as const
                            ).map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveFilter(item.active ? 'all' : item.id)}
                                    aria-pressed={item.active}
                                    className="flex items-center gap-3 min-h-[48px] px-3 rounded-xl text-left transition-colors border-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                                    style={{
                                        background: item.active
                                            ? `color-mix(in srgb, ${item.swatch} 18%, var(--surface-2))`
                                            : 'var(--surface-2)',
                                        boxShadow: item.active
                                            ? `inset 0 0 0 1.5px ${item.swatch}`
                                            : 'inset 0 0 0 1px var(--border)',
                                    }}
                                >
                                    <span
                                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                                        style={{
                                            background: `color-mix(in srgb, ${item.swatch} 35%, transparent)`,
                                        }}
                                        aria-hidden="true"
                                    >
                                        {item.star ? (
                                            <svg className="w-4 h-4" style={{ color: item.swatch }} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ) : (
                                            <span
                                                className="w-3.5 h-3.5 rounded-full"
                                                style={{ background: item.swatch }}
                                            />
                                        )}
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-brand-text">{item.label}</span>
                                    {item.active && (
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-text-dim">
                                            Activo
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="aura-surface p-4 md:p-5" aria-labelledby="legend-indicators-title">
                        <h3 id="legend-indicators-title" className="text-sm font-semibold text-brand-text tracking-tight mb-1">
                            {t('indicatorsTitle')}
                        </h3>
                        <p className="text-[11px] text-brand-text-dim mb-4 leading-relaxed">
                            <span className="prediction-label mr-1 align-middle">Estimado</span>
                            predicción ·{' '}
                            <span className="prediction-label mr-1 align-middle" style={{ color: 'var(--positive)' }}>
                                Registrado
                            </span>
                            con tus datos. Puede variar.
                        </p>
                        <ul className="space-y-0 divide-y divide-[var(--border)]">
                            {(
                                [
                                    {
                                        key: 'ovu',
                                        label: t('ovulationDayIndicator'),
                                        badge: 'Estimado',
                                        sample: (
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ background: 'var(--phase-ovulation)' }}
                                                aria-hidden="true"
                                            />
                                        ),
                                    },
                                    {
                                        key: 'period',
                                        label: t('periodIntensityIndicator'),
                                        badge: 'Registrado',
                                        sample: (
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ background: 'var(--phase-menstruation)' }}
                                                aria-hidden="true"
                                            />
                                        ),
                                    },
                                    {
                                        key: 'mood',
                                        label: t('moodRecordedIndicator'),
                                        badge: 'Registrado',
                                        sample: (
                                            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                                        ),
                                    },
                                    {
                                        key: 'sym',
                                        label: t('symptomsRecordedIndicator'),
                                        badge: 'Registrado',
                                        sample: (
                                            <span className="w-2 h-2 rounded-full bg-[var(--brand)]" aria-hidden="true" />
                                        ),
                                    },
                                    {
                                        key: 'notes',
                                        label: t('notesWrittenIndicator'),
                                        badge: 'Registrado',
                                        sample: (
                                            <span className="w-2 h-2 rounded-full bg-[var(--positive)]" aria-hidden="true" />
                                        ),
                                    },
                                    {
                                        key: 'pred',
                                        label: t('predictionUnconfirmed'),
                                        badge: 'Estimado',
                                        sample: (
                                            <span
                                                className="w-6 h-5 rounded"
                                                style={{
                                                    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--text-2) 40%, transparent)',
                                                    backgroundImage:
                                                        'repeating-linear-gradient(135deg, transparent, transparent 2px, color-mix(in srgb, var(--text) 6%, transparent) 2px, color-mix(in srgb, var(--text) 6%, transparent) 3px)',
                                                }}
                                                aria-hidden="true"
                                            />
                                        ),
                                    },
                                ] as const
                            ).map((row) => (
                                <li key={row.key} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                    <span className="w-8 h-8 rounded-lg bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0">
                                        {row.sample}
                                    </span>
                                    <span className="flex-1 text-sm text-brand-text leading-snug">{row.label}</span>
                                    <span
                                        className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
                                        style={{
                                            background:
                                                row.badge === 'Estimado'
                                                    ? 'color-mix(in srgb, var(--text-2) 14%, transparent)'
                                                    : 'color-mix(in srgb, var(--positive) 16%, transparent)',
                                            color: row.badge === 'Estimado' ? 'var(--text-2)' : 'var(--positive)',
                                        }}
                                    >
                                        {row.badge}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
            {/* Day Editor Drawer */}
            {selectedDate && (
                <DayEditor
                    key={formatISO(selectedDate, { representation: 'date' })}
                    date={selectedDate}
                    log={logsMap.get(formatISO(selectedDate, { representation: 'date' })) || {
                        id: formatISO(selectedDate, { representation: 'date' }),
                        date: formatISO(selectedDate, { representation: 'date' }),
                        symptoms: [],
                        medications: [],
                    }}
                    onSave={handleSaveDay}
                    onClose={handleCloseEditor}
                />
            )}
            {/* Month Selector Modal */}
            {showMonthSelector && (
                <MonthSelector
                    currentDate={currentMonth}
                    onSelect={setCurrentMonth}
                    onClose={() => setShowMonthSelector(false)}
                />
            )}
        </div>
    );
};
