# 📊 CONFIGURACIÓN GOOGLE ANALYTICS 4 - GLUTATION STORE

## 🚀 SETUP INICIAL (OBLIGATORIO - 10 MIN)

### **PASO 1: Crear Propiedad en GA4**

1. Ir a [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" (crear nueva propiedad)
3. Nombre de propiedad: `Glutation Store`
4. Zona horaria: `America/Bogota` 
5. Moneda: `COP (Colombian Peso)`
6. Descripción: `E-commerce con Claude AI chat bot`
7. Click "Create"

### **PASO 2: Obtener el ID de Medición**

Después de crear, verás:
```
Measurement ID: G-XXXXXXXXXX  ← COPIA ESTE CÓDIGO
```

Este ID debe estar en el HTML (ya configurado con placeholder)

### **PASO 3: Reemplazar el ID en HTML**

En `index.html`, busca y reemplaza:

```html
<!-- ANTES -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('config', 'G-XXXXXXXXXX', {

<!-- DESPUÉS (ejemplo) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF456"></script>
<script>
  gtag('config', 'G-ABC123DEF456', {
```

### **PASO 4: Verificar que Funciona**

1. Abre el sitio: https://glutationstore.com
2. Abre Developer Tools (F12) → Console
3. Escribe: `gtag('event', 'page_view')`
4. Espera 24 horas para que GA4 muestre datos

---

## 📊 EVENTOS PERSONALIZADOS A TRACKING

Estos eventos deben agregarse en `script.js`:

### **1. CHAT BOT EVENTS** 💬

```javascript
// Cuando usuario abre chat bot
function trackChatBotOpen() {
  gtag('event', 'chatbot_open', {
    'event_category': 'engagement',
    'event_label': 'chat_modal_opened',
    'timestamp': new Date().toISOString()
  });
}

// Cuando usuario envía mensaje
function trackChatMessage(userMessage, botResponse) {
  gtag('event', 'chatbot_message', {
    'event_category': 'engagement',
    'event_label': 'message_sent',
    'message_length': userMessage.length,
    'has_response': !!botResponse,
    'timestamp': new Date().toISOString()
  });
}

// Cuando bot detecta intención de compra
function trackPurchaseIntent(product) {
  gtag('event', 'chatbot_purchase_intent', {
    'event_category': 'engagement',
    'event_label': 'purchase_interest',
    'product_name': product,
    'traffic_source': 'chatbot',
    'timestamp': new Date().toISOString()
  });
}

// Cuando usuario redirige a WhatsApp desde chat
function trackChatToWhatsApp() {
  gtag('event', 'chatbot_whatsapp_redirect', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_click',
    'source_section': 'chatbot',
    'timestamp': new Date().toISOString()
  });
}
```

### **2. PRODUCT EVENTS** 🛍️

```javascript
// Cuando usuario ve producto
function trackProductView(productName, price) {
  gtag('event', 'view_item', {
    'items': [{
      'item_id': productName.toLowerCase().replace(/\s/g, '_'),
      'item_name': productName,
      'price': price,
      'currency': 'COP'
    }]
  });
}

// Cuando usuario agrega al carrito
function trackAddToCart(productName, price, quantity = 1) {
  gtag('event', 'add_to_cart', {
    'items': [{
      'item_id': productName.toLowerCase().replace(/\s/g, '_'),
      'item_name': productName,
      'price': price,
      'quantity': quantity,
      'currency': 'COP'
    }]
  });
}

// Cuando usuario ve carrito
function trackViewCart(totalValue, itemCount) {
  gtag('event', 'view_cart', {
    'value': totalValue,
    'currency': 'COP',
    'items': itemCount,
    'timestamp': new Date().toISOString()
  });
}

// Cuando usuario inicia checkout
function trackCheckoutStart(totalValue, itemCount) {
  gtag('event', 'begin_checkout', {
    'value': totalValue,
    'currency': 'COP',
    'items': itemCount,
    'timestamp': new Date().toISOString()
  });
}
```

### **3. CONVERSION EVENTS** ✅

```javascript
// Cuando usuario completa pedido
function trackPurchase(orderId, totalValue, items) {
  gtag('event', 'purchase', {
    'transaction_id': orderId,
    'value': totalValue,
    'currency': 'COP',
    'items': items.map(item => ({
      'item_id': item.name.toLowerCase().replace(/\s/g, '_'),
      'item_name': item.name,
      'price': item.price,
      'quantity': 1
    })),
    'timestamp': new Date().toISOString()
  });
}

// Cuando usuario completa información en checkout
function trackLeadCapture(fullName, phone, email, city) {
  gtag('event', 'generate_lead', {
    'event_category': 'conversion',
    'event_label': 'lead_captured',
    'user_name': fullName,
    'user_phone': phone,
    'user_email': email,
    'user_city': city,
    'timestamp': new Date().toISOString()
  });
}
```

### **4. WHATSAPP EVENTS** 💬

```javascript
// Cuando usuario hace click en WhatsApp (hero)
function trackWhatsAppClickHero() {
  gtag('event', 'click_whatsapp', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_hero_section',
    'section': 'hero',
    'timestamp': new Date().toISOString()
  });
}

// Cuando usuario hace click en WhatsApp (productos)
function trackWhatsAppClickProducts() {
  gtag('event', 'click_whatsapp', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_products_section',
    'section': 'products',
    'timestamp': new Date().toISOString()
  });
}

// Cuando usuario hace click en WhatsApp (CTA final)
function trackWhatsAppClickCTA() {
  gtag('event', 'click_whatsapp', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_cta_section',
    'section': 'cta_final',
    'timestamp': new Date().toISOString()
  });
}
```

### **5. SCROLL & ENGAGEMENT** 📱

```javascript
// Tracking de scroll profundidad
function trackScrollDepth(percentage) {
  gtag('event', 'scroll_depth', {
    'event_category': 'engagement',
    'event_label': `scroll_${percentage}percent`,
    'scroll_percentage': percentage,
    'timestamp': new Date().toISOString()
  });
}

// Tracking de tiempo en página
function trackTimeOnPage(seconds) {
  gtag('event', 'page_time', {
    'event_category': 'engagement',
    'event_label': 'time_on_page',
    'time_seconds': Math.round(seconds),
    'timestamp': new Date().toISOString()
  });
}
```

---

## 📝 INTEGRACIÓN EN script.js

Añade estas líneas en los lugares correctos de `script.js`:

### **En `addToCart()` function:**
```javascript
function addToCart(name, price, id) {
  // ... código existente ...
  
  // ✨ AGREGAR ESTO:
  trackAddToCart(name, price, 1);
  
  // ... resto del código ...
}
```

### **En `openCart()` function:**
```javascript
function openCart() {
  // ... código existente ...
  
  // ✨ AGREGAR ESTO:
  const totalValue = calculateTotal();
  const itemCount = cartItems.length;
  trackViewCart(totalValue, itemCount);
  
  // ... resto del código ...
}
```

### **En `proceedToCheckout()` function:**
```javascript
function proceedToCheckout() {
  // ... código existente ...
  
  // ✨ AGREGAR ESTO:
  const totalValue = calculateTotal();
  const itemCount = cartItems.length;
  trackCheckoutStart(totalValue, itemCount);
  
  // ... resto del código ...
}
```

### **En `submitOrder()` function:**
```javascript
function submitOrder(event) {
  // ... código existente ...
  
  // ✨ AGREGAR ESTO (antes de mostrar confirmación):
  const orderId = 'ORD_' + Date.now();
  const totalValue = calculateTotal();
  const items = cartItems.map(item => ({
    name: item.name,
    price: item.price
  }));
  
  trackPurchase(orderId, totalValue, items);
  trackLeadCapture(fullName, phone, email, city);
  
  // ... resto del código ...
}
```

### **En `openChatBot()` function:**
```javascript
function openChatBot() {
  // ... código existente ...
  
  // ✨ AGREGAR ESTO:
  trackChatBotOpen();
  
  // ... resto del código ...
}
```

### **En `processUserMessage()` function:**
```javascript
async function processUserMessage(message) {
  // ... código existente ...
  
  // ✨ AGREGAR ESTO:
  trackChatMessage(message, botResponse);
  
  // Si detecta intención de compra:
  if (message.toLowerCase().includes('comprar') || 
      message.toLowerCase().includes('quiero')) {
    trackPurchaseIntent(detectedProduct);
  }
  
  // ... resto del código ...
}
```

---

## 📊 DASHBOARD RECOMENDADO

Crear un Dashboard personalizado en GA4 con estas métricas:

### **Tabla 1: Overview**
```
Métrica              | Objetivo | Frecuencia
─────────────────────┼──────────┼──────────
Sesiones totales     | ↗ crecer | Diario
Usuarios nuevos      | ↗ crecer | Diario
Tasa de rebote       | ↘ bajar  | Semanal
Tiempo promedio      | ↗ crecer | Semanal
```

### **Tabla 2: Conversiones**
```
Evento                   | Objetivo  | Meta Mes 1
────────────────────────┼───────────┼──────────
view_item               | 500+      | ↗
add_to_cart             | 50+       | ↗
begin_checkout          | 20+       | ↗
purchase                | 5+        | ↗
generate_lead           | 10+       | ↗
```

### **Tabla 3: Chat Bot**
```
Evento                   | Objetivo  | Meta Mes 1
────────────────────────┼───────────┼──────────
chatbot_open            | 100+      | ↗
chatbot_message         | 300+      | ↗
chatbot_purchase_intent | 30+       | ↗
chatbot_whatsapp_redirect| 20+      | ↗
```

### **Tabla 4: WhatsApp**
```
Evento                   | Objetivo  | Meta Mes 1
────────────────────────┼───────────┼──────────
click_whatsapp (hero)    | 50+       | ↗
click_whatsapp (products)| 80+       | ↗
click_whatsapp (cta)     | 30+       | ↗
```

---

## 🎯 SEGMENTACIÓN IMPORTANTE

Crear segmentos en GA4 para análisis:

### **Segmento 1: Chat Bot Users**
```
Condición: Event Name = chatbot_*
Acción: Ver conversión de chat bot usuarios
Meta: Medir efectividad del bot
```

### **Segmento 2: WhatsApp Traffic**
```
Condición: Event Label = whatsapp_*
Acción: Medir clics a WhatsApp
Meta: Optimizar botones WhatsApp
```

### **Segmento 3: Compradores**
```
Condición: Event Name = purchase
Acción: Analizar ruta de compra
Meta: Entender customer journey
```

### **Segmento 4: Abandonos de Carrito**
```
Condición: add_to_cart BUT NOT purchase
Acción: Identificar por qué no compran
Meta: Mejorar checkout
```

---

## 📈 OBJETIVOS DE CONVERSIÓN

Crear estos objetivos en GA4:

```
Objetivo 1: Lead Generated
├─ Evento: generate_lead
├─ Valor: $50 COP promedio
└─ Prioridad: Alta

Objetivo 2: Purchase Complete
├─ Evento: purchase
├─ Valor: Dinámico (precio real)
└─ Prioridad: Crítica

Objetivo 3: Chat Engagement
├─ Evento: chatbot_purchase_intent
├─ Valor: $30 COP promedio
└─ Prioridad: Media

Objetivo 4: WhatsApp Click
├─ Evento: click_whatsapp
├─ Valor: $20 COP promedio
└─ Prioridad: Media
```

---

## 💰 ATTRIBUTION & REVENUE

Configurar tracking de ingresos:

```javascript
// Cuando se completa una venta, incluir valor
gtag('event', 'purchase', {
  'transaction_id': orderId,
  'value': totalValue,        // ← IMPORTANTE
  'currency': 'COP',          // ← IMPORTANTE
  'items': items
});
```

Esto permite que GA4 calcule:
- Revenue por fuente (búsqueda orgánica, directo, etc)
- Revenue por dispositivo (mobile, desktop)
- Revenue por ubicación geográfica
- ROAS (Return on Ad Spend)

---

## 🔍 MONITOREO MENSUAL

Crear un ritual mensual:

### **Primer lunes de cada mes:**

1. **Abrir Google Analytics 4**
2. **Revisar estas métricas:**
   ```
   ✓ Sesiones nuevas vs mes anterior
   ✓ Tasa de conversión (compras/sesiones)
   ✓ Ingreso total generado
   ✓ Top 5 productos vendidos
   ✓ Top 5 fuentes de tráfico
   ✓ Efectividad del chat bot
   ✓ Clics a WhatsApp
   ✓ Tasa de abandono carrito
   ```

3. **Crear reporte ejecutivo:**
   ```
   Resumen ejecutivo - [Mes/Año]
   ═════════════════════════════
   Sesiones:           XXX
   Conversiones:       XX
   Ingresos:          $X,XXX
   Tasa conversión:   X.X%
   Bot effectiveness: XX%
   ```

4. **Cambios recomendados:**
   - ¿Qué funcionó bien?
   - ¿Qué no funcionó?
   - ¿Qué optimizar?

---

## ⚠️ ERRORES COMUNES

```
❌ NO hagas:
├─ No uses 'send_pageview' (ya está automático)
├─ No rastrées datos sensibles (passwords, credit cards)
├─ No cambies el ID de GA sin avisar
├─ No confundas sesiones con usuarios
├─ No ignores datos de 24h de espera inicial
└─ No publiques datos de analytics públicamente

✅ HAZ esto:
├─ Verifica eventos en Real-time (primeras 24h)
├─ Espera 24-48h antes de sacar conclusiones
├─ Revisa dashboards semanalmente
├─ Crea reportes mensuales
├─ Comparte insights con el equipo
└─ Optimiza basado en datos
```

---

## 🚀 VALIDACIÓN RÁPIDA

Para verificar que GA4 funciona:

1. Abre el sitio en incógnito
2. Abre DevTools → Network
3. Busca requests a "google-analytics" o "gtag"
4. Deben mostrar status 200 ✅
5. En GA4 → Real-time → Verás tu sesión

---

## 📞 RECURSOS ÚTILES

**Documentación Oficial:**
- [Google Analytics Help](https://support.google.com/analytics)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9267744)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/10089681)

**Herramientas:**
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382) - Ver eventos en tiempo real
- [Google Analytics Assistant](https://support.google.com/analytics/answer/11521456) - AI insights
- [Google Workspace Integration](https://support.google.com/analytics/answer/1033841) - Reportes automáticos a Gmail

---

## ✅ CHECKLIST SETUP GA4

```
[ ] Crear propiedad en Google Analytics
[ ] Obtener Measurement ID (G-XXXXXXXXXX)
[ ] Reemplazar ID en index.html
[ ] Agregar funciones de tracking en script.js
[ ] Integrar eventos en funciones clave
[ ] Verificar en Real-time (primeras 24h)
[ ] Crear dashboard personalizado
[ ] Configurar segmentos
[ ] Configurar objetivos de conversión
[ ] Crear calendario para revisiones mensuales
[ ] Avisar a equipo sobre nuevo tracking
[ ] Documentar eventos en wiki/notion
```

---

**Estado:** 🚀 Listo para implementar  
**Tiempo setup:** 10 min + integración en script.js (30 min)  
**Valor:** Visibility completa del negocio  

¡Adelante! 📊
