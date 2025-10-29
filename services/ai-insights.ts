import type { Cycle, DailyLog } from '../types.ts';
import { differenceInDays } from 'date-fns/differenceInDays';
import { parseISO } from 'date-fns/parseISO';

export interface AIInsight {
  id: string;
  type: 'cycle-regularity' | 'flow-changes' | 'pain-spike' | 'stress-spike' | 'sleep-quality' | 
        'energy-pattern' | 'contraception-adherence' | 'emerging-symptom' | 'correlation' | 
        'basal-temp' | 'ovulation' | 'physical-activity' | 'hydration' | 'weight-trend';
  priority: number; // 1-10, higher = more important
  confidence: number; // 0-100
  title: string;
  whyItMatters: string;
  insight: string;
  evidence: {
    values: number[];
    labels: string[];
    summary: string;
  };
  timeRange: string;
  recommendations: Array<{
    text: string;
    category: 'habit' | 'medical' | 'lifestyle';
  }>;
  dataSource: string; // For chat reference
}

export function generateAIInsights(
  logs: DailyLog[],
  cycles: Cycle[],
  timeRange: number = 6
): AIInsight[] {
  const insights: AIInsight[] = [];
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - timeRange);

  const recentLogs = logs.filter(log => parseISO(log.date) >= cutoffDate);
  const recentCycles = cycles.filter(c => parseISO(c.startDate) >= cutoffDate);

  // 1. Cycle Regularity
  const regularityInsight = analyzeCycleRegularity(recentCycles);
  if (regularityInsight) insights.push(regularityInsight);

  // 2. Pain Patterns
  const painInsight = analyzePainPatterns(recentLogs);
  if (painInsight) insights.push(painInsight);

  // 3. Stress Patterns
  const stressInsight = analyzeStressPatterns(recentLogs);
  if (stressInsight) insights.push(stressInsight);

  // 4. Sleep Quality
  const sleepInsight = analyzeSleepQuality(recentLogs);
  if (sleepInsight) insights.push(sleepInsight);

  // 5. Energy Patterns
  const energyInsight = analyzeEnergyPatterns(recentLogs);
  if (energyInsight) insights.push(energyInsight);

  // 6. Symptom Correlations
  const correlationInsights = analyzeSymptomCorrelations(recentLogs, recentCycles);
  insights.push(...correlationInsights);

  // 7. Hydration
  const hydrationInsight = analyzeHydration(recentLogs);
  if (hydrationInsight) insights.push(hydrationInsight);

  // 8. Physical Activity
  const activityInsight = analyzePhysicalActivity(recentLogs);
  if (activityInsight) insights.push(activityInsight);

  // Sort by priority (descending)
  return insights.sort((a, b) => b.priority - a.priority);
}

function analyzeCycleRegularity(cycles: Cycle[]): AIInsight | null {
  if (cycles.length < 3) return null;

  const lengths = cycles.filter(c => c.length).map(c => c.length!);
  if (lengths.length < 3) return null;

  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  const isRegular = stdDev < 3;
  const confidence = Math.min(95, 60 + (lengths.length * 5));

  return {
    id: 'cycle-regularity',
    type: 'cycle-regularity',
    priority: 9,
    confidence,
    title: isRegular ? 'Ciclo Regular Detectado' : 'Variabilidad en el Ciclo',
    whyItMatters: 'La regularidad del ciclo es un indicador clave de salud hormonal y puede ayudar a predecir tu próximo periodo.',
    insight: isRegular 
      ? `Tu ciclo es muy regular con una variación de solo ±${Math.round(stdDev)} días. Esto facilita la predicción.`
      : `Tu ciclo varía ±${Math.round(stdDev)} días. Esto es normal, pero monitorear puede ayudar a identificar patrones.`,
    evidence: {
      values: lengths,
      labels: lengths.map((_, i) => `Ciclo ${lengths.length - i}`),
      summary: `Promedio: ${Math.round(avg)} días, Desviación: ${Math.round(stdDev)} días`
    },
    timeRange: `Últimos ${lengths.length} ciclos`,
    recommendations: isRegular ? [
      { text: 'Mantén tu rutina actual de sueño y ejercicio', category: 'lifestyle' },
      { text: 'Continúa registrando para mantener predicciones precisas', category: 'habit' }
    ] : [
      { text: 'Registra factores de estrés y cambios en rutina', category: 'habit' },
      { text: 'Considera consultar si la variación supera 7 días', category: 'medical' },
      { text: 'Mantén horarios regulares de sueño', category: 'lifestyle' }
    ],
    dataSource: 'cycle-length-analysis'
  };
}

function analyzePainPatterns(logs: DailyLog[]): AIInsight | null {
  const painLogs = logs.filter(log => log.painLevel && log.painLevel > 0);
  if (painLogs.length < 5) return null;

  const avgPain = painLogs.reduce((sum, log) => sum + (log.painLevel || 0), 0) / painLogs.length;
  const highPainDays = painLogs.filter(log => (log.painLevel || 0) >= 7).length;
  const painPercentage = (painLogs.length / logs.length) * 100;

  const priority = avgPain > 6 ? 8 : avgPain > 4 ? 6 : 4;
  const confidence = Math.min(90, 50 + painLogs.length * 2);

  return {
    id: 'pain-patterns',
    type: 'pain-spike',
    priority,
    confidence,
    title: avgPain > 6 ? 'Niveles de Dolor Elevados' : 'Patrón de Dolor Moderado',
    whyItMatters: 'El dolor crónico puede afectar tu calidad de vida y puede indicar condiciones que requieren atención.',
    insight: `Registraste dolor en ${Math.round(painPercentage)}% de los días, con un promedio de ${avgPain.toFixed(1)}/10. ${highPainDays} días con dolor severo (≥7).`,
    evidence: {
      values: painLogs.map(log => log.painLevel || 0),
      labels: painLogs.map(log => log.date.slice(5)),
      summary: `${painLogs.length} días con dolor, promedio ${avgPain.toFixed(1)}/10`
    },
    timeRange: `Últimos ${logs.length} días`,
    recommendations: avgPain > 6 ? [
      { text: 'Consulta con un ginecólogo sobre el dolor persistente', category: 'medical' },
      { text: 'Prueba técnicas de manejo del dolor (calor, TENS)', category: 'lifestyle' },
      { text: 'Registra qué alivia tu dolor para identificar patrones', category: 'habit' }
    ] : [
      { text: 'Mantén registro de ubicación y duración del dolor', category: 'habit' },
      { text: 'Considera antiinflamatorios naturales (jengibre, cúrcuma)', category: 'lifestyle' }
    ],
    dataSource: 'pain-level-tracking'
  };
}

function analyzeStressPatterns(logs: DailyLog[]): AIInsight | null {
  const stressLogs = logs.filter(log => log.stressScore !== undefined);
  if (stressLogs.length < 7) return null;

  const avgStress = stressLogs.reduce((sum, log) => sum + (log.stressScore || 0), 0) / stressLogs.length;
  const highStressDays = stressLogs.filter(log => (log.stressScore || 0) >= 7).length;
  const stressPercentage = (highStressDays / stressLogs.length) * 100;

  const priority = avgStress > 7 ? 7 : avgStress > 5 ? 5 : 3;
  const confidence = Math.min(85, 40 + stressLogs.length * 3);

  return {
    id: 'stress-patterns',
    type: 'stress-spike',
    priority,
    confidence,
    title: avgStress > 7 ? 'Estrés Elevado Detectado' : 'Niveles de Estrés Moderados',
    whyItMatters: 'El estrés crónico puede afectar tu ciclo menstrual, sueño y salud general.',
    insight: `Tu nivel promedio de estrés es ${avgStress.toFixed(1)}/10. ${Math.round(stressPercentage)}% de los días registraste estrés alto (≥7).`,
    evidence: {
      values: stressLogs.map(log => log.stressScore || 0),
      labels: stressLogs.map(log => log.date.slice(5)),
      summary: `${stressLogs.length} días registrados, ${highStressDays} con estrés alto`
    },
    timeRange: `Últimos ${stressLogs.length} días`,
    recommendations: avgStress > 7 ? [
      { text: 'Practica técnicas de relajación diarias (meditación, respiración)', category: 'lifestyle' },
      { text: 'Considera terapia o counseling profesional', category: 'medical' },
      { text: 'Identifica y aborda los detonantes principales', category: 'habit' }
    ] : [
      { text: 'Mantén rutinas de autocuidado regulares', category: 'lifestyle' },
      { text: 'Registra qué actividades reducen tu estrés', category: 'habit' }
    ],
    dataSource: 'stress-tracking'
  };
}

function analyzeSleepQuality(logs: DailyLog[]): AIInsight | null {
  const sleepLogs = logs.filter(log => log.sleepHours !== undefined);
  if (sleepLogs.length < 7) return null;

  const avgSleep = sleepLogs.reduce((sum, log) => sum + (log.sleepHours || 0), 0) / sleepLogs.length;
  const poorSleepDays = sleepLogs.filter(log => (log.sleepHours || 0) < 6).length;
  const qualityLogs = sleepLogs.filter(log => log.sleepQuality !== undefined);
  const avgQuality = qualityLogs.length > 0
    ? qualityLogs.reduce((sum, log) => sum + (log.sleepQuality || 0), 0) / qualityLogs.length
    : 0;

  const priority = avgSleep < 6 ? 8 : avgSleep < 7 ? 6 : 4;
  const confidence = Math.min(90, 50 + sleepLogs.length * 2);

  return {
    id: 'sleep-quality',
    type: 'sleep-quality',
    priority,
    confidence,
    title: avgSleep < 6 ? 'Sueño Insuficiente' : avgSleep < 7 ? 'Sueño Subóptimo' : 'Buen Patrón de Sueño',
    whyItMatters: 'El sueño afecta directamente tus hormonas, energía, estado de ánimo y salud del ciclo.',
    insight: `Duermes un promedio de ${avgSleep.toFixed(1)} horas por noche. ${poorSleepDays} días con menos de 6 horas.${avgQuality > 0 ? ` Calidad promedio: ${avgQuality.toFixed(1)}/5.` : ''}`,
    evidence: {
      values: sleepLogs.map(log => log.sleepHours || 0),
      labels: sleepLogs.map(log => log.date.slice(5)),
      summary: `${sleepLogs.length} noches registradas, promedio ${avgSleep.toFixed(1)}h`
    },
    timeRange: `Últimos ${sleepLogs.length} días`,
    recommendations: avgSleep < 7 ? [
      { text: 'Establece una hora fija para dormir (7-9 horas)', category: 'lifestyle' },
      { text: 'Crea una rutina de relajación antes de dormir', category: 'habit' },
      { text: 'Evita cafeína después de las 14:00', category: 'lifestyle' },
      { text: 'Consulta si el insomnio persiste', category: 'medical' }
    ] : [
      { text: 'Mantén tu rutina de sueño consistente', category: 'habit' },
      { text: 'Registra qué factores mejoran tu calidad de sueño', category: 'habit' }
    ],
    dataSource: 'sleep-tracking'
  };
}

function analyzeEnergyPatterns(logs: DailyLog[]): AIInsight | null {
  const energyLogs = logs.filter(log => log.energyLevel !== undefined);
  if (energyLogs.length < 7) return null;

  const lowEnergyDays = energyLogs.filter(log => log.energyLevel === 'low').length;
  const highEnergyDays = energyLogs.filter(log => log.energyLevel === 'high').length;
  const lowEnergyPercentage = (lowEnergyDays / energyLogs.length) * 100;

  const priority = lowEnergyPercentage > 60 ? 7 : lowEnergyPercentage > 40 ? 5 : 3;
  const confidence = Math.min(85, 45 + energyLogs.length * 2);

  return {
    id: 'energy-patterns',
    type: 'energy-pattern',
    priority,
    confidence,
    title: lowEnergyPercentage > 60 ? 'Energía Baja Frecuente' : 'Patrón de Energía Variable',
    whyItMatters: 'Los niveles de energía reflejan tu salud general, sueño, nutrición y equilibrio hormonal.',
    insight: `${Math.round(lowEnergyPercentage)}% de los días reportaste energía baja. ${highEnergyDays} días con energía alta.`,
    evidence: {
      values: energyLogs.map(log => log.energyLevel === 'low' ? 1 : log.energyLevel === 'medium' ? 2 : 3),
      labels: energyLogs.map(log => log.date.slice(5)),
      summary: `${lowEnergyDays} días baja, ${highEnergyDays} días alta`
    },
    timeRange: `Últimos ${energyLogs.length} días`,
    recommendations: lowEnergyPercentage > 60 ? [
      { text: 'Revisa niveles de hierro y vitamina D con análisis', category: 'medical' },
      { text: 'Asegura 7-9 horas de sueño de calidad', category: 'lifestyle' },
      { text: 'Aumenta actividad física moderada (30 min/día)', category: 'lifestyle' },
      { text: 'Registra alimentación para identificar deficiencias', category: 'habit' }
    ] : [
      { text: 'Identifica qué días tienes más energía y por qué', category: 'habit' },
      { text: 'Mantén horarios regulares de comida y sueño', category: 'lifestyle' }
    ],
    dataSource: 'energy-tracking'
  };
}

function analyzeSymptomCorrelations(logs: DailyLog[], cycles: Cycle[]): AIInsight[] {
  const insights: AIInsight[] = [];
  
  // Mood vs Sleep correlation
  const moodSleepLogs = logs.filter(log => log.mood !== undefined && log.sleepHours !== undefined);
  if (moodSleepLogs.length >= 10) {
    const poorSleepBadMood = moodSleepLogs.filter(log => (log.sleepHours || 0) < 6 && (log.mood || 0) <= 2).length;
    const correlation = (poorSleepBadMood / moodSleepLogs.length) * 100;
    
    if (correlation > 30) {
      insights.push({
        id: 'mood-sleep-correlation',
        type: 'correlation',
        priority: 6,
        confidence: Math.min(80, 50 + moodSleepLogs.length),
        title: 'Correlación: Sueño y Estado de Ánimo',
        whyItMatters: 'Entender esta conexión te ayuda a priorizar el sueño para mejorar tu bienestar emocional.',
        insight: `En ${Math.round(correlation)}% de los casos, dormir menos de 6 horas se asoció con mal estado de ánimo.`,
        evidence: {
          values: [poorSleepBadMood, moodSleepLogs.length - poorSleepBadMood],
          labels: ['Sueño pobre + Ánimo bajo', 'Otros'],
          summary: `${poorSleepBadMood} de ${moodSleepLogs.length} días`
        },
        timeRange: `Últimos ${moodSleepLogs.length} días`,
        recommendations: [
          { text: 'Prioriza 7-8 horas de sueño para mejorar tu ánimo', category: 'lifestyle' },
          { text: 'Crea una rutina de sueño relajante', category: 'habit' }
        ],
        dataSource: 'mood-sleep-correlation'
      });
    }
  }

  return insights;
}

function analyzeHydration(logs: DailyLog[]): AIInsight | null {
  const hydrationLogs = logs.filter(log => log.waterIntake !== undefined);
  if (hydrationLogs.length < 7) return null;

  const avgWater = hydrationLogs.reduce((sum, log) => sum + (log.waterIntake || 0), 0) / hydrationLogs.length;
  const lowHydrationDays = hydrationLogs.filter(log => (log.waterIntake || 0) < 1.5).length;

  const priority = avgWater < 1.5 ? 5 : 3;
  const confidence = Math.min(85, 40 + hydrationLogs.length * 3);

  return {
    id: 'hydration',
    type: 'hydration',
    priority,
    confidence,
    title: avgWater < 1.5 ? 'Hidratación Insuficiente' : 'Buena Hidratación',
    whyItMatters: 'La hidratación adecuada reduce dolores de cabeza, mejora energía y ayuda con la hinchazón.',
    insight: `Bebes un promedio de ${avgWater.toFixed(1)}L de agua al día. ${lowHydrationDays} días con menos de 1.5L.`,
    evidence: {
      values: hydrationLogs.map(log => log.waterIntake || 0),
      labels: hydrationLogs.map(log => log.date.slice(5)),
      summary: `${hydrationLogs.length} días registrados, promedio ${avgWater.toFixed(1)}L`
    },
    timeRange: `Últimos ${hydrationLogs.length} días`,
    recommendations: avgWater < 1.5 ? [
      { text: 'Objetivo: 2-2.5L de agua al día', category: 'lifestyle' },
      { text: 'Lleva una botella de agua contigo', category: 'habit' },
      { text: 'Establece recordatorios para beber agua', category: 'habit' }
    ] : [
      { text: 'Mantén tu buena hidratación', category: 'habit' }
    ],
    dataSource: 'hydration-tracking'
  };
}

function analyzePhysicalActivity(logs: DailyLog[]): AIInsight | null {
  const activityLogs = logs.filter(log => log.physicalActivity && log.physicalActivity !== 'none');
  if (logs.length < 14) return null;

  const activityPercentage = (activityLogs.length / logs.length) * 100;
  const avgDuration = activityLogs.filter(log => log.activityDuration).length > 0
    ? activityLogs.filter(log => log.activityDuration).reduce((sum, log) => sum + (log.activityDuration || 0), 0) / activityLogs.filter(log => log.activityDuration).length
    : 0;

  const priority = activityPercentage < 30 ? 6 : 4;
  const confidence = Math.min(85, 40 + logs.length * 2);

  return {
    id: 'physical-activity',
    type: 'physical-activity',
    priority,
    confidence,
    title: activityPercentage < 30 ? 'Actividad Física Baja' : 'Buen Nivel de Actividad',
    whyItMatters: 'El ejercicio regular mejora el estado de ánimo, reduce dolor menstrual y regula el ciclo.',
    insight: `Hiciste ejercicio en ${Math.round(activityPercentage)}% de los días.${avgDuration > 0 ? ` Duración promedio: ${Math.round(avgDuration)} minutos.` : ''}`,
    evidence: {
      values: logs.map(log => log.physicalActivity && log.physicalActivity !== 'none' ? 1 : 0),
      labels: logs.map(log => log.date.slice(5)),
      summary: `${activityLogs.length} de ${logs.length} días con actividad`
    },
    timeRange: `Últimos ${logs.length} días`,
    recommendations: activityPercentage < 30 ? [
      { text: 'Objetivo: 30 minutos de actividad moderada, 5 días/semana', category: 'lifestyle' },
      { text: 'Empieza con caminatas cortas diarias', category: 'habit' },
      { text: 'Encuentra una actividad que disfrutes', category: 'lifestyle' }
    ] : [
      { text: 'Mantén tu rutina de ejercicio', category: 'habit' },
      { text: 'Varía los tipos de actividad para evitar lesiones', category: 'lifestyle' }
    ],
    dataSource: 'activity-tracking'
  };
}
