"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/supabase";
import { Upload, Trash2, Eye, EyeOff, LogOut, Image, MessageSquare } from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "catering2025";

const CATEGORIAS = ["Bodas", "Corporativos", "Galas", "Cumpleaños"];

type Tab = "galeria" | "consultas";

type Submission = {
  id: string;
  nombre: string;
  email: string;
  evento: string;
  mensaje: string;
  created_at: string;
};

export default function AdminPage() {
  const [auth, setAuth]           = useState(false);
  const [pwd, setPwd]             = useState("");
  const [pwdError, setPwdError]   = useState(false);
  const [tab, setTab]             = useState<Tab>("galeria");

  // galería
  const [items, setItems]         = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle]         = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const fileRef                   = useRef<HTMLInputElement>(null);

  // consultas
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) { setAuth(true); setPwdError(false); }
    else setPwdError(true);
  };

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

  useEffect(() => {
    if (!auth) return;
    loadItems();
    loadSubmissions();
  }, [auth]);

  const handleUpload = async (e: React.FormEvent) => {
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

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <form onSubmit={login} className="flex flex-col gap-4 w-full max-w-sm p-8 border border-white/10">
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-gold text-[10px] tracking-[0.5em] uppercase">Panel Admin</span>
            <h1 className="text-white text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-display, serif)" }}>
              Catering Profesional
            </h1>
          </div>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Contraseña"
            className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
          />
          {pwdError && <p className="text-red-400 text-xs">Contraseña incorrecta</p>}
          <button type="submit" className="py-3 bg-gold text-charcoal font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

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
        <button onClick={() => setAuth(false)} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <LogOut size={15} /> Salir
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-white/8 px-6">
        {([["galeria", Image, "Galería"], ["consultas", MessageSquare, "Consultas"]] as const).map(([id, Icon, label]) => (
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

            {/* Formulario subida */}
            <div className="border border-white/8 p-7">
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-6">Subir nueva foto o video</h2>
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título (ej: Boda en Palermo)"
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

            {/* Lista de items */}
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
      </div>
    </div>
  );
}
