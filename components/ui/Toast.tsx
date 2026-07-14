import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  variant?: 'success' | 'error' | 'info';
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  onDismiss,
  variant = 'success',
  durationMs = 3000,
}) => {
  useEffect(() => {
    if (!visible || !onDismiss) return;
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [visible, onDismiss, durationMs]);

  if (!visible) return null;

  const color =
    variant === 'success'
      ? 'var(--positive)'
      : variant === 'error'
        ? 'var(--danger)'
        : 'var(--brand)';

  return (
    <div
      className="fixed top-4 right-4 z-[60] animate-slide-up safe-pb"
      role="status"
      aria-live="polite"
    >
      <div
        className="aura-surface flex items-center gap-3 px-5 py-3 shadow-[var(--shadow-md)] min-w-[200px] max-w-[min(90vw,360px)]"
        style={{ borderColor: `color-mix(in srgb, ${color} 35%, var(--border))` }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: color }}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-brand-text">{message}</span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto text-brand-text-dim hover:text-brand-text p-1 min-w-[32px] min-h-[32px]"
            aria-label="Cerrar"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
