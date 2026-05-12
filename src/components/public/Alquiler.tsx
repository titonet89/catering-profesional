"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Printer, Plus, Minus, Send, User, Mail, PhoneCall, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIAS = [
  {
    nombre: "Cristalería",
    items: [
      { id: "copa-vino",      nombre: "Copa de vino tinto",      precio: 250,    unidad: "u." },
      { id: "copa-agua",      nombre: "Copa de agua",            precio: 250,    unidad: "u." },
      { id: "copa-champagne", nombre: "Copa de champagne",       precio: 250,    unidad: "u." },
      { id: "vaso-trago",     nombre: "Vaso trago largo",        precio: 250,    unidad: "u." },
    ],
  },
  {
    nombre: "Vajilla",
    items: [
      { id: "plato-playo",    nombre: "Plato playo",             precio: 350,    unidad: "u." },
      { id: "plato-hondo",    nombre: "Plato hondo",             precio: 350,    unidad: "u." },
      { id: "plato-entrada",  nombre: "Plato de entrada",        precio: 300,    unidad: "u." },
      { id: "fuente",         nombre: "Fuente de servicio",      precio: 600,    unidad: "u." },
    ],
  },
  {
    nombre: "Cubertería & Accesorios",
    items: [
      { id: "cubiertos",      nombre: "Set de cubiertos (3 pz)", precio: 450,    unidad: "set" },
      { id: "pinzas",         nombre: "Pinzas de servicio",      precio: 150,    unidad: "u." },
      { id: "cazuela",        nombre: "Cazuela rústica",         precio: 350,    unidad: "u." },
    ],
  },
  {
    nombre: "Mantelería",
    items: [
      { id: "mantel-largo",   nombre: "Mantel largo (mesa 10)", precio: 2000,   unidad: "u." },
      { id: "mantel-redondo", nombre: "Mantel redondo",         precio: 2200,   unidad: "u." },
      { id: "camino-mesa",    nombre: "Camino de mesa",         precio: 900,    unidad: "u." },
      { id: "servilletas",    nombre: "Servilletas de tela",    precio: 200,    unidad: "u." },
      { id: "cubre-silla",    nombre: "Cubre silla con lazo",   precio: 600,    unidad: "u." },
    ],
  },
  {
    nombre: "Decoración",
    items: [
      { id: "decoracion",     nombre: "Decoración premium",     precio: 150000, unidad: "evento" },
    ],
  },
];

interface Solicitante {
  nombre: string;
  email: string;
  tel: string;
}

type Cantidades = Record<string, number>;

const formatARS = (n: number) => "$ " + n.toLocaleString("es-AR");

function findItem(id: string) {
  for (const cat of CATEGORIAS) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

function calcTotal(cantidades: Cantidades) {
  return Object.entries(cantidades).reduce((sum, [id, qty]) => {
    const item = findItem(id);
    return sum + (item ? item.precio * qty : 0);
  }, 0);
}

function nroCotizacion() {
  const now = new Date();
  const yy  = String(now.getFullYear()).slice(2);
  const mm  = String(now.getMonth() + 1).padStart(2, "0");
  const seq = String(now.getMinutes() * 60 + now.getSeconds()).padStart(4, "0");
  return `CP-${yy}${mm}-${seq}`;
}

function fechaVencimiento() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}

function generarCotizacion(cantidades: Cantidades, solicitante: Solicitante) {
  const seleccionados = Object.entries(cantidades)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = findItem(id)!;
      return { nombre: item.nombre, unidad: item.unidad, precio: item.precio, qty, subtotal: item.precio * qty };
    });

  if (seleccionados.length === 0) return;

  const total  = seleccionados.reduce((s, i) => s + i.subtotal, 0);
  const fecha  = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
  const nro    = nroCotizacion();
  const vence  = fechaVencimiento();

  const rows = seleccionados.map((i) => `
    <tr>
      <td class="td-nombre">${i.nombre}</td>
      <td class="td-center">${i.qty}</td>
      <td class="td-center">${i.unidad}</td>
      <td class="td-right">${formatARS(i.precio)}</td>
      <td class="td-right td-sub">${formatARS(i.subtotal)}</td>
    </tr>`).join("");

  const clienteHtml = solicitante.nombre ? `
    <div class="cliente-box">
      <p class="label-small">Cotización preparada para</p>
      <p class="cliente-nombre">${solicitante.nombre}</p>
      ${solicitante.email ? `<p class="cliente-dato">✉ ${solicitante.email}</p>` : ""}
      ${solicitante.tel   ? `<p class="cliente-dato">☎ ${solicitante.tel}</p>`   : ""}
    </div>` : "";

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cotización ${nro} — Catering Profesional</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

    *  { margin:0; padding:0; box-sizing:border-box }
    body { font-family:'Inter', Arial, sans-serif; font-size:13px; color:#1a1a1a;
           background:#fff; padding:48px 56px; max-width:820px; margin:0 auto }

    /* ── HEADER ── */
    .header { display:flex; justify-content:space-between; align-items:flex-start;
              margin-bottom:36px; padding-bottom:28px;
              border-bottom:3px solid #c9a84c }
    .brand  { display:flex; flex-direction:column; gap:2px }
    .brand-name { font-family:'Playfair Display', Georgia, serif;
                  font-size:26px; font-weight:700; letter-spacing:.06em;
                  text-transform:uppercase; color:#0f0f0f }
    .brand-tag  { font-size:10px; letter-spacing:.45em; text-transform:uppercase;
                  color:#c9a84c; margin-top:2px }
    .brand-info { font-size:11px; color:#777; line-height:1.85; margin-top:10px }
    .doc-meta   { text-align:right; display:flex; flex-direction:column; gap:4px }
    .doc-tipo   { font-family:'Playfair Display', serif; font-size:18px;
                  font-weight:700; color:#c9a84c; letter-spacing:.05em }
    .doc-nro    { font-size:11px; color:#555; letter-spacing:.1em }
    .doc-fecha  { font-size:11px; color:#777 }

    /* ── PARA ── */
    .cliente-box  { background:#faf8f4; border:1px solid #e8dfc4; border-left:4px solid #c9a84c;
                    padding:14px 18px; margin-bottom:28px; border-radius:2px }
    .label-small  { font-size:9px; letter-spacing:.35em; text-transform:uppercase;
                    color:#c9a84c; margin-bottom:6px }
    .cliente-nombre { font-family:'Playfair Display', serif; font-size:16px;
                      font-weight:700; color:#0f0f0f; margin-bottom:4px }
    .cliente-dato   { font-size:11px; color:#666; line-height:1.7 }

    /* ── TABLA ── */
    table { width:100%; border-collapse:collapse; margin-bottom:0 }
    thead tr { background:#0f0f0f }
    thead th { padding:10px 14px; font-size:9px; letter-spacing:.35em;
               text-transform:uppercase; color:#c9a84c; font-weight:600;
               text-align:left }
    thead th.th-right { text-align:right }
    thead th.th-center { text-align:center }
    tbody tr { border-bottom:1px solid #f0ece4 }
    tbody tr:hover { background:#fdfbf8 }
    .td-nombre  { padding:11px 14px; color:#1a1a1a; font-weight:500 }
    .td-center  { padding:11px 14px; text-align:center; color:#666 }
    .td-right   { padding:11px 14px; text-align:right; color:#666 }
    .td-sub     { font-weight:600; color:#1a1a1a }

    /* ── TOTAL ── */
    .total-wrapper { background:#0f0f0f; padding:18px 14px;
                     display:flex; justify-content:space-between; align-items:center }
    .total-label { font-size:10px; letter-spacing:.4em; text-transform:uppercase; color:#c9a84c }
    .total-value { font-family:'Playfair Display', serif; font-size:28px;
                   font-weight:700; color:#c9a84c }

    /* ── INFO EXTRA ── */
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:28px }
    .info-box  { background:#faf8f4; border:1px solid #eee8d8; padding:14px 16px;
                 border-radius:2px }
    .info-title { font-size:9px; letter-spacing:.35em; text-transform:uppercase;
                  color:#c9a84c; margin-bottom:8px }
    .info-text  { font-size:11px; color:#666; line-height:1.75 }

    /* ── FOOTER ── */
    .footer { margin-top:36px; padding-top:18px; border-top:1px solid #e8dfc4;
              display:flex; justify-content:space-between; align-items:flex-end }
    .footer-disclaimer { font-size:10px; color:#aaa; line-height:1.7; max-width:400px }
    .footer-contact    { text-align:right; font-size:11px; color:#777; line-height:1.85 }
    .footer-brand      { font-family:'Playfair Display', serif; font-weight:700;
                         font-size:13px; color:#0f0f0f; letter-spacing:.05em;
                         text-transform:uppercase; display:block; margin-bottom:4px }

    @media print {
      body { padding:28px 36px }
      tbody tr:hover { background:transparent }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="brand">
      <div class="brand-name">Catering Profesional</div>
      <div class="brand-tag">Jujuy · Noroeste Argentino</div>
      <div class="brand-info">
        Av. Eva Perón N° 2278, B° San Pedrito<br>
        San Salvador de Jujuy, Jujuy · Argentina<br>
        +54 388 403-6629 · cateringprofesionaljujuy@gmail.com
      </div>
    </div>
    <div class="doc-meta">
      <div class="doc-tipo">Cotización</div>
      <div class="doc-nro">N° ${nro}</div>
      <div class="doc-fecha">Fecha: ${fecha}</div>
      <div class="doc-fecha" style="margin-top:4px;color:#c9a84c">Válida hasta: ${vence}</div>
    </div>
  </div>

  <!-- DATOS DEL SOLICITANTE -->
  ${clienteHtml}

  <!-- TABLA -->
  <table>
    <thead>
      <tr>
        <th style="width:42%">Artículo</th>
        <th class="th-center" style="width:10%">Cant.</th>
        <th class="th-center" style="width:10%">Unidad</th>
        <th class="th-right"  style="width:19%">Precio unit.</th>
        <th class="th-right"  style="width:19%">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <!-- TOTAL -->
  <div class="total-wrapper">
    <span class="total-label">Total estimado</span>
    <span class="total-value">${formatARS(total)}</span>
  </div>

  <!-- INFO ADICIONAL -->
  <div class="info-grid">
    <div class="info-box">
      <div class="info-title">Condiciones</div>
      <div class="info-text">
        · Se requiere depósito de garantía<br>
        · Mínimo de contratación aplicable<br>
        · Entrega y retiro del equipamiento incluidos<br>
        · Sujeto a disponibilidad de fecha y stock
      </div>
    </div>
    <div class="info-box">
      <div class="info-title">Para confirmar</div>
      <div class="info-text">
        · Responder por WhatsApp o email<br>
        · Indicar fecha y lugar del evento<br>
        · Se emitirá presupuesto formal definitivo<br>
        · Cotización válida por 7 días
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-disclaimer">
      Los precios son orientativos y están expresados en pesos argentinos (ARS).<br>
      Sujetos a modificación sin previo aviso. El presente documento no constituye<br>
      una factura ni un contrato de servicios.
    </div>
    <div class="footer-contact">
      <span class="footer-brand">Catering Profesional</span>
      +54 388 403-6629<br>
      cateringprofesionaljujuy@gmail.com<br>
      <span style="font-size:10px;color:#aaa">CUIT 27-34061402-5</span>
    </div>
  </div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=880,height=760");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 600);
}

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

const inputClass = "w-full bg-transparent border border-white/8 px-3 py-2.5 text-white/70 text-xs placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors duration-300";

export default function Alquiler() {
  const [cantidades, setCantidades]   = useState<Cantidades>({});
  const [solicitante, setSolicitante] = useState<Solicitante>({ nombre: "", email: "", tel: "" });
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const add = (id: string) =>
    setCantidades((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  const remove = (id: string) =>
    setCantidades((c) => {
      const v = (c[id] ?? 0) - 1;
      if (v <= 0) { const next = { ...c }; delete next[id]; return next; }
      return { ...c, [id]: v };
    });

  const total              = calcTotal(cantidades);
  const itemsSeleccionados = Object.entries(cantidades).filter(([, q]) => q > 0);
  const haySeleccion       = itemsSeleccionados.length > 0;

  const handleEmail = async () => {
    if (!haySeleccion) return;
    setEmailStatus("loading");

    const items = itemsSeleccionados.map(([id, qty]) => {
      const item = findItem(id)!;
      return { nombre: item.nombre, unidad: item.unidad, precio: item.precio, qty };
    });

    try {
      const res = await fetch("/api/cotizacion", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          cantidades,
          solicitante,
          items,
          total,
          nro:   nroCotizacion(),
          fecha: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }),
          vence: fechaVencimiento(),
        }),
      });
      setEmailStatus(res.ok ? "ok" : "error");
    } catch {
      setEmailStatus("error");
    }

    setTimeout(() => setEmailStatus("idle"), 5000);
  };

  const handleWhatsApp = () => {
    const lineas = itemsSeleccionados
      .map(([id, qty]) => {
        const item = findItem(id)!;
        return `  • ${item.nombre}: ${qty} ${item.unidad} — ${formatARS(item.precio * qty)}`;
      })
      .join("\n");
    const quien = solicitante.nombre ? `\n• Solicitante: ${solicitante.nombre}` : "";
    const text = encodeURIComponent(
      `Buenas tardes. Me comunico desde su sitio web con interés en el alquiler de los siguientes artículos:\n\n${lineas}\n\n• Total estimado: ${formatARS(total)}${quien}\n\nQuedo a su disposición para coordinar disponibilidad y condiciones. Muchas gracias.`
    );
    window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
  };

  return (
    <section
      id="alquiler"
      className="relative py-28 lg:py-36"
      style={{ background: "#080808" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Encabezado */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            Alquiler de equipamiento
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Vajilla &amp; <br />
            <span className="text-gold italic">Cristalería</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              Seleccioná artículos · Generá tu cotización
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Layout: categorías + resumen sticky */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Columna izquierda: categorías ── */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIAS.map((cat, ci) => (
              <motion.div
                key={cat.nombre}
                {...fadeUp(ci * 0.08)}
                className="border border-white/6 p-6 flex flex-col gap-4 hover:border-gold/15 transition-colors duration-500"
              >
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-gold/20" />
                  <h3 className="text-gold text-[10px] tracking-[0.45em] uppercase shrink-0">
                    {cat.nombre}
                  </h3>
                  <span className="h-px flex-1 bg-gold/20" />
                </div>

                <ul className="flex flex-col gap-4">
                  {cat.items.map((item) => {
                    const qty = cantidades[item.id] ?? 0;
                    return (
                      <li key={item.id} className="flex items-center justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className={cn(
                            "text-sm transition-colors duration-300",
                            qty > 0 ? "text-white/80" : "text-white/45"
                          )}>
                            {item.nombre}
                          </span>
                          <span className={cn(
                            "text-[11px] transition-colors duration-300",
                            qty > 0 ? "text-gold/70" : "text-white/20"
                          )}>
                            {formatARS(item.precio)}/{item.unidad}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => remove(item.id)}
                            disabled={qty === 0}
                            className={cn(
                              "w-7 h-7 flex items-center justify-center border transition-all duration-300",
                              qty > 0
                                ? "border-gold/40 text-gold hover:bg-gold/10"
                                : "border-white/10 text-white/15 cursor-not-allowed"
                            )}
                          >
                            <Minus size={12} />
                          </button>
                          <span className={cn(
                            "w-6 text-center text-sm font-medium transition-colors duration-300",
                            qty > 0 ? "text-gold" : "text-white/20"
                          )}>
                            {qty}
                          </span>
                          <button
                            onClick={() => add(item.id)}
                            className="w-7 h-7 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/40 hover:text-gold transition-all duration-300"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* ── Columna derecha: resumen sticky ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-28">
            <motion.div
              {...fadeUp(0.2)}
              className="border border-white/10 p-8 flex flex-col gap-6"
              style={{ background: "#111" }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gold/20" />
                <span className="text-gold text-[10px] tracking-[0.5em] uppercase">Tu cotización</span>
                <span className="h-px flex-1 bg-gold/20" />
              </div>

              {/* Datos del solicitante */}
              <div className="flex flex-col gap-2">
                <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase">Datos del solicitante</p>
                <div className="relative">
                  <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Nombre y apellido"
                    value={solicitante.nombre}
                    onChange={(e) => setSolicitante((s) => ({ ...s, nombre: e.target.value }))}
                    className={inputClass + " pl-8"}
                  />
                </div>
                <div className="relative">
                  <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={solicitante.email}
                    onChange={(e) => setSolicitante((s) => ({ ...s, email: e.target.value }))}
                    className={inputClass + " pl-8"}
                  />
                </div>
                <div className="relative">
                  <PhoneCall size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp"
                    value={solicitante.tel}
                    onChange={(e) => setSolicitante((s) => ({ ...s, tel: e.target.value }))}
                    className={inputClass + " pl-8"}
                  />
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Artículos seleccionados */}
              <div className="flex flex-col gap-2 min-h-[60px]">
                {haySeleccion ? (
                  itemsSeleccionados.map(([id, qty]) => {
                    const item = findItem(id)!;
                    return (
                      <div key={id} className="flex justify-between items-center text-xs">
                        <span className="text-white/50 truncate pr-2 max-w-[160px]">
                          {item.nombre} × {qty}
                        </span>
                        <span className="text-white/35 shrink-0">
                          {formatARS(item.precio * qty)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white/15 text-xs italic text-center mt-2">
                    Usá los botones + para agregar artículos
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="h-px bg-white/5" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase">
                  Total estimado
                </span>
                {haySeleccion ? (
                  <p
                    className="text-4xl font-display font-bold text-gold"
                    style={{ fontFamily: "var(--font-display, serif)" }}
                  >
                    {formatARS(total)}
                  </p>
                ) : (
                  <p className="text-white/15 text-lg italic" style={{ fontFamily: "var(--font-display, serif)" }}>
                    —
                  </p>
                )}
                <p className="text-white/20 text-[10px] text-center mt-1">
                  Orientativo · Sujeto a disponibilidad
                </p>
              </div>

              {/* CTAs */}
              <button
                onClick={() => generarCotizacion(cantidades, solicitante)}
                disabled={!haySeleccion}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-4 font-semibold text-sm tracking-widest uppercase transition-all duration-300",
                  haySeleccion
                    ? "bg-gold hover:bg-gold-light text-charcoal hover:shadow-lg hover:shadow-gold/20"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                )}
              >
                <Printer size={14} strokeWidth={2} />
                Imprimir cotización
              </button>

              {/* Botón email */}
              <button
                onClick={handleEmail}
                disabled={!haySeleccion || emailStatus === "loading" || emailStatus === "ok"}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-3.5 border font-medium text-xs tracking-widest uppercase transition-all duration-300",
                  emailStatus === "ok"
                    ? "border-green-500/40 text-green-400 cursor-default"
                    : emailStatus === "error"
                    ? "border-red-500/40 text-red-400"
                    : haySeleccion
                    ? "border-white/20 text-white/50 hover:border-gold/40 hover:text-gold"
                    : "border-white/10 text-white/20 cursor-not-allowed"
                )}
              >
                {emailStatus === "loading" ? (
                  <><Loader2 size={13} className="animate-spin" /> Enviando...</>
                ) : emailStatus === "ok" ? (
                  <><CheckCircle size={13} /> Cotización enviada</>
                ) : (
                  <><Mail size={13} strokeWidth={2} /> Enviar por email</>
                )}
              </button>

              {emailStatus === "ok" && (
                <p className="text-white/20 text-[10px] text-center -mt-3">
                  {solicitante.email ? "Enviado al catering y a su correo" : "Enviado al catering"}
                </p>
              )}
              {emailStatus === "error" && (
                <p className="text-red-400/60 text-[10px] text-center -mt-3">
                  Error al enviar. Intente nuevamente.
                </p>
              )}

              {/* Botón WhatsApp */}
              <button
                onClick={handleWhatsApp}
                disabled={!haySeleccion}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-3.5 border font-medium text-xs tracking-widest uppercase transition-all duration-300",
                  haySeleccion
                    ? "border-gold/50 text-gold hover:bg-gold/5"
                    : "border-white/10 text-white/20 cursor-not-allowed"
                )}
              >
                <Send size={13} strokeWidth={2} />
                Enviar por WhatsApp
              </button>

              {haySeleccion && emailStatus === "idle" && (
                <p className="text-white/20 text-[10px] text-center -mt-3">
                  WhatsApp envía el resumen en texto
                </p>
              )}

              <div className="h-px bg-white/5" />

              <a
                href="tel:+5493884036629"
                className="flex items-center justify-center gap-2 text-white/30 hover:text-gold transition-colors duration-300 text-sm tracking-wider"
              >
                <Phone size={13} />
                O llamanos directamente
              </a>
            </motion.div>
          </div>
        </div>

        {/* Aviso */}
        <motion.div {...fadeUp(0.3)} className="flex justify-center mt-12">
          <p className="text-white/20 text-xs tracking-wider text-center max-w-md">
            Precios orientativos por unidad. Se requiere depósito de garantía y mínimo de contratación.
            Consulte disponibilidad para su fecha.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
