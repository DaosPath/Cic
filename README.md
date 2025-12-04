<div align="center">
  <img width="1200" height="475" alt="Aura Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Aura Ciclo — Seguimiento menstrual con IA y privacidad

Aplicación React + Vite para registrar el ciclo, obtener insights con Gemini y mantener la privacidad (modo discreto, datos locales e IndexedDB). Incluye PWA y endpoint backend `/api/gemini` para no exponer la API key.

## Requisitos
- Node.js
- (Opcional) Vercel CLI si quieres correr UI + API en local con `vercel dev`.

## Instalación y entorno
1. Instala dependencias: `npm install`
2. Copia `.env.example` a `.env.local` (o `.env`) y define:
   - `GEMINI_API_KEY` (solo backend)
   - `GEMINI_MODEL` (opcional, p. ej. `gemini-2.5-flash`)
   - `VITE_GEMINI_ENDPOINT` (opcional, por defecto `/api/gemini`)

## Desarrollo
- UI + API en local (recomendado): `vercel dev`
- Solo UI (sin API local): `npm run dev` y apunta `VITE_GEMINI_ENDPOINT` a una API ya desplegada.

## Producción
1. Despliega (p. ej. en Vercel) y configura variables de entorno en el panel del proyecto.
2. Build: `npm run build`
3. Preview local del build: `npm run preview`

## Scripts útiles
- `npm run dev` — servidor de desarrollo Vite.
- `npm run build` — build de producción.
- `npm run preview` — sirve el build para verificarlo localmente.
