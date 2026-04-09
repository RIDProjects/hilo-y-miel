"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491155555555";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] py-12 mt-20 relative overflow-hidden">
      {/* Logo watermark — fondo del footer, spec: 3–5% dark / 4–6% light */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-end overflow-hidden"
        aria-hidden="true"
      >
        <Logo className="w-[420px] h-auto mr-[-60px] opacity-[0.045] dark:opacity-[0.035]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Logo className="h-20 w-auto" />
          <p className="font-display text-lg italic text-[var(--color-text-muted)]">
            Bisutería hecha con intención
          </p>
        </div>

        {/* WhatsApp CTA */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-[#FAFAF7] rounded-lg hover:bg-[var(--brand-green-mid)] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Escribinos en WhatsApp</span>
          </Link>
          <p className="text-sm text-[var(--color-text-muted)]">
            Respondemos rápido
          </p>
        </div>

        <div className="border-t border-[var(--color-border)] pt-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Hilo &amp; Miel. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
