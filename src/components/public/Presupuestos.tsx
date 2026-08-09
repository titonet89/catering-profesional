"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Calendar, MapPin, ChefHat, Send, Check } from "lucide-react";
import { PAQUETES_LISTA, PRECIO_MINIMO_INVITADOS, formatPrecio, type PaqueteId } from "@/data/paquetes";
import { cn } from "@/lib/utils";

const TIPOS_EVENTO = ["Boda", "Cumpleaños", "Evento corporativo", "Gala", "Quinceañero", "Bautismo", "Comunión", "Aniversario", "Otro"];
const POPULAR: PaqueteId[] = ["cena-promo-2", "lunch-promo-2"];

type FormState = "idle" | "sending" | "ok" | "error";
type Tab = "cena" | "lunch";

const inputClass =
  "w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors";

export default function Presupuestos() {
  const [tab, setTab] = useState<Tab>("cena");
  const [modalPaquete, setModalPaquete] = useState<PaqueteId | null>(null);
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", fecha: "",
    lugar: "", tipo_evento: "", invitados: "", mensaje: "",
  });
  const [estado, setEstado] = useState<FormState>("idle");

  const paquete = modalPaquete ? PAQUETES_LISTA.find((p) => p.id === modalPaquete) : null;
  const visible = PAQUETES_LISTA.filter((p) => p.tipo === tab);
  const cenaCount = PAQUETES_LISTA.filter((p) => p.tipo === "cena").length;
  const lunchCount = PAQUETES_LISTA.filter((p) => p.tipo === "lunch").length;

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function cerrarModal() {
    setModalPaquete(null);
    setEstado("idle");
    setForm({ nombre: "", email: "", telefono: "", fecha: "", lugar: "", tipo_evento: "", invitados: "", mensaje: "" });
  }

  async function enviar(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!modalPaquete) return;
    setEstado("sending");
    try {
      const res = await fetch("/api/presupuesto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paquete: modalPaquete, invitados: Number(form.invitados) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }

  return (
    <section id="presupuesto" className="relative py-28 lg:py-36" style={{ background: "#080808" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">Nuestros paquetes</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Elegí tu<br /><span className="text-gold italic">propuesta</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">Solicitá tu presupuesto personalizado</p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-14"
        >
          <div className="flex border border-white/10 p-1 gap-1">
            {(["cena", "lunch"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-10 py-3 text-xs tracking-[0.4em] uppercase font-medium transition-all duration-300",
                  tab === t
                    ? "bg-gold text-charcoal"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {t === "cena" ? "Cenas" : "Lunches"}
                <span className={cn("ml-2 text-[10px]", tab === t ? "text-charcoal/60" : "text-white/20")}>
                  {t === "cena" ? cenaCount : lunchCount}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((p, i) => {
              const isPopular = POPULAR.includes(p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={cn(
                    "relative border flex flex-col transition-colors duration-300",
                    isPopular
                      ? "border-gold/40 hover:border-gold/65"
                      : "border-white/8 hover:border-gold/25"
                  )}
                >
                  {/* Badge */}
                  {isPopular && (
                    <div className="absolute top-0 right-0 z-10 bg-gold text-charcoal text-[9px] tracking-[0.3em] uppercase font-bold px-3 py-1">
                      Más popular
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <p className="text-gold text-[9px] tracking-[0.4em] uppercase mb-0.5">
                        {p.tipo === "cena" ? "Cena" : "Lunch"}
                      </p>
                      <h3 className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-display, serif)" }}>
                        {p.nombre}
                      </h3>
                    </div>

                    <div className="absolute bottom-4 right-4 text-right">
                      <p className="text-white/40 text-[9px] uppercase tracking-wider">desde</p>
                      <p className="text-gold font-bold text-base leading-tight">{formatPrecio(p.precio)}</p>
                      <p className="text-white/35 text-[9px]">por persona</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    {/* Resumen */}
                    <ul className="grid grid-cols-2 gap-y-2 gap-x-3">
                      {p.resumen.map((item) => (
                        <li key={item} className="flex items-center gap-1.5 text-white/55 text-xs">
                          <Check size={11} className="text-gold/70 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="h-px bg-white/6" />

                    {/* Service highlights */}
                    <ul className="flex flex-col gap-1.5">
                      {p.servicios.slice(0, 3).map((s) => (
                        <li key={s} className="flex items-center gap-2 text-white/35 text-xs">
                          <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                          {s}
                        </li>
                      ))}
                      {p.servicios.length > 3 && (
                        <li className="text-white/20 text-xs pl-3">
                          +{p.servicios.length - 3} servicios más incluidos
                        </li>
                      )}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => setModalPaquete(p.id)}
                      className={cn(
                        "mt-auto py-3 text-xs tracking-[0.4em] uppercase transition-all duration-300",
                        isPopular
                          ? "bg-gold text-charcoal hover:bg-gold-light"
                          : "border border-gold/35 text-gold hover:bg-gold hover:text-charcoal"
                      )}
                    >
                      Solicitar presupuesto
                    </button>
                    <a
                      href={`/presupuesto/muestra/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 text-center text-xs tracking-wider border border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
                    >
                      Ver propuesta completa →
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Nota pie */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-white/20 text-[11px] mt-10 tracking-wider"
        >
          Precios referenciales · El valor final se calcula según la cantidad de invitados y la fecha del evento
        </motion.p>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {modalPaquete && paquete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10"
              style={{ background: "#0a0a0a" }}
            >
              {/* Header modal */}
              <div className="flex items-start justify-between p-6 border-b border-white/8">
                <div>
                  <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-1">Solicitud de presupuesto</p>
                  <h3 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-display, serif)" }}>
                    {paquete.nombre}
                  </h3>
                </div>
                <button onClick={cerrarModal} className="text-white/30 hover:text-white transition-colors p-1">
                  <X size={20} />
                </button>
              </div>

              {estado === "ok" ? (
                <div className="p-8 flex flex-col items-center text-center gap-4">
                  <span className="text-4xl">🙏</span>
                  <h4 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-display, serif)" }}>
                    ¡Gracias, {form.nombre.split(" ")[0]}!
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Recibimos tu solicitud para <strong className="text-white">{paquete.nombre}</strong>.
                    Nuestro equipo la revisará y te contactaremos pronto con tu presupuesto personalizado.
                  </p>
                  {Number(form.invitados) >= PRECIO_MINIMO_INVITADOS && (
                    <p className="text-gold/70 text-xs border border-gold/20 px-4 py-2 mt-2">
                      Por ser un evento de {form.invitados} personas, recibirás tu propuesta completa a la brevedad.
                    </p>
                  )}
                  <button
                    onClick={cerrarModal}
                    className="mt-4 py-3 px-8 bg-gold text-charcoal text-xs font-semibold tracking-widest uppercase hover:bg-gold-light transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={enviar} className="p-6 flex flex-col gap-4">
                  <p className="text-white/40 text-xs">Completá tus datos y te enviamos la propuesta.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/40 text-[10px] tracking-widest uppercase">Nombre completo *</label>
                      <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
                        placeholder="Tu nombre y apellido" required className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/40 text-[10px] tracking-widest uppercase">WhatsApp *</label>
                      <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)}
                        placeholder="+54 388..." required className={inputClass} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] tracking-widest uppercase">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                      placeholder="tu@email.com" required className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/40 text-[10px] tracking-widest uppercase flex items-center gap-1">
                        <Calendar size={11} /> Fecha del evento *
                      </label>
                      <input type="date" value={form.fecha} onChange={(e) => set("fecha", e.target.value)}
                        required className={inputClass} style={{ colorScheme: "dark" }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/40 text-[10px] tracking-widest uppercase flex items-center gap-1">
                        <Users size={11} /> Cantidad de invitados *
                      </label>
                      <input type="number" min="1" value={form.invitados} onChange={(e) => set("invitados", e.target.value)}
                        placeholder="Ej: 120" required className={inputClass} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] tracking-widest uppercase flex items-center gap-1">
                      <MapPin size={11} /> Lugar del evento *
                    </label>
                    <input value={form.lugar} onChange={(e) => set("lugar", e.target.value)}
                      placeholder="Salón, dirección o localidad" required className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] tracking-widest uppercase flex items-center gap-1">
                      <ChefHat size={11} /> Tipo de evento *
                    </label>
                    <select value={form.tipo_evento} onChange={(e) => set("tipo_evento", e.target.value)}
                      required className={`${inputClass} bg-[#111]`}>
                      <option value="" style={{ background: "#111", color: "#fff" }}>Seleccioná...</option>
                      {TIPOS_EVENTO.map((t) => (
                        <option key={t} value={t} style={{ background: "#111", color: "#fff" }}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] tracking-widest uppercase">Comentarios adicionales</label>
                    <textarea value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)}
                      placeholder="Alguna preferencia especial, restricción alimentaria, etc."
                      rows={3} className={`${inputClass} resize-none`} />
                  </div>

                  {estado === "error" && (
                    <p className="text-red-400 text-xs">Hubo un error al enviar. Intentá de nuevo.</p>
                  )}

                  <button
                    type="submit"
                    disabled={estado === "sending"}
                    className="flex items-center justify-center gap-2 py-3.5 bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs tracking-[0.4em] uppercase transition-colors disabled:opacity-50"
                  >
                    <Send size={14} />
                    {estado === "sending" ? "Enviando..." : "Solicitar presupuesto"}
                  </button>

                  <p className="text-white/20 text-[10px] text-center">
                    Te contactaremos dentro de las 24 horas hábiles.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
