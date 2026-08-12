"use server";

import { supabase } from "@/lib/supabase";

export async function submitReviewAction(_prev: unknown, formData: FormData) {
  const nombre     = (formData.get("nombre")     as string)?.trim();
  const email      = (formData.get("email")      as string)?.trim();
  const evento     = (formData.get("evento")     as string)?.trim();
  const comentario = (formData.get("comentario") as string)?.trim();
  const estrellas  = parseInt(formData.get("estrellas") as string) || 5;

  if (!nombre || !email || !evento || !comentario)
    return { error: "Completá todos los campos." };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "El email no es válido." };

  if (comentario.length < 20)
    return { error: "El comentario es muy corto (mínimo 20 caracteres)." };

  const { error } = await supabase.from("reviews").insert([{
    nombre, email, evento, comentario, estrellas, aprobado: false,
  }]);

  if (error) return { error: "No se pudo enviar. Intentá de nuevo." };
  return { success: true };
}
