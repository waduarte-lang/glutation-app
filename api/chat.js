// Vercel Serverless Function for Chat API

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // ========================================================================
    // OPCIÓN 1: Usar Claude API (si está configurado)
    // ========================================================================
    if (process.env.CLAUDE_API_KEY) {
      try {
        const Anthropic = require('@anthropic-ai/sdk');
        const client = new Anthropic({
          apiKey: process.env.CLAUDE_API_KEY
        });

        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: `Eres un asistente de ventas experto para Glutation Store, distribuidor oficial de Immunocal Immunotec en Colombia.

PRODUCTOS (Precios COP):
- Immunocal Regular: $315,000 - Entrada al mundo Immunocal
- Immunocal Platinum: $355,000 - Bestseller (45% más concentración, 30 sobres)
- Optimizer Rojos y Verdes: $300,000 - Máxima potencia antioxidante
- Optimizer Performance: $165,000 - Para deportistas
- Immunotec Café: $149,000 - Energía natural

Tu rol:
1. Responder preguntas sobre productos de forma amigable
2. Sugerir productos basado en necesidades del cliente
3. Facilitar compra sin presión
4. Ser profesional pero accesible
5. Si preguntan por WhatsApp, ofrecerlo como opción

Responde en español, sé conciso (máx 150 palabras), usa emojis moderadamente.`,
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        });

        const botResponse = response.content[0].text;
        return res.status(200).json({
          success: true,
          text: botResponse,
          options: [],
          source: 'claude'
        });

      } catch (claudeError) {
        console.error('Claude API error:', claudeError);
        // Fallback a keyword system
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
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  }
};

// ============================================================================
// FALLBACK: Keyword-based responses
// ============================================================================

function getKeywordResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Preguntas sobre precios
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto cuesta')) {
    return '💰 Nuestros precios:\n\n' +
           '• Immunocal Regular: $315K\n' +
           '• Immunocal Platinum: $355K ⭐ Bestseller\n' +
           '• Optimizer: $300K\n' +
           '• Café: $149K\n' +
           '• Performance: $165K\n\n' +
           '¿Cuál te interesa? 😊';
  }

  // Preguntas sobre Regular
  if (lowerMessage.includes('regular') && !lowerMessage.includes('platinum')) {
    return '✅ Immunocal Regular ($315,000) es perfecto para quien empieza con Immunocal.\n\n' +
           'Incluye: 30 sobres de glutatión bioactivo\n' +
           'Beneficios: Energía, inmunidad, antioxidante\n\n' +
           '¿Quieres agregarlo al carrito? 🛒';
  }

  // Preguntas sobre Platinum
  if (lowerMessage.includes('platinum')) {
    return '⭐ Immunocal Platinum ($355,000) es nuestro bestseller!\n\n' +
           'Ventajas:\n' +
           '✓ 45% más concentración\n' +
           '✓ 30 sobres premium\n' +
           '✓ Resultados en 30 días\n' +
           '✓ Garantía de satisfacción\n\n' +
           '¿Te lo llevo? 🎁';
  }

  // Preguntas sobre envío
  if (lowerMessage.includes('envío') || lowerMessage.includes('envios') || lowerMessage.includes('cuánto tarda')) {
    return '📦 Envío rápido en Colombia:\n\n' +
           '• Bogotá: 1-2 días\n' +
           '• Otras ciudades: 2-3 días\n' +
           '• Gratis con compra de 2+ productos\n\n' +
           '¿Necesitas algo más? 🚀';
  }

  // Preguntas sobre beneficios
  if (lowerMessage.includes('beneficio') || lowerMessage.includes('para qué') || lowerMessage.includes('sirve')) {
    return '💪 Beneficios Immunocal:\n\n' +
           '✓ Fortalece sistema inmunológico\n' +
           '✓ Aumenta energía natural\n' +
           '✓ Antioxidante potente\n' +
           '✓ Apoya recuperación deportiva\n' +
           '✓ Mejora vitalidad general\n\n' +
           '¿Cuál es tu mayor necesidad? 🤔';
  }

  // Preguntas sobre cómo usar
  if (lowerMessage.includes('cómo') || lowerMessage.includes('como') || lowerMessage.includes('modo')) {
    return '🥤 Modo de uso:\n\n' +
           '1. Abre un sobre\n' +
           '2. Disuelve en agua (200ml)\n' +
           '3. Revuelve bien\n' +
           '4. Toma inmediatamente\n\n' +
           '💡 Consejo: Toma en ayunas para máxima absorción';
  }

  // Respuesta por defecto
  return '👋 ¡Hola! Soy el asistente de Glutation Store.\n\n' +
         'Puedo ayudarte con:\n' +
         '• Información de productos\n' +
         '• Precios y promociones\n' +
         '• Envíos y entregas\n' +
         '• Cómo hacer tu compra\n\n' +
         '¿En qué puedo ayudarte? 😊';
}
