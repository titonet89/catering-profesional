"use client";

export default function DownloadButton({ src, nombre }: { src: string; nombre: string }) {
  return (
    <a
      href={src}
      download={`Presupuesto ${nombre}.png`}
      style={{ background: "#C9A84C", color: "#111", textDecoration: "none", padding: "8px 16px", fontSize: 12, fontFamily: "sans-serif", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, cursor: "pointer" }}
    >
      ⬇ Descargar propuesta
    </a>
  );
}
