"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, ExternalLink, Save, ChevronDown, ChevronUp } from "lucide-react";
import {
  logoutGuestAction,
  createSolicitudGuestAction,
  updateSolicitudGuestAction,
} from "@/app/actions/guest-auth";
import { PAQUETES_LISTA, PAQUETES, type PaqueteId } from "@/data/paquetes";
import type { GuestPayload } from "@/lib/guest-session";
import VajillaGuestSection from "./VajillaGuestSection";

type Solicitud = {
  id: string;
  paquete: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha_evento: string;
  lugar: string;
  tipo_evento: string;
  invitados: number;
  precio_override: number | null;
  notas_admin: string;
  rechazo_nota?: string;
  estado: string;
  created_at: string;
};

const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  pendiente_aprobacion: { label: "Esperando aprobación", cls: "border-amber-400/40 text-amber-400" },
  aprobado:             { label: "Aprobado ✓",           cls: "border-emerald-500/40 text-emerald-400" },
  rechazado:            { label: "Rechazado",             cls: "border-red-400/40 text-red-400" },
  enviado:              { label: "Enviado",               cls: "border-white/20 text-white/40" },
  pendiente:            { label: "Pendiente",             cls: "border-white/20 text-white/40" },
};

function toWAPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("54")) return d;
  if (d.startsWith("0"))  return "54" + d.slice(1);
  return "54" + d;
}

const SITE_URL = "https://cateringprofesional.com.ar";
const TIPOS_EVENTO = ["Boda", "Cumpleaños", "Evento corporativo", "Gala", "Quinceañero", "Bautismo", "Comunión", "Aniversario", "Otro"];
const inputClass = "w-full bg-transparent border border-white/10 px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors";

// ── Fila editable por solicitud ─────────────────────────────────────────────
function SolicitudRow({ solicitud }: { solicitud: Solicitud }) {
  const router = useRouter();
  const [isOpen, setIsOpen]     = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(updateSolicitudGuestAction, null);

  const paquete        = PAQUETES[solicitud.paquete as PaqueteId];
  const presupuestoUrl = `${SITE_URL}/presupuesto/${solicitud.id}`;
  const waTexto        = encodeURIComponent(
    `Hola ${solicitud.nombre.split(" ")[0]} 😊\n\nTe compartimos tu propuesta personalizada — *${paquete?.nombre ?? solicitud.paquete}*:\n\n👉 ${presupuestoUrl}\n\nCualquier consulta escribinos 🙌\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`
  );
  const waUrl = `https://wa.me/${toWAPhone(solicitud.telefono)}?text=${waTexto}`;

  // Cerrar y refrescar tras guardar con éxito
  useEffect(() => {
    if (updateState?.success) {
      router.refresh();
      setIsOpen(false);
    }
  }, [updateState?.success]); // eslint-disable-line react-hooks/exhaustive-deps

  const precioPorPersona = solicitud.precio_override ?? (paquete?.precio ?? null);
  const total = precioPorPersona ? precioPorPersona * solicitud.invitados : null;

  return (
    <div className="border border-white/8 hover:border-white/15 transition-colors">
      {/* Encabezado */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-white text-sm font-semibold">{solicitud.nombre}</p>
            {ESTADO_BADGE[solicitud.estado] && (
              <span className={`text-[9px] tracking-widest px-2 py-0.5 border uppercase ${ESTADO_BADGE[solicitud.estado].cls}`}>
                {ESTADO_BADGE[solicitud.estado].label}
              </span>
            )}
          </div>
          <p className="text-white/40 text-xs">
            {paquete?.nombre ?? solicitud.paquete} · {solicitud.invitados} personas · {solicitud.tipo_evento}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {total && (
            <span className="text-gold text-xs hidden sm:block">
              ${total.toLocaleString("es-AR")}
            </span>
          )}
          <span className="text-white/25 text-xs">
            {new Date(solicitud.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
          </span>
          {isOpen
            ? <ChevronUp size={14} className="text-white/30" />
            : <ChevronDown size={14} className="text-white/30" />
          }
        </div>
      </div>

      {/* Formulario de edición */}
      {isOpen && (
        <div className="border-t border-white/8 px-5 py-5">
          <form action={updateAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={solicitud.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Nombre del cliente</label>
                <input name="nombre" defaultValue={solicitud.nombre} required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">WhatsApp</label>
                <input name="telefono" defaultValue={solicitud.telefono} required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Email</label>
                <input type="email" name="email" defaultValue={solicitud.email} required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Fecha del evento</label>
                <input type="date" name="fecha_evento" defaultValue={solicitud.fecha_evento} required className={inputClass} style={{ colorScheme: "dark" }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Lugar</label>
                <input name="lugar" defaultValue={solicitud.lugar} required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Tipo de evento</label>
                <select name="tipo_evento" defaultValue={solicitud.tipo_evento} className={`${inputClass} bg-[#111]`}>
                  {TIPOS_EVENTO.map(t => <option key={t} value={t} style={{ background: "#111", color: "#fff" }}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Invitados</label>
                <input type="number" min="1" name="invitados" defaultValue={solicitud.invitados} required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Precio por persona (ARS)</label>
                <input type="text" inputMode="numeric" name="precio_override" defaultValue={solicitud.precio_override ?? ""} placeholder="Ej: 59900" className={inputClass} />
                <p className="text-white/20 text-[10px]">Sin puntos ni comas — ej: 59900. Vacío = precio base del paquete</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Notas y personalizaciones del servicio</label>
              <textarea
                name="notas_admin"
                defaultValue={solicitud.notas_admin ?? ""}
                placeholder="Ej: Se agrega entrada de empanadas · Sin gluten para 5 personas · Decoración temática floral..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <p className="text-white/20 text-[10px]">Aparecen en el PDF del presupuesto bajo &quot;Notas y personalizaciones&quot;</p>
            </div>

            {updateState?.error   && <p className="text-red-400 text-xs">{updateState.error}</p>}
            {updateState?.success && <p className="text-emerald-400 text-xs">✓ {updateState.success}</p>}

            {solicitud.estado === "rechazado" && solicitud.rechazo_nota && (
              <div className="border border-red-400/30 bg-red-400/5 px-4 py-3 rounded">
                <p className="text-red-400 text-[10px] tracking-widest uppercase mb-1">Motivo del rechazo</p>
                <p className="text-white/70 text-xs">{solicitud.rechazo_nota}</p>
                <p className="text-white/30 text-[10px] mt-2">Editá los campos y guardá para volver a enviar para aprobación.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
              <button
                type="submit"
                disabled={updatePending}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gold text-charcoal text-xs font-semibold tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                <Save size={13} /> {updatePending ? "Guardando..." : solicitud.estado === "rechazado" ? "Guardar y reenviar" : "Guardar cambios"}
              </button>

              {/* PDF: solo disponible cuando está aprobado */}
              {solicitud.estado === "aprobado" ? (
                <a href={presupuestoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs tracking-wider transition-colors">
                  <ExternalLink size={13} /> Ver y descargar PDF
                </a>
              ) : (
                <span className="flex items-center justify-center gap-2 py-2.5 px-4 border border-white/8 text-white/20 text-xs">
                  <ExternalLink size={13} /> PDF no disponible aún
                </span>
              )}

              {solicitud.estado === "aprobado" && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] text-white text-xs tracking-wider hover:opacity-90 transition-opacity">
                  Enviar al cliente
                </a>
              )}
              {solicitud.estado === "pendiente_aprobacion" && (
                <span className="flex items-center justify-center gap-2 py-2.5 px-4 border border-amber-400/30 text-amber-400/70 text-xs">
                  ⏳ Esperando aprobación del admin
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ── Formulario nuevo presupuesto ─────────────────────────────────────────────
function NuevaSolicitudForm({ onClose, session }: { onClose: () => void; session: GuestPayload }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createSolicitudGuestAction, null);

  useEffect(() => {
    if (state?.id) router.refresh();
  }, [state?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state?.id) {
    const presupuestoUrl = `${SITE_URL}/presupuesto/${state.id}`;
    const waPropioTexto  = encodeURIComponent(
      `*Nuevo presupuesto creado* 📋\n\n👉 ${presupuestoUrl}`
    );
    const waPropio = session.whatsapp
      ? `https://wa.me/${toWAPhone(session.whatsapp)}?text=${waPropioTexto}`
      : null;

    return (
      <div className="border border-amber-400/20 bg-amber-400/5 p-8 flex flex-col items-center gap-4 text-center">
        <span className="text-3xl">⏳</span>
        <div>
          <p className="text-amber-400 text-sm font-semibold">Presupuesto enviado para aprobación</p>
          <p className="text-white/30 text-xs mt-1">El administrador lo revisará y recibirás la confirmación.</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <a href={presupuestoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 px-4 py-2 border border-white/20 text-white/60 hover:text-white text-xs tracking-wider transition-colors">
            <ExternalLink size={12} /> Vista previa
          </a>
          {waPropio && (
            <a href={waPropio} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs tracking-wider transition-colors">
              Enviar a mi WhatsApp
            </a>
          )}
          <button onClick={onClose}
            className="px-4 py-2 bg-gold text-charcoal text-xs font-semibold tracking-widest uppercase hover:bg-gold-light transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="border border-white/8 p-6 flex flex-col gap-4">
      <h3 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-2">Nuevo presupuesto</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Paquete *</label>
          <select name="paquete" required className={`${inputClass} bg-[#111]`}>
            <option value="" style={{ background: "#111", color: "#fff" }}>Seleccioná un paquete...</option>
            {PAQUETES_LISTA.map(p => (
              <option key={p.id} value={p.id} style={{ background: "#111", color: "#fff" }}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Nombre del cliente *</label>
          <input name="nombre" required placeholder="Nombre y apellido" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">WhatsApp *</label>
          <input name="telefono" required placeholder="+54 388..." className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Email *</label>
          <input type="email" name="email" required placeholder="email@ejemplo.com" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Fecha del evento *</label>
          <input type="date" name="fecha_evento" required className={inputClass} style={{ colorScheme: "dark" }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Lugar *</label>
          <input name="lugar" required placeholder="Salón, dirección, localidad..." className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Tipo de evento *</label>
          <select name="tipo_evento" required className={`${inputClass} bg-[#111]`}>
            <option value="" style={{ background: "#111", color: "#fff" }}>Seleccioná...</option>
            {TIPOS_EVENTO.map(t => <option key={t} value={t} style={{ background: "#111", color: "#fff" }}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Cantidad de invitados *</label>
          <input type="number" min="1" name="invitados" required placeholder="Ej: 120" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Precio por persona (ARS)</label>
          <input type="text" inputMode="numeric" name="precio_override" placeholder="Ej: 59900 (opcional)" className={inputClass} />
          <p className="text-white/20 text-[10px]">Solo números — ej: 59900</p>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-white/30 text-[10px] tracking-widest uppercase">Notas y personalizaciones</label>
          <textarea
            name="notas_admin"
            rows={3}
            placeholder="Ej: Se agrega entrada de empanadas · Sin gluten para 5 personas · Decoración temática floral..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-white/20 text-[10px]">Estas notas se muestran en el PDF del presupuesto</p>
        </div>
      </div>

      {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2 flex-1 py-3 bg-gold text-charcoal font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          <Plus size={14} /> {pending ? "Creando..." : "Crear presupuesto"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-3 border border-white/10 text-white/40 hover:text-white text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Panel principal ──────────────────────────────────────────────────────────
export default function GuestPanel({
  session,
  initialSolicitudes,
}: {
  session: GuestPayload;
  initialSolicitudes: Solicitud[];
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "white" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/8">
        <div>
          <span className="text-gold/70 text-[10px] tracking-[0.5em] uppercase">Colaborador</span>
          <h1 className="text-white font-bold tracking-wide text-base sm:text-lg" style={{ fontFamily: "var(--font-display, serif)" }}>
            {session.nombre}
          </h1>
        </div>
        <form action={logoutGuestAction}>
          <button type="submit" className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
            <LogOut size={14} /> <span className="hidden sm:inline">Salir</span>
          </button>
        </form>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Encabezado de sección */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase">
              Mis presupuestos
            </h2>
            <p className="text-white/20 text-xs mt-1">{initialSolicitudes.length} presupuesto{initialSolicitudes.length !== 1 ? "s" : ""}</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold text-xs tracking-wider hover:bg-gold hover:text-charcoal transition-all duration-200"
            >
              <Plus size={13} /> Nuevo presupuesto
            </button>
          )}
        </div>

        {/* Formulario nuevo */}
        {showForm && (
          <NuevaSolicitudForm onClose={() => setShowForm(false)} session={session} />
        )}

        {/* Lista de presupuestos */}
        {initialSolicitudes.length === 0 && !showForm ? (
          <div className="border border-white/5 py-20 text-center">
            <p className="text-white/20 text-sm">No tenés presupuestos aún.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-gold/60 hover:text-gold text-xs tracking-wider underline underline-offset-4 transition-colors"
            >
              Crear el primero
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {initialSolicitudes.map(s => (
              <SolicitudRow key={s.id} solicitud={s} />
            ))}
          </div>
        )}

        {/* Separador */}
        <div className="h-px bg-white/6 mt-4" />

        {/* Sección vajilla */}
        <VajillaGuestSection />

      </div>
    </div>
  );
}
