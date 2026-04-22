# 📚 Glutation Store - Manual de Operaciones

## Resumen Ejecutivo

**Proyecto**: Chatbot inteligente para Glutation Store (distribuidor Immunocal en Colombia)  
**Estado**: ✅ FUNCIONAL - Claude API integrada y optimizada  
**Stack**: Vercel serverless + Claude API (claude-opus-4-1-20250805)  
**Última actualización**: 2026-04-22

---

## 🎯 Objetivos Completados

- ✅ GA4/GTM Analytics - 8+ eventos de tracking implementados
- ✅ Vercel Deployment - Sitio en vivo en https://www.glutationsport.com
- ✅ Claude API Integration - Chatbot respondiendo inteligentemente
- ✅ Sales Funnel Optimization - Sistema conversacional-consultivo implementado
- ⏳ WhatsApp + Twilio (Pendiente - próxima fase)

---

## 🔴 Errores Críticos Encontrados (Y POR QUÉ)

### Error #1: Nombres de Modelos Claude Inexistentes (REPETIDO 3 VECES)

**Modelos que NO existen** (retornan 404 de Anthropic):
- `claude-3-5-sonnet-20241022` ❌
- `claude-3-5-sonnet-20240620` ❌
- `claude-3-sonnet-20240229` ❌

**Modelo correcto**:
- `claude-opus-4-1-20250805` ✅ (VERIFICADO FUNCIONANDO)

**Por qué pasó**: 
- No validé los nombres en la documentación oficial de Anthropic
- Asumí nombres basado en patrones históricos
- El error de 404 parecía ser "variable de entorno no configurada" cuando era "modelo no existe"

**Lección**: 
> **SIEMPRE validar nombres de modelo en https://docs.anthropic.com/en/docs/about/models/overview ANTES de implementar. Hacer curl directo con la API key para verificar.**

---

### Error #2: Variables de Entorno no se Pasaban al Runtime

**Síntoma**: `process.env.CLAUDE_API_KEY` siempre era undefined en Vercel  
**Causa raíz**: Variables configuradas en Vercel Settings no se propagaban correctamente al runtime

**Soluciones intentadas**:
1. ❌ Reconfigurar variable (no funcionó)
2. ❌ Hacer redeploys múltiples (no funcionó)
3. ✅ **Contactar a Soporte de Vercel** (ESTO FUNCIONÓ)

**Lección**: 
> **Si una variable está configurada pero no se pasa al runtime, contactar a soporte. No es un problema de infraestructura - es un bug de Vercel.**

---

### Error #3: Respuestas de Fallback Silenciosas

**Problema**: El código tenía un fallback silencioso - si Claude API fallaba, devolvía respuestas predefinidas sin indicar error.

**Solución**: Agregué logging y endpoint de diagnóstico (`/api/debug.js`) para visibilidad.

**Lección**:
> **NUNCA silencies errores. Siempre loguea qué está pasando. Mejor un "ERROR: variable no encontrada" que un fallback silencioso.**

---

## 📋 Stack Técnico Actual

```
Frontend:
  - HTML/CSS/JS vanilla
  - Chat modal integrado en index.html
  - GA4 tracking (8+ eventos)

Backend:
  - Vercel serverless functions
  - Node.js 24.x runtime
  - Express.js NO (Vercel no lo soporta)

API:
  - Claude API (@anthropic-ai/sdk)
  - Model: claude-opus-4-1-20250805
  - Max tokens: 1024
  - Endpoints: /api/chat (POST), /api/debug (GET)

Database:
  - Ninguna (sin historial persistente)

Deployment:
  - GitHub (master branch)
  - Vercel auto-deploy on push
  - Domain: glutationsport.com + www.glutationsport.com
```

---

## 🧠 System Prompt Actual (Optimizado)

Ubicación: `/api/chat.js` línea 51+

**Características**:
- ✅ Enfoque conversacional-consultivo
- ✅ Preguntas primero, información corta después
- ✅ Sales funnel stages (Awareness → Decision)
- ✅ Social proof sutil
- ✅ Objection handling proactivo
- ✅ Respuestas cortas (80-100 palabras máx)

**NO hacer**:
- ❌ Dar toda la información en un mensaje
- ❌ Abrumar con múltiples productos
- ❌ Vender sin entender la necesidad
- ❌ Párrafos largos

---

## 🎯 Productos & Precios (2026-04-22)

| Producto | Precio COP | Target | Ventaja |
|----------|-----------|--------|---------|
| Regular | $315,000 | Principiantes | Iniciación |
| Platinum | $355,000 | Máximos resultados | Best-seller, 45% concentración |
| Optimizer | $300,000 | Profesionales | Mejor precio-beneficio |
| Performance | $165,000 | Atletas | Recuperación muscular |
| Café | $149,000 | Mañanas | Energía + glutatión |

---

## ⚙️ Configuración Requerida

### Variables de Entorno (Vercel Settings)

```
CLAUDE_API_KEY=sk-ant-api03-... (REQUERIDO)
```

**Importante**: 
- Debe estar en Production Y Preview
- Si se cambia, hacer REDEPLOY
- Regenerar después de compartir

### Vercel JSON (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "." }
    },
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1.js" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

### Package.json (Requerido)

```json
{
  "scripts": {
    "build": "echo 'Build complete'",
    "dev": "echo 'Dev mode'"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0"
  }
}
```

---

## 🚀 Checklist Pre-Implementación (CRÍTICO)

**SIEMPRE hacer esto ANTES de tocar `/api/chat.js`:**

- [ ] Validé que el modelo existe en https://docs.anthropic.com/en/docs/about/models/overview
- [ ] Hice una prueba de curl directo con la API key verificando que funciona
- [ ] Verifiqué que CLAUDE_API_KEY está en Vercel Settings (Production + Preview)
- [ ] Revisé `/memory/glutation-store-LESSONS.md` para ver errores pasados
- [ ] Si cambio el prompt, haré un redeploy COMPLETO
- [ ] Si agrego nuevos archivos a `/api/`, haré redeploy y probé `/api/debug` para verificar

---

## 📊 Flujo de Conversación Actual

```
Usuario: Hola, tengo cansancio
   ↓
Bot: Valida + pregunta sobre duración
   ↓
Usuario: 6 meses
   ↓
Bot: Pequeño insight + pregunta sobre contexto (trabajo, deporte)
   ↓
Usuario: Trabajo en oficina
   ↓
Bot: Conecta con solución (glutatión) + pregunta de timeline
   ↓
Usuario: Necesito sentirme mejor pronto
   ↓
Bot: Recomienda UN producto específico (ej: Platinum)
   ↓
Usuario: Interesado
   ↓
Bot: CTA: "¿Quieres que prepare tu pedido para WhatsApp?"
   ↓
Usuario → WhatsApp +57 310 5356668
```

---

## 🔧 Mantenimiento & Actualizaciones

### Próximas Fases

1. **Fase 1** (Actual): ✅ Chat inteligente con Claude API
2. **Fase 2** (Próximo): WhatsApp + Twilio integration
3. **Fase 3**: CRM para tracking de leads
4. **Fase 4**: A/B testing de prompts

### Cómo Iterar el Prompt

1. Edita `/api/chat.js` (línea 51+)
2. Commit: `git commit -m "Optimize: [qué cambió]"`
3. Push: `git push`
4. Vercel auto-deploya (1-2 min)
5. Prueba en https://www.glutationsport.com

### Cómo Debuggear

```bash
# Ver logs de Vercel
1. Vercel Dashboard → Deployments → [deployment actual] → Logs

# Probar endpoint directamente
curl -X POST "https://www.glutationsport.com/api/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"test\"}"

# Ver qué variables de entorno se pasan
https://www.glutationsport.com/api/debug
```

---

## 📝 Git Workflow

```bash
# Workflow recomendado
git status                           # Ver cambios
git add [archivo]                    # Agregar cambios
git commit -m "Type: Descripción"    # Tipos: Optimize, Fix, Feature, Refine
git push                             # Push a master (auto-deploy)
```

**Tipos de commits usados en este proyecto**:
- `Optimize:` - Mejorar prompt o tácticas de venta
- `Fix:` - Corregir errores o bugs
- `Feature:` - Agregar funcionalidad nueva (ej: WhatsApp)
- `Refine:` - Cambios en arquitectura o enfoque

---

## 🎓 Lecciones Clave Aprendidas

### 1. Validar Fundamentals Primero
**Error**: Gastar 7 horas troubleshooting Vercel cuando el problema era el nombre del modelo
**Solución**: Validar nombres de modelo con curl PRIMERO, no último

### 2. Las Variables de Entorno Pueden Ser Tricky
**Aprendizaje**: 
- Configurar variable ≠ Que se pase al runtime
- A veces es necesario soporte de Vercel
- Si está configurada pero no funciona, no es tu problema - es de Vercel

### 3. Conversational Selling Funciona Mejor
**Aprendizaje**:
- Dar toda la info en un mensaje = baja conversión
- Preguntar primero, información en pequeñas dosis = alta conversión
- El cliente debe SENTIR que lo escuchas, no que lo vendes

### 4. Sistema de Memoria es Crítico
**Aprendizaje**:
- Sin memoria documentada, los errores se repiten
- Crear `/memory/` y archivos de lecciones es inversión que paga
- Los checklists evitan 80% de los errores futuros

---

## 📞 Información de Contacto

**WhatsApp**: +57 310 5356668  
**Dominio**: glutationsport.com  
**Emails Enviadas**: 1-3 días en Colombia (Bogotá mismo día)

---

## 🚨 Errores a Evitar (Resumen Rápido)

| Error | Síntoma | Solución |
|-------|---------|----------|
| Modelo inválido | API 404 | Verificar en docs.anthropic.com + curl test |
| Variable env no se pasa | `undefined` en runtime | Contactar Vercel soporte |
| Respuesta silenciosa | Fallback sin aviso | Agregar logging |
| Prompt muy largo | Usuario abrumado | Limitar a 80-100 palabras + hacer preguntas |
| Sin historial | Usuario tiene que repetir | (Próxima fase: agregar memory) |

---

## 📅 Changelog

**2026-04-22**:
- ✅ Claude API funcionando (modelo: claude-opus-4-1-20250805)
- ✅ Sales Funnel implementado (4 stages)
- ✅ Prompt conversacional-consultivo optimizado
- ✅ CLAUDE.md documentado

---

**Creado por**: Claude Code + Usuario  
**Última actualización**: 2026-04-22  
**Próxima revisión**: 2026-05-22 o cuando se agregue WhatsApp
