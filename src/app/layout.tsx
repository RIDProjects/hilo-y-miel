import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Font Display - Títulos grandes (como el logo)
const cormorantItalic = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "italic",
});

const cormorantRegular = Cormorant_Garamond({
  variable: "--font-display-regular",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Font Body - Interfaz y textos
const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Font Mono - Admin, IDs
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hilo & Miel | Bisutería Artesanal",
  description: "Bisutería artesanal - Piezas únicas y diseños personalizados",
  keywords: ["bisutería", "artesanal", "joyas", "diseño personalizado", "collar", "pulsera", "aros"],
  authors: [{ name: "Hilo & Miel" }],
  openGraph: {
    title: "Hilo & Miel | Bisutería Artesanal",
    description: "Bisutería artesanal - Diseños únicos y personalizados",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorantItalic.variable} ${cormorantRegular.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-cream dark:bg-[#121A12] text-brand-drop dark:text-cream antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}