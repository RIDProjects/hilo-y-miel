"use client";

import { useDesignBuilder, DesignSelections, ColorOption } from "@/hooks/useDesignBuilder";

interface ColorStepProps {
  selections: DesignSelections;
  toggleColor: (colorId: string) => void;
}

export default function ColorStep({ selections, toggleColor }: ColorStepProps) {
  const colorOptions: ColorOption[] = [
    { id: "dorado", name: "Dorado", hex: "#D4AF37" },
    { id: "plateado", name: "Plateado", hex: "#C0C0C0" },
    { id: "rose_gold", name: "Rose Gold", hex: "#B76E79" },
    { id: "cobrizo", name: "Cobrizo", hex: "#B87333" },
    { id: "negro", name: "Negro", hex: "#1A1A1A" },
    { id: "blanco", name: "Blanco", hex: "#F5F5F5" },
    { id: "rojo", name: "Rojo", hex: "#C41E3A" },
    { id: "azul", name: "Azul", hex: "#1E90FF" },
    { id: "verde", name: "Verde", hex: "#2E8B57" },
    { id: "morado", name: "Morado", hex: "#9932CC" },
    { id: "rosa", name: "Rosa", hex: "#FF69B4" },
    { id: "naranja", name: "Naranja", hex: "#FF8C00" },
    { id: "amarillo", name: "Amarillo", hex: "#FFD700" },
    { id: "turquesa", name: "Turquesa", hex: "#40E0D0" },
    { id: "lavanda", name: "Lavanda", hex: "#E6E6FA" },
    { id: "gris", name: "Gris", hex: "#708090" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display text-[var(--color-text)] mb-2">
        Paso 3: Elige los colores
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Selecciona hasta 3 colores ({selections.colors.length}/3 seleccionados)
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {colorOptions.map((color) => {
          const isSelected = selections.colors.includes(color.id);
          return (
            <button
              key={color.id}
              onClick={() => toggleColor(color.id)}
              disabled={!isSelected && selections.colors.length >= 3}
              className={`group flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                isSelected
                  ? "bg-[var(--brand-green)]/10 ring-2 ring-[var(--brand-green)]"
                  : selections.colors.length >= 3
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[var(--color-border)]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  isSelected
                    ? "border-[var(--brand-green)] scale-110"
                    : "border-[var(--color-border)] group-hover:border-[var(--brand-green)]/50"
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-center text-[var(--color-text)]">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      {selections.colors.length > 0 && (
        <div className="mt-6 p-4 bg-[var(--brand-cream-dark)] rounded-lg">
          <p className="text-sm font-medium text-[var(--color-text)] mb-2">
            Colores seleccionados:
          </p>
          <div className="flex gap-2 flex-wrap">
            {selections.colors.map((colorId) => {
              const color = colorOptions.find((c) => c.id === colorId);
              return color ? (
                <span
                  key={colorId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-bg)] rounded-full text-xs"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
