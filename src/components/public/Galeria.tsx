"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/supabase";

const CATEGORIAS = ["Todos", "Bodas", "Corporativos", "Galas", "Cumpleaños", "15 Años", "Decoraciones", "Detrás de escena"] as const;
type Categoria = (typeof CATEGORIAS)[number];

interface Item {
  id: string | number;
  title: string;
  categoria: Exclude<Categoria, "Todos">;
  imageUrl?: string;
  gradient: string;
  placeholderH: number;
}

const PLACEHOLDERS: Item[] = [
  { id: "p1", title: "Boda de Gala",       categoria: "Bodas",        gradient: "from-[#2a1a08] via-[#1a0f04] to-[#0d0806]", placeholderH: 340 },
  { id: "p2", title: "Cena Ejecutiva",     categoria: "Corporativos", gradient: "from-[#0a1a10] via-[#061208] to-[#040d06]", placeholderH: 240 },
  { id: "p3", title: "Gala de Premiación", categoria: "Galas",        gradient: "from-[#1a1208] via-[#120d05] to-[#0a0804]", placeholderH: 290 },
  { id: "p4", title: "Quinceañera",        categoria: "15 Años",      gradient: "from-[#180a1a] via-[#10061a] to-[#0b040f]", placeholderH: 370 },
  { id: "p5", title: "Boda en Estancia",   categoria: "Bodas",        gradient: "from-[#1a1408] via-[#140f05] to-[#0d0a03]", placeholderH: 260 },
  { id: "p6", title: "Conferencia Anual",  categoria: "Corporativos", gradient: "from-[#081418] via-[#050e12] to-[#03080d]", placeholderH: 310 },
  { id: "p7", title: "Gala Benéfica",      categoria: "Galas",        gradient: "from-[#1a1208] via-[#100c05] to-[#080703]", placeholderH: 220 },
  { id: "p8", title: "Cumpleaños VIP",     categoria: "Cumpleaños",   gradient: "from-[#1a0a10] via-[#12060b] to-[#0a0407]", placeholderH: 350 },
  { id: "p9", title: "Decoración floral",  categoria: "Decoraciones", gradient: "from-[#081a05] via-[#051203] to-[#030802]", placeholderH: 270 },
];

function toItem(g: GalleryItem, index: number): Item {
  const url = supabase.storage.from("galeria").getPublicUrl(g.storage_path).data.publicUrl;
  return {
    id: g.id,
    title: g.title,
    categoria: g.categoria as Exclude<Categoria, "Todos">,
    gradient: "from-[#1a1208] via-[#100c05] to-[#080703]",
    imageUrl: url,
    placeholderH: 280,
  };
}

// ─── Lightbox fullscreen ───────────────────────────────────────────────────────

function Lightbox({ items, index, onClose, onGoTo }: {
  items: Item[];
  index: number;
  onClose: () => void;
  onGoTo: (i: number) => void;
}) {
  const item = items[index];
  const touchStartX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const onPrev = () => index > 0 && onGoTo(index - 1);
  const onNext = () => index < items.length - 1 && onGoTo(index + 1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) dx < 0 ? onNext() : onPrev();
    touchStartX.current = null;
  };

  // Auto-scroll thumbnails strip to keep current visible
  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip) return;
    const thumb = strip.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col select-none"
      style={{ background: "#030303" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b border-white/5">
        <span className="text-[10px] tracking-[0.5em] uppercase text-gold/60">{item.categoria}</span>
        <span className="text-white/20 text-[11px] tracking-[0.3em]">{index + 1} / {items.length}</span>
        <button
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-hidden">
        {/* Prev */}
        <button
          onClick={onPrev}
          className={cn(
            "absolute left-3 sm:left-6 z-10 w-11 h-11 flex items-center justify-center border transition-all duration-200",
            index > 0
              ? "border-white/15 text-white/50 hover:border-gold/50 hover:text-gold"
              : "opacity-0 pointer-events-none"
          )}
        >
          <ChevronLeft size={20} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center px-14 sm:px-24"
          >
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.title}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: "calc(100vh - 180px)" }}
                draggable={false}
              />
            ) : (
              <div
                className={cn("w-full max-w-2xl bg-gradient-to-br", item.gradient)}
                style={{ height: 400 }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next */}
        <button
          onClick={onNext}
          className={cn(
            "absolute right-3 sm:right-6 z-10 w-11 h-11 flex items-center justify-center border transition-all duration-200",
            index < items.length - 1
              ? "border-white/15 text-white/50 hover:border-gold/50 hover:text-gold"
              : "opacity-0 pointer-events-none"
          )}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom: title + thumbnails */}
      <div className="shrink-0 border-t border-white/5 pt-3 pb-4">
        <p
          className="text-white/85 text-sm text-center mb-3 px-6"
          style={{ fontFamily: "var(--font-display, serif)" }}
        >
          {item.title}
        </p>
        {/* Thumbnail strip */}
        <div
          ref={thumbsRef}
          className="flex gap-1.5 overflow-x-auto px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((t, i) => (
            <button
              key={t.id}
              onClick={() => onGoTo(i)}
              className={cn(
                "shrink-0 w-12 h-12 overflow-hidden border-2 transition-all duration-200",
                i === index
                  ? "border-gold/80 opacity-100"
                  : "border-transparent opacity-25 hover:opacity-55"
              )}
            >
              {t.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.imageUrl} alt="" className="w-full h-full object-cover" draggable={false} />
              ) : (
                <div className={cn("w-full h-full bg-gradient-to-br", t.gradient)} />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tarjeta masonry individual ───────────────────────────────────────────────

function MasonryCard({ item, index, onClick }: {
  item: Item;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.35), ease: "easeOut" }}
      className="break-inside-avoid mb-2.5 sm:mb-3 relative group cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Imagen o placeholder */}
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
          draggable={false}
        />
      ) : (
        <div
          className={cn("w-full bg-gradient-to-br", item.gradient)}
          style={{ height: item.placeholderH }}
        />
      )}

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/48 transition-colors duration-400" />

      {/* Esquinas doradas */}
      <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-gold/0 group-hover:border-gold/55 transition-all duration-400 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-gold/0 group-hover:border-gold/55 transition-all duration-400 pointer-events-none" />

      {/* Info desde abajo */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        <span className="text-[9px] tracking-[0.4em] uppercase text-gold/80 block mb-0.5">
          {item.categoria}
        </span>
        <p className="text-white text-sm font-semibold leading-snug" style={{ fontFamily: "var(--font-display, serif)" }}>
          {item.title}
        </p>
      </div>

      {/* Ícono zoom centrado */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/70 bg-black/20 backdrop-blur-sm">
          <ZoomIn size={17} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Galeria() {
  const [filtro, setFiltro]     = useState<Categoria>("Todos");
  const [selIndex, setSelIndex] = useState<number | null>(null);
  const [dbItems, setDbItems]   = useState<Item[]>([]);

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

  const counts = CATEGORIAS.reduce((acc, cat) => {
    acc[cat] = cat === "Todos" ? source.length : source.filter((i) => i.categoria === cat).length;
    return acc;
  }, {} as Record<Categoria, number>);

  const closeLightbox = () => setSelIndex(null);
  const goTo = useCallback((i: number) => setSelIndex(i), []);

  useEffect(() => {
    if (selIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft"  && selIndex > 0)                    goTo(selIndex - 1);
      if (e.key === "ArrowRight" && selIndex < visible.length - 1)   goTo(selIndex + 1);
      if (e.key === "Escape")                                         closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selIndex, visible.length, goTo]);

  return (
    <section id="galeria" className="relative py-20 lg:py-28" style={{ background: "#080808" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">Nuestro trabajo</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
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

        {/* Filtros con subrayado animado */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-x-1 gap-y-2 mb-10"
        >
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFiltro(cat); setSelIndex(null); }}
              className={cn(
                "relative px-4 py-2.5 min-h-[44px] text-[11px] tracking-[0.3em] uppercase transition-all duration-300",
                filtro === cat ? "text-gold" : "text-white/30 hover:text-white/60"
              )}
            >
              {cat}
              {counts[cat] > 0 && (
                <span className={cn("ml-1 text-[9px]", filtro === cat ? "text-gold/50" : "text-white/15")}>
                  {counts[cat]}
                </span>
              )}
              {filtro === cat && (
                <motion.span
                  layoutId="underline"
                  className="absolute inset-x-4 -bottom-0.5 h-px bg-gold"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filtro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-x-3"
          >
            {visible.map((item, i) => (
              <MasonryCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => setSelIndex(i)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Estado vacío */}
        {visible.length === 0 && (
          <p className="text-center text-white/20 text-sm py-20 tracking-wider">
            No hay fotos en esta categoría aún
          </p>
        )}

        {/* CTA WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-14"
        >
          <button
            onClick={() => {
              const text = encodeURIComponent(
                "Buenas tardes. He visto su galería de eventos y me gustaría consultar sobre la disponibilidad de sus servicios de catering para un próximo evento. Muchas gracias."
              );
              window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
            }}
            className="group flex items-center gap-3 px-10 py-4 border border-gold/30 text-white/55 hover:text-white hover:border-gold/70 text-[11px] tracking-[0.4em] uppercase transition-all duration-500"
          >
            Quiero un evento así
            <span className="text-gold transition-transform duration-300 group-hover:translate-x-1.5">→</span>
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
            onGoTo={goTo}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
