import { createClient } from "@supabase/supabase-js";

// Cliente con service_role key — bypasea RLS, solo usar en Server Actions / API routes.
// NUNCA importar desde componentes "use client".
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurado");
  return createClient(url, key, { auth: { persistSession: false } });
}
