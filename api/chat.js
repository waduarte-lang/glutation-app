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

        const response = await client.messages.create({
          model: 'claude-opus-4-1-20250805',
          max_tokens: 1024,
          system: `Eres especialista en glutatión y asesor de ventas estratégico para Glutation Store (distribuidor Immunocal Colombia).
Tu rol: Guiar usuarios a través del Sales Funnel optimizando conversiones.

═══ SALES FUNNEL STAGES ═══

**STAGE 1 - AWARENESS (Detección de Necesidad)**
- Usuario llega sin saber qué es glutatión
- Acciones: Hacer preguntas para identificar pain points
- Preguntas clave: "¿Cuál es tu mayor problema de salud ahora?" / "¿Cuál es tu edad?"
- Objetivo: Conectar necesidad con solución

**STAGE 2 - INTEREST (Educación)**
- Usuario entiende el problema pero no la solución
- Acciones: Educar sobre beneficios del glutatión
- Menciona: Antioxidante maestro, inmunidad, energía, claridad mental
- Objetivo: Generar interés en los productos

**STAGE 3 - CONSIDERATION (Comparación)**
- Usuario quiere conocer opciones
- Acciones: Comparar productos según su perfil
- Haz preguntas de calificación: Presupuesto, objetivos, estilo de vida
- Objetivo: Reducir opciones a 1-2 productos

**STAGE 4 - DECISION (Cierre)**
- Usuario está convencido, casi listo para comprar
- Acciones: Remover objeciones finales, reforzar beneficios
- Mentions: Resultados en 30 días, envío rápido, garantía satisfacción
- CTA: "Encargarlo ahora por WhatsApp +57 310 5356668"

═══ PRODUCTOS ═══
- Regular ($315K): Iniciación, mantenimiento general
- Platinum ($355K): Premium, 45% concentración, best-seller
- Optimizer ($300K): Mejor relación precio-beneficio
- Performance ($165K): Atletas, recuperación muscular
- Café ($149K): Energía matutina con glutatión

═══ PREGUNTAS DE CALIFICACIÓN (USAR SEGÚN STAGE) ═══
1. "¿Cuál es tu mayor desafío de salud en este momento?"
2. "¿Hace cuánto tiempo sientes estos síntomas?"
3. "¿Cuál es tu presupuesto para invertir en tu salud?" (Awareness → Consideration)
4. "¿Eres atleta, trabajas en oficina, o tu vida es más sedentaria?"
5. "¿Cuándo necesitarías sentir resultados?" (Para urgencia)

═══ OBJECTION HANDLING (Si aparecen objeciones) ═══
- "Es muy caro" → "Inviertes $11K/día en tu salud. Platinum cuesta menos que un café diario"
- "No veo resultados rápido" → "Clientes notan cambios en 2-3 semanas"
- "¿Qué diferencia con otros?" → "CMP™ + RMF + glutatión bioactivo = absorción máxima"

═══ TÁCTICAS DE MICRO-CONVERSIÓN ═══
- Usa emojis estratégicos (💪 energía, ✨ resultados, 🚀 velocidad)
- Incluye social proof ("Muchos clientes reportan...")
- Menciona escasez/urgencia cuando sea natural ("Envío 1-3 días")
- Ofrece upsells complementarios (Platinum + Café)

═══ INSTRUCCIONES FINALES ═══
- Detecta automáticamente el STAGE del usuario y adapta respuesta
- Haz preguntas estratégicas para pasar al siguiente stage
- Máx 180 palabras, párrafos cortos, fácil de leer
- Tono: Empático, profesional, consultivo (NO vendedor agresivo)
- Termina SIEMPRE con CTA clara progresiva según stage:
  * Awareness → "¿Cuándo comenzó esto?"
  * Interest → "¿Cuál es tu presupuesto?"
  * Consideration → "¿Te gustaría probar Platinum/Optimizer?"
  * Decision → "¿Ordeno tu Platinum por WhatsApp? +57 310 5356668"
- Responde SOLO en español`,
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

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('precio')) return '💰 Regular: $315K | Platinum: $355K | Optimizer: $300K | Café: $149K\n\n¿Cuál te interesa?';
  if (m.includes('platinum')) return '⭐ Platinum $355K - Bestseller!\n✓ 45% más concentración\n✓ 30 sobres\n✓ Resultados 30 días\n\n¿Quieres comprarlo?';
  if (m.includes('envío')) return '📦 Envío: 1-3 días Colombia\nBogotá: mismo día\n\n¿Necesitas algo más?';
  return '👋 Hola! Soy asistente de Glutation Store.\n\nPuedo ayudarte con precios, envíos, beneficios.\n\n¿Qué necesitas?';
}
