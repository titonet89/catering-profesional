import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { VAJILLA_CATEGORIAS, formatARS } from "@/data/vajilla";
import type { VajillaItemPedido } from "@/data/vajilla";
import PrintButton from "./PrintButton";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
});

type Params = { params: Promise<{ id: string }> };

async function getCotizacion(id: string) {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await db
    .from("cotizacion_vajilla")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

const BG        = "#f2ede4";
const BROWN     = "#4a1e08";
const SIENNA    = "#8B4513";
const GOLD      = "#C9A84C";
const FOOTER_BG = "#2c1005";

export default async function CotizacionVajillaPage({ params }: Params) {
  const { id } = await params;
  const cotizacion = await getCotizacion(id);
  if (!cotizacion) notFound();

  const items: VajillaItemPedido[] = cotizacion.items ?? [];
  const total = cotizacion.precio_override ?? cotizacion.total ?? 0;

  const fechaRaw = cotizacion.fecha_evento
    ? new Date(cotizacion.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;
  const fechaFormateada = fechaRaw
    ? fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1)
    : "A confirmar";

  const nroCotizacion = cotizacion.id.slice(0, 8).toUpperCase();

  // Agrupar ítems por categoría para mostrarlos ordenados
  const itemsByCategoria = VAJILLA_CATEGORIAS.map((cat) => ({
    nombre: cat.nombre,
    icono:  cat.icono,
    items:  items.filter((i) => cat.items.some((ci) => ci.id === i.id)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className={dancingScript.variable} style={{ background: BG, minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", position: "relative" }}>

      <style>{`
        .pres-script { font-family: var(--font-dancing), 'Brush Script MT', cursive; }
        .pres-serif  { font-family: var(--font-playfair), Georgia, serif; }

        @media print {
          .no-print { display: none !important; }
          body { background: ${BG} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm 10mm; }
        }

        @media (max-width: 640px) {
          .client-grid  { grid-template-columns: 1fr !important; }
          .precio-grid  { grid-template-columns: 1fr !important; }
          .pres-wrap    { padding: 20px 14px !important; }
          .footer-row   { flex-direction: column !important; align-items: center !important; gap: 16px !important; }
        }
      `}</style>

      {/* ── Barra de acción ── */}
      <div className="no-print" style={{ background: "#1a1010", display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px" }}>
        <a
          href="https://wa.me/5493884036629"
          target="_blank" rel="noopener noreferrer"
          style={{ background: "#25D366", color: "#fff", textDecoration: "none", padding: "8px 16px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "sans-serif" }}
        >
          📱 Contactar por WhatsApp
        </a>
        <PrintButton />
      </div>

      {/* ── Marca de agua ── */}
      <div aria-hidden style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 480, height: 480, opacity: 0.045, pointerEvents: "none", zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* ══════════════════════ PÁGINA ══════════════════════ */}
      <div className="pres-wrap" style={{ maxWidth: 860, margin: "0 auto", padding: "40px 36px", position: "relative", zIndex: 1 }}>

        {/* ── CABECERA ── */}
        <header style={{ textAlign: "center", marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Catering Profesional" style={{ height: 82, width: "auto", display: "block", margin: "0 auto 12px" }} />
          <h1 className="pres-serif" style={{ fontSize: 32, fontWeight: 900, color: BROWN, letterSpacing: 7, textTransform: "uppercase", margin: "0 0 4px", lineHeight: 1 }}>
            Catering Profesional
          </h1>
          <p style={{ color: SIENNA, fontSize: 10, letterSpacing: 6, textTransform: "uppercase", margin: "0 0 12px", fontWeight: 700 }}>
            Eventos &amp; Gastronomía · Jujuy
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}50`, maxWidth: 110 }} />
            <p style={{ color: SIENNA, fontSize: 11, fontStyle: "italic", margin: 0, whiteSpace: "nowrap" }}>
              Alquiler de vajilla y equipamiento para eventos
            </p>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}50`, maxWidth: 110 }} />
          </div>
        </header>

        {/* separador */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px" }}>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}40` }} />
          <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}40` }} />
        </div>

        {/* ── TÍTULO COTIZACIÓN ── */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 52, height: 1.5, background: SIENNA }} />
              <span style={{ color: SIENNA, fontSize: 15 }}>◆</span>
              <div style={{ width: 18, height: 1.5, background: SIENNA }} />
            </div>
            <h2 className="pres-serif" style={{ fontSize: 38, fontWeight: 900, color: BROWN, margin: 0, letterSpacing: 9, textTransform: "uppercase", lineHeight: 1 }}>
              COTIZACIÓN
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 18, height: 1.5, background: SIENNA }} />
              <span style={{ color: SIENNA, fontSize: 15 }}>◆</span>
              <div style={{ width: 52, height: 1.5, background: SIENNA }} />
            </div>
          </div>
          <p className="pres-script" style={{ fontSize: 30, color: SIENNA, margin: "0 0 6px", fontWeight: 700 }}>
            Vajilla &amp; Cristalería
          </p>
          <p style={{ color: "#999", fontSize: 10, letterSpacing: 2, margin: "0 0 10px" }}>N° {nroCotizacion}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 45, height: 1, background: `${GOLD}50` }} />
            <span style={{ color: GOLD, fontSize: 18 }}>❧</span>
            <div style={{ width: 45, height: 1, background: `${GOLD}50` }} />
          </div>
        </div>

        {/* ── DATOS DEL CLIENTE ── */}
        <div className="client-grid" style={{
          border: `1.5px solid ${SIENNA}50`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          marginBottom: 28,
        }}>
          <div style={{ padding: "18px 20px", borderRight: `1px solid ${SIENNA}30` }}>
            {[
              { icon: "👤", label: "Cliente",  valor: cotizacion.nombre },
              { icon: "📅", label: "Fecha",    valor: fechaFormateada },
              { icon: "📍", label: "Lugar",    valor: cotizacion.lugar || "A confirmar" },
            ].map(({ icon, label, valor }, i) => (
              <div key={label} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13 }}>{icon}</span>
                  <span style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
                </div>
                <p style={{ color: BROWN, fontSize: 13, margin: "0 0 0 19px", fontWeight: 600, lineHeight: 1.4 }}>{valor}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 20px", borderRight: `1px solid ${SIENNA}30` }}>
            {[
              { icon: "🎉", label: "Evento",    valor: cotizacion.tipo_evento || "A confirmar" },
              { icon: "📞", label: "Teléfono",  valor: cotizacion.telefono },
              { icon: "✉",  label: "Email",     valor: cotizacion.email || "—" },
            ].map(({ icon, label, valor }, i) => (
              <div key={label} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13 }}>{icon}</span>
                  <span style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
                </div>
                <p style={{ color: BROWN, fontSize: 13, margin: "0 0 0 19px", fontWeight: 600, lineHeight: 1.4 }}>{valor}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 20px", minWidth: 185, background: `${SIENNA}09` }}>
            <p style={{ color: SIENNA, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px", textAlign: "center", borderBottom: `1px solid ${SIENNA}30`, paddingBottom: 7 }}>
              Condiciones
            </p>
            {[
              "Se requiere depósito de garantía",
              "Entrega y retiro incluidos",
              "Sujeto a disponibilidad de stock",
              "Válida por 7 días",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                <span style={{ color: SIENNA, fontSize: 13, lineHeight: 1.3, flexShrink: 0 }}>✓</span>
                <span style={{ color: BROWN, fontSize: 11, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── DETALLE DE ÍTEMS ── */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}44` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: GOLD, fontSize: 9 }}>◆</span>
              <h3 className="pres-serif" style={{ color: BROWN, fontSize: 18, letterSpacing: 8, textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
                DETALLE
              </h3>
              <span style={{ color: GOLD, fontSize: 9 }}>◆</span>
            </div>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}44` }} />
          </div>

          {/* Tabla de ítems por categoría */}
          {itemsByCategoria.map((grupo) => (
            <div key={grupo.nombre} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{grupo.icono}</span>
                <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                  {grupo.nombre}
                </p>
                <div style={{ flex: 1, height: 1, background: `${SIENNA}25` }} />
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: `${SIENNA}12` }}>
                    <th style={{ padding: "7px 12px", textAlign: "left",   color: SIENNA, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Artículo</th>
                    <th style={{ padding: "7px 12px", textAlign: "center", color: SIENNA, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 70 }}>Cant.</th>
                    <th style={{ padding: "7px 12px", textAlign: "center", color: SIENNA, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 70 }}>Unidad</th>
                    <th style={{ padding: "7px 12px", textAlign: "right",  color: SIENNA, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 110 }}>Precio unit.</th>
                    <th style={{ padding: "7px 12px", textAlign: "right",  color: SIENNA, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 110 }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {grupo.items.map((item, i) => (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? "transparent" : `${SIENNA}05`, borderBottom: `1px solid ${SIENNA}15` }}>
                      <td style={{ padding: "9px 12px", color: BROWN, fontSize: 12, fontWeight: 500 }}>{item.nombre}</td>
                      <td style={{ padding: "9px 12px", textAlign: "center", color: "#4a3020", fontSize: 12 }}>{item.qty}</td>
                      <td style={{ padding: "9px 12px", textAlign: "center", color: "#4a3020", fontSize: 12 }}>{item.unidad}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#4a3020", fontSize: 12 }}>{formatARS(item.precio_unitario)}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: BROWN, fontSize: 12, fontWeight: 700 }}>{formatARS(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>

        {/* ── NOTAS ── */}
        {cotizacion.notas_admin && (
          <div style={{ border: `1px solid ${SIENNA}44`, padding: "14px 18px", marginBottom: 24, background: `${SIENNA}08` }}>
            <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
              Notas y personalizaciones
            </p>
            <p style={{ color: BROWN, fontSize: 13, margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{cotizacion.notas_admin}</p>
          </div>
        )}

        {/* separador */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px" }}>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}35` }} />
          <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}35` }} />
        </div>

        {/* ── TOTAL ── */}
        <div className="precio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ border: `1px solid ${SIENNA}30`, padding: "16px 20px", background: `${SIENNA}06` }}>
            <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>Artículos seleccionados</p>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#4a3020", fontSize: 11 }}>{item.nombre} × {item.qty}</span>
                <span style={{ color: BROWN, fontSize: 11, fontWeight: 600 }}>{formatARS(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div style={{ border: `2.5px solid ${GOLD}`, padding: "20px 22px", textAlign: "center", background: "#fffaf4" }}>
            <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 12px" }}>Total estimado</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 1, background: `${GOLD}55` }} />
              <p className="pres-serif" style={{ color: BROWN, fontSize: 30, fontWeight: 900, margin: 0, whiteSpace: "nowrap" }}>
                {formatARS(total)}
              </p>
              <div style={{ flex: 1, height: 1, background: `${GOLD}55` }} />
            </div>
            <p style={{ color: "#aaa", fontSize: 10, margin: "6px 0 0", fontStyle: "italic" }}>
              Orientativo · Sujeto a disponibilidad
            </p>
          </div>
        </div>

        <p style={{ color: "#aaa", fontSize: 10, textAlign: "center", marginBottom: 28, fontStyle: "italic" }}>
          Los precios son orientativos, expresados en pesos argentinos (ARS). Válida por 7 días.
        </p>

        {/* ── FOOTER ── */}
        <footer style={{ background: FOOTER_BG, padding: "18px 24px" }}>
          <div className="footer-row" style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {[
              { icon: "📞", label: "Tel / WhatsApp", valor: "388 403-6629" },
              { icon: "✉",  label: "Email",          valor: "info@cateringprofesional.com.ar" },
              { icon: "🌐", label: "Web",             valor: "cateringprofesional.com.ar" },
              { icon: "📍", label: "Ubicación",       valor: "San Salvador de Jujuy" },
              { icon: "f",  label: "Facebook",        valor: "Catering Profesional Jujuy", fb: true },
              { icon: "◎", label: "Instagram",       valor: "@catering.profesional.jujuy" },
            ].map(({ icon, label, valor, fb }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: fb ? 14 : 16, marginBottom: 3, color: GOLD, fontWeight: fb ? 900 : undefined, fontFamily: fb ? "Georgia, serif" : undefined, lineHeight: 1 }}>
                  {icon}
                </div>
                <p style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 2px", color: GOLD }}>{label}</p>
                <p style={{ fontSize: 10, margin: 0, color: "#e8d5b0" }}>{valor}</p>
              </div>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
