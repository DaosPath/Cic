# Sistema de Tokens de Color por Fase del Ciclo

## Tokens Globales (CSS Variables)

### Colores Base (Dark Mode)
- `--bg`: #0B0D10 - Fondo principal
- `--surface`: #12151A - Superficies elevadas (tarjetas, modales)
- `--surface-2`: #1A1F28 - Superficies interactivas (hover states)
- `--text`: #E6E8EC - Texto principal
- `--text-2`: #A1A7B3 - Texto secundario
- `--border`: #232833 - Bordes y separadores

### Colores Dinámicos por Fase
- `--brand`: Color principal de la fase actual
- `--accent`: Color de acento complementario
- `--particle`: Color de partículas y efectos de halo
- `--ring`: Color de anillo de foco (basado en --brand con opacidad)

### Colores Semánticos
- `--positive`: #10B981 - Estados positivos/éxito
- `--warning`: #F59E0B - Advertencias

## Paletas por Fase del Ciclo

### Menstruación
```css
--brand: #E84D5B
--accent: #FF8A8A
--particle: #FFB3B3
```
Paleta cálida y energética con rojos suaves.

### Folicular (Pre-ovulación)
```css
--brand: #1FB6A6
--accent: #4FD1C5
--particle: #A7F3D0
```
Paleta fresca y renovadora con verdes azulados.

### Ovulación
```css
--brand: #10B981
--accent: #F5C84B
--particle: #FFE08A
```
Paleta vibrante con verdes y amarillos dorados.

### Lútea
```css
--brand: #F59E0B
--accent: #FDE68A
--particle: #FCD34D
```
Paleta cálida con naranjas y amarillos suaves.

## Uso en Tailwind

Los tokens están mapeados a clases de Tailwind:

```javascript
'brand-bg': 'var(--bg)',
'brand-surface': 'var(--surface)',
'brand-surface-2': 'var(--surface-2)',
'brand-text': 'var(--text)',
'brand-text-dim': 'var(--text-2)',
'brand-border': 'var(--border)',
'brand-primary': 'var(--brand)',
'brand-accent': 'var(--accent)',
'brand-particle': 'var(--particle)',
```

## Aplicación

### Navbar
- Hover: `text-brand-primary`
- Activo: `bg-brand-primary/20 text-brand-primary`

### Títulos
- Principal: `text-brand-primary`
- Secundario: `text-brand-text`

### CTAs (Botones)
- Primario: `bg-brand-primary hover:bg-brand-accent`
- Secundario: `border-brand-primary text-brand-primary`

### Iconografía
- Activa: `text-brand-primary`
- Inactiva: `text-brand-text-dim`

### Bordes y Separadores
- `border-brand-border`

### Anillo/Partículas del Héroe
- Gradiente: `--brand` → `--accent`
- Halo: `--particle`

## Transiciones

Todas las transiciones de color usan:
```css
transition-duration: 180ms;
transition-timing-function: ease;
```

## Accesibilidad

Todos los colores cumplen con contraste AA (WCAG 2.1):
- Texto sobre fondo: mínimo 4.5:1
- Texto grande sobre fondo: mínimo 3:1
- CTAs y elementos interactivos: mínimo 3:1


## Elementos de Formulario

### Textarea (Notas)
- Fondo: `var(--surface)` - Unificado con el dark theme
- Texto: `var(--text)` - Color principal
- Placeholder: `var(--text-2)` al 70% de opacidad
- Borde: 1px solid `var(--border)`
- Radio: 18px
- Padding: 16-20px

#### Estados
- **Default**: `background: var(--surface)`, `border: var(--border)`
- **Hover**: `background: var(--surface-2)` - Fondo ligeramente más claro
- **Focus**: 
  - `border-color: var(--brand)`
  - Anillo suave: `box-shadow: 0 0 0 3px rgba(brand, 0.2)`
  - El color del anillo cambia según la fase del ciclo

#### Scrollbar
- Track: Transparente
- Thumb: `var(--border)` con hover a `var(--text-2)`
- Estilo tenue y discreto

#### Prevención de Auto-relleno
- Webkit autofill mantiene `background: var(--surface)`
- `-webkit-text-fill-color: var(--text)`
- Sin blanqueo del navegador
