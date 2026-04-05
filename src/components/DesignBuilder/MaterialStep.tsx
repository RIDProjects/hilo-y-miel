"use client";

import { motion } from "framer-motion";
import { useDesignBuilder, DesignSelections, MaterialOption } from "@/hooks/useDesignBuilder";

interface MaterialStepProps {
  selections: DesignSelections;
  updateSelections: (updates: Partial<DesignSelections>) => void;
}

export default function MaterialStep({ selections, updateSelections }: MaterialStepProps) {
  const materialOptions: MaterialOption[] = [
    { id: "plata_925", name: "Plata 925", description: "Plata esterlina de alta calidad", priceModifier: 0 },
    { id: "banado_oro", name: "Bañado en Oro", description: "Baño de oro 18k sobre base", priceModifier: 1500 },
    { id: "cobre", name: "Cobre", description: "Cobre natural con acabado", priceModifier: 500 },
    { id: "acero_inoxidable", name: "Acero Inoxidable", description: "Acero quirúrgico resistente", priceModifier: 800 },
    { id: "chapa_oro", name: "Chapa de Oro", description: "Chapa de oro 14k", priceModifier: 1000 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display text-[var(--color-text)] mb-6">
        Paso 2: Selecciona el material
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {materialOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => updateSelections({ material: option.id })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selections.material === option.id
                ? "border-[var(--brand-green)] bg-[var(--brand-green)]/5"
                : "border-[var(--color-border)] hover:border-[var(--brand-green)]/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-[var(--color-text)]">{option.name}</h3>
              {option.priceModifier > 0 && (
                <span className="text-sm font-medium text-[var(--brand-green)]">
                  +${option.priceModifier.toLocaleString("es-AR")}
                </span>
              )}
              {option.priceModifier === 0 && (
                <span className="text-sm text-[var(--color-text-muted)]">Base</span>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{option.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
