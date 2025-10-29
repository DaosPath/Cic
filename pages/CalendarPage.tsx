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
import type { DailyLog, Symptom } from '../types.ts';

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
    { value: 2, emoji: '😔' },
    { value: 3, emoji: '😐' },
    { value: 4, emoji: '🙂' },
    { value: 5, emoji: '🤩' },
] as const;

interface DayCellProps {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isPeriod: boolean;
    periodIntensity?: number;
    isFertile: boolean;
    isOvulation: boolean;
    isPredicted: boolean;
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
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
    isPeriod,
    periodIntensity,
    isFertile,
    isOvulation,
    isPredicted,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isInRange,
    log,
    onClick,
    onMouseEnter,
    onMouseDown,
    showTooltip
}) => {
    const baseClasses = 'relative w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer group';

    let bgClasses = 'bg-transparent hover:bg-brand-surface/50';
    let textClasses = isCurrentMonth ? 'text-brand-text' : 'text-brand-text-dim/40';
    let borderClasses = 'border border-transparent';

    // Range selection styling
    if (isInRange) {
        bgClasses = 'bg-brand-primary/10';
    }
    if (isRangeStart || isRangeEnd) {
        borderClasses = 'border border-brand-primary';
    }

    // Phase styling
    if (isOvulation) {
        bgClasses = isPredicted 
            ? 'bg-phase-ovulation/25 opacity-60' 
            : 'bg-phase-ovulation/40 shadow-sm';
        textClasses = 'text-brand-text font-semibold';
        borderClasses = 'border border-phase-ovulation/30';
    } else if (isFertile) {
        bgClasses = isPredicted 
            ? 'bg-phase-follicular/15 opacity-60' 
            : 'bg-phase-follicular/25 shadow-sm';
        textClasses = 'text-brand-text font-medium';
        borderClasses = 'border border-phase-follicular/20';
    }

    if (isPeriod && periodIntensity) {
        const intensityOpacity = [0, 0.2, 0.35, 0.5][periodIntensity] || 0.5;
        bgClasses = isPredicted
            ? `bg-phase-menstruation/${Math.round(intensityOpacity * 100)} opacity-60`
            : `bg-phase-menstruation/${Math.round(intensityOpacity * 100)} shadow-sm`;
        textClasses = periodIntensity >= 2 ? 'text-white font-semibold' : 'text-brand-text font-medium';
        borderClasses = 'border border-phase-menstruation/40';
    }

    if (isSelected) {
        borderClasses = 'border-2 border-brand-primary shadow-lg';
    }

    const dayClasses = `${baseClasses} ${bgClasses} ${borderClasses}`;

    return (
        <div 
            className={dayClasses}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
            role="gridcell"
            aria-selected={isSelected}
            tabIndex={isCurrentMonth ? 0 : -1}
        >
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <span className={`text-sm md:text-base transition-all duration-200 ${textClasses} ${
                    isToday ? 'bg-brand-primary text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-bold shadow-md' : ''
                }`}>
                    {dayNumber}
                </span>
                
                {/* Indicators */}
                <div className="absolute bottom-1 flex gap-0.5">
                    {log?.mood && (
                        <div className="w-1 h-1 bg-brand-accent rounded-full"></div>
                    )}
                    {log?.symptoms && log.symptoms.length > 0 && (
                        <div className="w-1 h-1 bg-brand-primary rounded-full"></div>
                    )}
                    {log?.notes && (
                        <div className="w-1 h-1 bg-brand-positive rounded-full"></div>
                    )}
                </div>

                {/* Ovulation marker */}
                {isOvulation && (
                    <div className="absolute top-1 right-1">
                        <svg className="w-3 h-3 text-phase-ovulation" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Tooltip */}
            {showTooltip && log && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                    <div className="bg-brand-surface border border-brand-border rounded-lg shadow-xl p-3 min-w-[180px] text-left">
                        <div className="text-xs font-semibold text-brand-text mb-2">
                            {format(date, 'MMM d, yyyy')}
                        </div>
                        {log.periodIntensity && log.periodIntensity > 0 && (
                            <div className="text-xs text-brand-text-dim mb-1">
                                🩸 Intensidad: {log.periodIntensity}/3
                            </div>
                        )}
                        {log.mood && (
                            <div className="text-xs text-brand-text-dim mb-1">
                                {moodEmojis[log.mood - 1]?.emoji} Estado de ánimo
                            </div>
                        )}
                        {log.symptoms && log.symptoms.length > 0 && (
                            <div className="text-xs text-brand-text-dim mb-1">
                                📋 {log.symptoms.length} síntoma{log.symptoms.length > 1 ? 's' : ''}
                            </div>
                        )}
                        {log.notes && (
                            <div className="text-xs text-brand-text-dim truncate">
                                📝 {log.notes.substring(0, 30)}...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
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
    const { t } = useTranslation();
    const [log, setLog] = useState<DailyLog>(initialLog);
    const [saved, setSaved] = useState(false);

    // Update log when date changes
    useEffect(() => {
        setLog(initialLog);
        setSaved(false);
    }, [date, initialLog]);

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
        <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-96 bg-brand-surface border-l border-brand-border shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-brand-surface border-b border-brand-border p-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700 }}>
                        {format(date, 'MMMM d, yyyy')}
                    </h2>
                    <p className="text-sm text-brand-text-dim">{format(date, 'EEEE')}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-brand-surface-2 transition-colors"
                    aria-label="Cerrar"
                >
                    <svg className="w-5 h-5 text-brand-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Menstruation */}
                <div className="bg-brand-surface-2 p-4 rounded-[18px] border border-brand-border">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-phase-menstruation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="text-sm font-bold text-brand-text" style={{ fontWeight: 700 }}>
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
                <div className="bg-brand-surface-2 p-4 rounded-[18px] border border-brand-border">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-sm font-bold text-brand-text" style={{ fontWeight: 700 }}>
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
                <div className="bg-brand-surface-2 p-4 rounded-[18px] border border-brand-border">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-sm font-bold text-brand-text" style={{ fontWeight: 700 }}>
                            {t('symptoms')}
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                                    log.symptoms?.includes(symptom.id)
                                        ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary'
                                        : 'bg-transparent text-brand-text border border-brand-border hover:bg-brand-surface/50'
                                }`}
                            >
                                {symptom.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-brand-surface-2 p-4 rounded-[18px] border border-brand-border">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h3 className="text-sm font-bold text-brand-text" style={{ fontWeight: 700 }}>
                            {t('notes')}
                        </h3>
                    </div>
                    <textarea
                        value={log.notes || ''}
                        onChange={(e) => setLog({ ...log, notes: e.target.value })}
                        className="w-full h-24 bg-brand-surface p-3 rounded-xl border border-brand-border hover:bg-brand-surface-2 focus:border-brand-primary outline-none transition-all duration-200 resize-none text-brand-text text-sm"
                        placeholder={t('addAnyAdditionalNotes')}
                        style={{ fontWeight: 400, lineHeight: 1.5 }}
                    />
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold py-3 px-6 rounded-full shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ fontWeight: 600 }}
                >
                    {saved ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardado
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {t('saveRecord')}
                        </>
                    )}
                </button>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-surface border border-brand-border rounded-[18px] shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setSelectedYear(selectedYear - 1)}
                        className="p-2 rounded-lg hover:bg-brand-surface-2 transition-colors"
                    >
                        <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-bold text-brand-text">{selectedYear}</h3>
                    <button
                        onClick={() => setSelectedYear(selectedYear + 1)}
                        className="p-2 rounded-lg hover:bg-brand-surface-2 transition-colors"
                    >
                        <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                                month.getMonth() === currentDate.getMonth() && month.getFullYear() === currentDate.getFullYear()
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface-2 text-brand-text hover:bg-brand-primary/20'
                            }`}
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
    const { logs, predictions, settings, refreshData } = useContext(AppContext);
    const { t, language } = useTranslation();
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
        setSelectedDate(date);
        setRangeStart(null);
        setRangeEnd(null);
    }, []);

    const handleDayMouseDown = useCallback((date: Date) => {
        setIsDragging(true);
        setRangeStart(date);
        setRangeEnd(date);
    }, []);

    const handleDayMouseEnter = useCallback((date: Date) => {
        setHoveredDate(date);
        if (isDragging && rangeStart) {
            setRangeEnd(date);
        }
    }, [isDragging, rangeStart]);

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
            ['Fecha', 'Intensidad', 'Estado de ánimo', 'Síntomas', 'Notas'].join(','),
            ...monthLogs.map(log => [
                log.date,
                log.periodIntensity || '',
                log.mood || '',
                (log.symptoms || []).join(';'),
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
                    `SUMMARY:Menstruación (${log.periodIntensity}/3)`,
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
        <div className="min-h-screen px-4 md:px-8 pt-12 pb-24 md:pb-12">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sticky top-0 z-40">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center justify-between md:justify-start gap-4">
                            <button
                                onClick={prevMonth}
                                className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-200 hover:scale-105"
                                aria-label={t('previousMonth')}
                            >
                                <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={() => setShowMonthSelector(true)}
                                className="text-center hover:bg-brand-surface-2 px-4 py-2 rounded-lg transition-colors"
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
                                className="p-2 rounded-lg hover:bg-brand-surface-2 transition-all duration-200 hover:scale-105"
                                aria-label={t('nextMonth')}
                            >
                                <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-brand-primary/20 text-brand-primary border border-brand-primary hover:bg-brand-primary/30 transition-all duration-200"
                                style={{ fontWeight: 500 }}
                            >
                                Hoy
                            </button>

                            <button
                                onClick={() => setShowPredictions(!showPredictions)}
                                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                                    showPredictions
                                        ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary'
                                        : 'bg-transparent text-brand-text-dim border border-brand-border hover:bg-brand-surface-2'
                                }`}
                            >
                                Predicciones
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
                                        Exportar CSV
                                    </button>
                                    <button
                                        onClick={exportToICal}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-surface-2 text-sm text-brand-text transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Exportar iCal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Range Selection Info */}
                    {rangeStart && rangeEnd && selectedRangeCount > 1 && (
                        <div className="mt-4 px-4 py-2 bg-brand-primary/10 border border-brand-primary/30 rounded-lg text-sm text-brand-primary flex items-center justify-between">
                            <span>{selectedRangeCount} días seleccionados</span>
                            <button
                                onClick={() => {
                                    setRangeStart(null);
                                    setRangeEnd(null);
                                }}
                                className="text-xs underline hover:no-underline"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>

                {/* Calendar Grid */}
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-4 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2" role="row">
                                {weekDays.map((day, index) => (
                                    <div key={index} className="text-center py-2" role="columnheader">
                                        <span className="text-xs md:text-sm font-semibold text-brand-text-dim uppercase" style={{ fontWeight: 600 }}>
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 md:gap-2" role="grid">
                                {daysInGrid.map((day) => {
                                    const dayId = formatISO(day, { representation: 'date' });
                                    const log = logsMap.get(dayId);
                                    const isPeriod = !!(log?.periodIntensity && log.periodIntensity > 0);
                                    const dayStart = startOfDay(day);

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

                                    // Filter logic
                                    let shouldShow = true;
                                    if (activeFilter === 'period' && !isPeriod) shouldShow = false;
                                    if (activeFilter === 'fertile' && !isFertile) shouldShow = false;
                                    if (activeFilter === 'ovulation' && !isOvulation) shouldShow = false;

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
                                            isPeriod={isPeriod}
                                            periodIntensity={log?.periodIntensity}
                                            isFertile={isFertile}
                                            isOvulation={isOvulation}
                                            isPredicted={isPredicted}
                                            isSelected={!!isSelected}
                                            isRangeStart={!!isRangeStart}
                                            isRangeEnd={!!isRangeEnd}
                                            isInRange={!!isInRange}
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

                {/* Interactive Legend */}
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                    <h3 className="text-base font-bold text-brand-text mb-4" style={{ fontWeight: 700 }}>
                        {t('legend')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => setActiveFilter(activeFilter === 'period' ? 'all' : 'period')}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                activeFilter === 'period'
                                    ? 'bg-phase-menstruation/20 border-2 border-phase-menstruation'
                                    : 'bg-brand-surface-2 border border-brand-border hover:bg-brand-surface hover:border-phase-menstruation/30'
                            }`}
                        >
                            <div className="w-5 h-5 rounded-lg bg-phase-menstruation/40 border border-phase-menstruation/40 shadow-sm flex-shrink-0"></div>
                            <span className="text-sm font-medium text-brand-text" style={{ fontWeight: 500 }}>
                                {t('menstruation')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveFilter(activeFilter === 'fertile' ? 'all' : 'fertile')}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                activeFilter === 'fertile'
                                    ? 'bg-phase-follicular/20 border-2 border-phase-follicular'
                                    : 'bg-brand-surface-2 border border-brand-border hover:bg-brand-surface hover:border-phase-follicular/30'
                            }`}
                        >
                            <div className="w-5 h-5 rounded-lg bg-phase-follicular/25 border border-phase-follicular/20 shadow-sm flex-shrink-0"></div>
                            <span className="text-sm font-medium text-brand-text" style={{ fontWeight: 500 }}>
                                {t('fertileWindow')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveFilter(activeFilter === 'ovulation' ? 'all' : 'ovulation')}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                activeFilter === 'ovulation'
                                    ? 'bg-phase-ovulation/20 border-2 border-phase-ovulation'
                                    : 'bg-brand-surface-2 border border-brand-border hover:bg-brand-surface hover:border-phase-ovulation/30'
                            }`}
                        >
                            <div className="w-5 h-5 rounded-lg bg-phase-ovulation/40 border border-phase-ovulation/30 shadow-sm flex-shrink-0 flex items-center justify-center">
                                <svg className="w-3 h-3 text-phase-ovulation" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-brand-text" style={{ fontWeight: 500 }}>
                                {t('ovulation')}
                            </span>
                        </button>
                    </div>
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
