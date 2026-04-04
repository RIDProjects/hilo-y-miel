'use client'

import type { 
  DesignComponents, 
  TipoPieza, 
  Material, 
  Color, 
  Piedra, 
  Tamanho, 
  Estilo 
} from '@/types'
import {
  TIPO_PIEZA_OPTIONS,
  MATERIAL_OPTIONS,
  COLOR_OPTIONS,
  PIEDRA_OPTIONS,
  TAMANHO_OPTIONS,
  ESTILO_OPTIONS,
} from '@/types'

interface ComponentSelectorProps {
  components: DesignComponents
  onChange: (components: DesignComponents) => void
}

export function ComponentSelector({ components, onChange }: ComponentSelectorProps) {
  const updateComponent = <K extends keyof DesignComponents>(
    key: K,
    value: DesignComponents[K]
  ) => {
    onChange({ ...components, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Tipo de Pieza */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de Pieza
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIPO_PIEZA_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateComponent('tipoPieza', option.value as TipoPieza)}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                components.tipoPieza === option.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C271C] text-gray-700 dark:text-gray-300 hover:border-amber-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Material
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MATERIAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateComponent('material', option.value as Material)}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                components.material === option.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C271C] text-gray-700 dark:text-gray-300 hover:border-amber-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color/Acabado */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Color / Acabado
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {COLOR_OPTIONS.map((option) => {
            const colorMap: Record<string, string> = {
              dorado: 'bg-yellow-400',
              plateado: 'bg-gray-300',
              rosegold: 'bg-rose-300',
              cobrizo: 'bg-orange-400',
              negro: 'bg-gray-800',
            }
            return (
              <button
                key={option.value}
                onClick={() => updateComponent('color', option.value as Color)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                  components.color === option.value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C271C] text-gray-700 dark:text-gray-300 hover:border-amber-300'
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${colorMap[option.value]}`} />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Piedra */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Piedra (opcional)
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PIEDRA_OPTIONS.map((option) => {
            const stoneColors: Record<string, string> = {
              ninguna: 'bg-gray-200 dark:bg-gray-600',
              circonia: 'bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800',
              nacar: 'bg-rose-100 dark:bg-rose-900',
              jade: 'bg-green-300 dark:bg-green-800',
              turquesa: 'bg-teal-300 dark:bg-teal-800',
              coral: 'bg-red-300 dark:bg-red-800',
            }
            return (
              <button
                key={option.value}
                onClick={() => updateComponent('piedra', option.value as Piedra)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                  components.piedra === option.value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C271C] text-gray-700 dark:text-gray-300 hover:border-amber-300'
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${stoneColors[option.value]}`} />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tamaño */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tamaño
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TAMANHO_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateComponent('tamanho', option.value as Tamanho)}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                components.tamanho === option.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C271C] text-gray-700 dark:text-gray-300 hover:border-amber-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estilo */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Estilo
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ESTILO_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateComponent('estilo', option.value as Estilo)}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                components.estilo === option.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C271C] text-gray-700 dark:text-gray-300 hover:border-amber-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}