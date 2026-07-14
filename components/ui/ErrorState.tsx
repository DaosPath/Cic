import React from 'react';

interface ErrorStateProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  dataSafeNote?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  retryLabel = 'Reintentar',
  onRetry,
  dataSafeNote = 'Tus datos locales no se han modificado.',
}) => {
  return (
    <div
      className="aura-surface p-6 md:p-8 flex flex-col items-start gap-3 border-[color:var(--danger)]"
      style={{ borderColor: 'color-mix(in srgb, var(--danger) 40%, var(--border))' }}
      role="alert"
    >
      <div className="flex items-center gap-2" style={{ color: 'var(--danger)' }}>
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <h2 className="text-lg font-semibold text-brand-text">{title}</h2>
      </div>
      <p className="text-sm text-brand-text-dim leading-relaxed">{description}</p>
      {dataSafeNote && (
        <p className="text-xs text-brand-text-dim">{dataSafeNote}</p>
      )}
      {onRetry && (
        <button type="button" onClick={onRetry} className="aura-btn aura-btn-secondary mt-2">
          {retryLabel}
        </button>
      )}
    </div>
  );
};
