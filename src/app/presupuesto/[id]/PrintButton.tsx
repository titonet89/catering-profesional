"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 text-xs"
      style={{ background: "#C9A84C", color: "#111", cursor: "pointer", border: "none" }}
    >
      Guardar como PDF
    </button>
  );
}
