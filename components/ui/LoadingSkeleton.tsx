import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'page' | 'card' | 'lines' | 'ring';
  label?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'page',
  label = 'Cargando…',
}) => {
  if (variant === 'ring') {
    return (
      <div className="flex flex-col items-center gap-4 py-12" role="status" aria-live="polite" aria-label={label}>
        <div className="skeleton w-48 h-48 rounded-full" />
        <div className="skeleton h-4 w-32" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="aura-surface p-5 space-y-3" role="status" aria-label={label}>
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-3 w-full" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'lines') {
    return (
      <div className="space-y-3" role="status" aria-label={label}>
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-11/12" />
        <div className="skeleton h-3 w-4/5" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div className="page-content space-y-6" role="status" aria-live="polite" aria-label={label}>
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-40 w-full rounded-[var(--radius-lg)]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton h-32 rounded-[var(--radius-lg)]" />
        <div className="skeleton h-32 rounded-[var(--radius-lg)]" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
};
