<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_1_oQbPaiR6jhQRiPumC0zNmvCgut98c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` (or `.env`) and set `GEMINI_API_KEY` (used only on the backend). Override `GEMINI_MODEL` if you want a different Gemini model. Optionally set `VITE_GEMINI_ENDPOINT` if you want the frontend to call a deployed API (defaults to `/api/gemini`).
3. Run locally with AI enabled: `vercel dev` (needs Vercel CLI) so the `/api/gemini` route is available. If you only run `npm run dev`, AI calls will 404 unless `VITE_GEMINI_ENDPOINT` points to a deployed API.
4. Run the app UI: `npm run dev` (or just use `vercel dev` to have both UI and API). 
