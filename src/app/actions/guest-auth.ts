"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-server";
import { signGuestToken, verifyGuestToken, GUEST_SESSION_EXPIRY } from "@/lib/guest-session";
import { getSession } from "./auth";
import type { PaqueteId } from "@/data/paquetes";

// Acepta "$ 59.900", "59.900", "59900", "59,900" → 59900
function parsePrice(raw: FormDataEntryValue | null): number | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;
  const clean = str.replace(/[$\s]/g, "").replace(/\./g, "").replace(",", "");
  const n = parseInt(clean, 10);
  return isNaN(n) || n < 0 ? null : n;
}

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type GuestUser = {
  id: string;
  username: string;
  nombre: string;
  whatsapp: string;
  activo: boolean;
  created_at: string;
};

// ─── Sesión del invitado ────────────────────────────────────────────────────

export async function getGuestSession() {
  const jar   = await cookies();
  const token = jar.get("guest_session")?.value;
  if (!token) return null;
  return verifyGuestToken(token);
}

async function setGuestCookie(guestId: string, username: string, nombre: string, whatsapp: string) {
  const token = await signGuestToken({ guestId, username, nombre, whatsapp });
  const jar   = await cookies();
  jar.set("guest_session", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   GUEST_SESSION_EXPIRY,
    path:     "/",
  });
}

// ─── Login del invitado ─────────────────────────────────────────────────────

export async function loginGuestAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const username = ((formData.get("username") as string) ?? "").trim();
  const password  = (formData.get("password") as string) ?? "";

  if (!username || !password) return { error: "Completá usuario y contraseña" };

  const db = supabaseAdmin();
  const { data: guest } = await db
    .from("guest_users")
    .select("id, username, nombre, whatsapp, password_hash, activo")
    .eq("username", username)
    .single();

  if (!guest)        return { error: "Usuario o contraseña incorrectos" };
  if (!guest.activo) return { error: "Esta cuenta está desactivada" };

  const valid = await bcrypt.compare(password, guest.password_hash);
  if (!valid) return { error: "Usuario o contraseña incorrectos" };

  await setGuestCookie(guest.id, guest.username, guest.nombre, guest.whatsapp ?? "");
  redirect("/invitado");
}

// ─── Logout del invitado ────────────────────────────────────────────────────

export async function logoutGuestAction() {
  const jar = await cookies();
  jar.delete("guest_session");
  redirect("/invitado/login");
}

// ─── Admin: crear colaborador ───────────────────────────────────────────────

export async function createGuestUserAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const isAdmin = await getSession();
  if (!isAdmin) return { error: "No autorizado" };

  const nombre   = ((formData.get("nombre")   as string) ?? "").trim();
  const username = ((formData.get("username") as string) ?? "").trim();
  const password  = (formData.get("password")  as string) ?? "";

  const whatsapp = ((formData.get("whatsapp") as string) ?? "").trim();

  if (!nombre || !username || !password) return { error: "Completá todos los campos" };
  if (password.length < 6)               return { error: "La contraseña debe tener al menos 6 caracteres" };
  if (!/^[a-z0-9_]+$/.test(username))   return { error: "Usuario: solo letras minúsculas, números y guiones bajos" };

  const hash = await bcrypt.hash(password, 12);
  const db   = supabaseAdmin();

  const { error } = await db.from("guest_users").insert([{
    username, nombre, whatsapp, password_hash: hash, activo: true,
  }]);

  if (error) {
    if (error.code === "23505") return { error: "Ese nombre de usuario ya existe" };
    return { error: "Error al crear el colaborador" };
  }

  return { success: `Colaborador "${username}" creado correctamente` };
}

// ─── Admin: activar / desactivar colaborador ────────────────────────────────

export async function toggleGuestActiveAction(id: string, activo: boolean): Promise<void> {
  const isAdmin = await getSession();
  if (!isAdmin) return;
  const db = supabaseAdmin();
  await db.from("guest_users").update({ activo }).eq("id", id);
}

// ─── Admin: listar colaboradores ────────────────────────────────────────────

export async function listGuestUsersAction(): Promise<GuestUser[]> {
  const isAdmin = await getSession();
  if (!isAdmin) return [];
  const db = supabaseAdmin();
  const { data } = await db
    .from("guest_users")
    .select("id, username, nombre, whatsapp, activo, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ─── Invitado: crear nueva solicitud ───────────────────────────────────────

export async function createSolicitudGuestAction(
  _prev: { error?: string; success?: string; id?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string; id?: string }> {
  const session = await getGuestSession();
  if (!session) return { error: "Sesión expirada" };

  const paquete     = formData.get("paquete") as PaqueteId;
  const nombre      = ((formData.get("nombre")      as string) ?? "").trim();
  const email       = ((formData.get("email")       as string) ?? "").trim();
  const telefono    = ((formData.get("telefono")    as string) ?? "").trim();
  const fecha_evento = (formData.get("fecha_evento") as string) ?? "";
  const lugar       = ((formData.get("lugar")       as string) ?? "").trim();
  const tipo_evento  = (formData.get("tipo_evento")  as string) ?? "";
  const invitados      = Number(formData.get("invitados") ?? 0);
  const precio_override = parsePrice(formData.get("precio_override"));

  if (!paquete || !nombre || !email || !telefono || !fecha_evento || !lugar || !tipo_evento || !invitados) {
    return { error: "Completá todos los campos obligatorios" };
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("presupuesto_solicitudes")
    .insert([{
      paquete, nombre, email, telefono, fecha_evento, lugar, tipo_evento,
      invitados, precio_override, mensaje: "", estado: "pendiente_aprobacion",
      guest_id: session.guestId,
    }])
    .select("id")
    .single();

  if (error || !data) return { error: "Error al crear el presupuesto" };
  return { success: "Presupuesto creado", id: data.id };
}

// ─── Invitado: actualizar solicitud ────────────────────────────────────────

export async function updateSolicitudGuestAction(
  _prev: { error?: string; success?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await getGuestSession();
  if (!session) return { error: "Sesión expirada" };

  const id          = (formData.get("id")         as string) ?? "";
  const nombre      = ((formData.get("nombre")      as string) ?? "").trim();
  const email       = ((formData.get("email")       as string) ?? "").trim();
  const telefono    = ((formData.get("telefono")    as string) ?? "").trim();
  const fecha_evento = (formData.get("fecha_evento") as string) ?? "";
  const lugar       = ((formData.get("lugar")       as string) ?? "").trim();
  const tipo_evento  = (formData.get("tipo_evento")  as string) ?? "";
  const invitados      = Number(formData.get("invitados") ?? 0);
  const precio_override = parsePrice(formData.get("precio_override"));
  const notas_admin    = ((formData.get("notas_admin") as string) ?? "").trim();

  if (!id) return { error: "ID inválido" };

  const db = supabaseAdmin();

  // Verificar propiedad — el invitado solo puede modificar sus propias solicitudes
  const { data: existing } = await db
    .from("presupuesto_solicitudes")
    .select("guest_id, estado")
    .eq("id", id)
    .single();

  if (!existing || existing.guest_id !== session.guestId) {
    return { error: "No tenés permiso para modificar este presupuesto" };
  }

  // Si fue rechazado y el colaborador lo edita, vuelve a pendiente de aprobación
  const estadoReset = existing.estado === "rechazado" ? { estado: "pendiente_aprobacion" } : {};

  const { error } = await db
    .from("presupuesto_solicitudes")
    .update({ nombre, email, telefono, fecha_evento, lugar, tipo_evento, invitados, precio_override, notas_admin, ...estadoReset })
    .eq("id", id)
    .eq("guest_id", session.guestId);

  if (error) return { error: "Error al guardar los cambios" };
  return { success: "Cambios guardados correctamente" };
}
