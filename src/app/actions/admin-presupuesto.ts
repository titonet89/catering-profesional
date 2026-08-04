"use server";

import { getSession } from "./auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { PAQUETES, type PaqueteId } from "@/data/paquetes";

function parsePrice(raw: FormDataEntryValue | null): number | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;
  const clean = str.replace(/[$\s]/g, "").replace(/\./g, "").replace(",", "");
  const n = parseInt(clean, 10);
  return isNaN(n) || n < 0 ? null : n;
}

// ─── Precios configurables por paquete ────────────────────────────────────

function precioKey(id: PaqueteId) {
  return `precio_${id}`;
}

export async function getPaquetePreciosAction(): Promise<Record<string, number>> {
  const isAdmin = await getSession();
  if (!isAdmin) return {};

  const db = supabaseAdmin();
  const { data } = await db
    .from("admin_config")
    .select("key, value")
    .like("key", "precio_%");

  const overrides: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    const paqueteId = row.key.replace("precio_", "");
    overrides[paqueteId] = Number(row.value);
  });

  const result: Record<string, number> = {};
  Object.entries(PAQUETES).forEach(([id, p]) => {
    result[id] = overrides[id] ?? p.precio;
  });

  return result;
}

export async function updatePaquetePrecioAction(
  paqueteId: PaqueteId,
  precio: number
): Promise<{ error?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };
  if (isNaN(precio) || precio < 0) return { error: "Precio inválido" };

  const db = supabaseAdmin();
  await db.from("admin_config").upsert({
    key: precioKey(paqueteId),
    value: String(precio),
    updated_at: new Date().toISOString(),
  });

  return {};
}

// ─── WhatsApp personal del admin ──────────────────────────────────────────

export async function getAdminWhatsappAction(): Promise<string> {
  const isAdmin = await getSession();
  if (!isAdmin) return "";
  const db = supabaseAdmin();
  const { data } = await db.from("admin_config").select("value").eq("key", "admin_whatsapp").single();
  return data?.value ?? "";
}

export async function setAdminWhatsappAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };
  const whatsapp = ((formData.get("whatsapp") as string) ?? "").trim();
  const db = supabaseAdmin();
  await db.from("admin_config").upsert({ key: "admin_whatsapp", value: whatsapp, updated_at: new Date().toISOString() });
  return { success: "Número guardado" };
}

// ─── Crear presupuesto desde admin (sin email, con precio fijo) ────────────

export async function createSolicitudAdminAction(
  _prev: { error?: string; id?: string; nombre?: string; telefono?: string; paqueteNombre?: string } | null,
  formData: FormData
): Promise<{ error?: string; id?: string; nombre?: string; telefono?: string; paqueteNombre?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };

  const paqueteId   = formData.get("paquete")       as PaqueteId;
  const nombre      = ((formData.get("nombre")       as string) ?? "").trim();
  const email       = ((formData.get("email")        as string) ?? "").trim();
  const telefono    = ((formData.get("telefono")     as string) ?? "").trim();
  const fecha_evento = (formData.get("fecha_evento") as string) ?? "";
  const lugar       = ((formData.get("lugar")        as string) ?? "").trim();
  const tipo_evento  = (formData.get("tipo_evento")  as string) ?? "";
  const invitados      = Number(formData.get("invitados") ?? 0);
  const precio_override = parsePrice(formData.get("precio_override"));

  if (!paqueteId || !nombre || !telefono || !fecha_evento || !lugar || !tipo_evento || !invitados) {
    return { error: "Completá todos los campos obligatorios" };
  }

  const paquete = PAQUETES[paqueteId];
  if (!paquete) return { error: "Paquete inválido" };

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("presupuesto_solicitudes")
    .insert([{
      paquete: paqueteId,
      nombre,
      email: email || "—",
      telefono,
      fecha_evento,
      lugar,
      tipo_evento,
      invitados,
      precio_override,
      mensaje:  "",
      estado:   "pendiente",
      guest_id: null,
    }])
    .select("id")
    .single();

  if (error || !data) return { error: "Error al crear el presupuesto" };

  return { id: data.id, nombre, telefono, paqueteNombre: paquete.nombre };
}
