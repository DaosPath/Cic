import { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import {
  getTranslations,
  detectLanguage,
  type Translations,
  getEnergyLabel,
  getSymptomLabel
} from '../services/i18n.ts';
import type { Language } from '../types.ts';

const interpolate = (value: string, replacements?: Record<string, string | number>): string => {
  if (!replacements) return value;

  return Object.entries(replacements).reduce(
    (acc, [placeholder, replacement]) =>
      acc.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(replacement)),
    value
  );
};

type DiscreteLanguage = 'es' | 'en' | 'tr';

const discreteReplacements: Record<DiscreteLanguage, Array<{ pattern: RegExp; replacement: string }>> = {
  es: [
    { pattern: /menstruaci[o\u00f3]n/gi, replacement: 'cuidado' },
    { pattern: /regla/gi, replacement: 'cuidado' },
    { pattern: /periodo/gi, replacement: 'agenda' },
    { pattern: /ciclo/gi, replacement: 'ritmo' },
    { pattern: /ovulaci[o\u00f3]n/gi, replacement: 'ventana' },
    { pattern: /f[e\u00e9]rtil/gi, replacement: 'bienestar' },
    { pattern: /fertilidad/gi, replacement: 'bienestar' },
    { pattern: /sangrado/gi, replacement: 'estado' },
    { pattern: /flujo/gi, replacement: 'estado' },
    { pattern: /s[i\u00ed]ntoma/gi, replacement: 'senal' },
  ],
  en: [
    { pattern: /menstruation|menstrual/gi, replacement: 'wellness' },
    { pattern: /period/gi, replacement: 'schedule' },
    { pattern: /cycle/gi, replacement: 'rhythm' },
    { pattern: /ovulation/gi, replacement: 'window' },
    { pattern: /fertile|fertility/gi, replacement: 'wellbeing' },
    { pattern: /bleeding|flow/gi, replacement: 'status' },
    { pattern: /symptom/gi, replacement: 'signal' },
  ],
  tr: [
    { pattern: /adet|regl/gi, replacement: 'durum' },
    { pattern: /d[o\u00f6]ng[u\u00fc]/gi, replacement: 'ritim' },
    { pattern: /yumurtlama/gi, replacement: 'pencere' },
    { pattern: /fertil/gi, replacement: 'pencere' },
    { pattern: /kanama/gi, replacement: 'durum' },
    { pattern: /ak[i\u0131]?[s\u015f]/gi, replacement: 'durum' },
    { pattern: /semptom/gi, replacement: 'ipucu' },
  ],
};

const applyDiscreteFilter = (value: string, language: DiscreteLanguage): string => {
  const rules = discreteReplacements[language] || [];
  return rules.reduce((acc, { pattern, replacement }) => acc.replace(pattern, replacement), value);
};

export function useTranslation() {
  const { settings } = useContext(AppContext);

  const currentLanguage: Language = settings.language === 'auto' ? detectLanguage() : settings.language;
  const translations = getTranslations(currentLanguage);
  const discreteLang = currentLanguage as DiscreteLanguage;
  
  const t = (key: keyof Translations, replacements?: Record<string, string | number>): string => {
    const raw = translations[key] || key;
    const text = interpolate(raw, replacements);
    if (settings.discreteMode && ['es', 'en', 'tr'].includes(discreteLang)) {
      return applyDiscreteFilter(text, discreteLang);
    }
    return text;
  };
  
  const translateEnergyLevel = (level?: string): string => {
    if (!level) return '';
    return getEnergyLabel(level, currentLanguage);
  };

  const translateSymptomId = (symptomId: string): string => {
    return getSymptomLabel(symptomId, currentLanguage);
  };

  return {
    t,
    language: currentLanguage,
    translations,
    translateEnergyLevel,
    translateSymptomId
  };
}
