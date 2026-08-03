"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/supabase";
import { Upload, Trash2, Eye, EyeOff, LogOut, Image, MessageSquare, Lock, FileText, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { logoutAction, changePasswordAction } from "@/app/actions/auth";
import { PAQUETES, formatPrecio, PRECIO_MINIMO_INVITADOS } from "@/data/paquetes";

const CATEGORIAS = ["Bodas", "Corporativos", "Galas", "Cumpleaños"];

type Tab = "galeria" | "consultas" | "presupuestos" | "seguridad";

type Solicitud = {
  id: string;
  paquete: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha_evento: string;
  lugar: string;
  tipo_evento: string;
  invitados: number;
  mensaje: string;
  estado: "pendiente" | "enviado";
  notas_admin: string;
  created_at: string;
};

type Submission = {
  id: string;
  nombre: string;
  email: string;
  evento: string;
  mensaje: string;
  created_at: string;
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("galeria");

  // galería
  const [items, setItems]         = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle]         = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const fileRef                   = useRef<HTMLInputElement>(null);

  // consultas
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // presupuestos
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [solicitudAbierta, setSolicitudAbierta] = useState<string | null>(null);

  // cambio de contraseña
  const [changePwdState, changePwdAction, changePwdPending] = useActionState(changePasswordAction, null);

  const loadItems = async () => {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const loadSubmissions = async () => {
    const { data } = await supabase
      .from("contacto_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data);
  };

  const loadSolicitudes = async () => {
    const { data } = await supabase
      .from("presupuesto_solicitudes")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSolicitudes(data);
  };

  const marcarEnviado = async (id: string) => {
    await supabase.from("presupuesto_solicitudes").update({ estado: "enviado" }).eq("id", id);
    await loadSolicitudes();
  };

  useEffect(() => {
    loadItems();
    loadSubmissions();
    loadSolicitudes();
  }, []);

  const handleUpload = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title) return;

    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const tipo = file.type.startsWith("video") ? "video" : "foto";

    const { error: storageError } = await supabase.storage
      .from("galeria")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (storageError) { alert("Error al subir archivo: " + storageError.message); setUploading(false); return; }

    const { error: dbError } = await supabase.from("gallery_items").insert([{
      title, categoria, storage_path: path, tipo, activo: true,
    }]);

    if (dbError) { alert("Error al guardar en BD: " + dbError.message); }
    else {
      setTitle("");
      setCategoria(CATEGORIAS[0]);
      if (fileRef.current) fileRef.current.value = "";
      await loadItems();
    }
    setUploading(false);
  };

  const toggleActivo = async (item: GalleryItem) => {
    await supabase.from("gallery_items").update({ activo: !item.activo }).eq("id", item.id);
    await loadItems();
  };

  const deleteItem = async (item: GalleryItem) => {
    if (!confirm(`¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`)) return;
    await supabase.storage.from("galeria").remove([item.storage_path]);
    await supabase.from("gallery_items").delete().eq("id", item.id);
    await loadItems();
  };

  const getPublicUrl = (path: string) =>
    supabase.storage.from("galeria").getPublicUrl(path).data.publicUrl;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "white" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div>
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase">Panel Admin</span>
          <h1 className="text-white font-bold tracking-wide" style={{ fontFamily: "var(--font-display, serif)" }}>
            Catering Profesional
          </h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
            <LogOut size={15} /> Salir
          </button>
        </form>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-white/8 px-6">
        {([
          ["galeria",      Image,         "Galería"],
          ["consultas",    MessageSquare, "Consultas"],
          ["presupuestos", FileText,      `Presupuestos${solicitudes.filter(s => s.estado === "pendiente").length ? ` (${solicitudes.filter(s => s.estado === "pendiente").length})` : ""}`],
          ["seguridad",    Lock,          "Seguridad"],
        ] as const).map(([id, Icon, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm tracking-wider border-b-2 transition-colors ${
              tab === id ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── TAB GALERÍA ── */}
        {tab === "galeria" && (
          <div className="flex flex-col gap-10">

            <div className="border border-white/8 p-7">
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-6">Subir nueva foto o video</h2>
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título (ej: Boda en Jujuy)"
                    required
                    className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
                  />
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="bg-[#111] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/40 cursor-pointer"
                  >
                    {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div
                  className="border-2 border-dashed border-white/10 hover:border-gold/30 transition-colors p-8 flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={24} className="text-white/30" />
                  <p className="text-white/40 text-sm">
                    {fileRef.current?.files?.[0]?.name ?? "Hacé clic para seleccionar foto o video"}
                  </p>
                  <p className="text-white/20 text-xs">JPG, PNG, WEBP, MP4 — máx. 50MB</p>
                  <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" required
                    onChange={() => setTitle((t) => t)} />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  <Upload size={15} />
                  {uploading ? "Subiendo..." : "Subir a la galería"}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-6">
                Fotos y videos ({items.length})
              </h2>
              {items.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-12">No hay fotos cargadas aún</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {items.map((item) => (
                    <div key={item.id} className={`relative border group ${item.activo ? "border-white/8" : "border-white/4 opacity-50"}`}>
                      <div className="aspect-square overflow-hidden bg-white/5">
                        {item.tipo === "video" ? (
                          <video src={getPublicUrl(item.storage_path)} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={getPublicUrl(item.storage_path)} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-white/80 text-xs font-medium truncate">{item.title}</p>
                        <p className="text-gold/50 text-[10px] tracking-wider uppercase mt-0.5">{item.categoria}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleActivo(item)}
                          title={item.activo ? "Ocultar" : "Mostrar"}
                          className="w-7 h-7 flex items-center justify-center bg-black/70 hover:bg-black text-white/70 hover:text-gold transition-colors">
                          {item.activo ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button onClick={() => deleteItem(item)}
                          title="Eliminar"
                          className="w-7 h-7 flex items-center justify-center bg-black/70 hover:bg-black text-white/70 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB CONSULTAS ── */}
        {tab === "consultas" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-2">
              Consultas recibidas ({submissions.length})
            </h2>
            {submissions.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-12">No hay consultas aún</p>
            ) : (
              submissions.map((s) => (
                <div key={s.id} className="border border-white/8 p-6 flex flex-col gap-3 hover:border-white/15 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-semibold">{s.nombre}</p>
                      <a href={`mailto:${s.email}`} className="text-gold/70 hover:text-gold text-sm transition-colors">{s.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.evento && (
                        <span className="px-3 py-1 border border-gold/20 text-gold/60 text-[10px] tracking-[0.3em] uppercase">
                          {s.evento}
                        </span>
                      )}
                      <span className="text-white/25 text-xs">
                        {new Date(s.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  {s.mensaje && <p className="text-white/50 text-sm leading-relaxed border-t border-white/5 pt-3">{s.mensaje}</p>}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Hola ${s.nombre}!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start text-xs tracking-widest uppercase text-green-400/70 hover:text-green-400 transition-colors"
                  >
                    Responder por WhatsApp →
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB PRESUPUESTOS ── */}
        {tab === "presupuestos" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase">
                Solicitudes de presupuesto ({solicitudes.length})
              </h2>
              <div className="flex gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1"><Clock size={11} /> Pendientes: {solicitudes.filter(s => s.estado === "pendiente").length}</span>
                <span className="flex items-center gap-1"><CheckCircle size={11} /> Enviados: {solicitudes.filter(s => s.estado === "enviado").length}</span>
              </div>
            </div>

            {solicitudes.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-12">No hay solicitudes aún</p>
            ) : (
              solicitudes.map((s) => {
                const paquete = PAQUETES[s.paquete as keyof typeof PAQUETES];
                const esGrande = s.invitados >= PRECIO_MINIMO_INVITADOS;
                const total = esGrande && paquete ? formatPrecio(paquete.precio * s.invitados) : null;
                const presupuestoUrl = `https://cateringprofesional.com.ar/presupuesto/${s.id}`;
                const waTexto = encodeURIComponent(
                  `Hola ${s.nombre.split(" ")[0]} 😊\n\nDesde *Catering Profesional* queremos agradecerte por elegirnos para tu evento.\n\nTe compartimos tu propuesta personalizada — *${paquete?.nombre ?? s.paquete}* para ${s.invitados} personas:\n\n👉 ${presupuestoUrl}\n\nCualquier consulta no dudes en escribirnos. ¡Estamos a tu disposición!\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`
                );
                const waUrl = `https://wa.me/${s.telefono.replace(/\D/g, "")}?text=${waTexto}`;
                const isOpen = solicitudAbierta === s.id;

                return (
                  <div key={s.id} className={`border transition-colors ${s.estado === "pendiente" ? "border-gold/20" : "border-white/8 opacity-60"}`}>
                    {/* Fila resumen */}
                    <div
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/2"
                      onClick={() => setSolicitudAbierta(isOpen ? null : s.id)}
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={`text-[10px] tracking-wider px-2 py-0.5 border ${s.estado === "pendiente" ? "border-gold/40 text-gold" : "border-white/20 text-white/30"}`}>
                          {s.estado === "pendiente" ? "PENDIENTE" : "ENVIADO"}
                        </span>
                        <div>
                          <p className="text-white font-semibold text-sm">{s.nombre}</p>
                          <p className="text-white/40 text-xs">{paquete?.nombre ?? s.paquete} · {s.invitados} personas · {s.tipo_evento}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {esGrande && total && (
                          <span className="text-gold text-xs hidden sm:block">{total}</span>
                        )}
                        <span className="text-white/20 text-xs">
                          {new Date(s.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="text-white/30 text-xs">{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Detalle expandido */}
                    {isOpen && (
                      <div className="border-t border-white/8 px-5 py-5 flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            ["Fecha evento", new Date(s.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })],
                            ["Lugar", s.lugar],
                            ["WhatsApp", s.telefono],
                            ["Email", s.email],
                            ["Invitados", `${s.invitados} personas`],
                            ...(s.mensaje ? [["Comentarios", s.mensaje]] : []),
                          ].map(([k, v]) => (
                            <div key={k}>
                              <p className="text-white/30 text-[10px] tracking-widest uppercase">{k}</p>
                              <p className="text-white/80 text-xs mt-0.5">{v}</p>
                            </div>
                          ))}
                        </div>

                        {esGrande ? (
                          <div className="border border-gold/20 bg-gold/5 px-4 py-3 text-xs text-gold/80">
                            ✦ Evento de {s.invitados} personas — el presupuesto ya incluye precio.
                            {total && <span className="ml-2 font-bold text-gold">Total: {total}</span>}
                          </div>
                        ) : (
                          <div className="border border-white/10 px-4 py-3 text-xs text-white/40">
                            Evento de {s.invitados} personas (menos de {PRECIO_MINIMO_INVITADOS}). Revisá y completá el precio antes de enviar.
                          </div>
                        )}

                        <div className="flex gap-3 flex-wrap">
                          <a href={presupuestoUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 hover:text-white text-xs tracking-wider transition-colors">
                            <ExternalLink size={13} /> Ver presupuesto
                          </a>
                          <a href={waUrl} target="_blank" rel="noopener noreferrer"
                            onClick={() => { if (s.estado === "pendiente") marcarEnviado(s.id); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs tracking-wider hover:opacity-90 transition-opacity">
                            <MessageSquare size={13} /> Enviar por WhatsApp
                          </a>
                          {s.estado === "pendiente" && (
                            <button onClick={() => marcarEnviado(s.id)}
                              className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/30 hover:text-white text-xs tracking-wider transition-colors">
                              <CheckCircle size={13} /> Marcar como enviado
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB SEGURIDAD ── */}
        {tab === "seguridad" && (
          <div className="max-w-sm">
            <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-6">Cambiar contraseña</h2>
            <form action={changePwdAction} className="flex flex-col gap-4">
              <input
                type="password"
                name="current"
                placeholder="Contraseña actual"
                autoComplete="current-password"
                className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
              />
              <input
                type="password"
                name="new"
                placeholder="Nueva contraseña (mín. 8 caracteres)"
                autoComplete="new-password"
                className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
              />
              <input
                type="password"
                name="confirm"
                placeholder="Repetir nueva contraseña"
                autoComplete="new-password"
                className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
              />

              {changePwdState?.error && (
                <p className="text-red-400 text-xs">{changePwdState.error}</p>
              )}
              {changePwdState?.success && (
                <p className="text-emerald-400 text-xs">{changePwdState.success}</p>
              )}

              <button
                type="submit"
                disabled={changePwdPending}
                className="py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                {changePwdPending ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
