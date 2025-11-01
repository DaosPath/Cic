# Script para Aplicar Fondo Negro a Todas las Tarjetas

## Patrón a Buscar
```
className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px]
```

## Reemplazar con
```
className="border border-[#2a2a2a] rounded-[18px]
```

Y añadir al style:
```javascript
style={{ 
  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
}}
```

## Archivos a Actualizar

### 1. components/DailyInsightView.tsx
- Banner del día (línea 58)
- Todas las tarjetas KPI (líneas 319, 355, 390, 425, 464, 497, 534, 569, 602)
- Síntomas detallados (línea 661)
- Métricas adicionales (líneas 785, 817, 855, 893)
- Medicamentos (línea 932)
- Pruebas y salud (línea 1020)
- Contexto (línea 1076)
- Notas (línea 1110)

### 2. components/WeeklyInsightView.tsx
- Todas las tarjetas con `bg-brand-surface`

### 3. components/MonthlyInsightView.tsx
- Todas las tarjetas con `bg-brand-surface-2`

### 4. pages/InsightsPage.tsx
- Tarjetas de análisis

## Comando de Reemplazo Manual

Para cada archivo, buscar:
```
bg-[var(--surface)]
```

Y reemplazar con el nuevo estilo de fondo negro.

## Colores por Fase del Ciclo

Los colores se aplican automáticamente mediante CSS variables:

### Menstruación
- `--brand: #E84D5B` (rojo)
- `--accent: #FF8A8A`
- `--particle: #FFB3B3`

### Folicular
- `--brand: #1FB6A6` (turquesa)
- `--accent: #4FD1C5`
- `--particle: #A7F3D0`

### Ovulación
- `--brand: #10B981` (verde)
- `--accent: #F5C84B` (amarillo)
- `--particle: #FFE08A`

### Lútea
- `--brand: #F59E0B` (naranja)
- `--accent: #FDE68A`
- `--particle: #FCD34D`

## Uso de Colores de Fase

En lugar de colores fijos como `purple-400`, usar:
- `text-brand-primary` para el color principal de la fase
- `text-brand-accent` para el color de acento
- `bg-brand-primary/20` para fondos con opacidad

Ejemplos:
```tsx
// Antes
<svg className="w-6 h-6 text-purple-400" />

// Después
<svg className="w-6 h-6 text-brand-primary" />
```

```tsx
// Antes
style={{ background: 'rgba(139, 92, 246, 0.2)' }}

// Después
className="bg-brand-primary/20"
```

## Sombras

Usar sombras negras consistentes:
```
shadow-[0_4px_16px_rgba(0,0,0,0.3)]
```

Para hover:
```
hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)]
```

## Bordes

Usar borde gris oscuro consistente:
```
border-[#2a2a2a]
```

## Gradiente de Fondo Negro

```javascript
background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
```

Este gradiente proporciona:
- Profundidad visual
- Transición suave de gris oscuro a negro
- Compatibilidad con el tema oscuro
- Contraste adecuado para texto blanco
