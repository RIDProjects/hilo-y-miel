"use client";

import { motion } from "framer-motion";
import { useDesignBuilder, DesignSelections, CharmType } from "@/hooks/useDesignBuilder";

interface CharmsStepProps {
  selections: DesignSelections;
  toggleCharm: (charmId: string) => void;
}

const CATEGORIES = [
  { id: "naturaleza", label: "Naturaleza", icon: "🌿" },
  { id: "geometrico", label: "Geométrico", icon: "⬡" },
  { id: "letras", label: "Letras", icon: "A" },
  { id: "simbolos", label: "Símbolos", icon: "★" },
];

export default function CharmsStep({ selections, toggleCharm }: CharmsStepProps) {
  const charms: CharmType[] = [
    { id: "flor", name: "Flor", category: "naturaleza", price: 500 },
    { id: "hoja", name: "Hoja", category: "naturaleza", price: 400 },
    { id: "mariposa", name: "Mariposa", category: "naturaleza", price: 600 },
    { id: "pajaro", name: "Pájaro", category: "naturaleza", price: 550 },
    { id: "corazon", name: "Corazón", category: "naturaleza", price: 450 },
    { id: "estrella", name: "Estrella", category: "naturaleza", price: 400 },
    { id: "luna", name: "Luna", category: "naturaleza", price: 500 },
    { id: "sol", name: "Sol", category: "naturaleza", price: 500 },
    { id: "circulo", name: "Círculo", category: "geometrico", price: 300 },
    { id: "cuadrado", name: "Cuadrado", category: "geometrico", price: 300 },
    { id: "triangulo", name: "Triángulo", category: "geometrico", price: 300 },
    { id: "diamante", name: "Diamante", category: "geometrico", price: 700 },
    { id: "a", name: "Letra A", category: "letras", price: 400 },
    { id: "b", name: "Letra B", category: "letras", price: 400 },
    { id: "c", name: "Letra C", category: "letras", price: 400 },
    { id: "corazon_charm", name: "❤️", category: "simbolos", price: 450 },
    { id: "infinito", name: "Infinito", category: "simbolos", price: 500 },
    { id: "peace", name: "Paz", category: "simbolos", price: 400 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display text-[var(--color-text)] mb-2">
        Paso 4: Agrega dijes
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Selecciona hasta 5 dijes ({selections.charms.length}/5 seleccionados)
      </p>

      {CATEGORIES.map((category) => {
        const categoryCharms = charms.filter((c) => c.category === category.id);
        return (
          <div key={category.id} className="mb-6">
            <h3 className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
              <span>{category.icon}</span> {category.label}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {categoryCharms.map((charm) => {
                const isSelected = selections.charms.includes(charm.id);
                return (
                  <motion.button
                    key={charm.id}
                    onClick={() => toggleCharm(charm.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!isSelected && selections.charms.length >= 5}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      isSelected
                        ? "border-[var(--brand-green)] bg-[var(--brand-green)]/5"
                        : selections.charms.length >= 5
                        ? "border-[var(--color-border)] opacity-50 cursor-not-allowed"
                        : "border-[var(--color-border)] hover:border-[var(--brand-green)]/50"
                    }`}
                  >
                    <p className="text-xl mb-1">{charm.name}</p>
                    <p className="text-xs text-[var(--brand-green)]">
                      +${charm.price}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selections.charms.length > 0 && (
        <div className="mt-6 p-4 bg-[var(--brand-cream-dark)] rounded-lg">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">
            Dijes seleccionados:
          </p>
          <div className="flex gap-2 flex-wrap">
            {selections.charms.map((charmId) => {
              const charm = charms.find((c) => c.id === charmId);
              return charm ? (
                <span
                  key={charmId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-bg)] rounded-full text-xs"
                >
                  {charm.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
