"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/supabase";
import { Upload, Trash2, Eye, EyeOff, LogOut, Image as ImageIcon, MessageSquare, Lock, FileText, ExternalLink, CheckCircle, Clock, Users, UserPlus, ToggleLeft, ToggleRight, Copy, Pencil, X, Package, Plus, ShoppingBag } from "lucide-react";
import VajillaTab from "./VajillaTab";
import { logoutAction, changePasswordAction } from "@/app/actions/auth";
import { createGuestUserAction, toggleGuestActiveAction, listGuestUsersAction, type GuestUser } from "@/app/actions/guest-auth";
import { getPaquetePreciosAction, updatePaquetePrecioAction, createSolicitudAdminAction, getAdminWhatsappAction, setAdminWhatsappAction, aprobarSolicitudAction, rechazarSolicitudAction } from "@/app/actions/admin-presupuesto";
import { PAQUETES, PAQUETES_LISTA, formatPrecio, PRECIO_MINIMO_INVITADOS, type PaqueteId } from "@/data/paquetes";

const CATEGORIAS = ["Bodas", "Corporativos", "Galas", "Cumpleaños"];

// ─── Marca de agua via Canvas (client-side, antes de subir) ──────────────────
async function addWatermark(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Texto de marca de agua — esquina inferior derecha
      const fontSize = Math.max(14, Math.round(canvas.width * 0.024));
      ctx.font      = `bold ${fontSize}px Georgia, serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      const pad = Math.round(canvas.width * 0.022);

      // Sombra sutil para legibilidad sobre fondos claros
      ctx.shadowColor   = "rgba(0,0,0,0.55)";
      ctx.shadowBlur    = 6;
      ctx.fillStyle     = "rgba(255,255,255,0.32)";
      ctx.fillText("© Catering Profesional · Jujuy", canvas.width - pad, canvas.height - pad);

      URL.revokeObjectURL(objectUrl);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas error"))),
        "image/jpeg",
        0.92
      );
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

type Tab = "galeria" | "consultas" | "presupuestos" | "vajilla" | "seguridad" | "colaboradores";

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
  estado: "pendiente" | "enviado" | "pendiente_aprobacion" | "aprobado" | "rechazado";
  notas_admin: string;
  precio_override: number | null;
  rechazo_nota?: string;
  guest_id: string | null;
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

const SITE_URL = "https://cateringprofesional.com.ar";
const TIPOS_EVENTO_ADMIN = ["Boda", "Cumpleaños", "Evento corporativo", "Gala", "Quinceañero", "Bautismo", "Comunión", "Aniversario", "Otro"];
const inputAdmin = "w-full bg-transparent border border-white/10 px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors";

function toWAPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("54")) return d;
  if (d.startsWith("0"))  return "54" + d.slice(1);
  return "54" + d;
}

function QuickPresupuestoModal({
  paqueteId,
  precioInicial,
  adminWA,
  onClose,
  onCreated,
}: {
  paqueteId?: PaqueteId;
  precioInicial?: number;
  adminWA: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [state, action, pending] = useActionState(createSolicitudAdminAction, null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState<PaqueteId | "">(paqueteId ?? "");

  const paquete = PAQUETES[selectedPaquete as PaqueteId];

  const copyLink = () => {
    if (!state?.id) return;
    navigator.clipboard.writeText(`${SITE_URL}/presupuesto/${state.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (state?.id) {
    const presupuestoUrl = `${SITE_URL}/presupuesto/${state.id}`;
    const waTexto = encodeURIComponent(
      `Hola ${(state.nombre ?? "").split(" ")[0]} 😊\n\nDesde *Catering Profesional* te compartimos tu propuesta personalizada — *${state.paqueteNombre}*:\n\n👉 ${presupuestoUrl}\n\nCualquier consulta escribinos 🙌\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`
    );
    const waClienteUrl = `https://wa.me/${toWAPhone(state.telefono ?? "")}?text=${waTexto}`;
    const waPropioTexto = encodeURIComponent(
      `*Nuevo presupuesto creado* 📋\n\n*${state.paqueteNombre}* — ${state.nombre}\n\n👉 ${presupuestoUrl}`
    );
    const waPropio = adminWA ? `https://wa.me/${toWAPhone(adminWA)}?text=${waPropioTexto}` : null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="w-full max-w-md border border-white/10 p-8 flex flex-col items-center gap-5 text-center" style={{ background: "#0a0a0a" }}>
          <span className="text-3xl">✓</span>
          <div>
            <p className="text-gold font-semibold">Presupuesto creado</p>
            <p className="text-white/40 text-sm mt-1">{state.paqueteNombre} · {state.nombre}</p>
          </div>

          <div className="w-full border border-white/8 px-4 py-2 flex items-center gap-2">
            <code className="flex-1 text-gold/70 text-xs truncate">{presupuestoUrl}</code>
            <button onClick={copyLink} className="text-white/30 hover:text-white transition-colors p-1">
              <Copy size={13} />
            </button>
          </div>
          {copiedLink && <p className="text-emerald-400 text-xs -mt-3">¡Link copiado!</p>}

          <div className="flex gap-3 w-full">
            <a href={presupuestoUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-white/20 text-white/60 hover:text-white text-xs tracking-wider transition-colors">
              <ExternalLink size={12} /> Ver PDF
            </a>
            <a href={waClienteUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-white text-xs tracking-wider hover:opacity-90 transition-opacity">
              <MessageSquare size={12} /> Al cliente
            </a>
          </div>
          {waPropio && (
            <a href={waPropio} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#25D366]/40 text-[#25D366] text-xs tracking-wider hover:bg-[#25D366]/10 transition-colors">
              <MessageSquare size={12} /> Enviar a mi WhatsApp
            </a>
          )}

          <div className="flex gap-3 w-full pt-2 border-t border-white/6">
            <button onClick={() => { onCreated(); }} className="flex-1 py-2 border border-white/10 text-white/40 hover:text-white text-xs transition-colors">
              Cerrar y actualizar lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10" style={{ background: "#0a0a0a" }}>

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/8">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-1">Nuevo presupuesto</p>
            <h3 className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-display, serif)" }}>
              {paquete?.nombre ?? "Presupuesto personalizado"}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form action={action} className="p-6 flex flex-col gap-4">
          {paqueteId
            ? <input type="hidden" name="paquete" value={paqueteId} />
            : (
              <div className="flex flex-col gap-1">
                <label className="text-white/30 text-[10px] tracking-widest uppercase">Paquete *</label>
                <select
                  name="paquete"
                  required
                  value={selectedPaquete}
                  onChange={e => setSelectedPaquete(e.target.value as PaqueteId)}
                  className={`${inputAdmin} bg-[#111]`}
                >
                  <option value="" style={{ background: "#111", color: "#fff" }}>Seleccioná un paquete...</option>
                  {PAQUETES_LISTA.map(p => (
                    <option key={p.id} value={p.id} style={{ background: "#111", color: "#fff" }}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            )
          }

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Nombre del cliente *</label>
              <input name="nombre" required placeholder="Nombre y apellido" className={inputAdmin} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">WhatsApp *</label>
              <input name="telefono" required placeholder="+54 388..." className={inputAdmin} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Email</label>
              <input type="email" name="email" placeholder="Opcional" className={inputAdmin} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Fecha del evento *</label>
              <input type="date" name="fecha_evento" required className={inputAdmin} style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Lugar *</label>
              <input name="lugar" required placeholder="Salón, dirección..." className={inputAdmin} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Tipo de evento *</label>
              <select name="tipo_evento" required className={`${inputAdmin} bg-[#111]`}>
                <option value="" style={{ background: "#111", color: "#fff" }}>Seleccioná...</option>
                {TIPOS_EVENTO_ADMIN.map(t => <option key={t} value={t} style={{ background: "#111", color: "#fff" }}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Invitados *</label>
              <input type="number" min="1" name="invitados" required placeholder="Ej: 120" className={inputAdmin} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white/30 text-[10px] tracking-widest uppercase">Precio / persona (ARS) *</label>
              <input type="text" inputMode="numeric" name="precio_override" defaultValue={precioInicial ?? ""} required className={inputAdmin} placeholder="Ej: 59900" />
              <p className="text-white/20 text-[10px]">Solo números — ej: 59900</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/30 text-[10px] tracking-widest uppercase">Personalización / notas del servicio</label>
            <textarea
              name="notas_admin"
              rows={3}
              placeholder="Ej: Se agrega entrada de empanadas · Sin gluten para 5 personas · Decoración floral..."
              className={`${inputAdmin} resize-none`}
            />
            <p className="text-white/20 text-[10px]">Aparece en el PDF bajo &quot;Notas y personalizaciones&quot;</p>
          </div>

          {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-3 border border-white/10 text-white/40 hover:text-white text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={pending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50">
              {pending ? "Creando..." : "Crear presupuesto →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("galeria");

  // galería
  const [items, setItems]           = useState<GalleryItem[]>([]);
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [title, setTitle]           = useState("");
  const [categoria, setCategoria]   = useState(CATEGORIAS[0]);
  const [fileCount, setFileCount]   = useState(0);
  const fileRef                     = useRef<HTMLInputElement>(null);

  // consultas
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // presupuestos
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [solicitudAbierta, setSolicitudAbierta] = useState<string | null>(null);

  // precios de paquetes
  const [preciosMap, setPreciosMap] = useState<Record<string, number>>({});
  const [editandoPrecio, setEditandoPrecio] = useState<string | null>(null);
  const [nuevoPrecioInput, setNuevoPrecioInput] = useState("");
  const [savingPrecio, setSavingPrecio] = useState(false);

  // modal crear presupuesto rápido
  const [crearParaPaquete, setCrearParaPaquete] = useState<PaqueteId | null>(null);
  const [crearAbierto, setCrearAbierto] = useState(false);

  // aprobación de colaboradores
  const [rechazandoId,    setRechazandoId]    = useState<string | null>(null);
  const [rechazoNota,     setRechazoNota]     = useState("");
  const [aprobandoId,     setAprobandoId]     = useState<string | null>(null);
  const [aprobacionNota,  setAprobacionNota]  = useState("");
  const [aprobacionPrecio, setAprobacionPrecio] = useState("");

  // colaboradores
  const [guestUsers, setGuestUsers] = useState<GuestUser[]>([]);
  const [guestUsersLoaded, setGuestUsersLoaded] = useState(false);
  const [createGuestState, createGuestAction, createGuestPending] = useActionState(createGuestUserAction, null);
  const [copied, setCopied] = useState(false);

  // whatsapp personal del admin
  const [adminWA, setAdminWA] = useState("");
  const [adminWAState, adminWAAction, adminWAPending] = useActionState(setAdminWhatsappAction, null);

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

  const loadPrecios = async () => {
    const precios = await getPaquetePreciosAction();
    setPreciosMap(precios);
  };

  const handleGuardarPrecio = async (paqueteId: PaqueteId) => {
    const precio = Number(nuevoPrecioInput.replace(/\D/g, ""));
    if (isNaN(precio) || precio < 0) return;
    setSavingPrecio(true);
    await updatePaquetePrecioAction(paqueteId, precio);
    setPreciosMap(prev => ({ ...prev, [paqueteId]: precio }));
    setEditandoPrecio(null);
    setSavingPrecio(false);
  };

  const loadGuestUsers = async () => {
    const users = await listGuestUsersAction();
    setGuestUsers(users);
    setGuestUsersLoaded(true);
  };

  const handleToggleGuest = async (id: string, activo: boolean) => {
    await toggleGuestActiveAction(id, activo);
    await loadGuestUsers();
  };

  const handleAprobar = async (id: string) => {
    const rawPrecio = aprobacionPrecio.replace(/\D/g, "");
    const precio = rawPrecio ? Number(rawPrecio) : null;
    await aprobarSolicitudAction(id, {
      notas_admin: aprobacionNota.trim() || undefined,
      precio_override: precio && !isNaN(precio) ? precio : undefined,
    });
    setAprobandoId(null);
    setAprobacionNota("");
    setAprobacionPrecio("");
    await loadSolicitudes();
  };

  const handleRechazar = async (id: string) => {
    if (!rechazoNota.trim()) return;
    await rechazarSolicitudAction(id, rechazoNota);
    setRechazandoId(null);
    setRechazoNota("");
    await loadSolicitudes();
  };

  const copyGuestUrl = () => {
    navigator.clipboard.writeText("https://cateringprofesional.com.ar/invitado/login");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // Recargar colaboradores tras crear uno nuevo
  useEffect(() => {
    if (createGuestState?.success) loadGuestUsers();
  }, [createGuestState?.success]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cargar colaboradores cuando se abre el tab (lazy)
  useEffect(() => {
    if (tab === "colaboradores" && !guestUsersLoaded) loadGuestUsers();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadItems();
    loadSubmissions();
    loadSolicitudes();
    loadPrecios();
    getAdminWhatsappAction().then(setAdminWA);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let ok = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length });

      try {
        let uploadBlob: Blob;
        let ext = "jpg";

        if (file.type.startsWith("image/")) {
          uploadBlob = await addWatermark(file);
          ext = "jpg";
        } else {
          uploadBlob = file;
          ext = file.name.split(".").pop() ?? "mp4";
        }

        const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const tipo = file.type.startsWith("video/") ? "video" : "foto";

        const { error: storageError } = await supabase.storage
          .from("galeria")
          .upload(path, uploadBlob, { cacheControl: "3600", upsert: false });

        if (storageError) { console.error("Error storage:", storageError.message); continue; }

        const fileTitle = title.trim() || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

        const { error: dbError } = await supabase.from("gallery_items").insert([{
          title: fileTitle, categoria, storage_path: path, tipo, activo: true,
        }]);

        if (!dbError) ok++;
      } catch (err) {
        console.error("Error procesando", file.name, err);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    setFileCount(0);
    setTitle("");
    if (fileRef.current) fileRef.current.value = "";
    await loadItems();
    if (ok > 0) alert(`✓ ${ok} de ${files.length} foto(s) subida(s) con marca de agua`);
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
      <div className="flex border-b border-white/8 px-2 sm:px-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {([
          ["galeria",      ImageIcon,     "Galería"],
          ["consultas",    MessageSquare, "Consultas"],
          ["presupuestos", FileText, (() => {
            const nAprobacion = solicitudes.filter(s => s.estado === "pendiente_aprobacion").length;
            const nPendiente  = solicitudes.filter(s => s.estado === "pendiente").length;
            if (nAprobacion > 0) return `Presupuestos ⚠ (${nAprobacion})`;
            if (nPendiente  > 0) return `Presupuestos (${nPendiente})`;
            return "Presupuestos";
          })()],
          ["vajilla",      ShoppingBag, "Vajilla"],
          ["seguridad",    Lock,        "Seguridad"],
          ["colaboradores",Users,       "Colaboradores"],
        ] as const).map(([id, Icon, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            title={label}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm tracking-wider border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              tab === id ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── TAB GALERÍA ── */}
        {tab === "galeria" && (
          <div className="flex flex-col gap-10">

            <div className="border border-white/8 p-7">
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-1">Subir fotos a la galería</h2>
              <p className="text-white/25 text-xs mb-6">Podés seleccionar varias fotos a la vez. Se agrega marca de agua automáticamente.</p>
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título (opcional — se usa el nombre del archivo)"
                    className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40"
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
                  {fileCount > 0 ? (
                    <p className="text-gold/70 text-sm font-medium">{fileCount} foto(s) seleccionada(s)</p>
                  ) : (
                    <p className="text-white/40 text-sm">Hacé clic para seleccionar una o varias fotos</p>
                  )}
                  <p className="text-white/20 text-xs">JPG, PNG, WEBP — podés elegir varias a la vez</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    required
                    onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
                  />
                </div>

                {/* Barra de progreso durante upload */}
                {uploadProgress && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Subiendo {uploadProgress.current} de {uploadProgress.total}…</span>
                      <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded">
                      <div
                        className="h-1 bg-gold transition-all duration-300 rounded"
                        style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || fileCount === 0}
                  className="flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-40"
                >
                  <Upload size={15} />
                  {uploading
                    ? `Procesando${uploadProgress ? ` ${uploadProgress.current}/${uploadProgress.total}` : "…"}`
                    : `Subir${fileCount > 1 ? ` ${fileCount} fotos` : " foto"} con marca de agua`}
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

        {/* ── MODALES CREAR PRESUPUESTO ── */}
        {crearParaPaquete && (
          <QuickPresupuestoModal
            key={crearParaPaquete}
            paqueteId={crearParaPaquete}
            precioInicial={preciosMap[crearParaPaquete] ?? PAQUETES[crearParaPaquete]?.precio ?? 0}
            adminWA={adminWA}
            onClose={() => setCrearParaPaquete(null)}
            onCreated={() => { loadSolicitudes(); setCrearParaPaquete(null); }}
          />
        )}
        {crearAbierto && (
          <QuickPresupuestoModal
            adminWA={adminWA}
            onClose={() => setCrearAbierto(false)}
            onCreated={() => { loadSolicitudes(); setCrearAbierto(false); }}
          />
        )}

        {/* ── TAB PRESUPUESTOS ── */}
        {tab === "presupuestos" && (
          <div className="flex flex-col gap-10">

            {/* ── Botón nuevo presupuesto ── */}
            <div className="flex items-center justify-between">
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase">Panel de presupuestos</h2>
              <button
                onClick={() => setCrearAbierto(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs tracking-widest uppercase transition-colors"
              >
                <Plus size={13} /> Nuevo presupuesto
              </button>
            </div>

            {/* ── Pendientes de aprobación ── */}
            {solicitudes.filter(s => s.estado === "pendiente_aprobacion").length > 0 && (
              <div className="border border-amber-500/20 bg-amber-500/5 p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-[10px] tracking-[0.5em] uppercase">
                    ⏳ Esperando aprobación ({solicitudes.filter(s => s.estado === "pendiente_aprobacion").length})
                  </span>
                </div>
                {solicitudes.filter(s => s.estado === "pendiente_aprobacion").map(s => {
                  const paq = PAQUETES[s.paquete as keyof typeof PAQUETES];
                  const presupuestoUrl = `https://cateringprofesional.com.ar/presupuesto/${s.id}`;
                  const esRechazando = rechazandoId === s.id;
                  return (
                    <div key={s.id} className="border border-white/8 bg-black/20 p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-white font-semibold text-sm">{s.nombre}</p>
                          <p className="text-white/40 text-xs mt-0.5">
                            {paq?.nombre ?? s.paquete} · {s.invitados} personas · {s.tipo_evento}
                          </p>
                          <p className="text-white/30 text-xs">
                            {new Date(s.fecha_evento + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long" })} · {s.lugar}
                          </p>
                          {s.notas_admin && (
                            <p className="text-white/40 text-xs mt-1 italic">{s.notas_admin}</p>
                          )}
                        </div>
                        <a href={presupuestoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-gold/60 hover:text-gold text-xs underline underline-offset-2 transition-colors shrink-0">
                          Ver PDF →
                        </a>
                      </div>

                      {!esRechazando && aprobandoId !== s.id ? (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => { setAprobandoId(s.id); setAprobacionNota(""); setAprobacionPrecio(""); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                          >
                            <CheckCircle size={12} /> Aprobar
                          </button>
                          <button
                            onClick={() => { setRechazandoId(s.id); setRechazoNota(""); }}
                            className="flex items-center gap-1.5 px-4 py-2 border border-red-400/40 text-red-400 hover:bg-red-400/10 text-xs tracking-wider uppercase transition-colors"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : aprobandoId === s.id ? (
                        <div className="flex flex-col gap-3 border border-emerald-500/20 bg-emerald-500/5 p-4">
                          <p className="text-emerald-400 text-[10px] tracking-[0.4em] uppercase">Confirmar aprobación</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-white/30 text-[10px] tracking-widest uppercase">Precio/persona (ARS)</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={aprobacionPrecio}
                                onChange={e => setAprobacionPrecio(e.target.value)}
                                placeholder={s.precio_override ? String(s.precio_override) : "Dejar vacío = precio original"}
                                className="bg-transparent border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-white/30 text-[10px] tracking-widest uppercase">Notas para el PDF (opcional)</label>
                            <textarea
                              value={aprobacionNota}
                              onChange={e => setAprobacionNota(e.target.value)}
                              placeholder="Ej: Se agrega entrada especial · Decoración personalizada · Horario extendido..."
                              rows={2}
                              className="w-full bg-transparent border border-white/10 px-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/40 resize-none"
                            />
                            <p className="text-white/20 text-[10px]">Aparece en el PDF bajo &quot;Notas y personalizaciones&quot;</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAprobar(s.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                            >
                              <CheckCircle size={12} /> Confirmar aprobación
                            </button>
                            <button
                              onClick={() => setAprobandoId(null)}
                              className="px-4 py-2 border border-white/10 text-white/40 hover:text-white text-xs transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={rechazoNota}
                            onChange={e => setRechazoNota(e.target.value)}
                            placeholder="Motivo del rechazo (el colaborador lo verá)..."
                            rows={2}
                            className="w-full bg-transparent border border-red-400/30 px-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-red-400/60 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRechazar(s.id)}
                              disabled={!rechazoNota.trim()}
                              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-40"
                            >
                              Confirmar rechazo
                            </button>
                            <button
                              onClick={() => setRechazandoId(null)}
                              className="px-4 py-2 border border-white/10 text-white/40 hover:text-white text-xs transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Paquetes vigentes ── */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Package size={14} className="text-gold/60" />
                <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase">Paquetes vigentes</h2>
              </div>

              {(["cena", "lunch"] as const).map(tipo => (
                <div key={tipo} className="mb-8">
                  <p className="text-gold/40 text-[10px] tracking-[0.4em] uppercase mb-4">
                    {tipo === "cena" ? "— Cenas —" : "— Lunch —"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PAQUETES_LISTA.filter(p => p.tipo === tipo).map(p => {
                      const precio = preciosMap[p.id] ?? p.precio;
                      const editando = editandoPrecio === p.id;
                      return (
                        <div key={p.id} className="border border-white/8 hover:border-white/15 transition-colors p-5 flex flex-col gap-4">
                          <div>
                            <p className="text-gold/50 text-[9px] tracking-[0.4em] uppercase">{tipo}</p>
                            <h3 className="text-white font-semibold text-sm mt-0.5">{p.nombre}</h3>
                          </div>

                          <ul className="flex flex-col gap-1 flex-1">
                            {p.resumen.slice(0, 3).map(item => (
                              <li key={item} className="text-white/40 text-xs flex items-center gap-1.5">
                                <span className="text-gold/40">✦</span> {item}
                              </li>
                            ))}
                          </ul>

                          {/* Precio editable */}
                          <div className="border-t border-white/6 pt-3">
                            {editando ? (
                              <div className="flex items-center gap-2">
                                <span className="text-white/40 text-xs">$</span>
                                <input
                                  type="number"
                                  value={nuevoPrecioInput}
                                  onChange={e => setNuevoPrecioInput(e.target.value)}
                                  className="flex-1 bg-transparent border border-gold/40 px-2 py-1 text-white text-sm focus:outline-none focus:border-gold"
                                  placeholder={String(precio)}
                                  autoFocus
                                  onKeyDown={e => { if (e.key === "Enter") handleGuardarPrecio(p.id as PaqueteId); if (e.key === "Escape") setEditandoPrecio(null); }}
                                />
                                <button
                                  onClick={() => handleGuardarPrecio(p.id as PaqueteId)}
                                  disabled={savingPrecio}
                                  className="px-2 py-1 bg-gold text-charcoal text-[10px] font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
                                >
                                  {savingPrecio ? "..." : "OK"}
                                </button>
                                <button onClick={() => setEditandoPrecio(null)} className="text-white/30 hover:text-white transition-colors">
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white/25 text-[9px] tracking-widest uppercase">Precio / persona</p>
                                  <p className="text-gold font-semibold text-sm">{formatPrecio(precio)}</p>
                                </div>
                                <button
                                  onClick={() => { setEditandoPrecio(p.id); setNuevoPrecioInput(String(precio)); }}
                                  title="Editar precio"
                                  className="text-white/20 hover:text-gold transition-colors p-1"
                                >
                                  <Pencil size={13} />
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setCrearParaPaquete(p.id as PaqueteId)}
                            className="w-full py-2.5 border border-gold/30 text-gold text-[10px] tracking-[0.4em] uppercase hover:bg-gold hover:text-charcoal transition-all duration-200"
                          >
                            Crear presupuesto
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Solicitudes recibidas ── */}
            {(() => {
              const BADGE: Record<string, { label: string; cls: string }> = {
                pendiente:            { label: "PENDIENTE",        cls: "border-gold/40 text-gold" },
                aprobado:             { label: "APROBADO",         cls: "border-emerald-500/40 text-emerald-400" },
                enviado:              { label: "ENVIADO",          cls: "border-white/20 text-white/30" },
                rechazado:            { label: "RECHAZADO",        cls: "border-red-400/30 text-red-400/70" },
                pendiente_aprobacion: { label: "ESP. APROBACIÓN",  cls: "border-amber-400/40 text-amber-400" },
              };
              const BORDER: Record<string, string> = {
                pendiente: "border-gold/20",
                aprobado:  "border-emerald-500/20",
                enviado:   "border-white/8 opacity-60",
                rechazado: "border-white/6 opacity-40",
                pendiente_aprobacion: "border-white/6 opacity-40",
              };
              const canSend = (estado: string) => estado === "pendiente" || estado === "aprobado";

              return (
                <div className="border-t border-white/6 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase">
                      Solicitudes recibidas ({solicitudes.length})
                    </h2>
                    <div className="flex gap-3 text-xs text-white/25 flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={11} /> Pendientes: {solicitudes.filter(s => s.estado === "pendiente").length}</span>
                      <span className="flex items-center gap-1 text-emerald-400/40"><CheckCircle size={11} /> Aprobados: {solicitudes.filter(s => s.estado === "aprobado").length}</span>
                      <span className="flex items-center gap-1"><CheckCircle size={11} /> Enviados: {solicitudes.filter(s => s.estado === "enviado").length}</span>
                    </div>
                  </div>

                  {solicitudes.length === 0 ? (
                    <p className="text-white/20 text-sm text-center py-12">No hay solicitudes aún</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                    {solicitudes.map((s) => {
                      const paquete = PAQUETES[s.paquete as keyof typeof PAQUETES];
                      const precioPP = s.precio_override ?? paquete?.precio ?? null;
                      const total = precioPP ? formatPrecio(precioPP * s.invitados) : null;
                      const presupuestoUrl = `https://cateringprofesional.com.ar/presupuesto/${s.id}`;
                      const waTexto = encodeURIComponent(
                        `Hola ${s.nombre.split(" ")[0]} 😊\n\nDesde *Catering Profesional* te compartimos tu propuesta personalizada — *${paquete?.nombre ?? s.paquete}* para ${s.invitados} personas:\n\n👉 ${presupuestoUrl}\n\nCualquier consulta escribinos 🙌\n\n✨ *Catering Profesional Jujuy*\n📞 388 403-6629`
                      );
                      const waUrl = `https://wa.me/${toWAPhone(s.telefono)}?text=${waTexto}`;
                      const isOpen = solicitudAbierta === s.id;
                      const badge = BADGE[s.estado] ?? BADGE.enviado;
                      const borderCls = BORDER[s.estado] ?? "border-white/8";

                      return (
                        <div key={s.id} className={`border transition-colors ${borderCls}`}>
                          {/* Fila resumen */}
                          <div
                            className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/2"
                            onClick={() => setSolicitudAbierta(isOpen ? null : s.id)}
                          >
                            <div className="flex items-center gap-4 flex-wrap">
                              <span className={`text-[9px] tracking-wider px-2 py-0.5 border ${badge.cls}`}>
                                {badge.label}
                              </span>
                              <div>
                                <p className="text-white font-semibold text-sm">{s.nombre}</p>
                                <p className="text-white/40 text-xs">{paquete?.nombre ?? s.paquete} · {s.invitados} inv. · {s.tipo_evento}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {total && (
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
                                  ["Lugar",     s.lugar],
                                  ["WhatsApp",  s.telefono],
                                  ["Email",     s.email],
                                  ["Invitados", `${s.invitados} personas`],
                                  ...(s.notas_admin ? [["Notas", s.notas_admin]] : []),
                                  ...(s.mensaje     ? [["Comentarios", s.mensaje]] : []),
                                ].map(([k, v]) => (
                                  <div key={k}>
                                    <p className="text-white/30 text-[10px] tracking-widest uppercase">{k}</p>
                                    <p className="text-white/80 text-xs mt-0.5">{v}</p>
                                  </div>
                                ))}
                              </div>

                              {total && (
                                <div className="border border-gold/20 bg-gold/5 px-4 py-3 text-xs text-gold/80">
                                  ✦ {s.invitados} personas · {precioPP ? formatPrecio(precioPP) : "—"} / persona · Total: <strong className="text-gold">{total}</strong>
                                </div>
                              )}

                              <div className="flex gap-3 flex-wrap">
                                <a href={presupuestoUrl} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 hover:text-white text-xs tracking-wider transition-colors">
                                  <ExternalLink size={13} /> Ver PDF
                                </a>
                                {canSend(s.estado) && (
                                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                                    onClick={() => { if (s.estado === "pendiente" || s.estado === "aprobado") marcarEnviado(s.id); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs tracking-wider hover:opacity-90 transition-opacity">
                                    <MessageSquare size={13} /> Enviar por WhatsApp
                                  </a>
                                )}
                                {canSend(s.estado) && (
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
                    })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── TAB SEGURIDAD ── */}
        {tab === "seguridad" && (
          <div className="max-w-sm flex flex-col gap-10">

            {/* Mi WhatsApp personal */}
            <div>
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-6">Mi WhatsApp personal</h2>
              <p className="text-white/30 text-xs mb-4 leading-relaxed">
                Se usa para enviarte el link de cada presupuesto que crees, así lo tenés a mano para reenviar a quien quieras.
              </p>
              <form action={adminWAAction} className="flex flex-col gap-4">
                <input
                  name="whatsapp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 3884036629 (sin +54)"
                  defaultValue={adminWA}
                  className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
                />
                <p className="text-white/20 text-[10px]">Podés escribir el número con o sin código de país — se formatea automáticamente</p>
                {adminWAState?.error   && <p className="text-red-400 text-xs">{adminWAState.error}</p>}
                {adminWAState?.success && <p className="text-emerald-400 text-xs">✓ {adminWAState.success}</p>}
                <button type="submit" disabled={adminWAPending}
                  className="py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50">
                  {adminWAPending ? "Guardando..." : "Guardar número"}
                </button>
              </form>
            </div>

            <div>
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
          </div>
        )}

        {/* ── TAB COLABORADORES ── */}
        {tab === "colaboradores" && (
          <div className="flex flex-col gap-10">

            {/* Link de acceso */}
            <div className="border border-white/8 p-5">
              <p className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-3">Link del panel de colaborador</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-white/5 px-4 py-2 text-gold text-xs truncate">
                  cateringprofesional.com.ar/invitado/login
                </code>
                <button
                  onClick={copyGuestUrl}
                  className="flex items-center gap-1.5 px-3 py-2 border border-white/20 text-white/50 hover:text-white text-xs tracking-wider transition-colors whitespace-nowrap"
                >
                  <Copy size={12} /> {copied ? "¡Copiado!" : "Copiar link"}
                </button>
                <a
                  href="/invitado/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 border border-gold/30 text-gold text-xs tracking-wider hover:bg-gold hover:text-charcoal transition-all"
                >
                  <ExternalLink size={12} /> Abrir
                </a>
              </div>
              <p className="text-white/20 text-xs mt-2">
                Pasale este link y sus credenciales al colaborador. No tiene acceso a ninguna función del panel admin.
              </p>
            </div>

            {/* Crear colaborador */}
            <div className="border border-white/8 p-6">
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-5">
                <UserPlus size={11} className="inline mr-2" />Crear credencial de colaborador
              </h2>
              <form action={createGuestAction} className="flex flex-col gap-4 max-w-sm">
                <input
                  name="nombre"
                  placeholder="Nombre del colaborador (ej: María López)"
                  required
                  className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
                />
                <input
                  name="username"
                  placeholder="Usuario (ej: maria — solo letras y números)"
                  required
                  pattern="[a-z0-9_]+"
                  title="Solo letras minúsculas, números y guiones bajos"
                  className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
                />
                <input
                  name="whatsapp"
                  type="text"
                  inputMode="numeric"
                  placeholder="WhatsApp del colaborador (ej: 3884036629)"
                  className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Contraseña (mín. 6 caracteres)"
                  required
                  minLength={6}
                  className="bg-transparent border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40"
                />

                {createGuestState?.error   && <p className="text-red-400 text-xs">{createGuestState.error}</p>}
                {createGuestState?.success && <p className="text-emerald-400 text-xs">✓ {createGuestState.success}</p>}

                <button
                  type="submit"
                  disabled={createGuestPending}
                  className="flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  <UserPlus size={14} /> {createGuestPending ? "Creando..." : "Crear colaborador"}
                </button>
              </form>
            </div>

            {/* Lista de colaboradores */}
            <div>
              <h2 className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-4">
                Colaboradores ({guestUsers.length})
              </h2>
              {!guestUsersLoaded ? (
                <p className="text-white/20 text-sm">Cargando...</p>
              ) : guestUsers.length === 0 ? (
                <p className="text-white/20 text-sm text-center py-10">No hay colaboradores creados aún</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {guestUsers.map(g => (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between px-5 py-4 border transition-colors ${g.activo ? "border-white/8" : "border-white/4 opacity-50"}`}
                    >
                      <div>
                        <p className="text-white text-sm font-semibold">{g.nombre}</p>
                        <p className="text-white/40 text-xs">@{g.username}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] tracking-widest px-2 py-0.5 border ${g.activo ? "border-emerald-500/40 text-emerald-400" : "border-white/15 text-white/30"}`}>
                          {g.activo ? "ACTIVO" : "INACTIVO"}
                        </span>
                        <button
                          onClick={() => handleToggleGuest(g.id, !g.activo)}
                          title={g.activo ? "Desactivar acceso" : "Activar acceso"}
                          className="text-white/30 hover:text-gold transition-colors"
                        >
                          {g.activo
                            ? <ToggleRight size={22} className="text-emerald-400/70 hover:text-emerald-400" />
                            : <ToggleLeft  size={22} />
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── TAB VAJILLA ── */}
        {tab === "vajilla" && <VajillaTab />}

      </div>
    </div>
  );
}
