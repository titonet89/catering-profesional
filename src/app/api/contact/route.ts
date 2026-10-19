import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import { clip, escapeHtml, isValidEmail, rateLimit } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  if (!(await rateLimit("contacto", 5, 10 * 60_000))) {
    return NextResponse.json({ error: "Demasiadas consultas. Probá en unos minutos." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const nombre  = clip(body.nombre, 80).replace(/[\r\n]/g, " ");
  const email   = clip(body.email, 254);
  const evento  = clip(body.evento, 60).replace(/[\r\n]/g, " ");
  const mensaje = clip(body.mensaje, 3000);

  if (!nombre || !email) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "El email no es válido" }, { status: 400 });
  }

  // Guardar en Supabase (con la clave del servidor: el público no necesita
  // permisos sobre esta tabla)
  const { error: dbError } = await supabaseAdmin()
    .from("contacto_submissions")
    .insert([{ nombre, email, evento, mensaje }]);

  if (dbError) {
    return NextResponse.json({ error: "Error al guardar consulta" }, { status: 500 });
  }

  // Versiones escapadas para el HTML del email
  const h = {
    nombre:  escapeHtml(nombre),
    email:   escapeHtml(email),
    evento:  escapeHtml(evento),
    mensaje: escapeHtml(mensaje).replace(/\n/g, "<br>"),
  };

  // Enviar email de notificación
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Catering Profesional <onboarding@resend.dev>";
  const { error: emailError } = await resend.emails.send({
    from:    fromEmail,
    to:      process.env.ADMIN_EMAIL ?? "cateringprofesionaljujuy@gmail.com",
    replyTo: email,
    subject: `Nueva consulta de ${nombre} — ${evento || "Sin especificar"}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #fff; padding: 40px;">
        <div style="border-bottom: 1px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px;">
          <p style="color: #C9A84C; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin: 0 0 8px 0;">Nueva consulta recibida</p>
          <h1 style="color: #fff; font-size: 24px; margin: 0;">Catering Profesional</h1>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 13px; width: 140px;">Nombre</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #fff; font-size: 14px;">${h.nombre}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #C9A84C; font-size: 14px;">
              <a href="mailto:${h.email}" style="color: #C9A84C;">${h.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 13px;">Tipo de evento</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #fff; font-size: 14px;">${h.evento || "Sin especificar"}</td>
          </tr>
          ${mensaje ? `
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Mensaje</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px; line-height: 1.6;">${h.mensaje}</td>
          </tr>
          ` : ""}
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #222;">
          <a href="https://wa.me/5493884036629?text=${encodeURIComponent(`Hola ${nombre}! Te contactamos de Catering Profesional.`)}"
            style="display: inline-block; background: #25D366; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">
            Responder por WhatsApp
          </a>
        </div>

        <p style="color: #444; font-size: 11px; margin-top: 30px; text-align: center;">
          Catering Profesional · Av. Eva Perón N° 2278 B° San Pedrito · Jujuy
        </p>
      </div>
    `,
  });

  if (emailError) {
    // El email falló pero la consulta ya se guardó en Supabase — igual devolvemos ok
    console.error("Email error:", emailError);
  }

  return NextResponse.json({ ok: true });
}
