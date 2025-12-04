import type { CyclePhase, Language } from '../types.ts';
import { detectLanguage, getTranslations } from './i18n.ts';

const GEMINI_ENDPOINT = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_ENDPOINT)
    ? (import.meta as any).env.VITE_GEMINI_ENDPOINT
    : '/api/gemini';
const MODEL = 'gemini-2.5-flash';

const generateContent = async (contents: string): Promise<string> => {
    const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents,
            model: MODEL,
            config: { temperature: 0.7 }
        })
    });

    if (!response.ok) {
        const message = await response.text().catch(() => 'Unknown error');
        throw new Error(message || `Request failed with status ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    if (!text) {
        throw new Error('Empty response from API');
    }

    return text;
};

type SupportedLanguage = Exclude<Language, 'auto'>;

const phasePrompts: Record<SupportedLanguage, Record<CyclePhase, string>> = {
    es: {
        menstruation: "Genera un consejo de bienestar corto y positivo para la fase de menstruación, enfocado en el descanso o la nutrición. Máximo 40 palabras, en español.",
        follicular: "Genera un consejo de bienestar corto y positivo para la fase folicular, enfocado en la energía y la creatividad. Máximo 40 palabras, en español.",
        ovulation: "Genera un consejo de bienestar corto y positivo para la fase de ovulación, enfocado en la socialización o el ejercicio. Máximo 40 palabras, en español.",
        luteal: "Genera un consejo de bienestar corto y positivo para la fase lútea, enfocado en el autocuidado y el manejo del estrés. Máximo 40 palabras, en español."
    },
    en: {
        menstruation: "Generate a short, positive wellness tip for the menstruation phase focused on rest or nourishment. Maximum 40 words, in English.",
        follicular: "Generate a short, positive wellness tip for the follicular phase focused on energy and creativity. Maximum 40 words, in English.",
        ovulation: "Generate a short, positive wellness tip for the ovulation phase focused on social connection or exercise. Maximum 40 words, in English.",
        luteal: "Generate a short, positive wellness tip for the luteal phase focused on self-care and stress management. Maximum 40 words, in English."
    },
    tr: {
        menstruation: "Adet döneminde dinlenme veya beslenmeye odaklanan kısa ve pozitif bir iyilik önerisi üret. En fazla 40 kelime, Türkçe.",
        follicular: "Foliküler faz için enerji ve yaratıcılığa odaklanan kısa ve pozitif bir iyilik önerisi üret. En fazla 40 kelime, Türkçe.",
        ovulation: "Yumurtlama fazı için sosyalleşme veya egzersize odaklanan kısa ve pozitif bir iyilik önerisi üret. En fazla 40 kelime, Türkçe.",
        luteal: "Luteal faz için öz bakım ve stres yönetimine odaklanan kısa ve pozitif bir iyilik önerisi üret. En fazla 40 kelime, Türkçe."
    }
};

const resolveLanguage = (language: Language): SupportedLanguage => {
    if (language === 'auto') {
        return resolveLanguage(detectLanguage());
    }
    return (['es', 'en', 'tr'] as SupportedLanguage[]).includes(language as SupportedLanguage)
        ? (language as SupportedLanguage)
        : 'es';
};

export const getPhaseInsight = async (phase: CyclePhase, language: Language): Promise<string> => {
    const lang = resolveLanguage(language);
    const translations = getTranslations(lang);
    const cacheKey = `phase-insight-${phase}-${lang}`;
    const cachedInsight = sessionStorage.getItem(cacheKey);

    if (cachedInsight) {
        return cachedInsight;
    }

    try {
        const text = await generateContent(phasePrompts[lang][phase]);
        if (text) {
            sessionStorage.setItem(cacheKey, text);
            return text;
        }
        throw new Error("Empty response from API");

    } catch (error) {
        console.error("Error fetching insight from Gemini API:", error);
        return translations.aiFallbackMessage;
    }
};
