import { notFound } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { PAQUETES, formatPrecio, PRECIO_MINIMO_INVITADOS } from "@/data/paquetes";
import { supabaseAdmin } from "@/lib/supabase-server";
import PrintButton from "./PrintButton";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
});

type Params = { params: Promise<{ id: string }> };

async function getSolicitud(id: string) {
  const { data } = await supabaseAdmin()
    .from("presupuesto_solicitudes")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// ─── Mapas de sección ────────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  recepcion: "Recepción", entrada: "Entrada", principal: "Principal",
  postre: "Postre", postres: "Postres", lunch: "Lunch",
  "Pata flambeada": "Pata Flambeada",
  "Tabla de quesos y fiambres": "Tabla de Quesos y Fiambres",
  "Isla Andina": "Isla Andina", "Isla Árabe": "Isla Árabe",
};
function label(k: string) { return SECTION_LABELS[k] ?? k; }

// ─── Íconos SVG monolinea ─────────────────────────────────────────────────────

const R = "#8B3A1E"; // rust — color principal de íconos y texto decorativo

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5"/>
      <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5"/>
      <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.7 2 6 4.7 6 8c0 5 6 14 6 14s6-9 6-14c0-3.3-2.7-6-6-6z"/>
      <circle cx="12" cy="8" r="2.5"/>
    </svg>
  );
}
function IconCloche() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13C3 8.03 7.03 4 12 4s9 4.03 9 9"/>
      <line x1="2" y1="13" x2="22" y2="13"/>
      <line x1="5" y1="17" x2="19" y2="17"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3"/>
      <path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
      <circle cx="17" cy="8" r="2.5"/>
      <path d="M14.5 21c0-2.2 1.1-4.1 2.8-5.2"/>
    </svg>
  );
}

// Íconos para secciones del menú
function IconCocktail() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 44" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8 L20 28 L34 8 Z"/>
      <line x1="20" y1="28" x2="20" y2="40"/>
      <line x1="12" y1="40" x2="28" y2="40"/>
    </svg>
  );
}
function IconEntrada() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 36" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18C5 10 11.7 4 20 4S35 10 35 18"/>
      <line x1="3" y1="18" x2="37" y2="18"/>
      <circle cx="20" cy="5" r="1.5" fill={R} stroke="none"/>
      <path d="M8 23 Q20 30 32 23"/>
    </svg>
  );
}
function IconPrincipal() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="14"/>
      <circle cx="20" cy="20" r="10"/>
      <line x1="4" y1="8" x2="4" y2="24"/>
      <path d="M2 8 C2 8 2 14 4 16 C6 14 6 8 6 8"/>
      <line x1="4" y1="24" x2="4" y2="34"/>
      <line x1="36" y1="8" x2="36" y2="34"/>
      <path d="M33 8 C33 8 39 12 39 16 L33 16 Z"/>
    </svg>
  );
}
function IconPostre() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 44" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="26" width="28" height="12" rx="2"/>
      <rect x="10" y="18" width="20" height="10" rx="2"/>
      <rect x="14" y="12" width="12" height="8" rx="2"/>
      <line x1="20" y1="8" x2="20" y2="12"/>
      <circle cx="20" cy="7" r="1.5"/>
    </svg>
  );
}
function IconBowl() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 36" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14 Q4 30 20 30 Q36 30 36 14"/>
      <line x1="2" y1="14" x2="38" y2="14"/>
      <ellipse cx="20" cy="32" rx="10" ry="2.5"/>
    </svg>
  );
}
function IconLunch() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="15"/>
      <circle cx="20" cy="20" r="11"/>
      <path d="M12 20 Q16 14 20 20 Q24 26 28 20"/>
    </svg>
  );
}
function IconFlame() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 44" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4 C20 4 30 16 30 26 C30 34 26 40 20 42 C14 40 10 34 10 26 C10 16 20 4 20 4 Z"/>
      <path d="M20 22 C20 22 25 18 25 24 C25 30 22 34 20 36 C18 34 15 30 15 24 C15 18 20 22 20 22 Z" fill={R} stroke="none"/>
    </svg>
  );
}
function IconDrink() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 44" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 8 L14 38 L26 38 L30 8 Z"/>
      <line x1="10" y1="8" x2="30" y2="8"/>
      <line x1="23" y1="6" x2="19" y2="28"/>
      <line x1="12" y1="18" x2="28" y2="18"/>
    </svg>
  );
}
function IconCheese() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 36" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 30 L20 6 L36 30 Z"/>
      <line x1="4" y1="30" x2="36" y2="30"/>
      <circle cx="25" cy="20" r="2.5"/>
      <circle cx="17" cy="25" r="1.8"/>
      <circle cx="29" cy="26" r="1.8"/>
    </svg>
  );
}
function IconPot() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20 L10 36 L30 36 L32 20 Z"/>
      <rect x="6" y="16" width="28" height="6" rx="2"/>
      <line x1="14" y1="16" x2="14" y2="12"/>
      <line x1="26" y1="16" x2="26" y2="12"/>
      <path d="M10 12 Q14 10 14 12"/>
      <path d="M22 12 Q26 10 26 12"/>
    </svg>
  );
}
function IconArabe() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 44" fill="none" stroke={R} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 38 Q8 30 8 22 Q8 10 20 6 Q32 10 32 22 Q32 30 28 38 Z"/>
      <line x1="12" y1="38" x2="28" y2="38"/>
      <line x1="12" y1="28" x2="28" y2="28"/>
      <line x1="12" y1="20" x2="28" y2="20"/>
    </svg>
  );
}

const MENU_ICONS = {
  recepcion:                    IconCocktail,
  entrada:                      IconEntrada,
  principal:                    IconPrincipal,
  postre:                       IconPostre,
  postres:                      IconPostre,
  lunch:                        IconLunch,
  "Pata flambeada":             IconFlame,
  "Tabla de quesos y fiambres": IconCheese,
  "Isla Andina":                IconPot,
  "Isla Árabe":                 IconArabe,
};

function MenuIcon({ seccion }: { seccion: string }) {
  const Ic = MENU_ICONS[seccion as keyof typeof MENU_ICONS];
  if (Ic) return <Ic />;
  return <IconLunch />;
}

// ─── Constantes de diseño ─────────────────────────────────────────────────────

const BG        = "#f3ede3";
const BROWN     = "#2a1206";
const RUST      = "#8B3A1E";
const COPPER    = "#A0522D";
const GOLD      = "#C9A84C";
const FOOTER    = "#2c1005";

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function PresupuestoPage({ params }: Params) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);
  if (!solicitud) notFound();

  const paquete = PAQUETES[solicitud.paquete as keyof typeof PAQUETES];
  if (!paquete) notFound();

  const esGrande        = solicitud.invitados >= PRECIO_MINIMO_INVITADOS;
  const precioPP        = solicitud.precio_override ?? (esGrande ? paquete.precio : null);
  const total           = precioPP ? precioPP * solicitud.invitados : null;
  const nro             = solicitud.id.slice(0, 8).toUpperCase();

  // Control de impresión: admin-created (guest_id null) siempre imprimible;
  // colaborador-created solo si admin aprobó
  const isPrintable = !solicitud.guest_id || solicitud.estado === "aprobado";
  const isPending   = !!solicitud.guest_id && solicitud.estado === "pendiente_aprobacion";
  const isRejected  = !!solicitud.guest_id && solicitud.estado === "rechazado";

  const fechaRaw = solicitud.fecha_evento
    ? new Date(solicitud.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;
  const fecha = fechaRaw
    ? fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1)
    : "A confirmar";

  const menuEntries = Object.entries(paquete.menu);

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
          .cli-grid  { grid-template-columns: 1fr !important; }
          .menu-grid { grid-template-columns: 1fr 1fr !important; }
          .beb-grid  { grid-template-columns: 1fr !important; }
          .px-grid   { grid-template-columns: 1fr !important; }
          .wrap      { padding: 20px 14px !important; }
        }
      `}</style>

      {/* Barra de acciones */}
      <div className="no-print" style={{ background: "#1a0d06", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 18px", flexWrap: "wrap" }}>
        {/* Estado para presupuestos de colaboradores */}
        {isPending && (
          <span style={{ color: "#F59E0B", fontSize: 12, fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
            ⏳ Pendiente de aprobación — disponible para imprimir una vez que el administrador lo apruebe
          </span>
        )}
        {isRejected && (
          <span style={{ color: "#EF4444", fontSize: 12, fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
            ✕ Rechazado — consultá el motivo con el administrador
          </span>
        )}
        {isPrintable && !isPending && !isRejected && <span style={{ flex: 1 }} />}

        <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <a href="https://wa.me/5493884036629" target="_blank" rel="noopener noreferrer"
            style={{ background: "#25D366", color: "#fff", textDecoration: "none", padding: "7px 14px", fontSize: 12, fontFamily: "sans-serif", display: "inline-flex", alignItems: "center", gap: 5 }}>
            📱 Contactar por WhatsApp
          </a>
          {isPrintable && <PrintButton />}
        </div>
      </div>

      {/* Marca de agua fondo */}
      <div aria-hidden style={{ position: "fixed", top: "5%", right: "-4%", width: 320, height: 320, opacity: 0.06, pointerEvents: "none", zIndex: 0, transform: "rotate(15deg)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* ═══════════════ CONTENIDO PRINCIPAL ═══════════════ */}
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
          {/* Tagline con líneas decorativas */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ flex: 1, height: 1, background: `${COPPER}60`, maxWidth: 120 }} />
            <p style={{ color: COPPER, fontSize: 11, fontStyle: "italic", margin: 0, whiteSpace: "nowrap" }}>
              Organización integral de eventos
            </p>
            <div style={{ flex: 1, height: 1, background: `${COPPER}60`, maxWidth: 120 }} />
          </div>
        </header>

        {/* ══ TÍTULO PRESUPUESTO ══ */}
        <div style={{ textAlign: "center", marginBottom: 6, paddingTop: 6 }}>
          {/* Ornamentos + título gigante */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 6 }}>
            {/* Ornamento izquierdo: punto + línea */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ color: RUST, fontSize: 10, lineHeight: 1 }}>◆</span>
              <div style={{ width: 70, height: 1.5, background: RUST }} />
            </div>

            <h2 className="sf" style={{
              fontSize: 60,
              fontWeight: 900,
              color: RUST,
              margin: 0,
              letterSpacing: 6,
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              PRESUPUESTO
            </h2>

            {/* Ornamento derecho: línea + punto */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 70, height: 1.5, background: RUST }} />
              <span style={{ color: RUST, fontSize: 10, lineHeight: 1 }}>◆</span>
            </div>
          </div>

          {/* Nombre del paquete en script */}
          <p className="sc" style={{ fontSize: 38, color: COPPER, margin: "0 0 4px", fontWeight: 700, lineHeight: 1.15 }}>
            {paquete.nombre}
          </p>

          {/* Floritura decorativa */}
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

        {/* ══ CAJA DE DATOS DEL CLIENTE ══ */}
        <div className="cli-grid" style={{
          border: `1.5px solid ${COPPER}50`,
          borderRadius: 4,
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          marginBottom: 22,
          marginTop: 16,
        }}>

          {/* Col 1: Cliente, Fecha, Lugar */}
          <div style={{ padding: "14px 18px", borderRight: `1px solid ${COPPER}30` }}>
            {[
              { Icon: IconPerson,   lbl: "Cliente:",  val: solicitud.nombre },
              { Icon: IconCalendar, lbl: "Fecha:",    val: fecha },
              { Icon: IconPin,      lbl: "Lugar:",    val: solicitud.lugar },
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

          {/* Col 2: Evento, Invitados */}
          <div style={{ padding: "14px 18px", borderRight: `1px solid ${COPPER}30` }}>
            {[
              { Icon: IconCloche, lbl: "Evento:",    val: solicitud.tipo_evento },
              { Icon: IconPeople, lbl: "Invitados:", val: `${solicitud.invitados} personas` },
            ].map(({ Icon, lbl, val }, i) => (
              <div key={lbl} style={{ marginBottom: i < 1 ? 14 : 0 }}>
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

          {/* Col 3: Resumen de la propuesta */}
          <div style={{ padding: "12px 16px", minWidth: 185, background: `${COPPER}08`, borderRadius: "0 4px 4px 0" }}>
            <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>
              RESUMEN DE LA PROPUESTA
            </p>
            <div style={{ height: 1, background: `${GOLD}50`, marginBottom: 10 }} />
            {paquete.resumen.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                {/* Ícono ⊙ (círculo con check) */}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="8" cy="8" r="7" stroke={RUST} strokeWidth="1.2"/>
                  <path d="M5 8 L7 10 L11 6" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: BROWN, fontSize: 11, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
            {/* Floritura inferior */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <svg width="48" height="16" viewBox="0 0 60 18" fill="none">
                <path d="M2 9 C10 2 20 2 30 9 C40 16 50 16 58 9" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="30" cy="9" r="2" fill={GOLD}/>
              </svg>
            </div>
          </div>
        </div>

        {/* ══ MENÚ ══ */}
        <section style={{ marginBottom: 20 }}>
          {/* Header MENÚ */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: `${COPPER}50` }} />
            <h3 className="sf" style={{ color: BROWN, fontSize: 24, letterSpacing: 10, textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
              MENÚ
            </h3>
            <div style={{ flex: 1, height: 1, background: `${COPPER}50` }} />
          </div>

          {/* Grilla de columnas */}
          <div
            className="menu-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(menuEntries.length, 5)}, 1fr)`,
              borderTop: `1.5px solid ${COPPER}40`,
              borderLeft: `1.5px solid ${COPPER}40`,
            }}
          >
            {menuEntries.map(([seccion, items]) => (
              <div
                key={seccion}
                style={{
                  borderRight: `1.5px solid ${COPPER}40`,
                  borderBottom: `1.5px solid ${COPPER}40`,
                  padding: "14px 12px",
                }}
              >
                {/* Ícono + nombre de sección */}
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                    <MenuIcon seccion={seccion} />
                  </div>
                  <p style={{ color: RUST, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                    {label(seccion)}
                  </p>
                  {/* Línea punteada bajo el nombre */}
                  <div style={{ borderBottom: `1px dotted ${COPPER}60`, margin: "6px 4px 8px" }} />
                </div>

                {/* Ítems */}
                {Array.isArray(items) ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(items as string[]).map((it) => (
                      <li key={it} style={{ display: "flex", gap: 5, color: "#3a2010", fontSize: 11, marginBottom: 4, lineHeight: 1.4 }}>
                        <span style={{ color: RUST, flexShrink: 0 }}>•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  Object.entries(items as Record<string, string[]>).map(([sub, subitems]) => (
                    <div key={sub} style={{ marginBottom: 8 }}>
                      <p style={{ color: RUST, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px", fontWeight: 700 }}>
                        {sub}:
                      </p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {subitems.map((i) => (
                          <li key={i} style={{ display: "flex", gap: 5, color: "#3a2010", fontSize: 11, marginBottom: 3, lineHeight: 1.4 }}>
                            <span style={{ color: RUST, flexShrink: 0 }}>•</span>
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

        {/* ══ SEPARADOR ORNAMENTAL ══ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "0 0 18px" }}>
          <div style={{ flex: 1, height: 1, background: `${COPPER}40` }} />
          <svg width="32" height="16" viewBox="0 0 40 18" fill="none">
            <path d="M2 9 C8 3 16 3 20 9 C24 15 32 15 38 9" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="9" r="2.5" fill={GOLD}/>
          </svg>
          <div style={{ flex: 1, height: 1, background: `${COPPER}40` }} />
        </div>

        {/* ══ BEBIDAS + SERVICIOS ══ */}
        <div className="beb-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 0, marginBottom: 18, borderTop: `1.5px solid ${COPPER}40`, borderLeft: `1.5px solid ${COPPER}40` }}>

          {/* Bebidas */}
          <div style={{ borderRight: `1.5px solid ${COPPER}40`, borderBottom: `1.5px solid ${COPPER}40`, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <IconDrink />
              <p style={{ color: RUST, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>Bebidas</p>
            </div>
            <div style={{ borderBottom: `1px dotted ${COPPER}60`, marginBottom: 8 }} />
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {paquete.bebidas.map((b) => (
                <li key={b} style={{ display: "flex", gap: 5, color: "#3a2010", fontSize: 11, marginBottom: 4, lineHeight: 1.4 }}>
                  <span style={{ color: RUST, flexShrink: 0 }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div style={{ borderRight: `1.5px solid ${COPPER}40`, borderBottom: `1.5px solid ${COPPER}40`, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <IconEntrada />
              <p style={{ color: RUST, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>Servicios Incluidos</p>
            </div>
            <div style={{ borderBottom: `1px dotted ${COPPER}60`, marginBottom: 8 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              {paquete.servicios.map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 5, color: "#3a2010", fontSize: 11, marginBottom: 4, lineHeight: 1.4 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="8" cy="8" r="7" stroke={RUST} strokeWidth="1.2"/>
                    <path d="M5 8 L7 10 L11 6" stroke={RUST} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Precios */}
          <div style={{ borderRight: `1.5px solid ${COPPER}40`, borderBottom: `1.5px solid ${COPPER}40`, padding: "14px 18px", minWidth: 175, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {precioPP ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
                    PRECIO POR PERSONA
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="sf" style={{ color: RUST, fontSize: 18, fontWeight: 700 }}>$</span>
                    <div style={{ flex: 1, borderBottom: `2px solid ${COPPER}60` }}>
                      <span className="sf" style={{ color: BROWN, fontSize: 22, fontWeight: 900 }}>{formatPrecio(precioPP)}</span>
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: `${GOLD}50`, margin: "0 0 12px" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
                    INVERSIÓN TOTAL
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="sf" style={{ color: RUST, fontSize: 18, fontWeight: 700 }}>$</span>
                    <div style={{ flex: 1, borderBottom: `2px solid ${COPPER}60` }}>
                      <span className="sf" style={{ color: BROWN, fontSize: 22, fontWeight: 900 }}>{formatPrecio(total!)}</span>
                    </div>
                  </div>
                  <p style={{ color: "#aaa", fontSize: 9, margin: "6px 0 0", fontStyle: "italic" }}>
                    para {solicitud.invitados} personas
                  </p>
                </div>
              </>
            ) : (
              <p style={{ color: RUST, fontSize: 12, textAlign: "center", fontStyle: "italic", lineHeight: 1.5 }}>
                Tu presupuesto será enviado a la brevedad.
              </p>
            )}
            <p style={{ color: "#bbb", fontSize: 9, textAlign: "center", fontStyle: "italic", marginTop: 10, lineHeight: 1.4 }}>
              Los precios están sujetos a cambios según disponibilidad y temporada.
            </p>
          </div>
        </div>

        {/* Notas del admin/colaborador */}
        {solicitud.notas_admin && (
          <div style={{ border: `1px solid ${COPPER}44`, padding: "12px 16px", marginBottom: 18, background: `${COPPER}08`, borderRadius: 2 }}>
            <p style={{ color: RUST, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>
              Notas y personalizaciones
            </p>
            <p style={{ color: BROWN, fontSize: 12, margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{solicitud.notas_admin}</p>
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
            ].map(({ svg, label: lbl, valor }) => (
              <div key={lbl} style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{svg}</div>
                <p style={{ color: GOLD, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 2px" }}>{lbl}</p>
                <p style={{ color: "#e0c8a0", fontSize: 10, margin: 0, lineHeight: 1.3 }}>{valor}</p>
              </div>
            ))}
          </div>

          {/* Diamante final */}
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span style={{ color: GOLD, fontSize: 12 }}>◆</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
