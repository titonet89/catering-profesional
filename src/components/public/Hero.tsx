"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const containerRef              = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  /* Parallax: el contenido sube más lento que el scroll */
  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayO = useTransform(scrollYProgress, [0, 0.8], [0.55, 0.85]);

  const scrollDown = () => {
    document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" });
  };

  /* Stagger de entrada */
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18, delayChildren: 0.4 } },
  };
  const item = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } },
  };

  return (
    <section
      ref={containerRef}
      id="inicio"
      className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
    >
      {/* ── Fondo ── */}
      <div className="absolute inset-0">
        {/* Gradient base (visible si no hay video) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #120d06 0%, #1c1408 40%, #0a0a0a 70%, #06040d 100%)",
          }}
        />

        {/* Video con zoom lento */}
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoLoaded ? 1 : 0, scale: 1 }}
          animate={videoLoaded ? { scale: [1, 1.06] } : {}}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
        >
          {/* Video demo de Pexels — reemplazá por /videos/hero.mp4 cuando tengas el tuyo */}
          <source src="https://videos.pexels.com/video-files/6396011/6396011-hd_1080_1920_25fps.mp4" type="video/mp4" />
        </motion.video>

        {/* Overlay oscuro con parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayO,
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Viñeta inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Contenido con parallax ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Logo */}
          <motion.div variants={item} className="mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Catering Profesional"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Línea decorativa */}
          <motion.div
            variants={item}
            className="flex items-center gap-4 w-full max-w-xs"
          >
            <span className="flex-1 h-px bg-gold/40" />
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase">
              est. 2012
            </span>
            <span className="flex-1 h-px bg-gold/40" />
          </motion.div>

          {/* Nombre */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white tracking-wide uppercase"
            style={{ fontFamily: "var(--font-display, serif)", letterSpacing: "0.12em" }}
          >
            Catering
            <span className="block text-gold" style={{ fontStyle: "italic", letterSpacing: "0.08em" }}>
              Profesional
            </span>
          </motion.h1>

          {/* Subtítulo — tipos de eventos */}
          <motion.p
            variants={item}
            className="text-white/50 text-xs sm:text-sm tracking-[0.4em] uppercase"
          >
            Bodas&nbsp;&nbsp;·&nbsp;&nbsp;Corporativos&nbsp;&nbsp;·&nbsp;&nbsp;Galas&nbsp;&nbsp;·&nbsp;&nbsp;Cumpleaños
          </motion.p>

          {/* Botón principal */}
          <motion.div variants={item} className="mt-4">
            <button
              onClick={() => {
                document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-10 py-3.5 border border-gold/60 text-white text-xs tracking-[0.35em] uppercase hover:bg-gold/10 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">Descubrí nuestros servicios</span>
              {/* Efecto brillo al pasar el mouse */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-gold/10 to-transparent transition-transform duration-700"
              />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Flecha animada para bajar ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={scrollDown}
          className="flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors duration-300 group"
          aria-label="Scroll"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <ArrowDown size={16} strokeWidth={1.5} />
          </motion.div>
        </button>
      </div>
    </section>
  );
}
