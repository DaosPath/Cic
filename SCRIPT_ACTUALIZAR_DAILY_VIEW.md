# Script para Actualizar DailyInsightView

## Patrón a Reemplazar en Tarjetas KPI

### Buscar:
```
className="col-span-6 md:col-span-4 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group" style={{ height: '96px', padding: '16px' }}
```

### Reemplazar con:
```
className="col-span-6 md:col-span-4 lg:col-span-3 border border-[#2a2a2a] rounded-[18px] shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-200 relative overflow-hidden group" 
style={{ 
  height: '96px', 
  padding: '16px',
  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
}}
```

## Cambios en Texto

### Buscar:
- `text-[var(--text)]` → `text-white`
- `text-[var(--text-2)]` → `text-[var(--text-2)]` (mantener)
- `text-brand-text` → `text-white`
- `text-brand-text-dim` → `text-[var(--text-2)]`

## Secciones Grandes

### Buscar:
```
className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-5 shadow-sm"
```

### Reemplazar con:
```
className="border border-[#2a2a2a] rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
style={{
  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)'
}}
```

## Nota
Debido a la cantidad de cambios (9 tarjetas KPI + múltiples secciones), se recomienda hacer los cambios manualmente o usar un editor con búsqueda y reemplazo regex.
