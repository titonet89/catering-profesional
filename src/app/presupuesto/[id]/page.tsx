import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { PAQUETES, formatPrecio, PRECIO_MINIMO_INVITADOS } from "@/data/paquetes";
import PrintButton from "./PrintButton";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
});

type Params = { params: Promise<{ id: string }> };

async function getSolicitud(id: string) {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await db
    .from("presupuesto_solicitudes")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

const SECTION_LABELS: Record<string, string> = {
  recepcion:                     "Recepción",
  entrada:                       "Entrada",
  principal:                     "Principal",
  postre:                        "Postre",
  postres:                       "Postres",
  lunch:                         "Lunch",
  "Pata flambeada":              "Pata Flambeada",
  "Tabla de quesos y fiambres":  "Tabla de Quesos y Fiambres",
  "Isla Andina":                 "Isla Andina",
  "Isla Árabe":                  "Isla Árabe",
};

const SECTION_ICONS: Record<string, string> = {
  recepcion:                    "🍸",
  entrada:                      "🥗",
  principal:                    "🍽",
  postre:                       "🍰",
  postres:                      "🍰",
  lunch:                        "🥪",
  "Pata flambeada":             "🔥",
  "Tabla de quesos y fiambres": "🧀",
  "Isla Andina":                "🫕",
  "Isla Árabe":                 "🥙",
};

function getSectionLabel(key: string) { return SECTION_LABELS[key] ?? key; }
function getSectionIcon(key: string)  { return SECTION_ICONS[key]  ?? "🍽"; }

const BG          = "#f2ede4";
const BROWN       = "#4a1e08";
const SIENNA      = "#8B4513";
const GOLD        = "#C9A84C";
const FOOTER_BG   = "#2c1005";

export default async function PresupuestoPage({ params }: Params) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);
  if (!solicitud) notFound();

  const paquete = PAQUETES[solicitud.paquete as keyof typeof PAQUETES];
  if (!paquete) notFound();

  const esGrupoGrande   = solicitud.invitados >= PRECIO_MINIMO_INVITADOS;
  const precioPorPersona = solicitud.precio_override ?? (esGrupoGrande ? paquete.precio : null);
  const total            = precioPorPersona ? precioPorPersona * solicitud.invitados : null;

  const fechaRaw      = new Date(solicitud.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const fechaFormateada = fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1);
  const nroPedido       = solicitud.id.slice(0, 8).toUpperCase();
  const menuEntries = Object.entries(paquete.menu);

  return (
    <div className={dancingScript.variable} style={{ background: BG, minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", position: "relative" }}>

      {/* ── Estilos globales de la página ── */}
      <style>{`
        .pres-script { font-family: var(--font-dancing), 'Brush Script MT', cursive; }
        .pres-serif  { font-family: var(--font-playfair), Georgia, serif; }

        @media print {
          .no-print { display: none !important; }
          body { background: ${BG} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 8mm 10mm; }
        }

        @media (max-width: 640px) {
          .client-grid { grid-template-columns: 1fr !important; }
          .bebidas-grid { grid-template-columns: 1fr !important; }
          .precio-grid  { grid-template-columns: 1fr !important; }
          .menu-grid    { grid-template-columns: 1fr 1fr !important; }
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

          {/* Tagline con líneas */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}50`, maxWidth: 110 }} />
            <p style={{ color: SIENNA, fontSize: 11, fontStyle: "italic", margin: 0, whiteSpace: "nowrap" }}>
              Organización integral de eventos
            </p>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}50`, maxWidth: 110 }} />
          </div>
        </header>

        {/* ── separador ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px" }}>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}40` }} />
          <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}40` }} />
        </div>

        {/* ── TÍTULO PRESUPUESTO ── */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* Ornamentos + título */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 52, height: 1.5, background: SIENNA }} />
              <span style={{ color: SIENNA, fontSize: 15 }}>◆</span>
              <div style={{ width: 18, height: 1.5, background: SIENNA }} />
            </div>

            <h2 className="pres-serif" style={{ fontSize: 42, fontWeight: 900, color: BROWN, margin: 0, letterSpacing: 9, textTransform: "uppercase", lineHeight: 1 }}>
              PRESUPUESTO
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 18, height: 1.5, background: SIENNA }} />
              <span style={{ color: SIENNA, fontSize: 15 }}>◆</span>
              <div style={{ width: 52, height: 1.5, background: SIENNA }} />
            </div>
          </div>

          {/* Nombre del paquete en cursiva */}
          <p className="pres-script" style={{ fontSize: 34, color: SIENNA, margin: "0 0 6px", fontWeight: 700, lineHeight: 1.2 }}>
            {paquete.nombre}
          </p>

          <p style={{ color: "#999", fontSize: 10, letterSpacing: 2, margin: "0 0 10px" }}>N° {nroPedido}</p>

          {/* Floritura */}
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
          {/* Col 1: Cliente, Fecha, Lugar */}
          <div style={{ padding: "18px 20px", borderRight: `1px solid ${SIENNA}30` }}>
            {[
              { icon: "👤", label: "Cliente",  valor: solicitud.nombre },
              { icon: "📅", label: "Fecha",    valor: fechaFormateada },
              { icon: "📍", label: "Lugar",    valor: solicitud.lugar },
            ].map(({ icon, label, valor }, i) => (
              <div key={label} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>
                  <span style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
                </div>
                <p style={{ color: BROWN, fontSize: 13, margin: "0 0 0 19px", fontWeight: 600, lineHeight: 1.4 }}>{valor}</p>
              </div>
            ))}
          </div>

          {/* Col 2: Evento, Invitados */}
          <div style={{ padding: "18px 20px", borderRight: `1px solid ${SIENNA}30` }}>
            {[
              { icon: "🍽", label: "Evento",    valor: solicitud.tipo_evento },
              { icon: "👥", label: "Invitados", valor: `${solicitud.invitados} personas` },
            ].map(({ icon, label, valor }, i) => (
              <div key={label} style={{ marginBottom: i < 1 ? 16 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>
                  <span style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
                </div>
                <p style={{ color: BROWN, fontSize: 13, margin: "0 0 0 19px", fontWeight: 600, lineHeight: 1.4 }}>{valor}</p>
              </div>
            ))}
          </div>

          {/* Col 3: Resumen */}
          <div style={{ padding: "18px 20px", minWidth: 185, background: `${SIENNA}09` }}>
            <p style={{
              color: SIENNA, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
              margin: "0 0 10px", textAlign: "center", borderBottom: `1px solid ${SIENNA}30`, paddingBottom: 7,
            }}>
              Resumen de la propuesta
            </p>
            {paquete.resumen.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                <span style={{ color: SIENNA, fontSize: 13, lineHeight: 1.3, flexShrink: 0 }}>✓</span>
                <span style={{ color: BROWN, fontSize: 11, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MENÚ ── */}
        <section style={{ marginBottom: 28 }}>
          {/* Cabecera de sección */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}44` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: GOLD, fontSize: 9 }}>◆</span>
              <h3 className="pres-serif" style={{ color: BROWN, fontSize: 20, letterSpacing: 9, textTransform: "uppercase", margin: 0, fontWeight: 700, lineHeight: 1 }}>
                MENÚ
              </h3>
              <span style={{ color: GOLD, fontSize: 9 }}>◆</span>
            </div>
            <div style={{ flex: 1, height: 1, background: `${SIENNA}44` }} />
          </div>

          {/* Columnas del menú */}
          <div
            className="menu-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 18 }}
          >
            {menuEntries.map(([seccion, items]) => (
              <div key={seccion}>
                {/* Ícono + título de sección */}
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{getSectionIcon(seccion)}</div>
                  <p style={{
                    color: SIENNA, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase",
                    fontWeight: 700, margin: 0, borderBottom: `1.5px solid ${SIENNA}40`, paddingBottom: 5,
                  }}>
                    {getSectionLabel(seccion)}
                  </p>
                </div>

                {/* Ítems */}
                {Array.isArray(items) ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(items as string[]).map((item) => (
                      <li key={item} style={{ color: "#4a3020", fontSize: 11, marginBottom: 4, lineHeight: 1.4, display: "flex", gap: 5 }}>
                        <span style={{ color: SIENNA, flexShrink: 0, marginTop: 1 }}>·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  Object.entries(items as Record<string, string[]>).map(([sub, subitems]) => (
                    <div key={sub} style={{ marginBottom: 10 }}>
                      <p style={{ color: SIENNA, fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 4px", fontWeight: 700, borderBottom: `1px solid ${SIENNA}25`, paddingBottom: 2 }}>
                        {sub}
                      </p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {subitems.map((i) => (
                          <li key={i} style={{ color: "#4a3020", fontSize: 11, marginBottom: 3, lineHeight: 1.4, display: "flex", gap: 5 }}>
                            <span style={{ color: SIENNA, flexShrink: 0, marginTop: 1 }}>·</span>
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── separador ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px" }}>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}35` }} />
          <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: `${SIENNA}35` }} />
        </div>

        {/* ── BEBIDAS + SERVICIOS ── */}
        <div className="bebidas-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>🍷</span>
              <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>Bebidas</p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {paquete.bebidas.map((b) => (
                <li key={b} style={{ color: "#4a3020", fontSize: 12, marginBottom: 5, lineHeight: 1.4, display: "flex", gap: 6 }}>
                  <span style={{ color: SIENNA, flexShrink: 0 }}>·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>Servicios incluidos</p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {paquete.servicios.map((s) => (
                <li key={s} style={{ color: "#4a3020", fontSize: 12, marginBottom: 5, lineHeight: 1.4, display: "flex", gap: 6 }}>
                  <span style={{ color: SIENNA, flexShrink: 0 }}>·</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── NOTAS (si las hay) ── */}
        {solicitud.notas_admin && (
          <div style={{ border: `1px solid ${SIENNA}44`, padding: "14px 18px", marginBottom: 24, background: `${SIENNA}08` }}>
            <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
              Notas y personalizaciones
            </p>
            <p style={{ color: BROWN, fontSize: 13, margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{solicitud.notas_admin}</p>
          </div>
        )}

        {/* ── PRECIOS ── */}
        {precioPorPersona ? (
          <div className="precio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Precio por persona */}
            <div style={{ border: `1.5px solid ${GOLD}`, padding: "20px 22px", textAlign: "center", background: "#fffaf4" }}>
              <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 10px" }}>
                Precio por persona
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: `${GOLD}55` }} />
                <p className="pres-serif" style={{ color: BROWN, fontSize: 26, fontWeight: 900, margin: 0, whiteSpace: "nowrap" }}>
                  {formatPrecio(precioPorPersona)}
                </p>
                <div style={{ flex: 1, height: 1, background: `${GOLD}55` }} />
              </div>
            </div>
            {/* Inversión total */}
            <div style={{ border: `2.5px solid ${GOLD}`, padding: "20px 22px", textAlign: "center", background: "#fffaf4" }}>
              <p style={{ color: SIENNA, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 10px" }}>
                Inversión total
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: `${GOLD}55` }} />
                <p className="pres-serif" style={{ color: BROWN, fontSize: 26, fontWeight: 900, margin: 0, whiteSpace: "nowrap" }}>
                  {formatPrecio(total!)}
                </p>
                <div style={{ flex: 1, height: 1, background: `${GOLD}55` }} />
              </div>
              <p style={{ color: "#999", fontSize: 10, margin: "6px 0 0" }}>para {solicitud.invitados} personas</p>
            </div>
          </div>
        ) : (
          <div style={{ border: `1px solid ${SIENNA}33`, padding: "16px 24px", textAlign: "center", marginBottom: 24, background: "#fffaf4" }}>
            <p style={{ color: SIENNA, fontSize: 12, margin: 0, fontStyle: "italic" }}>
              Tu presupuesto personalizado será enviado a la brevedad por nuestro equipo.
            </p>
          </div>
        )}

        <p style={{ color: "#aaa", fontSize: 10, textAlign: "center", marginBottom: 28, fontStyle: "italic" }}>
          Los precios están sujetos a cambios según disponibilidad y temporada. Presupuesto válido por 15 días.
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
                <div style={{
                  fontSize: fb ? 14 : 16,
                  marginBottom: 3,
                  color: GOLD,
                  fontWeight: fb ? 900 : undefined,
                  fontFamily: fb ? "Georgia, serif" : undefined,
                  lineHeight: 1,
                }}>
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
