import Navbar          from "@/components/public/Navbar";
import Hero            from "@/components/public/Hero";
import ComoTrabajamos  from "@/components/public/ComoTrabajamos";
import Services        from "@/components/public/Services";
import Presupuestos    from "@/components/public/Presupuestos";
import Alquiler        from "@/components/public/Alquiler";
import Galeria         from "@/components/public/Galeria";
import Testimonios     from "@/components/public/Testimonios";
import FAQ             from "@/components/public/FAQ";
import Contacto        from "@/components/public/Contacto";
import WhatsAppButton  from "@/components/public/WhatsAppButton";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Galeria />
        <Services />
        <Presupuestos />
        <Testimonios />
        <ComoTrabajamos />
        <Alquiler />
        <FAQ />
        <Contacto />
      </main>
      <WhatsAppButton />
    </>
  );
}
