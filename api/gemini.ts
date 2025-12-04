import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!API_KEY) {
    res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    return;
  }

  const { prompt, contents, config, model } = req.body || {};
  const input = contents ?? prompt;

  if (!input) {
    res.status(400).json({ error: "Missing prompt/contents" });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: model || DEFAULT_MODEL,
      contents: input,
      config: config || { temperature: 0.7 },
    });

    const text = typeof response.text === "string" ? response.text.trim() : "";
    res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error?.message || "Unexpected error" });
  }
}
