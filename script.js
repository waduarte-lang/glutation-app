// ============================================
// GLUTATION STORE - CARRITO DE COMPRAS
// ============================================

// Estado del carrito
let cart = {
  items: [],
  total: 0,
  shipping: 25000 // Costo de envío en pesos
};

// Cargar carrito desde localStorage
function loadCart() {
  const saved = localStorage.getItem('glutationCart');
  if (saved) {
    cart = JSON.parse(saved);
    // Asegurar que tiene shipping definido
    if (!cart.shipping) {
      cart.shipping = 25000;
    }
    updateCartUI();
  }
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('glutationCart', JSON.stringify(cart));
}

// Agregar producto al carrito
function addToCart(name, price, productId) {
  const product = {
    id: productId,
    name: name,
    price: price,
    quantity: 1
  };

  // Buscar si ya existe el producto
  const existingItem = cart.items.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push(product);
  }

  cart.total = calculateTotal();
  saveCart();
  updateCartUI();

  // Mostrar notificación
  showNotification(`${name} agregado al carrito ✅`);

  // GA4: Track add to cart
  trackAddToCart(name, price, 1);

  // Abrir carrito automáticamente
  setTimeout(() => {
    openCart();
  }, 500);
}

// Calcular total (sin envío - solo subtotal)
function calculateTotal() {
  return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Calcular total con envío
function calculateTotalWithShipping() {
  const shipping = (cart && cart.shipping) || 25000;
  return calculateTotal() + shipping;
}

// Actualizar UI del carrito
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const emptyCart = document.getElementById('emptyCart');
  const cartItems = document.getElementById('cartItems');
  const itemsList = document.getElementById('itemsList');

  // Actualizar contador
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.style.display = 'inline';
  } else {
    cartCount.style.display = 'none';
  }

  // Mostrar carrito vacío o con items
  if (cart.items.length === 0) {
    emptyCart.style.display = 'block';
    cartItems.style.display = 'none';
  } else {
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';

    // Renderizar items
    itemsList.innerHTML = cart.items.map((item, index) => `
      <div class="cart-item">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p class="item-price">$${item.price.toLocaleString('es-CO')}</p>
        </div>
        <div class="item-quantity">
          <button onclick="decreaseQuantity(${index})" class="qty-btn">−</button>
          <input type="number" value="${item.quantity}" min="1" onchange="setQuantity(${index}, this.value)" class="qty-input" />
          <button onclick="increaseQuantity(${index})" class="qty-btn">+</button>
        </div>
        <div class="item-total">
          $${(item.price * item.quantity).toLocaleString('es-CO')}
        </div>
        <button onclick="removeFromCart(${index})" class="remove-btn" title="Eliminar">🗑️</button>
      </div>
    `).join('');

    // Actualizar total
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.shipping || 25000;
    const total = subtotal + shipping;
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('shipping').textContent = `$${shipping.toLocaleString('es-CO')}`;
    document.getElementById('total').textContent = `$${total.toLocaleString('es-CO')}`;
  }
}

// Aumentar cantidad
function increaseQuantity(index) {
  if (cart.items[index]) {
    cart.items[index].quantity += 1;
    cart.total = calculateTotal();
    saveCart();
    updateCartUI();
  }
}

// Disminuir cantidad
function decreaseQuantity(index) {
  if (cart.items[index] && cart.items[index].quantity > 1) {
    cart.items[index].quantity -= 1;
    cart.total = calculateTotal();
    saveCart();
    updateCartUI();
  }
}

// Establecer cantidad
function setQuantity(index, value) {
  const qty = parseInt(value) || 1;
  if (cart.items[index]) {
    cart.items[index].quantity = Math.max(1, qty);
    cart.total = calculateTotal();
    saveCart();
    updateCartUI();
  }
}

// Eliminar producto
function removeFromCart(index) {
  if (confirm('¿Eliminar este producto?')) {
    cart.items.splice(index, 1);
    cart.total = calculateTotal();
    saveCart();
    updateCartUI();
  }
}

// Abrir carrito
function openCart() {
  document.getElementById('cartModal').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
  // GA4: Track view cart
  trackViewCart(calculateTotal(), cart.items.length);
}

// Cerrar carrito
function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
}

// Proceder al checkout
function proceedToCheckout() {
  if (cart.items.length === 0) {
    showNotification('El carrito está vacío');
    return;
  }
  openCheckout();
}

// Abrir checkout
function openCheckout() {
  document.getElementById('cartModal').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
  document.getElementById('checkoutModal').classList.add('active');
  document.getElementById('checkoutOverlay').classList.add('active');
  const shipping = cart.shipping || 25000;
  const totalWithShipping = calculateTotal() + shipping;
  document.getElementById('checkoutTotal').textContent = `$${totalWithShipping.toLocaleString('es-CO')}`;
  // GA4: Track checkout start
  trackCheckoutStart(totalWithShipping, cart.items.length);
}

// Cerrar checkout
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
  document.getElementById('checkoutOverlay').classList.remove('active');
}

// Enviar pedido
function submitOrder(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const notes = document.getElementById('notes').value.trim();

  if (!fullName || !phone || !address || !city) {
    showNotification('Por favor completa todos los campos requeridos');
    return;
  }

  // Generar orden
  const orderId = 'PED-' + Date.now();
  const orderDate = new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const order = {
    id: orderId,
    date: orderDate,
    customer: {
      name: fullName,
      phone: phone,
      email: email,
      address: address,
      city: city,
      notes: notes
    },
    items: cart.items,
    subtotal: calculateTotal(),
    shipping: (cart && cart.shipping) || 25000,
    total: calculateTotalWithShipping()
  };

  // GA4: Track lead capture (before order confirmation)
  trackLeadCapture(fullName, phone, email, city);

  // GA4: Track purchase (conversion event)
  trackPurchase(orderId, order.total, cart.items, {});

  // Guardar orden
  const orders = JSON.parse(localStorage.getItem('glutationOrders') || '[]');
  orders.push(order);
  localStorage.setItem('glutationOrders', JSON.stringify(orders));

  // Mostrar confirmación
  showOrderConfirmation(order);

  // Limpiar carrito y formulario
  cart = { items: [], total: 0, shipping: 25000 };
  saveCart();
  updateCartUI();
  document.getElementById('checkoutForm').reset();
  closeCheckout();
}

// Mostrar confirmación de orden
function showOrderConfirmation(order) {
  const orderDetails = document.getElementById('orderDetails');
  const itemsHTML = order.items.map(item => 
    `<p>• ${item.quantity}x ${item.name}: $${(item.price * item.quantity).toLocaleString('es-CO')}</p>`
  ).join('');

  orderDetails.innerHTML = `
    <div class="order-info">
      <p><strong>Número de Pedido:</strong> ${order.id}</p>
      <p><strong>Fecha:</strong> ${order.date}</p>
      <p><strong>Cliente:</strong> ${order.customer.name}</p>
      <p><strong>Teléfono:</strong> ${order.customer.phone}</p>
      <p><strong>Email:</strong> ${order.customer.email || 'No proporcionado'}</p>
      <p><strong>Dirección:</strong> ${order.customer.address}, ${order.customer.city}</p>
      ${order.customer.notes ? `<p><strong>Notas:</strong> ${order.customer.notes}</p>` : ''}
      
      <div class="order-items">
        <h4>Productos:</h4>
        ${itemsHTML}
      </div>
      
      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <p><strong>Subtotal:</strong> $${order.subtotal.toLocaleString('es-CO')}</p>
        <p><strong>Envío:</strong> $${order.shipping.toLocaleString('es-CO')}</p>
        <p class="order-total" style="font-size: 1.2rem; margin-top: 0.5rem;"><strong>Total:</strong> $${order.total.toLocaleString('es-CO')}</p>
      </div>
    </div>
  `;

  // Guardar orden actual para compartir
  window.currentOrder = order;

  document.getElementById('confirmationModal').classList.add('active');
  document.getElementById('confirmationOverlay').classList.add('active');
}

// Compartir orden por WhatsApp
function shareOrderWhatsApp() {
  const order = window.currentOrder;
  if (!order) return;

  const itemsText = order.items.map(item =>
    `• ${item.quantity}x ${item.name}: $${(item.price * item.quantity).toLocaleString('es-CO')}`
  ).join('\n');

  const message = encodeURIComponent(
    `Hola, confirmo mi pedido:\n\n` +
    `📦 Pedido: ${order.id}\n` +
    `👤 Cliente: ${order.customer.name}\n` +
    `📱 Teléfono: ${order.customer.phone}\n` +
    `📍 Dirección: ${order.customer.address}, ${order.customer.city}\n\n` +
    `Productos:\n${itemsText}\n\n` +
    `Subtotal: $${order.subtotal.toLocaleString('es-CO')}\n` +
    `Envío: $${order.shipping.toLocaleString('es-CO')}\n` +
    `💰 Total: $${order.total.toLocaleString('es-CO')}\n\n` +
    `¿Cuándo llega mi pedido?`
  );

  // GA4: Track WhatsApp click from order confirmation
  trackWhatsAppClickCTA();

  window.open(`https://wa.me/573105356668?text=${message}`, '_blank');
}

// Descargar orden como texto
function downloadOrder() {
  const order = window.currentOrder;
  if (!order) return;

  const itemsText = order.items.map(item => 
    `${item.quantity}x ${item.name}: $${(item.price * item.quantity).toLocaleString('es-CO')}`
  ).join('\n');

  const text = 
    `GLUTATION STORE\n` +
    `Pedido Confirmado\n` +
    `================================\n\n` +
    `Número de Pedido: ${order.id}\n` +
    `Fecha: ${order.date}\n\n` +
    `CLIENTE:\n` +
    `Nombre: ${order.customer.name}\n` +
    `Teléfono: ${order.customer.phone}\n` +
    `Email: ${order.customer.email || 'No proporcionado'}\n\n` +
    `ENTREGA:\n` +
    `Dirección: ${order.customer.address}\n` +
    `Ciudad: ${order.customer.city}\n` +
    `${order.customer.notes ? `Notas: ${order.customer.notes}\n` : ''}\n` +
    `PRODUCTOS:\n` +
    itemsText + '\n\n' +
    `SUBTOTAL: $${order.subtotal.toLocaleString('es-CO')}\n` +
    `Envío: $${order.shipping.toLocaleString('es-CO')}\n` +
    `TOTAL: $${order.total.toLocaleString('es-CO')}\n\n` +
    `================================\n` +
    `¡Gracias por tu compra!`;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pedido-${order.id}.txt`;
  link.click();
}

// Cerrar confirmación
function closeConfirmation() {
  document.getElementById('confirmationModal').classList.remove('active');
  document.getElementById('confirmationOverlay').classList.remove('active');
  window.currentOrder = null;
}

// Mostrar notificación
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Event Listeners para carrito
function initCart() {
  loadCart();

  // Botón de carrito
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
  }

  // Cerrar carrito
  const closeCartBtn = document.getElementById('closeCart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Cerrar checkout
  const closeCheckoutBtn = document.getElementById('closeCheckout');
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', closeCheckout);
  }

  const checkoutOverlay = document.getElementById('checkoutOverlay');
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', closeCheckout);
  }

  // Cerrar confirmación
  const closeConfirmationBtn = document.getElementById('closeConfirmation') || document.querySelector('[onclick="closeConfirmation()"]');
  const confirmationOverlay = document.getElementById('confirmationOverlay');
  if (confirmationOverlay) {
    confirmationOverlay.addEventListener('click', closeConfirmation);
  }

  // ESC para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeCheckout();
      closeConfirmation();
    }
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart);
} else {
  initCart();
}

// ============================================
// GLUTATION STORE - CHATBOT INTELIGENTE
// ============================================

// ============================================
// INTEGRACIÓN CLAUDE API - BOT INTELIGENTE
// ============================================

// Instanciar conversationManager y claudeClient

// Inicializar sistemas de IA

// Configuración del bot
const BOT_CONFIG = {
  whatsapp: '+57 310 5356668',
  whatsappLink: 'https://wa.me/573105356668?text=',
  responseDelay: 500, // Simular tiempo de escritura
  products: {
    regular: {
      name: 'Immunocal Regular',
      price: '$315.000',
      benefits: [
        'Sistema inmune reforzado',
        'Glutatión natural elevado',
        'Proteína de suero aislada',
        '30 sobres',
        'Ideal para principiantes'
      ]
    },
    platinum: {
      name: 'Immunocal Platinum',
      price: '$355.000',
      benefits: [
        'Todo Regular +',
        'CMP (moduladores de citoquina)',
        'RMF (formula moduladora)',
        'Mejor recuperación muscular',
        'Para atletas'
      ]
    },
    optimizer: {
      name: 'Immunocal Optimizer',
      price: '$300.000',
      benefits: [
        'Extracto de sulforafano',
        'Semilla de brócoli',
        '50+ polifenoles',
        'Energía sostenida',
        'Antioxidante potente'
      ]
    }
  }
};

// Estado del chat
let chatState = {
  isOpen: false,
  userInfo: {
    name: '',
    phone: '',
    email: '',
    interest: ''
  },
  conversationStage: 'greeting' // greeting, product-selection, questions, contact-info, summary
};

// DOM Elements
const chatModal = document.getElementById('chatModal');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendChat');
const openChatBotButtons = document.querySelectorAll('[id^="openChatBot"]');
const closeChatBotButton = document.getElementById('closeChatBot');

// Event Listeners
openChatBotButtons.forEach(btn => {
  btn.addEventListener('click', openChat);
});

closeChatBotButton.addEventListener('click', closeChat);
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && chatInput.value.trim()) {
    sendMessage();
  }
});

// Cerrar modal al presionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatState.isOpen) {
    closeChat();
  }
});

// Funciones principales
function openChat() {
  chatModal.classList.add('active');
  chatModal.setAttribute('aria-hidden', 'false');
  chatInput.focus();
  captureEvent('chat_opened');
  trackChatBotOpen(); // GA4: Track chat bot opening
}

function closeChat() {
  chatModal.classList.remove('active');
  chatModal.setAttribute('aria-hidden', 'true');
  chatState.isOpen = false;
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // Mostrar mensaje del usuario
  addMessage(message, 'user');
  chatInput.value = '';
  chatInput.disabled = true;
  sendBtn.disabled = true;

  try {
    // Procesar mensaje (ahora es async con Claude API)
    const response = await processUserMessage(message);

    // Validar que response tiene estructura correcta
    if (!response || !response.text) {
      console.error('❌ Respuesta inválida:', response);
      addMessage('Error: No recibí respuesta válida del servidor. Intenta de nuevo.', 'bot');
      return;
    }

    // Mostrar respuesta
    addMessage(response.text, 'bot', response.options || []);

    // GA4: Track chat message
    trackChatMessage(message, response.text);

    // Si debería redirigir a WhatsApp automáticamente
    if (response.autoRedirectWhatsApp && response.orderSummary) {
      setTimeout(() => {
        sendToWhatsApp(response.orderSummary);
      }, 1000);
    }

  } catch (error) {
    console.error('Error en sendMessage:', error);
    addMessage('Hubo un error procesando tu mensaje. Por favor intenta de nuevo.', 'bot');
  } finally {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }

  // Capturar evento de conversación
  captureEvent('chat_message_sent');
}

function handleChatOption(action) {
  const options = {
    'product-info': {
      text: '¡Perfecto! Tenemos tres opciones principales:\n\n📦 Immunocal Regular - $315.000\n💪 Immunocal Platinum - $355.000 (MÁS POPULAR)\n⚡ Immunocal Optimizer - $300.000\n\n¿Cuál te interesa?',
      options: [
        { label: 'Información Regular', action: 'show-regular' },
        { label: 'Información Platinum', action: 'show-platinum' },
        { label: 'Información Optimizer', action: 'show-optimizer' }
      ]
    },
    'pricing': {
      text: '💰 Los precios incluyen envío a toda Colombia:\n\n• Immunocal Regular: $315.000\n• Immunocal Platinum: $355.000\n• Immunocal Optimizer: $300.000\n\nPuedes comprar combos con descuento. Consulta promociones por WhatsApp: ' + BOT_CONFIG.whatsapp,
      options: []
    },
    'shipping': {
      text: '🚚 Envíos y Entregas:\n\n✓ 1-3 días hábiles en Colombia\n✓ En Bogotá: mismo día o al día siguiente\n✓ Envío DIRECTO desde Immunotec (sin intermediarios)\n✓ Incluye rastreo\n✓ Pago contra entrega disponible\n\n¿Deseas hacer tu pedido?',
      options: []
    },
    'benefits': {
      text: '🌟 Beneficios Principales:\n\n✅ Refuerza sistema inmunológico\n✅ Eleva glutatión natural\n✅ Aumenta energía y resistencia\n✅ Recuperación muscular más rápida\n✅ Salud celular mejorada\n✅ Bajo en lactosa\n✅ Recomendado por atletas olímpicos\n\nTomado diariamente en ayunas, nota los beneficios en 2-4 semanas.',
      options: []
    },
    'buy': {
      text: 'Excelente, estoy aquí para ayudarte. 📝\n\n¿Cuál producto te llama más la atención?',
      options: [
        { label: 'Comprar Regular', action: 'buy-regular' },
        { label: 'Comprar Platinum', action: 'buy-platinum' },
        { label: 'Comprar Optimizer', action: 'buy-optimizer' },
        { label: 'Combos/Promociones', action: 'show-combos' }
      ]
    },
    'show-regular': {
      text: '📦 Immunocal Regular - $315.000\n\nBeneficios:\n• Precursor natural de glutatión\n• Proteína aislada de suero\n• Refuerza defensa inmunológica\n• 30 sobres (1 mes)\n• Perfecto para empezar\n\n¿Deseas comprarlo? Conectemos con nuestro asesor:',
      options: []
    },
    'show-platinum': {
      text: '💪 Immunocal Platinum - $355.000\n\nBeneficios:\n• TODO Regular +\n• CMP (reguladores de inflamación)\n• RMF (balance de pH y creatina)\n• Mejor recuperación muscular\n• Para atletas y personas activas\n• MÁS POPULAR\n\n¿Deseas comprarlo?',
      options: []
    },
    'show-optimizer': {
      text: '⚡ Immunocal Optimizer - $300.000\n\nBeneficios:\n• Extracto de sulforafano\n• Semilla de brócoli\n• 50+ polifenoles\n• Energía sostenida\n• Antioxidante potente\n• Sabor frutas rojas\n\n¿Es para ti?',
      options: []
    },
    'buy-regular': {
      text: 'Perfecto, vamos con Immunocal Regular 📦\n\nPara procesar tu pedido, necesito algunos datos:\n1. Tu nombre\n2. Tu WhatsApp (para confirmar envío)\n3. Tu dirección de entrega\n\n¿Cuál es tu nombre?',
      options: []
    },
    'buy-platinum': {
      text: 'Excelente, Platinum es la mejor opción 💪\n\nPara procesar tu pedido, necesito:\n1. Tu nombre\n2. Tu WhatsApp\n3. Tu dirección de entrega\n\n¿Cuál es tu nombre?',
      options: []
    },
    'buy-optimizer': {
      text: 'Buena elección, Optimizer es potente ⚡\n\nPara procesar tu pedido, necesito:\n1. Tu nombre\n2. Tu WhatsApp\n3. Tu dirección de entrega\n\n¿Cuál es tu nombre?',
      options: []
    },
    'show-combos': {
      text: '🎁 COMBOS Y PROMOCIONES\n\nTenemos ofertas especiales:\n• 2x Regular + 1x Platinum\n• Platinum + Optimizer\n• Subscripción automática (descuento 25%)\n\nConsulta las ofertas exactas y disponibilidad:',
      options: []
    }
  };

  const option = options[action];
  if (option) {
    addMessage(option.text, 'bot', option.options);
    if (action.includes('buy-')) {
      chatState.conversationStage = 'contact-info';
    }
    return option;
  }
  return { text: '¿En qué puedo ayudarte?', options: [] };
}

/**
 * NUEVA FUNCIÓN: processUserMessage con Claude API
 * Reemplaza la lógica basada en palabras clave con IA inteligente
 */
async function processUserMessage(message) {
  console.log('💬 Procesando mensaje:', message.substring(0, 50));

  try {
    // Intentar usar Claude API o fallback a palabras clave
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error('API error');

    const result = await response.json();
    console.log(`✅ Respuesta de ${result.source}:`, result.text.substring(0, 50));

    captureEvent('chat_message_processed');

    return {
      text: result.text,
      options: []
    };

  } catch (error) {
    console.warn('⚠️ Usando fallback local:', error.message);
    // Fallback automático a palabras clave locales
    const fallback = processUserMessage_Keyword(message);
    return fallback || {
      text: '👋 No entendí bien. ¿Puedes preguntarme sobre precios?',
      options: []
    };
  }
}

/**
 * FALLBACK: Sistema original basado en palabras clave
 * Se usa cuando Claude API falla o por problemas de conexión
 */
function processUserMessage_Keyword(message) {
  const lowerMsg = message.toLowerCase();
  let response = { text: '', options: [] };

  // Análisis de intención con palabras clave
  if (lowerMsg.includes('hola') || lowerMsg.includes('hi') || lowerMsg.includes('oi')) {
    response.text = `Hola, bienvenido a Glutation Store.\n\nSoy tu asistente inteligente. Estoy aquí 24/7 para:\n- Explicarte sobre Immunocal\n- Ayudarte a elegir el producto correcto\n- Procesar tu compra\n- Responder todas tus preguntas\n\n¿En qué puedo ayudarte hoy?`;
    response.options = [
      { label: 'Información de productos', action: 'product-info' },
      { label: 'Precios y ofertas', action: 'pricing' },
      { label: 'Envíos y plazos', action: 'shipping' },
      { label: 'Quiero comprar', action: 'buy' }
    ];
  }
  else if (lowerMsg.includes('precio') || lowerMsg.includes('costo') || lowerMsg.includes('cuánto')) {
    response = handleChatOption('pricing');
  }
  else if (lowerMsg.includes('envío') || lowerMsg.includes('entrega') || lowerMsg.includes('demora')) {
    response = handleChatOption('shipping');
  }
  else if (lowerMsg.includes('beneficio') || lowerMsg.includes('para qué') || lowerMsg.includes('sirve')) {
    response = handleChatOption('benefits');
  }
  else if (lowerMsg.includes('regular') || lowerMsg.includes('basic')) {
    response = handleChatOption('show-regular');
  }
  else if (lowerMsg.includes('platinum')) {
    response = handleChatOption('show-platinum');
  }
  else if (lowerMsg.includes('optimizer') || lowerMsg.includes('energía')) {
    response = handleChatOption('show-optimizer');
  }
  else if (lowerMsg.includes('combo') || lowerMsg.includes('promo') || lowerMsg.includes('descuento')) {
    response = handleChatOption('show-combos');
  }
  else if (lowerMsg.includes('quiero comprar') || lowerMsg.includes('compra') || lowerMsg.includes('pedido')) {
    response.text = 'Excelente. Vamos a procesar tu compra.\n\n¿Cuál Immunocal prefieres?';
    response.options = [
      { label: 'Regular - $315.000', action: 'buy-regular' },
      { label: 'Platinum - $510.000', action: 'buy-platinum' },
      { label: 'Optimizer - $315.000', action: 'buy-optimizer' },
      { label: 'Ver combos', action: 'show-combos' }
    ];
  }
  else if (lowerMsg.includes('original') || lowerMsg.includes('falso') || lowerMsg.includes('garantía')) {
    response.text = '100% GARANTIZADO ORIGINAL\n\nNuestro diferencial único:\n- Compra DIRECTA a Immunotec (empresa matriz canadiense)\n- Envío DIRECTO desde almacén de Immunotec\n- Sin intermediarios, sin riesgos de falsificación\n- Producto sellado, INVIMA certificado\n- Garantía de satisfacción\n\n¿Deseas proceder con tu compra?';
    response.options = [
      { label: 'Sí, quiero comprar', action: 'buy' }
    ];
  }
  else {
    response.text = `Entendí: "${message}"\n\nPero no estoy seguro de tu pregunta. Aquí hay opciones que sí puedo ayudarte:`;
    response.options = [
      { label: 'Información de productos', action: 'product-info' },
      { label: 'Precios', action: 'pricing' },
      { label: 'Envíos', action: 'shipping' },
      { label: 'Comprar', action: 'buy' }
    ];
  }

  // GARANTIZAR que siempre hay estructura válida
  if (!response || !response.text) {
    response = {
      text: 'Disculpa, tuve un error procesando tu mensaje. Intenta de nuevo.',
      options: []
    };
  }

  return response;
}

function addMessage(text, sender, options = []) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}-message`;
  
  let content = `<p>${text}</p>`;
  
  if (options && options.length > 0) {
    content += '<div class="chat-options">';
    options.forEach(opt => {
      content += `<button class="chat-option" onclick="handleChatOption('${opt.action}')">${opt.label}</button>`;
    });
    content += '</div>';
  }
  
  messageDiv.innerHTML = content;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function sendToWhatsApp(message) {
  const encodedMsg = encodeURIComponent(message);
  const waLink = `${BOT_CONFIG.whatsappLink}${encodedMsg}`;
  window.open(waLink, '_blank');
  captureEvent('chat_whatsapp_redirect');
}

function scrollToProduct(productId) {
  const element = document.getElementById(productId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    closeChat();
  }
}

// ============================================
// INTEGRACIÓN CRM Y REMARKETING
// ============================================

// BD Simulada de CRM (en producción, sería un backend)
const crmData = {
  leads: [],
  events: []
};

function captureEvent(eventName, data = {}) {
  const event = {
    type: eventName,
    timestamp: new Date().toISOString(),
    data: data,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  crmData.events.push(event);
  
  // Enviar a Google Tag Manager (si está configurado)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, data);
  }
  
  // Enviar a Meta Pixel (si está configurado)
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, data);
  }
  
  console.log('📊 Evento capturado:', eventName, data);
}

function captureLead(name, phone, email, interest) {
  const lead = {
    id: Date.now(),
    name: name,
    phone: phone,
    email: email,
    interest: interest,
    timestamp: new Date().toISOString(),
    status: 'nuevo',
    source: 'chat_bot'
  };
  
  crmData.leads.push(lead);
  captureEvent('lead_captured', { 
    name: name, 
    interest: interest 
  });
  
  // Aquí se enviaría a endpoints reales
  console.log('👤 Lead capturado:', lead);
  return lead;
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Track de página view
document.addEventListener('DOMContentLoaded', () => {
  // ✅ Inicializar Claude AI
  console.log('🚀 Inicializando Claude AI...');

  captureEvent('page_view', {
    title: document.title,
    url: window.location.href
  });

  // Track de CTAs
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      captureEvent('whatsapp_clicked', {
        text: link.textContent
      });
    });
  });

  // Track scroll
  let scrollTracked = {};
  window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercentage > 25 && !scrollTracked['25']) {
      captureEvent('scroll_25');
      scrollTracked['25'] = true;
    }
    if (scrollPercentage > 50 && !scrollTracked['50']) {
      captureEvent('scroll_50');
      scrollTracked['50'] = true;
    }
    if (scrollPercentage > 75 && !scrollTracked['75']) {
      captureEvent('scroll_75');
      scrollTracked['75'] = true;
    }
  });
});

console.log('✅ Glutation Store - Carrito y Chat Listos');

function simulateBotReply() {
  const botMessage = document.createElement('div');
  botMessage.className = 'chat-message';
  botMessage.textContent = 'Hola, soy tu asistente inteligente. Puedo ayudarte con precios, horarios y consultas inmediatas.';
  const chatBody = document.querySelector('.chat-body');
  if (chatBody) {
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

// Configuración para integrar CRM y remarketing:
// - Reemplaza el enlace de WhatsApp con tu número real.
// - Agrega Google Tag Manager, Meta Pixel o cualquier otro script dentro de index.html.
// - Conecta el chatbot a tu servicio de Claude o proveedor de conversación inteligente.

// ============================================
// GOOGLE ANALYTICS 4 - TRACKING EVENTS
// ============================================

/**
 * Track cuando usuario abre el chat bot
 * Llamar en: openChat() function
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
 * Llamar en: sendMessage() function
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

/**
 * Track cuando usuario inicia el checkout
 * Llamar en: openCheckout() function
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
    'shipping': 0,
    'tax': 0,
    'coupon': customerInfo.coupon || '',
    'timestamp': new Date().toISOString()
  });

  console.log('✓ GA4: Compra registrada. Order ID:', orderId, 'Total:', totalValue);
}

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
