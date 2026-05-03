"use client";

import { motion } from "framer-motion";
import {
  Utensils, Coffee, Flame, Wine, Sandwich, Briefcase,
  Heart, Building2, Cake, PartyPopper, Star, Sparkles,
} from "lucide-react";

/* ── Datos ── */
const MENUS = [
  {
    icon:  Utensils,
    title: "Cena de Gala",
    desc:  "Menús de autor con servicio de mesa impecable para ocasiones únicas.",
  },
  {
    icon:  Wine,
    title: "Cocktail & Barra",
    desc:  "Barra de tragos, canapés finos y propuestas de autor para bienvenidas.",
  },
  {
    icon:  Flame,
    title: "Parrillada Premium",
    desc:  "Cortes seleccionados con preparación a la vista y acompañamientos gourmet.",
  },
  {
    icon:  Coffee,
    title: "Coffee Break",
    desc:  "Pausas sofisticadas con repostería artesanal para jornadas corporativas.",
  },
  {
    icon:  Sandwich,
    title: "Lunch & Almuerzo",
    desc:  "Propuestas frescas y completas para reuniones, conferencias y jornadas.",
  },
  {
    icon:  Briefcase,
    title: "Menú Ejecutivo",
    desc:  "Servicio ágil y refinado pensado para el ritmo del mundo corporativo.",
  },
];

const EVENTS = [
  { icon: Heart,       title: "Bodas",        tag: "La noche más especial"    },
  { icon: Building2,   title: "Corporativos",  tag: "Imagen & resultados"      },
  { icon: Cake,        title: "Cumpleaños",    tag: "Momentos únicos"          },
  { icon: PartyPopper, title: "Despedidas",    tag: "A pura celebración"       },
  { icon: Star,        title: "Aniversarios",  tag: "Cada año, más especial"   },
  { icon: Sparkles,    title: "Galas & Shows", tag: "El lujo hecho servicio"   },
];

/* ── Helpers de animación ── */
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-60px" },
};

/* ── Componentes internos ── */
function SectionHeader({ eyebrow, title, subtitle }: {
  eyebrow: string;
  title:   React.ReactNode;
  subtitle: string;
}) {
  return (
    <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
      <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
        {eyebrow}
      </span>
      <h2
        className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
        style={{ fontFamily: "var(--font-display, serif)" }}
      >
        {title}
      </h2>
      <div className="flex items-center gap-4 mt-2">
        <span className="h-px w-12 bg-gold/40" />
        <p className="text-white/40 text-sm tracking-wider">{subtitle}</p>
        <span className="h-px w-12 bg-gold/40" />
      </div>
    </motion.div>
  );
}

function MenuCard({ icon: Icon, title, desc, index }: {
  icon:  React.ElementType;
  title: string;
  desc:  string;
  index: number;
}) {
  return (
    <motion.div
      {...fadeUp(index * 0.08)}
      className="group relative flex flex-col gap-4 p-8 border border-white/5 hover:border-gold/30 transition-all duration-500 hover:bg-white/[0.02] cursor-default"
    >
      {/* Número decorativo */}
      <span
        className="absolute top-5 right-6 text-5xl font-display font-bold text-white/[0.04] select-none leading-none"
        style={{ fontFamily: "var(--font-display, serif)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Ícono */}
      <div className="w-10 h-10 flex items-center justify-center border border-gold/20 group-hover:border-gold/50 transition-colors duration-500">
        <Icon size={18} className="text-gold/70 group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
      </div>

      {/* Texto */}
      <div>
        <h3 className="text-white text-base font-semibold tracking-wide mb-2 group-hover:text-gold/90 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-white/35 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* Línea dorada inferior al hover */}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-gold/60 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}

function EventCard({ icon: Icon, title, tag, index }: {
  icon:  React.ElementType;
  title: string;
  tag:   string;
  index: number;
}) {
  return (
    <motion.div
      {...fadeUp(index * 0.07)}
      className="group flex items-center gap-5 p-6 border border-white/5 hover:border-gold/25 transition-all duration-500 hover:bg-white/[0.02] cursor-default"
    >
      <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-gold/20 group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
        <Icon size={18} className="text-gold/60 group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-white text-sm font-semibold tracking-wider uppercase mb-0.5 group-hover:text-gold/90 transition-colors duration-300">
          {title}
        </p>
        <p className="text-white/30 text-xs tracking-wide italic">{tag}</p>
      </div>
    </motion.div>
  );
}

/* ── Componente principal ── */
export default function Services() {
  return (
    <section
      id="servicios"
      className="relative py-28 lg:py-36"
      style={{ background: "#080808" }}
    >
      {/* Línea dorada superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* ── BLOQUE 1: Qué servimos ── */}
        <SectionHeader
          eyebrow="Lo que hacemos"
          title={<>Gastronomía para<br /><span className="text-gold italic">cada momento</span></>}
          subtitle="Desde una cena íntima hasta un evento de 500 personas"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 mb-24 lg:mb-32">
          {MENUS.map((s, i) => (
            <div key={s.title} className="bg-[#080808]">
              <MenuCard {...s} index={i} />
            </div>
          ))}
        </div>

        {/* ── Divisor ornamental ── */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-6 mb-24 lg:mb-32">
          <span className="flex-1 h-px bg-white/5" />
          <span className="text-gold text-xs tracking-[0.6em] uppercase">Para cada ocasión</span>
          <span className="flex-1 h-px bg-white/5" />
        </motion.div>

        {/* ── BLOQUE 2: Para qué eventos ── */}
        <SectionHeader
          eyebrow="Tipos de evento"
          title={<>Estamos en todos<br /><span className="text-gold italic">tus momentos</span></>}
          subtitle="Adaptamos cada propuesta al espíritu de tu celebración"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {EVENTS.map((e, i) => (
            <div key={e.title} className="bg-[#080808]">
              <EventCard {...e} index={i} />
            </div>
          ))}
        </div>

        {/* ── CTA final ── */}
        <motion.div {...fadeUp(0.2)} className="flex justify-center mt-16">
          <button
            onClick={() => document.querySelector("#presupuesto")?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center gap-3 px-10 py-4 border border-gold/40 text-white/70 hover:text-white hover:border-gold text-xs tracking-[0.4em] uppercase transition-all duration-500"
          >
            Armá tu presupuesto
            <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>

      {/* Línea dorada inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
