"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ background: "#C9A84C", color: "#111", cursor: "pointer", border: "none", padding: "7px 14px", fontSize: 12, fontFamily: "sans-serif" }}
    >
      Guardar como PDF
    </button>
  );
}
