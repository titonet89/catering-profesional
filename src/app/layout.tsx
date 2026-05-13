import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Catering Profesional Jujuy | Eventos & Gastronomía de Autor",
  other: {
    copyright: "© Catering Profesional Organización de Eventos — Obra registrada. CUIT 27-34061402-5",
  },
  description:
    "Bodas, eventos corporativos, galas, cumpleaños y más. Catering premium en Jujuy y el NOA con menús exclusivos y servicio impecable.",
  keywords: "catering, eventos, bodas, corporativo, quinceañeros, Jujuy, NOA, gastronomía, alquiler vajilla",
  metadataBase: new URL("https://www.cateringprofesional.com.ar"),
  openGraph: {
    title: "Catering Profesional Jujuy | Eventos & Gastronomía de Autor",
    description:
      "Bodas, eventos corporativos, galas y más. Catering premium en Jujuy y el NOA con menús exclusivos y servicio impecable.",
    url: "https://www.cateringprofesional.com.ar",
    siteName: "Catering Profesional Jujuy",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catering Profesional Jujuy | Eventos & Gastronomía de Autor",
    description:
      "Bodas, eventos corporativos, galas y más. Catering premium en Jujuy y el NOA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
