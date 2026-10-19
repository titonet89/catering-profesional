import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PAQUETES, PRECIO_MINIMO_INVITADOS, formatPrecio } from "@/data/paquetes";
import { supabaseAdmin } from "@/lib/supabase-server";
import { clip, escapeHtml, isValidEmail, rateLimit } from "@/lib/security";

const SITE_URL = "https://www.cateringprofesional.com.ar";

export async function POST(req: NextRequest) {
  if (!(await rateLimit("presupuesto", 5, 10 * 60_000))) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Probá en unos minutos." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const paqueteId   = clip(body.paquete, 40);
  const nombre      = clip(body.nombre, 80).replace(/[\r\n]/g, " ");
  const email       = clip(body.email, 254);
  const telefono    = clip(body.telefono, 30);
  const fecha       = clip(body.fecha, 10);
  const lugar       = clip(body.lugar, 120);
  const tipo_evento = clip(body.tipo_evento, 60);
  const mensaje     = clip(body.mensaje, 3000);
  const invitados   = Number(body.invitados);

  if (!paqueteId || !nombre || !email || !telefono || !fecha || !lugar || !tipo_evento || !invitados) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "El email no es válido" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }
  if (!Number.isInteger(invitados) || invitados < 1 || invitados > 5000) {
    return NextResponse.json({ error: "Cantidad de invitados inválida" }, { status: 400 });
  }

  const paquete = Object.hasOwn(PAQUETES, paqueteId) ? PAQUETES[paqueteId as keyof typeof PAQUETES] : undefined;
  if (!paquete) return NextResponse.json({ error: "Paquete inválido" }, { status: 400 });

  const esGrupoGrande = invitados >= PRECIO_MINIMO_INVITADOS;
  const total = esGrupoGrande ? paquete.precio * invitados : null;

  // Guardar en Supabase (clave del servidor)
  const { data: solicitud, error: dbError } = await supabaseAdmin()
    .from("presupuesto_solicitudes")
    .insert([{
      paquete: paqueteId,
      nombre, email, telefono,
      fecha_evento: fecha,
      lugar, tipo_evento,
      invitados,
      mensaje,
      estado: "pendiente",
    }])
    .select("id")
    .single();

  if (dbError || !solicitud) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Error al guardar solicitud" }, { status: 500 });
  }

  const presupuestoUrl = `${SITE_URL}/presupuesto/${solicitud.id}`;
  const fechaFormateada = new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // Email al dueño
  const resend = new Resend(process.env.RESEND_API_KEY);
  const whatsappCliente = `https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola ${nombre.split(" ")[0]} 😊\n\nDesde *Catering Profesional* queremos agradecerte por elegirnos para tu evento.\n\nTe compartimos tu propuesta personalizada — *${paquete.nombre}* para ${invitados} personas:\n\n👉 ${presupuestoUrl}\n\nCualquier consulta no dudes en escribirnos. ¡Estamos a tu disposición!\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`
  )}`;

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Catering Profesional <onboarding@resend.dev>";
  await resend.emails.send({
    from: fromEmail,
    to: process.env.ADMIN_EMAIL ?? "cateringprofesionaljujuy@gmail.com",
    replyTo: email,
    subject: `${esGrupoGrande ? "🔔 " : "📋 "}Nueva solicitud: ${paquete.nombre} — ${nombre} (${invitados} personas)`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;padding:40px;">
        <p style="color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">
          ${esGrupoGrande ? "✦ Solicitud lista para enviar" : "📋 Solicitud pendiente de revisión"}
        </p>
        <h1 style="color:#fff;font-size:22px;margin:0 0 24px">${paquete.nombre}</h1>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${[
            ["Cliente", nombre],
            ["WhatsApp", telefono],
            ["Email", email],
            ["Fecha del evento", fechaFormateada],
            ["Lugar", lugar],
            ["Tipo de evento", tipo_evento],
            ["Invitados", `${invitados} personas`],
            ...(total ? [["Precio por persona", formatPrecio(paquete.precio)], ["Total estimado", formatPrecio(total)]] : []),
            ...(mensaje ? [["Comentarios", mensaje]] : []),
          ].map(([k, v]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:12px;width:160px">${k}</td>
              <td style="padding:10px 0;border-bottom:1px solid #222;color:#fff;font-size:13px">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
            </tr>
          `).join("")}
        </table>

        ${esGrupoGrande ? `
          <div style="background:#1a1505;border:1px solid #C9A84C33;padding:16px;margin-bottom:20px;">
            <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px">Presupuesto listo</p>
            <p style="color:#ccc;font-size:13px;margin:0 0 12px">
              Este cliente tiene ${invitados} personas (≥ ${PRECIO_MINIMO_INVITADOS}). El presupuesto ya tiene precio cargado.
            </p>
            <a href="${presupuestoUrl}" style="color:#C9A84C;font-size:13px;">Ver presupuesto →</a>
          </div>
          <a href="${whatsappCliente}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Arial;">
            Enviar por WhatsApp al cliente
          </a>
        ` : `
          <div style="background:#111;border:1px solid #333;padding:16px;margin-bottom:20px;">
            <p style="color:#888;font-size:12px;margin:0 0 8px">Este cliente tiene menos de ${PRECIO_MINIMO_INVITADOS} personas. Revisá el presupuesto antes de enviarlo.</p>
            <a href="${presupuestoUrl}" style="color:#C9A84C;font-size:13px;">Ver y completar presupuesto →</a>
          </div>
        `}

        <p style="color:#333;font-size:11px;margin-top:30px;text-align:center;">
          Catering Profesional · Jujuy
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, id: solicitud.id, esGrupoGrande });
}
