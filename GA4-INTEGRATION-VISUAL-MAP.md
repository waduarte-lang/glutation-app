# 🗺️ Mapa Visual de Integración GA4 en script.js

## Guía Visual - Dónde se Integró Cada Tracking

```
═══════════════════════════════════════════════════════════════════════════════
                         SCRIPT.JS - ESTRUCTURA COMPLETA
═══════════════════════════════════════════════════════════════════════════════

SECCIÓN 1: CARRITO (Líneas 1-444)
├── addToCart(name, price, productId)
│   ├── Crear producto
│   ├── Buscar en carrito
│   ├── Guardar en localStorage
│   ├── updateCartUI()
│   └── ✅ trackAddToCart(name, price, 1) ← TRACKING AGREGADO
│
├── openCart()
│   ├── Mostrar modal
│   └── ✅ trackViewCart(calculateTotal(), cart.items.length) ← TRACKING
│
├── openCheckout()
│   ├── Cerrar carrito modal
│   ├── Abrir checkout modal
│   ├── Mostrar total
│   └── ✅ trackCheckoutStart(totalWithShipping, cart.items.length) ← TRACKING
│
├── submitOrder(event)
│   ├── Validar datos
│   ├── Crear objeto orden
│   ├── ✅ trackLeadCapture(fullName, phone, email, city) ← TRACKING
│   ├── ✅ trackPurchase(orderId, order.total, items) ← TRACKING ⭐ IMPORTANTE
│   ├── Guardar orden en localStorage
│   └── showOrderConfirmation()
│
└── shareOrderWhatsApp()
    ├── Generar mensaje
    ├── ✅ trackWhatsAppClickCTA() ← TRACKING
    └── window.open(whatsapp_url)

═══════════════════════════════════════════════════════════════════════════════

SECCIÓN 2: CHAT BOT (Líneas 446-943)
├── Event Listeners (Líneas 521-538)
│   └── openChatBotButtons → addEventListener('click', openChat)
│
├── openChat()
│   ├── Agregar clase 'active'
│   ├── Focus en input
│   └── ✅ trackChatBotOpen() ← TRACKING AGREGADO
│
├── sendMessage()
│   ├── Obtener mensaje del input
│   ├── addMessage(message, 'user')
│   ├── await processUserMessage(message)
│   ├── Validar respuesta
│   ├── addMessage(response.text, 'bot')
│   ├── ✅ trackChatMessage(message, response.text) ← TRACKING AGREGADO
│   └── Manejo de errores
│
├── processUserMessage(message) - ASYNC
│   ├── POST /api/chat
│   ├── Extraer userData
│   └── return { text, options }
│
└── processUserMessage_Keyword(message) - FALLBACK
    ├── Análisis de palabras clave
    └── return response

═══════════════════════════════════════════════════════════════════════════════

SECCIÓN 3: CRM + EVENTOS (Líneas 826-924)
├── captureEvent(eventName, data)
│   ├── Crear objeto evento
│   ├── if (typeof gtag !== 'undefined')
│   │   └── gtag('event', eventName, data) ← GTAG AUTOMÁTICO
│   └── console.log
│
├── captureLead(name, phone, email, interest)
│   ├── Crear objeto lead
│   ├── crmData.leads.push(lead)
│   ├── captureEvent('lead_captured', {...})
│   └── console.log
│
└── Inicialización DOMContentLoaded
    ├── captureEvent('page_view')
    ├── WhatsApp links listeners
    └── Scroll tracking listeners

═══════════════════════════════════════════════════════════════════════════════

SECCIÓN 4: GOOGLE ANALYTICS 4 - FUNCIONES AGREGADAS (Líneas 944+)
├── CHAT BOT EVENTS
│   ├── ✅ trackChatBotOpen()
│   ├── ✅ trackChatMessage(userMessage, botResponse)
│   ├── ✅ trackPurchaseIntent(product)
│   └── ✅ trackChatToWhatsApp()
│
├── PRODUCT EVENTS
│   ├── trackProductView(productName, productPrice, productId)
│   ├── ✅ trackAddToCart(productName, price, quantity)
│   ├── trackRemoveFromCart(productName, price)
│   └── ✅ trackViewCart(totalValue, itemCount)
│
├── CHECKOUT EVENTS
│   ├── ✅ trackCheckoutStart(totalValue, itemCount)
│   ├── ✅ trackLeadCapture(fullName, phone, email, city)
│   └── ✅ trackPurchase(orderId, totalValue, items, customerInfo)
│
├── WHATSAPP EVENTS
│   ├── trackWhatsAppClickHero()
│   ├── trackWhatsAppClickProducts()
│   └── ✅ trackWhatsAppClickCTA()
│
├── ENGAGEMENT EVENTS
│   ├── trackScrollDepth(percentage)
│   ├── trackTimeOnPage(seconds)
│   └── trackCTAClick(ctaText, section)
│
├── HELPER FUNCTIONS
│   ├── detectMessageType(message)
│   │   └── Retorna: pricing_inquiry, purchase_intent, shipping_inquiry, product_info, general_inquiry
│   │
│   ├── categorizeProduct(productName)
│   │   └── Retorna: Immunocal, Optimizer, Café, Accesorios, Paquetes, Otro
│   │
│   └── setupAutoTracking() [OPCIONAL]
│       ├── Scroll depth tracking automático (25%, 50%, 75%, 90%)
│       └── Time on page tracking cada 30 segundos

═══════════════════════════════════════════════════════════════════════════════
```

---

## 📍 LOCALIZACIONES EXACTAS - FUNCIÓN POR FUNCIÓN

### 1️⃣ **trackChatBotOpen()**
```
📍 INTEGRACIÓN: openChat()
📍 LÍNEA: ~545 (después de chatInput.focus())
✅ ESTADO: Integrado

Código:
    function openChat() {
      chatModal.classList.add('active');
      chatModal.setAttribute('aria-hidden', 'false');
      chatInput.focus();
      captureEvent('chat_opened');
      trackChatBotOpen(); // ← AQUÍ
    }

🎯 EVENTO GA4: chatbot_open
📊 DATOS: category=engagement, label=chat_modal_opened, timestamp
```

---

### 2️⃣ **trackChatMessage()**
```
📍 INTEGRACIÓN: sendMessage() / async function
📍 LÍNEA: ~576 (después de addMessage(response.text, 'bot'))
✅ ESTADO: Integrado

Código:
    // Mostrar respuesta
    addMessage(response.text, 'bot', response.options || []);

    // GA4: Track chat message
    trackChatMessage(message, response.text); // ← AQUÍ

🎯 EVENTO GA4: chatbot_message
📊 DATOS: message_length, has_response, message_type, timestamp
```

---

### 3️⃣ **trackAddToCart()**
```
📍 INTEGRACIÓN: addToCart()
📍 LÍNEA: ~51 (después de updateCartUI())
✅ ESTADO: Integrado

Código:
    cart.total = calculateTotal();
    saveCart();
    updateCartUI();
    
    // Mostrar notificación
    showNotification(`${name} agregado al carrito ✅`);

    // GA4: Track add to cart
    trackAddToCart(name, price, 1); // ← AQUÍ

🎯 EVENTO GA4: add_to_cart
📊 DATOS: item_id, item_name, price, quantity, currency=COP, item_category
```

---

### 4️⃣ **trackViewCart()**
```
📍 INTEGRACIÓN: openCart()
📍 LÍNEA: ~170 (después de classList.add('active'))
✅ ESTADO: Integrado

Código:
    function openCart() {
      document.getElementById('cartModal').classList.add('active');
      document.getElementById('cartOverlay').classList.add('active');
      // GA4: Track view cart
      trackViewCart(calculateTotal(), cart.items.length); // ← AQUÍ
    }

🎯 EVENTO GA4: view_cart
📊 DATOS: value, currency=COP, items_count, timestamp
```

---

### 5️⃣ **trackCheckoutStart()**
```
📍 INTEGRACIÓN: openCheckout()
📍 LÍNEA: ~195 (al final de la función)
✅ ESTADO: Integrado

Código:
    // GA4: Track checkout start
    trackCheckoutStart(totalWithShipping, cart.items.length); // ← AQUÍ

🎯 EVENTO GA4: begin_checkout
📊 DATOS: value, currency=COP, items_count, timestamp
```

---

### 6️⃣ **trackLeadCapture() + trackPurchase()**
```
📍 INTEGRACIÓN: submitOrder()
📍 LÍNEA: ~241-243 (después de generar orderId, ANTES de guardar)
✅ ESTADO: Integrado

Código:
    // GA4: Track lead capture (before order confirmation)
    trackLeadCapture(fullName, phone, email, city); // ← AQUÍ #1

    // GA4: Track purchase (conversion event)
    trackPurchase(orderId, order.total, cart.items, {}); // ← AQUÍ #2

🎯 EVENTO GA4 #1: generate_lead
📊 DATOS: user_name, user_phone, user_email, user_city, timestamp

🎯 EVENTO GA4 #2: purchase ⭐ MÁS IMPORTANTE
📊 DATOS: transaction_id, value, currency, items[], shipping, tax, timestamp
```

---

### 7️⃣ **trackWhatsAppClickCTA()**
```
📍 INTEGRACIÓN: shareOrderWhatsApp()
📍 LÍNEA: ~323 (antes de window.open)
✅ ESTADO: Integrado

Código:
    // GA4: Track WhatsApp click from order confirmation
    trackWhatsAppClickCTA(); // ← AQUÍ

    window.open(`https://wa.me/573105356668?text=${message}`, '_blank');

🎯 EVENTO GA4: click_whatsapp
📊 DATOS: section=cta_final, button_text=Hablar por WhatsApp, timestamp
```

---

## 🔄 FLUJO COMPLETO - USUARIO A EVENTO

### **Escenario 1: Usuario Abre Chat**
```
USUARIO ACCIÓN:
  Click en botón "Hablar con IA" → abre modal chat

CÓDIGO EJECUTADO:
  openChat()
    └── trackChatBotOpen() ✅
          └── gtag('event', 'chatbot_open', {...})

GA4 RECIBE:
  event: 'chatbot_open'
  category: 'engagement'
  label: 'chat_modal_opened'
```

### **Escenario 2: Usuario Compra Producto**
```
USUARIO ACCIONES:
  1. Click "Agregar al Carrito"
  2. Click botón Carrito
  3. Click "Proceder al Pago"
  4. Completa formulario
  5. Click "Confirmar Compra"
  6. Click "Enviar por WhatsApp"

CÓDIGO EJECUTADO:
  1. addToCart() → trackAddToCart() ✅
  2. openCart() → trackViewCart() ✅
  3. openCheckout() → trackCheckoutStart() ✅
  4. [formulario validado]
  5. submitOrder()
     ├── trackLeadCapture() ✅
     └── trackPurchase() ✅ ⭐
  6. shareOrderWhatsApp() → trackWhatsAppClickCTA() ✅

GA4 RECIBE: 7 eventos
  ✓ add_to_cart
  ✓ view_cart
  ✓ begin_checkout
  ✓ generate_lead
  ✓ purchase (CONVERSIÓN)
  ✓ click_whatsapp
```

---

## 🔍 VERIFICACIÓN - CÓMO VER LOS EVENTOS

### **En DevTools Console**
```javascript
// Cuando usuario abre chat:
✓ GA4: Chat bot abierto

// Cuando usuario envía mensaje:
✓ GA4: Mensaje chat registrado

// Cuando usuario agrega al carrito:
✓ GA4: Producto agregado al carrito: Immunocal Platinum

// Cuando usuario ve carrito:
✓ GA4: Carrito visto. Total: 315000 Items: 1

// Cuando usuario va a checkout:
✓ GA4: Checkout iniciado. Total: 340000

// Cuando usuario completa compra:
✓ GA4: Lead capturado: Juan Pérez 3105356668
✓ GA4: Compra registrada. Order ID: PED-1234567890 Total: 340000
```

### **En Google Analytics Real-time**
1. Abre https://analytics.google.com
2. Selecciona "Glutation Store"
3. Reports → Real-time
4. Ve los eventos actualizarse mientras interactúas

---

## 📊 MATRIZ DE INTEGRACIÓN

| # | Función | Línea | Función Llamadora | Evento GA4 | Estado |
|---|---------|-------|-------------------|-----------|--------|
| 1 | `trackChatBotOpen()` | 945 | `openChat()` ~545 | `chatbot_open` | ✅ |
| 2 | `trackChatMessage()` | 967 | `sendMessage()` ~576 | `chatbot_message` | ✅ |
| 3 | `trackAddToCart()` | 1093 | `addToCart()` ~51 | `add_to_cart` | ✅ |
| 4 | `trackViewCart()` | 1149 | `openCart()` ~170 | `view_cart` | ✅ |
| 5 | `trackCheckoutStart()` | 1173 | `openCheckout()` ~195 | `begin_checkout` | ✅ |
| 6 | `trackLeadCapture()` | 1195 | `submitOrder()` ~241 | `generate_lead` | ✅ |
| 7 | `trackPurchase()` | 1223 | `submitOrder()` ~243 | `purchase` ⭐ | ✅ |
| 8 | `trackWhatsAppClickCTA()` | 1306 | `shareOrderWhatsApp()` ~323 | `click_whatsapp` | ✅ |
| 9 | `trackProductView()` | 1096 | (no integrado aún) | `view_item` | ⏳ |
| 10 | `trackRemoveFromCart()` | 1125 | (no integrado aún) | `remove_from_cart` | ⏳ |
| 11 | `trackPurchaseIntent()` | 990 | (no integrado aún) | `chatbot_purchase_intent` | ⏳ |

---

## 🎯 RESUMEN

**Total de integraciones completadas: 8/11**

✅ **Completadas:**
- Chat Bot: 2/4 (open, message)
- Shopping: 4/4 (add, view, checkout, purchase) ⭐
- WhatsApp: 1/3 (CTA final)

⏳ **Opcionales (pueden agregarse después):**
- Product view tracking
- Remove from cart tracking
- Purchase intent detection

---

## 🚀 Próximo Paso

Tú necesitas:

1. **Obtener tu GA4 Measurement ID:**
   - Ve a https://analytics.google.com
   - Crea propiedad "Glutation Store"
   - Copia tu Measurement ID (ej: G-ABC123DEF456)

2. **Reemplazar en index.html:**
   - Busca: `G-XXXXXXXXXX`
   - Reemplaza con: Tu ID real

3. **Verificar:**
   - Abre el sitio
   - DevTools → Console → busca "✓ GA4:"
   - Interactúa con el sitio
   - Espera 10 segundos y ve Real-time en GA4

**Todo lo demás está listo!** 🎉

---

*Mapa de Integración v1.0 - 2026-04-21*
