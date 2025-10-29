# Modos de Tiempo en Análisis de IA

## Descripción General

El sistema de análisis de IA ahora incluye 6 modos de tiempo diferentes, cada uno con su modal especializado que muestra información relevante para ese período específico.

## Modos Disponibles

### 1. 📅 Hoy (Día Actual)
**Modal:** `DailyInsightModal`

**Contenido:**
- Fecha completa con día de la semana
- Todas las métricas del día:
  - Menstruación (si aplica) con intensidad
  - Estado de ánimo (0-10 con barra de progreso)
  - Nivel de energía (Baja/Media/Alta)
  - Dolor (0-10 con barra de progreso)
  - Estrés (0-10 con barra de progreso)
  - Sueño (horas + calidad)
  - Hidratación (litros)
  - Actividad física (tipo + duración)
  - Síntomas registrados
  - Notas personales

**Insight del Día:**
- Análisis automático basado en los datos del día
- Recomendaciones específicas según métricas
- Correlaciones detectadas (ej: sueño bajo + ánimo bajo)

**Estado Vacío:**
- Mensaje informativo si no hay registro
- Botón para cerrar

### 2. 📆 Semana (Últimos 7 días)
**Modal:** `WeeklyInsightModal`

**Contenido:**
- Rango de fechas de la semana
- **Métricas Clave:**
  - Sueño promedio (con estado: bueno/warning/malo)
  - Dolor promedio
  - Estrés promedio
  - Hidratación promedio

- **Desglose Diario:**
  - Lista de los 7 días con:
    - Nombre del día y fecha
    - Emojis de ánimo y energía
    - Indicadores de dolor, sueño, actividad
    - "Sin registro" si no hay datos

- **Patrones de la Semana:**
  - Consistencia de registro
  - Análisis de sueño
  - Análisis de dolor
  - Análisis de estrés
  - Análisis de actividad física
  - Análisis de hidratación

- **Resumen de Actividad:**
  - Días activos / 7
  - Barra de progreso visual

### 3. 🗓️ Mes (Últimos 30 días)
**Modal:** `MonthlyInsightModal`

**Contenido:**
- Nombre del mes y año
- Días registrados del mes

- **Tarjetas de Resumen:**
  - Días registrados (X/30 con porcentaje)
  - Sueño promedio
  - Días activos
  - Hidratación promedio

- **Ciclos del Mes:**
  - Lista de ciclos que iniciaron en el mes
  - Duración de cada ciclo
  - Fecha de inicio

- **Métricas de Salud:**
  - **Dolor y Estrés:**
    - Promedios con barras de progreso
    - Días con dolor
    - Días con estrés alto
  
  - **Ánimo y Energía:**
    - Ánimo promedio
    - Distribución de energía (Baja/Media/Alta)

- **Síntomas Más Frecuentes:**
  - Top 6 síntomas del mes
  - Frecuencia de cada uno
  - Barra de progreso visual

- **Insights del Mes:**
  - Análisis de consistencia
  - Análisis de ciclos
  - Análisis de sueño
  - Análisis de dolor
  - Análisis de estrés
  - Análisis de actividad
  - Análisis de energía

### 4. 🔄 Ciclo Actual
**Modal:** `CurrentCycleModal` (Por implementar)

**Contenido Planeado:**
- Día actual del ciclo
- Fase actual (menstruación/folicular/ovulación/lútea)
- Duración hasta ahora
- Predicción de duración total
- Síntomas por fase
- Comparación con ciclos anteriores
- Predicción de próxima menstruación
- Ventana fértil (si aplica)

### 5. 📊 6 Meses
**Modal:** Usa `AIInsightsList` con insights generados

**Contenido:**
- Lista de insights generados automáticamente
- Ordenados por prioridad
- Tipos de insights:
  - Regularidad del ciclo
  - Patrones de dolor
  - Patrones de estrés
  - Calidad de sueño
  - Niveles de energía
  - Correlaciones de síntomas
  - Hidratación
  - Actividad física

### 6. 📈 Año (12 meses)
**Modal:** Usa `AIInsightsList` con insights generados

**Contenido:**
- Similar a 6 meses pero con más datos
- Tendencias a largo plazo
- Cambios estacionales
- Evolución de métricas

## Selector de Tiempo

**Ubicación:** Debajo del toggle Simple/IA

**Diseño:**
- Botones horizontales con iconos
- Modo activo destacado con color primario
- Responsive: se ajusta en mobile

**Interacción:**
- Click en "Hoy", "Semana" o "Mes" abre modal especializado
- Click en "Ciclo", "6M" o "Año" cambia el rango de insights

## Flujo de Usuario

```
Usuario en modo IA
    ↓
Selecciona período de tiempo
    ↓
┌─────────────────────────────────────┐
│ Hoy / Semana / Mes                  │
│ → Abre modal especializado          │
│ → Muestra datos específicos         │
│ → Genera insights contextuales      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Ciclo / 6M / Año                    │
│ → Actualiza lista de insights       │
│ → Recalcula con nuevo rango         │
│ → Mantiene en vista de lista        │
└─────────────────────────────────────┘
```

## Características de los Modales

### Diseño Consistente
- Header con icono, título y botón cerrar
- Fondo con gradiente sutil
- Bordes redondeados (18px)
- Animaciones de entrada (fade-in + zoom-in)
- Scroll interno si el contenido es largo
- Footer con botón de cerrar

### Visualizaciones
- **Barras de progreso:** Para métricas 0-10
- **Tarjetas de métricas:** Con iconos y estados de color
- **Listas:** Para desglose diario/semanal
- **Grids:** Para organizar información
- **Badges:** Para etiquetas y contadores

### Estados de Color
- **Verde (good):** Métricas óptimas
- **Ámbar (warning):** Métricas aceptables
- **Rojo (bad):** Métricas preocupantes
- **Primario:** Valores neutros o destacados

### Insights Automáticos
Cada modal genera insights contextuales basados en:
- Valores de las métricas
- Comparación con rangos saludables
- Patrones detectados
- Correlaciones entre variables

## Implementación Técnica

### Archivos Creados

```
types/
  ai-time-modes.ts          # Tipos y configuración

components/
  DailyInsightModal.tsx     # Modal diario
  WeeklyInsightModal.tsx    # Modal semanal
  MonthlyInsightModal.tsx   # Modal mensual
```

### Integración en InsightsPage

```typescript
// Estado
const [aiTimeMode, setAiTimeMode] = useState<TimeMode>('week');
const [showDailyModal, setShowDailyModal] = useState(false);
const [showWeeklyModal, setShowWeeklyModal] = useState(false);
const [showMonthlyModal, setShowMonthlyModal] = useState(false);

// Selector
<button onClick={() => {
  setAiTimeMode('day');
  setShowDailyModal(true);
}}>
  📅 Hoy
</button>

// Modal
{showDailyModal && (
  <DailyInsightModal
    log={todayLog}
    onClose={() => setShowDailyModal(false)}
  />
)}
```

### Filtrado de Datos

```typescript
// Día
const todayLog = logs.find(l => l.date === format(new Date(), 'yyyy-MM-dd'));

// Semana
const weekLogs = logs.filter(l => {
  const logDate = parseISO(l.date);
  const weekAgo = subDays(new Date(), 6);
  return logDate >= weekAgo && logDate <= new Date();
});

// Mes
const monthLogs = logs.filter(l => {
  const logDate = parseISO(l.date);
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  return logDate >= monthStart && logDate <= monthEnd;
});
```

## Próximas Mejoras

### Corto Plazo
- [ ] Implementar `CurrentCycleModal`
- [ ] Añadir exportación de cada modal a PDF
- [ ] Añadir comparación con períodos anteriores
- [ ] Mejorar visualizaciones con gráficos

### Medio Plazo
- [ ] Añadir modo "Personalizado" con selector de fechas
- [ ] Implementar vista de comparación entre períodos
- [ ] Añadir predicciones basadas en tendencias
- [ ] Integrar con calendario para navegación

### Largo Plazo
- [ ] Machine learning para insights más precisos
- [ ] Detección automática de anomalías
- [ ] Recomendaciones personalizadas por período
- [ ] Integración con wearables para datos en tiempo real

## Ejemplos de Uso

### Caso 1: Usuario revisa su día
```
1. Abre Análisis → Modo IA
2. Click en "📅 Hoy"
3. Ve modal con todos sus datos del día
4. Lee insight: "Tu sueño fue insuficiente hoy..."
5. Cierra modal
```

### Caso 2: Usuario revisa su semana
```
1. Abre Análisis → Modo IA
2. Click en "📆 Semana"
3. Ve resumen de 7 días
4. Identifica patrón: dolor alto los primeros 3 días
5. Lee recomendaciones
6. Cierra modal
```

### Caso 3: Usuario revisa su mes
```
1. Abre Análisis → Modo IA
2. Click en "🗓️ Mes"
3. Ve que tuvo 2 ciclos este mes
4. Nota que su sueño promedio fue bajo
5. Ve top síntomas del mes
6. Lee insights y recomendaciones
7. Cierra modal
```

## Métricas de Éxito

- ✅ 6 modos de tiempo implementados
- ✅ 3 modales especializados funcionando
- ✅ Insights automáticos por período
- ✅ Diseño consistente y responsive
- ✅ Animaciones suaves
- ✅ Sin errores de compilación
- ⏳ Ciclo actual (pendiente)
- ⏳ Exportación a PDF (pendiente)

## Conclusión

El sistema de modos de tiempo proporciona una forma flexible y poderosa de analizar datos en diferentes escalas temporales. Cada modal está optimizado para mostrar la información más relevante para ese período específico, con insights automáticos y recomendaciones contextuales.
