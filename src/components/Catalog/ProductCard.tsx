'use client'

import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  isSelected?: boolean
  onToggleSelect?: (product: Product) => void
  selectionMode?: boolean
}

export function ProductCard({
  product,
  onAddToCart,
  isSelected,
  onToggleSelect,
  selectionMode,
}: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    AROS: 'Aros',
    COLLARES: 'Collares',
    PULSERAS: 'Pulseras',
    DIJES: 'Dijes',
    SETS: 'Sets',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-card dark:bg-[#242B24] shadow-sm transition-all hover:shadow-md ${
        isSelected ? 'border-[#2C4A2E] dark:border-[#7CB97C] ring-2 ring-[#2C4A2E] dark:ring-[#7CB97C]' : 'border-[#2C4A2E]/20 dark:border-[#7CB97C]/20'
      }`}
    >
      {/* Selection indicator */}
      {selectionMode && (
        <button
          onClick={() => onToggleSelect?.(product)}
          className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            isSelected
              ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] border-[#2C4A2E] dark:border-[#7CB97C]'
              : 'border-[#2C4A2E]/30 dark:border-[#7CB97C]/30 bg-white dark:bg-[#242B24]'
          }`}
        >
          {isSelected && (
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>
      )}

      {/* Custom design badge */}
      {product.isCustomDesign && (
        <span className="absolute right-2 top-2 z-10 rounded-full bg-[#D4A853]/20 px-2 py-1 text-xs font-medium text-[#2C4A2E] dark:text-[#E8E6DE]">
          Personalizado
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#E5E0D6] dark:bg-[#2D352D]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-[#2C4A2E]/60 dark:text-[#A8B5A4]">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-[#2C4A2E] dark:text-[#E8E6DE]">
          {product.name}
        </h3>

        <p className="mb-3 text-sm text-[#2C4A2E]/80 dark:text-[#A8B5A4] line-clamp-2">
          {product.description || 'Sin descripción'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-custom dark:text-amber-light">
            {formatPrice(Number(product.price))}
          </span>

          {!selectionMode && (
            <button
              onClick={() => onAddToCart(product)}
              className="rounded-lg bg-[#2C4A2E] dark:bg-[#7CB97C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1E3D20] dark:hover:bg-[#9ACA9D]"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}