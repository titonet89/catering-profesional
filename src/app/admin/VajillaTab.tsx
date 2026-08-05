"use client";

import { useState, useEffect, useActionState } from "react";
import { Plus, Minus, ExternalLink, CheckCircle, X, Copy, MessageSquare } from "lucide-react";
import {
  listCotizacionesVajillaAction,
  createCotizacionVajillaAdminAction,
  aprobarCotizacionVajillaAction,
  rechazarCotizacionVajillaAction,
  type CotizacionVajilla,
} from "@/app/actions/admin-vajilla";
import { VAJILLA_CATEGORIAS, findVajillaItem, formatARS } from "@/data/vajilla";
import type { VajillaItemId, VajillaItemPedido } from "@/data/vajilla";

const SITE_URL = "https://cateringprofesional.com.ar";
const TIPOS = ["Boda", "Cumpleaños", "Evento corporativo", "Gala", "Quinceañero", "Bautismo", "Comunión", "Aniversario", "Otro"];
const inputCls = "w-full bg-transparent border border-white/10 px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors";

function toWAPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("54")) return d;
  if (d.startsWith("0"))  return "54" + d.slice(1);
  return "54" + d;
}

const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  pendiente_aprobacion: { label: "Esperando aprobación", cls: "border-amber-400/40 text-amber-400" },
  aprobado:             { label: "Aprobado ✓",           cls: "border-emerald-500/40 text-emerald-400" },
  rechazado:            { label: "Rechazado",             cls: "border-red-400/40 text-red-400" },
  enviado:              { label: "Enviado",               cls: "border-white/20 text-white/40" },
  pendiente:            { label: "Pendiente",             cls: "border-white/20 text-white/50" },
};

// ─── Formulario de creación ──────────────────────────────────────────────────

function NuevaCotizacionModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [cantidades, setCantidades] = useState<Record<VajillaItemId, number>>({} as Record<VajillaItemId, number>);
  const [state, action, pending]    = useActionState(createCotizacionVajillaAdminAction, null);
  const [copiedLink, setCopiedLink] = useState(false);

  const add    = (id: VajillaItemId) => setCantidades(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const remove = (id: VajillaItemId) => setCantidades(c => {
    const v = (c[id] ?? 0) - 1;
    if (v <= 0) { const next = { ...c }; delete next[id]; return next; }
    return { ...c, [id]: v };
  });

  const itemsPedido: VajillaItemPedido[] = Object.entries(cantidades)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const item = findVajillaItem(id)!;
      return { id: id as VajillaItemId, nombre: item.nombre, unidad: item.unidad, qty, precio_unitario: item.precio, subtotal: item.precio * qty };
    });
  const total   = itemsPedido.reduce((s, i) => s + i.subtotal, 0);
  const haItems = itemsPedido.length > 0;

  const copyLink = () => {
    if (!state?.id) return;
    navigator.clipboard.writeText(`${SITE_URL}/cotizacion-vajilla/${state.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (state?.id) {
    const url      = `${SITE_URL}/cotizacion-vajilla/${state.id}`;
    const waTexto  = encodeURIComponent(`Hola 😊\n\nDesde *Catering Profesional* te compartimos tu cotización de vajilla:\n\n👉 ${url}\n\nCualquier consulta escribinos 🙌\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="w-full max-w-md border border-white/10 p-8 flex flex-col items-center gap-5 text-center" style={{ background: "#0a0a0a" }}>
          <span className="text-3xl">✓</span>
          <div>
            <p className="text-gold font-semibold">Cotización creada</p>
            <p className="text-white/40 text-sm mt-1">Vajilla &amp; Cristalería</p>
          </div>
          <div className="w-full border border-white/8 px-4 py-2 flex items-center gap-2">
            <code className="flex-1 text-gold/70 text-xs truncate">{url}</code>
            <button onClick={copyLink} className="text-white/30 hover:text-white transition-colors p-1"><Copy size={13} /></button>
          </div>
          {copiedLink && <p className="text-emerald-400 text-xs -mt-3">¡Link copiado!</p>}
          <div className="flex gap-3 w-full">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-white/20 text-white/60 hover:text-white text-xs tracking-wider transition-colors">
              <ExternalLink size={12} /> Ver PDF
            </a>
            <a href={`https://wa.me/?text=${waTexto}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white text-xs tracking-wider hover:opacity-90 transition-opacity">
              <MessageSquare size={12} /> Compartir WA
            </a>
          </div>
          <button onClick={() => { onCreated(); }} className="w-full py-2 border border-white/10 text-white/40 hover:text-white text-xs transition-colors">
            Cerrar y actualizar lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-white/10" style={{ background: "#0a0a0a" }}>

        <div className="flex items-start justify-between p-6 border-b border-white/8">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-1">Nueva cotización</p>
            <h3 className="text-white text-lg font-bold">Vajilla &amp; Cristalería</h3>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1"><X size={18} /></button>
        </div>

        <form action={action} className="p-6 flex flex-col gap-6">
          {/* Hidden: ítems como JSON */}
          <input type="hidden" name="items" value={JSON.stringify(itemsPedido)} />

          {/* ── Selector de artículos ── */}
          <div>
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-4">Artículos *</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VAJILLA_CATEGORIAS.map(cat => (
                <div key={cat.nombre} className="border border-white/6 p-4">
                  <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-3">{cat.icono} {cat.nombre}</p>
                  <ul className="flex flex-col gap-3">
                    {cat.items.map(item => {
                      const qty = cantidades[item.id as VajillaItemId] ?? 0;
                      return (
                        <li key={item.id} className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-white/70 text-xs">{item.nombre}</p>
                            <p className="text-white/25 text-[11px]">{formatARS(item.precio)}/{item.unidad}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => remove(item.id as VajillaItemId)} disabled={qty === 0}
                              className={`w-6 h-6 flex items-center justify-center border text-xs transition-colors ${qty > 0 ? "border-gold/40 text-gold" : "border-white/10 text-white/15 cursor-not-allowed"}`}>
                              <Minus size={11} />
                            </button>
                            <span className={`w-5 text-center text-xs font-medium ${qty > 0 ? "text-gold" : "text-white/20"}`}>{qty}</span>
                            <button type="button" onClick={() => add(item.id as VajillaItemId)}
                              className="w-6 h-6 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/40 hover:text-gold transition-colors">
                              <Plus size={11} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Resumen de artículos */}
            {haItems && (
              <div className="mt-4 border border-gold/20 p-4">
                <p className="text-gold text-[10px] tracking-widest uppercase mb-2">Resumen</p>
                {itemsPedido.map(i => (
                  <div key={i.id} className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{i.nombre} × {i.qty}</span>
                    <span>{formatARS(i.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold text-gold mt-2 pt-2 border-t border-white/8">
                  <span>Total</span><span>{formatARS(total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Datos del cliente ── */}
          <div>
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-4">Datos del cliente</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Nombre *</label>
                <input name="nombre" required placeholder="Nombre y apellido" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">WhatsApp *</label>
                <input name="telefono" required placeholder="+54 388..." className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Email</label>
                <input type="email" name="email" placeholder="Opcional" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Fecha del evento</label>
                <input type="date" name="fecha_evento" className={inputCls} style={{ colorScheme: "dark" }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Lugar</label>
                <input name="lugar" placeholder="Salón, dirección..." className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Tipo de evento</label>
                <select name="tipo_evento" className={`${inputCls} bg-[#111]`}>
                  <option value="" style={{ background: "#111", color: "#fff" }}>Seleccioná...</option>
                  {TIPOS.map(t => <option key={t} value={t} style={{ background: "#111", color: "#fff" }}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Notas</label>
              <textarea name="notas_admin" rows={2} placeholder="Condiciones especiales, detalles adicionales..."
                className={`${inputCls} resize-none`} />
            </div>
          </div>

          {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-3 border border-white/10 text-white/40 hover:text-white text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={pending || !haItems}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50">
              {pending ? "Creando..." : "Crear cotización →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tab principal ────────────────────────────────────────────────────────────

export default function VajillaTab() {
  const [cotizaciones, setCotizaciones]     = useState<CotizacionVajilla[]>([]);
  const [cargando, setCargando]             = useState(true);
  const [modalAbierto, setModalAbierto]     = useState(false);
  const [rechazandoId, setRechazandoId]     = useState<string | null>(null);
  const [rechazoNota, setRechazoNota]       = useState("");
  const [expandida, setExpandida]           = useState<string | null>(null);

  const load = async () => {
    setCargando(true);
    const data = await listCotizacionesVajillaAction();
    setCotizaciones(data);
    setCargando(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAprobar = async (id: string) => {
    await aprobarCotizacionVajillaAction(id);
    await load();
  };

  const handleRechazar = async (id: string) => {
    if (!rechazoNota.trim()) return;
    await rechazarCotizacionVajillaAction(id, rechazoNota);
    setRechazandoId(null);
    setRechazoNota("");
    await load();
  };

  const pendientes = cotizaciones.filter(c => c.estado === "pendiente_aprobacion");
  const resto      = cotizaciones.filter(c => c.estado !== "pendiente_aprobacion");

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold">Cotizaciones de Vajilla</h2>
          <p className="text-white/30 text-xs mt-1">{cotizaciones.length} cotizaciones en total</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-charcoal text-xs font-semibold tracking-wider uppercase transition-colors"
        >
          <Plus size={13} /> Nueva cotización
        </button>
      </div>

      {/* Esperando aprobación */}
      {pendientes.length > 0 && (
        <div className="border border-amber-400/30 p-6">
          <p className="text-amber-400 text-[10px] tracking-[0.4em] uppercase mb-4">
            ⏳ Esperando aprobación ({pendientes.length})
          </p>
          <div className="flex flex-col gap-4">
            {pendientes.map(c => (
              <div key={c.id} className="border border-white/8 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-white font-semibold">{c.nombre}</p>
                    <p className="text-white/40 text-xs mt-0.5">N° {c.id.slice(0, 8).toUpperCase()} · {formatARS(c.total)}</p>
                    <p className="text-white/30 text-xs">{c.tipo_evento || "—"} · {c.lugar || "—"}</p>
                  </div>
                  <a href={`${SITE_URL}/cotizacion-vajilla/${c.id}`} target="_blank" rel="noopener noreferrer"
                    className="text-white/30 hover:text-gold transition-colors shrink-0"><ExternalLink size={14} /></a>
                </div>

                {rechazandoId === c.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={rechazoNota}
                      onChange={e => setRechazoNota(e.target.value)}
                      placeholder="Motivo del rechazo (aparece al colaborador)..."
                      rows={2}
                      className="w-full bg-transparent border border-red-400/30 px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-red-400/50 resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => { setRechazandoId(null); setRechazoNota(""); }}
                        className="flex-1 py-2 border border-white/10 text-white/40 text-xs hover:text-white transition-colors">Cancelar</button>
                      <button onClick={() => handleRechazar(c.id)}
                        className="flex-1 py-2 border border-red-400/40 text-red-400 text-xs hover:bg-red-400/10 transition-colors">Confirmar rechazo</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => handleAprobar(c.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-emerald-500/40 text-emerald-400 text-xs hover:bg-emerald-500/10 transition-colors">
                      <CheckCircle size={13} /> Aprobar
                    </button>
                    <button onClick={() => setRechazandoId(c.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-400/30 text-red-400/70 text-xs hover:bg-red-400/10 transition-colors">
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todas las cotizaciones */}
      <div>
        <h3 className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-4">
          Historial de cotizaciones
        </h3>
        {cargando ? (
          <p className="text-white/20 text-sm">Cargando...</p>
        ) : resto.length === 0 && pendientes.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-12">No hay cotizaciones aún. Creá la primera.</p>
        ) : resto.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-6">Solo hay cotizaciones pendientes de aprobación.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {resto.map(c => {
              const badge = ESTADO_BADGE[c.estado] ?? { label: c.estado, cls: "border-white/20 text-white/40" };
              const url   = `${SITE_URL}/cotizacion-vajilla/${c.id}`;
              return (
                <div key={c.id} className="border border-white/8">
                  <div
                    className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-white/2 transition-colors"
                    onClick={() => setExpandida(expandida === c.id ? null : c.id)}
                  >
                    <div className="flex flex-col min-w-0">
                      <p className="text-white text-sm font-medium truncate">{c.nombre}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        N° {c.id.slice(0, 8).toUpperCase()} · {formatARS(c.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] tracking-widest px-2 py-0.5 border ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="text-white/30 hover:text-gold transition-colors"><ExternalLink size={13} /></a>
                    </div>
                  </div>

                  {expandida === c.id && (
                    <div className="border-t border-white/6 px-5 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {[
                          ["Cliente",    c.nombre],
                          ["Teléfono",   c.telefono],
                          ["Email",      c.email || "—"],
                          ["Evento",     c.tipo_evento || "—"],
                          ["Lugar",      c.lugar || "—"],
                          ["Total",      formatARS(c.total)],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <p className="text-white/25 text-[10px] uppercase tracking-wider">{l}</p>
                            <p className="text-white/70 text-sm">{v}</p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/6 pt-4">
                        <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Artículos</p>
                        {(c.items ?? []).map((item) => (
                          <div key={item.id} className="flex justify-between text-xs text-white/50 mb-1">
                            <span>{item.nombre} × {item.qty} {item.unidad}</span>
                            <span>{formatARS(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <NuevaCotizacionModal
          onClose={() => setModalAbierto(false)}
          onCreated={() => { setModalAbierto(false); load(); }}
        />
      )}
    </div>
  );
}
