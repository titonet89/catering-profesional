"use client";

import { useState, useEffect, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/lib/supabase";
import { submitReviewAction } from "@/app/actions/reviews";

// ─── Placeholders mientras no hay reseñas reales aprobadas ───────────────────

const PLACEHOLDERS = [
  { id: "p1", nombre: "Claudia Mamani",       evento: "Casamiento",        estrellas: 5, comentario: "La verdad que quedé re contra contenta!! Mis suegros no creían que iba a salir tan bien jaja y al final todos terminaron felices. La comida estuvo buenísima, el personal muy amable con todos los invitados. Gracias por hacer tan especial el día de Rodrigo y mío ❤️" },
  { id: "p2", nombre: "Roberto Alvarado",     evento: "Cena de empresa",   estrellas: 5, comentario: "Los contratamos para el cierre de año, unas 60 personas. Todo muy prolijo, llegaron puntual y lo que más me sorprendió fue la atención al detalle. Varios compañeros me preguntaron quién había organizado la comida. Los recomiendo sin dudarlo." },
  { id: "p3", nombre: "Griselda Torino",      evento: "15 años de Sofía",  estrellas: 5, comentario: "Organicé los 15 de mi hija con ellos y fue una de las mejores decisiones que tomé. Muy atentos desde el primer momento, me ayudaron con el menú porque yo no sabía bien qué pedir. Todo el salón quedó divino y los chicos del servicio re bien. Gracias totales!" },
  { id: "p4", nombre: "Diego Colque",         evento: "Cumpleaños de 50",  estrellas: 5, comentario: "Mi señora me organizó una sorpresa para mis 50 con ellos. Cuando llegué y vi todo me emocioné de verdad. La comida abundante y rica, las bebidas muy bien surtidas. Los 80 invitados se fueron contentos y varios me pidieron el contacto." },
  { id: "p5", nombre: "Lic. Fernanda Sajama", evento: "Acto institucional", estrellas: 5, comentario: "Contratamos el servicio para un acto oficial del municipio. Cumplieron en tiempo y forma con todo lo acordado, los mozos muy presentables y correctos. Para eventos del sector público donde la imagen importa, son una opción muy confiable." },
  { id: "p6", nombre: "Analía Flores",        evento: "Boda",              estrellas: 5, comentario: "Desde la primera reunión nos sentimos muy cómodos. Nos dieron varias opciones de menú según nuestro presupuesto y nunca nos presionaron. El día del evento todo salió 10 puntos. Las fotos quedaron hermosas también gracias a cómo estaban puestas las mesas." },
  { id: "p7", nombre: "Carlos Pérez Quiroga", evento: "Gala solidaria",    estrellas: 5, comentario: "Organizamos una cena benéfica y necesitábamos que todo saliera perfecto. Se portaron increíble, muy profesionales pero sin perder el trato humano. Varios de los presentes ya me consultaron el contacto para sus propios eventos. Se los recomiendo a ojos cerrados." },
];

const EVENTOS = ["Boda", "15 años", "Cumpleaños", "Corporativo / Empresa", "Gala", "Acto oficial", "Otro"];

// ─── Utilidades ───────────────────────────────────────────────────────────────

function iniciales(nombre: string) {
  return nombre.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function tiempoRelativo(fechaStr: string) {
  const diff = Date.now() - new Date(fechaStr).getTime();
  const dias = Math.floor(diff / 86400000);
  if (dias < 1)  return "hoy";
  if (dias < 7)  return `hace ${dias} día${dias > 1 ? "s" : ""}`;
  if (dias < 30) return `hace ${Math.floor(dias / 7)} semana${Math.floor(dias / 7) > 1 ? "s" : ""}`;
  if (dias < 365) return `hace ${Math.floor(dias / 30)} mes${Math.floor(dias / 30) > 1 ? "es" : ""}`;
  return `hace ${Math.floor(dias / 365)} año${Math.floor(dias / 365) > 1 ? "s" : ""}`;
}

// ─── Estrellas ────────────────────────────────────────────────────────────────

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-gold" : "text-white/10"} style={{ fontSize: 13 }}>✦</span>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={(hover || value) >= n ? "text-gold" : "text-white/15"}>✦</span>
        </button>
      ))}
    </div>
  );
}

// ─── Formulario ───────────────────────────────────────────────────────────────

function FormularioResena() {
  const [rating, setRating] = useState(5);
  const [state, action, pending] = useActionState(submitReviewAction, null);

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 flex flex-col items-center gap-4"
      >
        <span className="text-4xl">🙏</span>
        <p className="text-white font-semibold" style={{ fontFamily: "var(--font-display, serif)" }}>
          ¡Gracias por tu comentario!
        </p>
        <p className="text-white/40 text-sm max-w-sm">
          Lo revisamos y lo publicamos en las próximas horas. Tu opinión nos ayuda a seguir mejorando.
        </p>
      </motion.div>
    );
  }

  const inputCls = "w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors";

  return (
    <form action={action} className="flex flex-col gap-4 max-w-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="nombre" required placeholder="Tu nombre *" className={inputCls} />
        <input name="email" type="email" required placeholder="Tu email * (no se publica)" className={inputCls} />
      </div>
      <select name="evento" required className={`${inputCls} cursor-pointer`} defaultValue="">
        <option value="" disabled>Tipo de evento *</option>
        {EVENTOS.map((e) => <option key={e} value={e}>{e}</option>)}
      </select>

      <div className="flex flex-col gap-2">
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Tu calificación</span>
        <StarPicker value={rating} onChange={setRating} />
        <input type="hidden" name="estrellas" value={rating} />
      </div>

      <textarea
        name="comentario"
        required
        rows={4}
        placeholder="Contanos tu experiencia (mínimo 20 caracteres) *"
        className={`${inputCls} resize-none`}
      />

      {state?.error && (
        <p className="text-red-400/80 text-xs tracking-wide">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="py-3 bg-gold hover:bg-gold/90 text-charcoal font-semibold text-xs tracking-widest uppercase transition-all disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar comentario"}
      </button>
      <p className="text-white/15 text-[10px] text-center">
        Tu email no se muestra públicamente. Revisamos todos los comentarios antes de publicarlos.
      </p>
    </form>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

export default function Testimonios() {
  const [idx, setIdx] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*")
      .eq("aprobado", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data);
      });
  }, []);

  const source = reviews.length > 0 ? reviews : PLACEHOLDERS;
  const prev = () => setIdx((i) => (i - 1 + source.length) % source.length);
  const next = () => setIdx((i) => (i + 1) % source.length);
  const t = source[Math.min(idx, source.length - 1)];

  return (
    <section id="testimonios" className="relative py-28 lg:py-36 overflow-hidden" style={{ background: "#080808" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Comilla decorativa */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span className="text-[20rem] font-bold text-white/[0.018] leading-none" style={{ fontFamily: "var(--font-display, serif)" }}>"</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">

        {/* Encabezado */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">Lo que dicen</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "var(--font-display, serif)" }}>
            Voces de<br />
            <span className="text-gold italic">nuestros clientes</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">Más de 200 familias y empresas confían en nosotros</p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Carrusel */}
        <motion.div {...fadeUp(0.15)} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-8"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                <span className="text-gold font-bold text-lg" style={{ fontFamily: "var(--font-display, serif)" }}>
                  {iniciales(t.nombre)}
                </span>
              </div>

              <Estrellas n={t.estrellas} />

              <blockquote className="text-white/65 text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-display, serif)" }}>
                &ldquo;{t.comentario}&rdquo;
              </blockquote>

              <div className="flex flex-col items-center gap-1">
                <p className="text-white font-semibold tracking-wide text-sm">{t.nombre}</p>
                <p className="text-gold/60 text-xs tracking-widest uppercase">{t.evento}</p>
                {"created_at" in t && typeof t.created_at === "string" && (
                  <p className="text-white/20 text-[10px] tracking-wider mt-0.5">{tiempoRelativo(t.created_at)}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button onClick={prev} className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/40 hover:text-gold transition-all duration-300" aria-label="Anterior">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {source.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`transition-all duration-300 rounded-full ${i === idx ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Ir al testimonio ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/40 hover:text-gold transition-all duration-300" aria-label="Siguiente">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.25)} className="grid grid-cols-3 gap-px bg-white/5 mt-20">
          {[
            { valor: "200+", label: "Eventos realizados" },
            { valor: "5★",   label: "Calificación promedio" },
            { valor: "98%",  label: "Clientes que repiten" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#080808] flex flex-col items-center py-8 px-4 gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-gold" style={{ fontFamily: "var(--font-display, serif)" }}>{stat.valor}</span>
              <span className="text-white/30 text-xs tracking-widest uppercase text-center">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Sección formulario */}
        <motion.div {...fadeUp(0.3)} className="mt-20 border-t border-white/5 pt-16">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">Tu experiencia</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display, serif)" }}>
              ¿Celebraste con nosotros?
            </h3>
            <p className="text-white/35 text-sm max-w-md">
              Contanos cómo fue tu evento. Tu opinión ayuda a otras familias a elegir con confianza.
            </p>
          </div>

          {!showForm ? (
            <div className="flex justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="group flex items-center gap-3 px-10 py-4 border border-gold/30 text-white/55 hover:text-white hover:border-gold/70 text-[11px] tracking-[0.4em] uppercase transition-all duration-500"
              >
                Dejar mi comentario
                <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FormularioResena />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

      </div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
