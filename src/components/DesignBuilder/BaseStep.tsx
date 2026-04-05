"use client";

import { motion } from "framer-motion";
import { useDesignBuilder, DesignSelections, BaseOption } from "@/hooks/useDesignBuilder";

interface BaseStepProps {
  selections: DesignSelections;
  updateSelections: (updates: Partial<DesignSelections>) => void;
}

export default function BaseStep({ selections, updateSelections }: BaseStepProps) {
  const baseOptions: BaseOption[] = [
    { id: "argolla", name: "Argolla", description: "Argolla clásica de cierre", basePrice: 2500 },
    { id: "cadena", name: "Cadena", description: "Cadena elegante de eslabones", basePrice: 3000 },
    { id: "aro", name: "Aro", description: "Aro sutil y sofisticado", basePrice: 2000 },
    { id: "tejido", name: "Tejido", description: "Tejido artesanal tejido a mano", basePrice: 3500 },
    { id: "hilo_encerado", name: "Hilo Encerado", description: "Hilo encerado resistente y versátil", basePrice: 1500 },
  ];

  const typeOptions: { id: DesignSelections["type"]; label: string }[] = [
    { id: "collar", label: "Collar" },
    { id: "pulsera", label: "Pulsera" },
    { id: "arete", label: "Arete" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display text-[var(--color-text)] mb-6">
        Paso 1: Elige el tipo de pieza
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Tipo de accesorio
        </label>
        <div className="flex gap-2">
          {typeOptions.map((type) => (
            <button
              key={type.id}
              onClick={() => updateSelections({ type: type.id, base: null, size: null })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selections.type === type.id
                  ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)]"
                  : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--brand-green)]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {baseOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => updateSelections({ base: option.id })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selections.base === option.id
                ? "border-[var(--brand-green)] bg-[var(--brand-green)]/5"
                : "border-[var(--color-border)] hover:border-[var(--brand-green)]/50"
            }`}
          >
            <div className="w-full aspect-square bg-[var(--brand-cream-dark)] rounded-lg mb-3 flex items-center justify-center">
              <span className="text-4xl">
                {option.id === "argolla" && "○"}
                {option.id === "cadena" && "🔗"}
                {option.id === "aro" && "◐"}
                {option.id === "tejido" && "🧶"}
                {option.id === "hilo_encerado" && "🧵"}
              </span>
            </div>
            <h3 className="font-medium text-[var(--color-text)]">{option.name}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{option.description}</p>
            <p className="text-sm font-medium text-[var(--brand-green)] mt-1">
              +${option.basePrice.toLocaleString("es-AR")}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
