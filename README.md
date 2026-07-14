# Aura Ciclo

Aplicación React + Vite para el seguimiento personal del ciclo menstrual, con identidad **Aura Living Cycle**: serena, privada y optimizada para móvil y escritorio.

## ¿Qué hace?
- Registro diario de síntomas, estado de ánimo, flujo, hábitos y métricas (datos locales en IndexedDB).
- Estimaciones de fases y ventana fértil (etiquetadas como **estimadas**, no como hechos).
- Calendario con leyenda de datos registrados vs predicciones.
- Insights y chat con IA a través de `/api/gemini` (opcional; la app funciona sin backend).
- Modo discreto, i18n (es/en/tr), tema claro/oscuro/sistema.
- PWA con manifest y service worker.

## Scripts
- `npm run dev` — servidor de desarrollo (http://localhost:3000).
- `npm run build` — build de producción.
- `npm run preview` — sirve el build.
- `npm test` — pruebas de `cycle-logic` y forma de datos del log.

## Diseño
- Tokens: `styles/tokens.css` (también en `public/styles/`).
- Navegación: barra inferior (móvil) + sidebar colapsable (PC).
- Activos de marca en `public/assets/`.

## Privacidad
Los datos se guardan en el dispositivo. Ver `privacy.html`, `help.html` y `terms.html`.
