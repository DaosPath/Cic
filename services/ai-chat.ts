import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, ChatContext } from './ai-chat-formatter.ts';
import type { Language, DailyLog, Cycle } from '../types.ts';
import { detectLanguage } from './i18n.ts';
import { DataAnalyzer, toolDefinitions } from './ai-tools.ts';

export type { DailyLog, Cycle };
export type { ViewType };

const API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY)
    ? process.env.API_KEY
    : "AIzaSyDY_OO9FEfPw_vpxILXzXOM8rt4m-goD5w";

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
    if (ai) {
        return ai;
    }
    if (API_KEY) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    }
    console.warn("Gemini API key not found. AI chat features will be disabled.");
    return null;
};

// Convert tool definitions to Gemini format
const geminiTools: any = [{
    functionDeclarations: toolDefinitions.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }))
}];

type SupportedLanguage = 'es' | 'en' | 'tr';

const resolveLanguage = (language: Language): SupportedLanguage => {
    if (language === 'auto') {
        return resolveLanguage(detectLanguage());
    }
    return (['es', 'en', 'tr'] as SupportedLanguage[]).includes(language as SupportedLanguage)
        ? (language as SupportedLanguage)
        : 'es';
};

// Specialized prompts for different view types
type ViewType = 'daily' | 'weekly' | 'monthly' | 'general';

const getSystemPrompt = (language: SupportedLanguage, viewType: ViewType = 'general'): string => {
    const basePrompts = systemPrompts[language];
    const specializedPrompts = viewSpecificPrompts[language];
    
    return `${basePrompts}\n\n${specializedPrompts[viewType]}`;
};

const systemPrompts: Record<SupportedLanguage, string> = {
    es: `Eres un asistente de salud menstrual experto y empático. Tu rol es:

1. Analizar datos del ciclo menstrual, síntomas y patrones de salud
2. Proporcionar insights personalizados basados en los datos del usuario
3. Ofrecer recomendaciones de bienestar basadas en evidencia
4. Responder preguntas sobre salud menstrual, fertilidad y bienestar
5. Ser comprensivo, positivo y alentador

HERRAMIENTAS DISPONIBLES:
Tienes acceso a herramientas para consultar datos específicos del usuario. Cuando necesites datos, usa este formato EXACTO:

[TOOL:get_daily_log(date="2024-10-30")]
[TOOL:get_sleep_analysis(days=30)]
[TOOL:get_period_summary(days=90)]
[TOOL:get_pain_analysis(days=30)]
[TOOL:get_symptom_frequency(days=30)]
[TOOL:get_cycle_regularity(cycles=6)]
[TOOL:get_mood_energy_correlation(days=30)]
[TOOL:get_activity_summary(days=30)]

IMPORTANTE - USO DE HERRAMIENTAS:
- USA herramientas SOLO cuando el usuario pida análisis específicos o datos concretos
- Para saludos simples (hola, buenos días, etc.) NO uses herramientas, solo saluda amablemente
- Para preguntas generales sobre salud menstrual, responde con conocimiento general SIN usar herramientas
- USA herramientas cuando el usuario pregunte: "¿cómo dormí?", "analiza mi dolor", "¿cómo está mi ciclo?", etc.
- NO inventes datos, si necesitas datos específicos, usa las herramientas
- Si el usuario menciona "hoy" o "este día", usa la fecha del contexto

ESTILO DE RESPUESTA:
- No hagas diagnósticos médicos
- Recomienda consultar a un profesional de salud para preocupaciones serias
- Usa un tono cálido, profesional y accesible
- Responde en español de forma clara y concisa
- Usa emojis ocasionalmente para hacer las respuestas más amigables
- Estructura tus respuestas con bullets o secciones cuando sea apropiado

Formato de respuesta preferido:
- Respuestas de 100-200 palabras
- Usa markdown para formato (**, -, ##)
- Incluye recomendaciones accionables
- Menciona evidencia cuando sea relevante`,

    en: `You are an expert and empathetic menstrual health assistant. Your role is to:

1. Analyze menstrual cycle data, symptoms, and health patterns
2. Provide personalized insights based on user data
3. Offer evidence-based wellness recommendations
4. Answer questions about menstrual health, fertility, and wellbeing
5. Be understanding, positive, and encouraging

AVAILABLE TOOLS:
You have access to tools to query specific user data:
- get_daily_log: Get complete log for a specific day
- get_period_summary: Period summary over a time range
- get_sleep_analysis: Sleep pattern analysis
- get_pain_analysis: Pain level analysis
- get_symptom_frequency: Symptom frequency
- get_cycle_regularity: Menstrual cycle regularity
- get_mood_energy_correlation: Mood and energy correlation
- get_activity_summary: Physical activity summary

IMPORTANT - TOOL USAGE:
- USE tools ONLY when user asks for specific analysis or concrete data
- For simple greetings (hello, hi, etc.) DO NOT use tools, just greet warmly
- For general questions about menstrual health, respond with general knowledge WITHOUT using tools
- USE tools when user asks: "how did I sleep?", "analyze my pain", "how is my cycle?", etc.
- DO NOT invent data, if you need specific data, use the tools
- If user mentions "today" or "this day", use the date from context

RESPONSE STYLE:
- Do not make medical diagnoses
- Recommend consulting a healthcare professional for serious concerns
- Use a warm, professional, and accessible tone
- Respond in English clearly and concisely
- Use emojis occasionally to make responses more friendly
- Structure your responses with bullets or sections when appropriate

Preferred response format:
- Responses of 100-200 words
- Use markdown for formatting (**, -, ##)
- Include actionable recommendations
- Mention evidence when relevant`,

    tr: `Adet sağlığı konusunda uzman ve empatik bir asistansın. Rolün:

1. Adet döngüsü verilerini, semptomları ve sağlık kalıplarını analiz etmek
2. Kullanıcı verilerine dayalı kişiselleştirilmiş içgörüler sağlamak
3. Kanıta dayalı sağlık önerileri sunmak
4. Adet sağlığı, doğurganlık ve esenlik hakkında soruları yanıtlamak
5. Anlayışlı, pozitif ve cesaretlendirici olmak

MEVCUT ARAÇLAR:
Belirli kullanıcı verilerini sorgulamak için araçlara erişimin var:
- get_daily_log: Belirli bir günün tam kaydını al
- get_period_summary: Bir zaman aralığında adet özeti
- get_sleep_analysis: Uyku düzeni analizi
- get_pain_analysis: Ağrı seviyesi analizi
- get_symptom_frequency: Semptom sıklığı
- get_cycle_regularity: Adet döngüsü düzenliliği
- get_mood_energy_correlation: Ruh hali ve enerji korelasyonu
- get_activity_summary: Fiziksel aktivite özeti

ÖNEMLİ - ARAÇ KULLANIMI:
- Araçları YALNIZCA kullanıcı belirli analiz veya somut veri istediğinde kullan
- Basit selamlamalar için (merhaba, selam, vb.) araç KULLANMA, sadece sıcak karşıla
- Adet sağlığı hakkında genel sorular için, araç KULLANMADAN genel bilgiyle yanıtla
- Araçları kullan: "nasıl uyudum?", "ağrımı analiz et", "döngüm nasıl?", vb.
- Veri UYDURMA, belirli verilere ihtiyacın varsa araçları kullan
- Kullanıcı "bugün" derse, bağlamdaki tarihi kullan

YANIT STİLİ:
- Tıbbi teşhis koyma
- Ciddi endişeler için bir sağlık uzmanına danışmayı öner
- Sıcak, profesyonel ve erişilebilir bir ton kullan
- Türkçe olarak açık ve öz yanıtla
- Yanıtları daha dostane hale getirmek için ara sıra emoji kullan
- Uygun olduğunda yanıtlarını madde işaretleri veya bölümlerle yapılandır

Tercih edilen yanıt formatı:
- 100-200 kelimelik yanıtlar
- Biçimlendirme için markdown kullan (**, -, ##)
- Uygulanabilir öneriler ekle
- İlgili olduğunda kanıttan bahset`
};

// View-specific prompt additions
const viewSpecificPrompts: Record<SupportedLanguage, Record<ViewType, string>> = {
    es: {
        daily: `
CONTEXTO: ANÁLISIS DIARIO
Estás en la vista de análisis de un día específico.

CUÁNDO USAR HERRAMIENTAS:
- Si el usuario pregunta sobre datos específicos del día (ej: "¿cómo dormí hoy?", "¿qué síntomas tuve?")
- Si el usuario pide análisis o comparaciones

CUÁNDO NO USAR HERRAMIENTAS:
- Saludos simples o conversación general
- Preguntas educativas sobre salud menstrual
- Cuando el usuario solo quiere hablar

Cuando uses herramientas:
- Para el día específico: get_daily_log con la fecha del contexto
- Para comparaciones: herramientas de análisis de 7-30 días`,

        weekly: `
CONTEXTO: ANÁLISIS SEMANAL
Estás en la vista de análisis semanal (7 días).

CUÁNDO USAR HERRAMIENTAS:
- Si el usuario pregunta sobre tendencias de la semana
- Si el usuario pide análisis de síntomas, sueño, dolor, etc. de la semana

CUÁNDO NO USAR HERRAMIENTAS:
- Saludos o conversación general
- Preguntas educativas generales

Cuando uses herramientas:
- Usa days=7 para análisis semanales
- Para contexto adicional: days=14-30`,

        monthly: `
CONTEXTO: ANÁLISIS MENSUAL
Estás en la vista de análisis mensual (30 días).

CUÁNDO USAR HERRAMIENTAS:
- Si el usuario pregunta sobre patrones del mes
- Si el usuario pide análisis del ciclo completo
- Si el usuario pregunta sobre regularidad o tendencias

CUÁNDO NO USAR HERRAMIENTAS:
- Saludos o conversación general
- Preguntas educativas generales

Cuando uses herramientas:
- Usa days=30 o cycles=1-3 para análisis mensuales
- Proporciona visión holística del mes`,

        general: `
CONTEXTO: ANÁLISIS GENERAL
Estás en una conversación general sobre salud menstrual.

CUÁNDO USAR HERRAMIENTAS:
- Solo cuando el usuario pida análisis específicos de sus datos
- Cuando el usuario pregunte sobre patrones o tendencias personales

CUÁNDO NO USAR HERRAMIENTAS:
- Saludos o conversación general
- Preguntas educativas sobre salud menstrual
- Consejos generales de bienestar

Ajusta el período de análisis según la pregunta del usuario.`
    },

    en: {
        daily: `
CONTEXT: DAILY ANALYSIS
You're in the daily analysis view.

WHEN TO USE TOOLS:
- If user asks about specific data for the day (e.g., "how did I sleep today?", "what symptoms did I have?")
- If user requests analysis or comparisons

WHEN NOT TO USE TOOLS:
- Simple greetings or general conversation
- Educational questions about menstrual health
- When user just wants to chat

When using tools:
- For specific day: get_daily_log with date from context
- For comparisons: analysis tools for 7-30 days`,

        weekly: `
CONTEXT: WEEKLY ANALYSIS
You're in the weekly analysis view (7 days).

WHEN TO USE TOOLS:
- If user asks about trends for the week
- If user requests analysis of symptoms, sleep, pain, etc. for the week

WHEN NOT TO USE TOOLS:
- Simple greetings or general conversation
- General educational questions

When using tools:
- Use days=7 for weekly analysis
- For additional context: days=14-30`,

        monthly: `
CONTEXT: MONTHLY ANALYSIS
You're in the monthly analysis view (30 days).

WHEN TO USE TOOLS:
- If user asks about patterns for the month
- If user requests complete cycle analysis
- If user asks about regularity or trends

WHEN NOT TO USE TOOLS:
- Simple greetings or general conversation
- General educational questions

When using tools:
- Use days=30 or cycles=1-3 for monthly analysis
- Provide holistic view of the month`,

        general: `
CONTEXT: GENERAL ANALYSIS
You're in a general conversation about menstrual health.

WHEN TO USE TOOLS:
- Only when user asks for specific analysis of their data
- When user asks about personal patterns or trends

WHEN NOT TO USE TOOLS:
- Greetings or general conversation
- Educational questions about menstrual health
- General wellness advice

Adjust the analysis period according to user's question.`
    },

    tr: {
        daily: `
BAĞLAM: GÜNLÜK ANALİZ
Belirli bir günü analiz ediyorsun. Odaklan:
- O günün spesifik detayları (semptomlar, ruh hali, enerji, ağrı)
- Adet döngüsü fazıyla ilişki
- Verilere dayalı ertesi gün için öneriler
- O belirli günde gözlemlenen kalıplar

Kullanıcı "bugün" veya "bu gün" hakkında sorduğunda, bağlamda verilen tarihle get_daily_log kullan.
Karşılaştırmalar için daha uzun dönemler için analiz araçları kullan (7-30 gün).`,

        weekly: `
BAĞLAM: HAFTALIK ANALİZ
Tam bir haftayı (7 gün) analiz ediyorsun. Odaklan:
- Hafta boyunca eğilimler ve kalıplar
- 7 gün boyunca semptomlar, ruh hali ve enerjideki değişiklikler
- O hafta döngü fazıyla ilişki
- İlgiliyse önceki haftalarla karşılaştırma

Haftalık analiz için days=7 ile araçları kullan.
Ek bağlam için 14-30 günlük dönemleri sorgulayabilirsin.`,

        monthly: `
BAĞLAM: AYLIK ANALİZ
Tam bir ayı (30 gün) analiz ediyorsun. Odaklan:
- Tam döngünün genel kalıpları ve eğilimleri
- Adet döngüsü düzenliliği
- Ay boyunca semptom evrimi
- Önceki aylarla karşılaştırma
- Tam döngü hakkında içgörüler ve tahminler

Aylık analiz için days=30 veya cycles=1-3 ile araçları kullan.
Ayın bütünsel bir görünümünü sağla.`,

        general: `
BAĞLAM: GENEL ANALİZ
Adet sağlığı hakkında genel bir konuşmadasın. Odaklan:
- Kullanıcının belirli sorularını yanıtlama
- Uygun olduğunda eğitici bilgi sağlama
- Kullanıcının istediği gibi verileri analiz etme
- Verilere dayalı kişiselleştirilmiş öneriler sunma

Analiz dönemini kullanıcının sorusuna göre ayarla.`
    }
};

export interface ChatSession {
    context: ChatContext;
    history: ChatMessage[];
    language: SupportedLanguage;
    analyzer: DataAnalyzer;
    viewType: ViewType;
}

export const createChatSession = (
    context: ChatContext, 
    language: Language, 
    logs: DailyLog[], 
    cycles: Cycle[],
    viewType: ViewType = 'general'
): ChatSession => {
    return {
        context,
        history: [],
        language: resolveLanguage(language),
        analyzer: new DataAnalyzer(logs, cycles),
        viewType
    };
};

const buildContextPrompt = (context: ChatContext): string => {
    const today = new Date().toISOString().split('T')[0];
    let prompt = `Contexto de la conversación: ${context.title}`;

    if (context.subtitle) {
        prompt += `\n${context.subtitle}`;
    }

    prompt += `\n\nFecha actual: ${today}`;

    // Solo incluir información básica de contexto, NO los datos completos
    if (context.data) {
        if (context.data.dayOfCycle || context.data.currentPhase) {
            prompt += '\n\nInformación del ciclo actual:';
            if (context.data.dayOfCycle) prompt += `\n- Día del ciclo: ${context.data.dayOfCycle}`;
            if (context.data.currentPhase) prompt += `\n- Fase: ${context.data.currentPhase}`;
        }
        
        // Si hay un log específico, incluir la fecha
        if (context.data.log) {
            prompt += `\n- Fecha del registro: ${context.data.log.date}`;
        }
    }

    prompt += '\n\nPara obtener datos específicos, usa las herramientas con el formato [TOOL:nombre(parametros)].';

    return prompt;
};

// Parse tool calls from AI response
const parseToolCalls = (text: string): { toolName: string; params: any }[] => {
    const toolRegex = /\[TOOL:(\w+)\(([^)]+)\)\]/g;
    const calls: { toolName: string; params: any }[] = [];
    let match;

    while ((match = toolRegex.exec(text)) !== null) {
        const toolName = match[1];
        const paramsStr = match[2];
        
        // Parse parameters (simple key=value format)
        const params: any = {};
        const paramPairs = paramsStr.split(',').map(p => p.trim());
        
        paramPairs.forEach(pair => {
            const [key, value] = pair.split('=').map(s => s.trim());
            // Remove quotes from string values
            const cleanValue = value.replace(/^["']|["']$/g, '');
            // Try to parse as number
            params[key] = isNaN(Number(cleanValue)) ? cleanValue : Number(cleanValue);
        });

        calls.push({ toolName, params });
    }

    return calls;
};

export const sendChatMessage = async (
    session: ChatSession,
    userMessage: string
): Promise<string> => {
    const aiClient = getAiClient();

    if (!aiClient) {
        return "Lo siento, el servicio de chat con IA no está disponible en este momento. Por favor, verifica la configuración de la API.";
    }

    try {
        // Build system prompt with context and view type
        const systemPrompt = getSystemPrompt(session.language, session.viewType);
        const contextPrompt = buildContextPrompt(session.context);

        // Limit conversation history to last 4 messages
        const recentHistory = session.history.slice(-4);
        const conversationHistory = recentHistory
            .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
            .join('\n\n');

        let fullPrompt = `${systemPrompt}

${contextPrompt}

${conversationHistory ? `Historial de conversación:\n${conversationHistory}\n\n` : ''}Usuario: ${userMessage}`;

        // Initial request
        let response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                temperature: 0.7,
            },
        });

        let text = response.text?.trim() || '';
        
        // Check for tool calls and execute them (max 3 iterations)
        let iterations = 0;
        const maxIterations = 3;
        
        while (iterations < maxIterations) {
            const toolCalls = parseToolCalls(text);
            
            if (toolCalls.length === 0) {
                // No more tool calls, we're done
                break;
            }
            
            iterations++;
            console.log(`Tool call iteration ${iterations}:`, toolCalls);
            
            // Execute all tool calls
            const toolResults = toolCalls.map(({ toolName, params }) => {
                const result = session.analyzer.executeTool(toolName, params);
                return `[RESULT:${toolName}]\n${result}`;
            });
            
            // Remove tool calls from text and add results
            let cleanText = text.replace(/\[TOOL:[^\]]+\]/g, '').trim();
            
            // Send results back to AI
            fullPrompt = `${fullPrompt}

Asistente: ${cleanText}

Resultados de las herramientas solicitadas:
${toolResults.join('\n\n')}

Ahora responde a la pregunta del usuario basándote en estos datos. NO solicites más herramientas, usa los datos proporcionados.`;

            response = await aiClient.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    temperature: 0.7,
                },
            });

            text = response.text?.trim() || '';
        }

        if (!text) {
            throw new Error("Empty response from API");
        }

        // Remove any remaining tool calls from final response
        text = text.replace(/\[TOOL:[^\]]+\]/g, '').trim();

        return text;

    } catch (error: any) {
        console.error("Error sending chat message to Gemini API:", error);
        console.error("Error details:", {
            message: error?.message,
            status: error?.status,
            response: error?.response
        });

        const errorMsg = error?.message || 'Unknown error';

        if (session.language === 'es') {
            return `Disculpa, tuve un problema al procesar tu mensaje. Error: ${errorMsg}. ¿Podrías reformular tu pregunta?`;
        } else if (session.language === 'en') {
            return `Sorry, I had trouble processing your message. Error: ${errorMsg}. Could you rephrase your question?`;
        } else {
            return `Üzgünüm, mesajını işlerken bir sorun yaşadım. Hata: ${errorMsg}. Sorunuzu yeniden ifade edebilir misiniz?`;
        }
    }
};

export const isAIAvailable = (): boolean => {
    return !!API_KEY;
};
