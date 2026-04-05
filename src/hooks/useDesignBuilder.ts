"use client";

import { useState, useEffect, useCallback } from "react";

export type BaseType = "argolla" | "cadena" | "aro" | "tejido" | "hilo_encerado";

export type MaterialType = "plata_925" | "banado_oro" | "cobre" | "acero_inoxidable" | "chapa_oro";

export type CharmCategory = "naturaleza" | "geometrico" | "letras" | "simbolos";

export type CharmType = {
  id: string;
  name: string;
  category: CharmCategory;
  price: number;
  image?: string;
};

export type SizeType = {
  label: string;
  value: string;
  priceModifier: number;
};

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface DesignSelections {
  base: BaseType | null;
  material: MaterialType | null;
  colors: string[];
  charms: string[];
  size: string | null;
  notes: string;
  type: "collar" | "pulsera" | "arete";
}

export interface BaseOption {
  id: BaseType;
  name: string;
  description: string;
  image?: string;
  basePrice: number;
}

export interface MaterialOption {
  id: MaterialType;
  name: string;
  description: string;
  priceModifier: number;
}

const BASE_OPTIONS: BaseOption[] = [
  { id: "argolla", name: "Argolla", description: "Argolla clásica de cierre", basePrice: 2500 },
  { id: "cadena", name: "Cadena", description: "Cadena elegante de eslabones", basePrice: 3000 },
  { id: "aro", name: "Aro", description: "Aro sutil y sofisticado", basePrice: 2000 },
  { id: "tejido", name: "Tejido", description: "Tejido artesanal tejido a mano", basePrice: 3500 },
  { id: "hilo_encerado", name: "Hilo Encerado", description: "Hilo encerado resistente y versátil", basePrice: 1500 },
];

const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "plata_925", name: "Plata 925", description: "Plata esterlina de alta calidad", priceModifier: 0 },
  { id: "banado_oro", name: "Bañado en Oro", description: "Baño de oro 18k sobre base", priceModifier: 1500 },
  { id: "cobre", name: "Cobre", description: "Cobre natural con acabado", priceModifier: 500 },
  { id: "acero_inoxidable", name: "Acero Inoxidable", description: "Acero quirúrgico resistente", priceModifier: 800 },
  { id: "chapa_oro", name: "Chapa de Oro", description: "Chapa de oro 14k", priceModifier: 1000 },
];

const COLOR_OPTIONS: ColorOption[] = [
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

const CHARMS: CharmType[] = [
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

const COLLAR_SIZES: SizeType[] = [
  { label: "40cm", value: "40", priceModifier: 0 },
  { label: "45cm", value: "45", priceModifier: 200 },
  { label: "50cm", value: "50", priceModifier: 400 },
  { label: "55cm", value: "55", priceModifier: 600 },
  { label: "Personalizado", value: "custom", priceModifier: 800 },
];

const PULSERA_SIZES: SizeType[] = [
  { label: "XS (14cm)", value: "14", priceModifier: 0 },
  { label: "S (16cm)", value: "16", priceModifier: 0 },
  { label: "M (18cm)", value: "18", priceModifier: 0 },
  { label: "L (20cm)", value: "20", priceModifier: 0 },
  { label: "Personalizado", value: "custom", priceModifier: 500 },
];

const ARETE_SIZES: SizeType[] = [
  { label: "Estándar", value: "standard", priceModifier: 0 },
  { label: "Grande", value: "large", priceModifier: 300 },
];

const STORAGE_KEY = "hilo-y-miel-design";

const initialSelections: DesignSelections = {
  base: null,
  material: null,
  colors: [],
  charms: [],
  size: null,
  notes: "",
  type: "collar",
};

export function useDesignBuilder() {
  const [selections, setSelections] = useState<DesignSelections>(initialSelections);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSelections(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading design from storage:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    }
  }, [selections, isLoaded]);

  const updateSelections = useCallback((updates: Partial<DesignSelections>) => {
    setSelections((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleColor = useCallback((colorId: string) => {
    setSelections((prev) => {
      const isSelected = prev.colors.includes(colorId);
      if (isSelected) {
        return { ...prev, colors: prev.colors.filter((c) => c !== colorId) };
      }
      if (prev.colors.length >= 3) {
        return prev;
      }
      return { ...prev, colors: [...prev.colors, colorId] };
    });
  }, []);

  const toggleCharm = useCallback((charmId: string) => {
    setSelections((prev) => {
      const isSelected = prev.charms.includes(charmId);
      if (isSelected) {
        return { ...prev, charms: prev.charms.filter((c) => c !== charmId) };
      }
      if (prev.charms.length >= 5) {
        return prev;
      }
      return { ...prev, charms: [...prev.charms, charmId] };
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 4)));
  }, []);

  const reset = useCallback(() => {
    setSelections(initialSelections);
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const calculatePrice = useCallback(() => {
    let total = 0;

    const base = BASE_OPTIONS.find((b) => b.id === selections.base);
    if (base) total += base.basePrice;

    const material = MATERIAL_OPTIONS.find((m) => m.id === selections.material);
    if (material) total += material.priceModifier;

    const sizeOptions = getSizeOptions(selections.type);
    const size = sizeOptions.find((s) => s.value === selections.size);
    if (size) total += size.priceModifier;

    selections.charms.forEach((charmId) => {
      const charm = CHARMS.find((c) => c.id === charmId);
      if (charm) total += charm.price;
    });

    return total;
  }, [selections]);

  const getSizeOptions = (type: DesignSelections["type"]) => {
    switch (type) {
      case "collar":
        return COLLAR_SIZES;
      case "pulsera":
        return PULSERA_SIZES;
      case "arete":
        return ARETE_SIZES;
      default:
        return COLLAR_SIZES;
    }
  };

  return {
    selections,
    updateSelections,
    toggleColor,
    toggleCharm,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
    calculatePrice,
    getSizeOptions,
    isLoaded,
    BASE_OPTIONS,
    MATERIAL_OPTIONS,
    COLOR_OPTIONS,
    CHARMS,
  };
}