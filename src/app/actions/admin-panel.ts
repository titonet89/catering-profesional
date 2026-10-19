"use server";

// Operaciones del panel admin sobre galería, reseñas, consultas y solicitudes.
// Antes se hacían desde el navegador con la clave pública de Supabase, lo que
// obligaba a dejar esas tablas abiertas a cualquiera. Ahora pasan por acá:
// se verifica la sesión de admin y se usa la clave del servidor.

import { revalidatePath } from "next/cache";
import { getSession } from "./auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { GalleryItem, Review } from "@/lib/supabase";

async function requireAdmin() {
  if (!(await getSession())) throw new Error("No autorizado");
  return supabaseAdmin();
}

// ─── Reseñas ────────────────────────────────────────────────────────────────

export async function listReviewsAction(): Promise<Review[]> {
  const db = await requireAdmin();
  const { data } = await db.from("reviews").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

export async function approveReviewAction(id: string): Promise<void> {
  const db = await requireAdmin();
  await db.from("reviews").update({ aprobado: true }).eq("id", id);
  revalidatePath("/");
}

export async function deleteReviewAction(id: string): Promise<void> {
  const db = await requireAdmin();
  await db.from("reviews").delete().eq("id", id);
  revalidatePath("/");
}

// ─── Consultas y solicitudes ────────────────────────────────────────────────

export async function listSubmissionsAction() {
  const db = await requireAdmin();
  const { data } = await db.from("contacto_submissions").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function listSolicitudesAction() {
  const db = await requireAdmin();
  const { data } = await db.from("presupuesto_solicitudes").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function marcarEnviadoAction(id: string): Promise<void> {
  const db = await requireAdmin();
  await db.from("presupuesto_solicitudes").update({ estado: "enviado" }).eq("id", id);
}

// ─── Galería ────────────────────────────────────────────────────────────────

export async function listGalleryAction(): Promise<GalleryItem[]> {
  const db = await requireAdmin();
  const { data } = await db.from("gallery_items").select("*").order("created_at", { ascending: false });
  return (data ?? []) as GalleryItem[];
}

export async function countGalleryCategoriaAction(categoria: string): Promise<number> {
  const db = await requireAdmin();
  const { count } = await db
    .from("gallery_items")
    .select("*", { count: "exact", head: true })
    .eq("categoria", categoria);
  return count ?? 0;
}

const EXT_PERMITIDAS = ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"];

/**
 * Devuelve un permiso de subida de un solo uso para Storage. El archivo se
 * sube directo desde el navegador (las fotos pueden pesar varios MB y las
 * Server Actions tienen un límite de 1 MB), pero solo con este permiso.
 */
export async function createGalleryUploadAction(ext: string): Promise<{ path: string; token: string }> {
  const db = await requireAdmin();
  const cleanExt = ext.toLowerCase();
  if (!EXT_PERMITIDAS.includes(cleanExt)) throw new Error("Tipo de archivo no permitido");

  const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${cleanExt}`;
  const { data, error } = await db.storage.from("galeria").createSignedUploadUrl(path);
  if (error || !data) throw new Error("No se pudo preparar la subida");
  return { path: data.path, token: data.token };
}

export async function registerGalleryItemAction(item: {
  title: string;
  categoria: string;
  storage_path: string;
  tipo: "foto" | "video";
}): Promise<{ error?: string }> {
  const db = await requireAdmin();
  const { error } = await db.from("gallery_items").insert([{ ...item, activo: true }]);
  if (error) return { error: "No se pudo registrar la foto" };
  revalidatePath("/");
  return {};
}

export async function toggleGalleryItemAction(id: string, activo: boolean): Promise<void> {
  const db = await requireAdmin();
  await db.from("gallery_items").update({ activo }).eq("id", id);
  revalidatePath("/");
}

export async function renameGalleryItemAction(id: string, title: string): Promise<void> {
  const db = await requireAdmin();
  const clean = title.trim().slice(0, 120);
  if (!clean) return;
  await db.from("gallery_items").update({ title: clean }).eq("id", id);
  revalidatePath("/");
}

export async function deleteGalleryItemAction(id: string): Promise<void> {
  const db = await requireAdmin();
  // La ruta del archivo se toma de la base, no del navegador
  const { data } = await db.from("gallery_items").select("storage_path").eq("id", id).single();
  if (data?.storage_path) await db.storage.from("galeria").remove([data.storage_path]);
  await db.from("gallery_items").delete().eq("id", id);
  revalidatePath("/");
}
