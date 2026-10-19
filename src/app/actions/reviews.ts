"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { clip, isValidEmail, rateLimit } from "@/lib/security";

export async function submitReviewAction(_prev: unknown, formData: FormData) {
  const nombre     = clip(formData.get("nombre"), 80);
  const email      = clip(formData.get("email"), 254);
  const evento     = clip(formData.get("evento"), 60);
  const comentario = clip(formData.get("comentario"), 1500);
  const estrellas  = Math.min(5, Math.max(1, parseInt(formData.get("estrellas") as string) || 5));

  if (!nombre || !email || !evento || !comentario)
    return { error: "Completá todos los campos." };

  if (!isValidEmail(email))
    return { error: "El email no es válido." };

  if (comentario.length < 20)
    return { error: "El comentario es muy corto (mínimo 20 caracteres)." };

  if (!(await rateLimit("resena", 3, 60 * 60_000)))
    return { error: "Ya recibimos tus comentarios. Probá de nuevo más tarde." };

  // Siempre entra sin aprobar: la publica el admin desde el panel
  const { error } = await supabaseAdmin().from("reviews").insert([{
    nombre, email, evento, comentario, estrellas, aprobado: false,
  }]);

  if (error) return { error: "No se pudo enviar. Intentá de nuevo." };
  return { success: true };
}
