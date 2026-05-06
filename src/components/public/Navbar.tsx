"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Inicio",      href: "#inicio"      },
  { label: "Servicios",   href: "#servicios"   },
  { label: "Presupuesto", href: "#presupuesto" },
  { label: "Alquiler",    href: "#alquiler"    },
  { label: "Galería",     href: "#galeria"     },
  { label: "Testimonios", href: "#testimonios" },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeSection] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al hacer resize a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-charcoal/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => { e.preventDefault(); handleNavClick("#inicio"); }}
            className="flex items-center gap-3 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Catering Profesional"
              className="h-14 w-auto object-contain shrink-0 transition-opacity group-hover:opacity-80"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[11px] tracking-[0.35em] text-gold uppercase font-sans font-medium transition-opacity group-hover:opacity-80">
                ✦ Eventos &amp; Gastronomía ✦
              </span>
              <span
                className="text-white text-xl tracking-[0.15em] uppercase font-display font-bold"
                style={{ fontFamily: "var(--font-display, serif)" }}
              >
                Catering Profesional
              </span>
            </div>
          </a>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "relative text-sm tracking-widest uppercase font-medium transition-colors duration-300 group",
                  activeSection === link.href.slice(1)
                    ? "text-gold"
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+5493884036629"
              className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-300 text-sm"
            >
              <Phone size={15} />
              <span className="tracking-wider">Llamanos</span>
            </a>
            <button
              onClick={() => handleNavClick("#contacto")}
              className="px-6 py-2.5 bg-gold hover:bg-gold-light text-charcoal text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
            >
              Consultar
            </button>
          </div>

          {/* Hamburger Mobile */}
          <button
            className="lg:hidden text-white p-2 rounded"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-lg flex flex-col pt-24 px-8 lg:hidden"
          >
            {/* Decorative line */}
            <div className="w-16 h-px bg-gold mb-10" />

            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-2xl font-display text-white/90 hover:text-gold transition-colors tracking-widest uppercase border-b border-white/5 pb-5"
                  style={{ fontFamily: "var(--font-display, serif)" }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <button
                onClick={() => handleNavClick("#contacto")}
                className="w-full py-4 bg-gold text-charcoal font-bold tracking-widest uppercase text-sm"
              >
                Solicitar Consulta
              </button>
            </motion.div>

            <p className="mt-auto mb-10 text-white/30 text-xs tracking-widest text-center uppercase">
              © 2025 Catering Profesional
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
