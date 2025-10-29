# Sistema de Análisis con IA

## Descripción General

El sistema de análisis ahora cuenta con dos modos complementarios:

### 1. Análisis Simple
Métricas y gráficos estáticos tradicionales:
- KPIs (duración promedio, variabilidad, regularidad)
- Gráficos de duración de ciclos
- Heatmaps de síntomas por fase
- Correlaciones entre síntomas
- Historial de ciclos

### 2. Análisis de IA
Sistema dinámico de insights personalizados en tiempo real:
- Modales individuales por cada hallazgo/variable
- Insights generados automáticamente
- Recomendaciones accionables
- Nivel de confianza por insight
- Modo chat para explorar insights

## Características Principales

### Toggle de Modo
- **Ubicación**: Header de la página de Análisis
- **Persistencia**: Recuerda la última selección del usuario (localStorage)
- **Transición**: Animación suave entre modos

### Modales de IA

Cada modal incluye:

#### Header
- Icono de prioridad (🔴 alta, 🟡 media, 🟢 baja)
- Título del insight
- "Por qué importa" - contexto del hallazgo
- Botón de cerrar

#### Contenido
1. **Insight Principal**: Hallazgo en 1-2 frases
2. **Evidencia**: 
   - Mini-gráfico visual
   - Valores clave
   - Rango temporal
   - Nivel de confianza (%)
3. **Recomendaciones**:
   - Etiquetadas por categoría:
     - 📝 Hábitos
     - 🏥 Médico
     - 🌱 Estilo de vida
   - Expandibles (muestra 3, ver más para el resto)

#### Controles
- **Guardar**: Guarda el insight en Reporte
- **Fijar**: Marca como importante
- **Ver más**: Navega a vista detallada
- **Descartar**: Oculta el insight

### Tipos de Insights

El sistema genera insights para:

1. **Regularidad del Ciclo**
   - Variabilidad
   - Tendencias
   - Predicciones

2. **Cambios de Flujo**
   - Intensidad
   - Duración
   - Patrones

3. **Dolor y Estrés**
   - Picos de dolor
   - Niveles de estrés
   - Correlaciones

4. **Sueño y Energía**
   - Calidad del sueño
   - Patrones de energía
   - Impacto en el ciclo

5. **Adherencia Anticonceptivo**
   - Consistencia
   - Recordatorios

6. **Síntomas Emergentes**
   - Nuevos síntomas
   - Cambios en frecuencia

7. **Correlaciones**
   - Síntoma × Fase
   - Ánimo × Sueño
   - Otros patrones

8. **Fertilidad**
   - Temperatura basal
   - LH/Ovulación
   - Ventana fértil

9. **Hábitos**
   - Actividad física
   - Hidratación
   - Cafeína/Alcohol
   - Peso

### Dinámica en Tiempo Real

Los insights se recalculan automáticamente cuando:
- Se cambian filtros de fecha/rango
- Se añaden o editan registros
- Se alterna entre "solo confirmados" y "predicciones"

**Orden de Prioridad**: Los insights se ordenan por:
- Impacto en salud
- Novedad del hallazgo
- Nivel de confianza

**Prevención de Spam**: 
- Agrupa hallazgos similares
- Límite de insights mostrados simultáneamente
- Filtrado por relevancia

### Estados del Sistema

1. **Cargando**: Skeleton screens mientras se generan insights
2. **Vacío**: Mensaje cuando no hay suficientes datos
3. **Error**: Mensaje con opción de retry
4. **Éxito**: Lista de insights con animaciones

### Botón "Chatear"

**Ubicación**: CTA fijo al final de la lista de insights

**Funcionalidad**:
- Al pulsar: Animación que colapsa modales
- Transforma insights en hilo de chat
- Mensaje inicial estructurado con:
  - Encabezado (rango temporal, filtros)
  - Secciones por tema
  - Tabla de KPIs
  - Preguntas sugeridas

**Estructura del Mensaje Inicial**:

```markdown
# Análisis de tu Ciclo Menstrual
**Período analizado:** Últimos 6 meses
**Filtros activos:** Solo datos confirmados

---

## 📊 Regularidad del Ciclo
### Ciclo Regular Detectado
**Insight:** Tu ciclo es muy regular...
**Evidencia:** Promedio: 28 días...
**Confianza:** 85%
**Recomendaciones:**
- 📝 Mantén tu rutina actual...

## 🩹 Dolor y Molestias
...

## 📈 Resumen de Métricas Clave
| Métrica | Valor | Estado |
|---------|-------|--------|
| Variabilidad | ±2 días | ✅ Excelente |
...

## 💬 Preguntas Sugeridas
- ¿Qué factores pueden estar afectando...?
- ¿Cómo puedo reducir el dolor...?
...
```

### Modo Chat

**Características**:
- Interfaz conversacional
- Respuestas contextuales basadas en insights
- Referencias a datos específicos
- Sugerencias de preguntas
- Historial de conversación
- Botón "Volver a Insights"

**Capacidades del Chat**:
- Responde preguntas sobre patrones
- Explica correlaciones
- Sugiere acciones
- Proporciona contexto médico
- Recomienda cuándo consultar profesional

## Accesibilidad

- **Foco visible**: Todos los elementos interactivos
- **Navegación con teclado**: Tab, Enter, Escape
- **ARIA labels**: En modales y controles
- **Contrastes**: Cumple WCAG AA
- **Screen readers**: Anuncios de cambios de estado

## Rendimiento

- **Transiciones**: 150-200ms para fluidez
- **Scroll**: No bloqueante
- **Virtualización**: Para listas largas de modales
- **Lazy loading**: Insights bajo demanda
- **Debouncing**: En filtros y búsqueda

## Persistencia

- **Modo seleccionado**: localStorage
- **Insights guardados**: localStorage/backend
- **Insights fijados**: localStorage/backend
- **Historial de chat**: Sesión actual

## Integración

### Archivos Principales

```
pages/
  InsightsPage.tsx          # Página principal con toggle

components/
  AIInsightModal.tsx        # Modal individual de insight
  AIInsightsList.tsx        # Lista de insights con botón chat
  AIChat.tsx                # Componente de chat

services/
  ai-insights.ts            # Generación de insights
  ai-chat-formatter.ts      # Formateo de mensajes
```

### Flujo de Datos

1. Usuario selecciona modo IA
2. Sistema genera insights desde datos
3. Insights se ordenan por prioridad
4. Usuario explora modales
5. Usuario inicia chat
6. Sistema formatea insights en mensaje
7. Usuario conversa sobre insights
8. Sistema mantiene contexto

## Próximas Mejoras

- [ ] Integración con API de IA real (GPT-4, Claude)
- [ ] Exportar insights a PDF
- [ ] Compartir insights con médico
- [ ] Notificaciones de insights importantes
- [ ] Insights predictivos avanzados
- [ ] Comparación con población similar
- [ ] Recomendaciones personalizadas de productos
- [ ] Integración con wearables
