"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Printer, Plus, Minus, Send } from "lucide-react";
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

function generarCotizacion(cantidades: Cantidades) {
  const seleccionados = Object.entries(cantidades)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = findItem(id)!;
      return { nombre: item.nombre, unidad: item.unidad, precio: item.precio, qty, subtotal: item.precio * qty };
    });

  if (seleccionados.length === 0) return;

  const total = seleccionados.reduce((s, i) => s + i.subtotal, 0);
  const fecha = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

  const rows = seleccionados
    .map(
      (i) => `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#1a1a1a">${i.nombre}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:center;color:#555">${i.qty} ${i.unidad}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right;color:#555">${formatARS(i.precio)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:#1a1a1a">${formatARS(i.subtotal)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cotización — Catering Profesional</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;background:#fff;padding:40px;max-width:780px;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #c9a84c;margin-bottom:32px}
    .brand-name{font-size:22px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
    .brand-sub{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#c9a84c;margin-top:4px}
    .brand-info{font-size:11px;color:#666;line-height:1.8;margin-top:8px}
    .doc-title{font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#c9a84c;text-align:right}
    .doc-date{font-size:12px;color:#666;text-align:right;margin-top:6px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    thead tr{background:#f9f6ef}
    thead th{padding:10px 14px;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#c9a84c;font-weight:600;border-bottom:1px solid #e8dfc4;text-align:left}
    .total-row td{padding:14px;border-top:2px solid #c9a84c}
    .total-label{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#666}
    .total-value{text-align:right;font-size:20px;font-weight:700;color:#c9a84c}
    .footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:flex-end}
    .disclaimer{font-size:10px;color:#999;line-height:1.7;max-width:420px}
    .contact{text-align:right;font-size:11px;color:#666;line-height:1.8}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">Catering Profesional</div>
      <div class="brand-sub">Jujuy · NOA</div>
      <div class="brand-info">
        Av. Eva Perón N° 2278, B° San Pedrito — Jujuy<br>
        +54 388 403-6629 · cateringprofesionaljujuy@gmail.com
      </div>
    </div>
    <div>
      <div class="doc-title">Cotización preliminar</div>
      <div class="doc-date">Fecha: ${fecha}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Artículo</th>
        <th style="text-align:center">Cantidad</th>
        <th style="text-align:right">Precio unit.</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="3" class="total-label">Total estimado</td>
        <td class="total-value">${formatARS(total)}</td>
      </tr>
    </tbody>
  </table>
  <div class="footer">
    <div class="disclaimer">
      Cotización orientativa. Los precios están sujetos a disponibilidad y pueden variar.<br>
      Se requiere depósito de garantía y mínimo de contratación. Válido por 7 días.<br>
      Para confirmar, comunicarse con nosotros a través de los datos de contacto.
    </div>
    <div class="contact">
      <strong style="letter-spacing:.1em;text-transform:uppercase">Catering Profesional</strong><br>
      +54 388 403-6629<br>
      cateringprofesionaljujuy@gmail.com
    </div>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=820,height=700");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

export default function Alquiler() {
  const [cantidades, setCantidades] = useState<Cantidades>({});

  const add = (id: string) =>
    setCantidades((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  const remove = (id: string) =>
    setCantidades((c) => {
      const v = (c[id] ?? 0) - 1;
      if (v <= 0) {
        const next = { ...c };
        delete next[id];
        return next;
      }
      return { ...c, [id]: v };
    });

  const total              = calcTotal(cantidades);
  const itemsSeleccionados = Object.entries(cantidades).filter(([, q]) => q > 0);
  const haySeleccion       = itemsSeleccionados.length > 0;

  const handleWhatsApp = () => {
    const lineas = itemsSeleccionados
      .map(([id, qty]) => {
        const item = findItem(id)!;
        return `  • ${item.nombre}: ${qty} ${item.unidad} — ${formatARS(item.precio * qty)}`;
      })
      .join("\n");
    const text = encodeURIComponent(
      `Buenas tardes. Me comunico desde su sitio web con interés en el alquiler de los siguientes artículos:\n\n${lineas}\n\n• Total estimado: ${formatARS(total)}\n\nQuedo a su disposición para coordinar disponibilidad y condiciones. Muchas gracias.`
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

          {/* ── Columna izquierda: categorías con controles ── */}
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

              {/* Artículos seleccionados */}
              <div className="flex flex-col gap-2 min-h-[80px]">
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
                  <p className="text-white/15 text-xs italic text-center mt-3">
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
                  <p
                    className="text-white/15 text-lg italic"
                    style={{ fontFamily: "var(--font-display, serif)" }}
                  >
                    —
                  </p>
                )}
                <p className="text-white/20 text-[10px] text-center mt-1">
                  Orientativo · Sujeto a disponibilidad
                </p>
              </div>

              {/* CTAs */}
              <button
                onClick={() => generarCotizacion(cantidades)}
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

              {haySeleccion && (
                <p className="text-white/20 text-[10px] text-center -mt-3">
                  Se enviará el detalle completo de su selección
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
