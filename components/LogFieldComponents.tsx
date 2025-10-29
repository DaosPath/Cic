import React from 'react';

// Chip selector for multiple choice
export const ChipSelector: React.FC<{
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
}> = ({ options, selected, onChange, multiple = true }) => {
  const handleToggle = (value: string) => {
    if (multiple) {
      if (selected.includes(value)) {
        onChange(selected.filter(v => v !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => handleToggle(option.value)}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
            selected.includes(option.value)
              ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary'
              : 'bg-brand-surface-2 text-brand-text border border-brand-border hover:border-brand-primary/30'
          }`}
          style={{ fontWeight: 500 }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Single choice selector
export const SingleSelector: React.FC<{
  options: Array<{ value: string; label: string }>;
  selected?: string;
  onChange: (value: string | undefined) => void;
}> = ({ options, selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(selected === option.value ? undefined : option.value)}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
            selected === option.value
              ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary'
              : 'bg-brand-surface-2 text-brand-text border border-brand-border hover:border-brand-primary/30'
          }`}
          style={{ fontWeight: 500 }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Slider for 0-10 scale
export const ScaleSlider: React.FC<{
  value?: number;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  label?: string;
}> = ({ value, onChange, min = 0, max = 10, label }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-brand-text-dim">{label || `${min} - ${max}`}</span>
        <span className="text-lg font-bold text-brand-primary" style={{ fontWeight: 700 }}>
          {value !== undefined ? value : '-'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value ?? min}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-brand-surface-2 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: value !== undefined 
            ? `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${((value - min) / (max - min)) * 100}%, var(--brand-surface-2) ${((value - min) / (max - min)) * 100}%, var(--brand-surface-2) 100%)`
            : undefined
        }}
      />
      <div className="flex justify-between text-xs text-brand-text-dim">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// Number input
export const NumberInput: React.FC<{
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}> = ({ value, onChange, placeholder, min, max, step = 1, unit }) => {
  return (
    <div className="relative">
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand-text-dim">
          {unit}
        </span>
      )}
    </div>
  );
};

// Time input
export const TimeInput: React.FC<{
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="time"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      placeholder={placeholder}
      className="w-full bg-brand-surface text-brand-text p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
    />
  );
};

// Toggle switch
export const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-brand-text" style={{ fontWeight: 500 }}>
        {label}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-brand-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
      </div>
    </label>
  );
};

// Chip selector with custom input
export const ChipSelectorWithCustom: React.FC<{
  predefinedOptions: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}> = ({ predefinedOptions, selected, onChange, placeholder = 'Agregar personalizado...' }) => {
  const [customValue, setCustomValue] = React.useState('');

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleAddCustom = () => {
    if (customValue.trim() && !selected.includes(customValue.trim())) {
      onChange([...selected, customValue.trim()]);
      setCustomValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value));
  };

  const predefinedValues = predefinedOptions.map(o => o.value);
  const customSelected = selected.filter(v => !predefinedValues.includes(v));

  return (
    <div className="space-y-2">
      {/* Predefined options */}
      <div className="flex flex-wrap gap-2">
        {predefinedOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              selected.includes(option.value)
                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary'
                : 'bg-brand-surface-2 text-brand-text border border-brand-border hover:border-brand-primary/30'
            }`}
            style={{ fontWeight: 500 }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150 text-sm"
        />
        <button
          onClick={handleAddCustom}
          disabled={!customValue.trim()}
          className="px-3 py-2 rounded-lg bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm font-medium"
          style={{ fontWeight: 500 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Custom selected items */}
      {customSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customSelected.map(value => (
            <div
              key={value}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-brand-accent/20 text-brand-accent border border-brand-accent flex items-center gap-2"
              style={{ fontWeight: 500 }}
            >
              {value}
              <button
                onClick={() => handleRemove(value)}
                className="hover:text-brand-accent/70 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Collapsible section
export const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}> = ({ title, icon, isOpen, onToggle, children, badge }) => {
  return (
    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-5 md:p-6 flex items-center justify-between hover:bg-brand-surface/30 transition-all duration-150"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-primary/15">
            {icon}
          </div>
          <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </h2>
          {badge && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-brand-primary/20 text-brand-primary">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-brand-text-dim transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-200 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-5 md:p-6 pt-0 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
