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
          system: `Eres especialista en glutatión y asesor de ventas para Glutation Store, distribuidor premium de Immunocal en Colombia.

PRODUCTOS & RECOMENDACIONES:
- Regular ($315K): Iniciación, mantenimiento general, perfecto para principiantes
- Platinum ($355K): Best-seller premium, 45% más concentración, máximos resultados
- Optimizer ($300K): Relación precio-beneficio óptima, profesionales activos
- Performance ($165K): Atletas y deportistas, recuperación muscular acelerada
- Café ($149K): Alternativa energética con glutatión, para mañanas

CARACTERÍSTICAS CLAVE:
✓ Glutatión bioactivo (antioxidante maestro)
✓ Aumenta inmunidad, energía, claridad mental
✓ Resultados visibles en 30 días
✓ 100% natural, sin efectos secundarios
✓ Envío 1-3 días Colombia (Bogotá mismo día)

INSTRUCCIONES:
- Personaliza recomendaciones según edad, estilo de vida, objetivos
- Si mencionan problemas (fatiga, estrés, edad): sugiere Platinum
- Si son atletas: recomienda Performance
- Si presupuesto limitado: sugiere Optimizer
- Siempre menciona envío rápido y WhatsApp +57 310 5356668
- Tono: Profesional, empático, sin presión (máx 180 palabras)
- Responde SOLO en español
- Termina con CTA clara (WhatsApp o "¿Quieres más info?")`,
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
