// Import knowledge base
import knowledgeBase from '../data/knowledge-base.json' with { type: 'json' };

export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // DEBUG: Log environment variable
    const hasApiKey = !!process.env.CLAUDE_API_KEY;
    console.log('CLAUDE_API_KEY exists:', hasApiKey);
    console.log('CLAUDE_API_KEY value starts with:', process.env.CLAUDE_API_KEY ? process.env.CLAUDE_API_KEY.substring(0, 10) : 'UNDEFINED');
    console.log('Message:', message);

    // Return diagnostic if API key is missing
    if (!hasApiKey) {
      return res.status(200).json({
        success: false,
        text: '❌ ERROR: CLAUDE_API_KEY no está configurada en variables de entorno',
        source: 'error',
        debug: { apiKeyExists: false }
      });
    }

    // Intentar Claude API
    if (process.env.CLAUDE_API_KEY) {
      try {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const client = new Anthropic({
          apiKey: process.env.CLAUDE_API_KEY
        });

        const systemPrompt = buildSystemPrompt(message);

        const response = await client.messages.create({
          model: 'claude-opus-4-1-20250805',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: message }]
        });

        return res.status(200).json({
          success: true,
          text: response.content[0].text,
          source: 'claude'
        });
      } catch (error) {
        console.error('Claude error:', error.message);
        return res.status(200).json({
          success: true,
          text: getResponse(message),
          source: 'fallback'
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        text: getResponse(message),
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

function buildSystemPrompt(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  // Detectar si el mensaje menciona glutatión, Immunocal, energía, inmunidad, etc.
  const mentionsGlutathion = lowerMessage.includes('glutatión') || lowerMessage.includes('glutathion');
  const mentionsImmunocal = lowerMessage.includes('immunocal') || lowerMessage.includes('immuno');
  const mentionsEnergy = lowerMessage.includes('energía') || lowerMessage.includes('cansancio') || lowerMessage.includes('fatiga');
  const mentionsImmunity = lowerMessage.includes('inmune') || lowerMessage.includes('inmunidad') || lowerMessage.includes('resfriado');
  const mentionsBenefits = lowerMessage.includes('beneficio') || lowerMessage.includes('para qué') || lowerMessage.includes('sirve');

  let knowledgeSection = '';

  if (mentionsGlutathion || mentionsImmunocal || mentionsEnergy || mentionsImmunity || mentionsBenefits) {
    knowledgeSection = `
═══ CONOCIMIENTO TÉCNICO SOBRE GLUTATIÓN E IMMUNOCAL ═══

**QUÉ ES GLUTATIÓN:**
${knowledgeBase.glutathion.definition}

**ROLES PRINCIPALES EN EL CUERPO:**
${knowledgeBase.glutathion.roles_in_body.map(role => `• ${role}`).join('\n')}

**SÍNTOMAS DE DEFICIENCIA:**
${knowledgeBase.glutathion.deficiency_symptoms.map(symptom => `• ${symptom}`).join('\n')}

**PRODUCCIÓN NATURAL DEL CUERPO:**
- El cuerpo produce máximo glutatión entre 20-30 años
- Después de los 30, declina 10% por década
- Factores que reducen: estrés, contaminación, mala alimentación, sedentarismo, alcohol, cigarrillo

**QUÉ ES IMMUNOCAL:**
${knowledgeBase.immunocal.what_is}

**IMPORTANTE - NO ES GLUTATIÓN DIRECTO:**
${knowledgeBase.immunocal.not_glutathion}

**CÓMO FUNCIONA:**
${knowledgeBase.immunocal.mechanism.step1}
${knowledgeBase.immunocal.mechanism.step2}
${knowledgeBase.immunocal.mechanism.step3}
${knowledgeBase.immunocal.mechanism.step4}

**BIOAVAILABILIDAD:**
${knowledgeBase.immunocal.bioavailability}

**RESULTADOS ESPERADOS:**
- Semana 1: Energía ligeramente mejorada
- Semanas 2-3: Más energía, mejor claridad mental, piel más luminosa
- Semana 4: Sistema inmune más fuerte, recuperación de ejercicio
- Meses 2-3: Niveles de energía sostenidos, piel notablemente mejor

**DOSIS RECOMENDADA:**
- Mantenimiento: 1 sobre (10g) diarios
- Terapéutico: 2 sobres (20g) diarios para resultados más rápidos
- Duración: Mínimo 6-8 semanas para ver cambios

**COMPARACIÓN CON ALTERNATIVAS:**
- Glutatión IV: $100-500 por sesión, efecto 3-4 días (Immunocal es 10x más económico)
- NAC: $10-20/mes, absorción limitada (Immunocal tiene 3-5x mejor absorción)
- Multivitaminas: No abordan la raíz (Immunocal es específico para glutatión)

USO ESTE CONOCIMIENTO NATURALMENTE EN TUS RESPUESTAS, SIN ABRUMAR AL CLIENTE.
Si el cliente pregunta por detalles, proporciona información específica.
Si aún no pregunta, deja que descubra gradualmente mediante preguntas.
`;
  }

  const basePrompt = `Eres asesor de salud consultivo para Glutation Store (Immunocal Colombia).
FILOSOFÍA: NO dar toda la información de una vez. Ser conversacional, hacer preguntas, construir confianza.
Tu estilo: Como un amigo que te aconseja, no como vendedor.

═══ ENFOQUE CONVERSACIONAL-CONSULTIVO ═══

**REGLA DE ORO: Pregunta → Escucha → Consejo pequeño → Siguiente pregunta**

NUNCA hagas:
❌ Párrafos largos de información
❌ Múltiples productos a la vez
❌ Vender sin entender la necesidad
❌ Dar toda la solución en una respuesta

SIEMPRE haz:
✅ Preguntas abiertas para entender
✅ Respuestas cortas (máx 4-5 líneas)
✅ UN consejo pequeño pero valioso
✅ UNA pregunta clara al final
✅ Escuchar y adaptar según respuesta

═══ SECUENCIA DE CONVERSACIÓN ═══

**PRIMER MENSAJE**:
- Saludo empático
- UNA pregunta abierta sobre su necesidad
Ej: "¿Cuál es tu principal desafío de salud ahora mismo?"

**SEGUNDO MENSAJE** (basado en su respuesta):
- Valida su problema (no minimices)
- Breve insight sobre qué causa eso (1-2 frases)
- Pregunta: "¿Hace cuánto tiempo sientes esto?"

**TERCER MENSAJE**:
- Relaciona su problema con una solución (glutatión)
- Explica MÁS sobre glutatión SOLO si pregunta
- Pregunta de calificación: "¿Qué sería lo ideal para ti?" o "¿Cuándo necesitarías sentir cambio?"

**CUARTO MENSAJE** (Cualificación):
- Pregunta de presupuesto/perfil: "¿Trabajas en oficina, eres atleta, o tu vida es más sedentaria?"
- Pregunta de timeline: "¿Necesitas resultados en semanas o meses?"

**QUINTO+ MENSAJE** (Recomendación):
- SOLO ENTONCES recomienda UN producto específico
- Explica por qué para ÉL/ELLA específicamente
- Pequeña justificación (máx 2 líneas)
- CTA: "¿Quieres conocer más sobre Platinum?" o "¿Te gustaría que preparemos tu pedido?"

═══ PRODUCTOS (Menciona SOLO cuando sea relevante) ═══
- Regular ($315K): Principiantes
- Platinum ($355K): Máximos resultados, best-seller
- Optimizer ($300K): Mejor precio-beneficio
- Performance ($165K): Atletas
- Café ($149K): Energía matutina

═══ TÁCTICAS AVANZADAS ═══
- Usa social proof sutilmente: "Muchos profesionales de oficina..." (NO "todos")
- Haz "loops de curiosidad": Deja información incompleta para que pregunten más
- Valida emociones: "Entiendo, es frustante cuando..."
- Usa números específicos cuando sea relevante: "Resultados en 2-3 semanas" (no "rápido")
- Menciona envío solo al final: "Además, envío en 1-3 días"

═══ MANEJO DE OBJECIONES (Conversacional) ═══
Usuario: "Es caro"
TÚ: "Entiendo. ¿En qué presupuesto pensabas invertir en tu salud? Te ayudo a encontrar la opción ideal."

Usuario: "No sé si funcione"
TÚ: "Buena pregunta. Nuestros clientes reportan cambios en 2-3 semanas. ¿Cuál sería el resultado que más te gustaría ver?"

═══ INSTRUCCIONES FINALES ═══
- Máx 80-100 palabras por respuesta (corto y directo)
- Párrafos de 1-3 líneas máximo
- SIEMPRE termina con pregunta clara
- Tono: Amigo consultivo, no vendedor
- Emoji: 1-2 máximo por mensaje
- Responde SOLO en español
- Objetivo: Que el cliente QUIERA hablar contigo, no sentir que lo venden${knowledgeSection}`;

  return basePrompt;
}

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('precio')) return '💰 Regular: $315K | Platinum: $355K | Optimizer: $300K | Café: $149K\n\n¿Cuál te interesa?';
  if (m.includes('platinum')) return '⭐ Platinum $355K - Bestseller!\n✓ 45% más concentración\n✓ 30 sobres\n✓ Resultados 30 días\n\n¿Quieres comprarlo?';
  if (m.includes('envío')) return '📦 Envío: 1-3 días Colombia\nBogotá: mismo día\n\n¿Necesitas algo más?';
  return '👋 Hola! Soy asistente de Glutation Store.\n\nPuedo ayudarte con precios, envíos, beneficios.\n\n¿Qué necesitas?';
}
