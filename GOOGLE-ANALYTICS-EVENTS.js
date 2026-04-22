/**
 * ========================================
 * GOOGLE ANALYTICS 4 - TRACKING EVENTS
 * Glutation Store - E-commerce + Chat Bot
 * ========================================
 *
 * INSTRUCCIONES:
 * 1. Copiar todas estas funciones al FINAL de script.js
 * 2. Llamar a estas funciones en los lugares indicados
 * 3. Reemplazar G-XXXXXXXXXX con tu Measurement ID
 *
 * NOTA: El script GA4 ya debe estar en el <head> del HTML
 */

// ========================================
// 1. CHAT BOT EVENTS
// ========================================

/**
 * Track cuando usuario abre el chat bot
 * Llamar en: openChatBot() function
 */
function trackChatBotOpen() {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'chatbot_open', {
    'event_category': 'engagement',
    'event_label': 'chat_modal_opened',
    'timestamp': new Date().toISOString(),
    'page_title': document.title,
    'page_location': window.location.href
  });

  console.log('✓ GA4: Chat bot abierto');
}

/**
 * Track cuando usuario envía mensaje en chat
 * Llamar en: processUserMessage() function
 */
function trackChatMessage(userMessage, botResponse) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'chatbot_message', {
    'event_category': 'engagement',
    'event_label': 'message_sent',
    'message_length': userMessage.length,
    'has_response': !!botResponse,
    'message_type': detectMessageType(userMessage),
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Mensaje chat registrado');
}

/**
 * Track cuando bot detecta intención de compra
 * Llamar en: processUserMessage() cuando detecta keywords
 */
function trackPurchaseIntent(product) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'chatbot_purchase_intent', {
    'event_category': 'engagement',
    'event_label': 'purchase_interest_detected',
    'product_name': product,
    'traffic_source': 'chatbot',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Intención de compra detectada:', product);
}

/**
 * Track cuando usuario redirige a WhatsApp desde chat
 * Llamar en: cuando se abre link de WhatsApp desde chat bot
 */
function trackChatToWhatsApp() {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'chatbot_whatsapp_redirect', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_click_from_chat',
    'source_section': 'chatbot',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Redirección a WhatsApp desde chat');
}

// ========================================
// 2. PRODUCT EVENTS
// ========================================

/**
 * Track cuando usuario ve un producto
 * Llamar en: Al cargar la página o cuando usuario hace scroll a productos
 */
function trackProductView(productName, productPrice, productId) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'view_item', {
    'items': [{
      'item_id': productId || productName.toLowerCase().replace(/\s/g, '_'),
      'item_name': productName,
      'price': productPrice,
      'currency': 'COP',
      'item_category': categorizeProduct(productName)
    }],
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Producto visto:', productName);
}

/**
 * Track cuando usuario agrega producto al carrito
 * Llamar en: addToCart() function - DESPUÉS de agregar
 */
function trackAddToCart(productName, price, quantity = 1) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'add_to_cart', {
    'items': [{
      'item_id': productName.toLowerCase().replace(/\s/g, '_'),
      'item_name': productName,
      'price': price,
      'quantity': quantity,
      'currency': 'COP',
      'item_category': categorizeProduct(productName)
    }],
    'value': price * quantity,
    'currency': 'COP',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Producto agregado al carrito:', productName);
}

/**
 * Track cuando usuario quita producto del carrito
 * Llamar en: removeFromCart() function
 */
function trackRemoveFromCart(productName, price) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'remove_from_cart', {
    'items': [{
      'item_id': productName.toLowerCase().replace(/\s/g, '_'),
      'item_name': productName,
      'price': price,
      'currency': 'COP'
    }],
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Producto removido del carrito:', productName);
}

/**
 * Track cuando usuario ve el carrito
 * Llamar en: openCart() function - DESPUÉS de mostrar carrito
 */
function trackViewCart(totalValue, itemCount) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'view_cart', {
    'value': totalValue,
    'currency': 'COP',
    'items_count': itemCount,
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Carrito visto. Total:', totalValue, 'Items:', itemCount);
}

// ========================================
// 3. CHECKOUT EVENTS
// ========================================

/**
 * Track cuando usuario inicia el checkout
 * Llamar en: proceedToCheckout() function
 */
function trackCheckoutStart(totalValue, itemCount) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'begin_checkout', {
    'value': totalValue,
    'currency': 'COP',
    'items_count': itemCount,
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Checkout iniciado. Total:', totalValue);
}

/**
 * Track información de envío capturada
 * Llamar en: submitOrder() function - ANTES de procesar pago
 */
function trackLeadCapture(fullName, phone, email, city) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'generate_lead', {
    'event_category': 'conversion',
    'event_label': 'lead_captured',
    'user_name': fullName,
    'user_phone': phone,
    'user_email': email,
    'user_city': city,
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Lead capturado:', fullName, phone);
}

/**
 * Track cuando usuario completa compra exitosamente
 * Llamar en: submitOrder() function - DESPUÉS de procesar pago
 *
 * IMPORTANTE: Este es el evento de mayor valor - conversion principal
 */
function trackPurchase(orderId, totalValue, items, customerInfo = {}) {
  if (typeof gtag === 'undefined') return;

  const itemsArray = items.map(item => ({
    'item_id': item.id || item.name.toLowerCase().replace(/\s/g, '_'),
    'item_name': item.name,
    'price': item.price,
    'quantity': item.quantity || 1,
    'currency': 'COP',
    'item_category': categorizeProduct(item.name)
  }));

  gtag('event', 'purchase', {
    'transaction_id': orderId,
    'value': totalValue,
    'currency': 'COP',
    'items': itemsArray,
    'shipping': 0, // Envío incluido en Glutation Store
    'tax': 0,      // No hay IVA adicional
    'coupon': customerInfo.coupon || '',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Compra registrada. Order ID:', orderId, 'Total:', totalValue);
}

// ========================================
// 4. WHATSAPP CLICK EVENTS
// ========================================

/**
 * Track click en WhatsApp - Sección Hero
 * Llamar en: todos los links de WhatsApp en hero
 */
function trackWhatsAppClickHero() {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'click_whatsapp', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_hero_section',
    'section': 'hero',
    'button_text': 'Hablar por WhatsApp',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: WhatsApp click - Hero section');
}

/**
 * Track click en WhatsApp - Sección Productos
 * Llamar en: link de WhatsApp en sección de productos
 */
function trackWhatsAppClickProducts() {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'click_whatsapp', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_products_section',
    'section': 'products',
    'button_text': 'Hablar por WhatsApp',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: WhatsApp click - Products section');
}

/**
 * Track click en WhatsApp - CTA Final
 * Llamar en: botones de WhatsApp en sección final/footer
 */
function trackWhatsAppClickCTA() {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'click_whatsapp', {
    'event_category': 'conversion',
    'event_label': 'whatsapp_cta_final_section',
    'section': 'cta_final',
    'button_text': 'Hablar por WhatsApp',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: WhatsApp click - CTA Final section');
}

// ========================================
// 5. ENGAGEMENT EVENTS
// ========================================

/**
 * Track profundidad de scroll
 * Llamar en: event listener de scroll
 */
function trackScrollDepth(percentage) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'scroll_depth', {
    'event_category': 'engagement',
    'event_label': `scroll_${percentage}percent`,
    'scroll_percentage': percentage,
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Scroll depth registrado:', percentage + '%');
}

/**
 * Track tiempo en página
 * Llamar en: cuando usuario abandona página o cada X segundos
 */
function trackTimeOnPage(seconds) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'page_time', {
    'event_category': 'engagement',
    'event_label': 'time_on_page',
    'time_seconds': Math.round(seconds),
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Tiempo en página registrado:', seconds + 's');
}

/**
 * Track cuando usuario hace click en CTA
 * Llamar en: cualquier botón principal (Comprar, etc)
 */
function trackCTAClick(ctaText, section) {
  if (typeof gtag === 'undefined') return;

  gtag('event', 'cta_click', {
    'event_category': 'engagement',
    'event_label': ctaText,
    'section': section,
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: CTA click:', ctaText);
}

// ========================================
// 6. FUNCIONES HELPER
// ========================================

/**
 * Detectar tipo de mensaje (pregunta, compra, etc)
 */
function detectMessageType(message) {
  const lower = message.toLowerCase();

  if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuánto')) {
    return 'pricing_inquiry';
  } else if (lower.includes('comprar') || lower.includes('quiero') || lower.includes('pedir')) {
    return 'purchase_intent';
  } else if (lower.includes('envío') || lower.includes('cuánto tarda')) {
    return 'shipping_inquiry';
  } else if (lower.includes('beneficio') || lower.includes('qué es')) {
    return 'product_info';
  } else {
    return 'general_inquiry';
  }
}

/**
 * Categorizar producto automáticamente
 */
function categorizeProduct(productName) {
  const name = productName.toLowerCase();

  if (name.includes('regular') || name.includes('platinum') || name.includes('immunocal')) {
    return 'Immunocal';
  } else if (name.includes('optimizer') || name.includes('rojos') || name.includes('verdes')) {
    return 'Optimizer';
  } else if (name.includes('café')) {
    return 'Café';
  } else if (name.includes('vaso') || name.includes('mezclador')) {
    return 'Accesorios';
  } else if (name.includes('paquete')) {
    return 'Paquetes';
  } else {
    return 'Otro';
  }
}

// ========================================
// 7. AUTO-TRACKING (OPCIONAL)
// ========================================

/**
 * Setup automático de tracking cuando página carga
 * Descomentar si quieres que se ejecute automáticamente
 */
function setupAutoTracking() {
  // Scroll depth tracking
  let scrollDepthTracked = {25: false, 50: false, 75: false, 90: false};

  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

    if (scrollPercent >= 25 && !scrollDepthTracked[25]) {
      trackScrollDepth(25);
      scrollDepthTracked[25] = true;
    }
    if (scrollPercent >= 50 && !scrollDepthTracked[50]) {
      trackScrollDepth(50);
      scrollDepthTracked[50] = true;
    }
    if (scrollPercent >= 75 && !scrollDepthTracked[75]) {
      trackScrollDepth(75);
      scrollDepthTracked[75] = true;
    }
    if (scrollPercent >= 90 && !scrollDepthTracked[90]) {
      trackScrollDepth(90);
      scrollDepthTracked[90] = true;
    }
  });

  // Time on page tracking (cada 30 segundos)
  let timeOnPageSeconds = 0;
  setInterval(() => {
    timeOnPageSeconds += 30;
    if (timeOnPageSeconds % 60 === 0) {
      trackTimeOnPage(timeOnPageSeconds);
    }
  }, 30000);

  console.log('✓ Auto-tracking de GA4 inicializado');
}

// Descomentar para activar auto-tracking:
// setupAutoTracking();

// ========================================
// FIN - GOOGLE ANALYTICS 4 EVENTS
// ========================================

/*
 * INSTRUCCIONES DE INTEGRACIÓN:
 *
 * 1. Copiar TODO este archivo al final de script.js
 *
 * 2. En openChatBot() agregar:
 *    trackChatBotOpen();
 *
 * 3. En processUserMessage() agregar:
 *    trackChatMessage(message, botResponse);
 *    if (hasPurchaseIntent) trackPurchaseIntent(product);
 *
 * 4. En addToCart() agregar:
 *    trackAddToCart(productName, price, 1);
 *
 * 5. En openCart() agregar:
 *    trackViewCart(calculateTotal(), cartItems.length);
 *
 * 6. En proceedToCheckout() agregar:
 *    trackCheckoutStart(calculateTotal(), cartItems.length);
 *
 * 7. En submitOrder() agregar:
 *    const orderId = 'ORD_' + Date.now();
 *    trackLeadCapture(fullName, phone, email, city);
 *    trackPurchase(orderId, totalValue, items);
 *
 * 8. En links de WhatsApp agregar:
 *    onclick="trackWhatsAppClickHero(); window.open(...)"
 *    onclick="trackWhatsAppClickProducts(); window.open(...)"
 *    onclick="trackWhatsAppClickCTA(); window.open(...)"
 *
 * 9. Descomenta setupAutoTracking() si quieres scroll + time tracking automático
 *
 * 10. Verificar en GA4 Real-time dashboard
 */
