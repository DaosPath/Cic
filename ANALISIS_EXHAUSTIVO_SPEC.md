# Especificación: Análisis Exhaustivo del Registro Avanzado Completo

## Objetivo
Ampliar el sistema de Análisis (Simple + IA) para cubrir exhaustivamente todos los campos del Registro Avanzado Completo, manteniendo el estilo actual y sin rediseñar la navegación.

## Principios de Diseño
- Mantener estilo dark actual (tipografías, pills, radios, gradientes)
- Usar tokens CSS existentes (--bg, --surface, --surface-2, --text, --text-2, --border, --brand, --accent, --ring)
- No rediseñar navegación
- Controles únicos (sin duplicados)
- Accesibilidad AA completa

## 1. Modelo de Datos Completo

### Campos Cubiertos (según types.ts)
✅ Menstruación: intensidad, color, consistencia, coágulos, productos, fugas
✅ Fertilidad: test LH, moco, cérvix, actividad sexual
✅ Dolor: nivel, ubicaciones, duración
✅ Estado mental: ánimo, ansiedad, tristeza, irritabilidad, calma, motivación, libido, estrés
✅ Sueño: horas, calidad, horarios, siestas
✅ Hidratación/Consumos: agua, cafeína, alcohol, antojos
✅ Actividad: nivel, tipo, duración, RPE, pasos, FC, kcal
✅ Síntomas detallados: GI, neurológicos, musculo-esqueléticos, senos/pkin, urinario/vaginal
✅ Medicación/Suplementos: nombre, dosis, hora, anticonceptivo, remedios
✅ Pruebas/Vitales: embarazo, PA, T° basal, peso
✅ Contexto: clima, ubicación, energía
✅ Notas y Metadatos IA

### Flags y Marcadores
- `aiGenerated`: boolean - Registro generado por IA
- `aiConfidence`: number (0-100) - Nivel de confianza
- `aiAmbiguousFields`: string[] - Campos ambiguos detectados
- Badges visuales: "confirmado", "predicción", "auto IA", "ambiguo"

## 2. ANÁLISIS SIMPLE (Visual Estático)

### 2.1 Vista por Día (DailyInsightView.tsx)
**KPIs actuales:**
- ✅ Estrés (0-10)
- ✅ Sueño (h + calidad)
- ✅ Hidratación (L)
- ✅ Actividad (min + intensidad)
- ✅ Dolor (0-10)
- ✅ Energía (bajo/medio/alto)
- ✅ Ánimo (1-5)
- ✅ Pasos

**Ampliar con:**
- Menstruación: tarjeta detallada (intensidad, color, consistencia, coágulos, productos, fugas)
- Fertilidad: estado del día (test LH, moco, cérvix) + marcador ventana fértil/ovulación
- Síntomas top del día (chips agrupados por categoría)
- Medicación tomada (lista con hora)
- Resumen de notas (1-3 bullets)
- Badges: confirmado/predicción, "auto IA", ambiguo

### 2.2 Vista por Semana (WeeklyInsightView.tsx)
**KPIs actuales:**
- ✅ Sueño promedio
- ✅ Dolor promedio
- ✅ Estrés promedio
- ✅ Hidratación promedio
- ✅ Días activos
- ✅ Ánimo promedio
- ✅ Energía alta

**Ampliar con:**
- Desglose diario: iconos de dolor/ánimo/sueño/hidratación/actividad + badge "sin registro"
- Gráficas: líneas 7d (sueño, estrés, dolor, agua), barras apiladas (actividad por tipo, RPE)
- Patrones: % días con síntomas clave; adherencia anticonceptivo; medicación días/semana
- Consistencia de registro (días con registro x/7)

### 2.3 Vista por Mes (MonthlyInsightView.tsx)
**Ampliar con:**
- Calendario heat: días con menstruación, fértil, ovulación, síntomas top
- Distribuciones: histograma de dolor, estrés, horas de sueño; totales de productos menstruales
- Cumplimiento: días registrados/mes; agua ≥2L %; cafeína media; alcohol total
- Ciclos del mes: longitud, regularidad

### 2.4 Vista por Ciclo (NUEVA)
**Crear CycleInsightView.tsx:**
- Longitud del ciclo, fase lútea estimada, días de sangrado, variabilidad intra-ciclo
- Gráficas: T° basal + LH + moco (timeline) y ubicación de actividad sexual
- Síntomas vs día del ciclo (heatmap 1-31)
- Dolor prolongado (rangos ≥3 días) y picos
- Adherencia anticonceptivo

### 2.5 Vista 6 Meses (NUEVA)
**Crear SixMonthInsightView.tsx:**
- Regularidad: media, σ, Regularity Score (0-100)
- Tendencias: sleep trend, stress trend, hydration trend (medias móviles)
- Correlaciones simples (pearson/spearman):
  - dolor↔estrés
  - sueño↔ánimo
  - hidratación↔dolor
  - cafeína/alcohol↔sueño
  - actividad↔estrés
- Adherencias: anticonceptivo, medicaciones, días de actividad (meta ≥5/sem)
- Síntomas emergentes (ranking por crecimiento)

### 2.6 Vista Año (NUEVA)
**Crear YearInsightView.tsx:**
- Trends mensuales: sueño, hidratación, dolor, estrés (líneas por mes)
- Ciclos/año: recuento, irregulares (>35 o <21 días), visitas a pruebas
- Resumen anual con KPIs y mejores/peores meses

### Filtros Globales
- Rango de tiempo (selector existente)
- "Solo confirmados / Incluir predicciones" (toggle)
- Selector de dominios (checkboxes): sueño, dolor, menstruación, fertilidad, actividad, etc.

## 3. ANÁLISIS DE IA (Dinámico, Modales)

### Principio
Genera modales en tiempo real cuando cambien filtros o se edite un registro. Cada modal incluye:
- Título
- "Por qué importa"
- Insight (1-2 frases)
- Evidencia (valores/mini-gráfico con periodo)
- Confianza %
- Recomendaciones accionables (≤3)
- Etiquetas (hábitos/médico)
- Botones: Fijar / Guardar en informe / Descartar

### 3.1 Categorías de Insights

**Ciclo y Fertilidad:**
- Irregularidad de ciclo
- Fase lútea corta (<10 días)
- Discrepancias LH vs T°/moco
- Timing de actividad sexual vs fértil/ovulación
- Adherencia anticonceptivo (<90%)

**Dolor:**
- Picos (>6/10) sostenidos ≥2-3 días
- Nuevas ubicaciones frecuentes
- Respuesta a medicación

**Estrés y Ánimo:**
- Estrés elevado (>7/10) con detonantes
- Ánimo bajo recurrente
- Relación con sueño/actividad

**Sueño:**
- <7h media o calidad ≤2
- Jet-lag horario
- Siestas compensatorias

**Hidratación/Consumos:**
- <1.5L media
- Cafeína >4 tazas
- Alcohol en días consecutivos
- Impacto en sueño

**Actividad:**
- <3/7 días activos
- RPE muy alto con peor sueño/estrés
- FC reposo elevada

**Síntomas Específicos:**
- GI/urinario/vaginal con patrones
- Acné/retención ligados a fase
- Síntomas respiratorios emergentes

**Vitales y Peso:**
- T° basal atípica
- PA fuera de rango
- Peso con cambios >5% en 3 meses

**Contexto:**
- Clima caluroso asociado a menor sueño/hidratación
- Energía baja crónica

**Calidad de Registro:**
- Días sin registro
- Campos ambiguos "auto IA"

### 3.2 Reglas/Umbrales

```typescript
const THRESHOLDS = {
  sleep: {
    low: 7,           // <7h promedio
    poor_quality: 2   // calidad ≤2
  },
  hydration: {
    low: 1.5,         // <1.5L
    target: 2.0       // meta 2L
  },
  stress: {
    high: 7,          // ≥7/10
    prolonged: 3      // ≥3 días seguidos
  },
  pain: {
    high: 6,          // ≥6/10
    prolonged: 3      // ≥3 días seguidos
  },
  caffeine: {
    high: 4           // >4 tazas/día
  },
  alcohol: {
    high_daily: 3,    // ≥3 uds/día
    high_weekly: 7    // ≥7 uds/sem
  },
  cycle: {
    irregular_std: 4, // σ > 4 días
    luteal_short: 10, // <10 días
    luteal_long: 16   // >16 días
  },
  contraception: {
    adherence: 90     // <90% tomas/mes
  },
  activity: {
    low: 3,           // <3 días/sem
    target: 5         // meta ≥5/sem
  },
  weight: {
    change_3m: 5      // >5% en 3 meses
  }
};
```

### 3.3 Entregables por Tiempo

**Día:** 3-6 modales máximo
- Dolor/estrés/sueño/hidratación/actividad/menstruación/fertilidad
- Recomendaciones inmediatas

**Semana:**
- Tendencias simples
- Consistencia de registro
- Patrón de síntomas
- Cumplimiento de metas

**Mes:**
- Aparición de nuevos síntomas
- Impacto de consumos
- Adherencia anticonceptivo/medicación
- Días fértiles bien identificados

**Ciclo:**
- Calidad del ciclo (regularidad, lútea)
- Evidencia de ovulación (LH + T°/moco)
- Compatibilidad con actividad sexual

**6M:**
- Cambios significativos
- Correlaciones fuertes (top 5)
- Mejora/empeoramiento de KPIs

**Año:**
- Resumen curado con highlights trimestrales

### 3.4 Handoff a Chat

CTA "Chatear" al final:
- Colapsa todos los modales a un mensaje inicial
- Incluye: rango activo, filtros, secciones por tema (insight→evidencia→confianza→recomendaciones)
- Fuentes (ids de series)
- Botón "Volver a Insights" que restaura el layout

## 4. UX, Estados y Accesibilidad

### Controles
- Header sticky con hairline
- Exclusividad por grupo (radio buttons)
- Sin duplicados

### Estados
- Skeletons al cambiar de rango
- Toasts discretos al exportar/guardar/fijar
- Foco visible (--ring)
- Navegación por teclado
- Objetivos ≥44px
- Contraste AA en todo

### Filtros
- "Solo confirmados / Incluir predicciones"
- Selector de dominios (dolor/sueño/etc.)

## 5. Criterios de Aceptación (QA)

✅ Simple y IA muestran datos coherentes en Día/Semana/Mes/Ciclo/6M/Año
✅ Todos los campos del Registro Avanzado están cubiertos
✅ KPIs y gráficas se actualizan al cambiar vista/rango/filtros
✅ IA genera modales relevantes con confianza %, evidencia y recomendaciones
✅ Handoff a Chat produce un resumen limpio y contextual
✅ Marcadores confirmado/predicción/auto IA/ambiguo visibles
✅ Accesibilidad, contraste y micro-interacciones cumplen
✅ Exportaciones (CSV/PNG) incluyen nuevos campos y filtros

## 6. Plan de Implementación

### Fase 1: Ampliar Vistas Existentes
1. DailyInsightView: añadir menstruación detallada, fertilidad, badges
2. WeeklyInsightView: añadir gráficas 7d, patrones de adherencia
3. MonthlyInsightView: añadir calendario heat, distribuciones

### Fase 2: Crear Vistas Nuevas
4. CycleInsightView: análisis completo del ciclo
5. SixMonthInsightView: tendencias y correlaciones
6. YearInsightView: resumen anual

### Fase 3: Ampliar Sistema de IA
7. Actualizar categorías de insights en ai-insights.ts
8. Implementar umbrales y reglas
9. Crear modales dinámicos por categoría
10. Implementar handoff a chat mejorado

### Fase 4: Filtros y Exportación
11. Añadir filtros globales (confirmados/predicciones, dominios)
12. Actualizar exportaciones CSV/PNG con nuevos campos

### Fase 5: QA y Pulido
13. Verificar accesibilidad
14. Optimizar rendimiento
15. Pruebas de coherencia de datos
