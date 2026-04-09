import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hilo & Miel | Bisutería Artesanal",
  description: "Bisutería artesanal hecha a mano",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable} ${greatVibes.variable} font-body`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}