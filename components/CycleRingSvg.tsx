import React, { useId, useMemo } from 'react';
import type { CyclePhase } from '../types.ts';

interface CycleRingSvgProps {
  phase: CyclePhase;
  cycleDay?: number;
  cycleLength?: number;
  size?: number;
  showLegend?: boolean;
}

const PHASE_ORDER: CyclePhase[] = ['menstruation', 'follicular', 'ovulation', 'luteal'];

const phaseMeta: Record<CyclePhase, { label: string; cssVar: string }> = {
  menstruation: { label: 'Menstruación', cssVar: '--phase-menstruation' },
  follicular: { label: 'Folicular', cssVar: '--phase-follicular' },
  ovulation: { label: 'Ovulación', cssVar: '--phase-ovulation' },
  luteal: { label: 'Lútea', cssVar: '--phase-luteal' },
};

function phaseSegments(cycleLength: number): { phase: CyclePhase; start: number; end: number }[] {
  const periodEnd = Math.min(5, Math.max(3, Math.round(cycleLength * 0.18)));
  const ovuCenter = Math.max(periodEnd + 2, cycleLength - 14);
  const ovuStart = Math.max(periodEnd + 1, ovuCenter - 2);
  const ovuEnd = Math.min(cycleLength - 1, ovuCenter + 1);
  return [
    { phase: 'menstruation', start: 1, end: periodEnd },
    { phase: 'follicular', start: periodEnd + 1, end: ovuStart - 1 },
    { phase: 'ovulation', start: ovuStart, end: ovuEnd },
    { phase: 'luteal', start: ovuEnd + 1, end: cycleLength },
  ].filter((s) => s.end >= s.start);
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

/** Soft SVG ring for Living Cycle skin */
export const CycleRingSvg: React.FC<CycleRingSvgProps> = ({
  phase,
  cycleDay = 0,
  cycleLength = 28,
  size = 280,
  showLegend = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const cx = size / 2;
  const cy = size / 2;
  const stroke = Math.max(14, size * 0.07);
  const r = size / 2 - stroke / 2 - 4;
  const segments = useMemo(() => phaseSegments(cycleLength), [cycleLength]);
  const progress = cycleDay > 0 ? Math.min(1, cycleDay / cycleLength) : 0;
  const dayAngle = progress * 360;

  const phaseLabels: Record<CyclePhase, string> = {
    menstruation: 'Fase de menstruación',
    follicular: 'Fase folicular',
    ovulation: 'Fase de ovulación',
    luteal: 'Fase lútea',
  };

  const ariaLabel =
    cycleDay > 0
      ? `Visualización del ciclo: día ${cycleDay} de ${cycleLength} estimados, ${phaseLabels[phase]}`
      : `Visualización del ciclo: ${phaseLabels[phase]}`;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        className="max-w-full h-auto"
      >
        <defs>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        {segments.map((seg) => {
          const startA = ((seg.start - 1) / cycleLength) * 360;
          const endA = (seg.end / cycleLength) * 360;
          const isActive = phase === seg.phase;
          const color = `var(${phaseMeta[seg.phase].cssVar})`;
          return (
            <path
              key={seg.phase}
              d={arcPath(cx, cy, r, startA, Math.min(359.9, endA))}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? stroke : stroke * 0.72}
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.45}
              filter={isActive ? `url(#${uid}-soft)` : undefined}
            />
          );
        })}
        {cycleDay > 0 && (
          <path
            d={arcPath(cx, cy, r - stroke * 0.55, 0, Math.max(2, dayAngle))}
            fill="none"
            stroke="var(--text)"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.35}
          />
        )}
        {cycleDay > 0 &&
          (() => {
            const p = polar(cx, cy, r, dayAngle);
            return (
              <g>
                <circle cx={p.x} cy={p.y} r={stroke * 0.42} fill="var(--surface)" stroke="var(--plum)" strokeWidth={3} />
                <circle cx={p.x} cy={p.y} r={4} fill="var(--plum)" />
              </g>
            );
          })()}
        <circle cx={cx} cy={cy} r={r - stroke - 8} fill="var(--surface)" opacity={0.5} />
      </svg>
      {showLegend && (
        <ul className="flex flex-wrap justify-center gap-2 mt-3" aria-label="Leyenda de fases">
          {PHASE_ORDER.map((p) => (
            <li key={p} className="flex items-center gap-1.5 text-[11px] text-brand-text-dim">
              <span
                className="w-2.5 h-2.5 rounded-full border border-[var(--border)]"
                style={{ background: `var(${phaseMeta[p].cssVar})` }}
                aria-hidden="true"
              />
              <span className={phase === p ? 'font-semibold text-brand-text' : ''}>{phaseMeta[p].label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
