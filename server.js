const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

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

    // Usar Claude API si está configurado
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
1. Responder preguntas sobre productos de forma amigable
2. Sugerir productos basado en necesidades del cliente
3. Facilitar compra sin presión
4. Ser conciso (máx 150 palabras)
5. Responder SIEMPRE en español`,
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        });

        return res.json({
          success: true,
          text: response.content[0].text,
          source: 'claude'
        });

      } catch (claudeError) {
        console.warn('Claude API error:', claudeError.message);
        // Fallback
        return res.json({
          success: true,
          text: getKeywordResponse(message),
          source: 'fallback'
        });
      }
    } else {
      // Fallback a palabras clave
      return res.json({
        success: true,
        text: getKeywordResponse(message),
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Fallback keyword responses
function getKeywordResponse(message) {
  const m = message.toLowerCase();

  if (m.includes('precio') || m.includes('costo')) {
    return '💰 Nuestros precios:\n\n• Regular: $315K\n• Platinum: $355K ⭐\n• Optimizer: $300K\n• Café: $149K\n\n¿Cuál te interesa?';
  }
  if (m.includes('platinum')) {
    return '⭐ Platinum ($355K) - Bestseller!\n✓ 45% concentración\n✓ 30 sobres\n✓ Resultados en 30 días\n\n¿Quieres comprarlo?';
  }
  if (m.includes('envío')) {
    return '📦 Envío: 1-3 días en Colombia\nBogotá: Mismo día o al día siguiente\n\n¿Necesitas algo más?';
  }
  if (m.includes('beneficio')) {
    return '💪 Beneficios:\n✓ Refuerza inmunidad\n✓ Aumenta energía\n✓ Antioxidante potente\n✓ Recuperación muscular\n\n¿Cuál es tu necesidad?';
  }

  return '👋 Hola, soy el asistente de Glutation Store.\n\nPuedo ayudarte con:\n• Información de productos\n• Precios y envíos\n• Cómo comprar\n\n¿En qué puedo ayudarte?';
}

// Servir index.html para rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Glutation Store API running on port ${PORT}`);
  console.log(`✅ Claude API: ${process.env.CLAUDE_API_KEY ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
});

module.exports = app;
