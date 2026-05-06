"use client";

import { motion } from "framer-motion";
import { MessageCircle, FileText, CalendarCheck, PartyPopper } from "lucide-react";

const PASOS = [
  {
    numero: "01",
    icon: MessageCircle,
    titulo: "Consulta inicial",
    descripcion:
      "Nos contactás por WhatsApp o el formulario. Conversamos sobre tu evento, fecha, cantidad de personas y lo que imaginás.",
  },
  {
    numero: "02",
    icon: FileText,
    titulo: "Propuesta a medida",
    descripcion:
      "Diseñamos un menú y presupuesto personalizado según tus gustos y posibilidades. Sin compromiso ni letra chica.",
  },
  {
    numero: "03",
    icon: CalendarCheck,
    titulo: "Coordinación total",
    descripcion:
      "Una vez confirmado, nos encargamos de todo: logística, traslado, montaje y coordinación del equipo en el lugar.",
  },
  {
    numero: "04",
    icon: PartyPopper,
    titulo: "Disfrutás tu evento",
    descripcion:
      "El día del evento vos disfrutás junto a tus invitados. Nosotros nos ocupamos de que todo salga perfecto.",
  },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

export default function ComoTrabajamos() {
  return (
    <section
      id="como-trabajamos"
      className="relative py-28 lg:py-36"
      style={{ background: "#0a0a0a" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            El proceso
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            ¿Cómo<br />
            <span className="text-gold italic">trabajamos?</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              Simple, transparente y sin sorpresas
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">

          {/* Línea conectora (solo desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gold/10" />

          {PASOS.map((paso, i) => {
            const Icon = paso.icon;
            return (
              <motion.div
                key={paso.numero}
                {...fadeUp(i * 0.1)}
                className="flex flex-col items-center text-center gap-5 relative"
              >
                {/* Número + ícono */}
                <div className="relative">
                  <div className="w-20 h-20 border border-gold/20 flex items-center justify-center bg-[#0a0a0a] relative z-10 hover:border-gold/50 transition-colors duration-500">
                    <Icon size={26} strokeWidth={1.2} className="text-gold/60" />
                  </div>
                  <span
                    className="absolute -top-3 -right-3 text-[11px] font-bold text-gold/40 tracking-widest"
                    style={{ fontFamily: "var(--font-display, serif)" }}
                  >
                    {paso.numero}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3
                    className="text-white font-display font-semibold text-lg leading-tight"
                    style={{ fontFamily: "var(--font-display, serif)" }}
                  >
                    {paso.titulo}
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed max-w-[220px] mx-auto">
                    {paso.descripcion}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp(0.4)} className="flex justify-center mt-16">
          <button
            onClick={() => {
              const text = encodeURIComponent(
                "Buenas tardes. Estoy interesado/a en conocer más sobre sus servicios de catering. ¿Podrían asesorarme? Muchas gracias."
              );
              window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
            }}
            className="group flex items-center gap-3 px-10 py-4 bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs tracking-[0.4em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
          >
            Empezar consulta
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
