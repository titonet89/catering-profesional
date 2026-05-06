"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const PREGUNTAS = [
  {
    pregunta: "¿Con cuánta anticipación hay que reservar?",
    respuesta:
      "Recomendamos reservar con al menos 30 días de anticipación para eventos medianos. Para bodas y eventos grandes, idealmente con 2 a 3 meses. En temporada alta (noviembre a marzo) la demanda es mayor, así que cuanto antes mejor.",
  },
  {
    pregunta: "¿Trabajan fuera de San Salvador de Jujuy?",
    respuesta:
      "Sí, cubrimos todo el NOA: Jujuy, Salta, Tucumán y zonas aledañas. El traslado fuera del radio urbano puede tener un costo adicional que se informa en el presupuesto. Consulte su ubicación.",
  },
  {
    pregunta: "¿El alquiler de vajilla está incluido en los paquetes?",
    respuesta:
      "Los paquetes Clásico, Premium y Gala incluyen vajilla. El paquete Básico incluye vajilla estándar. Si necesita vajilla adicional o de mayor categoría, puede sumarse desde nuestra sección de alquiler.",
  },
  {
    pregunta: "¿Hacen menús especiales (celíacos, vegetarianos, etc.)?",
    respuesta:
      "Absolutamente. Podemos adaptar el menú a necesidades dietarias especiales: celíacos (sin TACC), vegetarianos, veganos, alergias alimentarias o requerimientos religiosos. Solo hay que avisarnos al momento de la consulta.",
  },
  {
    pregunta: "¿Cuánto es el depósito para reservar la fecha?",
    respuesta:
      "Solicitamos un anticipo del 30% para confirmar la reserva y bloquear la fecha en nuestra agenda. El saldo restante se abona en los días previos al evento según lo acordado en el contrato.",
  },
  {
    pregunta: "¿Puedo modificar el menú después de contratar?",
    respuesta:
      "Sí, siempre que sea con la debida anticipación. Cambios menores (hasta 15 días antes) no tienen costo adicional. Modificaciones más significativas dependen de los insumos y se evalúan caso a caso.",
  },
  {
    pregunta: "¿Qué pasa si tengo que cancelar el evento?",
    respuesta:
      "Entendemos que pueden surgir imprevistos. Si la cancelación es con más de 30 días de anticipación, devolvemos el anticipo menos gastos administrativos. Casos de fuerza mayor se analizan individualmente con toda la buena voluntad.",
  },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-28 lg:py-36"
      style={{ background: "#080808" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-14 lg:mb-18">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            Preguntas frecuentes
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Todo lo que<br />
            <span className="text-gold italic">necesitás saber</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              ¿Algo más? Escribinos sin compromiso
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        <div className="flex flex-col divide-y divide-white/5">
          {PREGUNTAS.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)}>
              <button
                onClick={() => setAbierto(abierto === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 py-6 text-left group"
              >
                <span className={`text-sm sm:text-base leading-snug transition-colors duration-300 ${
                  abierto === i ? "text-gold" : "text-white/70 group-hover:text-white"
                }`}>
                  {item.pregunta}
                </span>
                <span className={`shrink-0 w-7 h-7 flex items-center justify-center border transition-all duration-300 mt-0.5 ${
                  abierto === i
                    ? "border-gold/50 text-gold bg-gold/5"
                    : "border-white/10 text-white/30 group-hover:border-white/25"
                }`}>
                  {abierto === i ? <Minus size={13} /> : <Plus size={13} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {abierto === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/45 text-sm leading-relaxed pb-6 max-w-2xl">
                      {item.respuesta}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.3)} className="flex justify-center mt-12">
          <button
            onClick={() => {
              const text = encodeURIComponent(
                "Buenas tardes. Tengo una consulta sobre sus servicios de catering que no encontré en el sitio web. ¿Podrían ayudarme? Muchas gracias."
              );
              window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
            }}
            className="group flex items-center gap-3 px-10 py-4 border border-gold/40 text-white/70 hover:text-white hover:border-gold text-xs tracking-[0.4em] uppercase transition-all duration-500"
          >
            Tengo otra consulta
            <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
