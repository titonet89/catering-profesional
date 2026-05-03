"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const CATEGORIAS = [
  {
    nombre: "Cristalería",
    items: [
      { nombre: "Copa de vino tinto",  precio: 250, unidad: "u." },
      { nombre: "Copa de agua",        precio: 250, unidad: "u." },
      { nombre: "Copa de champagne",   precio: 250, unidad: "u." },
      { nombre: "Vaso trago largo",    precio: 250, unidad: "u." },
    ],
  },
  {
    nombre: "Vajilla",
    items: [
      { nombre: "Plato playo",         precio: 350, unidad: "u." },
      { nombre: "Plato hondo",         precio: 350, unidad: "u." },
      { nombre: "Plato de entrada",    precio: 300, unidad: "u." },
      { nombre: "Fuente de servicio",  precio: 600, unidad: "u." },
    ],
  },
  {
    nombre: "Cubertería & Accesorios",
    items: [
      { nombre: "Set de cubiertos (3 pz)", precio: 450, unidad: "set" },
      { nombre: "Pinzas de servicio",      precio: 150, unidad: "u." },
      { nombre: "Cazuela rústica",         precio: 350, unidad: "u." },
    ],
  },
  {
    nombre: "Mantelería",
    items: [
      { nombre: "Mantel largo (mesa 10)", precio: 2000, unidad: "u." },
      { nombre: "Mantel redondo",         precio: 2200, unidad: "u." },
      { nombre: "Camino de mesa",         precio: 900,  unidad: "u." },
      { nombre: "Servilletas de tela",    precio: 200,  unidad: "u." },
      { nombre: "Cubre silla con lazo",   precio: 600,  unidad: "u." },
    ],
  },
  {
    nombre: "Decoración",
    items: [
      { nombre: "Decoración premium", precio: 150000, unidad: "evento" },
    ],
  },
];

const formatARS = (n: number) => "$ " + n.toLocaleString("es-AR");

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

export default function Alquiler() {
  const handleConsulta = () => {
    const text = encodeURIComponent(
      "Hola! Me interesa consultar por alquiler de vajilla y cristalería para un evento. ¿Pueden enviarme el catálogo completo y disponibilidad?"
    );
    window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
  };

  return (
    <section
      id="alquiler"
      className="relative py-28 lg:py-36"
      style={{ background: "#080808" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Encabezado */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            Alquiler de equipamiento
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Vajilla &amp; <br />
            <span className="text-gold italic">Cristalería</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              Equipamiento premium · Entrega y retiro incluidos
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {CATEGORIAS.map((cat, ci) => (
            <motion.div
              key={cat.nombre}
              {...fadeUp(ci * 0.08)}
              className="border border-white/6 p-7 flex flex-col gap-5 hover:border-gold/20 transition-colors duration-500"
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gold/20" />
                <h3 className="text-gold text-[10px] tracking-[0.45em] uppercase shrink-0">
                  {cat.nombre}
                </h3>
                <span className="h-px flex-1 bg-gold/20" />
              </div>

              <ul className="flex flex-col gap-3">
                {cat.items.map((item) => (
                  <li
                    key={item.nombre}
                    className="flex items-center justify-between gap-4 group"
                  >
                    <span className="flex items-center gap-2 text-white/45 text-sm group-hover:text-white/70 transition-colors duration-300">
                      <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                      {item.nombre}
                    </span>
                    <span className="text-xs text-white/25 shrink-0 group-hover:text-gold/70 transition-colors duration-300">
                      {formatARS(item.precio)}<span className="text-white/15">/{item.unidad}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Aviso + CTA */}
        <motion.div {...fadeUp(0.2)} className="flex flex-col items-center gap-6 text-center">
          <p className="text-white/25 text-xs tracking-wider max-w-md">
            Precios orientativos por unidad. Se requiere depósito de garantía y mínimo de contratación.
            Consulte disponibilidad para su fecha.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleConsulta}
              className="group flex items-center gap-3 px-10 py-4 bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs tracking-[0.4em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
            >
              Consultar disponibilidad
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <a
              href="tel:+541100000000"
              className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors duration-300 text-sm tracking-wider"
            >
              <Phone size={14} />
              O llamanos directamente
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
