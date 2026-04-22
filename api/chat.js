// Vercel Serverless Function for Chat API with Claude
// Integrated: 2026-04-22

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // ========================================================================
    // OPCIÓN 1: Usar Claude API
    // ========================================================================
    if (process.env.CLAUDE_API_KEY) {
      try {
        const response = await callClaudeAPI(message);
        return res.status(200).json({
          success: true,
          text: response,
          options: [],
          source: 'claude'
        });
      } catch (claudeError) {
        console.warn('⚠️ Claude API error, using fallback:', claudeError.message);
        // Fallback a palabras clave
        const fallbackResponse = getKeywordResponse(message);
        return res.status(200).json({
          success: true,
          text: fallbackResponse,
          options: [],
          source: 'fallback'
        });
      }
    } else {
      // ====================================================================
      // OPCIÓN 2: Fallback - Sistema de palabras clave
      // ====================================================================
      const fallbackResponse = getKeywordResponse(message);
      return res.status(200).json({
        success: true,
        text: fallbackResponse,
        options: [],
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// ============================================================================
// Claude API Integration
// ============================================================================

async function callClaudeAPI(message) {
  const Anthropic = require('@anthropic-ai/sdk');

  const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
  });

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: `Eres un asistente de ventas experto para Glutation Store, distribuidor oficial de Immunocal Immunotec en Colombia.

PRODUCTOS Y PRECIOS (COP):
- Immunocal Regular: $315,000 - Entrada al mundo Immunocal
- Immunocal Platinum: $355,000 - Bestseller (45% más concentración, 30 sobres)
- Optimizer Rojos y Verdes: $300,000 - Máxima potencia antioxidante
- Optimizer Performance: $165,000 - Para deportistas
- Immunotec Café: $149,000 - Energía natural

POLÍTICAS:
- Envío: 1-3 días en Colombia (Bogotá: mismo día)
- Pago: Contraentrega o transferencia
- Garantía: 100% original, directo de Immunotec
- Contacto WhatsApp: +57 310 5356668

TU ROL:
1. Responder preguntas sobre productos de forma amigable y profesional
2. Sugerir productos basado en necesidades del cliente
3. Facilitar compra sin presión
4. Si preguntan por WhatsApp, ofrecer contacto: +57 310 5356668
5. Ser conciso (máx 150 palabras)
6. Usar emojis moderadamente

IMPORTANTE: Responde SIEMPRE en español, sé natural y conversacional.`,
    messages: [
      {
        role: 'user',
        content: message
      }
    ]
  });

  return response.content[0].text;
}

function getKeywordResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto cuesta')) {
    return '💰 Nuestros precios:\n\n• Immunocal Regular: $315K\n• Immunocal Platinum: $355K ⭐\n• Optimizer: $300K\n• Café: $149K\n\n¿Cuál te interesa? 😊';
  }

  if (lowerMessage.includes('platinum')) {
    return '⭐ Immunocal Platinum ($355,000) - Bestseller!\n\n✓ 45% más concentración\n✓ 30 sobres premium\n✓ Resultados en 30 días\n\n¿Te lo llevo? 🎁';
  }

  if (lowerMessage.includes('regular')) {
    return '✅ Immunocal Regular ($315,000)\n\n30 sobres de glutatión bioactivo\n\n¿Quieres agregarlo al carrito? 🛒';
  }

  if (lowerMessage.includes('envío') || lowerMessage.includes('cuánto tarda')) {
    return '📦 Envío rápido:\n• Bogotá: 1-2 días\n• Otras ciudades: 2-3 días\n\n¿Necesitas algo más? 🚀';
  }

  return '👋 ¡Hola! Soy el asistente de Glutation Store.\n\nPuedo ayudarte con precios, envíos, beneficios...\n\n¿En qué puedo ayudarte? 😊';
}
