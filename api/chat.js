export default async function handler(req, res) {
  // CORS
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

    // Intentar Claude API
    if (process.env.CLAUDE_API_KEY) {
      try {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const client = new Anthropic({
          apiKey: process.env.CLAUDE_API_KEY
        });

        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: `Eres asistente de Glutation Store, Immunocal distribuidor en Colombia.

PRODUCTOS (COP):
- Regular: $315,000
- Platinum: $355,000
- Optimizer: $300,000
- Café: $149,000
- Performance: $165,000

POLÍTICA: Envío 1-3 días, WhatsApp +57 310 5356668

Responde en español, máx 150 palabras, amigable.`,
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
