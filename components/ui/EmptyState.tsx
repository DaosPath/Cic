import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustrationSrc?: string;
  illustrationAlt?: string;
  secondaryNote?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  illustrationSrc,
  illustrationAlt = '',
  secondaryNote,
}) => {
  return (
    <div
      className="aura-surface flex flex-col items-center text-center p-6 md:p-10 gap-4"
      role="status"
    >
      {illustrationSrc ? (
        <img
          src={illustrationSrc}
          alt={illustrationAlt}
          className="w-28 h-28 md:w-36 md:h-36 object-contain opacity-90"
          loading="lazy"
          width={144}
          height={144}
        />
      ) : (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--brand) 12%, transparent)' }}
          aria-hidden="true"
        >
          <svg className="w-10 h-10" style={{ color: 'var(--brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>
      )}
      <div className="max-w-md space-y-2">
        <h2 className="font-display text-xl md:text-2xl font-semibold text-brand-text">{title}</h2>
        <p className="text-sm md:text-base text-brand-text-dim leading-relaxed">{description}</p>
        {secondaryNote && (
          <p className="text-xs text-brand-text-dim/80 leading-relaxed pt-1">{secondaryNote}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="aura-btn aura-btn-primary mt-2">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
