import { notFound } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { VAJILLA_CATEGORIAS, formatARS } from "@/data/vajilla";
import type { VajillaItemPedido } from "@/data/vajilla";
import { supabaseAdmin } from "@/lib/supabase-server";
import PrintButton from "./PrintButton";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
});

type Params = { params: Promise<{ id: string }> };

async function getCotizacion(id: string) {
  const { data } = await supabaseAdmin()
    .from("cotizacion_vajilla")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

const BG     = "#f3ede3";
const BROWN  = "#2a1206";
const RUST   = "#8B3A1E";
const COPPER = "#A0522D";
const GOLD   = "#C9A84C";
const FOOTER = "#2c1005";

// ─── Íconos SVG monolinea ─────────────────────────────────────────────────────

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5"/>
      <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.7 2 6 4.7 6 8c0 5 6 14 6 14s6-9 6-14c0-3.3-2.7-6-6-6z"/>
      <circle cx="12" cy="8" r="2.5"/>
    </svg>
  );
}
function IconCloche() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13C3 8.03 7.03 4 12 4s9 4.03 9 9"/>
      <line x1="2" y1="13" x2="22" y2="13"/>
      <line x1="5" y1="17" x2="19" y2="17"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 6 L12 13 L22 6"/>
    </svg>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

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

  const nro = cotizacion.id.slice(0, 8).toUpperCase();

  const itemsByCategoria = VAJILLA_CATEGORIAS.map((cat) => ({
    nombre: cat.nombre,
    icono:  cat.icono,
    items:  items.filter((i) => cat.items.some((ci) => ci.id === i.id)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className={dancingScript.variable} style={{ background: BG, minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", position: "relative" }}>

      <style>{`
        .sc { font-family: var(--font-dancing), 'Brush Script MT', cursive; }
        .sf { font-family: var(--font-playfair), Georgia, serif; }

        @page { margin: 6mm 8mm; size: A4; }
        @media print {
          .no-print { display: none !important; }
          body { background: ${BG} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @media (max-width: 640px) {
          .cli-grid { grid-template-columns: 1fr !important; }
          .tot-grid  { grid-template-columns: 1fr !important; }
          .wrap      { padding: 20px 14px !important; }
        }
      `}</style>

      {/* Barra de acciones */}
      <div className="no-print" style={{ background: "#1a0d06", display: "flex", justifyContent: "flex-end", gap: 10, padding: "10px 18px" }}>
        <a href="https://wa.me/5493884036629" target="_blank" rel="noopener noreferrer"
          style={{ background: "#25D366", color: "#fff", textDecoration: "none", padding: "7px 14px", fontSize: 12, fontFamily: "sans-serif", display: "inline-flex", alignItems: "center", gap: 5 }}>
          📱 Contactar por WhatsApp
        </a>
        <PrintButton />
      </div>

      {/* Marca de agua fondo */}
      <div aria-hidden style={{ position: "fixed", top: "5%", right: "-4%", width: 320, height: 320, opacity: 0.06, pointerEvents: "none", zIndex: 0, transform: "rotate(15deg)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* ═══════════════ CONTENIDO ═══════════════ */}
      <div className="wrap" style={{ maxWidth: 840, margin: "0 auto", padding: "36px 32px", position: "relative", zIndex: 1 }}>

        {/* ══ CABECERA ══ */}
        <header style={{ textAlign: "center", marginBottom: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Catering Profesional" style={{ height: 90, width: "auto", display: "block", margin: "0 auto 10px" }} />
          <h1 className="sf" style={{ fontSize: 34, fontWeight: 900, color: BROWN, letterSpacing: 8, textTransform: "uppercase", margin: "0 0 3px", lineHeight: 1 }}>
            CATERING PROFESIONAL
          </h1>
          <p style={{ color: COPPER, fontSize: 11, letterSpacing: 7, textTransform: "uppercase", margin: "0 0 8px", fontWeight: 700 }}>
            EVENTOS &amp; GASTRONOMÍA
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ flex: 1, height: 1, background: `${COPPER}60`, maxWidth: 120 }} />
            <p style={{ color: COPPER, fontSize: 11, fontStyle: "italic", margin: 0, whiteSpace: "nowrap" }}>
              Alquiler de vajilla y equipamiento para eventos
            </p>
            <div style={{ flex: 1, height: 1, background: `${COPPER}60`, maxWidth: 120 }} />
          </div>
        </header>

        {/* ══ TÍTULO COTIZACIÓN ══ */}
        <div style={{ textAlign: "center", marginBottom: 6, paddingTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ color: RUST, fontSize: 10, lineHeight: 1 }}>◆</span>
              <div style={{ width: 70, height: 1.5, background: RUST }} />
            </div>
            <h2 className="sf" style={{
              fontSize: 54,
              fontWeight: 900,
              color: RUST,
              margin: 0,
              letterSpacing: 6,
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              COTIZACIÓN
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 70, height: 1.5, background: RUST }} />
              <span style={{ color: RUST, fontSize: 10, lineHeight: 1 }}>◆</span>
            </div>
          </div>

          <p className="sc" style={{ fontSize: 36, color: COPPER, margin: "0 0 4px", fontWeight: 700, lineHeight: 1.15 }}>
            Vajilla &amp; Cristalería
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 36, height: 1, background: `${GOLD}70` }} />
            <svg width="22" height="12" viewBox="0 0 40 20" fill="none">
              <path d="M2 10 C8 2 14 2 20 10 C26 18 32 18 38 10" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="20" cy="10" r="2" fill={GOLD}/>
            </svg>
            <div style={{ width: 36, height: 1, background: `${GOLD}70` }} />
          </div>

          <p style={{ color: "#bbb", fontSize: 10, letterSpacing: 2, margin: 0 }}>N° {nro}</p>
        </div>

        {/* ══ DATOS DEL CLIENTE ══ */}
        <div className="cli-grid" style={{
          border: `1.5px solid ${COPPER}50`,
          borderRadius: 4,
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          marginBottom: 22,
          marginTop: 16,
        }}>
          {/* Col 1 */}
          <div style={{ padding: "14px 18px", borderRight: `1px solid ${COPPER}30` }}>
            {[
              { Icon: IconPerson,   lbl: "Cliente:",  val: cotizacion.nombre },
              { Icon: IconCalendar, lbl: "Fecha:",    val: fechaFormateada },
              { Icon: IconPin,      lbl: "Lugar:",    val: cotizacion.lugar || "A confirmar" },
            ].map(({ Icon, lbl, val }, i) => (
              <div key={lbl} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <Icon />
                  <span style={{ color: RUST, fontSize: 12, fontWeight: 700 }}>{lbl}</span>
                </div>
                <div style={{ marginLeft: 30, borderBottom: `1px dotted ${COPPER}50`, paddingBottom: 3 }}>
                  <span style={{ color: BROWN, fontSize: 12, fontWeight: 600 }}>{val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Col 2 */}
          <div style={{ padding: "14px 18px", borderRight: `1px solid ${COPPER}30` }}>
            {[
              { Icon: IconCloche, lbl: "Evento:",    val: cotizacion.tipo_evento || "A confirmar" },
              { Icon: IconPhone,  lbl: "Teléfono:",  val: cotizacion.telefono },
              { Icon: IconMail,   lbl: "Email:",     val: cotizacion.email || "—" },
            ].map(({ Icon, lbl, val }, i) => (
              <div key={lbl} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <Icon />
                  <span style={{ color: RUST, fontSize: 12, fontWeight: 700 }}>{lbl}</span>
                </div>
                <div style={{ marginLeft: 30, borderBottom: `1px dotted ${COPPER}50`, paddingBottom: 3 }}>
                  <span style={{ color: BROWN, fontSize: 12, fontWeight: 600 }}>{val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Col 3: Condiciones */}
          <div style={{ padding: "12px 16px", minWidth: 185, background: `${COPPER}08`, borderRadius: "0 4px 4px 0" }}>
            <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>
              CONDICIONES
            </p>
            <div style={{ height: 1, background: `${GOLD}50`, marginBottom: 10 }} />
            {[
              "Se requiere depósito de garantía",
              "Entrega y retiro incluidos",
              "Sujeto a disponibilidad de stock",
              "Válida por 7 días",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="8" cy="8" r="7" stroke={RUST} strokeWidth="1.2"/>
                  <path d="M5 8 L7 10 L11 6" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: BROWN, fontSize: 11, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <svg width="48" height="16" viewBox="0 0 60 18" fill="none">
                <path d="M2 9 C10 2 20 2 30 9 C40 16 50 16 58 9" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="30" cy="9" r="2" fill={GOLD}/>
              </svg>
            </div>
          </div>
        </div>

        {/* ══ DETALLE DE ÍTEMS ══ */}
        <section style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: `${COPPER}50` }} />
            <h3 className="sf" style={{ color: BROWN, fontSize: 22, letterSpacing: 10, textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
              DETALLE
            </h3>
            <div style={{ flex: 1, height: 1, background: `${COPPER}50` }} />
          </div>

          {itemsByCategoria.map((grupo) => (
            <div key={grupo.nombre} style={{ marginBottom: 22 }}>
              {/* Encabezado de categoría */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{grupo.icono}</span>
                <span style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>
                  {grupo.nombre}
                </span>
                <div style={{ flex: 1, height: 1, background: `${COPPER}30` }} />
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: `${RUST}12` }}>
                    <th style={{ padding: "7px 12px", textAlign: "left",   color: RUST, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Artículo</th>
                    <th style={{ padding: "7px 12px", textAlign: "center", color: RUST, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 70 }}>Cant.</th>
                    <th style={{ padding: "7px 12px", textAlign: "center", color: RUST, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 70 }}>Unidad</th>
                    <th style={{ padding: "7px 12px", textAlign: "right",  color: RUST, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 110 }}>Precio unit.</th>
                    <th style={{ padding: "7px 12px", textAlign: "right",  color: RUST, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, width: 110 }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {grupo.items.map((item, i) => (
                    <tr key={item.id} style={{ background: i % 2 === 0 ? "transparent" : `${RUST}05`, borderBottom: `1px solid ${COPPER}20` }}>
                      <td style={{ padding: "9px 12px", color: BROWN, fontSize: 12, fontWeight: 500 }}>{item.nombre}</td>
                      <td style={{ padding: "9px 12px", textAlign: "center", color: "#3a2010", fontSize: 12 }}>{item.qty}</td>
                      <td style={{ padding: "9px 12px", textAlign: "center", color: "#3a2010", fontSize: 12 }}>{item.unidad}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#3a2010", fontSize: 12 }}>{formatARS(item.precio_unitario)}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: BROWN, fontSize: 12, fontWeight: 700 }}>{formatARS(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>

        {/* Separador ornamental */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "0 0 18px" }}>
          <div style={{ flex: 1, height: 1, background: `${COPPER}40` }} />
          <svg width="32" height="16" viewBox="0 0 40 18" fill="none">
            <path d="M2 9 C8 3 16 3 20 9 C24 15 32 15 38 9" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="9" r="2.5" fill={GOLD}/>
          </svg>
          <div style={{ flex: 1, height: 1, background: `${COPPER}40` }} />
        </div>

        {/* ══ RESUMEN + TOTAL ══ */}
        <div className="tot-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 0, marginBottom: 18, border: `1.5px solid ${COPPER}40` }}>
          {/* Resumen de ítems */}
          <div style={{ padding: "16px 20px", borderRight: `1.5px solid ${COPPER}40` }}>
            <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>
              Artículos seleccionados
            </p>
            <div style={{ borderBottom: `1px dotted ${COPPER}50`, marginBottom: 10 }} />
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: "#3a2010", fontSize: 12 }}>{item.nombre} × {item.qty}</span>
                <span style={{ color: BROWN, fontSize: 12, fontWeight: 700 }}>{formatARS(item.subtotal)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ padding: "20px 24px", minWidth: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fffaf4" }}>
            <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 12px", fontWeight: 700 }}>
              TOTAL ESTIMADO
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 1.5, background: `${GOLD}70` }} />
              <span style={{ color: RUST, fontSize: 18, fontWeight: 700, fontFamily: "Georgia, serif" }}>$</span>
              <div style={{ width: 24, height: 1.5, background: `${GOLD}70` }} />
            </div>
            <p className="sf" style={{ color: BROWN, fontSize: 32, fontWeight: 900, margin: "0 0 6px", lineHeight: 1 }}>
              {formatARS(total)}
            </p>
            <p style={{ color: "#aaa", fontSize: 9, margin: 0, fontStyle: "italic", textAlign: "center" }}>
              Orientativo · Sujeto a disponibilidad<br/>Expresado en pesos argentinos (ARS)
            </p>
          </div>
        </div>

        {/* Notas del admin */}
        {cotizacion.notas_admin && (
          <div style={{ border: `1px solid ${COPPER}44`, padding: "12px 16px", marginBottom: 18, background: `${COPPER}08`, borderRadius: 2 }}>
            <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>
              Notas y observaciones
            </p>
            <p style={{ color: BROWN, fontSize: 12, margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{cotizacion.notas_admin}</p>
          </div>
        )}

        {/* Separador final */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "0 0 18px" }}>
          <div style={{ flex: 1, height: 1, background: `${COPPER}30` }} />
          <svg width="32" height="16" viewBox="0 0 40 18" fill="none">
            <path d="M2 9 C8 3 16 3 20 9 C24 15 32 15 38 9" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="9" r="2.5" fill={GOLD}/>
          </svg>
          <div style={{ flex: 1, height: 1, background: `${COPPER}30` }} />
        </div>

        {/* ══ FOOTER ══ */}
        <footer style={{ background: FOOTER, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "14px 28px" }}>
            {[
              {
                svg: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1.2"/>
                    <path d="M22 20.5c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.6-.7c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6H10c-.3 0-.6.1-.9.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2l-.6-.1z" fill={GOLD}/>
                  </svg>
                ),
                label: "Tel / WhatsApp", valor: "388 403 6629",
              },
              {
                svg: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1.2"/>
                    <rect x="7" y="11" width="18" height="12" rx="1.5" stroke={GOLD} strokeWidth="1.2"/>
                    <path d="M7 12 L16 18 L25 12" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                label: "Email", valor: "cateringprofesionaljujuy@gmail.com",
              },
              {
                svg: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1.2"/>
                    <circle cx="16" cy="16" r="9" stroke={GOLD} strokeWidth="1.2"/>
                    <path d="M7 16 H25 M16 7 Q12 13 12 16 Q12 19 16 25 M16 7 Q20 13 20 16 Q20 19 16 25" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                label: "Web", valor: "www.cateringprofesional.com.ar",
              },
              {
                svg: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1.2"/>
                    <path d="M19 10h2.5v3H19c-.8 0-1 .4-1 1v1.5h3.5L21 19h-3v9h-4v-9h-2v-3.5h2V14c0-2.8 1.7-4 4-4z" stroke={GOLD} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: "Facebook", valor: "Catering Profesional Jujuy",
              },
              {
                svg: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1.2"/>
                    <rect x="9" y="9" width="14" height="14" rx="4" stroke={GOLD} strokeWidth="1.2"/>
                    <circle cx="16" cy="16" r="4" stroke={GOLD} strokeWidth="1.2"/>
                    <circle cx="21.5" cy="10.5" r="1" fill={GOLD}/>
                  </svg>
                ),
                label: "Instagram", valor: "@catering.profesional.jujuy",
              },
              {
                svg: (
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1.2"/>
                    <path d="M16 7C12.7 7 10 9.7 10 13c0 5 6 12 6 12s6-7 6-12c0-3.3-2.7-6-6-6z" stroke={GOLD} strokeWidth="1.2" fill="none"/>
                    <circle cx="16" cy="13" r="2.5" stroke={GOLD} strokeWidth="1.2"/>
                  </svg>
                ),
                label: "Ubicación", valor: "San Salvador de Jujuy, Jujuy, Argentina",
              },
            ].map(({ svg, label, valor }) => (
              <div key={label} style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{svg}</div>
                <p style={{ color: GOLD, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
                <p style={{ color: "#e0c8a0", fontSize: 10, margin: 0, lineHeight: 1.3 }}>{valor}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span style={{ color: GOLD, fontSize: 12 }}>◆</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
