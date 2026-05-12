import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Catering Profesional Jujuy",
  description: "Términos y condiciones de uso del sitio web de Catering Profesional Organización de Eventos, Jujuy, Argentina.",
};

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#e5e5e5" }}>

      {/* Header */}
      <header style={{ background: "#080808", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: "#c9a84c" }}>
              ✦ Catering Profesional
            </span>
            <span className="text-white text-sm tracking-[0.1em] uppercase font-bold mt-0.5"
              style={{ fontFamily: "var(--font-playfair, serif)" }}>
              Jujuy · NOA
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs tracking-widest uppercase transition-colors duration-300"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ← Volver al sitio
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">

        {/* Título */}
        <div className="mb-12 pb-8" style={{ borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
          <span className="text-[10px] tracking-[0.5em] uppercase mb-4 block" style={{ color: "#c9a84c" }}>
            Información legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair, serif)" }}>
            Términos y Condiciones
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Última actualización: mayo de 2025 · Aplicable al sitio web de Catering Profesional Organización de Eventos
          </p>
        </div>

        <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>

          {/* Intro */}
          <p>
            Al acceder y utilizar este sitio web, usted acepta los presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, le solicitamos que se abstenga de utilizar el sitio.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              1. Identificación del titular
            </h2>
            <div className="pl-5" style={{ borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
              <p><strong className="text-white">Nombre de fantasía:</strong> Catering Profesional Organización de Eventos</p>
              <p className="mt-1"><strong className="text-white">CUIT/CUIL:</strong> 27-34061402-5</p>
              <p className="mt-1"><strong className="text-white">Domicilio:</strong> Av. Eva Perón N° 2278, B° San Pedrito, San Salvador de Jujuy, Jujuy, Argentina</p>
              <p className="mt-1"><strong className="text-white">Correo electrónico:</strong> cateringprofesionaljujuy@gmail.com</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              2. Objeto y naturaleza del sitio
            </h2>
            <p>
              Este sitio web tiene carácter informativo y comercial. Su finalidad es presentar los servicios de catering y alquiler de equipamiento ofrecidos por Catering Profesional Organización de Eventos, y facilitar el contacto con potenciales clientes interesados en dichos servicios.
            </p>
            <p className="mt-3">
              El sitio no constituye una plataforma de comercio electrónico. La contratación efectiva de servicios requiere acuerdo expreso entre las partes, incluyendo confirmación de disponibilidad, firma de presupuesto y pago de seña.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              3. Precios y presupuestos orientativos
            </h2>
            <p>
              Los precios y estimaciones que se muestran en las herramientas de presupuesto y cotización de este sitio son <strong className="text-white">orientativos</strong> y no constituyen una oferta vinculante. Los valores están sujetos a:
            </p>
            <ul className="mt-3 flex flex-col gap-2 pl-5">
              {[
                "Disponibilidad de fecha y equipamiento al momento de la consulta.",
                "Confirmación mediante presupuesto formal emitido por la empresa.",
                "Variaciones de precios por temporada, distancia o características especiales del evento.",
                "Depósito de garantía para el alquiler de vajilla y cristalería.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#c9a84c" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              4. Uso aceptable del sitio
            </h2>
            <p>El usuario se compromete a utilizar este sitio de manera lícita y a no:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-5">
              {[
                "Proporcionar datos falsos o de terceros sin su consentimiento en el formulario de contacto.",
                "Reproducir, copiar o distribuir el contenido del sitio sin autorización escrita del titular.",
                "Intentar acceder a áreas restringidas del sitio o a sistemas informáticos asociados.",
                "Usar el sitio para fines ilícitos o contrarios a la moral y al orden público.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#c9a84c" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              5. Propiedad intelectual
            </h2>
            <p>
              Todos los contenidos de este sitio web — incluyendo textos, imágenes, fotografías, videos, logotipos, diseño gráfico y código fuente — son propiedad de Catering Profesional Organización de Eventos o cuentan con licencia de uso correspondiente, y están protegidos por la Ley N° 11.723 de Propiedad Intelectual de la República Argentina.
            </p>
            <p className="mt-3">
              Queda prohibida su reproducción total o parcial sin autorización expresa y por escrito del titular, salvo para uso personal y no comercial.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              6. Limitación de responsabilidad
            </h2>
            <p>
              Catering Profesional Organización de Eventos no se responsabiliza por:
            </p>
            <ul className="mt-3 flex flex-col gap-2 pl-5">
              {[
                "Errores u omisiones en los contenidos del sitio.",
                "Interrupciones o problemas técnicos de acceso al sitio ajenos a su control.",
                "Daños producidos por virus u otros elementos informáticos dañinos introducidos por terceros.",
                "Decisiones tomadas por el usuario basadas exclusivamente en la información orientativa del sitio.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#c9a84c" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              7. Enlaces a terceros
            </h2>
            <p>
              Este sitio puede contener enlaces a sitios externos (Facebook, WhatsApp, AFIP/ARCA, Google Maps). Catering Profesional no controla esos sitios ni se responsabiliza por su contenido, disponibilidad o políticas de privacidad. El acceso a ellos es bajo responsabilidad exclusiva del usuario.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              8. Modificaciones
            </h2>
            <p>
              El titular se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento, sin previo aviso. Los cambios entrarán en vigor desde su publicación en este sitio. El uso continuado del sitio implica la aceptación de los términos vigentes.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              9. Jurisdicción y ley aplicable
            </h2>
            <p>
              Los presentes Términos y Condiciones se rigen por las leyes de la República Argentina. Ante cualquier controversia derivada del uso de este sitio, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la ciudad de San Salvador de Jujuy, Provincia de Jujuy, con renuncia expresa a cualquier otro fuero que pudiera corresponder.
            </p>
          </section>

        </div>

        {/* Volver */}
        <div className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs tracking-widest uppercase transition-colors duration-300 hover:underline"
              style={{ color: "#c9a84c" }}
            >
              ← Volver al sitio principal
            </Link>
            <Link
              href="/politicas-de-privacidad"
              className="text-xs tracking-widest uppercase transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Ver Política de Privacidad →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="text-center py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
          © {new Date().getFullYear()} Catering Profesional Organización de Eventos · CUIT 27-34061402-5
        </p>
      </footer>
    </div>
  );
}
