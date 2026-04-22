const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS Configuration
const corsOptions = {
  origin: [
    'https://glutationsport.com',
    'https://www.glutationsport.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
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
        res.json({
          success: true,
          text: botResponse,
          options: [],
          source: 'claude'
        });

      } catch (claudeError) {
        console.error('Claude API error:', claudeError);
        // Fallback a keyword system
        throw new Error('Claude API failed, using fallback');
      }
    } else {
      throw new Error('Claude API not configured');
    }

  } catch (error) {
    console.error('Chat error:', error);

    // ========================================================================
    // OPCIÓN 2: Fallback - Sistema de palabras clave
    // ========================================================================
    const fallbackResponse = getKeywordResponse(req.body.message);
    res.json({
      success: true,
      text: fallbackResponse,
      options: [],
      source: 'fallback'
    });
  }
});

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

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Glutation Store API running on port ${PORT}`);
  console.log(`📊 CORS enabled for glutationsport.com and www.glutationsport.com`);
  console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Claude API: ${process.env.CLAUDE_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});

module.exports = app;
