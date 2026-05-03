import Navbar       from "@/components/public/Navbar";
import Hero         from "@/components/public/Hero";
import Services     from "@/components/public/Services";
import BudgetBuilder from "@/components/public/BudgetBuilder";
import Alquiler     from "@/components/public/Alquiler";
import Galeria      from "@/components/public/Galeria";
import Testimonios  from "@/components/public/Testimonios";
import Contacto     from "@/components/public/Contacto";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <BudgetBuilder />
        <Alquiler />
        <Galeria />
        <Testimonios />
        <Contacto />
      </main>
    </>
  );
}
