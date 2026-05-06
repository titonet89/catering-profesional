# Guía de la página — Catering Profesional

## Estructura general

La página se arma en `src/app/page.tsx` juntando todas las secciones en orden:

```
Navbar          → barra de navegación fija arriba
Hero            → pantalla completa inicial con video y logo
ComoTrabajamos  → sección "¿Cómo trabajamos?" (4 pasos)
Services        → servicios que ofrecen (bodas, corporativos, etc.)
BudgetBuilder   → calculador de presupuesto interactivo
Alquiler        → lista de vajilla, cristalería y precios de alquiler
Galeria         → fotos de eventos con filtros por categoría
Testimonios     → carrusel de opiniones de clientes
FAQ             → preguntas frecuentes en acordeón
Contacto        → formulario de contacto + datos + mapa + footer
WhatsAppButton  → botón flotante verde de WhatsApp
```

---

## Dónde modificar cada cosa

### Textos generales y datos de la empresa

| Qué cambiar | Archivo |
|---|---|
| Título en el navegador / SEO | `src/app/layout.tsx` → `metadata` |
| Año de fundación ("est. 2012") | `src/components/public/Hero.tsx` → buscar `est. 2012` |
| Tipos de eventos del subtítulo | `src/components/public/Hero.tsx` → buscar `Bodas · Corporativos` |
| Texto del botón principal del hero | `src/components/public/Hero.tsx` → buscar `Descubrí nuestros servicios` |

---

### Datos de contacto

Todos los datos de contacto están en `src/components/public/Contacto.tsx`:

- **Teléfono**: buscar `+54 388 403-6629`
- **Email**: buscar `cateringprofesionaljujuy@gmail.com`
- **Dirección**: buscar `Av. Eva Perón N° 2278`
- **Horario**: buscar `Lunes a Viernes` / `Sábados` / `Domingos`
- **Facebook**: buscar `facebook.com/cateringprofesionaljujuy`

El número de WhatsApp está en múltiples archivos, buscar `5493884036629` en:
- `src/components/public/WhatsAppButton.tsx`
- `src/components/public/BudgetBuilder.tsx`
- `src/components/public/Alquiler.tsx`
- `src/components/public/Galeria.tsx`
- `src/components/public/Contacto.tsx`
- `src/components/public/ComoTrabajamos.tsx`
- `src/components/public/FAQ.tsx`

---

### Precios

#### Paquetes de catering
Archivo: `src/components/public/BudgetBuilder.tsx`
Buscar `const PACKAGES` — ahí están los 4 paquetes con nombre, precio y qué incluye:
```
Básico    → $59.900 por persona
Clásico   → $79.900 por persona
Premium   → $99.900 por persona
Gala      → $119.900 por persona
```

#### Extras / adicionales
Mismo archivo, buscar `const EXTRAS` — agrupados en Gastronomía, Bebidas y Servicios adicionales.

#### Alquiler de vajilla y cristalería
Archivo: `src/components/public/Alquiler.tsx`
Buscar `const CATEGORIAS` — cada categoría tiene sus ítems con nombre, precio y unidad.

---

### Imágenes

#### Logo
Archivo: `public/logo.png`
Para reemplazarlo: guardá el nuevo logo como `logo.png` en la carpeta `public/` y listo, se actualiza solo.

#### Video del hero (portada)
Archivo: `src/components/public/Hero.tsx`
Buscar `source src=` — actualmente usa un video de Pexels.
Para usar tu propio video: guardalo como `hero.mp4` en `public/videos/` y cambiá la línea a:
```
<source src="/videos/hero.mp4" type="video/mp4" />
```

#### Fotos de la galería
Se suben desde el **Panel Admin**: `https://catering-profesional.vercel.app/admin`
(No hace falta tocar código para agregar o quitar fotos)

---

### Testimonios
Archivo: `src/components/public/Testimonios.tsx`
Buscar `const TESTIMONIOS` — cada testimonio tiene nombre, evento, texto e iniciales.
Para agregar uno nuevo, copiar el bloque `{ nombre: ..., evento: ..., texto: ..., iniciales: ..., estrellas: 5 }` y pegarlo en la lista.

---

### Preguntas frecuentes (FAQ)
Archivo: `src/components/public/FAQ.tsx`
Buscar `const PREGUNTAS` — cada pregunta tiene `pregunta` y `respuesta`.
Para agregar una nueva, copiar un bloque `{ pregunta: "...", respuesta: "..." }` y agregarlo a la lista.

---

### Cómo trabajamos (pasos)
Archivo: `src/components/public/ComoTrabajamos.tsx`
Buscar `const PASOS` — cada paso tiene número, ícono, título y descripción.

---

### Sección de servicios
Archivo: `src/components/public/Services.tsx`
Ahí están los tipos de eventos que ofrecen con sus descripciones.

---

### Mensajes de WhatsApp (lo que el cliente envía al hacer clic)

| Sección | Archivo | Buscar |
|---|---|---|
| Botón flotante | `WhatsAppButton.tsx` | `WA_TEXT` |
| Galería | `Galeria.tsx` | `Buenas tardes. He visto su galería` |
| Alquiler | `Alquiler.tsx` | `Buenas tardes. Me comunico desde su sitio web con interés en el servicio de alquiler` |
| Presupuesto | `BudgetBuilder.tsx` | `Buenas tardes. Me comunico desde su sitio web con el siguiente presupuesto` |
| Formulario | `Contacto.tsx` | `Buenas tardes. Me comunico a través del formulario` |

---

### Data Fiscal AFIP (QR)
Archivo: `src/components/public/Contacto.tsx`
Buscar `qr.afip.gob.ar` — ahí está el enlace y la imagen del QR.
El tamaño actual es `110px`. Para agrandarlo o achicarlo, cambiá ese número.

---

## Panel de administración

URL: `https://catering-profesional.vercel.app/admin`

Desde ahí podés:
- **Subir fotos** a la galería (con título y categoría)
- **Ocultar o mostrar** fotos sin borrarlas
- **Eliminar** fotos
- **Ver las consultas** que llegaron por el formulario de contacto

---

## Cómo actualizar la página en internet

Cualquier cambio que hagas en el código se sube así:

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

Vercel detecta el push y redesploya automáticamente en 1-2 minutos.

---

## Servicios conectados

| Servicio | Para qué se usa |
|---|---|
| **Vercel** | Hosting de la página en internet |
| **Supabase** | Base de datos (fotos de galería + consultas de contacto) |
| **Resend** | Envío de emails de notificación cuando llega una consulta |
| **AFIP/ARCA** | QR de Data Fiscal en el footer |
