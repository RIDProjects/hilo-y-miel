"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useDesignBuilder } from "@/hooks/useDesignBuilder";
import BaseStep from "./BaseStep";
import MaterialStep from "./MaterialStep";
import ColorStep from "./ColorStep";
import CharmsStep from "./CharmsStep";
import SizeStep from "./SizeStep";
import Preview from "./Preview";

const STEPS = [
  { title: "Base", subtitle: "Elige el tipo de pieza" },
  { title: "Material", subtitle: "Selecciona el material" },
  { title: "Colores", subtitle: "Hasta 3 colores" },
  { title: "Dijes", subtitle: "Agrega dijes (máx 5)" },
  { title: "Tamaño", subtitle: "Define la medida" },
];

export default function Stepper() {
  const {
    selections,
    updateSelections,
    toggleColor,
    toggleCharm,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    calculatePrice,
    getSizeOptions,
    isLoaded,
  } = useDesignBuilder();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-green)]"></div>
      </div>
    );
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selections.base !== null;
      case 1:
        return selections.material !== null;
      case 2:
        return selections.colors.length > 0;
      case 3:
        return true;
      case 4:
        return selections.size !== null;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BaseStep selections={selections} updateSelections={updateSelections} />;
      case 1:
        return <MaterialStep selections={selections} updateSelections={updateSelections} />;
      case 2:
        return <ColorStep selections={selections} toggleColor={toggleColor} />;
      case 3:
        return <CharmsStep selections={selections} toggleCharm={toggleCharm} />;
      case 4:
        return (
          <SizeStep
            selections={selections}
            updateSelections={updateSelections}
            sizeOptions={getSizeOptions(selections.type)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-[var(--color-text)] mb-2">
            Diseña Tu Pieza
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Crea un accesorio único personalizado a tu gusto
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-border)] -translate-y-1/2 hidden sm:block" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-[var(--brand-green)] -translate-y-1/2 hidden sm:block transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
                <div className="relative flex justify-between w-full sm:px-2">
                  {STEPS.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`flex flex-col items-center gap-2 p-2 transition-all ${
                        index <= currentStep
                          ? "text-[var(--brand-green)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          index < currentStep
                            ? "bg-[var(--brand-green)] border-[var(--brand-green)] text-white"
                            : index === currentStep
                            ? "bg-[var(--brand-cream)] border-[var(--brand-green)] text-[var(--brand-green)]"
                            : "bg-[var(--color-bg)] border-[var(--color-border)]"
                        }`}
                      >
                        {index < currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6 sm:hidden">
              <p className="text-sm text-[var(--color-text-muted)]">
                Paso {currentStep + 1} de 5: {STEPS[currentStep].title}
              </p>
              <div className="w-full h-2 bg-[var(--color-border)] rounded-full mt-2">
                <div
                  className="h-full bg-[var(--brand-green)] rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentStep === 0
                      ? "text-[var(--color-text-muted)] cursor-not-allowed"
                      : "text-[var(--color-text)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                      canProceed()
                        ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-mid)]"
                        : "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
                    }`}
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      localStorage.setItem("hilo-y-miel-design", JSON.stringify(selections));
                      window.location.href = "/confirmar-pedido";
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-mid)] transition-all"
                  >
                    Continuar al Pedido
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-80">
            <Preview
              selections={selections}
              calculatePrice={calculatePrice}
              updateSelections={updateSelections}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
