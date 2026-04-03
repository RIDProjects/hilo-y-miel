'use client'

interface ManualDescriptionProps {
  description: string
  onChange: (description: string) => void
}

export function ManualDescription({ description, onChange }: ManualDescriptionProps) {
  return (
    <div>
      <label
        htmlFor="description"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Descripción adicional (opcional)
      </label>
      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Agrega notas especiales para el vendedor: preferencias, uso específico, regalo, etc.
      </p>
      <textarea
        id="description"
        value={description}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: Lo quiero para regalo de cumpleaños, tema de colores pastel..."
        rows={4}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-sm bg-white dark:bg-[#2D352D] text-gray-900 dark:text-gray-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
    </div>
  )
}