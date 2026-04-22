// Vercel Serverless Function for Chat API

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

    const fallbackResponse = getKeywordResponse(message);
    return res.status(200).json({
      success: true,
      text: fallbackResponse,
      options: [],
      source: 'fallback'
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

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
