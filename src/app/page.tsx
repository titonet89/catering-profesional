import Navbar          from "@/components/public/Navbar";
import Hero            from "@/components/public/Hero";
import ComoTrabajamos  from "@/components/public/ComoTrabajamos";
import Services        from "@/components/public/Services";
import Presupuestos    from "@/components/public/Presupuestos";
import Alquiler        from "@/components/public/Alquiler";
import Galeria, { type GaleriaFoto } from "@/components/public/Galeria";
import Testimonios, { type ResenaPublica } from "@/components/public/Testimonios";
import FAQ             from "@/components/public/FAQ";
import Contacto        from "@/components/public/Contacto";
import WhatsAppButton  from "@/components/public/WhatsAppButton";
import { supabaseAdmin } from "@/lib/supabase-server";

// La página se regenera cada 5 minutos; además el panel admin la refresca
// al instante cuando se aprueba una reseña o se cambia la galería.
export const revalidate = 300;

async function getGaleria(): Promise<GaleriaFoto[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("gallery_items")
    .select("id, title, categoria, storage_path")
    .eq("activo", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    categoria: g.categoria,
    imageUrl: db.storage.from("galeria").getPublicUrl(g.storage_path).data.publicUrl,
  }));
}

async function getResenas(): Promise<ResenaPublica[]> {
  // Solo columnas públicas: el email de quien deja la reseña nunca sale del servidor
  const { data } = await supabaseAdmin()
    .from("reviews")
    .select("id, nombre, evento, comentario, estrellas, created_at")
    .eq("aprobado", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function HomePage() {
  const [galeria, resenas] = await Promise.all([getGaleria(), getResenas()]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Galeria fotos={galeria} />
        <Services />
        <Presupuestos />
        <Testimonios resenas={resenas} />
        <ComoTrabajamos />
        <Alquiler />
        <FAQ />
        <Contacto />
      </main>
      <WhatsAppButton />
    </>
  );
}
