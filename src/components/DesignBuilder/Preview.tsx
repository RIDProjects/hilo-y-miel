"use client";

import { motion } from "framer-motion";
import { RotateCcw, Palette, Gem, Ruler } from "lucide-react";
import { useDesignBuilder, DesignSelections } from "@/hooks/useDesignBuilder";

interface PreviewProps {
  selections: DesignSelections;
  calculatePrice: () => number;
  updateSelections: (updates: Partial<DesignSelections>) => void;
}

export default function Preview({ selections, calculatePrice, updateSelections }: PreviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const baseLabels: Record<string, string> = {
    argolla: "Argolla",
    cadena: "Cadena",
    aro: "Aro",
    tejido: "Tejido",
    hilo_encerado: "Hilo Encerado",
  };

  const materialLabels: Record<string, string> = {
    plata_925: "Plata 925",
    banado_oro: "Bañado en Oro",
    cobre: "Cobre",
    acero_inoxidable: "Acero Inoxidable",
    chapa_oro: "Chapa de Oro",
  };

  const colorOptions = [
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

  const charms = [
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

  const typeLabel = selections.type === "collar" ? "Collar" : selections.type === "pulsera" ? "Pulsera" : "Arete";

  const renderVisual = () => {
    const baseEmoji =
      selections.base === "argolla" ? "○" :
      selections.base === "cadena" ? "🔗" :
      selections.base === "aro" ? "◐" :
      selections.base === "tejido" ? "🧶" : "🧵";

    const materialColor = selections.material === "plata_925" ? "#C0C0C0" :
      selections.material === "banado_oro" || selections.material === "chapa_oro" ? "#D4AF37" :
      selections.material === "cobre" ? "#B87333" :
      selections.material === "acero_inoxidable" ? "#708090" : "#C0C0C0";

    return (
      <div className="relative w-full aspect-square bg-[var(--brand-cream-dark)] rounded-xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="text-8xl transition-all duration-300"
            style={{ color: materialColor, filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }}
          >
            {baseEmoji}
          </div>
          
          {selections.charms.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center max-w-[150px]">
              {selections.charms.slice(0, 3).map((charmId) => {
                const charm = charms.find(c => c.id === charmId);
                return charm ? (
                  <span key={charmId} className="text-2xl">{charm.name}</span>
                ) : null;
              })}
              {selections.charms.length > 3 && (
                <span className="text-sm text-[var(--color-text-muted)]">+{selections.charms.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const hasSelections = selections.base || selections.material || selections.colors.length > 0 || selections.charms.length > 0 || selections.size;

  return (
    <div className="sticky top-8">
      <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h3 className="font-display text-lg text-[var(--color-text)]">Vista Previa</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{typeLabel} personalizado</p>
        </div>

        <div className="p-4">
          {renderVisual()}
        </div>

        <div className="p-4 border-t border-[var(--color-border)] space-y-3">
          {selections.base && (
            <div className="flex items-start gap-2">
              <Ruler className="w-4 h-4 mt-0.5 text-[var(--brand-green)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Base</p>
                <p className="text-sm text-[var(--color-text)]">{baseLabels[selections.base]}</p>
              </div>
            </div>
          )}

          {selections.material && (
            <div className="flex items-start gap-2">
              <Gem className="w-4 h-4 mt-0.5 text-[var(--brand-green)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Material</p>
                <p className="text-sm text-[var(--color-text)]">{materialLabels[selections.material]}</p>
              </div>
            </div>
          )}

          {selections.colors.length > 0 && (
            <div className="flex items-start gap-2">
              <Palette className="w-4 h-4 mt-0.5 text-[var(--brand-green)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Colores</p>
                <div className="flex gap-1 mt-1">
                  {selections.colors.map((colorId) => {
                    const color = colorOptions.find(c => c.id === colorId);
                    return color ? (
                      <span
                        key={colorId}
                        className="w-4 h-4 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {selections.charms.length > 0 && (
            <div className="flex items-start gap-2">
              <Gem className="w-4 h-4 mt-0.5 text-[var(--brand-green)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Dijes ({selections.charms.length})</p>
                <p className="text-sm text-[var(--color-text)]">
                  {selections.charms.map(id => charms.find(c => c.id === id)?.name).join(", ")}
                </p>
              </div>
            </div>
          )}

          {selections.size && (
            <div className="flex items-start gap-2">
              <Ruler className="w-4 h-4 mt-0.5 text-[var(--brand-green)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Tamaño</p>
                <p className="text-sm text-[var(--color-text)]">{selections.size}cm</p>
              </div>
            </div>
          )}

          {!hasSelections && (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
              Comienza a seleccionar opciones para ver el preview
            </p>
          )}
        </div>

        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--brand-cream-dark)]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-text-muted)]">Precio estimado</span>
            <span className="text-2xl font-medium text-[var(--brand-green)]">
              {formatPrice(calculatePrice())}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => updateSelections({ base: null, material: null, colors: [], charms: [], size: null, notes: "" })}
        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reiniciar diseño
      </button>
    </div>
  );
}
