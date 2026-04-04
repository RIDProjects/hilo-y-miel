'use client'

import type { DesignComponents } from '@/types'
import { generateAutoDescription } from '@/lib/utils'

interface DesignSummaryProps {
  components: DesignComponents
}

export function DesignSummary({ components }: DesignSummaryProps) {
  const description = generateAutoDescription(components)

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-card dark:bg-[#1C271C] p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Resumen del Diseño</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Tipo</span>
          <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{components.tipoPieza}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Material</span>
          <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{components.material}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Color</span>
          <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{components.color}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Piedra</span>
          <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{components.piedra}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Tamaño</span>
          <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{components.tamanho}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Estilo</span>
          <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{components.estilo}</span>
        </div>
        
        {components.descripcionManual && (
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
            <span className="text-gray-600 dark:text-gray-400">Notas adicionales:</span>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{components.descripcionManual}</p>
          </div>
        )}
        
        <div className="pt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Descripción:</span>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  )
}