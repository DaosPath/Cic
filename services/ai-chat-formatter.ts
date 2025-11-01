import type { AIInsight } from './ai-insights.ts';
import type { DailyLog, Cycle } from '../types.ts';
import { getEnergyLabel, getSymptomLabel } from './i18n.ts';

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  insightReferences?: string[]; // IDs of insights referenced
}

export type ChatContextType = 'day' | 'week' | 'month' | 'cycle' | '6-months' | 'year' | 'home' | 'calendar' | 'log';

export interface ChatContext {
  type: ChatContextType;
  title: string;
  subtitle?: string;
  data?: {
    log?: DailyLog;
    logs?: DailyLog[];
    cycles?: Cycle[];
    dateRange?: { start: Date; end: Date };
    currentPhase?: string;
    dayOfCycle?: number;
  };
  filters?: {
    showPredictions: boolean;
    timeRange?: string;
  };
}

export function formatInsightsForChat(
  insights: AIInsight[],
  timeRange: string,
  filters: { showPredictions: boolean }
): ChatMessage {
  const sections: string[] = [];

  // Header
  sections.push(`# Análisis de tu Ciclo Menstrual\n`);
  sections.push(`**Período analizado:** ${timeRange}`);
  sections.push(`**Filtros activos:** ${filters.showPredictions ? 'Incluye predicciones' : 'Solo datos confirmados'}\n`);
  sections.push(`---\n`);

  // Group insights by category
  const grouped = groupInsightsByCategory(insights);

  // Regularity Section
  if (grouped.regularity.length > 0) {
    sections.push(`## 📊 Regularidad del Ciclo\n`);
    grouped.regularity.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Pain Section
  if (grouped.pain.length > 0) {
    sections.push(`## 🩹 Dolor y Molestias\n`);
    grouped.pain.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Sleep Section
  if (grouped.sleep.length > 0) {
    sections.push(`## 😴 Sueño\n`);
    grouped.sleep.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Energy Section
  if (grouped.energy.length > 0) {
    sections.push(`## ⚡ Energía\n`);
    grouped.energy.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Stress Section
  if (grouped.stress.length > 0) {
    sections.push(`## 🧘 Estrés y Bienestar\n`);
    grouped.stress.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Symptoms Section
  if (grouped.symptoms.length > 0) {
    sections.push(`## 🔍 Síntomas y Correlaciones\n`);
    grouped.symptoms.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Fertility Section
  if (grouped.fertility.length > 0) {
    sections.push(`## 🌸 Fertilidad\n`);
    grouped.fertility.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // Habits Section
  if (grouped.habits.length > 0) {
    sections.push(`## 🏃 Hábitos y Estilo de Vida\n`);
    grouped.habits.forEach(insight => {
      sections.push(formatInsightSection(insight));
    });
  }

  // KPIs Table
  sections.push(`\n## 📈 Resumen de Métricas Clave\n`);
  sections.push(generateKPITable(insights));

  // Suggested Questions
  sections.push(`\n## 💬 Preguntas Sugeridas\n`);
  sections.push(generateSuggestedQuestions(insights));

  // Footer
  sections.push(`\n---\n`);
  sections.push(`*Este análisis se basa en ${insights.length} insights generados a partir de tus datos.*`);
  sections.push(`*Puedes preguntarme sobre cualquier aspecto de tu ciclo, síntomas o patrones.*\n`);

  return {
    role: 'assistant',
    content: sections.join('\n'),
    timestamp: new Date(),
    insightReferences: insights.map(i => i.id)
  };
}

function groupInsightsByCategory(insights: AIInsight[]) {
  return {
    regularity: insights.filter(i => i.type === 'cycle-regularity'),
    pain: insights.filter(i => i.type === 'pain-spike'),
    sleep: insights.filter(i => i.type === 'sleep-quality'),
    energy: insights.filter(i => i.type === 'energy-pattern'),
    stress: insights.filter(i => i.type === 'stress-spike'),
    symptoms: insights.filter(i => i.type === 'emerging-symptom' || i.type === 'correlation'),
    fertility: insights.filter(i => i.type === 'basal-temp' || i.type === 'ovulation'),
    habits: insights.filter(i => 
      i.type === 'physical-activity' || 
      i.type === 'hydration' || 
      i.type === 'weight-trend' ||
      i.type === 'contraception-adherence'
    )
  };
}

function formatInsightSection(insight: AIInsight): string {
  const lines: string[] = [];
  
  lines.push(`### ${insight.title}`);
  lines.push(`**Insight:** ${insight.insight}`);
  lines.push(`**Evidencia:** ${insight.evidence.summary} (${insight.timeRange})`);
  lines.push(`**Confianza:** ${insight.confidence}%\n`);
  
  if (insight.recommendations.length > 0) {
    lines.push(`**Recomendaciones:**`);
    insight.recommendations.forEach(rec => {
      const icon = rec.category === 'habit' ? '📝' : rec.category === 'medical' ? '🏥' : '🌱';
      lines.push(`- ${icon} ${rec.text}`);
    });
  }
  
  lines.push('');
  return lines.join('\n');
}

function generateKPITable(insights: AIInsight[]): string {
  const lines: string[] = [];
  
  lines.push('| Métrica | Valor | Estado |');
  lines.push('|---------|-------|--------|');
  
  // Extract key metrics from insights
  const regularityInsight = insights.find(i => i.type === 'cycle-regularity');
  if (regularityInsight) {
    const match = regularityInsight.insight.match(/±(\d+)/);
    const variability = match ? match[1] : 'N/A';
    const status = parseInt(variability) < 3 ? '✅ Excelente' : parseInt(variability) < 5 ? '⚠️ Bueno' : '❌ Variable';
    lines.push(`| Variabilidad del ciclo | ±${variability} días | ${status} |`);
  }
  
  const painInsight = insights.find(i => i.type === 'pain-spike');
  if (painInsight) {
    const match = painInsight.insight.match(/promedio de ([\d.]+)/);
    const avgPain = match ? match[1] : 'N/A';
    const status = parseFloat(avgPain) < 4 ? '✅ Bajo' : parseFloat(avgPain) < 7 ? '⚠️ Moderado' : '❌ Alto';
    lines.push(`| Nivel de dolor promedio | ${avgPain}/10 | ${status} |`);
  }
  
  const sleepInsight = insights.find(i => i.type === 'sleep-quality');
  if (sleepInsight) {
    const match = sleepInsight.insight.match(/promedio de ([\d.]+)/);
    const avgSleep = match ? match[1] : 'N/A';
    const status = parseFloat(avgSleep) >= 7 ? '✅ Bueno' : parseFloat(avgSleep) >= 6 ? '⚠️ Aceptable' : '❌ Insuficiente';
    lines.push(`| Horas de sueño | ${avgSleep}h | ${status} |`);
  }
  
  const stressInsight = insights.find(i => i.type === 'stress-spike');
  if (stressInsight) {
    const match = stressInsight.insight.match(/promedio de ([\d.]+)/);
    const avgStress = match ? match[1] : 'N/A';
    const status = parseFloat(avgStress) < 5 ? '✅ Bajo' : parseFloat(avgStress) < 7 ? '⚠️ Moderado' : '❌ Alto';
    lines.push(`| Nivel de estrés | ${avgStress}/10 | ${status} |`);
  }
  
  return lines.join('\n');
}

function generateSuggestedQuestions(insights: AIInsight[]): string {
  const questions: string[] = [];
  
  // Generate contextual questions based on insights
  if (insights.some(i => i.type === 'cycle-regularity')) {
    questions.push('- ¿Qué factores pueden estar afectando la regularidad de mi ciclo?');
  }
  
  if (insights.some(i => i.type === 'pain-spike')) {
    questions.push('- ¿Cómo puedo reducir el dolor menstrual de forma natural?');
  }
  
  if (insights.some(i => i.type === 'sleep-quality')) {
    questions.push('- ¿Cómo afecta el sueño a mi ciclo menstrual?');
  }
  
  if (insights.some(i => i.type === 'correlation')) {
    questions.push('- ¿Qué significan estas correlaciones entre síntomas?');
  }
  
  if (insights.some(i => i.type === 'stress-spike')) {
    questions.push('- ¿Qué técnicas de manejo del estrés me recomiendas?');
  }
  
  // Always include general questions
  questions.push('- ¿Cuándo es mi próxima ventana fértil?');
  questions.push('- ¿Debería consultar con un médico sobre alguno de estos patrones?');
  questions.push('- ¿Qué cambios de estilo de vida me beneficiarían más?');
  
  return questions.join('\n');
}

export function addUserMessage(content: string): ChatMessage {
  return {
    role: 'user',
    content,
    timestamp: new Date()
  };
}

export function addAssistantMessage(content: string, insightReferences?: string[]): ChatMessage {
  return {
    role: 'assistant',
    content,
    timestamp: new Date(),
    insightReferences
  };
}

// Format context-specific chat message
export function formatContextForChat(context: ChatContext): ChatMessage {
  const sections: string[] = [];

  // Header
  sections.push(`# Chat de Análisis: ${context.title}\n`);
  if (context.subtitle) {
    sections.push(`*${context.subtitle}*\n`);
  }
  sections.push(`---\n`);

  // Context-specific content
  switch (context.type) {
    case 'day':
      sections.push(formatDayContext(context));
      break;
    case 'week':
      sections.push(formatWeekContext(context));
      break;
    case 'month':
      sections.push(formatMonthContext(context));
      break;
    case 'cycle':
      sections.push(formatCycleContext(context));
      break;
    case '6-months':
    case 'year':
      sections.push(formatLongTermContext(context));
      break;
    case 'home':
      sections.push(formatHomeContext(context));
      break;
    case 'calendar':
      sections.push(formatCalendarContext(context));
      break;
    case 'log':
      sections.push(formatLogContext(context));
      break;
  }

  // Suggested questions
  sections.push(`\n## 💬 Preguntas Sugeridas\n`);
  sections.push(generateContextualQuestions(context));

  // Footer
  sections.push(`\n---\n`);
  sections.push(`*Puedes preguntarme sobre cualquier aspecto de tus datos, patrones o recomendaciones.*\n`);

  return {
    role: 'assistant',
    content: sections.join('\n'),
    timestamp: new Date()
  };
}

function formatDayContext(context: ChatContext): string {
  const log = context.data?.log;
  if (!log) return 'No hay datos registrados para este día.\n';

  const sections: string[] = [];
  sections.push(`## 📅 Resumen del Día\n`);
  
  // KPIs
  const kpis: string[] = [];
  if (log.periodIntensity !== undefined && log.periodIntensity > 0) {
    kpis.push(`🩸 Menstruación: ${['Sin flujo', 'Ligero', 'Moderado', 'Abundante'][log.periodIntensity]}`);
  }
  if (log.mood !== undefined) {
    kpis.push(`😊 Ánimo: ${log.mood}/10`);
  }
  if (log.energyLevel) {
    kpis.push(`⚡ Energía: ${getEnergyLabel(log.energyLevel, 'es')}`);
  }
  if (log.painLevel !== undefined && log.painLevel > 0) {
    kpis.push(`🩹 Dolor: ${log.painLevel}/10`);
  }
  if (log.stressScore !== undefined) {
    kpis.push(`🧘 Estrés: ${log.stressScore}/10`);
  }
  if (log.sleepHours !== undefined) {
    kpis.push(`😴 Sueño: ${log.sleepHours}h${log.sleepQuality ? ` (${log.sleepQuality}/5⭐)` : ''}`);
  }
  if (log.waterIntake !== undefined && log.waterIntake > 0) {
    kpis.push(`💧 Hidratación: ${log.waterIntake}L`);
  }
  if (log.physicalActivity && log.physicalActivity !== 'none') {
    kpis.push(`🏃 Actividad: ${log.physicalActivity}${log.activityDuration ? ` (${log.activityDuration} min)` : ''}`);
  }

  if (kpis.length > 0) {
    sections.push(kpis.map(k => `- ${k}`).join('\n'));
    sections.push('');
  }

  // Symptoms
  if (log.symptoms && log.symptoms.length > 0) {
    sections.push(`**Síntomas registrados:** ${log.symptoms.length}`);
    sections.push('');
  }

  // Notes
  if (log.notes) {
    sections.push(`**Notas:** ${log.notes.substring(0, 100)}${log.notes.length > 100 ? '...' : ''}`);
    sections.push('');
  }

  return sections.join('\n');
}

function formatWeekContext(context: ChatContext): string {
  const logs = context.data?.logs || [];
  const sections: string[] = [];
  sections.push(`## 📆 Resumen Semanal (${logs.length} días registrados)\n`);

  // Calculate averages
  const sleepLogs = logs.filter(l => l.sleepHours !== undefined);
  const avgSleep = sleepLogs.length > 0 
    ? (sleepLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / sleepLogs.length).toFixed(1)
    : 'N/A';

  const painLogs = logs.filter(l => l.painLevel !== undefined && l.painLevel > 0);
  const avgPain = painLogs.length > 0
    ? (painLogs.reduce((sum, l) => sum + (l.painLevel || 0), 0) / painLogs.length).toFixed(1)
    : 'N/A';

  const stressLogs = logs.filter(l => l.stressScore !== undefined);
  const avgStress = stressLogs.length > 0
    ? (stressLogs.reduce((sum, l) => sum + (l.stressScore || 0), 0) / stressLogs.length).toFixed(1)
    : 'N/A';

  const activeDays = logs.filter(l => l.physicalActivity && l.physicalActivity !== 'none').length;

  sections.push(`- 😴 Sueño promedio: ${avgSleep}h`);
  sections.push(`- 🩹 Dolor promedio: ${avgPain}/10`);
  sections.push(`- 🧘 Estrés promedio: ${avgStress}/10`);
  sections.push(`- 🏃 Días activos: ${activeDays}/7`);
  sections.push('');

  return sections.join('\n');
}

function formatMonthContext(context: ChatContext): string {
  const logs = context.data?.logs || [];
  const cycles = context.data?.cycles || [];
  const sections: string[] = [];
  sections.push(`## 🗓️ Resumen Mensual (${logs.length} días registrados)\n`);

  if (cycles.length > 0) {
    sections.push(`**Ciclos este mes:** ${cycles.length}`);
    sections.push('');
  }

  // Top symptoms
  const symptomCounts: Record<string, number> = {};
  logs.forEach(log => {
    log.symptoms?.forEach(symptomId => {
      symptomCounts[symptomId] = (symptomCounts[symptomId] || 0) + 1;
    });
  });

  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topSymptoms.length > 0) {
    sections.push(`**Síntomas más frecuentes:**`);
    topSymptoms.forEach(([symptom, count]) => {
      sections.push(`- ${getSymptomLabel(symptom, 'es')}: ${count} veces`);
    });
    sections.push('');
  }

  return sections.join('\n');
}

function formatCycleContext(context: ChatContext): string {
  const sections: string[] = [];
  sections.push(`## 🔄 Ciclo Actual\n`);
  
  if (context.data?.dayOfCycle) {
    sections.push(`**Día del ciclo:** ${context.data.dayOfCycle}`);
  }
  if (context.data?.currentPhase) {
    sections.push(`**Fase actual:** ${context.data.currentPhase}`);
  }
  sections.push('');

  return sections.join('\n');
}

function formatLongTermContext(context: ChatContext): string {
  const sections: string[] = [];
  const timeLabel = context.type === '6-months' ? '6 meses' : '1 año';
  sections.push(`## 📊 Análisis de ${timeLabel}\n`);
  sections.push(`Análisis de patrones y tendencias a largo plazo.\n`);
  return sections.join('\n');
}

function formatHomeContext(context: ChatContext): string {
  const sections: string[] = [];
  sections.push(`## 🏠 Vista General\n`);
  
  if (context.data?.dayOfCycle) {
    sections.push(`**Día del ciclo:** ${context.data.dayOfCycle}`);
  }
  if (context.data?.currentPhase) {
    sections.push(`**Fase actual:** ${context.data.currentPhase}`);
  }
  sections.push('');

  return sections.join('\n');
}

function formatCalendarContext(context: ChatContext): string {
  const log = context.data?.log;
  const sections: string[] = [];
  sections.push(`## 📅 Día Seleccionado\n`);
  
  if (log) {
    sections.push(formatDayContext(context));
  } else {
    sections.push('No hay datos registrados para este día.\n');
  }

  return sections.join('\n');
}

function formatLogContext(context: ChatContext): string {
  const log = context.data?.log;
  const sections: string[] = [];
  sections.push(`## 📝 Registro de Hoy\n`);
  
  if (log) {
    sections.push(formatDayContext(context));
  } else {
    sections.push('Aún no has guardado el registro de hoy.\n');
  }

  return sections.join('\n');
}

function generateContextualQuestions(context: ChatContext): string {
  const questions: string[] = [];

  switch (context.type) {
    case 'day':
      questions.push('- ¿Cómo puedo mejorar mi sueño hoy?');
      questions.push('- ¿Qué significa mi nivel de dolor actual?');
      questions.push('- ¿Debería hacer ejercicio hoy?');
      break;
    case 'week':
      questions.push('- ¿Cómo fue mi semana comparada con otras?');
      questions.push('- ¿Qué patrones veo en mi sueño esta semana?');
      questions.push('- ¿Estoy cumpliendo mis objetivos de actividad?');
      break;
    case 'month':
      questions.push('- ¿Cómo fue mi regularidad este mes?');
      questions.push('- ¿Qué síntomas fueron más frecuentes?');
      questions.push('- ¿Hay correlaciones entre mis síntomas?');
      break;
    case 'cycle':
      questions.push('- ¿En qué fase estoy y qué esperar?');
      questions.push('- ¿Cuándo es mi próxima ventana fértil?');
      questions.push('- ¿Cómo optimizar mi bienestar en esta fase?');
      break;
    case '6-months':
    case 'year':
      questions.push('- ¿Cómo ha evolucionado mi regularidad?');
      questions.push('- ¿Qué tendencias a largo plazo veo?');
      questions.push('- ¿Debería consultar con un médico?');
      break;
    default:
      questions.push('- ¿Cuándo es mi próximo período?');
      questions.push('- ¿Cómo está mi regularidad?');
      questions.push('- ¿Qué recomendaciones tienes para mí?');
  }

  return questions.join('\n');
}
