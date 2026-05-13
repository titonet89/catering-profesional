"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Building2, Cake, PartyPopper, Star, Sparkles,
  Users, Check, ChevronUp, ChevronDown, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   DATOS — El administrador puede modificar estos
   valores desde el panel de administración
═══════════════════════════════════════════════ */

const EVENT_TYPES = [
  { id: "boda",        label: "Boda",         icon: Heart       },
  { id: "corporativo", label: "Corporativo",   icon: Building2   },
  { id: "cumple",      label: "Cumpleaños",    icon: Cake        },
  { id: "despedida",   label: "Despedida",     icon: PartyPopper },
  { id: "aniversario", label: "Aniversario",   icon: Star        },
  { id: "gala",        label: "Gala / Show",   icon: Sparkles    },
];

const PACKAGES = [
  {
    id:             "basico",
    name:           "Básico",
    pricePerPerson: 59900,
    tag:            "Lo esencial",
    color:          "border-white/10",
    includes:       [
      "Sándwiches y empanadas caseros",
      "Bebidas sin alcohol",
      "Servicio de mesa",
      "Vajilla estándar",
    ],
  },
  {
    id:             "clasico",
    name:           "Clásico",
    pricePerPerson: 79900,
    tag:            "El más elegido",
    color:          "border-white/10",
    includes:       [
      "Entrada + plato principal + postre",
      "Variedad de opciones por plato",
      "Bebidas con y sin alcohol",
      "Servicio de mesa completo",
    ],
  },
  {
    id:             "premium",
    name:           "Premium",
    pricePerPerson: 99900,
    tag:            "Recomendado",
    color:          "border-gold/50",
    featured:       true,
    includes:       [
      "Lunch completo: entrada caliente, principal y postre",
      "Dos opciones de menú por plato",
      "Open bar incluido",
      "Servicio de camareros",
      "Vajilla premium",
    ],
  },
  {
    id:             "lunch",
    name:           "Lunch",
    pricePerPerson: 109900,
    tag:            "Variedad y distinción",
    color:          "border-white/10",
    includes:       [
      "Variedad amplia de platos y guarniciones",
      "Múltiples opciones de menú por plato",
      "Open bar completo",
      "Servicio de camareros",
      "Vajilla exclusiva",
      "Ambientación de mesa incluida",
    ],
  },
  {
    id:             "gala",
    name:           "Gala",
    pricePerPerson: 119900,
    tag:            "La experiencia total",
    color:          "border-white/10",
    includes:       [
      "Menú elaborado especial (a coordinar)",
      "Selección gastronómica completa",
      "Open bar premium",
      "Servicio de camareros con protocolo",
      "Vajilla exclusiva",
      "Decoración completa incluida",
    ],
  },
];

const EXTRAS: {
  category: string;
  items: { id: string; label: string; perPerson?: number; fixed?: number }[];
}[] = [
  {
    category: "Gastronomía",
    items: [
      { id: "entrada_extra",   label: "Entrada gourmet adicional",  perPerson: 8000 },
      { id: "mesa_dulces",     label: "Mesa de dulces & postres",   perPerson: 9000 },
      { id: "quesos",          label: "Tabla de quesos & fiambres", perPerson: 9000 },
    ],
  },
  {
    category: "Bebidas",
    items: [
      { id: "open_bar_premium",  label: "Upgrade open bar premium",       perPerson: 12000 },
      { id: "barra_tematica",    label: "Barra de tragos temática",        perPerson: 9000  },
      { id: "espumante",         label: "Brindis con espumante premium",   perPerson: 4000  },
      { id: "barra_premium",     label: "Bebidas de barra premium",        perPerson: 9000  },
    ],
  },
  {
    category: "Servicios adicionales",
    items: [
      { id: "sommelier",         label: "Servicio de sommelier",      perPerson: 4500  },
      { id: "ilum_premium",      label: "Iluminación premium",        fixed: 250000    },
      { id: "decoracion_floral", label: "Decoración floral premium",  fixed: 450000    },
      { id: "iluminacion",       label: "Iluminación especial",       fixed: 150000    },
      { id: "fotos_360",         label: "Fotos 360°",                 fixed: 150000    },
      { id: "fotocabina",        label: "Fotocabina",                 fixed: 200000    },
    ],
  },
];

/* ═══════════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════════ */
interface Config {
  eventType: string | null;
  guests:    number;
  package:   string | null;
  extras:    string[];
}

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const formatARS = (n: number) =>
  "$ " + Math.round(n).toLocaleString("es-AR");

function calcTotal(config: Config): number | null {
  if (!config.package) return null;
  const pkg = PACKAGES.find((p) => p.id === config.package)!;
  let total = pkg.pricePerPerson * config.guests;
  for (const id of config.extras) {
    for (const group of EXTRAS) {
      const extra = group.items.find((e) => e.id === id);
      if (extra) {
        total += extra.perPerson ? extra.perPerson * config.guests : (extra.fixed ?? 0);
      }
    }
  }
  return total;
}

const fadeUp = {
  initial:    { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/* ═══════════════════════════════════════════════
   SUB-COMPONENTES
═══════════════════════════════════════════════ */

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-7 h-7 rounded-full border border-gold/50 text-gold text-xs font-bold shrink-0">
        {n}
      </span>
      <span className="text-white/50 text-xs tracking-[0.35em] uppercase">{label}</span>
    </div>
  );
}

function GuestCounter({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const step = (dir: 1 | -1) => {
    const next = value + dir * 10;
    onChange(Math.min(500, Math.max(10, next)));
  };

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={() => step(-1)}
        className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/50 hover:text-gold transition-all duration-300"
      >
        <ChevronDown size={16} />
      </button>

      <div className="flex items-end gap-2">
        <motion.span
          key={value}
          initial={{ opacity: 0.4, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-5xl font-display font-bold text-white"
          style={{ fontFamily: "var(--font-display, serif)" }}
        >
          {value}
        </motion.span>
        <span className="text-white/30 text-sm pb-2 tracking-widest uppercase">personas</span>
      </div>

      <button
        onClick={() => step(1)}
        className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-gold/40 text-white/50 hover:text-gold transition-all duration-300"
      >
        <ChevronUp size={16} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
export default function BudgetBuilder() {
  const [config, setConfig] = useState<Config>({
    eventType: null,
    guests:    50,
    package:   null,
    extras:    [],
  });

  const total = calcTotal(config);

  const toggleExtra = (id: string) =>
    setConfig((c) => ({
      ...c,
      extras: c.extras.includes(id)
        ? c.extras.filter((e) => e !== id)
        : [...c.extras, id],
    }));

  const handleWhatsApp = () => {
    const pkg   = PACKAGES.find((p) => p.id === config.package);
    const event = EVENT_TYPES.find((e) => e.id === config.eventType);
    const extraNames = config.extras.flatMap((id) =>
      EXTRAS.flatMap((g) => g.items.filter((e) => e.id === id).map((e) => e.label))
    );
    const text = encodeURIComponent(
      `Buenas tardes. Me comunico desde su sitio web con el siguiente presupuesto orientativo elaborado en su calculador:\n\n` +
      `• Tipo de evento: ${event?.label ?? "Sin especificar"}\n` +
      `• Cantidad de invitados: ${config.guests} personas\n` +
      `• Paquete seleccionado: ${pkg?.name ?? "Sin seleccionar"}\n` +
      (extraNames.length ? `• Servicios adicionales: ${extraNames.join(", ")}\n` : "") +
      (total ? `• Total estimado: ${formatARS(total)}\n` : "") +
      `\nQuedo a su disposición para coordinar una consulta y confirmar disponibilidad. Muchas gracias.`
    );
    window.open(`https://wa.me/5493884036629?text=${text}`, "_blank");
  };

  return (
    <section
      id="presupuesto"
      className="relative py-28 lg:py-36"
      style={{ background: "#0d0d0d" }}
    >
      {/* Gradiente sutil de transición desde Services */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Encabezado */}
        <motion.div {...fadeUp} className="flex flex-col items-center text-center mb-16">
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
            Calculador de costos
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, serif)" }}
          >
            Armá tu<br />
            <span className="text-gold italic">presupuesto</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="h-px w-12 bg-gold/30" />
            <p className="text-white/35 text-sm tracking-wider">
              Estimado en tiempo real · Sin compromiso
            </p>
            <span className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>

        {/* Layout principal: opciones + resumen */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Columna izquierda: opciones ── */}
          <div className="flex-1 flex flex-col gap-12">

            {/* PASO 1: Tipo de evento */}
            <motion.div {...fadeUp}>
              <StepLabel n={1} label="Tipo de evento" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EVENT_TYPES.map(({ id, label, icon: Icon }) => {
                  const active = config.eventType === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setConfig((c) => ({ ...c, eventType: id }))}
                      className={cn(
                        "flex flex-col items-center gap-2 py-5 px-3 border transition-all duration-300 text-center group",
                        active
                          ? "border-gold bg-gold/5 text-gold"
                          : "border-white/8 hover:border-white/20 text-white/40 hover:text-white/70"
                      )}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className={cn(
                          "transition-colors duration-300",
                          active ? "text-gold" : "text-white/30 group-hover:text-white/60"
                        )}
                      />
                      <span className="text-xs tracking-widest uppercase leading-tight">
                        {label}
                      </span>
                      {active && (
                        <motion.span
                          layoutId="event-check"
                          className="w-4 h-4 rounded-full bg-gold flex items-center justify-center"
                        >
                          <Check size={9} className="text-charcoal" strokeWidth={3} />
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* PASO 2: Cantidad de personas */}
            <motion.div {...fadeUp}>
              <StepLabel n={2} label="Cantidad de invitados" />
              <div className="flex flex-col gap-4">
                <GuestCounter
                  value={config.guests}
                  onChange={(v) => setConfig((c) => ({ ...c, guests: v }))}
                />
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={config.guests}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, guests: Number(e.target.value) }))
                  }
                  className="w-full max-w-sm accent-gold cursor-pointer"
                />
                <div className="flex justify-between text-white/20 text-xs max-w-sm">
                  <span>10</span><span>250</span><span>500</span>
                </div>
              </div>
            </motion.div>

            {/* PASO 3: Paquete de menú */}
            <motion.div {...fadeUp}>
              <StepLabel n={3} label="Elegí tu menú base" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PACKAGES.map((pkg, index) => {
                  const active = config.package === pkg.id;
                  const isLastOdd = index === PACKAGES.length - 1 && PACKAGES.length % 2 !== 0;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setConfig((c) => ({ ...c, package: pkg.id }))}
                      className={cn(
                        "relative flex flex-col text-left p-6 border transition-all duration-300",
                        active
                          ? "border-gold bg-gold/5"
                          : "border-white/8 hover:border-white/20",
                        pkg.featured && !active && "border-gold/25",
                        isLastOdd && "sm:col-span-2 sm:max-w-sm sm:mx-auto sm:w-full lg:col-span-1 lg:max-w-none lg:mx-0"
                      )}
                    >
                      {pkg.featured && (
                        <span className="absolute -top-px left-4 px-3 py-0.5 bg-gold text-charcoal text-[10px] font-bold tracking-widest uppercase">
                          Recomendado
                        </span>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className={cn(
                            "font-display font-bold text-xl",
                            active ? "text-gold" : "text-white"
                          )}
                            style={{ fontFamily: "var(--font-display, serif)" }}>
                            {pkg.name}
                          </p>
                          <p className="text-white/30 text-xs tracking-wider mt-0.5">{pkg.tag}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-lg font-bold",
                            active ? "text-gold" : "text-white/70"
                          )}>
                            {formatARS(pkg.pricePerPerson)}
                          </p>
                          <p className="text-white/25 text-[11px]">por persona</p>
                        </div>
                      </div>

                      <ul className="flex flex-col gap-1.5 mt-2">
                        {pkg.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-white/35 text-xs">
                            <span className="text-gold/60 mt-0.5 shrink-0">✦</span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      {active && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                          <Check size={10} className="text-charcoal" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* PASO 4: Extras */}
            <motion.div {...fadeUp}>
              <StepLabel n={4} label="Personalizá tu evento" />
              <div className="flex flex-col gap-8">
                {EXTRAS.map((group) => (
                  <div key={group.category}>
                    <p className="text-white/25 text-[10px] tracking-[0.4em] uppercase mb-3">
                      {group.category}
                    </p>
                    <div className="flex flex-col gap-2">
                      {group.items.map((extra) => {
                        const checked = config.extras.includes(extra.id);
                        return (
                          <button
                            key={extra.id}
                            onClick={() => toggleExtra(extra.id)}
                            className={cn(
                              "flex items-center justify-between px-5 py-3.5 border transition-all duration-300 text-left",
                              checked
                                ? "border-gold/40 bg-gold/5"
                                : "border-white/6 hover:border-white/15"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "w-4 h-4 border flex items-center justify-center shrink-0 transition-all duration-300",
                                  checked ? "border-gold bg-gold" : "border-white/20"
                                )}
                              >
                                {checked && <Check size={9} className="text-charcoal" strokeWidth={3} />}
                              </span>
                              <span className={cn(
                                "text-sm transition-colors duration-300",
                                checked ? "text-white" : "text-white/45"
                              )}>
                                {extra.label}
                              </span>
                            </div>
                            <span className={cn(
                              "text-xs font-medium shrink-0 ml-4 transition-colors duration-300",
                              checked ? "text-gold" : "text-white/25"
                            )}>
                              {extra.perPerson
                                ? `+ ${formatARS(extra.perPerson)}/p.`
                                : `+ ${formatARS(extra.fixed!)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Columna derecha: resumen sticky ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-28">
            <motion.div
              {...fadeUp}
              className="border border-white/10 p-8 flex flex-col gap-6"
              style={{ background: "#111" }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gold/20" />
                <span className="text-gold text-[10px] tracking-[0.5em] uppercase">Tu resumen</span>
                <span className="h-px flex-1 bg-gold/20" />
              </div>

              {/* Detalles del evento */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/35 tracking-wide">Evento</span>
                  <span className="text-white/70">
                    {EVENT_TYPES.find((e) => e.id === config.eventType)?.label ?? (
                      <span className="text-white/20 italic text-xs">Sin elegir</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/35 tracking-wide">Invitados</span>
                  <span className="text-white/70 flex items-center gap-1.5">
                    <Users size={12} className="text-gold/50" />
                    {config.guests}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/35 tracking-wide">Paquete</span>
                  <span className="text-white/70">
                    {PACKAGES.find((p) => p.id === config.package)?.name ?? (
                      <span className="text-white/20 italic text-xs">Sin elegir</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Desglose */}
              {config.package && (
                <>
                  <div className="h-px bg-white/5" />
                  <div className="flex flex-col gap-2 text-xs">
                    {(() => {
                      const pkg = PACKAGES.find((p) => p.id === config.package)!;
                      return (
                        <div className="flex justify-between text-white/35">
                          <span>
                            {pkg.name} × {config.guests} p.
                          </span>
                          <span>{formatARS(pkg.pricePerPerson * config.guests)}</span>
                        </div>
                      );
                    })()}
                    {config.extras.map((id) => {
                      const extra = EXTRAS.flatMap((g) => g.items).find((e) => e.id === id)!;
                      const price = extra.perPerson
                        ? extra.perPerson * config.guests
                        : (extra.fixed ?? 0);
                      return (
                        <div key={id} className="flex justify-between text-white/35">
                          <span className="truncate pr-2 max-w-[160px]">{extra.label}</span>
                          <span className="shrink-0">{formatARS(price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Total */}
              <div className="h-px bg-white/5" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase">
                  Total estimado
                </span>
                <AnimatePresence mode="wait">
                  {total !== null ? (
                    <motion.p
                      key={total}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-display font-bold text-gold"
                      style={{ fontFamily: "var(--font-display, serif)" }}
                    >
                      {formatARS(total)}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/15 text-lg italic"
                      style={{ fontFamily: "var(--font-display, serif)" }}
                    >
                      Seleccioná un paquete
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-white/20 text-[10px] text-center mt-1">
                  Valor orientativo · Sujeto a consulta y disponibilidad
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleWhatsApp}
                disabled={!config.package}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-4 font-semibold text-sm tracking-widest uppercase transition-all duration-300",
                  config.package
                    ? "bg-gold hover:bg-gold-light text-charcoal hover:shadow-lg hover:shadow-gold/20"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                )}
              >
                <Send size={14} strokeWidth={2} />
                Enviar consulta
              </button>

              {config.package && (
                <p className="text-white/20 text-[10px] text-center -mt-3">
                  Será redirigido a WhatsApp con el detalle de su consulta
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
