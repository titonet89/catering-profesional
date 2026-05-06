"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.65, delay, ease: "easeOut" as const },
});

const CONTACTOS = [
  {
    icon: Phone,
    label: "Teléfono / WhatsApp",
    valor: "+54 388 403-6629",
    href: "tel:+5493884036629",
  },
  {
    icon: Mail,
    label: "Email",
    valor: "cateringprofesionaljujuy@gmail.com",
    href: "mailto:cateringprofesionaljujuy@gmail.com",
  },
  {
    icon: MapPin,
    label: "Dirección",
    valor: "Av. Eva Perón N° 2278 B° San Pedrito · Jujuy",
    href: null,
  },
];

interface FormState {
  nombre: string;
  email: string;
  evento: string;
  mensaje: string;
}

export default function Contacto() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    evento: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("ok");

    const text = encodeURIComponent(
      `Buenas tardes. Me comunico a través del formulario de contacto de su sitio web con el siguiente detalle:\n\n` +
      `• Nombre: ${form.nombre}\n` +
      `• Email: ${form.email}\n` +
      `• Tipo de evento: ${form.evento || "Sin especificar"}\n` +
      `• Mensaje: ${form.mensaje}\n\n` +
      `Quedo a la espera de su respuesta. Muchas gracias.`
    );
    window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");

    setForm({ nombre: "", email: "", evento: "", mensaje: "" });
    setTimeout(() => setStatus("idle"), 5000);
  };

  const inputClass =
    "w-full bg-transparent border border-white/8 px-5 py-3.5 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors duration-300";

  return (
    <>
      {/* ── SECCIÓN CONTACTO ── */}
      <section
        id="contacto"
        className="relative py-28 lg:py-36"
        style={{ background: "#0d0d0d" }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          {/* Encabezado */}
          <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center mb-16 lg:mb-20">
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
              Hablemos
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-display, serif)" }}
            >
              Empecemos a<br />
              <span className="text-gold italic">planear tu evento</span>
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="h-px w-12 bg-gold/30" />
              <p className="text-white/35 text-sm tracking-wider">
                Jujuy · NOA · Respondemos en menos de 24 horas
              </p>
              <span className="h-px w-12 bg-gold/30" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Columna izquierda: info */}
            <motion.div {...fadeUp(0.1)} className="flex flex-col gap-10">
              {/* Datos de contacto */}
              <div className="flex flex-col gap-6">
                {CONTACTOS.map(({ icon: Icon, label, valor, href }) => (
                  <div key={label} className="flex items-start gap-5 group">
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-gold/20 group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                      <Icon size={16} className="text-gold/60 group-hover:text-gold transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="text-white/70 hover:text-gold transition-colors duration-300 text-sm tracking-wide">
                          {valor}
                        </a>
                      ) : (
                        <p className="text-white/70 text-sm tracking-wide">{valor}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Horario */}
              <div className="border border-white/6 p-7">
                <p className="text-gold text-[10px] tracking-[0.45em] uppercase mb-5">Horario de atención</p>
                <div className="flex flex-col gap-3">
                  {[
                    { dia: "Lunes a Viernes", hora: "9:00 — 18:00" },
                    { dia: "Sábados",         hora: "9:00 — 14:00" },
                    { dia: "Domingos",        hora: "Cerrado" },
                  ].map(({ dia, hora }) => (
                    <div key={dia} className="flex justify-between items-center">
                      <span className="text-white/40 text-sm">{dia}</span>
                      <span className={`text-sm ${hora === "Cerrado" ? "text-white/20 italic" : "text-white/65"}`}>
                        {hora}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapa */}
              <div className="border border-white/6 overflow-hidden" style={{ height: "200px" }}>
                <iframe
                  title="Ubicación Catering Profesional"
                  src="https://maps.google.com/maps?q=Av+Eva+Perón+2278+San+Salvador+de+Jujuy+Argentina&output=embed&z=15"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(0.85)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Redes */}
              <div className="flex flex-col gap-4">
                <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase">Seguinos</p>
                <div className="flex gap-3">
                  {/* Instagram */}
                  <a href="#" aria-label="Instagram"
                    className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/30 hover:text-gold transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://www.facebook.com/cateringprofesionaljujuy" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/30 hover:text-gold transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/5493884036629"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-11 h-11 flex items-center justify-center border border-white/10 hover:border-green-500/50 text-white/30 hover:text-green-400 transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Columna derecha: formulario */}
            <motion.div {...fadeUp(0.2)}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Su nombre completo"
                    required
                    disabled={status === "loading" || status === "ok"}
                    className={inputClass}
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Su correo electrónico"
                    required
                    disabled={status === "loading" || status === "ok"}
                    className={inputClass}
                  />
                </div>

                <select
                  name="evento"
                  value={form.evento}
                  onChange={handleChange}
                  disabled={status === "loading" || status === "ok"}
                  className={inputClass + " cursor-pointer"}
                >
                  <option value="" disabled>Tipo de evento</option>
                  <option value="Boda">Boda</option>
                  <option value="Corporativo">Evento corporativo</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Gala">Gala / Show</option>
                  <option value="Aniversario">Aniversario</option>
                  <option value="Otro">Otro</option>
                </select>

                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntenos sobre su evento: fecha aproximada, cantidad de invitados, lugar del evento y cualquier detalle que desee compartir..."
                  rows={5}
                  disabled={status === "loading" || status === "ok"}
                  className={inputClass + " resize-none"}
                />

                {status === "ok" && (
                  <div className="flex items-center gap-3 px-5 py-3 border border-green-500/30 bg-green-500/5 text-green-400 text-sm">
                    <CheckCircle size={16} />
                    ¡Muchas gracias por comunicarse! Su consulta fue recibida. Lo redirigimos a WhatsApp.
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center gap-3 px-5 py-3 border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    Disculpe el inconveniente. Por favor intente nuevamente o contáctenos directamente.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || status === "ok"}
                  className="group flex items-center justify-center gap-3 w-full py-4 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={15} strokeWidth={2} />
                  {status === "loading" ? "Enviando consulta..." : "Enviar por WhatsApp"}
                  {status === "idle" && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
                </button>

                <p className="text-white/20 text-[11px] text-center tracking-wide">
                  Su consulta quedará registrada y será contactado a la brevedad
                </p>
              </form>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#080808" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Logo */}
            <div className="flex flex-col items-center md:items-start leading-none">
              <span className="text-[10px] tracking-[0.35em] text-gold uppercase font-sans font-medium">
                ✦ Eventos &amp; Gastronomía ✦
              </span>
              <span
                className="text-white text-lg tracking-[0.15em] uppercase font-display font-bold mt-0.5"
                style={{ fontFamily: "var(--font-display, serif)" }}
              >
                Catering Profesional
              </span>
            </div>

            {/* Links rápidos */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {[
                ["Servicios",   "#servicios"  ],
                ["Presupuesto", "#presupuesto"],
                ["Alquiler",    "#alquiler"   ],
                ["Galería",     "#galeria"    ],
                ["Contacto",    "#contacto"   ],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="text-white/30 hover:text-gold transition-colors duration-300 text-xs tracking-widest uppercase"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <p className="text-white/20 text-xs tracking-widest text-center md:text-right">
              © {new Date().getFullYear()} Catering Profesional.<br className="hidden md:block" />
              <span className="hidden md:inline"> </span>Todos los derechos reservados.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-white/10 text-[10px] tracking-[0.3em] uppercase">
              Jujuy · NOA · Argentina
            </p>
            <a
              href="http://qr.afip.gob.ar/?qr=V5rn39ln7Fw-TNLzgOZd6g,,"
              target="_F960AFIPInfo"
              rel="noopener noreferrer"
              title="Datos Fiscales - AFIP"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg"
                alt="Data Fiscal AFIP"
                style={{ height: "110px", width: "auto" }}
                className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
