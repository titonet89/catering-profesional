import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CATERING_EMAIL = process.env.ADMIN_EMAIL ?? "cateringprofesionaljujuy@gmail.com";
const FROM_EMAIL     = process.env.RESEND_FROM_EMAIL ?? "Catering Profesional <onboarding@resend.dev>";

const formatARS = (n: number) => "$ " + Math.round(n).toLocaleString("es-AR");

interface ItemCotizacion {
  nombre: string;
  unidad: string;
  precio: number;
  qty:    number;
}

function buildEmailCliente(
  nro:      string,
  fecha:    string,
  vence:    string,
  items:    ItemCotizacion[],
  total:    number,
  nombre:   string,
) {
  const filas = items.map((i) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;font-size:13px">${i.nombre}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;text-align:center;color:#aaa;font-size:13px">${i.qty} ${i.unidad}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;text-align:right;color:#aaa;font-size:13px">${formatARS(i.precio)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;text-align:right;color:#fff;font-weight:600;font-size:13px">${formatARS(i.precio * i.qty)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,'Times New Roman',serif">
<div style="max-width:640px;margin:0 auto;background:#0f0f0f;padding:0 0 40px 0">

  <!-- HEADER -->
  <div style="background:#0f0f0f;padding:36px 40px 28px;border-bottom:2px solid #c9a84c">
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:.45em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">✦ Catering Profesional · Jujuy</p>
    <h1 style="margin:0;font-size:26px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase">Catering Profesional</h1>
    <p style="margin:8px 0 0;font-size:11px;color:#666;line-height:1.8;font-family:Arial,sans-serif">
      Av. Eva Perón N° 2278, B° San Pedrito · San Salvador de Jujuy<br>
      +54 388 403-6629 · ${CATERING_EMAIL}
    </p>
  </div>

  <!-- INTRO -->
  <div style="padding:28px 40px 0">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Cotización preparada para</p>
    <p style="margin:0;font-size:20px;font-weight:700;color:#fff">${nombre}</p>
    <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap">
      <div>
        <p style="margin:0;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.3em;font-family:Arial,sans-serif">N° de cotización</p>
        <p style="margin:4px 0 0;font-size:13px;color:#c9a84c;font-family:Arial,sans-serif">${nro}</p>
      </div>
      <div>
        <p style="margin:0;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.3em;font-family:Arial,sans-serif">Fecha</p>
        <p style="margin:4px 0 0;font-size:13px;color:#aaa;font-family:Arial,sans-serif">${fecha}</p>
      </div>
      <div>
        <p style="margin:0;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.3em;font-family:Arial,sans-serif">Válida hasta</p>
        <p style="margin:4px 0 0;font-size:13px;color:#c9a84c;font-family:Arial,sans-serif">${vence}</p>
      </div>
    </div>
  </div>

  <!-- TABLA -->
  <div style="padding:24px 40px 0">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#1a1a1a">
          <th style="padding:10px 14px;text-align:left;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;font-weight:600;font-family:Arial,sans-serif">Artículo</th>
          <th style="padding:10px 14px;text-align:center;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;font-weight:600;font-family:Arial,sans-serif">Cant.</th>
          <th style="padding:10px 14px;text-align:right;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;font-weight:600;font-family:Arial,sans-serif">Precio unit.</th>
          <th style="padding:10px 14px;text-align:right;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;font-weight:600;font-family:Arial,sans-serif">Subtotal</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
    <!-- TOTAL -->
    <div style="background:#1a1a1a;padding:16px 14px;display:flex;justify-content:space-between;align-items:center;margin-top:0">
      <span style="font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Total estimado</span>
      <span style="font-size:26px;font-weight:700;color:#c9a84c">${formatARS(total)}</span>
    </div>
  </div>

  <!-- CONDICIONES -->
  <div style="padding:20px 40px 0">
    <div style="background:#161616;border:1px solid #2a2a2a;border-left:3px solid #c9a84c;padding:16px 18px">
      <p style="margin:0 0 8px;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Condiciones</p>
      <p style="margin:0;font-size:12px;color:#888;line-height:1.8;font-family:Arial,sans-serif">
        · Se requiere depósito de garantía y mínimo de contratación.<br>
        · Entrega y retiro del equipamiento incluidos en Jujuy capital.<br>
        · Cotización orientativa, sujeta a disponibilidad de stock y fecha.<br>
        · Válida por 7 días. Vence el <strong style="color:#c9a84c">${vence}</strong>.
      </p>
    </div>
  </div>

  <!-- CTA -->
  <div style="padding:28px 40px 0;text-align:center">
    <a href="https://wa.me/5493884036629?text=${encodeURIComponent(`Hola! Me llegó la cotización ${nro} y quisiera confirmar disponibilidad.`)}"
      style="display:inline-block;background:#c9a84c;color:#0f0f0f;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:.3em;text-transform:uppercase;font-weight:700;font-family:Arial,sans-serif">
      Confirmar por WhatsApp →
    </a>
    <p style="margin:12px 0 0;font-size:11px;color:#555;font-family:Arial,sans-serif">
      O escribinos a <a href="mailto:${CATERING_EMAIL}" style="color:#c9a84c">${CATERING_EMAIL}</a>
    </p>
  </div>

  <!-- FOOTER -->
  <div style="padding:28px 40px 0;border-top:1px solid #1a1a1a;margin-top:28px">
    <p style="margin:0;font-size:10px;color:#444;line-height:1.7;font-family:Arial,sans-serif">
      Los precios son orientativos en pesos argentinos (ARS). Este correo no constituye factura ni contrato.<br>
      Catering Profesional Organización de Eventos · CUIT 27-34061402-5 · Jujuy, Argentina
    </p>
  </div>

</div>
</body>
</html>`;
}

function buildEmailCatering(
  nro:      string,
  fecha:    string,
  items:    ItemCotizacion[],
  total:    number,
  solicitante: { nombre: string; email: string; tel: string },
) {
  const filas = items.map((i) => `
    <tr>
      <td style="padding:9px 14px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;font-size:13px">${i.nombre}</td>
      <td style="padding:9px 14px;border-bottom:1px solid #2a2a2a;text-align:center;color:#aaa;font-size:13px">${i.qty} ${i.unidad}</td>
      <td style="padding:9px 14px;border-bottom:1px solid #2a2a2a;text-align:right;color:#c9a84c;font-weight:600;font-size:13px">${formatARS(i.precio * i.qty)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif">
<div style="max-width:600px;margin:0 auto;background:#0f0f0f;padding:36px 40px">

  <p style="margin:0 0 4px;font-size:10px;letter-spacing:.45em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Nueva solicitud de cotización</p>
  <h1 style="margin:0 0 24px;font-size:22px;color:#fff;border-bottom:2px solid #c9a84c;padding-bottom:18px">Cotización ${nro}</h1>

  <!-- DATOS DEL SOLICITANTE -->
  <div style="background:#161616;border:1px solid #2a2a2a;padding:16px 18px;margin-bottom:24px">
    <p style="margin:0 0 10px;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Datos del solicitante</p>
    <table style="width:100%;border-collapse:collapse">
      ${solicitante.nombre ? `<tr><td style="padding:6px 0;color:#666;font-size:12px;font-family:Arial,sans-serif;width:80px">Nombre</td><td style="padding:6px 0;color:#fff;font-size:13px">${solicitante.nombre}</td></tr>` : ""}
      ${solicitante.email  ? `<tr><td style="padding:6px 0;color:#666;font-size:12px;font-family:Arial,sans-serif">Email</td><td style="padding:6px 0"><a href="mailto:${solicitante.email}" style="color:#c9a84c;font-size:13px">${solicitante.email}</a></td></tr>` : ""}
      ${solicitante.tel    ? `<tr><td style="padding:6px 0;color:#666;font-size:12px;font-family:Arial,sans-serif">Teléfono</td><td style="padding:6px 0"><a href="tel:${solicitante.tel}" style="color:#c9a84c;font-size:13px">${solicitante.tel}</a></td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#666;font-size:12px;font-family:Arial,sans-serif">Fecha</td><td style="padding:6px 0;color:#aaa;font-size:13px;font-family:Arial,sans-serif">${fecha}</td></tr>
    </table>
  </div>

  <!-- ARTÍCULOS -->
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#1a1a1a">
        <th style="padding:9px 14px;text-align:left;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Artículo</th>
        <th style="padding:9px 14px;text-align:center;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Cant.</th>
        <th style="padding:9px 14px;text-align:right;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Subtotal</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <div style="background:#1a1a1a;padding:14px;display:flex;justify-content:space-between;margin-bottom:24px">
    <span style="font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:#c9a84c;font-family:Arial,sans-serif">Total estimado</span>
    <span style="font-size:22px;font-weight:700;color:#c9a84c">${formatARS(total)}</span>
  </div>

  <!-- RESPONDER -->
  ${solicitante.tel ? `
  <a href="https://wa.me/${solicitante.tel.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${solicitante.nombre || ""}! Te contactamos de Catering Profesional por tu cotización ${nro}.`)}"
    style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:.25em;text-transform:uppercase;font-weight:700;font-family:Arial,sans-serif;margin-right:10px">
    Responder por WhatsApp
  </a>` : ""}
  ${solicitante.email ? `
  <a href="mailto:${solicitante.email}?subject=Re: Cotización ${nro} — Catering Profesional"
    style="display:inline-block;background:#c9a84c;color:#0f0f0f;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:.25em;text-transform:uppercase;font-weight:700;font-family:Arial,sans-serif">
    Responder por Email
  </a>` : ""}

  <p style="margin:24px 0 0;font-size:10px;color:#444;font-family:Arial,sans-serif">
    Catering Profesional · Jujuy · CUIT 27-34061402-5
  </p>
</div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const { cantidades, solicitante, items, total, nro, fecha, vence } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Sin artículos seleccionados" }, { status: 400 });
  }

  const emails: Promise<unknown>[] = [];

  // Email al catering siempre
  emails.push(
    resend.emails.send({
      from:    FROM_EMAIL,
      to:      CATERING_EMAIL,
      subject: `Nueva cotización ${nro}${solicitante.nombre ? ` — ${solicitante.nombre}` : ""}`,
      html:    buildEmailCatering(nro, fecha, items, total, solicitante),
    })
  );

  // Email al cliente solo si tiene email
  if (solicitante.email) {
    emails.push(
      resend.emails.send({
        from:    FROM_EMAIL,
        to:      solicitante.email,
        subject: `Tu cotización de alquiler ${nro} — Catering Profesional Jujuy`,
        html:    buildEmailCliente(nro, fecha, vence, items, total, solicitante.nombre || "Cliente"),
      })
    );
  }

  const results = await Promise.allSettled(emails);
  const failed  = results.filter((r) => r.status === "rejected");

  if (failed.length === results.length) {
    console.error("Email errors:", failed);
    return NextResponse.json({ error: "Error al enviar emails" }, { status: 500 });
  }

  void cantidades; // recibido pero no necesario en el servidor
  return NextResponse.json({ ok: true, emailCliente: !!solicitante.email });
}
