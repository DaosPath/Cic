# Aura Ciclo

Aplicación React + Vite para registrar el ciclo menstrual y obtener insights asistidos por Gemini con enfoque en privacidad (modo discreto y datos locales vía IndexedDB).

## ¿Qué hace?
- Registro diario de síntomas, estado de ánimo, flujo, hábitos y métricas.
- Predicciones de fases del ciclo y ventana fértil.
- Insights y chat con IA a través de un endpoint backend `/api/gemini` (la API key no va al frontend).
- Modo discreto: reemplaza términos sensibles por palabras neutras en la UI.
- PWA lista para usarse offline.

## Scripts
- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — sirve el build para verificación local.
