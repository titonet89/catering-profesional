"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIOS = [
  {
    nombre: "Claudia Mamani",
    evento: "Casamiento",
    texto:
      "La verdad que quedé re contra contenta!! Mis suegros no creían que iba a salir tan bien jaja y al final todos terminaron felices. La comida estuvo buenísima, el personal muy amable con todos los invitados. Gracias por hacer tan especial el día de Rodrigo y mío ❤️",
    iniciales: "CM",
    estrellas: 5,
  },
  {
    nombre: "Roberto Alvarado",
    evento: "Cena de empresa",
    texto:
      "Los contratamos para el cierre de año, unas 60 personas. Todo muy prolijo, llegaron puntual y lo que más me sorprendió fue la atención al detalle. Varios compañeros me preguntaron quién había organizado la comida. Los recomiendo sin dudarlo.",
    iniciales: "RA",
    estrellas: 5,
  },
  {
    nombre: "Griselda Torino",
    evento: "15 años de Sofía",
    texto:
      "Organicé los 15 de mi hija con ellos y fue una de las mejores decisiones que tomé. Muy atentos desde el primer momento, me ayudaron con el menú porque yo no sabía bien qué pedir. Todo el salón quedó divino y los chicos del servicio re bien. Gracias totales!",
    iniciales: "GT",
    estrellas: 5,
  },
  {
    nombre: "Diego Colque",
    evento: "Cumpleaños de 50",
    texto:
      "Mi señora me organizó una sorpresa para mis 50 con ellos. Cuando llegué y vi todo me emocioné de verdad. La comida abundante y rica, las bebidas muy bien surtidas. Los 80 invitados se fueron contentos y varios me pidieron el contacto.",
    iniciales: "DC",
    estrellas: 5,
  },
  {
    nombre: "Lic. Fernanda Sajama",
    evento: "Acto institucional",
    texto:
      "Contratamos el servicio para un acto oficial del municipio. Cumplieron en tiempo y forma con todo lo acordado, los mozos muy presentables y correctos. Para eventos del sector público donde la imagen importa, son una opción muy confiable.",
    iniciales: "FS",
    estrellas: 5,
  },
  {
    nombre: "Analía Flores",
    evento: "Boda",
    texto:
      "Desde la primera reunión nos sentimos muy cómodos. Nos dieron varias opciones de menú según nuestro presupuesto y nunca nos presionaron. El día del evento todo salió 10 puntos. Las fotos quedaron hermosas también gracias a cómo estaban puestas las mesas.",
    iniciales: "AF",
    estrellas: 5,
  },
  {
    nombre: "Carlos Pérez Quiroga",
    evento: "Gala solidaria",
    texto:
      "Organizamos una cena benéfica y necesitábamos que todo saliera perfecto. Se portaron increíble, muy profesionales pero sin perder el trato humano. Varios de los presentes ya me consultaron el contacto para sus propios eventos. Se los recomiendo a ojos cerrados.",
    iniciales: "CP",
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
