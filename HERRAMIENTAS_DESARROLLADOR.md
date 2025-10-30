# Herramientas de Desarrollador Mejoradas

## ✅ Mejoras Implementadas

### 1. Generador de Datos Mejorado

**Archivo**: `services/dev-data.ts`

#### Datos Más Realistas

El generador ahora crea registros mucho más completos y realistas:

**Campos generados:**
- ✅ **Menstruación**: Intensidad, color, coágulos, productos
- ✅ **Ánimo**: 1-5 (varía por fase del ciclo)
- ✅ **Energía**: Baja/Media/Alta (según fase)
- ✅ **Dolor**: 0-10 con ubicaciones
- ✅ **Estrés**: 0-10
- ✅ **Sueño**: Horas + calidad (1-5)
- ✅ **Hidratación**: 1.2-3.0L
- ✅ **Actividad física**: Tipo, duración, intensidad
- ✅ **Temperatura basal**: Solo en ovulación
- ✅ **Actividad sexual**: Booleano
- ✅ **Medicamentos**: Si hay dolor alto
- ✅ **Suplementos**: Aleatorios
- ✅ **Antojos**: Especialmente en fase lútea
- ✅ **Síntomas**: Basados en fase del ciclo
- ✅ **Notas**: Ocasionales y variadas

#### Síntomas por Fase

Los síntomas ahora son realistas según la fase:

**Menstruación:**
- Cólicos, fatiga, dolor de cabeza, dolor de espalda, náuseas, hinchazón, cambios de humor

**Folicular:**
- Acné, energía aumentada, piel clara

**Ovulación:**
- Hinchazón, sensibilidad en senos, aumento de libido, moco cervical

**Lútea:**
- Irritabilidad, hinchazón, fatiga, sensibilidad en senos, antojos, cambios de humor, acné, ansiedad

### 2. Nuevas Funciones de Generación

#### `generateLogsForDateRange(startDate, endDate)`
Genera registros para un rango de fechas específico con datos realistas.

**Uso:**
```typescript
const logs = generateLogsForDateRange(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);
```

#### `generateTodayLog()`
Genera un registro realista para el día de hoy.

**Uso:**
```typescript
const todayLog = generateTodayLog();
```

#### `fillMissingDays(existingLogs, startDate, endDate)`
Rellena los días faltantes en un rango sin sobrescribir datos existentes.

**Uso:**
```typescript
const newLogs = fillMissingDays(
  existingLogs,
  new Date('2025-01-01'),
  new Date('2025-01-31')
);
```

### 3. Nuevos Botones en Configuración

**Ubicación**: Página de Configuración → Herramientas de Desarrollador

#### 🟢 Generar Registro de Hoy
- Crea un registro completo para el día actual
- Útil para pruebas rápidas
- Datos realistas y variados

#### 🔵 Rellenar Últimos 7 Días
- Genera 7 días de registros
- Perfecto para probar vistas semanales
- Sobrescribe datos existentes

#### 🟣 Rellenar Últimos 30 Días
- Genera 30 días de registros
- Ideal para probar vistas mensuales
- Sobrescribe datos existentes

#### 🔴 Rellenar Días Faltantes (90d)
- Rellena solo los días sin registro en los últimos 90 días
- **No sobrescribe** datos existentes
- Perfecto para completar gaps en los datos

### 4. Mejoras en el Generador Original

**`generateDevData()`** ahora genera:
- 13 ciclos (1 año de datos)
- Registros mucho más completos
- Variación realista por fase del ciclo
- Datos coherentes (ej: medicamentos si hay dolor alto)

## 🎯 Casos de Uso

### Desarrollo de Nuevas Funciones

```typescript
// 1. Activar modo desarrollador (genera 1 año de datos)
// 2. Probar nueva función con datos completos
// 3. Si necesitas más datos recientes:
handleFillLast30Days();
```

### Testing de Vistas

```typescript
// Vista diaria
handleGenerateTodayLog();

// Vista semanal
handleFillLast7Days();

// Vista mensual
handleFillLast30Days();

// Vista de análisis (6 meses)
// Ya incluido en modo desarrollador
```

### Completar Datos de Prueba

```typescript
// Si tienes algunos datos pero faltan días
handleFillMissingDays();
// Rellena solo los gaps sin perder datos existentes
```

## 📊 Comparación: Antes vs Ahora

### Antes
```typescript
{
  id: "2025-01-15",
  date: "2025-01-15",
  periodIntensity: 2,
  symptoms: ["cramps", "fatigue"],
  medications: [],
  notes: "Un día de prueba generado automáticamente."
}
```

### Ahora
```typescript
{
  id: "2025-01-15",
  date: "2025-01-15",
  periodIntensity: 2,
  periodColor: "dark-red",
  hasClots: true,
  periodProducts: ["pad"],
  mood: 3,
  energyLevel: "low",
  painLevel: 6,
  painLocations: ["abdomen", "lower-back"],
  stressScore: 5,
  sleepHours: 7.2,
  sleepQuality: 4,
  waterIntake: 2.1,
  physicalActivity: "light",
  activityDuration: 30,
  activityType: ["walking"],
  symptoms: ["cramps", "fatigue", "headache", "bloating"],
  medications: [{ name: "Ibuprofeno", dose: "400mg" }],
  supplements: ["Magnesio"],
  cravings: [],
  notes: "Me sentí bien hoy, con buena energía.",
  // ... más campos
}
```

## 🛠️ Interfaz de Usuario

### Sección de Herramientas de Desarrollador

```
🛠️ Generación de Datos

[🟢 Generar Registro de Hoy]
[🔵 Rellenar Últimos 7 Días]
[🟣 Rellenar Últimos 30 Días]
[🔴 Rellenar Días Faltantes (90d)]
```

### Feedback al Usuario

Cada acción muestra un alert con el resultado:
- ✅ "Se generaron 7 registros para los últimos 7 días"
- ✅ "Registro de hoy generado correctamente"
- ✅ "Se rellenaron 15 días faltantes"
- ℹ️ "No hay días faltantes en los últimos 90 días"
- ❌ "Error al generar registros"

## 🔧 Implementación Técnica

### Funciones Helper

```typescript
const randomInt = (min: number, max: number) => number;
const randomFloat = (min: number, max: number) => number;
const randomChoice = <T>(arr: T[]) => T;
const randomBool = (probability: number) => boolean;
```

### Pools de Datos

```typescript
const symptomsByPhase = {
  menstruation: [...],
  follicular: [...],
  ovulation: [...],
  luteal: [...]
};

const activityTypes = ['light', 'moderate', 'intense'];
const energyLevels = ['low', 'medium', 'high'];
```

### Lógica de Fase

```typescript
let phase: 'menstruation' | 'follicular' | 'ovulation' | 'luteal';
if (day < 5) phase = 'menstruation';
else if (day < 13) phase = 'follicular';
else if (day < 17) phase = 'ovulation';
else phase = 'luteal';
```

## 📝 Archivos Modificados

### Nuevos
- ✅ `HERRAMIENTAS_DESARROLLADOR.md` - Esta documentación

### Modificados
- ✅ `services/dev-data.ts` - Generador mejorado + nuevas funciones
- ✅ `pages/SettingsPage.tsx` - Nuevos botones y handlers

## 🚀 Próximas Mejoras (Opcional)

### Generación Avanzada
1. **Generador de ciclos irregulares**
   - Simular PCOS, amenorrea, etc.
   - Útil para testing de edge cases

2. **Generador de patrones específicos**
   - Alto dolor siempre en menstruación
   - Insomnio en fase lútea
   - Útil para testing de insights de IA

3. **Importar datos de ejemplo**
   - Perfiles predefinidos (regular, irregular, PCOS, etc.)
   - JSON con casos de prueba específicos

### UI Mejorada
1. **Modal de configuración**
   - Elegir rango de fechas personalizado
   - Seleccionar qué campos generar
   - Preview antes de generar

2. **Visualización de datos generados**
   - Mostrar resumen de lo generado
   - Opción de deshacer última generación

3. **Presets de datos**
   - "Ciclo regular perfecto"
   - "Ciclo irregular"
   - "Alto dolor menstrual"
   - "Datos mínimos"

## 💡 Tips de Uso

### Para Desarrollo
1. Activa modo desarrollador para 1 año de datos
2. Usa "Rellenar Últimos 7 Días" para datos recientes
3. Prueba tu función
4. Desactiva modo desarrollador cuando termines

### Para Testing
1. Genera datos específicos según lo que pruebes
2. Usa "Rellenar Días Faltantes" para completar gaps
3. No uses "Rellenar Últimos X Días" si quieres preservar datos

### Para Demos
1. Activa modo desarrollador
2. Genera registro de hoy para mostrar funcionalidad actual
3. Los datos se ven realistas y profesionales

---

**Fecha de implementación**: 30 de octubre de 2025
**Versión**: 2.0
**Estado**: ✅ Completamente funcional
