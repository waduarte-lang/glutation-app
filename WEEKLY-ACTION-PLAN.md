# 📅 PLAN SEMANAL - 2 SEMANAS DE OPTIMIZACIÓN

## SEMANA 1: PERFORMANCE + PRIMEROS BACKLINKS

### 📅 **LUNES: Diagnóstico + Optimizar Imágenes**

#### Morning (1 hora)
```
DIAGNÓSTICO PageSpeed:
┌─────────────────────────────────────┐
[ ] 1. Ir a: https://pagespeed.web.dev/
[ ] 2. Ingresar: https://glutationstore.com
[ ] 3. Esperar análisis (2-3 min)
[ ] 4. SCREENSHOT de resultados
[ ] 5. ANOTAR en Excel/Notion:
    - Performance Score (mobile + desktop)
    - LCP (segundos)
    - FID (milisegundos)
    - CLS (valor)
│
│ Crear hoja Excel con estos datos (baseline)
└─────────────────────────────────────┘

Tiempo estimado: 15 min
```

#### Afternoon (1.5 horas)
```
COMPRIMIR IMÁGENES:
┌─────────────────────────────────────┐
[ ] 1. Ir a: https://tinypng.com/
[ ] 2. Subir: Immunocal Platinum.png
       (Imagen principal del sitio)
[ ] 3. Anotar:
    - Tamaño original: __ MB
    - Tamaño comprimido: __ KB
    - Compresión: __% 
[ ] 4. Descargar imagen comprimida
[ ] 5. Guardar como: Platinum-compressed.png
[ ] 6. Hacer backup de original
[ ] 7. Reemplazar en /images/ carpeta

Repetir para: Platinum 2, Regular, Optimizer, Performance, Café

Tiempo estimado: 45 min
│
CONVERTIR A WEBP:
[ ] 1. Para cada imagen comprimida:
[ ] 2. Ir a: https://convertio.co/png-webp/
[ ] 3. Subir imagen PNG
[ ] 4. Descargar .webp
[ ] 5. Guardar como: [nombre].webp

Tiempo estimado: 30 min
```

#### Evening (30 min)
```
AGREGAR PRELOAD:
[ ] 1. Abrir: index.html
[ ] 2. Buscar: línea 45 (después de GA4)
[ ] 3. Agregar ANTES de otros scripts:

<link rel="preload" as="image" 
  href="images/Immunocal%20Platinum.png" 
  imagesrcset="images/Immunocal%20Platinum.webp">

[ ] 4. Guardar
[ ] 5. Test en navegador (debe verse igual)

Tiempo estimado: 10 min
│
VERIFICAR LAZY LOADING:
[ ] 1. Ctrl+F en index.html: 'loading="lazy"'
[ ] 2. Todas las imágenes de productos deben tener
[ ] 3. Agregar si falta en alguna

Tiempo estimado: 20 min
```

#### ✅ Meta del Día:
```
- Baseline de PageSpeed registrado
- 5+ imágenes comprimidas
- WebP versions creadas
- Preload agregado
- Lazy loading verificado
```

---

### 📅 **MARTES: Minificar CSS**

#### Morning (1 hora)
```
GENERAR ARCHIVO MINIFICADO:
┌─────────────────────────────────────┐
[ ] 1. Ir a: https://cssminifier.com/
[ ] 2. Abrir styles.css en editor de texto
[ ] 3. Copiar TODO el contenido
[ ] 4. Pegar en cssminifier.com
[ ] 5. Click "Minify CSS"
[ ] 6. Copiar resultado completo
[ ] 7. Crear archivo NUEVO: styles.min.css
[ ] 8. Pegar contenido minificado
[ ] 9. Guardar en: 
    C:\Users\wadua\Downloads\Claude Code\Glutationsport\

Tiempo estimado: 20 min
│
VERIFICAR TAMAÑO:
[ ] 1. Comparar tamaño:
    - styles.css original: __ KB
    - styles.min.css minificado: __ KB
    - Ahorro: __% (meta: 25-35%)
[ ] 2. Anotar en Excel

Tiempo estimado: 5 min
```

#### Afternoon (1 hora)
```
ACTUALIZAR HTML:
┌─────────────────────────────────────┐
[ ] 1. Abrir: index.html
[ ] 2. Buscar línea con: <link rel="stylesheet" href="styles.css" />
[ ] 3. Cambiar a: <link rel="stylesheet" href="styles.min.css" />
[ ] 4. Guardar

IMPORTANTE: Mantener styles.css (respaldo)

Tiempo estimado: 5 min
│
TEST EN NAVEGADOR:
[ ] 1. Abrir navegador (incógnito)
[ ] 2. Ir a: file:///C:\Users\wadua\Downloads\Claude Code\Glutationsport\index.html
[ ] 3. Verificar que se vea EXACTAMENTE igual
[ ] 4. Verificar en mobile view (F12)
[ ] 5. Si hay problema, revertir cambio
[ ] 6. Si está bien, continuar

Tiempo estimado: 20 min
│
LIMPIAR:
[ ] 1. Verificar que styles.min.css está en carpeta
[ ] 2. Hacer backup de styles.css
[ ] 3. MANTENER AMBOS (seguridad)

Tiempo estimado: 5 min
```

#### ✅ Meta del Día:
```
- styles.min.css creado
- HTML actualizado
- Test en navegador completado
- Verificación de tamaño realizada
```

---

### 📅 **MIÉRCOLES: Minificar JavaScript**

#### Morning (1 hora)
```
GENERAR JAVASCRIPT MINIFICADO:
┌─────────────────────────────────────┐
[ ] 1. Ir a: https://www.toptal.com/developers/javascript-minifier
[ ] 2. Abrir script.js en editor
[ ] 3. Copiar TODO el contenido
[ ] 4. Pegar en minifier de Toptal
[ ] 5. Click "Minify JavaScript"
[ ] 6. Copiar resultado
[ ] 7. Crear archivo: script.min.js
[ ] 8. Pegar contenido minificado
[ ] 9. Guardar en carpeta

Tiempo estimado: 25 min
│
VERIFICAR TAMAÑO:
[ ] 1. Comparar:
    - script.js original: __ KB
    - script.min.js minificado: __ KB
    - Ahorro: __% (meta: 30-40%)
[ ] 2. Anotar en Excel

Tiempo estimado: 5 min
```

#### Afternoon (1 hora)
```
ACTUALIZAR HTML:
┌─────────────────────────────────────┐
[ ] 1. Abrir: index.html
[ ] 2. Buscar: <script src="script.js"></script>
[ ] 3. Cambiar a: <script src="script.min.js"></script>
[ ] 4. Guardar

Tiempo estimado: 5 min
│
TEST COMPLETO:
[ ] 1. Abrir navegador incógnito
[ ] 2. Ir a: file:///C:\...index.html
[ ] 3. Test chat bot:
    - Abre modal
    - Escribe mensaje
    - Recibe respuesta
[ ] 4. Test carrito:
    - Agregar producto
    - Ver carrito
    - Proceder a checkout
[ ] 5. Test en mobile (F12)
[ ] 6. Si hay error, revisar console (F12 → Console)
[ ] 7. IMPORTANTE: Si falla, revertir a script.js original

Tiempo estimado: 40 min
```

#### ✅ Meta del Día:
```
- script.min.js creado
- HTML actualizado
- Test completo en desktop
- Test completo en mobile
- Functionality verified
```

---

### 📅 **JUEVES: Fine-tuning + Backlinks**

#### Morning (1.5 horas)
```
FINE-TUNING PERFORMANCE:
┌─────────────────────────────────────┐
[ ] 1. Abrir styles.css
[ ] 2. Buscar: @font-face
[ ] 3. Agregar: font-display: swap;
[ ] 4. Guardar (actualizar también styles.min.css)

[ ] 5. Verificar preload de fuentes:
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
[ ] 6. Deben estar presentes en HTML

[ ] 7. Verificar CLS (Layout Shift):
    - Todas imágenes deben tener: width y height
    - Todos botones: min-height: 48px
    - Inputs: min-height: 44px

Tiempo estimado: 30 min
│
OPTIMIZAR VIEWPORT:
[ ] 1. Verificar en HTML:
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
[ ] 2. Estar presente (ya debe estar)

Tiempo estimado: 5 min
```

#### Afternoon (1 hora)
```
CREAR 5 BACKLINKS - DIRECTORIOS LOCALES:
┌─────────────────────────────────────┐

DIRECTORIO 1: Google My Business ⭐ CRÍTICO
[ ] 1. Abrir: https://www.google.com/business
[ ] 2. Iniciar sesión
[ ] 3. Crear o Verificar: "Glutation Store"
[ ] 4. Agregar:
    - Nombre: Glutation Store
    - Dirección: [Tu dirección]
    - Teléfono: +57 310 5356668
    - Sitio web: https://glutationstore.com
    - Horarios: 24/7
[ ] 5. Agregar 5+ fotos de:
    - Productos (Platinum, Regular, Optimizer)
    - Local (si aplica)
    - Logotipo
[ ] 6. Escribir descripción: 
    "Distribuidor oficial Immunocal Immunotec en Colombia"
[ ] 7. Guardar y Verificar

Tiempo estimado: 30 min

DIRECTORIO 2: Páginas Amarillas
[ ] 1. Ir a: https://www.paginasamarillas.com.co
[ ] 2. Crear perfil empresa
[ ] 3. Nombre: Glutation Store
[ ] 4. Categoría: Suplementos / Salud
[ ] 5. Agregar URL: https://glutationstore.com
[ ] 6. Guardar

Tiempo estimado: 10 min

DIRECTORIO 3: DirectorioEmpresas.com
[ ] 1. Ir a: https://www.directorioempresas.com.co
[ ] 2. Registro gratuito
[ ] 3. Crear ficha empresa
[ ] 4. Datos: nombre, teléfono, web
[ ] 5. URL del sitio: https://glutationstore.com
[ ] 6. Guardar

Tiempo estimado: 10 min

DIRECTORIO 4: BrandYourself
[ ] 1. Ir a: https://www.brandyourself.com
[ ] 2. Crear perfil
[ ] 3. Agregar sitio web
[ ] 4. Guardar

Tiempo estimado: 10 min

DIRECTORIO 5: InfoBusiness
[ ] 1. Ir a: https://www.infobusiness.co
[ ] 2. Registrar empresa
[ ] 3. Datos básicos
[ ] 4. Agregar URL sitio
[ ] 5. Guardar

Tiempo estimado: 10 min
```

#### ✅ Meta del Día:
```
- Font-display: swap configurado
- 5 backlinks creados (directorios)
- Google My Business verificado y optimizado
- Meta: 5 backlinks de autoridad media
```

---

### 📅 **VIERNES: Validación + Primeras Reseñas**

#### Morning (1 hora)
```
MEDIR PAGESPEED NUEVAMENTE:
┌─────────────────────────────────────┐
[ ] 1. Ir a: https://pagespeed.web.dev/
[ ] 2. Ingresar URL: https://glutationstore.com
[ ] 3. Esperar análisis (2-3 min)
[ ] 4. SCREENSHOT de nuevos resultados
[ ] 5. COMPARAR con baseline:

ANTES                DESPUÉS            CAMBIO
Performance: 65/100  Performance: ?? → Meta: 80+
LCP: 3.2s           LCP: ??           → Meta: <2.5s
FID: 150ms          FID: ??           → Meta: <100ms
CLS: 0.15           CLS: ??           → Meta: <0.1

[ ] 6. Anotar mejoras alcanzadas
[ ] 7. Documentar en Excel

Tiempo estimado: 20 min
│
CREAR DASHBOARD:
[ ] 1. Abrir Excel o Google Sheets
[ ] 2. Crear tabla "Performance Tracking"
[ ] 3. Columnas: Métrica | Baseline | Día 5 | Meta
[ ] 4. Agregar todos los valores
[ ] 5. Crear gráfico de barras
[ ] 6. Guardar

Tiempo estimado: 20 min
```

#### Afternoon (1.5 horas)
```
SOLICITAR PRIMERAS RESEÑAS:
┌─────────────────────────────────────┐

IDENTIFICAR CLIENTES:
[ ] 1. Revisar WhatsApp últimos 10 clientes
[ ] 2. Identificar 3-5 que parecen satisfechos
[ ] 3. Buscar conversaciones positivas
[ ] 4. Anotar teléfono/nombre

RECOPILACIÓN DE ENLACE:
[ ] 1. Ir a Google My Business
[ ] 2. Click "Get more reviews"
[ ] 3. Copiar "Review link" (URL directo)
[ ] 4. Guardar en document para no perderlo

ENVIAR SOLICITUDES:
[ ] 1. Preparar template:

"Hola [Nombre],

¡Gracias por comprar [Producto] en Glutation Store! 🙏

Tu opinión es muy importante para nosotros. 
¿Podrías dejar una reseña aquí? (toma 30 segundos)

[PEGAR ENLACE DE GOOGLE]

Como agradecimiento, te regalo 10% en tu próxima compra 🎁

¡Un abrazo!
Glutation Store"

[ ] 2. Enviar por WhatsApp a 3 clientes
[ ] 3. Anotar a quién se envió
[ ] 4. Meta: 1-2 reseñas antes del lunes

Tiempo estimado: 30 min
```

#### ✅ Meta de la Semana 1:
```
PERFORMANCE:
✅ Imágenes optimizadas (-70% tamaño)
✅ CSS minificado (-30% tamaño)
✅ JS minificado (-35% tamaño)
✅ Preload agregado
✅ PageSpeed Score: 65 → 75-80 (esperado)

BACKLINKS:
✅ 5 directorios completados
✅ Google My Business con fotos
✅ Enlaces de autoridad creados

RESEÑAS:
✅ 3 invitaciones enviadas
✅ Meta para próxima semana: 5 reseñas
```

---

## SEMANA 2: MÁS BACKLINKS + VALIDACIÓN FINAL

### 📅 **LUNES: Contactar Blogs (3 backlinks)**

#### Morning (1.5 horas)
```
PREPARAR LISTA DE BLOGS:
┌─────────────────────────────────────┐
Blogs a contactar (fitness + nutrición):
1. https://www.fitnessdigital.com.co
2. https://www.nutricionista.co
3. https://www.suplemendata.com
4. https://www.fitnesshoy.com
5. https://www.bodybuilding.com.co

[ ] 1. Visitar cada blog
[ ] 2. Buscar: "Contact" o "Contact us"
[ ] 3. Encontrar email de administrador
[ ] 4. Anotar en Excel:
    Blog | Email | Persona

Tiempo estimado: 45 min
│
PREPARAR TEMPLATE DE EMAIL:
[ ] 1. Copiar este template:

"Asunto: Mención de Immunocal en artículo"

"Hola [Nombre],

Vi tu excelente artículo sobre [tema específico] 
y pensé que sería valioso mencionar Immunocal.

Es un suplemento premium con 45+ años de 
investigación de Immunotec. Contiene un 
precursor natural de glutatión que refuerza 
el sistema inmunológico.

Somos el distribuidor oficial en Colombia:
https://glutationstore.com

Si te interesa incluirlo en un futuro artículo, 
puedo proporcionarte:
- Información técnica del producto
- Testimonios de atletas
- Datos científicos

¡Espero poder colaborar!

Saludos,
[Tu nombre]
Glutation Store
https://glutationstore.com
+57 310 5356668"

Tiempo estimado: 15 min
```

#### Afternoon (1.5 horas)
```
ENVIAR EMAILS:
[ ] 1. Enviar emails a 5 blogs
[ ] 2. Esperar respuestas (24-48h)
[ ] 3. Anotar quién respondió positivo
[ ] 4. Meta: 3+ respuestas positivas
[ ] 5. Anotar links cuando se mencione

Tiempo estimado: 30 min
│
SEGUIMIENTO:
[ ] 1. En 2 días: revisar si no respondieron
[ ] 2. Enviar follow-up email amable
[ ] 3. Anotar quién mencionó el sitio
[ ] 4. Verificar el backlink en Google Search Console

Tiempo estimado: 30 min
```

---

### 📅 **MARTES-MIÉRCOLES: Continuar Reseñas**

```
SOLICITAR MÁS RESEÑAS:
┌─────────────────────────────────────┐
[ ] 1. Cada compra nueva = oportunidad
[ ] 2. Después de envío: "¿Cómo fue tu experiencia?"
[ ] 3. Si es positivo: "¡Déjanos una reseña!"
[ ] 4. Ofrecer 10% en próxima compra
[ ] 5. Meta: 2 reseñas adicionales

RESPONDER A RESEÑAS:
[ ] 1. Revisar Google My Business diario
[ ] 2. Responder a TODAS las reseñas:
    - Positiva: Agradecer
    - Negativa: Disculparse y resolver
[ ] 3. Ejemplo respuesta positiva:

"¡Gracias [Nombre] por tu reseña! 🙏

Nos alegra que hayas disfrutado de [Producto].
Tu satisfacción es nuestra prioridad.

¡Vuelve a visitarnos! Usa código GLUTATION10 
para 10% descuento en tu próxima compra.

Saludos,
Equipo Glutation Store"

Tiempo estimado: 30 min/día
```

---

### 📅 **JUEVES: Verificación Final**

```
VERIFICAR BACKLINKS CREADOS:
┌─────────────────────────────────────┐
[ ] 1. Ir a: https://search.google.com/search-console
[ ] 2. Ir a: Links (izquierda)
[ ] 3. Ver "External links"
[ ] 4. Confirmar que nuevos backlinks aparezcan
[ ] 5. Anotar cantidad total

VERIFICAR RESEÑAS:
[ ] 1. Google My Business
[ ] 2. Contar cantidad de reseñas
[ ] 3. Verificar rating promedio
[ ] 4. Meta: 5+ reseñas, 4.5+ estrellas

MEDIR IMPACTO EN BÚSQUEDA:
[ ] 1. Search Console → Performance
[ ] 2. Ver "Average CTR" (click-through rate)
[ ] 3. Comparar con semana anterior
[ ] 4. Meta: +5-10% CTR con reseñas

Tiempo estimado: 30 min
```

---

### 📅 **VIERNES: Documentación + Próximos Pasos**

```
CREAR REPORTE FINAL:
┌─────────────────────────────────────┐
[ ] 1. Abrir documento Word/Google Docs
[ ] 2. Título: "SEO Performance Report - Semana 1-2"
[ ] 3. Secciones:

PERFORMANCE OPTIMIZATION:
├─ PageSpeed antes/después
├─ Mejoras técnicas implementadas
├─ Tamaño de archivos reducido
└─ Comparación visual

BACKLINKS CREADOS:
├─ Directorio 1-5 (5 backlinks)
├─ Blogs mencionados (3 backlinks)
├─ Total: 8 backlinks
└─ Authority score mejorado

RESEÑAS & TRUST:
├─ Cantidad de reseñas: X
├─ Rating promedio: X.X/5
├─ CTR improvement: +X%
└─ Visibilidad mejorada

CONCLUSIONES:
├─ Meta alcanzada: Sí/No
├─ Próximos pasos: GA4 + WhatsApp
└─ Fecha revisión: [próximo mes]

[ ] 4. Guardar documento
[ ] 5. Hacer screenshot de PageSpeed final

Tiempo estimado: 1 hora
```

---

## ✅ CHECKLIST FINAL - 2 SEMANAS

### **SEMANA 1: PERFORMANCE + PRIMEROS BACKLINKS**
```
PERFORMANCE:
[ ] Diagnóstico PageSpeed (baseline)
[ ] Imágenes comprimidas (TinyPNG)
[ ] WebP conversions
[ ] Preload agregado
[ ] CSS minificado
[ ] JS minificado
[ ] Font-display: swap
[ ] Validación PageSpeed (check)

BACKLINKS:
[ ] Google My Business
[ ] Páginas Amarillas
[ ] DirectorioEmpresas
[ ] BrandYourself
[ ] InfoBusiness

RESEÑAS:
[ ] 3 invitaciones enviadas
[ ] Esperando primeras reseñas
```

### **SEMANA 2: MÁS BACKLINKS + VALIDACIÓN**
```
BACKLINKS:
[ ] 5 blogs contactados
[ ] 3+ menciones conseguidas
[ ] Verificación en GSC

RESEÑAS:
[ ] 2 reseñas adicionales esperadas
[ ] Respuestas a todas las reseñas
[ ] Rating promedio 4.5+

DOCUMENTACIÓN:
[ ] Reporte final creado
[ ] Comparación antes/después
[ ] Próximos pasos documentados
```

---

## 🎯 RESULTADO ESPERADO DESPUÉS DE 2 SEMANAS

```
PERFORMANCE:
├─ PageSpeed: 65/100 → 80+/100 ✅
├─ LCP: 3.2s → <2.5s ✅
├─ FID: 150ms → <100ms ✅
├─ CLS: 0.15 → <0.1 ✅

BACKLINKS:
├─ Total: 0 → 8+ backlinks
├─ Authority mejorada
├─ Search Console muestra enlaces

RESEÑAS & TRUST:
├─ Reseñas: 0 → 5+ ⭐
├─ Rating: Nueva → 4.5+ promedio
├─ CTR: Baseline → +5-10%

SIGUIENTE FASE:
├─ GA4 Integration en script.js
├─ WhatsApp + Twilio
└─ Continuidad de backlinks
```

---

**AHORA: Comienza el LUNES con el plan anterior** 💪

**Tiempo total:** 2 semanas, ~2-3 horas/día

¡Adelante! 🚀
