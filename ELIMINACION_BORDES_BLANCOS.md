# Eliminación de Bordes Blancos en Chips

## ✅ Cambios Realizados

### Principio de Diseño
En lugar de usar bordes semi-transparentes (`border border-brand-primary/20`), ahora usamos fondos con mayor opacidad (`bg-brand-primary/20`) para mejor contraste y limpieza visual.

### WeeklyInsightView.tsx

#### 1. Banner - Chip "7 días"
**Antes:**
```tsx
<div className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
```

**Después:**
```tsx
<div className="px-3 py-1.5 bg-brand-primary/20 rounded-full">
```

#### 2. Desglose Diario - Badges
**Antes:**
```tsx
<span className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md font-medium border border-brand-primary/20">
  Dolor {day.pain}
</span>
<span className="text-xs px-2 py-1 bg-brand-accent/10 text-brand-accent rounded-md font-medium border border-brand-accent/20">
  {day.sleep}h
</span>
<span className="text-xs px-2 py-1 bg-[var(--surface-2)] text-[var(--text-2)] rounded-md font-medium border border-[#2a2a2a]">
  Sin registro
</span>
```

**Después:**
```tsx
<span className="text-xs px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-md font-medium">
  Dolor {day.pain}
</span>
<span className="text-xs px-2 py-1 bg-brand-accent/20 text-brand-accent rounded-md font-medium">
  {day.sleep}h
</span>
<span className="text-xs px-2 py-1 bg-[var(--surface-2)] text-[var(--text-2)] rounded-md font-medium">
  Sin registro
</span>
```

#### 3. Síntomas - Contador
**Antes:**
```tsx
<span className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full font-medium border border-brand-primary/20 tabular-nums">
  {symptom.count}
</span>
```

**Después:**
```tsx
<span className="text-xs px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-full font-medium tabular-nums">
  {symptom.count}
</span>
```

#### 4. Tendencias de Consumo - Tarjetas internas
**Antes:**
```tsx
<div className="text-center p-3 bg-[var(--surface-2)] rounded-lg border border-[#2a2a2a]">
```

**Después:**
```tsx
<div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
```

#### 5. Antojos
**Antes:**
```tsx
<span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded text-xs border border-brand-accent/20">
```

**Después:**
```tsx
<span className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent rounded text-xs">
```

#### 6. Patrones - Badge de confianza
**Antes:**
```tsx
<div className="px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md border border-brand-primary/20">
  <span className="text-xs font-medium">Alta confianza</span>
</div>
```

**Después:**
```tsx
<div className="px-2 py-1 bg-brand-primary/20 text-brand-primary rounded-md">
  <span className="text-xs font-medium">Alta confianza</span>
</div>
```

### MonthlyInsightView.tsx

#### 1. Banner - Chip días del mes
**Antes:**
```tsx
<div className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
```

**Después:**
```tsx
<div className="px-3 py-1.5 bg-brand-primary/20 rounded-full">
```

#### 2. Dolor y Estrés - Badges
**Antes:**
```tsx
<span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-medium border border-red-500/20">
  {stats.painDays} días
</span>
<span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-xs font-medium border border-amber-500/20">
  {stats.highStressDays} días alto
</span>
```

**Después:**
```tsx
<span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
  {stats.painDays} días
</span>
<span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
  {stats.highStressDays} días alto
</span>
```

#### 3. Energía - Pills
**Antes:**
```tsx
<div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
<div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
<div className="px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
```

**Después:**
```tsx
<div className="px-3 py-2 bg-red-500/20 rounded-lg text-center">
<div className="px-3 py-2 bg-amber-500/20 rounded-lg text-center">
<div className="px-3 py-2 bg-green-500/20 rounded-lg text-center">
```

#### 4. Insights - Tags
**Antes:**
```tsx
<span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs font-medium border border-green-500/20">
  Hábitos
</span>
<span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs font-medium border border-purple-500/20">
  Registro
</span>
<span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-medium border border-red-500/20">
  Médico
</span>
```

**Después:**
```tsx
<span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
  Hábitos
</span>
<span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
  Registro
</span>
<span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
  Médico
</span>
```

#### 5. Badge de confianza
**Antes:**
```tsx
<div className="px-2.5 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
```

**Después:**
```tsx
<div className="px-2.5 py-1 bg-brand-primary/20 rounded-full">
```

#### 6. Ciclos - Badge de duración
**Antes:**
```tsx
<span className="text-xs px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded border border-brand-primary/20">
```

**Después:**
```tsx
<span className="text-xs px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded">
```

## 🎨 Mejoras Visuales

### Antes
- Bordes semi-transparentes creaban líneas blancas/grises visibles
- Opacidad de fondo baja (10%) hacía que los chips fueran poco visibles
- Doble capa visual (fondo + borde) creaba ruido

### Después
- Sin bordes, diseño más limpio
- Opacidad de fondo aumentada (20%) para mejor contraste
- Una sola capa visual, más minimalista
- Mejor legibilidad del texto sobre el fondo

## 📊 Cambios Numéricos

### Opacidad de Fondos
- `bg-brand-primary/10` → `bg-brand-primary/20` (+100% opacidad)
- `bg-brand-accent/10` → `bg-brand-accent/20` (+100% opacidad)
- `bg-red-500/10` → `bg-red-500/20` (+100% opacidad)
- `bg-amber-500/10` → `bg-amber-500/20` (+100% opacidad)
- `bg-green-500/10` → `bg-green-500/20` (+100% opacidad)
- `bg-purple-500/10` → `bg-purple-500/20` (+100% opacidad)

### Elementos Eliminados
- Todos los `border border-brand-primary/20`
- Todos los `border border-brand-accent/20`
- Todos los `border border-red-500/20`
- Todos los `border border-amber-500/20`
- Todos los `border border-green-500/20`
- Todos los `border border-purple-500/20`
- Bordes internos `border border-[#2a2a2a]` en tarjetas anidadas

## ✅ Resultado Final

- Diseño más limpio y minimalista
- Mejor contraste y legibilidad
- Consistencia visual en todas las vistas
- Sin bordes blancos/grises que distraigan
- Fondos con opacidad suficiente para destacar sin ser intrusivos

## 📝 Notas

- Los bordes principales de las tarjetas grandes (`border-[#2a2a2a]`) se mantienen para definir las secciones
- Solo se eliminaron los bordes de chips, badges y elementos pequeños
- La opacidad 20% proporciona el balance perfecto entre visibilidad y sutileza
