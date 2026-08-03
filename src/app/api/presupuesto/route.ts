import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { PAQUETES, PRECIO_MINIMO_INVITADOS, formatPrecio } from "@/data/paquetes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SITE_URL = "https://cateringprofesional.com.ar";
const OWNER_PHONE = "5493884036629";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { paquete: paqueteId, nombre, email, telefono, fecha, lugar, tipo_evento, invitados, mensaje } = body;

  if (!paqueteId || !nombre || !email || !telefono || !fecha || !lugar || !tipo_evento || !invitados) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const paquete = PAQUETES[paqueteId as keyof typeof PAQUETES];
  if (!paquete) return NextResponse.json({ error: "Paquete inválido" }, { status: 400 });

  const esGrupoGrande = Number(invitados) >= PRECIO_MINIMO_INVITADOS;
  const total = esGrupoGrande ? paquete.precio * Number(invitados) : null;

  // Guardar en Supabase
  const { data: solicitud, error: dbError } = await supabase
    .from("presupuesto_solicitudes")
    .insert([{
      paquete: paqueteId,
      nombre, email, telefono,
      fecha_evento: fecha,
      lugar, tipo_evento,
      invitados: Number(invitados),
      mensaje: mensaje || "",
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

  await resend.emails.send({
    from: "Catering Profesional <onboarding@resend.dev>",
    to: "cateringprofesionaljujuy@gmail.com",
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
              <td style="padding:10px 0;border-bottom:1px solid #222;color:#fff;font-size:13px">${v}</td>
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
