import { redirect } from "next/navigation";
import { getGuestSession } from "@/app/actions/guest-auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import GuestPanel from "./GuestPanel";

export default async function InvitadoPage() {
  const session = await getGuestSession();
  if (!session) redirect("/invitado/login");

  const db = supabaseAdmin();
  const { data: solicitudes } = await db
    .from("presupuesto_solicitudes")
    .select("*")
    .eq("guest_id", session.guestId)
    .order("created_at", { ascending: false });

  return <GuestPanel session={session} initialSolicitudes={solicitudes ?? []} />;
}
