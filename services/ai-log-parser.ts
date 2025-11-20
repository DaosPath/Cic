import type { DailyLog, Language } from '../types.ts';

export interface AILogSuggestion {
  confidence: number; // 0-100
  suggestions: Partial<DailyLog>;
  ambiguousFields: string[]; // Fields that need user confirmation
  summary: string;
}

// Patrones multiidioma para detección
const patterns = {
  menstruation: {
    es: /menstruación|periodo|regla|sangrado|spotting/,
    en: /menstruation|period|bleeding|spotting/,
    tr: /adet|regl|kanama|lekelenme/
  },
  intensity: {
    spotting: {
      es: /spotting|manchado|muy\s+poco/,
      en: /spotting|very\s+light/,
      tr: /lekelenme|çok\s+az/
    },
    heavy: {
      es: /abundante|mucho|intens|pesad/,
      en: /heavy|abundant|intense/,
      tr: /bol|yoğun|şiddetli/
    },
    light: {
      es: /ligero|poco|leve/,
      en: /light|mild/,
      tr: /hafif|az/
    },
    medium: {
      es: /medio|normal|moderado/,
      en: /medium|normal|moderate/,
      tr: /orta|normal/
    }
  },
  color: {
    brightRed: {
      es: /rojo\s+vivo|rojo\s+brillante/,
      en: /bright\s+red/,
      tr: /parlak\s+kırmızı/
    },
    darkRed: {
      es: /rojo\s+oscuro/,
      en: /dark\s+red/,
      tr: /koyu\s+kırmızı/
    },
    brown: {
      es: /marrón|café/,
      en: /brown/,
      tr: /kahverengi/
    },
    pink: {
      es: /rosa|rosado/,
      en: /pink/,
      tr: /pembe/
    }
  }
};

/**
 * Parse user's natural language description and extract log data
 * This is a mock implementation - in production, this would call an AI API
 */
const promptTemplatesBase = {
  es: `Eres un asistente de salud menstrual que traduce descripciones del ciclo en datos estructurados. Lee el texto del usuario y responde con la informacion objetiva que encontraras: intensidad del sangrado, color, consistencia y sintomas principales. Manten el tono empatico y responde solo con informacion de salud general.`,
  en: `You are a menstrual health assistant. Parse the user's diary-style description and extract structured data like flow intensity, color, consistency, and key symptoms. Stay empathetic and factual without giving medical diagnoses.`,
  tr: `Adet sagligi asistanisin ve kullanicinin gunlugu gibi yazdigi ifadeyi analiz ederek akis yogunlugu, renk, kivam ve ana semptomlari cikaracaksin. Duyarli ama nesnel bir uslupla sadece genel bilgiler ver.`
};

const promptTemplates: Record<Language, string> = {
  ...promptTemplatesBase,
  auto: promptTemplatesBase.es,
};

export function buildAILogPrompt(description: string, language: Language = 'es'): string {
  const template = promptTemplates[language] ?? promptTemplates.es;
  return `${template}\n\nTexto: ${description.trim()}\n\nNecesito una respuesta estructurada para llenar el registro.`;
}

export async function parseLogDescription(description: string, language: Language = 'es'): Promise<AILogSuggestion> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerDesc = description.toLowerCase();
  const suggestions: Partial<DailyLog> = {
    symptoms: [],
    medications: [],
    painLocations: [],
    periodProducts: [],
    activityType: [],
    supplements: [],
    homeRemedies: [],
    cravings: [],
    stressTriggers: [],
    aiGenerated: true
  };
  const ambiguousFields: string[] = [];
  let confidence = 70;

  // ===== MENSTRUATION - Extended (Multiidioma) =====
  if (lowerDesc.match(patterns.menstruation[language])) {
    // Intensity
    if (lowerDesc.match(patterns.intensity.spotting[language])) {
      suggestions.periodIntensity = 1;
      confidence += 5;
    } else if (lowerDesc.match(patterns.intensity.heavy[language])) {
      suggestions.periodIntensity = 3;
      confidence += 5;
    } else if (lowerDesc.match(patterns.intensity.light[language])) {
      suggestions.periodIntensity = 2;
      confidence += 5;
    } else if (lowerDesc.match(patterns.intensity.medium[language])) {
      suggestions.periodIntensity = 2;
      confidence += 5;
    } else {
      suggestions.periodIntensity = 2;
      ambiguousFields.push('periodIntensity');
    }

    // Color
    if (lowerDesc.match(patterns.color.brightRed[language])) {
      suggestions.periodColor = 'bright-red';
      confidence += 3;
    } else if (lowerDesc.match(patterns.color.darkRed[language])) {
      suggestions.periodColor = 'dark-red';
      confidence += 3;
    } else if (lowerDesc.match(patterns.color.brown[language])) {
      suggestions.periodColor = 'brown';
      confidence += 3;
    } else if (lowerDesc.match(patterns.color.pink[language])) {
      suggestions.periodColor = 'pink';
      confidence += 3;
    }

    // Consistency (multiidioma)
    const consistencyPatterns = {
      watery: {
        es: /acuoso|líquido|aguado/,
        en: /watery|liquid/,
        tr: /sulu|akıcı/
      },
      thick: {
        es: /espeso|denso|grueso/,
        en: /thick|dense/,
        tr: /kalın|yoğun/
      }
    };
    
    if (lowerDesc.match(consistencyPatterns.watery[language])) {
      suggestions.periodConsistency = 'watery';
      confidence += 3;
    } else if (lowerDesc.match(consistencyPatterns.thick[language])) {
      suggestions.periodConsistency = 'thick';
      confidence += 3;
    }

    // Clots (multiidioma)
    const clotPatterns = {
      es: /coágulo|coagulo/,
      en: /clot|clots/,
      tr: /pıhtı/
    };
    
    if (lowerDesc.match(clotPatterns[language])) {
      suggestions.hasClots = true;
      suggestions.periodConsistency = 'clotty';
      confidence += 3;
    }

    // Products (multiidioma)
    const productPatterns = {
      pad: {
        es: /toalla|compresa|pad/,
        en: /pad|sanitary\s+pad/,
        tr: /ped|hijyenik\s+ped/
      },
      tampon: {
        es: /tampón|tampon/,
        en: /tampon/,
        tr: /tampon/
      },
      cup: {
        es: /copa\s+menstrual|copa/,
        en: /menstrual\s+cup|cup/,
        tr: /adet\s+kabı|fincan/
      },
      disc: {
        es: /disco\s+menstrual|disco/,
        en: /menstrual\s+disc|disc/,
        tr: /adet\s+diski|disk/
      }
    };
    
    if (lowerDesc.match(productPatterns.pad[language])) {
      suggestions.periodProducts?.push('pad');
      confidence += 2;
    }
    if (lowerDesc.match(productPatterns.tampon[language])) {
      suggestions.periodProducts?.push('tampon');
      confidence += 2;
    }
    if (lowerDesc.match(productPatterns.cup[language])) {
      suggestions.periodProducts?.push('cup');
      confidence += 2;
    }
    if (lowerDesc.match(productPatterns.disc[language])) {
      suggestions.periodProducts?.push('disc');
      confidence += 2;
    }

    // Product count
    const productCountMatch = lowerDesc.match(/(\d+)\s+(toalla|tampón|copa|cambio)/);
    if (productCountMatch) {
      suggestions.productCount = parseInt(productCountMatch[1]);
      confidence += 3;
    }

    // Leaks
    if (lowerDesc.match(/fuga|manch[oó]\s+la\s+ropa|se\s+pas[oó]/)) {
      suggestions.hasLeaks = true;
      confidence += 3;
    }

    // Start/End
    if (lowerDesc.match(/empez[oó]|inici[oó]|primer\s+día|me\s+baj[oó]/)) {
      suggestions.periodStartedToday = true;
      confidence += 4;
    }
    if (lowerDesc.match(/termin[oó]|acab[oó]|último\s+día|se\s+fue/)) {
      suggestions.periodEndedToday = true;
      confidence += 4;
    }
  }

  // ===== FERTILITY =====
  // Ovulation test
  if (lowerDesc.match(/test\s+ovulación|prueba\s+lh/)) {
    if (lowerDesc.match(/positiv/)) {
      suggestions.ovulationTest = 'positive';
      confidence += 5;
    } else if (lowerDesc.match(/negativ/)) {
      suggestions.ovulationTest = 'negative';
      confidence += 5;
    } else {
      suggestions.ovulationTest = 'unclear';
      ambiguousFields.push('ovulationTest');
    }
  }

  // Cervix position
  if (lowerDesc.match(/cérvix\s+alto|cuello\s+alto/)) {
    suggestions.cervixPosition = 'high';
    confidence += 4;
  } else if (lowerDesc.match(/cérvix\s+bajo|cuello\s+bajo/)) {
    suggestions.cervixPosition = 'low';
    confidence += 4;
  } else if (lowerDesc.match(/cérvix\s+medio|cuello\s+medio/)) {
    suggestions.cervixPosition = 'medium';
    confidence += 4;
  }

  // Cervix firmness
  if (lowerDesc.match(/cérvix\s+firme|cuello\s+firme|duro/)) {
    suggestions.cervixFirmness = 'firm';
    confidence += 3;
  } else if (lowerDesc.match(/cérvix\s+suave|cuello\s+suave|blando/)) {
    suggestions.cervixFirmness = 'soft';
    confidence += 3;
  }

  // Cervix opening
  if (lowerDesc.match(/cérvix\s+abierto|cuello\s+abierto/)) {
    suggestions.cervixOpening = 'open';
    confidence += 3;
  } else if (lowerDesc.match(/cérvix\s+cerrado|cuello\s+cerrado/)) {
    suggestions.cervixOpening = 'closed';
    confidence += 3;
  }

  // ===== PAIN - Extended =====
  const painMatch = lowerDesc.match(/dolor\s+(\d+)|escala\s+(\d+)|(\d+)\/10/);
  if (painMatch) {
    const painLevel = parseInt(painMatch[1] || painMatch[2] || painMatch[3]);
    suggestions.painLevel = Math.min(10, Math.max(0, painLevel));
    confidence += 5;
  } else if (lowerDesc.match(/dolor|duele/)) {
    suggestions.painLevel = 5;
    ambiguousFields.push('painLevel');
  }

  // Pain locations
  if (lowerDesc.match(/cólico|cólicos|vientre|abdomen/)) {
    suggestions.painLocations?.push('cramps');
    suggestions.pelvicPain = true;
    confidence += 3;
  }
  if (lowerDesc.match(/cabeza|cefalea/)) {
    suggestions.painLocations?.push('headache');
    suggestions.headache = true;
    confidence += 3;
  }
  if (lowerDesc.match(/migraña/)) {
    suggestions.painLocations?.push('headache');
    suggestions.migraine = true;
    if (lowerDesc.match(/aura/)) {
      suggestions.migraineWithAura = true;
    }
    confidence += 3;
  }
  if (lowerDesc.match(/espalda|lumbar/)) {
    suggestions.painLocations?.push('back');
    suggestions.backPain = true;
    confidence += 3;
  }
  if (lowerDesc.match(/senos|pechos|mamas/)) {
    suggestions.painLocations?.push('breasts');
    suggestions.breastTenderness = true;
    confidence += 3;
  }

  // ===== SYMPTOMS - Detailed =====
  // Gastro
  if (lowerDesc.match(/náusea|nausea|mareo/)) {
    suggestions.nausea = true;
    suggestions.symptoms?.push('nausea');
    confidence += 3;
  }
  if (lowerDesc.match(/vómito|vomit/)) {
    suggestions.vomiting = true;
    confidence += 3;
  }
  if (lowerDesc.match(/diarrea/)) {
    suggestions.diarrhea = true;
    confidence += 3;
  }
  if (lowerDesc.match(/estreñimiento|constipación/)) {
    suggestions.constipation = true;
    confidence += 3;
  }
  if (lowerDesc.match(/gases|flatulencia/)) {
    suggestions.gas = true;
    confidence += 3;
  }
  if (lowerDesc.match(/sin\s+apetito|poco\s+apetito/)) {
    suggestions.appetite = 'decreased';
    confidence += 3;
  } else if (lowerDesc.match(/mucho\s+apetito|más\s+apetito|hambre/)) {
    suggestions.appetite = 'increased';
    confidence += 3;
  }

  // Neuro
  if (lowerDesc.match(/mareo|vértigo/)) {
    suggestions.dizziness = true;
    confidence += 3;
  }
  if (lowerDesc.match(/brain\s+fog|niebla\s+mental|confus|concentr/)) {
    suggestions.brainFog = true;
    confidence += 3;
  }

  // Musculoskeletal
  if (lowerDesc.match(/tensión\s+muscular|músculos\s+tensos/)) {
    suggestions.muscleTension = true;
    confidence += 3;
  }

  // Breast/Skin
  if (lowerDesc.match(/senos\s+hinchados|pechos\s+hinchados/)) {
    suggestions.breastSwelling = true;
    confidence += 3;
  }
  if (lowerDesc.match(/acné|granos|espinillas/)) {
    suggestions.acne = true;
    confidence += 3;
  }

  // Urinary/Vaginal
  if (lowerDesc.match(/ardor\s+al\s+orinar|quemazón\s+orina/)) {
    suggestions.urinaryBurning = true;
    confidence += 3;
  }
  if (lowerDesc.match(/orino\s+mucho|frecuencia\s+urinaria/)) {
    suggestions.urinaryFrequency = true;
    confidence += 3;
  }
  if (lowerDesc.match(/picazón\s+vaginal|comezón\s+vaginal/)) {
    suggestions.vaginalItching = true;
    confidence += 3;
  }
  if (lowerDesc.match(/olor\s+vaginal|mal\s+olor/)) {
    suggestions.vaginalOdor = true;
    confidence += 3;
  }

  // Other
  if (lowerDesc.match(/hinchazón|hinchada|inflamada|bloating/)) {
    suggestions.bloating = true;
    suggestions.symptoms?.push('bloating');
    confidence += 3;
  }
  if (lowerDesc.match(/retención\s+de\s+líquidos|edema/)) {
    suggestions.waterRetention = true;
    confidence += 3;
  }

  // ===== MENTAL STATE & LIBIDO =====
  // Mood
  if (lowerDesc.match(/genial|excelente|feliz|bien|contenta|alegre/)) {
    suggestions.mood = 5;
    confidence += 5;
  } else if (lowerDesc.match(/mal|triste|deprimida|horrible|pésimo/)) {
    suggestions.mood = 1;
    confidence += 5;
  } else if (lowerDesc.match(/regular|normal|ok|neutral/)) {
    suggestions.mood = 3;
    confidence += 3;
  }

  // Mental states
  if (lowerDesc.match(/ansiosa|ansiedad|nerviosa/)) {
    suggestions.anxiety = true;
    confidence += 3;
  }
  if (lowerDesc.match(/triste|tristeza|deprimida/)) {
    suggestions.sadness = true;
    confidence += 3;
  }
  if (lowerDesc.match(/irritable|irritabilidad|molesta|enojada/)) {
    suggestions.irritability = true;
    suggestions.symptoms?.push('irritability');
    confidence += 3;
  }
  if (lowerDesc.match(/calmada|tranquila|serena/)) {
    suggestions.calmness = true;
    confidence += 3;
  }

  // Motivation
  if (lowerDesc.match(/sin\s+motivación|desmotivada/)) {
    suggestions.motivation = 'low';
    confidence += 3;
  } else if (lowerDesc.match(/muy\s+motivada|motivación\s+alta/)) {
    suggestions.motivation = 'high';
    confidence += 3;
  }

  // Libido
  if (lowerDesc.match(/libido\s+baja|sin\s+deseo\s+sexual/)) {
    suggestions.libido = 'low';
    confidence += 3;
  } else if (lowerDesc.match(/libido\s+alta|mucho\s+deseo\s+sexual/)) {
    suggestions.libido = 'high';
    confidence += 3;
  }

  // Stress
  const stressScoreMatch = lowerDesc.match(/estrés\s+(\d+)|estrés.*?(\d+)\/10/);
  if (stressScoreMatch) {
    suggestions.stressScore = parseInt(stressScoreMatch[1] || stressScoreMatch[2]);
    confidence += 5;
  }
  
  if (lowerDesc.match(/estresada|estrés alto|ansiosa|nerviosa/)) {
    suggestions.stressLevel = 'high';
    if (!suggestions.stressScore) suggestions.stressScore = 8;
    confidence += 4;
  } else if (lowerDesc.match(/relajada|tranquila|sin estrés/)) {
    suggestions.stressLevel = 'low';
    if (!suggestions.stressScore) suggestions.stressScore = 2;
    confidence += 4;
  } else if (lowerDesc.match(/estrés medio|algo estresada/)) {
    suggestions.stressLevel = 'medium';
    if (!suggestions.stressScore) suggestions.stressScore = 5;
    confidence += 4;
  }

  // Stress triggers
  if (lowerDesc.match(/estrés.*trabajo|trabajo.*estrés/)) {
    suggestions.stressTriggers?.push('work');
    confidence += 3;
  }
  if (lowerDesc.match(/estrés.*estudio|estudio.*estrés|examen/)) {
    suggestions.stressTriggers?.push('study');
    confidence += 3;
  }
  if (lowerDesc.match(/estrés.*relación|relación.*estrés|pareja/)) {
    suggestions.stressTriggers?.push('relationship');
    confidence += 3;
  }

  // Energy level
  if (lowerDesc.match(/cansada|agotada|sin energía|fatiga|exhausta/)) {
    suggestions.energyLevel = 'low';
    confidence += 4;
  } else if (lowerDesc.match(/energía alta|activa|enérgica|llena\s+de\s+energía/)) {
    suggestions.energyLevel = 'high';
    confidence += 4;
  } else if (lowerDesc.match(/energía normal|energía media/)) {
    suggestions.energyLevel = 'medium';
    confidence += 4;
  }

  // ===== SLEEP & HABITS =====
  // Sleep hours
  const sleepMatch = lowerDesc.match(/dormí\s+(\d+)\s+horas?|(\d+)\s+horas?\s+de\s+sueño/);
  if (sleepMatch) {
    const hours = parseInt(sleepMatch[1] || sleepMatch[2]);
    suggestions.sleepHours = Math.min(16, Math.max(0, hours));
    confidence += 5;
  }

  // Sleep quality
  if (lowerDesc.match(/dormí\s+mal|sueño\s+malo|mal\s+sueño/)) {
    suggestions.sleepQuality = 1;
    confidence += 4;
  } else if (lowerDesc.match(/dormí\s+bien|sueño\s+bueno|buen\s+sueño/)) {
    suggestions.sleepQuality = 4;
    confidence += 4;
  } else if (lowerDesc.match(/dormí\s+excelente|sueño\s+excelente/)) {
    suggestions.sleepQuality = 5;
    confidence += 4;
  }

  // Naps
  const napMatch = lowerDesc.match(/siesta\s+de\s+(\d+)\s+minutos?|(\d+)\s+min.*siesta/);
  if (napMatch) {
    suggestions.napMinutes = parseInt(napMatch[1] || napMatch[2]);
    confidence += 4;
  }

  // Water intake
  const waterMatch = lowerDesc.match(/(\d+\.?\d*)\s+litros?\s+de\s+agua|bebí\s+(\d+\.?\d*)\s+litros?/);
  if (waterMatch) {
    const liters = parseFloat(waterMatch[1] || waterMatch[2]);
    suggestions.waterIntake = Math.min(6, Math.max(0, liters));
    confidence += 4;
  }

  // Caffeine
  const caffeineMatch = lowerDesc.match(/(\d+)\s+tazas?\s+de\s+café|(\d+)\s+cafés?/);
  if (caffeineMatch) {
    suggestions.caffeineIntake = parseInt(caffeineMatch[1] || caffeineMatch[2]);
    confidence += 4;
  }

  // Alcohol
  const alcoholMatch = lowerDesc.match(/(\d+)\s+(copa|cerveza|vino|trago)/);
  if (alcoholMatch) {
    suggestions.alcoholIntake = parseInt(alcoholMatch[1]);
    confidence += 4;
  }

  // Cravings - detect both predefined and custom
  if (lowerDesc.match(/antojo.*dulce|dulce.*antojo|quiero\s+dulce/)) {
    suggestions.cravings?.push('sweet');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }
  if (lowerDesc.match(/antojo.*salado|salado.*antojo|quiero\s+salado/)) {
    suggestions.cravings?.push('salty');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }
  if (lowerDesc.match(/antojo.*chocolate|chocolate.*antojo|quiero\s+chocolate/)) {
    suggestions.cravings?.push('chocolate');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }
  if (lowerDesc.match(/antojo.*picante|picante.*antojo|quiero\s+picante/)) {
    suggestions.cravings?.push('spicy');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }
  if (lowerDesc.match(/antojo.*carbohidrato|pan|pasta|arroz/)) {
    suggestions.cravings?.push('carbs');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }
  if (lowerDesc.match(/antojo.*pizza|quiero\s+pizza/)) {
    suggestions.cravings?.push('Pizza');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }
  if (lowerDesc.match(/antojo.*helado|quiero\s+helado/)) {
    suggestions.cravings?.push('Helado');
    suggestions.symptoms?.push('cravings');
    confidence += 3;
  }

  // ===== PHYSICAL ACTIVITY & METRICS =====
  // Activity intensity
  if (lowerDesc.match(/ejercicio\s+intenso|entrenamiento\s+fuerte|hiit/)) {
    suggestions.physicalActivity = 'intense';
    confidence += 4;
  } else if (lowerDesc.match(/ejercicio\s+moderado|caminata\s+larga|trote/)) {
    suggestions.physicalActivity = 'moderate';
    confidence += 4;
  } else if (lowerDesc.match(/ejercicio\s+suave|yoga|estiramientos|pilates/)) {
    suggestions.physicalActivity = 'light';
    confidence += 4;
  } else if (lowerDesc.match(/sin\s+ejercicio|no\s+hice\s+ejercicio|sedentaria/)) {
    suggestions.physicalActivity = 'none';
    confidence += 4;
  }

  // Activity type - detect both predefined and custom
  if (lowerDesc.match(/camin[eé]|caminata/)) {
    suggestions.activityType?.push('walking');
    confidence += 3;
  }
  if (lowerDesc.match(/corr[íi]|running|trote/)) {
    suggestions.activityType?.push('running');
    confidence += 3;
  }
  if (lowerDesc.match(/pesas|fuerza|gym|gimnasio/)) {
    suggestions.activityType?.push('strength');
    confidence += 3;
  }
  if (lowerDesc.match(/yoga/)) {
    suggestions.activityType?.push('yoga');
    confidence += 3;
  }
  if (lowerDesc.match(/ciclismo|bici|bicicleta/)) {
    suggestions.activityType?.push('cycling');
    confidence += 3;
  }
  if (lowerDesc.match(/natación|nadar|piscina/)) {
    suggestions.activityType?.push('swimming');
    confidence += 3;
  }
  if (lowerDesc.match(/pilates/)) {
    suggestions.activityType?.push('Pilates');
    confidence += 3;
  }
  if (lowerDesc.match(/baile|bailar|danza/)) {
    suggestions.activityType?.push('Baile');
    confidence += 3;
  }

  // Activity duration
  const durationMatch = lowerDesc.match(/(\d+)\s+minutos?\s+de\s+ejercicio|ejercicio.*?(\d+)\s+min/);
  if (durationMatch) {
    suggestions.activityDuration = parseInt(durationMatch[1] || durationMatch[2]);
    confidence += 4;
  }

  // RPE intensity
  const rpeMatch = lowerDesc.match(/intensidad\s+(\d+)|rpe\s+(\d+)|esfuerzo\s+(\d+)/);
  if (rpeMatch) {
    const rpe = parseInt(rpeMatch[1] || rpeMatch[2] || rpeMatch[3]);
    suggestions.activityIntensity = Math.min(10, Math.max(1, rpe));
    confidence += 4;
  }

  // Steps
  const stepsMatch = lowerDesc.match(/(\d+)\s+pasos/);
  if (stepsMatch) {
    suggestions.steps = parseInt(stepsMatch[1]);
    confidence += 4;
  }

  // Heart rate
  const hrMatch = lowerDesc.match(/frecuencia.*?(\d+)|fc.*?(\d+)|(\d+)\s+bpm/);
  if (hrMatch) {
    suggestions.restingHeartRate = parseInt(hrMatch[1] || hrMatch[2] || hrMatch[3]);
    confidence += 4;
  }

  // Calories
  const caloriesMatch = lowerDesc.match(/(\d+)\s+calorías|quemé\s+(\d+)/);
  if (caloriesMatch) {
    suggestions.caloriesBurned = parseInt(caloriesMatch[1] || caloriesMatch[2]);
    confidence += 4;
  }

  // ===== MEDICATION & CARE =====
  // Medications
  const ibuprofenMatch = lowerDesc.match(/ibuprofeno\s+(\d+)|(\d+)\s*mg.*ibuprofeno/);
  if (ibuprofenMatch) {
    suggestions.medications?.push({ 
      name: 'Ibuprofeno', 
      dose: `${ibuprofenMatch[1] || ibuprofenMatch[2]}mg` 
    });
    confidence += 5;
  }

  const paracetamolMatch = lowerDesc.match(/paracetamol\s+(\d+)|(\d+)\s*mg.*paracetamol/);
  if (paracetamolMatch) {
    suggestions.medications?.push({ 
      name: 'Paracetamol', 
      dose: `${paracetamolMatch[1] || paracetamolMatch[2]}mg` 
    });
    confidence += 5;
  }

  // Supplements - detect both predefined and custom
  if (lowerDesc.match(/hierro|suplemento.*hierro/)) {
    suggestions.supplements?.push('iron');
    confidence += 3;
  }
  if (lowerDesc.match(/magnesio|suplemento.*magnesio/)) {
    suggestions.supplements?.push('magnesium');
    confidence += 3;
  }
  if (lowerDesc.match(/omega\s*3|aceite\s+de\s+pescado/)) {
    suggestions.supplements?.push('omega3');
    confidence += 3;
  }
  if (lowerDesc.match(/vitamina\s+d/)) {
    suggestions.supplements?.push('vitaminD');
    confidence += 3;
  }
  if (lowerDesc.match(/calcio/)) {
    suggestions.supplements?.push('calcium');
    confidence += 3;
  }
  if (lowerDesc.match(/zinc/)) {
    suggestions.supplements?.push('zinc');
    confidence += 3;
  }
  if (lowerDesc.match(/vitamina\s+b12|b12/)) {
    suggestions.supplements?.push('Vitamina B12');
    confidence += 3;
  }
  if (lowerDesc.match(/colágeno/)) {
    suggestions.supplements?.push('Colágeno');
    confidence += 3;
  }

  // Contraception
  if (lowerDesc.match(/píldora|pastilla\s+anticonceptiva/)) {
    suggestions.contraception = 'Píldora anticonceptiva';
    const dayMatch = lowerDesc.match(/día\s+(\d+)/);
    if (dayMatch) {
      suggestions.contraceptionDay = parseInt(dayMatch[1]);
    }
    confidence += 4;
  }
  if (lowerDesc.match(/diu|dispositivo\s+intrauterino/)) {
    suggestions.hasIUD = true;
    confidence += 4;
  }

  // Home remedies - detect both predefined and custom
  if (lowerDesc.match(/bolsa\s+de\s+calor|almohadilla\s+térmica/)) {
    suggestions.homeRemedies?.push('heating-pad');
    confidence += 3;
  }
  if (lowerDesc.match(/compresa\s+fría|hielo/)) {
    suggestions.homeRemedies?.push('cold-compress');
    confidence += 3;
  }
  if (lowerDesc.match(/té|infusión/)) {
    suggestions.homeRemedies?.push('tea');
    confidence += 3;
  }
  if (lowerDesc.match(/baño\s+caliente|ducha\s+caliente/)) {
    suggestions.homeRemedies?.push('bath');
    confidence += 3;
  }
  if (lowerDesc.match(/masaje/)) {
    suggestions.homeRemedies?.push('massage');
    confidence += 3;
  }
  if (lowerDesc.match(/meditación|meditar/)) {
    suggestions.homeRemedies?.push('meditation');
    confidence += 3;
  }
  if (lowerDesc.match(/aromaterapia|aceites\s+esenciales/)) {
    suggestions.homeRemedies?.push('Aromaterapia');
    confidence += 3;
  }

  // ===== TESTS & HEALTH =====
  // Pregnancy test
  if (lowerDesc.match(/test\s+embarazo|prueba\s+embarazo/)) {
    if (lowerDesc.match(/positiv/)) {
      suggestions.pregnancyTest = 'positive';
      confidence += 5;
    } else if (lowerDesc.match(/negativ/)) {
      suggestions.pregnancyTest = 'negative';
      confidence += 5;
    }
  }

  // Cold/COVID
  if (lowerDesc.match(/resfriado|gripe|catarro/)) {
    suggestions.hasColdSymptoms = true;
    confidence += 3;
  }
  if (lowerDesc.match(/covid|coronavirus/)) {
    suggestions.hasCovidSymptoms = true;
    confidence += 3;
  }

  // Blood pressure
  const bpMatch = lowerDesc.match(/presión.*?(\d+)\/(\d+)|(\d+)\/(\d+).*presión/);
  if (bpMatch) {
    suggestions.bloodPressure = `${bpMatch[1] || bpMatch[3]}/${bpMatch[2] || bpMatch[4]}`;
    confidence += 5;
  }

  // Cervical fluid
  if (lowerDesc.match(/flujo\s+seco/)) {
    suggestions.cervicalFluid = 'dry';
    confidence += 4;
  } else if (lowerDesc.match(/flujo\s+pegajoso|flujo\s+sticky/)) {
    suggestions.cervicalFluid = 'sticky';
    confidence += 4;
  } else if (lowerDesc.match(/flujo\s+cremoso/)) {
    suggestions.cervicalFluid = 'creamy';
    confidence += 4;
  } else if (lowerDesc.match(/flujo\s+acuoso/)) {
    suggestions.cervicalFluid = 'watery';
    confidence += 4;
  } else if (lowerDesc.match(/flujo\s+elástico|clara\s+de\s+huevo/)) {
    suggestions.cervicalFluid = 'egg-white';
    confidence += 4;
  }

  // Temperature (basal)
  const tempMatch = lowerDesc.match(/temperatura\s+basal\s+(\d+\.?\d*)|(\d+\.?\d*)\s*°.*basal/);
  if (tempMatch) {
    const temp = parseFloat(tempMatch[1] || tempMatch[2]);
    if (temp >= 35 && temp <= 38) {
      suggestions.basalTemp = temp;
      confidence += 5;
    }
  }

  // Weight
  const weightMatch = lowerDesc.match(/peso\s+(\d+\.?\d*)\s*kg|(\d+\.?\d*)\s*kg/);
  if (weightMatch) {
    suggestions.weight = parseFloat(weightMatch[1] || weightMatch[2]);
    confidence += 5;
  }

  // ===== CONTEXT =====
  if (lowerDesc.match(/frío|hace\s+frío/)) {
    suggestions.weather = 'cold';
    confidence += 2;
  } else if (lowerDesc.match(/calor|hace\s+calor/)) {
    suggestions.weather = 'hot';
    confidence += 2;
  } else if (lowerDesc.match(/templado|clima\s+agradable/)) {
    suggestions.weather = 'mild';
    confidence += 2;
  }

  // Generate summary
  const summary = generateSummary(suggestions, description);

  // Generate formatted notes
  const formattedNotes = generateFormattedNotes(suggestions, description);
  if (formattedNotes) {
    suggestions.notes = formattedNotes;
  }

  return {
    confidence: Math.min(100, confidence),
    suggestions,
    ambiguousFields,
    summary
  };
}

function generateFormattedNotes(suggestions: Partial<DailyLog>, originalText: string): string {
  const sections: string[] = [];

  // Menstruation
  if (suggestions.periodIntensity && suggestions.periodIntensity > 0) {
    const intensity = ['', 'spotting', 'ligera', 'media', 'abundante'][suggestions.periodIntensity];
    let menstruationText = `🩸 Menstruación ${intensity}`;
    
    if (suggestions.periodColor) {
      const colors: Record<string, string> = {
        'bright-red': 'rojo vivo',
        'dark-red': 'rojo oscuro',
        'brown': 'marrón',
        'pink': 'rosa'
      };
      menstruationText += ` de color ${colors[suggestions.periodColor]}`;
    }
    
    if (suggestions.hasClots) {
      menstruationText += ', con coágulos';
    }
    
    if (suggestions.periodProducts && suggestions.periodProducts.length > 0) {
      const products: Record<string, string> = { pad: 'toallas', tampon: 'tampones', cup: 'copa', disc: 'disco' };
      menstruationText += `. Usé ${suggestions.periodProducts.map(p => products[p] || p).join(' y ')}`;
      if (suggestions.productCount) {
        menstruationText += ` (${suggestions.productCount} cambios)`;
      }
    }
    
    sections.push(menstruationText + '.');
  }

  // Pain
  if (suggestions.painLevel && suggestions.painLevel > 0) {
    let painText = `😣 Dolor nivel ${suggestions.painLevel}/10`;
    if (suggestions.painLocations && suggestions.painLocations.length > 0) {
      const locations: Record<string, string> = {
        cramps: 'cólicos',
        headache: 'dolor de cabeza',
        back: 'dolor de espalda',
        breasts: 'dolor en los senos'
      };
      painText += ` (${suggestions.painLocations.map(l => locations[l] || l).join(', ')})`;
    }
    if (suggestions.painDuration) {
      painText += `, duración: ${suggestions.painDuration}`;
    }
    sections.push(painText + '.');
  }

  // Mood & Mental State
  const mentalParts: string[] = [];
  if (suggestions.mood) {
    const moods = ['', 'muy mal', 'mal', 'regular', 'bien', 'muy bien'];
    mentalParts.push(`estado de ánimo ${moods[suggestions.mood]}`);
  }
  if (suggestions.anxiety) mentalParts.push('con ansiedad');
  if (suggestions.irritability) mentalParts.push('irritable');
  if (suggestions.sadness) mentalParts.push('triste');
  if (mentalParts.length > 0) {
    sections.push(`😊 Me sentí ${mentalParts.join(', ')}.`);
  }

  // Energy & Stress
  const energyParts: string[] = [];
  if (suggestions.energyLevel) {
    const energy = { low: 'baja', medium: 'media', high: 'alta' };
    energyParts.push(`energía ${energy[suggestions.energyLevel]}`);
  }
  if (suggestions.stressScore !== undefined) {
    energyParts.push(`estrés ${suggestions.stressScore}/10`);
    if (suggestions.stressTriggers && suggestions.stressTriggers.length > 0) {
      const triggers: Record<string, string> = { work: 'trabajo', study: 'estudio', relationship: 'relación', other: 'otros' };
      energyParts.push(`(por ${suggestions.stressTriggers.map(t => triggers[t] || t).join(', ')})`);
    }
  }
  if (energyParts.length > 0) {
    sections.push(`⚡ ${energyParts.join(', ')}.`);
  }

  // Sleep
  if (suggestions.sleepHours) {
    let sleepText = `😴 Dormí ${suggestions.sleepHours} horas`;
    if (suggestions.sleepQuality) {
      const quality = ['', 'muy mal', 'mal', 'regular', 'bien', 'excelente'];
      sleepText += `, calidad ${quality[suggestions.sleepQuality]}`;
    }
    if (suggestions.bedTime || suggestions.wakeTime) {
      sleepText += ` (${suggestions.bedTime || '?'} - ${suggestions.wakeTime || '?'})`;
    }
    sections.push(sleepText + '.');
  }

  // Physical Activity
  if (suggestions.physicalActivity && suggestions.physicalActivity !== 'none') {
    const activity = { light: 'suave', moderate: 'moderado', intense: 'intenso' };
    let activityText = `🏃 Ejercicio ${activity[suggestions.physicalActivity as keyof typeof activity]}`;
    
    if (suggestions.activityType && suggestions.activityType.length > 0) {
      const types: Record<string, string> = { walking: 'caminata', running: 'carrera', strength: 'fuerza', yoga: 'yoga', other: 'otro' };
      activityText += `: ${suggestions.activityType.map(t => types[t] || t).join(', ')}`;
    }
    
    if (suggestions.activityDuration) {
      activityText += ` (${suggestions.activityDuration} min`;
      if (suggestions.caloriesBurned) {
        activityText += `, ${suggestions.caloriesBurned} kcal`;
      }
      activityText += ')';
    }
    
    sections.push(activityText + '.');
  }

  // Habits
  const habitsParts: string[] = [];
  if (suggestions.waterIntake) {
    habitsParts.push(`${suggestions.waterIntake}L de agua`);
  }
  if (suggestions.caffeineIntake) {
    habitsParts.push(`${suggestions.caffeineIntake} café${suggestions.caffeineIntake > 1 ? 's' : ''}`);
  }
  if (suggestions.cravings && suggestions.cravings.length > 0) {
    const cravings: Record<string, string> = { sweet: 'dulce', salty: 'salado', chocolate: 'chocolate', other: 'otros' };
    habitsParts.push(`antojos de ${suggestions.cravings.map(c => cravings[c] || c).join(', ')}`);
  }
  if (habitsParts.length > 0) {
    sections.push(`💧 ${habitsParts.join(', ')}.`);
  }

  // Fertility
  if (suggestions.cervicalFluid || suggestions.ovulationTest) {
    let fertilityText = '🌸 Fertilidad:';
    const parts: string[] = [];
    
    if (suggestions.ovulationTest) {
      const test = { positive: 'test LH positivo', negative: 'test LH negativo', unclear: 'test LH indeterminado' };
      parts.push(test[suggestions.ovulationTest]);
    }
    
    if (suggestions.cervicalFluid) {
      const fluid: Record<string, string> = { dry: 'seco', sticky: 'pegajoso', creamy: 'cremoso', watery: 'acuoso', 'egg-white': 'clara de huevo' };
      parts.push(`flujo ${fluid[suggestions.cervicalFluid]}`);
    }
    
    if (parts.length > 0) {
      sections.push(`${fertilityText} ${parts.join(', ')}.`);
    }
  }

  // Medications
  if (suggestions.medications && suggestions.medications.length > 0) {
    const meds = suggestions.medications.map(m => `${m.name}${m.dose ? ` ${m.dose}` : ''}`).join(', ');
    sections.push(`💊 Medicamentos: ${meds}.`);
  }

  if (suggestions.supplements && suggestions.supplements.length > 0) {
    const supps: Record<string, string> = { iron: 'hierro', magnesium: 'magnesio', omega3: 'omega-3', vitaminD: 'vitamina D', other: 'otros' };
    sections.push(`💊 Suplementos: ${suggestions.supplements.map(s => supps[s] || s).join(', ')}.`);
  }

  // Health metrics
  const healthParts: string[] = [];
  if (suggestions.basalTemp) {
    healthParts.push(`temperatura ${suggestions.basalTemp}°C`);
  }
  if (suggestions.weight) {
    healthParts.push(`peso ${suggestions.weight}kg`);
  }
  if (healthParts.length > 0) {
    sections.push(`📊 ${healthParts.join(', ')}.`);
  }

  // Add original text context if sections are empty
  if (sections.length === 0) {
    return `📝 ${originalText}`;
  }

  return sections.join('\n\n');
}

function generateSummary(suggestions: Partial<DailyLog>, originalText: string): string {
  const parts: string[] = [];

  // Menstruation
  if (suggestions.periodIntensity && suggestions.periodIntensity > 0) {
    const intensity = ['', 'spotting', 'ligera', 'media', 'abundante'][suggestions.periodIntensity];
    let periodText = `Menstruación ${intensity}`;
    if (suggestions.periodColor) {
      const colors: Record<string, string> = {
        'bright-red': 'rojo vivo',
        'dark-red': 'rojo oscuro',
        'brown': 'marrón',
        'pink': 'rosa'
      };
      periodText += ` (${colors[suggestions.periodColor]})`;
    }
    parts.push(periodText);
    if (suggestions.hasClots) parts.push('con coágulos');
  }

  // Pain
  if (suggestions.painLevel) {
    parts.push(`Dolor ${suggestions.painLevel}/10`);
    if (suggestions.painLocations && suggestions.painLocations.length > 0) {
      const locations = suggestions.painLocations.map(l => {
        const map: Record<string, string> = {
          cramps: 'cólicos',
          headache: 'cabeza',
          back: 'espalda',
          breasts: 'senos'
        };
        return map[l] || l;
      });
      parts.push(`(${locations.join(', ')})`);
    }
  }

  // Mood & Mental
  if (suggestions.mood) {
    const moods = ['', 'muy mal', 'mal', 'regular', 'bien', 'muy bien'];
    parts.push(`Ánimo: ${moods[suggestions.mood]}`);
  }

  if (suggestions.anxiety) parts.push('ansiedad');
  if (suggestions.irritability) parts.push('irritabilidad');

  // Energy & Stress
  if (suggestions.energyLevel) {
    const energy = { low: 'baja', medium: 'media', high: 'alta' };
    parts.push(`Energía ${energy[suggestions.energyLevel]}`);
  }

  if (suggestions.stressScore !== undefined) {
    parts.push(`Estrés ${suggestions.stressScore}/10`);
  } else if (suggestions.stressLevel) {
    const stress = { low: 'bajo', medium: 'medio', high: 'alto' };
    parts.push(`Estrés ${stress[suggestions.stressLevel]}`);
  }

  // Sleep
  if (suggestions.sleepHours) {
    parts.push(`${suggestions.sleepHours}h sueño`);
    if (suggestions.sleepQuality) {
      const quality = ['', 'malo', 'regular', 'bueno', 'muy bueno', 'excelente'];
      parts.push(`(${quality[suggestions.sleepQuality]})`);
    }
  }

  // Activity
  if (suggestions.physicalActivity && suggestions.physicalActivity !== 'none') {
    const activity = { light: 'suave', moderate: 'moderado', intense: 'intenso' };
    parts.push(`Ejercicio ${activity[suggestions.physicalActivity as keyof typeof activity]}`);
  }

  // Symptoms
  const symptomsList: string[] = [];
  if (suggestions.nausea) symptomsList.push('náuseas');
  if (suggestions.headache) symptomsList.push('cefalea');
  if (suggestions.bloating) symptomsList.push('hinchazón');
  if (suggestions.acne) symptomsList.push('acné');
  if (symptomsList.length > 0) {
    parts.push(`Síntomas: ${symptomsList.join(', ')}`);
  }

  // Medications
  if (suggestions.medications && suggestions.medications.length > 0) {
    const meds = suggestions.medications.map(m => `${m.name} ${m.dose}`).join(', ');
    parts.push(`Medicación: ${meds}`);
  }

  if (parts.length === 0) {
    return `Registro basado en: "${originalText.slice(0, 100)}${originalText.length > 100 ? '...' : ''}"`;
  }

  return parts.join(' • ');
}

/**
 * Speech recognition wrapper
 */
export function startVoiceRecognition(onResult: (text: string) => void, onError?: (error: string) => void): () => void {
  // Check if browser supports speech recognition
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError?.('Tu navegador no soporta reconocimiento de voz');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError?.(event.error === 'no-speech' ? 'No se detectó voz' : 'Error en el reconocimiento de voz');
  };

  recognition.start();

  return () => recognition.stop();
}
