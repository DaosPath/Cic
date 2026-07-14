import React from 'react';
import type { ThemeMode } from '../../types.ts';

interface ThemeToggleProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  labels?: { light: string; dark: string; system: string };
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  value,
  onChange,
  labels = { light: 'Claro', dark: 'Oscuro', system: 'Automático' },
}) => {
  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: 'light',
      label: labels.light,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
    },
    {
      mode: 'dark',
      label: labels.dark,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ),
    },
    {
      mode: 'system',
      label: labels.system,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17h4.5M4 7a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Tema de apariencia"
      className="inline-flex p-1 rounded-[var(--radius-full)] bg-[var(--surface-2)] border border-[var(--border)] gap-0.5"
    >
      {options.map((opt) => {
        const selected = value === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.mode)}
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selected
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sr-only sm:hidden">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
