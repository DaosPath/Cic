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

export function useTranslation() {
  const { settings } = useContext(AppContext);
  
  const currentLanguage: Language = settings.language === 'auto' ? detectLanguage() : settings.language;
  const translations = getTranslations(currentLanguage);
  
  const t = (key: keyof Translations, replacements?: Record<string, string | number>): string => {
    const raw = translations[key] || key;
    return interpolate(raw, replacements);
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
