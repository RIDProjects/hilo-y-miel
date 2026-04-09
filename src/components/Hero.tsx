"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/Logo";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const duration = shouldReduceMotion ? 0 : 0.8;
  const ease = "easeOut";

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      <div className="paper-texture" />

      {/* Logo watermark — centrado, 4–6% opacidad */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
          aria-hidden="true"
        >
          <Logo className="w-[600px] h-auto" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease }}
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[56px] text-[var(--brand-green)] leading-tight mb-6">
            Bisutería hecha con intención
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.2, ease }}
          className="text-lg md:text-xl text-[var(--color-text-muted)] font-body mb-10"
        >
          Piezas únicas o diseñadas por ti
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.4, ease }}
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
            className="px-8 py-3 border-[var(--brand-green)] text-[var(--brand-green)] rounded-md hover:bg-[rgba(44,74,46,0.06)] transition-colors font-body text-lg"
            style={{ borderWidth: "1.5px", borderStyle: "solid" }}
          >
            Diseña tu pieza
          </Link>
        </motion.div>
      </div>

      {!shouldReduceMotion && (
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
      )}
    </section>
  );
}
