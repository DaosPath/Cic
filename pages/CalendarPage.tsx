import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
// FIX: Changed date-fns imports to use default imports from submodules to resolve module export errors.
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isToday from 'date-fns/isToday';
import formatISO from 'date-fns/formatISO';
import getDate from 'date-fns/getDate';
import startOfDay from 'date-fns/startOfDay';
import { es } from 'date-fns/locale/es';

// FIX: Add an explicit props interface and use React.FC to correctly type the DayCell component.
// This resolves an issue where TypeScript was incorrectly flagging the 'key' prop as an error.
interface DayCellProps {
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isPeriod: boolean;
    isFertile: boolean;
    isOvulation: boolean;
}

// Componente de celda de día: ahora es un componente puramente presentacional,
// recibiendo solo props primitivas. Esto es mucho más robusto.
const DayCell: React.FC<DayCellProps> = ({ dayNumber, isCurrentMonth, isToday, isPeriod, isFertile, isOvulation }) => {
    const dayClasses = [
        'relative w-full aspect-square flex items-center justify-center rounded-lg transition-colors',
        isCurrentMonth ? 'text-brand-text' : 'text-brand-text-dim opacity-50',
        isOvulation ? 'bg-phase-ovulation/30' : (isFertile ? 'bg-phase-follicular/30' : 'bg-transparent'),
    ].join(' ');

    const numberClasses = [
        'z-10 transition-colors',
        isToday ? 'w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary text-brand-background font-bold' : ''
    ].join(' ');

    return (
        <div className={dayClasses}>
            <span className={numberClasses}>
                {dayNumber}
            </span>
            {isPeriod && (
                <div className="absolute bottom-1 w-5 h-1.5 bg-phase-menstruation rounded-full"></div>
            )}
        </div>
    );
};

export const CalendarPage: React.FC = () => {
    const { logs, predictions, settings } = useContext(AppContext);
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

    const daysInGrid = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const weekStartsOn = settings.startOfWeek === 'monday' ? 1 : 0;
        const gridStart = startOfWeek(monthStart, { weekStartsOn });
        const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn });
        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, [currentMonth, settings.startOfWeek]);
    
    const logsMap = useMemo(() => new Map(logs.map(log => [log.id, log])), [logs]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const weekDays = useMemo(() => (
        settings.startOfWeek === 'monday' 
            ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] 
            : ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    ), [settings.startOfWeek]);

    return (
        <div className="p-4 md:p-8 pt-10 max-w-lg md:max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-brand-surface text-xl">&lt;</button>
                <h1 className="text-2xl font-bold capitalize text-brand-text">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h1>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-brand-surface text-xl">&gt;</button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-brand-text-dim mb-2">
                {weekDays.map((day, index) => <div key={index}>{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {daysInGrid.map((day) => {
                    const dayId = formatISO(day, { representation: 'date' });
                    const log = logsMap.get(dayId);
                    
                    const isPeriod = !!(log?.periodIntensity && log.periodIntensity > 0);
                    
                    let isFertile = false;
                    let isOvulation = false;
                    if (predictions) {
                        // Use startOfDay to compare dates without time component
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

            <div className="mt-8 space-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-phase-menstruation/80"></div><span>Menstruación</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-phase-follicular/30"></div><span>Ventana Fértil</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-phase-ovulation/30"></div><span>Ovulación (Estimada)</span></div>
            </div>
        </div>
    );
};