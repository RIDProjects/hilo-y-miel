"use client";

import { motion } from "framer-motion";
import { useDesignBuilder, DesignSelections, SizeType } from "@/hooks/useDesignBuilder";

interface SizeStepProps {
  selections: DesignSelections;
  updateSelections: (updates: Partial<DesignSelections>) => void;
  sizeOptions: SizeType[];
}

export default function SizeStep({ selections, updateSelections, sizeOptions }: SizeStepProps) {
  const formatLabel = (option: SizeType) => {
    return option.label;
  };

  return (
    <div>
      <h2 className="text-2xl font-display text-[var(--color-text)] mb-6">
        Paso 5: Define la medida
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
          Talla {selections.type === "collar" && "(longitud)"}
          {selections.type === "pulsera" && "(circunferencia)"}
          {selections.type === "arete" && "(tamaño)"}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sizeOptions.map((option) => {
            const isSelected = selections.size === option.value;
            return (
              <motion.button
                key={option.value}
                onClick={() => updateSelections({ size: option.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected
                    ? "border-[var(--brand-green)] bg-[var(--brand-green)]/5"
                    : "border-[var(--color-border)] hover:border-[var(--brand-green)]/50"
                }`}
              >
                <p className="font-medium text-[var(--color-text)]">{formatLabel(option)}</p>
                {option.priceModifier > 0 && (
                  <p className="text-sm text-[var(--brand-green)]">
                    +${option.priceModifier.toLocaleString("es-AR")}
                  </p>
                )}
                {option.priceModifier === 0 && selections.size !== option.value && (
                  <p className="text-xs text-[var(--color-text-muted)]">Base</p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Notas adicionales (opcional)
        </label>
        <textarea
          value={selections.notes}
          onChange={(e) => updateSelections({ notes: e.target.value })}
          placeholder="¿Alguna especificación especial? Por ejemplo:&quot;Quiero la inicial M en cursiva&quot;"
          rows={4}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
