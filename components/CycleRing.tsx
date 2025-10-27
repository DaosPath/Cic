import React from 'react';

interface CycleRingProps {
  dayOfCycle: number;
  cycleLength: number;
  lutealPhaseLength: number;
}

const phaseConfig = {
    menstruation: { days: 5, color: '#e65a78' },
    ovulation: { days: 4, color: '#ffd778' },
    follicular: { color: '#5ad2ba' },
    luteal: { color: '#c8a0f0' },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export const CycleRing: React.FC<CycleRingProps> = ({ dayOfCycle, cycleLength, lutealPhaseLength }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 14;

    const safeCycleLength = Math.max(cycleLength, 1);
    const follicularDays = Math.max(0, safeCycleLength - phaseConfig.menstruation.days - phaseConfig.ovulation.days - lutealPhaseLength);
    
    const phases = [
        { name: 'menstruation', length: phaseConfig.menstruation.days, color: phaseConfig.menstruation.color },
        { name: 'follicular', length: follicularDays, color: phaseConfig.follicular.color },
        { name: 'ovulation', length: phaseConfig.ovulation.days, color: phaseConfig.ovulation.color },
        { name: 'luteal', length: lutealPhaseLength, color: phaseConfig.luteal.color },
    ];

    let accumulatedOffset = 0;
    const phaseArcs = phases.map(phase => {
        const dash = (phase.length / safeCycleLength) * circumference;
        const offset = accumulatedOffset;
        accumulatedOffset += dash;
        return { dash, offset, color: phase.color };
    });

    const progress = clamp(dayOfCycle / safeCycleLength, 0, 1);
    const angle = progress * 360 - 90;
    const indicatorX = 100 + radius * Math.cos(angle * Math.PI / 180);
    const indicatorY = 100 + radius * Math.sin(angle * Math.PI / 180);

    return (
        <div className="relative w-52 h-52 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="rgba(90, 90, 106, 0.3)"
                    strokeWidth={strokeWidth}
                />
                {phaseArcs.map((arc, index) => (
                    <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${arc.dash} ${circumference}`}
                        strokeDashoffset={-arc.offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                ))}
                 <circle
                    cx={indicatorX}
                    cy={indicatorY}
                    r={strokeWidth / 2 + 3}
                    fill="rgba(10, 10, 15, 0.8)"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-500"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
            </svg>
            <div className="z-10 text-center">
                <span className="text-5xl font-bold text-brand-text">{dayOfCycle > 0 ? dayOfCycle : '...'}</span>
                <p className="text-sm text-brand-text-dim -mt-1">{dayOfCycle > 0 ? 'Día del ciclo' : 'Calculando'}</p>
            </div>
        </div>
    );
};
