"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIOS = [
  {
    nombre: "María González",
    evento: "Boda · Diciembre 2024",
    texto:
      "Superaron todas nuestras expectativas. Desde la primera reunión entendieron exactamente lo que queríamos para nuestra boda. El servicio fue impecable, la comida espectacular y cada detalle estuvo pensado con mucho cuidado. Todos nuestros invitados siguieron hablando de la cena semanas después.",
    iniciales: "MG",
    estrellas: 5,
  },
  {
    nombre: "Lucas Martínez",
    evento: "Evento Corporativo · Noviembre 2024",
    texto:
      "Organizamos la cena anual de la empresa con 180 personas y el resultado fue extraordinario. Profesionalismo absoluto, puntualidad, y una propuesta gastronómica que elevó la imagen de nuestra compañía. Definitivamente los volvemos a contratar el año que viene.",
    iniciales: "LM",
    estrellas: 5,
  },
  {
    nombre: "Valentina Ríos",
    evento: "Festejo de 15 · Octubre 2024",
    texto:
      "Buscaba algo diferente para los 15 de mi hija y lo encontré. La decoración de mesa, el menú personalizado con sus sabores favoritos, y el trato con cada uno de los invitados fueron simplemente perfectos. Un recuerdo que va a durar toda la vida.",
    iniciales: "VR",
    estrellas: 5,
  },
  {
    nombre: "Martín Pereyra",
    evento: "Gala Benéfica · Septiembre 2024",
    texto:
      "Trabajamos con ellos para una gala solidaria de alto perfil. La coordinación fue excelente, los tiempos impecables y la presentación de los platos a la altura de los mejores restaurantes de Buenos Aires. Muchos asistentes preguntaron por su contacto.",
    iniciales: "MP",
    estrellas: 5,
  },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="text-gold text-xs">✦</span>
      ))}
    </div>
  );
}

export default function Testimonios() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIOS.length) % TESTIMONIOS.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIOS.length);
  const t = TESTIMONIOS[idx];

  return (
    <section
      id="testimonios"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Cita decorativa de fondo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[20rem] font-display font-bold text-white/[0.018] leading-none"
          style={{ fontFamily: "var(--font-display, serif)" }}
        >
          "
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">

        {/* Encabezado */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            Lo que dicen
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Voces de<br />
            <span className="text-gold italic">nuestros clientes</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              Más de 200 familias y empresas confían en nosotros
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Carrusel */}
        <motion.div {...fadeUp(0.15)} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-8"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                <span
                  className="text-gold font-display font-bold text-lg"
                  style={{ fontFamily: "var(--font-display, serif)" }}
                >
                  {t.iniciales}
                </span>
              </div>

              {/* Estrellas */}
              <Estrellas n={t.estrellas} />

              {/* Texto */}
              <blockquote
                className="text-white/65 text-lg sm:text-xl leading-relaxed max-w-2xl"
                style={{ fontFamily: "var(--font-display, serif)" }}
              >
                &ldquo;{t.texto}&rdquo;
              </blockquote>

              {/* Autor */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-white font-semibold tracking-wide text-sm">{t.nombre}</p>
                <p className="text-gold/60 text-xs tracking-widest uppercase">{t.evento}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={prev}
              className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/40 hover:text-gold transition-all duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {TESTIMONIOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === idx ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/40 hover:text-gold transition-all duration-300"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.25)}
          className="grid grid-cols-3 gap-px bg-white/5 mt-20"
        >
          {[
            { valor: "200+", label: "Eventos realizados" },
            { valor: "5★",   label: "Calificación promedio" },
            { valor: "98%",  label: "Clientes que repiten" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#080808] flex flex-col items-center py-8 px-4 gap-2"
            >
              <span
                className="text-3xl sm:text-4xl font-display font-bold text-gold"
                style={{ fontFamily: "var(--font-display, serif)" }}
              >
                {stat.valor}
              </span>
              <span className="text-white/30 text-xs tracking-widest uppercase text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
