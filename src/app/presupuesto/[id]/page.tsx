import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { PAQUETES, formatPrecio, PRECIO_MINIMO_INVITADOS } from "@/data/paquetes";

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

export default async function PresupuestoPage({ params }: Params) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);
  if (!solicitud) notFound();

  const paquete = PAQUETES[solicitud.paquete as keyof typeof PAQUETES];
  if (!paquete) notFound();

  const esGrupoGrande = solicitud.invitados >= PRECIO_MINIMO_INVITADOS;
  const precioPorPersona = solicitud.precio_override ?? (esGrupoGrande ? paquete.precio : null);
  const total = precioPorPersona ? precioPorPersona * solicitud.invitados : null;

  const fechaFormateada = new Date(solicitud.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const nroPedido = solicitud.id.slice(0, 8).toUpperCase();

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh", fontFamily: "Georgia, serif" }}>

      {/* Botón imprimir */}
      <div className="print:hidden flex justify-end p-4 gap-3" style={{ background: "#1a1a1a" }}>
        <a
          href={`https://wa.me/5493884036629`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-xs"
          style={{ background: "#25D366", color: "#fff", textDecoration: "none" }}
        >
          Contactar por WhatsApp
        </a>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-xs"
          style={{ background: "#C9A84C", color: "#111", cursor: "pointer", border: "none" }}
        >
          Guardar como PDF
        </button>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #8B4513", paddingBottom: 28, marginBottom: 32 }}>
          <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 6, textTransform: "uppercase", margin: "0 0 6px" }}>
            Catering Profesional · Eventos & Gastronomía
          </p>
          <h1 style={{ fontSize: 48, color: "#5C2E0A", margin: "0 0 4px", fontWeight: 900, letterSpacing: 2 }}>
            PRESUPUESTO
          </h1>
          <p style={{ fontSize: 22, color: "#8B4513", fontStyle: "italic", margin: "0 0 8px" }}>
            {paquete.nombre}
          </p>
          <p style={{ color: "#aaa", fontSize: 11, margin: 0 }}>N° {nroPedido}</p>
        </div>

        {/* Datos del cliente */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28,
          border: "1px solid #C9A84C33", padding: 20, background: "#fff8f0",
        }}>
          {[
            ["Cliente", solicitud.nombre],
            ["Evento", solicitud.tipo_evento],
            ["Fecha", fechaFormateada],
            ["Invitados", `${solicitud.invitados} personas`],
            ["Lugar", solicitud.lugar],
          ].map(([label, valor]) => (
            <div key={label}>
              <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
              <p style={{ color: "#333", fontSize: 14, margin: 0, fontWeight: 600 }}>{valor}</p>
            </div>
          ))}
          {/* Resumen */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #C9A84C33", paddingTop: 12, marginTop: 4 }}>
            <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 8px" }}>
              Resumen de la propuesta
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {paquete.resumen.map((item) => (
                <span key={item} style={{ color: "#555", fontSize: 12 }}>✓ {item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Menú */}
        <div style={{ borderTop: "2px solid #8B4513", paddingTop: 24, marginBottom: 28 }}>
          <h2 style={{ textAlign: "center", color: "#5C2E0A", fontSize: 20, letterSpacing: 8, textTransform: "uppercase", marginBottom: 20 }}>
            MENÚ
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {Object.entries(paquete.menu).map(([seccion, items]) => (
              <div key={seccion}>
                <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px", borderBottom: "1px solid #C9A84C44", paddingBottom: 4 }}>
                  {seccion}
                </p>
                {Array.isArray(items) ? (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {items.map((item) => (
                      <li key={item} style={{ color: "#444", fontSize: 12, marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  Object.entries(items as Record<string, string[]>).map(([sub, subitems]) => (
                    <div key={sub} style={{ marginBottom: 8 }}>
                      <p style={{ color: "#8B4513", fontSize: 10, textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>{sub}:</p>
                      <ul style={{ margin: 0, paddingLeft: 14 }}>
                        {subitems.map((i) => (
                          <li key={i} style={{ color: "#444", fontSize: 11, marginBottom: 2 }}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bebidas y Servicios */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          <div>
            <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px", borderBottom: "1px solid #C9A84C44", paddingBottom: 4 }}>
              Bebidas
            </p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {paquete.bebidas.map((b) => <li key={b} style={{ color: "#444", fontSize: 12, marginBottom: 3 }}>{b}</li>)}
            </ul>
          </div>
          <div>
            <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px", borderBottom: "1px solid #C9A84C44", paddingBottom: 4 }}>
              Servicios incluidos
            </p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {paquete.servicios.map((s) => <li key={s} style={{ color: "#444", fontSize: 12, marginBottom: 3 }}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* Precio */}
        <div style={{ display: "grid", gridTemplateColumns: precioPorPersona ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 32 }}>
          {precioPorPersona ? (
            <>
              <div style={{ border: "1px solid #C9A84C", padding: 20, textAlign: "center", background: "#fff8f0" }}>
                <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 8px" }}>Precio por persona</p>
                <p style={{ color: "#5C2E0A", fontSize: 28, fontWeight: 900, margin: 0 }}>{formatPrecio(precioPorPersona)}</p>
              </div>
              <div style={{ border: "2px solid #C9A84C", padding: 20, textAlign: "center", background: "#fff8f0" }}>
                <p style={{ color: "#8B4513", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 8px" }}>Inversión total</p>
                <p style={{ color: "#5C2E0A", fontSize: 28, fontWeight: 900, margin: 0 }}>{formatPrecio(total!)}</p>
                <p style={{ color: "#999", fontSize: 10, margin: "6px 0 0" }}>para {solicitud.invitados} personas</p>
              </div>
            </>
          ) : (
            <div style={{ border: "1px solid #C9A84C33", padding: 20, textAlign: "center", background: "#fff8f0" }}>
              <p style={{ color: "#8B4513", fontSize: 12, margin: 0 }}>
                Tu presupuesto personalizado será enviado a la brevedad por nuestro equipo.
              </p>
            </div>
          )}
        </div>

        {/* Nota precios */}
        <p style={{ color: "#aaa", fontSize: 11, textAlign: "center", marginBottom: 32 }}>
          Los precios están sujetos a cambios según disponibilidad y temporada.
        </p>

        {/* Footer */}
        <div style={{ borderTop: "2px solid #8B4513", paddingTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            ["📞 Tel / WhatsApp", "388 403 6629"],
            ["✉ Email", "cateringprofesionaljujuy@gmail.com"],
            ["🌐 Web", "cateringprofesional.com.ar"],
            ["📍 Ubicación", "San Salvador de Jujuy, Argentina"],
          ].map(([label, valor]) => (
            <div key={label}>
              <p style={{ color: "#8B4513", fontSize: 10, margin: "0 0 2px" }}>{label}</p>
              <p style={{ color: "#555", fontSize: 11, margin: 0 }}>{valor}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } body { background: #f5f0e8; } }`}</style>
    </div>
  );
}
