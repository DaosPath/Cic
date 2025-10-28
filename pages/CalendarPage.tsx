import React, { useState, useMemo, useContext } from 'react';
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

interface DayCellProps {
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isPeriod: boolean;
    isFertile: boolean;
    isOvulation: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ dayNumber, isCurrentMonth, isToday, isPeriod, isFertile, isOvulation }) => {
    const baseClasses = 'relative w-full aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer group';

    let bgClasses = 'bg-transparent hover:bg-brand-surface/30';
    let textClasses = isCurrentMonth ? 'text-brand-text' : 'text-brand-text-dim/40';

    if (isOvulation) {
        bgClasses = 'bg-gradient-to-br from-phase-ovulation/40 to-phase-ovulation/20 shadow-lg ring-2 ring-phase-ovulation/30';
        textClasses = 'text-brand-text font-bold';
    } else if (isFertile) {
        bgClasses = 'bg-gradient-to-br from-phase-follicular/30 to-phase-follicular/15 shadow-md ring-1 ring-phase-follicular/20';
        textClasses = 'text-brand-text font-medium';
    }

    if (isPeriod) {
        bgClasses = 'bg-gradient-to-br from-phase-menstruation/40 to-phase-menstruation/20 shadow-lg ring-2 ring-phase-menstruation/30';
        textClasses = 'text-white font-bold';
    }

    const dayClasses = `${baseClasses} ${bgClasses}`;

    return (
        <div className={dayClasses}>
            <div className="relative z-10 flex flex-col items-center justify-center">
                <span className={`text-sm md:text-base transition-all duration-300 ${textClasses} ${isToday ? 'bg-brand-primary text-brand-background w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold shadow-lg' : ''}`}>
                    {dayNumber}
                </span>
                {isPeriod && !isToday && (
                    <div className="absolute -bottom-1 w-1.5 h-1.5 bg-phase-menstruation rounded-full shadow-sm"></div>
                )}
            </div>

            {(isOvulation || isPeriod) && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
        </div>
    );
};

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

export const CalendarPage: React.FC = () => {
    const { logs, predictions, settings } = useContext(AppContext);
    const { t, language } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

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

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const weekDays = useMemo(() => {
        const base = startOfWeek(new Date(), { weekStartsOn });
        return Array.from({ length: 7 }, (_, index) =>
            format(addDays(base, index), 'EEE', { locale: dateLocale }).toUpperCase()
        );
    }, [dateLocale, weekStartsOn]);

    const monthLabel = new Intl.DateTimeFormat(intlLocale, { month: 'long' }).format(currentMonth);
    const yearLabel = new Intl.DateTimeFormat(intlLocale, { year: 'numeric' }).format(currentMonth);

    return (
        <div className="min-h-screen p-4 md:p-8 pt-12 max-w-md md:max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 md:p-8 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl mb-8">
                <div className="flex justify-between items-center">
                    <button
                        onClick={prevMonth}
                        className="p-3 rounded-2xl hover:bg-brand-primary/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
                        aria-label={t('previousMonth')}
                    >
                        <svg className="w-6 h-6 text-brand-text group-hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold capitalize text-brand-text tracking-tight">
                            {monthLabel}
                        </h1>
                        <p className="text-lg md:text-xl text-brand-text-dim font-light">
                            {yearLabel}
                        </p>
                    </div>

                    <button
                        onClick={nextMonth}
                        className="p-3 rounded-2xl hover:bg-brand-primary/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
                        aria-label={t('nextMonth')}
                    >
                        <svg className="w-6 h-6 text-brand-text group-hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 md:p-8 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-center py-3">
                            <span className="text-sm md:text-base font-bold text-brand-text-dim uppercase tracking-wider">
                                {day}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-3">
                    {daysInGrid.map((day) => {
                        const dayId = formatISO(day, { representation: 'date' });
                        const log = logsMap.get(dayId);

                        const isPeriod = !!(log?.periodIntensity && log.periodIntensity > 0);

                        let isFertile = false;
                        let isOvulation = false;
                        if (predictions) {
                            const dayStart = startOfDay(day);
                            if (dayStart >= predictions.fertileWindow[0] && dayStart <= predictions.fertileWindow[1]) {
                                isFertile = true;
                            }
                            if (isSameDay(dayStart, predictions.ovulationDate)) {
                                isOvulation = true;
                            }
                        }

                        return (
                            <DayCell
                                key={dayId}
                                dayNumber={getDate(day)}
                                isCurrentMonth={isSameMonth(day, currentMonth)}
                                isToday={isToday(day)}
                                isPeriod={isPeriod}
                                isFertile={isFertile}
                                isOvulation={isOvulation}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                <h3 className="text-lg font-bold text-brand-text mb-4 text-center">{t('legend')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-surface/30">
                        <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-phase-menstruation/40 to-phase-menstruation/20 ring-2 ring-phase-menstruation/30 shadow-lg"></div>
                        <span className="text-sm font-medium text-brand-text">{t('menstruation')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-surface/30">
                        <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-phase-follicular/30 to-phase-follicular/15 ring-1 ring-phase-follicular/20 shadow-md"></div>
                        <span className="text-sm font-medium text-brand-text">{t('fertileWindow')}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-surface/30">
                        <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-phase-ovulation/40 to-phase-ovulation/20 ring-2 ring-phase-ovulation/30 shadow-lg"></div>
                        <span className="text-sm font-medium text-brand-text">{t('ovulation')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
