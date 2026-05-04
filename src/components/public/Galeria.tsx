"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/supabase";

const CATEGORIAS = ["Todos", "Bodas", "Corporativos", "Galas", "Cumpleaños"] as const;
type Categoria = (typeof CATEGORIAS)[number];

interface Item {
  id: number;
  title: string;
  sub: string;
  categoria: Exclude<Categoria, "Todos">;
  gradient: string;
  imageUrl?: string;
  span?: "wide" | "tall";
}

const ITEMS: Item[] = [
  {
    id: 1,
    title: "Boda de Gala",
    sub: "Mar del Plata · Dic 2024",
    categoria: "Bodas",
    gradient: "from-[#2a1a08] via-[#1a0f04] to-[#0d0806]",
    span: "wide",
  },
  {
    id: 2,
    title: "Cena Ejecutiva",
    sub: "Buenos Aires · Nov 2024",
    categoria: "Corporativos",
    gradient: "from-[#0a1a10] via-[#061208] to-[#040d06]",
  },
  {
    id: 3,
    title: "Gala de Premiación",
    sub: "CABA · Oct 2024",
    categoria: "Galas",
    gradient: "from-[#1a1208] via-[#120d05] to-[#0a0804]",
    span: "tall",
  },
  {
    id: 4,
    title: "Fiesta de 15",
    sub: "San Isidro · Sep 2024",
    categoria: "Cumpleaños",
    gradient: "from-[#180a1a] via-[#10061a] to-[#0b040f]",
  },
  {
    id: 5,
    title: "Boda en Estancia",
    sub: "Pilar · Ago 2024",
    categoria: "Bodas",
    gradient: "from-[#1a1408] via-[#140f05] to-[#0d0a03]",
  },
  {
    id: 6,
    title: "Conferencia Anual",
    sub: "Puerto Madero · Jul 2024",
    categoria: "Corporativos",
    gradient: "from-[#081418] via-[#050e12] to-[#03080d]",
    span: "wide",
  },
  {
    id: 7,
    title: "Gala Benéfica",
    sub: "Palermo · Jun 2024",
    categoria: "Galas",
    gradient: "from-[#1a1208] via-[#100c05] to-[#080703]",
  },
  {
    id: 8,
    title: "Cumpleaños VIP",
    sub: "Nordelta · May 2024",
    categoria: "Cumpleaños",
    gradient: "from-[#1a0a10] via-[#12060b] to-[#0a0407]",
  },
  {
    id: 9,
    title: "Boda Clásica",
    sub: "Recoleta · Abr 2024",
    categoria: "Bodas",
    gradient: "from-[#181408] via-[#100f04] to-[#0a0a03]",
    span: "tall",
  },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

function toItem(g: GalleryItem, index: number): Item {
  const url = supabase.storage.from("galeria").getPublicUrl(g.storage_path).data.publicUrl;
  const spansWide: number[] = [0, 5];
  const spansTall: number[] = [2, 8];
  return {
    id:        index,
    title:     g.title,
    sub:       g.categoria,
    categoria: g.categoria as Exclude<Categoria, "Todos">,
    gradient:  "from-[#1a1208] via-[#100c05] to-[#080703]",
    imageUrl:  url,
    span:      spansWide.includes(index) ? "wide" : spansTall.includes(index) ? "tall" : undefined,
  };
}

export default function Galeria() {
  const [filtro, setFiltro]   = useState<Categoria>("Todos");
  const [selected, setSelected] = useState<Item | null>(null);
  const [dbItems, setDbItems] = useState<Item[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setDbItems(data.map(toItem));
      });
  }, []);

  const source  = dbItems.length > 0 ? dbItems : ITEMS;
  const visible = filtro === "Todos" ? source : source.filter((i) => i.categoria === filtro);

  return (
    <section
      id="galeria"
      className="relative py-28 lg:py-36"
      style={{ background: "#0a0a0a" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Encabezado */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            Nuestro trabajo
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Cada evento,<br />
            <span className="text-gold italic">una obra</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              Más de 200 eventos realizados
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={cn(
                "px-6 py-2 text-xs tracking-[0.35em] uppercase transition-all duration-300",
                filtro === cat
                  ? "bg-gold text-charcoal font-semibold"
                  : "border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid masonry */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                onClick={() => setSelected(item)}
                className={cn(
                  "relative overflow-hidden group cursor-pointer text-left",
                  item.span === "wide"  && "col-span-2",
                  item.span === "tall"  && "row-span-2",
                )}
                style={{ minHeight: item.span === "tall" ? "440px" : "220px" }}
              >
                {/* Imagen real o degradado placeholder */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className={cn("absolute inset-0 bg-gradient-to-br", item.gradient)} />
                )}

                {/* Patrón decorativo (solo en placeholders) */}
                {!item.imageUrl && (
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(201,168,76,0.08) 0%, transparent 50%)"
                    }}
                  />
                )}

                {/* Líneas decorativas */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/20 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/20 group-hover:border-gold/50 transition-colors duration-500" />

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Tag de categoría */}
                <span className="absolute top-5 right-5 text-[9px] tracking-[0.4em] uppercase text-gold/50 group-hover:text-gold/80 transition-colors duration-300">
                  {item.categoria}
                </span>

                {/* Texto inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-white text-base font-display font-semibold leading-tight mb-1"
                    style={{ fontFamily: "var(--font-display, serif)" }}>
                    {item.title}
                  </p>
                  <p className="text-white/40 text-xs tracking-wider">{item.sub}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.2)} className="flex justify-center mt-14">
          <button
            onClick={() => {
              const text = encodeURIComponent(
                "Buenas tardes. He visto su galería de eventos en el sitio web y me gustaría consultar sobre la disponibilidad de sus servicios de catering para un próximo evento. Quedo a la espera de su respuesta. Muchas gracias."
              );
              window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
            }}
            className="group flex items-center gap-3 px-10 py-4 border border-gold/40 text-white/70 hover:text-white hover:border-gold text-xs tracking-[0.4em] uppercase transition-all duration-500"
          >
            Quiero un evento así
            <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl overflow-hidden"
              style={{ height: "420px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <div className={cn("absolute inset-0 bg-gradient-to-br", selected.gradient)} />
                  <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.3) 0%, transparent 60%)" }}
                  />
                </>
              )}
              <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/30" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/30" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent">
                <span className="text-[10px] tracking-[0.45em] uppercase text-gold mb-3 block">
                  {selected.categoria}
                </span>
                <h3 className="text-white text-3xl font-display font-bold mb-2"
                  style={{ fontFamily: "var(--font-display, serif)" }}>
                  {selected.title}
                </h3>
                <p className="text-white/40 text-sm tracking-wider">{selected.sub}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
