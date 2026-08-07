"use client";

export default function PresupuestoError() {
  return (
    <div style={{ minHeight: "100vh", background: "#1a0d06", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", fontFamily: "Georgia, serif" }}>
      <p style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Ocurrió un error
      </p>
      <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 400, marginBottom: "1rem" }}>
        No se pudo cargar el presupuesto
      </h1>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", maxWidth: 380, lineHeight: 1.7, marginBottom: "2.5rem" }}>
        Hubo un problema al cargar este presupuesto. Por favor intentá de nuevo o contactanos.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "0.6rem 1.6rem", border: "1px solid #C9A84C", color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.15em", background: "transparent", cursor: "pointer", textTransform: "uppercase" }}
        >
          Reintentar
        </button>
        <a
          href="https://wa.me/5493884036629"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: "0.6rem 1.6rem", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase" }}
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
