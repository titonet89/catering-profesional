import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | Catering Profesional Jujuy",
  description: "Política de privacidad y tratamiento de datos personales de Catering Profesional, conforme a la Ley 25.326 de la República Argentina.",
};

export default function PoliticasDePrivacidad() {
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
            Política de Privacidad
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Última actualización: mayo de 2025 · Conforme a la Ley N° 25.326 de Protección de Datos Personales (Argentina)
          </p>
        </div>

        <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>

          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              1. Responsable del tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos personales recolectados a través de este sitio web es:
            </p>
            <div className="mt-4 pl-5" style={{ borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
              <p><strong className="text-white">Nombre de fantasía:</strong> Catering Profesional Organización de Eventos</p>
              <p className="mt-1"><strong className="text-white">CUIT/CUIL:</strong> 27-34061402-5</p>
              <p className="mt-1"><strong className="text-white">Domicilio:</strong> Av. Eva Perón N° 2278, B° San Pedrito, San Salvador de Jujuy, Jujuy, Argentina</p>
              <p className="mt-1"><strong className="text-white">Correo electrónico:</strong> cateringprofesionaljujuy@gmail.com</p>
              <p className="mt-1"><strong className="text-white">Teléfono:</strong> +54 388 403-6629</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              2. Datos personales que recolectamos
            </h2>
            <p>
              A través del formulario de contacto de este sitio web recolectamos los siguientes datos personales que usted nos proporciona voluntariamente:
            </p>
            <ul className="mt-3 flex flex-col gap-2 pl-5">
              {[
                "Nombre completo",
                "Dirección de correo electrónico",
                "Tipo de evento de interés",
                "Mensaje o consulta libre",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#c9a84c" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              No recolectamos datos sensibles en los términos del artículo 2° de la Ley 25.326, ni datos de menores de edad.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              3. Finalidad del tratamiento
            </h2>
            <p>Los datos recolectados se utilizan exclusivamente para:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-5">
              {[
                "Responder su consulta o solicitud de presupuesto.",
                "Coordinar el servicio de catering o alquiler de vajilla solicitado.",
                "Enviarle información relacionada con el evento que nos consultó.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#c9a84c" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              No utilizamos sus datos con fines publicitarios ni los cedemos a terceros para fines comerciales.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              4. Servicios de terceros que procesan sus datos
            </h2>
            <p>
              Para el funcionamiento técnico del sitio y la gestión de consultas, utilizamos los siguientes servicios de terceros, cada uno con sus propias políticas de privacidad:
            </p>
            <ul className="mt-3 flex flex-col gap-3 pl-5">
              <li className="flex items-start gap-2">
                <span style={{ color: "#c9a84c" }}>✦</span>
                <span><strong className="text-white">Supabase</strong> (supabase.com) — almacenamiento de las consultas recibidas por el formulario de contacto.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#c9a84c" }}>✦</span>
                <span><strong className="text-white">Resend</strong> (resend.com) — envío de notificaciones por correo electrónico al responsable cuando se recibe una consulta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#c9a84c" }}>✦</span>
                <span><strong className="text-white">Vercel</strong> (vercel.com) — hospedaje del sitio web.</span>
              </li>
            </ul>
            <p className="mt-3">
              Estos proveedores actúan como encargados del tratamiento y están sujetos a acuerdos de confidencialidad. Sus servidores pueden estar ubicados fuera de Argentina.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              5. Plazo de conservación
            </h2>
            <p>
              Sus datos se conservan por el tiempo necesario para gestionar su consulta y, en caso de contratación, durante el plazo legal correspondiente según la normativa argentina vigente. Si no existe contratación, los datos son eliminados dentro de los 12 meses de recibida la consulta.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              6. Derechos del titular (ARCO)
            </h2>
            <p>
              De acuerdo con el artículo 14° de la Ley 25.326, usted tiene derecho a:
            </p>
            <ul className="mt-3 flex flex-col gap-2 pl-5">
              {[
                "Acceso: conocer qué datos suyos tenemos almacenados.",
                "Rectificación: solicitar la corrección de datos inexactos o incompletos.",
                "Cancelación (supresión): solicitar la eliminación de sus datos personales.",
                "Oposición: oponerse al tratamiento de sus datos en determinadas circunstancias.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#c9a84c" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 px-5 py-4 text-xs" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <strong className="text-white">Aviso legal:</strong> La Dirección Nacional de Protección de Datos Personales (DNPDP) tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              7. Cómo ejercer sus derechos
            </h2>
            <p>
              Para ejercer cualquiera de los derechos mencionados, puede contactarnos por cualquiera de las siguientes vías:
            </p>
            <div className="mt-4 pl-5" style={{ borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
              <p><strong className="text-white">Email:</strong> cateringprofesionaljujuy@gmail.com</p>
              <p className="mt-1"><strong className="text-white">Teléfono:</strong> +54 388 403-6629</p>
              <p className="mt-1"><strong className="text-white">Domicilio:</strong> Av. Eva Perón N° 2278, B° San Pedrito, Jujuy</p>
            </div>
            <p className="mt-3">
              Responderemos su solicitud dentro de los plazos establecidos por la Ley 25.326 (no más de 10 días hábiles para el derecho de acceso).
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              8. Cookies y tecnologías de seguimiento
            </h2>
            <p>
              Este sitio web no utiliza cookies propias de seguimiento ni publicidad. Los servicios de terceros mencionados (Vercel, Supabase) pueden utilizar cookies técnicas necesarias para el funcionamiento. No se realiza seguimiento de navegación con fines comerciales.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              9. Modificaciones de esta política
            </h2>
            <p>
              Podemos actualizar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta misma página con la fecha de última actualización. Le recomendamos revisarla periódicamente.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3 tracking-wide">
              10. Jurisdicción y ley aplicable
            </h2>
            <p>
              Esta política se rige por la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y sus normas complementarias. Ante cualquier controversia, serán competentes los tribunales ordinarios de la ciudad de San Salvador de Jujuy, Provincia de Jujuy, Argentina.
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
              href="/terminos-y-condiciones"
              className="text-xs tracking-widest uppercase transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Ver Términos y Condiciones →
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
