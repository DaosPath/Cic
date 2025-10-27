import { GoogleGenAI } from "@google/genai";
import type { CyclePhase } from '../types.ts';

let ai: GoogleGenAI | null = null;

// Lazily initialize the AI client to prevent app crash on startup if API key is missing.
const getAiClient = (): GoogleGenAI | null => {
    if (ai) {
        return ai;
    }
    // Safely check for process.env to avoid ReferenceError in some browser environments
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        return ai;
    }
    console.warn("Gemini API key not found. AI features will be disabled.");
    return null;
}

const phasePrompts: Record<CyclePhase, string> = {
    menstruation: "Genera un consejo de bienestar corto y positivo para la fase de menstruación, enfocado en el descanso o la nutrición. Máximo 40 palabras, en español.",
    follicular: "Genera un consejo de bienestar corto y positivo para la fase folicular, enfocado en la energía y la creatividad. Máximo 40 palabras, en español.",
    ovulation: "Genera un consejo de bienestar corto y positivo para la fase de ovulación, enfocado en la socialización o el ejercicio. Máximo 40 palabras, en español.",
    luteal: "Genera un consejo de bienestar corto y positivo para la fase lútea, enfocado en el autocuidado y el manejo del estrés. Máximo 40 palabras, en español."
};

export const getPhaseInsight = async (phase: CyclePhase): Promise<string> => {
    const cacheKey = `phase-insight-${phase}`;
    const cachedInsight = sessionStorage.getItem(cacheKey);

    if (cachedInsight) {
        return cachedInsight;
    }
    
    const aiClient = getAiClient();
    if (!aiClient) {
        return "API Key no configurada. El consejo del día no está disponible.";
    }

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: phasePrompts[phase],
            config: {
                temperature: 0.7,
            },
        });
        
        const text = response.text.trim();
        if (text) {
            sessionStorage.setItem(cacheKey, text);
            return text;
        }
        throw new Error("Empty response from API");

    } catch (error) {
        console.error("Error fetching insight from Gemini API:", error);
        return "Cuida de ti misma hoy. Escucha a tu cuerpo y dale lo que necesita.";
    }
};