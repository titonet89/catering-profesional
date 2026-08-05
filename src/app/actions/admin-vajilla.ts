"use server";

import { getSession } from "./auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { VajillaItemPedido } from "@/data/vajilla";

export type CotizacionVajilla = {
  id: string;
  guest_id: string | null;
  estado: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha_evento: string | null;
  lugar: string;
  tipo_evento: string;
  items: VajillaItemPedido[];
  total: number;
  precio_override: number | null;
  notas_admin: string | null;
  rechazo_nota: string | null;
  created_at: string;
};

// ─── Listar cotizaciones ────────────────────────────────────────────────────

export async function listCotizacionesVajillaAction(): Promise<CotizacionVajilla[]> {
  const isAdmin = await getSession();
  if (!isAdmin) return [];
  const db = supabaseAdmin();
  const { data } = await db
    .from("cotizacion_vajilla")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as CotizacionVajilla[];
}

// ─── Crear desde admin ──────────────────────────────────────────────────────

export async function createCotizacionVajillaAdminAction(
  _prev: { error?: string; id?: string } | null,
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };

  const nombre      = ((formData.get("nombre")      as string) ?? "").trim();
  const email       = ((formData.get("email")        as string) ?? "").trim();
  const telefono    = ((formData.get("telefono")     as string) ?? "").trim();
  const fecha_evento = (formData.get("fecha_evento") as string) || null;
  const lugar       = ((formData.get("lugar")        as string) ?? "").trim();
  const tipo_evento  = (formData.get("tipo_evento")  as string) ?? "";
  const itemsRaw    = (formData.get("items")         as string) ?? "[]";
  const notas_admin = ((formData.get("notas_admin")  as string) ?? "").trim();

  if (!nombre || !telefono) return { error: "Completá nombre y teléfono" };

  let items: VajillaItemPedido[];
  try { items = JSON.parse(itemsRaw); } catch { return { error: "Ítems inválidos" }; }
  if (!items.length) return { error: "Agregá al menos un artículo" };

  const total = items.reduce((s, i) => s + i.subtotal, 0);

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("cotizacion_vajilla")
    .insert([{
      guest_id: null,
      estado: "pendiente",
      nombre, email: email || "—", telefono,
      fecha_evento, lugar, tipo_evento,
      items, total, notas_admin,
    }])
    .select("id")
    .single();

  if (error || !data) return { error: "Error al crear la cotización" };
  return { id: data.id };
}

// ─── Aprobar / Rechazar ────────────────────────────────────────────────────

export async function aprobarCotizacionVajillaAction(id: string): Promise<{ error?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };
  const db = supabaseAdmin();
  const { error } = await db.from("cotizacion_vajilla").update({ estado: "aprobado" }).eq("id", id);
  return error ? { error: "Error al aprobar" } : {};
}

export async function rechazarCotizacionVajillaAction(id: string, rechazo_nota: string): Promise<{ error?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };
  const db = supabaseAdmin();
  const { error } = await db.from("cotizacion_vajilla").update({ estado: "rechazado", rechazo_nota }).eq("id", id);
  return error ? { error: "Error al rechazar" } : {};
}
