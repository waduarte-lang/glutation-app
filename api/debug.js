export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const apiKey = process.env.CLAUDE_API_KEY;
  const hasKey = !!apiKey;
  const keyPreview = apiKey ? apiKey.substring(0, 15) : 'UNDEFINED';

  return res.status(200).json({
    environment: process.env.NODE_ENV,
    CLAUDE_API_KEY_exists: hasKey,
    CLAUDE_API_KEY_preview: keyPreview,
    allEnvVars: Object.keys(process.env).filter(k => k.includes('CLAUDE') || k.includes('API'))
  });
}
