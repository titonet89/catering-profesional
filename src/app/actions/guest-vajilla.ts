"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { getGuestSession } from "./guest-auth";
import type { VajillaItemPedido } from "@/data/vajilla";
import type { CotizacionVajilla } from "./admin-vajilla";

// ─── Listar cotizaciones del colaborador ──────────────────────────────────

export async function listCotizacionesVajillaGuestAction(): Promise<CotizacionVajilla[]> {
  const session = await getGuestSession();
  if (!session) return [];
  const db = supabaseAdmin();
  const { data } = await db
    .from("cotizacion_vajilla")
    .select("*")
    .eq("guest_id", session.guestId)
    .order("created_at", { ascending: false });
  return (data ?? []) as CotizacionVajilla[];
}

// ─── Crear cotización ─────────────────────────────────────────────────────

export async function createCotizacionVajillaGuestAction(
  _prev: { error?: string; id?: string } | null,
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const session = await getGuestSession();
  if (!session) return { error: "Sesión expirada" };

  const nombre      = ((formData.get("nombre")      as string) ?? "").trim();
  const email       = ((formData.get("email")        as string) ?? "").trim();
  const telefono    = ((formData.get("telefono")     as string) ?? "").trim();
  const fecha_evento = (formData.get("fecha_evento") as string) || null;
  const lugar       = ((formData.get("lugar")        as string) ?? "").trim();
  const tipo_evento  = (formData.get("tipo_evento")  as string) ?? "";
  const itemsRaw    = (formData.get("items")         as string) ?? "[]";

  if (!nombre || !email || !telefono) return { error: "Completá nombre, email y teléfono" };

  let items: VajillaItemPedido[];
  try { items = JSON.parse(itemsRaw); } catch { return { error: "Ítems inválidos" }; }
  if (!items.length) return { error: "Agregá al menos un artículo" };

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("cotizacion_vajilla")
    .insert([{
      guest_id: session.guestId,
      estado: "pendiente_aprobacion",
      nombre, email, telefono,
      fecha_evento, lugar, tipo_evento,
      items, total,
    }])
    .select("id")
    .single();

  if (error || !data) return { error: "Error al crear la cotización" };
  return { id: data.id };
}

// ─── Actualizar cotización ────────────────────────────────────────────────

export async function updateCotizacionVajillaGuestAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getGuestSession();
  if (!session) return { error: "Sesión expirada" };

  const id          = (formData.get("id")           as string) ?? "";
  const nombre      = ((formData.get("nombre")      as string) ?? "").trim();
  const email       = ((formData.get("email")        as string) ?? "").trim();
  const telefono    = ((formData.get("telefono")     as string) ?? "").trim();
  const fecha_evento = (formData.get("fecha_evento") as string) || null;
  const lugar       = ((formData.get("lugar")        as string) ?? "").trim();
  const tipo_evento  = (formData.get("tipo_evento")  as string) ?? "";
  const itemsRaw    = (formData.get("items")         as string) ?? "[]";

  if (!id) return { error: "ID inválido" };

  let items: VajillaItemPedido[];
  try { items = JSON.parse(itemsRaw); } catch { return { error: "Ítems inválidos" }; }
  if (!items.length) return { error: "Agregá al menos un artículo" };

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const db = supabaseAdmin();

  const { data: existing } = await db
    .from("cotizacion_vajilla")
    .select("guest_id, estado")
    .eq("id", id)
    .single();

  if (!existing || existing.guest_id !== session.guestId) {
    return { error: "No tenés permiso para modificar esta cotización" };
  }

  const estadoReset = existing.estado === "rechazado" ? { estado: "pendiente_aprobacion" } : {};

  const { error } = await db
    .from("cotizacion_vajilla")
    .update({ nombre, email, telefono, fecha_evento, lugar, tipo_evento, items, total, ...estadoReset })
    .eq("id", id)
    .eq("guest_id", session.guestId);

  return error ? { error: "Error al guardar los cambios" } : {};
}
