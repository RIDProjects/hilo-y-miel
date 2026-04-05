"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X, Filter } from "lucide-react";

export interface FilterState {
  category: string;
  availableOnly: boolean;
  customOnly: boolean;
  search: string;
  sort: "newest" | "price_asc" | "featured";
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: "", label: "Todas" },
  { value: "collar", label: "Collar" },
  { value: "pulsera", label: "Pulsera" },
  { value: "arete", label: "Arete" },
  { value: "anillo", label: "Anillo" },
  { value: "set", label: "Set" },
];

const sortOptions = [
  { value: "newest", label: "Más nuevos" },
  { value: "price_asc", label: "Precio ascendente" },
  { value: "featured", label: "Destacados" },
];

export default function FilterSidebar({ filters, onFiltersChange, isOpen, onClose }: FilterSidebarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Buscar
        </label>
        <div className={`relative transition-shadow duration-300 ${searchFocused ? "shadow-md" : ""}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar por nombre o tags..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--brand-green)] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Categoría
        </label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter("category", cat.value)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                filters.category === cat.value
                  ? "bg-[var(--brand-green)] text-[#FAFAF7]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-border)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Disponibilidad
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => updateFilter("availableOnly", e.target.checked)}
            className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--brand-green)] focus:ring-[var(--brand-green)]"
          />
          <span className="text-sm text-[var(--color-text)]">Solo disponibles</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Tipo
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.customOnly}
            onChange={(e) => updateFilter("customOnly", e.target.checked)}
            className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--brand-green)] focus:ring-[var(--brand-green)]"
          />
          <span className="text-sm text-[var(--color-text)]">Solo diseños personalizados</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          Ordenar por
        </label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter("sort", e.target.value as FilterState["sort"])}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--brand-green)]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
          <h2 className="text-lg font-display text-[var(--color-text)] mb-4">Filtros</h2>
          {filterContent}
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-bg)] z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <h2 className="text-lg font-display text-[var(--color-text)]">Filtros</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-[var(--color-border)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">{filterContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function FilterToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <Filter className="w-4 h-4" />
      Filtros
    </button>
  );
}
