"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
}

// Placeholders mientras no hay fotos en la BD
const PLACEHOLDERS: Item[] = [
  { id: 1, title: "Boda de Gala",        sub: "Jujuy", categoria: "Bodas",        gradient: "from-[#2a1a08] via-[#1a0f04] to-[#0d0806]" },
  { id: 2, title: "Cena Ejecutiva",      sub: "Jujuy", categoria: "Corporativos", gradient: "from-[#0a1a10] via-[#061208] to-[#040d06]" },
  { id: 3, title: "Gala de Premiación",  sub: "Jujuy", categoria: "Galas",        gradient: "from-[#1a1208] via-[#120d05] to-[#0a0804]" },
  { id: 4, title: "Fiesta de 15",        sub: "Jujuy", categoria: "Cumpleaños",   gradient: "from-[#180a1a] via-[#10061a] to-[#0b040f]" },
  { id: 5, title: "Boda en Estancia",    sub: "Jujuy", categoria: "Bodas",        gradient: "from-[#1a1408] via-[#140f05] to-[#0d0a03]" },
  { id: 6, title: "Conferencia Anual",   sub: "Jujuy", categoria: "Corporativos", gradient: "from-[#081418] via-[#050e12] to-[#03080d]" },
  { id: 7, title: "Gala Benéfica",       sub: "Jujuy", categoria: "Galas",        gradient: "from-[#1a1208] via-[#100c05] to-[#080703]" },
  { id: 8, title: "Cumpleaños VIP",      sub: "Jujuy", categoria: "Cumpleaños",   gradient: "from-[#1a0a10] via-[#12060b] to-[#0a0407]" },
  { id: 9, title: "Boda Clásica",        sub: "Jujuy", categoria: "Bodas",        gradient: "from-[#181408] via-[#100f04] to-[#0a0a03]" },
];

function toItem(g: GalleryItem, index: number): Item {
  const url = supabase.storage.from("galeria").getPublicUrl(g.storage_path).data.publicUrl;
  return {
    id:        index,
    title:     g.title,
    sub:       g.categoria,
    categoria: g.categoria as Exclude<Categoria, "Todos">,
    gradient:  "from-[#1a1208] via-[#100c05] to-[#080703]",
    imageUrl:  url,
  };
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  items, index, onClose, onPrev, onNext,
}: {
  items: Item[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all duration-200"
      >
        <X size={18} />
      </button>

      {/* Contador */}
      <span className="absolute top-6 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest">
        {index + 1} / {items.length}
      </span>

      {/* Flecha izquierda */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        disabled={!hasPrev}
        className={cn(
          "absolute left-4 sm:left-8 z-10 w-11 h-11 flex items-center justify-center border transition-all duration-200",
          hasPrev
            ? "border-white/20 text-white/60 hover:border-gold/60 hover:text-gold"
            : "border-white/5 text-white/10 cursor-not-allowed"
        )}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Foto */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-3xl mx-16 sm:mx-24"
          style={{ maxHeight: "80vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full object-contain"
              style={{ maxHeight: "75vh" }}
            />
          ) : (
            <div
              className={cn("w-full bg-gradient-to-br", item.gradient)}
              style={{ height: "420px" }}
            />
          )}

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/85 to-transparent">
            <span className="text-[10px] tracking-[0.45em] uppercase text-gold/80 block mb-1">
              {item.categoria}
            </span>
            <h3 className="text-white text-xl font-semibold" style={{ fontFamily: "var(--font-display, serif)" }}>
              {item.title}
            </h3>
          </div>

          {/* Esquinas decorativas */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-gold/25 pointer-events-none" />
          <div className="absolute bottom-[72px] right-4 w-10 h-10 border-b border-r border-gold/25 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Flecha derecha */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        disabled={!hasNext}
        className={cn(
          "absolute right-4 sm:right-8 z-10 w-11 h-11 flex items-center justify-center border transition-all duration-200",
          hasNext
            ? "border-white/20 text-white/60 hover:border-gold/60 hover:text-gold"
            : "border-white/5 text-white/10 cursor-not-allowed"
        )}
      >
        <ChevronRight size={22} />
      </button>
    </motion.div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Galeria() {
  const [filtro,    setFiltro]    = useState<Categoria>("Todos");
  const [selIndex,  setSelIndex]  = useState<number | null>(null);
  const [dbItems,   setDbItems]   = useState<Item[]>([]);

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

  const source  = dbItems.length > 0 ? dbItems : PLACEHOLDERS;
  const visible = filtro === "Todos" ? source : source.filter((i) => i.categoria === filtro);

  // Conteo por categoría
  const counts = CATEGORIAS.reduce((acc, cat) => {
    acc[cat] = cat === "Todos" ? source.length : source.filter((i) => i.categoria === cat).length;
    return acc;
  }, {} as Record<Categoria, number>);

  const openLightbox = (idx: number) => setSelIndex(idx);
  const closeLightbox = () => setSelIndex(null);

  const goPrev = useCallback(() => {
    setSelIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);

  const goNext = useCallback(() => {
    setSelIndex((i) => (i !== null && i < visible.length - 1 ? i + 1 : i));
  }, [visible.length]);

  // Navegación con teclado
  useEffect(() => {
    if (selIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selIndex, goPrev, goNext]);

  return (
    <section id="galeria" className="relative py-20 lg:py-28" style={{ background: "#0a0a0a" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10 lg:mb-14"
        >
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">Nuestro trabajo</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Cada evento,<br />
            <span className="text-gold italic">una obra</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">Más de 200 eventos realizados</p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Filtros — tabs con contador */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFiltro(cat); setSelIndex(null); }}
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-xs tracking-[0.3em] uppercase transition-all duration-300",
                filtro === cat
                  ? "bg-gold text-charcoal font-semibold"
                  : "border border-white/10 text-white/40 hover:border-gold/30 hover:text-white/70"
              )}
            >
              {cat}
              {counts[cat] > 0 && (
                <span className={cn(
                  "text-[10px] font-normal",
                  filtro === cat ? "text-charcoal/60" : "text-white/20"
                )}>
                  {counts[cat]}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Grilla de fotos */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <motion.button
                key={`${filtro}-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                onClick={() => openLightbox(i)}
                className="relative overflow-hidden group cursor-pointer aspect-square"
              >
                {/* Imagen o placeholder */}
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className={cn("absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105", item.gradient)} />
                )}

                {/* Overlay oscuro al hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400" />

                {/* Esquinas doradas */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-400" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-400" />

                {/* Info — aparece al hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-350">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-gold/80 block mb-0.5">{item.categoria}</span>
                  <p className="text-white text-sm font-semibold leading-tight" style={{ fontFamily: "var(--font-display, serif)" }}>
                    {item.title}
                  </p>
                </div>

                {/* Ícono de lupa centrado */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 border border-white/40 flex items-center justify-center text-white/80 text-lg">
                    ⊕
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => {
              const text = encodeURIComponent(
                "Buenas tardes. He visto su galería de eventos y me gustaría consultar sobre la disponibilidad de sus servicios de catering para un próximo evento. Muchas gracias."
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
        {selIndex !== null && (
          <Lightbox
            items={visible}
            index={selIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
