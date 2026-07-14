import React, { useSyncExternalStore } from 'react';
import type { CyclePhase, UiSkin } from '../types.ts';
import { CycleRingParticles } from './CycleRingParticles.tsx';
import { CycleRingSvg } from './CycleRingSvg.tsx';

interface CycleRingProps {
  phase: CyclePhase;
  cycleDay?: number;
  cycleLength?: number;
  size?: number;
  showLegend?: boolean;
  /** Force a skin; otherwise reads document data-skin (classic default). */
  skin?: UiSkin;
}

function subscribeSkin(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });
  return () => obs.disconnect();
}

function getSkinSnapshot(): UiSkin {
  const s = document.documentElement.getAttribute('data-skin');
  return s === 'living-cycle' ? 'living-cycle' : 'classic';
}

function getServerSkin(): UiSkin {
  return 'classic';
}

/**
 * Classic skin: animated particle torus (original “ruedita”).
 * Living Cycle skin: soft SVG ring.
 */
export const CycleRing: React.FC<CycleRingProps> = ({
  phase,
  cycleDay,
  cycleLength = 28,
  size = 280,
  showLegend = false,
  skin: skinProp,
}) => {
  const docSkin = useSyncExternalStore(subscribeSkin, getSkinSnapshot, getServerSkin);
  const skin = skinProp ?? docSkin;

  if (skin === 'living-cycle') {
    return (
      <CycleRingSvg
        phase={phase}
        cycleDay={cycleDay}
        cycleLength={cycleLength}
        size={size}
        showLegend={showLegend}
      />
    );
  }

  // Classic: particle ring fills the container (absolute inset like original)
  return (
    <div className="relative w-full h-full min-h-[14rem]" data-testid="cycle-ring-particles">
      <CycleRingParticles phase={phase} cycleDay={cycleDay} />
      {showLegend && (
        <ul
          className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-2 pb-1 pointer-events-none"
          aria-label="Leyenda de fases"
        >
          {(
            [
              ['menstruation', 'Menstruación', '--phase-menstruation'],
              ['follicular', 'Folicular', '--phase-follicular'],
              ['ovulation', 'Ovulación', '--phase-ovulation'],
              ['luteal', 'Lútea', '--phase-luteal'],
            ] as const
          ).map(([id, label, cssVar]) => (
            <li key={id} className="flex items-center gap-1.5 text-[11px] text-brand-text-dim">
              <span
                className="w-2.5 h-2.5 rounded-full border border-[var(--border)]"
                style={{ background: `var(${cssVar})` }}
                aria-hidden="true"
              />
              <span className={phase === id ? 'font-semibold text-brand-text' : ''}>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
