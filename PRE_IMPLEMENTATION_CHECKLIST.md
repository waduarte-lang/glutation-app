# ✅ Pre-Implementation Checklist

**REVISAR ESTO ANTES DE HACER CAMBIOS AL CÓDIGO**

## Antes de modificar `api/chat.js`

- [ ] ¿El nombre del modelo está validado en https://docs.anthropic.com/en/docs/about/models/overview?
- [ ] ¿La variable `CLAUDE_API_KEY` está configurada en Vercel Settings?
- [ ] ¿Hiciste Redeploy a Production después de cambiar variables?
- [ ] ¿Probaste con curl primero antes de probar en la UI?

## Diagnóstico rápido si no funciona

1. Verificar logs de Vercel: Deployments → [deployment actual] → Logs
2. Buscar "External APIs" - si ve 404 de anthropic.com, es problema de modelo
3. Buscar "CLAUDE_API_KEY" - si no está, falta variable de entorno
4. Hacer Redeploy a Production (no Preview)

## Modelo correcto (VERIFICADO - 2026-04-22)

```javascript
model: 'claude-opus-4-1-20250805'  // ✅ CORRECTO Y VERIFICADO FUNCIONANDO

// ❌ NO usar estos (devuelven 404 - NO EXISTEN):
// 'claude-3-5-sonnet-20241022'
// 'claude-3-5-sonnet-20240620'
// 'claude-3-sonnet-20240229'
```

**Verificación**: Probado directamente con curl - funciona 100%

---

**Última actualización**: 2026-04-22
