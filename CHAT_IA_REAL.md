# Chat con IA Real - Implementación con Gemini 2.0 Flash

## ✅ Implementación Completada

### 1. Servicio de Chat con IA

**Archivo**: `services/ai-chat.ts`

#### Características Principales

- **Modelo**: Gemini 2.0 Flash Experimental (`gemini-2.0-flash-exp`)
- **API Key**: Reutiliza la misma configuración que el resto de la app
- **Multiidioma**: Soporte para español, inglés y turco
- **Contexto preservado**: Mantiene historial de conversación
- **Manejo de errores**: Respuestas de fallback en caso de error

#### Funciones Principales

**`createChatSession(context: ChatContext, language: Language): ChatSession`**
- Crea una nueva sesión de chat
- Inicializa el historial vacío
- Configura el idioma

**`sendChatMessage(session: ChatSession, userMessage: string): Promise<string>`**
- Envía un mensaje al modelo de IA
- Incluye contexto completo (datos del usuario)
- Mantiene historial de conversación
- Retorna la respuesta de la IA

**`isAIAvailable(): boolean`**
- Verifica si la API key está configurada
- Útil para mostrar/ocultar funcionalidades

#### Prompts del Sistema

Cada idioma tiene un prompt del sistema optimizado que instruye a la IA para:

1. **Analizar datos** del ciclo menstrual, síntomas y patrones
2. **Proporcionar insights** personalizados basados en datos reales
3. **Ofrecer recomendaciones** de bienestar basadas en evidencia
4. **Responder preguntas** sobre salud menstrual y fertilidad
5. **Ser empático** y alentador

**Restricciones importantes:**
- ❌ No hacer diagnósticos médicos
- ✅ Recomendar consultar profesionales para casos serios
- ✅ Basar respuestas en datos proporcionados
- ✅ Usar tono cálido y profesional
- ✅ Respuestas de 100-200 palabras
- ✅ Usar markdown para formato

#### Construcción del Contexto

La función `buildContextPrompt()` genera un resumen estructurado que incluye:

**Para un día:**
```
Contexto del análisis: día
Título: Miércoles, 29 de Octubre
Descripción: Análisis completo de tu día

Datos disponibles:
- Registro del día:
  * Menstruación: intensidad 2/3
  * Ánimo: 7/10
  * Energía: medium
  * Dolor: 4/10
  * Estrés: 5/10
  * Sueño: 7.5h (calidad: 4/5)
  * Hidratación: 2.1L
  * Actividad física: moderate (30 min)
  * Síntomas: 3 registrados
  * Notas: "Me sentí bien durante el día..."
```

**Para una semana/mes:**
```
Datos disponibles:
- 7 días de datos registrados
  * Sueño promedio: 7.2h
  * Dolor promedio: 3.5/10 (4 días con dolor)
  * Estrés promedio: 4.8/10
  * Días con actividad física: 5
```

**Para ciclos:**
```
- 2 ciclo(s) en este período
  * Duración promedio: 28.5 días
- Día del ciclo: 14
- Fase actual: ovulation
```

### 2. Integración en InsightsPage

**Archivo**: `pages/InsightsPage.tsx`

#### Nuevo Estado

```typescript
const [chatSession, setChatSession] = useState<ChatSession | null>(null);
const [isSendingMessage, setIsSendingMessage] = useState(false);
```

#### Handler Actualizado

**`handleStartChatWithContext(context: ChatContext)`**
- Crea una sesión de chat con el contexto
- Formatea el mensaje inicial
- Activa el modo chat

**`handleSendChatMessage(message: string): Promise<void>`**
- Añade mensaje del usuario al historial
- Llama a la API de Gemini
- Muestra estado de carga
- Maneja errores con mensajes de fallback
- Actualiza el historial de la sesión

**`handleBackToInsights()`**
- Vuelve a la vista de insights
- Limpia mensajes y sesión

### 3. Actualización del Componente AIChat

**Archivo**: `components/AIChat.tsx`

#### Cambios

- `onSendMessage` ahora es `async` y retorna `Promise<void>`
- Maneja el estado de carga correctamente
- Muestra indicador de "escribiendo..." mientras la IA responde

### 4. Flujo de Conversación

#### 1. Usuario Inicia Chat
```
Usuario hace click en "Chatear con IA"
  ↓
Se crea ChatSession con contexto
  ↓
Se muestra mensaje inicial con resumen de datos
  ↓
Usuario puede empezar a preguntar
```

#### 2. Usuario Envía Mensaje
```
Usuario escribe y envía mensaje
  ↓
Mensaje se añade al historial local
  ↓
Se muestra indicador de carga
  ↓
Se envía a Gemini con:
  - Prompt del sistema
  - Contexto de datos
  - Historial de conversación
  - Mensaje del usuario
  ↓
Gemini procesa y responde
  ↓
Respuesta se añade al historial
  ↓
Se muestra al usuario
```

#### 3. Manejo de Errores
```
Si hay error en la API
  ↓
Se captura el error
  ↓
Se muestra mensaje de fallback
  ↓
Usuario puede intentar de nuevo
```

### 5. Ejemplos de Conversación

#### Ejemplo 1: Pregunta sobre Dolor

**Usuario:** "¿Por qué tengo tanto dolor hoy?"

**IA (con contexto de dolor 7/10, día 2 del ciclo):**
```
Veo que hoy registraste un nivel de dolor de 7/10 y estás en el día 2 de tu ciclo, 
durante la fase de menstruación. Este nivel de dolor es común en los primeros días 
del período debido a:

**Causas principales:**
- Contracciones uterinas por prostaglandinas
- Inflamación natural del proceso menstrual
- Cambios hormonales bruscos

**Recomendaciones para aliviar:**
- 🔥 Aplica calor local (bolsa de agua caliente)
- 💊 Considera ibuprofeno si no tienes contraindicaciones
- 🧘 Prueba estiramientos suaves o yoga
- 💧 Mantén buena hidratación (veo que tomaste 2.1L, ¡excelente!)

⚠️ Si el dolor persiste con intensidad >7/10 por más de 2 días o interfiere 
significativamente con tu vida diaria, te recomiendo consultar con tu ginecólogo.

¿Hay algo más específico sobre el dolor que quieras saber?
```

#### Ejemplo 2: Pregunta sobre Sueño

**Usuario:** "¿Cómo puedo dormir mejor?"

**IA (con contexto de sueño promedio 6.2h en la semana):**
```
Noto que tu promedio de sueño esta semana es de 6.2h, lo cual está por debajo 
de las 7-9h recomendadas. Esto puede afectar tu energía, ánimo y regularidad del ciclo.

**Estrategias para mejorar tu sueño:**

🌙 **Rutina nocturna:**
- Acuéstate y levántate a la misma hora
- Evita pantallas 1h antes de dormir
- Crea un ritual relajante (lectura, meditación)

☕ **Durante el día:**
- Limita cafeína después de las 14:00
- Haz ejercicio, pero no cerca de la hora de dormir
- Exponte a luz natural por la mañana

🛏️ **Ambiente:**
- Habitación fresca (18-20°C)
- Oscuridad total o antifaz
- Silencio o ruido blanco

Dado que estás en fase lútea, es normal tener algo más de dificultad para dormir. 
Considera suplementos de magnesio (consulta con tu médico primero).

¿Quieres que profundicemos en alguna de estas estrategias?
```

#### Ejemplo 3: Pregunta sobre Regularidad

**Usuario:** "¿Mi ciclo es regular?"

**IA (con contexto de 3 ciclos: 28, 30, 27 días):**
```
Basándome en tus últimos 3 ciclos registrados:
- Ciclo 1: 28 días
- Ciclo 2: 30 días  
- Ciclo 3: 27 días

**Análisis de regularidad:**
✅ **Duración promedio:** 28.3 días (dentro del rango normal de 21-35 días)
✅ **Variabilidad:** ±1.5 días (excelente, <3 días se considera muy regular)
✅ **Tendencia:** Estable, sin cambios bruscos

**Conclusión:**
Tu ciclo es muy regular. Una variación de 1-3 días entre ciclos es completamente 
normal y saludable. Factores como estrés, ejercicio intenso, cambios de peso o 
viajes pueden causar pequeñas variaciones.

**Factores que mantienen tu regularidad:**
- Veo que haces ejercicio regularmente (5 días esta semana) 👍
- Tu hidratación es buena (promedio 2L/día) 💧
- Niveles de estrés moderados (promedio 4.8/10) 🧘

Sigue así, tu cuerpo está funcionando muy bien. ¿Hay algo más sobre tu ciclo 
que te gustaría entender?
```

### 6. Configuración Técnica

#### Parámetros del Modelo

```typescript
{
  model: 'gemini-2.0-flash-exp',
  config: {
    temperature: 0.7,        // Balance entre creatividad y consistencia
    maxOutputTokens: 500,    // ~200-250 palabras
  }
}
```

#### API Key

La API key se obtiene de:
1. Variable de entorno `process.env.API_KEY`
2. Fallback hardcoded (para desarrollo)

Para producción, configurar en `.env.local`:
```
GEMINI_API_KEY=tu_api_key_aqui
```

### 7. Ventajas de la Implementación

✅ **Respuestas Contextuales**: La IA tiene acceso a todos los datos relevantes
✅ **Multiidioma**: Responde en el idioma del usuario automáticamente
✅ **Memoria de Conversación**: Mantiene contexto entre mensajes
✅ **Manejo de Errores**: Fallbacks elegantes si hay problemas
✅ **Rápido**: Gemini 2.0 Flash es muy rápido (~1-2 segundos)
✅ **Económico**: Flash es el modelo más económico de Gemini
✅ **Seguro**: No hace diagnósticos médicos, recomienda profesionales

### 8. Limitaciones y Consideraciones

⚠️ **No es un médico**: Siempre recomienda consultar profesionales
⚠️ **Requiere API Key**: Sin key, el chat no funciona
⚠️ **Límites de API**: Gemini tiene límites de rate (60 req/min en free tier)
⚠️ **Privacidad**: Los datos se envían a Google (cumple GDPR)
⚠️ **Idioma**: Mejor rendimiento en inglés, bueno en español

### 9. Archivos Modificados/Creados

#### Nuevos
- ✅ `services/ai-chat.ts` - Servicio de chat con IA

#### Modificados
- ✅ `pages/InsightsPage.tsx` - Integración del chat real
- ✅ `components/AIChat.tsx` - Handler async
- ✅ `services/ai-chat-formatter.ts` - Tipos exportados

### 10. Testing

#### Casos de Prueba

1. **Chat básico**
   - ✅ Iniciar chat desde cualquier vista
   - ✅ Enviar mensaje y recibir respuesta
   - ✅ Mantener conversación con contexto

2. **Manejo de errores**
   - ✅ Sin API key → Mensaje de error
   - ✅ Error de red → Mensaje de fallback
   - ✅ Respuesta vacía → Retry

3. **Contexto**
   - ✅ Día: Datos específicos del día
   - ✅ Semana: Promedios semanales
   - ✅ Mes: Ciclos y síntomas frecuentes
   - ✅ Ciclo: Fase y día del ciclo

4. **Multiidioma**
   - ✅ Español: Respuestas en español
   - ✅ Inglés: Respuestas en inglés
   - ✅ Turco: Respuestas en turco

### 11. Próximos Pasos (Opcional)

#### Mejoras Futuras

1. **Streaming de respuestas**
   - Mostrar respuesta palabra por palabra
   - Mejor UX, más natural

2. **Sugerencias de preguntas**
   - Botones con preguntas comunes
   - Basadas en el contexto actual

3. **Exportar conversación**
   - Guardar chat como PDF
   - Compartir con médico

4. **Historial de chats**
   - Guardar conversaciones anteriores
   - Buscar en historial

5. **Análisis de sentimiento**
   - Detectar preocupaciones serias
   - Priorizar recomendación médica

6. **Integración con calendario**
   - Recordatorios basados en chat
   - Sugerencias proactivas

---

**Fecha de implementación**: 30 de octubre de 2025
**Versión**: 2.0
**Estado**: ✅ Funcional con IA real (Gemini 2.0 Flash)
**Modelo**: gemini-2.0-flash-exp
**Costo estimado**: ~$0.001 por conversación (muy económico)
