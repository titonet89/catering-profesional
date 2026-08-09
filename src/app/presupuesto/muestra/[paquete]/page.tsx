import { notFound } from "next/navigation";
import { PAQUETES, type PaqueteId } from "@/data/paquetes";

type Params = { params: Promise<{ paquete: string }> };

export default async function PresupuestoMuestraPage({ params }: Params) {
  const { paquete: paqueteId } = await params;
  const paquete = PAQUETES[paqueteId as PaqueteId];
  if (!paquete) notFound();

  const pdfSrc = `/presupuestos/${paqueteId}.pdf`;
  const waTexto = encodeURIComponent(
    `Hola! Vi el presupuesto *${paquete.nombre}* y me gustaría consultar precio y disponibilidad 😊`
  );
  const waUrl = `https://wa.me/5493884036629?text=${waTexto}`;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#1a0d06" }}>

      {/* Barra superior */}
      <div style={{
        background: "#111",
        borderBottom: "1px solid #C9A84C40",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" style={{ height: 28 }} />
          <div>
            <p style={{ color: "#C9A84C", fontSize: 9, letterSpacing: 4, textTransform: "uppercase", margin: 0, fontFamily: "sans-serif" }}>Propuesta</p>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, fontFamily: "Georgia, serif" }}>{paquete.nombre}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
          <a
            href={pdfSrc}
            download={`Presupuesto ${paquete.nombre}.pdf`}
            style={{ background: "#C9A84C", color: "#111", textDecoration: "none", padding: "7px 14px", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            ⬇ Descargar PDF
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#25D366", color: "#fff", textDecoration: "none", padding: "7px 14px", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            📱 Consultar precio por WhatsApp
          </a>
        </div>
      </div>

      {/* PDF a pantalla completa */}
      <iframe
        src={pdfSrc}
        style={{ flex: 1, width: "100%", border: "none" }}
        title={`Presupuesto ${paquete.nombre}`}
      />

    </div>
  );
}
