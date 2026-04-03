'use client'

import Image from 'next/image'
import type { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface CartItemProps {
  item: CartItem
}

export function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <div className="flex gap-4 border-b py-4">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
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
            sizes="80px"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            {item.type === 'custom' && (
              <span className="text-xs text-amber-600">Diseño personalizado</span>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {item.type === 'custom' && item.customDesign?.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {item.customDesign.description.split('\n')[0]}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className={`font-medium ${item.price === 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {item.price === 0 ? 'Precio a confirmar' : formatPrice(item.price)}
          </span>
          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
        </div>
      </div>
    </div>
  )
}