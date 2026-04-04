'use client'

import Image from 'next/image'
import type { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

interface CheckoutSummaryProps {
  items: CartItem[]
}

export function CheckoutSummary({ items }: CheckoutSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasCustom = items.some((item) => item.type === 'custom')

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-card dark:bg-[#1C271C] p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Resumen del Pedido</h3>

      <div className="max-h-64 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              {item.type === 'custom' && item.customDesign?.imageDataUrl ? (
                <img
                  src={item.customDesign.imageDataUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.type === 'custom' ? 'Diseño personalizado' : `Cantidad: ${item.quantity}`}
              </p>
            </div>
            <div className="text-right">
              <span className={item.price === 0 ? 'text-amber-600 dark:text-amber-400 text-sm' : 'font-medium text-gray-900 dark:text-gray-100'}>
                {item.price === 0 ? 'A confirmar' : formatPrice(item.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Total de items:</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">{items.length}</span>
        </div>
        
        {hasCustom && (
          <div className="mt-2 rounded bg-amber-50 dark:bg-amber-900/30 p-2 text-sm text-amber-800 dark:text-amber-200">
            ⚠️ Este pedido incluye diseño(s) personalizado(s). 
            El precio será confirmado por el vendedor.
          </div>
        )}

        <div className="mt-4 flex justify-between text-lg">
          <span className="font-medium text-gray-800 dark:text-gray-200">Subtotal:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {subtotal > 0 ? formatPrice(subtotal) : 'A confirmar'}
          </span>
        </div>
      </div>
    </div>
  )
}