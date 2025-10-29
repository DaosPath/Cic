# Ejemplo de Uso del Sistema de Análisis con IA

## Escenario: Usuario con 6 meses de datos

### Datos del Usuario
- 6 ciclos registrados
- Duración promedio: 28 días
- Variabilidad: ±2 días
- Dolor menstrual: 6/10 promedio
- Sueño: 6.5 horas promedio
- Estrés: 7/10 promedio
- Actividad física: 3 días/semana

## Flujo de Uso

### 1. Usuario Abre la Página de Análisis

```
┌─────────────────────────────────────────┐
│  Análisis de Ciclos                     │
│  Descubre patrones y tendencias...      │
│                                          │
│  ┌──────────┬──────────┐                │
│  │  Simple  │    IA    │  ← Toggle      │
│  └──────────┴──────────┘                │
└─────────────────────────────────────────┘
```

### 2. Selecciona Modo IA

El sistema genera automáticamente 8 insights:

```
🔴 Estrés Elevado Detectado
   Tu nivel promedio de estrés es 7.0/10...
   85% confianza | Últimos 180 días
   ───────────────────────────────────────

🟡 Sueño Subóptimo
   Duermes un promedio de 6.5 horas...
   80% confianza | Últimos 180 días
   ───────────────────────────────────────

🟡 Niveles de Dolor Elevados
   Registraste dolor en 45% de los días...
   75% confianza | Últimos 180 días
   ───────────────────────────────────────

🟢 Ciclo Regular Detectado
   Tu ciclo es muy regular con ±2 días...
   90% confianza | Últimos 6 ciclos
   ───────────────────────────────────────

🟢 Correlación: Sueño y Estado de Ánimo
   En 65% de los casos, dormir menos...
   70% confianza | Últimos 180 días
   ───────────────────────────────────────

🟢 Buena Hidratación
   Bebes un promedio de 2.1L al día...
   75% confianza | Últimos 180 días
   ───────────────────────────────────────

🟢 Patrón de Energía Variable
   40% de los días reportaste energía baja...
   65% confianza | Últimos 180 días
   ───────────────────────────────────────

🟢 Buen Nivel de Actividad
   Hiciste ejercicio en 43% de los días...
   70% confianza | Últimos 180 días
   ───────────────────────────────────────

┌─────────────────────────────────────────┐
│  💬 Chatear sobre estos insights        │
└─────────────────────────────────────────┘
```

### 3. Usuario Click en "Estrés Elevado"

Modal se abre con detalles:

```
┌─────────────────────────────────────────┐
│  🔴 Estrés Elevado Detectado        [X] │
│                                          │
│  El estrés crónico puede afectar tu     │
│  ciclo menstrual, sueño y salud...      │
├─────────────────────────────────────────┤
│                                          │
│  📊 Insight Principal                    │
│  ┌─────────────────────────────────────┐│
│  │ Tu nivel promedio de estrés es      ││
│  │ 7.0/10. 60% de los días registraste ││
│  │ estrés alto (≥7).                   ││
│  └─────────────────────────────────────┘│
│                                          │
│  📈 Evidencia                            │
│  Últimos 180 días | 85% confianza       │
│  ┌─────────────────────────────────────┐│
│  │ ▂▄▆█▇▅▃▆▇█ (mini gráfico)          ││
│  │ 180 días registrados, 108 con       ││
│  │ estrés alto                         ││
│  └─────────────────────────────────────┘│
│                                          │
│  💡 Recomendaciones                      │
│  ┌─────────────────────────────────────┐│
│  │ 🌱 Practica técnicas de relajación  ││
│  │    diarias (meditación, respiración)││
│  │    Estilo de vida                   ││
│  ├─────────────────────────────────────┤│
│  │ 🏥 Considera terapia o counseling   ││
│  │    profesional                      ││
│  │    Médico                           ││
│  ├─────────────────────────────────────┤│
│  │ 📝 Identifica y aborda los          ││
│  │    detonantes principales           ││
│  │    Hábito                           ││
│  └─────────────────────────────────────┘│
│                                          │
│  Ver 2 más ▼                            │
├─────────────────────────────────────────┤
│  [💾 Guardar] [📌 Fijar] [ℹ️ Ver más]  │
│  [🗑️ Descartar]                         │
└─────────────────────────────────────────┘
```

### 4. Usuario Guarda el Insight

- Click en "Guardar"
- Insight se añade a guardados
- Persiste en localStorage
- Modal se cierra

### 5. Usuario Click en "Chatear"

Animación de transición y se abre el chat:

```
┌─────────────────────────────────────────┐
│  Chat de Análisis                   [←] │
│  Conversa sobre tus insights...         │
├─────────────────────────────────────────┤
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ # Análisis de tu Ciclo Menstrual   ││
│  │ **Período:** Últimos 6 meses        ││
│  │ **Filtros:** Solo datos confirmados ││
│  │                                     ││
│  │ ## 🧘 Estrés y Bienestar            ││
│  │ ### Estrés Elevado Detectado        ││
│  │ **Insight:** Tu nivel promedio...   ││
│  │ **Evidencia:** 180 días, 108 alto   ││
│  │ **Confianza:** 85%                  ││
│  │ **Recomendaciones:**                ││
│  │ - 🌱 Practica técnicas...           ││
│  │ - 🏥 Considera terapia...           ││
│  │                                     ││
│  │ ## 😴 Sueño                         ││
│  │ ### Sueño Subóptimo                 ││
│  │ ...                                 ││
│  │                                     ││
│  │ ## 📈 Resumen de Métricas           ││
│  │ | Métrica | Valor | Estado |        ││
│  │ |---------|-------|--------|        ││
│  │ | Variabilidad | ±2 días | ✅ |    ││
│  │ | Dolor | 6.0/10 | ⚠️ |            ││
│  │ | Sueño | 6.5h | ⚠️ |              ││
│  │ | Estrés | 7.0/10 | ❌ |           ││
│  │                                     ││
│  │ ## 💬 Preguntas Sugeridas           ││
│  │ - ¿Qué técnicas de manejo del      ││
│  │   estrés me recomiendas?            ││
│  │ - ¿Cómo afecta el sueño a mi       ││
│  │   ciclo menstrual?                  ││
│  │ - ¿Debería consultar con un        ││
│  │   médico sobre estos patrones?      ││
│  └─────────────────────────────────────┘│
│                                          │
├─────────────────────────────────────────┤
│  [Pregunta sobre tus insights...] [📤] │
└─────────────────────────────────────────┘
```

### 6. Usuario Hace una Pregunta

```
Usuario: "¿Qué técnicas de manejo del estrés me recomiendas?"

┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐│
│  │ ¿Qué técnicas de manejo del estrés ││
│  │ me recomiendas?                     ││
│  │                            14:32    ││
│  └─────────────────────────────────────┘│
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ Basándome en tus datos, te          ││
│  │ recomiendo estas técnicas:          ││
│  │                                     ││
│  │ **Técnicas de Respiración**         ││
│  │ - Respiración 4-7-8 (inhala 4s,    ││
│  │   retén 7s, exhala 8s)              ││
│  │ - Practica 3 veces al día           ││
│  │                                     ││
│  │ **Meditación**                      ││
│  │ - Empieza con 5 minutos diarios     ││
│  │ - Apps: Headspace, Calm             ││
│  │                                     ││
│  │ **Actividad Física**                ││
│  │ - Yoga suave 20 min/día             ││
│  │ - Caminatas en naturaleza           ││
│  │                                     ││
│  │ **Journaling**                      ││
│  │ - Escribe 10 min antes de dormir   ││
│  │ - Identifica detonantes             ││
│  │                                     ││
│  │ ¿Quieres que profundice en alguna  ││
│  │ de estas técnicas?                  ││
│  │                            14:32    ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 7. Usuario Continúa la Conversación

```
Usuario: "Sí, cuéntame más sobre la respiración 4-7-8"

Asistente: "La técnica 4-7-8 es excelente para reducir
el estrés rápidamente. Aquí está el paso a paso:

**Cómo Hacerlo:**
1. Siéntate cómodamente con la espalda recta
2. Coloca la punta de la lengua detrás de los dientes
3. Exhala completamente por la boca
4. Cierra la boca e inhala por la nariz contando 4
5. Retén la respiración contando 7
6. Exhala completamente por la boca contando 8
7. Repite el ciclo 3-4 veces

**Cuándo Usarla:**
- Al despertar para empezar el día calmada
- Antes de dormir para relajarte
- Cuando sientas ansiedad o estrés
- Durante tu periodo si tienes dolor

**Beneficios:**
- Reduce cortisol (hormona del estrés)
- Mejora calidad del sueño
- Puede reducir dolor menstrual
- Regula sistema nervioso

Basándome en tus datos, practicar esto 3 veces
al día podría ayudarte a bajar tu nivel de estrés
de 7/10 a 5/10 en 2-3 semanas.

¿Te gustaría que te sugiera una rutina completa?"
```

### 8. Usuario Vuelve a Insights

- Click en "← Volver a Insights"
- Animación de transición
- Regresa a lista de insights
- Insights guardados persisten

## Casos de Uso Adicionales

### Caso 1: Usuario con Dolor Alto

**Insights Generados:**
- 🔴 Niveles de Dolor Elevados (prioridad 8)
- 🟡 Correlación: Dolor × Fase Menstrual
- 🟢 Recomendaciones de Manejo del Dolor

**Recomendaciones:**
- 🏥 Consultar con ginecólogo
- 🌱 Aplicar calor local
- 📝 Registrar ubicación y duración del dolor

### Caso 2: Usuario Buscando Embarazo

**Insights Generados:**
- 🟢 Ventana Fértil Estimada
- 🟡 Regularidad del Ciclo
- 🟢 Recomendaciones de Fertilidad

**Recomendaciones:**
- 📝 Monitorear temperatura basal
- 🌱 Usar tests de ovulación
- 🏥 Consultar especialista si >6 meses

### Caso 3: Usuario con Ciclo Irregular

**Insights Generados:**
- 🔴 Variabilidad en el Ciclo (prioridad 9)
- 🟡 Factores que Afectan Regularidad
- 🟢 Recomendaciones de Estilo de Vida

**Recomendaciones:**
- 📝 Registrar factores de estrés
- 🌱 Mantener horarios regulares
- 🏥 Considerar consulta si variación >7 días

## Métricas de Éxito

### Para el Usuario
- ✅ Comprende sus patrones en < 2 minutos
- ✅ Recibe recomendaciones accionables
- ✅ Puede hacer preguntas específicas
- ✅ Guarda insights importantes
- ✅ Exporta datos para médico

### Para el Sistema
- ✅ Genera insights en < 500ms
- ✅ 85%+ de confianza promedio
- ✅ 0 errores de cálculo
- ✅ 100% responsive
- ✅ Accesible con teclado

## Feedback del Usuario

> "Me encanta poder ver todos mis patrones de forma clara.
> El chat me ayuda a entender qué significan los números."
> - Usuario Beta, 28 años

> "Las recomendaciones son muy útiles. Guardé varios
> insights para mostrarle a mi doctora."
> - Usuario Beta, 34 años

> "El modo simple es perfecto para ver rápido mis KPIs,
> y el modo IA cuando quiero profundizar."
> - Usuario Beta, 25 años
