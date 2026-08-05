"use client";

import { useState, useEffect, useActionState } from "react";
import { Plus, Minus, Save, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import {
  listCotizacionesVajillaGuestAction,
  createCotizacionVajillaGuestAction,
  updateCotizacionVajillaGuestAction,
} from "@/app/actions/guest-vajilla";
import { VAJILLA_CATEGORIAS, findVajillaItem, formatARS } from "@/data/vajilla";
import type { VajillaItemId, VajillaItemPedido } from "@/data/vajilla";
import type { CotizacionVajilla } from "@/app/actions/admin-vajilla";

const SITE_URL   = "https://cateringprofesional.com.ar";
const TIPOS      = ["Boda", "Cumpleaños", "Evento corporativo", "Gala", "Quinceañero", "Bautismo", "Comunión", "Aniversario", "Otro"];
const inputClass = "w-full bg-transparent border border-white/10 px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors";

function toWAPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.startsWith("54")) return d;
  if (d.startsWith("0"))  return "54" + d.slice(1);
  return "54" + d;
}

const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  pendiente_aprobacion: { label: "Esperando aprobación", cls: "border-amber-400/40 text-amber-400" },
  aprobado:             { label: "Aprobado ✓",           cls: "border-emerald-500/40 text-emerald-400" },
  rechazado:            { label: "Rechazado",             cls: "border-red-400/40 text-red-400" },
  enviado:              { label: "Enviado",               cls: "border-white/20 text-white/40" },
  pendiente:            { label: "Pendiente",             cls: "border-white/20 text-white/40" },
};

// ─── Selector de ítems (compartido en form nuevo y edición) ──────────────────

function ItemSelector({
  cantidades,
  setCantidades,
}: {
  cantidades: Record<VajillaItemId, number>;
  setCantidades: (fn: (c: Record<VajillaItemId, number>) => Record<VajillaItemId, number>) => void;
}) {
  const add    = (id: VajillaItemId) => setCantidades(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const remove = (id: VajillaItemId) => setCantidades(c => {
    const v = (c[id] ?? 0) - 1;
    if (v <= 0) { const next = { ...c }; delete next[id]; return next; }
    return { ...c, [id]: v };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {VAJILLA_CATEGORIAS.map(cat => (
        <div key={cat.nombre} className="border border-white/6 p-4">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-3">{cat.icono} {cat.nombre}</p>
          <ul className="flex flex-col gap-2.5">
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
  );
}

// ─── Formulario nueva cotización ─────────────────────────────────────────────

function NuevaCotizacionForm({ onClose }: { onClose: () => void }) {
  const [cantidades, setCantidades] = useState<Record<VajillaItemId, number>>({} as Record<VajillaItemId, number>);
  const [state, action, pending]    = useActionState(createCotizacionVajillaGuestAction, null);

  const itemsPedido: VajillaItemPedido[] = Object.entries(cantidades)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const item = findVajillaItem(id)!;
      return { id: id as VajillaItemId, nombre: item.nombre, unidad: item.unidad, qty, precio_unitario: item.precio, subtotal: item.precio * qty };
    });
  const total   = itemsPedido.reduce((s, i) => s + i.subtotal, 0);
  const haItems = itemsPedido.length > 0;

  if (state?.id) {
    return (
      <div className="border border-amber-400/30 p-6 text-center flex flex-col items-center gap-3">
        <span className="text-2xl">⏳</span>
        <p className="text-amber-400 font-semibold text-sm">Cotización enviada para aprobación</p>
        <p className="text-white/40 text-xs">El admin revisará tu cotización y te notificará el resultado.</p>
        <button onClick={onClose} className="text-white/30 text-xs hover:text-white transition-colors underline underline-offset-4">Cerrar</button>
      </div>
    );
  }

  return (
    <form action={action} className="border border-white/8 p-5 flex flex-col gap-5">
      <input type="hidden" name="items" value={JSON.stringify(itemsPedido)} />

      <p className="text-white/50 text-[10px] tracking-[0.4em] uppercase">Artículos *</p>
      <ItemSelector cantidades={cantidades} setCantidades={setCantidades} />

      {haItems && (
        <div className="border border-gold/20 px-4 py-3">
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

      <p className="text-white/50 text-[10px] tracking-[0.4em] uppercase mt-2">Datos del cliente *</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] uppercase tracking-wider">Nombre *</label>
          <input name="nombre" required placeholder="Nombre y apellido" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] uppercase tracking-wider">Email *</label>
          <input type="email" name="email" required placeholder="email@ejemplo.com" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] uppercase tracking-wider">Teléfono *</label>
          <input name="telefono" required placeholder="+54 388..." className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] uppercase tracking-wider">Fecha del evento</label>
          <input type="date" name="fecha_evento" className={inputClass} style={{ colorScheme: "dark" }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] uppercase tracking-wider">Lugar</label>
          <input name="lugar" placeholder="Salón, dirección..." className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] uppercase tracking-wider">Tipo de evento</label>
          <select name="tipo_evento" className={`${inputClass} bg-[#111]`}>
            <option value="" style={{ background: "#111" }}>Seleccioná...</option>
            {TIPOS.map(t => <option key={t} value={t} style={{ background: "#111" }}>{t}</option>)}
          </select>
        </div>
      </div>

      {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending || !haItems}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-charcoal font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50">
          <Plus size={14} /> {pending ? "Creando..." : "Enviar para aprobación"}
        </button>
        <button type="button" onClick={onClose}
          className="px-5 py-3 border border-white/10 text-white/40 hover:text-white text-sm transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Fila editable de cotización ──────────────────────────────────────────────

function CotizacionRow({ cotizacion }: { cotizacion: CotizacionVajilla }) {
  const [open, setOpen]             = useState(false);
  const [editing, setEditing]       = useState(false);
  const [cantidades, setCantidades] = useState<Record<VajillaItemId, number>>(() => {
    const m: Record<VajillaItemId, number> = {} as Record<VajillaItemId, number>;
    (cotizacion.items ?? []).forEach(i => { m[i.id as VajillaItemId] = i.qty; });
    return m;
  });
  const [state, action, pending]    = useActionState(updateCotizacionVajillaGuestAction, null);

  const badge = ESTADO_BADGE[cotizacion.estado] ?? { label: cotizacion.estado, cls: "border-white/20 text-white/40" };
  const url   = `${SITE_URL}/cotizacion-vajilla/${cotizacion.id}`;

  const itemsPedido: VajillaItemPedido[] = Object.entries(cantidades)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const item = findVajillaItem(id)!;
      return { id: id as VajillaItemId, nombre: item.nombre, unidad: item.unidad, qty, precio_unitario: item.precio, subtotal: item.precio * qty };
    });
  const total = itemsPedido.reduce((s, i) => s + i.subtotal, 0);

  const fechaRaw = cotizacion.fecha_evento
    ? new Date(cotizacion.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  const waTexto = encodeURIComponent(
    `Hola ${cotizacion.nombre.split(" ")[0]} 😊\n\nTe compartimos tu cotización de vajilla desde *Catering Profesional*:\n\n👉 ${url}\n\nCualquier consulta escribinos 🙌\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`
  );

  return (
    <div className="border border-white/8">
      {/* Fila resumen */}
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white text-sm font-semibold truncate">{cotizacion.nombre}</p>
            <span className={`text-[10px] tracking-widest px-2 py-0.5 border ${badge.cls}`}>{badge.label}</span>
          </div>
          <p className="text-white/30 text-xs mt-0.5">
            Vajilla · {formatARS(total || cotizacion.total)} · {fechaRaw}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="text-white/30 hover:text-gold transition-colors"><ExternalLink size={13} /></a>
          {open ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </div>
      </div>

      {/* Detalle expandido */}
      {open && (
        <div className="border-t border-white/6 px-5 py-5 flex flex-col gap-4">

          {/* Nota de rechazo */}
          {cotizacion.estado === "rechazado" && cotizacion.rechazo_nota && (
            <div className="border border-red-400/30 px-4 py-3">
              <p className="text-red-400 text-[10px] tracking-widest uppercase mb-1">Motivo del rechazo</p>
              <p className="text-white/60 text-sm">{cotizacion.rechazo_nota}</p>
            </div>
          )}

          {/* Estado: aprobado → botón enviar */}
          {cotizacion.estado === "aprobado" && (
            <a
              href={`https://wa.me/${toWAPhone(cotizacion.telefono)}?text=${waTexto}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-semibold tracking-wider hover:opacity-90 transition-opacity"
            >
              📱 Enviar cotización al cliente por WhatsApp
            </a>
          )}

          {/* Estado: pendiente aprobación */}
          {cotizacion.estado === "pendiente_aprobacion" && (
            <p className="text-amber-400/70 text-xs text-center py-2">
              ⏳ Esperando aprobación del admin para enviar al cliente
            </p>
          )}

          {/* Artículos seleccionados */}
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Artículos</p>
            {(cotizacion.items ?? []).map(item => (
              <div key={item.id} className="flex justify-between text-xs text-white/50 mb-1">
                <span>{item.nombre} × {item.qty} {item.unidad}</span>
                <span>{formatARS(item.subtotal)}</span>
              </div>
            ))}
          </div>

          {/* Editar (si no está enviado) */}
          {cotizacion.estado !== "enviado" && cotizacion.estado !== "pendiente_aprobacion" && (
            <button
              onClick={() => setEditing(e => !e)}
              className="flex items-center justify-center gap-2 py-2 border border-white/10 text-white/40 hover:text-gold hover:border-gold/40 text-xs transition-colors"
            >
              {editing ? "Cancelar edición" : `${cotizacion.estado === "rechazado" ? "✏ Corregir y reenviar" : "✏ Editar"}`}
            </button>
          )}

          {editing && (
            <form action={action} className="flex flex-col gap-4 border border-white/6 p-4">
              <input type="hidden" name="id" value={cotizacion.id} />
              <input type="hidden" name="items" value={JSON.stringify(itemsPedido)} />
              <input type="hidden" name="email"   defaultValue={cotizacion.email}       />
              <input type="hidden" name="nombre"  defaultValue={cotizacion.nombre}      />
              <input type="hidden" name="telefono" defaultValue={cotizacion.telefono}   />
              <input type="hidden" name="lugar"   defaultValue={cotizacion.lugar}       />
              <input type="hidden" name="tipo_evento" defaultValue={cotizacion.tipo_evento} />
              {cotizacion.fecha_evento && <input type="hidden" name="fecha_evento" defaultValue={cotizacion.fecha_evento} />}

              <p className="text-white/40 text-[10px] tracking-widest uppercase">Modificar artículos</p>
              <ItemSelector cantidades={cantidades} setCantidades={setCantidades} />

              {itemsPedido.length > 0 && (
                <div className="border border-gold/15 px-3 py-2">
                  {itemsPedido.map(i => (
                    <div key={i.id} className="flex justify-between text-xs text-white/40 mb-1">
                      <span>{i.nombre} × {i.qty}</span><span>{formatARS(i.subtotal)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs font-semibold text-gold mt-1 pt-1 border-t border-white/8">
                    <span>Total</span><span>{formatARS(total)}</span>
                  </div>
                </div>
              )}

              {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
              {!state?.error && state && <p className="text-emerald-400 text-xs">Cambios guardados ✓</p>}

              <button type="submit" disabled={pending || itemsPedido.length === 0}
                className="flex items-center justify-center gap-2 py-3 bg-gold text-charcoal font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50">
                <Save size={13} /> {pending ? "Guardando..." : cotizacion.estado === "rechazado" ? "Guardar y reenviar" : "Guardar cambios"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sección principal ────────────────────────────────────────────────────────

export default function VajillaGuestSection() {
  const [cotizaciones, setCotizaciones] = useState<CotizacionVajilla[]>([]);
  const [cargando, setCargando]         = useState(true);
  const [showForm, setShowForm]         = useState(false);

  const load = async () => {
    setCargando(true);
    const data = await listCotizacionesVajillaGuestAction();
    setCotizaciones(data);
    setCargando(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase">Mis cotizaciones vajilla</h2>
          <p className="text-white/20 text-xs mt-1">{cotizaciones.length} cotización{cotizaciones.length !== 1 ? "es" : ""}</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold text-xs tracking-wider hover:bg-gold hover:text-charcoal transition-all duration-200">
            <Plus size={13} /> Nueva cotización
          </button>
        )}
      </div>

      {showForm && (
        <NuevaCotizacionForm onClose={() => { setShowForm(false); load(); }} />
      )}

      {cargando ? (
        <p className="text-white/20 text-sm py-6 text-center">Cargando...</p>
      ) : cotizaciones.length === 0 && !showForm ? (
        <div className="border border-white/5 py-16 text-center">
          <p className="text-white/20 text-sm">No tenés cotizaciones de vajilla aún.</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 text-gold/60 hover:text-gold text-xs tracking-wider underline underline-offset-4 transition-colors">
            Crear la primera
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cotizaciones.map(c => <CotizacionRow key={c.id} cotizacion={c} />)}
        </div>
      )}
    </div>
  );
}
