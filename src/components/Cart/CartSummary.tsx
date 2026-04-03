'use client'

import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export function CartSummary() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const hasCustom = useCartStore((state) => state.hasCustomDesigns())

  if (items.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-card dark:bg-[#242B24] p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Resumen del Carrito</h3>

      <div className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total de items:</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">{items.length}</span>
        </div>
        
        {hasCustom && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Incluye:</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">Diseño personalizado</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <span className="font-medium text-gray-800 dark:text-gray-200">Subtotal:</span>
        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
          {subtotal > 0 ? formatPrice(subtotal) : 'A confirmar'}
        </span>
      </div>

      {hasCustom && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          * Los diseños personalizados tienen precio a confirmar por el vendedor
        </p>
      )}

      <Link
        href="/checkout"
        className="mt-4 block w-full rounded-lg bg-amber-500 dark:bg-amber-600 px-4 py-3 text-center font-medium text-white hover:bg-amber-600 dark:hover:bg-amber-700"
      >
        Proceder al Checkout
      </Link>
    </div>
  )
}