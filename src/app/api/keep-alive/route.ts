import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Supabase (plan gratuito) pausa el proyecto tras 7 días sin actividad, y con
// la base pausada fallan el login, la galería y los formularios. Vercel Cron
// llama a esta ruta una vez por día (ver vercel.json) para mantenerla activa.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Si se configura CRON_SECRET en Vercel, solo el cron puede llamar a esta ruta
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { error } = await supabaseAdmin()
    .from("admin_config")
    .select("key", { count: "exact", head: true });

  if (error) {
    console.error("keep-alive: Supabase no respondió:", error.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
