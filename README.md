# Catering Profesional Jujuy

Sitio web de [www.cateringprofesional.com.ar](https://www.cateringprofesional.com.ar): página pública, panel de administración, panel de invitados, presupuestos y alquiler de vajilla.

**Stack:** Next.js 16 (App Router) · Supabase · Resend (emails) · desplegado en Vercel desde la rama `main`.

## Desarrollo local

```bash
npm install
npm run dev   # http://localhost:3000
```

Crear un `.env.local` (no se sube al repo) con:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo servidor) |
| `RESEND_API_KEY` | Envío de emails |
| `RESEND_FROM_EMAIL` | Remitente de los emails |
| `ADMIN_EMAIL` | Destinatario de consultas y avisos |
| `SESSION_SECRET` | Firma de sesiones de admin e invitados |

## Estructura

- `src/app/` — rutas: `/`, `/admin`, `/invitado`, `/presupuesto`, `/cotizacion-vajilla`, `/api/*`
- `src/components/public/` — secciones de la página principal
- `src/data/` — paquetes y catálogo de vajilla
- `public/presupuestos/` — PDF e imagen de cada paquete de muestra

Ver también [GUIA-PAGINA.md](GUIA-PAGINA.md).
