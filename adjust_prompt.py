# -*- coding: utf-8 -*-
from pathlib import Path
import re
path = Path('services/ai-log-parser.ts')
text = path.read_text(encoding='utf-8')
pattern = r"const promptTemplates:[\s\S]+?};"
new_block = '''const promptTemplatesBase = {
  es: `Eres un asistente de salud menstrual que traduce descripciones del ciclo en datos estructurados. Lee el texto del usuario y responde con la información objetiva que encontrarás: intensidad del sangrado, color, consistencia y síntomas principales. Mantén el tono empático y responde solo con información de salud general.`,
  en: `You are a menstrual health assistant. Parse the user's diary-style description and extract structured data like flow intensity, color, consistency, and key symptoms. Stay empathetic and factual without giving medical diagnoses.`,
  tr: `Adet sagligi asistanisin ve kullanicinin günlügü gibi yazdigi ifadeyi analiz ederek akis yogunlugu, renk, kivam ve ana semptomlari çikaracaksin. Duyarli ama nesnel bir üslupla sadece genel bilgiler ver.`
};

const promptTemplates: Record<Language, string> = {
  ...promptTemplatesBase,
  auto: promptTemplatesBase.es,
};'''
if not re.search(pattern, text):
    raise SystemExit('pattern not found')
text = re.sub(pattern, new_block, text, count=1)
path.write_text(text, encoding='utf-8')
