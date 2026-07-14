import React from 'react';

export type PredictionKind = 'estimated' | 'registered' | 'basedOnHistory' | 'mayVary';

const defaultCopy: Record<PredictionKind, { es: string; en: string; tr: string }> = {
  estimated: { es: 'Estimado', en: 'Estimated', tr: 'Tahmini' },
  registered: { es: 'Registrado', en: 'Registered', tr: 'Kayıtlı' },
  basedOnHistory: {
    es: 'Basado en tus datos anteriores',
    en: 'Based on your previous data',
    tr: 'Önceki verilerine göre',
  },
  mayVary: { es: 'Puede variar', en: 'May vary', tr: 'Değişebilir' },
};

interface PredictionLabelProps {
  kind: PredictionKind;
  language?: 'es' | 'en' | 'tr';
  className?: string;
}

export const PredictionLabel: React.FC<PredictionLabelProps> = ({
  kind,
  language = 'es',
  className = '',
}) => {
  const label = defaultCopy[kind][language] ?? defaultCopy[kind].es;
  return (
    <span className={`prediction-label ${className}`} title={label}>
      {kind === 'estimated' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {kind === 'registered' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {kind === 'mayVary' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      )}
      <span>{label}</span>
    </span>
  );
};
