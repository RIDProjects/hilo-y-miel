"use client";

import { motion } from "framer-motion";
import { Sparkles, Palette, Package } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Elige tu pieza",
    description: "Explora nuestra colección de piezas únicas diseñadas a mano",
  },
  {
    icon: Palette,
    title: "Personaliza",
    description: "Agrega tu toque personal: colores, charms y materiales",
  },
  {
    icon: Package,
    title: "Recibe tu pedido",
    description: "Recibe tu bisutería artesanal en la comodidad de tu hogar",
  },
];

export default function StepsHowItWorks() {
  return (
    <section className="py-20 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-display text-center text-[var(--color-text)] mb-12"
        >
          ¿Cómo funciona?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-[var(--brand-green)]" />
              </div>
              <h3 className="text-xl font-display text-[var(--color-text)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] font-body">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-16 h-px bg-[var(--color-border)]" style={{ left: `calc(33.33% * ${index} + 33.33% / 2 + 60px)` }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
