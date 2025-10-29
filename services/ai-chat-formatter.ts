import type { AIInsight } from './ai-insights.ts';

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  insightReferences?: string[]; // IDs of insights referenced
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
