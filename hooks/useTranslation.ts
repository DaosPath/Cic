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

export function useTranslation() {
  const { settings } = useContext(AppContext);
  
  const currentLanguage: Language = settings.language === 'auto' ? detectLanguage() : settings.language;
  const translations = getTranslations(currentLanguage);
  
  const t = (key: keyof Translations): string => {
    return translations[key] || key;
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
