"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  const whatsappNumber = "5491155555555";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] py-12 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center gap-6">
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

        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Hilo & Miel. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}