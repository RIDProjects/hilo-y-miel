"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[var(--brand-cream)]">
      <div className="paper-texture" />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
        <Logo className="w-[500px] h-auto" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[56px] text-[var(--brand-green)] leading-tight mb-6">
            Bisutería hecha con intención
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-[var(--color-text-muted)] font-body mb-10"
        >
          Piezas únicas o diseñadas por ti
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/catalogo"
            className="px-8 py-3 bg-[var(--brand-green)] text-[#FAFAF7] rounded-md hover:bg-[var(--brand-green-mid)] transition-colors font-body text-lg shadow-md hover:shadow-lg"
          >
            Ver colección
          </Link>
          <Link
            href="/disena-tu-pieza"
            className="px-8 py-3 border-1.5 border-[var(--brand-green)] text-[var(--brand-green)] rounded-md hover:bg-[var(--brand-green)]/5 transition-colors font-body text-lg"
            style={{ borderWidth: "1.5px" }}
          >
            Diseña tu pieza
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[var(--color-text-muted)] flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
